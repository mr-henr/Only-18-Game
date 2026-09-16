/**
 * BARALHO: BDSM / PODER E EXPOSICAO
 * Dominacao e restricao tem exigencias assimetricas: quem domina
 * precisa de `bdsm_dominate`, quem obedece precisa de `bdsm_submit`.
 * O filtro aplica cada lista ao jogador certo.
 *
 * Cartas com `watched: true` exigem `dyn_watch` de quem assiste e
 * `dyn_be_watched` de quem esta no centro — ninguem vira plateia nem
 * espetaculo sem ter permitido.
 */

export const POWER = [
  /* ------------------------------------------------ ordens e controle */
  {
    id: 'p_orders',
    deck: 'power', type: 'challenge', minMode: 2, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_orders'],
    slots: { count: { pool: 'counts' } },
    text: '{actor} dá {count.label} ordens para {target} nesta rodada. Nada fora dos limites marcados.',
    points: { love: 1, fire: 4 }
  },
  {
    id: 'p_orders_modifier',
    deck: 'power', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_orders'],
    slots: {
      duration: { pool: 'durations', filter: { minTier: 3 } },
      modifier: { pool: 'modifier' }
    },
    text: 'Por {duration.label}, {target} obedece a tudo que {actor} mandar, {modifier.label}.',
    points: { love: 2, fire: 5 }
  },
  {
    id: 'p_blindfold_round',
    deck: 'power', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_blindfold'],
    text: '{target} fica de olhos vendados até o fim da rodada. {actor} conduz.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'p_blindfold_who',
    deck: 'power', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_blindfold'],
    slots: { bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' } },
    text: '{target} fica vendado. {actor} escolhe outro jogador para tocar {target} {bodyPart.em} — {target} adivinha quem foi.',
    points: { love: 2, fire: 5 }
  },
  {
    id: 'p_dominate',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requiresActor: ['bdsm_dominate'],
    requiresTarget: ['bdsm_submit'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} manda em {target} por {duration.label}. {target} obedece sem questionar.',
    points: { love: 2, fire: 6 }
  },
  {
    id: 'p_dom_round',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requiresActor: ['bdsm_dominate'],
    requiresTarget: ['bdsm_submit'],
    text: '{actor} manda em {target} pelo resto da rodada. {target} não pode dizer não a nada que esteja dentro dos limites.',
    points: { love: 2, fire: 6 }
  },
  {
    id: 'p_switch',
    deck: 'power', type: 'choice', minMode: 3, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['bdsm_switch'],
    text: '{actor} e {target} trocam de papel agora. Quem mandava, obedece.',
    points: { love: 3, fire: 4 }
  },

  /* --------------------------------------------- restrição e sensação */
  {
    id: 'p_restraint',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requiresActor: ['bdsm_tie_other', 'bdsm_restraint'],
    requiresTarget: ['bdsm_tie_self', 'bdsm_restraint'],
    text: '{actor} prende as mãos de {target}. {target} continua o jogo assim.',
    points: { love: 2, fire: 6 }
  },
  {
    id: 'p_restraint_time',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requiresActor: ['bdsm_tie_other', 'bdsm_restraint'],
    requiresTarget: ['bdsm_tie_self', 'bdsm_restraint'],
    slots: { duration: { pool: 'durations', filter: { minTier: 4 } } },
    text: '{target} fica preso por {duration.label}. {actor} faz o que quiser — dentro do que os dois permitiram.',
    points: { love: 2, fire: 7 }
  },
  {
    id: 'p_accessories',
    deck: 'power', type: 'choice', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_accessories'],
    text: '{actor} usa um acessório em {target}: algema, coleira ou mordaça. {target} escolhe qual dos três.',
    points: { love: 2, fire: 6 }
  },
  {
    id: 'p_spanking',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_spanking'],
    slots: { count: { pool: 'counts' } },
    text: '{actor} dá {count.label} palmadas em {target}. {target} conta em voz alta.',
    points: { love: 1, fire: 6 }
  },
  {
    id: 'p_spanking_modifier',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_spanking'],
    slots: { count: { pool: 'counts' }, modifier: { pool: 'modifier' } },
    text: '{actor} dá {count.label} palmadas em {target}, {modifier.label}.',
    points: { love: 1, fire: 6 }
  },
  {
    id: 'p_bite',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_pain_light'],
    slots: { bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' } },
    text: '{actor} morde {target} {bodyPart.em} — de leve, mas o suficiente para marcar a intenção.',
    points: { love: 1, fire: 5 }
  },

  /* ------------------------------------------------------- EXPOSIÇÃO */
  {
    id: 'p_show_body',
    deck: 'power', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'all', visibility: 'public',
    requiresActor: ['exposure_body_players'],
    text: '{actor} mostra para o grupo a parte do corpo de que mais se orgulha.',
    text2: '{actor} mostra para {target} a parte do corpo de que mais se orgulha.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'p_watched_act',
    deck: 'power', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'all', visibility: 'public',
    requiresActor: ['exposure_watched'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: 'Todos param e observam {actor} por {duration.label}. {actor} decide o que fazer nesse tempo.',
    text2: '{target} para tudo e observa {actor} por {duration.label}. {actor} decide o que fazer nesse tempo.',
    points: { love: 2, fire: 5 }
  },
  {
    id: 'p_watch_pair',
    deck: 'power', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    watched: true,
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} e {target} cumprem o próximo desafio por {duration.label} enquanto o restante do grupo assiste.',
    points: { love: 3, fire: 5 }
  },
  {
    id: 'p_watch_random_pair',
    deck: 'power', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [3, 5],
    targeting: 'random_pair', visibility: 'public',
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' },
      duration: { pool: 'durations', filter: { minTier: 2 } }
    },
    text: 'Sorteio! {actor} e {target} ficam no centro por {duration.label} — {actor} toca {target} {bodyPart.em} enquanto o grupo assiste.',
    points: { love: 2, fire: 6 }
  },
  {
    id: 'p_show_intimate',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [5, 5],
    targeting: 'all', visibility: 'public',
    requiresActor: ['exposure_intimate_players'],
    text: '{actor} mostra para o grupo. Sem pressa, sem esconder.',
    text2: '{actor} mostra para {target}. Sem pressa, sem esconder.',
    points: { love: 1, fire: 8 }
  },
  {
    id: 'p_photo',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'private',
    requiresActor: ['exposure_photo'],
    requiresTarget: ['exposure_send_photo'],
    text: '{target} tira uma foto de {actor} do jeito que {target} quiser. A foto fica só entre os dois.',
    points: { love: 2, fire: 6 }
  },
  {
    id: 'p_recorded',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'pair', visibility: 'private',
    requires: ['exposure_recorded'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} e {target} gravam {duration.label} do próximo desafio. O vídeo não sai do aparelho de vocês.',
    points: { love: 3, fire: 6 }
  },
  {
    id: 'p_camera_live',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'self', visibility: 'public',
    requiresActor: ['exposure_camera'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} liga a câmera do celular e cumpre o próximo desafio na frente dela por {duration.label}.',
    points: { love: 1, fire: 7 }
  },
  {
    id: 'p_outside',
    deck: 'power', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'self', visibility: 'private',
    requiresActor: ['exposure_outside'],
    text: '{actor} manda uma mensagem ousada para alguém que não está na partida. Ninguém aqui lê o que foi escrito.',
    points: { love: 1, fire: 7 }
  },

/* --------------------------------------------------- em grupo (3+) */
  {
    id: 'p_group_orders',
    deck: 'power', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['bdsm_orders'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: 'Por {duration.label}, {actor} manda em todo mundo. Cada ordem precisa caber nos limites de quem recebe.',
    points: { love: 2, fire: 5 }
  },
  {
    id: 'p_group_blindfold',
    deck: 'power', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [3, 5],
    targeting: 'all', visibility: 'public',
    requires: ['bdsm_blindfold', 'touch_non_partner'],
    slots: { bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' } },
    text: 'Todos menos {actor} fecham os olhos. {actor} toca cada um {bodyPart.em} e eles adivinham a ordem depois.',
    points: { love: 2, fire: 5 }
  },
  {
    id: 'p_chain_spank',
    deck: 'power', type: 'challenge', minMode: 3, minPlayers: 3, intensity: [4, 5],
    targeting: 'all', visibility: 'public',
    requires: ['bdsm_spanking', 'touch_non_partner'],
    slots: { count: { pool: 'counts' } },
    text: 'Corrente: cada um dá {count.label} palmadas em quem está à direita. {actor} começa.',
    points: { love: 1, fire: 6 }
  },
  {
    id: 'p_random_pair_dom',
    deck: 'power', type: 'challenge', minMode: 3, minPlayers: 3, intensity: [3, 5],
    targeting: 'random_pair', visibility: 'public',
    requiresActor: ['bdsm_dominate'],
    requiresTarget: ['bdsm_submit'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: 'Sorteio! Por {duration.label}, {target} obedece a tudo que {actor} mandar.',
    points: { love: 2, fire: 6 }
  },

  /* -------------------------------------------------- foco no casal */
  {
    id: 'p_couple_contract',
    deck: 'power', type: 'choice', minMode: 3, maxPlayers: 2, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    requiresActor: ['bdsm_dominate'],
    requiresTarget: ['bdsm_submit'],
    text: 'Vocês combinam agora quem manda até o fim da partida. Quem obedece escolhe uma palavra de segurança em voz alta.',
    points: { love: 4, fire: 5 }
  },
  {
    id: 'p_couple_blind_hour',
    deck: 'power', type: 'challenge', minMode: 2, maxPlayers: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_blindfold', 'touch_caress'],
    slots: { duration: { pool: 'durations', filter: { minTier: 4 } } },
    text: '{target} fica vendado por {duration.label}. {actor} não pode avisar nada do que vai fazer antes de fazer.',
    points: { love: 3, fire: 6 }
  },
  {
    id: 'p_couple_photo_series',
    deck: 'power', type: 'challenge', minMode: 3, maxPlayers: 2, intensity: [4, 5],
    targeting: 'other', visibility: 'private',
    requiresActor: ['exposure_photo'],
    requiresTarget: ['exposure_send_photo'],
    slots: { count: { pool: 'counts' } },
    text: '{target} dirige um ensaio de {count.label} fotos de {actor}. As fotos ficam só no aparelho de vocês.',
    points: { love: 3, fire: 6 }
  }
];
