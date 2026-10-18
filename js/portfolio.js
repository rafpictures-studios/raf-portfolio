/* ============================================
 * v2 portfolio behaviour on top of js/app.js
 * (app.js handles language, dialogs and the contact form).
 * Here: marquee loop, nav state, mobile menu, scroll reveal, word reveal,
 * stat count-up, accordion, image lightbox, YouTube player.
 * Bilingual text is in the markup as [data-l="en"] / [data-l="id"].
 * ============================================ */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* Marquee: a fresh mix of stills on every visit. Each project's stills are
     shuffled, then the projects take turns, so the strip never shows the same
     film twice in a row. */
  const track = q('.marquee-track');
  const pool = q('#marqueePool');
  const MARQUEE_COUNT = 10;
  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  if (track && pool) {
    const groups = {};
    Array.from(pool.content.children).forEach((el) => {
      (groups[el.dataset.p] = groups[el.dataset.p] || []).push(el);
    });
    // a project with only a few stills shows at most half of them, so it does not repeat every visit
    const lists = shuffle(Object.values(groups).map((g) => shuffle(g).slice(0, Math.min(4, Math.ceil(g.length / 2)))));
    const picked = [];
    for (let round = 0; picked.length < MARQUEE_COUNT && lists.some((l) => l.length); round++) {
      lists.forEach((l) => { if (l.length && picked.length < MARQUEE_COUNT) picked.push(l.shift()); });
    }
    track.replaceChildren(...picked.map((el, i) => {
      const node = document.importNode(el, true);
      const img = q('img', node);
      if (i < 4) { img.loading = 'eager'; img.fetchPriority = 'high'; }
      return node;
    }));
  }

  /* Duplicate the items once so the loop is seamless */
  if (track) {
    qa('.marquee-item', track).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.tabIndex = -1;
      track.appendChild(clone);
    });
  }

  /* Marquee speed: 60 px per second whatever the screen size (matches the reference site) */
  const MARQUEE_SPEED = 60;
  const setMarqueeSpeed = () => {
    if (!track) return;
    const distance = track.scrollWidth / 2;
    track.style.setProperty('--marquee-dur', (distance / MARQUEE_SPEED).toFixed(1) + 's');
  };
  setMarqueeSpeed();
  window.addEventListener('resize', setMarqueeSpeed);
  window.addEventListener('load', setMarqueeSpeed);

  /* Years since a given year, so the numbers stay current */
  qa('[data-since]').forEach((el) => {
    el.dataset.count = String(new Date().getFullYear() - Number(el.dataset.since));
    el.textContent = el.dataset.count;
  });

  /* Split headings into words for the staggered reveal */
  qa('.reveal-words .words').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((w, i) => `<span class="w"><span style="--i:${i}">${w}</span></span>`)
      .join(' ');
  });

  document.addEventListener('DOMContentLoaded', () => {
    /* Nav border once the page scrolls */
    const nav = q('#nav');
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Mobile menu */
    const btn = q('#v2MenuBtn');
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    };
    btn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    qa('.mobile-menu a, .mobile-menu button').forEach((el) => el.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth >= 900) setOpen(false); });

    /* Footer wordmark fills the content width */
    const giant = q('.giant');
    const fitGiant = () => {
      if (!giant) return;
      giant.style.fontSize = '100px';
      giant.style.width = 'max-content';
      const natural = giant.getBoundingClientRect().width;
      giant.style.width = '';
      giant.style.fontSize = (100 * giant.clientWidth / natural * 0.995).toFixed(2) + 'px';
    };
    fitGiant();
    window.addEventListener('resize', fitGiant);
    if (document.fonts) document.fonts.ready.then(fitGiant);

    /* Count-up */
    const countUp = (el) => {
      const end = Number(el.dataset.count);
      if (reduce || !end) { el.textContent = end; return; }
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1400);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    };

    /* Scroll reveal */
    const targets = qa('.reveal, .reveal-words');
    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
    } else {
      document.documentElement.classList.add('js-reveal');
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          qa('[data-count]', entry.target).forEach(countUp);
          io.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
      targets.forEach((el) => io.observe(el));
    }

    /* Accordion: animate <details> open and close */
    qa('.acc-item').forEach((item) => {
      const summary = q('summary', item);
      const body = q('.acc-body', item);
      summary.addEventListener('click', (e) => {
        if (reduce) return;
        e.preventDefault();
        if (item.dataset.busy) return;
        item.dataset.busy = '1';
        const opening = !item.open;
        if (opening) item.open = true;
        const h = body.scrollHeight;
        const anim = body.animate(
          [{ height: opening ? '0px' : h + 'px', opacity: opening ? 0 : 1 },
           { height: opening ? h + 'px' : '0px', opacity: opening ? 1 : 0 }],
          { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' }
        );
        item.classList.toggle('is-closing', !opening);
        anim.onfinish = () => {
          if (!opening) item.open = false;
          item.classList.remove('is-closing');
          delete item.dataset.busy;
        };
      });
    });

    /* Opened straight from disk (file://) there is no server for /api/contact,
       so the form hands the message to the visitor's email app instead. */
    if (location.protocol === 'file:') {
      document.addEventListener('submit', (e) => {
        const form = e.target.closest('form[data-form]');
        if (!form) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const d = Object.fromEntries(new FormData(form).entries());
        const body = `Name: ${d.name || ''}\nEmail: ${d.email || ''}\nPhone: ${d.phone_number || ''}\n\n${d.message || ''}`;
        location.href = `mailto:alfajririzqi@gmail.com?subject=${encodeURIComponent('Commission inquiry from ' + (d.name || ''))}&body=${encodeURIComponent(body)}`;
      }, true);
    }

    /* YouTube player */
    qa('[data-play]').forEach((el) => {
      el.addEventListener('click', () => {
        q('#playerFrame').src = CONFIG.YOUTUBE_EMBED + el.dataset.play + CONFIG.YOUTUBE_PARAMS;
        Modal.open('playerModal');
      });
    });

    /* Lightbox for gallery images */
    const lb = q('#lightbox');
    const items = qa('.g-item');
    if (lb && items.length) {
      const img = q('.lb-img', lb);
      const cap = q('.lb-cap', lb);
      let index = 0;
      const show = (i) => {
        index = (i + items.length) % items.length;
        const src = q('img', items[index]);
        img.classList.remove('is-loaded');
        img.onload = () => img.classList.add('is-loaded');
        img.src = src.dataset.full;
        img.alt = src.alt;
        cap.textContent = `${src.alt}   ${index + 1} / ${items.length}`;
      };
      items.forEach((el, i) => el.addEventListener('click', () => {
        show(i);
        lb.showModal();
        document.body.classList.add('is-locked');
      }));
      q('.lb-prev', lb).addEventListener('click', () => show(index - 1));
      q('.lb-next', lb).addEventListener('click', () => show(index + 1));
      lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lb-figure')) lb.close(); });
      lb.addEventListener('close', () => document.body.classList.remove('is-locked'));
      lb.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') show(index - 1);
        if (e.key === 'ArrowRight') show(index + 1);
      });
      let x0 = null;
      lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', (e) => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
        x0 = null;
      });
    }
  });
})();
