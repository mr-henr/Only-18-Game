/**
 * O CONTROLE (celular)
 * ==================================================================
 * Cada jogador tem o seu. É aqui que chega tudo que é privado: os
 * limites da pessoa, as cartas privadas dela e as confirmações que só
 * ela pode responder. A TV não recebe nada disso.
 *
 * Os limites são editados num RASCUNHO local e enviados de uma vez ao
 * concluir — são privados, não faz sentido um ida-e-volta por item.
 */

import { h, panel, btn, notice, delay } from '../dom.js';
import { go, setState, store, flash } from '../app.js';
import { createLimitState } from '../../engine/limitsEngine.js';
import { limitsEditor, pendingConfirmations } from '../components/limitsEditor.js';
import { dice3d, ROLL_DURATION } from '../components/dice3d.js';
import { timer, durationOf, resetTimer } from '../components/timer.js';
import { send, session, leave } from '../../net/session.js';
import { play, reducedMotion } from '../fx.js';

/* ------------------------------------------------------------------ */
/* Rascunho local dos limites                                          */
/* ------------------------------------------------------------------ */

let draft = null;
let draftKey = null;

function limitsDraft(view) {
  const key = `${view.code}:${view.you.id}:${view.mode.id}:${view.alcohol}`;
  if (draftKey !== key) {
    // O servidor manda os limites atuais; se ainda não houver, começamos
    // do padrão do modo — a mesma função que o modo tela única usa.
    draft = view.you.limits ?? createLimitState(view.mode.id, { alcohol: view.alcohol });
    draftKey = key;
  }
  return draft;
}

export function clearDraft() {
  draft = null;
  draftKey = null;
}

/* ------------------------------------------------------------------ */
/* Telas                                                               */
/* ------------------------------------------------------------------ */

function waitingRoom(view, title, hint, icon = '⏳') {
  return panel({ class: 'privacy-gate' },
    h('div', { class: 'icon float' }, icon),
    h('span', { class: 'eyebrow' }, `sala ${view.code}`),
    h('h2', {}, title),
    h('p', { class: 'dim' }, hint),
    view.players?.length
      ? h('div', { class: 'players-row' },
          view.players.map((p) => h('span', {
            class: `player-chip ${p.current ? 'active' : ''}`
          }, p.name, p.ready ? ' ✓' : '')))
      : null
  );
}

function limitsView(view) {
  const limits = limitsDraft(view);
  const pending = pendingConfirmations(limits);

  const concluir = () => {
    if (pending.length) {
      setState({ limitsTab: pending[0] });
      return flash('Ainda há itens pré-marcados aguardando sua confirmação');
    }
    send('limits', { limits });
    play('done');
    flash('Limites enviados');
  };

  return h('div', {},
    h('div', { class: 'screen-title' },
      h('span', { class: 'eyebrow' }, `sala ${view.code} · só você vê esta tela`),
      h('h2', {}, `Limites de ${view.you.name}`),
      h('span', { class: 'pill accent' }, `${view.mode.icon} ${view.mode.name}`)
    ),

    limitsEditor({
      limits,
      modeId: view.mode.id,
      alcohol: view.alcohol,
      hasPartner: Boolean(view.you.partnerId),
      notices: view.you.notices,
      activeTab: store.limitsTab,
      onTab: (id) => setState({ limitsTab: id }),
      onChange: () => setState({}),
      onWarn: (msg) => flash(msg)
    }),

    h('div', { class: 'actions' },
      btn('Concluir e avisar a mesa', { variant: 'primary', block: true, onClick: concluir })
    )
  );
}

function rollView(view) {
  return h('div', {},
    panel({},
      h('div', { class: 'turn-head' },
        h('span', { class: 'eyebrow' }, `rodada ${view.round}`),
        h('div', { class: 'who' }, 'Sua vez')
      ),
      store.rolling
        ? h('div', {}, dice3d(view.roll, true),
            h('p', { class: 'faint center' }, 'Os dados estão caindo...'))
        : h('div', {},
            dice3d(null, false),
            h('div', { class: 'actions center' },
              btn('🎲 Rolar os dados', {
                variant: 'primary', block: true,
                onClick: async () => {
                  play('dice');
                  send('roll');
                  setState({ rolling: true });
                  await delay(reducedMotion() ? 0 : ROLL_DURATION);
                  setState({ rolling: false });
                }
              })
            ),
            h('p', { class: 'faint center' }, 'A TV mostra o resultado para todo mundo.'))
    )
  );
}

function cardView(view) {
  const card = view.card;
  const isPrivate = card.kind === 'private';
  const seconds = card.seconds;

  const acoes = h('div', { class: 'actions' },
    btn('🛑 Pular', {
      variant: 'danger',
      onClick: () => { play('skip'); resetTimer(); send('skip'); setState({ revealed: false }); }
    }),
    btn('🎲 Trocar', {
      variant: 'ghost',
      onClick: async () => {
        play('dice'); resetTimer(); send('roll');
        setState({ rolling: true, revealed: false });
        await delay(reducedMotion() ? 0 : ROLL_DURATION);
        setState({ rolling: false });
      }
    }),
    btn('✓ Feito', {
      variant: 'primary',
      onClick: () => { play('done'); resetTimer(); send('done'); setState({ revealed: false }); }
    })
  );

  if (isPrivate && !store.revealed) {
    return panel({},
      h('div', { class: 'card-stage' },
        h('div', { class: 'card-back' },
          h('div', { class: 'mark' }, '🔒'),
          h('div', { class: 'back-label' }, 'Só você deve ler')
        )
      ),
      h('p', { class: 'faint center' }, 'A TV só mostra que você recebeu uma carta privada.'),
      h('div', { class: 'actions center' },
        btn('🔒 Revelar', {
          variant: 'primary', block: true,
          onClick: () => { play('reveal'); setState({ revealed: true }); }
        })
      )
    );
  }

  return panel({},
    h('div', { class: 'card-stage' },
      h('div', { class: 'card' },
        h('div', { class: 'card-type' }, isPrivate ? '🔒 Carta privada' : card.type),
        h('div', { class: 'card-text' }, card.text),
        h('div', { class: 'card-meta' },
          h('span', { class: 'pill' }, `🔥 nível ${card.intensity}`),
          card.participants?.length > 1
            ? h('span', { class: 'pill' }, card.participants.map((p) => p.name).join(' + '))
            : null
        )
      )
    ),
    seconds
      ? h('div', {},
          timer(`${view.turn}:${card.text.slice(0, 20)}`, seconds, () => setState({})),
          h('p', { class: 'faint timer-hint' },
            'O cronômetro é só uma ajuda — ninguém precisa esperar o apito para parar.'))
      : null,
    acoes,
    h('p', { class: 'faint center' }, 'Pular não custa nada e não precisa de explicação.')
  );
}

function consentView(view) {
  const card = view.card;
  return h('div', {},
    panel({},
      h('span', { class: 'eyebrow' }, 'confirmação privada'),
      h('h2', {}, 'É com você'),
      h('div', { class: 'card spaced' },
        h('div', { class: 'card-text' }, card.text)
      ),
      card.limits?.length
        ? h('div', { class: 'pill-row' }, card.limits.map((l) => h('span', { class: 'pill ask' }, l)))
        : null,
      h('p', { class: 'faint spaced' },
        'Esta carta envolve algo que você marcou como "perguntar antes". ' +
        'Recusar não custa pontos e a TV não mostra que foi você — o jogo apenas troca a carta.'),
      h('div', { class: 'actions' },
        btn('Não agora', {
          variant: 'danger',
          onClick: () => { play('skip'); send('consent', { accepted: false }); }
        }),
        btn('Pode vir', {
          variant: 'primary',
          onClick: () => { play('consent'); send('consent', { accepted: true }); }
        })
      )
    )
  );
}

function penaltyView(view) {
  const p = view.pendingPenalty;
  return panel({ class: 'pop' },
    h('div', { class: 'center' },
      h('span', { class: 'eyebrow' }, 'combinado do grupo'),
      h('div', { class: 'penalty-icon' }, p.icon),
      h('h2', {}, p.label),
      h('p', { class: 'dim' }, p.detail)
    ),
    h('p', { class: 'faint center spaced' },
      'Você pulou a carta. Isso não custa pontos — a prenda é só o que vocês combinaram antes.'),
    h('div', { class: 'actions' },
      btn('Passo mesmo assim', {
        variant: 'ghost',
        onClick: () => send('penaltyDone', { paid: false })
      }),
      btn('✓ Paguei a prenda', {
        variant: 'primary',
        onClick: () => { play('done'); send('penaltyDone', { paid: true }); }
      })
    )
  );
}

/* ------------------------------------------------------------- TELA */

export default function remoteScreen() {
  const view = session.view;

  if (session.status !== 'open' || !view) {
    return panel({ class: 'privacy-gate' },
      h('div', { class: 'icon float' }, '📱'),
      h('h2', {}, session.status === 'closed' ? 'Reconectando...' : 'Entrando...'),
      h('p', { class: 'dim' }, session.error ?? 'Procurando a sala.'),
      h('div', { class: 'actions center' },
        btn('Voltar', { variant: 'ghost', onClick: () => { leave(); clearDraft(); go('home'); } }))
    );
  }

  let body;
  switch (view.prompt) {
    case 'wait-setup':
      body = waitingRoom(view, 'Aguardando a mesa', 'A tela grande ainda está escolhendo o modo.', '📺');
      break;
    case 'limits':
      body = limitsView(view);
      break;
    case 'wait-start':
      body = waitingRoom(view, 'Limites enviados',
        'Agora é esperar todo mundo terminar. A mesa começa quando estiver pronto.', '✅');
      break;
    case 'roll':
      body = rollView(view);
      break;
    case 'card':
      body = store.rolling
        ? panel({}, dice3d(view.roll, true), h('p', { class: 'faint center' }, 'Os dados estão caindo...'))
        : cardView(view);
      break;
    case 'consent':
      body = consentView(view);
      break;
    case 'penalty':
      body = penaltyView(view);
      break;
    case 'ended':
      body = waitingRoom(view, 'A noite acabou', 'Olhe a tela grande para o resumo.', '🌙');
      break;
    default: {
      const current = view.players?.find((p) => p.current);
      body = waitingRoom(view,
        current ? `Vez de ${current.name}` : 'Aguarde',
        'Quando for a sua vez, os botões aparecem aqui.', '⏳');
    }
  }

  return h('div', {},
    body,
    view.prompt !== 'limits'
      ? h('div', { class: 'actions center' },
          btn('Sair da sala', {
            variant: 'ghost', size: 'sm',
            onClick: () => { leave(); clearDraft(); go('home'); }
          }))
      : null
  );
}
