#!/usr/bin/env node
// Verifica a integração de um site com o ecossistema ltmleo.github.io (skill ltm-novo-site).
//
// Uso:
//   node verify-site.mjs <pasta-do-build> </base/> <site-id> [ltm-bar.v1.js local]
//   ex.: node verify-site.mjs build /receitas/ receitas ../ltmleo.github.io/dist/shared/ltm-bar.v1.js
//
// Serve o build em http://localhost:<porta></base/>, bloqueia o envio ao GA e às fontes, e confere em
// desktop e mobile: barra (36px, Shadow DOM, site atual), header sem cobrir a barra, dataLayer com
// content_group, evento ltm_nav ao clicar e ausência de erros de JS. Screenshots em ./ltm-verify/.
// Precisa do Playwright com Chromium (require('playwright')).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const [root, base, siteId, localBar] = process.argv.slice(2);
if (!root || !base?.startsWith('/') || !base.endsWith('/') || !siteId) {
  console.error('uso: node verify-site.mjs <pasta-do-build> </base/> <site-id> [ltm-bar.v1.js local]');
  process.exit(2);
}
const { chromium } = createRequire(import.meta.url)('playwright');
const BAR_URL = 'https://ltmleo.github.io/shared/ltm-bar.v1.js';
const OUT = path.resolve('ltm-verify');
fs.mkdirSync(OUT, { recursive: true });

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml',
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const rel = url.startsWith(base) ? url.slice(base.length) : null;
  let file = rel === null ? null : path.join(root, rel);
  if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (file && !fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`; // Next export
  if (!file || !fs.existsSync(file)) {
    res.statusCode = 404;
    return res.end();
  }
  res.setHeader('Content-Type', TYPES[path.extname(file)] ?? 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

const failures = [];
const check = (ok, msg) => {
  console.log(`${ok ? '✔' : '✘'} ${msg}`);
  if (!ok) failures.push(msg);
};

const browser = await chromium.launch();
for (const [label, viewport] of [['desktop', { width: 1280, height: 800 }], ['mobile', { width: 390, height: 760 }]]) {
  console.log(`\n— ${label}`);
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/googletagmanager\.com|google-analytics\.com|fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  if (localBar) await page.route(BAR_URL, (r) => r.fulfill({ path: path.resolve(localBar), contentType: 'text/javascript' }));

  await page.goto(origin + base, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelector('ltm-bar')?.shadowRoot, null, { timeout: 8000 }).catch(() => {});

  const bar = await page.evaluate(() => {
    const el = document.querySelector('ltm-bar');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      count: document.querySelectorAll('ltm-bar').length,
      top: r.top, height: r.height, shadow: !!el.shadowRoot, siteAttr: el.getAttribute('site'),
      current: el.shadowRoot?.querySelector('[aria-current="page"]')?.dataset.to ?? null,
      // elemento visível no centro da barra: se não for a própria barra, algo está por cima
      covered: (() => { const hit = document.elementFromPoint(innerWidth / 2, r.top + r.height / 2); return hit && hit !== el && !el.contains(hit); })(),
    };
  });
  check(!!bar, '<ltm-bar> presente na página');
  if (bar) {
    check(bar.count === 1, `apenas uma <ltm-bar> (${bar.count})`);
    check(bar.shadow, 'script da barra carregou (Shadow DOM)');
    check(bar.top === 0 && bar.height === 36, `barra no topo com 36px (top ${bar.top}, altura ${bar.height})`);
    check(bar.siteAttr === siteId, `atributo site="${siteId}" (atual: ${bar.siteAttr})`);
    check(bar.current === siteId, `menu marca "${siteId}" como atual (atual: ${bar.current}); se null, o id falta no sites.json publicado`);
    check(!bar.covered, 'nenhum header/elemento cobre a barra');
  }

  const configs = await page.evaluate(() => (window.dataLayer ?? []).map((a) => Array.from(a)).filter((a) => a[0] === 'config'));
  check(configs.length === 1, `exatamente um gtag('config') (${configs.length}); 2+ = GA duplicado (ex.: gtag do preset do Docusaurus)`);
  check(configs[0]?.[1] === 'G-714QFE3V9G', `config usa G-714QFE3V9G (${configs[0]?.[1]})`);
  check(configs[0]?.[2]?.content_group === siteId, `content_group = "${siteId}" (${configs[0]?.[2]?.content_group})`);

  if (bar?.shadow) {
    await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault(), true)); // não navegar
    await page.evaluate(() => document.querySelector('ltm-bar').shadowRoot.querySelector('.toggle').click());
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(OUT, `${label}-menu.png`) });
    const target = await page.evaluate((id) => {
      const a = [...document.querySelector('ltm-bar').shadowRoot.querySelectorAll('a[data-to]')].find((x) => x.dataset.to !== id);
      a.click();
      return a.dataset.to;
    }, siteId);
    const nav = await page.evaluate(() => (window.dataLayer ?? []).map((a) => Array.from(a)).find((a) => a[0] === 'event' && a[1] === 'ltm_nav'));
    check(nav?.[2]?.from === siteId && nav?.[2]?.to === target, `ltm_nav from=${siteId} to=${target} (${JSON.stringify(nav?.[2] ?? null)})`);
  }

  await page.evaluate(() => document.querySelector('ltm-bar')?.shadowRoot?.querySelector('.toggle[aria-expanded="true"]')?.click());
  await page.screenshot({ path: path.join(OUT, `${label}-top.png`) });
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, `${label}-scrolled.png`) });
  check(errors.length === 0, `sem erros de JS${errors.length ? `: ${errors.join(' | ')}` : ''}`);
  await page.close();
}
await browser.close();
server.close();

console.log(`\nScreenshots: ${OUT}`);
console.log(failures.length ? `\n${failures.length} falha(s).` : '\nTudo certo.');
process.exit(failures.length ? 1 : 0);
