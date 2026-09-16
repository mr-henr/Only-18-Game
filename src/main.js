import './styles/main.css';
import './styles/themes.css';
import './styles/motion.css';
import './styles/tv.css';
import { render, store } from './ui/app.js';
import { tutorialSeen } from './ui/screens/tutorial.js';
import { probeServer } from './net/session.js';

const params = new URL(location.href).searchParams;

if (params.has('sala')) {
  // Link ou QR code: cai direto na tela de entrada.
  store.screen = 'connect';
} else if (!tutorialSeen()) {
  // Primeira visita: o jogo se explica antes de pedir qualquer coisa.
  store.screen = 'tutorial';
}

render();

// Descobre em segundo plano se existe servidor de partidas por perto.
probeServer();
