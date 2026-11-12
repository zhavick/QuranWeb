# Technical Specification Document (TSD): Aplikasi Quran Web

Dokumen ini menjabarkan spesifikasi teknis, arsitektur sistem, struktur data, dan detail implementasi untuk pengembangan aplikasi **Quran Web** berdasarkan kebutuhan pada [FSD.md](file:///Users/mac/Projects/2026/QuranWeb/Document/FSD.md) dan [MasterPlan.md](file:///Users/mac/Projects/2026/QuranWeb/Initial/MasterPlan.md).

---

## 1. Arsitektur Sistem

Aplikasi dirancang menggunakan pendekatan **Static-First Client-Side Web App (SPA / Static Export)** dengan dukungan **PWA (Progressive Web App)**. Seluruh data teks Al-Qur'an di-*host* secara mandiri sebagai aset statis agar bebas dari ketergantungan API eksternal dan tetap berfungsi saat *offline*.

```text
+-----------------------------------------------------------------------+
|                        Browser / Perangkat User                       |
|                                                                       |
|  +------------------------+    +-----------------------------------+  |
|  |   UI & Reader Modules  |    |      Client State & Storage       |  |
|  |  - Navigasi (Surat/Juz |<-->|  - localStorage (Settings,        |  |
|  |    /'Ain)              |    |    LastRead, Bookmarks)           |  |
|  |  - Reader RTL & Tajwid |    |  - IndexedDB / Cache API (Offline |  |
|  |  - Fullscreen / Mobile |    |    Surah JSON & Audio Cache)      |  |
|  |  - Adhan.js (Shalat)   |    +-----------------------------------+  |
|  +-----------+------------+                                           |
|              |                                                        |
|  +-----------v------------+                                           |
|  |  PWA Service Worker    |                                           |
|  +-----------+------------+                                           |
+--------------|--------------------------------------------------------+
               |
       +-------v--------+               +-----------------------+
       | Static Hosting |               | Audio CDN / Object    |
       | (Vercel / CF)  |               | Storage (MP3 Stream)  |
       | - App Bundle   |               +-----------------------+
       | - Quran JSON   |
       | - Self-hosted  |
       |   Arabic Fonts |
       +----------------+
```

---

## 2. Tech Stack & Dependensi Teknis

| Lapisan | Teknologi / Library | Alasan Teknis |
| :--- | :--- | :--- |
| **Framework UI** | **React 18+ (TypeScript)** via **Vite** atau **Next.js (`output: 'export'`)** | Bundle kecil, render cepat, mudah di-*deploy* ke static CDN tanpa server Node.js aktif. |
| **Styling & Layout** | **Tailwind CSS v3/v4** + CSS Custom Properties | Mendukung *mobile-first* breakpoints, tema dinamis (`data-theme`), dan utilitas RTL. |
| **State Management** | **React Context + Custom Hooks** (atau **Zustand**) | Ringan, mudah disinkronkan dengan `localStorage`. |
| **Jadwal Shalat** | **`adhan` (Adhan.js)** | Kalkulasi astronomi murni di sisi klien (0 network request, mendukung parameter Kemenag RI). |
| **PWA & Offline** | **`vite-plugin-pwa` (Workbox)** | Otomatisasi *pre-caching* app shell, font Arab, dan *runtime caching* dataset JSON. |
| **Ikonografi** | **`lucide-react`** | Tree-shakable, ringan, dan konsisten. |
| **Font Arab (Self-Hosted)** | **`Amiri Quran`**, **`Amiri`**, **`Scheherazade New`** (`.woff2`) + fallback **`LPMQ`** | Disimpan mandiri di `public/fonts/` agar teks Arab tampil konsisten di semua OS dan tetap terbaca saat *offline*. |
| **Backend API** | **Node.js (Express / HTTP)** | Menghandle endpoint telemetri IP, activity log, dan sinkronisasi staging setting ke PostgreSQL. |
| **Database Server** | **PostgreSQL 16 (`pg`)** | Menyimpan `visitor_logs`, `activity_logs`, dan tabel staging setting sementara per IP address (`temp_ip_settings`). |
| **Kontainerisasi & Port** | **Docker Compose (Port 3382)** | Menjalankan service web Nginx (port 3382), Node API, dan PostgreSQL container. |

---

## 3. Desain Struktur Data & Skema TypeScript

Untuk menjaga waktu muat awal (*initial load*) tetap cepat (< 2 detik), dataset Al-Qur'an **tidak dimuat sekaligus dalam satu file raksasa**, melainkan dipecah menjadi:
1. `public/data/meta.json` (~50–80 KB): Berisi indeks seluruh **114 Surat**, **30 Juz**, dan **556/558 'Ain (Ruku')**.
2. `public/data/surahs/{surahId}.json`: Berisi daftar ayat per surat (teks Arab Utsmani/Imlaei, tag tajwid opsional, dan terjemahan Kemenag RI) yang dimuat secara *lazy-loading* sesuai surat/juz/`'Ain` yang dibuka.

### 3.1. Skema TypeScript Inti

```ts
export interface SurahMeta {
  id: number;                // 1 - 114
  nameArabic: string;        // الفاتحة
  nameLatin: string;         // Al-Fatihah
  translationId: string;     // Pembukaan
  revelationPlace: 'Makkiyah' | 'Madaniyah';
  totalAyahs: number;
}

export interface JuzMeta {
  juzNumber: number;         // 1 - 30
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export interface AinMeta {
  ainNumber: number;         // 1 - 556 (atau 558 sesuai standar mushaf)
  surahId: number;
  surahAinIndex: number;     // Urutan 'Ain di dalam surat tersebut (misal: 'Ain ke-2 di Al-Baqarah)
  juzNumber: number;
  startAyah: number;
  endAyah: number;
}

export interface Ayah {
  id: number;                // Global ayah ID (1 - 6236)
  surahId: number;
  ayahNumber: number;
  juzNumber: number;
  ainNumber: number;
  isAinEnd: boolean;         // True jika ayat ini merupakan akhir dari sebuah 'Ain (tampil tanda ع)
  textUthmani: string;       // Teks Arab standar
  textTajweed?: string;      // Teks Arab bertag tajwid terkurasi (opsional)
  translationId: string;     // Terjemahan Kemenag RI
}
```

### 3.2. Skema State Pengguna (`localStorage`)

```ts
export type ThemeMode = 'light' | 'dark' | 'high-contrast' | 'sepia';
export type ArabicFontFamily = 'lpmq' | 'amiri' | 'scheherazade';

export interface ReaderSettings {
  theme: ThemeMode;
  elderMode: boolean;              // One-click mode lansia
  arabicFontSize: number;          // 20 - 52 (px)
  translationFontSize: number;     // 14 - 26 (px)
  lineHeight: number;              // 2.0 - 2.8
  arabicFont: ArabicFontFamily;
  showTranslation: boolean;
  tajweedEnabled: boolean;         // Otomatis di-override false saat high-contrast / elderMode
  spotlightEnabled: boolean;
  autoScrollSpeed: number;         // 0 (mati), 1 (lambat), 2 (sedang)
}

export interface LastReadState {
  mode: 'surah' | 'juz' | 'ain';
  surahId: number;
  ayahNumber: number;
  juzNumber: number;
  ainNumber: number;
  updatedAt: string;               // ISO Timestamp
}

export interface BookmarkItem {
  id: string;                      // Format: "{surahId}:{ayahNumber}"
  surahId: number;
  ayahNumber: number;
  ainNumber: number;
  note?: string;
  createdAt: string;
}
```

### 3.3. Skema Database PostgreSQL (DDL)

```sql
-- 1. Pencatatan Akses IP Pengunjung
CREATE TABLE IF NOT EXISTS visitor_logs (
  id BIGSERIAL PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_visitor_ip ON visitor_logs(ip_address);

-- 2. Pencatatan Kegiatan & Konfigurasi per IP
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  activity_type VARCHAR(50) NOT NULL,   -- Cth: 'OPEN_SETTINGS', 'CHANGE_CONFIG', 'TOGGLE_ELDER_MODE', 'PLAY_AUDIO'
  payload JSONB,                        -- Detail perubahan konfigurasi
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_activity_ip ON activity_logs(ip_address);

-- 3. Tabel Staging / Setting Sementara per IP Address (Bebas Benturan)
CREATE TABLE IF NOT EXISTS temp_ip_settings (
  ip_address VARCHAR(45) PRIMARY KEY,
  theme VARCHAR(20) DEFAULT 'light',
  elder_mode BOOLEAN DEFAULT FALSE,
  arabic_font_size INT DEFAULT 30,
  translation_font_size INT DEFAULT 16,
  line_height NUMERIC(3, 1) DEFAULT 2.2,
  arabic_font VARCHAR(20) DEFAULT 'amiri',
  show_translation BOOLEAN DEFAULT TRUE,
  tajweed_enabled BOOLEAN DEFAULT FALSE,
  spotlight_enabled BOOLEAN DEFAULT FALSE,
  auto_scroll_speed INT DEFAULT 0,
  bookmarks JSONB DEFAULT '[]'::jsonb,
  last_read JSONB DEFAULT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Akun Pengguna & Administrator (/admin & /user)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',      -- 'admin' | 'user'
  full_name VARCHAR(150),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Konfigurasi Aplikasi Dinamis (Logo, Nama, Lisensi, Copyright, Pengumuman)
CREATE TABLE IF NOT EXISTS app_configurations (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Arsip Pencarian Pengguna (Saved Searches)
CREATE TABLE IF NOT EXISTS user_saved_searches (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  query VARCHAR(255) NOT NULL,
  results_count INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabel Bookmark Cloud Pengguna
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  surah_id INT NOT NULL,
  ayah_number INT NOT NULL,
  ain_number INT DEFAULT 1,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Struktur Direktori Proyek (Aktual)

```text
src/
├── assets/               # Logo, ornamen nomor ayat SVG
├── components/
│   ├── admin/            # AdminPortal.tsx (Dashboard, Charts, Audit Trail, Config)
│   ├── user/             # UserPortal.tsx (Dashboard, Card Bookmark, Search Archive)
│   ├── auth/             # JoinPromptModal.tsx (Popup CTA Registrasi)
│   ├── layout/           # Header, Sidebar (Desktop), BottomNav (Mobile), ZenModeWrapper
│   ├── navigation/       # NavigationPanel, SurahList, JuzList, AinList, QuickSearch
│   ├── reader/           # AyahCard, AinDivider, JuzDivider, TajweedRenderer
│   ├── audio/            # AudioMiniPlayer, QariSelector
│   ├── prayer/           # PrayerTimeWidget, CitySelectorModal
│   └── settings/         # SettingsModal, AccessibilityControls, TajweedMakhrajModal
├── hooks/
│   ├── useFullscreen.ts  # Wrapper Fullscreen API + deteksi Esc
│   ├── useLocalStorage.ts
│   ├── useAutoScroll.ts  # requestAnimationFrame smooth scrolling
│   ├── usePrayerTimes.ts # Integrasi Adhan.js + interval 1 detik
│   └── useAudioPlayer.ts # Kontrol HTML5 Audio + 5 Qari + Repeat + Speed + Scrubber
├── services/
│   ├── quranData.ts      # Loader & in-memory cache untuk meta.json & surahs/*.json
│   ├── auth.ts           # Manajemen otentikasi login admin & user
│   ├── admin.ts          # Layanan statistik, audit log query & update config
│   ├── telemetry.ts      # Client telemetry (visitor IP, activity logger, staging sync)
│   └── offlineCache.ts   # Helper Cache API untuk unduh audio/surat offline
├── styles/
│   ├── themes.css        # Variabel CSS untuk Light, Dark, High-Contrast, Sepia
│   └── arabic.css        # Aturan RTL, unicode-bidi, dan font-face
└── types/
    └── quran.ts          # Definisi seluruh interface TypeScript
server/
├── index.js              # Server Node.js API (PostgreSQL pool, migrations, endpoints)
public/
├── data/
│   ├── meta.json
│   ├── translation_index.json
│   └── surahs/           # 1.json s.d. 114.json
├── fonts/                # amiri-quran.woff2, amiri.woff2, scheherazade.woff2
├── manifest.webmanifest
└── sw.js
```

---

## 5. Spesifikasi Teknis per Modul

### 5.1. Tata Letak Adaptif & Mode Layar Penuh (Desktop vs Mobile)
- **Desktop (`>= 1024px`):**
  - Layout CSS Grid 2 kolom: `grid-template-columns: 320px 1fr` dengan tinggi `100dvh`.
  - **Fullscreen / Zen Mode:** Memanggil `document.documentElement.requestFullscreen()` melalui hook `useFullscreen`. Saat aktif (`isFullscreen === true`), sidebar, header, dan widget jadwal shalat disembunyikan (`display: none` atau *slide-out*), menyisakan area baca `100vw` dengan kontainer teks terpusat (`max-width: 900px; margin: 0 auto`). Tombol melayang (*floating exit button*) muncul saat kursor digerakkan.
- **Mobile (`< 1024px`):**
  - Layout 1 kolom menggunakan `100dvh` dan `env(safe-area-inset-bottom)` agar tidak tertutup bar navigasi iOS/Android.
  - Tipografi Arab menggunakan `clamp()` atau skala dinamis dari `ReaderSettings`, dengan `overflow-wrap: break-word` agar tidak pernah memicu *horizontal scroll* bahkan pada layar 320px atau saat **Mode Lansia** (`52px`) aktif.
  - Navigasi Surah/Juz/`'Ain` menggunakan *Bottom Navigation Bar* (tinggi ~56px) yang membuka *Bottom Sheet / Slide-over Drawer*.

### 5.2. Rendering Teks Arab (`RTL`), Tajwid, & Performa Surat Panjang
- **Aturan CSS Wajib Teks Arab:**
  ```css
  .arabic-text {
    direction: rtl;
    unicode-bidi: isolate;
    text-align: right;
    word-spacing: 0.12em;
  }
  ```
- **Performa Surat Panjang:** Surat dengan ayat banyak (seperti Al-Baqarah: 286 ayat) dirender per **`'Ain`** (atau menggunakan *windowing/pagination* per `'Ain` dengan tombol "Lanjut ke `'Ain` berikutnya") agar DOM tetap ringan di perangkat mobile ber-RAM kecil.
- **Rendering Tajwid Aman:** Tag tajwid dari dataset (misal `<tajweed class="ghunnah">...</tajweed>`) diparse menggunakan parser ringan menjadi elemen `<span>` React yang aman (menghindari `dangerouslySetInnerHTML` mentah), lalu diwarnai via CSS class. Jika `theme === 'high-contrast'` atau `elderMode === true`, class warna tajwid di-override menjadi `color: inherit`.

### 5.3. Tema, *Inverse Color*, & Aksesibilitas
- Seluruh warna dikontrol melalui CSS Custom Properties pada `document.documentElement.dataset.theme`:
  - `light`: Background `#FFFFFF`, Text `#111827`
  - `dark` (*inverse*): Background `#121212`, Text `#E5E7EB`
  - `high-contrast`: Background `#000000`, Text `#FFFFFF` (atau `#FACC15` untuk penanda ayat/fokus), rasio kontras ≥ 15:1.
  - `sepia`: Background `#FBF0D9`, Text `#3D2E1E`
- **Ayat Spotlight:** Setiap `AyahCard` memiliki state `isFocused`. Saat `spotlightEnabled === true`, ayat non-aktif diberi `opacity: 0.35; transition: opacity 200ms`.
- **Keyboard Shortcuts (Desktop):** Listener `window.addEventListener('keydown', ...)` untuk `f` (toggle fullscreen), `+`/`-` (ubah ukuran font), `ArrowLeft`/`ArrowRight` (pindah `'Ain` / Surat berikutnya-sebelumnya — disesuaikan dengan konteks arah baca).

### 5.4. Jadwal Shalat & Waktu Aktual (`Adhan.js`)
- Menggunakan library `adhan` di sisi klien:
  - Parameter default untuk Indonesia: `CalculationMethod.Singapore()` atau custom parameter **Kemenag RI** (`fajrAngle = 20`, `ishaAngle = 18`, `madhab = Madhab.Shafi`).
  - Lokasi default: Koordinat Jakarta (`-6.2088, 106.8456`) atau kota pilihan user dari daftar kota statis (`cities.json`).
  - GPS (`navigator.geolocation.getCurrentPosition`) **hanya** dipanggil ketika user menekan tombol *"Gunakan Lokasi Saya"*.
- Jam aktual & *countdown* ke waktu shalat berikutnya diperbarui setiap 1000ms melalui `setInterval` yang dibersihkan saat unmount.

### 5.5. Audio Recitation & Offline Cache
- Menggunakan instance tunggal `HTMLAudioElement` yang dikelola oleh `useAudioPlayer`:
  - URL audio menggunakan pola terstruktur per ayat (misal `https://cdn.islamic.network/quran/audio/128/{qari}/{globalAyahId}.mp3` atau CDN pilihan).
  - Saat event `ended` terpicu:
    - Jika `repeatMode === 'ayah'`, ulangi ayat yang sama.
    - Jika tidak, lanjut ke `ayahNumber + 1` dan otomatis panggil `element.scrollIntoView({ behavior: 'smooth', block: 'center' })` untuk efek *Ayah-Sync*.
- **Unduh Offline per Surat/'Ain:** Memanfaatkan browser `caches.open('quran-audio-v1')` untuk menyimpan file `.mp3` ayat-ayat dalam surat/`'Ain` pilihan user agar bisa diputar tanpa koneksi.

### 5.6. Portal Administrator (`/admin`) & Portal Pengguna (`/user`)
- **Routing SPA Sisi Klien:** Memanfaatkan History API (`pushState` dan listener event `popstate`) yang diselaraskan dengan aturan Nginx `try_files $uri $uri/ /index.html;`:
  - Rute `/admin`: Membuka `AdminPortal.tsx`.
  - Rute `/user`: Membuka `UserPortal.tsx`.
  - Rute `/`: Membuka pembaca Al-Qur'an utama.
- **Otentikasi & Keamanan Sesi:**
  - Token sesi disimpan di `localStorage` (`quranweb_auth_session`).
  - Akun demo tersemat: Administrator (`admin` / `admin123`) dan Anggota (`fulan` / `user123`).
- **Dashboard Statistik & Chart Visual:**
  - Grafik batang geolokasi IP pengunjung (Indonesia, Malaysia, Singapura, Arab Saudi, dll.).
  - Grafik tren kunjungan mingguan (Senin–Minggu) dengan visualisasi lonjakan hari Jum'at.
- **Modul Audit Trail Komprehensif:**
  - Tabel log interaktif terhubung ke tabel PostgreSQL `activity_logs` dengan pagination, filter tipe, pencarian real-time, dan fitur ekspor JSON.
- **Modul Konfigurasi Identitas Situs:**
  - Antarmuka pengelola untuk memperbarui data tabel `app_configurations` (nama aplikasi, logo kaligrafi, teks copyright, lisensi, dan broadcast banner pengumuman) secara dinamis tanpa perlu deploy ulang.

---

## 6. Strategi Caching & Ketahanan Offline (PWA)

Konfigurasi Workbox Service Worker:
1. **Precache (Install Phase):** `index.html`, JS/CSS bundle, `manifest.webmanifest`, `public/fonts/*.woff2`, dan `public/data/meta.json`.
2. **Runtime Cache (`CacheFirst`):** `public/data/surahs/*.json` — sekali dibuka oleh user, surat tersebut otomatis tersimpan permanen di cache browser untuk akses *offline* berikutnya (disediakan juga tombol *"Simpan Semua Teks Al-Qur'an Offline"* yang melakukan *prefetch* seluruh 114 JSON sekaligus ±3–5 MB).
3. **Runtime Cache Audio (`CacheOnly` / `CacheFirst` on-demand):** Hanya file audio yang secara eksplisit diunduh user yang disimpan ke cache agar tidak memenuhi kuota penyimpanan HP user.

---

## 7. Target Kualitas & Pengujian (Testing)

| Aspek | Target / Kriteria Verifikasi |
| :--- | :--- |
| **Lighthouse Score** | Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, PWA Installable. |
| **Responsivitas** | Tidak ada *horizontal overflow* dari lebar `320px` (Mobile SE) hingga `2560px` (Desktop Fullscreen), termasuk saat `arabicFontSize = 52px`. |
| **Akurasi Data** | Verifikasi jumlah total 114 Surat, 6.236 Ayat, 30 Juz, dan konsistensi batas awal-akhir seluruh `'Ain` (Ruku'). |
| **Kompatibilitas Harakat** | Uji visual rendering harakat (fathah, kasrah, dhammah, sukun, tasydid, mad) pada Chrome Android, Safari iOS, Safari/Chrome macOS, dan Edge/Chrome Windows. |
| **Ketahanan Offline** | Uji membuka aplikasi dalam mode *Offline* (DevTools Network: Offline) — teks Al-Qur'an, terjemahan, bookmark, dan jadwal shalat (`Adhan.js`) harus tetap berjalan 100%. |

---

## 8. Konfigurasi Deployment & Docker (Port 3382)

Aplikasi dilengkapi konfigurasi kontainerisasi mandiri sehingga dapat dijalankan di VPS atau server lokal mana pun tanpa konfigurasi manual:

### 8.1. Dockerfile Multi-Stage
- **Stage 1 (`builder`):** Menggunakan `node:20-alpine` untuk menginstal dependensi (`npm ci`) dan menghasilkan bundle statis teroptimasi (`npm run build`).
- **Stage 2 (`runner`):** Menggunakan `nginx:alpine`, menyalin file `dist/` ke `/usr/share/nginx/html`, dan memuat `nginx.conf` kustom.
- **Port:** Diekspos pada port `3382` (`EXPOSE 3382`).

### 8.2. Optimasi Nginx (`nginx.conf`)
- Mengaktifkan kompresi Gzip untuk teks, CSS, JS, JSON, dan WOFF2 fonts.
- Header *long-term cache* (`Cache-Control: public, max-age=31536000, immutable`) untuk aset statis (`/assets/`, `/fonts/`).
- Header *no-cache* untuk `/sw.js` agar pembaruan PWA Service Worker segera terdeteksi oleh browser.
- *Fallback* rute `try_files $uri $uri/ /index.html;` untuk mendukung SPA.

### 8.3. Orchestration Docker Compose
```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: quran-postgres
    environment:
      POSTGRES_DB: quranweb
      POSTGRES_USER: quran_user
      POSTGRES_PASSWORD: quran_secret_password
    ports:
      - "5572:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    container_name: quran-api
    environment:
      DATABASE_URL: postgres://quran_user:quran_secret_password@postgres:5432/quranweb
      PORT: 4000
    depends_on:
      - postgres
    restart: unless-stopped

  quranweb:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: quran-web
    ports:
      - "3382:3382"
    depends_on:
      - api
    restart: unless-stopped

volumes:
  postgres_data:
```
- Perintah eksekusi: `docker compose up -d --build`.
- Endpoint aplikasi: `http://localhost:3382`.

---

## 9. Status Pelaksanaan & Keterkaitan Dokumen

Implementasi teknis mengacu pada tahapan bertahap yang telah diselesaikan pada [DEV_STEP.md](file:///Users/mac/Projects/2026/QuranWeb/Initial/DEV_STEP.md):
- **Step 1 (Fondasi & Dataset):** Dataset mandiri 114 Surat (`meta.json` & `surahs/*.json`), 6.236 Ayat, 30 Juz, 556 'Ain, font self-hosted `amiri-quran.woff2`.
- **Step 2 (Quran Reader):** Komponen `AyahCard`, `TajweedRenderer`, arah baca RTL, penanda akhir 'Ain (`ع`), dan terjemahan resmi Kemenag RI.
- **Step 3 (Navigasi & Tata Letak):** Split-view desktop, Fullscreen Zen Mode (F), 1-kolom mobile proporsional + safe-area.
- **Step 4 (Riwayat & Pencarian):** `LastReadState`, `BookmarkItem` (`localStorage`), filter cepat nama/nomor/juz/'ain.
- **Step 5 (Aksesibilitas):** 4 tema (Light, Dark, High-Contrast, Sepia), Mode Lansia (1-klik), skala font 20–52px, Ayat Spotlight, Auto-scroll.
- **Step 6 (Jadwal Shalat):** `PrayerTimeWidget` berbasis `adhan` parameter Kemenag RI (Fajr 20°, Isha 18°), countdown, daftar kota & GPS.
- **Step 7 (Edukasi & Audio):** `TajweedRenderer` (1-klik saklar cepat), `TajweedMakhrajModal` (3 tab interaktif: 11 kaidah tajwid, 5 makhraj, 7 waqaf), dan `AudioMiniPlayer` mutakhir (5 Qari mu'tabar, pengatur kecepatan 0.75x–1.5x, linimasa scrubber, volume/mute, continuous section play, dan *Ayah-Sync*).
- **Step 8 (Admin & User Portals, PWA Offline & Docker):**
  - **Portal Administrator (`/admin`):** Kredensial `admin` / `admin123`, dashboard statistik & chart geolokasi IP, modul Audit Trail penuh dengan filter & ekspor JSON, serta modul konfigurasi identitas situs (logo, nama, lisensi, copyright, broadcast pengumuman).
  - **Portal Pengguna (`/user`):** Kredensial `fulan` / `user123`, dashboard card bookmark pribadi, modul arsip pencarian terjemahan (*search archive*), dan sinkronisasi bacaan.
  - **PWA & Kontainerisasi:** Service worker `sw.js`, `manifest.webmanifest`, `Dockerfile` & `docker-compose.yml` (PostgreSQL 16 + API + Web) pada port `3382`.
- **Panduan Pengoperasian:** Rincian cara penggunaan lengkap didokumentasikan di [USER_MANUAL.md](file:///Users/mac/Projects/2026/QuranWeb/Document/USER_MANUAL.md) (15 bab komprehensif).

