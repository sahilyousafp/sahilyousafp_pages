'use strict';

/* ══════════════════════════════════════════════
   SAHIL YOUSAF — PORTFOLIO SCRIPT
   Architect & AI Researcher · 2025
   ══════════════════════════════════════════════ */

const CONFIG = {
  username:     'sahilyousafp',
  exclude:      ['sahilyousafp_pages', 'sahilyousafp'],
  api:          'https://api.github.com'
};

const EMAIL_CFG = {
  publicKey:      'YOUR_PUBLIC_KEY',
  serviceId:      'YOUR_SERVICE_ID',
  templateId:     'YOUR_TEMPLATE_ID',
  recipient:      'sahil.yousaf@students.iaac.net'
};

/* Map repo names → dedicated project pages */
const PROJECT_PAGES = {
  'Building_Analysis_Tool':                  'project-bat.html',
  'LLM-based-UrbanABM':                      'project-llm-urbanism.html',
  'Grounded.-Structural-Solutions':          'project-structural.html',
  'Pardaz_Exhibition-Pedestrian-Simulation': 'project-pardaz.html',
  'AEC_HACKATHON_BIG':                       'project-hackathon.html',
  'AI4ALL_Decision':                         'project-ai4all.html'
};

const LANG_COLORS = {
  'JavaScript':       '#f1e05a',
  'TypeScript':       '#2b7489',
  'Python':           '#3572A5',
  'Java':             '#b07219',
  'C++':              '#f34b7d',
  'C':                '#555555',
  'HTML':             '#e34c26',
  'CSS':              '#563d7c',
  'PHP':              '#4F5D95',
  'Ruby':             '#701516',
  'Go':               '#00ADD8',
  'Rust':             '#dea584',
  'Shell':            '#89e051',
  'Vue':              '#41b883',
  'Jupyter Notebook': '#DA5B0B',
  'GLSL':             '#5686a5',
  'GDScript':         '#355570'
};

let repos = [];
let currentRepo = null;

/* ── Bootstrap ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initReveal();
  triggerHeroReveal();
  loadBio();
  loadProjects();
  initModal();
  initContactForm();
});

/* ══ CURSOR ══════════════════════════════════════
   Smooth lagging ring + instant dot             */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.matchMedia('(pointer: coarse)').matches) {
    if (dot)  dot.style.display  = 'none';
    if (ring) ring.style.display = 'none';
    return;
  }

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
  });
}

/* ══ NAV ════════════════════════════════════════
   Scroll state + active link tracking          */
function initNav() {
  const nav     = document.getElementById('mainNav');
  const links   = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);

    let active = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) active = s.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + active);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  links.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
      }
    });
  });
}

/* ══ SCROLL REVEAL ══════════════════════════════
   IntersectionObserver-driven fade+rise        */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || 0) * 100;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
}

/* Hero elements are in viewport on load — trigger directly.
   Also handles project pages where all content starts in the viewport. */
function triggerHeroReveal() {
  // index.html hero columns
  document.querySelectorAll('.hero-left [data-reveal], .hero-right [data-reveal]').forEach(el => {
    const delay = parseInt(el.dataset.delay || 0) * 150 + 200;
    setTimeout(() => el.classList.add('visible'), delay);
  });
  // Any [data-reveal] already visible in viewport at load (project pages)
  document.querySelectorAll('[data-reveal]:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const delay = parseInt(el.dataset.delay || 0) * 100 + 100;
      setTimeout(() => el.classList.add('visible'), delay);
    }
  });
}

/* ══ BIO ════════════════════════════════════════
   Loads from GitHub profile README (username/username) */
async function loadBio() {
  const el = document.getElementById('bio-content');
  if (!el) return;
  try {
    const res  = await fetch(`${CONFIG.api}/repos/${CONFIG.username}/${CONFIG.username}/readme`);
    if (!res.ok) throw new Error('No profile README');
    const data = await res.json();
    const md   = decodeURIComponent(escape(atob(data.content)));
    el.innerHTML = mdToHtml(md, CONFIG.username, CONFIG.username);
  } catch {
    el.innerHTML = `
      <p>Architect and AI researcher with a passion for computational design and the application of
      artificial intelligence in the built environment. Currently pursuing advanced research at
      IAAC (Institute for Advanced Architecture of Catalonia) in Barcelona.</p>
      <p>With experience at leading practices including Morphogenesis (Delhi), SHAPE Architecture &amp;
      Research (UAE), and DNEG (Mumbai), I bring a unique blend of traditional architectural practice
      and cutting-edge computational methods.</p>
      <p>My work spans parametric design, building performance analysis, and AI-driven spatial research —
      culminating in a <strong>published paper at ANNSIM 2025</strong>.</p>`;
  }
}

/* ══ PROJECTS ═══════════════════════════════════
   Pinned repos via GraphQL, fallback to REST   */
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  try {
    const pinned = await fetchPinned();
    repos = pinned.length
      ? pinned.filter(r => !CONFIG.exclude.includes(r.name))
      : await fetchTop();

    if (!repos.length) throw new Error('empty');
    renderProjects();
  } catch {
    grid.innerHTML = `
      <div class="projects-error">
        <i class="fas fa-exclamation-circle"
           style="font-size:2rem;color:var(--rust);display:block;margin-bottom:1rem;"></i>
        <p>Could not load projects. Check your internet connection.</p>
      </div>`;
  }
}

async function fetchPinned() {
  const q = `query{user(login:"${CONFIG.username}"){pinnedItems(first:6,types:REPOSITORY){nodes{...on Repository{name description url stargazerCount forkCount primaryLanguage{name}updatedAt isPrivate}}}}}`;
  try {
    const res  = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q })
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.errors) return [];
    return (data.data?.user?.pinnedItems?.nodes || [])
      .filter(r => !r.isPrivate)
      .map(r => ({
        name:             r.name,
        description:      r.description,
        html_url:         r.url,
        stargazers_count: r.stargazerCount,
        forks_count:      r.forkCount,
        language:         r.primaryLanguage?.name,
        updated_at:       r.updatedAt,
        has_pages:        false
      }));
  } catch { return []; }
}

async function fetchTop() {
  const res  = await fetch(`${CONFIG.api}/users/${CONFIG.username}/repos?sort=updated&per_page=20`);
  if (!res.ok) throw new Error();
  const all  = await res.json();
  return all
    .filter(r => !CONFIG.exclude.includes(r.name) && !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = repos.map((r, i) => {
    const hasPage = !!PROJECT_PAGES[r.name];
    return `
    <div class="proj-card${hasPage ? ' has-page' : ''}" data-name="${r.name}" data-reveal data-delay="${i % 3}">
      <div class="proj-num">Project ${String(i + 1).padStart(2, '0')}</div>
      <h3 class="proj-name">${fmtName(r.name)}</h3>
      <p class="proj-desc">${r.description || 'No description available.'}</p>
      <div class="proj-meta">
        ${r.language ? `
          <span class="proj-lang">
            <span class="lang-dot" style="background:${LANG_COLORS[r.language] || '#888'}"></span>
            ${r.language}
          </span>` : ''}
        <span class="proj-stat"><i class="fas fa-star"></i> ${r.stargazers_count ?? 0}</span>
        <span class="proj-stat"><i class="fas fa-code-branch"></i> ${r.forks_count ?? 0}</span>
      </div>
      <div class="proj-arrow"><i class="fas fa-arrow-right"></i></div>
    </div>
  `}).join('');

  /* click → project page or modal */
  grid.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      if (PROJECT_PAGES[name]) {
        window.location.href = PROJECT_PAGES[name];
      } else {
        const repo = repos.find(r => r.name === name);
        if (repo) openModal(repo);
      }
    });
  });

  /* reveal newly rendered cards */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay || 0) * 100;
      setTimeout(() => e.target.classList.add('visible'), delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08 });
  grid.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));

  /* extend cursor hover listeners */
  grid.querySelectorAll('.proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
  });
}

function fmtName(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* ══ MODAL ══════════════════════════════════════
   Opens with project README                    */
function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  if (!overlay || !closeBtn) return;
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

async function openModal(repo) {
  currentRepo = repo;
  document.getElementById('modalTitle').textContent    = fmtName(repo.name);
  document.getElementById('modalRepoLink').href        = repo.html_url;
  document.getElementById('modalReadme').innerHTML     = '<div class="spinner" style="margin:2rem auto;"></div>';

  const demoLink = document.getElementById('modalDemoLink');
  if (repo.has_pages) {
    demoLink.href         = `https://${CONFIG.username}.github.io/${repo.name}`;
    demoLink.style.display = 'inline-flex';
  } else {
    demoLink.style.display = 'none';
  }

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  try {
    const res  = await fetch(`${CONFIG.api}/repos/${CONFIG.username}/${repo.name}/readme`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    const md   = decodeURIComponent(escape(atob(data.content)));
    document.getElementById('modalReadme').innerHTML = mdToHtml(md, CONFIG.username, repo.name);
  } catch {
    document.getElementById('modalReadme').innerHTML =
      `<p style="color:var(--ink-light);text-align:center;padding:2rem 0;">
         No README found for this project.
       </p>`;
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ══ MARKDOWN → HTML ════════════════════════════
   Lightweight converter for README display     */
function mdToHtml(md, user, repo) {
  /* resolve relative image paths to GitHub raw URLs */
  function rawUrl(src) {
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return `https://raw.githubusercontent.com/${user}/${repo}/main/${src}`;
  }

  let h = md
    /* badge-links: [![alt](img)](url) */
    .replace(/\[!\[([^\]]*)\]\(([^)]*)\)\]\(([^)]*)\)/gm,
      (_, alt, img, url) =>
        `<a href="${url}" target="_blank" rel="noopener"><img src="${rawUrl(img)}" alt="${alt}" style="max-height:22px;border-radius:2px;margin:2px;display:inline;"></a>`)
    /* images: ![alt](src) */
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/gm,
      (_, alt, src) =>
        `<img src="${rawUrl(src)}" alt="${alt}" loading="lazy" onerror="this.style.display='none'">`)
    /* headings */
    .replace(/^#{6} (.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5} (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4} (.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3} (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2} (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,    '<h1>$1</h1>')
    /* fenced code blocks */
    .replace(/```[\w]*\n([\s\S]*?)```/gm, '<pre><code>$1</code></pre>')
    /* inline code */
    .replace(/`([^`\n]+)`/gm, '<code>$1</code>')
    /* bold + italic */
    .replace(/\*\*\*(.+?)\*\*\*/gm,  '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/gm,      '<strong>$1</strong>')
    .replace(/__(.+?)__/gm,          '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/gm,      '<em>$1</em>')
    .replace(/_([^_\n]+)_/gm,        '<em>$1</em>')
    /* blockquote */
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    /* horizontal rule */
    .replace(/^(---|\*\*\*)$/gm, '<hr>')
    /* links */
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gm,
      '<a href="$2" target="_blank" rel="noopener">$1</a>')
    /* unordered list items */
    .replace(/^[\*\-\+] (.+)$/gm, '<li>$1</li>')
    /* ordered list items */
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  /* wrap consecutive <li> in <ul> */
  h = h.replace(/(<li>.*<\/li>\n?)+/gms, match => `<ul>${match}</ul>`);

  /* paragraphs — split on blank lines, wrap non-block elements */
  h = h.split(/\n{2,}/).map(chunk => {
    chunk = chunk.trim();
    if (!chunk) return '';
    if (/^<(h[1-6]|ul|ol|li|pre|blockquote|hr|img|table|div)/.test(chunk)) return chunk;
    return `<p>${chunk.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  return h;
}

/* ══ CONTACT FORM ═══════════════════════════════
   EmailJS with mailto fallback                 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  if (EMAIL_CFG.publicKey !== 'YOUR_PUBLIC_KEY') {
    try { emailjs.init(EMAIL_CFG.publicKey); } catch (e) { console.warn('EmailJS init:', e); }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn  = document.getElementById('submit-btn');
    const orig = btn.innerHTML;

    const payload = {
      from_name:  form.from_name.value.trim(),
      from_email: form.from_email.value.trim(),
      subject:    form.subject.value.trim(),
      message:    form.message.value.trim(),
      to_email:   EMAIL_CFG.recipient
    };

    if (!payload.from_name || !payload.from_email || !payload.subject || !payload.message) {
      toast('Please fill in all fields.', 'error'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.from_email)) {
      toast('Please enter a valid email address.', 'error'); return;
    }

    btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled   = true;

    try {
      if (EMAIL_CFG.publicKey !== 'YOUR_PUBLIC_KEY' && typeof emailjs !== 'undefined') {
        await emailjs.send(EMAIL_CFG.serviceId, EMAIL_CFG.templateId, payload);
        toast('Message sent! I\'ll get back to you soon.', 'success');
        form.reset();
      } else {
        fallbackMailto(payload);
      }
    } catch {
      fallbackMailto(payload);
    } finally {
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 1500);
    }
  });
}

function fallbackMailto(p) {
  const uri = `mailto:${EMAIL_CFG.recipient}`
    + `?subject=${encodeURIComponent(p.subject)}`
    + `&body=${encodeURIComponent(`From: ${p.from_name} (${p.from_email})\n\n${p.message}`)}`;
  window.open(uri);
  toast('Opening your email client…', 'info');
}

/* ══ TOAST ══════════════════════════════════════
   Lightweight notification system              */
function toast(msg, type = 'info') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `
    <span>${msg}</span>
    <button class="toast-x" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>`;
  document.body.appendChild(el);
  setTimeout(() => { if (el.parentElement) el.remove(); }, 5000);
}
