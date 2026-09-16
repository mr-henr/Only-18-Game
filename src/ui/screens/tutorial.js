/**
 * TUTORIAL
 * ==================================================================
 * Ensina o jogo dentro do próprio jogo, com as peças de verdade: os
 * dados são os dados, a carta é uma carta, e os botões de limite são
 * os mesmos que a pessoa vai usar depois.
 *
 * Regras que segui ao escrever os textos:
 *  - uma ideia por tela;
 *  - nada de palavra interna do projeto ("teto do modo", "carta
 *    paramétrica", "dupla confirmação") — isso é vocabulário nosso,
 *    não de quem senta para jogar;
 *  - sempre um exemplo concreto, nunca só a definição;
 *  - dá para sair em qualquer passo.
 */

import { h, panel, btn } from '../dom.js';
import { go, setState, store } from '../app.js';
import { dice3d } from '../components/dice3d.js';
import { DIE_WHO, DIE_TYPE, DIE_HEAT } from '../../engine/diceEngine.js';
import { play } from '../fx.js';

const SEEN_KEY = 'nd_tutorial';

export function tutorialSeen() {
  try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
}

export function markTutorialSeen() {
  try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* sem storage, tudo bem */ }
}

/* ------------------------------------------------------------------ */
/* Peças ilustrativas                                                  */
/* ------------------------------------------------------------------ */

const exampleRoll = {
  who: DIE_WHO[1],      // 👉 OUTRO
  type: DIE_TYPE[1],    // 🎯 DESAFIO
  heat: DIE_HEAT[3]     // 🔥 SOBE
};

function exampleCard(text, tipo = '🎯 Desafio') {
  return h('div', { class: 'card tutorial-card' },
    h('div', { class: 'card-type' }, tipo),
    h('div', { class: 'card-text' }, text),
    h('div', { class: 'card-meta' },
      h('span', { class: 'pill' }, '🔥 nível 2'),
      h('span', { class: 'pill' }, 'ANA + BRUNO')
    )
  );
}

/* --- passo interativo dos limites ---------------------------------- */

const ESCOLHAS = {
  allow: {
    icon: '✅', nome: 'Permitir',
    frase: 'Pode aparecer a qualquer momento, sem o jogo perguntar nada.'
  },
  ask: {
    icon: '⚠️', nome: 'Perguntar antes',
    frase: 'Pode aparecer, mas só depois de o jogo perguntar a você, em particular. Se você disser não, ele troca a carta e ninguém fica sabendo.'
  },
  block: {
    icon: '🚫', nome: 'Bloquear',
    frase: 'Nunca aparece. Nem para você, nem para ninguém da mesa — o jogo simplesmente não sorteia essa carta.'
  }
};

function limitDemo() {
  const escolha = store.tutorialChoice;

  return h('div', {},
    h('div', { class: 'limit-item demo' },
      h('div', { class: 'limit-label' },
        h('b', {}, 'Beijo no rosto'),
        h('span', { class: 'hint' }, 'exemplo — experimente tocar nos três')
      ),
      h('div', { class: 'tri' },
        Object.entries(ESCOLHAS).map(([value, info]) => h('button', {
          class: escolha === value ? 'on' : '',
          dataset: { v: value },
          onClick: () => { play('tap'); setState({ tutorialChoice: value }); }
        }, info.icon))
      )
    ),

    escolha
      ? h('div', { class: `demo-result ${escolha}` },
          h('b', {}, `${ESCOLHAS[escolha].icon} ${ESCOLHAS[escolha].nome}`),
          h('p', {}, ESCOLHAS[escolha].frase))
      : h('p', { class: 'faint center spaced' }, '👆 toque em um dos três para ver o que cada um faz')
  );
}

/* ------------------------------------------------------------------ */
/* Os passos                                                           */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    titulo: 'É um jogo de cartas e dados',
    texto: 'Cada um joga na sua vez. Você rola os dados, o jogo sorteia uma carta, e você faz o que ela pede — ou não faz. Depois passa para o próximo.',
    visual: () => h('div', { class: 'tutorial-visual big-emoji' }, '🎲 🃏')
  },
  {
    titulo: 'Os dados escolhem o clima',
    texto: 'São três. O primeiro diz com quem é. O segundo, que tipo de carta vem. O terceiro, o quanto ela esquenta. Você não precisa decorar nada: o jogo lê os dados por você.',
    visual: () => dice3d(exampleRoll, false)
  },
  {
    titulo: 'A carta diz o que fazer',
    texto: 'Ela já vem pronta, com os nomes de quem está jogando e com o tempo, se tiver. Quando pedir um tempo, aparece um cronômetro junto.',
    visual: () => exampleCard('ANA, dê um beijo demorado em BRUNO — no pescoço.')
  },
  {
    titulo: 'Não quer? É só pular',
    texto: 'O botão PULAR está em toda carta. Não custa ponto, não precisa de explicação e ninguém pode cobrar. Se o grupo quiser, dá para combinar uma prenda antes de começar — mas mesmo assim dá para passar.',
    visual: () => h('div', { class: 'tutorial-visual' },
      h('div', { class: 'demo-buttons' },
        h('span', { class: 'btn danger fake' }, '🛑 Pular'),
        h('span', { class: 'btn primary fake' }, '✓ Feito')))
  },
  {
    titulo: 'Antes de jogar, você marca seus limites',
    texto: 'O jogo mostra uma lista do que pode acontecer — item por item, com nome claro. Para cada um você escolhe uma de três coisas:',
    visual: limitDemo,
    alto: true
  },
  {
    titulo: 'Basta uma pessoa bloquear',
    texto: 'Se qualquer um dos envolvidos bloqueou aquilo, a carta não é sorteada. Não aparece e some — não existe para aquela mesa. E ninguém vê o que os outros marcaram.',
    visual: () => h('div', { class: 'tutorial-visual' },
      h('div', { class: 'block-demo' },
        h('span', { class: 'pill allow' }, 'ANA ✅'),
        h('span', { class: 'pill block' }, 'BRUNO 🚫'),
        h('span', { class: 'arrow' }, '→'),
        h('span', { class: 'pill' }, 'a carta nem é sorteada')))
  },
  {
    titulo: 'Tem carta que só você lê',
    texto: 'Algumas cartas são privadas. Num aparelho só, ela fica virada até você tocar. Com TV e celulares, o texto vai só para o seu celular — a TV mostra apenas que você recebeu alguma coisa.',
    visual: () => h('div', { class: 'tutorial-visual' },
      h('div', { class: 'card-back small' },
        h('div', { class: 'mark' }, '🔒'),
        h('div', { class: 'back-label' }, 'Só você deve ler')))
  },
  {
    titulo: 'A intensidade sobe quando vocês quiserem',
    texto: 'A partida começa leve. Quando o grupo quiser, aperta "subir" e as cartas ficam mais ousadas — sempre dentro do que cada um marcou. Ela nunca sobe sozinha.',
    visual: () => h('div', { class: 'tutorial-visual' },
      h('div', { class: 'track demo-track' },
        Array.from({ length: 5 }, (_, i) => h('i', { class: i < 3 ? 'on' : '' })))),
    final: true
  }
];

/* ------------------------------------------------------------------ */

export default function tutorialScreen() {
  const i = Math.min(store.tutorialStep ?? 0, STEPS.length - 1);
  const step = STEPS[i];
  const ultimo = i === STEPS.length - 1;

  const sair = () => {
    markTutorialSeen();
    go('home', { tutorialStep: 0, tutorialChoice: null });
  };

  const avancar = () => {
    if (ultimo) return sair();
    play('tap');
    setState({ tutorialStep: i + 1 });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return h('div', {},
    panel({ class: 'tutorial' },
      h('div', { class: 'tutorial-progress' },
        STEPS.map((_, n) => h('i', { class: n <= i ? 'on' : '' }))),

      h('span', { class: 'eyebrow' }, `como funciona · ${i + 1} de ${STEPS.length}`),
      h('h2', {}, step.titulo),
      h('p', { class: 'dim' }, step.texto),

      h('div', { class: `tutorial-stage ${step.alto ? 'tall' : ''}` }, step.visual()),

      h('div', { class: 'actions' },
        i > 0
          ? btn('Voltar', {
              variant: 'ghost',
              onClick: () => setState({ tutorialStep: i - 1 })
            })
          : btn('Pular tutorial', { variant: 'ghost', onClick: sair }),
        btn(ultimo ? 'Entendi, vamos jogar' : 'Próximo', {
          variant: 'primary', onClick: avancar
        })
      )
    )
  );
}
