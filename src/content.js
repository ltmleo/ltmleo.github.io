// Conteúdo curado do escritório. Edite aqui para atualizar textos, projetos e links.

import SHARED from './shared/sites.json';

// Lista única dos sites (a mesma usada pela barra <ltm-bar> nos outros sites)
export const ORIGIN = 'https://ltmleo.github.io';
const site = (id) => SHARED.sites.find((s) => s.id === id);
const pageOf = (id) => ORIGIN + site(id).path;

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/ltmleo/',
  github: 'https://github.com/ltmleo',
  instagram: 'https://instagram.com/ltmleo',
  blog: pageOf('blog'),
  blogPosts: `${pageOf('blog')}blog`,
  books: `${pageOf('blog')}learning/livros/`,
  recipes: pageOf('receitas'),
  travel: pageOf('caraiqbonito'),
  podcast: pageOf('omeletteaufromage'),
  disk: pageOf('disk-discovery'),
  rodada: pageOf('rodada'),
  skoob: 'https://github.com/ltmleo/skoob-recomenda',
};

// Repositórios de código em destaque no Computador (os sites ficam em SITES)
export const REPOS = [
  {
    name: 'k8s-clean-yaml',
    stars: 4,
    lang: 'Python',
    url: 'https://github.com/ltmleo/k8s-clean-yaml',
    desc: {
      pt: 'Limpa campos inúteis de manifests Kubernetes exportados do cluster.',
      en: 'Cleans useless fields from Kubernetes manifests exported from a cluster.',
    },
  },
  {
    name: 'aks-helper',
    stars: 1,
    lang: 'Python',
    url: 'https://github.com/ltmleo/aks-helper',
    desc: {
      pt: 'Configura o kubectl para clusters AKS em várias assinaturas do Azure, via az-cli.',
      en: 'Sets up kubectl for AKS clusters across Azure subscriptions, via az-cli.',
    },
  },
];

// Recomendador de livros em destaque na estante
export const SKOOB = {
  name: 'skoob-recomenda',
  lang: 'Go',
  url: LINKS.skoob,
};

// Projetos com página publicada (todos os sites, menos a própria home)
export const SITES = SHARED.sites
  .filter((s) => s.id !== 'home')
  .map((s) => ({ id: s.id, icon: s.icon, name: s.name, repo: s.repo, page: ORIGIN + s.path, desc: s.desc }));

export const BOOKS = [
  { title: 'Arriscando a própria pele', author: 'Nassim Nicholas Taleb', slug: 'arriscando-a-propria-pele' },
  { title: 'Engenharia de Plataforma', author: 'Camille Fournier & Ian Nowland', slug: 'engenharia-de-plataforma' },
  { title: 'Humanidade', author: 'Rutger Bregman', slug: 'humanidade' },
  { title: 'Nexus', author: 'Yuval Noah Harari', slug: 'nexus' },
  { title: 'Pensando em Sistemas', author: 'Donella H. Meadows', slug: 'pensando-em-sistemas' },
  { title: 'O Segredo Final', author: 'Dan Brown', slug: 'segredo-final' },
  { title: 'Outros', author: '…', slug: 'outros' },
];

export const RECIPES = [
  { pt: 'Doces — Vó Elisa', en: 'Sweets — Grandma Elisa', ready: true },
  { pt: 'Salgados — Vó Elisa', en: 'Savory — Grandma Elisa', ready: true },
  { pt: 'Receitas — Vó Cida', en: 'Recipes — Grandma Cida', ready: false },
  { pt: 'Receitas — Bisavó Cidona', en: 'Recipes — Great-grandma Cidona', ready: false },
  { pt: 'Receitas — Bisavó Romilda', en: 'Recipes — Great-grandma Romilda', ready: false },
];

export const POSTS = [
  {
    date: '2025-06-25',
    title: 'Omelette au Fromage: Podcast de Idiomas e a Revolução da IA',
    url: 'https://ltmleo.github.io/blog/blog/2025/06/25/podcast',
  },
  {
    date: '2024-09-28',
    title: 'Além da resiliência: Construindo sistemas que se beneficiam das falhas',
    url: 'https://ltmleo.github.io/blog/blog/2024/09/28/antifragil',
  },
  { date: '2024-09-22', title: 'Bem vindo!!', url: 'https://ltmleo.github.io/blog/blog/2024/09/22/welcome' },
];

// Textos de interface e de cada objeto
export const I18N = {
  pt: {
    role: 'Platform Engineering · DevEx',
    start: '▶ ENTRAR',
    introHint: 'Clique nos objetos do escritório para explorar.',
    introSites: 'ou vá direto para todos os sites ↓',
    sitesHud: 'SITES',
    hint: 'Clique nos objetos · teclas 1–9',
    explored: 'Explorado',
    achievement: '🏆 Conquista desbloqueada: Explorador do escritório!',
    close: 'Fechar',
    cat: '{name} · clique para fazer carinho 🐾',
    visit: 'Visitar',
    repo: 'Repositório',
    soon: 'em breve',
    noWebgl: 'Seu navegador não suporta WebGL — use a barra abaixo para navegar.',
    objects: {
      about: 'Quadro · Quem sou eu',
      computer: 'Computador · Projetos',
      map: 'Mapa · Viagens',
      shelf: 'Estante · Receitas e livros',
      podcast: 'Walkman · Podcast',
      blog: 'Mural · Blog',
      photo: 'Porta-retrato · Pessoal',
      disk: 'Vitrola · Disk Discovery',
      rodada: 'Videogame · Rodada',
    },
    about: {
      kicker: 'Quem sou eu',
      lead: 'Líder técnico focado em <b>Platform Engineering</b> e <b>Developer Experience</b>. Hoje lidero a evolução do DevOps corporativo na <b>Vivo</b>, com soluções que impactam o fluxo de trabalho de mais de <b>2.500 desenvolvedores</b>.',
      body: 'Minha abordagem segue a visão de <i>Platform as a Product</i>: maturidade de processos, evolução contínua e ecossistemas self-service que deixam os times entregarem software de qualidade com o mínimo de atrito.',
      impactTitle: 'Impacto',
      impact: [
        ['Escala e eficiência', 'Organizei e plataformizei o departamento de DevOps, reduzindo lead time e volume de incidentes em ambientes críticos.'],
        ['Cultura DevEx', 'Pipelines corporativos e soluções self-service que melhoraram muito a satisfação dos times de engenharia.'],
        ['Visão de produto', 'Ferramentas internas tratadas como produtos vivos, focados no usuário final: o desenvolvedor.'],
      ],
      eduTitle: 'Formação',
      edu: ['Engenharia de Telecomunicações — UNESP', 'Especialização em Data Science & Analytics — USP'],
      mindTitle: 'Mindset',
      mind: 'Acredito em liderança por influência e compartilhamento de conhecimento. Estudo sistemas complexos e o conceito de antifragilidade.',
    },
    computer: {
      kicker: 'Projetos no GitHub',
      lead: 'Ferramentas de plataforma que publiquei como código aberto, e todos os projetos com página no ar.',
      starred: 'Ferramentas de Kubernetes',
      sites: 'Com página no ar',
      all: 'Ver todos no GitHub',
    },
    map: {
      kicker: 'Viagens',
      lead: '<b>Carai Que Bonito!</b> é meu catálogo de viagens: histórias, curiosidades e dicas para a próxima grande jornada 🌍',
      body: 'Os destinos estão organizados por região — Europa e Américas — e há um blog com relatos de cada viagem.',
      cta: 'Abrir o Carai Que Bonito',
    },
    shelf: {
      kicker: 'Estante',
      lead: 'Nesta estante moram os cadernos de receitas da família e os livros, com um recomendador que sugere o próximo.',
      books: 'Notas de leitura',
      recipes: 'Receitas de família',
      recipesLead: 'Os cadernos da família escaneados página por página e transcritos com Inteligência Artificial, para nenhum sabor se perder.',
      skoob: 'skoob-recomenda',
      skoobLead: 'Lê a sua estante do Skoob, encontra leitores com gosto parecido e sugere o que ler a seguir, sempre com o motivo. Roda no seu computador, sem servidor.',
      skoobTags: ['Go', 'Filtragem colaborativa', 'CLI + app local'],
      skoobCta: 'Ver o skoob-recomenda',
      allBooks: 'Todas as notas de leitura',
      allRecipes: 'Abrir as receitas',
    },
    disk: {
      kicker: 'Discos',
      lead: '<b>Disk Discovery</b> — abra pacotes e descubra os 500 maiores álbuns de todos os tempos 💿',
      body: 'Cada disco da lista da Rolling Stone (2020) é uma carta. Quanto mais alto no ranking, mais raro: os cinco primeiros são lendários. A abertura do pacote tem scratch de DJ, suspense e fanfarra, tudo sintetizado no navegador.',
      cta: 'Abrir um pacote',
    },
    rodada: {
      kicker: 'Jogos',
      lead: '<b>Rodada</b> — sua rodada diária de jogos 🎮',
      body: 'Marque os desafios que você joga todo dia (Termo, Dueto, Wordle, Conexo…), cole o resultado do botão “Compartilhar” e acompanhe sequências e histórico. Sem login: tudo fica no seu aparelho, e funciona offline.',
      cta: 'Jogar a rodada de hoje',
    },
    podcast: {
      kicker: 'Podcast',
      lead: '<b>Omelette Au Fromage</b> — aprenda frases em outros idiomas enquanto faz outras coisas 🧼🍽️',
      body: 'Frases por repetição para falantes de português, com áudios gerados por IA. O nome vem do episódio do Laboratório de Dexter em que a máquina de ensinar francês trava em “Omelette du Fromage”.',
      cta: 'Ouvir o podcast',
      post: 'Ler o post sobre o podcast',
    },
    blog: {
      kicker: 'Blog',
      lead: 'Registros pessoais para consultas futuras e conhecimento compartilhado ao longo da jornada — um pouco de tudo.',
      latest: 'Posts',
      learning: 'Também tem notas de estudo: IA, Data Science, Golang, Oracle Cloud e livros.',
      cta: 'Abrir o blog',
    },
    photo: {
      kicker: 'Pessoal',
      lead: 'Fora do escritório, meu espírito <i>faça-você-mesmo</i> vira curiosidade: de filosofia a tecnologia, de viagens a fotografia.',
      body: 'Sou um eterno aprendiz, sempre atrás de desafios que me tirem da zona de conforto.',
      tags: ['Filosofia', 'Tecnologia', 'Viagens', 'Fotografia', 'DIY'],
    },
  },
  en: {
    role: 'Platform Engineering · DevEx',
    start: '▶ START',
    introHint: 'Click the objects in the office to explore.',
    introSites: 'or jump straight to all sites ↓',
    sitesHud: 'SITES',
    hint: 'Click objects · keys 1–9',
    explored: 'Explored',
    achievement: '🏆 Achievement unlocked: Office explorer!',
    close: 'Close',
    cat: '{name} · click to pet 🐾',
    visit: 'Visit',
    repo: 'Repository',
    soon: 'coming soon',
    noWebgl: 'Your browser does not support WebGL — use the bar below to navigate.',
    objects: {
      about: 'Whiteboard · About me',
      computer: 'Computer · Projects',
      map: 'Map · Travel',
      shelf: 'Shelf · Recipes & books',
      podcast: 'Walkman · Podcast',
      blog: 'Corkboard · Blog',
      photo: 'Photo frame · Personal',
      disk: 'Record player · Disk Discovery',
      rodada: 'Game console · Rodada',
    },
    about: {
      kicker: 'About me',
      lead: 'Technical leader focused on <b>Platform Engineering</b> and <b>Developer Experience</b>. I currently lead the evolution of Enterprise DevOps at <b>Vivo</b>, building solutions that shape the workflow of over <b>2,500 developers</b>.',
      body: 'My approach follows a <i>Platform as a Product</i> vision: process maturity, continuous evolution and self-service ecosystems that let teams ship high-quality software with minimal friction.',
      impactTitle: 'Impact',
      impact: [
        ['Scale & efficiency', 'Organized and platformized the DevOps department, cutting lead time and incident volume across critical environments.'],
        ['DevEx culture', 'Enterprise-wide pipelines and self-service solutions that drastically improved engineering satisfaction.'],
        ['Product vision', 'Internal tools treated as living products, focused on their end user: the developer.'],
      ],
      eduTitle: 'Education',
      edu: ['Telecommunications Engineering — UNESP', 'Specialization in Data Science & Analytics — USP'],
      mindTitle: 'Mindset',
      mind: 'I believe in leadership through influence and knowledge sharing. I study complex systems and the idea of antifragility.',
    },
    computer: {
      kicker: 'GitHub projects',
      lead: 'Platform tools I published as open source, and every project with a live page.',
      starred: 'Kubernetes tools',
      sites: 'Live pages',
      all: 'See everything on GitHub',
    },
    map: {
      kicker: 'Travel',
      lead: '<b>Carai Que Bonito!</b> is my travel catalog: stories, trivia and tips for your next big journey 🌍',
      body: 'Destinations are organized by region — Europe and the Americas — plus a blog with notes from each trip (in Portuguese).',
      cta: 'Open Carai Que Bonito',
    },
    shelf: {
      kicker: 'Bookshelf',
      lead: 'This shelf holds the family recipe notebooks and the books, plus a recommender that picks the next one (in Portuguese).',
      books: 'Reading notes',
      recipes: 'Family recipes',
      recipesLead: 'Family notebooks scanned page by page and transcribed with Artificial Intelligence, so no flavor gets lost.',
      skoob: 'skoob-recomenda',
      skoobLead: 'Reads your Skoob bookshelf, finds readers with similar taste and suggests what to read next, always with the reason. Runs on your computer, no server.',
      skoobTags: ['Go', 'Collaborative filtering', 'CLI + local app'],
      skoobCta: 'See skoob-recomenda',
      allBooks: 'All reading notes',
      allRecipes: 'Open the recipes',
    },
    disk: {
      kicker: 'Records',
      lead: '<b>Disk Discovery</b> — open packs and discover the 500 greatest albums of all time 💿',
      body: 'Every album on the Rolling Stone list (2020) is a card. The higher in the ranking, the rarer: the top five are legendary. Opening a pack comes with DJ scratches, suspense and a fanfare, all synthesized in the browser (in Portuguese).',
      cta: 'Open a pack',
    },
    rodada: {
      kicker: 'Games',
      lead: '<b>Rodada</b> — your daily round of games 🎮',
      body: 'Check off the puzzles you play every day (Wordle, Termo, Conexo…), paste the result from the “Share” button and track streaks and history. No login: everything stays on your device, and it works offline (in Portuguese).',
      cta: 'Play today’s round',
    },
    podcast: {
      kicker: 'Podcast',
      lead: '<b>Omelette Au Fromage</b> — learn phrases in other languages while doing other things 🧼🍽️',
      body: 'Phrases by repetition for Portuguese speakers, with AI-generated audio. The name comes from the Dexter’s Laboratory episode where the French-teaching machine gets stuck on “Omelette du Fromage”.',
      cta: 'Listen to the podcast',
      post: 'Read the post about it',
    },
    blog: {
      kicker: 'Blog',
      lead: 'Personal notes for future reference and knowledge shared along the way — a bit of everything (in Portuguese).',
      latest: 'Posts',
      learning: 'There are study notes too: AI, Data Science, Golang, Oracle Cloud and books.',
      cta: 'Open the blog',
    },
    photo: {
      kicker: 'Personal',
      lead: 'Outside the office, my DIY spirit turns into curiosity: from philosophy to technology, from travel to photography.',
      body: 'I am a lifelong learner, always looking for challenges that push me out of my comfort zone.',
      tags: ['Philosophy', 'Technology', 'Travel', 'Photography', 'DIY'],
    },
  },
};

export const OBJECT_ORDER = ['about', 'computer', 'map', 'shelf', 'podcast', 'blog', 'photo', 'disk', 'rodada'];
export const OBJECT_ICONS = {
  about: '📋',
  computer: '💻',
  map: '🗺️',
  shelf: '📚',
  podcast: '🎧',
  blog: '📌',
  photo: '🖼️',
  disk: '💿',
  rodada: '🎮',
};
