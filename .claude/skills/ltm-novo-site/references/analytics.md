# Google Analytics no ecossistema ltmleo.github.io

## Modelo

- **Uma propriedade GA4, um stream web:** `G-714QFE3V9G`, para `https://ltmleo.github.io`.
- Todos os sites estão no mesmo host, então compartilham o cookie `_ga`. Ir da home para o blog e depois para as receitas é **uma sessão só**, sem configuração de cross-domain.
- Cada site se identifica por **`content_group`**, uma dimensão nativa do GA4 ("Grupo de conteúdo"). Ele é definido no `gtag('config', ...)` e vale para todos os eventos daquela página, inclusive os page_views de navegação SPA.
- Sites antigos que ainda usam o `gtag` do preset do Docusaurus (sem `content_group`) aparecem como `(not set)`. Nesse caso, filtre pelo início do caminho da página (`Page path` começa com `/blog/`). Migre esses sites para o plugin de `references/stacks.md` quando mexer neles.

## Configuração única no painel do GA (já feita = só conferir)

1. **Medição otimizada** (Admin → Data streams → o stream → Enhanced measurement): deixe **Page views → "Page changes based on browser history events"** ligado. É isso que conta a navegação dentro das SPAs.
2. **Dimensões personalizadas** (Admin → Custom definitions → Create custom dimension), escopo **Event**:
   | Nome | Parâmetro do evento | Uso |
   | --- | --- | --- |
   | Nav origem | `from` | `ltm_nav`: site de onde a pessoa saiu |
   | Nav destino | `to` | `ltm_nav`: site para onde a pessoa foi |
   Crie uma dimensão para cada parâmetro de evento próprio que você quiser ver em relatórios. Sem isso, o parâmetro só aparece no DebugView. O limite é de 50 dimensões de evento por propriedade, então reaproveite nomes de parâmetros entre sites.
3. **Retenção de dados** (Admin → Data settings → Data retention): 14 meses. O padrão é 2 meses, o que limita as Explorações.
4. Opcional: **Tráfego interno** (Admin → Data streams → Configure tag settings → Define internal traffic), para não contar as próprias visitas.

## Eventos

| Evento | Onde | Parâmetros |
| --- | --- | --- |
| `page_view` | automático | `content_group` (vem do `config`) |
| `ltm_nav` | `<ltm-bar>`, automático | `from`, `to` (ids do `sites.json`) |
| eventos do site | código do site | só o necessário |

Regras para eventos próprios:
- Nome em `snake_case`, com no máximo 40 caracteres, no formato verbo + objeto: `play_episode`, `open_recipe`, `search_destination`.
- Antes de inventar um nome, veja se há um [evento recomendado](https://support.google.com/analytics/answer/9267735) que sirva (`search`, `share`, `select_content`…).
- Chame sempre `window.gtag?.('event', 'nome', { ... })`. Com bloqueador de anúncios, o `gtag` não existe, e o encadeamento opcional evita que o site quebre.
- Em cliques que saem da página, passe `transport_type: 'beacon'` para o evento não se perder na navegação.
- **Sem dados pessoais** nos parâmetros (e-mail, nome, texto livre digitado). Isso viola os termos do GA.
- Não envie `page_view` manualmente em SPAs: a medição otimizada já envia, e a página seria contada em dobro.

## Relatórios úteis

- **Tráfego por site:** Reports → Engagement → Pages and screens, com a dimensão primária trocada para **Content group**.
- **Navegação entre sites:** Explore → Free form. Linhas: `Nav origem`; colunas: `Nav destino`; métrica: `Event count`; filtro: `Event name = ltm_nav`.
- **Jornada:** Explore → Path exploration, com nós por `Page path and screen class` (o prefixo do caminho mostra o site).

## Verificação

1. Localmente: `scripts/verify-site.mjs` confere se o `dataLayer` tem o `config` com o `content_group` certo e se o `ltm_nav` dispara. O script não envia nada ao GA, porque bloqueia `googletagmanager.com`.
2. Em produção: abra o site pelo [Tag Assistant](https://tagassistant.google.com/) e acompanhe em GA → Admin → **DebugView**. Confira se o `page_view` chega com `content_group`.
3. Os dados levam 24–48 h para aparecer nos relatórios padrão. O Realtime e o DebugView são imediatos.
