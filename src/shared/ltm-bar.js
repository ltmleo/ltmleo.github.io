/*
 * <ltm-bar> — barra de navegação compartilhada entre os sites de ltmleo.github.io.
 *
 * Publicada em https://ltmleo.github.io/shared/ltm-bar.v1.js (gerada no build da home,
 * com a lista de src/shared/sites.json embutida no lugar do marcador de DATA).
 *
 * Uso em cada site (o conteúdo do elemento é o fallback sem JavaScript e reserva a altura):
 *   <ltm-bar site="blog" style="display:block;height:36px"><a href="https://ltmleo.github.io/">← @ltmleo</a></ltm-bar>
 *   <script src="https://ltmleo.github.io/shared/ltm-bar.v1.js" defer></script>
 *
 * Contrato v1 (não quebrar; mudanças incompatíveis viram ltm-bar.v2.js):
 *   - atributo `site`: id do site atual em sites.json (opcional; senão detecta pelo caminho)
 *   - sem o elemento na página, o script insere um no início do <body>
 */
(() => {
  if (customElements.get('ltm-bar')) return;

  const DATA = __LTM_SITES__;
  const ORIGIN = (() => {
    try {
      return new URL(document.currentScript.src).origin;
    } catch {
      return 'https://ltmleo.github.io';
    }
  })();
  const HEIGHT = 36;

  const T = {
    pt: { sites: 'Meus sites', menu: 'Outros sites de @ltmleo', here: 'você está aqui', home: 'Ir para a página inicial de @ltmleo' },
    en: { sites: 'My sites', menu: 'Other sites by @ltmleo', here: 'you are here', home: 'Go to the @ltmleo home page' },
  };

  function lang() {
    try {
      const saved = JSON.parse(localStorage.getItem('lang'));
      if (saved === 'pt' || saved === 'en') return saved;
    } catch {}
    const l = (document.documentElement.lang || navigator.language || 'pt').toLowerCase();
    return l.startsWith('pt') ? 'pt' : 'en';
  }

  function currentId(attr) {
    if (attr && DATA.sites.some((s) => s.id === attr)) return attr;
    const path = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
    // o caminho mais longo vence ("/" é prefixo de todos)
    return [...DATA.sites].sort((a, b) => b.path.length - a.path.length).find((s) => path.startsWith(s.path))?.id;
  }

  const CSS = `
    :host { all: initial; display: block; height: ${HEIGHT}px; position: relative; z-index: 1000;
      --bg: #f6f7f9; --ink: #1f2328; --muted: #656d76; --line: #e3e6ea; --hover: #eaedf1; --pop: #fff;
      font: 13px/1 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: var(--ink); }
    :host([theme='dark']) { --bg: #14161b; --ink: #e6e8eb; --muted: #9aa3ad; --line: #2a2e36; --hover: #1f232a; --pop: #1a1d23; }
    * { box-sizing: border-box; }
    .bar { height: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 0 max(16px, env(safe-area-inset-right)) 0 max(16px, env(safe-area-inset-left));
      background: var(--bg); border-bottom: 1px solid var(--line); }
    a, button { color: inherit; font: inherit; text-decoration: none; }
    .home { font-weight: 600; letter-spacing: .01em; padding: 6px 8px; margin-left: -8px; border-radius: 6px; }
    .toggle { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; margin-right: -10px;
      border: 0; border-radius: 6px; background: none; cursor: pointer; color: var(--muted); }
    .home:hover, .toggle:hover, .toggle[aria-expanded='true'] { background: var(--hover); color: var(--ink); }
    a:focus-visible, button:focus-visible { outline: 2px solid #0969da; outline-offset: 1px; }
    .caret { font-size: 10px; transition: transform .15s; }
    .toggle[aria-expanded='true'] .caret { transform: rotate(180deg); }
    .menu { position: absolute; top: calc(100% + 4px); right: 12px; width: min(340px, calc(100vw - 24px));
      margin: 0; padding: 6px; list-style: none; background: var(--pop); border: 1px solid var(--line);
      border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.14); }
    .menu[hidden] { display: none; }
    .menu a { display: grid; grid-template-columns: 24px 1fr; gap: 2px 10px; padding: 9px 10px; border-radius: 6px; }
    .menu a:hover, .menu a:focus-visible { background: var(--hover); }
    .icon { grid-row: span 2; font-size: 18px; line-height: 1.2; }
    .name { font-weight: 600; line-height: 1.3; }
    .desc { color: var(--muted); font-size: 12px; line-height: 1.35; }
    [aria-current='page'] .name::after { content: ' · ' attr(data-here); font-weight: 400; color: var(--muted); }
    @media (prefers-reduced-motion: reduce) { .caret { transition: none; } }
  `;

  class LtmBar extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      this.style.removeProperty('height'); // a altura passa a vir do :host
      const root = this.attachShadow({ mode: 'open' });
      const here = currentId(this.getAttribute('site'));
      const l = lang();
      const t = T[l];
      const href = (s) => ORIGIN + s.path;

      root.innerHTML = `<style>${CSS}</style>
        <nav class="bar" aria-label="@ltmleo">
          <a class="home" href="${ORIGIN}/" data-to="home" aria-label="${t.home}">@ltmleo</a>
          <button class="toggle" type="button" aria-expanded="false" aria-controls="m">${t.sites} <span class="caret" aria-hidden="true">▼</span></button>
          <ul class="menu" id="m" hidden aria-label="${t.menu}">
            ${DATA.sites
              .map(
                (s) => `<li><a href="${href(s)}" data-to="${s.id}"${s.id === here ? ' aria-current="page"' : ''}>
                  <span class="icon" aria-hidden="true">${s.icon}</span><span class="name" data-here="${t.here}">${s.name}</span><span class="desc">${s.desc[l]}</span></a></li>`,
              )
              .join('')}
          </ul>
        </nav>`;

      const toggle = root.querySelector('.toggle');
      const menu = root.querySelector('.menu');
      const setOpen = (open) => {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
      };
      toggle.addEventListener('click', () => setOpen(menu.hidden));
      document.addEventListener('click', (e) => !e.composedPath().includes(this) && setOpen(false));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.hidden) {
          setOpen(false);
          toggle.focus();
        }
      });
      root.addEventListener('click', (e) => {
        const a = e.target.closest('a[data-to]');
        if (a) window.gtag?.('event', 'ltm_nav', { from: here ?? 'unknown', to: a.dataset.to, transport_type: 'beacon' });
      });

      this.#watchTheme();
    }

    // Docusaurus usa <html data-theme>; nos outros sites segue o sistema
    #watchTheme() {
      const html = document.documentElement;
      const mq = matchMedia('(prefers-color-scheme: dark)');
      const apply = () => this.setAttribute('theme', (html.dataset.theme || (mq.matches ? 'dark' : 'light')) === 'dark' ? 'dark' : 'light');
      apply();
      mq.addEventListener?.('change', apply);
      new MutationObserver(apply).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    }
  }

  customElements.define('ltm-bar', LtmBar);

  const mount = () => {
    if (!document.querySelector('ltm-bar')) document.body.prepend(document.createElement('ltm-bar'));
  };
  document.body ? mount() : document.addEventListener('DOMContentLoaded', mount);
})();
