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

## Deploy

Todo push na `main` publica via GitHub Actions (`.github/workflows/deploy.yml`).
Em **Settings → Pages**, a fonte precisa estar como **GitHub Actions**.
