/* ============================================
 * CONFIG: links, prices, translations, video data
 * Edit this file to change text or prices. No em dashes in visible text.
 * ============================================ */
const CONFIG = {
  WHATSAPP_PHONE: '6289513170863',
  STORE_URL: 'https://academy.devatastudio.com/kursus/procedural-environment',
  DISCOUNT_CODE: 'DEVATA',
  YOUTUBE_EMBED: 'https://www.youtube.com/embed/',
  YOUTUBE_PARAMS: '?autoplay=1&rel=0&modestbranding=1',
  PORTFOLIO_URL: 'https://heyzine.com/flip-book/bc527cb058.html',

  TRANSLATIONS: {
    en: {
      // Shell
      brand_sub: '3D render and animation',
      nav_pages: 'Pages',
      nav_links: 'Links',
      nav_assets: 'Free assets',
            nav_elsewhere: 'Elsewhere',
      menu: 'Menu',
      subscribe: 'Subscribe',
      theme: 'Switch theme',

      // Hero
      hero_title: '3D render and animation for film, series and Blender artists.',
      hero_lead: 'Courses, free assets and selected work, all in one place.',
      btn_commission: 'Open commission',

      // Tabs
      tab_links: 'Links',
      tab_assets: 'Assets',

      // Links tab
      sec_course: 'Course',
      course_title: 'Procedural Environment Course',
      course_desc: 'A discount code is available for this course.',
      course_tag: 'Discount',
      course_cta: 'Get discount',

      sec_services: 'Services',
      svc_commission_title: 'Open commission',
      svc_commission_desc: 'Send a message for work inquiries.',
      svc_render_title: 'Renderfarm service',
      svc_render_desc: 'Calculate your render cost, then order via WhatsApp.',

      sec_showcase: 'Showcase',
      showcase_hint: 'Tap a video to preview',

      sec_portfolio: 'Portfolio',
      portfolio_title: 'Creative portfolio',
      portfolio_desc: 'Selected 3D works, as a flipbook.',
      portfolio_btn: 'Open portfolio',
      portfolio_loading: 'Loading portfolio',

      // Assets tab
      sec_course_files: 'Course files',
      sec_free_assets: 'Free assets',
      assets_hint: 'Free to download',
      asset_pack_title: 'Asset Course Pack',
      asset_pack_desc: 'Gobos sequence, trees and plants.',
      asset_lineart_title: 'LineArt Assets Pack',
      asset_lineart_desc: 'Dot highlight and shadow line.',
      asset_kitbash_title: 'Kitbash Cyberpunk Jakarta City',
      asset_kitbash_desc: '8 cyberpunk cityscape assets, Jakarta series.',

      // Course modal
      modal_course_title: 'Procedural Environment course discount',
      modal_course_desc: 'Copy the code, then claim your discount at the store.',
      copy: 'Copy',
      copied: 'Copied',
      modal_store_btn: 'Go to store',

      // Subscribe modal
      modal_subscribe_title: 'Subscribe to rafpictures',
      modal_subscribe_desc: 'Stay up to date with everything important.',
      form_email: 'Email',

      // Commission modal
      modal_commission_title: 'Open commission',
      modal_commission_desc: 'Send me a message for work inquiries.',
      form_name: 'Name',
      form_phone: 'Phone',
      form_message: 'Project brief',
      form_message_ph: 'Describe your project here',
      form_send: 'Send message',
      sending: 'Sending',
      error_invalid: 'Please check the fields and try again.',
      error_rate: 'Too many attempts. Please wait a few minutes.',
      error_send: 'The message could not be sent. Please try again, or reach me on WhatsApp.',
      error_network: 'No connection. Check your internet and try again.',

      // Video modal
      video_watch_full: 'Watch full video',

      // Done modal
      done_title: 'Thank you',
      done_subscribe: 'Thank you for subscribing.',
      done_commission: 'Your message has been sent.',
      close: 'Close',

      // Footer
      footer_rights: 'All rights reserved.',

      // Renderfarm page
      back_links: 'Back to links',
      render_title: 'Render price calculator',
      render_lead: 'Pick your engine, resolution and frame count to see the cost before you order.',
      render_note_title: 'Before you order',
      render_note_1: 'Keep the file under 2 GB for the best render time.',
      render_note_2: 'Files over 2 GB may take a little longer to render.',
      render_note_3: 'Output formats: MP4, PNG, EXR.',
      sec_prices: 'Price per frame',
      prices_hint: 'In rupiah',
      th_resolution: 'Resolution',
      sec_calculator: 'Calculator',
      render_engine: 'Render engine',
      render_blender: 'Blender version',
      render_resolution: 'Resolution',
      render_custom_opt: 'Custom',
      render_custom: 'Custom resolution (px)',
      render_width: 'Width',
      render_height: 'Height',
      render_custom_warning: 'Fill in both width and height.',
      render_frames: 'Total frames',
      render_frame_warning: 'Frame count must be at least 1.',
      render_custom_hint: 'Custom sizes are priced at the closest preset.',
      render_calculate: 'Calculate price',
      render_loading: 'Calculating',
      render_total_price: 'Total price',
      render_time_prefix: 'Estimated render time: about ',
      render_order: 'Order via WhatsApp',

      // WhatsApp order template
      whatsapp_greeting: 'Hello, I would like to order a 3D render project:',
      whatsapp_engine: 'Render engine',
      whatsapp_blender: 'Blender version',
      whatsapp_resolution: 'Resolution',
      whatsapp_frames: 'Frame count',
      whatsapp_custom: 'Custom'
    },

    id: {
      brand_sub: 'Render 3D dan animasi',
      nav_pages: 'Halaman',
      nav_links: 'Tautan',
      nav_assets: 'Aset gratis',
            nav_elsewhere: 'Lainnya',
      menu: 'Menu',
      subscribe: 'Berlangganan',
      theme: 'Ganti tema',

      hero_title: 'Render 3D dan animasi untuk film, serial, dan artis Blender.',
      hero_lead: 'Kursus, aset gratis, dan karya pilihan dalam satu tempat.',
      btn_commission: 'Buka komisi',

      tab_links: 'Tautan',
      tab_assets: 'Aset',

      sec_course: 'Kursus',
      course_title: 'Kursus Procedural Environment',
      course_desc: 'Tersedia kode diskon untuk kursus ini.',
      course_tag: 'Diskon',
      course_cta: 'Ambil diskon',

      sec_services: 'Layanan',
      svc_commission_title: 'Buka komisi',
      svc_commission_desc: 'Kirim pesan untuk tawaran pekerjaan.',
      svc_render_title: 'Layanan renderfarm',
      svc_render_desc: 'Hitung biaya render, lalu pesan lewat WhatsApp.',

      sec_showcase: 'Showcase',
      showcase_hint: 'Ketuk video untuk pratinjau',

      sec_portfolio: 'Portofolio',
      portfolio_title: 'Portofolio kreatif',
      portfolio_desc: 'Karya 3D pilihan, dalam bentuk flipbook.',
      portfolio_btn: 'Buka portofolio',
      portfolio_loading: 'Memuat portofolio',

      sec_course_files: 'File kursus',
      sec_free_assets: 'Aset gratis',
      assets_hint: 'Gratis diunduh',
      asset_pack_title: 'Paket Aset Kursus',
      asset_pack_desc: 'Gobos sequence, pohon, dan tanaman.',
      asset_lineart_title: 'Paket Aset LineArt',
      asset_lineart_desc: 'Dot highlight dan shadow line.',
      asset_kitbash_title: 'Kitbash Cyberpunk Jakarta City',
      asset_kitbash_desc: '8 aset cityscape cyberpunk, seri Jakarta.',

      modal_course_title: 'Diskon kursus Procedural Environment',
      modal_course_desc: 'Salin kodenya, lalu klaim diskon di toko.',
      copy: 'Salin',
      copied: 'Tersalin',
      modal_store_btn: 'Ke toko',

      modal_subscribe_title: 'Berlangganan rafpictures',
      modal_subscribe_desc: 'Tetap update dengan semua yang penting.',
      form_email: 'Email',

      modal_commission_title: 'Buka komisi',
      modal_commission_desc: 'Kirim pesan untuk tawaran pekerjaan.',
      form_name: 'Nama',
      form_phone: 'Telepon',
      form_message: 'Brief proyek',
      form_message_ph: 'Ceritakan proyek Anda di sini',
      form_send: 'Kirim pesan',
      sending: 'Mengirim',
      error_invalid: 'Periksa kembali isian lalu coba lagi.',
      error_rate: 'Terlalu banyak percobaan. Tunggu beberapa menit.',
      error_send: 'Pesan gagal terkirim. Coba lagi, atau hubungi saya lewat WhatsApp.',
      error_network: 'Tidak ada koneksi. Cek internet Anda lalu coba lagi.',

      video_watch_full: 'Tonton video lengkap',

      done_title: 'Terima kasih',
      done_subscribe: 'Terima kasih sudah berlangganan.',
      done_commission: 'Pesan Anda sudah terkirim.',
      close: 'Tutup',

      footer_rights: 'Hak cipta dilindungi.',

      back_links: 'Kembali ke tautan',
      render_title: 'Kalkulator harga render',
      render_lead: 'Pilih engine, resolusi, dan jumlah frame untuk melihat biaya sebelum memesan.',
      render_note_title: 'Sebelum memesan',
      render_note_1: 'Usahakan ukuran file di bawah 2 GB agar waktu render optimal.',
      render_note_2: 'File di atas 2 GB mungkin butuh waktu render sedikit lebih lama.',
      render_note_3: 'Format output: MP4, PNG, EXR.',
      sec_prices: 'Harga per frame',
      prices_hint: 'Dalam rupiah',
      th_resolution: 'Resolusi',
      sec_calculator: 'Kalkulator',
      render_engine: 'Render engine',
      render_blender: 'Versi Blender',
      render_resolution: 'Resolusi',
      render_custom_opt: 'Kustom',
      render_custom: 'Resolusi kustom (px)',
      render_width: 'Lebar',
      render_height: 'Tinggi',
      render_custom_warning: 'Isi lebar dan tinggi.',
      render_frames: 'Total frame',
      render_frame_warning: 'Jumlah frame minimal 1.',
      render_custom_hint: 'Ukuran kustom dihitung dengan harga preset terdekat.',
      render_calculate: 'Hitung harga',
      render_loading: 'Menghitung',
      render_total_price: 'Total harga',
      render_time_prefix: 'Estimasi waktu render: sekitar ',
      render_order: 'Pesan via WhatsApp',

      whatsapp_greeting: 'Halo, saya ingin memesan proyek render 3D:',
      whatsapp_engine: 'Render engine',
      whatsapp_blender: 'Versi Blender',
      whatsapp_resolution: 'Resolusi',
      whatsapp_frames: 'Jumlah frame',
      whatsapp_custom: 'Kustom'
    }
  },

  /* Showcase videos. Key = YouTube video id. */
  VIDEOS: {
    'wuZnM5o-zMM': {
      preview: 'assets/images/previews/baraju-ep6.webp',
      en: {
        title: 'EP06 BoBoiBoy Galaxy Baraju: Baraju Bersatu',
        desc: 'Episode 6 of BoBoiBoy Galaxy Baraju, where Baraju unites. An epic transformation and powerful teamwork.'
      },
      id: {
        title: 'EP06 BoBoiBoy Galaxy Baraju: Baraju Bersatu',
        desc: 'Episode 6 BoBoiBoy Galaxy Baraju, saat Baraju bersatu. Transformasi epik dan kerja sama tim yang kuat.'
      }
    },
    'OTQDuKtemzc': {
      preview: 'assets/images/previews/baraju-ep5.webp',
      en: {
        title: 'EP05 BoBoiBoy Galaxy Baraju: Musuh Dalam Selimut',
        desc: 'Episode 5 of BoBoiBoy Galaxy Baraju. Hidden threats and unexpected betrayals in an intense episode.'
      },
      id: {
        title: 'EP05 BoBoiBoy Galaxy Baraju: Musuh Dalam Selimut',
        desc: 'Episode 5 BoBoiBoy Galaxy Baraju. Ancaman tersembunyi dan pengkhianatan tak terduga dalam episode yang intens.'
      }
    },
    '6sbUuHw0Y-4': {
      preview: 'assets/images/previews/jumbo-trailer.webp',
      en: {
        title: 'JUMBO: Official Trailer 1',
        desc: 'The official trailer of JUMBO from Visinema Pictures.'
      },
      id: {
        title: 'JUMBO: Trailer Resmi 1',
        desc: 'Trailer resmi film JUMBO dari Visinema Pictures.'
      }
    },
    'YW3sQ16oksY': {
      preview: 'assets/images/previews/jumbo-teaser.webp',
      en: {
        title: 'JUMBO: Official Teaser Trailer',
        desc: 'A first look at JUMBO, the teaser trailer from Visinema Pictures.'
      },
      id: {
        title: 'JUMBO: Teaser Trailer Resmi',
        desc: 'Gambaran pertama film JUMBO lewat teaser trailer dari Visinema Pictures.'
      }
    },
    '7a1wSjZyi5I': {
      preview: 'assets/images/previews/nussa-mooi.webp',
      en: {
        title: 'Nussa x Mooi special episode: Rayakan Kebaikan',
        desc: 'A special collaboration between Nussa and Mooi that celebrates kindness, compassion and doing good, one simple act at a time.'
      },
      id: {
        title: 'Episode spesial Nussa x Mooi: Rayakan Kebaikan',
        desc: 'Kolaborasi spesial Nussa dan Mooi yang merayakan kebaikan, kasih sayang, dan indahnya berbuat baik lewat aksi sederhana.'
      }
    },
    'PfIuJwcl60E': {
      preview: 'assets/images/previews/nussa-movie.webp',
      en: {
        title: 'Nussa short movie, special edition',
        desc: 'Nussa and friends in a special edition short movie, full of valuable life lessons.'
      },
      id: {
        title: 'Film pendek Nussa, edisi spesial',
        desc: 'Nussa dan teman-teman dalam film pendek edisi spesial yang penuh pelajaran hidup.'
      }
    }
  }
};

/* Price per frame, in rupiah */
const FRAME_PRICES = {
  Cycles: {
    'HD (1280x720)': 380,
    'Full HD (1920x1080)': 480,
    '2K (2048x1080)': 580,
    '4K (3840x2160)': 680
  },
  Eevee: {
    'HD (1280x720)': 300,
    'Full HD (1920x1080)': 400,
    '2K (2048x1080)': 500,
    '4K (3840x2160)': 600
  }
};
