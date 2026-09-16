/**
 * CONTENT FILTER
 * ==================================================================
 * O pipeline que decide qual carta pode aparecer:
 *
 *   baralho
 *    -> byMode          teto duro do modo (cartas acima nem sao carregadas)
 *    -> byIntensity     nivel atual da partida e maxIntensity de cada um
 *    -> byParticipants  numero de jogadores e papeis disponiveis
 *    -> byDynamics      regra do parceiro, trios, desafio coletivo
 *    -> resolveSlots    poda as combinacoes bloqueadas
 *    -> byLimits        estado efetivo = PIOR estado entre TODOS envolvidos
 *    -> weight          desejos, variedade, repeticao recente
 *    -> pick
 *
 * Regra inviolavel: basta UM envolvido bloquear para a carta nao existir
 * para aquele grupo. Se alguem marcou "perguntar antes", a carta entra
 * com pedido de confirmacao privado.
 */

import { deckForMode } from '../data/decks/index.js';
import { LIMIT_STATES, STATE_SEVERITY } from '../data/gameModes.js';
import { requirementState, worseOf } from './limitsEngine.js';
import { resolveSlots, renderText } from './slotResolver.js';

const { ALLOW, ASK, BLOCK } = LIMIT_STATES;

/* ------------------------------------------------------------------ */
/* Natureza do contato (usada na regra do parceiro)                    */
/* ------------------------------------------------------------------ */

const contactKindCache = new Map();

function contactKind(card) {
  if (contactKindCache.has(card.id)) return contactKindCache.get(card.id);

  const ids = [
    ...(card.requires ?? []),
    ...(card.requiresActor ?? []),
    ...(card.requiresTarget ?? []),
    ...Object.values(card.slots ?? {}).map((s) => s.limitKey ?? '')
  ];

  const kind = {
    kiss: ids.some((id) => id.startsWith('kiss_')),
    touch: ids.some((id) => /^(touch_|sexual_|bdsm_|clothing_)/.test(id)) ||
           (card.deck === 'adult' || card.deck === 'contact') && card.targeting !== 'self'
  };

  contactKindCache.set(card.id, kind);
  return kind;
}

/* ------------------------------------------------------------------ */
/* Regra do parceiro e formacao de duplas                              */
/* ------------------------------------------------------------------ */

/**
 * REGRA DO PARCEIRO
 * Quem marcou "somente com meu parceiro" so entra em cartas fisicas ao
 * lado do proprio parceiro. Nao existe escolha de alvo arbitrario: o
 * alvo e sempre o parceiro, um sorteio entre elegiveis, ou todos.
 */
export function canInteract(a, b) {
  if (a.id === b.id) return false;
  if (a.limits.scope === 'partner_only' && b.id !== a.partnerId) return false;
  if (b.limits.scope === 'partner_only' && a.id !== b.partnerId) return false;
  return true;
}

/** Aviso mutuo gerado quando alguem escolhe "somente com meu parceiro". */
export function partnerNotices(players) {
  return players
    .filter((p) => p.limits.scope === 'partner_only' && p.partnerId)
    .map((p) => ({
      forPlayerId: p.partnerId,
      fromPlayerId: p.id,
      fromName: p.name,
      message: `${p.name} definiu que ações físicas acontecem apenas com você.`
    }));
}

function buildParticipantSets(card, players, currentId, forceTargetId = null) {
  const current = players.find((p) => p.id === currentId);
  if (!current) return [];
  let others = players.filter((p) => p.id !== currentId);
  if (forceTargetId && card.targeting !== 'all' && card.targeting !== 'self') {
    others = others.filter((p) => p.id === forceTargetId);
  }

  switch (card.targeting) {
    case 'self':
      return forceTargetId ? [] : [[{ ...current, role: 'actor' }]];

    case 'other':
    case 'pair':
      return others
        .filter((o) => canInteract(current, o))
        .map((o) => [{ ...current, role: 'actor' }, { ...o, role: 'target' }]);

    case 'all': {
      const eligible = others.filter((o) => canInteract(current, o));
      if (eligible.length !== others.length) return [];   // alguem ficaria de fora
      return [[{ ...current, role: 'actor' }, ...eligible.map((o) => ({ ...o, role: 'target' }))]];
    }

    /**
     * Sorteio entre duas pessoas: a dupla nao precisa incluir quem esta
     * na vez. Todo par elegivel vira uma jogada candidata e o peso
     * decide qual sai — inclusive pares que ainda nao interagiram.
     */
    case 'random_pair': {
      const sets = [];
      for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
          if (!canInteract(players[i], players[j])) continue;
          sets.push([
            { ...players[i], role: 'actor' },
            { ...players[j], role: 'target' }
          ]);
        }
      }
      return sets;
    }

    default:
      return [];
  }
}

/* ------------------------------------------------------------------ */
/* Avaliacao de requisitos                                             */
/* ------------------------------------------------------------------ */

function addRequirement(acc, limitId, audience) {
  for (const p of audience) {
    const state = requirementState(p.limits, limitId);
    acc.worst = worseOf(acc.worst, state);
    if (state === ASK) acc.askers.add(p.id);
    if (STATE_SEVERITY[acc.worst] >= STATE_SEVERITY[BLOCK]) {
      acc.blockedBy = { limitId, playerId: p.id };
      return false;
    }
  }
  acc.used.push(limitId);
  return true;
}

function evaluateRequirements(card, participants, allPlayers = participants) {
  const acc = { worst: ALLOW, askers: new Set(), used: [], blockedBy: null };
  const actors = participants.filter((p) => p.role === 'actor');
  const targets = participants.filter((p) => p.role !== 'actor');

  const batches = [
    [card.requires ?? [], participants],
    [card.requiresActor ?? [], actors],
    [card.requiresTarget ?? [], targets]
  ];

  // Dinamica de grupo
  if (participants.length > 2) {
    batches.push([['dyn_more_than_two'], participants]);
    if (card.targeting === 'all') batches.push([['dyn_group'], participants]);
  }

  if (card.targeting === 'random_pair') {
    batches.push([['dyn_random_pair'], participants]);
  }

  /**
   * PLATEIA — quem nao participa mas assiste tambem precisa aceitar.
   * Quem marcou "não quero assistir dois jogadores" nao e obrigado a
   * ficar olhando, e quem nao quer ser assistido nao vira espetaculo.
   */
  if (card.watched || card.targeting === 'random_pair') {
    const spectators = allPlayers.filter((p) => !participants.some((x) => x.id === p.id));
    if (spectators.length) {
      batches.push([['dyn_watch'], spectators]);
      batches.push([['dyn_be_watched'], participants]);
    }
  }

  // Regra do parceiro: contato com quem nao e o parceiro exige liberacao
  const kind = contactKind(card);
  for (const p of participants) {
    const hasNonPartner = participants.some(
      (o) => o.id !== p.id && o.id !== p.partnerId
    );
    if (!hasNonPartner) continue;
    if (kind.kiss) batches.push([['kiss_non_partner'], [p]]);
    if (kind.touch) batches.push([['touch_non_partner'], [p]]);
  }

  for (const [limitIds, audience] of batches) {
    for (const limitId of limitIds) {
      if (!addRequirement(acc, limitId, audience)) return acc;
    }
  }
  return acc;
}

/* ------------------------------------------------------------------ */
/* Pontuacao de relevancia                                             */
/* ------------------------------------------------------------------ */

function weightFor(play, ctx) {
  let w = 10;

  // Desejos declarados (modo Livre) puxam a carta para cima.
  for (const p of play.participants) {
    const wishes = p.limits.wishlist ?? [];
    if (wishes.some((id) => play.usedLimits.includes(id))) w += 8;
  }

  // Variedade: evita repetir carta e baralho.
  const recent = ctx.history.slice(-8);
  if (recent.some((h) => h.cardId === play.card.id)) w -= 8;
  if (recent.slice(-2).some((h) => h.deck === play.card.deck)) w -= 3;

  // Alvos que ainda nao participaram sobem.
  const targetIds = play.participants.filter((p) => p.role === 'target').map((p) => p.id);
  const recentTargets = new Set(recent.flatMap((h) => h.targetIds ?? []));
  if (targetIds.length && targetIds.every((id) => !recentTargets.has(id))) w += 4;

  // Carta sem atrito e preferida a carta que exige confirmacao.
  if (play.worst === ASK) w -= 4;

  // Cartas alinhadas ao nivel atual valem mais que cartas defasadas.
  const gap = Math.abs(ctx.intensity - (play.card.intensity?.[1] ?? ctx.intensity));
  w -= gap * 1.5;

  return Math.max(1, w);
}

function weightedPick(plays, ctx) {
  const weights = plays.map((p) => weightFor(p, ctx));
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = ctx.rng() * total;
  for (let i = 0; i < plays.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return plays[i];
  }
  return plays[plays.length - 1];
}

/* ------------------------------------------------------------------ */
/* API principal                                                       */
/* ------------------------------------------------------------------ */

/**
 * Lista TODAS as jogadas viaveis para o contexto atual.
 * `relax` 0 = intensidade exata, 1 = aceita cartas mais leves,
 * 2 = ignora o teto superior da carta.
 */
export function viablePlays(ctx, relax = 0) {
  const { tier, intensity, players, currentId, alcohol = false, rng = Math.random } = ctx;
  const deck = deckForMode(tier, { alcohol });
  const plays = [];

  for (const card of deck) {
    const [minI, maxI] = card.intensity ?? [1, 5];

    // Numero de jogadores: votacao com duas pessoas nao e votacao, e
    // sorteio de dupla so faz sentido quando existe mais de uma dupla.
    if ((card.minPlayers ?? 2) > players.length) continue;
    if (card.maxPlayers && players.length > card.maxPlayers) continue;

    if (minI > intensity) continue;                       // ainda nao liberada
    if (relax === 0 && maxI < intensity) continue;        // defasada demais
    if (ctx.onlyType && card.type !== ctx.onlyType) continue;
    if (ctx.onlyTargeting && !ctx.onlyTargeting.includes(card.targeting)) continue;

    for (const participants of buildParticipantSets(card, players, currentId, ctx.forceTargetId)) {
      // Teto individual de intensidade de cada envolvido.
      if (participants.some((p) => (p.limits.maxIntensity ?? 5) < minI)) continue;

      const req = evaluateRequirements(card, participants, players);
      if (STATE_SEVERITY[req.worst] >= STATE_SEVERITY[BLOCK]) continue;

      const slots = resolveSlots(card, participants, intensity, rng);
      if (!slots.ok) continue;

      const worst = worseOf(req.worst, slots.worst);
      if (STATE_SEVERITY[worst] >= STATE_SEVERITY[BLOCK]) continue;

      const askers = new Set([...req.askers, ...slots.askers]);

      plays.push({
        card,
        participants,
        values: slots.values,
        worst,
        askers: [...askers],
        usedLimits: [...req.used, ...slots.usedLimits],
        text: renderText(card, slots.values, participants)
      });
    }
  }

  return plays;
}

/**
 * Sorteia a carta da vez.
 * @returns {object|null} jogada pronta ou null se nada for possivel.
 */
export function selectCard(ctx) {
  const base = { history: [], rng: Math.random, ...ctx };

  /**
   * Os dados sao uma SUGESTAO, nunca uma obrigacao. Se o resultado
   * exato nao tem carta viavel dentro dos limites, afrouxamos nesta
   * ordem — alvo, tipo, intensidade — em vez de travar o turno.
   */
  const attempts = [
    { ctx: base, relax: 0 },
    { ctx: { ...base, forceTargetId: null }, relax: 0 },
    { ctx: { ...base, forceTargetId: null, onlyTargeting: null }, relax: 0 },
    { ctx: { ...base, forceTargetId: null, onlyTargeting: null, onlyType: null }, relax: 0 },
    { ctx: { ...base, forceTargetId: null, onlyTargeting: null, onlyType: null }, relax: 1 }
  ];

  for (const attempt of attempts) {
    const plays = viablePlays(attempt.ctx, attempt.relax);
    if (!plays.length) continue;

    const chosen = weightedPick(plays, attempt.ctx);
    return {
      ...chosen,
      consent: chosen.askers.length
        ? { pendingFrom: chosen.askers, items: chosen.usedLimits }
        : null,
      visibility: chosen.card.visibility ?? 'public',
      points: chosen.card.points ?? { love: 1, fire: 1 }
    };
  }

  return null;
}

/**
 * Diagnostico: quanto conteudo esta disponivel para a configuracao atual.
 * Usado na tela de conferencia dos limites, antes de comecar a partida.
 */
export function contentCoverage(ctx) {
  const byIntensity = {};
  for (let i = 1; i <= 5; i++) {
    const plays = viablePlays({ ...ctx, intensity: i, rng: () => 0.5 }, 1);
    byIntensity[i] = {
      total: plays.length,
      free: plays.filter((p) => p.worst === ALLOW).length,
      ask: plays.filter((p) => p.worst === ASK).length
    };
  }
  const all = viablePlays({ ...ctx, rng: () => 0.5 }, 1);
  return {
    byIntensity,
    decks: all.reduce((acc, p) => {
      acc[p.card.deck] = (acc[p.card.deck] ?? 0) + 1;
      return acc;
    }, {})
  };
}
