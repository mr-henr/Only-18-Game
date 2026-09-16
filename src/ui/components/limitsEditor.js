/**
 * EDITOR DE LIMITES
 * ==================================================================
 * A mesma tela serve dois donos:
 *  - no modo tela única, mexe direto no jogador da vez;
 *  - no modo TV + celulares, mexe num rascunho local do celular, que
 *    só é enviado ao servidor quando a pessoa conclui.
 *
 * Por isso ele não conhece store, nem partida, nem rede: recebe um
 * objeto de limites e avisa quando algo muda.
 */

import { h, panel, btn, notice } from '../dom.js';
import { getMode, LIMIT_STATES, INTENSITY_LEVELS } from '../../data/gameModes.js';
import { LIMITS, LIMITS_BY_ID, groupsForMode } from '../../data/limitsCatalog.js';
import {
  setLimit, setGroup, confirmGroup, pendingConfirmations,
  groupSummary, toggleWishlist
} from '../../engine/limitsEngine.js';

const { ALLOW, ASK, BLOCK } = LIMIT_STATES;

const TRI = [
  { value: ALLOW, icon: '✅', title: 'Permitir — pode aparecer normalmente' },
  { value: ASK, icon: '⚠️', title: 'Perguntar antes — o jogo pede confirmação' },
  { value: BLOCK, icon: '🚫', title: 'Bloquear — nunca aparece' }
];

/* ------------------------------------------------------------------ */

function triControl(limits, item, onChange) {
  const entry = limits.entries[item.id];
  return h('div', { class: 'tri' },
    TRI.map(({ value, icon, title }) => h('button', {
      class: entry.state === value ? 'on' : '',
      dataset: { v: value },
      title,
      onClick: () => { setLimit(limits, item.id, value); onChange(); }
    }, icon))
  );
}

function limitRow(limits, item, mode, onChange) {
  const entry = limits.entries[item.id];
  const inherited = entry.source === 'inherited';
  const sources = (entry.inheritedFrom ?? [])
    .map((id) => LIMITS_BY_ID[id]?.label)
    .filter(Boolean);
  const wished = limits.wishlist.includes(item.id);

  return h('div', { class: `limit-item ${inherited ? 'inherited' : ''}` },
    h('div', { class: 'limit-label' },
      h('b', {}, item.label),
      item.hint ? h('span', { class: 'hint' }, item.hint) : null,
      inherited
        ? h('span', { class: 'badge' }, `pré-marcado por "${sources.join(' / ')}" — confirme`)
        : null,
      entry.source === 'cascade'
        ? h('span', { class: 'hint' }, 'ajustado automaticamente para manter coerência')
        : null,
      mode.wishlist && entry.state === ALLOW
        ? h('button', {
            class: 'badge wish',
            dataset: { on: wished ? '1' : '0' },
            onClick: () => { toggleWishlist(limits, item.id); onChange(); }
          }, wished ? '⭐ quero que apareça' : '☆ marcar como desejo')
        : null
    ),
    triControl(limits, item, onChange)
  );
}

function scopeControl(limits, { hasPartner, onChange, onWarn }) {
  const item = LIMITS_BY_ID.dyn_scope;
  return h('div', { class: 'block' },
    h('h3', {}, item.label),
    item.options.map((opt) => h('button', {
      class: `scope-option ${limits.scope === opt.value ? 'selected' : ''}`,
      onClick: () => {
        if (opt.value === 'partner_only' && !hasPartner) {
          return onWarn?.('Você ainda não tem um par definido nesta partida.');
        }
        limits.scope = opt.value;
        onChange();
      }
    },
      h('b', {}, opt.label),
      opt.hint ? h('span', { class: 'tagline' }, opt.hint) : null
    ))
  );
}

function intensityControl(limits, mode, onChange) {
  const levels = INTENSITY_LEVELS.slice(0, mode.maxIntensity);
  const escolhido = levels.find((l) => l.level === limits.maxIntensity) ?? levels[levels.length - 1];

  return h('div', { class: 'block' },
    h('h3', {}, 'Minha intensidade máxima'),
    h('p', { class: 'faint' },
      'A noite começa no nível 1 e vai subindo conforme vocês cumprem as cartas. ' +
      'Aqui você diz onde ela para, para você. A partida nunca passa do menor teto da mesa.'),

    h('div', { class: 'grid intensity-grid' },
      levels.map((lvl) => h('button', {
        class: `choice compact ${limits.maxIntensity === lvl.level ? 'selected' : ''}`,
        onClick: () => { limits.maxIntensity = lvl.level; onChange(); }
      },
        h('b', { class: 'centered' }, lvl.icon),
        h('span', { class: 'meta' }, lvl.name)
      ))
    ),

    // Sem isto, a pessoa escolhe entre cinco palavras sem saber o que
    // cada uma quer dizer.
    escolhido
      ? h('div', { class: 'level-explain' },
          h('b', {}, `${escolhido.icon} ${escolhido.level} — ${escolhido.name}`),
          h('p', {}, escolhido.hint),
          h('p', { class: 'faint' }, escolhido.exemplo),
          escolhido.level === mode.maxIntensity
            ? h('p', { class: 'faint' },
                `É o nível mais alto do modo ${mode.icon} ${mode.name}. Acima disso o modo não vai, ` +
                'mesmo que todo mundo libere tudo.')
            : null)
      : null
  );
}

/* ------------------------------------------------------------------ */

/**
 * @param {object} o
 * @param {object} o.limits      estado de limites a editar (mutado no lugar)
 * @param {string} o.modeId
 * @param {boolean} o.alcohol
 * @param {boolean} o.hasPartner
 * @param {array}  o.notices     avisos da regra do parceiro
 * @param {string} o.activeTab
 * @param {function} o.onTab
 * @param {function} o.onChange
 * @param {function} o.onWarn
 */
export function limitsEditor(o) {
  const mode = getMode(o.modeId);
  const groups = groupsForMode(mode.tier, { alcohol: o.alcohol });
  const activeTab = o.activeTab ?? groups[0].id;
  const group = groups.find((g) => g.id === activeTab) ?? groups[0];

  const pending = pendingConfirmations(o.limits);
  const items = LIMITS.filter((l) =>
    l.group === group.id &&
    l.minMode <= mode.tier &&
    l.kind !== 'scope' &&
    (!l.needsAlcohol || o.alcohol));

  const pendingHere = items.filter((i) => {
    const e = o.limits.entries[i.id];
    return e?.source === 'inherited' && !e.confirmed;
  });

  return h('div', {},
    h('div', { class: 'states-legend' },
      h('div', { class: 's-allow' }, h('b', {}, '✅ Permitir'), 'Pode acontecer sem o jogo perguntar.'),
      h('div', { class: 's-ask' }, h('b', {}, '⚠️ Perguntar'), 'Só depois de o jogo perguntar a você, em particular.'),
      h('div', { class: 's-block' }, h('b', {}, '🚫 Bloquear'), 'Nunca chega até você. Entre os outros que aceitaram, continua valendo.')
    ),

    h('details', { class: 'helpbox' },
      h('summary', {}, '❓ Dúvidas sobre esta tela'),
      h('div', { class: 'help-body' },
        h('dl', {},
          h('dt', {}, 'Preciso marcar tudo?'),
          h('dd', {}, 'Não. O jogo já deixou cada item num estado razoável para o modo que vocês escolheram. Mexa só no que te incomoda.'),
          h('dt', {}, 'Alguém vai ver o que eu marquei?'),
          h('dd', {}, 'Ninguém. Nem os outros jogadores, nem a tela grande. O jogo só usa isso para escolher as cartas.'),
          h('dt', {}, 'Se eu bloquear, estrago o jogo para os outros?'),
          h('dd', {}, 'Não. O bloqueio é seu: aquelas cartas deixam de te alcançar. Entre as pessoas que aceitaram, elas continuam aparecendo normalmente. A única exceção é a carta que envolve a mesa inteira de uma vez — nessa, todo mundo precisa topar.'),
          h('dt', {}, 'Por que alguns itens já vêm marcados de amarelo?'),
          h('dd', {}, 'Porque você permitiu a mesma coisa em outra aba, com outro nome. O jogo traz aqui para você confirmar com todas as letras — até confirmar, ele pergunta antes de usar.'),
          h('dt', {}, 'E se eu me arrepender no meio do jogo?'),
          h('dd', {}, 'O botão PULAR está em toda carta, sempre. Não custa nada e não precisa de explicação.')
        ))
    ),

    h('div', { class: 'limits-head' },
      h('div', { class: 'tabs' },
        groups.map((g) => {
          const s = groupSummary(o.limits, g.id);
          return h('button', {
            class: `tab ${g.id === activeTab ? 'active' : ''}`,
            onClick: () => o.onTab(g.id)
          },
            `${g.icon} ${g.label}`,
            pending.includes(g.id) ? h('span', { class: 'dot' }) : null,
            g.id !== 'dynamics'
              ? h('span', { class: 'tab-count' }, `${s.allow}/${s.total}`)
              : null
          );
        })
      )
    ),

    (o.notices ?? []).map((n) => notice(
      `${n.message} Ações físicas suas com outras pessoas continuam valendo — mas com ${n.fromName} só acontece entre vocês dois.`,
      '', '❤️')),

    panel({},
      h('h3', {}, `${group.icon} ${group.label}`),
      h('p', { class: 'faint' }, group.blurb),

      pendingHere.length
        ? h('div', { class: 'notice warn' },
            h('span', { class: 'icon' }, '⚠️'),
            h('div', {},
              h('b', {}, `${pendingHere.length} ${pendingHere.length === 1 ? 'item foi pré-marcado' : 'itens foram pré-marcados'} a partir das abas anteriores.`),
              h('div', { class: 'faint spaced' },
                'Você já permitiu a ação equivalente antes. Confirme aqui para liberar de fato — até lá o jogo vai perguntar antes de usar.'),
              btn(`Confirmar ${pendingHere.length} ${pendingHere.length === 1 ? 'item' : 'itens'}`, {
                variant: 'primary', size: 'sm',
                onClick: () => { confirmGroup(o.limits, group.id); o.onChange(); }
              })
            ))
        : null,

      group.id === 'dynamics'
        ? h('div', { class: 'dynamics-blocks' },
            scopeControl(o.limits, { hasPartner: o.hasPartner, onChange: o.onChange, onWarn: o.onWarn }),
            intensityControl(o.limits, mode, o.onChange),
            h('div', { class: 'block' },
              h('h3', {}, 'Com quantas pessoas'),
              h('p', { class: 'faint' },
                'Estas opções dizem com QUANTAS pessoas a ação acontece, não o quanto ' +
                'ela esquenta — por isso a lista não muda quando você troca a intensidade ' +
                'acima. A maior parte destas cartas não tem nada de sexual.')))
        : null,

      items.length
        ? h('div', {},
            h('div', { class: 'group-actions' },
              h('span', { class: 'faint' }, 'aplicar em tudo:'),
              btn('✅', { variant: 'ghost', size: 'sm', onClick: () => { setGroup(o.limits, group.id, ALLOW); o.onChange(); } }),
              btn('⚠️', { variant: 'ghost', size: 'sm', onClick: () => { setGroup(o.limits, group.id, ASK); o.onChange(); } }),
              btn('🚫', { variant: 'ghost', size: 'sm', onClick: () => { setGroup(o.limits, group.id, BLOCK); o.onChange(); } })
            ),
            // A lista vive numa caixa propria porque em tela larga ela
            // vira colunas (ver fit.css) — o resto do painel, nao.
            h('div', { class: 'limit-list' },
              items.map((item) => limitRow(o.limits, item, mode, o.onChange))))
        : null
    ),

    h('p', { class: 'faint center legend' },
      'O que você bloqueia vale para você: nenhuma carta com aquilo chega até você, nem a seu favor nem contra. Entre quem aceitou, o jogo segue normal.')
  );
}

export { pendingConfirmations };
