/**
 * SESSÃO DE REDE
 * ==================================================================
 * O cliente do modo TV + celulares. Ele é deliberadamente burro: não
 * guarda partida, não calcula regra, não sabe quais cartas existem.
 * Recebe a VISÃO que o servidor montou para este papel e devolve ações.
 *
 * É o que garante a privacidade de verdade: o que este aparelho não
 * pode ver simplesmente nunca chega nele.
 */

const STORAGE_KEY = 'nd_sessao';

export const session = {
  status: 'idle',      // idle | connecting | open | closed | error
  role: null,          // 'table' | 'player'
  code: null,
  playerId: null,
  name: null,
  view: null,
  error: null,
  lan: [],
  port: null
};

let ws = null;
let listeners = new Set();
let reconnectTimer = null;
let intent = null;     // o que refazer ao reconectar

export function onUpdate(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) fn(session);
}

/* ------------------------------------------------------------------ */

/**
 * Onde mora o servidor de partidas.
 *
 * `VITE_SERVER_URL` permite publicar a interface em um lugar (GitHub
 * Pages, por exemplo) e o servidor em outro. Sem ela, assumimos que o
 * servidor está junto: mesma máquina, porta 8787 em desenvolvimento.
 */
const CONFIGURED = (import.meta.env?.VITE_SERVER_URL ?? '').trim();

function serverBase() {
  if (CONFIGURED) return CONFIGURED.replace(/\/$/, '');
  const port = location.port === '5173' ? '8787' : location.port;
  return `${location.protocol}//${location.hostname}${port ? ':' + port : ''}`;
}

function socketUrl() {
  const base = serverBase();
  return base.replace(/^http/, 'ws');
}

/* ------------------------------------------------------------------ */
/* Existe servidor?                                                    */
/* ------------------------------------------------------------------ */

let serverState = null;   // null = ainda não sabemos
let probing = false;

/**
 * O modo TV precisa de um servidor rodando. Numa hospedagem estática
 * (GitHub Pages sozinho) ele não existe — e é melhor dizer isso na
 * cara do que deixar o botão girar para sempre.
 */
export function serverAvailable() {
  if (serverState !== null) return serverState;
  if (CONFIGURED) return true;
  return !/\.github\.io$/.test(location.hostname);
}

export function serverChecked() {
  return serverState !== null;
}

/** True enquanto estamos esperando um servidor configurado acordar. */
export function serverWaking() {
  return probing && Boolean(CONFIGURED) && serverState === null;
}

/**
 * Confere de verdade, uma vez, e avisa quem estiver ouvindo.
 *
 * O tempo de espera muda conforme o que sabemos: se `VITE_SERVER_URL`
 * foi configurada, existe um servidor e ele pode só estar dormindo —
 * hospedagens gratuitas costumam derrubar o processo depois de alguns
 * minutos parados e levam quase um minuto para voltar. Desistir em 2
 * segundos ali seria dar a resposta errada.
 */
export async function probeServer() {
  if (serverState !== null || probing) return serverState;
  probing = true;
  emit();

  const limite = CONFIGURED ? 75_000 : 2_500;
  try {
    const res = await fetch(`${serverBase()}/health`, {
      signal: AbortSignal.timeout?.(limite),
      cache: 'no-store'
    });
    serverState = res.ok;
  } catch {
    serverState = false;
  }
  probing = false;
  emit();
  return serverState;
}

function remember() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      role: session.role, code: session.code, name: session.name
    }));
  } catch { /* sem storage: só não reconecta sozinho */ }
}

export function lastSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
  } catch {
    return null;
  }
}

export function forgetSession() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ok */ }
}

/* ------------------------------------------------------------------ */

function connect(onOpen) {
  clearTimeout(reconnectTimer);
  session.status = 'connecting';
  session.error = null;
  emit();

  try {
    ws = new WebSocket(socketUrl());
  } catch {
    session.status = 'error';
    session.error = 'Não consegui falar com o servidor.';
    return emit();
  }

  ws.addEventListener('open', () => {
    session.status = 'open';
    emit();
    onOpen?.();
  });

  ws.addEventListener('message', (ev) => {
    let msg;
    try { msg = JSON.parse(ev.data); } catch { return; }

    if (msg.t === 'hello') {
      session.lan = msg.lan ?? [];
      session.port = msg.port ?? null;
      return emit();
    }
    if (msg.t === 'joined') {
      session.role = msg.role;
      session.code = msg.code;
      session.playerId = msg.playerId ?? null;
      session.name = msg.name ?? session.name;
      session.error = null;
      remember();
      return emit();
    }
    if (msg.t === 'view') {
      session.view = msg.view;
      return emit();
    }
    if (msg.t === 'error') {
      session.error = msg.message;
      return emit();
    }
  });

  ws.addEventListener('close', () => {
    session.status = 'closed';
    emit();
    // Reconexão silenciosa: quem entrou volta para a própria cadeira.
    if (intent) reconnectTimer = setTimeout(() => connect(intent), 1200);
  });

  ws.addEventListener('error', () => {
    session.error = session.error ?? 'Conexão perdida. Tentando de novo...';
    emit();
  });
}

function raw(message) {
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
}

/* ------------------------------------------------------------------ */
/* API                                                                 */
/* ------------------------------------------------------------------ */

/** Abre a mesa (TV/PC). */
export function hostTable() {
  intent = () => raw({ t: 'host' });
  session.role = 'table';
  connect(intent);
}

/** Entra pelo celular. */
export function joinRoom(code, name) {
  const clean = String(code || '').trim().toUpperCase();
  session.code = clean;
  session.name = String(name || '').trim().toUpperCase();
  intent = () => raw({ t: 'join', code: clean, name: session.name });
  session.role = 'player';
  connect(intent);
}

/** Manda uma ação de jogo. */
export function send(action, payload = {}) {
  raw({ t: 'action', action, payload });
}

export function leave() {
  intent = null;
  clearTimeout(reconnectTimer);
  forgetSession();
  try { ws?.close(); } catch { /* ok */ }
  ws = null;
  Object.assign(session, {
    status: 'idle', role: null, code: null, playerId: null,
    name: null, view: null, error: null
  });
  emit();
}

/** Endereço que os celulares devem digitar. */
export function joinAddress() {
  const base = location.port === '5173'
    ? `${location.protocol}//${location.hostname}:5173`
    : location.origin;
  return session.code ? `${base}/?sala=${session.code}` : base;
}

/** True quando a mesa foi aberta em localhost e nenhum celular vai alcançar. */
export function isLocalOnly() {
  return ['localhost', '127.0.0.1', '::1'].includes(location.hostname);
}
