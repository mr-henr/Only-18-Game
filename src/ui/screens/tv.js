/**
 * A MESA (TV / PC)
 * ==================================================================
 * Tela que todo mundo olha. Ela nunca mostra conteúdo privado — não
 * por esconder na interface, mas porque o servidor simplesmente não
 * manda esse conteúdo para cá (ver `server/views.js`).
 *
 * Aqui ficam as decisões do grupo: modo, bebida, pares, prendas,
 * intensidade, começar e encerrar.
 */

import QRCode from 'qrcode';
import { h, panel, btn, notice } from '../dom.js';
import { go, setState, store } from '../app.js';
import { GAME_MODES, MODE_ORDER, INTENSITY_LEVELS } from '../../data/gameModes.js';
import { deckForMode, ALL_CARDS } from '../../data/decks/index.js';
import { limitsForMode } from '../../data/limitsCatalog.js';
import { dice3d } from '../components/dice3d.js';
import { send, session, joinAddress, leave, isLocalOnly } from '../../net/session.js';
import { play } from '../fx.js';

/* --------------------------------------------------------------- QR */

let qrCache = { url: null, data: null };

function qrFor(url) {
  if (qrCache.url === url) return qrCache.data;
  QRCode.toDataURL(url, {
    margin: 1, width: 420, errorCorrectionLevel: 'M',
    color: { dark: '#ffffff', light: '#00000000' }
  }).then((data) => {
    qrCache = { url, data };
    setState({});
  }).catch(() => { qrCache = { url, data: null }; });
  return null;
}

/* ------------------------------------------------------------ SETUP */

function setupView() {
  const draft = store.tvSetup ?? { alcohol: false, modeId: null };
  const patch = (p) => setState({ tvSetup: { ...draft, ...p } });

  return h('div', {},
    panel({},
      h('span', { class: 'eyebrow' }, 'antes de tudo'),
      h('h2', {}, 'Vai ter bebida?'),
      h('div', { class: 'grid two' },
        [[false, '🚫', 'Sem bebida', 'Nenhuma carta menciona álcool.'],
         [true, '🍻', 'Com bebida', `Libera ${ALL_CARDS.filter((c) => c.alcohol).length} cartas e uma aba de limites própria.`]]
          .map(([value, icon, title, tag]) => h('button', {
            class: `choice ${draft.alcohol === value ? 'selected' : ''}`,
            onClick: () => patch({ alcohol: value })
          }, h('b', {}, `${icon} ${title}`), h('span', { class: 'tagline' }, tag)))
      )
    ),

    panel({},
      h('span', { class: 'eyebrow' }, 'modo'),
      h('h2', {}, 'Até onde esta noite pode ir?'),
      h('div', { class: 'grid' },
        MODE_ORDER.map((id) => {
          const m = GAME_MODES[id];
          return h('button', {
            class: `choice ${draft.modeId === id ? 'selected' : ''}`,
            onClick: () => patch({ modeId: id })
          },
            h('b', {}, `${m.icon} ${m.name}`, h('span', { class: 'faint soft' }, ` · ${m.subtitle}`)),
            h('span', { class: 'tagline' }, m.tagline),
            h('span', { class: 'meta' },
              `${deckForMode(m.tier, { alcohol: draft.alcohol }).length} cartas · ` +
              `${limitsForMode(m.tier, { alcohol: draft.alcohol }).length} limites · ` +
              `até ${m.maxPlayers} jogadores`)
          );
        })
      ),
      h('div', { class: 'actions center' },
        btn('Abrir para os celulares', {
          variant: 'primary',
          disabled: !draft.modeId,
          onClick: () => send('configure', { modeId: draft.modeId, alcohol: draft.alcohol })
        })
      )
    )
  );
}

/* ------------------------------------------------------------ LOBBY */

function joinPanel(view) {
  const url = joinAddress();
  const qr = qrFor(url);

  return panel({ class: 'join-panel' },
    h('div', { class: 'join-code' },
      h('span', { class: 'eyebrow' }, 'código da sala'),
      h('div', { class: 'code-big' }, view.code),
      h('p', { class: 'dim' }, 'No celular, abra o endereço abaixo e digite este código.'),
      h('div', { class: 'join-url' }, url.replace(/^https?:\/\//, '')),
      isLocalOnly()
        ? notice('Esta mesa está em localhost — nenhum celular vai conseguir entrar. Abra pelo endereço de rede que o servidor imprime.', 'warn', '📡')
        : null
    ),
    qr ? h('img', { class: 'qr', src: qr, alt: `QR code para entrar na sala ${view.code}` })
       : h('div', { class: 'qr placeholder' }, '···')
  );
}

function playersPanel(view) {
  const mode = view.mode;
  return panel({},
    h('h3', {}, `👥 Jogadores (${view.players.length}/${mode.maxPlayers})`),
    view.players.length
      ? h('div', { class: 'scoreboard' },
          view.players.map((p) => h('div', { class: 'score-row' },
            h('div', {},
              h('b', {}, p.connected ? p.name : `${p.name} (desconectado)`),
              h('div', { class: 'faint' },
                p.partnerId
                  ? `par de ${view.players.find((x) => x.id === p.partnerId)?.name}`
                  : 'sem par')
            ),
            h('div', { class: 'row-actions' },
              h('select', {
                class: 'input compact',
                onChange: (e) => send('pair', { a: p.id, b: e.target.value || null })
              },
                h('option', { value: '' }, 'Sem par'),
                view.players.filter((x) => x.id !== p.id).map((x) =>
                  h('option', { value: x.id, selected: p.partnerId === x.id }, x.name))
              ),
              h('span', { class: `pill ${p.ready ? 'allow' : 'ask'}` },
                p.ready ? '✓ limites prontos' : '⏳ configurando')
            )
          )))
      : h('p', { class: 'faint' }, 'Esperando o primeiro celular entrar...')
  );
}

function penaltiesPanel(view) {
  const opts = view.table?.availablePenalties ?? [];
  const chosen = view.penalties.selected.length + (view.penalties.custom ? 1 : 0);

  return panel({},
    h('h3', {}, '🎭 E quem não cumprir?'),
    h('p', { class: 'dim' },
      'Pular não custa nada — essa é a regra. Mas vocês podem combinar uma prenda. ' +
      'Com mais de uma escolhida, o jogo sorteia na hora.'),
    h('div', { class: 'grid two' },
      opts.map((p) => h('button', {
        class: `choice ${view.penalties.selected.includes(p.id) ? 'selected' : ''}`,
        onClick: () => send('penalty', { id: p.id })
      }, h('b', {}, `${p.icon} ${p.label}`), h('span', { class: 'tagline' }, p.detail)))
    ),
    h('div', { class: 'field spaced' },
      h('label', {}, 'Ou escrevam a prenda de vocês'),
      h('input', {
        class: 'input', maxlength: '120', value: view.penalties.custom,
        placeholder: 'Ex.: cantar o refrão de uma música brega em pé na cadeira',
        onChange: (e) => send('customPenalty', { text: e.target.value })
      })
    ),
    chosen
      ? notice(`${chosen} ${chosen === 1 ? 'prenda combinada' : 'prendas combinadas'}.`, 'ok', '🎭')
      : notice('Nenhuma prenda combinada: pular vai continuar sendo de graça.', '', '🛑')
  );
}

function lobbyView(view) {
  const t = view.table ?? {};
  return h('div', {},
    joinPanel(view),
    playersPanel(view),
    penaltiesPanel(view),
    t.issues?.length
      ? t.issues.map((i) => notice(i, 'warn', '⚠️'))
      : notice('Tudo pronto. O teto é o modo escolhido, e dentro dele valem os limites de cada um.', 'ok', '✅'),
    h('div', { class: 'actions center' },
      btn(`Começar · ${view.mode.icon} ${view.mode.name}`, {
        variant: 'primary',
        disabled: !t.ok,
        onClick: () => { play('done'); send('start'); }
      })
    )
  );
}

/* ----------------------------------------------------------- PARTIDA */

function boardCard(view) {
  const card = view.card;

  if (!card) {
    return h('div', { class: 'board-wait' },
      h('div', { class: 'big-hint' }, 'Aguardando a rolagem'),
      h('p', { class: 'dim' }, 'Quem está na vez rola pelo celular.'));
  }

  if (card.kind === 'consent-waiting') {
    return h('div', { class: 'board-wait' },
      h('div', { class: 'lock-big' }, '🔒'),
      h('div', { class: 'big-hint' }, 'Confirmação privada em andamento'),
      h('p', { class: 'dim' },
        'O jogo está perguntando algo a alguém, no celular dessa pessoa. ' +
        'A TV não mostra o quê, nem para quem.'));
  }

  if (card.kind === 'private-hidden') {
    return h('div', { class: 'board-wait' },
      h('div', { class: 'lock-big' }, '🔒'),
      h('div', { class: 'big-hint' }, `${card.holder} recebeu uma carta privada`),
      h('p', { class: 'dim' }, 'Só o celular dela tem o texto.'));
  }

  return h('div', { class: 'card tv-card' },
    h('div', { class: 'card-type' }, card.deck ? `${card.type}` : card.type),
    h('div', { class: 'card-text' }, card.text),
    h('div', { class: 'card-meta' },
      h('span', { class: 'pill' }, `🔥 nível ${card.intensity}`),
      card.participants?.length > 1
        ? h('span', { class: 'pill' }, card.participants.map((p) => p.name).join(' + '))
        : null,
      card.seconds ? h('span', { class: 'pill' }, `⏱️ ${card.seconds}s`) : null
    )
  );
}

function playingView(view) {
  const current = view.players.find((p) => p.current);
  const level = INTENSITY_LEVELS[view.intensity - 1];

  return h('div', { class: 'tv-board' },
    h('div', { class: 'tv-turn' },
      h('span', { class: 'eyebrow' }, view.mode.fastFlow ? 'bate-pronto' : `rodada ${view.round}`),
      h('div', { class: 'who-big' }, current?.name ?? '—')
    ),

    h('div', { class: 'players-row' },
      view.players.map((p) => h('span', {
        class: `player-chip ${p.current ? 'active' : ''} ${p.connected ? '' : 'offline'}`
      }, p.name, h('span', { class: 'chip-xp' }, `⭐${p.score.xp}`)))
    ),

    view.pendingPenalty
      ? h('div', { class: 'board-wait' },
          h('div', { class: 'lock-big' }, view.pendingPenalty.icon),
          h('div', { class: 'big-hint' }, view.pendingPenalty.label),
          h('p', { class: 'dim' }, `${current?.name} pulou — a prenda combinada é essa.`))
      : h('div', {},
          dice3d(view.roll, false),
          boardCard(view)),

    h('div', { class: 'tv-footer' },
      h('div', { class: 'intensity-bar' },
        h('div', { class: 'row' },
          h('b', {}, `${level?.icon ?? ''} Intensidade ${view.intensity} de ${view.ceiling}`),
          h('span', { class: 'dim' }, level?.name ?? '')
        ),
        h('div', { class: 'track' },
          Array.from({ length: 5 }, (_, i) => h('i', {
            class: i < view.intensity ? 'on' : '',
            style: i >= view.ceiling ? { opacity: .25 } : {}
          }))
        ),
        view.progress && !view.progress.noTeto
          ? h('div', { class: 'momentum', style: { marginTop: '8px' } },
              h('div', { class: 'momentum-fill', style: { width: `${view.progress.prontidao * 100}%` } }))
          : null,
        h('p', { class: 'faint center', style: { marginTop: '6px' } },
          view.progress?.noTeto
            ? 'No teto do que foi permitido.'
            : 'A noite sobe sozinha conforme vocês cumprem as cartas.')
      ),
      h('div', { class: 'actions center' },
        btn('− Baixar', { variant: 'ghost', size: 'sm', onClick: () => send('intensity', { direction: 'down' }) }),
        btn('+ Subir', {
          variant: 'ghost', size: 'sm',
          disabled: view.intensity >= view.ceiling,
          onClick: () => { play('levelUp'); send('intensity', { direction: 'up' }); }
        }),
        btn('Encerrar a noite', { variant: 'ghost', size: 'sm', onClick: () => send('end') })
      )
    )
  );
}

/* -------------------------------------------------------------- FIM */

function endedView(view) {
  const s = view.summary;
  return h('div', {},
    panel({ class: 'hero' },
      h('div', { class: 'moon' }, '🌙'),
      h('span', { class: 'eyebrow' }, 'fim da noite'),
      h('h2', {}, `${s?.done ?? 0} desafios cumpridos`),
      h('p', { class: 'dim' },
        `${s?.rounds ?? 0} rodadas, chegando ao nível ${s?.peak ?? 1}.` +
        (s?.skipped ? ` ${s.skipped} cartas puladas, sem penalidade.` : ''))
    ),
    s?.players?.length ? panel({},
      h('h3', {}, 'Como cada um jogou'),
      h('div', { class: 'scoreboard' },
        s.players.map((p, i) => h('div', { class: 'score-row' },
          h('div', {}, h('b', {}, `${i === 0 ? '👑 ' : ''}${p.name}`),
            h('div', { class: 'faint' }, `${p.done} cumpridos · ${p.skipped} pulados`)),
          h('div', { class: 'stats' },
            h('span', {}, `❤️ ${p.score.love}`),
            h('span', {}, `🔥 ${p.score.fire}`),
            h('span', {}, `⭐ ${p.score.xp}`))
        )))
    ) : null,
    h('div', { class: 'actions center' },
      btn('Nova mesa', { variant: 'primary', onClick: () => { leave(); go('home'); } })
    )
  );
}

/* ------------------------------------------------------------- TELA */

export default function tvScreen() {
  const view = session.view;

  if (session.status !== 'open' || !view) {
    return panel({ class: 'privacy-gate' },
      h('div', { class: 'icon float' }, '📺'),
      h('h2', {}, session.status === 'closed' ? 'Reconectando...' : 'Abrindo a mesa...'),
      h('p', { class: 'dim' },
        session.error ??
        'Se demorar, confira se o servidor está rodando: npm run server'),
      h('div', { class: 'actions center' },
        btn('Voltar', { variant: 'ghost', onClick: () => { leave(); go('home'); } }))
    );
  }

  if (view.prompt === 'setup') return setupView();
  if (view.prompt === 'lobby') return lobbyView(view);
  if (view.prompt === 'ended') return endedView(view);
  return playingView(view);
}
