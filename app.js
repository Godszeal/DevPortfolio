document.addEventListener('DOMContentLoaded', async () => {

  // ███████╗ ██████╗ ██████╗  ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗
  // ██╔════╝██╔═══██╗██╔══██╗ ╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
  // ███████╗██║   ██║██████╔╝    ██║   █████╗  ██║   ██║██║     ██║██║   ██║
  // ╚════██║██║   ██║██╔═══╝     ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
  // ███████║╚██████╔╝██║         ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
  // ╚══════╝ ╚═════╝ ╚═╝         ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝
  //
  //  ✏️  EDIT THIS OBJECT TO CUSTOMISE EVERY PART OF YOUR PORTFOLIO
  // ====================================================================

  // Portfolio content is loaded from the external JSON endpoint below.
  let portfolio;
  const configUrl = document.currentScript?.dataset.config || 'https://raw.githubusercontent.com/Godszeal/DevPortfolio/main/data.json';
  try {
    const response = await fetch(configUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Config request failed (${response.status})`);
    portfolio = await response.json();
  } catch (error) {
    console.error('Unable to load portfolio configuration:', error);
    document.body.innerHTML = '<main style="font-family:system-ui;padding:2rem;max-width:48rem;margin:auto"><h1>Portfolio configuration could not be loaded</h1><p>Check the configured JSON URL and make sure it is publicly accessible.</p></main>';
    return;
  }


  // =====================================================================
  //  UI COPY — every visible label is configurable in data.json
  // =====================================================================
  const ui = portfolio.ui || {};
  const textMap = {
    'about-title': ui.aboutTitle,
    'skills-title': ui.skillsTitle,
    'projects-title': ui.projectsTitle,
    'experience-title': ui.experienceTitle,
    'education-title': ui.educationTitle,
    'certifications-title': ui.certificationsTitle,
    'opensource-title': ui.openSourceTitle,
    'blog-title': ui.blogTitle,
    'testimonials-title': ui.testimonialsTitle,
    'contact-title': ui.contactTitle,
    'contact-info-title': ui.contactInfoTitle,
    'contact-follow-label': ui.contactFollowLabel,
    'contact-submit-label': ui.contactSubmitLabel,
    'contact-success-message': ui.contactSuccessMessage,
    'oss-counter-label': ui.openSourceCounterLabel,
    'oss-profile-label': ui.openSourceProfileLabel,
    'blog-all-label': ui.blogAllLabel,
    'cv-label': ui.cvLabel,
    'scroll-label': ui.scrollLabel,
    'experience-scroll-label': ui.experienceScrollLabel,
    'other-tech-label': ui.otherTechLabel,
    'about-label': ui.aboutLabel, 'skills-label': ui.skillsLabel, 'projects-label': ui.projectsLabel,
    'experience-label': ui.experienceLabel, 'education-label': ui.educationLabel, 'certifications-label': ui.certificationsLabel,
    'opensource-label': ui.openSourceLabel, 'blog-label': ui.blogLabel, 'testimonials-label': ui.testimonialsLabel, 'contact-label': ui.contactLabel,
    'cf-name-label': ui.formNameLabel, 'cf-email-label': ui.formEmailLabel, 'cf-subject-label': ui.formSubjectLabel, 'cf-message-label': ui.formMessageLabel,
    'footer-built-with': ui.footerBuiltWith
  };
  Object.entries(textMap).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element && value != null) element.textContent = value;
  });
  const formFields = {
    'cf-name': ui.formNamePlaceholder, 'cf-email': ui.formEmailPlaceholder,
    'cf-subject': ui.formSubjectPlaceholder, 'cf-message': ui.formMessagePlaceholder
  };
  Object.entries(formFields).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element && value != null) element.placeholder = value;
  });
  document.querySelectorAll('[data-config-text]').forEach(element => {
    const key = element.dataset.configText;
    if (ui[key] != null) element.textContent = ui[key];
  });

  // =====================================================================
  //  SEO — inject meta tags dynamically from portfolio.seo
  // =====================================================================
  const seo = portfolio.seo;
  document.getElementById('meta-title').textContent       = seo.siteTitle;
  document.getElementById('meta-desc').content            = seo.siteDescription;
  document.getElementById('meta-keywords').content        = seo.keywords;
  document.getElementById('meta-author').content          = seo.author;
  document.getElementById('meta-canonical').href          = seo.canonicalUrl;
  document.getElementById('og-site').content              = seo.siteTitle;
  document.getElementById('og-title').content             = seo.siteTitle;
  document.getElementById('og-desc').content              = seo.siteDescription;
  document.getElementById('og-url').content               = seo.canonicalUrl;
  document.getElementById('og-img').content               = seo.ogImage;
  document.getElementById('tw-title').content             = seo.siteTitle;
  document.getElementById('tw-desc').content              = seo.siteDescription;
  document.getElementById('tw-img').content               = seo.ogImage;
  document.getElementById('tw-url').content               = seo.canonicalUrl;
  document.getElementById('tw-creator').content           = seo.twitterHandle;
  document.getElementById('favicon').href                 = seo.favicon;

  // Theme color
  const tcMeta = document.createElement('meta');
  tcMeta.name = 'theme-color'; tcMeta.content = seo.themeColor;
  document.head.appendChild(tcMeta);

  // JSON-LD structured data
  if (seo.jsonLd && Object.keys(seo.jsonLd).length) {
    const jld = document.createElement('script');
    jld.type = 'application/ld+json';
    jld.textContent = JSON.stringify(seo.jsonLd);
    document.head.appendChild(jld);
  }

  // =====================================================================
  //  THEME
  // =====================================================================
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDark);

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark);
    document.getElementById('theme-icon').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  applyTheme();
  document.getElementById('theme-toggle').addEventListener('click', () => { isDark = !isDark; applyTheme(); });

  // =====================================================================
  //  SPLASH
  // =====================================================================
  const splashEl  = document.getElementById('splash');
  const splashTxts = (portfolio.ui?.splashMessages || ['Loading...', 'Building UI...', 'Almost there...', `Welcome, ${portfolio.personal.name}!`]).map(message => message.replace('{name}', portfolio.personal.name));
  let si = 0;
  const ste = document.getElementById('splash-text');
  const splashInt = setInterval(() => {
    si++;
    if (si < splashTxts.length) {
      ste.style.opacity = '0';
      setTimeout(() => { ste.textContent = splashTxts[si]; ste.style.opacity = '1'; ste.style.transition = 'opacity 0.4s'; }, 200);
    }
  }, 600);
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    clearInterval(splashInt);
    splashEl.classList.add('hidden-splash');
    document.body.style.overflow = '';
    initReveal();
    animateOSSCounter();
  }, 2800);

  // =====================================================================
  //  SCROLL PROGRESS
  // =====================================================================
  const progBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progBar.style.width = pct + '%';
    document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
    updateActiveNav();
  });

  // =====================================================================
  //  NAVBAR
  // =====================================================================
  const p = portfolio;

  // Logo
  const navLogoImg  = document.getElementById('nav-logo-img');
  const navLogoText = document.getElementById('nav-logo-text');
  navLogoText.innerHTML = p.logo.text;
  if (p.logo.image) {
    navLogoImg.src = p.logo.image;
    navLogoImg.alt = p.logo.alt;
    navLogoImg.classList.remove('hidden');
  }

  const navLinksEl   = document.getElementById('nav-links');
  const mobLinksEl   = document.getElementById('mobile-nav-links');
  const indicatorsEl = document.getElementById('section-indicators');

  p.nav.links.forEach(link => {
    const a = document.createElement('a'); a.href = link.href; a.className = 'nav-link'; a.textContent = link.label;
    a.addEventListener('click', closeMobileMenu); navLinksEl.appendChild(a);

    const ma = document.createElement('a'); ma.href = link.href; ma.className = 'text-base font-semibold py-2 nav-link'; ma.textContent = link.label; ma.style.color = 'var(--neu-text)';
    ma.addEventListener('click', closeMobileMenu); mobLinksEl.appendChild(ma);

    const dot = document.createElement('div'); dot.className = 'indicator-dot'; dot.dataset.target = link.href.replace('#',''); dot.title = link.label;
    dot.addEventListener('click', () => document.querySelector(link.href)?.scrollIntoView({behavior:'smooth'}));
    indicatorsEl.appendChild(dot);
  });

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

  function updateActiveNav() {
    const sections = p.nav.links.map(l => l.href.replace('#',''));
    let current = '';
    sections.forEach(id => { const el = document.getElementById(id); if (el && window.scrollY >= el.offsetTop - 140) current = id; });
    document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    document.querySelectorAll('.indicator-dot').forEach(d => d.classList.toggle('active', d.dataset.target === current));
  }

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    hamburgerIcon.className = menuOpen ? 'fas fa-times' : 'fas fa-bars';
  });
  function closeMobileMenu() { menuOpen = false; mobileMenu.classList.remove('open'); hamburgerIcon.className = 'fas fa-bars'; }

  document.getElementById('back-to-top').addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });

  // =====================================================================
  //  HERO
  // =====================================================================
  document.getElementById('hero-label').querySelector('span').textContent = p.personal.availability;
  document.getElementById('hero-greeting').innerHTML = `${p.hero.greeting} <span class="accent-text">${p.personal.name}</span>`;
  document.getElementById('hero-bio').textContent = p.hero.bio;
  document.getElementById('hero-avatar').src = p.personal.avatar;
  document.getElementById('hero-avatar').alt = `${p.personal.name} — ${p.personal.role}`;
  document.getElementById('badge-exp').textContent = p.badges.experience;
  document.getElementById('badge-projects').textContent = p.badges.projects;

  const ctasEl = document.getElementById('hero-ctas');
  const pa = document.createElement('a'); pa.href = p.hero.primaryCTA.href; pa.className = 'neu-btn-accent px-8 py-4 font-bold text-base'; pa.textContent = p.hero.primaryCTA.label; ctasEl.appendChild(pa);
  const sa = document.createElement('a'); sa.href = p.hero.secondaryCTA.href; sa.className = 'neu-btn px-8 py-4 font-bold text-base'; sa.style.color = 'var(--neu-text)'; sa.textContent = p.hero.secondaryCTA.label; ctasEl.appendChild(sa);

  function buildSocials(container) {
    p.socials.forEach(s => {
      const a = document.createElement('a'); a.href = s.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', s.label);
      a.className = 'neu-btn w-10 h-10 flex items-center justify-center text-sm'; a.style.color = 'var(--neu-sub)';
      a.innerHTML = `<i class="${s.icon}"></i>`; container.appendChild(a);
    });
  }
  buildSocials(document.getElementById('hero-socials'));

  const statsEl = document.getElementById('hero-stats');
  p.stats.forEach(st => {
    const c = document.createElement('div'); c.className = 'neu p-6 text-center';
    c.innerHTML = `<div class="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg,var(--accent),#8b5cf6);"><i class="fas ${st.icon} text-white text-sm"></i></div><div class="text-2xl font-black accent-text">${st.value}</div><div class="text-xs mt-1 font-medium" style="color:var(--neu-sub);">${st.label}</div>`;
    statsEl.appendChild(c);
  });

  // Typing
  const typingEl = document.getElementById('typing-text');
  const roles = p.hero.typingRoles;
  let ri = 0, ci = 0, del = false;
  function typeWriter() {
    const cur = roles[ri];
    if (!del) { typingEl.textContent = cur.substring(0, ci + 1); ci++; if (ci === cur.length) { del = true; setTimeout(typeWriter, 1800); return; } }
    else { typingEl.textContent = cur.substring(0, ci - 1); ci--; if (ci === 0) { del = false; ri = (ri + 1) % roles.length; } }
    setTimeout(typeWriter, del ? 60 : 80);
  }
  setTimeout(typeWriter, 3000);

  // =====================================================================
  //  ABOUT
  // =====================================================================
  document.getElementById('about-title').textContent = p.about.title;
  document.getElementById('about-name').textContent  = p.personal.name;
  document.getElementById('about-role').textContent  = p.personal.role;
  document.getElementById('about-bio').textContent   = p.about.bio1;
  document.getElementById('about-bio2').textContent  = p.about.bio2;
  document.getElementById('about-cv-btn').href       = p.personal.cvUrl;

  const detailsEl = document.getElementById('about-details');
  p.about.details.forEach(d => {
    const div = document.createElement('div'); div.className = 'flex items-center gap-3';
    div.innerHTML = `<div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:rgba(99,102,241,0.15);"><i class="fas ${d.icon} text-xs" style="color:var(--accent);"></i></div><div><div class="text-xs" style="color:var(--neu-sub);">${d.label}</div><div class="text-sm font-semibold">${d.value}</div></div>`;
    detailsEl.appendChild(div);
  });

  const highlightsEl = document.getElementById('about-highlights');
  p.about.highlights.forEach(h => {
    const card = document.createElement('div'); card.className = 'neu p-6 reveal';
    card.innerHTML = `<div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style="background:linear-gradient(135deg,${h.color}33,${h.color}22);"><i class="fas ${h.icon} text-xl" style="color:${h.color};"></i></div><h3 class="font-bold mb-2">${h.title}</h3><p class="text-sm leading-relaxed" style="color:var(--neu-sub);">${h.desc}</p>`;
    highlightsEl.appendChild(card);
  });

  // =====================================================================
  //  SKILLS
  // =====================================================================
  document.getElementById('skills-subtitle').textContent = p.skills.subtitle;

  const skillTabsEl = document.getElementById('skill-tabs');
  const skillsGridEl = document.getElementById('skills-grid');
  let activeSkillTab = p.skills.categories[0].name;

  function renderSkills(category) {
    skillsGridEl.innerHTML = '';
    const cat = p.skills.categories.find(c => c.name === category) || p.skills.categories[0];
    cat.items.forEach((skill, i) => {
      const card = document.createElement('div'); card.className = 'neu p-6 reveal'; card.style.transitionDelay = `${i * 0.08}s`;
      card.innerHTML = `<div class="flex items-center justify-between mb-3"><span class="font-semibold text-sm">${skill.name}</span><span class="font-mono text-xs font-bold" style="color:var(--accent);">${skill.level}%</span></div><div class="skill-bar-track"><div class="skill-bar-fill" data-level="${skill.level}"></div></div>`;
      skillsGridEl.appendChild(card);
    });
    setTimeout(() => { skillsGridEl.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.dataset.level + '%'; bar.closest('.reveal')?.classList.add('revealed'); }); }, 150);
  }

  p.skills.categories.forEach(cat => {
    const btn = document.createElement('button'); btn.className = 'neu-btn flex items-center gap-2 px-5 py-2.5 text-sm font-semibold skill-tab-btn'; btn.style.color = 'var(--neu-sub)'; btn.dataset.cat = cat.name;
    btn.innerHTML = `<i class="fas ${cat.icon} text-xs"></i> ${cat.name}`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.skill-tab-btn').forEach(b => { b.style.color = 'var(--neu-sub)'; b.style.boxShadow = ''; });
      btn.style.color = 'var(--accent)'; btn.style.boxShadow = `5px 5px 12px var(--neu-dark), -5px -5px 12px var(--neu-light), 0 0 20px var(--accent-glow)`;
      renderSkills(cat.name);
    });
    skillTabsEl.appendChild(btn);
  });
  const firstTab = skillTabsEl.querySelector('.skill-tab-btn');
  if (firstTab) { firstTab.style.color = 'var(--accent)'; firstTab.style.boxShadow = `5px 5px 12px var(--neu-dark), -5px -5px 12px var(--neu-light), 0 0 20px var(--accent-glow)`; }
  renderSkills(activeSkillTab);

  const otherTechEl = document.getElementById('other-tech');
  p.skills.otherTech.forEach(tech => {
    const tag = document.createElement('span'); tag.className = 'tech-tag'; tag.textContent = tech; otherTechEl.appendChild(tag);
  });

  // =====================================================================
  //  PROJECTS  (with lightbox)
  // =====================================================================
  document.getElementById('projects-subtitle').textContent = p.projects.subtitle;

  const cats = ['All', ...new Set(p.projects.items.map(pr => pr.category))];
  const projectFiltersEl = document.getElementById('project-filters');
  const projectsGridEl   = document.getElementById('projects-grid');
  let activeFilter = 'All';
  let currentProjectIdx = null;

  function renderProjects(filter) {
    projectsGridEl.innerHTML = '';
    const items = filter === 'All' ? p.projects.items : p.projects.items.filter(pr => pr.category === filter);
    items.forEach((project, i) => {
      const card = document.createElement('div');
      card.className = 'project-card neu reveal cursor-pointer'; card.style.transitionDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div class="relative overflow-hidden" style="border-radius:20px 20px 0 0;height:220px;">
          <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-700 hover:scale-110" loading="lazy" />
          <div class="absolute inset-0 flex items-center justify-center" style="background:linear-gradient(135deg,rgba(99,102,241,0.85),rgba(139,92,246,0.85));opacity:0;transition:opacity 0.3s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'">
            <span class="text-white font-bold flex items-center gap-2"><i class="fas fa-expand-alt"></i> View Details</span>
          </div>
          ${project.featured ? `<div class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white" style="background:linear-gradient(135deg,var(--accent),#8b5cf6);">Featured</div>` : ''}
        </div>
        <div class="p-6">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-bold text-lg">${project.title}</h3>
            <span class="tech-tag ml-2 flex-shrink-0">${project.category}</span>
          </div>
          <p class="text-sm leading-relaxed mb-4" style="color:var(--neu-sub);">${project.description}</p>
          <div class="flex flex-wrap gap-2 mb-5">${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
          <div class="flex gap-3">
            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="flex items-center gap-1.5 text-xs font-semibold hover:opacity-70" style="color:var(--accent);"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
            ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="flex items-center gap-1.5 text-xs font-semibold hover:opacity-70" style="color:var(--neu-sub);"><i class="fab fa-github"></i> Source</a>` : ''}
          </div>
        </div>
      `;
      // Find the original index in the full array
      const origIdx = p.projects.items.indexOf(project);
      card.addEventListener('click', () => openLightbox(origIdx));
      projectsGridEl.appendChild(card);
    });
    setTimeout(() => { projectsGridEl.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed')); }, 100);
  }

  cats.forEach(cat => {
    const btn = document.createElement('button'); btn.className = 'neu-btn px-5 py-2.5 text-sm font-semibold project-filter-btn'; btn.style.color = cat === 'All' ? 'var(--accent)' : 'var(--neu-sub)';
    if (cat === 'All') btn.style.boxShadow = `5px 5px 12px var(--neu-dark), -5px -5px 12px var(--neu-light), 0 0 20px var(--accent-glow)`;
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      activeFilter = cat;
      document.querySelectorAll('.project-filter-btn').forEach(b => { b.style.color = 'var(--neu-sub)'; b.style.boxShadow = ''; });
      btn.style.color = 'var(--accent)'; btn.style.boxShadow = `5px 5px 12px var(--neu-dark), -5px -5px 12px var(--neu-light), 0 0 20px var(--accent-glow)`;
      renderProjects(cat);
    });
    projectFiltersEl.appendChild(btn);
  });
  renderProjects('All');

  // ── LIGHTBOX ──────────────────────────────────────────────────────────
  const lightbox      = document.getElementById('lightbox');
  const lightboxInner = document.getElementById('lightbox-inner');
  let lbCarouselIdx   = 0;

  function openLightbox(idx) {
    const pr = p.projects.items[idx];
    currentProjectIdx = idx;
    lbCarouselIdx = 0;
    const shots = pr.screenshots && pr.screenshots.length ? pr.screenshots : [pr.image];

    lightboxInner.innerHTML = `
      <!-- Close -->
      <button id="lb-close" class="absolute top-4 right-4 z-10 neu-btn w-10 h-10 flex items-center justify-center text-lg" style="color:var(--neu-text);" aria-label="Close"><i class="fas fa-times"></i></button>
      <!-- Carousel -->
      <div class="relative" style="height:380px;background:#000;overflow:hidden;">
        <img id="lb-main-img" src="${shots[0]}" alt="${pr.title} screenshot 1" class="carousel-img" />
        ${shots.length > 1 ? `
        <button id="lb-prev-img" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white" style="background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
        <button id="lb-next-img" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white" style="background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          ${shots.map((_,i) => `<div class="lb-dot w-2 h-2 rounded-full transition-all ${i===0?'bg-white scale-125':'bg-white opacity-40'}" data-i="${i}" style="cursor:pointer;"></div>`).join('')}
        </div>` : ''}
      </div>
      <!-- Thumbnails -->
      ${shots.length > 1 ? `<div class="flex gap-2 px-6 pt-4 overflow-x-auto">${shots.map((s,i) => `<img src="${s}" alt="Screenshot ${i+1}" class="carousel-thumb ${i===0?'active':''}" data-thumb="${i}" loading="lazy" />`).join('')}</div>` : ''}
      <!-- Content -->
      <div class="p-6 md:p-8">
        <div class="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 class="text-2xl font-black">${pr.title}</h2>
            <span class="tech-tag mt-1">${pr.category}</span>
          </div>
          <div class="flex gap-3">
            ${pr.liveUrl ? `<a href="${pr.liveUrl}" target="_blank" rel="noopener" class="neu-btn-accent px-5 py-2.5 flex items-center gap-2 text-sm font-bold"><i class="fas fa-external-link-alt"></i> Live</a>` : ''}
            ${pr.repoUrl ? `<a href="${pr.repoUrl}" target="_blank" rel="noopener" class="neu-btn px-5 py-2.5 flex items-center gap-2 text-sm font-bold" style="color:var(--neu-text);"><i class="fab fa-github"></i> Code</a>` : ''}
          </div>
        </div>
        <p class="leading-relaxed mb-6" style="color:var(--neu-sub);">${pr.fullDescription || pr.description}</p>
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          ${pr.challenges && pr.challenges.length ? `<div><h4 class="font-bold mb-3 flex items-center gap-2"><span style="color:#f59e0b;"><i class="fas fa-exclamation-triangle"></i></span> Challenges</h4><ul class="space-y-2">${pr.challenges.map(c=>`<li class="flex items-start gap-2 text-sm"><span style="color:#f59e0b;margin-top:3px;">▹</span><span style="color:var(--neu-sub);">${c}</span></li>`).join('')}</ul></div>` : ''}
          ${pr.outcomes && pr.outcomes.length ? `<div><h4 class="font-bold mb-3 flex items-center gap-2"><span style="color:#10b981;"><i class="fas fa-check-circle"></i></span> Outcomes</h4><ul class="space-y-2">${pr.outcomes.map(o=>`<li class="flex items-start gap-2 text-sm"><span style="color:#10b981;margin-top:3px;">▹</span><span style="color:var(--neu-sub);">${o}</span></li>`).join('')}</ul></div>` : ''}
        </div>
        <div class="flex flex-wrap gap-2">${pr.tech.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div>
      </div>
    `;

    // Carousel logic
    function setCarouselImg(i) {
      lbCarouselIdx = i;
      const img = lightboxInner.querySelector('#lb-main-img');
      if (img) { img.style.opacity = '0'; setTimeout(() => { img.src = shots[i]; img.alt = `${pr.title} screenshot ${i+1}`; img.style.opacity = '1'; }, 200); }
      lightboxInner.querySelectorAll('.lb-dot').forEach((d,j) => { d.className = `lb-dot w-2 h-2 rounded-full transition-all ${j===i?'bg-white scale-125':'bg-white opacity-40'}`; d.style.cursor='pointer'; });
      lightboxInner.querySelectorAll('.carousel-thumb').forEach((t,j) => t.classList.toggle('active', j===i));
    }

    const prevBtn = lightboxInner.querySelector('#lb-prev-img');
    const nextBtn = lightboxInner.querySelector('#lb-next-img');
    if (prevBtn) prevBtn.addEventListener('click', () => setCarouselImg((lbCarouselIdx - 1 + shots.length) % shots.length));
    if (nextBtn) nextBtn.addEventListener('click', () => setCarouselImg((lbCarouselIdx + 1) % shots.length));

    lightboxInner.querySelectorAll('.lb-dot').forEach(d => d.addEventListener('click', () => setCarouselImg(+d.dataset.i)));
    lightboxInner.querySelectorAll('.carousel-thumb').forEach(t => t.addEventListener('click', () => setCarouselImg(+t.dataset.thumb)));
    lightboxInner.querySelector('#lb-close').addEventListener('click', closeLightbox);

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // =====================================================================
  //  EXPERIENCE — Horizontal timeline (desktop) + Vertical stepper (mobile)
  // =====================================================================
  const tlTrack  = document.getElementById('timeline-track');
  const tlMobile = document.getElementById('timeline-mobile');
  const tlScroll = document.getElementById('timeline-scroll');

  const expIcons = ['fa-briefcase','fa-rocket','fa-laptop-code','fa-graduation-cap','fa-star','fa-code'];

  p.experience.forEach((exp, i) => {
    // DESKTOP item
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <div class="timeline-milestone" title="${exp.company}" data-idx="${i}">
        <i class="fas ${exp.icon || expIcons[i % expIcons.length]}"></i>
      </div>
      <div class="timeline-card neu p-5 w-full mt-4">
        <div class="flex items-center gap-3 mb-3">
          <img src="${exp.logo}" alt="${exp.company}" class="w-10 h-10 rounded-lg flex-shrink-0" loading="lazy" />
          <div>
            <h3 class="font-bold text-sm leading-tight">${exp.role}</h3>
            <p class="text-xs font-semibold mt-0.5" style="color:var(--accent);">${exp.company}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 mb-3 text-xs" style="color:var(--neu-sub);">
          <span><i class="fas fa-calendar mr-1"></i>${exp.period}</span>
          <span><i class="fas fa-map-marker-alt mr-1"></i>${exp.location}</span>
          <span class="tech-tag">${exp.type}</span>
        </div>
        <p class="text-xs leading-relaxed mb-3" style="color:var(--neu-sub);">${exp.description}</p>
        <ul class="space-y-1.5 mb-3">${exp.achievements.map(a=>`<li class="flex items-start gap-1.5 text-xs"><span style="color:var(--accent);margin-top:1px;">▹</span><span style="color:var(--neu-sub);">${a}</span></li>`).join('')}</ul>
        <div class="flex flex-wrap gap-1.5">${exp.tech.map(t=>`<span class="tech-tag" style="font-size:0.65rem;padding:2px 8px;">${t}</span>`).join('')}</div>
      </div>
    `;
    tlTrack.appendChild(item);

    // MOBILE stepper
    const si = document.createElement('div');
    si.className = 'stepper-item reveal';
    si.innerHTML = `
      <div class="stepper-dot flex-shrink-0 self-start"><i class="fas ${exp.icon || expIcons[i % expIcons.length]}"></i></div>
      <div class="flex-1 neu p-5">
        <div class="flex items-center gap-3 mb-3">
          <img src="${exp.logo}" alt="${exp.company}" class="w-10 h-10 rounded-lg flex-shrink-0" loading="lazy" />
          <div>
            <h3 class="font-bold leading-tight">${exp.role}</h3>
            <p class="text-sm font-semibold mt-0.5" style="color:var(--accent);">${exp.company}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 mb-3 text-xs" style="color:var(--neu-sub);">
          <span><i class="fas fa-calendar mr-1"></i>${exp.period}</span>
          <span><i class="fas fa-map-marker-alt mr-1"></i>${exp.location}</span>
        </div>
        <p class="text-sm leading-relaxed mb-3" style="color:var(--neu-sub);">${exp.description}</p>
        <ul class="space-y-2 mb-3">${exp.achievements.map(a=>`<li class="flex items-start gap-2 text-sm"><span style="color:var(--accent);margin-top:2px;">▹</span><span style="color:var(--neu-sub);">${a}</span></li>`).join('')}</ul>
        <div class="flex flex-wrap gap-2">${exp.tech.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div>
      </div>
    `;
    tlMobile.appendChild(si);
  });

  // Scroll arrows + connector fill
  const tlPrev = document.getElementById('tl-prev');
  const tlNext = document.getElementById('tl-next');
  const SCROLL_STEP = 340;
  tlPrev.addEventListener('click', () => tlScroll.scrollBy({left:-SCROLL_STEP,behavior:'smooth'}));
  tlNext.addEventListener('click', () => tlScroll.scrollBy({left:SCROLL_STEP,behavior:'smooth'}));

  tlScroll.addEventListener('scroll', () => {
    const fill = document.getElementById('timeline-fill');
    if (fill) { const pct = tlScroll.scrollLeft / (tlScroll.scrollWidth - tlScroll.clientWidth); fill.style.width = (pct * 100) + '%'; }
  });

  // Drag-to-scroll for desktop timeline
  let tlDragging = false, tlStartX, tlScrollLeft2;
  tlScroll.addEventListener('mousedown', e => { tlDragging=true; tlStartX=e.pageX-tlScroll.offsetLeft; tlScrollLeft2=tlScroll.scrollLeft; });
  document.addEventListener('mouseup', () => tlDragging = false);
  document.addEventListener('mousemove', e => { if (!tlDragging) return; e.preventDefault(); const x=e.pageX-tlScroll.offsetLeft; const walk=(x-tlStartX)*1.5; tlScroll.scrollLeft=tlScrollLeft2-walk; });

  // Animate connector fill on reveal
  setTimeout(() => {
    const fill = document.getElementById('timeline-fill');
    if (fill) fill.style.width = '100%';
  }, 500);

  // =====================================================================
  //  EDUCATION
  // =====================================================================
  const eduEl = document.getElementById('education-grid');
  p.education.forEach(edu => {
    const card = document.createElement('div'); card.className = 'neu p-8 reveal';
    card.innerHTML = `<div class="flex items-start gap-4 mb-5"><img src="${edu.logo}" alt="${edu.institution}" class="w-14 h-14 rounded-xl object-cover flex-shrink-0" loading="lazy" /><div><h3 class="font-bold text-lg leading-tight">${edu.degree}</h3><p class="font-semibold text-sm mt-1" style="color:var(--accent);">${edu.institution}</p><div class="flex items-center gap-3 mt-1 text-xs" style="color:var(--neu-sub);"><span><i class="fas fa-calendar mr-1"></i>${edu.period}</span>${edu.gpa?`<span><i class="fas fa-star mr-1"></i>GPA: ${edu.gpa}</span>`:''}</div></div></div><p class="text-sm leading-relaxed mb-4" style="color:var(--neu-sub);">${edu.description}</p><ul class="space-y-2">${edu.achievements.map(a=>`<li class="flex items-center gap-2 text-sm"><span style="color:var(--accent);">✦</span><span style="color:var(--neu-sub);">${a}</span></li>`).join('')}</ul>`;
    eduEl.appendChild(card);
  });

  // =====================================================================
  //  CERTIFICATIONS
  // =====================================================================
  document.getElementById('certs-subtitle').textContent = p.certifications.subtitle;
  const certsGrid = document.getElementById('certs-grid');
  p.certifications.items.forEach((cert, i) => {
    const card = document.createElement('div');
    card.className = 'cert-card cert-border p-6 reveal';
    card.style.transitionDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <div class="flex items-start gap-4 mb-4">
        <img src="${cert.issuerLogo}" alt="${cert.issuer}" class="w-12 h-12 rounded-xl flex-shrink-0 object-cover" loading="lazy" />
        <div class="flex-1">
          <h3 class="font-bold text-sm leading-tight">${cert.name}</h3>
          <p class="text-xs mt-1 font-semibold" style="color:${cert.badgeColor};">${cert.issuer}</p>
        </div>
      </div>
      <div class="flex items-center justify-between flex-wrap gap-2">
        <span class="flex items-center gap-1 text-xs" style="color:var(--neu-sub);"><i class="fas fa-calendar-alt" style="color:var(--accent);"></i> ${cert.date}</span>
        ${cert.credentialId ? `<span class="font-mono text-xs" style="color:var(--neu-sub);">ID: ${cert.credentialId}</span>` : ''}
      </div>
      ${cert.verifyUrl ? `<a href="${cert.verifyUrl}" target="_blank" rel="noopener" class="mt-4 inline-flex items-center gap-1.5 text-xs font-bold hover:opacity-70 transition-opacity" style="color:${cert.badgeColor};"><i class="fas fa-external-link-alt"></i> Verify Credential</a>` : ''}
    `;
    certsGrid.appendChild(card);
  });

  // =====================================================================
  //  OPEN SOURCE
  // =====================================================================
  document.getElementById('oss-subtitle').textContent = p.openSource.subtitle;
  document.getElementById('oss-profile-btn').href = p.openSource.githubProfileUrl;

  const ossGrid = document.getElementById('oss-grid');
  p.openSource.repos.forEach((repo, i) => {
    const card = document.createElement('a');
    card.href = repo.url; card.target = '_blank'; card.rel = 'noopener noreferrer';
    card.className = 'neu p-6 reveal block group'; card.style.transitionDelay = `${i * 0.08}s`;
    const langColor = getLangColor(repo.language);
    card.innerHTML = `
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <i class="fab fa-github" style="color:var(--accent);font-size:1.2rem;"></i>
          <h3 class="font-bold text-sm group-hover:text-accent-500 transition-colors" style="color:var(--accent);">${repo.name}</h3>
        </div>
      </div>
      <p class="text-sm leading-relaxed mb-4" style="color:var(--neu-sub);">${repo.description}</p>
      <div class="flex items-center gap-4 text-xs" style="color:var(--neu-sub);">
        <span class="flex items-center gap-1.5">
          <span class="lang-dot" data-lang="${repo.language}" style="background:${langColor};width:12px;height:12px;border-radius:50%;display:inline-block;"></span>
          ${repo.language}
        </span>
        <span class="flex items-center gap-1"><i class="fas fa-star" style="color:#f59e0b;"></i> ${formatNum(repo.stars)}</span>
        <span class="flex items-center gap-1"><i class="fas fa-code-fork" style="color:var(--accent);"></i> ${formatNum(repo.forks)}</span>
      </div>
    `;
    ossGrid.appendChild(card);
  });

  function getLangColor(lang) {
    const map = { JavaScript:'#f7df1e', TypeScript:'#3178c6', Python:'#3572A5', Rust:'#dea584', Go:'#00ADD8', CSS:'#563d7c', HTML:'#e34c26', Vue:'#41b883', React:'#61dafb', PHP:'#777bb4', Ruby:'#701516', Java:'#b07219' };
    return map[lang] || '#8b8b8b';
  }
  function formatNum(n) { return n >= 1000 ? (n/1000).toFixed(1)+'k' : n; }

  // Animated counter
  function animateOSSCounter() {
    const el = document.getElementById('oss-counter');
    const target = p.openSource.totalContributions;
    let current = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString();
      if (current >= target) clearInterval(interval);
    }, 20);
  }

  // =====================================================================
  //  BLOG
  // =====================================================================
  document.getElementById('blog-subtitle').textContent = p.blog.subtitle;
  document.getElementById('blog-all-btn').href = p.blog.allPostsUrl;

  const blogGrid = document.getElementById('blog-grid');
  p.blog.posts.forEach((post, i) => {
    const card = document.createElement('article');
    card.className = 'blog-card neu overflow-hidden reveal'; card.style.transitionDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <div class="relative overflow-hidden" style="height:200px;">
        <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-500" loading="lazy" style="transition:transform 0.5s ease;" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'" />
        <div class="absolute top-3 left-3">
          <span class="px-3 py-1 rounded-full text-white text-xs font-bold" style="background:${post.tagColor};">${post.tag}</span>
        </div>
      </div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-3 text-xs" style="color:var(--neu-sub);">
          <span><i class="fas fa-calendar mr-1" style="color:var(--accent);"></i>${post.date}</span>
          <span><i class="fas fa-clock mr-1" style="color:var(--accent);"></i>${post.readTime}</span>
        </div>
        <h3 class="font-bold text-lg leading-snug mb-3">${post.title}</h3>
        <p class="text-sm leading-relaxed mb-5" style="color:var(--neu-sub);">${post.excerpt}</p>
        <a href="${post.readMoreUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70" style="color:var(--accent);">
          Read Article <i class="fas fa-arrow-right text-xs"></i>
        </a>
      </div>
    `;
    blogGrid.appendChild(card);
  });

  // =====================================================================
  //  TESTIMONIALS
  // =====================================================================
  const testimonialsEl = document.getElementById('testimonials-grid');
  p.testimonials.forEach((t, i) => {
    const card = document.createElement('div'); card.className = 'neu p-8 reveal'; card.style.transitionDelay = `${i * 0.1}s`;
    const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
    card.innerHTML = `<div class="text-2xl mb-4" style="color:var(--accent);">❝</div><p class="text-sm leading-relaxed mb-6 italic" style="color:var(--neu-sub);">"${t.quote}"</p><div class="flex items-center gap-3"><img src="${t.avatar}" alt="${t.name}" class="w-12 h-12 rounded-full object-cover" loading="lazy" /><div><p class="font-bold text-sm">${t.name}</p><p class="text-xs" style="color:var(--neu-sub);">${t.role}</p><p class="text-yellow-400 text-sm mt-0.5">${stars}</p></div></div>`;
    testimonialsEl.appendChild(card);
  });

  // =====================================================================
  //  CONTACT
  // =====================================================================
  document.getElementById('contact-subtitle').textContent = p.contact.subtitle;

  const contactInfoEl = document.getElementById('contact-info');
  p.contact.contactInfo.forEach(info => {
    const item = document.createElement('a'); item.href = info.href; item.className = 'flex items-center gap-4 group';
    item.innerHTML = `<div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110" style="background:linear-gradient(135deg,var(--accent),#8b5cf6);"><i class="fas ${info.icon} text-white"></i></div><div><p class="text-xs" style="color:var(--neu-sub);">${info.label}</p><p class="font-semibold text-sm">${info.value}</p></div>`;
    contactInfoEl.appendChild(item);
  });

  buildSocials(document.getElementById('contact-socials'));

  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('cf-submit');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      document.getElementById('cf-success').classList.remove('hidden');
      this.reset();
      setTimeout(() => { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; btn.disabled = false; document.getElementById('cf-success').classList.add('hidden'); }, 4000);
    }, 1500);
  });

  // =====================================================================
  //  FOOTER
  // =====================================================================
  document.getElementById('footer-name').textContent    = p.personal.name;
  document.getElementById('footer-tagline').textContent = p.personal.tagline;
  document.getElementById('footer-copy').textContent    = `© ${new Date().getFullYear()} ${p.personal.name}. All rights reserved.`;
  buildSocials(document.getElementById('footer-socials'));

  // =====================================================================
  //  REVEAL ON SCROLL
  // =====================================================================
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          const bar = entry.target.querySelector('.skill-bar-fill');
          if (bar) bar.style.width = bar.dataset.level + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

    // Trigger desktop timeline connector when in view
    const tlDesktop = document.getElementById('timeline-desktop');
    if (tlDesktop) {
      const tlObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => { const fill = document.getElementById('timeline-fill'); if (fill) fill.style.width = '100%'; }, 300);
          tlObs.disconnect();
        }
      }, {threshold: 0.2});
      tlObs.observe(tlDesktop);
    }

    // OSS counter trigger
    const ossSection = document.getElementById('opensource');
    if (ossSection) {
      const ossObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { animateOSSCounter(); ossObs.disconnect(); }
      }, {threshold: 0.3});
      ossObs.observe(ossSection);
    }
  }

  // =====================================================================
  //  CURSOR GLOW
  // =====================================================================
  const glow = document.createElement('div');
  glow.style.cssText = `position:fixed;pointer-events:none;z-index:9998;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,var(--accent-glow) 0%,transparent 70%);transform:translate(-50%,-50%);transition:opacity 0.3s;opacity:0;mix-blend-mode:screen;`;
  document.body.appendChild(glow);
  let glowTimeout;
  document.addEventListener('mousemove', e => {
    glow.style.opacity = '0.6'; glow.style.left = e.clientX+'px'; glow.style.top = e.clientY+'px';
    clearTimeout(glowTimeout); glowTimeout = setTimeout(() => { glow.style.opacity = '0'; }, 2000);
  });

}); // end DOMContentLoaded
