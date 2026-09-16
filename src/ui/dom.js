/** Helpers minimos de DOM. Sem framework: o peso fica no motor. */

/**
 * Aplica estilos inline.
 *
 * Object.assign(el.style, …) NAO funciona para custom properties: ele
 * ignora `--rx` em silencio, e uma `transform: rotateX(var(--rx))` sem
 * valor vira invalida e some. Era isso que fazia os dados 3D pararem
 * sempre na mesma face.
 */
function applyStyle(el, styles) {
  for (const [prop, value] of Object.entries(styles)) {
    if (value == null) continue;
    if (prop.startsWith('--')) el.style.setProperty(prop, String(value));
    else el.style[prop] = value;
  }
}

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(props ?? {})) {
    if (value == null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'html') el.innerHTML = value;
    else if (key === 'text') el.textContent = value;
    else if (key === 'style' && typeof value === 'object') applyStyle(el, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'dataset') Object.assign(el.dataset, value);
    else el.setAttribute(key, value === true ? '' : value);
  }

  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Mesma ideia do `h`, mas no namespace do SVG.
 * `document.createElement('circle')` cria um elemento HTML desconhecido
 * que o navegador simplesmente não desenha — e em SVG `el.className` é
 * somente leitura, então a classe vai por setAttribute.
 */
export function svg(tag, props = {}, ...children) {
  const el = document.createElementNS(SVG_NS, tag);

  for (const [key, value] of Object.entries(props ?? {})) {
    if (value == null || value === false) continue;
    if (key === 'style' && typeof value === 'object') applyStyle(el, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else el.setAttribute(key, value === true ? '' : value);
  }

  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child);
  }
  return el;
}

export const frag = (...children) => {
  const f = document.createDocumentFragment();
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    f.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return f;
};

export function panel(props, ...children) {
  return h('div', { ...props, class: ['panel', props?.class].filter(Boolean).join(' ') }, ...children);
}

export function btn(label, opts = {}) {
  const { variant = 'secondary', onClick, disabled, size, block } = opts;
  return h('button', {
    class: ['btn', variant, size, block && 'block'].filter(Boolean).join(' '),
    disabled,
    onClick
  }, label);
}

export function pill(text, variant) {
  return h('span', { class: ['pill', variant].filter(Boolean).join(' ') }, text);
}

export function notice(text, variant = '', icon = '💡') {
  return h('div', { class: ['notice', variant].filter(Boolean).join(' ') },
    h('span', { class: 'icon' }, icon),
    h('div', {}, text)
  );
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
