import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

// Publica a navegação compartilhada entre os sites em /shared/, com nome estável (sem hash):
//   /shared/sites.json      — lista de sites (fonte: src/shared/sites.json)
//   /shared/ltm-bar.v1.js   — componente <ltm-bar> com a lista embutida (uma requisição só)
// O JS sai só em ASCII (\uXXXX): um <script> sem charset herda o da página que o carrega.
const ascii = (code) => code.replace(/[^\x00-\x7f]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);

function sharedNav() {
  const read = (f) => readFileSync(new URL(`./src/shared/${f}`, import.meta.url), 'utf8');
  const files = () => {
    const sites = JSON.stringify(JSON.parse(read('sites.json')));
    return {
      'shared/sites.json': sites,
      'shared/ltm-bar.v1.js': ascii(read('ltm-bar.js').replace('const DATA = __LTM_SITES__;', () => `const DATA = ${sites};`)),
    };
  };
  return {
    name: 'shared-nav',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const body = files()[req.url?.split('?')[0].slice(1)];
        if (!body) return next();
        res.setHeader('Content-Type', `${req.url.includes('.js') ? 'text/javascript' : 'application/json'}; charset=utf-8`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(body);
      });
    },
    // JSON-LD da home (index.html) gerado a partir da mesma lista
    transformIndexHtml(html) {
      const { sites } = JSON.parse(read('sites.json'));
      const subjectOf = sites
        .filter((s) => s.id !== 'home')
        .map((s) => ({ '@type': 'WebSite', name: s.name, url: `https://ltmleo.github.io${s.path}` }));
      return html.replace('__LTM_SUBJECT_OF__', JSON.stringify(subjectOf));
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(files())) this.emitFile({ type: 'asset', fileName, source });
    },
  };
}

export default defineConfig({
  build: { chunkSizeWarningLimit: 800 },
  plugins: [sharedNav()],
});
