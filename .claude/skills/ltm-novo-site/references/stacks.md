# Barra + Analytics por stack

Em todos os exemplos, troque `meusite` pelo `id` do `sites.json`.

## Docusaurus

Um plugin inline no `docusaurus.config.ts`. Ele também substitui o `gtag` do preset.

```ts
const SITE_ID = 'meusite';
const GA_ID = 'G-714QFE3V9G';

// Integração com o ecossistema ltmleo.github.io (skill ltm-novo-site):
// GA com content_group + barra compartilhada <ltm-bar> (fallback sem JS dentro do elemento).
const ltmSite = () => ({
  name: 'ltm-site',
  injectHtmlTags: () => ({
    headTags: [
      {tagName: 'script', attributes: {async: true, src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}},
      {
        tagName: 'script',
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{content_group:'${SITE_ID}'});`,
      },
      {tagName: 'script', attributes: {src: 'https://ltmleo.github.io/shared/ltm-bar.v1.js', defer: true}},
    ],
    // string porque o Docusaurus só aceita tags HTML conhecidas no formato de objeto
    preBodyTags: [
      `<ltm-bar site="${SITE_ID}" style="display:block;height:36px"><a href="https://ltmleo.github.io/">← @ltmleo</a></ltm-bar>`,
    ],
  }),
});
```

- Inclua `ltmSite` em `plugins: [...]`. Se não existir um array `plugins`, crie com `plugins: [ltmSite]`.
- **Remova** o bloco `gtag: {...}` do preset `classic`. Se ele ficar, a página é contada duas vezes, e a primeira contagem vai sem `content_group`, porque o preset injeta o GA antes dos plugins.
- `preBodyTags` coloca a barra antes de `#__docusaurus`, fora do React. A navbar sticky vai para o topo sozinha ao rolar; não é preciso ajustar nada.
- Rodapé: em `themeConfig.footer.links`, adicione `{label: 'Mais de @ltmleo', href: 'https://ltmleo.github.io/#sites'}`.
- Valide com `npm run build`, e também com `npm run typecheck`, se o projeto tiver esse script.

## Vite + React (SPA)

Tudo vai no `index.html`, **fora** do `<div id="root">`. Assim o React não toca no elemento e não há aviso de hidratação.

```html
<head>
  ...
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-714QFE3V9G"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments)}
    gtag('js', new Date());
    gtag('config', 'G-714QFE3V9G', { content_group: 'meusite' });
  </script>
  <script src="https://ltmleo.github.io/shared/ltm-bar.v1.js" defer></script>
</head>
<body>
  <ltm-bar site="meusite" style="display:block;height:36px"><a href="https://ltmleo.github.io/">← @ltmleo</a></ltm-bar>
  <div id="root"></div>
</body>
```

- `vite.config`: `base: '/meusite/'`. React Router: `basename={import.meta.env.BASE_URL}`.
- O GitHub Pages não tem rewrite. Para que as rotas profundas funcionem, copie `index.html` para `404.html` no build (por exemplo, `cp dist/index.html dist/404.html` no workflow).
- **Segurança:** nada de chave de API em variável `VITE_*`. Tudo que começa com `VITE_` vai parar no bundle público. Chamadas a OpenAI, Gemini ou Supabase com service key exigem um backend.

## Next.js (`output: 'export'`)

`next.config`: `output: 'export'`, `basePath: '/meusite'`, `images: { unoptimized: true }`.

No `app/layout.tsx`:

```tsx
import Script from 'next/script';

const GA_ID = 'G-714QFE3V9G';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ltm-bar site="meusite" style={{ display: 'block', height: 36 }} suppressHydrationWarning>
          <a href="https://ltmleo.github.io/">← @ltmleo</a>
        </ltm-bar>
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{content_group:'meusite'});`}
        </Script>
        <Script src="https://ltmleo.github.io/shared/ltm-bar.v1.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
```

- `suppressHydrationWarning` é necessário porque o script da barra adiciona o atributo `theme` ao elemento depois da hidratação.
- O TypeScript não conhece `<ltm-bar>`. Declare uma vez num arquivo `ltm-bar.d.ts` (dentro do `include` do tsconfig):
  ```ts
  import 'react';
  declare module 'react' {
    namespace JSX {
      interface IntrinsicElements {
        'ltm-bar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { site?: string; theme?: 'light' | 'dark' };
      }
    }
  }
  ```
- Não use `@next/third-parties/google`: ele não aceita `content_group`.

## HTML estático

Igual ao bloco de contrato do `SKILL.md`: o GA e o script no `<head>`, e o `<ltm-bar>` como primeiro filho do `<body>`. Se o site for escuro e não mudar com o sistema, use `theme="dark"`.

## Header fixo (`position: fixed` com `top: 0`)

A barra fica no fluxo normal da página, então um header fixo cobre a barra. A solução (usada no site do podcast) é o header começar 36px abaixo e subir junto com a barra conforme a página rola:

```css
header { position: fixed; top: 36px; }  /* abaixo da <ltm-bar> */
```

```js
const header = document.querySelector('header');
const followBar = () => { header.style.top = `${Math.max(0, 36 - window.scrollY)}px`; };
followBar();
addEventListener('scroll', followBar, { passive: true });
```

Header com `position: sticky; top: 0` (como a navbar do Docusaurus) não precisa de ajuste: ele só gruda no topo depois que a barra sai da tela.

Se o site rola até âncoras compensando a altura do header (por exemplo, `offsetTop - 80`), isso continua certo: a compensação vale para quando o header já está no topo.
