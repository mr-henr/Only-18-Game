/**
 * BARALHO: DESAFIOS SOCIAIS (Modo 1+)
 * Desafios de coragem, constrangimento e interacao que funcionam em
 * grupo de amigos sem nudez nem contato sexual.
 *
 * E o baralho que sustenta o Modo Leve, entao a maioria das cartas tem
 * `minMode: 1` e usa slots de tempero (`modifier`, `place`, `duration`)
 * para nao repetir na mesma noite.
 */

export const DARES = [
  /* ---------------------------------------------------- individuais */
  {
    id: 'd_sexy_walk',
    deck: 'dares', type: 'challenge', minMode: 1, intensity: [1, 3],
    targeting: 'self', visibility: 'public',
    requires: ['q_embarrassing'],
    text: '{actor}, atravesse o ambiente do jeito mais sensual que conseguir. O grupo dá nota de 0 a 10.',
    text2: '{actor}, atravesse o ambiente do jeito mais sensual que conseguir. {target} dá uma nota de 0 a 10.',
    points: { love: 1, fire: 3 }
  },
  {
    id: 'd_pose_place',
    deck: 'dares', type: 'challenge', minMode: 1, intensity: [1, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_embarrassing'],
    slots: { place: { pool: 'places' }, modifier: { pool: 'modifier' } },
    text: '{actor} faz a pose mais sensual que conseguir {place.label}, {modifier.label}. O grupo dá nota.',
    text2: '{actor} faz a pose mais sensual que conseguir {place.label}, {modifier.label}. {target} dá a nota.',
    points: { love: 1, fire: 3 }
  },
  {
    id: 'd_moan',
    deck: 'dares', type: 'challenge', minMode: 1, intensity: [2, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_embarrassing'],
    slots: { duration: { pool: 'durations' } },
    text: '{actor}, gema de forma convincente por {duration.label}. Olhando para o grupo.',
    text2: '{actor}, gema de forma convincente por {duration.label}. Olhando nos olhos, sem rir.',
    points: { love: 0, fire: 4 }
  },
  {
    id: 'd_fake_call',
    deck: 'dares', type: 'challenge', minMode: 1, intensity: [2, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_embarrassing'],
    text: '{actor} finge uma ligação e descreve, muito sério, o que está acontecendo nesta sala.',
    points: { love: 1, fire: 3 }
  },
  {
    id: 'd_read_messages',
    deck: 'dares', type: 'challenge', minMode: 1, intensity: [3, 5],
    targeting: 'self', visibility: 'public',
    requires: ['q_confession', 'q_past_relationships'],
    text: '{actor}, abra suas conversas e leia em voz alta a última mensagem picante que você enviou.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'd_truth_or_double',
    deck: 'dares', type: 'choice', minMode: 1, intensity: [2, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_intimate_personal'],
    text: '{actor} escolhe: responder uma pergunta íntima do grupo, ou cumprir o próximo desafio com intensidade dobrada.',
    text2: '{actor} escolhe: responder uma pergunta íntima, ou cumprir o próximo desafio com intensidade dobrada.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'd_private_dare',
    deck: 'dares', type: 'challenge', minMode: 1, intensity: [2, 5],
    targeting: 'self', visibility: 'private',
    requires: ['q_confession'],
    text: '{actor}, escolha em segredo o jogador que mais te deixou curioso nesta noite. Você não precisa revelar.',
    points: { love: 2, fire: 2 }
  },

  /* ------------------------------------------------- com outro jogador */
  {
    id: 'd_impersonate',
    deck: 'dares', type: 'challenge', minMode: 1, minPlayers: 3, intensity: [1, 2],
    targeting: 'other', visibility: 'public',
    requires: ['q_about_present'],
    text: '{actor}, imite {target} até alguém do grupo acertar quem é.',
    points: { love: 1, fire: 2 }
  },
  {
    id: 'd_compliment_modifier',
    deck: 'dares', type: 'connection', minMode: 1, intensity: [1, 3],
    targeting: 'other', visibility: 'public',
    requires: ['q_body_opinion'],
    slots: { modifier: { pool: 'modifier' }, count: { pool: 'counts' } },
    text: '{actor} faz {count.label} elogios para {target}, {modifier.label}. Não vale repetir palavra.',
    points: { love: 4, fire: 1 }
  },
  {
    id: 'd_pickup_line',
    deck: 'dares', type: 'challenge', minMode: 1, intensity: [1, 3],
    targeting: 'other', visibility: 'public',
    requires: ['q_about_present'],
    text: '{actor} tenta uma cantada em {target}. Se {target} rir, {actor} tenta de novo com outra.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'd_truth_serum',
    deck: 'dares', type: 'challenge', minMode: 1, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    requires: ['q_intimate_personal'],
    text: '{actor} faz uma pergunta para {target}. Se {target} não responder, cumpre o próximo desafio dobrado.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'd_body_language',
    deck: 'dares', type: 'challenge', minMode: 1, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    requires: ['q_fantasies', 'q_about_present'],
    text: '{actor} tem que dizer com o corpo, sem falar nenhuma palavra, o que gostaria que {target} fizesse.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'd_staring',
    deck: 'dares', type: 'connection', minMode: 1, intensity: [1, 3],
    targeting: 'pair', visibility: 'public',
    slots: { duration: { pool: 'durations' }, modifier: { pool: 'modifier' } },
    text: '{actor} e {target} se encaram por {duration.label}, {modifier.label}. Quem desviar primeiro perde.',
    points: { love: 3, fire: 1 }
  },
  {
    id: 'd_mirror_move',
    deck: 'dares', type: 'challenge', minMode: 1, intensity: [1, 4],
    targeting: 'pair', visibility: 'public',
    text: '{actor} faz um movimento e {target} repete igual, cada rodada mais ousado. Quem travar primeiro perde.',
    points: { love: 2, fire: 3 }
  },

  /* ------------------------------------------------------- em grupo */
  {
    id: 'd_compliment_round',
    deck: 'dares', type: 'connection', minMode: 1, intensity: [1, 2],
    targeting: 'all', visibility: 'public',
    requires: ['q_body_opinion'],
    text: '{actor} faz um elogio sincero e específico para cada jogador. Sem repetir palavra.',
    text2: '{actor} faz três elogios sinceros e específicos para {target}. Sem repetir palavra.',
    points: { love: 4, fire: 1 }
  },
  {
    id: 'd_group_vote_challenge',
    deck: 'dares', type: 'choice', minMode: 1, minPlayers: 3, intensity: [2, 4],
    targeting: 'all', visibility: 'public',
    requires: ['q_about_present'],
    text: 'O grupo vota em um desafio para {actor}. Se não houver acordo em 30 segundos, {actor} escapa.',
    points: { love: 1, fire: 3 }
  },
  {
    id: 'd_group_ranking',
    deck: 'dares', type: 'challenge', minMode: 1, minPlayers: 3, intensity: [2, 4],
    targeting: 'all', visibility: 'public',
    requires: ['q_about_present'],
    text: '{actor} coloca todo mundo em ordem, do mais tímido ao mais safado — e justifica cada posição.',
    points: { love: 1, fire: 4 }
  },
  {
    id: 'd_group_freeze',
    deck: 'dares', type: 'challenge', minMode: 1, intensity: [1, 3],
    targeting: 'all', visibility: 'public',
    slots: { duration: { pool: 'durations' } },
    text: 'Ao sinal de {actor}, todos congelam na posição em que estiverem por {duration.label}. Quem se mexer paga uma prenda.',
    text2: 'Ao sinal de {actor}, os dois congelam na posição em que estiverem por {duration.label}. Quem se mexer paga uma prenda.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'd_group_secret_vote',
    deck: 'dares', type: 'choice', minMode: 1, minPlayers: 3, intensity: [1, 4],
    targeting: 'all', visibility: 'private',
    requires: ['q_about_present'],
    text: 'Cada um escolhe em segredo quem foi o mais ousado até agora. {actor} recolhe e anuncia só o resultado.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'd_group_seats',
    deck: 'dares', type: 'challenge', minMode: 1, minPlayers: 3, intensity: [1, 3],
    targeting: 'all', visibility: 'public',
    requires: ['touch_sit_close'],
    text: 'Todos trocam de lugar. {actor} decide quem senta ao lado de quem pelo resto da rodada.',
    points: { love: 2, fire: 2 }
  },

  /* ---------------------------------------------- sorteio entre dois */
  {
    id: 'd_random_pair_common',
    deck: 'dares', type: 'connection', minMode: 1, minPlayers: 3, intensity: [1, 3],
    targeting: 'random_pair', visibility: 'public',
    requires: ['q_intimate_personal'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: 'Sorteio! {actor} e {target} têm {duration.label} para descobrir algo em comum que mais ninguém aqui sabe.',
    points: { love: 4, fire: 1 }
  },
  {
    id: 'd_random_pair_dare',
    deck: 'dares', type: 'challenge', minMode: 1, minPlayers: 3, intensity: [2, 5],
    targeting: 'random_pair', visibility: 'public',
    requires: ['q_about_present'],
    text: 'Sorteio! {actor} e {target} cumprem juntos o próximo desafio, enquanto o resto do grupo assiste.',
    points: { love: 3, fire: 3 }
  },

  /* -------------------------------------------------- modo ousado+ */
  {
    id: 'd_ice_cube',
    deck: 'dares', type: 'challenge', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    slots: { bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' } },
    text: '{actor} passa um cubo de gelo em {target} — {bodyPart.em} — até derreter ou {target} pedir para parar.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'd_statue',
    deck: 'dares', type: 'challenge', minMode: 2, intensity: [2, 4],
    targeting: 'other', visibility: 'public',
    requires: ['touch_caress'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{target} fica imóvel por {duration.label}. {actor} tenta fazer {target} se mexer — sem ultrapassar nenhum limite marcado.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'd_tickle',
    deck: 'dares', type: 'challenge', minMode: 2, intensity: [2, 4],
    targeting: 'other', visibility: 'public',
    requires: ['touch_caress'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} tem {duration.label} para fazer {target} rir sem usar as mãos.',
    points: { love: 3, fire: 2 }
  },

/* ------------------------------------------- jogos coletivos (3+) */
  {
    id: 'd_hot_seat',
    deck: 'dares', type: 'challenge', minMode: 1, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['q_intimate_personal'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: 'Cadeira quente: por {duration.label}, {actor} responde tudo que o grupo perguntar. Sem passar nenhuma.',
    points: { love: 3, fire: 4 }
  },
  {
    id: 'd_chain_compliment',
    deck: 'dares', type: 'connection', minMode: 1, minPlayers: 3, intensity: [1, 3],
    targeting: 'all', visibility: 'public',
    requires: ['q_body_opinion'],
    text: 'Corrente de elogios: {actor} elogia quem está à direita, que elogia o próximo. Quem repetir um elogio já dito, paga prenda.',
    points: { love: 4, fire: 1 }
  },
  {
    id: 'd_group_pose',
    deck: 'dares', type: 'challenge', minMode: 1, minPlayers: 3, intensity: [1, 4],
    targeting: 'all', visibility: 'public',
    requires: ['touch_sit_close'],
    text: 'Todos montam uma foto de grupo na pose que {actor} mandar. Segurem até {actor} contar até dez.',
    points: { love: 3, fire: 2 }
  },
  {
    id: 'd_last_laugh',
    deck: 'dares', type: 'challenge', minMode: 1, minPlayers: 3, intensity: [1, 3],
    targeting: 'all', visibility: 'public',
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: '{actor} tem {duration.label} para fazer o grupo rir. Quem rir primeiro cumpre o próximo desafio.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'd_pass_object',
    deck: 'dares', type: 'challenge', minMode: 1, minPlayers: 3, intensity: [2, 4],
    targeting: 'all', visibility: 'public',
    requires: ['touch_sit_close', 'touch_non_partner'],
    text: 'Todos passam um objeto de mão em mão sem usar os dedos. Quem derrubar paga prenda.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'd_vote_safest',
    deck: 'dares', type: 'choice', minMode: 1, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['q_about_present'],
    text: 'O grupo vota em quem está jogando mais seguro até agora. Essa pessoa cumpre a próxima carta no lugar de quem sair.',
    points: { love: 1, fire: 4 }
  },
  {
    id: 'd_random_pair_defend',
    deck: 'dares', type: 'challenge', minMode: 1, minPlayers: 3, intensity: [1, 4],
    targeting: 'random_pair', visibility: 'public',
    requires: ['q_sexual_preferences'],
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: 'Sorteio! {actor} e {target} têm {duration.label} para defender lados opostos de um debate safado que o grupo escolher.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'd_random_pair_mimic',
    deck: 'dares', type: 'challenge', minMode: 1, minPlayers: 3, intensity: [2, 5],
    targeting: 'random_pair', visibility: 'public',
    requires: ['q_embarrassing'],
    text: 'Sorteio! {actor} e {target} encenam, sem falar, uma cena picante que o grupo tem que adivinhar.',
    points: { love: 2, fire: 4 }
  },

  /* ------------------------------------------------- foco no casal */
  {
    id: 'd_couple_memory',
    deck: 'dares', type: 'connection', minMode: 1, maxPlayers: 2, intensity: [1, 3],
    targeting: 'pair', visibility: 'public',
    slots: { duration: { pool: 'durations', filter: { minTier: 2 } } },
    text: 'Em {duration.label}, cada um descreve o outro para um estranho imaginário — sem dizer nada sobre aparência.',
    points: { love: 5, fire: 1 }
  },
  {
    id: 'd_couple_guess_answer',
    deck: 'dares', type: 'challenge', minMode: 1, maxPlayers: 2, intensity: [1, 4],
    targeting: 'pair', visibility: 'public',
    requires: ['q_sexual_preferences'],
    text: '{actor} tenta adivinhar o que {target} respondeu na última pergunta antes de {target} falar. Se acertar, {target} paga prenda.',
    points: { love: 4, fire: 3 }
  },
  {
    id: 'd_couple_role_play',
    deck: 'dares', type: 'challenge', minMode: 1, maxPlayers: 2, intensity: [2, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['q_fantasies'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: 'Por {duration.label}, vocês dois são outras duas pessoas que acabaram de se conhecer. {actor} escolhe quem são.',
    points: { love: 4, fire: 4 }
  },
  {
    id: 'd_couple_silent_minute',
    deck: 'dares', type: 'connection', minMode: 1, maxPlayers: 2, intensity: [1, 3],
    targeting: 'pair', visibility: 'public',
    requires: ['touch_sit_close'],
    slots: { duration: { pool: 'durations', filter: { minTier: 3 } } },
    text: 'Por {duration.label}, nenhum dos dois pode falar. Só olhar, e reagir ao que o outro fizer.',
    points: { love: 5, fire: 2 }
  }
];
