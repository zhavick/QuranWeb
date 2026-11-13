# Urutan Pengembangan Aplikasi Fase 2 (Development Steps Phase 2): Quran Web

Dokumen ini merupakan panduan tahapan pengembangan teknis (*development steps*) untuk **Fase 2** aplikasi **Quran Web**. Dokumen ini melanjutkan fondasi yang telah dibangun pada Fase 1 (Step 1 s.d. Step 8 di `DEV_STEP.md`), membawa QuranWeb bertransformasi dari sekadar alat baca teks Al-Qur'an menjadi **Pusat Pembelajaran, Tadabbur, dan Sahabat Ibadah Spiritual Umat Muslim yang Utuh**.

* **Nama Dokumen:** DEV_STEP_2.md
* **Status Dokumen:** Perencanaan Eksekusi Bertahap (Step-by-Step Implementation Guide)
* **Kategori:** Modul Lanjutan, Sejarah Nabawi, Jurnal Literasi, Ibadah Harian, Navigasi Masjid OpenStreetMap & Aksesibilitas Lansia

---

## Prinsip Penentuan Urutan Fase 2

1. **Fondasi Akun & Aksesibilitas Logout Lebih Dulu (Step 9):** Sebelum modul penulisan artikel dan kurasi kisah dibangun, sistem hak akses bertingkat (RBAC) dan kemudahan logout langsung dari halaman depan harus terpasang kokoh.
2. **Kurasi Naskah Shahih Sebelum Rendering Interaktif (Step 10 & 11):** Naskah 25 kisah nabi dan artikel tadabbur harus terverifikasi sanadnya dan bersih dari riwayat Israiliyyat sebelum dihubungkan secara interaktif ke mushaf.
3. **Penyempurnaan Ibadah Harian Ramah Lansia (Step 12 s.d. 14):** Rencana khatam berbasis 'Ain, tasbih digital haptic, dan kompas kiblat adaptif dibangun dengan prinsip anti-distraksi (*zero competitive pressure*).
4. **Teknologi Peta Terbuka & Efisiensi Kuota (Step 15):** Modul peta masjid terdekat menggunakan **OpenStreetMap (OSM)** dan **Leaflet.js** lokal yang ringan, hemat kuota seluler, bebas biaya lisensi komersial, serta memanfaatkan izin GPS yang telah diberikan pada fitur jadwal shalat.
5. **Inklusivitas & Mode Menyimak untuk Mata Lelah (Step 16):** Penambahan audio narasi bertutur 3 menit dan kamus mufradat untuk membantu jamaah lansia yang mengalami kelelahan mata.

---

## Ringkasan Urutan Modul Fase 2 (Step 9 s.d. Step 17)

| Urutan | Fokus Utama | Modul yang Dikerjakan | Prioritas | Status | Target Luaran |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Step 9** | Autentikasi & Navigasi Depan | **Standarisasi Akun (RBAC) & Quick Logout Halaman Depan:** Role Super Admin, Asatidz, Editor, Jamaah, Guest; Header adaptif dengan tombol logout langsung & modal santun. | Wajib (Pondasi) | **Selesai (Done)** | Sesi aman, logout instan 1-klik di header tanpa reload halaman, kredensial baku. |
| **Step 10** | Sejarah & Audit Visual | **Modul Kisah Para Rasulullah (Qashashul Anbiya') & Grafik Audit Trail (Line Chart CRUD vs View):** 25 Nabi & Rasul, linimasa sejarah, *Du'a Al-Anbiya'*, *Bi-Directional Linking* ke mushaf & audio murottal, serta grafik garis visual tren aktivitas Audit Trail (series CRUD vs View) pada Portal Admin. | Tinggi | **Selesai (Done)** | Halaman `/kisah` responsif dengan 4 tema warna, navigasi ayat terkait, dan grafik garis tren aktivitas audit trail admin. |
| **Step 11** | Literasi & Ekosistem Artikel | **Modul Jurnal Literasi & Blog Tadabbur Qur'ani:** 5 pilar konten, widget kutipan ayat interaktif dengan audio mini, panel CMS di `/admin`, dan catatan tadabbur di `/user`. | Tinggi | **Selesai (Done)** | Halaman `/blog`, editor draf artikel, dan personal reading list. |
| **Step 12** | Ibadah Harian Ramah Lansia | **Modul Rencana Khatam Ramah Lansia (*Khatam Planner 'Ain*):** Ritme Sakinah (1 'Ain usai shalat / ~111 hari), pelacak cincin progres melingkar, pengingat santun shalat. | Menengah | **Selesai (Done)** | Antarmuka pelacak tilawah berbasis 'Ain tanpa gamifikasi yang bising. |
| **Step 13** | Kompilasi Doa & Dzikir Harian | **Modul 40 Doa Rabbana, Tasbih Haptic & Guard Sesi Akun:** Doa mustajab Al-Qur'an, dzikir pagi-petang, tasbih digital getar layar penuh, supresi popup ajakan bergabung bagi user ber-sesi, dan isolasi modul rencana khatam khusus akun terdaftar. | Menengah | **Selesai (Done)** | Antarmuka doa terhubung ayat, tasbih sentuh bebas tatap layar, pengalaman sesi bebas gangguan. |
| **Step 14** | Orientasi Shalat Adaptif | **Modul Arah Kiblat Adaptif (*Offline Compass*):** Kompas gerak dinamis di smartphone vs sudut azimuth/jam matahari di laptop, getaran penanda arah tepat Ka'bah. | Menengah | **Selesai (Done)** | Penunjuk kiblat 100% offline dengan rumus trigonometri speris lokal. |
| **Step 15** | Panduan Jamaah & Geografis | **Modul Peta Masjid Terdekat (OpenStreetMap + Google Maps):** Menu navbar baru `/masjid`, peta Leaflet.js lokal, integrasi izin GPS jadwal shalat, estimasi jalan santai lansia. | Lanjutan | **Selesai (Done)** | Peta OpenStreetMap interaktif, kartu masjid terdekat, rute navigasi suara 1-klik. |
| **Step 16** | Pendalaman Makna & Inklusivitas | **Modul Asbabun Nuzul, Glosarium Mufradat & Audio Narasi (Audiobook 3 Menit) + Guard Akses Peta Masjid:** Kartu riwayat turunnya ayat, kamus kosakata sukar (*Gharibul Qur'an*), rekaman audio cerita 3 menit dengan Sleep Timer & 0.75x tempo lansia, serta proteksi menu peta masjid wajib memiliki akun. | Lanjutan | **Selesai (Done)** | Dialog Asbabun Nuzul & kamus mufradat di kartu ayat, pemutar audiobook tadabbur 3 menit dengan sleep timer & transkrip teks, serta guard sesi akun untuk menu peta masjid. |
| **Step 17** | Integrasi Sistem & Rilis Fase 2 | **Audit Aksesibilitas WCAG, Pengujian Tema, PWA Cache & Deployment:** Sinkronisasi skema PostgreSQL baru, uji coba multi-perangkat (Mobile & Desktop), update panduan pengguna. | Akhir (Release) | Rencana | Sistem stabil 100%, PWA offline cache untuk modul baru, siap rilis produksi. |

---

## Detail Tahapan Pengembangan (Step-by-Step)

### Step 9: Standarisasi Sistem Akun (RBAC) & Quick Logout di Halaman Depan
* **Status:** **Selesai (Done)**
* **Tujuan:** Merapikan struktur hak akses untuk seluruh pemangku kepentingan dan mempermudah pengguna keluar dari akun langsung dari header tilawah.
* **Tugas Spesifik:**
  1. **Pembaruan Layanan Autentikasi (`src/services/auth.ts` & `server/index.js`):**
     - Menambahkan definisi tipe peran: `'admin' | 'asatidz' | 'editor' | 'user'`.
     - Menyediakan daftar akun default teruji: Super Admin (`admin`/`admin123`), Dewan Asatidz (`asatidz`/`asatidz123`), Editor Redaksi (`editor`/`editor123`), dan Jamaah (`fulan`/`user123`).
  2. **Header Adaptif Halaman Depan (`src/App.tsx`):**
     - Membaca status `getStoredUser()` secara reaktif.
     - *Saat Belum Login:* Menampilkan tombol ikon user standar menuju rute `/user`.
     - *Saat Telah Login:* Menampilkan lencana identitas ringkas (nama/avatar dan badge role) serta **Tombol Logout Cepat (Quick Logout)** berikon `LogOut` dengan ukuran tap target minimal `44px × 44px`.
  3. **Modal Dialog Konfirmasi Keluar Santun:**
     - Membangun modal konfirmasi dengan bahasa hangat yang memastikan riwayat bookmark dan tilawah tersimpan aman.
     - Mengeksekusi `logoutUser()` untuk menghapus `quranweb_auth_session` dari `localStorage` tanpa perlu reload penuh halaman (*zero flicker / no page reload*).
     - Menampilkan notifikasi toast umpan balik: *"Anda telah berhasil keluar dari akun dengan aman."*
* **Kriteria Selesai:** Kredensial keempat akun demo berfungsi baik, tombol logout muncul di header saat login, modal konfirmasi berfungsi, dan transisi logout berjalan mulus tanpa kehilangan posisi ayat tilawah.

---

### Step 10: Modul Kisah Para Rasulullah & Grafik Garis Audit Trail (Line Chart CRUD vs View)
* **Status:** **Selesai (Done)**
* **Tujuan:** Menghadirkan sirah nabawi yang bersumber dari riwayat shahih terintegrasi ayat Al-Qur'an, serta memperkaya Portal Admin dengan grafik garis (*Line Chart*) visualisasi tren aktivitas Audit Trail berbasis series CRUD dan View.
* **Tugas Spesifik:**
  1. **Penyusunan Dataset Mandiri (`public/data/prophets/*.json` & `prophets_meta.json`):**
     - Menghimpun data 25 Nabi & Rasul dengan hierarki 3 era: Permulaan, Bani Israil, dan Penutup Kenabian.
     - Setiap berkas memuat: kartu identitas nabi, linimasa babak kehidupan (3–5 menit baca), mutiara hikmah, kompilasi doa nabawi, dan daftar referensi ayat Al-Qur'an.
  2. **Komponen Katalog & Lembar Baca Kisah (`src/components/prophets/`):**
     - Halaman katalog kartu nabi dengan filter pencarian dan pembagian era.
     - Halaman lembar baca naskah kisah dengan tipografi lega (*line-height 1.8x*) dan dukungan 4 tema tampilan (Sepia, Dark, Light, High Contrast).
  3. **Taut Silang Dua Arah (*Bi-Directional Linking*):**
     - Tombol kutipan ayat di dalam naskah kisah langsung membuka lembar tilawah mushaf beserta pemutar audio murottal.
     - Penanda lentera kisah pada mushaf utama untuk membuka latar belakang nabi bersangkutan.
  4. **Grafik Garis Tren Audit Trail pada Portal Admin (`src/components/admin/AdminPortal.tsx`):**
     - Membangun visualisasi grafik garis interaktif (*Line Chart*) pada tab **Audit Trail Penuh** di Portal Administrator (`/admin`).
     - Menyediakan 2 kurva series yang dapat dibandingkan:
       - **Series CRUD (Garis Oranye/Amber):** Mengukur volume operasi mutasi data (Create, Update, Delete) seperti penambahan/penghapusan bookmark (`ADD_BOOKMARK`, `REMOVE_BOOKMARK`), pembaruan setting (`UPDATE_SETTINGS`), simpan catatan, dan konfigurasi situs.
       - **Series View (Garis Hijau/Emerald):** Mengukur volume operasi pembacaan dan eksplorasi seperti kunjungan web, membaca surat (`READ_SURAH`), memutar audio murottal (`PLAY_AUDIO`), membuka pengaturan (`OPEN_SETTINGS`), dan pencarian terjemahan (`SEARCH_TRANSLATION`).
     - Menghitung agregasi data log per titik waktu harian, dilengkapi sumbu X/Y yang responsif, legenda warna, titik data interaktif (*data point dots*), dan kartu ringkasan total rasio CRUD vs View.
* **Kriteria Selesai:** 25 kisah nabi dapat dibaca dengan nyaman, navigasi taut silang ke mushaf berfungsi presisi, dan grafik garis tren Audit Trail (series CRUD vs View) tampil interaktif serta responsif di Portal Admin.

---

### Step 11: Modul Jurnal Literasi & Blog Tadabbur Qur'ani (5 Pilar Konten & CMS)
* **Status:** **Selesai (Done)**
* **Tujuan:** Menghadirkan artikel literasi berbobot tinggi tanpa iklan yang menghubungkan pesan Al-Qur'an dengan kehidupan nyata.
* **Tugas Spesifik:**
  1. **Struktur Data & Katalog Artikel (`src/components/blog/`):**
     - Halaman katalog artikel kartu berdasarkan 5 pilar (Tafsir Maudhu'i, Elder Care, Ulumul Quran, Penyejuk Jiwa, Catatan Rilis).
     - Lembar baca editorial dengan lebar baris nyaman (*max-width 700px*), estimasi waktu baca, dan bilah kemajuan (*reading progress bar*).
  2. **Widget Kutipan Ayat Interaktif (*Embedded Ayah Widget*):**
     - Komponen renderer khusus yang otomatis menampilkan teks Arab berharakat, terjemahan Kemenag, dan tombol mini-player murottal per ayat.
  3. **Panel Pengelolaan Artikel pada Portal Admin (`/admin`):**
     - Antarmuka manajemen draf artikel, penyematan shortcode ayat Al-Qur'an, dan penjadwalan publikasi untuk akun peran `admin`, `asatidz`, dan `editor`.
  4. **Fitur Personalisasi pada Portal Pengguna (`/user`):**
     - Modul *Daftar Baca Nanti (Read Later)* dan *Catatan Tadabbur Pribadi (Private Reflection Notes)*.
* **Kriteria Selesai:** Artikel dapat dibaca dan difilter per pilar, widget ayat interaktif merender audio dengan baik, serta alur penulisan di admin dan penyimpanan catatan di portal user berjalan lancar.

---

### Step 12: Modul Rencana Khatam Ramah Lansia (*Khatam Planner Berbasis 'Ain*)
* **Status:** **Selesai (Done)**
* **Tujuan:** Membantu jamaah lansia menyelesaikan Al-Qur'an dengan ritme yang menenangkan tanpa kelelahan mata.
* **Tugas Spesifik:**
  1. **Logika Perhitungan Ritme Tilawah:**
     - *Ritme Sakinah:* 1 'Ain usai shalat fardhu (5 'Ain/hari, khatam ~111 hari).
     - *Ritme Istiqamah:* 2 'Ain usai shalat fardhu (10 'Ain/hari, khatam ~56 hari).
     - *Ritme 30 Hari:* 1 Juz per hari (±18–20 'Ain/hari).
  2. **Komponen Visual Cincin Sakinah (*Gentle Progress Ring*):**
     - Grafik progres melingkar bernuansa hijau daun atau emas sepia yang mencatat nomor 'Ain aktif dan persentase keseluruhan.
     - Terbebas dari unsur gamifikasi stres (tanpa penalti hangus atau leaderboard kompetitif).
  3. **Pengingat Santun Terintegrasi Jadwal Shalat:**
     - Notifikasi halus yang menyapa jamaah setelah waktu shalat masuk untuk mengajak membaca 1 'Ain.
* **Kriteria Selesai:** Pengguna dapat memilih ritme tilawah, progres 'Ain tercatat secara persisten di storage lokal/cloud, dan tombol navigasi langsung mengarahkan ke 'Ain target.

---

### Step 13: Modul Kumpulan Doa Qur'ani (40 Rabbana) & Tasbih Digital Haptic
* **Status:** **Selesai (Done)**
* **Tujuan:** Menyediakan kompilasi doa mustajab Al-Qur'an dan kemudahan berdzikir tanpa harus memelototi layar HP, disertai penyempurnaan supresi popup sesi dan pembatasan akses modul terpersonalisasi.
* **Tugas Spesifik:**
  1. **Kurasi Dataset 40 Doa Rabbana:**
     - Menghimpun seluruh doa Al-Qur'an yang diawali lafadz *Rabbana* dan *Rabbi*, lengkap dengan teks Arab LPMQ Misbah, transliterasi, terjemahan, dan rekaman audio pelafalan.
  2. **Dzikir Pagi-Petang & Ba'da Shalat:**
     - Antarmuka kartu geser (*swipeable card*) berukuran huruf besar untuk bacaan dzikir Al-Ma'tsurat yang shahih.
  3. **Tasbih Digital Haptic Layar Penuh (*Full-Screen Tap*):**
     - Mengaktifkan area sentuh di seluruh permukaan layar ponsel menggunakan `navigator.vibrate()`.
     - Memberikan getaran halus 1x pada tiap sentuhan, getaran panjang 2x pada hitungan 33x, dan getaran ritmis pada 100x.
  4. **Penyempurnaan Sesi & Akses Fitur Personal (Session State Guard):**
     - **Supresi Dialog Registrasi CTA (*JoinPromptModal*):** Jika pengguna telah memiliki sesi login (`currentUser !== null`), tindakan penyimpanan/sinkronisasi data di modal pengaturan (`SettingsModal`) dan penambahan bookmark tidak lagi memunculkan popup ajakan bergabung, melainkan notifikasi toast konfirmasi sinkronisasi langsung.
     - **Visibilitas Eksklusif Modul Rencana Khatam:** Modul dan tombol Rencana Khatam Sakinah hanya muncul ketika pengguna telah memiliki akun dan aktif login. Di halaman publik pengunjung tamu (*guest*), tombol modul tersebut disembunyikan sepenuhnya dari header, mobile drawer, bilah navigasi mushaf, dan widget jadwal shalat.
* **Kriteria Selesai:** 40 Doa Rabbana dapat diputar audionya dan dibuka di mushaf, penghitung tasbih bergetar akurat pada perangkat bergerak, popup bergabung tersupresi dengan benar saat sesi aktif, dan modul rencana khatam terlindungi sesuai status kepemilikan akun.

---

### Step 14: Modul Kompas Arah Kiblat Adaptif, CMS Jurnal/Blog Lifecycle, Session Guard Doa & Dzikir, serta Chart.js Audit Trail
* **Status:** **Selesai (Done) & Siap Dilanjutkan**
* **Tujuan:** Menyediakan panduan arah kiblat yang presisi baik di smartphone maupun desktop, menyempurnakan CMS Jurnal/Blog bagi administrator dengan kendali status penuh (terbitkan, draf, arsip, hapus), memproteksi akses Doa & Dzikir khusus pengguna berakun, serta meningkatkan kualitas visualisasi audit trail dengan Chart.js.
* **Tugas Spesifik:**
  1. **Algoritma Perhitungan Kiblat Offline:**
     - Menghitung sudut kiblat menggunakan rumus trigonometri speris *Great Circle* terhadap Ka'bah (21.4225° N, 39.8262° E) berdasarkan koordinat pengguna.
  2. **Deteksi Perangkat & Kompas Dinamis Smartphone:**
     - Menggunakan `DeviceOrientationEvent` untuk memutar piringan kompas secara real-time mengikuti orientasi fisik HP.
     - Menggetarkan HP secara lembut (*haptic alignment*) saat sudut hadap tepat pada arah Ka'bah (toleransi `±1°`).
  3. **Antarmuka Adaptif Laptop / PC Desktop:**
     - Mendeteksi ketiadaan sensor kompas magnetik secara otomatis.
     - Menampilkan sudut derajat Azimuth (misal: `295° Barat Laut`), jam posisi bayangan matahari (*Rasydul Qiblah*), dan tombol QR Code cepat untuk memindahkan kompas ke HP.
  4. **Penyempurnaan CMS Admin Jurnal / Blog (Kategori 5 Pilar, Siklus Status & Hapus):**
     - Administrator dapat menambahkan tulisan jurnal baru dengan penyematan ayat Al-Qur'an (shortcode interaktif).
     - Kategorisasi 5 pilar konten: *Tadabbur & Tafsir*, *Lansia & Kebugaran*, *Ulumul Qur'an*, *Tazkiyatun Nafs*, dan *Warta QuranWeb*.
     - Pengelolaan status publikasi artikel yang fleksibel: Diterbitkan (*published*), Draf (*draft*), Diarsipkan (*archived*), atau Dihapus (*deleted*).
     - Filter status tab, pencarian naskah, dan kontrol pengubah status langsung dari tabel data.
  5. **Session Guard Doa & Dzikir (Kompilasi 40 Rabbana & Tasbih Haptic):**
     - Modul Doa & Dzikir hanya dapat diakses oleh pengguna yang telah memiliki akun dan sedang login.
     - Menu "Doa & Dzikir" pada Header navbar dan Drawer seluler disembunyikan sepenuhnya dari pengunjung tamu (*guest*).
     - Jika pengunjung tamu mengakses URL `/doa` secara langsung, sistem menampilkan modal pendaftaran (*JoinPromptModal*) dan mengarahkan kembali ke mushaf.
  6. **Visualisasi Audit Trail Modern Menggunakan Chart.js:**
     - Menggantikan visualisasi manual berbasis SVG statis dengan integrasi pustaka *Chart.js* yang proporsional, responsif, dan tajam di berbagai resolusi layar.
     - Menampilkan dual-series interaktif: Series CRUD (mutasi data/pengaturan) vs Series View (aktivitas baca/audio/eksplorasi) selama 7 hari terakhir dengan tooltip informatif dan kurva mulus.
* **Kriteria Selesai:** Kompas berputar mulus dan bergetar di smartphone, CMS artikel mendukung siklus hidup draf/arsip/hapus/terbit, menu dan rute Doa & Dzikir terlindungi sesi akun, grafik audit trail Chart.js tampil rapi dan proporsional, serta `tsc -b` lulus tanpa error.

---

### Step 15: Modul Peta Masjid Terdekat (Navbar Menu & OpenStreetMap Lokal Terintegrasi Google Maps)
* **Status:** **Selesai (Done) & Siap Dilanjutkan**
* **Tujuan:** Memandu jamaah menemukan masjid terdekat untuk shalat berjamaah awal waktu dengan peta yang ringan, legal, bebas biaya langganan komersial, dan hemat kuota.
* **Tugas Spesifik:**
  1. **Teknologi Peta: OpenStreetMap (OSM) & Leaflet.js:**
     - Mengintegrasikan library *Leaflet.js* (~42 KB gzipped) yang bersih dari script pelacak iklan komersial.
     - Mengonfigurasi map tiles OpenStreetMap yang di-cache di backend Nginx/Node.js dan Service Worker browser.
     - Menerapkan styling filter CSS adaptif agar tampilan peta selaras dengan 4 tema QuranWeb (*Light, Dark OLED, Sepia, High Contrast*).
  2. **Integrasi Data Google Maps POI:**
     - Menyediakan skrip sinkronisasi dan caching data masjid dari Google Maps Places API / Overpass API ke tabel PostgreSQL `nearby_mosques_cache`.
     - Menjamin nama masjid, alamat, dan koordinat akurat setara Google Maps tanpa membebani browser dengan beban kerja script berat.
  3. **Penambahan Menu Navbar Baru:**
     - Menambahkan menu *"Peta Masjid"* (`/masjid`) pada Header Desktop dan Bottom Navigation Bar Mobile.
  4. **Alur Izin Lokasi & GPS (*Permission Lifecycle*):**
     - *Penggunaan Ulang Izin Jadwal Shalat:* Menggunakan koordinat yang sudah diizinkan pengguna pada fitur jadwal shalat tanpa memicu popup izin baru.
     - *Modal Ajakan Edukatif:* Dialog santun jika GPS belum aktif.
     - *Fallback:* Pilihan manual nama kota jika GPS ditolak atau dimatikan.
  5. **Fitur Khusus Lansia:**
     - Kartu daftar masjid urut jarak terdekat.
     - Estimasi "Jalan Santai Lansia" (±3 km/jam ~ 50 m/menit) agar jamaah sempat mengejar shalat sebelum iqamah.
     - Label fasilitas ramah lansia (wudhu lantai dasar, kursi shalat, pendingin udara, tanjakan kursi roda, parkir lapang, toilet duduk).
     - Tombol 1-klik navigasi suara belokan (*turn-by-turn navigation*) ke Google Maps / Waze / Apple Maps.
* **Kriteria Selesai:** Menu navbar peta masjid tampil rapi, peta OpenStreetMap lokal termuat cepat dengan data POI masjid yang akurat, koordinat GPS terhubung mulus dengan jadwal shalat, tombol navigasi eksternal berfungsi, dan kompilasi TypeScript lolos tanpa error.

---

### Step 16: Modul Asbabun Nuzul, Glosarium Mufradat & Audio Narasi (Audiobook 3 Menit) + Guard Akses Peta Masjid
* **Status:** **Selesai (Done)**
* **Tujuan:** Memberikan pemahaman kontekstual sejarah turunnya ayat Al-Qur'an, kamus akar kata (jadzr) & balaghah sastra, serta solusi ramah lansia yang mengalami kelelahan mata (*Audio Capsule* 3–5 menit dengan Sleep Timer & kecepatan lansia), ditambah proteksi menu peta masjid terdekat khusus pengguna terdaftar.
* **Tugas Spesifik yang Diselesaikan:**
  1. **Proteksi & Guard Akses Menu Peta Masjid (`src/App.tsx` & `PrayerTimeWidget.tsx`):**
     - Menu "Peta Masjid" di Header dan Mobile Drawer disembunyikan jika pengunjung belum login (`!currentUser`).
     - Akses langsung ke rute `/masjid` dicegat secara santun, memunculkan modal pendaftaran `JoinPromptModal` dan mengarahkan kembali ke halaman utama tilawah.
     - Tombol "Lihat Peta Masjid Sekitar" pada widget jadwal shalat dicegat untuk menampilkan modal pendaftaran bagi tamu.
  2. **Kartu Konteks Asbabun Nuzul (`src/components/literacy/AsbabunNuzulModal.tsx` & `src/services/literacy.ts`):**
     - Database riwayat shahih Asbabun Nuzul dari kitab rujukan terpercaya *Lubabun Nuqul* (Imam As-Suyuthi) dan *Asbabun Nuzul* (Al-Wahidi) di `public/data/asbabun_nuzul.json`.
     - Ditampilkan pada `AyahCard` dengan tombol badge "Asbabun Nuzul" berwarna amber lembut yang membuka dialog mendalam berisi sumber periwayatan, teks riwayat, intisari hikmah, dan pengatur ukuran teks (A, A+, A++).
  3. **Kamus Mufradat Kosakata Sukar (*Gharibul Qur'an*) (`src/components/literacy/GharibulQuranModal.tsx`):**
     - Database kosakata langka berbobot sastra tinggi di `public/data/gharibul_quran.json`.
     - Ditampilkan pada `AyahCard` dengan tombol badge "Mufradat Gharib" berwarna zamrud lembut yang menampilkan tab kosakata, teks kaligrafi Arab, transliterasi, akar kata (*jadzr*), makna leksikal dasar, serta rahasia balaghah dan kedalaman makna sastra Qur'an.
  4. **Audio Narasi Bertutur 3–5 Menit (*Audio Capsule / Audiobook 3 Menit*) (`src/components/audio/AudioCapsuleModal.tsx`):**
     - Database narasi kisah dan tadabbur suara hangat di `public/data/audio_capsules.json`.
     - Tombol akses cepat "Audiobook 3 Mnt" dengan ikon headphone di Header Navbar dan Mobile Drawer.
     - Pemutar audio terintegrasi dengan playlist, visualizer bar animasi, pengatur kecepatan lansia (`0.75x`, `1.0x`, `1.25x`), *Sleep Timer* (15, 30, 45, 60 menit) dengan hitung mundur otomatis menghentikan pemutaran, serta pembaca transkrip naskah dengan kontrol pembesaran huruf ramah lansia.
  5. **PWA Offline Precache v7 (`public/sw.js`):**
     - Precache data offline untuk `asbabun_nuzul.json`, `gharibul_quran.json`, dan `audio_capsules.json`.
  6. **Pengayaan Narasi Mendalam Kisah 25 Nabi & Rasul (`public/data/prophets_data.json` & `public/data/prophets_meta.json`):**
     - Memperluas isi kisah seluruh 25 Nabi & Rasul secara komprehensif (ukuran dataset meningkat dari 98 KB menjadi 209 KB).
     - Setiap nabi kini memiliki narasi babak linimasa yang kaya (3 hingga 4 babak per nabi, 1.400–2.300 karakter per babak), menyajikan latar belakang peradaban kaum, argumentasi tauhid, mukjizat samawi, rincian ujian keimanan, dan mutiara hikmah yang kontekstual.
     - Penataan tampilan modal pada `ProphetDetailModal.tsx` menggunakan `whitespace-pre-line` untuk kenyamanan membaca berparagraf bagi pengguna lansia.
* **Kriteria Selesai:** Dialog Asbabun Nuzul dan Gharibul Qur'an merespons instan dari ayat, audio narasi bertutur dapat diputar dengan sleep timer aktif, menu peta masjid terlindungi guard sesi akun secara konsisten, dan seluruh 25 kisah nabi tersaji dalam narasi mendalam yang lengkap. Tervalidasi 0 error pada kompilasi TypeScript (`tsc -b`).

---

### Step 17: Uji Integrasi Sistem, Standar Aksesibilitas Lansia, PWA & Kontainerisasi Rilis Fase 2
* **Tujuan:** Memastikan seluruh modul baru terintegrasi secara harmonis, performa tetap ringan (*zero bloat*), dan siap dijalankan secara mandiri di server produksi.
* **Tugas Spesifik:**
  1. **Audit Aksesibilitas Ramah Lansia (WCAG AAA Compliance):**
     - Memastikan seluruh tombol dan tap target berukuran minimal `44px × 44px`.
     - Memverifikasi rasio kontras teks dan ikon di 4 tema warna (Light, Dark, Sepia, High Contrast).
  2. **Migrasi Database PostgreSQL & Caching PWA:**
     - Menjalankan skrip migrasi tabel baru (`nearby_mosques_cache`, entitas artikel blog, kisah nabi, dan rencana khatam).
     - Memperbarui Service Worker (`sw.js`) untuk menyimpan aset statis modul baru, ubin peta OpenStreetMap terpilih, dan berkas audio narasi secara offline.
  3. **Verifikasi Kontainer Docker & Port 3382:**
     - Memperbarui `docker-compose.yml` dan `Dockerfile` multi-stage.
     - Menjalankan uji build dan memverifikasi aplikasi beroperasi penuh tanpa error pada port `3382`.
  4. **Pembaruan Dokumentasi Resmi:**
     - Memperbarui berkas `Document/FSD.md`, `Document/TSD.md`, `Document/USER_MANUAL.md`, dan `Initial/QualityAssurance.md` agar mencerminkan seluruh kapabilitas Fase 2.
* **Kriteria Selesai:** Seluruh pengujian lolos, kontainer Docker berjalan lancar pada port 3382, fitur offline PWA terverifikasi, dan dokumentasi proyek termutakhirkan secara komprehensif.

---
*Dokumen ini merupakan cetak biru resmi urutan pengembangan teknis Fase 2 yang siap menjadi acuan kerja tim pengembang.*

