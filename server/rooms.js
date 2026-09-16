/**
 * SALAS
 * ==================================================================
 * Uma sala = uma mesa (TV/PC) + os celulares conectados a ela.
 *
 * O motor de jogo roda AQUI, no servidor, e não em cada navegador.
 * Era essa a razão de manter `src/engine/` sem nenhuma linha de DOM:
 * os mesmos arquivos que rodavam no cliente sobem para cá sem alteração.
 */

import { createGame, addPlayer, generateCode } from '../src/engine/gameEngine.js';

/** code -> room */
const rooms = new Map();

/** Sala vazia é descartada depois disto. */
const EMPTY_TTL_MS = 10 * 60 * 1000;

export const STAGES = {
  SETUP: 'setup',       // a mesa ainda está escolhendo bebida e modo
  LOBBY: 'lobby',       // celulares entrando e configurando limites
  PLAYING: 'playing',
  ENDED: 'ended'
};

let clientSeq = 0;

export function createRoom() {
  let code = generateCode();
  while (rooms.has(code)) code = generateCode();

  const room = {
    code,
    stage: STAGES.SETUP,
    game: null,
    clients: new Map(),
    createdAt: Date.now(),
    emptySince: null
  };
  rooms.set(code, room);
  return room;
}

export function getRoom(code) {
  return rooms.get(String(code || '').toUpperCase()) ?? null;
}

/* ------------------------------------------------------------------ */
/* Clientes                                                            */
/* ------------------------------------------------------------------ */

export function attachClient(room, ws, role) {
  const client = {
    id: `c${++clientSeq}`,
    ws,
    role,                // 'table' | 'player'
    playerId: null,
    roomCode: room.code
  };
  room.clients.set(client.id, client);
  room.emptySince = null;
  return client;
}

export function detachClient(room, client) {
  room.clients.delete(client.id);
  if (!room.clients.size) room.emptySince = Date.now();
}

export function tableOf(room) {
  return [...room.clients.values()].find((c) => c.role === 'table') ?? null;
}

/** O celular ligado a um jogador, se ainda estiver conectado. */
export function clientForPlayer(room, playerId) {
  return [...room.clients.values()].find((c) => c.playerId === playerId) ?? null;
}

export function isConnected(room, playerId) {
  return Boolean(clientForPlayer(room, playerId));
}

/* ------------------------------------------------------------------ */
/* Ciclo de vida da partida                                            */
/* ------------------------------------------------------------------ */

/** A mesa fechou bebida + modo: agora a partida existe e aceita gente. */
export function configureRoom(room, { modeId, alcohol }) {
  room.game = createGame({ modeId, alcohol, screenMode: 'tv', roomCode: room.code });
  room.stage = STAGES.LOBBY;
  return room.game;
}

/**
 * Entrada de um celular. Reentrada com o mesmo nome reassume o lugar —
 * quem perdeu o wi-fi no meio da noite volta para a própria cadeira em
 * vez de virar um jogador novo.
 */
export function joinAsPlayer(room, client, name) {
  if (!room.game) return { error: 'A mesa ainda não escolheu o modo.' };

  const wanted = String(name || '').trim().toUpperCase();
  const existing = room.game.players.find((p) => p.name === wanted);

  if (existing) {
    if (isConnected(room, existing.id)) {
      return { error: 'Já existe alguém com esse nome nesta sala.' };
    }
    client.playerId = existing.id;
    return { player: existing, reconnected: true };
  }

  if (room.stage !== STAGES.LOBBY) {
    return { error: 'A partida já começou.' };
  }

  const player = addPlayer(room.game, wanted);
  if (!player) return { error: 'A sala já está cheia para este modo.' };

  client.playerId = player.id;
  return { player, reconnected: false };
}

/* ------------------------------------------------------------------ */
/* Faxina                                                              */
/* ------------------------------------------------------------------ */

export function sweepRooms() {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (room.emptySince && now - room.emptySince > EMPTY_TTL_MS) rooms.delete(code);
  }
}

export function roomStats() {
  return {
    rooms: rooms.size,
    clients: [...rooms.values()].reduce((n, r) => n + r.clients.size, 0)
  };
}
