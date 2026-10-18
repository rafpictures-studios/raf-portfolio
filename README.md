# RAF Portfolio (Rizki Alfajri)

Website portofolio statis dari CV dan PDF portofolio. Gaya editorial: pita gelap dan terang bergantian, Inter Display, gambar bersudut tajam.

## Cara membuka

Klik ganda `index.html`. Tidak perlu server, install, atau internet. Pengecualiannya video YouTube, yang butuh internet dan kadang menolak diputar dari file lokal; setelah online di Vercel semuanya normal.

Form "Get in touch":
- Dibuka dari file lokal (`file://`), form membuka aplikasi email Anda dengan pesan yang sudah terisi.
- Setelah online di Vercel, form mengirim email lewat `api/contact.js` (Gmail App Password, sama seperti bio link).

## Isi folder

| File / folder | Fungsi |
|---|---|
| `index.html` | Halaman utama: hero, about, grid karya, pengalaman, keahlian, kontak |
| `work/*.html` | Satu halaman per proyek, dengan galeri dan lightbox |
| `css/portfolio.css` | Semua tampilan (warna, tipografi, layout, animasi) |
| `css/icons.css` | Subset ikon Phosphor |
| `js/portfolio.js` | Strip berjalan, reveal saat scroll, hitung angka, akordeon, lightbox, video |
| `js/app.js` | Ganti bahasa EN/ID, dialog, kirim form |
| `js/config.js` | Teks form dan pengaturan YouTube |
| `assets/portfolio/<proyek>/` | Gambar WebP, tiap gambar ada versi 800 px dan 1600 px |
| `assets/fonts/` | Font Inter Display, Geist Mono, Phosphor (self-hosted) |
| `api/` | Fungsi serverless Vercel untuk form kontak |
| `tools/portfolio_data.py` | **Sumber semua isi**: proyek, set, pengalaman, keahlian (EN dan ID) |
| `tools/build_portfolio.py` | Membuat ulang semua halaman HTML dari data di atas |

## Cara kerjanya

1. Semua teks dan daftar gambar ada di `tools/portfolio_data.py`.
2. `tools/build_portfolio.py` membaca data itu dan menulis `index.html` serta `work/*.html`.
3. Halaman yang dihasilkan adalah HTML biasa. Browser hanya memuat HTML, satu CSS, dan tiga file JS kecil.
4. Gambar memakai `srcset`: HP memuat versi 800 px, layar besar memuat 1600 px, lightbox memuat 1600 px.
5. Dua bahasa ada di dalam HTML sekaligus (`data-l="en"` dan `data-l="id"`). Tombol EN/ID hanya mengganti atribut `lang`, lalu CSS menampilkan bahasa yang aktif. Pilihan bahasa diingat di browser.

## Mengubah isi

Teks kecil bisa langsung diedit di HTML. Untuk perubahan yang konsisten di semua halaman, edit `tools/portfolio_data.py`, lalu jalankan (butuh Python 3):

```
python tools/build_portfolio.py
```

Menambah gambar baru: konversi dulu ke WebP (800 dan 1600 px) ke `assets/portfolio/<proyek>/`, lalu tambahkan namanya di data. Opsi `--images FOLDER` di script mengonversi otomatis dari PNG (butuh `pip install pillow`).

## Online nanti (opsional)

1. Buat repo GitHub baru dan push folder ini.
2. Import di Vercel (Framework preset: Other).
3. Tambahkan environment variables: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `MAIL_TO` (lihat `.env.example`).
