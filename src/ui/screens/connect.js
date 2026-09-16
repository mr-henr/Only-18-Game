/**
 * ENTRADA DO MODO TV + CELULARES
 * Uma tela decide de que lado deste aparelho a pessoa está:
 * ele é a tela grande, ou é um controle?
 *
 * Este modo precisa de um servidor rodando na mesma rede. Quando ele
 * não existe — numa hospedagem estática, por exemplo — a tela diz isso
 * de forma direta, em vez de deixar o botão girar para sempre.
 */

import { h, panel, btn, notice } from '../dom.js';
import { go, flash } from '../app.js';
import {
  hostTable, joinRoom, session, isLocalOnly,
  serverAvailable, serverChecked, probeServer, serverWaking
} from '../../net/session.js';

function semServidor() {
  return panel({},
    h('span', { class: 'eyebrow' }, 'tv + celulares'),
    h('h2', {}, 'Este modo precisa do servidor do jogo'),
    h('p', { class: 'dim' },
      'Para a TV e os celulares conversarem, alguém precisa rodar o servidor ' +
      'em um computador da casa. Ele é quem guarda a partida e garante que ' +
      'cada celular receba só o que é dele.'),

    h('div', { class: 'steps' },
      h('div', { class: 'step' },
        h('b', {}, '1. No computador'),
        h('code', {}, 'npm run start')),
      h('div', { class: 'step' },
        h('b', {}, '2. Abra o endereço que ele mostrar'),
        h('span', { class: 'faint' }, 'algo como http://192.168.0.10:8787 — na TV ou no PC')),
      h('div', { class: 'step' },
        h('b', {}, '3. Os celulares entram pelo QR code'),
        h('span', { class: 'faint' }, 'todos precisam estar no mesmo wi-fi'))
    ),

    notice(
      'Enquanto isso, o modo de um aparelho só funciona aqui mesmo, sem servidor ' +
      'e sem internet.', '', '📱'),

    h('div', { class: 'actions' },
      btn('Voltar', { variant: 'ghost', onClick: () => go('home') }),
      btn('Jogar em um aparelho só', { variant: 'primary', onClick: () => go('mode') })
    )
  );
}

/**
 * Hospedagem gratuita costuma derrubar o servidor depois de alguns
 * minutos parados. A primeira pessoa da noite paga essa espera — e é
 * melhor dizer o que está acontecendo do que mostrar uma tela morta.
 */
function acordando() {
  return panel({ class: 'privacy-gate' },
    h('div', { class: 'icon float' }, '☕'),
    h('span', { class: 'eyebrow' }, 'tv + celulares'),
    h('h2', {}, 'Acordando o servidor'),
    h('p', { class: 'dim' },
      'Ele dorme quando ninguém está jogando, para não gastar recurso à toa. ' +
      'Isso leva até um minuto na primeira vez da noite — depois fica rápido.'),
    h('div', { class: 'actions center' },
      btn('Jogar em um aparelho só enquanto isso', {
        variant: 'ghost', onClick: () => go('mode')
      }))
  );
}

export default function connectScreen() {
  // Confere uma vez se existe servidor; a tela se redesenha ao saber.
  if (!serverChecked()) probeServer();
  if (serverWaking()) return acordando();
  if (!serverAvailable()) return semServidor();

  const codeFromUrl = new URL(location.href).searchParams.get('sala') ?? '';

  const entrar = () => {
    const code = document.getElementById('room-code')?.value?.trim();
    const name = document.getElementById('room-name')?.value?.trim();
    if (!code) return flash('Digite o código que apareceu na TV');
    if (!name) return flash('Digite seu nome');
    joinRoom(code, name);
    go('remote');
  };

  return h('div', {},
    panel({ class: 'hero' },
      h('span', { class: 'eyebrow' }, 'tv + celulares'),
      h('h2', {}, 'Este aparelho é o quê?'),
      h('p', { class: 'dim lead' },
        'Um aparelho é a tela que todos olham. Os outros são controles — ' +
        'e é no controle que chega o que só aquela pessoa pode ler.')
    ),

    panel({},
      h('h3', {}, '📺 Este é a tela grande'),
      h('p', { class: 'faint' },
        'Use a TV ou o computador que todo mundo vai ficar olhando. ' +
        'Ele mostra o código e o QR code para os celulares entrarem.'),
      isLocalOnly()
        ? notice(
            'Atenção: esta página está aberta em "localhost", que só existe dentro ' +
            'deste computador. Nenhum celular vai conseguir entrar. Abra pelo ' +
            'endereço de rede que aparece quando você inicia o servidor — ' +
            'aquele que começa com 192.168.',
            'warn', '📡')
        : null,
      h('div', { class: 'actions center' },
        btn('Abrir a mesa aqui', {
          variant: 'primary',
          onClick: () => { hostTable(); go('tv'); }
        })
      )
    ),

    panel({},
      h('h3', {}, '📱 Este é um controle'),
      h('p', { class: 'faint' }, 'Digite o código de 4 letras que apareceu na tela grande.'),
      h('div', { class: 'field' },
        h('label', {}, 'Código'),
        h('input', {
          id: 'room-code', class: 'input code-input',
          placeholder: 'ABCD', maxlength: '4', value: codeFromUrl,
          autocapitalize: 'characters', autocomplete: 'off', inputmode: 'text'
        })
      ),
      h('div', { class: 'field' },
        h('label', {}, 'Seu nome'),
        h('input', {
          id: 'room-name', class: 'input', placeholder: 'É assim que você aparece na TV',
          maxlength: '14',
          onKeydown: (e) => { if (e.key === 'Enter') entrar(); }
        })
      ),
      h('div', { class: 'actions center' },
        btn('Entrar', { variant: 'primary', onClick: entrar })
      ),
      session.error ? notice(session.error, 'warn', '⚠️') : null
    ),

    h('div', { class: 'actions center' },
      btn('Voltar', { variant: 'ghost', onClick: () => go('home') })
    )
  );
}
