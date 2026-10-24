import { I18N, LINKS, REPOS, SITES, BOOKS, RECIPES, POSTS } from './content.js';

const ext = (href, label, cls = 'btn') =>
  `<a class="${cls}" href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;

const renderers = {
  about(t, lang) {
    const a = t.about;
    return `
      <p class="lead">${a.lead}</p>
      <p>${a.body}</p>
      <h3>${a.impactTitle}</h3>
      <ul class="cards">
        ${a.impact.map(([h, p]) => `<li><b>${h}</b><span>${p}</span></li>`).join('')}
      </ul>
      <h3>${a.eduTitle}</h3>
      <ul class="plain">${a.edu.map((e) => `<li>🎓 ${e}</li>`).join('')}</ul>
      <h3>${a.mindTitle}</h3>
      <p>${a.mind}</p>
      <ul class="tags">
        ${['Platform Engineering', 'DevEx', 'Kubernetes', 'GitOps', 'SecDevOps', 'Cloud', 'Go', 'Python', 'MLOps', 'AIOps']
          .map((s) => `<li>${s}</li>`)
          .join('')}
      </ul>
      <div class="actions">
        ${ext(LINKS.linkedin, 'LinkedIn', 'btn primary')}
        ${ext(LINKS.github, 'GitHub')}
      </div>`;
  },

  computer(t, lang) {
    const c = t.computer;
    return `
      <p class="lead">${c.lead}</p>
      <h3>${c.starred}</h3>
      <ul class="repos">
        ${REPOS.map(
          (r) => `<li>
            <a href="${r.url}" target="_blank" rel="noopener">
              <span class="repo-head"><b>${r.name}</b><span class="stars">★ ${r.stars}</span></span>
              <span>${r.desc[lang]}</span>
              <span class="meta">${r.lang}</span>
            </a></li>`,
        ).join('')}
      </ul>
      <h3>${c.sites}</h3>
      <ul class="repos">
        ${SITES.map(
          (s) => `<li>
            <a href="${s.page}" target="_blank" rel="noopener">
              <span class="repo-head"><b>${s.name}</b><span class="meta">${s.page.replace('https://', '')}</span></span>
              <span>${s.desc[lang]}</span>
            </a></li>`,
        ).join('')}
      </ul>
      <div class="actions">${ext(LINKS.github, c.all, 'btn primary')}</div>`;
  },

  map(t) {
    const m = t.map;
    return `
      <p class="lead">${m.lead}</p>
      <p>${m.body}</p>
      <div class="actions">${ext(LINKS.travel, m.cta, 'btn primary')}</div>`;
  },

  shelf(t, lang) {
    const s = t.shelf;
    return `
      <p class="lead">${s.lead}</p>
      <h3>${s.books}</h3>
      <ul class="books">
        ${BOOKS.map(
          (b) => `<li><a href="${LINKS.books}${b.slug}" target="_blank" rel="noopener"><b>${b.title}</b><span>${b.author}</span></a></li>`,
        ).join('')}
      </ul>
      <div class="actions">${ext(LINKS.books, s.allBooks)}</div>
      <h3>${s.recipes}</h3>
      <p>${s.recipesLead}</p>
      <ul class="plain">
        ${RECIPES.map((r) => `<li>🍰 ${r[lang]}${r.ready ? '' : ` <em>(${t.soon})</em>`}</li>`).join('')}
      </ul>
      <div class="actions">${ext(LINKS.recipes, s.allRecipes, 'btn primary')}</div>`;
  },

  podcast(t) {
    const p = t.podcast;
    return `
      <p class="lead">${p.lead}</p>
      <p>${p.body}</p>
      <div class="actions">
        ${ext(LINKS.podcast, p.cta, 'btn primary')}
        ${ext(POSTS[0].url, p.post)}
      </div>`;
  },

  blog(t) {
    const b = t.blog;
    return `
      <p class="lead">${b.lead}</p>
      <h3>${b.latest}</h3>
      <ul class="posts">
        ${POSTS.map(
          (p) => `<li><a href="${p.url}" target="_blank" rel="noopener"><time>${p.date}</time><b>${p.title}</b></a></li>`,
        ).join('')}
      </ul>
      <p>${b.learning}</p>
      <div class="actions">${ext(LINKS.blog, b.cta, 'btn primary')}</div>`;
  },

  photo(t) {
    const p = t.photo;
    return `
      <p class="lead">${p.lead}</p>
      <p>${p.body}</p>
      <ul class="tags">${p.tags.map((s) => `<li>${s}</li>`).join('')}</ul>
      <div class="actions">${ext(LINKS.instagram, 'Instagram', 'btn primary')}</div>`;
  },
};

export function renderPanel(id, lang) {
  const t = I18N[lang];
  return {
    kicker: t[id].kicker,
    title: t.objects[id].split(' · ')[0],
    html: renderers[id](t, lang),
  };
}
