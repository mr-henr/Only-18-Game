/**
 * GAME ENGINE
 * ==================================================================
 * Estado da partida, turnos, consentimento e pontuacao.
 * Modulo PURO: nao toca no DOM, nao le localStorage, nao sabe que
 * existe uma tela. Quando o multiplayer entrar, este arquivo sobe
 * para o servidor sem alteracao — a UI e que passa a falar por
 * WebSocket em vez de chamar os metodos direto.
 */

import { getMode } from '../data/gameModes.js';
import { createLimitState, pendingConfirmations, effectiveState } from './limitsEngine.js';
import { selectCard, partnerNotices, contentCoverage } from './contentFilter.js';
import { rollDice, diceToFilter } from './diceEngine.js';
import { PENALTIES, penalty, CUSTOM_PENALTY_ID } from '../data/penalties.js';

export const PHASES = {
  SETUP: 'setup',
  LIMITS: 'limits',
  READY: 'ready',
  ROLLING: 'rolling',
  CONSENT: 'consent',
  CARD: 'card',
  PENALTY: 'penalty',
  ENDED: 'ended'
};

let seq = 0;
const nextId = () => `p${++seq}`;

/* ------------------------------------------------------------------ */
/* Construcao                                                          */
/* ------------------------------------------------------------------ */

export function createGame({ modeId, screenMode = 'single', alcohol = false, roomCode = null }) {
  const mode = getMode(modeId);
  return {
    modeId,
    tier: mode.tier,
    screenMode,                               // 'single' | 'tv'
    alcohol,                                  // libera o baralho 🍻
    roomCode: roomCode ?? generateCode(),
    players: [],
    currentIndex: 0,
    intensity: mode.startIntensity ?? 1,
    maxIntensity: mode.maxIntensity,
    phase: PHASES.SETUP,
    roll: null,
    play: null,
    /** Prendas combinadas pelo grupo. Vazio = pular não custa nada. */
    penalties: [],
    customPenalty: '',
    pendingPenalty: null,
    history: [],
    turn: 0,
    round: 1,
    log: []
  };
}

export function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function addPlayer(game, name) {
  const mode = getMode(game.modeId);
  if (game.players.length >= mode.maxPlayers) return null;
  const player = {
    id: nextId(),
    name: name.trim().toUpperCase() || `JOGADOR ${game.players.length + 1}`,
    partnerId: null,
    limits: createLimitState(game.modeId, { alcohol: game.alcohol }),
    score: { love: 0, fire: 0, xp: 0 },
    done: 0,
    skipped: 0,
    paid: 0
  };
  game.players.push(player);
  return player;
}

export function removePlayer(game, playerId) {
  const player = playerById(game, playerId);
  if (player?.partnerId) unlinkPartners(game, playerId);
  game.players = game.players.filter((p) => p.id !== playerId);
  return game;
}

export function playerById(game, id) {
  return game.players.find((p) => p.id === id) ?? null;
}

/** Vinculo de parceria: sempre mutuo, nunca unilateral. */
export function linkPartners(game, aId, bId) {
  unlinkPartners(game, aId);
  unlinkPartners(game, bId);
  const a = playerById(game, aId);
  const b = playerById(game, bId);
  if (!a || !b || a === b) return game;
  a.partnerId = b.id;
  b.partnerId = a.id;
  return game;
}

export function unlinkPartners(game, playerId) {
  const p = playerById(game, playerId);
  if (!p) return game;
  const partner = p.partnerId ? playerById(game, p.partnerId) : null;
  if (partner) partner.partnerId = null;
  p.partnerId = null;
  return game;
}

/** Em partida de casal o vinculo e automatico. */
export function autoPairCouple(game) {
  if (game.players.length === 2) {
    linkPartners(game, game.players[0].id, game.players[1].id);
  }
  return game;
}

/* ------------------------------------------------------------------ */
/* Preparacao                                                          */
/* ------------------------------------------------------------------ */

/**
 * Prendas que fazem sentido oferecer a ESTE grupo.
 * Nao adianta sugerir "tire uma peca" para quem bloqueou roupa, nem
 * "vire uma dose" numa partida sem bebida. O que um jogador bloqueou
 * tira a prenda da lista inteira — ela vale para todos.
 */
export function availablePenalties(game) {
  return PENALTIES.filter((p) => {
    if (p.minMode > game.tier) return false;
    if (p.needsAlcohol && !game.alcohol) return false;
    return (p.requires ?? []).every((limitId) =>
      game.players.every((pl) => effectiveState(pl.limits, limitId) !== 'block'));
  });
}

export function togglePenalty(game, id) {
  const i = game.penalties.indexOf(id);
  if (i >= 0) game.penalties.splice(i, 1);
  else game.penalties.push(id);
  return game;
}

/** Avisos da regra do parceiro, prontos para a UI exibir. */
export function noticesFor(game, playerId) {
  return partnerNotices(game.players).filter((n) => n.forPlayerId === playerId);
}

/** Tudo que ainda falta antes de a partida poder comecar. */
export function readinessReport(game) {
  const mode = getMode(game.modeId);
  const issues = [];

  if (game.players.length < mode.minPlayers) {
    issues.push(`São necessários pelo menos ${mode.minPlayers} jogadores.`);
  }
  for (const p of game.players) {
    if (!p.limits.ready) issues.push(`${p.name} ainda não confirmou os limites.`);
    const pending = pendingConfirmations(p.limits);
    if (pending.length) issues.push(`${p.name} tem itens herdados aguardando confirmação.`);
  }

  const coverage = game.players.length
    ? contentCoverage({
        tier: game.tier,
        alcohol: game.alcohol,
        intensity: game.intensity,
        players: game.players,
        currentId: game.players[0].id
      })
    : null;

  const total = coverage ? coverage.byIntensity[game.maxIntensity]?.total ?? 0 : 0;
  if (coverage && total < 8) {
    issues.push('Os limites atuais deixam pouquíssimo conteúdo disponível. Reveja alguma aba.');
  }

  return { ok: issues.length === 0, issues, coverage };
}

export function startGame(game) {
  autoPairCouple(game);
  game.phase = PHASES.READY;
  game.currentIndex = Math.floor(Math.random() * game.players.length);
  game.turn = 0;
  game.history = [];
  game.log = [];
  return game;
}

/* ------------------------------------------------------------------ */
/* Turno                                                               */
/* ------------------------------------------------------------------ */

export function currentPlayer(game) {
  return game.players[game.currentIndex] ?? null;
}

/** Rola os dados e ja sorteia a carta compativel. */
export function roll(game, rng = Math.random) {
  const current = currentPlayer(game);
  game.roll = rollDice(rng);

  const filter = diceToFilter(game.roll, {
    players: game.players,
    current,
    intensity: game.intensity,
    maxIntensity: Math.min(game.maxIntensity, current.limits.maxIntensity),
    rng
  });

  game.play = selectCard({
    tier: game.tier,
    alcohol: game.alcohol,
    intensity: filter.intensity,
    onlyType: filter.onlyType,
    onlyTargeting: filter.onlyTargeting,
    forceTargetId: filter.forceTargetId,
    players: game.players,
    currentId: current.id,
    history: game.history,
    rng
  });

  game.effectiveIntensity = filter.intensity;
  game.phase = game.play?.consent ? PHASES.CONSENT : PHASES.CARD;
  return game.play;
}

/**
 * Consentimento: quem marcou "⚠️ perguntar antes" responde em privado.
 * Uma recusa descarta a carta sem penalidade e SEM revelar quem recusou.
 */
export function answerConsent(game, playerId, accepted) {
  if (!game.play?.consent) return game;
  const consent = game.play.consent;
  consent.answers ??= {};
  consent.answers[playerId] = accepted;

  if (!accepted) {
    game.play = null;
    game.phase = PHASES.ROLLING;
    game.log.push({ turn: game.turn, type: 'consent-declined' });
    return game;
  }

  const allAnswered = consent.pendingFrom.every((id) => consent.answers[id] === true);
  if (allAnswered) game.phase = PHASES.CARD;
  return game;
}

/** Recusou: sorteia outra carta no mesmo turno, sem punicao. */
export function rerollAfterDecline(game, rng = Math.random) {
  return roll(game, rng);
}

export function complete(game) {
  const play = game.play;
  if (!play) return game;
  const points = play.points;

  for (const p of play.participants) {
    const player = playerById(game, p.id);
    if (!player) continue;
    player.score.love += points.love ?? 0;
    player.score.fire += p.role === 'actor' ? (points.fire ?? 0) : Math.ceil((points.fire ?? 0) / 2);
    player.score.xp += 3;
    if (p.role === 'actor') player.done++;
  }

  registerHistory(game, play, 'done');
  return nextTurn(game);
}

/**
 * PULAR continua sendo livre: sem justificativa e sem custo obrigatorio.
 * Se o grupo combinou prendas na preparacao, o jogo apenas LEMBRA do
 * combinado — e ainda assim o jogador pode recusar e seguir.
 */
export function skip(game) {
  const play = game.play;
  if (play) {
    const actor = playerById(game, play.participants.find((p) => p.role === 'actor')?.id);
    if (actor) actor.skipped++;
    registerHistory(game, play, 'skipped');
  }

  if (game.penalties.length || game.customPenalty) {
    game.pendingPenalty = drawPenalty(game);
    game.phase = PHASES.PENALTY;
    return game;
  }

  return nextTurn(game);
}

/** Sorteia uma das prendas combinadas. */
export function drawPenalty(game, rng = Math.random) {
  const pool = [...game.penalties];
  if (game.customPenalty) pool.push(CUSTOM_PENALTY_ID);
  if (!pool.length) return null;

  const id = pool[Math.floor(rng() * pool.length)];
  if (id === CUSTOM_PENALTY_ID) {
    return { id, icon: '✏️', label: game.customPenalty, detail: 'Combinado de vocês.' };
  }
  return penalty(id);
}

/** O jogador pagou a prenda — ou recusou também ela, o que é direito dele. */
export function resolvePenalty(game, paid) {
  const actor = currentPlayer(game);
  if (paid && actor) {
    actor.paid++;
    actor.score.fire += 1;
  }
  game.log.push({ turn: game.turn, type: paid ? 'penalty-paid' : 'penalty-declined' });
  game.pendingPenalty = null;
  return nextTurn(game);
}

function registerHistory(game, play, outcome) {
  game.history.push({
    turn: game.turn,
    cardId: play.card.id,
    deck: play.card.deck,
    text: play.text,
    outcome,
    actorId: play.participants.find((p) => p.role === 'actor')?.id,
    targetIds: play.participants.filter((p) => p.role === 'target').map((p) => p.id)
  });
}

export function nextTurn(game) {
  game.turn++;
  game.play = null;
  game.roll = null;
  game.currentIndex = (game.currentIndex + 1) % game.players.length;
  if (game.currentIndex === 0) game.round++;
  game.phase = PHASES.ROLLING;
  return game;
}

/* ------------------------------------------------------------------ */
/* Intensidade                                                         */
/* ------------------------------------------------------------------ */

/** A intensidade nunca sobe sozinha: o grupo decide. */
export function raiseIntensity(game) {
  const ceiling = Math.min(
    game.maxIntensity,
    ...game.players.map((p) => p.limits.maxIntensity ?? 5)
  );
  game.intensity = Math.min(game.intensity + 1, ceiling);
  game.log.push({ turn: game.turn, type: 'intensity-up', to: game.intensity });
  return game;
}

export function lowerIntensity(game) {
  game.intensity = Math.max(1, game.intensity - 1);
  game.log.push({ turn: game.turn, type: 'intensity-down', to: game.intensity });
  return game;
}

export function intensityCeiling(game) {
  if (!game.players.length) return game.maxIntensity;
  return Math.min(game.maxIntensity, ...game.players.map((p) => p.limits.maxIntensity ?? 5));
}

export function endGame(game) {
  game.phase = PHASES.ENDED;
  return game;
}

/* ------------------------------------------------------------------ */
/* Resumo final                                                        */
/* ------------------------------------------------------------------ */

export function summary(game) {
  const done = game.history.filter((h) => h.outcome === 'done').length;
  const skipped = game.history.filter((h) => h.outcome === 'skipped').length;
  return {
    done,
    skipped,
    rounds: game.round,
    peak: game.intensity,
    players: [...game.players].sort((a, b) => b.score.xp - a.score.xp),
    decks: game.history.reduce((acc, h) => {
      acc[h.deck] = (acc[h.deck] ?? 0) + 1;
      return acc;
    }, {})
  };
}
