/**
 * DADOS 3D
 * ==================================================================
 * Cubos de verdade em CSS 3D. O truque: o resultado já foi sorteado
 * pelo motor ANTES da animação, então o dado gira e PARA na face
 * certa — em vez de girar aleatório e trocar o número no fim.
 *
 * Os três caem escalonados (quem, tipo, calor), que é a expectativa
 * descrita no GDD: "primeiro dado... segundo dado... sua carta".
 */

import { h } from '../dom.js';
import { DIE_WHO, DIE_TYPE, DIE_HEAT } from '../../engine/diceEngine.js';

/** Rotação que traz cada face do cubo para a frente. */
const FACE_ROTATION = {
  1: { rx: 0, ry: 0 },
  2: { rx: 0, ry: -180 },
  3: { rx: 0, ry: -90 },
  4: { rx: 0, ry: 90 },
  5: { rx: -90, ry: 0 },
  6: { rx: 90, ry: 0 }
};

/** Voltas inteiras somadas antes de assentar, para o giro ter peso. */
const SPINS = [{ x: 720, y: 900 }, { x: 900, y: 720 }, { x: 720, y: 1080 }];

const SPIN_MS = 900;
const STAGGER_MS = 170;

/** Quanto tempo até os três dados terem assentado. */
export const ROLL_DURATION = SPIN_MS + STAGGER_MS * 2 + 80;

function cube(die, faces, index, rolling) {
  const face = FACE_ROTATION[die?.face ?? 1];
  const spin = SPINS[index];
  const delay = index * STAGGER_MS;

  return h('div', {
    class: `die3d ${rolling ? 'rolling' : 'settled'}`,
    style: {
      '--rx': `${(rolling ? spin.x : 0) + face.rx}deg`,
      '--ry': `${(rolling ? spin.y : 0) + face.ry}deg`,
      '--spin': `${SPIN_MS}ms`,
      '--delay': `${delay}ms`
    }
  },
    h('div', { class: 'cube' },
      faces.map((f, i) => h('div', { class: `face f${i + 1}` }, f.icon))
    )
  );
}

/**
 * @param {object|null} roll   resultado já sorteado pelo motor
 * @param {boolean} rolling    true durante a animação de queda
 */
export function dice3d(roll, rolling) {
  const cols = [
    { name: 'QUEM', faces: DIE_WHO, die: roll?.who },
    { name: 'TIPO', faces: DIE_TYPE, die: roll?.type },
    { name: 'CALOR', faces: DIE_HEAT, die: roll?.heat }
  ];

  return h('div', { class: 'dice3d' },
    cols.map((col, i) => h('div', { class: 'die-slot' },
      cube(col.die, col.faces, i, rolling),
      h('div', { class: 'die-label' },
        h('div', { class: 'name' }, col.name),
        h('div', {
          class: 'val',
          style: { '--reveal': `${(rolling ? SPIN_MS : 0) + i * STAGGER_MS}ms` }
        }, col.die?.label ?? '—')
      )
    ))
  );
}
