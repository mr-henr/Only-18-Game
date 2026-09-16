/**
 * GERADOR DO CATALOGO DE CARTAS — `npm run docs`
 * ==================================================================
 * Escreve docs/CARTAS.md a partir dos dados reais dos baralhos.
 * Nunca edite o .md a mao: edite os arquivos em src/data/decks/ e
 * rode este script de novo.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { ALL_CARDS } from '../src/data/decks/index.js';
import { LIMITS, LIMITS_BY_ID, LIMIT_GROUPS } from '../src/data/limitsCatalog.js';
import { GAME_MODES, MODE_ORDER } from '../src/data/gameModes.js';
import { POOLS } from '../src/data/pools.js';
import { PENALTIES } from '../src/data/penalties.js';

const DECK_INFO = {
  questions: { icon: '💬', name: 'Perguntas' },
  dares: { icon: '🎯', name: 'Desafios sociais' },
  contact: { icon: '💋', name: 'Beijos e contato físico' },
  clothing: { icon: '👕', name: 'Roupa' },
  adult: { icon: '🔞', name: 'Conteúdo sexual' },
  power: { icon: '⛓️', name: 'Poder e exposição' },
  drinks: { icon: '🍻', name: 'Bebida', alcohol: true }
};

const TIER_INFO = {
  1: { icon: '🌙', title: 'A partir do Modo Leve', note: 'Aparecem em **todos** os modos.' },
  2: { icon: '🔥', title: 'A partir do Modo Ousado', note: 'Aparecem em Ousado, Adulto, Bate-Pronto e Livre. **Nunca** no Leve.' },
  3: { icon: '🔥🔥', title: 'A partir do Modo Adulto', note: 'Aparecem em Adulto, Bate-Pronto e Livre. **Nunca** no Leve nem no Ousado.' }
};

const TARGETING = {
  self: 'só quem joga',
  other: 'sobre outro',
  pair: 'entre os dois',
  all: 'grupo todo',
  random_pair: 'sorteio entre 2'
};

const TYPE = {
  question: 'Pergunta',
  challenge: 'Desafio',
  connection: 'Conexão',
  choice: 'Escolha'
};

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

const label = (id) => LIMITS_BY_ID[id]?.label ?? `⚠️ ${id}`;
const esc = (s) => String(s).replace(/\|/g, '\\|');

/** Valores de um pool que passam pelos filtros estáticos do slot. */
function slotCandidates(slot) {
  const all = POOLS[slot.pool] ?? [];
  const f = slot.filter ?? {};
  const exclude = new Set(slot.exclude ?? []);
  return all.filter((c) => {
    if (exclude.has(c.id)) return false;
    for (const [k, v] of Object.entries(f)) {
      if (k === 'minTier' || k === 'maxTier') continue;
      if (c[k] !== v) return false;
    }
    return true;
  });
}

/** Limites concretos que um slot pode exigir. */
function slotLimits(slot) {
  if (!slot.limitKey) return [];
  const ids = new Set();
  for (const c of slotCandidates(slot)) {
    const id = slot.limitKey === '{limit}' ? c.limit : slot.limitKey.replace('{id}', c.id);
    if (id && LIMITS_BY_ID[id]) ids.add(id);
    if (c.bodyLimit && LIMITS_BY_ID[c.bodyLimit]) ids.add(c.bodyLimit);
  }
  return [...ids];
}

/** Descrição curta de um slot para a coluna de requisitos. */
function describeSlot(name, slot) {
  const n = slotCandidates(slot).length;
  const parts = [`\`{${name}}\` → ${n} valores de \`${slot.pool}\``];
  if (slot.filter?.minTier) parts.push(`a partir do nível ${slot.filter.minTier}`);
  if (slot.exclude?.length) parts.push(`exceto ${slot.exclude.join(', ')}`);
  if (slot.limitKey) {
    parts.push(slot.limitKey === '{limit}'
      ? 'cada valor exige o limite dele'
      : `exige \`${slot.limitKey}\`${slot.appliesTo ? ` (só ${slot.appliesTo})` : ''}`);
  }
  return parts.join(', ');
}

/** Todos os limites que uma carta pode exigir, incluindo os dos slots. */
function allLimitsOf(card) {
  const ids = new Set([
    ...(card.requires ?? []),
    ...(card.requiresActor ?? []),
    ...(card.requiresTarget ?? [])
  ]);
  for (const slot of Object.values(card.slots ?? {})) {
    for (const id of slotLimits(slot)) ids.add(id);
  }
  return [...ids];
}

function requirementsCell(card) {
  const bits = [];
  if (card.requires?.length) bits.push(card.requires.map((id) => `\`${id}\``).join(' + '));
  if (card.requiresActor?.length) bits.push(`**quem faz:** ${card.requiresActor.map((id) => `\`${id}\``).join(' + ')}`);
  if (card.requiresTarget?.length) bits.push(`**quem recebe:** ${card.requiresTarget.map((id) => `\`${id}\``).join(' + ')}`);
  for (const [name, slot] of Object.entries(card.slots ?? {})) bits.push(describeSlot(name, slot));
  if (!bits.length) bits.push('—');
  return bits.join('<br>');
}

/* ------------------------------------------------------------------ */
/* Montagem do documento                                               */
/* ------------------------------------------------------------------ */

const out = [];
const w = (...lines) => out.push(...lines);

w('# Catálogo de cartas', '');
w('> Gerado automaticamente a partir de `src/data/decks/` por `npm run docs`.',
  '> Não edite este arquivo à mão — edite os baralhos e rode o script de novo.', '');

/* ---- Resumo ---- */

w('## Resumo', '');
w('| Modo | Cartas disponíveis | Teto de intensidade |', '|---|---|---|');
for (const id of MODE_ORDER) {
  const m = GAME_MODES[id];
  const n = ALL_CARDS.filter((c) => c.minMode <= m.tier).length;
  w(`| ${m.icon} **${m.name}** | ${n} | ${m.maxIntensity} |`);
}
w('');

w('| Baralho | Total | 🌙 Leve+ | 🔥 Ousado+ | 🔥🔥 Adulto+ |', '|---|---|---|---|---|');
for (const [deck, info] of Object.entries(DECK_INFO)) {
  const cards = ALL_CARDS.filter((c) => c.deck === deck);
  const byTier = (t) => cards.filter((c) => c.minMode === t).length;
  w(`| ${info.icon} ${info.name} \`${deck}\` | **${cards.length}** | ${byTier(1)} | ${byTier(2)} | ${byTier(3)} |`);
}
w(`| | **${ALL_CARDS.length}** | ${ALL_CARDS.filter((c) => c.minMode === 1).length} | ${ALL_CARDS.filter((c) => c.minMode === 2).length} | ${ALL_CARDS.filter((c) => c.minMode === 3).length} |`);
w('');

/* ---- Equilibrio casal x grupo ---- */

const forCouple = (c) => (c.minPlayers ?? 2) <= 2;
const forGroup = (c) => !c.maxPlayers || c.maxPlayers >= 3;

const soCasal = (c) => c.maxPlayers === 2;
const soGrupo = (c) => (c.minPlayers ?? 2) > 2;
const ambos = (c) => forCouple(c) && forGroup(c);

w('### Casal (2) × grupo (3+)', '');
w('**As colunas não são quatro grupos separados.** `Serve aos dois` são as cartas que',
  'funcionam em qualquer formato; `Só casal` (`maxPlayers: 2`) e `Só grupo`',
  '(`minPlayers: 3`) são as exclusivas. As duas últimas colunas são o total que cada',
  'formato enxerga — ou seja, `serve aos dois` + a exclusiva dele.', '');
w(`As exclusivas são poucas de propósito: quando uma carta de grupo também faz sentido a`,
  `dois, ela ganha uma **redação alternativa** para duas pessoas (${ALL_CARDS.filter((c) => c.text2).length} cartas hoje) em vez`,
  'de virar exclusiva. Só vira exclusiva o que não tem como existir no outro formato —',
  'votação, apontar para alguém, corrente em roda e sorteio de dupla não existem a dois;',
  'história em comum e cena longa a dois não funcionam com plateia.', '');
w('| Baralho | 🤝 Serve aos dois | 👤👤 Só casal | 👥 Só grupo | = casal vê | = grupo vê |',
  '|---|---|---|---|---|---|');
for (const [deck, info] of Object.entries(DECK_INFO)) {
  const cards = ALL_CARDS.filter((c) => c.deck === deck);
  if (!cards.length) continue;
  w(`| ${info.icon} ${info.name} | ${cards.filter(ambos).length} | ${cards.filter(soCasal).length} | ${cards.filter(soGrupo).length} | ${cards.filter(forCouple).length} | ${cards.filter(forGroup).length} |`);
}
w(`| **Total** | **${ALL_CARDS.filter(ambos).length}** | **${ALL_CARDS.filter(soCasal).length}** | **${ALL_CARDS.filter(soGrupo).length}** | **${ALL_CARDS.filter(forCouple).length}** | **${ALL_CARDS.filter(forGroup).length}** |`);
w('');

const alcoholCards = ALL_CARDS.filter((c) => c.alcohol);
w(`🍻 **${alcoholCards.length} cartas de bebida.** Só entram se o grupo ligar "jogar com bebida" na`,
  'criação da partida — e, mesmo assim, cada jogador filtra o que aceita na aba 🍻 dos limites.', '');

/* ---- Legenda ---- */

w('## Como ler', '');
w('- **Int.** — faixa de intensidade em que a carta pode sair (`mín–máx`). A partida só sorteia a carta quando o nível atual está dentro dela.');
w('- **Alvo** — quem participa: `só quem joga`, `sobre outro` (quem joga age sobre alguém), `entre os dois` (ação mútua) ou `grupo todo`.');
w('- **Requisitos** — os limites do catálogo que a carta exige. Basta **um** dos envolvidos bloquear qualquer um deles para a carta não existir para aquele grupo.');
w('- `{actor}` e `{target}` são substituídos pelos nomes. `{slot}` é uma **lacuna**: o motor testa valor a valor contra os limites e escolhe um que passe — a carta só morre se nenhum valor sobreviver.');
w('- 🔒 carta privada: só quem joga lê a tela. 👀 carta com plateia: quem assiste precisa ter permitido `dyn_watch`, e quem está no centro, `dyn_be_watched`.');
w('- `sorteio entre 2` monta uma dupla entre quaisquer dois jogadores — a dupla **não precisa incluir quem está na vez**, e o resto do grupo entra como plateia.', '');

/* ---- Cartas por tier ---- */

for (const tier of [1, 2, 3]) {
  const info = TIER_INFO[tier];
  const cards = ALL_CARDS.filter((c) => c.minMode === tier);
  if (!cards.length) continue;

  w(`## ${info.icon} ${info.title}`, '', info.note, '');

  for (const [deck, deckInfo] of Object.entries(DECK_INFO)) {
    const list = cards.filter((c) => c.deck === deck);
    if (!list.length) continue;

    w(`### ${deckInfo.icon} ${deckInfo.name} — \`${deck}\` (${list.length})`, '');
    w('| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |', '|---|---|---|---|---|---|');
    for (const c of list) {
      const priv = c.visibility === 'private' ? '🔒 ' : '';
      const eye = c.watched ? '👀 ' : '';
      const who = c.maxPlayers === 2 ? ' 👤👤' : (c.minPlayers ?? 2) > 2 ? ` 👥${c.minPlayers}+` : '';
      w(`| \`${c.id}\` | ${priv}${eye}${esc(c.text)} | ${TYPE[c.type] ?? c.type} | ${c.intensity[0]}–${c.intensity[1]} | ${TARGETING[c.targeting]}${who} | ${requirementsCell(c)} |`);
    }
    w('');
  }
}

/* ---- Apendice: limites sem carta ---- */

// Um limite esta coberto se alguma CARTA o usa — ou se alguma PRENDA
// o exige, porque prenda tambem e conteudo que chega ao jogador.
const used = new Set([
  ...ALL_CARDS.flatMap(allLimitsOf),
  ...PENALTIES.flatMap((p) => p.requires ?? [])
]);
/**
 * Limites que o MOTOR aplica sozinho, sem a carta declarar:
 * escopo do parceiro, contato com quem não é o parceiro, dinâmica de
 * grupo, sorteio de duplas e plateia. Não são buracos de conteúdo.
 */
const ENGINE_USED = new Set([
  'dyn_scope', 'dyn_more_than_two', 'dyn_group', 'dyn_random_pair',
  'dyn_watch', 'dyn_be_watched', 'kiss_non_partner', 'touch_non_partner'
]);

w('## 📌 Onde faltam cartas', '');
w('Limites que o jogador pode permitir mas que **nenhuma carta usa ainda**.');
w('Cada linha aqui é uma carta que vale a pena escrever.', '');

let gapTotal = 0;
for (const group of LIMIT_GROUPS) {
  const gaps = LIMITS.filter((l) =>
    l.group === group.id && l.kind !== 'scope' &&
    !used.has(l.id) && !ENGINE_USED.has(l.id));
  if (!gaps.length) continue;
  gapTotal += gaps.length;
  w(`**${group.icon} ${group.label}** — ${gaps.length} sem carta`, '');
  for (const l of gaps) w(`- \`${l.id}\` · ${l.label} *(a partir do modo ${l.minMode})*`);
  w('');
}
if (!gapTotal) w('✅ **Nenhum.** Todo limite do catálogo tem pelo menos uma carta que o usa.', '');
w(`_${LIMITS.length - gapTotal} de ${LIMITS.length} limites cobertos._`, '');

w('> Os limites `dyn_*`, `kiss_non_partner` e `touch_non_partner` não entram nesta conta:',
  '> são aplicados pelo próprio motor a qualquer carta, não por cartas específicas.', '');

/* ---- Apendice: como adicionar ---- */

w('## ➕ Como adicionar uma carta', '');
w('Abra o arquivo do baralho em `src/data/decks/` e adicione um objeto ao array.', '');
w('```js', `{
  id: 'c_exemplo',              // único no baralho inteiro
  deck: 'contact',              // ${Object.keys(DECK_INFO).map((d) => `'${d}'`).join(' | ')}
  type: 'challenge',            // 'question' | 'challenge' | 'connection' | 'choice'
  minMode: 2,                   // 1 = Leve+ · 2 = Ousado+ · 3 = Adulto+
  intensity: [2, 4],            // faixa de nível em que pode sair
  targeting: 'other',           // 'self' | 'other' | 'pair' | 'all'
  visibility: 'public',         // 'private' esconde a carta dos outros jogadores

  requires: ['touch_caress'],        // exigido de TODOS os envolvidos
  requiresActor: ['bdsm_dominate'],  // exigido só de quem faz
  requiresTarget: ['bdsm_submit'],   // exigido só de quem recebe

  slots: {                      // lacunas (opcional)
    bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' },
    duration: { pool: 'durations', filter: { minTier: 2 } }
  },

  text: '{actor}, toque {target} {bodyPart.em} por {duration.label}.',
  points: { love: 2, fire: 3 }  // ❤️ conexão e 🔥 coragem
}`, '```', '');

w('### Pools disponíveis para os slots', '');
w('| Pool | Valores | Campos usáveis no texto | Limite por valor |', '|---|---|---|---|');
for (const [name, values] of Object.entries(POOLS)) {
  const sample = values[0] ?? {};
  const fields = Object.keys(sample)
    .filter((k) => !['tier', 'limit', 'bodyLimit', 'intimate', 'kissable', 'touchable', 'seconds', 'n'].includes(k))
    .map((k) => `\`.${k}\``).join(', ');
  const hasLimit = values.some((v) => v.limit) ? '`{limit}` do valor'
    : name === 'bodyParts' ? '`body_<id>` + o que o `limitKey` montar' : '—';
  w(`| \`${name}\` | ${values.length} | ${fields} | ${hasLimit} |`);
}
w('');

w('### Regras que a carta precisa respeitar', '');
w('1. **Nunca exija um limite acima do próprio `minMode`.** Uma carta `minMode: 2` não pode pedir `sexual_*` — o limite nem existe no Modo 2 e a carta nunca sairia.');
w('2. **Separe quem faz de quem recebe.** Sexo oral não é a mesma permissão para os dois lados: use `requiresActor` e `requiresTarget`.');
w('3. **Prefira slot a texto fixo.** Uma carta com `{bodyPart}` vale por dez cartas fixas e respeita os limites sozinha.');
w('4. **`intensity` precisa caber no teto do modo.** O Ousado só chega ao nível 4: uma carta `[5, 5]` com `minMode: 2` nunca apareceria lá.');
w('5. Rode `npm run check` depois — ele valida as regras 1 e 4 e avisa se a carta referencia um limite inexistente.', '');

mkdirSync('docs', { recursive: true });
writeFileSync('docs/CARTAS.md', out.join('\n'), 'utf-8');
console.log(`docs/CARTAS.md gerado — ${ALL_CARDS.length} cartas, ${gapTotal} limites sem cobertura.`);
