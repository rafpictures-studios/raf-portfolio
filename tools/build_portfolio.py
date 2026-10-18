"""
Builds the v2 portfolio site (static HTML) from tools/portfolio_data.py.

  python tools/build_portfolio.py                 # HTML only
  python tools/build_portfolio.py --images DIR    # also convert source images from DIR

Outputs:
  v2/index.html, v2/work/<slug>.html
  assets/portfolio/<slug>/<name>-1600.webp and -800.webp
Needs Pillow for --images.
"""
import html
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from portfolio_data import PROJECTS, EXPERIENCE, SKILLS, MARQUEE  # noqa: E402

WA = "https://api.whatsapp.com/send?phone=6289513170863"
IG = "https://www.instagram.com/rizqyalfajri"
YT = "https://youtube.com/@rafpictures_studios"
MAIL = "mailto:alfajririzqi@gmail.com"
BIO = "https://raf-bio-link.vercel.app"  # the RAF Pictures bio link
COURSE = "https://academy.devatastudio.com/kursus/procedural-environment"
VER = "4"

e = html.escape


def L(d, tag="span", cls=""):
    """English text (the site is English only). Data may still hold old "id" strings; they are ignored."""
    text = d if isinstance(d, str) else d["en"]
    return f'<{tag} class="{cls}">{e(text)}</{tag}>' if cls else e(text)


def card_poster(p):
    """Home card shows the poster unless the project asks for its wide cover."""
    return bool(p.get("poster")) and p.get("card", "poster") == "poster"


def en(d):
    return d if isinstance(d, str) else d["en"]


def img_path(slug, name, size):
    return f"assets/portfolio/{slug}/{name}-{size}.webp"


def picture(slug, name, alt="", sizes="(min-width: 720px) 50vw, 100vw", lazy=True, cls="", full=False):
    small, big = img_path(slug, name, 800), img_path(slug, name, 1600)
    w, h = SIZES.get((slug, name), (1600, 900))
    attrs = f' class="{cls}"' if cls else ""
    lz = ' loading="lazy" decoding="async"' if lazy else ' fetchpriority="high"'
    data = f' data-full="{big}"' if full else ""
    return (f'<img{attrs} src="{small}" srcset="{small} 800w, {big} 1600w" sizes="{sizes}" '
            f'width="{w}" height="{h}" alt="{e(alt)}"{lz}{data}>')


SIZES = {}

# ---------------------------------------------------------------- images


def convert_images(src_dir):
    from PIL import Image

    jobs = [("about", "portrait", "i-002-004.png"), ("about", "portrait-2", "i-037-111.png")]
    for p in PROJECTS:
        if p.get("feature", {}).get("image_src"):
            jobs.append((p["slug"], p["feature"]["image"], p["feature"]["image_src"]))
        for item in [p.get("poster"), p.get("cover")]:
            if item:
                jobs.append((p["slug"], item[1], item[0]))
        for s in p["sets"]:
            for src, name in s["images"]:
                jobs.append((p["slug"], name, src))
    done = set()
    for slug, name, src in jobs:
        if (slug, name) in done:
            continue
        done.add((slug, name))
        out_dir = os.path.join(ROOT, "assets", "portfolio", slug)
        os.makedirs(out_dir, exist_ok=True)
        im = Image.open(os.path.join(src_dir, src)).convert("RGB")
        for size, q in ((1600, 80), (800, 76)):
            limit = size * 1.5 if im.width / im.height > 2.5 else size  # wide turntable strips
            c = im.copy()
            if c.width > limit:
                c = c.resize((int(limit), round(c.height * limit / c.width)), Image.LANCZOS)
            c.save(os.path.join(out_dir, f"{name}-{size}.webp"), "WEBP", quality=q, method=6)
    print(f"converted {len(done)} images")


def read_sizes():
    from PIL import Image
    base = os.path.join(ROOT, "assets", "portfolio")
    for slug in os.listdir(base):
        for f in os.listdir(os.path.join(base, slug)):
            if f.endswith("-1600.webp"):
                with Image.open(os.path.join(base, slug, f)) as im:
                    SIZES[(slug, f[:-10])] = im.size


# ---------------------------------------------------------------- shared parts

NAV_ITEMS = [
    ("v2/#work", {"en": "Work", "id": "Karya"}, f"<sup>({len(PROJECTS)})</sup>"),
    ("v2/#about", {"en": "About", "id": "Tentang"}, ""),
    ("v2/#experience", {"en": "Experience", "id": "Pengalaman"}, ""),
    ("v2/#contact", {"en": "Contact", "id": "Kontak"}, ""),
]


def nav_links():
    return "\n".join(f'<a href="{h}">{L(t)}{sup}</a>' for h, t, sup in NAV_ITEMS)


def head(title, desc, image):
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="/">
  <title>{e(title)}</title>
  <meta name="description" content="{e(desc)}">
  <meta name="theme-color" content="#0a0a0a">
  <meta property="og:title" content="{e(title)}">
  <meta property="og:description" content="{e(desc)}">
  <meta property="og:image" content="{image}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="assets/icons/web-icon.png">
  <link rel="preload" href="assets/fonts/inter-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/icons.css">
  <link rel="stylesheet" href="v2/css/v2.css?v={VER}">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="nav" id="nav">
    <div class="wrap nav-inner">
      <a class="wordmark" href="v2/" aria-label="Rizki Alfajri, home">RIZKI ALFAJRI</a>
      <nav class="nav-links" aria-label="Sections">
        {nav_links()}
      </nav>
      <div class="nav-end">
        <a class="link-arrow nav-bio" href="{BIO}"><i class="ph ph-arrow-left" aria-hidden="true"></i><span>Bio link</span></a>
        <button type="button" class="link-arrow nav-cta" data-open="commissionModal">{L({"en": "Get in touch", "id": "Hubungi saya"})}<i class="ph ph-arrow-right" aria-hidden="true"></i></button>
        <button type="button" class="menu-btn" id="v2MenuBtn" aria-expanded="false" aria-controls="v2Menu">Menu<span class="menu-icon" aria-hidden="true"></span></button>
      </div>
    </div>
    <div class="mobile-menu" id="v2Menu">
      <div class="wrap">
        {nav_links()}
        <button type="button" class="link-arrow" data-open="commissionModal">{L({"en": "Get in touch", "id": "Hubungi saya"})}<i class="ph ph-arrow-right" aria-hidden="true"></i></button>
        <a class="link-arrow mobile-bio" href="{BIO}"><i class="ph ph-arrow-left" aria-hidden="true"></i><span>Back to bio link</span></a>
      </div>
    </div>
  </header>
"""


def footer():
    return f"""
  <footer class="sec sec--dark footer">
    <div class="wrap">
      <div class="footer-top">
        <nav class="footer-links" aria-label="Footer">
          {nav_links()}
          <a href="{BIO}">Bio link</a>
        </nav>
        <ul class="socials">
          <li><a href="{IG}" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="{YT}" target="_blank" rel="noopener noreferrer">YouTube</a></li>
          <li><a href="{WA}" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          <li><a href="{MAIL}">Email</a></li>
        </ul>
      </div>
      <hr class="rule">
      <p class="giant" aria-hidden="true">RIZKI ALFAJRI</p>
      <div class="footer-bottom">
        <p>&copy; <span data-year>2026</span> RAF Pictures. {L({"en": "All rights reserved.", "id": "Hak cipta dilindungi."})}</p>
        <p>{L({"en": "Sumedang, West Java, Indonesia", "id": "Sumedang, Jawa Barat, Indonesia"})}</p>
      </div>
    </div>
  </footer>
"""


def dialogs():
    return """
  <dialog class="modal" id="commissionModal" aria-labelledby="commissionTitle">
    <div class="modal-body">
      <button type="button" class="modal-close" data-close data-i18n-label="close" aria-label="Close"><i class="ph ph-x" aria-hidden="true"></i></button>
      <div class="modal-head">
        <h2 id="commissionTitle" data-i18n="modal_commission_title">Open commission</h2>
        <p data-i18n="modal_commission_desc">Send me a message for work inquiries.</p>
      </div>
      <form class="form" action="/api/contact" method="POST" data-form="commission" novalidate>
        <div class="hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
        <input type="hidden" name="_t" value="">
        <div class="field">
          <label for="cName" data-i18n="form_name">Name</label>
          <input class="input" type="text" id="cName" name="name" required autocomplete="name">
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="cEmail" data-i18n="form_email">Email</label>
            <input class="input" type="email" id="cEmail" name="email" required autocomplete="email">
          </div>
          <div class="field">
            <label for="cPhone" data-i18n="form_phone">Phone</label>
            <input class="input" type="tel" id="cPhone" name="phone_number" required inputmode="numeric" pattern="[0-9]*" autocomplete="tel" oninput="this.value=this.value.replace(/[^0-9]/g,'')">
          </div>
        </div>
        <div class="field">
          <label for="cMessage" data-i18n="form_message">Project brief</label>
          <textarea class="input" id="cMessage" name="message" rows="4" required data-i18n-ph="form_message_ph" placeholder="Describe your project here"></textarea>
        </div>
        <p class="form-status" role="alert" hidden></p>
        <button type="submit" class="btn btn--block"><span data-i18n="form_send">Send message</span><i class="ph ph-arrow-right" aria-hidden="true"></i></button>
      </form>
    </div>
  </dialog>

  <dialog class="modal" id="doneModal" aria-labelledby="doneTitle">
    <div class="modal-body">
      <button type="button" class="modal-close" data-close data-i18n-label="close" aria-label="Close"><i class="ph ph-x" aria-hidden="true"></i></button>
      <div class="modal-head">
        <h2 id="doneTitle" data-i18n="done_title">Thank you</h2>
        <p id="doneMessage">Your message has been sent.</p>
      </div>
      <button type="button" class="btn btn--block" data-close><span data-i18n="close">Close</span></button>
    </div>
  </dialog>

  <dialog class="modal modal--video" id="playerModal" aria-label="YouTube video player">
    <button type="button" class="modal-close" data-close data-i18n-label="close" aria-label="Close"><i class="ph ph-x" aria-hidden="true"></i></button>
    <div class="video-frame">
      <iframe id="playerFrame" src="about:blank" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
  </dialog>

  <dialog class="lightbox" id="lightbox" aria-label="Image viewer">
    <button type="button" class="lb-btn lb-close" data-close aria-label="Close"><i class="ph ph-x" aria-hidden="true"></i></button>
    <button type="button" class="lb-btn lb-prev" aria-label="Previous image"><i class="ph ph-arrow-left" aria-hidden="true"></i></button>
    <figure class="lb-figure"><img class="lb-img" src="" alt=""><figcaption class="lb-cap"></figcaption></figure>
    <button type="button" class="lb-btn lb-next" aria-label="Next image"><i class="ph ph-arrow-right" aria-hidden="true"></i></button>
  </dialog>
"""


def scripts():
    return f"""
  <script src="js/config.js?v=4"></script>
  <script>CONFIG.TRANSLATIONS.id = CONFIG.TRANSLATIONS.en;</script>
  <script src="js/app.js?v=4"></script>
  <script src="v2/js/v2.js?v={VER}"></script>
</body>
</html>
"""


def ptitle(p):
    return p["title"]


# ---------------------------------------------------------------- home


def home():
    # Every wide still outside Kancil goes into a pool; portfolio.js picks a fresh,
    # mixed set from it on each visit. The fixed MARQUEE list is the no-JS fallback.
    pool = []
    for p in PROJECTS:
        if p["slug"] == "kancil":
            continue
        for st in p["sets"]:
            for _, name in st["images"]:
                w, h = SIZES.get((p["slug"], name), (16, 9))
                if 1.3 <= w / h <= 2.6:
                    pool.append((p["slug"], name))
    marquee = "\n".join(
        f'<a class="marquee-item" href="v2/work/{slug}.html" data-p="{slug}">{picture(slug, name, "", "480px", lazy=True)}</a>'
        for slug, name in pool
    )
    fallback = "\n".join(
        f'<a class="marquee-item" href="v2/work/{slug}.html">{picture(slug, name, "", "480px", lazy=i > 3)}</a>'
        for i, (slug, name) in enumerate(MARQUEE)
    )
    cards = []
    for i, p in enumerate(PROJECTS):
        num = f"{i + 1:02d}"
        cards.append(f"""
          <a class="work reveal{' work--poster' if card_poster(p) else ' work--wide'}" href="v2/work/{p['slug']}.html">
            <span class="work-media">{picture(p['slug'], (p['poster'] if card_poster(p) else p['cover'])[1], en(p['title']), "(min-width: 1000px) 25vw, 50vw" if card_poster(p) else "100vw")}<span class="work-go"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></span>
            <span class="work-row"><span class="work-title">{L(p['title'])}</span><span class="work-num">{num}</span></span>
            <span class="work-meta">{L(p['type'])}, {e(p['years'])}{'<span class="badge">Unreleased</span>' if p.get('private') else ''}</span>
          </a>""")
    exp = []
    for i, x in enumerate(EXPERIENCE):
        pts_en = "".join(f"<li>{e(t)}</li>" for t in x["points"]["en"])
        pts_id = "".join(f"<li>{e(t)}</li>" for t in x["points"]["id"])
        exp.append(f"""
          <details class="acc-item reveal"{' open' if i == 0 else ''}>
            <summary>
              <span class="exp-head"><span class="acc-title">{e(x['role'])}</span><span class="exp-company">{e(x['company'])}</span></span>
              <span class="exp-years">{L({"en": x['years'], "id": x['years_id']})}</span>
              <span class="acc-sign" aria-hidden="true"></span>
            </summary>
            <div class="acc-body"><div class="exp-body">
              <ul class="ticks">{pts_en}</ul>
            </div></div>
          </details>""")
    skills = "\n".join(
        f'<li class="skill reveal"><span class="skill-title">{e(t)}</span><span class="skill-desc">{L(d)}</span></li>'
        for t, d in SKILLS
    )
    return head(
        "Rizki Alfajri | Lead Asset Artist, 3D environment portfolio",
        "Portfolio of Rizki Alfajri, Lead Asset Artist at Visinema Studios. 3D environments and props for Jumbo, BoBoiBoy Galaxy Baraju, Kancil and Nussa.",
        img_path("jumbo", "cover", 1600),
    ) + f"""
  <main id="main">
    <section class="sec sec--dark hero" id="top">
      <div class="wrap">
        <p class="eyebrow reveal">{L({"en": "3D Artist, 2017 to now", "id": "3D Artist, 2017 sampai sekarang"})}</p>
        <h1 class="display reveal-words">{L({"en": "Building 3D worlds for animated film and series", "id": "Membangun dunia 3D untuk film dan serial animasi"}, cls="words")}</h1>
      </div>
      <div class="marquee" aria-label="Selected stills">
        <div class="marquee-track"><noscript>
          {fallback}
        </noscript></div>
        <template id="marqueePool">
          {marquee}
        </template>
      </div>
      <div class="wrap hero-foot reveal">
        <p class="lead">{L({"en": "Rizki Alfajri, Lead Asset Artist at Visinema Studios. Environments and props for Jumbo, BoBoiBoy, Kancil and Nussa.", "id": "Rizki Alfajri, Lead Asset Artist di Visinema Studios. Environment dan props untuk Jumbo, BoBoiBoy, Kancil, dan Nussa."})}</p>
        <ul class="socials">
          <li><a href="{WA}" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          <li><a href="{IG}" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="{YT}" target="_blank" rel="noopener noreferrer">YouTube</a></li>
          <li><a href="{MAIL}">Email</a></li>
        </ul>
      </div>
    </section>

    <section class="sec sec--light" id="about">
      <div class="wrap">
        <div class="split reveal">
          <h2 class="h2">{L({"en": "Hello. I am Fajri, and I lead 3D asset production at Visinema Studios", "id": "Halo. Saya Fajri, dan saya memimpin produksi aset 3D di Visinema Studios"})}</h2>
          <p class="side">{L({"en": "A 3D artist with an environment background, working since 2017. I entered the animation industry in 2022 on the feature film Jumbo, and I also mentor Procedural Environment at Devata Academy.", "id": "3D artist dengan latar environment, berkarya sejak 2017. Saya masuk industri animasi pada 2022 lewat film Jumbo, dan juga menjadi mentor Procedural Environment di Devata Academy."})}</p>
        </div>
        <hr class="rule">
        <div class="about-grid">
          <figure class="about-media reveal"><img src="{img_path('about', 'portrait', 800)}" width="{SIZES.get(('about','portrait'),(800,1200))[0]}" height="{SIZES.get(('about','portrait'),(800,1200))[1]}" alt="Portrait of Rizki Alfajri" loading="lazy"></figure>
          <ul class="about-points reveal">
            <li>{L({"en": "Sets, layout and set dressing", "id": "Set, layout, dan set dressing"})}</li>
            <li>{L({"en": "Props and production assets", "id": "Props dan aset produksi"})}</li>
            <li>{L({"en": "Procedural worlds and Blender tools", "id": "Dunia prosedural dan tools Blender"})}</li>
          </ul>
          <dl class="stats reveal">
            <div><dt><span data-count data-since="2017">9</span>+</dt><dd>{L({"en": "Years in 3D", "id": "Tahun di dunia 3D"})}</dd></div>
            <div><dt><span data-count data-since="2022">4</span>+</dt><dd>{L({"en": "Years in the animation industry", "id": "Tahun di industri animasi"})}</dd></div>
            <div><dt><span data-count="5">5</span></dt><dd>{L({"en": "Film and series productions", "id": "Produksi film dan serial"})}</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="sec sec--dark" id="work">
      <div class="wrap">
        <div class="split reveal">
          <h2 class="h2">{L({"en": "Selected work", "id": "Karya pilihan"})}</h2>
          <p class="side">{L({"en": "Environments, props and still frames from studio productions and personal projects, 2022 to 2025.", "id": "Environment, props, dan still frame dari produksi studio dan proyek personal, 2022 sampai 2025."})}</p>
        </div>
        <hr class="rule">
        <div class="work-grid">{''.join(cards)}
        </div>
      </div>
    </section>

    <section class="sec sec--light" id="experience">
      <div class="wrap">
        <div class="split reveal">
          <h2 class="h2">{L({"en": "Experience", "id": "Pengalaman"})}</h2>
          <p class="side">{L({"en": "From freelance commissions to leading an asset team.", "id": "Dari komisi freelance sampai memimpin tim aset."})}</p>
        </div>
        <div class="acc">{''.join(exp)}
        </div>
      </div>
    </section>

    <section class="sec sec--dark" id="skills">
      <div class="wrap">
        <div class="split reveal">
          <h2 class="h2">{L({"en": "What I do best", "id": "Keahlian saya"})}</h2>
          <div class="side">
            <p>{L({"en": "I also teach a full Procedural Environment course on Devata Academy.", "id": "Saya juga mengajar kursus Procedural Environment lengkap di Devata Academy."})}</p>
            <a class="link-arrow" href="{COURSE}" target="_blank" rel="noopener noreferrer">{L({"en": "View the course", "id": "Lihat kursusnya"})}<i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
          </div>
        </div>
        <hr class="rule">
        <ul class="skills">
          {skills}
        </ul>
      </div>
    </section>

    <section class="sec sec--light cta" id="contact">
      <div class="wrap split reveal">
        <h2 class="h2">{L({"en": "Let us bring your next world to life", "id": "Mari hidupkan dunia Anda berikutnya"})}</h2>
        <div class="side">
          <p>{L({"en": "Open for studio roles, freelance environments and asset work. Send a short brief, or email me directly.", "id": "Terbuka untuk posisi studio, environment freelance, dan pengerjaan aset. Kirim brief singkat, atau email saya langsung."})}</p>
          <a class="mail" href="{MAIL}">alfajririzqi@gmail.com</a>
          <div class="actions">
            <button type="button" class="btn" data-open="commissionModal">{L({"en": "Get in touch", "id": "Hubungi saya"})}<i class="ph ph-arrow-right" aria-hidden="true"></i></button>
            <a class="link-arrow" href="{WA}" target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
            <a class="link-arrow" href="{BIO}"><i class="ph ph-arrow-left" aria-hidden="true"></i><span>Back to bio link</span></a>
          </div>
        </div>
      </div>
    </section>
  </main>
""" + footer() + dialogs() + scripts()


# ---------------------------------------------------------------- project pages


def set_block(p, s, idx):
    kind = s["kind"]
    items = []
    cap_base = f"{en(p['title'])}, {en(s['name'])}"
    for j, (_, name) in enumerate(s["images"]):
        sizes = "100vw"
        if kind in ("env", "props4") or (kind in ("env3", "still") and j > 0):
            sizes = "(min-width: 720px) 50vw, 100vw"
        if kind == "props4":
            sizes = "(min-width: 900px) 25vw, 50vw"
        if kind == "props3":
            sizes = "(min-width: 720px) 33vw, 100vw"
        items.append(
            f'<button type="button" class="g-item" data-cap="{e(cap_base)}">'
            f'{picture(p["slug"], name, cap_base + f" {j + 1}", sizes, full=True)}</button>'
        )
    note = f'<p class="set-note">{L(s["note"])}</p>' if s.get("note") else ""
    if s.get("video"):
        vid, label = s["video"]
        note += (f'<p class="set-actions"><button type="button" class="link-arrow" data-play="{vid}">'
                 f'<i class="ph-fill ph-play" aria-hidden="true"></i>{L(label)}</button></p>')
    return f"""
      <article class="set reveal">
        <header class="set-head">
          <span class="set-num">{idx:02d}</span>
          <h2 class="set-title">{L(s['name'])}</h2>
          <span class="set-code">{e(s['code'])}</span>
          <span class="set-year">{e(s['year'])}</span>
        </header>
        {note}
        <div class="gallery gallery--{kind}">
          {''.join(items)}
        </div>
      </article>"""


def project_page(i):
    p = PROJECTS[i]
    nxt = PROJECTS[(i + 1) % len(PROJECTS)]
    t = en(p["title"])
    meta = [
        ({"en": "Type", "id": "Jenis"}, L(p["type"])),
        ({"en": "Role", "id": "Peran"}, L(p["role"])),
        ({"en": "Studio", "id": "Studio"}, L(p["studio"])),
        ({"en": "Year", "id": "Tahun"}, e(p["years"])),
    ]
    meta_html = "".join(f"<div><dt>{L(k)}</dt><dd>{v}</dd></div>" for k, v in meta)
    videos = "".join(
        f'<button type="button" class="link-arrow" data-play="{vid}"><i class="ph-fill ph-play" aria-hidden="true"></i>{L(label)}</button>'
        for vid, label in p["videos"]
    )
    videos_html = f'<div class="actions">{videos}</div>' if videos else ""
    poster = ""
    if p.get("poster"):
        poster = f'<figure class="poster reveal">{picture(p["slug"], p["poster"][1], t + " poster", "(min-width: 900px) 30vw, 60vw", lazy=False)}</figure>'
    private = p.get("private")
    sets = "" if private else "".join(set_block(p, s, k + 1) for k, s in enumerate(p["sets"]))
    upcoming = ""
    feat = p.get("feature")
    if p.get("upcoming"):
        u = p["upcoming"]
        feat = {"tag": "Upcoming", "title": u["title"], "meta": u["meta"], "text": u["text"], "video": u["video"]}
    if feat:
        if feat.get("video"):
            vid, label = feat["video"]
            media_img = f'<img src="https://i.ytimg.com/vi/{vid}/maxresdefault.jpg" alt="" width="1280" height="720" loading="lazy">'
            media = (f'<button type="button" class="upcoming-media" data-play="{vid}" aria-label="{e(label)}, {e(feat["title"])}">'
                     f'{media_img}<span class="upcoming-play"><i class="ph-fill ph-play" aria-hidden="true"></i></span></button>')
            action = f'<button type="button" class="link-arrow" data-play="{vid}"><i class="ph-fill ph-play" aria-hidden="true"></i>{e(label)}</button>'
        else:
            url, label = feat["link"]
            media = (f'<a class="upcoming-media" href="{url}" target="_blank" rel="noopener noreferrer" aria-label="{e(label)}">'
                     f'{picture(p["slug"], feat["image"], "", "(min-width: 900px) 55vw, 100vw")}'
                     f'<span class="upcoming-play upcoming-play--corner"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></a>')
            action = f'<a class="link-arrow" href="{url}" target="_blank" rel="noopener noreferrer"><span>{e(label)}</span><i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>'
        upcoming = f"""
        <article class="upcoming reveal">
          {media}
          <div class="upcoming-copy">
            <span class="upcoming-tag">{e(feat['tag'])}</span>
            <h2 class="set-title">{e(feat['title'])}</h2>
            <p class="upcoming-meta">{e(feat['meta'])}</p>
            <p>{e(feat['text'])}</p>
            {action}
          </div>
        </article>"""
    count = sum(len(s["images"]) for s in p["sets"])
    hint = f'<p class="gallery-hint reveal">{count} {L({"en": "images. Tap any image to view it full size.", "id": "gambar. Ketuk gambar untuk melihat ukuran penuh."})}</p>'
    if private:
        hint = """
        <article class="private-note reveal">
          <span class="upcoming-tag">Unreleased</span>
          <h2 class="set-title">Under wraps until release</h2>
          <p>This film has not been released yet, so the sets and props I built for it stay private for now. The full breakdown goes up here after the premiere.</p>
          <button type="button" class="link-arrow" data-open="commissionModal"><span>Ask for a private viewing</span><i class="ph ph-arrow-right" aria-hidden="true"></i></button>
        </article>"""
    share = p["poster"] if private else p["cover"]
    return head(
        f"{t} | Rizki Alfajri portfolio",
        p["summary"]["en"][:155],
        img_path(p["slug"], share[1], 1600),
    ) + f"""
  <main id="main">
    <section class="sec sec--dark project-hero">
      <div class="wrap">
        <a class="back link-arrow" href="v2/#work"><i class="ph ph-arrow-left" aria-hidden="true"></i>{L({"en": "All work", "id": "Semua karya"})}</a>
        <div class="project-intro{' project-intro--poster' if poster else ''}">
          <div>
            <p class="eyebrow">{e(f"{i + 1:02d}")} / {e(f"{len(PROJECTS):02d}")}{'<span class="badge">Unreleased</span>' if private else ''}</p>
            <h1 class="display reveal-words">{L(p['title'], cls='words') if not isinstance(p['title'], str) else f'<span class="words">{e(t)}</span>'}</h1>
            <p class="lead project-summary reveal">{L(p['summary'])}</p>
            {videos_html}
          </div>
          {poster}
        </div>
        <dl class="meta reveal">{meta_html}</dl>
      </div>
    </section>

    <section class="sec sec--dark project-body">
      <div class="wrap">
        {upcoming}
        {hint}
        {sets}
      </div>
    </section>

    <section class="sec sec--light next">
      <div class="wrap">
        <a class="next-link reveal" href="v2/work/{nxt['slug']}.html">
          <span class="eyebrow">{L({"en": "Next project", "id": "Proyek berikutnya"})}</span>
          <span class="next-row">
            <span class="next-title">{L(nxt['title'])}</span>
            <i class="ph ph-arrow-right" aria-hidden="true"></i>
          </span>
          <span class="next-media{' next-media--poster' if nxt.get('private') else ''}">{picture(nxt['slug'], (nxt['poster'] if nxt.get('private') else nxt['cover'])[1], '', '(min-width: 900px) 60vw, 100vw')}</span>
        </a>
      </div>
    </section>
  </main>
""" + footer() + dialogs() + scripts()


# ---------------------------------------------------------------- standalone project

import re  # noqa: E402

URL_ATTR = re.compile(r'(href|src|data-full|action)="([^"]*)"')
SRCSET = re.compile(r'srcset="([^"]*)"')


def to_standalone(page, depth):
    """Rewrite a v2 page so it works from any folder, even opened with a double-click.
    depth 0 = index.html, 1 = work/<slug>.html"""
    page = page.replace('  <base href="/">\n', "")
    # a font preload fails over file:// (CORS); the @font-face rule still loads it
    page = re.sub(r'  <link rel="preload"[^>]*>\n', "", page)
    # the footer link back to the bio link has no home in a standalone project
    page = re.sub(r'\s*<a href="/">.*?</a>', "", page)
    up = "../" * depth

    def fix(url):
        if not url or url.startswith(("http", "mailto:", "#", "/", "data:", "about:")):
            return url
        url = url.replace("v2/css/v2.css", "css/portfolio.css").replace("v2/js/v2.js", "js/portfolio.js")
        if url == "v2/":
            url = "index.html"
        elif url.startswith("v2/#"):
            url = "index.html" + url[3:]
        elif url.startswith("v2/work/"):
            url = url[3:]
        return up + url

    page = URL_ATTR.sub(lambda m: f'{m.group(1)}="{fix(m.group(2))}"', page)
    page = SRCSET.sub(lambda m: 'srcset="' + ", ".join(
        " ".join([fix(part.split()[0])] + part.split()[1:]) for part in m.group(1).split(", ")
    ) + '"', page)
    return page


def build_standalone(out):
    """Write a self-contained copy of the portfolio into folder `out`."""
    import shutil
    os.makedirs(os.path.join(out, "work"), exist_ok=True)
    with open(os.path.join(out, "index.html"), "w", encoding="utf-8") as f:
        f.write(to_standalone(home(), 0))
    for i, p in enumerate(PROJECTS):
        with open(os.path.join(out, "work", f"{p['slug']}.html"), "w", encoding="utf-8") as f:
            f.write(to_standalone(project_page(i), 1))
    if os.path.abspath(out) == ROOT:
        return
    copies = {
        "css/icons.css": "css/icons.css",
        "js/config.js": "js/config.js",
        "js/app.js": "js/app.js",
        "v2/js/v2.js": "js/portfolio.js",
        "assets/icons/web-icon.png": "assets/icons/web-icon.png",
        "api/contact.js": "api/contact.js",
        "api/_lib/mail.js": "api/_lib/mail.js",
        "package.json": "package.json",
        "tools/portfolio_data.py": "tools/portfolio_data.py",
        "tools/build_portfolio.py": "tools/build_portfolio.py",
    }
    for f in ("inter-latin-opsz-normal", "inter-latin-ext-opsz-normal", "geist-mono-latin-wght-normal", "phosphor", "phosphor-fill"):
        copies[f"assets/fonts/{f}.woff2"] = f"assets/fonts/{f}.woff2"
    for src, dst in copies.items():
        os.makedirs(os.path.dirname(os.path.join(out, dst)), exist_ok=True)
        shutil.copy2(os.path.join(ROOT, src), os.path.join(out, dst))
    css = open(os.path.join(ROOT, "v2/css/v2.css"), encoding="utf-8").read().replace("../../assets/", "../assets/")
    with open(os.path.join(out, "css/portfolio.css"), "w", encoding="utf-8") as f:
        f.write(css)
    shutil.copytree(os.path.join(ROOT, "assets/portfolio"), os.path.join(out, "assets/portfolio"), dirs_exist_ok=True)


def main():
    if "--images" in sys.argv:
        convert_images(sys.argv[sys.argv.index("--images") + 1])
    read_sizes()
    if "--standalone" in sys.argv:
        out = os.path.abspath(sys.argv[sys.argv.index("--standalone") + 1])
        build_standalone(out)
        print("built standalone portfolio in", out)
        return
    if not os.path.isdir(os.path.join(ROOT, "v2")):
        # inside the standalone project itself: rebuild in place
        build_standalone(ROOT)
        print("rebuilt standalone portfolio")
        return
    out = os.path.join(ROOT, "v2")
    os.makedirs(os.path.join(out, "work"), exist_ok=True)
    with open(os.path.join(out, "index.html"), "w", encoding="utf-8") as f:
        f.write(home())
    for i, p in enumerate(PROJECTS):
        with open(os.path.join(out, "work", f"{p['slug']}.html"), "w", encoding="utf-8") as f:
            f.write(project_page(i))
    print("built v2/index.html and", len(PROJECTS), "project pages")


if __name__ == "__main__":
    main()
