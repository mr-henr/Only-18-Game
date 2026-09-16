/**
 * PRENDAS
 * ==================================================================
 * Por padrao PULAR nao custa nada — essa continua sendo a regra base do
 * jogo e a saida que nunca pode ser tirada de ninguem.
 *
 * O que este arquivo faz e oferecer combinados OPCIONAIS: o grupo
 * escolhe, antes de comecar, o que acontece com quem nao cumprir. Sao
 * sugestoes, nao obrigacao, e mesmo com prenda combinada o jogador
 * sempre pode recusar e seguir em frente.
 *
 * Campos:
 *  minMode       tier minimo de modo (mesma regra do teto)
 *  needsAlcohol  so aparece se o grupo ligou "jogar com bebida"
 *  requires      limites que TODOS precisam aceitar para a prenda ser
 *                oferecida — nao adianta sugerir "tire uma peca" para
 *                um grupo que bloqueou roupa
 */

export const PENALTIES = [
  /* --------------------------------------------------- sem nada extra */
  {
    id: 'double_next',
    icon: '🔁',
    label: 'Cumprir o próximo desafio em dobro',
    detail: 'A próxima carta vale por duas: mesmo desafio, o dobro do tempo ou da intensidade.',
    minMode: 1
  },
  {
    id: 'group_choice',
    icon: '🗳️',
    label: 'O grupo escolhe um desafio no lugar',
    detail: 'Quem pulou fica à mercê do grupo — que precisa chegar a um acordo em 30 segundos.',
    minMode: 1
  },
  {
    id: 'shout',
    icon: '📢',
    label: 'Gritar algo sem vergonha',
    detail: 'O grupo escolhe a frase. Tem que ser alto o suficiente para o vizinho ouvir.',
    minMode: 1
  },
  {
    id: 'truth',
    icon: '💬',
    label: 'Responder uma pergunta íntima do grupo',
    detail: 'Sem direito a escolher a pergunta e sem direito a mentir.',
    minMode: 1,
    requires: ['q_intimate_personal']
  },
  {
    id: 'lose_turn',
    icon: '⏭️',
    label: 'Perder a próxima vez de jogar',
    detail: 'Fica de fora de uma rodada, só assistindo.',
    minMode: 1
  },
  {
    id: 'freeze',
    icon: '🧊',
    label: 'Ficar um minuto sem falar nem se mexer',
    detail: 'Um minuto inteiro parado, enquanto o jogo continua ao redor.',
    minMode: 1
  },
  {
    id: 'compliment_all',
    icon: '💌',
    label: 'Fazer um elogio constrangedor para cada jogador',
    detail: 'Um por pessoa, específico, olhando nos olhos.',
    minMode: 1
  },
  {
    id: 'partner_dare',
    icon: '❤️',
    label: 'Cumprir um desafio escolhido pelo seu par',
    detail: 'Quem conhece seus pontos fracos decide a prenda.',
    minMode: 1
  },

  /* ----------------------------------------------------------- bebida */
  {
    id: 'shot',
    icon: '🥃',
    label: 'Virar uma dose',
    detail: 'Uma dose, de uma vez, sem negociar.',
    minMode: 1,
    needsAlcohol: true,
    requires: ['drink_shot', 'drink_penalty']
  },
  {
    id: 'sips',
    icon: '🍺',
    label: 'Dar três goles',
    detail: 'Versão mais leve: três goles do que estiver bebendo.',
    minMode: 1,
    needsAlcohol: true,
    requires: ['drink_sip', 'drink_penalty']
  },
  {
    id: 'others_drink',
    icon: '🍻',
    label: 'Todo mundo bebe por sua causa',
    detail: 'Quem pulou não bebe — o resto do grupo bebe. A vergonha é a prenda.',
    minMode: 1,
    needsAlcohol: true,
    requires: ['drink_sip', 'drink_penalty']
  },

  /* -------------------------------------------------- a partir do M2 */
  {
    id: 'remove_piece',
    icon: '👕',
    label: 'Tirar uma peça de roupa',
    detail: 'Quem pulou escolhe qual peça, dentro do que já tinha permitido.',
    minMode: 2,
    requires: ['clothing_shirt']
  },
  {
    id: 'lap_round',
    icon: '🪑',
    label: 'Passar a próxima rodada no colo de alguém',
    detail: 'Escolhe em quem senta — respeitando a regra do parceiro.',
    minMode: 2,
    requires: ['touch_lap']
  },
  {
    id: 'blindfold_round',
    icon: '🙈',
    label: 'Ficar vendado até jogar de novo',
    detail: 'Sem ver nada até a própria vez chegar outra vez.',
    minMode: 2,
    requires: ['bdsm_blindfold']
  },
  {
    id: 'kiss_forfeit',
    icon: '💋',
    label: 'Dar um beijo em quem o grupo escolher',
    detail: 'O grupo indica; a regra do parceiro e os limites de beijo continuam valendo.',
    minMode: 2,
    requires: ['kiss_face']
  },

  /* -------------------------------------------------- a partir do M3 */
  {
    id: 'spanking',
    icon: '✋',
    label: 'Levar três palmadas',
    detail: 'Do jogador à sua esquerda, contando em voz alta.',
    minMode: 3,
    requires: ['bdsm_spanking']
  },
  {
    id: 'orders',
    icon: '⛓️',
    label: 'Obedecer a uma ordem de quem o grupo escolher',
    detail: 'Uma ordem só, dentro dos limites marcados.',
    minMode: 3,
    requires: ['bdsm_orders']
  }
];

export const PENALTIES_BY_ID = Object.fromEntries(PENALTIES.map((p) => [p.id, p]));

/** Prenda escrita pelo próprio grupo. */
export const CUSTOM_PENALTY_ID = 'custom';

export function penalty(id) {
  return PENALTIES_BY_ID[id] ?? null;
}
