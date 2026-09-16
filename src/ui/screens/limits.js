/**
 * TELA DE LIMITES — modo tela única
 * O aparelho passa de mão em mão; cada jogador configura o seu atrás
 * de uma porta de privacidade. A edição em si é o `limitsEditor`,
 * compartilhado com o modo TV + celulares.
 */

import { h, panel, btn } from '../dom.js';
import { go, setState, store, flash } from '../app.js';
import { getMode } from '../../data/gameModes.js';
import { limitsEditor, pendingConfirmations } from '../components/limitsEditor.js';
import { noticesFor } from '../../engine/gameEngine.js';

function privacyGate(player, index, total) {
  return panel({ class: 'privacy-gate' },
    h('div', { class: 'icon float' }, '🔒'),
    h('span', { class: 'eyebrow' }, `jogador ${index + 1} de ${total}`),
    h('h2', {}, `Passe o aparelho para ${player.name}`),
    h('p', { class: 'dim' },
      'Os limites são individuais e privados. Ninguém mais precisa ver o que você marca aqui.'),
    h('div', { class: 'actions center' },
      btn(`Sou ${player.name} — começar`, { variant: 'primary', onClick: () => setState({ gated: false }) })
    )
  );
}

export default function limitsScreen() {
  const game = store.game;
  const player = game.players[store.limitsIndex];
  if (!player) return panel({}, h('p', {}, 'Nenhum jogador.'));

  if (store.gated) return privacyGate(player, store.limitsIndex, game.players.length);

  const mode = getMode(game.modeId);
  const pending = pendingConfirmations(player.limits);

  const finish = () => {
    if (pending.length) {
      setState({ limitsTab: pending[0] });
      return flash('Ainda há itens pré-marcados aguardando sua confirmação');
    }
    player.limits.ready = true;
    const next = store.limitsIndex + 1;
    if (next < game.players.length) go('limits', { limitsIndex: next, limitsTab: null, gated: true });
    else go('review');
  };

  return h('div', {},
    h('div', { class: 'screen-title' },
      h('span', { class: 'eyebrow' }, `passo 3 de 4 · jogador ${store.limitsIndex + 1}/${game.players.length}`),
      h('h2', {}, `Limites de ${player.name}`),
      h('span', { class: 'pill accent' }, `${mode.icon} ${mode.name}`)
    ),

    limitsEditor({
      limits: player.limits,
      modeId: game.modeId,
      alcohol: game.alcohol,
      hasPartner: Boolean(player.partnerId),
      notices: noticesFor(game, player.id),
      activeTab: store.limitsTab,
      onTab: (id) => setState({ limitsTab: id }),
      onChange: () => setState({}),
      onWarn: (msg) => flash(msg)
    }),

    h('div', { class: 'actions' },
      btn('Voltar', { variant: 'ghost', onClick: () => go('players') }),
      btn(store.limitsIndex + 1 < game.players.length
        ? `Concluir e passar para ${game.players[store.limitsIndex + 1].name}`
        : 'Concluir e revisar',
        { variant: 'primary', onClick: finish })
    )
  );
}
