/**
 * BARALHO: BEIJOS E CONTATO FISICO (Modo 2+)
 * ------------------------------------------------------------------
 * O baralho mais parametrico do jogo. Cada slot e resolvido contra os
 * limites dos envolvidos: o mesmo molde vira "beijo na testa" para um
 * casal e "beijo nas coxas" para outro, sem furar nenhum limite.
 */

export const CONTACT = [
  /* ------------------------------------------------------------ BEIJOS */
  {
    id: 'c_kiss_part',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [1, 5],
    targeting: 'other', visibility: 'public',
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { kissable: true }, exclude: ['mouth'], limitKey: 'kiss_{id}' },
      style: { pool: 'kissStyle' }
    },
    text: '{actor}, dê {style} em {target} — {bodyPart.em}.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'c_kiss_modifier',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { kissable: true }, limitKey: 'kiss_{id}' },
      modifier: { pool: 'modifier' }
    },
    text: '{actor} beija {target} {bodyPart.em}, {modifier.label}.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'c_kiss_mouth',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['kiss_mouth'],
    slots: { duration: { pool: 'durations' } },
    text: '{actor} e {target} se beijam na boca por {duration.label}.',
    points: { love: 4, fire: 2 }
  },
  {
    id: 'c_kiss_prolonged',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['kiss_prolonged'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} e {target} se beijam de língua por {duration.label}. Sem rir, sem parar antes.',
    points: { love: 4, fire: 3 }
  },
  {
    id: 'c_kiss_trail',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    slots: {
      from: { pool: 'bodyParts', filter: { kissable: true, intimate: false }, limitKey: 'kiss_{id}' },
      to: { pool: 'bodyParts', filter: { kissable: true }, limitKey: 'kiss_{id}' }
    },
    text: '{actor}, faça uma trilha de beijos em {target}, começando {from.em} e terminando {to.em}.',
    points: { love: 3, fire: 4 }
  },
  {
    id: 'c_kiss_countdown',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    requires: ['kiss_face'],
    slots: {
      count: { pool: 'counts' },
      duration: { pool: 'durations', filter: { minTier: 2 } }
    },
    text: '{actor} tem {duration.label} para beijar {target} em {count.label} lugares diferentes que os dois permitiram.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'c_kiss_blind',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_blindfold'],
    slots: { bodyPart: { pool: 'bodyParts', filter: { kissable: true }, limitKey: 'kiss_{id}' } },
    text: '{target} fecha os olhos. {actor} beija {target} {bodyPart.em} — {target} tem que adivinhar onde foi.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'c_kiss_choose_place',
    deck: 'contact', type: 'choice', minMode: 2, intensity: [2, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['kiss_face'],
    text: '{target} escolhe um lugar do próprio corpo. {actor} beija ali — se ambos permitirem aquele ponto.',
    points: { love: 3, fire: 3 }
  },

  /* ---------------------------------------------------- CONTATO FISICO */
  {
    id: 'c_touch_part',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [1, 5],
    targeting: 'other', visibility: 'public',
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' },
      style: { pool: 'touchStyle' },
      duration: { pool: 'durations' }
    },
    text: '{actor}, toque {target} {bodyPart.em} {style.label} por {duration.label}.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'c_touch_modifier',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' },
      modifier: { pool: 'modifier' },
      duration: { pool: 'durations', filter: { minTier: 2 } }
    },
    text: '{actor} toca {target} {bodyPart.em} por {duration.label}, {modifier.label}.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'c_hand_stays',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    slots: { bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' } },
    text: '{actor} põe a mão em {target} — {bodyPart.em} — e não tira até o fim da rodada.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'c_massage',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 4],
    targeting: 'other', visibility: 'public',
    requiresActor: ['touch_massage_give'],
    requiresTarget: ['touch_massage_receive'],
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' },
      duration: { pool: 'durations', filter: { minTier: 2 } }
    },
    text: '{actor} faz massagem em {target} — {bodyPart.em} — por {duration.label}.',
    points: { love: 3, fire: 1 }
  },
  {
    id: 'c_massage_place',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    requiresActor: ['touch_massage_give'],
    requiresTarget: ['touch_massage_receive'],
    slots: {
      place: { pool: 'places' },
      duration: { pool: 'durations', filter: { minTier: 3 } }
    },
    text: '{target} se acomoda {place.label}. {actor} faz massagem por {duration.label}, sem pressa.',
    points: { love: 4, fire: 2 }
  },
  {
    id: 'c_lap',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 4],
    targeting: 'other', visibility: 'public',
    requires: ['touch_lap'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} senta no colo de {target} e fica lá por {duration.label}.',
    points: { love: 3, fire: 2 }
  },
  {
    id: 'c_lap_dance',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['touch_lap', 'touch_dance'],
    slots: {
      duration: { pool: 'durations', filter: { minTier: 3 } },
      modifier: { pool: 'modifier' }
    },
    text: '{actor} senta no colo de {target} e se mexe por {duration.label}, {modifier.label}.',
    points: { love: 3, fire: 5 }
  },
  {
    id: 'c_dance',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 4],
    targeting: 'pair', visibility: 'public',
    requires: ['touch_dance'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} e {target} dançam colados por {duration.label}. Quem soltar primeiro perde.',
    points: { love: 3, fire: 2 }
  },
  {
    id: 'c_dance_group',
    deck: 'contact', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 4],
    targeting: 'all', visibility: 'public',
    requires: ['touch_dance'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: 'Todos dançam em duplas por {duration.label}. {actor} escolhe a música e quem dança com quem.',
    points: { love: 3, fire: 2 }
  },
  {
    id: 'c_hug_long',
    deck: 'contact', type: 'challenge', minMode: 1, intensity: [1, 3],
    targeting: 'other', visibility: 'public',
    requires: ['touch_hug'],
    slots: { duration: { pool: 'durations' } },
    text: '{actor} abraça {target} por {duration.label} sem dizer nada.',
    points: { love: 3, fire: 0 }
  },
  {
    id: 'c_caress_close',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 4],
    targeting: 'other', visibility: 'public',
    requires: ['touch_caress', 'touch_lie_down'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} e {target} deitam juntos. {actor} faz carinho em {target} por {duration.label}.',
    points: { love: 4, fire: 1 }
  },
  {
    id: 'c_lie_together',
    deck: 'contact', type: 'connection', minMode: 2, intensity: [2, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['touch_lie_down'],
    slots: {
      duration: { pool: 'durations', filter: { minTier: 3 } },
      modifier: { pool: 'modifier' }
    },
    text: '{actor} e {target} ficam deitados colados por {duration.label}, {modifier.label}.',
    points: { love: 4, fire: 2 }
  },
  {
    id: 'c_hair',
    deck: 'contact', type: 'connection', minMode: 2, intensity: [1, 4],
    targeting: 'other', visibility: 'public',
    requires: ['touch_caress'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} passa os dedos no cabelo de {target} por {duration.label}.',
    points: { love: 4, fire: 1 }
  },
  {
    id: 'c_breath_neck',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['touch_sit_close', 'body_neck'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} respira bem perto do pescoço de {target} por {duration.label} — sem encostar nenhuma vez.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'c_guess_touch',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    requires: ['bdsm_blindfold'],
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' },
      count: { pool: 'counts' }
    },
    text: '{target} fecha os olhos. {actor} toca {target} {bodyPart.em} {count.label} vezes — {target} conta em voz alta.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'c_no_hands_challenge',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['touch_caress', 'kiss_neck'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} tem {duration.label} para deixar {target} arrepiado sem usar as mãos.',
    points: { love: 3, fire: 4 }
  },
  {
    id: 'c_eye_contact',
    deck: 'contact', type: 'connection', minMode: 1, intensity: [1, 3],
    targeting: 'pair', visibility: 'public',
    requires: ['touch_sit_close'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} e {target} se olham nos olhos por {duration.label}, sem falar e sem rir.',
    points: { love: 4, fire: 1 }
  },
  {
    id: 'c_whisper',
    deck: 'contact', type: 'challenge', minMode: 2, intensity: [2, 5],
    targeting: 'other', visibility: 'private',
    requires: ['touch_sit_close', 'q_fantasies'],
    text: '{actor} sussurra no ouvido de {target} algo que gostaria de fazer com ele. Só {target} pode ouvir.',
    points: { love: 3, fire: 3 }
  },

  /* ------------------------------------------------ sorteio e plateia */
  {
    id: 'c_random_pair_kiss',
    deck: 'contact', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [3, 5],
    targeting: 'random_pair', visibility: 'public',
    requires: ['kiss_mouth'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: 'Sorteio! {actor} e {target} se beijam por {duration.label}.',
    points: { love: 3, fire: 5 }
  },
  {
    id: 'c_random_pair_touch',
    deck: 'contact', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 5],
    targeting: 'random_pair', visibility: 'public',
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' },
      duration: { pool: 'durations', filter: { minTier: 2 } }
    },
    text: 'Sorteio! {actor} toca {target} {bodyPart.em} por {duration.label}.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'c_watched_kiss',
    deck: 'contact', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    watched: true,
    requires: ['kiss_prolonged'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} e {target} se beijam por {duration.label} enquanto o resto do grupo assiste em silêncio.',
    points: { love: 3, fire: 5 }
  },

/* ------------------------------------- contato leve (Modo 1, Leve) */
  {
    id: 'c_shoulder',
    deck: 'contact', type: 'connection', minMode: 1, intensity: [1, 3],
    targeting: 'other', visibility: 'public',
    requires: ['touch_sit_close'],
    text: '{actor} encosta a cabeça no ombro de {target} e fica assim até o fim do turno.',
    points: { love: 4, fire: 0 }
  },
  {
    id: 'c_hands_lock',
    deck: 'contact', type: 'connection', minMode: 1, intensity: [1, 3],
    targeting: 'pair', visibility: 'public',
    requires: ['touch_hands'],
    text: '{actor} e {target} ficam de mãos dadas até a próxima vez de {actor} jogar.',
    points: { love: 4, fire: 1 }
  },
  {
    id: 'c_hug_group',
    deck: 'contact', type: 'connection', minMode: 1, minPlayers: 3, intensity: [1, 3],
    targeting: 'all', visibility: 'public',
    requires: ['touch_hug', 'touch_non_partner'],
    slots: { duration: { pool: 'durations' } },
    text: 'Abraço coletivo de {duration.label}. {actor} decide quando todo mundo solta.',
    points: { love: 4, fire: 1 }
  },
  {
    id: 'c_back_write',
    deck: 'contact', type: 'challenge', minMode: 1, intensity: [1, 4],
    targeting: 'other', visibility: 'public',
    requires: ['touch_back', 'body_back'],
    text: '{actor} escreve uma palavra picante com o dedo nas costas de {target}, que tem que adivinhar qual é.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'c_hand_read',
    deck: 'contact', type: 'challenge', minMode: 1, intensity: [1, 3],
    targeting: 'other', visibility: 'public',
    requires: ['touch_hands', 'body_hands'],
    text: '{actor} segura a mão de {target} e "lê" o futuro amoroso dele. Tem que ser específico e constrangedor.',
    points: { love: 3, fire: 2 }
  },
  {
    id: 'c_close_talk',
    deck: 'contact', type: 'connection', minMode: 1, intensity: [1, 4],
    targeting: 'pair', visibility: 'public',
    requires: ['touch_sit_close'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} e {target} conversam por {duration.label} a menos de um palmo de distância, sem se afastar.',
    points: { love: 4, fire: 2 }
  },
  {
    id: 'c_arm_wrestle',
    deck: 'contact', type: 'challenge', minMode: 1, intensity: [1, 3],
    targeting: 'pair', visibility: 'public',
    requires: ['touch_hands', 'touch_arms'],
    text: '{actor} e {target} fazem queda de braço. Quem perder escolhe uma prenda — para si mesmo.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'c_copy_pose',
    deck: 'contact', type: 'challenge', minMode: 1, intensity: [1, 3],
    targeting: 'other', visibility: 'public',
    requires: ['touch_arms'],
    text: '{target} faz uma pose. {actor} tem que copiar exatamente, ajustando {target} com as mãos para comparar.',
    points: { love: 3, fire: 2 }
  },
  {
    id: 'c_feet_war',
    deck: 'contact', type: 'challenge', minMode: 1, intensity: [1, 3],
    targeting: 'pair', visibility: 'public',
    requires: ['touch_feet', 'body_feet'],
    text: '{actor} e {target} disputam com os pés quem empurra o outro primeiro. Sem usar as mãos.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'c_blind_face',
    deck: 'contact', type: 'challenge', minMode: 1, intensity: [1, 4],
    targeting: 'other', visibility: 'public',
    requires: ['touch_face', 'body_face'],
    text: '{actor} fecha os olhos e tem que reconhecer {target} só tocando o rosto dele.',
    points: { love: 3, fire: 2 }
  },

  /* ------------------------------------------ correntes de grupo (3+) */
  {
    id: 'c_chain_kiss',
    deck: 'contact', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['kiss_non_partner'],
    slots: { bodyPart: { pool: 'bodyParts', filter: { kissable: true }, limitKey: 'kiss_{id}' } },
    text: 'Corrente: cada um beija quem está à direita {bodyPart.em}. {actor} começa.',
    points: { love: 3, fire: 4 }
  },
  {
    id: 'c_pass_touch',
    deck: 'contact', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['touch_non_partner'],
    slots: { bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' } },
    text: '{actor} toca quem está à direita {bodyPart.em}; essa pessoa repete no próximo, até fechar a roda.',
    points: { love: 3, fire: 4 }
  },
  {
    id: 'c_rotate_massage',
    deck: 'contact', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 4],
    targeting: 'all', visibility: 'public',
    requires: ['touch_massage_give', 'touch_massage_receive', 'touch_non_partner'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: 'Todos formam uma fila e massageiam as costas de quem está à frente por {duration.label}. Depois a fila inverte.',
    points: { love: 4, fire: 2 }
  },
  {
    id: 'c_musical_lap',
    deck: 'contact', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['touch_lap', 'touch_non_partner'],
    text: 'Dança das cadeiras com uma cadeira a menos. Quem sobrar senta no colo de quem conseguiu sentar.',
    points: { love: 3, fire: 4 }
  },
  {
    id: 'c_swap_dance',
    deck: 'contact', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 4],
    targeting: 'all', visibility: 'public',
    requires: ['touch_dance', 'touch_non_partner'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: 'Todos dançam em duplas e trocam de par a cada {duration.label}, no comando de {actor}.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'c_random_pair_massage',
    deck: 'contact', type: 'challenge', minMode: 2, minPlayers: 3, intensity: [2, 5],
    targeting: 'random_pair', visibility: 'public',
    requiresActor: ['touch_massage_give'],
    requiresTarget: ['touch_massage_receive'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: 'Sorteio! {actor} faz massagem em {target} por {duration.label} enquanto o grupo continua conversando.',
    points: { love: 4, fire: 2 }
  },

  /* -------------------------------------------------- foco no casal */
  {
    id: 'c_couple_forehead',
    deck: 'contact', type: 'connection', minMode: 2, maxPlayers: 2, intensity: [1, 3],
    targeting: 'pair', visibility: 'public',
    requires: ['kiss_forehead', 'touch_sit_close'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: 'Testa na testa por {duration.label}, respirando no mesmo ritmo. Sem falar nada.',
    points: { love: 5, fire: 1 }
  },
  {
    id: 'c_couple_map',
    deck: 'contact', type: 'challenge', minMode: 2, maxPlayers: 2, intensity: [2, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['touch_caress'],
    slots: { bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' } },
    text: '{target} guia a mão de {actor} e mostra exatamente como gosta de ser tocado {bodyPart.em}.',
    points: { love: 5, fire: 4 }
  },
  {
    id: 'c_couple_countdown',
    deck: 'contact', type: 'challenge', minMode: 2, maxPlayers: 2, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['kiss_mouth', 'touch_caress'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: 'Por {duration.label}, nenhum dos dois pode usar a boca para falar — só para o resto.',
    points: { love: 4, fire: 5 }
  }
];
