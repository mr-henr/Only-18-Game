import { h, panel, btn, notice } from '../dom.js';
import { go, setState, store } from '../app.js';
import { getMode, INTENSITY_LEVELS } from '../../data/gameModes.js';
import { summarize } from '../../engine/limitsEngine.js';
import { partnerNotices } from '../../engine/contentFilter.js';
import {
  readinessReport, startGame, intensityCeiling,
  availablePenalties, togglePenalty
} from '../../engine/gameEngine.js';

const DECK_LABEL = {
  questions: '💬 Perguntas', dares: '🎯 Desafios', contact: '💋 Beijos e contato',
  clothing: '👕 Roupa', adult: '🔞 Sexual', power: '⛓️ Poder e exposição',
  drinks: '🍻 Bebida'
};

/**
 * PRENDAS — combinado opcional do grupo.
 * Só entram sugestões que cabem no modo, na bebida e nos limites de
 * TODOS: não adianta oferecer "tire uma peça" se alguém bloqueou roupa.
 */
function penaltyPanel(game) {
  const options = availablePenalties(game);
  const chosen = game.penalties.length + (game.customPenalty ? 1 : 0);

  return panel({ class: 'penalties-panel' },
    h('h3', {}, '🎭 E quem não cumprir?'),
    h('p', { class: 'dim' },
      'Por padrão, pular não custa nada — essa é a regra do jogo e ninguém perde esse direito. ' +
      'Mas vocês podem combinar uma prenda agora. Se escolherem mais de uma, o jogo sorteia na hora.'),

    h('div', { class: 'grid two' },
      options.map((p) => h('button', {
        class: `choice ${game.penalties.includes(p.id) ? 'selected' : ''}`,
        onClick: () => { togglePenalty(game, p.id); setState({}); }
      },
        h('b', {}, `${p.icon} ${p.label}`),
        h('span', { class: 'tagline' }, p.detail)
      ))
    ),

    h('div', { class: 'field', style: { marginTop: '14px' } },
      h('label', {}, 'Ou escrevam a prenda de vocês'),
      h('input', {
        class: 'input',
        placeholder: 'Ex.: cantar o refrão de uma música brega de pé na cadeira',
        maxlength: '120',
        value: game.customPenalty,
        onInput: (e) => { game.customPenalty = e.target.value; }
      })
    ),

    chosen
      ? notice(
          `${chosen} ${chosen === 1 ? 'prenda combinada' : 'prendas combinadas'}. ` +
          'Quando alguém pular, o jogo lembra do combinado — e ainda assim dá a opção de passar mesmo assim.',
          'ok', '🎭')
      : notice('Nenhuma prenda combinada: pular vai continuar sendo de graça.', '', '🛑')
  );
}

export default function reviewScreen() {
  const game = store.game;
  const mode = getMode(game.modeId);
  const report = readinessReport(game);
  const ceiling = intensityCeiling(game);
  const notices = partnerNotices(game.players);

  return h('div', {},
    panel({},
      h('span', { class: 'eyebrow' }, 'passo 4 de 4'),
      h('h2', {}, 'Conferência'),
      h('p', { class: 'dim' },
        'Com o que cada um marcou, o jogo montou a noite de vocês. ' +
        'Ninguém vê as marcações do outro — só o total abaixo.'),

      h('div', { class: 'scoreboard' },
        game.players.map((p) => {
          const s = summarize(p.limits);
          return h('div', { class: 'score-row' },
            h('div', {},
              h('b', {}, p.name),
              h('div', { class: 'faint' },
                p.partnerId ? `par de ${game.players.find((x) => x.id === p.partnerId)?.name}` : 'sem par',
                p.limits.scope === 'partner_only' ? ' · somente com o parceiro' : '',
                ` · teto ${p.limits.maxIntensity}`)
            ),
            h('div', { class: 'pill-row' },
              h('span', { class: 'pill allow' }, `✅ ${s.allow}`),
              h('span', { class: 'pill ask' }, `⚠️ ${s.ask}`),
              h('span', { class: 'pill block' }, `🚫 ${s.block}`)
            )
          );
        })
      )
    ),

    notices.length
      ? notices.map((n) => notice(
          `${n.message} O jogo já está aplicando isso: ${n.fromName} não entra em cartas físicas com outras pessoas.`,
          '', '❤️'))
      : null,

    report.coverage ? panel({},
      h('h3', {}, 'Quantas cartas vocês vão ter'),
      h('p', { class: 'faint' },
        'A partida começa no nível 1 e sobe quando vocês quiserem. ' +
        '"Direta" é a carta que acontece na hora; a outra o jogo pergunta antes.'),
      h('div', { class: 'scoreboard' },
        INTENSITY_LEVELS.filter((l) => l.level <= ceiling).map((lvl) => {
          const c = report.coverage.byIntensity[lvl.level];
          return h('div', { class: 'score-row' },
            h('div', {}, h('b', {}, `${lvl.icon} ${lvl.level} — ${lvl.name}`),
              h('div', { class: 'faint' }, lvl.hint)),
            h('div', { class: 'pill-row' },
              h('span', { class: 'pill allow' }, `${c.free} diretas`),
              c.ask ? h('span', { class: 'pill ask' }, `${c.ask} perguntam antes`) : null
            )
          );
        })
      ),
      h('div', { class: 'pill-row', style: { marginTop: '12px' } },
        Object.entries(report.coverage.decks).map(([deck, n]) =>
          h('span', { class: 'pill' }, `${DECK_LABEL[deck] ?? deck}: ${n}`))
      )
    ) : null,

    penaltyPanel(game),

    report.issues.length
      ? report.issues.map((i) => notice(i, 'warn', '⚠️'))
      : notice('Tudo pronto. O teto é o modo escolhido, e dentro dele valem os limites de cada um.', 'ok', '✅'),

    h('div', { class: 'actions' },
      btn('Revisar limites', { variant: 'ghost', onClick: () => go('limits', { limitsIndex: 0, limitsTab: null, gated: true }) }),
      btn(`Começar · ${mode.icon} ${mode.name}`, {
        variant: 'primary',
        disabled: !report.ok,
        onClick: () => { startGame(game); go('game', { turnGated: game.screenMode === 'single' }); }
      })
    )
  );
}
