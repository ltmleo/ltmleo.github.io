# ltmleo.github.io

Meu escritório voxel em 3D: clique nos objetos para ver projetos, blog, livros, receitas, viagens e o podcast.

Feito com [Vite](https://vite.dev) + [Three.js](https://threejs.org), sem modelos externos — tudo é desenhado com caixas em código.

## Rodando localmente

```bash
npm install
npm run dev
```

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Textos (PT/EN), projetos, livros, posts, links | `src/content.js` |
| Layout dos painéis | `src/panels.js` |
| Objetos 3D da sala | `src/scene.js` |
| Câmera, cliques e HUD | `src/main.js` |
| Lista de sites (home, barra compartilhada e JSON-LD) | `src/shared/sites.json` |
| Barra `<ltm-bar>` usada nos outros sites | `src/shared/ltm-bar.js` |

## Navegação entre os sites

O build publica `/shared/ltm-bar.v1.js` (com a lista de `src/shared/sites.json` embutida) e `/shared/sites.json`.
Cada site carrega a barra com:

```html
<ltm-bar site="ID" style="display:block;height:36px"><a href="https://ltmleo.github.io/">← @ltmleo</a></ltm-bar>
<script src="https://ltmleo.github.io/shared/ltm-bar.v1.js" defer></script>
```

Atributos opcionais: `site` (id em `sites.json`; senão detecta pelo caminho) e `theme` (`light`/`dark` fixo; senão segue o `data-theme` do Docusaurus ou o sistema).
O conteúdo do elemento é o fallback sem JavaScript e reserva a altura (sem salto de layout).
Para incluir um site, edite só o `sites.json`. Mudanças incompatíveis no componente viram `ltm-bar.v2.js`.

Links diretos para a home: `/#sites` (lista de sites) e `/#about`, `/#computer`, `/#map`… (abrem o painel).

## Deploy

Todo push na `main` publica via GitHub Actions (`.github/workflows/deploy.yml`).
Em **Settings → Pages**, a fonte precisa estar como **GitHub Actions**.
