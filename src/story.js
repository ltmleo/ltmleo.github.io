import { LINKS, REPOS, BOOKS, POSTS } from './content.js';

// A história contada abaixo do escritório: um capítulo por objeto.

const img = (file) => `${import.meta.env.BASE_URL}img/${file}`;
const ext = (href, label, cls = 'btn') => `<a class="${cls}" href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;

const TEXT = {
  pt: {
    cue: 'Clique nos objetos · role para a história',
    back: '↑ Voltar ao escritório',
    readStory: 'Ler a história ↓',
    prologue: {
      kicker: 'Prólogo',
      title: 'Oi, eu sou o Leo 👋',
      p: [
        'Engenheiro de Telecomunicações pela <b>UNESP</b>, especialista em Data Science & Analytics pela <b>USP</b> e, no dia a dia, líder técnico de <b>Platform Engineering</b> e <b>Developer Experience</b> na Vivo.',
        'Este escritório é o meu cantinho. Cada objeto guarda um pedaço do que eu construo, leio, cozinho, viajo e escuto. Role para baixo que eu conto a história de cada um.',
      ],
    },
    about: {
      kicker: 'Capítulo 1 · O quadro branco',
      title: 'Plataforma como produto',
      p: [
        'Hoje lidero a evolução do DevOps corporativo da Vivo: ferramentas que fazem parte do dia de mais de 2.500 desenvolvedores.',
        'A ideia é simples de dizer e difícil de fazer: tratar a plataforma interna como um <b>produto</b>, com o desenvolvedor como cliente. Self-service, pipelines corporativos, processos maduros e evolução contínua, para entregar software de qualidade com o mínimo de atrito.',
        'Acredito em liderança por influência e em compartilhar conhecimento. Pelo caminho: microsserviços, Cloud, GitOps, SecDevOps, MLOps e AIOps.',
      ],
      stats: [
        ['2.500+', 'desenvolvedores impactados'],
        ['↓', 'lead time'],
        ['↓', 'volume de incidentes'],
      ],
    },
    computer: {
      kicker: 'Capítulo 2 · O computador',
      title: 'Código aberto',
      p: [
        'Sou entusiasta de tecnologias open source. Alguns dos meus repositórios ganharam estrelas pelo caminho.',
        'O mais estrelado é o <b>k8s-clean-yaml</b>: ele remove os campos inúteis de manifests Kubernetes exportados do cluster.',
      ],
      all: 'Ver todos no GitHub',
    },
    map: {
      kicker: 'Capítulo 3 · O mapa',
      title: 'Carai Que Bonito!',
      p: [
        'Toda viagem rende uma história, uma curiosidade e algumas dicas. O <b>Carai Que Bonito!</b> é onde elas viram um catálogo de destinos, organizado por região (Europa e Américas), com um blog de viagens.',
        'O nome diz tudo. 🌍',
      ],
      captions: ['Berlim', 'Praga'],
      cta: 'Explorar destinos',
    },
    shelf: {
      kicker: 'Capítulo 4 · A estante',
      title: 'Sistemas, antifragilidade e boas histórias',
      p: [
        'Sou estudante de sistemas complexos e do conceito de antifragilidade, e boa parte disso vem dos livros. Cada leitura vira uma nota no blog.',
      ],
      post: 'Ler “Além da resiliência”',
      cta: 'Todas as notas de leitura',
    },
    recipes: {
      kicker: 'Capítulo 5 · Os fichários',
      title: 'Receitas de família',
      p: [
        'Cadernos de receitas de família guardam muito mais do que ingredientes.',
        'Escaneei os cadernos da <b>Vó Elisa</b> (doces e salgados) e usei Inteligência Artificial para extrair o texto das páginas, transformando tudo em um site fácil de consultar.',
        'Ainda vêm aí os cadernos da Vó Cida e das bisavós Cidona e Romilda.',
      ],
      caption: 'O caderno de doces',
      cta: 'Abrir as receitas',
    },
    podcast: {
      kicker: 'Capítulo 6 · O walkman',
      title: 'Omelette Au Fromage',
      p: [
        'Lembra do episódio do <i>Laboratório de Dexter</i> em que ele constrói uma máquina para aprender francês dormindo? O disco trava e ele só consegue repetir “Omelette du Fromage”. O certo seria “Omelette <b>au</b> Fromage”, que dá nome ao podcast.',
        'A proposta: aprender frases em outros idiomas por repetição enquanto você faz outras coisas 🧼🍽️. São episódios curtos, para falantes de português, com áudios gerados por IA, em idiomas como holandês e italiano.',
      ],
      cta: 'Ouvir o podcast',
      post: 'Como ele foi feito',
    },
    blog: {
      kicker: 'Capítulo 7 · O mural',
      title: 'O blog',
      p: [
        'Registros pessoais para consultas futuras, conhecimento compartilhado ao longo da jornada e um pouco de tudo.',
        'Também tem notas de estudo: IA, Data Science, Golang, Oracle Cloud e livros.',
      ],
      cta: 'Abrir o blog',
    },
    photo: {
      kicker: 'Epílogo · O porta-retrato',
      title: 'Fora do escritório',
      p: [
        'Meu espírito <i>faça-você-mesmo</i> vira curiosidade: de filosofia a tecnologia, de viagens a fotografia.',
        'Sou um eterno aprendiz, sempre atrás de desafios que me tirem da zona de conforto. Se quiser trocar uma ideia, me chama.',
      ],
      tags: ['Filosofia', 'Tecnologia', 'Viagens', 'Fotografia', 'DIY'],
    },
  },
  en: {
    cue: 'Click objects · scroll for the story',
    back: '↑ Back to the office',
    readStory: 'Read the story ↓',
    prologue: {
      kicker: 'Prologue',
      title: 'Hi, I’m Leo 👋',
      p: [
        'Telecommunications Engineer from <b>UNESP</b>, specialized in Data Science & Analytics at <b>USP</b>, and day to day a technical leader in <b>Platform Engineering</b> and <b>Developer Experience</b> at Vivo.',
        'This office is my little corner. Each object holds a piece of what I build, read, cook, travel and listen to. Scroll down and I’ll tell you the story behind each one.',
      ],
    },
    about: {
      kicker: 'Chapter 1 · The whiteboard',
      title: 'Platform as a product',
      p: [
        'I lead the evolution of Enterprise DevOps at Vivo: tools that are part of the daily work of more than 2,500 developers.',
        'The idea is easy to say and hard to do: treat the internal platform as a <b>product</b>, with developers as its customers. Self-service, enterprise pipelines, mature processes and continuous evolution, so teams ship quality software with minimal friction.',
        'I believe in leadership through influence and knowledge sharing. Along the way: microservices, Cloud, GitOps, SecDevOps, MLOps and AIOps.',
      ],
      stats: [
        ['2,500+', 'developers impacted'],
        ['↓', 'lead time'],
        ['↓', 'incident volume'],
      ],
    },
    computer: {
      kicker: 'Chapter 2 · The computer',
      title: 'Open source',
      p: [
        'I’m an open-source enthusiast. Some of my repositories picked up stars along the way.',
        'The most starred is <b>k8s-clean-yaml</b>: it strips useless fields from Kubernetes manifests exported from a cluster.',
      ],
      all: 'See everything on GitHub',
    },
    map: {
      kicker: 'Chapter 3 · The map',
      title: 'Carai Que Bonito!',
      p: [
        'Every trip leaves a story, some trivia and a few tips. <b>Carai Que Bonito!</b> (Brazilian slang for “holy, how beautiful!”) turns them into a destination catalog by region (Europe and the Americas) plus a travel blog, in Portuguese.',
        'The name says it all. 🌍',
      ],
      captions: ['Berlin', 'Prague'],
      cta: 'Explore destinations',
    },
    shelf: {
      kicker: 'Chapter 4 · The bookshelf',
      title: 'Systems, antifragility and good stories',
      p: [
        'I study complex systems and the idea of antifragility, and a lot of it comes from books. Every read becomes a note on the blog (in Portuguese).',
      ],
      post: 'Read “Beyond resilience”',
      cta: 'All reading notes',
    },
    recipes: {
      kicker: 'Chapter 5 · The binders',
      title: 'Family recipes',
      p: [
        'Family recipe notebooks hold much more than ingredients.',
        'I scanned <b>Grandma Elisa’s</b> notebooks (sweets and savory) and used Artificial Intelligence to extract the text from the pages, turning everything into an easy-to-browse site.',
        'Grandma Cida’s and great-grandmas Cidona’s and Romilda’s notebooks are coming next.',
      ],
      caption: 'The sweets notebook',
      cta: 'Open the recipes',
    },
    podcast: {
      kicker: 'Chapter 6 · The walkman',
      title: 'Omelette Au Fromage',
      p: [
        'Remember the <i>Dexter’s Laboratory</i> episode where he builds a machine to learn French while sleeping? The record skips and all he can say is “Omelette du Fromage”. The correct form is “Omelette <b>au</b> Fromage”, hence the podcast’s name.',
        'The idea: learn phrases in other languages by repetition while doing other things 🧼🍽️. Short episodes for Portuguese speakers with AI-generated audio, in languages like Dutch and Italian.',
      ],
      cta: 'Listen to the podcast',
      post: 'How it was made',
    },
    blog: {
      kicker: 'Chapter 7 · The corkboard',
      title: 'The blog',
      p: [
        'Personal notes for future reference, knowledge shared along the way, and a bit of everything (in Portuguese).',
        'There are study notes too: AI, Data Science, Golang, Oracle Cloud and books.',
      ],
      cta: 'Open the blog',
    },
    photo: {
      kicker: 'Epilogue · The photo frame',
      title: 'Outside the office',
      p: [
        'My DIY spirit turns into curiosity: from philosophy to technology, from travel to photography.',
        'I’m a lifelong learner, always looking for challenges that push me out of my comfort zone. If you want to chat, reach out.',
      ],
      tags: ['Philosophy', 'Technology', 'Travel', 'Photography', 'DIY'],
    },
  },
};

const PIXEL_PHOTO = `<svg viewBox="0 0 16 20" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="20" fill="#f2c14e"/><rect width="16" height="10" fill="#ff8f6b"/><rect width="16" height="6" fill="#ffb877"/>
  <rect x="9" y="4" width="3" height="3" fill="#fff3c4"/><rect x="8" y="5" width="5" height="1" fill="#fff3c4"/>
  <path d="M0 11h2v-2h2v-2h1v2h2v2h2v2H0z" fill="#7a4fa0"/><path d="M6 13h2v-2h2v-2h2v2h1v2h3v3H6z" fill="#7a4fa0"/>
  <path d="M0 14h3v-1h3v-1h3v1h4v-1h3v4H0z" fill="#3b5b8c"/><rect y="16" width="16" height="4" fill="#3f8f5a"/>
  <rect x="3" y="17" width="1" height="1" fill="#2f7a4a"/><rect x="10" y="18" width="1" height="1" fill="#2f7a4a"/>
</svg>`;

const paras = (list) => list.map((p) => `<p>${p}</p>`).join('');

function chapter(id, theme, t, media, extra = '', actions = '') {
  return `
    <section class="chapter theme-${theme}" id="story-${id}" aria-labelledby="h-${id}">
      <div class="chapter-inner">
        <div class="chapter-media reveal">${media}</div>
        <div class="chapter-text reveal">
          <span class="chapter-kicker">${t.kicker}</span>
          <h2 id="h-${id}">${t.title}</h2>
          ${paras(t.p)}
          ${extra}
          ${actions ? `<div class="actions">${actions}</div>` : ''}
        </div>
      </div>
    </section>`;
}

const frame = (src, alt, caption = '', cls = '') =>
  `<figure class="frame ${cls}"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" />${
    caption ? `<figcaption>${caption}</figcaption>` : ''
  }</figure>`;

export function storyText(lang) {
  return TEXT[lang];
}

export function renderStory(lang) {
  const T = TEXT[lang];

  const prologue = chapter(
    'prologue',
    'night',
    T.prologue,
    frame(img('leo.webp'), 'Leonardo Montero', '', 'avatar'),
  );

  const about = chapter(
    'about',
    'paper',
    T.about,
    `<div class="stats">${T.about.stats.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('')}</div>
     <div class="whiteboard-mini" aria-hidden="true"><span>DEV</span>→<span>PLATFORM</span>→<span>PROD</span></div>`,
    '',
    ext(LINKS.linkedin, 'LinkedIn', 'btn primary'),
  );

  const computer = chapter(
    'computer',
    'terminal',
    T.computer,
    `<div class="og-stack">${REPOS.map(
      (r) =>
        `<a href="${r.url}" target="_blank" rel="noopener" class="og">${frame(
          img(`og-${r.name}.webp`),
          `${r.name} — GitHub`,
          `★ ${r.stars} · ${r.lang}`,
        )}</a>`,
    ).join('')}</div>`,
    '',
    ext(LINKS.github, T.computer.all, 'btn primary'),
  );

  const map = chapter(
    'map',
    'sky',
    T.map,
    `<div class="collage">
      ${frame(img('caraiqbonito.webp'), 'Logo Carai Que Bonito', '', 'logo round')}
      ${frame(img('berlim.webp'), T.map.captions[0], T.map.captions[0], 'tilt-l')}
      ${frame(img('praga.webp'), T.map.captions[1], T.map.captions[1], 'tilt-r')}
    </div>`,
    '',
    ext(LINKS.travel, T.map.cta, 'btn primary'),
  );

  const shelf = chapter(
    'shelf',
    'wood',
    T.shelf,
    `<ul class="spines">${BOOKS.filter((b) => b.slug !== 'outros')
      .map(
        (b, i) =>
          `<li style="--h:${78 + ((i * 37) % 22)}%;--c:${['#e4572e', '#3b5b8c', '#f2c14e', '#3f8f5a', '#7a4fa0', '#c86a4f'][i % 6]}">
            <a href="${LINKS.books}${b.slug}" target="_blank" rel="noopener" title="${b.title} — ${b.author}"><span>${b.title}</span></a></li>`,
      )
      .join('')}</ul>`,
    `<ul class="book-list">${BOOKS.filter((b) => b.slug !== 'outros')
      .map((b) => `<li><b>${b.title}</b> — ${b.author}</li>`)
      .join('')}</ul>`,
    ext(POSTS[1].url, T.shelf.post, 'btn primary') + ext(LINKS.books, T.shelf.cta),
  );

  const recipes = chapter(
    'recipes',
    'kitchen',
    T.recipes,
    `<div class="collage">
      ${frame(img('receitas-caderno.webp'), T.recipes.caption, T.recipes.caption, 'tilt-l tall')}
      ${frame(img('receitas.svg'), 'Logo Receitas', '', 'logo')}
    </div>`,
    '',
    ext(LINKS.recipes, T.recipes.cta, 'btn primary'),
  );

  const podcast = chapter(
    'podcast',
    'omelette',
    T.podcast,
    frame(img('omelette.webp'), 'Logo Omelette Au Fromage', '', 'logo spin'),
    '',
    ext(LINKS.podcast, T.podcast.cta, 'btn primary') + ext(POSTS[0].url, T.podcast.post),
  );

  const blog = chapter(
    'blog',
    'blue',
    T.blog,
    frame(img('blog.webp'), 'Blog @ltmleo'),
    `<ul class="post-list">${POSTS.map(
      (p) => `<li><a href="${p.url}" target="_blank" rel="noopener"><time>${p.date}</time> ${p.title}</a></li>`,
    ).join('')}</ul>`,
    ext(LINKS.blog, T.blog.cta, 'btn primary'),
  );

  const photo = chapter(
    'photo',
    'sunset',
    T.photo,
    `<div class="pixel-photo" aria-hidden="true">${PIXEL_PHOTO}</div>`,
    `<ul class="tags">${T.photo.tags.map((s) => `<li>${s}</li>`).join('')}</ul>`,
    ext(LINKS.linkedin, 'LinkedIn', 'btn primary') +
      ext(LINKS.github, 'GitHub') +
      ext(LINKS.instagram, 'Instagram') +
      ext(LINKS.blog, 'Blog'),
  );

  return `${prologue}${about}${computer}${map}${shelf}${recipes}${podcast}${blog}${photo}
    <footer class="site-footer">
      <a href="#office" class="back">${T.back}</a>
      <p>© ${new Date().getFullYear()} Leonardo Montero · @ltmleo</p>
    </footer>`;
}

// Capítulo correspondente a cada objeto do escritório
export const STORY_ANCHOR = {
  about: 'story-about',
  computer: 'story-computer',
  map: 'story-map',
  shelf: 'story-shelf',
  podcast: 'story-podcast',
  blog: 'story-blog',
  photo: 'story-photo',
};
