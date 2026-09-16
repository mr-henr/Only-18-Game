/**
 * SERVIDOR — mesa + celulares
 * ==================================================================
 * HTTP (serve o build, quando existe) + WebSocket (a partida).
 *
 * O estado da partida vive só aqui. Cada cliente recebe uma VISÃO
 * própria, montada em `views.js`, e manda de volta apenas ações.
 * Nenhum navegador tem a partida inteira na mão.
 *
 *   npm run server     servidor sozinho (porta 8787)
 *   npm run dev:tv     Vite + servidor juntos, para desenvolver
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';

import {
  createRoom, getRoom, attachClient, detachClient,
  joinAsPlayer, sweepRooms, roomStats, STAGES
} from './rooms.js';
import { viewFor } from './views.js';
import { applyAction } from './actions.js';

const PORT = Number(process.env.PORT ?? 8787);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2'
};

/* ------------------------------------------------------------------ */
/* HTTP                                                                */
/* ------------------------------------------------------------------ */

function lanAddresses() {
  const out = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const net of list ?? []) {
      if (net.family === 'IPv4' && !net.internal) out.push(net.address);
    }
  }
  return out;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/health') {
    // A interface pode estar publicada em outro domínio (GitHub Pages,
    // por exemplo) e precisa conseguir perguntar daqui se o servidor
    // está de pé. Sem CORS, o navegador bloqueia e o jogo conclui
    // erradamente que não existe servidor nenhum.
    res.writeHead(200, {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'cache-control': 'no-store'
    });
    return res.end(JSON.stringify({ ok: true, ...roomStats() }));
  }

  if (!fs.existsSync(DIST)) {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    return res.end(
      'Servidor de partidas no ar.\n\n' +
      'Em desenvolvimento, abra a interface pelo Vite (npm run dev).\n' +
      'Para servir tudo por aqui, rode antes: npm run build\n'
    );
  }

  // SPA: qualquer rota desconhecida cai no index.html.
  let file = path.join(DIST, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(DIST, 'index.html');
  }

  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

/* ------------------------------------------------------------------ */
/* WebSocket                                                           */
/* ------------------------------------------------------------------ */

const wss = new WebSocketServer({ server });

const send = (ws, message) => {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(message));
};

/** Reenvia a visão para todo mundo da sala — cada um recebe a sua. */
function broadcast(room) {
  for (const client of room.clients.values()) {
    send(client.ws, { t: 'view', view: viewFor(room, client) });
  }
}

wss.on('connection', (ws) => {
  let room = null;
  let client = null;

  send(ws, { t: 'hello', lan: lanAddresses(), port: PORT });

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(String(raw));
    } catch {
      return send(ws, { t: 'error', message: 'Mensagem inválida.' });
    }

    /* --- abrir a mesa --------------------------------------------- */
    if (msg.t === 'host') {
      room = createRoom();
      client = attachClient(room, ws, 'table');
      send(ws, { t: 'joined', role: 'table', code: room.code });
      return broadcast(room);
    }

    /* --- um celular entrando --------------------------------------- */
    if (msg.t === 'join') {
      const target = getRoom(msg.code);
      if (!target) return send(ws, { t: 'error', message: 'Sala não encontrada. Confira o código.' });

      room = target;
      client = attachClient(room, ws, 'player');

      const result = joinAsPlayer(room, client, msg.name);
      if (result.error) {
        detachClient(room, client);
        room = null; client = null;
        return send(ws, { t: 'error', message: result.error });
      }

      send(ws, {
        t: 'joined', role: 'player', code: room.code,
        playerId: result.player.id, name: result.player.name,
        reconnected: result.reconnected
      });
      return broadcast(room);
    }

    /* --- qualquer ação de jogo -------------------------------------- */
    if (msg.t === 'action') {
      if (!room || !client) return send(ws, { t: 'error', message: 'Você não está em uma sala.' });
      const result = applyAction(room, client, msg);
      if (!result.ok) send(ws, { t: 'error', message: result.error });
      return broadcast(room);
    }

    if (msg.t === 'ping') return send(ws, { t: 'pong' });
  });

  ws.on('close', () => {
    if (!room || !client) return;
    detachClient(room, client);
    // A mesa caindo não derruba a partida: o estado fica de pé e ela
    // pode voltar. Os outros só veem o jogador como desconectado.
    broadcast(room);
    room = null; client = null;
  });

  ws.on('error', () => { /* o close cuida da limpeza */ });
});

setInterval(sweepRooms, 60_000).unref?.();

server.listen(PORT, () => {
  const urls = lanAddresses().map((ip) => `http://${ip}:${PORT}`);
  console.log(`\n🎲 Noite de Desafios — servidor de partidas`);
  console.log(`   local:  http://localhost:${PORT}`);
  for (const u of urls) console.log(`   rede:   ${u}`);
  console.log(`\n   Os celulares precisam usar o endereço de REDE, não localhost.\n`);
});
