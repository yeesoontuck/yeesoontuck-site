/* ── Nav: scroll effect ─────────────────────────── */
const nav    = document.getElementById('nav');
const toggle = document.getElementById('nav-toggle');
const links  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Nav: mobile toggle ─────────────────────────── */
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

/* ── Reveal on scroll ───────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── GitHub repos ───────────────────────────────── */
const GITHUB_USER = 'yeesoontuck';

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572a5',
  Java:       '#b07219',
  'C++':      '#f34b7d',
  C:          '#555555',
  'C#':       '#178600',
  Go:         '#00add8',
  Rust:       '#dea584',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Ruby:       '#701516',
  Swift:      '#f05138',
  Kotlin:     '#a97bff',
  Dart:       '#00b4ab',
  Shell:      '#89e051',
  Vue:        '#41b883',
  PHP:        '#4f5d95',
};

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function repoCard(repo) {
  const lang  = repo.language || '';
  const color = LANG_COLORS[lang] || '#94a3b8';
  const dotHtml = lang
    ? `<span class="lang-dot" style="background:${color}" aria-hidden="true"></span>`
    : '';

  return `
    <div class="repo-card reveal">
      <a href="${escHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer"
         aria-label="View ${escHtml(repo.name)} on GitHub">
        <p class="repo-name">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M3 3h6l3 3 3-3h6v16H3z"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
          </svg>
          ${escHtml(repo.name)}
        </p>
      </a>
      ${repo.description
        ? `<p class="repo-desc">${escHtml(repo.description)}</p>`
        : `<p class="repo-desc repo-desc-empty">No description</p>`}
      <div class="repo-meta">
        ${lang ? `<span class="repo-lang">${dotHtml}${escHtml(lang)}</span>` : ''}
        <span class="repo-stars" aria-label="${repo.stargazers_count} stars">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12
                     2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          ${repo.stargazers_count}
        </span>
      </div>
    </div>`;
}

(async () => {
  const grid = document.getElementById('repos-grid');
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      grid.innerHTML =
        `<p class="repos-empty">No public repositories found yet.</p>`;
      return;
    }

    grid.innerHTML = repos.map(repoCard).join('');

    grid.querySelectorAll('.repo-card.reveal').forEach(el =>
      revealObserver.observe(el)
    );
  } catch (err) {
    console.error('Failed to load GitHub repos:', err);
    grid.innerHTML =
      `<p class="repos-error">Could not load repositories.
       <a href="https://github.com/${GITHUB_USER}" target="_blank"
          rel="noopener noreferrer">View on GitHub →</a></p>`;
  }
})();
