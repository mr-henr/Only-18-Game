import { h, panel, btn } from '../dom.js';
import { go, store } from '../app.js';
import { getMode, INTENSITY_LEVELS } from '../../data/gameModes.js';
import { summary } from '../../engine/gameEngine.js';

export default function endScreen() {
  const game = store.game;
  const mode = getMode(game.modeId);
  const s = summary(game);
  const peak = INTENSITY_LEVELS[s.peak - 1];

  return h('div', {},
    panel({ class: 'hero' },
      h('div', { style: { fontSize: '48px' } }, '🌙'),
      h('span', { class: 'eyebrow' }, 'fim da noite'),
      h('h2', {}, `${s.done} ${s.done === 1 ? 'desafio cumprido' : 'desafios cumpridos'}`),
      h('p', { class: 'dim' },
        `${s.rounds} ${s.rounds === 1 ? 'rodada' : 'rodadas'} no modo ${mode.icon} ${mode.name}, chegando ao nível ${peak?.icon} ${s.peak} — ${peak?.name}.`,
        s.skipped ? ` ${s.skipped} ${s.skipped === 1 ? 'carta foi pulada' : 'cartas foram puladas'}, sem penalidade.` : '')
    ),

    !mode.fastFlow ? panel({},
      h('h3', {}, 'Como cada um jogou'),
      h('div', { class: 'scoreboard' },
        s.players.map((p, i) => h('div', { class: 'score-row' },
          h('div', {},
            h('b', {}, `${i === 0 ? '👑 ' : ''}${p.name}`),
            h('div', { class: 'faint' }, `${p.done} cumpridos · ${p.skipped} pulados`)
          ),
          h('div', { class: 'stats' },
            h('span', {}, `❤️ ${p.score.love}`),
            h('span', {}, `🔥 ${p.score.fire}`),
            h('span', {}, `⭐ ${p.score.xp}`)
          )
        ))
      )
    ) : null,

    game.history.length ? panel({},
      h('h3', {}, 'O que rolou'),
      h('div', { class: 'scoreboard' },
        game.history.slice(-10).reverse().map((entry) => h('div', { class: 'score-row' },
          h('div', { style: { minWidth: 0 } },
            h('div', { style: { fontSize: '14px' } }, entry.text)
          ),
          h('span', { class: `pill ${entry.outcome === 'done' ? 'allow' : 'block'}` },
            entry.outcome === 'done' ? '✓' : '🛑')
        ))
      )
    ) : null,

    h('div', { class: 'actions center' },
      btn('Jogar de novo', {
        variant: 'primary',
        onClick: () => go('home', { game: null, setup: { modeId: null, screenMode: 'single', alcohol: false } })
      })
    )
  );
}
