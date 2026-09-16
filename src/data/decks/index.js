import { QUESTIONS } from './questions.js';
import { DARES } from './dares.js';
import { CONTACT } from './contact.js';
import { CLOTHING } from './clothing.js';
import { ADULT } from './adult.js';
import { POWER } from './power.js';
import { DRINKS } from './drinks.js';

/** Baralho completo. O teto do modo e aplicado em `deckForMode`. */
export const ALL_CARDS = [
  ...QUESTIONS,
  ...DARES,
  ...CONTACT,
  ...CLOTHING,
  ...ADULT,
  ...POWER,
  ...DRINKS
];

export const CARDS_BY_ID = Object.fromEntries(ALL_CARDS.map((c) => [c.id, c]));

/**
 * TETO DO MODO — primeira e mais dura barreira do pipeline.
 * Cartas acima do tier do modo nem chegam ao filtro de limites.
 * A bebida funciona como uma segunda chave: com ela desligada, nenhuma
 * carta alcoolica e sequer carregada.
 */
export function deckForMode(tier, { alcohol = false } = {}) {
  return ALL_CARDS.filter((c) => c.minMode <= tier && (!c.alcohol || alcohol));
}

export function deckStats() {
  const byDeck = {};
  for (const c of ALL_CARDS) byDeck[c.deck] = (byDeck[c.deck] ?? 0) + 1;
  return {
    total: ALL_CARDS.length,
    alcohol: ALL_CARDS.filter((c) => c.alcohol).length,
    byDeck
  };
}
