/**
 * AÇÕES
 * ==================================================================
 * Tudo que um cliente pode pedir, e quem tem direito de pedir.
 *
 * A divisão segue o que faz sentido na sala de verdade:
 *  - a MESA decide o que é do grupo (modo, bebida, pares, prendas,
 *    intensidade, começar e encerrar);
 *  - o CELULAR decide o que é da pessoa (seus limites, sua rolagem,
 *    sua confirmação, cumprir ou pular a própria carta).
 *
 * Nenhuma ação confia no que o cliente diz ser: o `playerId` vem da
 * conexão, nunca da mensagem.
 */

import { LIMIT_STATES } from '../src/data/gameModes.js';
import { LIMITS_BY_ID } from '../src/data/limitsCatalog.js';
import { createLimitState, applyMirrors } from '../src/engine/limitsEngine.js';
import {
  PHASES, currentPlayer, roll, complete, skip, answerConsent,
  resolvePenalty, raiseIntensity, lowerIntensity, startGame, endGame,
  linkPartners, unlinkPartners, autoPairCouple, removePlayer, togglePenalty,
  readinessReport
} from '../src/engine/gameEngine.js';
import { configureRoom, STAGES } from './rooms.js';

const VALID_STATES = new Set([LIMIT_STATES.ALLOW, LIMIT_STATES.ASK, LIMIT_STATES.BLOCK, LIMIT_STATES.UNSET]);

class Denied extends Error {}
const deny = (msg) => { throw new Denied(msg); };

/* ------------------------------------------------------------------ */
/* Limites: reconstruídos do zero, nunca aceitos como vieram           */
/* ------------------------------------------------------------------ */

/**
 * O celular manda a configuração inteira de uma vez (é privada dele,
 * não faz sentido um ida-e-volta por item). Mas o que chega é dado de
 * rede: montamos um estado limpo pelo modo e só aplicamos o que for
 * item conhecido com valor conhecido.
 */
function sanitizeLimits(game, incoming) {
  const clean = createLimitState(game.modeId, { alcohol: game.alcohol });
  const entries = incoming?.entries ?? {};

  for (const [id, entry] of Object.entries(entries)) {
    if (!Object.hasOwn(clean.entries, id)) continue;       // item inexistente ou fora do teto
    if (!VALID_STATES.has(entry?.state)) continue;
    clean.entries[id].state = entry.state;
    clean.entries[id].source = entry.source === 'user' ? 'user' : 'mode-default';
    clean.entries[id].confirmed = entry.confirmed !== false;
  }

  applyMirrors(clean);

  // A dupla confirmação não pode ser burlada pela rede: o que o celular
  // diz ter confirmado só vale para item que ele realmente herdou.
  for (const [id, entry] of Object.entries(clean.entries)) {
    if (entry.source === 'inherited') {
      entry.confirmed = entries[id]?.confirmed === true;
    }
  }

  const scope = incoming?.scope === 'partner_only' ? 'partner_only' : 'any_player';
  clean.scope = scope;

  const max = Number(incoming?.maxIntensity);
  clean.maxIntensity = Number.isFinite(max)
    ? Math.min(Math.max(1, Math.round(max)), clean.maxIntensity)
    : clean.maxIntensity;

  clean.wishlist = Array.isArray(incoming?.wishlist)
    ? incoming.wishlist.filter((id) => LIMITS_BY_ID[id]).slice(0, 60)
    : [];

  clean.ready = true;
  return clean;
}

/* ------------------------------------------------------------------ */

function requireTable(client) {
  if (client.role !== 'table') deny('Só a mesa pode fazer isso.');
}

function requirePlayer(client) {
  if (client.role !== 'player' || !client.playerId) deny('Entre com um nome primeiro.');
}

function requireCurrent(room, client) {
  requirePlayer(client);
  if (currentPlayer(room.game)?.id !== client.playerId) deny('Não é a sua vez.');
}

function requirePlaying(room) {
  if (room.stage !== STAGES.PLAYING) deny('A partida não está em andamento.');
}

/* ------------------------------------------------------------------ */
/* Tabela de ações                                                     */
/* ------------------------------------------------------------------ */

const HANDLERS = {
  /* ---------------------------------------------------- mesa (TV) */

  configure(room, client, { modeId, alcohol }) {
    requireTable(client);
    if (room.stage !== STAGES.SETUP) deny('A sala já foi configurada.');
    configureRoom(room, { modeId, alcohol: Boolean(alcohol) });
  },

  pair(room, client, { a, b }) {
    requireTable(client);
    if (b) linkPartners(room.game, a, b);
    else unlinkPartners(room.game, a);
  },

  kick(room, client, { playerId }) {
    requireTable(client);
    if (room.stage !== STAGES.LOBBY) deny('Só dá para remover alguém antes de começar.');
    removePlayer(room.game, playerId);
  },

  penalty(room, client, { id }) {
    requireTable(client);
    togglePenalty(room.game, id);
  },

  customPenalty(room, client, { text }) {
    requireTable(client);
    room.game.customPenalty = String(text ?? '').slice(0, 120);
  },

  start(room, client) {
    requireTable(client);
    if (room.stage !== STAGES.LOBBY) deny('A partida já começou.');
    autoPairCouple(room.game);
    const report = readinessReport(room.game);
    if (!report.ok) deny(report.issues[0] ?? 'Ainda falta alguma coisa.');
    startGame(room.game);
    room.stage = STAGES.PLAYING;
  },

  intensity(room, client, { direction }) {
    requireTable(client);
    requirePlaying(room);
    if (direction === 'up') raiseIntensity(room.game);
    else lowerIntensity(room.game);
  },

  end(room, client) {
    requireTable(client);
    endGame(room.game);
    room.stage = STAGES.ENDED;
  },

  /* ------------------------------------------------ celular (jogador) */

  limits(room, client, { limits }) {
    requirePlayer(client);
    const me = room.game.players.find((p) => p.id === client.playerId);
    if (!me) deny('Jogador não encontrado.');
    me.limits = sanitizeLimits(room.game, limits);
  },

  roll(room, client) {
    requireCurrent(room, client);
    requirePlaying(room);
    if (room.game.phase === PHASES.PENALTY) deny('Resolva a prenda primeiro.');
    roll(room.game);
  },

  consent(room, client, { accepted }) {
    requirePlayer(client);
    requirePlaying(room);
    const consent = room.game.play?.consent;
    if (!consent) deny('Não há confirmação pendente.');
    const answers = consent.answers ?? {};
    const asking = consent.pendingFrom.find((id) => answers[id] == null);
    if (asking !== client.playerId) deny('Esta confirmação não é sua.');

    answerConsent(room.game, client.playerId, Boolean(accepted));
    // Recusa não revela quem recusou: o jogo apenas sorteia outra.
    if (!accepted) roll(room.game);
  },

  done(room, client) {
    requireCurrent(room, client);
    requirePlaying(room);
    if (!room.game.play) deny('Não há carta em jogo.');
    complete(room.game);
  },

  skip(room, client) {
    requireCurrent(room, client);
    requirePlaying(room);
    if (!room.game.play) deny('Não há carta em jogo.');
    skip(room.game);
  },

  penaltyDone(room, client, { paid }) {
    requireCurrent(room, client);
    if (room.game.phase !== PHASES.PENALTY) deny('Não há prenda pendente.');
    resolvePenalty(room.game, Boolean(paid));
  }
};

/**
 * @returns {{ok: boolean, error?: string}}
 */
export function applyAction(room, client, message) {
  const handler = HANDLERS[message?.action];
  if (!handler) return { ok: false, error: 'Ação desconhecida.' };
  if (!room.game && message.action !== 'configure') {
    return { ok: false, error: 'A mesa ainda não configurou a partida.' };
  }

  try {
    handler(room, client, message.payload ?? {});
    return { ok: true };
  } catch (err) {
    if (err instanceof Denied) return { ok: false, error: err.message };
    console.error('[ação falhou]', message.action, err);
    return { ok: false, error: 'Algo deu errado no servidor.' };
  }
}
