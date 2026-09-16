/**
 * MODOS DE JOGO
 * ------------------------------------------------------------------
 * O modo define o TETO do conteudo (`tier`). Nenhuma configuracao
 * individual de limites consegue furar esse teto: itens do catalogo
 * com `minMode` acima do tier do modo simplesmente nao sao carregados.
 *
 * `policy` define o estado inicial sugerido de cada grupo de limites
 * quando o jogador abre a tela de configuracao. Ele pode ajustar tudo
 * item por item depois.
 */

export const LIMIT_STATES = {
  ALLOW: 'allow',
  ASK: 'ask',
  BLOCK: 'block',
  UNSET: 'unset',
  UNAVAILABLE: 'unavailable'
};

/** Severidade para o calculo do "pior estado" entre os envolvidos. */
export const STATE_SEVERITY = {
  [LIMIT_STATES.ALLOW]: 0,
  [LIMIT_STATES.ASK]: 1,
  [LIMIT_STATES.BLOCK]: 2,
  [LIMIT_STATES.UNSET]: 2,
  [LIMIT_STATES.UNAVAILABLE]: 3
};

export const GAME_MODES = {
  leve: {
    id: 'leve',
    tier: 1,
    icon: '🌙',
    name: 'Leve',
    subtitle: 'Amigos',
    tagline: 'Perguntas picantes, constrangimento e desafios sociais. Sem nudez, sem sexo.',
    maxIntensity: 3,
    minPlayers: 2,
    maxPlayers: 10,
    fastFlow: false,
    policy: {
      questions: 'allow',
      kisses: 'block',
      touch: 'ask',
      clothing: 'block',
      sexual: 'block',
      body: 'ask',
      bdsm: 'block',
      exposure: 'block',
      dynamics: 'allow'
    },
    overrides: {
      touch_hug: 'allow',
      touch_hands: 'allow',
      touch_sit_close: 'allow',
      touch_arms: 'allow',
      body_hands: 'allow',
      body_arms: 'allow',
      body_back: 'allow',
      body_feet: 'ask'
    }
  },

  ousado: {
    id: 'ousado',
    tier: 2,
    icon: '🔥',
    name: 'Ousado',
    subtitle: 'Ate a nudez, sem sexo',
    tagline: 'Contato fisico, beijos e a roupa saindo ate o fim. Nada de contato sexual.',
    maxIntensity: 4,
    minPlayers: 2,
    maxPlayers: 8,
    fastFlow: false,
    policy: {
      questions: 'allow',
      kisses: 'ask',
      touch: 'allow',
      clothing: 'ask',
      sexual: 'block',
      body: 'ask',
      bdsm: 'block',
      exposure: 'block',
      dynamics: 'allow'
    },
    overrides: {
      kisses_face: 'allow',
      kiss_forehead: 'allow',
      kiss_hands: 'allow',
      kiss_neck: 'ask',
      clothing_accessories: 'allow',
      clothing_shoes: 'allow',
      clothing_socks: 'allow',
      clothing_coat: 'allow',
      // O teto deste modo e a nudez: existe, mas o jogo pergunta antes.
      clothing_underwear: 'ask',
      clothing_partial_nude: 'ask',
      clothing_full_nude: 'ask',
      bdsm_orders: 'ask',
      bdsm_blindfold: 'ask'
    }
  },

  adulto: {
    id: 'adulto',
    tier: 3,
    icon: '🔥🔥',
    name: 'Adulto',
    subtitle: 'Contato sexual',
    tagline: 'Aqui comeca o contato fisico sexual. Cada jogador define exatamente o que entra.',
    maxIntensity: 5,
    minPlayers: 2,
    maxPlayers: 6,
    fastFlow: false,
    policy: {
      questions: 'allow',
      kisses: 'allow',
      touch: 'allow',
      clothing: 'allow',
      sexual: 'ask',
      body: 'ask',
      bdsm: 'ask',
      exposure: 'block',
      dynamics: 'allow'
    },
    overrides: {
      sexual_penetration_anal: 'block',
      sexual_toys: 'ask',
      exposure_body_players: 'ask'
    }
  },

  batePronto: {
    id: 'batePronto',
    tier: 3,
    icon: '⚡',
    name: 'Bate-Pronto',
    subtitle: 'Sem burocracia',
    tagline: 'Define limites uma vez e joga. Rola, revela, faz. Sem pontuacao, sem enrolacao.',
    maxIntensity: 5,
    minPlayers: 2,
    maxPlayers: 4,
    fastFlow: true,
    startIntensity: 3,
    policy: {
      questions: 'ask',
      kisses: 'allow',
      touch: 'allow',
      clothing: 'allow',
      sexual: 'allow',
      body: 'allow',
      bdsm: 'ask',
      exposure: 'block',
      dynamics: 'allow'
    },
    overrides: {
      sexual_penetration_anal: 'ask',
      bdsm_restraint: 'ask',
      bdsm_tie_self: 'ask'
    }
  },

  livre: {
    id: 'livre',
    tier: 3,
    icon: '🛠️',
    name: 'Livre',
    subtitle: '100% personalizado',
    tagline: 'Tudo disponivel, nada ligado por padrao. Voce monta a partida item por item.',
    maxIntensity: 5,
    minPlayers: 2,
    maxPlayers: 8,
    fastFlow: false,
    custom: true,
    wishlist: true,
    policy: {
      questions: 'ask',
      kisses: 'unset',
      touch: 'unset',
      clothing: 'unset',
      sexual: 'unset',
      body: 'unset',
      bdsm: 'unset',
      exposure: 'unset',
      dynamics: 'allow'
    },
    overrides: {}
  }
};

export const MODE_ORDER = ['leve', 'ousado', 'adulto', 'batePronto', 'livre'];

export function getMode(id) {
  const mode = GAME_MODES[id];
  if (!mode) throw new Error(`Modo de jogo desconhecido: ${id}`);
  return mode;
}

/**
 * Os cinco niveis de intensidade.
 *
 * Intensidade e DIFERENTE de modo: o modo decide o que pode existir na
 * mesa, a intensidade decide o quao longe se vai dentro disso. Por isso
 * a descricao fala de "ousadia", e nao de atos especificos — o mesmo
 * nivel 3 rende coisas diferentes no Leve e no Adulto.
 */
export const INTENSITY_LEVELS = [
  {
    level: 1, icon: '🌙', name: 'Leve',
    hint: 'Só o começo: perguntas, brincadeira e aproximação.',
    exemplo: 'Ex.: contar uma história constrangedora, elogiar alguém, dar as mãos.'
  },
  {
    level: 2, icon: '✨', name: 'Clima',
    hint: 'Começa a provocar: mais proximidade e perguntas mais diretas.',
    exemplo: 'Ex.: sentar no colo, se encarar sem rir, perguntas sobre preferências.'
  },
  {
    level: 3, icon: '🔥', name: 'Intensa',
    hint: 'As cartas ousadas do modo que vocês escolheram entram aqui.',
    exemplo: 'Ex.: massagem, beijo demorado, peça de roupa saindo — se o modo permitir.'
  },
  {
    level: 4, icon: '🔥🔥', name: 'Adulta',
    hint: 'O conteúdo mais forte que o modo escolhido permite.',
    exemplo: 'Ex.: nudez e contato explícito — de novo, só até onde o modo deixa.'
  },
  {
    level: 5, icon: '🔥🔥🔥', name: 'Sem freio',
    hint: 'Sem meio-termo: tudo que o modo e os seus limites deixarem passar.',
    exemplo: 'Nenhuma carta fica de fora por ser forte demais — só pelos seus limites.'
  }
];
