/**
 * CABER NA TELA — PC e TV deitados
 * ==================================================================
 * Em tela deitada e grande, rolar a pagina e um defeito: a pessoa esta
 * a tres metros da TV, ou olhando de relance para o monitor. A janela
 * inteira deve ser a moldura do jogo.
 *
 * O grosso e CSS (fit.css). Aqui ficam as duas decisoes que so dao para
 * tomar DEPOIS de desenhar, porque dependem de medir:
 *
 *   1. quantas colunas usar — a menor quantidade que ja faz caber;
 *   2. quanto encolher (ou crescer) — quando nem em colunas coube, ou
 *      quando sobrou tela demais numa TV.
 *
 * Nada disso muda o conteudo: e o mesmo DOM, so medido depois de pronto.
 */

/** Deitada, grande o bastante para valer a pena espalhar em colunas. */
const MEDIA = '(min-width: 900px) and (min-height: 520px) and (min-aspect-ratio: 1/1)';

/**
 * Piso do encolhimento. Abaixo disto o texto fica pequeno demais e o
 * remedio vira pior que a doenca: nas duas telas mais densas (a aba de
 * dinamicas e o saguao da mesa), num monitor baixo, e melhor rolar um
 * pouco do que ler tudo de lupa.
 */
const MIN_SCALE = 0.7;

/** Tela de TV: em vez de sobrar preto embaixo, o conteudo cresce. */
const GROW_FROM = 1600;
const MAX_SCALE = 1.2;

/** Uma coluna nunca fica mais estreita que isto. */
const MIN_COL = 340;

const query = window.matchMedia(MEDIA);
let frame = 0;

/* Altura do conteudo no fim da ultima conta. E o que permite ao
   observador distinguir "o conteudo mudou" de "fui eu que mexi". */
let lastNatural = -1;
let watcher = null;

/* Freio de emergencia: se alguma medida ficar oscilando entre dois
   valores, o observador para em vez de travar a aba. */
let burst = 0;
let burstAt = 0;

export const fitActive = () => query.matches;

/** Refaz a conta no proximo quadro (depois do layout, uma vez so). */
export function scheduleFit() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(applyFit);
}

export function installFit() {
  window.addEventListener('resize', onExternalChange);
  query.addEventListener?.('change', onExternalChange);
  // Voltar para a aba depois de um tempo fora: o quadro pendente so
  // roda agora, e a janela pode ter mudado de tamanho no meio.
  document.addEventListener('visibilitychange', onExternalChange);
  // Fontes e imagens (o QR code da mesa) chegam depois e mudam a altura.
  document.fonts?.ready.then(scheduleFit).catch(() => {});
  document.addEventListener('load', scheduleFit, true);
}

let settle = 0;

/**
 * Mudanca vinda de fora zera o freio: e um recomeco legitimo.
 *
 * Responde na hora E confirma depois: arrastar a borda da janela solta
 * dezenas de eventos, e alguns deles pegam medidas de passagem que nao
 * valem nada. A ultima palavra e a da janela ja parada.
 */
function onExternalChange() {
  burst = 0;
  scheduleFit();
  clearTimeout(settle);
  settle = setTimeout(scheduleFit, 150);
}

/* ------------------------------------------------------------------ */

/**
 * Nem toda mudanca de altura passa por um render: abrir a caixa de
 * duvidas da tela de limites, por exemplo, e so o navegador.
 */
function watch(body) {
  watcher ??= new ResizeObserver(() => {
    const el = document.querySelector('main > .screen')?.firstElementChild;
    if (!el || Math.abs(el.scrollHeight - lastNatural) <= 2) return;

    const now = performance.now();
    if (now - burstAt > 1000) { burst = 0; burstAt = now; }
    if ((burst += 1) > 6) return;          // algo esta oscilando: para por aqui

    scheduleFit();
  });
  watcher.observe(body);
}

function reset(body) {
  body.style.removeProperty('--fit-scale');
  body.style.removeProperty('margin-bottom');
  body.removeAttribute('data-cols');
}

function setScale(body, scale) {
  body.style.setProperty('--fit-scale', scale.toFixed(4));
  // Ler a altura DEPOIS de aplicar: a escala muda a largura util e o
  // texto reflui. A caixa continua com a altura de antes da escala,
  // entao a margem negativa a traz de volta ao tamanho visual — sem
  // isso o centramento vertical usaria a altura errada.
  body.style.marginBottom = scale === 1 ? '' : `${(body.scrollHeight * (scale - 1)).toFixed(1)}px`;
}

/** A tela cabe neste tamanho? Aplica e mede — nao ha como saber antes. */
function fits(body, scale, avail) {
  body.style.setProperty('--fit-scale', scale.toFixed(4));
  return body.scrollHeight * scale <= avail;
}

function applyFit() {
  const stage = document.querySelector('main > .screen');
  const body = stage?.firstElementChild;
  if (!body) return;

  // Enquanto mexemos, o observador fica de fora: o que vem a seguir e
  // obra nossa, nao mudanca de conteudo.
  watcher?.disconnect();

  if (!query.matches) {
    document.documentElement.dataset.fit = 'off';
    lastNatural = -1;
    reset(body);
    return;
  }

  document.documentElement.dataset.fit = 'on';
  reset(body);                                  // toda medida parte do zero

  const avail = stage.clientHeight;
  const width = stage.clientWidth;
  if (!avail) return;

  // 1. Colunas — a menor quantidade que ja resolve. Um painel sozinho
  //    nunca vira duas colunas: quebraria o texto dele ao meio.
  const splittable = body.children.length >= 2 && !body.classList.contains('panel');
  const maxCols = splittable ? Math.max(1, Math.min(3, Math.floor(width / MIN_COL))) : 1;
  let cols = 1;
  body.dataset.cols = '1';
  while (cols < maxCols && body.scrollHeight > avail) {
    cols += 1;
    body.dataset.cols = String(cols);
  }

  // 2. Escala — o maior tamanho que ainda cabe.
  //    Nao da para calcular direto: encolher alarga a area util, o
  //    texto reflui e a altura muda junto. Entao e busca binaria, que
  //    sempre para no maior tamanho possivel — tentar adivinhar de uma
  //    vez so fazia a tela parar num tamanho menor do que cabia.
  const grows = width >= GROW_FROM || document.documentElement.dataset.surface === 'tv';
  const ceiling = grows ? MAX_SCALE : 1;

  let scale = MIN_SCALE;
  if (fits(body, ceiling, avail)) {
    scale = ceiling;
  } else {
    let low = MIN_SCALE;
    let high = ceiling;
    for (let i = 0; i < 7; i += 1) {
      const mid = (low + high) / 2;
      if (fits(body, mid, avail)) { scale = mid; low = mid; }
      else high = mid;
    }
  }
  setScale(body, scale);

  lastNatural = body.scrollHeight;
  // O observador so volta depois que o layout assentou.
  requestAnimationFrame(() => watch(body));
}
