/**
 * DADOS
 * ==================================================================
 * Tres dados com funcoes diferentes, como definido no GDD:
 *   D1 QUEM  -> sugere o alvo da acao
 *   D2 TIPO  -> sugere a natureza da carta
 *   D3 CALOR -> ajusta a intensidade daquele turno
 *
 * O resultado e uma SUGESTAO para o ContentFilter. Se nao existir carta
 * viavel dentro dos limites, o filtro afrouxa sozinho — o dado nunca
 * pode forcar conteudo que alguem bloqueou.
 */

export const DIE_WHO = [
  { face: 1, id: 'self',    icon: '🙋', label: 'VOCÊ',     hint: 'A ação é sua, sozinho.' },
  { face: 2, id: 'other',   icon: '👉', label: 'OUTRO',    hint: 'Com outro jogador.' },
  { face: 3, id: 'partner', icon: '❤️', label: 'PARCEIRO', hint: 'Com o seu par.' },
  { face: 4, id: 'random',  icon: '🎯', label: 'SORTEIO',  hint: 'O jogo escolhe com quem.' },
  { face: 5, id: 'all',     icon: '👥', label: 'TODOS',    hint: 'O grupo inteiro entra.' },
  { face: 6, id: 'free',    icon: '✨', label: 'LIVRE',    hint: 'O jogo decide o melhor alvo.' }
];

export const DIE_TYPE = [
  { face: 1, id: 'question',   icon: '💬', label: 'PERGUNTA' },
  { face: 2, id: 'challenge',  icon: '🎯', label: 'DESAFIO' },
  { face: 3, id: 'connection', icon: '💞', label: 'CONEXÃO' },
  { face: 4, id: 'choice',     icon: '🎭', label: 'ESCOLHA' },
  { face: 5, id: 'challenge',  icon: '🔥', label: 'DESAFIO' },
  { face: 6, id: null,         icon: '🃏', label: 'CORINGA' }
];

export const DIE_HEAT = [
  { face: 1, delta: -1, icon: '🌙', label: 'CALMA' },
  { face: 2, delta: 0,  icon: '✨', label: 'NORMAL' },
  { face: 3, delta: 0,  icon: '✨', label: 'NORMAL' },
  { face: 4, delta: 1,  icon: '🔥', label: 'SOBE' },
  { face: 5, delta: 1,  icon: '🔥', label: 'SOBE' },
  { face: 6, delta: 2,  icon: '💥', label: 'EXPLODE' }
];

const TARGETING_BY_WHO = {
  self: ['self'],
  other: ['other', 'pair'],
  partner: ['other', 'pair'],
  random: ['other', 'pair', 'random_pair'],
  all: ['all'],
  free: null
};

export function rollDice(rng = Math.random) {
  const pick = (die) => die[Math.floor(rng() * die.length)];
  return { who: pick(DIE_WHO), type: pick(DIE_TYPE), heat: pick(DIE_HEAT) };
}

/**
 * Converte a rolagem em restricoes para o ContentFilter.
 * `players` e `current` sao usados apenas para resolver o alvo do
 * resultado PARCEIRO / SORTEIO.
 */
export function diceToFilter(roll, { players, current, intensity, maxIntensity, rng = Math.random }) {
  const effective = Math.min(
    Math.max(1, intensity + roll.heat.delta),
    maxIntensity
  );

  let forceTargetId = null;
  if (roll.who.id === 'partner' && current.partnerId) {
    forceTargetId = current.partnerId;
  } else if (roll.who.id === 'random') {
    const others = players.filter((p) => p.id !== current.id);
    if (others.length) forceTargetId = others[Math.floor(rng() * others.length)].id;
  }

  return {
    intensity: effective,
    onlyType: roll.type.id,
    onlyTargeting: TARGETING_BY_WHO[roll.who.id],
    forceTargetId
  };
}
