import { h, panel, btn, notice } from '../dom.js';
import { go, setState, store, flash } from '../app.js';
import { getMode } from '../../data/gameModes.js';
import { addPlayer, removePlayer, linkPartners, unlinkPartners, autoPairCouple } from '../../engine/gameEngine.js';

function partnerSelect(game, player) {
  const options = [h('option', { value: '' }, 'Sem parceiro')];
  for (const other of game.players) {
    if (other.id === player.id) continue;
    options.push(h('option', { value: other.id, selected: player.partnerId === other.id }, other.name));
  }

  return h('select', {
    class: 'input',
    style: { maxWidth: '190px' },
    onChange: (e) => {
      if (e.target.value) linkPartners(game, player.id, e.target.value);
      else unlinkPartners(game, player.id);
      setState({});
    }
  }, options);
}

export default function playersScreen() {
  const game = store.game;
  const mode = getMode(game.modeId);
  const full = game.players.length >= mode.maxPlayers;

  const addFromInput = () => {
    const input = document.getElementById('player-name');
    const name = input.value.trim();
    if (!name) return;
    if (!addPlayer(game, name)) return flash('Número máximo de jogadores atingido');
    input.value = '';
    // Partida de casal: o vinculo e automatico assim que existem dois.
    if (game.players.length === 2 && game.players.every((p) => !p.partnerId)) {
      autoPairCouple(game);
    }
    setState({});
    // A tela e recriada a cada render: devolve o foco para digitar o proximo.
    document.getElementById('player-name')?.focus();
  };

  return h('div', {},
    panel({},
      h('span', { class: 'eyebrow' }, 'passo 2 de 4'),
      h('h2', {}, 'Quem está jogando?'),
      h('p', { class: 'dim' },
        `De ${mode.minPlayers} a ${mode.maxPlayers} jogadores neste modo. Cada um configura os próprios limites no passo seguinte.`),

      h('div', { style: { display: 'flex', gap: '8px' } },
        h('input', {
          id: 'player-name', class: 'input', placeholder: 'Nome do jogador', maxlength: '14',
          disabled: full,
          onKeydown: (e) => { if (e.key === 'Enter') addFromInput(); }
        }),
        btn('Adicionar', { variant: 'secondary', onClick: addFromInput, disabled: full })
      ),

      game.players.length
        ? h('div', { class: 'scoreboard', style: { marginTop: '16px' } },
            game.players.map((p) => h('div', { class: 'score-row' },
              h('div', { style: { minWidth: 0 } },
                h('b', {}, p.name),
                h('div', { class: 'faint' }, p.partnerId
                  ? `par de ${game.players.find((x) => x.id === p.partnerId)?.name}`
                  : 'sem par definido')
              ),
              h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                partnerSelect(game, p),
                btn('✕', { variant: 'ghost', size: 'sm', onClick: () => { removePlayer(game, p.id); setState({}); } })
              )
            ))
          )
        : h('p', { class: 'faint', style: { marginTop: '14px' } }, 'Nenhum jogador adicionado ainda.')
    ),

    notice(
      'Quem está junto pode marcar "par". Serve para uma coisa só: quem quiser, ' +
      'pode escolher no passo seguinte que só encosta no próprio par — e o jogo ' +
      'passa a respeitar isso em todas as cartas.',
      '', '❤️'),

    game.players.length === 2
      ? notice('Partida de casal: o vínculo entre vocês dois é aplicado automaticamente.', 'ok', '✅')
      : null,

    h('div', { class: 'actions' },
      btn('Voltar', { variant: 'ghost', onClick: () => go('mode') }),
      btn('Configurar limites', {
        variant: 'primary',
        disabled: game.players.length < mode.minPlayers,
        onClick: () => go('limits', { limitsIndex: 0, limitsTab: null, gated: true })
      })
    )
  );
}
