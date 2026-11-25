/* ==========================================================================
   Nenad Bakajin — interactions
   GSAP 3 + ScrollTrigger + Lenis smooth scroll

   Sections: config · language · chrome (header, menu, footer) · page renderers ·
   form · scroll lock · lightbox · menu · videos · lazy images · text split ·
   scroll · header · animations · boot
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- config ---------- */
  const IMG = window.IMG;
  const page = document.body.dataset.page || '';
  const mq = (q) => window.matchMedia(q).matches;
  const reduce = mq('(prefers-reduced-motion: reduce)');
  const touch = mq('(hover: none)');
  const hasGSAP = typeof window.gsap !== 'undefined';
  document.documentElement.classList.remove('no-js');

  /* Motion system — mirrors the CSS tokens in style.css (section 1).
     EASE    = cubic-bezier(.22, 1, .36, 1)  → GSAP power4.out   (things appearing / responding)
     EASE_IO = cubic-bezier(.76, 0, .24, 1)  → GSAP power3.inOut (things covering the screen)   */
  const EASE = 'power4.out';
  const EASE_IO = 'power3.inOut';
  const DUR = { fast: 0.45, base: 0.8, slow: 1.2 };   // = --dur-2 / --dur-3 / --dur-4
  const STAGGER = { letters: 0.04, words: 0.06, items: 0.08 };
  const RISE = 24;                                     // px every reveal travels
  // when scroll reveals start: on phones a bit earlier, so photos are already there when you get to them
  const START = touch ? 'top 98%' : 'top 88%';
  const XFADE = 1600;                                  // ms, = --dur-video

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const store = {
    get(k, area = localStorage) { try { return area.getItem(k); } catch (_) { return null; } },
    set(k, v, area = localStorage) { try { area.setItem(k, v); } catch (_) {} }
  };

  // one listener set for "the user just tapped / clicked / pressed a key"
  // (the only moments phones in power-saving mode allow video to start)
  const gestureHandlers = new Set();
  const onGesture = (fn) => gestureHandlers.add(fn);
  ['touchend', 'click', 'keydown'].forEach((ev) =>
    window.addEventListener(ev, () => gestureHandlers.forEach((fn) => fn()), { passive: true }));

  /* ---------- language: Serbian (default) / English ---------- */
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

  // static text marked in the HTML (Serbian is already in the markup)
  function applyStaticText() {
    if (LANG === 'sr') return;
    $$('[data-i18n]').forEach((el) => { const v = UI.en[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    $$('[data-i18n-alt]').forEach((el) => { const v = UI.en[el.dataset.i18nAlt]; if (v != null) el.alt = v; });
    $$('[data-i18n-aria]').forEach((el) => { const v = UI.en[el.dataset.i18nAria]; if (v != null) el.setAttribute('aria-label', v); });
    const doc = UI.en['doc.' + page];
    if (doc) document.title = doc;
  }

  function langLink(code) {
    const u = new URL(location.href);
    u.searchParams.set('lang', code);
    return u.pathname.split('/').pop() + u.search + u.hash;
  }
  const langSwitch = (focusable = true) => {
    const ti = focusable ? '' : ' tabindex="-1"';
    return `<div class="lang-switch" role="group" aria-label="${t('lang.label')}">
      <a href="${langLink('sr')}" lang="sr-Latn"${ti}${LANG === 'sr' ? ' aria-current="true"' : ''}>SR</a><span aria-hidden="true">/</span><a href="${langLink('en')}" lang="en"${ti}${LANG === 'en' ? ' aria-current="true"' : ''}>EN</a>
    </div>`;
  };

  /* ---------- shared partials ---------- */
  const LOGO = `<svg viewBox="0 0 28 44" fill="none" aria-hidden="true" focusable="false"><path d="M2 42V2l12 40V2M14 2h5.5a5.5 5.5 0 0 1 0 11H14m0 0h6.5a7 7 0 0 1 0 14H14m0 0v15" stroke-width="1.3" stroke-linecap="square"/></svg>`;
  const ARROW = `<svg class="arrow" viewBox="0 0 22 8" fill="none" aria-hidden="true" focusable="false"><path d="M0 4h21m0 0L17.5 .5M21 4l-3.5 3.5" stroke="currentColor"/></svg>`;
  const IG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>`;

  const NAV = ['about', 'portfolio', 'ponuda', 'blog', 'kontakt'].map((key) => ({
    key, label: t('nav.' + key), href: key === 'about' ? 'index.html#statement-sec' : key + '.html'
  }));
  const activeKey = { portfolio: 'portfolio', gallery: 'portfolio', ponuda: 'ponuda', paket: 'ponuda', blog: 'blog', post: 'blog', kontakt: 'kontakt' }[page] || '';
  const current = (key) => (key === activeKey ? ' aria-current="page"' : '');

  /* ---------- chrome: skip link, header, menu, footer ---------- */
  function injectChrome() {
    const main = $('main');
    if (main) { main.id = 'main'; main.setAttribute('tabindex', '-1'); }

    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main';
    skip.textContent = t('a11y.skip');

    const header = document.createElement('header');
    header.className = 'site-header';
    if (document.body.dataset.header === 'light') header.classList.add('is-light');
    header.innerHTML = `
      <a class="logo" href="index.html" aria-label="${t('a11y.home')}">${LOGO}<span class="logo-word" aria-hidden="true">Nenad Bakajin</span></a>
      <nav class="nav-inline" aria-label="${t('a11y.nav')}">
        ${NAV.filter((n) => n.key !== 'kontakt' && n.key !== 'about').map((n) => `<a href="${n.href}"${current(n.key)}>${n.label}</a>`).join('')}
        <a class="nav-cta" href="kontakt.html"${current('kontakt')}>${t('nav.cta')}</a>
      </nav>
      <div class="header-right">
        ${langSwitch()}
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-label">${t('menu.open')}</span><span class="bars" aria-hidden="true"></span></button>
      </div>`;

    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = 'menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', t('menu.open'));
    menu.inert = true;
    menu.innerHTML = `
      <nav aria-label="${t('a11y.nav')}"><ul class="menu-links">
        ${NAV.filter((n) => n.key !== 'about').map((n, i) => `<li><a href="${n.href}"${current(n.key)}><span class="num" aria-hidden="true">${pad(i + 1)}</span><span class="label"><span>${n.label}</span></span></a></li>`).join('')}
      </ul></nav>
      <div class="menu-bottom">
        <a class="btn menu-cta" href="kontakt.html">${t('nav.cta')} ${ARROW}</a>
        <div class="menu-foot">${langSwitch()}<a href="${S.instagram}" target="_blank" rel="noopener">${IG} Instagram</a></div>
      </div>`;

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
          <nav class="footer-col" aria-label="${t('footer.pages')}">
            <h2 class="eyebrow light">${t('footer.pages')}</h2>
            <ul>${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}</ul>
          </nav>
          <div class="footer-col">
            <h2 class="eyebrow light">${t('footer.follow')}</h2>
            <ul><li><a href="${S.instagram}" target="_blank" rel="noopener">${IG}&nbsp;&nbsp;Instagram</a></li></ul>
          </div>
        </div>
        <div class="footer-mark" aria-hidden="true">Nenad Bakajin</div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Nenad Bakajin. ${t('footer.rights')}</span>
          <a href="#top" data-top>${t('footer.top')}</a>
        </div>
      </div>`;

    document.body.prepend(skip, header, menu);
    document.body.append(footer);

    if (!touch) {
      const grain = document.createElement('div');
      grain.className = 'grain';
      grain.setAttribute('aria-hidden', 'true');
      document.body.append(grain);
    }
    if (!reduce && hasGSAP) {
      const curtain = document.createElement('div');
      curtain.className = 'curtain';
      curtain.setAttribute('aria-hidden', 'true');
      curtain.innerHTML = LOGO;
      document.body.append(curtain);
    }
  }

  /* ---------- page renderers ---------- */
  // Responsive photos: the browser picks the smallest file that is still sharp for the slot
  // (a phone gets ~400-700 px instead of 1000-1400 px: 4-5x less data).
  const WIDTHS = [400, 700, 1000, 1400];
  const SIZES = {
    third: '(min-width: 1024px) 31vw, (min-width: 600px) 48vw, 100vw', // 3 / 2 / 1 columns
    tile: '(min-width: 760px) 31vw, 48vw',                             // 3 / 2 columns
    card: '(min-width: 900px) 30vw, 100vw',
    half: '(min-width: 900px) 48vw, 100vw'
  };
  const photo = (id, w, alt, { sizes = '100vw', cls = '', eager = false, decorative = false } = {}) => {
    const ws = WIDTHS.filter((x) => x < w).concat(w);
    const srcset = ws.map((x) => `${IMG(id, x)} ${x}w`).join(', ');
    return `<img src="${IMG(id, w)}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}"` +
      (cls ? ` class="${cls}"` : '') + (decorative ? ' aria-hidden="true"' : '') +
      ` loading="${eager ? 'eager' : 'lazy'}" decoding="async"` + (eager ? ' fetchpriority="high"' : '') + '>';
  };

  function tiles(list, label) {
    return list.map((id, i) => `<button class="tile" type="button" data-full="${IMG(id, 2000)}" data-cap="${esc(label)} · ${pad(i + 1)}" aria-label="${t('lb.open')} ${i + 1}: ${esc(label)}">
        ${photo(id, 1000, `${label}, ${t('photo')} ${i + 1}`, { sizes: SIZES.tile, eager: i < 2 })}
        <span class="tile-cap" aria-hidden="true">${esc(label)} · ${pad(i + 1)}</span></button>`).join('');
  }

  const CAT_LABEL = { portraits: 'Portraits', details: 'Details', snapshots: 'Snapshots' };
  function catTiles(items) {
    return items.map(({ id, cat }, i) => {
      const label = CAT_LABEL[cat];
      return `<button class="tile" type="button" data-cat="${cat}" data-full="${IMG(id, 2000)}" data-cap="${label}" aria-label="${t('lb.open')}: ${label}">
        ${photo(id, 1000, `${label}, ${t('photo')} ${i + 1}`, { sizes: SIZES.tile })}
        <span class="tile-cap" aria-hidden="true">${label}</span></button>`;
    }).join('');
  }

  const render = {
    home() {
      const a = S.about;
      $('#hero-intro').textContent = a.heroIntro;
      $('#statement').innerHTML = esc(a.lead).replace(/(\S+)$/, '<em>$1</em>'); // last word in gold italic
      $('#about-text').innerHTML = a.paragraphs.map((p) => `<p>${p}</p>`).join('');
      $('#motto').innerHTML = a.motto.map((m) => `<span>${m}</span>`).join('');
      $('#about-bg').innerHTML = a.background.map((p) => `<p>${p}</p>`).join('');
      $('#quote-text').textContent = a.quote.text;
      $('#quote-author').textContent = a.quote.author;

      $('#strip-track').innerHTML = S.couples.map((c, i) => `
        <div class="strip-item"><a href="galerija.html?c=${c.slug}">
          <div class="frame">${photo(c.images[0], 1000, `${c.a} ${t('and')} ${c.b}`, { sizes: SIZES.third })}</div>
          <div class="strip-cap"><span class="n" aria-hidden="true">(${pad(i + 1)})</span><span class="t">${c.a} <em>&amp;</em> ${c.b}</span></div></a></div>`).join('');

      $('#tier-grid').innerHTML = ['Basic', 'Editorial', 'Premium'].map((tier, i) => {
        const foto = S.packages.find((p) => p.group === 'foto' && p.tier === tier);
        const film = S.packages.find((p) => p.group === 'film' && p.tier === tier);
        return `<article class="tier${i === 1 ? ' is-featured' : ''}">
          <header class="tier-head"><span class="num" aria-hidden="true">${pad(i + 1)}</span><h3>${tier}</h3></header>
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
          <a href="galerija.html?c=${c.slug}">
            <div class="couple-media">
              ${photo(c.images[0], 1200, `${c.a} ${t('and')} ${c.b}`, { sizes: SIZES.third, cls: 'main', eager: i < 2 })}
              ${touch ? '' : photo(c.images[1], 1200, '', { sizes: SIZES.third, cls: 'alt', decorative: true })}
              <span class="couple-cta" aria-hidden="true">${t('couple.cta')}</span>
            </div>
            <div class="couple-info">
              <span class="num" aria-hidden="true">${pad(i + 1)}</span>
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
      // the whole card is clickable, but only the visible "Details" link is in the tab order / read out
      const card = (p, i) => `
        <article class="pk-card">
          <a class="cover" href="paket.html?p=${p.slug}" tabindex="-1" aria-hidden="true"></a>
          <div class="frame natural">${photo(p.image, 1000, '', { sizes: SIZES.card, eager: i === 0 })}</div>
          <div class="pk-body">
            <div class="pk-tier"><span class="eyebrow">${p.tier}</span><span class="num" aria-hidden="true">${pad(i + 1)}</span></div>
            <h3 class="pk-name">${p.title}</h3>
            <p class="pk-short">${p.short}</p>
            <a class="link-line" href="paket.html?p=${p.slug}" aria-label="${esc(p.title)}: ${t('card.more')}">${t('card.more')}</a>
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
      $('#p-list').innerHTML = p.includes.map((item, i) => `<li><span class="num" aria-hidden="true">${pad(i + 1)}</span><span>${item}</span></li>`).join('');
      $('#p-cta').href = `kontakt.html?paket=${p.slug}`;
      $('#p-prev').href = `paket.html?p=${prev.slug}`;
      $('#p-prev-name').textContent = prev.title;
      $('#p-next').href = `paket.html?p=${next.slug}`;
      $('#p-next-name').textContent = next.title;
    },

    blog() {
      $('#posts').innerHTML = S.posts.map((p, i) => `
        <article class="post-card"><a href="post.html?p=${p.slug}">
          <div class="frame natural">${photo(p.image, 1200, p.title, { sizes: SIZES.half, eager: i < 2 })}</div>
          <div class="meta"><span class="eyebrow">${t('post.label')}</span><span class="num" aria-hidden="true">${pad(i + 1)}</span></div>
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
      $('#post-body').innerHTML = p.body.map((para) => `<p>${para}</p>`).join('');
      $('#post-next').href = `post.html?p=${next.slug}`;
      $('#post-next-name').textContent = next.title;
    },

    kontakt() {
      const sel = $('#f-package');
      sel.innerHTML = `<option value="">${t('form.undecided')}</option>` +
        ['foto', 'film'].map((g) => `<optgroup label="${g === 'foto' ? t('form.photo') : t('form.film')}">${S.packages.filter((p) => p.group === g).map((p) => `<option value="${p.slug}">${p.title}</option>`).join('')}</optgroup>`).join('');
      const pre = params.get('paket');
      if (pre && S.packages.some((p) => p.slug === pre)) sel.value = pre;
      initForm();
    }
  };

  /* ---------- gallery filters (toggle buttons, aria-pressed) ---------- */
  function initFilters() {
    $$('.filters').forEach((bar) => {
      const grid = $('.masonry', bar.closest('.section'));
      if (!grid) return;
      const btns = $$('button', bar);
      btns.forEach((b) => b.addEventListener('click', () => {
        if (b.getAttribute('aria-pressed') === 'true') return;
        const f = b.dataset.filter;
        btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        const all = $$('.tile', grid);
        const apply = () => {
          all.forEach((tile) => { tile.hidden = !(f === 'all' || tile.dataset.cat === f); });
          const shown = all.filter((tile) => !tile.hidden);
          shown.forEach((tile) => { const im = $('img', tile); if (im) im.loading = 'eager'; });
          if (window.ScrollTrigger) ScrollTrigger.refresh();
          if (hasGSAP && !reduce) gsap.fromTo(shown, { opacity: 0, y: RISE }, { opacity: 1, y: 0, duration: DUR.base, stagger: STAGGER.items, overwrite: true });
          else shown.forEach((tile) => { tile.style.opacity = 1; });
        };
        if (hasGSAP && !reduce) gsap.to(grid, { opacity: 0, duration: DUR.fast / 2, ease: 'none', onComplete: () => { apply(); gsap.to(grid, { opacity: 1, duration: DUR.fast / 2, ease: 'none' }); } });
        else apply();
      }));
    });
  }

  /* ---------- form ---------- */
  function initForm() {
    const form = $('#contact-form');
    if (!form) return;
    const rules = {
      first: (v) => (v.trim() ? '' : t('err.first')),
      last: (v) => (v.trim() ? '' : t('err.last')),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : t('err.email')),
      details: (v) => (v.trim().length > 4 ? '' : t('err.details'))
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

  /* ---------- scroll lock + inert background (menu and lightbox share it) ----------
     Lenis only stops the mouse wheel; on phones the page kept moving under the finger.
     Fixing the body in place stops that (iOS included), and the scroll position is
     handed back to Lenis afterwards so the next scroll doesn't jump. */
  let lenis = null;
  const scrollLock = (() => {
    const stack = []; // one entry per open layer (menu, lightbox): the elements it made inert
    let y = 0;
    return {
      // withHeader: also make the header unusable (lightbox); the menu keeps it for its close button
      on({ withHeader = false } = {}) {
        if (!stack.length) {
          y = window.scrollY;
          Object.assign(document.body.style, { position: 'fixed', top: `-${y}px`, left: '0', right: '0', width: '100%' });
          lenis && lenis.stop();
        }
        const els = [$('main'), $('.site-footer'), $('.skip-link'), withHeader && $('.site-header')].filter(Boolean);
        els.forEach((el) => { el.inert = true; });
        stack.push(els);
      },
      off() {
        const els = stack.pop();
        if (!els) return;
        const stillCovered = new Set(stack.flat());
        els.forEach((el) => { if (!stillCovered.has(el)) el.inert = false; });
        if (stack.length) return;
        Object.assign(document.body.style, { position: '', top: '', left: '', right: '', width: '' });
        window.scrollTo(0, y);
        if (lenis) { lenis.scrollTo(y, { immediate: true, force: true }); lenis.start(); }
      }
    };
  })();

  /* ---------- lightbox ---------- */
  function initLightbox() {
    const tileEls = $$('.masonry .tile');
    if (!tileEls.length) return;
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', t('lb.label'));
    lb.innerHTML = `<span class="lb-count" aria-live="polite"></span>
      <button class="lb-btn lb-close" type="button">${t('lb.close')}</button>
      <button class="lb-btn lb-prev" type="button" aria-label="${t('lb.prev')}"><span aria-hidden="true">←</span></button>
      <figure><img alt=""><figcaption></figcaption></figure>
      <button class="lb-btn lb-next" type="button" aria-label="${t('lb.next')}"><span aria-hidden="true">→</span></button>`;
    document.body.append(lb);
    const img = $('img', lb), cap = $('figcaption', lb), count = $('.lb-count', lb);
    const btns = $$('button', lb);
    let group = [], i = 0, opener = null, isOpen = false;

    const show = (n, dir = 0) => {
      i = (n + group.length) % group.length;
      const tile = group[i];
      img.src = tile.dataset.full;
      img.alt = $('img', tile).alt;
      cap.textContent = tile.dataset.cap;
      count.textContent = `${pad(i + 1)} / ${pad(group.length)}`;
      if (hasGSAP && !reduce) gsap.fromTo(img, { opacity: 0, x: dir * RISE }, { opacity: 1, x: 0, duration: DUR.base, overwrite: true });
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(i - 1, -1);
      else if (e.key === 'ArrowRight') show(i + 1, 1);
      else if (e.key === 'Tab') {
        const first = btns[0], last = btns[btns.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const open = (tile) => {
      opener = tile;
      group = $$('.tile', tile.closest('.masonry')).filter((x) => !x.hidden);
      isOpen = true;
      lb.classList.add('is-open');
      scrollLock.on({ withHeader: true });
      document.addEventListener('keydown', onKey); // only while open: no global listener left behind
      show(group.indexOf(tile));
      if (hasGSAP && !reduce) gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: DUR.fast, ease: 'none' });
      $('.lb-close', lb).focus({ preventScroll: true });
    };
    const close = () => {
      if (!isOpen) return;
      isOpen = false;
      document.removeEventListener('keydown', onKey);
      const done = () => { lb.classList.remove('is-open'); img.removeAttribute('src'); scrollLock.off(); opener && opener.focus({ preventScroll: true }); };
      if (hasGSAP && !reduce) gsap.to(lb, { opacity: 0, duration: DUR.fast / 1.5, ease: 'none', onComplete: done }); else done();
    };
    tileEls.forEach((tile) => tile.addEventListener('click', () => open(tile)));
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', () => show(i - 1, -1));
    $('.lb-next', lb).addEventListener('click', () => show(i + 1, 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    // horizontal swipe changes the photo; mostly-vertical moves are ignored
    let sx = 0, sy = 0;
    lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ---------- mobile menu ---------- */
  function initMenu() {
    const btn = $('.menu-btn'), menu = $('#menu'), header = $('.site-header');
    if (!btn || !menu) return;
    const items = () => $$('a, button', menu);
    let open = false, busy = false, wasLight = false, tl = null;

    const set = (state) => {
      open = state;
      btn.setAttribute('aria-expanded', String(state));
      $('.menu-label', btn).textContent = state ? t('menu.close') : t('menu.open');
      menu.inert = !state;
      document.body.classList.toggle('menu-open', state);
      if (state) scrollLock.on(); else scrollLock.off();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { toggle(); return; }
      if (e.key !== 'Tab') return;
      const f = [btn, ...items()];
      const idx = f.indexOf(document.activeElement);
      if (e.shiftKey && idx <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && idx === f.length - 1) { e.preventDefault(); f[0].focus(); }
    };
    const finishClose = () => {
      menu.style.visibility = 'hidden'; busy = false;
      // an interrupted opening can leave links half-way: reset them for the next open
      if (hasGSAP) gsap.set($$('.menu-links li > a, .menu-bottom', menu), { clearProps: 'transform,opacity' });
    };
    const toggle = (instant = false) => {
      // closing may always interrupt the opening animation; opening waits until a close has finished
      if (busy && !open && !instant) return;
      busy = !instant;
      tl && tl.kill();
      if (!open) {
        wasLight = header.classList.contains('is-light');
        set(true);
        header.classList.add('is-light');
        document.addEventListener('keydown', onKey);
        if (hasGSAP && !reduce && !instant) {
          tl = gsap.timeline({ onComplete: () => { busy = false; } })
            .set(menu, { visibility: 'visible', clipPath: 'inset(0% 0% 100% 0%)' })
            .to(menu, { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.slow, ease: EASE_IO })
            .from($$('.menu-links li > a', menu), { yPercent: 110, duration: DUR.base, stagger: STAGGER.items }, `-=${DUR.slow / 2}`)
            .from($('.menu-bottom', menu), { opacity: 0, y: RISE / 2, duration: DUR.fast }, `-=${DUR.fast}`);
        } else { Object.assign(menu.style, { visibility: 'visible', clipPath: 'none' }); busy = false; }
        // keyboard users get focus moved into the menu; on touch screens that would only draw a focus ring
        if (!touch) setTimeout(() => { const first = $('.menu-links a', menu); first && first.focus({ preventScroll: true }); }, reduce || instant ? 0 : DUR.base * 1000);
      } else {
        set(false);
        if (!wasLight) header.classList.remove('is-light');
        document.removeEventListener('keydown', onKey);
        if (hasGSAP && !reduce && !instant) {
          tl = gsap.to(menu, { clipPath: 'inset(100% 0% 0% 0%)', duration: DUR.base, ease: EASE_IO, onComplete: finishClose });
        } else { menu.style.clipPath = ''; finishClose(); }
        if (!instant) btn.focus({ preventScroll: true });
      }
    };
    btn.addEventListener('click', () => toggle());
    // if the window grows to desktop size while the menu is open, close it at once (otherwise the page stays locked)
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = (e) => { if (e.matches && open) toggle(true); };
    desktop.addEventListener ? desktop.addEventListener('change', onDesktop) : desktop.addListener(onDesktop);
  }

  /* ---------- videos ---------- */
  function initHeroVideo() {
    const box = $('.hero-media');
    if (!box) return;
    const tall = mq('(max-aspect-ratio: 4/5)');
    const srcs = tall ? S.video.heroTall : S.video.heroWide;
    // - normal speed (slowing a 25–50 fps clip makes it stutter)
    // - the next shot is started with play() first and only faded in once it is really playing:
    //   phones don't download a video that isn't playing, so waiting for it to buffer waits forever
    // - at most two videos hold a source at once; the old one is unloaded after the crossfade
    const vids = srcs.map(() => {
      const v = document.createElement('video');
      v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true; v.preload = 'auto';
      ['muted', 'playsinline', 'webkit-playsinline'].forEach((a) => v.setAttribute(a, ''));
      v.setAttribute('aria-hidden', 'true');
      box.append(v);
      return v;
    });
    const load = (i) => { if (!vids[i].getAttribute('src')) vids[i].src = srcs[i]; };
    const unload = (i) => { const v = vids[i]; v.pause(); if (v.getAttribute('src')) { v.removeAttribute('src'); v.load(); } };

    // a still frame sits underneath from the start: never an empty box, no hard cut to video
    const poster = tall ? S.video.posterTall : S.video.posterWide;
    if (poster) {
      const still = document.createElement('img');
      still.className = 'hero-still'; still.alt = ''; still.setAttribute('aria-hidden', 'true');
      still.decoding = 'async'; still.setAttribute('fetchpriority', 'high'); still.src = poster;
      box.prepend(still);
    }
    vids[0].addEventListener('playing', () => vids[0].classList.add('is-active'), { once: true });
    load(0);
    if (reduce) return; // still frame only, no motion

    let cur = 0, onScreen = true, busy = false;
    const play = (v) => { const p = v.play(); return p && p.then ? p : Promise.resolve(); };
    const playing = (v, ms = 8000) => new Promise((res, rej) => {
      if (!v.paused && v.readyState >= 3) return res();
      const ok = () => { clearTimeout(tm); res(); };
      const tm = setTimeout(() => { v.removeEventListener('playing', ok); rej(new Error('timeout')); }, ms);
      v.addEventListener('playing', ok, { once: true });
    });
    const start = () => { load(cur); play(vids[cur]).catch(() => {}); };
    start();
    onGesture(() => { if (onScreen && vids[cur].paused) start(); }); // autoplay blocked: start on a tap

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen) start(); else vids[cur].pause();
      }).observe(box);
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden) vids[cur].pause(); else if (onScreen) start(); });

    if (vids.length < 2) return;
    const SEG = 8000; // ms per shot
    setInterval(() => {
      if (!onScreen || document.hidden || busy) return;
      const prev = cur, nxt = (cur + 1) % vids.length, v = vids[nxt];
      busy = true;
      load(nxt);
      try { v.currentTime = 0; } catch (_) {}
      play(v)
        .then(() => playing(v))
        .then(() => {
          cur = nxt;
          vids.forEach((x, k) => x.classList.toggle('is-active', k === cur));
          setTimeout(() => { unload(prev); busy = false; }, XFADE + 200); // after the CSS crossfade
        })
        .catch(() => { unload(nxt); busy = false; }); // could not start: keep the current shot
    }, SEG);
  }

  // videos inside the page (About, quote, Ponuda): load when near, pause / unload when away
  function initInserts() {
    const vids = $$('video[data-src]');
    if (!vids.length) return;
    const small = mq('(max-width: 768px), (hover: none)'); // phones: lighter file, unload off screen
    const srcFor = (v) => (small && v.dataset.srcSm) || v.dataset.src;
    const inView = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target: v }) => {
        if (isIntersecting) {
          inView.add(v);
          if (!v.getAttribute('src')) { v.preload = 'auto'; v.src = srcFor(v); }
          if (!reduce) v.play().catch(() => {});
        } else {
          inView.delete(v);
          v.pause();
          if (small && v.getAttribute('src')) { v.removeAttribute('src'); v.load(); }
        }
      });
    }, { rootMargin: '200px 0px' });
    vids.forEach((v) => {
      v.muted = true; v.defaultMuted = true; v.playsInline = true;
      ['muted', 'playsinline', 'webkit-playsinline'].forEach((a) => v.setAttribute(a, ''));
      v.addEventListener('loadedmetadata', () => { if (reduce) v.currentTime = 1.5; });
      v.addEventListener('canplay', () => { if (inView.has(v) && v.paused && !reduce) v.play().catch(() => {}); });
      io.observe(v);
    });
    if (!reduce) onGesture(() => inView.forEach((v) => {
      if (!v.getAttribute('src')) v.src = srcFor(v);
      if (v.paused) v.play().catch(() => {});
    }));
  }

  /* ---------- lazy images: start loading a little before they scroll into view ---------- */
  function initLazyImages() {
    const imgs = $$('img[loading="lazy"]');
    if (!('IntersectionObserver' in window)) { imgs.forEach((i) => { i.loading = 'eager'; }); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.loading = 'eager'; io.unobserve(e.target); } });
    }, { rootMargin: touch ? '1600px 0px' : '1000px 0px' }); // phones flick fast: start earlier
    imgs.forEach((i) => io.observe(i));
  }

  /* ---------- text splitting (keeps <em> accents) ---------- */
  function splitWords(el) {
    if (el.dataset.splitDone) return $$('.w > span', el);
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

  /* ---------- smooth scroll ---------- */
  function initScroll() {
    if (reduce || typeof window.Lenis === 'undefined') return;
    // Lenis smooths the mouse wheel only; touch scrolling stays native (best feel on phones)
    lenis = new Lenis({ duration: DUR.slow, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const scrollToTarget = (target) => {
    if (lenis) { lenis.scrollTo(target, { duration: DUR.slow * 1.3 }); return; }
    const top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ---------- in-page links (#…) and page-to-page links (curtain) ---------- */
  function initLinks(curtain) {
    const norm = (p) => p.replace(/index\.html$/, ''); // "/site/" and "/site/index.html" are the same page
    const query = (u) => { const s = new URLSearchParams(u.search); s.delete('lang'); return s.toString(); }; // ?lang= doesn't make it another page
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = a.getAttribute('href');
      if (a.target === '_blank' || /^(mailto|tel):/.test(href)) return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
      const samePage = norm(url.pathname) === norm(location.pathname) && query(url) === query(location);
      const switchesLanguage = url.searchParams.has('lang');
      if (samePage && !switchesLanguage && (url.hash || href === '#top')) {
        const target = url.hash === '#top' || href === '#top' ? 0 : $(url.hash);
        if (target === null) return;
        e.preventDefault();
        scrollToTarget(target);
        if (url.hash === '#main' || a.classList.contains('skip-link')) $('main').focus({ preventScroll: true });
        return;
      }
      if (!curtain || (samePage && !switchesLanguage)) return; // plain navigation
      e.preventDefault();
      gsap.set(curtain, { display: 'grid', yPercent: 100 });
      gsap.to(curtain, { yPercent: 0, duration: DUR.base, ease: EASE_IO, onComplete: () => { location.href = url.href; } });
    });
    // back / forward from the cache: never show a closed curtain
    window.addEventListener('pageshow', (e) => { if (e.persisted && curtain) gsap.set(curtain, { display: 'none' }); });
  }

  /* ---------- header: light over dark sections, solid when scrolled, hides on scroll down ---------- */
  function headerBehaviour() {
    const header = $('.site-header');
    const darkZones = $$('[data-dark]');
    let last = 0, ticking = false;
    const TOLERANCE = 8; // px: small finger jitters must not make the header flicker in and out
    const update = () => {
      ticking = false;
      if (document.body.classList.contains('menu-open')) return;
      const y = Math.max(0, window.scrollY);
      const probe = 40;
      const overDark = darkZones.some((z) => { const r = z.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; });
      header.classList.toggle('is-light', overDark);
      // once the page moves, the header gets a background (dark over dark sections, white over white),
      // so headings scrolling underneath never collide with the logo and menu
      header.classList.toggle('is-solid', y > 40);
      const delta = y - last;
      if (Math.abs(delta) > TOLERANCE) {
        header.classList.toggle('is-hidden', delta > 0 && y > 400);
        last = y;
      }
      if (y < 400) header.classList.remove('is-hidden');
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    if (lenis) lenis.on('scroll', onScroll); else window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  /* ---------- animations ---------- */
  function animate() {
    const curtain = $('.curtain');
    initLinks(hasGSAP && !reduce ? curtain : null);
    if (!hasGSAP || reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: EASE, duration: DUR.base });
    // phones: the address bar showing/hiding must not re-measure the page (that causes jumps)
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reveal = (targets, vars = {}) => gsap.from(targets, { opacity: 0, y: RISE, ...vars });
    const onScrollIn = (trigger) => ({ trigger, start: START });

    // page enter: curtain lifts
    const enter = gsap.timeline();
    if (curtain) {
      if (page === 'home' && !store.get('nb-visited', sessionStorage)) {
        enter.to($('path', curtain), { strokeDashoffset: 0, duration: DUR.slow, ease: EASE_IO })
             .to(curtain, { yPercent: -100, duration: DUR.slow, ease: EASE_IO }, '+=0.1');
        store.set('nb-visited', '1', sessionStorage);
      } else {
        gsap.set($('path', curtain), { strokeDashoffset: 0 });
        enter.to(curtain, { yPercent: -100, duration: DUR.slow, ease: EASE_IO });
      }
      enter.set(curtain, { display: 'none' });
    }
    const afterCurtain = curtain ? `-=${DUR.slow / 2}` : 0;

    // hero name: letters rise
    const name = $('.hero-name');
    if (name) {
      name.setAttribute('aria-label', name.textContent.trim());
      name.innerHTML = name.textContent.trim().split(/\s+/)
        .map((word) => `<span class="word" aria-hidden="true">${[...word].map((ch) => `<span class="char">${ch}</span>`).join('')}</span>`).join(' ');
      enter.from($$('.char', name), { yPercent: 110, duration: DUR.slow, stagger: STAGGER.letters }, afterCurtain)
           .from('.hero-meta > *, .hero-rec', { opacity: 0, y: RISE / 2, duration: DUR.base, stagger: STAGGER.items }, `-=${DUR.base}`);
      // scrolling away: the name drifts a little slower than the page (so it never travels up into
      // the header) and is fully faded by the middle of the hero
      // desktop only: on phones the page scrolls on a separate thread from JavaScript, so anything
      // tied to the scroll position lags behind the finger and jitters; there the text simply scrolls
      const heroOut = { trigger: '.hero', start: 'top top', end: '50% top', scrub: true };
      if (!touch) gsap.fromTo('.hero-inner', { y: 0, opacity: 1 }, { y: () => window.innerHeight * 0.15, opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { ...heroOut, invalidateOnRefresh: true } });
      if (!touch) gsap.fromTo('.hero-rec', { opacity: 1 }, { opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.hero', start: 'top top', end: '20% top', scrub: true } });
      if (!touch) gsap.to('.hero-media', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    // inner page header titles
    $$('.page-hero .h1').forEach((h) => {
      enter.from(splitWords(h), { yPercent: 110, duration: DUR.slow, stagger: STAGGER.words }, afterCurtain);
      const hero = h.closest('.page-hero');
      if (!touch) gsap.to($('.media', hero), { yPercent: 12, scale: 1.06, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      // title and label fade out while scrolling away, same as on the home page
      if (!touch) gsap.fromTo($('.inner', hero), { y: 0, opacity: 1 }, { y: () => window.innerHeight * 0.1, opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: hero, start: 'top top', end: '55% top', scrub: true, invalidateOnRefresh: true } });
    });
    $$('.page-hero [data-hero-fade]').forEach((el) => enter.from(el, { opacity: 0, y: RISE / 2, duration: DUR.base }, `-=${DUR.base}`));

    // About statement: words light up while scrolling
    if (!touch) $$('[data-scrub-words]').forEach((el) => {
      const words = splitWords(el);
      gsap.set(words, { opacity: 0.14 });
      // fully lit by the time the line reaches the middle of the screen
      gsap.to(words, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 60%', scrub: true } });
    });

    // headings: words rise
    $$('[data-split]').forEach((el) => {
      gsap.from(splitWords(el), { yPercent: 110, duration: DUR.slow, stagger: STAGGER.words, scrollTrigger: onScrollIn(el) });
    });

    // text and groups
    $$('[data-reveal]').forEach((el) => reveal(el, { scrollTrigger: onScrollIn(el) }));
    $$('[data-stagger]').forEach((el) => reveal(el.children, { stagger: STAGGER.items, scrollTrigger: onScrollIn(el) }));

    // photos and video frames: a calm fade + rise. On phones a <video> must not be clipped or
    // transformed while it has a CSS filter (iOS Safari can render it blank), so only desktop
    // gets the clip reveal and the inner parallax.
    $$('[data-img]').forEach((fr) => {
      const vid = $('video', fr);
      if (!vid || touch) { reveal(fr, { duration: DUR.slow, scrollTrigger: onScrollIn(fr) }); return; }
      gsap.fromTo(fr, { clipPath: 'inset(10% 6% 10% 6%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.slow, ease: EASE_IO, scrollTrigger: onScrollIn(fr) });
      gsap.fromTo(vid, { scale: 1.15, yPercent: -3 }, { scale: 1.02, yPercent: 3, ease: 'none', scrollTrigger: { trigger: fr, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // wide video insert (Ponuda)
    $$('[data-insert]').forEach((fr) => {
      if (!touch) gsap.fromTo(fr, { clipPath: 'inset(16% 8% 16% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: fr, start: 'top 95%', end: 'top 35%', scrub: true } });
      reveal($('.label', fr), { scrollTrigger: { trigger: fr, start: 'top 55%' } });
    });

    // photo grids: items appear in small batches as they scroll in (same motion everywhere)
    const batchReveal = (items, duration = DUR.slow) => {
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: RISE });
      ScrollTrigger.batch(items, { start: START, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration, stagger: STAGGER.items, overwrite: true }) });
    };
    $$('.masonry').forEach((m) => batchReveal($$('.tile', m), touch ? DUR.fast : DUR.base));
    batchReveal($$('#strip-track .strip-item'), touch ? DUR.base : DUR.slow);

    // portfolio couples: photo opens from the bottom, caption follows (phones: a quick fade)
    const couples = $$('.couple');
    if (couples.length && touch) batchReveal(couples, DUR.base); // phones: photo shows as soon as it arrives
    else if (couples.length) {
      gsap.set(couples.map((c) => $('.couple-media', c)), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(couples.map((c) => $('.couple-info', c)), { opacity: 0, y: RISE / 2 });
      ScrollTrigger.batch(couples, {
        start: START,
        onEnter: (b) => {
          gsap.to(b.map((c) => $('.couple-media', c)), { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.slow, stagger: STAGGER.items, ease: EASE_IO });
          gsap.to(b.map((c) => $('.couple-info', c)), { opacity: 1, y: 0, duration: DUR.base, stagger: STAGGER.items, delay: DUR.slow / 3 });
        }
      });
    }

    // quote
    const q = $('#quote-text');
    if (q) {
      gsap.from(splitWords(q), { yPercent: 110, opacity: 0, duration: DUR.slow, stagger: STAGGER.words, scrollTrigger: { trigger: q, start: 'top 75%' } });
      if (!touch) gsap.fromTo('.quote video', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.quote', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    // footer name drifts in
    if (!touch) gsap.from('.footer-mark', { xPercent: -4, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.site-footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    // all grids use fixed proportions, so the page only needs re-measuring once everything has loaded
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }

  /* ---------- boot ---------- */
  injectChrome();
  applyStaticText();
  (render[page] || (() => {}))();
  document.documentElement.classList.remove('js-loading'); // content is in place: show it (see style.css)
  initScroll();
  initMenu();
  initHeroVideo();
  initInserts();
  initLazyImages();
  initLightbox();
  initFilters();
  headerBehaviour();
  // wait for the web fonts (max 1.8 s) so headings don't jump when the font swaps in;
  // the curtain covers the page meanwhile
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1800))]).then(animate);
})();
