import { h, panel, btn } from '../dom.js';
import { go } from '../app.js';
import { deckStats } from '../../data/decks/index.js';
import { LIMITS } from '../../data/limitsCatalog.js';
import { tutorialSeen } from './tutorial.js';
import { serverAvailable } from '../../net/session.js';

export default function homeScreen() {
  const stats = deckStats();
  const primeiraVez = !tutorialSeen();

  return h('div', {},
    panel({ class: 'hero' },
      h('span', { class: 'eyebrow' }, 'jogo para adultos'),
      h('h1', {}, 'NOITE DE', h('br'), 'DESAFIOS'),
      h('p', { class: 'dim lead' },
        'Vocês rolam os dados, o jogo sorteia uma carta, alguém cumpre. ' +
        'Antes de começar, cada um marca o que aceita — e o jogo respeita.'),

      h('div', { class: 'actions center' },
        btn(primeiraVez ? '▶ Como funciona (1 minuto)' : 'Como funciona', {
          variant: primeiraVez ? 'primary' : 'ghost',
          onClick: () => go('tutorial', { tutorialStep: 0, tutorialChoice: null })
        })
      )
    ),

    panel({},
      h('h3', { class: 'center' }, 'Como vocês vão jogar?'),
      h('div', { class: 'grid two home-modes' },
        h('button', { class: 'choice', onClick: () => go('mode') },
          h('b', {}, '📱 Um aparelho só'),
          h('span', { class: 'tagline' },
            'O celular passa de mão em mão. É o jeito mais simples: não precisa de ' +
            'internet nem de mais nada.'),
          h('span', { class: 'meta' }, 'para casal ou grupo, em qualquer lugar')
        ),
        h('button', {
          class: `choice ${serverAvailable() ? '' : 'unavailable'}`,
          onClick: () => go('connect')
        },
          h('b', {}, '📺 TV + celulares'),
          h('span', { class: 'tagline' },
            'A tela grande mostra a partida. Cada pessoa usa o próprio celular — ' +
            'e é nele que chega o que é só seu.'),
          h('span', { class: 'meta' },
            serverAvailable()
              ? 'todos precisam estar no mesmo wi-fi'
              : '⚠ precisa do servidor do jogo rodando')
        )
      )
    ),

    h('div', { class: 'pill-row home-stats' },
      h('span', { class: 'pill' }, `🃏 ${stats.total} cartas`),
      h('span', { class: 'pill' }, `🛑 ${LIMITS.length} coisas que você pode bloquear`),
      h('span', { class: 'pill' }, '🍻 modo com bebida')
    ),

    h('p', { class: 'faint center age-note' },
      'Conteúdo adulto. Ao continuar, você confirma que todos os participantes têm ' +
      '18 anos ou mais e estão jogando porque querem. O botão PULAR está sempre ' +
      'disponível, sem penalidade e sem precisar explicar.')
  );
}
