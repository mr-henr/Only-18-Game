/**
 * POOLS PARAMETRICOS
 * ==================================================================
 * Cada carta e um MOLDE com lacunas (slots). Os valores possiveis de
 * cada lacuna vivem aqui. O SlotResolver testa lacuna por lacuna contra
 * os limites dos envolvidos, entao uma mesma carta gera dezenas de
 * variacoes e so e descartada se NENHUMA combinacao sobreviver.
 *
 * `tier`  = intensidade minima da partida para o valor aparecer.
 * `limit` = item do catalogo exigido por aquele valor especifico.
 *           Valores sem `limit` sao puro tempero e nao restringem nada.
 */

import { BODY_PARTS } from './bodyParts.js';

export const POOLS = {
  /** Partes do corpo; o `limitKey` do slot completa o id (ex.: kiss_{id}). */
  bodyParts: BODY_PARTS.map((p) => ({
    id: p.id,
    label: p.label,
    def: p.def,
    em: p.em,
    tier: p.tier,
    intimate: p.intimate,
    kissable: p.kissable,
    touchable: p.touchable,
    bodyLimit: `body_${p.id}`
  })),

  durations: [
    { id: 'd10', label: '10 segundos', seconds: 10, tier: 1 },
    { id: 'd20', label: '20 segundos', seconds: 20, tier: 1 },
    { id: 'd30', label: '30 segundos', seconds: 30, tier: 2 },
    { id: 'd60', label: '1 minuto', seconds: 60, tier: 3 },
    { id: 'd120', label: '2 minutos', seconds: 120, tier: 4 },
    { id: 'd180', label: '3 minutos', seconds: 180, tier: 5 }
  ],

  counts: [
    { id: 'n3', label: 'três', n: 3, tier: 1 },
    { id: 'n5', label: 'cinco', n: 5, tier: 2 },
    { id: 'n10', label: 'dez', n: 10, tier: 3 }
  ],

  clothing: [
    { id: 'accessories', label: 'um acessório', tier: 1, limit: 'clothing_accessories' },
    { id: 'shoes', label: 'os sapatos', tier: 1, limit: 'clothing_shoes' },
    { id: 'socks', label: 'as meias', tier: 1, limit: 'clothing_socks' },
    { id: 'coat', label: 'o casaco', tier: 1, limit: 'clothing_coat' },
    { id: 'shirt', label: 'a camisa ou blusa', tier: 2, limit: 'clothing_shirt' },
    { id: 'pants', label: 'a calça, shorts ou saia', tier: 3, limit: 'clothing_pants' },
    { id: 'underwear', label: 'a roupa íntima', tier: 4, limit: 'clothing_underwear' }
  ],

  kissStyle: [
    { id: 'quick', label: 'um beijo rápido', tier: 1 },
    { id: 'slow', label: 'um beijo demorado', tier: 2 },
    { id: 'wet', label: 'um beijo molhado', tier: 3 },
    { id: 'bite', label: 'um beijo com mordida', tier: 4, limit: 'bdsm_pain_light' }
  ],

  touchStyle: [
    { id: 'light', label: 'de leve', tier: 1 },
    { id: 'slow', label: 'devagar', tier: 2 },
    { id: 'firm', label: 'com firmeza', tier: 3 },
    { id: 'teasing', label: 'provocando sem parar', tier: 4 }
  ],

  sexAct: [
    { id: 'manual', label: 'estimular com a mão', tier: 3, limit: 'sexual_manual' },
    { id: 'oral', label: 'fazer sexo oral', tier: 4, limit: 'sexual_oral_give' },
    { id: 'toy', label: 'usar um acessório sexual', tier: 4, limit: 'sexual_toys' },
    { id: 'vaginal', label: 'transar', tier: 5, limit: 'sexual_penetration_vaginal' },
    { id: 'anal', label: 'fazer sexo anal', tier: 5, limit: 'sexual_penetration_anal' }
  ],

  power: [
    { id: 'orders', label: 'obedecer três ordens', tier: 2, limit: 'bdsm_orders' },
    { id: 'blindfold', label: 'ficar de olhos vendados', tier: 3, limit: 'bdsm_blindfold' },
    { id: 'restraint', label: 'ficar com as mãos presas', tier: 4, limit: 'bdsm_restraint' },
    { id: 'spank', label: 'levar palmadas', tier: 4, limit: 'bdsm_spanking' }
  ],

  /* ---------------------------------------------------------------- */
  /* Pools novos                                                       */
  /* ---------------------------------------------------------------- */

  /**
   * Temas de pergunta. Cada tema carrega o limite da aba 💬, entao um
   * unico molde de pergunta se adapta ao que cada grupo liberou.
   */
  questionTopics: [
    { id: 'body_pride', label: 'a parte do seu corpo de que você mais gosta', tier: 1, limit: 'q_body_opinion' },
    { id: 'secret', label: 'um segredo que ninguém aqui sabe', tier: 2, limit: 'q_confession' },
    { id: 'jealous', label: 'a vez em que você sentiu mais ciúme', tier: 2, limit: 'q_jealousy' },
    { id: 'turn_on', label: 'o que mais te excita em alguém', tier: 2, limit: 'q_sexual_preferences' },
    { id: 'turn_off', label: 'o que mata seu clima na hora', tier: 2, limit: 'q_sexual_preferences' },
    { id: 'first_time', label: 'como foi sua primeira vez', tier: 2, limit: 'q_sexual_experiences' },
    { id: 'last_time', label: 'a última vez que você transou', tier: 3, limit: 'q_sexual_experiences' },
    { id: 'weird_place', label: 'o lugar mais estranho em que você já transou', tier: 3, limit: 'q_sexual_experiences' },
    { id: 'best_ever', label: 'a melhor transa da sua vida', tier: 3, limit: 'q_sexual_experiences' },
    { id: 'ex', label: 'o que você não superou de um ex', tier: 3, limit: 'q_past_relationships' },
    { id: 'fantasy', label: 'uma fantasia que você nunca realizou', tier: 3, limit: 'q_fantasies' },
    { id: 'crush_room', label: 'quem desta sala você beijaria se pudesse', tier: 3, limit: 'q_attraction' },
    { id: 'embarrassing', label: 'a situação mais constrangedora que já te aconteceu na cama', tier: 3, limit: 'q_embarrassing' },
    { id: 'alone', label: 'o que você faz quando está sozinho', tier: 3, limit: 'q_intimate_personal' },
    { id: 'forbidden', label: 'a fantasia que você tem vergonha de admitir', tier: 4, limit: 'q_fantasies' }
  ],

  /**
   * Restricoes que temperam um desafio. So `blindfold` carrega limite —
   * o resto e regra de brincadeira, nao conteudo.
   */
  modifier: [
    { id: 'nolaugh', label: 'sem rir', tier: 1 },
    { id: 'silent', label: 'sem falar nada', tier: 1 },
    { id: 'eyes', label: 'olhando nos olhos o tempo todo', tier: 2 },
    { id: 'slow', label: 'o mais devagar que conseguir', tier: 2 },
    { id: 'nohands', label: 'sem usar as mãos', tier: 3 },
    { id: 'blindfold', label: 'de olhos vendados', tier: 3, limit: 'bdsm_blindfold' }
  ],

  /** Posicoes — tempero de cartas adultas, sem limite proprio. */
  positions: [
    { id: 'face', label: 'de frente, um olhando para o outro', tier: 4 },
    { id: 'lap', label: 'com quem recebe sentado no colo', tier: 4 },
    { id: 'behind', label: 'por trás', tier: 4 },
    { id: 'top', label: 'com quem recebe por cima', tier: 4 },
    { id: 'standing', label: 'de pé', tier: 5 },
    { id: 'mirror', label: 'de frente para um espelho', tier: 5 }
  ],

  /**
   * Quantidade de bebida. So entra em cartas marcadas com `alcohol`,
   * que por sua vez so existem se o grupo ligou a bebida na criacao.
   */
  drinkAmount: [
    { id: 'sip', label: 'um gole', tier: 1, limit: 'drink_sip' },
    { id: 'sips3', label: 'três goles', tier: 2, limit: 'drink_sip' },
    { id: 'shot', label: 'uma dose inteira', tier: 3, limit: 'drink_shot' },
    { id: 'shot2', label: 'duas doses seguidas', tier: 4, limit: 'drink_shot' }
  ],

  /** Regras de bebida que valem por varias rodadas. */
  drinkRule: [
    { id: 'laugh', label: 'quem rir, bebe', tier: 1 },
    { id: 'name', label: 'quem falar o nome de alguém, bebe', tier: 1 },
    { id: 'no', label: 'quem disser "não", bebe', tier: 2 },
    { id: 'skip', label: 'quem pular uma carta, bebe', tier: 2 },
    { id: 'blush', label: 'quem ficar vermelho, bebe', tier: 3 },
    { id: 'touch', label: 'quem cruzar os braços, bebe', tier: 2 }
  ],

  /** Lugares do ambiente — puro tempero para desafios. */
  places: [
    { id: 'sofa', label: 'no sofá', tier: 1 },
    { id: 'floor', label: 'no chão', tier: 1 },
    { id: 'kitchen', label: 'na cozinha', tier: 1 },
    { id: 'chair', label: 'sentado numa cadeira', tier: 1 },
    { id: 'wall', label: 'encostado na parede', tier: 2 },
    { id: 'mirror', label: 'na frente de um espelho', tier: 3 }
  ]
};

export function pool(name) {
  const p = POOLS[name];
  if (!p) throw new Error(`Pool desconhecido: ${name}`);
  return p;
}
