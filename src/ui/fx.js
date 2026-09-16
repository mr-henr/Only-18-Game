/**
 * FEEDBACK AUDIOVISUAL — v0.4
 * ==================================================================
 * Som sintetizado na hora com WebAudio: zero arquivo, zero download,
 * e o timbre acompanha o momento do jogo.
 *
 * O AudioContext só nasce no primeiro toque do usuário, porque
 * navegador nenhum deixa tocar som antes disso.
 */

const STORAGE_KEY = 'nd_sound';

let ctx = null;
let master = null;
let muted = readMuted();

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'off';
  } catch {
    return false;                       // aba anônima, storage bloqueado
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, muted ? 'off' : 'on');
  } catch { /* sem storage: vale só para esta sessão */ }
}

export function isMuted() {
  return muted;
}

export function toggleMuted() {
  muted = !muted;
  persist();
  if (!muted) { ensure(); blip(660, 0.07, 'sine', 0.18); }
  return muted;
}

export const reducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** Cria o contexto na primeira interação. Chamado por qualquer clique. */
export function ensure() {
  if (ctx || muted) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

function now() {
  return ctx.currentTime;
}

/* ------------------------------------------------------------------ */
/* Blocos de síntese                                                   */
/* ------------------------------------------------------------------ */

function blip(freq, dur = 0.12, type = 'sine', gain = 0.3, at = 0, slideTo = null) {
  if (!ensure()) return;
  const t = now() + at;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

/** Ruído filtrado — serve de batida de dado, sopro de carta, etc. */
function noise(dur = 0.08, gain = 0.25, freq = 1400, q = 1, at = 0) {
  if (!ensure()) return;
  const t = now() + at;
  const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buf = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = q;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(filter).connect(g).connect(master);
  src.start(t);
}

/* ------------------------------------------------------------------ */
/* Vocabulário sonoro do jogo                                          */
/* ------------------------------------------------------------------ */

export const sfx = {
  /** Clique discreto de qualquer botão. */
  tap() { blip(420, 0.05, 'triangle', 0.14); },

  /** Os três dados batendo e assentando, um de cada vez. */
  dice() {
    for (let i = 0; i < 9; i++) {
      noise(0.05, 0.12 + Math.random() * 0.1, 900 + Math.random() * 1600, 1.4, i * 0.07);
    }
    [0.72, 0.87, 1.02].forEach((at) => {
      noise(0.09, 0.3, 320, 0.8, at);
      blip(150, 0.1, 'sine', 0.22, at);
    });
  },

  /** A carta sendo virada. */
  flip() {
    noise(0.16, 0.2, 2600, 0.7);
    blip(520, 0.1, 'sine', 0.12, 0.05, 780);
  },

  /** Revelação de conteúdo privado. */
  reveal() {
    blip(660, 0.14, 'sine', 0.22);
    blip(990, 0.2, 'sine', 0.16, 0.07);
  },

  /** Desafio cumprido. */
  done() {
    blip(523, 0.1, 'triangle', 0.24);
    blip(784, 0.18, 'triangle', 0.2, 0.08);
  },

  /** Pulou — sem drama, sem punição sonora. */
  skip() {
    blip(392, 0.1, 'sine', 0.18);
    blip(294, 0.16, 'sine', 0.14, 0.07);
  },

  /** Prenda combinada aparecendo. */
  penalty() {
    blip(330, 0.12, 'sawtooth', 0.14, 0, 240);
    blip(247, 0.22, 'sawtooth', 0.12, 0.1, 180);
  },

  /** A intensidade subiu de nível. */
  levelUp() {
    [523, 659, 784, 1047].forEach((f, i) =>
      blip(f, 0.16, 'triangle', 0.2, i * 0.07));
  },

  /** Confirmação privada aceita. */
  consent() {
    blip(587, 0.1, 'sine', 0.2);
    blip(880, 0.16, 'sine', 0.16, 0.07);
  },

  /** Cronômetro começando. */
  timerStart() { blip(440, 0.09, 'sine', 0.18); blip(660, 0.12, 'sine', 0.14, 0.06); },

  /** Cada segundo da contagem regressiva final. */
  timerTick() { blip(880, 0.05, 'square', 0.1); },

  /** O tempo acabou. */
  timerEnd() {
    [880, 880, 1175].forEach((f, i) =>
      blip(f, i === 2 ? 0.3 : 0.11, 'square', 0.16, i * 0.16));
  },

  /** Fim da noite. */
  finish() {
    [392, 523, 659, 784, 1047].forEach((f, i) =>
      blip(f, 0.28, 'sine', 0.18, i * 0.11));
  }
};

/* ------------------------------------------------------------------ */
/* Vibração                                                            */
/* ------------------------------------------------------------------ */

export function haptic(pattern = 12) {
  if (muted) return;
  try {
    navigator.vibrate?.(pattern);
  } catch { /* desktop, ou permissão negada */ }
}

export const HAPTICS = {
  tap: 10,
  dice: [16, 60, 18, 70, 22],
  reveal: [24, 40, 24],
  done: [14, 50, 26],
  skip: 18,
  penalty: [30, 60, 30],
  levelUp: [18, 40, 18, 40, 40],
  timerStart: 14,
  timerTick: 8,
  timerEnd: [60, 80, 60, 80, 140]
};

/** Dispara som e vibração juntos. */
export function play(name) {
  sfx[name]?.();
  haptic(HAPTICS[name] ?? 10);
}

/* ------------------------------------------------------------------ */
/* Efeito de tela                                                      */
/* ------------------------------------------------------------------ */

/** Clarão de tela inteira quando a intensidade sobe. */
export function screenFlash() {
  if (reducedMotion()) return;
  const el = document.createElement('div');
  el.className = 'level-flash';
  document.body.append(el);
  setTimeout(() => el.remove(), 800);
}
