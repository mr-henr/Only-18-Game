/**
 * SHELL DA APLICACAO
 * Router simples + store global. A UI nunca calcula regra de jogo:
 * ela apenas le o estado e chama os metodos do engine.
 */

import { h } from './dom.js';
import { GAME_MODES } from '../data/gameModes.js';
import { intensityCeiling } from '../engine/gameEngine.js';
import { ensure, sfx, haptic, isMuted, toggleMuted } from './fx.js';

import homeScreen from './screens/home.js';
import modeScreen from './screens/mode.js';
import playersScreen from './screens/players.js';
import limitsScreen from './screens/limits.js';
import reviewScreen from './screens/review.js';
import gameScreen from './screens/game.js';
import endScreen from './screens/end.js';
import tutorialScreen from './screens/tutorial.js';
import connectScreen from './screens/connect.js';
import tvScreen from './screens/tv.js';
import remoteScreen from './screens/remote.js';
import { session, onUpdate } from '../net/session.js';

export const store = {
  screen: 'home',
  setup: { modeId: null, screenMode: 'single', alcohol: false },
  game: null,
  limitsIndex: 0,
  limitsTab: null,
  gated: true,          // porta de privacidade do "passe o aparelho"
  turnGated: true,
  transient: null,      // mensagem efemera na barra superior

  // Estado puramente visual (v0.4)
  rolling: false,       // dados no ar
  revealed: false,      // carta privada ja virada
  consentGated: true,   // porta da confirmacao privada
  justLit: false,       // segmento de intensidade recem-aceso
  tvSetup: null,        // rascunho de modo/bebida na mesa
  tutorialStep: 0,
  tutorialChoice: null
};

// Qualquer novidade vinda do servidor redesenha a tela em rede.
onUpdate(() => {
  // A home e a tela de entrada mostram se existe servidor por perto.
  if (NETWORKED.has(store.screen) || store.screen === 'home' || store.screen === 'connect') render();
});

const SCREENS = {
  home: homeScreen,
  mode: modeScreen,
  players: playersScreen,
  limits: limitsScreen,
  review: reviewScreen,
  game: gameScreen,
  end: endScreen,
  tutorial: tutorialScreen,
  connect: connectScreen,
  tv: tvScreen,
  remote: remoteScreen
};

/** Telas que vivem de uma sala em rede, e não do jogo local. */
const NETWORKED = new Set(['tv', 'remote']);

export function setState(patch = {}) {
  Object.assign(store, patch);
  render();
}

export function go(screen, patch = {}) {
  setState({ screen, ...patch });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function flash(message, ms = 2200) {
  setState({ transient: message });
  setTimeout(() => setState({ transient: null }), ms);
}

/* ------------------------------------------------------------------ */
/* Som: um clique global, para nao instrumentar botao por botao        */
/* ------------------------------------------------------------------ */

let soundBound = false;

function bindSound() {
  if (soundBound) return;
  soundBound = true;
  document.addEventListener('pointerdown', (e) => {
    ensure();                                   // WebAudio só nasce num gesto
    const btn = e.target.closest?.('.btn, .choice, .tab, .tri button, .scope-option');
    if (!btn) return;
    // Posicao do toque alimenta o brilho do botao (ver motion.css).
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--px', `${((e.clientX - r.left) / r.width) * 100}%`);
    btn.style.setProperty('--py', `${((e.clientY - r.top) / r.height) * 100}%`);
    sfx.tap();
    haptic(8);
  }, { passive: true });
}

/* ------------------------------------------------------------------ */
/* Barra superior                                                      */
/* ------------------------------------------------------------------ */

function soundButton() {
  return h('button', {
    class: 'icon-btn',
    title: isMuted() ? 'Ativar som' : 'Silenciar',
    'aria-label': isMuted() ? 'Ativar som' : 'Silenciar',
    onClick: () => { toggleMuted(); setState({}); }
  }, isMuted() ? '🔇' : '🔊');
}

function topbar() {
  const mode = store.setup.modeId ? GAME_MODES[store.setup.modeId] : null;
  const game = store.game;

  const right = h('div', { class: 'topbar-right' });

  if (store.transient) {
    right.append(h('span', { class: 'pill accent' }, store.transient));
  } else if (game && store.screen === 'game') {
    right.append(
      h('span', { class: 'pill' }, `🔥 ${game.intensity}/${intensityCeiling(game)}`),
      h('span', { class: 'pill hide-sm' }, `Rodada ${game.round}`)
    );
  } else if (NETWORKED.has(store.screen) && session.view) {
    const v = session.view;
    if (v.mode) right.append(h('span', { class: 'pill accent' }, `${v.mode.icon} ${v.mode.name}`));
    if (v.code) right.append(h('span', { class: 'pill' }, `sala ${v.code}`));
    if (session.status !== 'open') {
      right.append(h('span', { class: 'pill block' }, '⚠ sem conexão'));
    }
  } else if (mode) {
    right.append(h('span', { class: 'pill accent' }, `${mode.icon} ${mode.name}`));
    if (store.setup.alcohol) right.append(h('span', { class: 'pill' }, '🍻'));
  }

  right.append(soundButton());

  return h('header', { class: 'topbar' },
    h('div', { class: 'brand' },
      h('b', {}, 'NOITE DE DESAFIOS'),
      h('span', { class: 'hide-sm' }, 'v0.7 · 18+')
    ),
    right
  );
}

/* ------------------------------------------------------------------ */
/* Render                                                              */
/* ------------------------------------------------------------------ */

let lastScreen = null;

export function render() {
  bindSound();

  const root = document.getElementById('root');
  const screen = SCREENS[store.screen] ?? homeScreen;

  // A paleta inteira do jogo vem do modo escolhido (ver themes.css).
  // Em rede, o modo chega na visão do servidor.
  document.documentElement.dataset.mode =
    (NETWORKED.has(store.screen) ? session.view?.mode?.id : store.setup.modeId) ?? '';
  document.documentElement.dataset.surface =
    store.screen === 'tv' ? 'tv' : store.screen === 'remote' ? 'phone' : 'auto';

  // Só anima a entrada quando a TELA muda. Sem isso, cada clique num
  // limite faria a página inteira deslizar de novo.
  const changed = store.screen !== lastScreen;
  lastScreen = store.screen;

  const main = h('main', { class: store.screen === 'limits' ? 'wide' : '' },
    h('div', { class: changed ? 'screen screen-enter' : 'screen' }, screen(store))
  );

  root.replaceChildren(h('div', { class: 'app' }, topbar(), main));
}
