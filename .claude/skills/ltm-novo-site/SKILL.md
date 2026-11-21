---
name: ltm-novo-site
description: Conecta um site novo (ou existente) do @ltmleo ao ecossistema ltmleo.github.io — registra na lista única de sites, adiciona a barra compartilhada <ltm-bar>, configura o Google Analytics (G-714QFE3V9G) com content_group e o evento ltm_nav, links cruzados, SEO e verificação. Use SEMPRE que o usuário for criar, publicar ou integrar um site/projeto em ltmleo.github.io/<repo>, pedir para "conectar", "adicionar na home", "colocar a barra", "configurar analytics/GA" num site dele, ou mencionar um novo GitHub Pages do ltmleo — mesmo sem citar a barra ou a skill. NÃO use para praticlimp e leoelais (são de outros contextos e ficam fora).
---

# Conectar um site ao ecossistema ltmleo.github.io

Todos os sites vivem no **mesmo domínio** (`https://ltmleo.github.io/<repo>/`). Por isso compartilham script, `localStorage` e o cookie do Google Analytics (uma visita que passa por vários sites conta como uma sessão só). A integração tem três peças, todas definidas no repositório `ltmleo/ltmleo.github.io` (a home):

| Peça | Onde | Papel |
| --- | --- | --- |
| `src/shared/sites.json` | home | **Lista única de sites.** A barra, a seção `#sites` da home, o painel "Computador" e o JSON-LD saem daqui. |
| `/shared/ltm-bar.v1.js` | gerado no build da home | Web Component `<ltm-bar>` com a lista embutida. Os outros sites só carregam. |
| GA4 `G-714QFE3V9G` | todos | Uma propriedade, um stream. Cada site se identifica por `content_group`. |

**Fora do escopo:** `praticlimp` e `leoelais`. Não adicione nada neles nem na lista.

## Antes de começar: perguntar só o que não dá para deduzir

Leia o repositório do site para descobrir a stack (Docusaurus, Vite/React, Next export ou HTML estático) e o caminho base. Pergunte ao usuário apenas o que falta para a entrada em `sites.json`: **nome de exibição, ícone (emoji) e descrição curta em PT e EN** (até cerca de 50 caracteres cada). Proponha valores a partir do README; não invente silenciosamente.

## Passo 1 — Registrar o site na home (PR em ltmleo/ltmleo.github.io)

1. Adicione a entrada em `src/shared/sites.json`. O `id` é o nome do repositório e o `path` é `/<repo>/`, com barra no fim:
   ```json
   {
     "id": "meusite",
     "path": "/meusite/",
     "name": "Meu Site",
     "icon": "✨",
     "repo": "https://github.com/ltmleo/meusite",
     "desc": { "pt": "O que ele faz, curto", "en": "What it does, short" }
   }
   ```
   A ordem no arquivo é a ordem no menu. `home` fica sempre em primeiro.
2. Se o site gera `sitemap.xml` (Docusaurus e Next com sitemap), adicione a linha em `public/robots.txt`:
   `Sitemap: https://ltmleo.github.io/meusite/sitemap.xml`
3. Rode `npm run build` e confira se `dist/shared/ltm-bar.v1.js` contém o novo `id`.
4. Abra o PR. **Ele precisa entrar antes do PR do site**: sem ele, a barra do site novo não lista o próprio site, e a detecção de "você está aqui" cai no `home`.

Não mude o contrato da barra (atributos `site` e `theme`, altura de 36px, fallback). Uma mudança incompatível vira `ltm-bar.v2.js`, e a `v1` continua publicada.

## Passo 2 — Barra + Analytics no site

O contrato é igual em toda stack. Ele tem quatro partes, nesta ordem dentro do `<head>` e no início do `<body>`:

```html
<!-- head -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-714QFE3V9G"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments)}
  gtag('js', new Date());
  gtag('config', 'G-714QFE3V9G', { content_group: 'meusite' });
</script>
<script src="https://ltmleo.github.io/shared/ltm-bar.v1.js" defer></script>

<!-- primeiro filho do body, FORA da raiz do React/Docusaurus -->
<ltm-bar site="meusite" style="display:block;height:36px"><a href="https://ltmleo.github.io/">← @ltmleo</a></ltm-bar>
```

- O conteúdo do `<ltm-bar>` é o **fallback sem JS**. O `style` reserva a altura e evita salto de layout. Não remova nenhum dos dois.
- `site` é igual ao `id` do `sites.json` e ao `content_group`. Use o mesmo valor nos três lugares.
- `theme="dark"` ou `theme="light"` só se o site tiver tema fixo. Sem o atributo, a barra segue o `data-theme` do Docusaurus ou o tema do sistema.
- Use sempre a URL absoluta do script. Assim a barra funciona também no `localhost`.

**Como aplicar em cada stack** (Docusaurus, Vite/React, Next export, HTML estático): veja `references/stacks.md`. O que mais costuma dar problema:
- **Docusaurus:** remova o `gtag` do preset e injete o GA pelo plugin do site. O preset injeta o GA antes de qualquer plugin, então não há como acrescentar o `content_group` a ele.
- **Header `position: fixed` / `sticky` com `top: 0`:** ele cobre a barra. Veja "Header fixo" em `references/stacks.md`.

## Passo 3 — Analytics: o que configurar além do snippet

Detalhes, eventos e passos no painel do GA estão em `references/analytics.md`. O mínimo:
- **Não crie** propriedade nem stream novo. Mesmo domínio = mesmo stream.
- SPAs (Docusaurus, React Router, Next): o page_view de navegação interna vem da medição otimizada do GA ("Page changes based on browser history events"). Não envie `page_view` manual: isso conta a página em dobro.
- Eventos próprios em `snake_case`, com no máximo 40 caracteres e parâmetros curtos. Sempre use `window.gtag?.(...)` (opcional), para não quebrar com bloqueador de anúncios.
- `anonymize_ip` não tem efeito no GA4 (o GA4 não guarda IP). Não adicione.

## Passo 4 — Links no conteúdo

A barra resolve a navegação; os links que mais convertem são os que aparecem dentro do conteúdo:
- No rodapé do site: "Mais de @ltmleo" → `https://ltmleo.github.io/#sites`.
- Página do projeto no blog (`ltmleo/blog`, em `projects/<repo>`) com um botão "Abrir o site", e, no site, o link "Sobre este projeto" apontando para ela.
- Links para outros sites do @ltmleo abrem **na mesma aba**; links externos abrem em nova aba com `rel="noopener"`.

A home não precisa de mudança além do `sites.json`: o card em `#sites` e o painel "Computador" aparecem sozinhos.

## Passo 5 — Verificar antes de abrir o PR do site

Faça o build do site e rode:

```bash
node .claude/skills/ltm-novo-site/scripts/verify-site.mjs <pasta-do-build> /meusite/ meusite [caminho/para/ltm-bar.v1.js]
```

Para rodar a partir do repositório do site, troque o caminho pelo absoluto do clone da home.

O script serve o build em `/meusite/`, carrega a barra (do build local da home, se você passar o caminho, ou de produção) e confere, em desktop e mobile:
- a barra tem 36px, Shadow DOM e o site atual marcado;
- nenhum header fixo fica por cima dela;
- o `dataLayer` tem `config` com `content_group` igual ao id;
- o clique no menu gera o evento `ltm_nav` com `from` e `to`;
- não há erros de JavaScript.

Ele também salva screenshots para você olhar. Depois do deploy, confirme em **GA → Admin → DebugView** (ou pela extensão Tag Assistant) que o `page_view` chega com `content_group`.

## Checklist final

- [ ] PR na home (`sites.json` + `robots.txt`), com merge **antes** do PR do site
- [ ] PR no site: GA com `content_group`, `<ltm-bar site>`, sem `gtag` duplicado (o do preset foi removido no Docusaurus)
- [ ] Header fixo ajustado, se o site tiver um
- [ ] "Mais de @ltmleo" no rodapé
- [ ] `verify-site.mjs` passou e os screenshots foram conferidos
- [ ] Depois do deploy: DebugView mostra o `content_group` certo
