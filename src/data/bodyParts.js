/**
 * PARTES DO CORPO
 * ------------------------------------------------------------------
 * Cada parte vira um item de limite proprio (`body_<id>`) e tambem
 * alimenta os slots parametricos das cartas (beijar/tocar "em X").
 *
 * Regra do projeto: permitir uma ACAO nao significa permitir QUALQUER
 * PARTE. Toda carta com slot de corpo precisa passar pelos dois testes:
 * o limite da acao (ex.: kiss_thighs) e o limite da parte (body_thighs).
 *
 * `def` e `em` guardam as formas gramaticais usadas na montagem do texto.
 */

export const BODY_PARTS = [
  { id: 'hands',    label: 'Mãos',        def: 'as mãos',      em: 'nas mãos',      tier: 1, intimate: false, kissable: true,  touchable: true  },
  { id: 'arms',     label: 'Braços',      def: 'os braços',    em: 'nos braços',    tier: 1, intimate: false, kissable: true,  touchable: true  },
  { id: 'face',     label: 'Rosto',       def: 'o rosto',      em: 'no rosto',      tier: 1, intimate: false, kissable: true,  touchable: true  },
  { id: 'forehead', label: 'Testa',       def: 'a testa',      em: 'na testa',      tier: 1, intimate: false, kissable: true,  touchable: false },
  { id: 'back',     label: 'Costas',      def: 'as costas',    em: 'nas costas',    tier: 1, intimate: false, kissable: true,  touchable: true  },
  { id: 'feet',     label: 'Pés',         def: 'os pés',       em: 'nos pés',       tier: 1, intimate: false, kissable: true,  touchable: true  },
  { id: 'neck',     label: 'Pescoço',     def: 'o pescoço',    em: 'no pescoço',    tier: 2, intimate: false, kissable: true,  touchable: true  },
  { id: 'ears',     label: 'Orelha/nuca', def: 'a orelha',     em: 'na orelha',     tier: 2, intimate: false, kissable: true,  touchable: true  },
  { id: 'mouth',    label: 'Boca',        def: 'a boca',       em: 'na boca',       tier: 2, intimate: false, kissable: true,  touchable: true  },
  { id: 'belly',    label: 'Barriga',     def: 'a barriga',    em: 'na barriga',    tier: 2, intimate: false, kissable: true,  touchable: true  },
  { id: 'legs',     label: 'Pernas',      def: 'as pernas',    em: 'nas pernas',    tier: 2, intimate: false, kissable: true,  touchable: true  },
  { id: 'thighs',   label: 'Coxas',       def: 'as coxas',     em: 'nas coxas',     tier: 2, intimate: false, kissable: true,  touchable: true  },
  { id: 'glutes',   label: 'Glúteos',     def: 'os glúteos',   em: 'nos glúteos',   tier: 3, intimate: true,  kissable: true,  touchable: true  },
  { id: 'breasts',  label: 'Seios/peito', def: 'os seios',     em: 'nos seios',     tier: 3, intimate: true,  kissable: true,  touchable: true  },
  { id: 'genitals', label: 'Genitais',    def: 'os genitais',  em: 'nos genitais',  tier: 3, intimate: true,  kissable: true,  touchable: true  }
];

export const BODY_BY_ID = Object.fromEntries(BODY_PARTS.map((p) => [p.id, p]));

export function bodyPart(id) {
  return BODY_BY_ID[id] ?? null;
}
