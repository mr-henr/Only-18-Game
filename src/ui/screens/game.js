import { h, panel, btn, notice, delay } from '../dom.js';
import { go, setState, store, flash } from '../app.js';
import { getMode } from '../../data/gameModes.js';
import { LIMITS_BY_ID } from '../../data/limitsCatalog.js';
import { dice3d, ROLL_DURATION } from '../components/dice3d.js';
import { renderNeutral } from '../../engine/slotResolver.js';
import { play, screenFlash, reducedMotion } from '../fx.js';
import { timer, durationOf, resetTimer } from '../components/timer.js';
import {
  PHASES, currentPlayer, roll, complete, skip, answerConsent,
  raiseIntensity, lowerIntensity, intensityCeiling, endGame, playerById,
  resolvePenalty, progressionPlan
} from '../../engine/gameEngine.js';

const TYPE_LABEL = {
  question: '💬 Pergunta', challenge: '🎯 Desafio',
  connection: '💞 Conexão', choice: '🎭 Escolha'
};

const DECK_MARK = {
  questions: '💬', dares: '🎯', contact: '💋',
  clothing: '👕', adult: '🔞', power: '⛓️', drinks: '🍻'
};

/* --------------------------------------------------------- componentes */

function playersRow(game) {
  return h('div', { class: 'players-row' },
    game.players.map((p, i) => h('span', {
      class: `player-chip ${i === game.currentIndex ? 'active' : ''}`
    }, p.name, h('span', { class: 'chip-xp' }, `⭐${p.score.xp}`)))
  );
}

function intensityBar(game) {
  const ceiling = intensityCeiling(game);
  return h('div', { class: 'intensity-bar' },
    h('div', { class: 'row' },
      h('b', {}, 'Intensidade'),
      h('span', { class: 'dim' }, `${game.intensity} de ${ceiling}`)
    ),
    h('div', { class: 'track' },
      Array.from({ length: 5 }, (_, i) => h('i', {
        class: [
          i < game.intensity ? 'on' : '',
          i === game.intensity - 1 && store.justLit ? 'just-lit' : ''
        ].filter(Boolean).join(' '),
        style: i >= ceiling ? { opacity: .25 } : {}
      }))
    ),
    h('div', { class: 'actions', style: { marginTop: '10px' } },
      btn('− Baixar', {
        variant: 'ghost', size: 'sm',
        onClick: () => { lowerIntensity(game); setState({ justLit: false }); }
      }),
      btn('+ Subir', {
        variant: 'ghost', size: 'sm',
        disabled: game.intensity >= ceiling,
        onClick: () => {
          raiseIntensity(game);
          play('levelUp');
          screenFlash();
          setState({ justLit: true });
          setTimeout(() => setState({ justLit: false }), 700);
        }
      })
    ),
    progressoDoNivel(game)
  );
}

/**
 * A noite sobe sozinha conforme o grupo cumpre — mostrar o quanto falta
 * transforma isso em expectativa, em vez de uma mudança inexplicada.
 */
function progressoDoNivel(game) {
  const plano = progressionPlan(game);

  if (plano.noTeto) {
    return h('p', { class: 'faint', style: { marginTop: '6px' } },
      'Vocês chegaram ao teto do que foi permitido. Daqui não passa.');
  }

  const faltam = Math.max(0, plano.necessarios - plano.momentum);
  return h('div', { style: { marginTop: '8px' } },
    h('div', { class: 'momentum' },
      h('div', { class: 'momentum-fill', style: { width: `${plano.prontidao * 100}%` } })),
    h('p', { class: 'faint', style: { marginTop: '6px' } },
      faltam === 0
        ? 'A noite vai subir de nível na próxima carta cumprida.'
        : `A noite esquenta sozinha: mais ${faltam} ${faltam === 1 ? 'carta cumprida' : 'cartas cumpridas'} e o nível sobe. Pular segura o ritmo.`)
  );
}

/* ------------------------------------------------------- portas de tela */

function turnGate(game) {
  const player = currentPlayer(game);
  return panel({ class: 'privacy-gate' },
    h('div', { class: 'icon float' }, '🎲'),
    h('span', { class: 'eyebrow' }, `rodada ${game.round}`),
    h('h2', {}, `Vez de ${player.name}`),
    h('p', { class: 'dim' }, 'Passe o aparelho antes de continuar.'),
    h('div', { class: 'actions center' },
      btn(`Sou ${player.name}`, { variant: 'primary', onClick: () => setState({ turnGated: false }) })
    )
  );
}

/* ---------------------------------------------------------- consentimento */

function consentScreen(game) {
  const consent = game.play.consent;
  const answered = consent.answers ?? {};
  const nextId = consent.pendingFrom.find((id) => answered[id] == null);

  if (!nextId) return null;
  const player = playerById(game, nextId);

  if (store.consentGated !== false) {
    return panel({ class: 'privacy-gate' },
      h('div', { class: 'icon float' }, '🔒'),
      h('span', { class: 'eyebrow' }, 'confirmação privada'),
      h('h2', {}, `${player.name}, é com você`),
      h('p', { class: 'dim' },
        'Esta carta envolve algo que você marcou como "perguntar antes". Só você decide.'),
      h('div', { class: 'actions center' },
        btn(`Sou ${player.name}`, { variant: 'primary', onClick: () => setState({ consentGated: false }) })
      )
    );
  }

  const items = [...new Set(game.play.usedLimits)]
    .filter((id) => LIMITS_BY_ID[id])
    .map((id) => LIMITS_BY_ID[id].label);

  return h('div', {},
    panel({},
      h('span', { class: 'eyebrow' }, 'confirmação privada'),
      h('h2', {}, `${player.name}, tudo bem com isto?`),
      h('div', { class: 'card', style: { margin: '16px 0' } },
        // Sem nomes: a ideia é julgar o DESAFIO, não quem está do outro
        // lado. Os nomes aparecem depois do "Pode vir".
        h('div', { class: 'card-text' },
          renderNeutral(game.play.card, game.play.values, game.play.participants,
            player.id, game.players))
      ),
      items.length ? h('div', { class: 'pill-row' }, items.map((l) => h('span', { class: 'pill ask' }, l))) : null,
      h('p', { class: 'faint', style: { marginTop: '14px' } },
        'O jogo não mostra quem está envolvido até você aceitar — a ideia é você decidir pelo desafio, não pela pessoa. ' +
        'Recusar não tem penalidade, não custa pontos e ninguém fica sabendo que foi você: o jogo apenas troca a carta.'),
      h('div', { class: 'actions' },
        btn('Não agora', {
          variant: 'danger',
          onClick: () => {
            answerConsent(game, player.id, false);
            play('skip');
            rerollWithAnimation(game, 'Carta trocada');
          }
        }),
        btn('Pode vir', {
          variant: 'primary',
          onClick: () => {
            answerConsent(game, player.id, true);
            play('consent');
            setState({ consentGated: true });
          }
        })
      )
    )
  );
}

/* -------------------------------------------------------------- prenda */

/**
 * O combinado do grupo, lembrado na hora. Continua havendo saída:
 * "passo mesmo assim" nunca some, porque pular é um direito.
 */
function penaltyView(game) {
  const p = game.pendingPenalty;
  const player = currentPlayer(game);

  return h('div', {},
    panel({ class: 'pop' },
      h('div', { class: 'center' },
        h('span', { class: 'eyebrow' }, 'combinado do grupo'),
        h('div', { class: 'penalty-icon' }, p.icon),
        h('h2', {}, p.label),
        h('p', { class: 'dim' }, p.detail)
      ),
      h('p', { class: 'faint center', style: { marginTop: '14px' } },
        `${player.name} pulou a carta. Isso não custa pontos — a prenda é só o que vocês combinaram antes de começar.`),
      h('div', { class: 'actions' },
        btn('Passo mesmo assim', {
          variant: 'ghost',
          onClick: () => { resolvePenalty(game, false); endTurnUI(game); }
        }),
        btn('✓ Paguei a prenda', {
          variant: 'primary',
          onClick: () => { resolvePenalty(game, true); play('done'); endTurnUI(game); }
        })
      )
    )
  );
}

/* --------------------------------------------------------------- carta */

function cardFace(game) {
  const play_ = game.play;
  const isPrivate = play_.visibility === 'private';

  return h('div', { class: 'card' },
    h('div', { class: 'card-type' }, TYPE_LABEL[play_.card.type] ?? play_.card.type),
    h('div', { class: 'card-text' }, play_.text),
    h('div', { class: 'card-meta' },
      h('span', { class: 'pill' }, `🔥 nível ${game.effectiveIntensity}`),
      play_.participants.length > 1
        ? h('span', { class: 'pill' }, play_.participants.map((p) => p.name).join(' + '))
        : null,
      isPrivate ? h('span', { class: 'pill accent' }, '🔒 privada') : null
    )
  );
}

/**
 * Carta privada: o verso fica na mesa e VIRA de verdade quando quem
 * é da vez toca. A virada roda no elemento vivo — por isso mexemos na
 * classe direto, em vez de re-renderizar antes da animação acabar.
 */
function privateCard(game) {
  const player = currentPlayer(game);
  const mark = DECK_MARK[game.play.card.deck] ?? '🔒';

  const reveal = (e) => {
    const flip = e.target.closest('.card-stage')?.querySelector('.flip');
    play('reveal');
    if (!flip || reducedMotion()) return setState({ revealed: true });
    flip.classList.add('revealed');
    setTimeout(() => setState({ revealed: true }), 620);
  };

  return h('div', { class: 'card-stage' },
    h('div', { class: 'flip' },
      h('div', { class: 'flip-inner' },
        h('div', { class: 'flip-face' },
          h('div', { class: 'card-back' },
            h('div', { class: 'mark' }, mark),
            h('div', { class: 'back-label' }, `Só ${player.name} deve ler`)
          )
        ),
        h('div', { class: 'flip-face flip-back' }, cardFace(game))
      )
    ),
    h('div', { class: 'actions center' },
      btn('🔒 Revelar', { variant: 'primary', onClick: reveal })
    )
  );
}

function cardActions(game) {
  return h('div', {},
    h('div', { class: 'actions' },
      btn('🛑 Pular', {
        variant: 'danger',
        onClick: () => {
          play('skip');
          skip(game);
          if (game.phase === PHASES.PENALTY) { play('penalty'); setState({ revealed: false }); }
          else endTurnUI(game);
        }
      }),
      btn('🎲 Trocar carta', {
        variant: 'ghost',
        onClick: () => rerollWithAnimation(game)
      }),
      btn('✓ Feito', {
        variant: 'primary',
        onClick: () => { play('done'); complete(game); endTurnUI(game); }
      })
    ),
    h('p', { class: 'faint center', style: { marginTop: '10px' } },
      'Pular não custa nada e não precisa de explicação.')
  );
}

function cardView(game) {
  const isPrivate = game.play.visibility === 'private';

  const seconds = durationOf(game.play);
  const shown = !isPrivate || store.revealed;

  return h('div', {},
    dice3d(game.roll, false),
    shown ? h('div', { class: 'card-stage' }, cardFace(game)) : privateCard(game),
    shown && seconds
      ? h('div', {},
          timer(`${game.turn}:${game.play.card.id}`, seconds, () => setState({})),
          h('p', { class: 'faint timer-hint' },
            'O cronômetro é só uma ajuda — ninguém precisa esperar o apito para parar.'))
      : null,
    shown ? cardActions(game) : null
  );
}

/* ------------------------------------------------------------ rolagem */

function endTurnUI(game) {
  resetTimer();
  setState({
    turnGated: game.screenMode === 'single',
    revealed: false,
    consentGated: true,
    rolling: false
  });
}

/**
 * O motor sorteia PRIMEIRO; a animação só apresenta o resultado.
 * Assim o dado para na face certa em vez de trocar o número no fim.
 */
async function rerollWithAnimation(game, message = null) {
  resetTimer();
  roll(game);
  play('dice');
  setState({ rolling: true, revealed: false, consentGated: true });
  if (message) flash(message);
  await delay(reducedMotion() ? 0 : ROLL_DURATION);
  setState({ rolling: false });
  play('flip');
}

function rollingView(game) {
  return h('div', {},
    dice3d(game.roll, true),
    h('p', { class: 'faint center' }, 'Os dados estão caindo...')
  );
}

function rollView(game) {
  return h('div', {},
    dice3d(null, false),
    h('div', { class: 'actions center' },
      btn('🎲 Rolar os dados', {
        variant: 'primary',
        onClick: () => rerollWithAnimation(game)
      })
    ),
    h('p', { class: 'faint center', style: { marginTop: '12px' } },
      'Os dados sugerem alvo, tipo e calor. Se o resultado não couber nos limites do grupo, o jogo ajusta sozinho em vez de forçar.')
  );
}

/* --------------------------------------------------------------- tela */

export default function gameScreen() {
  const game = store.game;
  const mode = getMode(game.modeId);
  const player = currentPlayer(game);

  if (game.phase === PHASES.PENALTY && game.pendingPenalty) return penaltyView(game);
  if (store.turnGated && game.screenMode === 'single' && !game.play && !store.rolling) {
    return turnGate(game);
  }

  let body;
  if (store.rolling) {
    body = rollingView(game);
  } else if (game.phase === PHASES.CONSENT && game.play?.consent) {
    body = consentScreen(game);
  } else if (game.play) {
    body = cardView(game);
  } else if (game.roll && !game.play) {
    body = h('div', {},
      dice3d(game.roll, false),
      notice('Nenhuma carta passou pelos filtros deste grupo neste nível. Baixe a intensidade ou revise algum limite.', 'warn', '🔎'),
      h('div', { class: 'actions center' },
        btn('Rolar de novo', { variant: 'secondary', onClick: () => rerollWithAnimation(game) }),
        btn('Baixar intensidade', {
          variant: 'ghost',
          onClick: () => { lowerIntensity(game); rerollWithAnimation(game); }
        })
      ));
  } else {
    body = rollView(game);
  }

  return h('div', {},
    panel({},
      h('div', { class: 'turn-head' },
        h('span', { class: 'eyebrow' }, mode.fastFlow ? 'bate-pronto' : `turno ${game.turn + 1}`),
        h('div', { class: 'who' }, player.name)
      ),
      playersRow(game),
      body
    ),

    // O termometro e o encerrar andam juntos: no celular, um embaixo do
    // outro; em tela deitada, a coluna ao lado da carta (ver fit.css).
    h('div', { class: 'game-side' },
      !mode.fastFlow ? panel({ class: 'tight' }, intensityBar(game)) : null,
      h('div', { class: 'actions center' },
        btn('Encerrar a noite', {
          variant: 'ghost', size: 'sm',
          onClick: () => { play('finish'); endGame(game); go('end'); }
        })
      )
    )
  );
}
