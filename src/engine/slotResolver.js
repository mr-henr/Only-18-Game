/**
 * SLOT RESOLVER
 * ==================================================================
 * Resolve as lacunas de uma carta parametrica testando VALOR A VALOR
 * contra os limites de quem esta envolvido.
 *
 * Consequencia pratica: a carta "beije {target} {bodyPart.em}" nao e
 * descartada porque alguem bloqueou os pes — ela simplesmente sai com
 * outra parte do corpo. So morre se NENHUM valor sobreviver.
 */

import { pool } from '../data/pools.js';
import { LIMIT_STATES } from '../data/gameModes.js';
import { requirementState, worseOf } from './limitsEngine.js';

const { ALLOW, ASK, BLOCK } = LIMIT_STATES;

/** Resolve `limitKey` do slot para o id de limite do candidato. */
function limitIdFor(slot, candidate) {
  if (!slot.limitKey) return null;
  if (slot.limitKey === '{limit}') return candidate.limit ?? null;
  return slot.limitKey.replace('{id}', candidate.id);
}

/** Participantes que precisam autorizar um determinado slot. */
function audienceFor(slot, participants) {
  const scope = slot.appliesTo ?? 'both';
  if (scope === 'actor') return participants.filter((p) => p.role === 'actor');
  if (scope === 'target') return participants.filter((p) => p.role !== 'actor');
  return participants;
}

/** Filtra o pool por intensidade da partida e pelos criterios do slot. */
function candidatesFor(slot, intensity) {
  const all = pool(slot.pool);
  const f = slot.filter ?? {};
  const exclude = new Set(slot.exclude ?? []);

  return all.filter((c) => {
    if (exclude.has(c.id)) return false;
    if ((c.tier ?? 1) > intensity) return false;          // ainda nao liberado
    if (f.minTier != null && (c.tier ?? 1) < f.minTier) return false;
    if (f.maxTier != null && (c.tier ?? 1) > f.maxTier) return false;
    for (const [key, value] of Object.entries(f)) {
      if (key === 'minTier' || key === 'maxTier') continue;
      if (c[key] !== value) return false;
    }
    return true;
  });
}

/** Avalia um candidato: devolve o pior estado e quem precisa confirmar. */
function evaluateCandidate(slot, candidate, participants) {
  const audience = audienceFor(slot, participants);
  const limitIds = [];

  const direct = limitIdFor(slot, candidate);
  if (direct) limitIds.push(direct);
  if (candidate.bodyLimit) limitIds.push(candidate.bodyLimit);

  let worst = ALLOW;
  const askers = new Set();

  for (const limitId of limitIds) {
    for (const p of audience) {
      const state = requirementState(p.limits, limitId);
      worst = worseOf(worst, state);
      if (state === ASK) askers.add(p.id);
      if (worst === BLOCK || worst === LIMIT_STATES.UNAVAILABLE) {
        return { ok: false, worst, askers, limitIds };
      }
    }
  }

  return { ok: true, worst, askers, limitIds };
}

/**
 * Resolve todas as lacunas de uma carta.
 * @returns {{ok:boolean, values:object, worst:string, askers:string[], usedLimits:string[]}}
 */
export function resolveSlots(card, participants, intensity, rng = Math.random) {
  const values = {};
  const askers = new Set();
  const usedLimits = [];
  let worst = ALLOW;

  for (const [name, slot] of Object.entries(card.slots ?? {})) {
    const candidates = candidatesFor(slot, intensity);
    const allowed = [];
    const askable = [];

    for (const candidate of candidates) {
      const verdict = evaluateCandidate(slot, candidate, participants);
      if (!verdict.ok) continue;
      (verdict.worst === ASK ? askable : allowed).push({ candidate, verdict });
    }

    // Preferimos sempre o que ja esta liberado; "perguntar antes" e reserva.
    const viable = allowed.length ? allowed : askable;
    if (!viable.length) {
      return { ok: false, values: null, worst: BLOCK, askers: [], usedLimits: [], failedSlot: name };
    }

    const chosen = viable[Math.floor(rng() * viable.length)];
    values[name] = chosen.candidate;
    worst = worseOf(worst, chosen.verdict.worst);
    chosen.verdict.askers.forEach((id) => askers.add(id));
    usedLimits.push(...chosen.verdict.limitIds);
  }

  return { ok: true, values, worst, askers: [...askers], usedLimits };
}

/** Quantas variacoes distintas uma carta consegue gerar para este grupo. */
export function countVariations(card, participants, intensity) {
  let total = 1;
  for (const slot of Object.values(card.slots ?? {})) {
    const viable = candidatesFor(slot, intensity)
      .filter((c) => evaluateCandidate(slot, c, participants).ok).length;
    if (!viable) return 0;
    total *= viable;
  }
  return total;
}

/* ------------------------------------------------------------------ */
/* Montagem do texto final                                             */
/* ------------------------------------------------------------------ */

/**
 * Substitui {actor}, {target} e {slot} / {slot.campo} pelo texto final.
 */
export function renderText(card, values, participants) {
  const actor = participants.find((p) => p.role === 'actor');
  const targets = participants.filter((p) => p.role === 'target');

  const names = {
    actor: actor?.name ?? 'Você',
    target: targets.map((t) => t.name).join(' e ') || 'o grupo'
  };

  return card.text.replace(/\{(\w+)(?:\.(\w+))?\}/g, (match, key, field) => {
    if (key in names && !field) return names[key];
    const value = values?.[key];
    if (value == null) return match;
    if (field) return value[field] ?? match;
    return value.label ?? match;
  });
}
