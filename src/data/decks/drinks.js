/**
 * BARALHO: BEBIDA 🍻
 * ==================================================================
 * Todas as cartas aqui tem `alcohol: true` e so sao carregadas se o
 * grupo ligou "jogar com bebida" na criacao da partida. Mesmo com a
 * opcao ligada, cada jogador decide na aba 🍻 o que aceita — quem
 * dirige ou nao bebe bloqueia e nenhuma dessas cartas o alcanca.
 *
 * O slot `amount` carrega o limite da quantidade (`drink_sip` para um
 * gole, `drink_shot` para dose), entao quem so aceita gole nunca
 * recebe carta de virar dose.
 */

export const DRINKS = [
  /* ------------------------------------------------ regras e rodadas */
  {
    id: 'dk_rule',
    deck: 'drinks', type: 'challenge', minMode: 1, alcohol: true, intensity: [1, 4],
    targeting: 'all', visibility: 'public',
    requires: ['drink_rule'],
    slots: { rule: { pool: 'drinkRule' } },
    text: 'Nova regra até a próxima vez de {actor}: {rule.label}.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'dk_toast',
    deck: 'drinks', type: 'challenge', minMode: 1, alcohol: true, intensity: [1, 3],
    targeting: 'all', visibility: 'public',
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}' } },
    text: '{actor} faz um brinde constrangedor em voz alta. Todos bebem {amount.label}.',
    points: { love: 3, fire: 2 }
  },
  {
    id: 'dk_last_one',
    deck: 'drinks', type: 'challenge', minMode: 1, alcohol: true, intensity: [1, 4],
    targeting: 'all', visibility: 'public',
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}' } },
    text: 'Todos bebem {amount.label} ao mesmo tempo. O último a terminar cumpre o próximo desafio em dobro.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'dk_waterfall',
    deck: 'drinks', type: 'challenge', minMode: 1, minPlayers: 3, alcohol: true, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['drink_sip'],
    text: 'Cascata: {actor} começa a beber e cada um só pode parar quando o anterior parar.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'dk_categories',
    deck: 'drinks', type: 'challenge', minMode: 1, minPlayers: 3, alcohol: true, intensity: [1, 4],
    targeting: 'all', visibility: 'public',
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}' } },
    text: '{actor} escolhe uma categoria picante. Cada um diz um item — quem travar bebe {amount.label}.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'dk_never_drink',
    deck: 'drinks', type: 'choice', minMode: 1, minPlayers: 3, alcohol: true, intensity: [1, 5],
    targeting: 'all', visibility: 'public',
    requires: ['q_sexual_experiences'],
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}' } },
    text: '{actor} diz um "eu nunca" de teor sexual. Quem já fez, bebe {amount.label}.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'dk_two_truths_drink',
    deck: 'drinks', type: 'choice', minMode: 1, minPlayers: 3, alcohol: true, intensity: [1, 4],
    targeting: 'all', visibility: 'public',
    requires: ['q_intimate_personal'],
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}' } },
    text: '{actor} conta duas verdades e uma mentira sobre a própria vida sexual. Quem errar bebe {amount.label}.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'dk_point_drink',
    deck: 'drinks', type: 'choice', minMode: 1, minPlayers: 3, alcohol: true, intensity: [1, 4],
    targeting: 'all', visibility: 'public',
    requires: ['q_about_present'],
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}' } },
    text: 'Todos apontam para quem parece mais safado da sala. O mais votado bebe {amount.label}.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'dk_ranking_drink',
    deck: 'drinks', type: 'challenge', minMode: 1, minPlayers: 3, alcohol: true, intensity: [2, 4],
    targeting: 'all', visibility: 'public',
    requires: ['q_about_present'],
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}' } },
    text: '{actor} coloca todos em ordem de quem aguenta mais bebida. Os dois últimos da lista bebem {amount.label}.',
    points: { love: 1, fire: 3 }
  },

  /* ------------------------------------------------ escolhas e trocas */
  {
    id: 'dk_topic_or_drink',
    deck: 'drinks', type: 'choice', minMode: 1, alcohol: true, intensity: [1, 5],
    targeting: 'self', visibility: 'public',
    slots: {
      topic: { pool: 'questionTopics', limitKey: '{limit}', appliesTo: 'actor' },
      amount: { pool: 'drinkAmount', limitKey: '{limit}' }
    },
    text: '{actor} escolhe: contar sobre {topic.label} ou beber {amount.label}.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'dk_confession_drink',
    deck: 'drinks', type: 'choice', minMode: 1, alcohol: true, intensity: [2, 5],
    targeting: 'self', visibility: 'public',
    requires: ['q_confession'],
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}' } },
    text: '{actor} conta um segredo de verdade ou bebe {amount.label}. O grupo decide se o segredo valeu.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'dk_choose_who',
    deck: 'drinks', type: 'choice', minMode: 1, alcohol: true, intensity: [1, 4],
    targeting: 'other', visibility: 'public',
    requiresActor: ['drink_choose_for_other'],
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}', appliesTo: 'target' } },
    text: '{actor} decide: {target} bebe {amount.label}.',
    points: { love: 1, fire: 3 }
  },
  {
    id: 'dk_serve',
    deck: 'drinks', type: 'challenge', minMode: 1, alcohol: true, intensity: [1, 4],
    targeting: 'other', visibility: 'public',
    requiresActor: ['drink_serve'],
    requiresTarget: ['drink_sip'],
    text: '{actor} prepara a bebida de {target} do jeito que quiser. {target} bebe sem perguntar o que tem dentro.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'dk_partner_pays',
    deck: 'drinks', type: 'challenge', minMode: 1, alcohol: true, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    requiresTarget: ['drink_sip'],
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}', appliesTo: 'target' } },
    text: 'Até a próxima rodada, toda vez que {actor} rir, quem bebe {amount.label} é {target}.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'dk_speed',
    deck: 'drinks', type: 'challenge', minMode: 1, alcohol: true, intensity: [2, 5],
    targeting: 'pair', visibility: 'public',
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}' } },
    text: '{actor} e {target} bebem {amount.label} ao mesmo tempo. Quem terminar por último escolhe a própria próxima prenda.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'dk_dare_or_drink',
    deck: 'drinks', type: 'choice', minMode: 1, alcohol: true, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}', appliesTo: 'actor' } },
    text: '{actor} escolhe: beber {amount.label} ou cumprir o desafio que {target} inventar agora.',
    points: { love: 2, fire: 4 }
  },

  /* ----------------------------------------------- modo ousado (2+) */
  {
    id: 'dk_drink_or_strip',
    deck: 'drinks', type: 'choice', minMode: 2, alcohol: true, intensity: [2, 5],
    targeting: 'self', visibility: 'public',
    slots: {
      amount: { pool: 'drinkAmount', limitKey: '{limit}' },
      piece: { pool: 'clothing', limitKey: '{limit}' }
    },
    text: '{actor} escolhe: beber {amount.label} ou tirar {piece.label}.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'dk_body_shot',
    deck: 'drinks', type: 'challenge', minMode: 2, alcohol: true, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['drink_from_body'],
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { touchable: true, intimate: false }, limitKey: 'touch_{id}' },
      amount: { pool: 'drinkAmount', limitKey: '{limit}', appliesTo: 'actor' }
    },
    text: '{actor} bebe {amount.label} direto de {target} — {bodyPart.em}.',
    points: { love: 3, fire: 5 }
  },
  {
    id: 'dk_mouth_to_mouth',
    deck: 'drinks', type: 'challenge', minMode: 2, alcohol: true, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['drink_mouth_to_mouth'],
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}' } },
    text: '{actor} toma {amount.label} e passa para {target} de boca em boca, sem derramar.',
    points: { love: 4, fire: 5 }
  },
  {
    id: 'dk_drink_kiss',
    deck: 'drinks', type: 'challenge', minMode: 2, alcohol: true, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['kiss_prolonged', 'drink_sip'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} e {target} dão um gole e se beijam por {duration.label} antes de engolir.',
    points: { love: 4, fire: 5 }
  },
  {
    id: 'dk_straw',
    deck: 'drinks', type: 'challenge', minMode: 2, alcohol: true, intensity: [2, 4],
    targeting: 'other', visibility: 'public',
    requires: ['touch_sit_close', 'drink_sip'],
    text: '{target} segura o copo com a boca enquanto {actor} bebe pelo canudo. Sem usar as mãos.',
    points: { love: 3, fire: 4 }
  },
  {
    id: 'dk_blind_taste',
    deck: 'drinks', type: 'challenge', minMode: 2, alcohol: true, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_blindfold'],
    requiresActor: ['drink_sip'],
    text: '{target} venda {actor}, que bebe e tem que adivinhar o que é. Se errar, bebe de novo.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'dk_strip_roulette',
    deck: 'drinks', type: 'challenge', minMode: 2, minPlayers: 3, alcohol: true, intensity: [3, 5],
    targeting: 'all', visibility: 'public',
    requires: ['drink_sip'],
    slots: { piece: { pool: 'clothing', limitKey: '{limit}' } },
    text: 'Todos bebem ao sinal de {actor}. O último a terminar tira {piece.label}.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'dk_touch_rule',
    deck: 'drinks', type: 'challenge', minMode: 2, alcohol: true, intensity: [3, 5],
    targeting: 'all', visibility: 'public',
    requires: ['drink_rule', 'touch_caress'],
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}' } },
    text: 'Até a próxima vez de {actor}: quem encostar em alguém bebe {amount.label}.',
    points: { love: 2, fire: 4 }
  },

  /* ----------------------------------------------- modo adulto (3+) */
  {
    id: 'dk_body_shot_intimate',
    deck: 'drinks', type: 'challenge', minMode: 3, alcohol: true, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['drink_from_body'],
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { intimate: true }, limitKey: 'touch_{id}' },
      amount: { pool: 'drinkAmount', limitKey: '{limit}', appliesTo: 'actor' }
    },
    text: '{actor} bebe {amount.label} direto de {target} — {bodyPart.em}.',
    points: { love: 3, fire: 7 }
  },
  {
    id: 'dk_drink_and_act',
    deck: 'drinks', type: 'challenge', minMode: 3, alcohol: true, intensity: [4, 5],
    targeting: 'pair', visibility: 'public',
    slots: {
      act: { pool: 'sexAct', limitKey: '{limit}' },
      amount: { pool: 'drinkAmount', limitKey: '{limit}' }
    },
    text: '{actor} e {target} bebem {amount.label} e, sem intervalo, vão {act.label}.',
    points: { love: 3, fire: 7 }
  },
  {
    id: 'dk_moan_drink',
    deck: 'drinks', type: 'challenge', minMode: 3, alcohol: true, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_teasing'],
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}', appliesTo: 'actor' } },
    text: 'Enquanto {actor} provoca {target}, cada vez que {target} gemer {actor} bebe {amount.label}.',
    points: { love: 2, fire: 6 }
  },
  {
    id: 'dk_truth_shot',
    deck: 'drinks', type: 'choice', minMode: 3, alcohol: true, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['q_sexual_preferences'],
    slots: { amount: { pool: 'drinkAmount', filter: { minTier: 3 }, limitKey: '{limit}', appliesTo: 'actor' } },
    text: '{target} faz uma pergunta sem filtro sobre sexo. {actor} responde ou vira {amount.label}.',
    points: { love: 2, fire: 5 }
  },
  {
    id: 'dk_edge_drink',
    deck: 'drinks', type: 'challenge', minMode: 3, alcohol: true, intensity: [5, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_manual'],
    slots: { amount: { pool: 'drinkAmount', limitKey: '{limit}', appliesTo: 'target' } },
    text: '{actor} não para até {target} pedir. Cada vez que {target} pedir para parar, bebe {amount.label} e recomeça.',
    points: { love: 3, fire: 8 }
  }
];
