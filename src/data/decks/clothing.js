/**
 * BARALHO: ROUPA (Modo 2+)
 * O slot `piece` carrega o limite de cada peca, entao a mesma carta
 * pode sair como "tire os sapatos" ou "tire a roupa intima" conforme
 * o que os envolvidos permitiram.
 *
 * A nudez e o TETO DO MODO 2: as cartas de nudez parcial e completa
 * vivem aqui, no nivel de intensidade mais alto que o Ousado alcanca.
 */

export const CLOTHING = [
  {
    id: 'cl_remove_piece',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [1, 5],
    targeting: 'self', visibility: 'public',
    slots: { piece: { pool: 'clothing', limitKey: '{limit}' } },
    text: '{actor}, tire {piece.label}.',
    points: { love: 1, fire: 3 }
  },
  {
    id: 'cl_remove_modifier',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [2, 5],
    targeting: 'self', visibility: 'public',
    slots: {
      piece: { pool: 'clothing', limitKey: '{limit}' },
      modifier: { pool: 'modifier' }
    },
    text: '{actor} tira {piece.label}, {modifier.label}.',
    points: { love: 1, fire: 4 }
  },
  {
    id: 'cl_other_chooses',
    deck: 'clothing', type: 'choice', minMode: 2, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    requiresActor: ['clothing_choose'],
    slots: { piece: { pool: 'clothing', limitKey: '{limit}', appliesTo: 'actor' } },
    text: '{target} escolhe a peça — e sugere {piece.label}. {actor} tira.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'cl_group_chooses',
    deck: 'clothing', type: 'choice', minMode: 2, minPlayers: 3, intensity: [3, 5],
    targeting: 'all', visibility: 'public',
    requiresActor: ['clothing_choose'],
    slots: { piece: { pool: 'clothing', limitKey: '{limit}', appliesTo: 'actor' } },
    text: 'O grupo vota e decide: {actor} tira {piece.label} agora.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'cl_target_removes',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['touch_caress'],
    slots: { piece: { pool: 'clothing', limitKey: '{limit}', appliesTo: 'target' } },
    text: '{actor} tira {piece.label} de {target}. Sem pressa.',
    points: { love: 3, fire: 4 }
  },
  {
    id: 'cl_no_hands',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['touch_caress'],
    slots: { piece: { pool: 'clothing', limitKey: '{limit}', appliesTo: 'target' } },
    text: '{actor} tira {piece.label} de {target} sem usar as mãos.',
    points: { love: 2, fire: 5 }
  },
  {
    id: 'cl_swap',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [2, 4],
    targeting: 'pair', visibility: 'public',
    requires: ['clothing_swap'],
    text: '{actor} e {target} trocam uma peça de roupa e ficam assim até o fim da rodada.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'cl_bet',
    deck: 'clothing', type: 'choice', minMode: 2, intensity: [2, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['clothing_shirt'],
    text: '{actor} e {target} apostam no par ou ímpar. Quem perder tira uma peça.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'cl_random_pair_bet',
    deck: 'clothing', type: 'choice', minMode: 2, minPlayers: 3, intensity: [3, 5],
    targeting: 'random_pair', visibility: 'public',
    slots: { piece: { pool: 'clothing', limitKey: '{limit}' } },
    text: 'Sorteio! {actor} e {target} disputam no jokenpô. Quem perder tira {piece.label}.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'cl_ransom',
    deck: 'clothing', type: 'choice', minMode: 2, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['q_intimate_personal'],
    slots: { piece: { pool: 'clothing', limitKey: '{limit}', appliesTo: 'actor' } },
    text: '{actor} pode manter {piece.label} se responder uma pergunta íntima do grupo. Se recusar, a peça sai.',
    text2: '{actor} pode manter {piece.label} se responder uma pergunta íntima de {target}. Se recusar, a peça sai.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'cl_blind_guess',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_blindfold', 'touch_caress'],
    requiresActor: ['clothing_shirt'],
    // O texto diz que quem erra também tira: então isso precisa estar
    // declarado, senão a carta chegaria a quem bloqueou roupa.
    requiresTarget: ['clothing_shirt'],
    text: '{target} fecha os olhos e tenta adivinhar qual peça {actor} está tirando. Se errar, {target} tira uma também.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'cl_to_underwear',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'self', visibility: 'public',
    requires: ['clothing_to_underwear'],
    text: '{actor} fica só de roupa íntima até o fim da rodada.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'cl_stay_without',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'self', visibility: 'public',
    slots: { piece: { pool: 'clothing', filter: { minTier: 2 }, limitKey: '{limit}' } },
    text: '{actor} fica sem {piece.label} até o fim da partida.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'cl_partial_nude',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [4, 5],
    targeting: 'self', visibility: 'public',
    requires: ['clothing_partial_nude'],
    text: '{actor} escolhe: parte de cima ou parte de baixo. A escolhida sai inteira.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'cl_full_nude',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [4, 5],
    targeting: 'self', visibility: 'public',
    requires: ['clothing_full_nude'],
    text: '{actor} tira toda a roupa e fica assim pelas próximas duas rodadas.',
    points: { love: 1, fire: 6 }
  },
  {
    id: 'cl_strip_dance',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [4, 5],
    targeting: 'all', visibility: 'public',
    requires: ['clothing_to_underwear', 'exposure_watched'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} tem {duration.label} de música para tirar uma peça por vez enquanto todos assistem.',
    text2: '{actor} tem {duration.label} de música para tirar uma peça por vez, com {target} assistindo de perto.',
    points: { love: 2, fire: 6 }
  },
  {
    id: 'cl_under_the_piece',
    deck: 'clothing', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'all', visibility: 'public',
    requiresActor: ['exposure_body_players'],
    slots: { piece: { pool: 'clothing', filter: { minTier: 2 }, limitKey: '{limit}', appliesTo: 'actor' } },
    text: '{actor} mostra para o grupo o que está por baixo de {piece.label} — sem tirar a peça.',
    text2: '{actor} mostra para {target} o que está por baixo de {piece.label} — sem tirar a peça.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'cl_trade_back',
    deck: 'clothing', type: 'choice', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['clothing_swap'],
    text: '{target} decide: {actor} recupera uma peça já tirada, ou tira mais uma.',
    points: { love: 2, fire: 4 }
  },

/* --------------------------------------------------- em grupo (3+) */
  {
    id: 'cl_group_roulette',
    deck: 'clothing', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    slots: { piece: { pool: 'clothing', limitKey: '{limit}' } },
    text: 'Ao sinal de {actor}, todos tiram a mesma peça ao mesmo tempo: {piece.label}.',
    points: { love: 2, fire: 5 }
  },
  {
    id: 'cl_most_dressed',
    deck: 'clothing', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    slots: { piece: { pool: 'clothing', limitKey: '{limit}' } },
    text: 'Quem estiver com mais roupa neste momento tira {piece.label}.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'cl_vote_who',
    deck: 'clothing', type: 'choice', minMode: 2, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['clothing_choose'],
    text: 'O grupo vota em quem tira a próxima peça. {actor} não pode votar.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'cl_odd_one',
    deck: 'clothing', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    slots: { piece: { pool: 'clothing', limitKey: '{limit}' } },
    text: '{actor} diz uma característica ("já transei em praia"). Quem NÃO se encaixa tira {piece.label}.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'cl_random_pair_strip',
    deck: 'clothing', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [3, 5],
    targeting: 'random_pair', visibility: 'public',
    requires: ['touch_caress'],
    slots: { piece: { pool: 'clothing', limitKey: '{limit}', appliesTo: 'target' } },
    text: 'Sorteio! {actor} tira {piece.label} de {target} na frente de todos.',
    points: { love: 2, fire: 6 }
  },

  /* -------------------------------------------------- foco no casal */
  {
    id: 'cl_couple_mirror',
    deck: 'clothing', type: 'challenge', minMode: 2, maxPlayers: 2, intensity: [2, 5],
    targeting: 'pair', visibility: 'public',
    slots: { piece: { pool: 'clothing', limitKey: '{limit}' } },
    text: 'Os dois tiram {piece.label} ao mesmo tempo, um de frente para o outro, sem desviar o olhar.',
    points: { love: 4, fire: 5 }
  },
  {
    id: 'cl_couple_slow',
    deck: 'clothing', type: 'challenge', minMode: 2, maxPlayers: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['touch_caress'],
    slots: {
      piece: { pool: 'clothing', limitKey: '{limit}', appliesTo: 'target' },
      duration: { pool: 'durations', filter: { minTier: 3 } }
    },
    text: '{actor} leva {duration.label} inteiros para tirar {piece.label} de {target}. Se acelerar, recomeça.',
    points: { love: 4, fire: 5 }
  }
];
