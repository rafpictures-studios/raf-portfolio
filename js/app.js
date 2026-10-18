/* ============================================
 * Shared app: storage, language, theme, menu, tabs, dialogs, forms, video, portfolio
 * Used by index.html and renderfarm.html.
 * ============================================ */

const Store = {
  get(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* private mode */ }
  }
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- Language ---------- */
const Lang = {
  current: 'en',

  init() {
    const saved = Store.get('language');
    this.set(saved === 'id' ? 'id' : 'en', false);
    $$('[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => this.set(btn.dataset.lang, true));
    });
  },

  set(lang, save) {
    this.current = lang;
    if (save) Store.set('language', lang);
    document.documentElement.lang = lang;
    const dict = CONFIG.TRANSLATIONS[lang];

    $$('[data-i18n]').forEach((el) => {
      const value = dict[el.dataset.i18n];
      if (value) el.textContent = value;
    });
    $$('[data-i18n-ph]').forEach((el) => {
      const value = dict[el.dataset.i18nPh];
      if (value) el.placeholder = value;
    });
    $$('[data-i18n-label]').forEach((el) => {
      const value = dict[el.dataset.i18nLabel];
      if (value) el.setAttribute('aria-label', value);
    });
    $$('[data-video-title]').forEach((el) => {
      const video = CONFIG.VIDEOS[el.dataset.videoTitle];
      if (video) el.textContent = video[lang].title;
    });
    $$('[data-lang]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  },

  t(key) {
    return CONFIG.TRANSLATIONS[this.current][key] || key;
  }
};

/* ---------- Theme (initial value is set inline in <head> to avoid a flash) ---------- */
const Theme = {
  init() {
    $$('.theme-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        document.documentElement.dataset.theme = next;
        Store.set('theme', next);
      });
    });
  }
};

/* ---------- Mobile menu ---------- */
const Menu = {
  init() {
    const bar = $('.topbar');
    const btn = $('#menuBtn');
    if (!bar || !btn) return;
    const setOpen = (open) => {
      bar.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', () => setOpen(!bar.classList.contains('is-open')));
    $$('.mobile-menu a, .mobile-menu button').forEach((el) => {
      el.addEventListener('click', () => setOpen(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }
};

/* ---------- Links / Assets tabs (also driven by #links / #assets) ---------- */
const Tabs = {
  init() {
    const panels = $$('.panel');
    if (!panels.length) return;

    const show = (name, animate) => {
      if (!['links', 'assets'].includes(name)) name = 'links';
      panels.forEach((p) => {
        const on = p.id === `panel-${name}`;
        p.hidden = !on;
        p.classList.remove('is-entering');
        if (on && animate) {
          void p.offsetWidth;
          p.classList.add('is-entering');
        }
      });
      $$('[data-tab]').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn.dataset.tab === name));
      });
      $$('[data-nav]').forEach((a) => {
        if (a.dataset.nav === name) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };

    $$('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        history.replaceState(null, '', `#${btn.dataset.tab}`);
        show(btn.dataset.tab, true);
      });
    });

    window.addEventListener('hashchange', () => {
      show(location.hash.slice(1), true);
      const tabs = $('.tabs');
      if (tabs) tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    show(location.hash.slice(1), false);
  }
};

/* ---------- Dialogs ---------- */
const Modal = {
  open(id) {
    const d = document.getElementById(id);
    if (!d || d.open) return;
    d.showModal();
    document.body.classList.add('is-locked');
  },

  close(id) {
    const d = document.getElementById(id);
    if (d && d.open) d.close();
  },

  init() {
    $$('dialog.modal').forEach((d) => {
      // click on the backdrop closes
      d.addEventListener('click', (e) => {
        if (e.target === d) d.close();
      });
      d.addEventListener('close', () => {
        if (!$$('dialog.modal').some((x) => x.open)) document.body.classList.remove('is-locked');
        d.dispatchEvent(new Event('closed'));
      });
    });
    $$('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => btn.closest('dialog').close());
    });
    $$('[data-open]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        Modal.open(el.dataset.open);
      });
    });
  }
};

/* ---------- Forms: sent to our own Vercel functions (/api/contact, /api/subscribe) ---------- */
const Forms = {
  ERRORS: {
    invalid: 'error_invalid',
    rate_limited: 'error_rate',
    send_failed: 'error_send'
  },

  init() {
    $$('form[data-form]').forEach((form) => {
      this.stamp(form);
      form.closest('dialog')?.addEventListener('close', () => this.status(form, ''));
      $$('[data-open]').forEach((el) => {
        if (el.dataset.open === form.closest('dialog')?.id) el.addEventListener('click', () => this.stamp(form));
      });
      form.addEventListener('submit', (e) => this.submit(e, form));
    });
  },

  // Time the form was opened; the server rejects instant (bot) submissions.
  stamp(form) {
    const t = form.querySelector('input[name="_t"]');
    if (t) t.value = String(Date.now());
  },

  status(form, key) {
    const el = form.querySelector('.form-status');
    if (!el) return;
    el.hidden = !key;
    el.textContent = key ? Lang.t(key) : '';
  },

  async submit(e, form) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const label = btn.querySelector('[data-i18n]');
    const original = label.textContent;
    btn.disabled = true;
    label.textContent = Lang.t('sending');
    this.status(form, '');

    const data = Object.fromEntries(new FormData(form).entries());
    if (data.phone_number !== undefined) {
      data.phone = data.phone_number;
      delete data.phone_number;
    }
    data.lang = Lang.current;

    let errorKey = null;
    try {
      const res = await fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) errorKey = this.ERRORS[json.error] || 'error_send';
    } catch (_) {
      errorKey = 'error_network';
    }

    btn.disabled = false;
    label.textContent = original;

    if (errorKey) {
      this.status(form, errorKey);
      return;
    }

    form.reset();
    this.stamp(form);
    form.closest('dialog')?.close();
    const msg = $('#doneMessage');
    if (msg) msg.textContent = Lang.t(form.dataset.form === 'subscribe' ? 'done_subscribe' : 'done_commission');
    setTimeout(() => Modal.open('doneModal'), 120);
  }
};

/* ---------- Showcase video: preview, then embedded player ---------- */
const Video = {
  currentId: null,

  init() {
    $$('[data-video]').forEach((el) => {
      el.addEventListener('click', () => this.preview(el.dataset.video));
    });
    $('#watchFullBtn')?.addEventListener('click', () => this.play());
    $('#playerModal')?.addEventListener('closed', () => {
      $('#playerFrame').src = 'about:blank';
    });
    document.addEventListener('langchange', () => {
      if (this.currentId && $('#previewModal')?.open) this.fill(this.currentId);
    });
  },

  fill(id) {
    const v = CONFIG.VIDEOS[id];
    const text = v[Lang.current];
    $('#previewImg').src = v.preview;
    $('#previewImg').alt = text.title;
    $('#previewTitle').textContent = text.title;
    $('#previewDesc').textContent = text.desc;
  },

  preview(id) {
    if (!CONFIG.VIDEOS[id]) return;
    this.currentId = id;
    this.fill(id);
    Modal.open('previewModal');
  },

  play() {
    if (!this.currentId) return;
    Modal.close('previewModal');
    $('#playerFrame').src = CONFIG.YOUTUBE_EMBED + this.currentId + CONFIG.YOUTUBE_PARAMS;
    setTimeout(() => Modal.open('playerModal'), 60);
  }
};

/* ---------- Portfolio flipbook (loaded on first open) ---------- */
const Portfolio = {
  init() {
    const frame = $('#portfolioFrame');
    if (!frame) return;
    $$('[data-open="portfolioModal"]').forEach((el) => {
      el.addEventListener('click', () => {
        if (frame.src && frame.src !== 'about:blank') return;
        frame.addEventListener('load', () => $('#portfolioLoading')?.setAttribute('hidden', ''), { once: true });
        frame.src = CONFIG.PORTFOLIO_URL;
      });
    });
  }
};

/* ---------- Discount code copy ---------- */
const Copy = {
  init() {
    const btn = $('#copyBtn');
    const input = $('#discountCode');
    if (!btn || !input) return;
    input.value = CONFIG.DISCOUNT_CODE;
    btn.addEventListener('click', async () => {
      input.select();
      try {
        await navigator.clipboard.writeText(input.value);
      } catch (_) {
        document.execCommand && document.execCommand('copy');
      }
      const label = btn.querySelector('[data-i18n]');
      const icon = btn.querySelector('.ph');
      label.dataset.i18n = 'copied';
      label.textContent = Lang.t('copied');
      icon.className = 'ph ph-check';
      setTimeout(() => {
        label.dataset.i18n = 'copy';
        label.textContent = Lang.t('copy');
        icon.className = 'ph ph-copy';
      }, 2000);
    });
  }
};

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  Lang.init();
  Theme.init();
  Menu.init();
  Tabs.init();
  Modal.init();
  Forms.init();
  Video.init();
  Portfolio.init();
  Copy.init();
});
