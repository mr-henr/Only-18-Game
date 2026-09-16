/**
 * CATALOGO DE LIMITES
 * ==================================================================
 * Fonte unica da verdade do sistema de consentimento. Cada item tem um
 * ID interno estavel que as cartas referenciam diretamente.
 *
 * Campos:
 *  id          identificador interno, nunca muda (usado pelas cartas)
 *  group       grupo/aba da tela de limites
 *  label       texto literal exibido ao jogador (direto e especifico)
 *  hint        esclarecimento opcional, para nao restar duvida
 *  minMode     tier minimo de modo em que o item existe (TETO DO MODO)
 *  bodyParts   partes envolvidas -> exige tambem os limites body_<id>
 *  implies     permitir este item pressupoe permitir estes (mais leves)
 *  mirrorsInto itens da aba Adulta pre-marcados quando este for permitido
 *              -> REGRA DA DUPLA CONFIRMACAO
 *  kind        'toggle' (padrao) | 'scope' (escolha unica)
 */

export const LIMIT_GROUPS = [
  { id: 'questions', icon: '💬', label: 'Perguntas', blurb: 'O que pode ser perguntado em voz alta.' },
  { id: 'kisses', icon: '💋', label: 'Beijos', blurb: 'Onde e como pode haver beijo.' },
  { id: 'touch', icon: '🤝', label: 'Contato físico', blurb: 'Ações de toque, uma a uma.' },
  { id: 'clothing', icon: '👕', label: 'Roupa', blurb: 'Até onde a roupa pode sair.' },
  { id: 'body', icon: '🍑', label: 'Partes do corpo', blurb: 'Quais partes podem ser alvo de qualquer ação.' },
  { id: 'sexual', icon: '🔞', label: 'Conteúdo sexual', blurb: 'Atos sexuais explícitos.', adult: true },
  { id: 'bdsm', icon: '⛓️', label: 'BDSM e poder', blurb: 'Dominação, submissão e restrição.', adult: true },
  { id: 'exposure', icon: '👀', label: 'Exposição', blurb: 'Ser visto, fotografado ou filmado.', adult: true },
  { id: 'drinks', icon: '🍻', label: 'Bebida', blurb: 'O que envolve álcool na partida.', needsAlcohol: true },
  { id: 'dynamics', icon: '👥', label: 'Pessoas envolvidas', blurb: 'Com quem as ações podem acontecer.' }
];

export const LIMITS = [
  /* ---------------------------------------------------------- PERGUNTAS */
  { id: 'q_past_relationships', group: 'questions', minMode: 1, label: 'Perguntas sobre relacionamentos anteriores' },
  { id: 'q_sexual_experiences', group: 'questions', minMode: 1, label: 'Perguntas sobre experiências sexuais anteriores' },
  { id: 'q_sexual_preferences', group: 'questions', minMode: 1, label: 'Perguntas sobre preferências sexuais' },
  { id: 'q_fantasies', group: 'questions', minMode: 1, label: 'Perguntas sobre fantasias' },
  { id: 'q_attraction', group: 'questions', minMode: 1, label: 'Perguntas sobre atração por outras pessoas', hint: 'Inclui atração por quem está na sala.' },
  { id: 'q_jealousy', group: 'questions', minMode: 1, label: 'Perguntas sobre ciúmes' },
  { id: 'q_embarrassing', group: 'questions', minMode: 1, label: 'Perguntas constrangedoras de teor sexual' },
  { id: 'q_intimate_personal', group: 'questions', minMode: 1, label: 'Perguntas íntimas pessoais' },
  { id: 'q_about_present', group: 'questions', minMode: 1, label: 'Perguntas sobre quem está na sala' },
  { id: 'q_confession', group: 'questions', minMode: 1, label: 'Confissões e segredos pessoais' },
  { id: 'q_body_opinion', group: 'questions', minMode: 1, label: 'Perguntas sobre o corpo de outro jogador' },

  /* ------------------------------------------------------------- BEIJOS */
  { id: 'kiss_forehead', group: 'kisses', minMode: 2, label: 'Beijo na testa', bodyParts: ['forehead'] },
  { id: 'kiss_face', group: 'kisses', minMode: 2, label: 'Beijo no rosto', bodyParts: ['face'] },
  { id: 'kiss_hands', group: 'kisses', minMode: 2, label: 'Beijo nas mãos', bodyParts: ['hands'] },
  { id: 'kiss_arms', group: 'kisses', minMode: 2, label: 'Beijo nos braços', bodyParts: ['arms'] },
  { id: 'kiss_back', group: 'kisses', minMode: 2, label: 'Beijo nas costas', bodyParts: ['back'] },
  { id: 'kiss_feet', group: 'kisses', minMode: 2, label: 'Beijo nos pés', bodyParts: ['feet'] },
  { id: 'kiss_neck', group: 'kisses', minMode: 2, label: 'Beijo no pescoço', bodyParts: ['neck'] },
  { id: 'kiss_ears', group: 'kisses', minMode: 2, label: 'Beijo na orelha / nuca', bodyParts: ['ears'] },
  { id: 'kiss_belly', group: 'kisses', minMode: 2, label: 'Beijo na barriga', bodyParts: ['belly'] },
  { id: 'kiss_legs', group: 'kisses', minMode: 2, label: 'Beijo nas pernas', bodyParts: ['legs'] },
  { id: 'kiss_thighs', group: 'kisses', minMode: 2, label: 'Beijo nas coxas', bodyParts: ['thighs'], hint: 'Inclui a parte interna.' },
  { id: 'kiss_mouth', group: 'kisses', minMode: 2, label: 'Beijo na boca', bodyParts: ['mouth'], implies: ['kiss_face'] },
  { id: 'kiss_prolonged', group: 'kisses', minMode: 2, label: 'Beijo de língua / prolongado', bodyParts: ['mouth'], implies: ['kiss_mouth'], mirrorsInto: ['sexual_making_out'] },
  { id: 'kiss_glutes', group: 'kisses', minMode: 3, label: 'Beijo nos glúteos', bodyParts: ['glutes'], mirrorsInto: ['sexual_anal_play'] },
  { id: 'kiss_breasts', group: 'kisses', minMode: 3, label: 'Beijar / chupar os seios', bodyParts: ['breasts'], mirrorsInto: ['sexual_breasts'] },
  { id: 'kiss_genitals', group: 'kisses', minMode: 3, label: 'Beijo nos genitais', bodyParts: ['genitals'], hint: 'Marcar isto pré-libera sexo oral na aba 🔞.', mirrorsInto: ['sexual_oral_give', 'sexual_oral_receive'] },
  { id: 'kiss_non_partner', group: 'kisses', minMode: 2, label: 'Beijar alguém que não é meu parceiro', hint: 'Vale para qualquer beijo acima.' },

  /* ----------------------------------------------------- CONTATO FÍSICO */
  { id: 'touch_hug', group: 'touch', minMode: 1, label: 'Abraçar' },
  { id: 'touch_hands', group: 'touch', minMode: 1, label: 'Dar as mãos', bodyParts: ['hands'] },
  { id: 'touch_sit_close', group: 'touch', minMode: 1, label: 'Sentar encostado em outro jogador' },
  { id: 'touch_face', group: 'touch', minMode: 1, label: 'Tocar o rosto', bodyParts: ['face'] },
  { id: 'touch_arms', group: 'touch', minMode: 1, label: 'Tocar os braços', bodyParts: ['arms'] },
  { id: 'touch_back', group: 'touch', minMode: 1, label: 'Tocar as costas', bodyParts: ['back'] },
  { id: 'touch_feet', group: 'touch', minMode: 1, label: 'Tocar os pés', bodyParts: ['feet'] },
  { id: 'touch_non_partner', group: 'touch', minMode: 1, label: 'Tocar alguém que não é meu parceiro' },
  { id: 'touch_caress', group: 'touch', minMode: 2, label: 'Fazer carinho' },
  { id: 'touch_massage_give', group: 'touch', minMode: 2, label: 'Fazer massagem em alguém' },
  { id: 'touch_massage_receive', group: 'touch', minMode: 2, label: 'Receber massagem de alguém' },
  { id: 'touch_lap', group: 'touch', minMode: 2, label: 'Sentar no colo' },
  { id: 'touch_lie_down', group: 'touch', minMode: 2, label: 'Deitar junto de outro jogador' },
  { id: 'touch_dance', group: 'touch', minMode: 2, label: 'Dançar colado' },
  { id: 'touch_neck', group: 'touch', minMode: 2, label: 'Tocar o pescoço', bodyParts: ['neck'] },
  { id: 'touch_belly', group: 'touch', minMode: 2, label: 'Tocar a barriga', bodyParts: ['belly'] },
  { id: 'touch_legs', group: 'touch', minMode: 2, label: 'Tocar as pernas', bodyParts: ['legs'] },
  { id: 'touch_thighs', group: 'touch', minMode: 2, label: 'Tocar as coxas', bodyParts: ['thighs'], hint: 'Inclui a parte interna.' },
  { id: 'touch_glutes', group: 'touch', minMode: 3, label: 'Tocar os glúteos', bodyParts: ['glutes'], mirrorsInto: ['sexual_anal_play'] },
  { id: 'touch_breasts', group: 'touch', minMode: 3, label: 'Tocar os seios', bodyParts: ['breasts'], mirrorsInto: ['sexual_breasts'] },
  { id: 'touch_genitals', group: 'touch', minMode: 3, label: 'Tocar os genitais', bodyParts: ['genitals'], hint: 'Marcar isto pré-libera estimulação manual na aba 🔞.', mirrorsInto: ['sexual_manual'] },

  /* -------------------------------------------------------------- ROUPA */
  { id: 'clothing_accessories', group: 'clothing', minMode: 2, label: 'Tirar acessórios (relógio, brinco, boné)' },
  { id: 'clothing_shoes', group: 'clothing', minMode: 2, label: 'Tirar sapatos' },
  { id: 'clothing_socks', group: 'clothing', minMode: 2, label: 'Tirar meias' },
  { id: 'clothing_coat', group: 'clothing', minMode: 2, label: 'Tirar casaco / blusa de frio' },
  { id: 'clothing_shirt', group: 'clothing', minMode: 2, label: 'Tirar camisa / blusa' },
  { id: 'clothing_pants', group: 'clothing', minMode: 2, label: 'Tirar calça / shorts / saia' },
  { id: 'clothing_to_underwear', group: 'clothing', minMode: 2, label: 'Ficar só de roupa íntima', implies: ['clothing_shirt', 'clothing_pants'] },
  { id: 'clothing_choose', group: 'clothing', minMode: 2, label: 'Deixar outro jogador escolher a peça que sai' },
  { id: 'clothing_swap', group: 'clothing', minMode: 2, label: 'Trocar uma peça de roupa com outro jogador' },
  { id: 'clothing_underwear', group: 'clothing', minMode: 2, label: 'Tirar a roupa íntima', implies: ['clothing_to_underwear'] },
  { id: 'clothing_partial_nude', group: 'clothing', minMode: 2, label: 'Ficar parcialmente nu (só a parte de cima OU de baixo)' },
  { id: 'clothing_full_nude', group: 'clothing', minMode: 2, label: 'Ficar completamente nu', implies: ['clothing_underwear', 'clothing_partial_nude'], mirrorsInto: ['exposure_body_players'] },

  /* ---------------------------------------------------- PARTES DO CORPO */
  { id: 'body_hands', group: 'body', minMode: 1, label: 'Mãos' },
  { id: 'body_arms', group: 'body', minMode: 1, label: 'Braços' },
  { id: 'body_face', group: 'body', minMode: 1, label: 'Rosto' },
  { id: 'body_forehead', group: 'body', minMode: 1, label: 'Testa' },
  { id: 'body_back', group: 'body', minMode: 1, label: 'Costas' },
  { id: 'body_feet', group: 'body', minMode: 1, label: 'Pés' },
  { id: 'body_neck', group: 'body', minMode: 2, label: 'Pescoço' },
  { id: 'body_ears', group: 'body', minMode: 2, label: 'Orelha / nuca' },
  { id: 'body_mouth', group: 'body', minMode: 2, label: 'Boca' },
  { id: 'body_belly', group: 'body', minMode: 2, label: 'Barriga' },
  { id: 'body_legs', group: 'body', minMode: 2, label: 'Pernas' },
  { id: 'body_thighs', group: 'body', minMode: 2, label: 'Coxas' },
  { id: 'body_glutes', group: 'body', minMode: 3, label: 'Glúteos' },
  { id: 'body_breasts', group: 'body', minMode: 3, label: 'Seios / peito' },
  { id: 'body_genitals', group: 'body', minMode: 3, label: 'Genitais' },

  /* ---------------------------------------------------- CONTEÚDO SEXUAL */
  { id: 'sexual_teasing', group: 'sexual', minMode: 3, label: 'Provocação sexual sem contato' },
  { id: 'sexual_dirty_talk', group: 'sexual', minMode: 3, label: 'Falar sacanagem em voz alta' },
  { id: 'sexual_making_out', group: 'sexual', minMode: 3, label: 'Amasso intenso' },
  { id: 'sexual_breasts', group: 'sexual', minMode: 3, label: 'Estimular os seios', bodyParts: ['breasts'] },
  { id: 'sexual_manual', group: 'sexual', minMode: 3, label: 'Estimulação com as mãos (masturbar alguém)', bodyParts: ['genitals'] },
  { id: 'sexual_masturbation_solo', group: 'sexual', minMode: 3, label: 'Se masturbar na frente de alguém', bodyParts: ['genitals'] },
  { id: 'sexual_oral_give', group: 'sexual', minMode: 3, label: 'Fazer sexo oral', bodyParts: ['genitals'] },
  { id: 'sexual_oral_receive', group: 'sexual', minMode: 3, label: 'Receber sexo oral', bodyParts: ['genitals'] },
  { id: 'sexual_anal_play', group: 'sexual', minMode: 3, label: 'Estimulação anal externa', bodyParts: ['glutes'] },
  { id: 'sexual_penetration_vaginal', group: 'sexual', minMode: 3, label: 'Penetração vaginal', bodyParts: ['genitals'] },
  { id: 'sexual_penetration_anal', group: 'sexual', minMode: 3, label: 'Penetração anal', bodyParts: ['glutes'] },
  { id: 'sexual_toys', group: 'sexual', minMode: 3, label: 'Uso de objetos / acessórios sexuais' },
  { id: 'sexual_finish', group: 'sexual', minMode: 3, label: 'Levar alguém até o orgasmo' },
  { id: 'sexual_group', group: 'sexual', minMode: 3, label: 'Ato sexual com mais de duas pessoas' },

  /* ------------------------------------------------------- BDSM E PODER */
  { id: 'bdsm_orders', group: 'bdsm', minMode: 2, label: 'Dar ou receber ordens' },
  { id: 'bdsm_blindfold', group: 'bdsm', minMode: 2, label: 'Venda nos olhos' },
  { id: 'bdsm_dominate', group: 'bdsm', minMode: 3, label: 'Assumir o papel dominante' },
  { id: 'bdsm_submit', group: 'bdsm', minMode: 3, label: 'Assumir o papel submisso' },
  { id: 'bdsm_switch', group: 'bdsm', minMode: 3, label: 'Trocar de papel durante a partida' },
  { id: 'bdsm_restraint', group: 'bdsm', minMode: 3, label: 'Restrição física (segurar, imobilizar)' },
  { id: 'bdsm_tie_other', group: 'bdsm', minMode: 3, label: 'Amarrar outra pessoa' },
  { id: 'bdsm_tie_self', group: 'bdsm', minMode: 3, label: 'Ser amarrado' },
  { id: 'bdsm_spanking', group: 'bdsm', minMode: 3, label: 'Palmadas', bodyParts: ['glutes'] },
  { id: 'bdsm_pain_light', group: 'bdsm', minMode: 3, label: 'Dor leve (mordida, beliscão, puxão de cabelo)' },
  { id: 'bdsm_accessories', group: 'bdsm', minMode: 3, label: 'Acessórios (algema, coleira, mordaça)' },

  /* --------------------------------------------------------- EXPOSIÇÃO */
  { id: 'exposure_body_players', group: 'exposure', minMode: 2, label: 'Mostrar o corpo para os outros jogadores' },
  { id: 'exposure_watched', group: 'exposure', minMode: 2, label: 'Fazer algo enquanto os outros observam' },
  { id: 'exposure_intimate_players', group: 'exposure', minMode: 3, label: 'Mostrar partes íntimas para os outros jogadores', bodyParts: ['genitals'] },
  { id: 'exposure_photo', group: 'exposure', minMode: 3, label: 'Ser fotografado' },
  { id: 'exposure_send_photo', group: 'exposure', minMode: 3, label: 'Enviar foto para outro jogador' },
  { id: 'exposure_recorded', group: 'exposure', minMode: 3, label: 'Ser filmado' },
  { id: 'exposure_camera', group: 'exposure', minMode: 3, label: 'Usar câmera ao vivo durante o desafio' },
  { id: 'exposure_outside', group: 'exposure', minMode: 3, label: 'Exposição para pessoas fora da partida', hint: 'Qualquer coisa que saia do grupo que está jogando.' },

  /* ------------------------------------------------------------ BEBIDA */
  /* So existem quando o grupo liga "jogar com bebida" na criacao da     */
  /* partida. Mesmo assim cada jogador decide o que aceita: quem dirige  */
  /* ou nao bebe simplesmente bloqueia e o jogo respeita.                */
  { id: 'drink_sip', group: 'drinks', minMode: 1, needsAlcohol: true, label: 'Dar um gole' },
  { id: 'drink_shot', group: 'drinks', minMode: 1, needsAlcohol: true, label: 'Virar uma dose de uma vez', implies: ['drink_sip'] },
  { id: 'drink_penalty', group: 'drinks', minMode: 1, needsAlcohol: true, label: 'Beber como prenda por não cumprir uma carta' },
  { id: 'drink_rule', group: 'drinks', minMode: 1, needsAlcohol: true, label: 'Regras de bebida durante a partida', hint: 'Do tipo "quem rir bebe", valendo por várias rodadas.' },
  { id: 'drink_serve', group: 'drinks', minMode: 1, needsAlcohol: true, label: 'Preparar ou servir a bebida de outro jogador' },
  { id: 'drink_choose_for_other', group: 'drinks', minMode: 1, needsAlcohol: true, label: 'Decidir quem bebe' },
  { id: 'drink_from_body', group: 'drinks', minMode: 2, needsAlcohol: true, label: 'Beber algo direto do corpo de outra pessoa' },
  { id: 'drink_mouth_to_mouth', group: 'drinks', minMode: 2, needsAlcohol: true, label: 'Passar a bebida de boca em boca', bodyParts: ['mouth'], implies: ['kiss_mouth'] },

  /* ------------------------------------------------ PESSOAS ENVOLVIDAS */
  {
    id: 'dyn_scope',
    group: 'dynamics',
    minMode: 1,
    kind: 'scope',
    label: 'Ações físicas comigo podem acontecer...',
    options: [
      { value: 'partner_only', label: 'Somente com meu parceiro', hint: 'Seu parceiro é avisado dessa escolha.' },
      { value: 'any_player', label: 'Com qualquer jogador' }
    ],
    default: 'any_player'
  },
  /* Estes itens dizem COM QUANTAS pessoas a ação acontece, nao o quao
     forte ela e. Por isso a lista nao muda quando voce troca a sua
     intensidade maxima: sao coisas diferentes. Os exemplos abaixo
     comecam pelos leves de proposito — a maioria destas cartas nao
     tem nada de sexual. */
  {
    id: 'dyn_random_pair', group: 'dynamics', minMode: 1,
    label: 'Desafios entre duas pessoas sorteadas',
    hint: 'O jogo sorteia uma dupla, que pode nem incluir quem está na vez. Ex.: achar algo em comum que ninguém sabe, encenar uma cena para os outros adivinharem, disputar no jokenpô. Nos modos mais fortes, também contato físico.'
  },
  {
    id: 'dyn_more_than_two', group: 'dynamics', minMode: 1,
    label: 'Desafios envolvendo mais de duas pessoas',
    hint: 'Cartas em que três ou mais pessoas fazem a mesma coisa juntas, em vez de ser um de cada vez.'
  },
  {
    id: 'dyn_group', group: 'dynamics', minMode: 1,
    label: 'Desafios coletivos (todos ao mesmo tempo)',
    hint: 'A mesa inteira participa de uma vez. A maioria é leve: todos congelam na posição em que estiverem, corrente de elogios, votação, "eu nunca", dançar em duplas. Nos modos mais fortes, também entram momentos coletivos.'
  },
  {
    id: 'dyn_watch', group: 'dynamics', minMode: 2,
    label: 'Assistir dois jogadores cumprindo um desafio',
    hint: 'Você fica de fora, só olhando, enquanto outros dois cumprem a carta. Se bloquear, o jogo não usa nenhuma carta que precise de plateia enquanto você estiver de fora.'
  },
  {
    id: 'dyn_be_watched', group: 'dynamics', minMode: 2,
    label: 'Cumprir um desafio sendo assistido',
    hint: 'O contrário: é você no centro, com o resto da mesa olhando. Vale desde uma dança boba até o que o modo permitir.'
  }
];

export const LIMITS_BY_ID = Object.fromEntries(LIMITS.map((l) => [l.id, l]));

/** Mapa inverso da dupla confirmacao: item adulto -> itens de origem. */
export const INHERIT_SOURCES = (() => {
  const map = {};
  for (const item of LIMITS) {
    for (const target of item.mirrorsInto ?? []) {
      (map[target] ??= []).push(item.id);
    }
  }
  return map;
})();

/** Inverso de `implies`: item leve -> itens pesados que dependem dele. */
export const IMPLIED_BY = (() => {
  const map = {};
  for (const item of LIMITS) {
    for (const lighter of item.implies ?? []) {
      (map[lighter] ??= []).push(item.id);
    }
  }
  return map;
})();

export function limit(id) {
  return LIMITS_BY_ID[id] ?? null;
}

/**
 * Limites disponiveis para um modo. `alcohol` e uma segunda chave, no
 * mesmo espirito do teto do modo: com a bebida desligada, os itens do
 * grupo 🍻 nem sao carregados e nenhuma carta alcoolica passa no filtro.
 */
export function limitsForMode(tier, { alcohol = false } = {}) {
  return LIMITS.filter((l) => l.minMode <= tier && (!l.needsAlcohol || alcohol));
}

export function groupsForMode(tier, { alcohol = false } = {}) {
  return LIMIT_GROUPS.filter((g) =>
    limitsForMode(tier, { alcohol }).some((l) => l.group === g.id));
}
