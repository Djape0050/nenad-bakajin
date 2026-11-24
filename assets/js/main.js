/* ==========================================================================
   Nenad Bakajin — interactions
   GSAP 3 + ScrollTrigger + Lenis smooth scroll
   ========================================================================== */
(() => {
  const IMG = window.IMG;
  const page = document.body.dataset.page || '';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  document.documentElement.classList.remove('no-js');

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);

  /* ---------- language: Serbian (default) / English ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
  };
  const LANG = (() => {
    const q = params.get('lang');
    if (q === 'sr' || q === 'en') { store.set('nb-lang', q); return q; }
    return store.get('nb-lang') === 'en' ? 'en' : 'sr';
  })();
  const UI = window.UI || { sr: {}, en: {} };
  const t = (k) => (UI[LANG] && UI[LANG][k] != null ? UI[LANG][k] : (UI.sr[k] != null ? UI.sr[k] : k));
  document.documentElement.lang = LANG === 'en' ? 'en' : 'sr-Latn';

  // content in the chosen language (English overrides Serbian field by field)
  const S = (() => {
    const base = window.SITE;
    const en = window.SITE_EN;
    if (LANG !== 'en' || !en) return base;
    return {
      ...base,
      about: { ...base.about, ...en.about },
      packages: base.packages.map((p) => ({ ...p, ...(en.packages[p.slug] || {}) })),
      posts: base.posts.map((p) => ({ ...p, ...(en.posts[p.slug] || {}) }))
    };
  })();

  // static text marked with data-i18n in the HTML (Serbian is already in the markup)
  function applyStaticText() {
    if (LANG === 'sr') return;
    $$('[data-i18n]').forEach((el) => { const v = UI.en[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    $$('[data-i18n-alt]').forEach((el) => { const v = UI.en[el.dataset.i18nAlt]; if (v != null) el.alt = v; });
    const doc = UI.en['doc.' + page];
    if (doc) document.title = doc;
  }

  function langLink(code) {
    const u = new URL(location.href);
    u.searchParams.set('lang', code);
    return u.pathname.split('/').pop() + u.search + u.hash;
  }
  const LANG_SWITCH = `<div class="lang-switch" role="group" aria-label="${t('lang.label')}">
      <a href="${langLink('sr')}" lang="sr-Latn" data-lang="sr"${LANG === 'sr' ? ' aria-current="true"' : ''}>SR</a><span aria-hidden="true">/</span><a href="${langLink('en')}" lang="en" data-lang="en"${LANG === 'en' ? ' aria-current="true"' : ''}>EN</a>
    </div>`;
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- shared partials ---------- */
  const LOGO = `<svg viewBox="0 0 28 44" fill="none" aria-hidden="true"><path d="M2 42V2l12 40V2M14 2h5.5a5.5 5.5 0 0 1 0 11H14m0 0h6.5a7 7 0 0 1 0 14H14m0 0v15" stroke-width="1.3" stroke-linecap="square"/></svg>`;
  const ARROW = `<svg class="arrow" viewBox="0 0 22 8" fill="none" aria-hidden="true"><path d="M0 4h21m0 0L17.5 .5M21 4l-3.5 3.5" stroke="currentColor"/></svg>`;
  const IG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>`;

  const NAV = ['about', 'portfolio', 'ponuda', 'blog', 'kontakt'].map((key) => ({
    key, label: t('nav.' + key), href: key === 'about' ? 'index.html#statement-sec' : key + '.html'
  }));
  const activeKey = { home: '', portfolio: 'portfolio', gallery: 'portfolio', ponuda: 'ponuda', paket: 'ponuda', blog: 'blog', post: 'blog', kontakt: 'kontakt' }[page];

  function injectChrome() {
    const header = document.createElement('header');
    header.className = 'site-header';
    if (document.body.dataset.header === 'light') header.classList.add('is-light');
    header.innerHTML = `
      <a class="logo" href="index.html" aria-label="Nenad Bakajin, početna">${LOGO}<span class="logo-word">Nenad Bakajin</span></a>
      <nav class="nav-inline" aria-label="Glavna navigacija">
        ${NAV.filter((n) => n.key !== 'kontakt' && n.key !== 'about').map((n) => `<a href="${n.href}"${n.key === activeKey ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
        <a class="nav-cta" href="kontakt.html"${activeKey === 'kontakt' ? ' aria-current="page"' : ''}>${t('nav.cta')}</a>
      </nav>
      <div class="header-right">
        ${LANG_SWITCH}
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-label">${t('menu.open')}</span><span class="bars" aria-hidden="true"></span></button>
      </div>`;
    document.body.prepend(header);

    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = 'menu';
    menu.setAttribute('aria-hidden', 'true');
    menu.innerHTML = `
      <nav aria-label="Meni"><ul class="menu-links">
        ${NAV.filter((n) => n.key !== 'about').map((n, i) => `<li><a href="${n.href}" tabindex="-1"><span class="num">${pad(i + 1)}</span><span class="label"><span>${n.label}</span></span></a></li>`).join('')}
      </ul></nav>
      <div class="menu-foot"><span>${t('menu.foot')}</span><a href="${S.instagram}" target="_blank" rel="noopener" tabindex="-1">${IG} Instagram</a></div>`;
    header.after(menu);

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.setAttribute('data-dark', '');
    footer.innerHTML = `
      <div class="wrap">
        <div class="footer-top">
          <div class="footer-cta">
            <p class="eyebrow light">${t('footer.eyebrow')}</p>
            <p class="h2 mt-m"><a href="kontakt.html">${t('footer.cta')}</a></p>
          </div>
          <div class="footer-col">
            <h3 class="eyebrow light">${t('footer.pages')}</h3>
            <ul>${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}</ul>
          </div>
          <div class="footer-col">
            <h3 class="eyebrow light">${t('footer.follow')}</h3>
            <ul><li><a href="${S.instagram}" target="_blank" rel="noopener">${IG}&nbsp;&nbsp;Instagram</a></li></ul>
          </div>
        </div>
        <div class="footer-mark" aria-hidden="true">Nenad Bakajin</div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Nenad Bakajin. ${t('footer.rights')}</span>
          <a href="#top" data-top>${t('footer.top')}</a>
        </div>
      </div>`;
    document.body.append(footer);

    const grain = document.createElement('div');
    grain.className = 'grain';
    grain.setAttribute('aria-hidden', 'true');
    document.body.append(grain);

    if (!reduce && hasGSAP) {
      const curtain = document.createElement('div');
      curtain.className = 'curtain';
      curtain.setAttribute('aria-hidden', 'true');
      curtain.innerHTML = LOGO;
      document.body.append(curtain);
    }
  }

  /* ---------- page renderers ---------- */
  // Photos are shown whole, in their original proportions: no crop, no filter.
  const photo = (id, w, alt, extra = '') =>
    `<img src="${IMG(id, w)}" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}>`;

  function tiles(list, label) {
    return list.map((id, i) => `<button class="tile" type="button" data-full="${IMG(id, 2000)}" data-cap="${esc(label)} · ${pad(i + 1)}" aria-label="${t('lb.open')} ${i + 1}: ${esc(label)}">
        ${photo(id, 1000, `${label}, ${t('photo')} ${i + 1}`)}
        <span class="tile-cap">${esc(label)} · ${pad(i + 1)}</span></button>`).join('');
  }

  const CAT_LABEL = { portraits: 'Portraits', details: 'Details', snapshots: 'Snapshots' };
  function catTiles(items) {
    return items.map(({ id, cat }, i) => {
      const label = CAT_LABEL[cat];
      return `<button class="tile" type="button" data-cat="${cat}" data-full="${IMG(id, 2000)}" data-cap="${label}" aria-label="${t('lb.open')}: ${label}">
        ${photo(id, 1000, `${label}, ${t('photo')} ${i + 1}`)}
        <span class="tile-cap">${label}</span></button>`;
    }).join('');
  }

  /* gallery filters */
  function initFilters() {
    $$('.filters').forEach((bar) => {
      const grid = $('.masonry', bar.closest('.section'));
      if (!grid) return;
      const btns = $$('button', bar);
      btns.forEach((b) => b.addEventListener('click', () => {
        const f = b.dataset.filter;
        btns.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
        const all = $$('.tile', grid);
        const apply = () => {
          all.forEach((t) => { t.hidden = !(f === 'all' || t.dataset.cat === f); });
          if (window.ScrollTrigger) ScrollTrigger.refresh();
          const shown = all.filter((t) => !t.hidden);
          if (hasGSAP && !reduce) gsap.fromTo(shown, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'power3.out', overwrite: true });
          else shown.forEach((t) => (t.style.opacity = 1));
          shown.forEach((t) => { const im = $('img', t); if (im) im.loading = 'eager'; });
        };
        if (hasGSAP && !reduce) gsap.to(grid, { opacity: 0, duration: 0.3, onComplete: () => { apply(); gsap.to(grid, { opacity: 1, duration: 0.3 }); } });
        else apply();
      }));
    });
  }

  const render = {
    home() {
      const a = S.about;
      $('#hero-intro').textContent = a.heroIntro;
      // last word of the statement in gold italic
      $('#statement').innerHTML = esc(a.lead).replace(/(\S+)$/, '<em>$1</em>');
      $('#about-text').innerHTML = a.paragraphs.map((p) => `<p>${p}</p>`).join('');
      $('#motto').innerHTML = a.motto.map((m) => `<span>${m}</span>`).join('');
      $('#about-bg').innerHTML = a.background.map((p) => `<p>${p}</p>`).join('');
      $('#quote-text').textContent = a.quote.text;
      $('#quote-author').textContent = a.quote.author;

      const pick = S.couples.map((c) => ({ id: c.images[0], c }));
      $('#strip-track').innerHTML = pick.map(({ id, c }, i) => `
        <div class="strip-item"><a href="galerija.html?c=${c.slug}">
          <div class="frame">${photo(id, 1000, `${c.a} ${t('and')} ${c.b}`)}</div>
          <div class="strip-cap"><span class="n">(${pad(i + 1)})</span><span class="t">${c.a} <em>&amp;</em> ${c.b}</span></div></a></div>`).join('');

      // package tiers (inspired by dia.rs cards)
      const tiers = ['Basic', 'Editorial', 'Premium'];
      $('#tier-grid').innerHTML = tiers.map((tier, i) => {
        const foto = S.packages.find((p) => p.group === 'foto' && p.tier === tier);
        const film = S.packages.find((p) => p.group === 'film' && p.tier === tier);
        return `<article class="tier${i === 1 ? ' is-featured' : ''}">
          <header class="tier-head"><span class="num">${pad(i + 1)}</span><h3>${tier}</h3></header>
          <div class="tier-body">
            <a class="tier-row" href="paket.html?p=${foto.slug}">
              <span class="eyebrow">${t('tier.photo')}</span><span class="tier-title">${foto.title}</span><span class="tier-short">${foto.short}</span></a>
            <a class="tier-row" href="paket.html?p=${film.slug}">
              <span class="eyebrow">${t('tier.film')}</span><span class="tier-title">${film.title}</span><span class="tier-short">${film.short}</span></a>
          </div>
          <footer class="tier-foot"><a class="btn" href="kontakt.html?paket=${foto.slug}">${t('tier.cta')} ${ARROW}</a></footer>
        </article>`;
      }).join('');
    },

    portfolio() {
      $('#couple-count').textContent = `${pad(S.couples.length)} ${t('couple.galleries')}`;
      $('#couple-grid').innerHTML = S.couples.map((c, i) => `
        <article class="couple">
          <a href="galerija.html?c=${c.slug}" aria-label="${t('couple.label')}: ${c.a} ${t('and')} ${c.b}">
            <div class="couple-media">
              ${photo(c.images[0], 1200, `${c.a} ${t('and')} ${c.b}`, 'class="main"')}
              ${photo(c.images[1], 1200, '', 'class="alt" aria-hidden="true"')}
              <span class="couple-cta">${t('couple.cta')}</span>
            </div>
            <div class="couple-info">
              <span class="num">${pad(i + 1)}</span>
              <h3 class="couple-name">${c.a} <em>&amp;</em> ${c.b}</h3>
              <span class="couple-meta">${c.images.length} ${t('couple.frames')}</span>
            </div>
          </a>
        </article>`).join('');
      const mix = [];
      const c = S.collections;
      const n = Math.max(c.portraits.length, c.details.length, c.snapshots.length);
      for (let k = 0; k < n; k++) ['portraits', 'details', 'snapshots'].forEach((cat) => c[cat][k] && mix.push({ id: c[cat][k], cat }));
      $('#portfolio-gallery').innerHTML = catTiles(mix);
    },

    gallery() {
      const idx = Math.max(0, S.couples.findIndex((c) => c.slug === params.get('c')));
      const c = S.couples[idx];
      const next = S.couples[(idx + 1) % S.couples.length];
      const label = `${c.a} & ${c.b}`;
      document.title = `${label} · Nenad Bakajin`;
      $('#g-title').innerHTML = `${c.a} <em class="italic">&amp;</em> ${c.b}`;
      $('#g-count').textContent = `${pad(idx + 1)} / ${pad(S.couples.length)}`;
      $('#g-grid').innerHTML = tiles(c.images, label);
      $('#g-next').href = `galerija.html?c=${next.slug}`;
      $('#g-next-name').innerHTML = `${next.a} <em class="italic">&amp;</em> ${next.b}`;
    },

    ponuda() {
      const card = (p, i) => `
        <article class="pk-card">
          <a class="cover" href="paket.html?p=${p.slug}" aria-label="${esc(p.title)}, ${t('card.more').toLowerCase()}"></a>
          <div class="frame natural">${photo(p.image, 1000, '')}</div>
          <div class="pk-body">
            <div class="pk-tier"><span class="eyebrow">${p.tier}</span><span class="num">${pad(i + 1)}</span></div>
            <h3 class="pk-name">${p.title}</h3>
            <p class="pk-short">${p.short}</p>
            <a class="link-line" href="paket.html?p=${p.slug}">${t('card.more')}</a>
          </div>
        </article>`;
      $('#pk-foto').innerHTML = S.packages.filter((p) => p.group === 'foto').map(card).join('');
      $('#pk-film').innerHTML = S.packages.filter((p) => p.group === 'film').map(card).join('');
    },

    paket() {
      const list = S.packages;
      const idx = Math.max(0, list.findIndex((p) => p.slug === params.get('p')));
      const p = list[idx];
      const prev = list[(idx - 1 + list.length) % list.length];
      const next = list[(idx + 1) % list.length];
      document.title = `${p.title} · ${t('title.ponuda')} · Nenad Bakajin`;
      $('#p-group').textContent = `${p.subtitle} · ${p.tier}`;
      $('#p-title').textContent = p.title;
      $('#p-intro').textContent = p.intro;
      $('#p-img').src = IMG(p.image, 1400);
      $('#p-img').alt = p.title;
      $('#p-list').innerHTML = p.includes.map((t, i) => `<li><span class="num">${pad(i + 1)}</span><span>${t}</span></li>`).join('');
      $('#p-cta').href = `kontakt.html?paket=${p.slug}`;
      $('#p-prev').href = `paket.html?p=${prev.slug}`;
      $('#p-prev-name').textContent = prev.title;
      $('#p-next').href = `paket.html?p=${next.slug}`;
      $('#p-next-name').textContent = next.title;
    },

    blog() {
      $('#posts').innerHTML = S.posts.map((p, i) => `
        <article class="post-card"><a href="post.html?p=${p.slug}">
          <div class="frame natural">${photo(p.image, 1200, p.title)}</div>
          <div class="meta"><span class="eyebrow">${t('post.label')}</span><span class="num">${pad(i + 1)}</span></div>
          <h2>${p.title}</h2><p>${p.excerpt}</p><span class="link-line">${t('post.read')}</span></a></article>`).join('');
    },

    post() {
      const idx = Math.max(0, S.posts.findIndex((p) => p.slug === params.get('p')));
      const p = S.posts[idx];
      const next = S.posts[(idx + 1) % S.posts.length];
      document.title = `${p.title} · ${t('title.blog')} · Nenad Bakajin`;
      $('#post-title').textContent = p.title;
      $('#post-img').src = IMG(p.image, 2000);
      $('#post-img').alt = p.title;
      $('#post-body').innerHTML = p.body.map((t) => `<p>${t}</p>`).join('');
      $('#post-next').href = `post.html?p=${next.slug}`;
      $('#post-next-name').textContent = next.title;
    },

    kontakt() {
      const sel = $('#f-package');
      sel.innerHTML = `<option value="">${t('form.undecided')}</option>` +
        ['foto', 'film'].map((g) => `<optgroup label="${g === 'foto' ? t('form.photo') : t('form.film')}">${S.packages.filter((p) => p.group === g).map((p) => `<option value="${p.slug}">${p.title}</option>`).join('')}</optgroup>`).join('');
      const pre = params.get('paket');
      if (pre) sel.value = pre;
      initForm();
    }
  };

  /* ---------- form ---------- */
  function initForm() {
    const form = $('#contact-form');
    if (!form) return;
    const rules = {
      first: (v) => v.trim() ? '' : t('err.first'),
      last: (v) => v.trim() ? '' : t('err.last'),
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : t('err.email'),
      details: (v) => v.trim().length > 4 ? '' : t('err.details')
    };
    const check = (name) => {
      const input = form.elements[name];
      const msg = rules[name](input.value);
      const field = input.closest('.field');
      field.classList.toggle('invalid', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      $('.err', field).textContent = msg;
      return !msg;
    };
    Object.keys(rules).forEach((n) => form.elements[n].addEventListener('blur', () => check(n)));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = Object.keys(rules).filter((n) => !check(n));
      if (bad.length) { form.elements[bad[0]].focus(); return; }
      form.classList.add('is-sent');
      const ok = $('.form-success', form);
      ok.setAttribute('tabindex', '-1');
      ok.focus();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }

  /* ---------- lightbox ---------- */
  function initLightbox() {
    const tilesEls = $$('.masonry .tile');
    if (!tilesEls.length) return;
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', t('lb.label'));
    lb.innerHTML = `<span class="lb-count" aria-live="polite"></span>
      <button class="lb-btn lb-close" type="button">${t('lb.close')}</button>
      <button class="lb-btn lb-prev" type="button" aria-label="${t('lb.prev')}">←</button>
      <figure><img alt=""><figcaption></figcaption></figure>
      <button class="lb-btn lb-next" type="button" aria-label="${t('lb.next')}">→</button>`;
    document.body.append(lb);
    const img = $('img', lb), cap = $('figcaption', lb), count = $('.lb-count', lb);
    let group = [], i = 0, opener = null;

    const show = (n, dir = 0) => {
      i = (n + group.length) % group.length;
      const t = group[i];
      img.src = t.dataset.full;
      img.alt = $('img', t).alt;
      cap.textContent = t.dataset.cap;
      count.textContent = `${pad(i + 1)} / ${pad(group.length)}`;
      if (hasGSAP && !reduce) gsap.fromTo(img, { opacity: 0, x: dir * 30 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' });
    };
    const open = (t) => {
      opener = t;
      group = $$('.tile', t.closest('.masonry')).filter((x) => !x.hidden);
      lb.classList.add('is-open');
      lenis && lenis.stop();
      show(group.indexOf(t));
      if (hasGSAP && !reduce) gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.45 });
      $('.lb-close', lb).focus();
    };
    const close = () => {
      const done = () => { lb.classList.remove('is-open'); lenis && lenis.start(); opener && opener.focus(); };
      if (hasGSAP && !reduce) gsap.to(lb, { opacity: 0, duration: 0.3, onComplete: done }); else done();
    };
    tilesEls.forEach((t) => t.addEventListener('click', () => open(t)));
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', () => show(i - 1, -1));
    $('.lb-next', lb).addEventListener('click', () => show(i + 1, 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(i - 1, -1);
      if (e.key === 'ArrowRight') show(i + 1, 1);
      if (e.key === 'Tab') {
        const f = $$('button', lb);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    let sx = 0;
    lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); });
  }

  /* ---------- menu (adapted from 21st.dev Immersive Full Screen Navigation) ---------- */
  function initMenu() {
    const btn = $('.menu-btn'), menu = $('#menu'), header = $('.site-header');
    if (!btn) return;
    const links = $$('a', menu);
    let open = false, busy = false, wasLight = false;
    const set = (state) => {
      open = state;
      btn.setAttribute('aria-expanded', String(state));
      $('.menu-label', btn).textContent = state ? t('menu.close') : t('menu.open');
      menu.setAttribute('aria-hidden', String(!state));
      links.forEach((a) => a.setAttribute('tabindex', state ? '0' : '-1'));
      document.body.classList.toggle('menu-open', state);
    };
    const toggle = () => {
      if (busy) return;
      busy = true;
      if (!open) {
        wasLight = header.classList.contains('is-light');
        set(true);
        header.classList.add('is-light');
        lenis && lenis.stop();
        if (hasGSAP && !reduce) {
          gsap.timeline({ onComplete: () => (busy = false) })
            .set(menu, { visibility: 'visible', clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' })
            .to(menu, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1, ease: 'power4.inOut' })
            .from($$('.menu-links li > a', menu), { yPercent: 110, duration: 0.9, stagger: 0.07, ease: 'power3.out' }, '-=0.45')
            .from($('.menu-foot', menu), { opacity: 0, y: 12, duration: 0.5 }, '-=0.5');
        } else { menu.style.visibility = 'visible'; menu.style.clipPath = 'none'; busy = false; }
        setTimeout(() => links[0] && links[0].focus(), reduce ? 0 : 700);
      } else {
        set(false);
        if (!wasLight) header.classList.remove('is-light');
        lenis && lenis.start();
        const done = () => { menu.style.visibility = 'hidden'; busy = false; btn.focus(); };
        if (hasGSAP && !reduce) {
          gsap.to(menu, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', duration: 0.9, ease: 'power4.inOut', onComplete: done });
        } else { menu.style.clipPath = ''; done(); }
      }
    };
    btn.addEventListener('click', toggle);
    document.addEventListener('keydown', (e) => {
      if (!open) return;
      if (e.key === 'Escape') toggle();
      if (e.key === 'Tab') {
        const f = [btn, ...links];
        const idx = f.indexOf(document.activeElement);
        if (e.shiftKey && idx <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && idx === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ---------- videos ---------- */
  function initHeroVideo() {
    const box = $('.hero-media');
    if (!box) return;
    const tall = window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    const srcs = tall ? S.video.heroTall : S.video.heroWide;
    // Smooth playback: normal speed (slowing a 25 fps clip makes it stutter), no seeking
    // right before a shot is shown, and the next shot only fades in once it has buffered.
    const vids = srcs.map((src, n) => {
      const v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.loop = true; v.preload = n === 0 ? 'auto' : 'none';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
      v.src = src;
      box.append(v);
      return v;
    });
    // A still frame is visible straight away, so the hero is never an empty black box
    // (slow network, or phones in power-saving mode that refuse to autoplay video).
    const poster = tall ? S.video.posterTall : S.video.posterWide;
    if (poster) { vids[0].poster = poster; vids[0].classList.add('is-active'); }

    const canPlay = (v) => v.readyState >= 3;
    const whenReady = (v, fn) => (canPlay(v) ? fn() : v.addEventListener('canplay', fn, { once: true }));
    const warm = (v) => { if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); } };

    if (reduce) { whenReady(vids[0], () => vids[0].classList.add('is-active')); return; }

    let cur = 0;
    let onScreen = true;
    const SEG = 8; // seconds per shot
    const show = (n) => {
      vids.forEach((x, k) => x.classList.toggle('is-active', k === n));
      // after the crossfade, stop the old shot and rewind it quietly, off screen
      setTimeout(() => vids.forEach((x, k) => { if (k !== n) { x.pause(); try { x.currentTime = 0; } catch (_) {} } }), 2600);
    };
    const start = () => vids[cur].play().catch(() => {});
    start();
    whenReady(vids[0], () => { show(0); if (vids[1]) warm(vids[1]); });
    // if autoplay was blocked, start on the first touch / click anywhere
    const kick = () => { if (onScreen && vids[cur].paused) start(); };
    ['touchstart', 'pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, kick, { once: true, passive: true }));
    // stop decoding while the hero is scrolled out of view (saves battery and keeps scrolling smooth)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen) start(); else vids.forEach((x) => x.pause());
      }).observe(box);
    }
    if (vids.length < 2) return;
    setInterval(() => {
      if (!onScreen || document.hidden) return;
      const nxt = (cur + 1) % vids.length;
      const v = vids[nxt];
      warm(v);
      if (!canPlay(v)) return; // not buffered yet: keep the current shot a little longer
      v.play().then(() => { cur = nxt; show(cur); warm(vids[(cur + 1) % vids.length]); }).catch(() => {});
    }, SEG * 1000);
  }

  function initInserts() {
    $$('.page-hero video[src]').forEach((v) => {
      const slow = () => { v.playbackRate = 0.6; };
      slow(); v.addEventListener('loadedmetadata', slow); v.addEventListener('play', slow);
      if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
    });
    const vids = $$('video[data-src]');
    if (!vids.length) return;
    // normal speed: slowed-down playback of 25–50 fps clips looks choppy
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target: v }) => {
        if (isIntersecting) {
          if (!v.src) { v.preload = 'auto'; v.src = v.dataset.src; }
          if (!reduce) v.play().catch(() => {});
        } else v.pause();
      });
    }, { rootMargin: '300px 0px' });
    vids.forEach((v) => {
      v.muted = true;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.addEventListener('loadedmetadata', () => { if (reduce) v.currentTime = 1.5; });
      io.observe(v);
    });
  }

  /* ---------- robust lazy images: promote to eager when near the viewport ---------- */
  function initLazyImages() {
    const imgs = $$('img[loading="lazy"]');
    if (!('IntersectionObserver' in window)) { imgs.forEach((i) => (i.loading = 'eager')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.loading = 'eager'; io.unobserve(e.target); } });
    }, { rootMargin: '800px 0px' });
    imgs.forEach((i) => io.observe(i));
  }

  /* ---------- hover preview (portfolio index) ---------- */
  function initHoverPreview() {
    const list = $('#couples');
    if (!list || !hasGSAP || window.matchMedia('(hover: none)').matches) return;
    const pv = document.createElement('div');
    pv.className = 'hover-preview';
    pv.setAttribute('aria-hidden', 'true');
    pv.innerHTML = '<img alt="">';
    document.body.append(pv);
    const im = $('img', pv);
    const xTo = gsap.quickTo(pv, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(pv, 'y', { duration: 0.6, ease: 'power3' });
    gsap.set(pv, { xPercent: -50, yPercent: -50 });
    window.addEventListener('mousemove', (e) => { xTo(e.clientX); yTo(e.clientY); });
    $$('a', list).forEach((a) => {
      a.addEventListener('mouseenter', () => { im.src = a.dataset.preview; gsap.to(pv, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }); });
      a.addEventListener('mouseleave', () => gsap.to(pv, { opacity: 0, scale: 0.85, duration: 0.4 }));
    });
  }

  /* ---------- text splitting ---------- */
  function splitWords(el) {
    if (el.dataset.splitDone) return $$('.w > span', el);
    // keeps <em> accents (italic words) while splitting
    const out = [];
    el.childNodes.forEach((n) => {
      const em = n.nodeType === 1 && n.tagName === 'EM';
      n.textContent.split(/\s+/).filter(Boolean).forEach((w) =>
        out.push(`<span class="w" aria-hidden="true"><span>${em ? `<em>${esc(w)}</em>` : esc(w)}</span></span>`));
    });
    el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
    el.innerHTML = out.join(' ');
    el.dataset.splitDone = '1';
    return $$('.w > span', el);
  }

  /* ---------- smooth scroll + animations ---------- */
  let lenis = null;

  function initScroll() {
    if (reduce || typeof window.Lenis === 'undefined') return;
    lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    $$('a[href^="#"], a[data-top]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : $(id);
      if (target !== null) { e.preventDefault(); lenis.scrollTo(target, { offset: 0, duration: 1.6 }); }
    }));
  }

  function headerBehaviour() {
    const header = $('.site-header');
    const darkZones = $$('[data-dark]');
    let last = 0;
    const update = () => {
      const y = window.scrollY;
      if (!document.body.classList.contains('menu-open')) {
        const probe = 40;
        const overDark = darkZones.some((z) => { const r = z.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; });
        header.classList.toggle('is-light', overDark);
        header.classList.toggle('is-solid', !overDark && y > 80);
        header.classList.toggle('is-hidden', y > last && y > 400);
      }
      last = y;
    };
    if (lenis) lenis.on('scroll', update); else window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function animate() {
    if (!hasGSAP || reduce) return;
    gsap.registerPlugin(ScrollTrigger);

    // page enter: curtain lifts
    const curtain = $('.curtain');
    const enter = gsap.timeline();
    if (curtain) {
      const firstVisit = page === 'home' && !sessionStorageGet('nb-visited');
      if (firstVisit) {
        enter.to($('path', curtain), { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' })
             .to(curtain, { yPercent: -100, duration: 1.2, ease: 'power4.inOut' }, '+=0.15');
        sessionStorageSet('nb-visited', '1');
      } else {
        gsap.set($('path', curtain), { strokeDashoffset: 0 });
        enter.to(curtain, { yPercent: -100, duration: 1, ease: 'power4.inOut', delay: 0.05 });
      }
      enter.set(curtain, { display: 'none' });
    }

    // page leave: curtain drops
    $$('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || a.target === '_blank' || href.startsWith('mailto') || href.startsWith('tel') || /^https?:/.test(href)) return;
      a.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        const url = new URL(href, location.href);
        // "/site/" and "/site/index.html" are the same page (GitHub Pages serves both)
        const norm = (p) => p.replace(/index\.html$/, '');
        if (norm(url.pathname) === norm(location.pathname) && url.search === location.search && url.hash) {
          const target = $(url.hash);
          if (target) { e.preventDefault(); lenis ? lenis.scrollTo(target, { duration: 1.6 }) : target.scrollIntoView({ behavior: 'smooth' }); }
          return;
        }
        e.preventDefault();
        if (!curtain) { location.href = href; return; }
        gsap.set(curtain, { display: 'grid', yPercent: 100 });
        gsap.to(curtain, { yPercent: 0, duration: 0.8, ease: 'power4.inOut', onComplete: () => { location.href = href; } });
      });
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted && curtain) gsap.set(curtain, { display: 'none' }); });

    // hero name — letters rise
    const name = $('.hero-name');
    if (name) {
      name.setAttribute('aria-label', name.textContent);
      name.innerHTML = name.textContent.trim().split(/\s+/)
        .map((word) => `<span class="word" aria-hidden="true">${[...word].map((ch) => `<span class="char">${ch}</span>`).join('')}</span>`).join(' ');
      enter.from($$('.char', name), { yPercent: 110, opacity: 0, duration: 1.4, stagger: 0.045, ease: 'power4.out' }, curtain ? '-=0.6' : 0)
           .from('.hero-meta > *, .hero-rec', { opacity: 0, y: 16, duration: 1, stagger: 0.12, ease: 'power2.out' }, '-=0.9');
      gsap.to('.hero-inner', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-media', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    // page hero titles
    $$('.page-hero .h1').forEach((h) => {
      const words = splitWords(h);
      enter.from(words, { yPercent: 110, duration: 1.3, stagger: 0.08, ease: 'power4.out' }, curtain ? '-=0.55' : 0);
      gsap.to(h.closest('.page-hero').querySelector('.media'), { yPercent: 14, scale: 1.08, ease: 'none', scrollTrigger: { trigger: h.closest('.page-hero'), start: 'top top', end: 'bottom top', scrub: true } });
    });
    $$('.page-hero [data-hero-fade]').forEach((el) => enter.from(el, { opacity: 0, y: 14, duration: 1 }, '-=0.9'));

    // statement: words light up while scrolling (scrub)
    $$('[data-scrub-words]').forEach((el) => {
      const words = splitWords(el);
      gsap.set(words, { opacity: 0.14 });
      gsap.to(words, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    });

    // headings: words rise
    $$('[data-split]').forEach((el) => {
      const words = splitWords(el);
      gsap.from(words, { yPercent: 110, duration: 1.2, stagger: 0.06, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    // generic reveal
    $$('[data-reveal]').forEach((el) => {
      gsap.from(el, { opacity: 0, y: 28, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    $$('[data-stagger]').forEach((el) => {
      gsap.from(el.children, { opacity: 0, y: 28, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    // images: clip reveal + inner parallax
    $$('[data-img]').forEach((fr) => {
      const vid = fr.querySelector('video');
      if (!vid) { // photos: a calm fade, never cropped or zoomed
        gsap.from(fr, { opacity: 0, y: 30, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: fr, start: 'top 88%' } });
        return;
      }
      gsap.fromTo(fr, { clipPath: 'inset(12% 8% 12% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power4.out', scrollTrigger: { trigger: fr, start: 'top 85%' } });
      gsap.fromTo(vid, { scale: 1.18, yPercent: -4 }, { scale: 1.02, yPercent: 4, ease: 'none', scrollTrigger: { trigger: fr, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // video inserts: widen from a letterbox
    $$('[data-insert]').forEach((fr) => {
      gsap.fromTo(fr, { clipPath: 'inset(18% 10% 18% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: fr, start: 'top 95%', end: 'top 35%', scrub: true } });
      gsap.from($('.label', fr), { opacity: 0, y: 16, duration: 1, scrollTrigger: { trigger: fr, start: 'top 55%' } });
    });

    // masonry tiles: soft stagger (21st Masonry Lightbox entrance)
    $$('.masonry').forEach((m) => {
      ScrollTrigger.batch($$('.tile', m), {
        start: 'top 92%',
        onEnter: (b) => gsap.fromTo(b, { opacity: 0, y: 40, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.08, ease: 'power3.out', overwrite: true })
      });
      gsap.set($$('.tile', m), { opacity: 0 });
    });

    // lists
    // couples: reveal row by row, precise and even
    const couples = $$('.couple');
    if (couples.length) {
      ScrollTrigger.batch(couples, {
        start: 'top 88%',
        onEnter: (b) => {
          gsap.fromTo(b.map((c) => $('.couple-media', c)), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, stagger: 0.12, ease: 'power4.inOut' });
          gsap.fromTo(b.map((c) => $('.couple-info', c)), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12, delay: 0.5, ease: 'power3.out' });
        }
      });
      gsap.set(couples.map((c) => $('.couple-media', c)), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(couples.map((c) => $('.couple-info', c)), { opacity: 0 });
    }
    $$('.offer-list li, .couples li').forEach((li) => {
      gsap.from(li, { opacity: 0, y: 40, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 92%' } });
    });

    // quote
    const q = $('#quote-text');
    if (q) {
      const words = splitWords(q);
      gsap.from(words, { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.05, ease: 'power4.out', scrollTrigger: { trigger: q, start: 'top 75%' } });
      gsap.fromTo('.quote video', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.quote', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    // home portfolio: calm grid, each couple fades in softly as it comes into view
    const stripItems = $$('#strip-track .strip-item');
    if (stripItems.length) {
      gsap.set(stripItems, { opacity: 0, y: 24 });
      ScrollTrigger.batch(stripItems, {
        start: 'top 90%',
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.4, stagger: 0.15, ease: 'power2.out', overwrite: true })
      });
    }

    // thin line drawn while scrolling (idea from dia.rs)
    $$('.draw-line path').forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(p, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: p.closest('section'), start: 'top 70%', end: 'bottom 60%', scrub: 1 } });
    });

    // footer mark drift
    gsap.from('.footer-mark', { xPercent: -4, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.site-footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    window.addEventListener('load', () => ScrollTrigger.refresh());
    // photos keep their natural height, so re-measure as they arrive
    let rt;
    $$('main img').forEach((im) => im.addEventListener('load', () => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 250); }));
  }

  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (_) {} }

  /* ---------- boot ---------- */
  injectChrome();
  applyStaticText();
  (render[page] || (() => {}))();
  initScroll();
  initMenu();
  initHeroVideo();
  initInserts();
  initLazyImages();
  initLightbox();
  initFilters();
  initHoverPreview();
  headerBehaviour();
  animate();
})();
