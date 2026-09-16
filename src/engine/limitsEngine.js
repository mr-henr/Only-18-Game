/**
 * MOTOR DE LIMITES
 * ==================================================================
 * Responsavel por: montar o estado inicial a partir do modo, aplicar as
 * cascatas de coerencia (`implies`), executar a DUPLA CONFIRMACAO
 * (`mirrorsInto`) e devolver o ESTADO EFETIVO de cada item.
 *
 * Modulo puro: nenhuma dependencia de DOM. O mesmo codigo roda no
 * cliente hoje e no servidor quando o multiplayer entrar.
 */

import { getMode, LIMIT_STATES, STATE_SEVERITY } from '../data/gameModes.js';
import {
  LIMITS_BY_ID,
  INHERIT_SOURCES,
  IMPLIED_BY,
  limitsForMode
} from '../data/limitsCatalog.js';

const { ALLOW, ASK, BLOCK, UNSET, UNAVAILABLE } = LIMIT_STATES;

/* ------------------------------------------------------------------ */
/* Construcao                                                          */
/* ------------------------------------------------------------------ */

/** Estado inicial de limites de um jogador, derivado do modo escolhido. */
export function createLimitState(modeId, { alcohol = false } = {}) {
  const mode = getMode(modeId);
  const entries = {};

  for (const item of limitsForMode(mode.tier, { alcohol })) {
    if (item.kind === 'scope') continue;
    const state = mode.overrides?.[item.id]
      ?? mode.policy?.[item.group]
      ?? (item.needsAlcohol ? ASK : UNSET);
    entries[item.id] = { state, source: 'mode-default', confirmed: true };
  }

  const limits = {
    modeId,
    tier: mode.tier,
    alcohol,
    entries,
    scope: LIMITS_BY_ID.dyn_scope.default,
    maxIntensity: mode.maxIntensity,
    wishlist: [],
    ready: false
  };

  applyMirrors(limits);
  return limits;
}

/** Copia defensiva (o motor nunca muta o estado de fora sem querer). */
export function cloneLimits(limits) {
  return {
    ...limits,
    entries: Object.fromEntries(
      Object.entries(limits.entries).map(([k, v]) => [k, { ...v }])
    ),
    wishlist: [...limits.wishlist]
  };
}

/* ------------------------------------------------------------------ */
/* Alteracao com cascatas de coerencia                                 */
/* ------------------------------------------------------------------ */

/**
 * Define um item e propaga a coerencia:
 *  - PERMITIR algo pesado libera automaticamente o que ele pressupoe;
 *  - BLOQUEAR algo leve derruba tudo que dependia dele.
 * Evita a combinacao contraditoria "permito beijo de lingua mas bloqueio
 * beijo na boca".
 */
export function setLimit(limits, itemId, value) {
  const entry = limits.entries[itemId];
  if (!entry) return limits;

  entry.state = value;
  entry.source = 'user';
  entry.confirmed = true;
  delete entry.inheritedFrom;

  if (value === ALLOW) cascadeAllow(limits, itemId, new Set());
  if (value === BLOCK) cascadeBlock(limits, itemId, new Set());

  applyMirrors(limits);
  return limits;
}

function cascadeAllow(limits, itemId, seen) {
  if (seen.has(itemId)) return;
  seen.add(itemId);
  for (const lighterId of LIMITS_BY_ID[itemId]?.implies ?? []) {
    const target = limits.entries[lighterId];
    if (!target) continue;
    if (target.state === BLOCK || target.state === UNSET) {
      target.state = ALLOW;
      target.source = 'cascade';
      target.confirmed = true;
    }
    cascadeAllow(limits, lighterId, seen);
  }
}

function cascadeBlock(limits, itemId, seen) {
  if (seen.has(itemId)) return;
  seen.add(itemId);
  for (const heavierId of IMPLIED_BY[itemId] ?? []) {
    const target = limits.entries[heavierId];
    if (!target) continue;
    if (target.state !== BLOCK) {
      target.state = BLOCK;
      target.source = 'cascade';
      target.confirmed = true;
    }
    cascadeBlock(limits, heavierId, seen);
  }
}

/* ------------------------------------------------------------------ */
/* Dupla confirmacao                                                   */
/* ------------------------------------------------------------------ */

/**
 * REGRA DA DUPLA CONFIRMACAO
 * Se o jogador permitiu, por exemplo, "Beijo nos genitais" na aba 💋,
 * o item "Fazer sexo oral" da aba 🔞 ja aparece PRE-MARCADO como
 * permitido, sinalizado como herdado. Enquanto ele nao passar pela aba
 * adulta confirmando, o motor trata esse item como ⚠️ PERGUNTAR — ou
 * seja, o jogo pede confirmacao antes de usar, em vez de executar direto.
 */
export function applyMirrors(limits) {
  for (const [targetId, sourceIds] of Object.entries(INHERIT_SOURCES)) {
    const target = limits.entries[targetId];
    if (!target) continue;                 // item acima do teto do modo
    if (target.source === 'user') continue; // escolha explicita vence

    const active = sourceIds.filter((sid) => limits.entries[sid]?.state === ALLOW);

    if (active.length) {
      target.state = ALLOW;
      target.source = 'inherited';
      target.confirmed = false;
      target.inheritedFrom = active;
    } else if (target.source === 'inherited') {
      const mode = getMode(limits.modeId);
      const item = LIMITS_BY_ID[targetId];
      target.state = mode.overrides?.[targetId] ?? mode.policy?.[item.group] ?? UNSET;
      target.source = 'mode-default';
      target.confirmed = true;
      delete target.inheritedFrom;
    }
  }
  return limits;
}

/** Marca como confirmados os itens herdados de um grupo/aba. */
export function confirmGroup(limits, groupId) {
  for (const [id, entry] of Object.entries(limits.entries)) {
    if (LIMITS_BY_ID[id]?.group === groupId && entry.source === 'inherited') {
      entry.confirmed = true;
    }
  }
  return limits;
}

/** Grupos que ainda tem itens herdados aguardando confirmacao. */
export function pendingConfirmations(limits) {
  const groups = new Set();
  for (const [id, entry] of Object.entries(limits.entries)) {
    if (entry.source === 'inherited' && !entry.confirmed) {
      groups.add(LIMITS_BY_ID[id].group);
    }
  }
  return [...groups];
}

/* ------------------------------------------------------------------ */
/* Leitura                                                             */
/* ------------------------------------------------------------------ */

/** Estado efetivo de UM item para UM jogador. */
export function effectiveState(limits, itemId) {
  const entry = limits?.entries?.[itemId];
  if (!entry) return UNAVAILABLE;
  if (entry.state === UNSET) return BLOCK;          // nao configurado = nao entra
  if (entry.state === ALLOW && entry.source === 'inherited' && !entry.confirmed) {
    return ASK;                                     // dupla confirmacao pendente
  }
  return entry.state;
}

/**
 * Estado efetivo de um REQUISITO: o item pedido + as partes do corpo que
 * ele envolve. Permitir a acao nao basta se a parte estiver bloqueada.
 */
export function requirementState(limits, itemId) {
  let worst = effectiveState(limits, itemId);
  for (const part of LIMITS_BY_ID[itemId]?.bodyParts ?? []) {
    worst = worseOf(worst, effectiveState(limits, `body_${part}`));
  }
  return worst;
}

/** Combina dois estados devolvendo o mais restritivo. */
export function worseOf(a, b) {
  return STATE_SEVERITY[a] >= STATE_SEVERITY[b] ? a : b;
}

/**
 * Estado efetivo de um requisito considerando TODOS os envolvidos.
 * Basta um bloquear para a carta nao existir para aquele grupo.
 */
export function groupRequirementState(limitsList, itemId) {
  let worst = ALLOW;
  for (const limits of limitsList) {
    worst = worseOf(worst, requirementState(limits, itemId));
    if (STATE_SEVERITY[worst] >= STATE_SEVERITY[BLOCK]) return worst;
  }
  return worst;
}

/** Quem precisa confirmar (estado ASK) para um requisito. */
export function askersFor(players, itemId) {
  return players
    .filter((p) => requirementState(p.limits, itemId) === ASK)
    .map((p) => p.id);
}

/* ------------------------------------------------------------------ */
/* Resumo para UI e para a tela de conferencia                         */
/* ------------------------------------------------------------------ */

export function summarize(limits) {
  const counts = { allow: 0, ask: 0, block: 0, unset: 0 };
  for (const id of Object.keys(limits.entries)) {
    const state = effectiveState(limits, id);
    if (state === ALLOW) counts.allow++;
    else if (state === ASK) counts.ask++;
    else counts.block++;
    if (limits.entries[id].state === UNSET) counts.unset++;
  }
  return counts;
}

export function groupSummary(limits, groupId) {
  const counts = { allow: 0, ask: 0, block: 0, total: 0, inherited: 0 };
  for (const [id, entry] of Object.entries(limits.entries)) {
    if (LIMITS_BY_ID[id]?.group !== groupId) continue;
    counts.total++;
    if (entry.source === 'inherited') counts.inherited++;
    const state = effectiveState(limits, id);
    if (state === ALLOW) counts.allow++;
    else if (state === ASK) counts.ask++;
    else counts.block++;
  }
  return counts;
}

/** Aplica um preset rapido a um grupo inteiro. */
export function setGroup(limits, groupId, value) {
  for (const id of Object.keys(limits.entries)) {
    if (LIMITS_BY_ID[id]?.group === groupId) setLimit(limits, id, value);
  }
  return limits;
}

export function toggleWishlist(limits, itemId) {
  const i = limits.wishlist.indexOf(itemId);
  if (i >= 0) limits.wishlist.splice(i, 1);
  else limits.wishlist.push(itemId);
  return limits;
}
