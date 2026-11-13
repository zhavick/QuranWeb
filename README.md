# 📖 QuranWeb
### Platform Al-Qur'an Digital Modern Ramah Lansia dengan Navigasi Surat, Juz, dan 'Ain

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Kemenag RI Standard](https://img.shields.io/badge/Standard-Kemenag%20RI-008000)](https://quran.kemenag.go.id/)
[![License](https://img.shields.io/badge/License-Open%20Waqf%20%2F%20MIT-blue.svg)](LICENSE)

---

## 🌟 Tentang QuranWeb

**QuranWeb** adalah aplikasi Al-Qur'an digital berbasis web yang dirancang khusus untuk memberikan pengalaman membaca Al-Qur'an yang bersih, tenang, bebas distraksi, serta sangat ramah bagi orang tua dan lanjut usia (*elder-friendly*). 

Aplikasi ini memiliki keunggulan utama dalam sistem pembagian navigasi Al-Qur'an yang mencakup **Surat**, **Juz**, dan **'Ain (Ruku' Tematik)**, didukung dataset statis mandiri sebanyak **6.236 ayat lengkap** berstandar **Kementerian Agama Republik Indonesia (Kemenag RI)**.

---

## 🚀 Keunggulan & Fitur Utama

### 1. Tiga Dimensi Navigasi Al-Qur'an
- **Surat (114 Surat):** Indeks surat Makkiyah/Madaniyah lengkap dengan arti dan jumlah ayat.
- **Juz (30 Juz):** Pembagian tradisi tilawah khatam 30 juz.
- **'Ain / Ruku' (556 'Ain):** Pembagian tematik paragraf makna (*Maqra'*) yang ditandai dengan simbol huruf Arab **`ع`**, memudahkan imam shalat dan pembaca memahami akhir suatu pembahasan topik ayat.

### 2. Desain Adaptif & Zen Fullscreen
- **Desktop Zen Mode:** Dukungan *Browser Fullscreen API* (tekan `F`) yang menyembunyikan seluruh bilah navigasi dan menu untuk kekhusyukan membaca tanpa gangguan.
- **Mobile-First Responsive:** Ketinggian terkunci presisi di `100dvh`, tipografi mengalir (*fluid typography*), dan anti-geser horizontal (*zero horizontal scroll*).

### 3. Aksesibilitas Tingkat Tinggi & Mode Lansia (*Elder Mode*)
- **1-Klik Mode Lansia:** Seketika memperbesar font Arab hingga `42px+`, spasi baris longgar, font terjemahan besar, dan otomatis mematikan warna tajwid yang membingungkan mata orang tua.
- **Skala Font Luas:** Slider ukuran teks Arab fleksibel dari `22px` hingga `52px`.
- **4 Tema Kontras Ramah Mata:**
  - ☀️ **Light Mode:** Bersih dan natural untuk siang hari.
  - 🌙 **Dark Inverse Mode:** Latar hitam pekat ramah layar OLED/AMOLED di malam hari.
  - 🔲 **High Contrast Mode:** Garis tepi tegas dan kontras tinggi memenuhi standar WCAG AAA.
  - 📜 **Sepia Paper Mode:** Nuansa kertas klasik mushaf kuno yang menyejukkan mata.
- **3 Font Arab Self-Hosted:** **LPMQ Isep Misbah** (Mushaf Standar Indonesia), **Amiri**, dan **Scheherazade New**.

### 4. Edukasi Pemula & Tajwid Berwarna
- **Toggle Tajwid 1-Klik:** Pewarnaan kaidah tajwid langsung pada teks Arab dengan proteksi otomatis nonaktif saat Mode Lansia / Kontras Tinggi.
- **Modal Panduan Interaktif 3 Tab:**
  - 🎨 **11 Kaidah Hukum Tajwid & Legenda Warna:** Dilengkapi durasi harakat, hukum nun/mim mati, mad, qalqalah, dan contoh ayat.
  - 🗣️ **5 Makharijul Huruf:** Panduan area artikulasi lisan beserta tips praktis untuk penutur bahasa Indonesia.
  - 🛑 **7 Tanda Waqaf & Ibtida':** Penjelasan tanda waqaf lazim, jaiz, saktah, dll., disertai filter pencarian langsung.

### 5. Audio Recitation Murottal Berkualitas Tinggi
- **5 Pilihan Qari Mu'tabar:**
  - Syaikh Mishary Rashid Alafasy
  - Syaikh Mahmoud Khalil Al-Husary (Tartil edukatif)
  - Syaikh Muhammad Siddiq Al-Minshawi
  - Syaikh Abdurrahman As-Sudais
  - Syaikh Abu Bakr Asy-Syathiri
- **Pengatur Kecepatan:** `0.75x` (belajar tahsin), `1.0x` (normal), `1.25x`, dan `1.5x` (tadarus).
- **Ayah-Sync & Auto-Scroll:** Penandaan ayat aktif (*highlight*) dan layar bergulir otomatis mengikuti qari.
- **Mode Ulangi (*Repeat Mode*):** `1x`, `Ulang Ayat` (menghafal/tahfidz), dan `Lanjut` (berurutan).
- **Aksi Cepat:** Tombol "Dengarkan Surat / 'Ain Ini" untuk pemutaran otomatis satu bagian penuh.

### 6. Waktu Aktual & Jadwal Shalat Kemenag RI
- Jam digital *real-time* dan hitung mundur (*countdown*) shalat berikutnya.
- Perhitungan astronomis akurat berbasis library `Adhan.js` dengan sudut hisab Kemenag RI (Subuh 20°, Isya 18°).
- Pemilihan kota di Indonesia serta tombol pendeteksi lokasi otomatis (GPS).

### 7. Riwayat Baca, Bookmark & Pencarian Cepat
- **Last Read:** Otomatis menyimpan ayat terakhir yang dibaca ke `localStorage` dan tersinkronisasi.
- **Bookmark Tadabbur:** Menandai ayat penting dilengkapi catatan pribadi.
- **Shareable URL:** Berbagi tautan ayat langsung (contoh: `http://localhost:3382/?surah=2&ayah=255`).
- **Pencarian Kilat:** Pencarian teks Arab, nomor surat, nomor Juz, nomor 'Ain, dan kata kunci terjemahan.

### 8. Backend PostgreSQL & Sistem Keamanan
- **Pencatatan Log Kunjungan IP (`visitor_logs`):** Mencatat IP, user-agent, dan geolokasi negara asal.
- **Pencatatan Log Aktivitas (`activity_logs`):** Audit trail lengkap aksi pembaca untuk analisis performa.
- **Tabel Staging per-IP (`temp_ip_settings`):** Menyimpan setelan sementara pengunjung tanpa berbenturan antar-pengguna.
- **Modal Ajakan Bergabung:** Menampilkan ajakan registrasi akun saat pengunjung menyimpan pengaturan.

### 9. Portal Administrator (`/admin`) & Portal Pengguna (`/user`)
- **Portal Admin (`http://localhost:3382/admin`):**
  - Kredensial bawaan: Username `admin`, Password `admin123`.
  - **Dashboard Chart Interaktif:** Grafik batang pengunjung berdasarkan geolokasi negara, tren mingguan, durasi sesi rata-rata, dan statistik pembaca.
  - **Audit Trail Penuh:** Filter log kegiatan, pencarian berbasis IP/aksi, dan ekspor riwayat ke file `.json`.
  - **Modul Konfigurasi & Branding:** Mengubah nama aplikasi, logo/simbol, copyright, lisensi, dan menyiarkan banner pengumuman (*broadcast announcement*).
- **Portal Pengguna (`http://localhost:3382/user`):**
  - Kredensial demo: Username `fulan`, Password `user123`.
  - **Kartu Bookmark Pribadi:** Tampilan bookmark dengan catatan tadabbur dan 1-klik buka ayat di pembaca.
  - **Arsip Pencarian yang Disimpan:** Menyimpan riwayat pencarian tema Al-Qur'an dengan 1-klik tilawah.

### 10. Modul Ekosistem Fase 2 (Kisah Nabi, Blog, Doa, Khatam, Kiblat, Masjid & Literasi)
- **Kisah 25 Rasulullah (`/kisah`):** Ensiklopedia sirah 25 nabi lengkap berbobot (209 KB), *bi-directional linking* ke mushaf & audio, serta kompilasi Do'a Al-Anbiya'.
- **Jurnal Literasi & Blog Tadabbur (`/blog`):** 5 pilar konten, widget kutipan ayat interaktif ber-audio, dan panel CMS di `/admin` dengan manajemen status artikel.
- **Rencana Khatam Sakinah ('Ain):** Pelacak tilawah ramah lansia berbasis 556 'Ain tematik tanpa tekanan kompetitif, cincin progres, dan konfeti.
- **Kumpulan 40 Doa Rabbana & Tasbih Haptic (`/doa`):** 40 doa mustajab Al-Qur'an, dzikir pagi-petang, dan tasbih getar layar penuh (`navigator.vibrate`) khusus anggota.
- **Kompas Arah Kiblat Adaptif (`/kiblat`):** 100% offline, kompas gerak ponsel bergetar saat menghadap Ka'bah, sudut azimuth laptop & panduan bayangan matahari.
- **Peta Masjid Terdekat OpenStreetMap (`/masjid`):** Peta Leaflet.js lokal 4 tema, integrasi izin GPS jadwal shalat, estimasi jalan santai lansia, dan navigasi suara belokan.
- **Asbabun Nuzul, Gharibul Qur'an & Audiobook 3 Menit:** Badge riwayat sebab turunnya ayat (*Lubabun Nuqul* & *Al-Wahidi*), kamus kosakata sastra tinggi & balaghah, serta pemutar audiobook suara hangat dengan Sleep Timer dan tempo lansia `0.75x`.

### 11. PWA Offline First
- *Service Worker* mandiri (`sw.js` v7) untuk *pre-caching* aplikasi, font, dan dataset statis sehingga Al-Qur'an dan seluruh modul edukasi dapat diakses kapan pun tanpa sambungan internet.

---

## 🏗️ Struktur Direktori Proyek

```text
QuranWeb/
├── Document/                 # Dokumentasi Resmi & Spesifikasi Sistem
│   ├── FSD.md                # Functional Specification Document (15 Bab)
│   ├── TSD.md                # Technical Specification Document (15 Bab)
│   └── USER_MANUAL.md        # Panduan Lengkap Pengguna & Administrator
├── Initial/                  # Perencanaan & Kontrol Kualitas
│   ├── MasterPlan.md         # Master Plan & Brainstorming Awal (Fase 1)
│   ├── MasterPlan-2.md       # Cetak Biru Ekosistem Pembelajaran & Ibadah (Fase 2)
│   ├── DEV_STEP.md           # Urutan Pengembangan Fase 1 (Step 1 s.d. Step 8)
│   ├── DEV_STEP_2.md         # Urutan Pengembangan Fase 2 (Step 9 s.d. Step 17)
│   └── QualityAssurance.md   # Test Cases & Hasil Pengujian Mutu (54 Kasus Uji)
├── public/                   # Aset Statis Publik
│   ├── data/                 # Dataset Mandiri Al-Qur'an (meta.json & surahs/*.json)
│   ├── fonts/                # Font Arab Self-Hosted (.woff2)
│   ├── sw.js                 # Service Worker PWA Offline
│   └── manifest.json         # PWA Web App Manifest
├── server/                   # Backend Node.js & PostgreSQL Service
│   └── index.js              # REST API: Telemetri, Audit Trail, Konfigurasi & Auth
├── src/                      # Source Code Frontend React + TypeScript
│   ├── components/           # Komponen UI Terstruktur
│   │   ├── admin/            # Portal Administrator & Charts Geolokasi
│   │   ├── audio/            # Audio Mini-Player Murottal
│   │   ├── navigation/       # Sidebar Navigasi (Surat, Juz, 'Ain)
│   │   ├── prayer/           # Widget Waktu Aktual & Jadwal Shalat
│   │   ├── reader/           # AyahCard, TajweedRenderer & Lembar Tilawah
│   │   ├── settings/         # Modal Pengaturan, Aksesibilitas & Panduan Tajwid
│   │   └── user/             # Portal Pengguna Anggota (Cards Bookmark & Search)
│   ├── hooks/                # Custom React Hooks (Audio, Fullscreen, AutoScroll, dsb.)
│   ├── services/             # Integrasi Data & API (quranData, auth, admin)
│   ├── types/                # TypeScript Interfaces & Types
│   ├── App.tsx               # Komponen Induk Aplikasi
│   └── main.tsx              # Entry Point Vite
├── docker-compose.yml        # Orkestrasi PostgreSQL 16 + Node.js API + Web Nginx
├── Dockerfile                # Multi-stage build Nginx Client
├── Dockerfile.api            # Dockerfile Backend API
├── nginx.conf                # Konfigurasi Reverse Proxy Nginx & Routing SPA
├── package.json              # Dependensi & Script Proyek
├── tsconfig.json             # Konfigurasi TypeScript
└── vite.config.ts            # Konfigurasi Bundler Vite & Dev Proxy
```

---

## ⚡ Panduan Menjalankan Aplikasi (Getting Started)

### Prasyarat
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) terinstal di komputer Anda.
- *(Opsional untuk local dev tanpa Docker)*: [Node.js](https://nodejs.org/) v20+ dan npm.

---

### Cara 1: Menjalankan Menggunakan Docker Compose (Direkomendasikan)

Cukup jalankan satu perintah berikut di direktori proyek:

```bash
docker compose up -d --build
```

Setelah proses build selesai, buka browser Anda pada alamat:
👉 **[http://localhost:3382](http://localhost:3382)**

Untuk menghentikan kontainer:
```bash
docker compose down
```

---

### Cara 2: Menjalankan Secara Manual (Development Mode)

1. **Instalasi Dependensi Frontend:**
   ```bash
   npm install
   ```

2. **Jalankan Frontend Dev Server:**
   ```bash
   npm run dev
   ```
   Aplikasi client akan berjalan di port `3382` atau port vite yang ditentukan.

3. **Jalankan Backend Service:**
   ```bash
   DATABASE_URL=postgres://quran_user:quran_secret_password@localhost:5572/quranweb PORT=4000 node server/index.js
   ```

4. **Kompilasi & Build Produksi:**
   ```bash
   npm run build
   ```

---

## 🗺️ Status Modul Pengembangan Tahap 2 (Phase 2 Ecosystem)

Modul-modul **Tahap 2** telah berhasil diimplementasikan dan tervalidasi 100%, terdokumentasi lengkap pada [Initial/MasterPlan-2.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/MasterPlan-2.md) dan [Initial/DEV_STEP_2.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/DEV_STEP_2.md):

1. **Standarisasi Akun (RBAC) & Logout Halaman Depan (Step 9 - Selesai):** Pemisahan peran Super Admin, Dewan Asatidz, Editor, Jamaah, dan Tamu; dilengkapi tombol Logout cepat langsung di header tilawah dengan modal santun ramah lansia.
2. **Kisah 25 Rasulullah Lengkap Berbobot (Step 10 & 16 - Selesai):** Naskah sirah nabawi terverifikasi mendalam (209 KB), taut silang dua arah ke lembar mushaf & audio murottal, dan kurasi doa mustajab para nabi.
3. **Jurnal Literasi & Blog Tadabbur (Step 11 & 14 - Selesai):** 5 pilar konten, kartu kutipan ayat interaktif ber-audio, antarmuka CMS di `/admin`, dan catatan tadabbur pribadi di `/user`.
4. **Rencana Khatam Ramah Lansia (Step 12 & 13 - Selesai):** Ritme Sakinah berbasis 'Ain (1 'Ain usai shalat fardhu / khatam ~111 hari tanpa rasa lelah) dengan pelacak cincin progres yang tenang dan isolasi akun.
5. **Kompilasi 40 Doa Rabbana & Tasbih Haptic (Step 13 & 14 - Selesai):** Kompilasi doa mustajab Al-Qur'an, dzikir pagi-petang, dan tasbih digital getar layar penuh tanpa perlu memelototi angka di layar HP khusus anggota.
6. **Arah Kiblat Adaptif (Step 14 - Selesai):** Kompas putar dinamis + haptic di smartphone vs panduan sudut azimuth & jam matahari di laptop, beroperasi 100% offline.
7. **Peta Masjid Terdekat OpenStreetMap (Step 15 & 16 - Selesai):** Menu navbar baru `/masjid`, peta Leaflet.js lokal, integrasi izin lokasi jadwal shalat, estimasi jarak jalan santai lansia, panduan rute navigasi suara 1-klik, dan proteksi sesi akun.
8. **Asbabun Nuzul, Glosarium Mufradat & Audio Narasi (Step 16 - Selesai):** Konteks sejarah turunnya ayat, kamus kosakata Al-Qur'an & balaghah, dan rekaman audio cerita bertutur 3 menit untuk mata lelah dengan Sleep Timer.
9. **Audit Aksesibilitas WCAG & Kontainerisasi Rilis (Step 17 - Rencana Rilis Akhir):** Standarisasi tap target ≥44px, uji 4 tema kontras, verifikasi Docker port 3382.

---

## 🔑 Kredensial Akses Bawaan (Default Credentials)

Aplikasi telah dilengkapi dengan akun bawaan untuk mempermudah evaluasi dan pengujian fitur:

### 1. Portal Administrator (`/admin`)
- **URL Akses:** [http://localhost:3382/admin](http://localhost:3382/admin)
- **Super Administrator:** Username `admin`, Password `admin123` (Konfigurasi situs, geolokasi IP, dan audit trail).
- **Dewan Asatidz & Verifikator:** Username `asatidz`, Password `asatidz123` (Kurasi naskah sirah nabawi & doa).
- **Editor & Tim Redaksi:** Username `editor`, Password `editor123` (Penyusunan draf artikel jurnal tadabbur).

### 2. Portal Pengguna Terdaftar (`/user`)
- **URL Akses:** [http://localhost:3382/user](http://localhost:3382/user)
- **Anggota Demo (Jamaah):** Username `fulan` *(atau email: `user@quranweb.id`)*, Password `user123`
- **Fitur Utama:** Kartu bookmark pribadi dengan catatan tadabbur, arsip pencarian tersimpan, daftar baca nanti (*Read Later*), dan sinkronisasi tilawah.

*(Tersedia tombol satu-klik "Isi Kredensial Demo" di masing-masing halaman login untuk kenyamanan pengujian)*.

---

## 📚 Dokumentasi Lengkap Proyek

Informasi teknis dan panduan operasional mendalam tersedia pada direktori dokumentasi:

- 📋 [Initial/MasterPlan.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/MasterPlan.md) — Konsep arsitektur, visi produk, dan analisis sumber dataset Al-Qur'an (Fase 1).
- 📜 [Initial/MasterPlan-2.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/MasterPlan-2.md) — Cetak biru ekosistem pembelajaran, ibadah harian, dan navigasi masjid (Fase 2).
- 🛣️ [Initial/DEV_STEP.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/DEV_STEP.md) — Rincian pembagian urutan pengerjaan Step 1 hingga Step 8 (Fase 1 - Selesai).
- 🧭 [Initial/DEV_STEP_2.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/DEV_STEP_2.md) — Panduan tahapan pengerjaan bertahap Step 9 hingga Step 17 (Fase 2).
- 🧪 [Initial/QualityAssurance.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/QualityAssurance.md) — Matriks 54 kasus uji mutu aplikasi beserta hasil verifikasinya.
- 📑 [Document/FSD.md](file:///c:/TEMP/VSCODE/QuranWeb/Document/FSD.md) — Dokumen Spesifikasi Fungsional (FSD) lengkap 15 Bab.
- ⚙️ [Document/TSD.md](file:///c:/TEMP/VSCODE/QuranWeb/Document/TSD.md) — Dokumen Spesifikasi Teknis (TSD) skema database, API, dan performa.
- 📖 [Document/USER_MANUAL.md](file:///c:/TEMP/VSCODE/QuranWeb/Document/USER_MANUAL.md) — Buku Manual Panduan Pengguna dan Administrator.

---

## 📜 Lisensi & Wakaf Digital

Aplikasi ini dirilis di bawah naungan **Open Waqf License / MIT License**. Kode sumber dan dataset ini diwakafkan untuk kemaslahatan umat Islam dan dapat dipergunakan, dikembangkan, serta disebarluaskan secara bebas untuk tujuan ibadah, dakwah, dan pembelajaran.

---

*Semoga aplikasi ini menjadi amal jariyah yang membawa keberkahan dan memudahkan setiap muslim dalam berinteraksi dengan Kitab Suci Al-Qur'an di mana pun dan kapan pun.* 🤲

*Syafix Said*

