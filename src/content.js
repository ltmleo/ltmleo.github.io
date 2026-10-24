// Conteúdo curado do escritório. Edite aqui para atualizar textos, projetos e links.

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/ltmleo/',
  github: 'https://github.com/ltmleo',
  instagram: 'https://instagram.com/ltmleo',
  blog: 'https://ltmleo.github.io/blog/',
  blogPosts: 'https://ltmleo.github.io/blog/blog',
  books: 'https://ltmleo.github.io/blog/learning/livros/',
  recipes: 'https://ltmleo.github.io/receitas/',
  travel: 'https://ltmleo.github.io/caraiqbonito/',
  podcast: 'https://ltmleo.github.io/omeletteaufromage/',
};

// Repositórios com estrelas
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
    name: 'blog',
    stars: 1,
    lang: 'TypeScript',
    url: 'https://github.com/ltmleo/blog',
    page: LINKS.blog,
    desc: {
      pt: 'Blog pessoal em Docusaurus: notas de estudo, livros e projetos.',
      en: 'Personal Docusaurus blog: study notes, books and projects.',
    },
  },
  {
    name: 'fullcyle',
    stars: 1,
    lang: 'Go',
    url: 'https://github.com/ltmleo/fullcyle',
    desc: {
      pt: 'Desafios, aulas e experimentos do curso Full Cycle.',
      en: 'Full Cycle challenges, classes and experiments.',
    },
  },
];

// Projetos com página publicada
export const SITES = [
  {
    name: 'Carai Que Bonito!',
    repo: 'https://github.com/ltmleo/caraiqbonito',
    page: LINKS.travel,
    desc: { pt: 'Curiosidades e dicas de viagem.', en: 'Travel trivia and tips.' },
  },
  {
    name: 'Receitas de família',
    repo: 'https://github.com/ltmleo/receitas',
    page: LINKS.recipes,
    desc: {
      pt: 'Cadernos de receitas da família digitalizados com IA.',
      en: 'Family recipe notebooks digitized with AI.',
    },
  },
  {
    name: 'Omelette Au Fromage',
    repo: 'https://github.com/ltmleo/omeletteaufromage',
    page: LINKS.podcast,
    desc: { pt: 'Podcast de frases em outros idiomas.', en: 'Podcast of phrases in other languages.' },
  },
  {
    name: 'Blog @ltmleo',
    repo: 'https://github.com/ltmleo/blog',
    page: LINKS.blog,
    desc: { pt: 'Registros pessoais e conhecimento compartilhado.', en: 'Personal notes and shared knowledge.' },
  },
];

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
    hint: 'Clique nos objetos · teclas 1–7',
    explored: 'Explorado',
    achievement: '🏆 Conquista desbloqueada: Explorador do escritório!',
    close: 'Fechar',
    visit: 'Visitar',
    repo: 'Repositório',
    soon: 'em breve',
    noWebgl: 'Seu navegador não suporta WebGL — use a barra abaixo para navegar.',
    objects: {
      about: 'Quadro · Quem sou eu',
      computer: 'Computador · Projetos',
      map: 'Mapa · Viagens',
      shelf: 'Estante · Livros e receitas',
      podcast: 'Walkman · Podcast',
      blog: 'Mural · Blog',
      photo: 'Porta-retrato · Pessoal',
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
      lead: 'Uma seleção dos meus repositórios: os que receberam estrelas e os que têm página publicada.',
      starred: 'Com estrelas',
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
      lead: 'Notas de leitura dos livros que li ou estou lendo, e as receitas da família.',
      books: 'Livros',
      recipes: 'Receitas de família',
      recipesLead: 'Receitas escaneadas dos cadernos da família e digitalizadas com Inteligência Artificial.',
      allBooks: 'Todas as notas de leitura',
      allRecipes: 'Abrir as receitas',
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
    hint: 'Click objects · keys 1–7',
    explored: 'Explored',
    achievement: '🏆 Achievement unlocked: Office explorer!',
    close: 'Close',
    visit: 'Visit',
    repo: 'Repository',
    soon: 'coming soon',
    noWebgl: 'Your browser does not support WebGL — use the bar below to navigate.',
    objects: {
      about: 'Whiteboard · About me',
      computer: 'Computer · Projects',
      map: 'Map · Travel',
      shelf: 'Shelf · Books & recipes',
      podcast: 'Walkman · Podcast',
      blog: 'Corkboard · Blog',
      photo: 'Photo frame · Personal',
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
      lead: 'A selection of my repositories: the starred ones and the ones with a live page.',
      starred: 'Starred',
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
      lead: 'Reading notes on books I have read or am reading, and the family recipes (in Portuguese).',
      books: 'Books',
      recipes: 'Family recipes',
      recipesLead: 'Recipes scanned from family notebooks and digitized with Artificial Intelligence.',
      allBooks: 'All reading notes',
      allRecipes: 'Open the recipes',
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

export const OBJECT_ORDER = ['about', 'computer', 'map', 'shelf', 'podcast', 'blog', 'photo'];
export const OBJECT_ICONS = {
  about: '📋',
  computer: '💻',
  map: '🗺️',
  shelf: '📚',
  podcast: '🎧',
  blog: '📌',
  photo: '🖼️',
};
