/**
 * CRONÔMETRO DAS CARTAS
 * ==================================================================
 * 72 das 243 cartas pedem um tempo ("por 2 minutos") e até aqui
 * ninguém contava. Este componente conta.
 *
 * O ponto delicado é sobreviver ao re-render: a tela inteira é
 * recriada a cada `setState` (um aviso na barra superior sumindo já
 * basta), e um cronômetro que morre no meio da contagem seria pior
 * que não ter cronômetro nenhum.
 *
 * Por isso o estado vive AQUI, num módulo, e não no store:
 *  - o tempo restante é sempre derivado de `endsAt`, um instante
 *    absoluto — então não importa quantos re-renders aconteçam, nem
 *    se o navegador congelou a aba por um tempo;
 *  - o tique escreve direto no DOM, sem passar pelo `setState`, para
 *    não redesenhar a tela uma vez por segundo.
 */

import { h, svg, btn } from '../dom.js';
import { play, sfx, haptic } from '../fx.js';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Estado único: só existe um cronômetro por vez na tela. */
const state = {
  key: null,        // identifica a carta atual
  total: 0,         // duração em segundos
  endsAt: 0,        // instante absoluto do fim
  paused: true,
  remaining: 0,     // usado enquanto pausado
  finished: false,
  lastBeep: null,
  rerender: null   // guardado no render, usado quando o tempo acaba sozinho
};

let ticker = null;
let nodes = null;   // refs do render atual

/* ------------------------------------------------------------------ */

function secondsLeft() {
  if (state.paused) return state.remaining;
  return Math.max(0, (state.endsAt - Date.now()) / 1000);
}

function format(s) {
  const total = Math.ceil(s);
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : String(sec);
}

function paint() {
  if (!nodes?.text?.isConnected) return;
  const left = secondsLeft();
  const progress = state.total ? left / state.total : 0;

  nodes.text.textContent = format(left);
  nodes.ring.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
  nodes.wrap.classList.toggle('ending', left <= 5 && left > 0 && !state.paused);
  nodes.wrap.classList.toggle('finished', state.finished);
}

function tick() {
  const left = secondsLeft();

  // Contagem regressiva audível nos últimos segundos.
  const whole = Math.ceil(left);
  if (!state.paused && whole <= 5 && whole > 0 && state.lastBeep !== whole) {
    state.lastBeep = whole;
    sfx.timerTick();
    haptic(8);
  }

  if (left <= 0 && !state.paused) {
    state.paused = true;
    state.remaining = 0;
    state.finished = true;
    stopTicker();
    play('timerEnd');
    paint();
    // O tempo acabou sem ninguem clicar em nada: sem este redesenho,
    // os botoes continuariam mostrando "Pausar" num relogio parado.
    state.rerender?.();
    return;
  }
  paint();
}

function startTicker() {
  stopTicker();
  ticker = setInterval(tick, 120);   // granularidade fina para o anel
}

function stopTicker() {
  if (ticker) clearInterval(ticker);
  ticker = null;
}

/** Zera tudo — chamado quando a carta muda ou o turno acaba. */
export function resetTimer() {
  stopTicker();
  state.key = null;
  state.rerender = null;
  state.finished = false;
  state.paused = true;
  state.lastBeep = null;
}

/* ------------------------------------------------------------------ */
/* Controles                                                           */
/* ------------------------------------------------------------------ */

function start(rerender) {
  state.endsAt = Date.now() + state.remaining * 1000;
  state.paused = false;
  state.finished = false;
  state.lastBeep = null;
  play('timerStart');
  startTicker();
  rerender();
}

function pause(rerender) {
  state.remaining = secondsLeft();
  state.paused = true;
  stopTicker();
  rerender();
}

function restart(rerender) {
  state.remaining = state.total;
  state.finished = false;
  state.lastBeep = null;
  state.paused = true;
  stopTicker();
  rerender();
}

/* ------------------------------------------------------------------ */
/* Render                                                              */
/* ------------------------------------------------------------------ */

/**
 * @param {string} key       id estável da carta em jogo
 * @param {number} seconds   duração pedida pela carta
 * @param {function} rerender  redesenha a tela (setState do app)
 */
export function timer(key, seconds, rerender) {
  // Carta nova: recomeça do zero, sem herdar a contagem anterior.
  if (state.key !== key) {
    stopTicker();
    Object.assign(state, {
      key, total: seconds, remaining: seconds,
      paused: true, finished: false, lastBeep: null, endsAt: 0
    });
  }

  // Se o cronômetro estava correndo antes deste re-render, ele
  // continua: `endsAt` é absoluto, então nada se perde.
  state.rerender = rerender;
  if (!state.paused && !ticker) startTicker();

  const left = secondsLeft();
  const progress = state.total ? left / state.total : 0;

  const ring = svg('circle', {
    class: 'ring-fg', cx: '60', cy: '60', r: String(RADIUS),
    style: {
      strokeDasharray: String(CIRCUMFERENCE),
      strokeDashoffset: String(CIRCUMFERENCE * (1 - progress))
    }
  });

  const text = h('div', { class: 'timer-value' }, format(left));

  const wrap = h('div', {
    class: [
      'timer',
      state.finished ? 'finished' : '',
      !state.paused && left <= 5 ? 'ending' : '',
      state.paused ? 'paused' : 'running'
    ].filter(Boolean).join(' ')
  },
    h('div', { class: 'timer-dial' },
      svg('svg', { class: 'ring', viewBox: '0 0 120 120', 'aria-hidden': 'true' },
        svg('circle', { class: 'ring-bg', cx: '60', cy: '60', r: String(RADIUS) }),
        ring
      ),
      h('div', { class: 'timer-center' },
        text,
        h('div', { class: 'timer-unit' }, state.finished ? 'acabou' : 'segundos')
      )
    ),

    h('div', { class: 'timer-actions' },
      state.paused && !state.finished
        ? btn(state.remaining === state.total ? '▶ Iniciar' : '▶ Continuar',
            { variant: 'primary', size: 'sm', onClick: () => start(rerender) })
        : null,
      !state.paused
        ? btn('⏸ Pausar', { variant: 'secondary', size: 'sm', onClick: () => pause(rerender) })
        : null,
      state.remaining !== state.total || state.finished
        ? btn('↺ Zerar', { variant: 'ghost', size: 'sm', onClick: () => restart(rerender) })
        : null
    )
  );

  // Guardamos as refs para o tique escrever direto, sem re-render.
  nodes = { wrap, ring, text };
  return wrap;
}

/** A carta em jogo pede tempo? Devolve os segundos, ou null. */
export function durationOf(play) {
  for (const value of Object.values(play?.values ?? {})) {
    if (value && typeof value.seconds === 'number') return value.seconds;
  }
  return null;
}
