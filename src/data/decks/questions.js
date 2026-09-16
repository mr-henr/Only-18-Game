/**
 * BARALHO: PERGUNTAS
 * Disponivel desde o Modo Leve. O filtro usa `requires` para casar com
 * os limites do grupo 💬 Perguntas de cada jogador envolvido.
 *
 * As cartas com slot `topic` sao as mais produtivas do baralho: um
 * unico molde percorre os 15 temas do pool `questionTopics`, e cada
 * tema carrega o proprio limite — entao a carta se adapta sozinha ao
 * que aquele grupo liberou.
 */

export const QUESTIONS = [
  /* ------------------------------------------------- moldes por tema */
  {
    id: 'q_topic_self',
    deck: 'questions', type: 'question', minMode: 1, intensity: [1, 5],
    targeting: 'self', visibility: 'public',
    slots: { topic: { pool: 'questionTopics', limitKey: '{limit}', appliesTo: 'actor' } },
    text: '{actor}, conte para o grupo sobre {topic.label}. Sem economizar detalhes.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'q_topic_asked',
    deck: 'questions', type: 'question', minMode: 1, intensity: [1, 5],
    targeting: 'other', visibility: 'public',
    slots: { topic: { pool: 'questionTopics', limitKey: '{limit}', appliesTo: 'actor' } },
    text: '{target} quer saber de {actor}: {topic.label}. Sem enrolar.',
    points: { love: 3, fire: 2 }
  },
  {
    id: 'q_topic_guess',
    deck: 'questions', type: 'choice', minMode: 1, intensity: [1, 4],
    targeting: 'all', visibility: 'public',
    slots: { topic: { pool: 'questionTopics', limitKey: '{limit}', appliesTo: 'actor' } },
    text: 'Antes de {actor} responder, o grupo chuta: {topic.label}. Quem chegar mais perto escolhe a próxima carta.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'q_topic_private',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 5],
    targeting: 'self', visibility: 'private',
    slots: { topic: { pool: 'questionTopics', limitKey: '{limit}', appliesTo: 'actor' } },
    text: '{actor}, pense na sua resposta sobre {topic.label}. Você decide se conta ou guarda para você.',
    points: { love: 2, fire: 1 }
  },

  /* ------------------------------------------------- perguntas fixas */
  {
    id: 'q_first_impression',
    deck: 'questions', type: 'question', minMode: 1, intensity: [1, 2],
    targeting: 'other', visibility: 'public',
    requires: ['q_about_present'],
    text: '{actor}, qual foi sua primeira impressão sobre {target} — e o quanto ela mudou?',
    points: { love: 2, fire: 0 }
  },
  {
    id: 'q_attractive_trait',
    deck: 'questions', type: 'question', minMode: 1, intensity: [1, 3],
    targeting: 'other', visibility: 'public',
    requires: ['q_about_present', 'q_body_opinion'],
    text: '{actor}, qual parte do corpo de {target} chama mais sua atenção?',
    points: { love: 2, fire: 1 }
  },
  {
    id: 'q_rate_boldness',
    deck: 'questions', type: 'question', minMode: 1, intensity: [1, 3],
    targeting: 'other', visibility: 'public',
    requires: ['q_about_present'],
    text: '{actor}, dê uma nota de 0 a 10 para a ousadia de {target} — e justifique a nota.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'q_room_attraction',
    deck: 'questions', type: 'question', minMode: 1, minPlayers: 3, intensity: [2, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_attraction', 'q_about_present'],
    text: '{actor}, se você tivesse que ficar com alguém desta sala que não seja seu parceiro, quem seria e por quê?',
    points: { love: 1, fire: 3 }
  },
  {
    id: 'q_would_you_accept',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    requires: ['q_attraction', 'q_about_present'],
    text: '{actor}: se {target} te chamasse agora, você aceitaria? Responda só sim ou não, sem explicar.',
    points: { love: 1, fire: 4 }
  },
  {
    id: 'q_first_time',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_sexual_experiences'],
    text: '{actor}, conte como foi sua primeira vez. Sem pular a parte constrangedora.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'q_weirdest_place',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_sexual_experiences'],
    text: '{actor}, qual foi o lugar mais inusitado em que você já transou?',
    points: { love: 1, fire: 3 }
  },
  {
    id: 'q_body_count',
    deck: 'questions', type: 'question', minMode: 1, intensity: [3, 5],
    targeting: 'self', visibility: 'public',
    requires: ['q_sexual_experiences', 'q_embarrassing'],
    text: '{actor}, com quantas pessoas você já transou? Número exato.',
    points: { love: 0, fire: 4 }
  },
  {
    id: 'q_fantasy_never_told',
    deck: 'questions', type: 'question', minMode: 1, intensity: [3, 5],
    targeting: 'self', visibility: 'public',
    requires: ['q_fantasies'],
    text: '{actor}, qual é a fantasia que você nunca teve coragem de contar para ninguém?',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'q_fantasy_with_target',
    deck: 'questions', type: 'question', minMode: 2, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['q_fantasies', 'q_about_present'],
    text: '{actor}, descreva em detalhes o que você faria com {target} se não houvesse nenhuma regra.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'q_preference_position',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_sexual_preferences'],
    text: '{actor}, qual sua posição favorita e por quê exatamente essa?',
    points: { love: 1, fire: 2 }
  },
  {
    id: 'q_preference_dominance',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_sexual_preferences'],
    text: '{actor}, você prefere mandar ou obedecer na cama? Seja honesto.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'q_turn_on',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_sexual_preferences'],
    text: '{actor}, o que alguém pode fazer que te deixa excitado na hora?',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'q_scale_tonight',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 5],
    targeting: 'self', visibility: 'public',
    requires: ['q_intimate_personal'],
    text: '{actor}, de 1 a 10: o quanto você quer que esta noite acabe em alguma coisa?',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'q_jealousy_moment',
    deck: 'questions', type: 'question', minMode: 1, intensity: [1, 3],
    targeting: 'self', visibility: 'public',
    requires: ['q_jealousy'],
    text: '{actor}, qual foi a vez que você sentiu mais ciúme — e o que você fez?',
    points: { love: 3, fire: 1 }
  },
  {
    id: 'q_ex_comparison',
    deck: 'questions', type: 'question', minMode: 1, intensity: [3, 5],
    targeting: 'self', visibility: 'public',
    requires: ['q_past_relationships', 'q_embarrassing'],
    text: '{actor}, o que um ex fazia que você sente falta?',
    points: { love: 1, fire: 3 }
  },
  {
    id: 'q_worst_sex',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_sexual_experiences', 'q_embarrassing'],
    text: '{actor}, conte a vez mais constrangedora que você já passou transando.',
    points: { love: 1, fire: 3 }
  },
  {
    id: 'q_secret_confession',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 5],
    targeting: 'self', visibility: 'public',
    requires: ['q_confession'],
    text: '{actor}, confesse algo que ninguém nesta sala sabe sobre você.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'q_private_wish',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 5],
    targeting: 'self', visibility: 'private',
    requires: ['q_fantasies'],
    text: '{actor}, escreva mentalmente o que você mais quer que aconteça nesta noite. Você decide se conta ou não.',
    points: { love: 2, fire: 1 }
  },
  {
    id: 'q_intimate_personal',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 4],
    targeting: 'self', visibility: 'public',
    requires: ['q_intimate_personal'],
    text: '{actor}, com que frequência você se masturba? Responda sem arredondar.',
    points: { love: 0, fire: 3 }
  },

  /* ------------------------------------------------ dinâmicas de grupo */
  {
    id: 'q_two_truths',
    deck: 'questions', type: 'choice', minMode: 1, intensity: [1, 3],
    targeting: 'all', visibility: 'public',
    requires: ['q_intimate_personal'],
    text: '{actor} conta três coisas picantes sobre si — duas verdadeiras e uma mentira. Os outros votam na mentira.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'q_group_vote_bold',
    deck: 'questions', type: 'choice', minMode: 1, minPlayers: 3, intensity: [1, 3],
    targeting: 'all', visibility: 'public',
    requires: ['q_about_present'],
    text: 'Todos apontam ao mesmo tempo: quem aqui é o mais safado? {actor} conta os votos.',
    points: { love: 1, fire: 2 }
  },
  {
    id: 'q_group_vote_kisser',
    deck: 'questions', type: 'choice', minMode: 1, minPlayers: 3, intensity: [1, 4],
    targeting: 'all', visibility: 'public',
    requires: ['q_about_present'],
    text: 'Todos apontam ao mesmo tempo: quem aqui beija melhor, no chute? {actor} conta os votos.',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'q_group_vote_first',
    deck: 'questions', type: 'choice', minMode: 1, minPlayers: 3, intensity: [2, 4],
    targeting: 'all', visibility: 'public',
    requires: ['q_about_present'],
    text: 'Todos apontam: quem aqui vai ser o primeiro a topar um desafio pesado hoje? {actor} conta os votos.',
    points: { love: 1, fire: 3 }
  },
  {
    id: 'q_group_one_word',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['q_confession'],
    text: 'Ao mesmo tempo, cada um diz UMA palavra: o que você faria agora se ninguém fosse julgar?',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'q_target_asks',
    deck: 'questions', type: 'question', minMode: 1, intensity: [2, 5],
    targeting: 'other', visibility: 'public',
    requires: ['q_intimate_personal', 'q_embarrassing'],
    text: '{target} faz UMA pergunta livre para {actor}. Não vale mentir.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'q_never_have_i',
    deck: 'questions', type: 'choice', minMode: 1, intensity: [1, 4],
    targeting: 'all', visibility: 'public',
    requires: ['q_sexual_experiences'],
    text: '{actor} diz um "eu nunca" de teor sexual. Quem já fez, levanta a mão.',
    points: { love: 2, fire: 2 }
  },

  /* ----------------------------------------------------- modo adulto */
  {
    id: 'q_dirty_description',
    deck: 'questions', type: 'question', minMode: 3, intensity: [4, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_dirty_talk'],
    text: '{actor}, descreva em voz alta, com todas as palavras, o que você quer fazer com {target} agora.',
    points: { love: 2, fire: 5 }
  },
  {
    id: 'q_dirty_instructions',
    deck: 'questions', type: 'question', minMode: 3, intensity: [3, 5],
    targeting: 'other', visibility: 'public',
    requires: ['sexual_dirty_talk', 'q_sexual_preferences'],
    text: '{actor}, explique para {target} exatamente como você gosta de ser tocado. Com detalhe, não por cima.',
    points: { love: 4, fire: 4 }
  },

/* ------------------------------------------------ dinâmicas de grupo */
  {
    id: 'q_point_wildest',
    deck: 'questions', type: 'choice', minMode: 1, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['q_sexual_experiences', 'q_about_present'],
    text: 'Todos apontam ao mesmo tempo: quem aqui já fez a maior loucura na cama? O mais votado conta.',
    points: { love: 2, fire: 4 }
  },
  {
    id: 'q_point_body',
    deck: 'questions', type: 'choice', minMode: 1, minPlayers: 3, intensity: [1, 4],
    targeting: 'all', visibility: 'public',
    requires: ['q_body_opinion', 'q_about_present'],
    text: 'Todos apontam: quem aqui tem o corpo mais bonito? {actor} conta os votos e ninguém pode votar em si mesmo.',
    points: { love: 2, fire: 3 }
  },
  {
    id: 'q_unlikely_couple',
    deck: 'questions', type: 'choice', minMode: 1, minPlayers: 3, intensity: [1, 4],
    targeting: 'all', visibility: 'public',
    requires: ['q_about_present'],
    text: '{actor} escolhe dois jogadores. O grupo vota: esse casal daria certo ou seria um desastre?',
    points: { love: 2, fire: 2 }
  },
  {
    id: 'q_swap_partners',
    deck: 'questions', type: 'question', minMode: 1, minPlayers: 3, intensity: [3, 5],
    targeting: 'all', visibility: 'public',
    requires: ['q_attraction', 'q_about_present'],
    text: 'Se todo mundo trocasse de par agora, com quem cada um ficaria? {actor} começa e ninguém pode repetir a escolha anterior.',
    points: { love: 1, fire: 5 }
  },
  {
    id: 'q_secret_number',
    deck: 'questions', type: 'choice', minMode: 1, minPlayers: 3, intensity: [1, 4],
    targeting: 'all', visibility: 'private',
    requires: ['q_intimate_personal'],
    text: 'Cada um escreve em segredo, de 0 a 10, o quanto quer que esta noite avance. {actor} lê só a média em voz alta.',
    points: { love: 3, fire: 3 }
  },
  {
    id: 'q_chain_question',
    deck: 'questions', type: 'question', minMode: 1, minPlayers: 3, intensity: [2, 5],
    targeting: 'all', visibility: 'public',
    requires: ['q_intimate_personal'],
    text: 'Corrente: {actor} faz uma pergunta íntima para quem está à direita, que responde e pergunta para o próximo — até fechar a roda.',
    points: { love: 4, fire: 3 }
  },

  /* --------------------------------------------------- foco no casal */
  {
    id: 'q_couple_first',
    deck: 'questions', type: 'question', minMode: 1, maxPlayers: 2, intensity: [1, 3],
    targeting: 'pair', visibility: 'public',
    requires: ['q_confession'],
    text: 'Qual foi o momento exato em que vocês dois souberam que queriam mais do que amizade?',
    points: { love: 5, fire: 1 }
  },
  {
    id: 'q_couple_best_night',
    deck: 'questions', type: 'question', minMode: 1, maxPlayers: 2, intensity: [2, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['q_sexual_experiences'],
    text: 'Cada um descreve, em detalhe, a melhor noite que já tiveram juntos. Vocês vão discordar sobre qual foi.',
    points: { love: 5, fire: 3 }
  },
  {
    id: 'q_couple_never_asked',
    deck: 'questions', type: 'question', minMode: 1, maxPlayers: 2, intensity: [2, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['q_intimate_personal'],
    text: 'Faça a pergunta que você nunca teve coragem de fazer para a pessoa na sua frente.',
    points: { love: 5, fire: 4 }
  },
  {
    id: 'q_couple_wish_list',
    deck: 'questions', type: 'question', minMode: 1, maxPlayers: 2, intensity: [3, 5],
    targeting: 'pair', visibility: 'public',
    requires: ['q_fantasies'],
    text: 'Cada um diz três coisas que quer experimentar com o outro. Se alguma se repetir nas duas listas, façam hoje.',
    points: { love: 5, fire: 5 }
  }
];
