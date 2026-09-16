/**
 * BARALHO: CONTEUDO SEXUAL (Modo 3 / Bate-Pronto / Livre)
 * ------------------------------------------------------------------
 * Todas as cartas aqui tem minMode 3. Nenhuma delas e sequer carregada
 * nos Modos Leve e Ousado — o teto do modo e aplicado antes do filtro.
 * Cada carta declara exatamente quais limites exige, separando o que e
 * exigido de quem FAZ e de quem RECEBE.
 */

export const ADULT = [
  /* ------------------------------------------------------- provocação */
  {
    id: 'a_teasing',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_teasing'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} tem {duration.label} para provocar {target} sem encostar nele nenhuma vez.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'a_no_touch_rule',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['sexual_teasing'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: 'Por {duration.label}, {actor} e {target} podem fazer o que quiserem — menos encostar nos genitais.',
    points: { love: 3, fire: 5 }
  },
  {
    id: 'a_dirty_talk',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_dirty_talk'],
    text: '{actor} fala no ouvido de {target}, com todas as palavras, o que quer que aconteça em seguida.',
    points: { love: 3, fire: 4 }
  },
  {
    id: 'a_private_order',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [3, 5],
    targeting: 'other', visibility: 'private',
    requires: ['sexual_teasing'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} recebe uma instrução secreta e tem {duration.label} para executá-la em {target}. Ninguém mais pode ler.',
    points: { love: 2, fire: 5 }
  },

  /* ----------------------------------------------------------- amasso */
  {
    id: 'a_making_out',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['sexual_making_out'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} e {target} se agarram por {duration.label}. Quem interromper primeiro perde a rodada.',
    points: { love: 4, fire: 4 }
  },
  {
    id: 'a_worship_part',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { kissable: true }, limitKey: 'kiss_{id}' },
      duration: { pool: 'durations', filter: { minTier: 3 } }
    },
    text: '{actor} passa {duration.label} só em {target} — {bodyPart.em} — sem ir para nenhum outro lugar.',
    points: { love: 3, fire: 5 }
  },
  {
    id: 'a_breasts',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_breasts'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} estimula os seios de {target} com a boca e as mãos por {duration.label}.',
    points: { love: 3, fire: 5 }
  },
  {
    id: 'a_breasts_modifier',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_breasts'],
    slots: {
      modifier: { pool: 'modifier' },
      duration: { pool: 'durations', filter: { minTier: 3 } }
    },
    text: '{actor} estimula os seios de {target} por {duration.label}, {modifier.label}.',
    points: { love: 3, fire: 5 }
  },

  /* ------------------------------------------------------ estimulação */
  {
    id: 'a_manual',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_manual'],
    slots: {
      duration: { pool: 'durations', filter: { minTier: 3 } },
      style: { pool: 'touchStyle' }
    },
    text: '{actor} masturba {target} {style.label} por {duration.label}. {target} não pode fechar os olhos.',
    points: { love: 3, fire: 6 }
  },
  {
    id: 'a_manual_modifier',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_manual'],
    slots: {
      modifier: { pool: 'modifier' },
      duration: { pool: 'durations', filter: { minTier: 3 } }
    },
    text: '{actor} masturba {target} por {duration.label}, {modifier.label}.',
    points: { love: 3, fire: 6 }
  },
  {
    id: 'a_mutual',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['sexual_manual'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} e {target} se tocam ao mesmo tempo por {duration.label}. Quem gemer primeiro perde.',
    points: { love: 4, fire: 6 }
  },
  {
    id: 'a_anal_play',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_anal_play'],
    text: '{actor} estimula {target} na região anal, por fora, no ritmo que {target} pedir.',
    points: { love: 2, fire: 7 }
  },

  /* ------------------------------------------------------------- oral */
  {
    id: 'a_oral',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requiresActor: ['sexual_oral_give'],
    requiresTarget: ['sexual_oral_receive'],
    slots: { duration: { pool: 'durations', filter: { minTier: 4 } } },
    text: '{actor} faz sexo oral em {target} por {duration.label}.',
    points: { love: 4, fire: 7 }
  },
  {
    id: 'a_oral_position',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requiresActor: ['sexual_oral_give'],
    requiresTarget: ['sexual_oral_receive'],
    slots: { position: { pool: 'positions' } },
    text: '{actor} faz sexo oral em {target}, {position.label}.',
    points: { love: 4, fire: 7 }
  },
  {
    id: 'a_oral_edge',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [5, 5],
    targeting: 'other', visibility: 'public',
    requiresActor: ['sexual_oral_give'],
    requiresTarget: ['sexual_oral_receive', 'sexual_finish'],
    text: '{actor} leva {target} até quase o fim com a boca — e para. Repete duas vezes antes de deixar acabar.',
    points: { love: 4, fire: 8 }
  },

  /* ---------------------------------------------------- acessórios e solo */
  {
    id: 'a_toy',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_toys'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} usa um acessório sexual em {target} por {duration.label}. {target} escolhe qual.',
    points: { love: 3, fire: 6 }
  },
  {
    id: 'a_toy_choice',
    deck: 'adult', type: 'choice', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_toys'],
    text: '{target} escolhe o acessório e onde ele vai ser usado. {actor} obedece sem discutir.',
    points: { love: 3, fire: 6 }
  },
  {
    id: 'a_solo_show',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requiresActor: ['sexual_masturbation_solo', 'exposure_watched'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} se toca por {duration.label} enquanto {target} apenas assiste, sem encostar.',
    points: { love: 2, fire: 7 }
  },
  {
    id: 'a_solo_narrated',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requiresActor: ['sexual_masturbation_solo', 'exposure_watched'],
    requiresTarget: ['sexual_dirty_talk'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: '{actor} se toca por {duration.label} enquanto {target} narra em voz alta tudo o que está vendo.',
    points: { love: 3, fire: 7 }
  },

  /* ------------------------------------------------------------- atos */
  {
    id: 'a_act_choice',
    deck: 'adult', type: 'choice', minMode: 3, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    slots: { act: { pool: 'sexAct', limitKey: '{limit}' } },
    text: '{actor} escolhe: {act.label} em {target} agora, ou passar a vez e ficar devendo uma.',
    points: { love: 3, fire: 5 }
  },
  {
    id: 'a_act_position',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [4, 5],
    targeting: 'pair', visibility: 'public',
    slots: {
      act: { pool: 'sexAct', filter: { minTier: 4 }, limitKey: '{limit}' },
      position: { pool: 'positions' }
    },
    text: '{actor} e {target} vão {act.label}, {position.label}.',
    points: { love: 4, fire: 7 }
  },
  {
    id: 'a_penetration_choice',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [5, 5],
    targeting: 'pair', visibility: 'public',
    slots: { act: { pool: 'sexAct', filter: { minTier: 5 }, limitKey: '{limit}' } },
    text: '{actor} e {target} vão {act.label}. {target} escolhe a posição.',
    points: { love: 5, fire: 8 }
  },
  {
    id: 'a_random_pair_act',
    deck: 'adult', type: 'challenge', minMode: 3, minPlayers: 3, intensity: [4, 5],
    targeting: 'random_pair', visibility: 'public',
    slots: { act: { pool: 'sexAct', limitKey: '{limit}' } },
    text: 'Sorteio! {actor} e {target} — {act.label}.',
    points: { love: 3, fire: 7 }
  },
  {
    id: 'a_no_hands_finish',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [5, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_finish'],
    slots: { duration: { pool: 'durations', filter: { minTier: 4 } } },
    text: '{actor} tem {duration.label} para levar {target} ao orgasmo. Se conseguir, {target} cumpre o próximo desafio dobrado.',
    points: { love: 4, fire: 8 }
  },
  {
    id: 'a_edge_count',
    deck: 'adult', type: 'challenge', minMode: 3, intensity: [5, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_finish'],
    slots: { count: { pool: 'counts' } },
    text: '{actor} leva {target} até quase o fim {count.label} vezes antes de deixar acabar de verdade.',
    points: { love: 4, fire: 8 }
  },
  {
    id: 'a_group_act',
    deck: 'adult', type: 'challenge', minMode: 3, minPlayers: 3, intensity: [5, 5],
    targeting: 'all', visibility: 'public',
    requires: ['sexual_group', 'dyn_more_than_two'],
    text: 'Todos que aceitarem participam de um mesmo momento. Quem não quiser apenas passa.',
    points: { love: 4, fire: 9 }
  },

/* -------------------------------------------------- foco no casal */
  {
    id: 'a_couple_slow_build',
    deck: 'adult', type: 'challenge', minMode: 3, maxPlayers: 2, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['sexual_teasing', 'touch_caress'],
    slots: { duration: { pool: 'durations', filter: { minTier: 4 } } },
    text: 'Por {duration.label}, vocês só podem aumentar a intensidade — nunca repetir o que já fizeram nem voltar atrás.',
    points: { love: 5, fire: 6 }
  },
  {
    id: 'a_couple_guided',
    deck: 'adult', type: 'challenge', minMode: 3, maxPlayers: 2, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_manual', 'sexual_dirty_talk'],
    text: '{target} narra em voz alta, passo a passo, o que quer. {actor} só pode fazer exatamente o que for dito.',
    points: { love: 5, fire: 7 }
  },
  {
    id: 'a_couple_choose_part',
    deck: 'adult', type: 'choice', minMode: 3, maxPlayers: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    slots: {
      bodyPart: { pool: 'bodyParts', filter: { intimate: true }, limitKey: 'kiss_{id}' },
      duration: { pool: 'durations', filter: { minTier: 3 } }
    },
    text: '{target} escolhe: {actor} fica {duration.label} em {bodyPart.def} — e só ali.',
    points: { love: 4, fire: 7 }
  },
  {
    id: 'a_couple_denial',
    deck: 'adult', type: 'challenge', minMode: 3, maxPlayers: 2, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_teasing'],
    requiresTarget: ['bdsm_submit'],
    slots: { count: { pool: 'counts' } },
    text: '{target} tem que pedir {count.label} vezes antes de {actor} fazer qualquer coisa.',
    points: { love: 3, fire: 7 }
  },

  /* --------------------------------------------------- em grupo (3+) */
  {
    id: 'a_group_watch_pair',
    deck: 'adult', type: 'challenge', minMode: 3, minPlayers: 3, intensity: [5, 5],
    targeting: 'random_pair', visibility: 'public',
    slots: {
      act: { pool: 'sexAct', limitKey: '{limit}' },
      duration: { pool: 'durations', filter: { minTier: 3 } }
    },
    text: 'Sorteio! Por {duration.label}, {actor} vai {act.label} em {target} enquanto o grupo assiste.',
    points: { love: 3, fire: 9 }
  },
  {
    id: 'a_group_vote_act',
    deck: 'adult', type: 'choice', minMode: 3, minPlayers: 3, intensity: [4, 5],
    targeting: 'all', visibility: 'public',
    slots: { act: { pool: 'sexAct', limitKey: '{limit}' } },
    text: 'O grupo vota em quem vai {act.label} com {actor}. {actor} tem direito a um veto.',
    points: { love: 2, fire: 8 }
  }
];
