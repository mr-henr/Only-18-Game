/**
 * VISÕES POR PAPEL
 * ==================================================================
 * Cada cliente recebe APENAS o que pode ver. Esta é a regra central do
 * modo TV + celulares e ela mora no servidor, não na interface:
 *
 *  - carta privada: o texto vai só para o celular de quem é da vez;
 *    a TV mostra "🔒 ANA recebeu uma carta privada" e mais nada;
 *  - confirmação privada: o texto vai só para quem precisa responder.
 *    A TV nem diz de quem está esperando — dizer o nome já entregaria
 *    que aquela pessoa marcou "⚠️ perguntar antes" naquele assunto;
 *  - limites: cada celular só recebe os próprios.
 *
 * Esconder na interface não bastaria: bastaria abrir o inspetor na TV.
 * O que não pode ser visto não é enviado.
 */

import { getMode } from '../src/data/gameModes.js';
import { LIMITS_BY_ID } from '../src/data/limitsCatalog.js';
import {
  PHASES, currentPlayer, intensityCeiling, availablePenalties,
  readinessReport, noticesFor, summary, progressionPlan
} from '../src/engine/gameEngine.js';
import { summarize, pendingConfirmations } from '../src/engine/limitsEngine.js';
import { renderNeutral } from '../src/engine/slotResolver.js';
import { durationSecondsOf } from './helpers.js';
import { STAGES, isConnected } from './rooms.js';

/* ------------------------------------------------------------------ */

function actorIdOf(play) {
  return play?.participants?.find((p) => p.role === 'actor')?.id ?? null;
}

function askingPlayerId(game) {
  const consent = game?.play?.consent;
  if (!consent) return null;
  const answers = consent.answers ?? {};
  return consent.pendingFrom.find((id) => answers[id] == null) ?? null;
}

function publicCard(game) {
  const play = game.play;
  return {
    kind: 'public',
    type: play.card.type,
    deck: play.card.deck,
    text: play.text,
    participants: play.participants.map((p) => ({ id: p.id, name: p.name, role: p.role })),
    seconds: durationSecondsOf(play),
    intensity: game.effectiveIntensity ?? game.intensity
  };
}

/**
 * O que ESTE cliente pode ler da carta em jogo.
 * Devolve `null` quando não há carta.
 */
function cardFor(room, client) {
  const game = room.game;
  const play = game?.play;
  if (!play) return null;

  const me = client.playerId;
  const actorId = actorIdOf(play);

  // --- confirmação privada -----------------------------------------
  if (game.phase === PHASES.CONSENT && play.consent) {
    const asking = askingPlayerId(game);
    if (me && me === asking) {
      return {
        kind: 'consent',
        // Sem nomes ate aceitar: quem responde julga o desafio, nao o alvo.
        text: renderNeutral(play.card, play.values, play.participants, me,
          game.players),
        limits: [...new Set(play.usedLimits)]
          .filter((id) => LIMITS_BY_ID[id])
          .map((id) => LIMITS_BY_ID[id].label)
      };
    }
    // Ninguém mais sabe de quem o jogo está esperando.
    return { kind: 'consent-waiting' };
  }

  // --- carta privada -------------------------------------------------
  if (play.visibility === 'private') {
    if (me && me === actorId) return { ...publicCard(game), kind: 'private' };
    const holder = play.participants.find((p) => p.id === actorId)?.name ?? '';
    return { kind: 'private-hidden', holder };
  }

  return publicCard(game);
}

/* ------------------------------------------------------------------ */
/* O que cada celular deve estar fazendo agora                         */
/* ------------------------------------------------------------------ */

function promptForPlayer(room, client) {
  const game = room.game;
  if (!client.playerId) return 'name';
  if (room.stage === STAGES.ENDED) return 'ended';

  if (room.stage === STAGES.LOBBY) {
    const me = game.players.find((p) => p.id === client.playerId);
    return me?.limits?.ready ? 'wait-start' : 'limits';
  }

  if (room.stage !== STAGES.PLAYING) return 'wait';

  const current = currentPlayer(game);
  const isMine = current?.id === client.playerId;

  if (game.phase === PHASES.PENALTY) return isMine ? 'penalty' : 'wait';
  if (game.phase === PHASES.CONSENT) {
    return askingPlayerId(game) === client.playerId ? 'consent' : 'wait';
  }
  if (game.play) return isMine ? 'card' : 'wait';
  return isMine ? 'roll' : 'wait';
}

function promptForTable(room) {
  if (room.stage === STAGES.SETUP) return 'setup';
  if (room.stage === STAGES.LOBBY) return 'lobby';
  if (room.stage === STAGES.ENDED) return 'ended';
  return 'playing';
}

/* ------------------------------------------------------------------ */
/* Visão completa                                                      */
/* ------------------------------------------------------------------ */

export function viewFor(room, client) {
  const base = {
    code: room.code,
    stage: room.stage,
    role: client.role,
    connected: true
  };

  if (!room.game) {
    return { ...base, prompt: client.role === 'table' ? 'setup' : 'wait-setup' };
  }

  const game = room.game;
  const mode = getMode(game.modeId);
  const current = currentPlayer(game);

  const view = {
    ...base,
    alcohol: game.alcohol,
    mode: {
      id: mode.id, icon: mode.icon, name: mode.name, subtitle: mode.subtitle,
      tier: mode.tier, maxIntensity: mode.maxIntensity,
      fastFlow: mode.fastFlow, custom: mode.custom, wishlist: mode.wishlist,
      minPlayers: mode.minPlayers, maxPlayers: mode.maxPlayers
    },
    players: game.players.map((p) => ({
      id: p.id,
      name: p.name,
      partnerId: p.partnerId,
      score: p.score,
      done: p.done,
      skipped: p.skipped,
      ready: Boolean(p.limits?.ready),
      connected: isConnected(room, p.id),
      current: current?.id === p.id
    })),
    intensity: game.intensity,
    ceiling: intensityCeiling(game),
    round: game.round,
    turn: game.turn,
    phase: game.phase,
    roll: game.roll,
    effectiveIntensity: game.effectiveIntensity ?? game.intensity,
    penalties: { selected: game.penalties, custom: game.customPenalty },
    progress: progressionPlan(game),
    pendingPenalty: game.pendingPenalty,
    card: cardFor(room, client)
  };

  /* --- a mesa: tudo que é decisão do grupo -------------------------- */
  if (client.role === 'table') {
    view.prompt = promptForTable(room);

    if (room.stage === STAGES.LOBBY) {
      const report = readinessReport(game);
      view.table = {
        availablePenalties: availablePenalties(game).map((p) => ({
          id: p.id, icon: p.icon, label: p.label, detail: p.detail
        })),
        // Resumo dos limites: quantos cada um permitiu, NUNCA quais.
        limitSummary: game.players.map((p) => ({
          id: p.id, name: p.name, ...summarize(p.limits)
        })),
        issues: report.issues,
        ok: report.ok,
        coverage: report.coverage?.byIntensity ?? null
      };
    }

    if (room.stage === STAGES.ENDED) view.summary = summary(game);
    return view;
  }

  /* --- um celular: só o que é dele ---------------------------------- */
  const me = game.players.find((p) => p.id === client.playerId) ?? null;
  view.prompt = promptForPlayer(room, client);
  view.you = me
    ? {
        id: me.id,
        name: me.name,
        partnerId: me.partnerId,
        score: me.score,
        isCurrent: current?.id === me.id,
        limits: me.limits,                       // privados, só para este celular
        pendingGroups: pendingConfirmations(me.limits),
        notices: noticesFor(game, me.id)
      }
    : null;

  if (room.stage === STAGES.ENDED) view.summary = summary(game);
  return view;
}
