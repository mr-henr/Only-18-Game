import { h, panel, btn, notice } from '../dom.js';
import { go, setState, store } from '../app.js';
import { GAME_MODES, MODE_ORDER } from '../../data/gameModes.js';
import { limitsForMode } from '../../data/limitsCatalog.js';
import { deckForMode, ALL_CARDS } from '../../data/decks/index.js';
import { createGame } from '../../engine/gameEngine.js';

function modeCard(mode) {
  const selected = store.setup.modeId === mode.id;
  const cards = deckForMode(mode.tier, { alcohol: store.setup.alcohol }).length;
  const limits = limitsForMode(mode.tier, { alcohol: store.setup.alcohol }).length;

  return h('button', {
    class: `choice ${selected ? 'selected' : ''}`,
    onClick: () => setState({ setup: { ...store.setup, modeId: mode.id } })
  },
    h('b', {}, `${mode.icon} ${mode.name}`,
      h('span', { class: 'faint', style: { fontWeight: '600' } }, ` · ${mode.subtitle}`)),
    h('span', { class: 'tagline' }, mode.tagline),
    h('span', { class: 'meta' },
      `${cards} cartas · ${limits} limites · até ${mode.maxPlayers} jogadores · intensidade máx. ${mode.maxIntensity}`)
  );
}

function screenCard(id, icon, title, tagline) {
  const selected = store.setup.screenMode === id;
  return h('button', {
    class: `choice ${selected ? 'selected' : ''}`,
    onClick: () => setState({ setup: { ...store.setup, screenMode: id } })
  },
    h('b', {}, `${icon} ${title}`),
    h('span', { class: 'tagline' }, tagline)
  );
}

function alcoholCard(value, icon, title, tagline) {
  const selected = store.setup.alcohol === value;
  return h('button', {
    class: `choice ${selected ? 'selected' : ''}`,
    onClick: () => setState({ setup: { ...store.setup, alcohol: value } })
  },
    h('b', {}, `${icon} ${title}`),
    h('span', { class: 'tagline' }, tagline)
  );
}

export default function modeScreen() {
  const mode = store.setup.modeId ? GAME_MODES[store.setup.modeId] : null;
  const alcoholCards = ALL_CARDS.filter((c) => c.alcohol).length;

  return h('div', {},
    panel({},
      h('span', { class: 'eyebrow' }, 'antes de tudo'),
      h('h2', {}, 'Vai ter bebida?'),
      h('p', { class: 'dim' },
        'Se alguém não bebe, escolha "sem bebida" — assim nenhuma carta menciona ' +
        'álcool. Com a bebida ligada, quem não vai beber ainda pode se excluir ' +
        'sozinho no passo seguinte.'),
      h('div', { class: 'grid two' },
        alcoholCard(false, '🚫', 'Sem bebida',
          'Nenhuma carta menciona álcool. É o padrão.'),
        alcoholCard(true, '🍻', 'Jogar com bebida',
          `Libera ${alcoholCards} cartas de bebida e uma aba própria nos limites — quem dirige ou não bebe bloqueia individualmente.`)
      ),
      store.setup.alcohol
        ? notice('Mesmo com a bebida ligada, cada jogador escolhe na aba 🍻 o que aceita: gole, dose, beber como prenda, beber do corpo de alguém. Quem bloquear não recebe nenhuma dessas cartas.', 'warn', '🍻')
        : null
    ),

    panel({},
      h('span', { class: 'eyebrow' }, 'passo 1 de 4'),
      h('h2', {}, 'Escolha o modo'),
      h('p', { class: 'dim' },
        'O modo é o limite máximo da noite. Nada acima dele aparece — nem se ' +
        'todo mundo liberar tudo no passo seguinte. Na dúvida, escolha o mais leve: ' +
        'dá para jogar de novo depois.'),
      h('div', { class: 'grid' }, MODE_ORDER.map((id) => modeCard(GAME_MODES[id])))
    ),

    panel({},
      h('h3', {}, 'Como vocês vão jogar?'),
      h('div', { class: 'grid two' },
        screenCard('single', '📱', 'Tela única',
          'Um aparelho passa de mão em mão. Conteúdo privado fica coberto até quem é da vez tocar para revelar.'),
        screenCard('tv', '📺', 'TV / PC',
          'Tela grande mostrando a partida para todos. Ideal para grupo.')
      )
    ),

    mode && mode.custom ? notice(
      'No modo Livre nada vem ligado por padrão: cada jogador liga item por item o que aceita. É o modo mais trabalhoso de configurar e o mais preciso de jogar.',
      '', '🛠️') : null,

    mode && mode.fastFlow ? notice(
      'No Bate-Pronto os limites são definidos uma única vez e a partida vira rola → revela → faz. Sem pontuação e sem objetivos secretos.',
      'warn', '⚡') : null,

    h('div', { class: 'actions' },
      btn('Voltar', { variant: 'ghost', onClick: () => go('home') }),
      btn('Continuar', {
        variant: 'primary',
        disabled: !mode,
        onClick: () => {
          const game = createGame({
            modeId: store.setup.modeId,
            screenMode: store.setup.screenMode,
            alcohol: store.setup.alcohol
          });
          go('players', { game });
        }
      })
    )
  );
}
