import { ORIGIN } from './content.js';

// Sites próprios abrem na mesma aba (a barra <ltm-bar> traz de volta); externos, em nova aba
export const ext = (href, label, cls = 'btn') =>
  href.startsWith(ORIGIN)
    ? `<a class="${cls}" href="${href}">${label} →</a>`
    : `<a class="${cls}" href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;
