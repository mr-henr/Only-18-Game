/**
 * VERIFICACAO DO MOTOR — `npm run check`
 * ==================================================================
 * Roda o motor sem navegador e valida as regras que nao podem quebrar:
 * teto do modo, dupla confirmacao, cascatas, bloqueio por parte do
 * corpo e regra do parceiro. Serve como rede de seguranca sempre que
 * o catalogo de limites ou os baralhos forem alterados.
 */

import { LIMITS, LIMITS_BY_ID, limitsForMode, groupsForMode } from '../src/data/limitsCatalog.js';
import { ALL_CARDS, deckStats, deckForMode } from '../src/data/decks/index.js';
import { GAME_MODES } from '../src/data/gameModes.js';
import * as L from '../src/engine/limitsEngine.js';
import * as F from '../src/engine/contentFilter.js';
import * as G from '../src/engine/gameEngine.js';
import { countVariations } from '../src/engine/slotResolver.js';

let failures = 0;

function check(label, condition, detail = '') {
  const ok = Boolean(condition);
  if (!ok) failures++;
  console.log(`${ok ? '  ok  ' : ' FALHA'} ${label}${detail ? ` — ${detail}` : ''}`);
}

function section(title) {
  console.log(`\n── ${title}`);
}

function mkPlayer(id, name, modeId, partnerId = null, tweak = () => {}, alcohol = false) {
  const limits = L.createLimitState(modeId, { alcohol });
  tweak(limits);
  return { id, name, limits, partnerId };
}

/* ------------------------------------------------------ integridade */

section('Integridade dos dados');
const ids = LIMITS.map((l) => l.id);
check('IDs de limite únicos', new Set(ids).size === ids.length);
check('Referências implies/mirrorsInto válidas',
  LIMITS.flatMap((l) => [...(l.implies ?? []), ...(l.mirrorsInto ?? [])]).every((id) => LIMITS_BY_ID[id]));

const cardLimitRefs = ALL_CARDS.flatMap((c) => [
  ...(c.requires ?? []), ...(c.requiresActor ?? []), ...(c.requiresTarget ?? [])
]);
const unknownRefs = cardLimitRefs.filter((id) => !LIMITS_BY_ID[id]);
check('Cartas referenciam apenas limites existentes', unknownRefs.length === 0, unknownRefs.join(', '));

const badTier = ALL_CARDS.filter((c) =>
  cardLimitRefs.includes(c.requires?.[0]) &&
  (c.requires ?? []).some((id) => LIMITS_BY_ID[id] && LIMITS_BY_ID[id].minMode > c.minMode));
check('Nenhuma carta exige limite acima do próprio minMode', badTier.length === 0,
  badTier.map((c) => c.id).join(', '));

console.log(`       baralho: ${JSON.stringify(deckStats())}`);
console.log(`       limites: ${LIMITS.length} itens em ${groupsForMode(3).length} grupos`);

/* --------------------------------------------------- teto dos modos */

section('Teto do modo');
for (const mode of Object.values(GAME_MODES)) {
  const cards = deckForMode(mode.tier);
  const limits = limitsForMode(mode.tier);
  check(`${mode.name}: nada acima do tier ${mode.tier}`,
    cards.every((c) => c.minMode <= mode.tier) && limits.every((l) => l.minMode <= mode.tier),
    `${cards.length} cartas / ${limits.length} limites`);
}

const leve = L.createLimitState('leve');
check('Modo Leve não conhece conteúdo sexual',
  !('kiss_genitals' in leve.entries) && L.effectiveState(leve, 'sexual_oral_give') === 'unavailable');
check('Modo Leve não conhece nudez',
  !('clothing_full_nude' in leve.entries) && !('clothing_to_underwear' in leve.entries));

/* -------------------------------------- fronteira entre Modo 2 e Modo 3 */

section('Fronteira Ousado / Adulto');
const ousado = L.createLimitState('ousado');

// O teto do Modo 2 e a NUDEZ.
check('Modo Ousado vai até a nudez completa',
  ['clothing_to_underwear', 'clothing_underwear', 'clothing_partial_nude', 'clothing_full_nude']
    .every((id) => id in ousado.entries));

// O contato fisico SEXUAL so comeca no Modo 3.
const sexualContact = ['touch_genitals', 'touch_breasts', 'touch_glutes',
  'kiss_genitals', 'kiss_breasts', 'kiss_glutes'];
check('Modo Ousado não conhece contato físico sexual',
  sexualContact.every((id) => !(id in ousado.entries)));
check('Modo Ousado não conhece partes íntimas como alvo',
  ['body_genitals', 'body_breasts', 'body_glutes'].every((id) => !(id in ousado.entries)));
check('Modo Ousado não conhece a aba de conteúdo sexual',
  !LIMITS.some((l) => l.group === 'sexual' && l.minMode <= 2));

const adulto = L.createLimitState('adulto');
check('Modo Adulto abre o contato físico sexual',
  sexualContact.every((id) => id in adulto.entries));

// A nudez precisa realmente sair como carta no Modo 2.
const nus = [
  mkPlayer('a', 'ANA', 'ousado', 'b', (l) => { L.setGroup(l, 'clothing', 'allow'); }),
  mkPlayer('b', 'BRU', 'ousado', 'a', (l) => { L.setGroup(l, 'clothing', 'allow'); })
];
const nudezPlays = F.viablePlays({ tier: 2, intensity: 4, players: nus, currentId: 'a', rng: () => 0.5 }, 1)
  .filter((p) => p.usedLimits.includes('clothing_full_nude') || p.usedLimits.includes('clothing_partial_nude'));
check('nudez aparece como carta jogável no Modo Ousado', nudezPlays.length > 0,
  `${nudezPlays.length} jogada(s)`);

/* ------------------------------------------------ dupla confirmacao */

section('Dupla confirmação');
const dc = L.createLimitState('adulto');
L.setGroup(dc, 'kisses', 'block');
check('sem a origem permitida, o item adulto não é herdado',
  dc.entries.sexual_oral_give.source !== 'inherited');

L.setLimit(dc, 'kiss_genitals', 'allow');
check('permitir a origem pré-marca o item adulto',
  dc.entries.sexual_oral_give.source === 'inherited' && dc.entries.sexual_oral_give.state === 'allow');
check('item herdado vale como "perguntar antes" até ser confirmado',
  L.effectiveState(dc, 'sexual_oral_give') === 'ask');
check('a aba pendente é sinalizada', L.pendingConfirmations(dc).includes('sexual'));

L.confirmGroup(dc, 'sexual');
check('após confirmar a aba, o item libera de fato',
  L.effectiveState(dc, 'sexual_oral_give') === 'allow');

/* ------------------------------------------------------- coerencia */

section('Cascatas de coerência');
const cc = L.createLimitState('adulto');
L.setGroup(cc, 'kisses', 'block');
L.setLimit(cc, 'kiss_prolonged', 'allow');
check('permitir o pesado libera o que ele pressupõe', cc.entries.kiss_mouth.state === 'allow');
L.setLimit(cc, 'kiss_mouth', 'block');
check('bloquear o leve derruba o que dependia dele', cc.entries.kiss_prolonged.state === 'block');

const bp = L.createLimitState('adulto');
L.setLimit(bp, 'kiss_thighs', 'allow');
L.setLimit(bp, 'body_thighs', 'block');
check('parte do corpo bloqueada barra a ação permitida',
  L.requirementState(bp, 'kiss_thighs') === 'block');

/* -------------------------------------------- filtro com dois jogadores */

section('Cruzamento de limites entre jogadores');
const a = mkPlayer('a', 'ANA', 'adulto', 'b', (l) => { L.confirmGroup(l, 'sexual'); L.setLimit(l, 'sexual_oral_give', 'allow'); });
const b = mkPlayer('b', 'BRU', 'adulto', 'a', (l) => { L.confirmGroup(l, 'sexual'); L.setLimit(l, 'sexual_oral_receive', 'block'); });
const ctx = { tier: 3, intensity: 5, players: [a, b], currentId: 'a', rng: () => 0.5 };

const oralBlocked = F.viablePlays(ctx, 1).filter((p) => p.card.id.includes('oral'));
check('um bloqueio do alvo remove a carta para o grupo', oralBlocked.length === 0);

L.setLimit(b.limits, 'sexual_oral_receive', 'allow');
check('liberado pelos dois, a carta volta a existir',
  F.viablePlays(ctx, 1).filter((p) => p.card.id.includes('oral')).length > 0);

const feetA = mkPlayer('a', 'ANA', 'ousado', 'b');
const feetB = mkPlayer('b', 'BRU', 'ousado', 'a', (l) => { L.setLimit(l, 'body_feet', 'block'); });
const feetPlays = F.viablePlays({ tier: 2, intensity: 4, players: [feetA, feetB], currentId: 'a', rng: () => 0.5 }, 1);
check('parte bloqueada nunca é sorteada nos slots',
  !feetPlays.some((p) => JSON.stringify(p.values ?? {}).includes('"feet"')));

/* ------------------------------------------------- regra do parceiro */

section('Regra do parceiro');
const grupo = [
  mkPlayer('a', 'ANA', 'ousado', 'b', (l) => { l.scope = 'partner_only'; }),
  mkPlayer('b', 'BRU', 'ousado', 'a'),
  mkPlayer('c', 'CAU', 'ousado', 'd'),
  mkPlayer('d', 'DAN', 'ousado', 'c')
];
const playsGrupo = F.viablePlays({ tier: 2, intensity: 4, players: grupo, currentId: 'a', rng: () => 0.5 }, 1);

// O que importa e com quem ANA pode entrar em contato — nao as jogadas
// entre os outros, das quais ela simplesmente nao participa.
const comAna = playsGrupo.filter((p) => p.participants.some((x) => x.id === 'a'));
const parceirosDeAna = new Set(
  comAna.flatMap((p) => p.participants.filter((x) => x.id !== 'a').map((x) => x.id))
);
check('"somente com meu parceiro" restringe os alvos de quem marcou',
  [...parceirosDeAna].every((id) => id === 'b'),
  `ANA interage com: ${[...parceirosDeAna].join(',') || 'ninguém'}`);

// A regra tem que valer tambem no sorteio de duplas, que monta pares
// sem passar por quem esta na vez.
const sorteios = playsGrupo.filter((p) => p.card.targeting === 'random_pair');
check('o sorteio de duplas respeita a regra do parceiro',
  sorteios.length > 0 &&
  sorteios.every((p) => {
    const ids = p.participants.map((x) => x.id);
    return !ids.includes('a') || ids.includes('b');
  }),
  `${sorteios.length} sorteios possíveis`);

check('o parceiro recebe o aviso mútuo',
  F.partnerNotices(grupo).some((n) => n.forPlayerId === 'b' && n.fromPlayerId === 'a'));

// Plateia: quem nao quer assistir nao e obrigado a virar espectador.
const plateia = [
  mkPlayer('a', 'ANA', 'ousado', 'b'),
  mkPlayer('b', 'BRU', 'ousado', 'a'),
  mkPlayer('c', 'CAU', 'ousado', null, (l) => { L.setLimit(l, 'dyn_watch', 'block'); })
];
const ctxPlateia = { tier: 2, intensity: 4, players: plateia, currentId: 'a', rng: () => 0.5 };
// CAU so precisa autorizar quando fica de fora — se ele estiver na
// dupla, nao e plateia de ninguem.
const comPlateia = (p) => p.card.watched || p.card.targeting === 'random_pair';
const cauDeFora = (p) => !p.participants.some((x) => x.id === 'c');
check('quem bloqueou "assistir" não vira plateia à força',
  F.viablePlays(ctxPlateia, 1).filter(cauDeFora).every((p) => !comPlateia(p)));
check('...mas continua podendo participar da dupla sorteada',
  F.viablePlays(ctxPlateia, 1).some((p) => comPlateia(p) && !cauDeFora(p)));

L.setLimit(plateia[2].limits, 'dyn_watch', 'allow');
check('liberado, as cartas com plateia voltam',
  F.viablePlays(ctxPlateia, 1).some((p) => comPlateia(p) && cauDeFora(p)));

/* --------------------------------------------------------- bebida */

section('Bebida');
const alcoolCards = ALL_CARDS.filter((c) => c.alcohol);
check('existe um baralho de bebida', alcoolCards.length >= 25, `${alcoolCards.length} cartas`);
check('sem bebida, nenhuma carta alcoólica é carregada',
  deckForMode(3, { alcohol: false }).every((c) => !c.alcohol));
check('com bebida, todas entram',
  deckForMode(3, { alcohol: true }).filter((c) => c.alcohol).length === alcoolCards.length);
check('sem bebida, os limites 🍻 nem existem',
  Object.keys(L.createLimitState('adulto', { alcohol: false }).entries)
    .every((id) => !id.startsWith('drink_')));
check('com bebida, os limites 🍻 aparecem',
  Object.keys(L.createLimitState('adulto', { alcohol: true }).entries)
    .filter((id) => id.startsWith('drink_')).length >= 6);

const semAlcool = [
  mkPlayer('a', 'ANA', 'ousado', 'b'),
  mkPlayer('b', 'BRU', 'ousado', 'a')
];
check('partida sem bebida nunca sorteia carta alcoólica',
  F.viablePlays({ tier: 2, intensity: 4, players: semAlcool, currentId: 'a', alcohol: false, rng: () => 0.5 }, 1)
    .every((p) => !p.card.alcohol));

// Quem nao bebe continua protegido mesmo com a bebida ligada no grupo.
const naoBebe = [
  mkPlayer('a', 'ANA', 'ousado', 'b', (l) => L.setGroup(l, 'drinks', 'block'), true),
  mkPlayer('b', 'BRU', 'ousado', 'a', () => {}, true)
];
const playsNaoBebe = F.viablePlays(
  { tier: 2, intensity: 4, players: naoBebe, currentId: 'a', alcohol: true, rng: () => 0.5 }, 1);

// Participar de uma carta de bebida nao e o mesmo que beber: existem
// cartas em que um bebe e o outro so provoca. O que nao pode acontecer
// e ANA ser a pessoa que bebe.
const bebeTodoMundo = (card) =>
  (card.requires ?? []).some((id) => id.startsWith('drink_')) ||
  Object.values(card.slots ?? {}).some((s) => s.pool === 'drinkAmount' && !s.appliesTo);

check('quem bloqueou bebida nunca é quem bebe',
  playsNaoBebe
    .filter((p) => p.card.alcohol && bebeTodoMundo(p.card))
    .every((p) => !p.participants.some((x) => x.id === 'a')));
check('...mas ainda pode entrar em carta onde quem bebe é o outro',
  playsNaoBebe.some((p) => p.card.alcohol && p.participants.some((x) => x.id === 'a')));

/* --------------------------------------------------------- prendas */

section('Prendas');
const jogoComBebida = G.createGame({ modeId: 'adulto', alcohol: true });
G.addPlayer(jogoComBebida, 'Ana');
G.addPlayer(jogoComBebida, 'Bruno');
const jogoSemBebida = G.createGame({ modeId: 'adulto', alcohol: false });
G.addPlayer(jogoSemBebida, 'Ana');
G.addPlayer(jogoSemBebida, 'Bruno');

check('pular é grátis por padrão', jogoComBebida.penalties.length === 0);
check('prendas de bebida só existem com bebida ligada',
  G.availablePenalties(jogoSemBebida).every((p) => !p.needsAlcohol) &&
  G.availablePenalties(jogoComBebida).some((p) => p.needsAlcohol));

// Um bloqueio individual tira a prenda da mesa inteira.
L.setLimit(jogoComBebida.players[1].limits, 'drink_penalty', 'block');
check('se alguém bloqueia, a prenda de bebida some da lista',
  !G.availablePenalties(jogoComBebida).some((p) => p.id === 'shot'));

const jogoLeve = G.createGame({ modeId: 'leve' });
G.addPlayer(jogoLeve, 'Ana');
G.addPlayer(jogoLeve, 'Bruno');
check('prenda acima do teto do modo não é oferecida',
  G.availablePenalties(jogoLeve).every((p) => p.minMode <= 1));

// Fluxo: pular com prenda combinada entra na fase PENALTY e sempre
// permite recusar tambem a prenda.
G.togglePenalty(jogoLeve, 'shout');
for (const p of jogoLeve.players) p.limits.ready = true;
G.startGame(jogoLeve);
G.roll(jogoLeve, () => 0.5);
G.skip(jogoLeve);
check('pular com prenda combinada abre a tela de prenda',
  jogoLeve.phase === G.PHASES.PENALTY && jogoLeve.pendingPenalty?.id === 'shout');
G.resolvePenalty(jogoLeve, false);
check('recusar a prenda também é permitido e o turno segue',
  jogoLeve.phase === G.PHASES.ROLLING && jogoLeve.pendingPenalty === null);

/* ------------------------------------------- equilíbrio do baralho */

section('Equilíbrio');
const porBaralho = {};
for (const c of ALL_CARDS) porBaralho[c.deck] = (porBaralho[c.deck] ?? 0) + 1;
const menor = Math.min(...Object.values(porBaralho));
const maior = Math.max(...Object.values(porBaralho));
check('nenhum baralho é muito menor que o maior', maior / menor <= 2.2,
  Object.entries(porBaralho).map(([d, n]) => `${d}:${n}`).join(' '));

const paraCasal = ALL_CARDS.filter((c) => (c.minPlayers ?? 2) <= 2).length;
const paraGrupo = ALL_CARDS.filter((c) => !c.maxPlayers || c.maxPlayers >= 3).length;
check('casal e grupo veem quantidades comparáveis',
  Math.max(paraCasal, paraGrupo) / Math.min(paraCasal, paraGrupo) <= 1.4,
  `casal ${paraCasal} / grupo ${paraGrupo}`);
check('existe conteúdo exclusivo dos dois formatos',
  ALL_CARDS.some((c) => c.maxPlayers === 2) && ALL_CARDS.some((c) => (c.minPlayers ?? 2) > 2),
  `${ALL_CARDS.filter((c) => c.maxPlayers === 2).length} só casal / ${ALL_CARDS.filter((c) => (c.minPlayers ?? 2) > 2).length} só grupo`);

for (const tier of [1, 2, 3]) {
  check(`o modo tier ${tier} tem baralho suficiente`,
    deckForMode(tier, { alcohol: false }).length >= 60,
    `${deckForMode(tier, { alcohol: false }).length} cartas`);
}

// Cartas so de grupo nao podem aparecer para um casal.
const casal2 = [mkPlayer('a', 'ANA', 'adulto', 'b'), mkPlayer('b', 'BRU', 'adulto', 'a')];
check('carta de grupo nunca sai numa partida de dois',
  F.viablePlays({ tier: 3, intensity: 5, players: casal2, currentId: 'a', rng: () => 0.5 }, 1)
    .every((p) => (p.card.minPlayers ?? 2) <= 2));

const quatro = ['a', 'b', 'c', 'd'].map((id, i) =>
  mkPlayer(id, id.toUpperCase(), 'adulto', i % 2 === 0 ? String.fromCharCode(98 + i) : String.fromCharCode(96 + i)));
check('carta só de casal nunca sai numa partida de quatro',
  F.viablePlays({ tier: 3, intensity: 5, players: quatro, currentId: 'a', rng: () => 0.5 }, 1)
    .every((p) => !p.card.maxPlayers || p.card.maxPlayers >= 4));

/* ------------------------------------------------------- cobertura */

section('Cobertura de conteúdo');
const casal = [
  mkPlayer('a', 'ANA', 'adulto', 'b', (l) => { L.confirmGroup(l, 'sexual'); L.confirmGroup(l, 'exposure'); }),
  mkPlayer('b', 'BRU', 'adulto', 'a', (l) => { L.confirmGroup(l, 'sexual'); L.confirmGroup(l, 'exposure'); })
];
const cov = F.contentCoverage({ tier: 3, intensity: 3, players: casal, currentId: 'a' });
for (const [lvl, v] of Object.entries(cov.byIntensity)) {
  console.log(`       nível ${lvl}: ${v.total} jogadas (${v.free} diretas / ${v.ask} com confirmação)`);
}
check('há conteúdo em todos os níveis para um casal adulto',
  Object.values(cov.byIntensity).every((v) => v.total > 0));

const parts = casal.map((p, i) => ({ ...p, role: i === 0 ? 'actor' : 'target' }));
const variations = countVariations(ALL_CARDS.find((c) => c.id === 'c_kiss_part'), parts, 5);
check('cartas paramétricas geram muitas variações', variations >= 20, `${variations} combinações só em c_kiss_part`);

/* --------------------------------------- privacidade em rede (TV) */

section('Privacidade no modo TV + celulares');

const { createRoom, attachClient, configureRoom, joinAsPlayer, STAGES } =
  await import('../server/rooms.js');
const { viewFor } = await import('../server/views.js');

const fakeWs = () => ({ readyState: 1, send() {} });

function salaDeTeste(modeId = 'adulto') {
  const room = createRoom();
  const mesa = attachClient(room, fakeWs(), 'table');
  configureRoom(room, { modeId, alcohol: false });

  const celA = attachClient(room, fakeWs(), 'player');
  const celB = attachClient(room, fakeWs(), 'player');
  joinAsPlayer(room, celA, 'Ana');
  joinAsPlayer(room, celB, 'Bruno');

  for (const p of room.game.players) {
    L.setGroup(p.limits, 'questions', 'allow');
    L.setGroup(p.limits, 'kisses', 'allow');
    L.setGroup(p.limits, 'touch', 'allow');
    L.setGroup(p.limits, 'body', 'allow');
    L.confirmGroup(p.limits, 'sexual');
    L.confirmGroup(p.limits, 'exposure');
    p.limits.ready = true;
  }
  G.autoPairCouple(room.game);
  G.startGame(room.game);
  room.stage = STAGES.PLAYING;
  return { room, mesa, celA, celB };
}

/** Rola ate cair uma carta com a caracteristica pedida. */
function rolarAte(room, teste, max = 400) {
  for (let i = 0; i < max; i++) {
    G.roll(room.game);
    if (room.game.play && teste(room.game.play)) return true;
    room.game.play = null;
  }
  return false;
}

// --- carta privada -------------------------------------------------
{
  const { room, mesa, celA, celB } = salaDeTeste();
  const atual = G.currentPlayer(room.game);
  const celDaVez = [celA, celB].find((c) => c.playerId === atual.id);
  const celOutro = [celA, celB].find((c) => c.playerId !== atual.id);

  const achou = rolarAte(room, (p) => p.visibility === 'private' && !p.consent);
  check('existe carta privada para testar', achou);

  if (achou) {
    const texto = room.game.play.text;
    const vMesa = viewFor(room, mesa);
    const vDono = viewFor(room, celDaVez);
    const vOutro = viewFor(room, celOutro);

    check('o dono da vez recebe o texto da carta privada', vDono.card?.text === texto);
    check('a MESA não recebe o texto da carta privada',
      vMesa.card?.kind === 'private-hidden' && !JSON.stringify(vMesa).includes(texto));
    check('o outro celular também não recebe',
      vOutro.card?.kind === 'private-hidden' && !JSON.stringify(vOutro).includes(texto));
    check('a mesa sabe apenas quem está segurando', vMesa.card?.holder === atual.name);
  }
}

// --- confirmacao privada -------------------------------------------
{
  const { room, mesa, celA, celB } = salaDeTeste();
  const achou = rolarAte(room, (p) => Boolean(p.consent));
  check('existe carta com confirmação para testar', achou);

  if (achou) {
    const texto = room.game.play.text;
    const perguntadoId = room.game.play.consent.pendingFrom[0];
    const celPerguntado = [celA, celB].find((c) => c.playerId === perguntadoId);
    const celOutro = [celA, celB].find((c) => c.playerId !== perguntadoId);
    const vMesa = viewFor(room, mesa);

    check('quem precisa responder recebe o texto',
      viewFor(room, celPerguntado).card?.text === texto);
    check('a MESA não recebe o texto da confirmação',
      vMesa.card?.kind === 'consent-waiting' && !JSON.stringify(vMesa).includes(texto));
    check('a MESA não fica sabendo DE QUEM o jogo está esperando',
      !JSON.stringify(vMesa.card).includes(perguntadoId));
    if (celOutro) {
      check('o outro celular também não recebe o texto',
        !JSON.stringify(viewFor(room, celOutro).card ?? {}).includes(texto));
    }
  }
}

// --- limites de cada um --------------------------------------------
{
  const { room, mesa, celA, celB } = salaDeTeste();
  L.setLimit(room.game.players[0].limits, 'kiss_genitals', 'block');

  const vMesa = viewFor(room, mesa);
  const vA = viewFor(room, celA);
  const vB = viewFor(room, celB);

  check('cada celular recebe os próprios limites', Boolean(vA.you?.limits?.entries));

  // O id do outro aparece de forma legítima como `partnerId` do casal.
  // O que não pode vazar é a TABELA DE LIMITES dele: a visão de cada
  // celular carrega exatamente um conjunto de `entries`, o seu.
  const conjuntos = (v) => (JSON.stringify(v).match(/"entries":/g) ?? []).length;
  check('cada visão carrega um único conjunto de limites — o próprio',
    conjuntos(vA) === 1 && conjuntos(vB) === 1 && vB.you?.id === room.game.players[1].id);
  check('o bloqueio de um não aparece na visão do outro',
    L.effectiveState(vA.you.limits, 'kiss_genitals') === 'block' &&
    L.effectiveState(vB.you.limits, 'kiss_genitals') !== 'block');
  check('a mesa não recebe conjunto de limites nenhum',
    conjuntos(vMesa) === 0 && !JSON.stringify(vMesa).includes('kiss_genitals'));
}

/* ----------------------------------------- autorização das ações */

section('Autorização das ações');
{
  const { applyAction } = await import('../server/actions.js');
  const { room, mesa, celA, celB } = salaDeTeste();
  const atual = G.currentPlayer(room.game);
  const celDaVez = [celA, celB].find((c) => c.playerId === atual.id);
  const celOutro = [celA, celB].find((c) => c.playerId !== atual.id);

  check('celular não consegue começar a partida pela mesa',
    applyAction(room, celDaVez, { action: 'start' }).ok === false);
  check('celular não consegue mexer na intensidade',
    applyAction(room, celOutro, { action: 'intensity', payload: { direction: 'up' } }).ok === false);
  check('quem não é da vez não consegue rolar',
    applyAction(room, celOutro, { action: 'roll' }).ok === false);
  check('quem é da vez consegue rolar',
    applyAction(room, celDaVez, { action: 'roll' }).ok === true);
  check('a mesa não consegue jogar no lugar de ninguém',
    applyAction(room, mesa, { action: 'done' }).ok === false);

  // Limites forjados pela rede não furam o teto do modo.
  const forjado = { entries: { __proto__: 'x', naoExiste: { state: 'allow' } }, maxIntensity: 99, scope: 'qualquer' };
  applyAction(room, celDaVez, { action: 'limits', payload: { limits: forjado } });
  const lim = room.game.players.find((p) => p.id === celDaVez.playerId).limits;
  check('limites forjados são reconstruídos e saneados',
    !('naoExiste' in lim.entries) && lim.maxIntensity <= 5 && lim.scope === 'any_player');
}

/* ------------------------------------------------------------ fim */

console.log(`\n${failures === 0 ? '✅ Tudo certo.' : `❌ ${failures} verificação(ões) falharam.`}\n`);
process.exit(failures === 0 ? 0 : 1);
