# Technical Specification Document (TSD): Aplikasi QuranWeb
## Dokumen Spesifikasi Teknis, Arsitektur Sistem, dan Struktur Kode Lengkap

---

### Lembar Informasi Dokumen (Document Control)

| Parameter | Keterangan |
| :--- | :--- |
| **Nama Proyek** | QuranWeb: Platform Tilawah Al-Qur'an Digital Modern Ramah Lansia |
| **Kode Dokumen** | QW-DOC-TSD-001 |
| **Versi Dokumen** | 2.0.0 (Comprehensive Architecture Release) |
| **Status Dokumen** | Disetujui & Tervalidasi Produksi (Production Ready) |
| **Tanggal Pembaruan** | 17 November 2026 |
| **Target Lingkungan** | Web Browser Modern (Desktop & Mobile), PWA Offline, Docker Container Port 3382 |
| **Basis Dokumen Rujukan** | [FSD.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Document/FSD.md), [TSD.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Document/TSD.md), [USER_MANUAL.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Document/USER_MANUAL.md), [MasterPlan.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/MasterPlan.md), [MasterPlan-2.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/MasterPlan-2.md), [DEV_STEP.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/DEV_STEP.md), [DEV_STEP_2.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/DEV_STEP_2.md), [QualityAssurance.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/QualityAssurance.md) |

---

## DAFTAR ISI

- [BAB 1: ARSITEKTUR SISTEM & DESAIN TINGKAT TINGGI](#bab-1-arsitektur-sistem--desain-tingkat-tinggi)
  - [1.1 Paradigma Desain Sistem](#11-paradigma-desain-sistem)
  - [1.2 Diagram Arsitektur Komponen Perangkat Lunak](#12-diagram-arsitektur-komponen-perangkat-lunak)
  - [1.3 Aliran Data Antar-Komponen](#13-aliran-data-antar-komponen)
- [BAB 2: STACK TEKNOLOGI & DEPENDENSI PERANGKAT LUNAK](#bab-2-stack-teknologi--dependensi-perangkat-lunak)
  - [2.1 Matriks Teknologi Frontend, Backend, dan Basis Data](#21-matriks-teknologi-frontend-backend-dan-basis-data)
  - [2.2 Pustaka Klien Kritis](#22-pustaka-klien-kritis)
  - [2.3 Font Arab Mandiri (Self-Hosted WOFF2)](#23-font-arab-mandiri-self-hosted-woff2)
  - [2.4 Server Backend & Pool PostgreSQL](#24-server-backend--pool-postgresql)
- [BAB 3: MODEL DATA & SKEMA SPESIFIKASI TEKNIS](#bab-3-model-data--skema-spesifikasi-teknis)
  - [3.1 Skema Antarmuka TypeScript Inti (Core Mushaf & Meta)](#31-skema-antarmuka-typescript-inti-core-mushaf--meta)
  - [3.2 Skema Modul Khazanah & Sejarah](#32-skema-modul-khazanah--sejarah)
  - [3.3 Skema State Sisi Klien & Preferensi Pengguna (localStorage)](#33-skema-state-sisi-klien--preferensi-pengguna-localstorage)
  - [3.4 Skema Relasional PostgreSQL Lengkap (DDL 9 Tabel Utama)](#34-skema-relasional-postgresql-lengkap-ddl-9-tabel-utama)
- [BAB 4: STRUKTUR DIREKTORI PROYEK & TATA KELOLA KODE](#bab-4-struktur-direktori-proyek--tata-kelola-kode)
  - [4.1 Hierarki Direktori Aplikasi Aktual](#41-hierarki-direktori-aplikasi-aktual)
  - [4.2 Pemetaan Tanggung Jawab Modul Komponen](#42-pemetaan-tanggung-jawab-modul-komponen)
- [BAB 5: SPESIFIKASI TEKNIS IMPLEMENTASI MODUL](#bab-5-spesifikasi-teknis-implementasi-modul)
  - [5.1 Modul Tata Letak Adaptif, Layar Penuh Desktop & Mobile Safe-Area](#51-modul-tata-letak-adaptif-layar-penuh-desktop--mobile-safe-area)
  - [5.2 Modul Rendering Teks Arab RTL, Tajwid Berwarna & Optimasi DOM](#52-modul-rendering-teks-arab-rtl-tajwid-berwarna--optimasi-dom)
  - [5.3 Modul Sistem Tema Dinamis, Ayat Spotlight & Aksesibilitas Lansia](#53-modul-sistem-tema-dinamis-ayat-spotlight--aksesibilitas-lansia)
  - [5.4 Modul Kalkulasi Waktu Aktual & Jadwal Shalat Offline (Adhan.js)](#54-modul-kalkulasi-waktu-aktual--jadwal-shalat-offline-adhanjs)
  - [5.5 Modul Audio Recitation, Ayah-Sync, Multi-Qari & Offline Audio Caching](#55-modul-audio-recitation-ayah-sync-multi-qari--offline-audio-caching)
  - [5.6 Modul Algoritma Arah Kiblat Great Circle Ka'bah (Dinamis & Azimuth)](#56-modul-algoritma-arah-kiblat-great-circle-kabah-dinamis--azimuth)
  - [5.7 Modul Peta Interaktif Masjid Leaflet.js & Algoritma Rute Lansia](#57-modul-peta-interaktif-masjid-leafletjs--algoritma-rute-lansia)
  - [5.8 Modul Khazanah Ulumul Qur'an (Asbabun Nuzul, Gharib & Audiobook 3 Menit)](#58-modul-khazanah-ulumul-quran-asbabun-nuzul-gharib--audiobook-3-menit)
  - [5.9 Modul Rencana Khatam Sakinah 556 'Ain & Progress Ring](#59-modul-rencana-khatam-sakinah-556-ain--progress-ring)
  - [5.10 Modul Portal Administrator, Chart.js Dual-Series Audit Trail & CMS Blog](#510-modul-portal-administrator-chartjs-dual-series-audit-trail--cms-blog)
  - [5.11 Modul Portal Pengguna, Card Bookmark & Sinkronisasi Cloud](#511-modul-portal-pengguna-card-bookmark--sinkronisasi-cloud)
  - [5.12 Modul Gateway Email Buletin, Pengingat Tilawah & Pengaturan SMTP](#512-modul-gateway-email-buletin-pengingat-tilawah--pengaturan-smtp)
- [BAB 6: STRATEGI CACHING, KETAHANAN OFFLINE & SERVICE WORKER (PWA)](#bab-6-strategi-caching-ketahanan-offline--service-worker-pwa)
  - [6.1 Fase Pre-Caching Inti (App Shell, Font, Dataset Metadata)](#61-fase-pre-caching-inti-app-shell-font-dataset-metadata)
  - [6.2 Strategi Runtime Cache (CacheFirst & On-Demand)](#62-strategi-runtime-cache-cachefirst--on-demand)
  - [6.3 Siklus Hidup Pembaruan Service Worker (sw.js)](#63-siklus-hidup-pembaruan-service-worker-swjs)
- [BAB 7: TARGET KUALITAS, PERFORMA & PENGUJIAN SISTEM](#bab-7-target-kualitas-performa--pengujian-sistem)
  - [7.1 Ambang Batas Metrik Kinerja (Lighthouse Score >= 95)](#71-ambang-batas-metrik-kinerja-lighthouse-score--95)
  - [7.2 Uji Beban & Skalabilitas Tipografi (Responsivitas 320px s.d. 2560px)](#72-uji-beban--skalabilitas-tipografi-responsivitas-320px-sd-2560px)
  - [7.3 Verifikasi Integritas Data Mushaf & Konsistensi 'Ain](#73-verifikasi-integritas-data-mushaf--konsistensi-ain)
  - [7.4 Kompatibilitas Harakat Lintas Sistem Operasi](#74-kompatibilitas-harakat-lintas-sistem-operasi)
  - [7.5 Verifikasi Ketahanan Mode Offline 100%](#75-verifikasi-ketahanan-mode-offline-100)
- [BAB 8: KONFIGURASI DEPLOYMENT & KONTAINERISASI DOCKER (PORT 3382)](#bab-8-konfigurasi-deployment--kontainerisasi-docker-port-3382)
  - [8.1 Dockerfile Multi-Stage Teroptimasi (Node.js Builder + Nginx Runner)](#81-dockerfile-multi-stage-teroptimasi-nodejs-builder--nginx-runner)
  - [8.2 Konfigurasi Reverse Proxy Nginx & Optimasi Kompresi Aset](#82-konfigurasi-reverse-proxy-nginx--optimasi-kompresi-aset)
  - [8.3 Orkestrasi Docker Compose (Web, API, dan PostgreSQL 16)](#83-orkestrasi-docker-compose-web-api-dan-postgresql-16)
- [BAB 9: STATUS REALISASI TEKNIS & MATRIKS KETERLACAKAN DOKUMEN](#bab-9-status-realisasi-teknis--matriks-keterlacakan-dokumen)
  - [9.1 Rekapitulasi Eksekusi Teknis Step 1 s.d. Step 8 (Fase 1)](#91-rekapitulasi-eksekusi-teknis-step-1-sd-step-8-fase-1)
  - [9.2 Rekapitulasi Eksekusi Teknis Step 9 s.d. Step 16 (Fase 2)](#92-rekapitulasi-eksekusi-teknis-step-9-sd-step-16-fase-2)
  - [9.3 Matriks Referensi & Tautan Berkas Proyek](#93-matriks-referensi--tautan-berkas-proyek)

---

## BAB 1: ARSITEKTUR SISTEM & DESAIN TINGKAT TINGGI

### 1.1 Paradigma Desain Sistem
Aplikasi QuranWeb dirancang menggunakan pendekatan **Static-First Client-Side Web Application (SPA / Static Export)** yang diperkaya kemampuan **Progressive Web App (PWA)** dan didukung oleh layanan backend terisolasi.

Prinsip teknis utama yang diterapkan adalah:
1. **Zero-Latency In-Memory Data Access:** Seluruh dataset teks Al-Qur'an (114 Surat, 6.236 Ayat, 30 Juz, 556 'Ain) dan khazanah sejarah di-host secara mandiri sebagai berkas JSON statis di direktori `public/data/` dan dimuat ke dalam memori klien (*in-memory cache*). Hal ini mengeliminasi kebutuhan query database berulang untuk pembacaan teks Al-Qur'an.
2. **Client-Side Heavy Compute:** Seluruh logika perhitungan rumit (jadwal waktu shalat dengan `Adhan.js`, algoritma trigonometri bola *Great Circle* untuk arah kiblat, serta filter rute ramah lansia) dieksekusi langsung pada CPU perangkat pengguna tanpa membebani server backend.
3. **Decoupled Telemetry & Staging Tier:** Layanan server Node.js dan PostgreSQL hanya bertugas menangani pencatatan telemetri anonim (`visitor_logs`, `activity_logs`), staging konfigurasi sementara per IP (`temp_ip_settings`), otentikasi akun pengguna (`users`), dan konfigurasi situs dinamis (`app_configurations`).

### 1.2 Diagram Arsitektur Komponen Perangkat Lunak

```text
+-----------------------------------------------------------------------------------+
|                        PERANGKAT PENGGUNA (PERAMBAN KLIEN)                        |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Antarmuka Pengguna React 18+ (TypeScript & Tailwind CSS v4)                 |  |
|  | - Reader Area: AyahCard, AinDivider, JuzDivider, TajweedRenderer            |  |
|  | - Modul Pelengkap: QiblaCompass, PrayerWidget, MosqueMap, ProphetsCatalog  |  |
|  | - Modul Edukasi: AsbabunNuzulModal, GharibulQuranModal, AudioCapsuleModal   |  |
|  | - Portal Pengguna: UserPortal & AdminPortal (Chart.js Line Visualizer)      |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|  +-------------------------------------v---------------------------------------+  |
|  | Lapisan State & Penyimpanan Sisi Klien                                      |  |
|  | - localStorage (Pengaturan Tema, Font, Last Read, Bookmarks, Sesi Login)    |  |
|  | - Service Worker Cache Storage (App Shell, Font WOFF2, JSON Dataset Offline)|  |
|  | - Audio Engine (HTML5 Audio + Event Listeners + Ayah-Sync Auto-Scroll)      |  |
|  +-----------------------------------------------------------------------------+  |
+----------------------------------------|------------------------------------------+
                                         | HTTP / JSON API Calls
                                         | (/api/telemetry, /api/auth, /api/admin)
+----------------------------------------v------------------------------------------+
|                       SERVER CONTAINER ENVIRONMENT (DOCKER)                       |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Nginx Reverse Proxy (Alpine Linux, Port Publik 3382)                        |  |
|  | - Static File Delivery (Gzip, Long-term Cache-Control)                      |  |
|  | - SPA Fallback Routing (try_files $uri $uri/ /index.html)                   |  |
|  | - Reverse Proxy Endpoint /api/ -> Node.js Backend Container                 |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        | Port Internal 4000                       |
|  +-------------------------------------v---------------------------------------+  |
|  | Backend Service (Node.js 20 Express Engine)                                 |  |
|  | - Rate Limiter, IP Resolver, Payload Validator, JWT Session Guard           |  |
|  | - Modul Email Campaign Manager & SMTP Gateway Tester                        |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        | Pool Koneksi 'pg' (Port 5432)            |
|  +-------------------------------------v---------------------------------------+  |
|  | Database Relasional PostgreSQL 16 Alpine (Port Host 5572 / Container 5432)  |  |
|  | - visitor_logs, activity_logs, temp_ip_settings, users, app_configurations  |  |
|  | - user_saved_searches, user_bookmarks, blog_articles, nearby_mosques_cache  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### 1.3 Aliran Data Antar-Komponen
1. **Pemuatan Awal (*Initial Load*):**
   Peramban memuat `index.html`, berkas bundle JavaScript/CSS, dan font Arab mandiri (`amiri-quran.woff2`). Berkas metadata indeks `public/data/meta.json` (~60 KB) dimuat ke memori untuk menyediakan pencarian dan navigasi instan 114 surat, 30 juz, dan 556 'Ain.
2. **Pemuatan Surat Sesuai Permintaan (*Lazy-Loading Surah*):**
   Saat pengguna memilih Surat, Juz, atau 'Ain, modul `quranData.ts` memeriksa apakah data `surahs/{id}.json` sudah tersimpan di memori. Jika belum, data di-fetch secara lokal dan disimpan di memori klien serta di-cache oleh *Service Worker*.
3. **Telemetri & Sinkronisasi Latar Belakang:**
   Setiap aksi interaksi (seperti pengubahan ukuran font atau bookmark) memperbarui `localStorage` seketika (0 ms latensi), lalu secara asynchronous mengirimkan payload JSON ke endpoint `/api/telemetry/activity` untuk dicatat ke PostgreSQL.

---

## BAB 2: STACK TEKNOLOGI & DEPENDENSI PERANGKAT LUNAK

### 2.1 Matriks Teknologi Frontend, Backend, dan Basis Data

| Lapisan Sistem | Teknologi / Library | Versi | Alasan Pemilihan & Justifikasi Teknis |
| :--- | :--- | :---: | :--- |
| **Framework UI** | **React + TypeScript** | `^18.3.1` | Penanganan komponen modular, rendering DOM teroptimasi, dan *type-safety* ketat. |
| **Build Tool** | **Vite** | `^6.0.0` | Kompilasi ultra-cepat berbasis Rollup, Hot Module Replacement (HMR) instan, dan *tree-shaking*. |
| **Styling & Layout** | **Tailwind CSS v4** | `^4.0.0` | Pendekatan utility-first tanpa runtime overhead, CSS custom variables untuk tema dinamis. |
| **Kalkulasi Shalat** | **Adhan.js (`adhan`)** | `^4.4.3` | Algoritma hisab astronomis murni di sisi klien, bebas request jaringan, mendukung parameter Kemenag RI. |
| **Pemetaan Interaktif** | **Leaflet (`leaflet`)** | `^1.9.4` | Peta OpenStreetMap mandiri, sangat ringan (~42 KB), bebas lisensi komersial dan skrip pelacak. |
| **Visualisasi Grafik** | **Chart.js (`chart.js`)** | `^4.6.1` | Visualisasi audit trail berbasis HTML5 Canvas dengan kurva bezier halus (*cubic tension 0.35*). |
| **Efek Visual Interaktif** | **canvas-confetti** | `^1.9.4` | Efek selebrasi visual ringan saat pengguna menuntaskan target khatam 556 'Ain. |
| **Ikonografi Web** | **Lucide React** | `^0.460.0` | Ikon SVG modern, tree-shakable, ringan, dan memiliki konsistensi visual tinggi. |
| **Server Backend** | **Node.js (Express)** | `20.x` | Menangani endpoint REST API telemetri, activity logs, staging per IP, dan gateway email SMTP. |
| **Klien Database** | **`pg` (node-postgres)** | `^8.23.1` | Pustaka pool koneksi PostgreSQL native berkecepatan tinggi dengan parameter binding aman. |
| **Database Server** | **PostgreSQL** | `16 Alpine` | Basis data relasional tangguh dengan dukungan tipe data `JSONB`, pengindeksan koordinat, dan transaksi ACID. |
| **Server Web / Proxy** | **Nginx** | `Alpine` | Pengiriman aset statis super cepat dengan kompresi Gzip/Brotli dan reverse proxy endpoint API. |
| **Kontainerisasi** | **Docker & Compose** | `Engine v24+` | Menjamin standardisasi lingkungan deployment multi-service yang stabil pada port `3382`. |

### 2.2 Pustaka Klien Kritis
- **`adhan` (Adhan.js):**
  Mengimplementasikan metode hisab falakiyah standar. Menghitung sudut matahari (*zenith angles*) untuk menentukan waktu Subuh, Terbit, Dzuhur, Ashar, Maghrib, dan Isya dengan parameter presisi tinggi.
- **`leaflet`:**
  Memetakan koordinat masjid terdekat menggunakan tile OpenStreetMap tanpa membebani kuota API komersial pihak ketiga.
- **`chart.js`:**
  Merender grafik garis dual-series (*CRUD Operations* vs *View Operations*) dengan skalabilitas canvas resolusi tinggi.

### 2.3 Font Arab Mandiri (Self-Hosted WOFF2)
Untuk menjamin konsistensi rendering teks Arab tanpa dependensi jaringan eksternal, seluruh font disimpan mandiri pada `public/fonts/`:
1. **`amiri-quran.woff2`:** Font utama bergaya khat Mushaf Standar Utsmani dengan tipografi harakat bertingkat yang rapi.
2. **`amiri.woff2`:** Font naskhi klasik untuk teks pendukung dan terjemahan nama surat.
3. **`scheherazade.woff2`:** Font alternatif dengan pembawaan khat tradisional yang sangat jelas bagi lansia.

### 2.4 Server Backend & Pool PostgreSQL
Server API Node.js mengelola koneksi pool PostgreSQL dengan konfigurasi teroptimasi:
- `max: 20` (maksimum koneksi simultan).
- `idleTimeoutMillis: 30000` (penutupan otomatis koneksi idle).
- `connectionTimeoutMillis: 2000` (ambang batas deteksi kegagalan koneksi).

---

## BAB 3: MODEL DATA & SKEMA SPESIFIKASI TEKNIS

### 3.1 Skema Antarmuka TypeScript Inti (Core Mushaf & Meta)

```ts
// src/types/quran.ts
export interface SurahMeta {
  id: number;                // 1 s.d. 114
  nameArabic: string;        // الفاتحة
  nameLatin: string;         // Al-Fatihah
  translationId: string;     // Pembukaan
  revelationPlace: 'Makkiyah' | 'Madaniyah';
  totalAyahs: number;
}

export interface JuzMeta {
  juzNumber: number;         // 1 s.d. 30
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export interface AinMeta {
  ainNumber: number;         // 1 s.d. 556
  surahId: number;
  surahAinIndex: number;     // Urutan 'Ain di dalam surat tersebut
  juzNumber: number;
  startAyah: number;
  endAyah: number;
}

export interface Ayah {
  id: number;                // Global Ayah ID (1 s.d. 6236)
  surahId: number;
  ayahNumber: number;
  juzNumber: number;
  ainNumber: number;
  isAinEnd: boolean;         // Bernilai true jika ayat ini merupakan akhir dari sebuah 'Ain (tampil tanda ع)
  textUthmani: string;       // Teks Arab standar Rasm Utsmani
  textTajweed?: string;      // Teks Arab bertag elemen tajwid (opsional)
  translationId: string;     // Terjemahan resmi Kemenag RI
}
```

### 3.2 Skema Modul Khazanah & Sejarah

```ts
// src/types/prophet.ts (Kisah 25 Nabi & Rasul)
export interface ProphetTimelineItem {
  phase: string;
  title: string;
  description: string;
  readingMinutes: number;
}

export interface ProphetDetail extends ProphetMeta {
  timeline: ProphetTimelineItem[];
  wisdoms: { title: string; lesson: string }[];
  duas: { id: string; title: string; arabic: string; translation: string; surahId: number; ayahNumber: number }[];
  quranReferences: { surahId: number; surahName: string; ayahStart: number; ayahEnd: number; topic: string }[];
}

// src/types/literacy.ts (Asbabun Nuzul, Gharibul Qur'an & Audio Capsule)
export interface AsbabunNuzulItem {
  id: string;
  surahId: number;
  ayahNumber: number;
  narrator: string;
  sourceBook: string;        // 'Lubabun Nuqul' | 'Asbabun Nuzul Al-Wahidi'
  historicalContext: string;
  wisdomTadabbur: string;
}

export interface GharibulQuranWord {
  id: string;
  surahId: number;
  ayahNumber: number;
  wordArabic: string;
  transliteration: string;
  rootArabic: string;        // Akar kata (jadzr)
  literalMeaning: string;
  balaghahExplanation: string;
}

export interface AudioCapsuleItem {
  id: string;
  title: string;
  narrator: string;
  durationMinutes: number;
  audioUrl: string;
  transcript: string;
  category: 'prophet' | 'tadabbur' | 'ayah';
}

// src/types/mosque.ts (Peta POI Masjid Terdekat)
export interface MosquePOI {
  id: string;
  name: string;
  arabicName?: string;
  category: 'masjid_raya' | 'masjid_agung' | 'masjid_jami' | 'mushalla';
  lat: number;
  lng: number;
  address: string;
  city: string;
  facilities: string[];      // ['wudhu_ground', 'prayer_chairs', 'ramp', 'ac', 'parking', 'sitting_toilet']
  elderFriendlyRating: number;
}
```

### 3.3 Skema State Sisi Klien & Preferensi Pengguna (localStorage)

```ts
export type ThemeMode = 'light' | 'dark' | 'high-contrast' | 'sepia';
export type ArabicFontFamily = 'amiri-quran' | 'amiri' | 'scheherazade' | 'lpmq';

export interface ReaderSettings {
  theme: ThemeMode;
  elderMode: boolean;              // Saklar 1-klik mode lansia
  arabicFontSize: number;          // Rentang: 20 s.d. 52 (px)
  translationFontSize: number;     // Rentang: 14 s.d. 26 (px)
  lineHeight: number;              // Rentang: 2.0 s.d. 2.8
  arabicFont: ArabicFontFamily;
  showTranslation: boolean;
  tajweedEnabled: boolean;         // Otomatis di-override false saat mode high-contrast / elderMode
  spotlightEnabled: boolean;       // Menyorot ayat aktif & meredupkan ayat sekitarnya
  autoScrollSpeed: number;         // 0 (mati), 1 (lambat), 2 (sedang)
}

export interface LastReadState {
  mode: 'surah' | 'juz' | 'ain';
  surahId: number;
  ayahNumber: number;
  juzNumber: number;
  ainNumber: number;
  updatedAt: string;               // ISO 8601 Timestamp
}

export interface BookmarkItem {
  id: string;                      // Format pengenal: "{surahId}:{ayahNumber}"
  surahId: number;
  ayahNumber: number;
  ainNumber: number;
  note?: string;
  createdAt: string;
}
```

### 3.4 Skema Relasional PostgreSQL Lengkap (DDL 9 Tabel Utama)

```sql
-- 1. Tabel Pencatatan Akses IP Pengunjung
CREATE TABLE IF NOT EXISTS visitor_logs (
  id BIGSERIAL PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_visitor_ip ON visitor_logs(ip_address);

-- 2. Tabel Pencatatan Log Aktivitas Pengguna
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_activity_ip ON activity_logs(ip_address);

-- 3. Tabel Staging Pengaturan Sementara per IP Address
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

-- 4. Tabel Manajemen Akun Pengguna & Admin (RBAC)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user', -- 'admin' | 'asatidz' | 'editor' | 'user'
  full_name VARCHAR(150),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Konfigurasi Dinamis Identitas Situs
CREATE TABLE IF NOT EXISTS app_configurations (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Arsip Pencarian Tersimpan Jamaah
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

-- 8. Tabel Manajemen Artikel Jurnal & Blog CMS
CREATE TABLE IF NOT EXISTS blog_articles (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  pillar VARCHAR(50) NOT NULL,
  author VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'published', -- 'published' | 'draft' | 'archived'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabel Cache Data POI Masjid Terdekat
CREATE TABLE IF NOT EXISTS nearby_mosques_cache (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  facilities JSONB DEFAULT '[]'::jsonb,
  elder_rating INT DEFAULT 5,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_mosques_coords ON nearby_mosques_cache(lat, lng);
```

---

## BAB 4: STRUKTUR DIREKTORI PROYEK & TATA KELOLA KODE

### 4.1 Hierarki Direktori Aplikasi Aktual

```text
src/
├── assets/               # Aset grafis statis, logo kaligrafi, ornamen SVG
├── components/
│   ├── admin/            # AdminPortal.tsx (Dashboard, Chart.js, Audit Trail, Config, Blog CMS, Email)
│   ├── user/             # UserPortal.tsx (Dashboard Anggota, Card Bookmark, Search Archive, Tilawah)
│   ├── auth/             # JoinPromptModal.tsx (Popup CTA), LogoutConfirmModal.tsx
│   ├── layout/           # Header.tsx, Sidebar.tsx (Desktop), BottomNav.tsx (Mobile), ZenModeWrapper.tsx
│   ├── navigation/       # NavigationPanel.tsx, SurahList.tsx, JuzList.tsx, AinList.tsx, QuickSearch.tsx
│   ├── reader/           # AyahCard.tsx, AinDivider.tsx, JuzDivider.tsx, TajweedRenderer.tsx
│   ├── audio/            # AudioMiniPlayer.tsx, QariSelector.tsx, AudioCapsuleModal.tsx
│   ├── prayer/           # PrayerTimeWidget.tsx, CitySelectorModal.tsx
│   ├── prophets/         # ProphetsCatalog.tsx, ProphetDetailModal.tsx, ProphetLanternBanner.tsx
│   ├── blog/             # BlogCatalog.tsx, BlogDetailModal.tsx, EmbeddedAyahWidget.tsx
│   ├── prayers/          # PrayersCatalog.tsx, HapticTasbihModal.tsx
│   ├── khatam/           # KhatamPlannerModal.tsx, SakinahRing.tsx
│   ├── qibla/            # QiblaCompass.tsx (Dynamic Sensor + Azimuth/QR Code)
│   ├── mosque/           # MosqueMap.tsx (Leaflet.js + OSM + 4 Tema Adaptif)
│   ├── literacy/         # AsbabunNuzulModal.tsx, GharibulQuranModal.tsx
│   └── settings/         # SettingsModal.tsx, AccessibilityControls.tsx, TajweedMakhrajModal.tsx
├── hooks/
│   ├── useFullscreen.ts  # Pembungkus HTML5 Fullscreen API + pendeteksi tombol Esc
│   ├── useLocalStorage.ts# Sinkronisasi state React dengan localStorage peramban
│   ├── useAutoScroll.ts  # Animasi pengguliran layar halus via requestAnimationFrame
│   ├── usePrayerTimes.ts # Kalkulasi Adhan.js real-time + countdown timer 1 detik
│   └── useAudioPlayer.ts # Kontrol HTML5 Audio + 5 Qari + Repeat + Speed + Scrubber
├── services/
│   ├── quranData.ts      # Pengambil & cache in-memory meta.json & surahs/*.json
│   ├── auth.ts           # Logika sesi RBAC (admin, asatidz, editor, user, guest)
│   ├── admin.ts          # Layanan statistik, query log audit, konfigurasi situs & email
│   ├── telemetry.ts      # Pengirim log telemetri klien (visitor IP, activity logs)
│   ├── prophets.ts       # Pengambil data katalog 25 nabi & linimasa sejarah
│   ├── blog.ts           # Manajemen artikel jurnal literasi & mutasi CMS
│   ├── prayers.ts        # Penyedia data 40 Doa Rabbana & wirid dzikir
│   ├── qibla.ts          # Algoritma trigonometri speris Great Circle arah Ka'bah
│   ├── mosques.ts        # Data provider POI masjid & filter fasilitas ramah lansia
│   └── literacy.ts       # Penyedia data Asbabun Nuzul, Gharib & Audiobook 3 Menit
├── styles/
│   ├── themes.css        # CSS Custom Properties untuk tema Light, Dark, High-Contrast, Sepia
│   └── arabic.css        # Aturan tipografi RTL, unicode-bidi, dan font-face WOFF2
└── types/                # Definisi antarmuka TypeScript untuk seluruh entitas sistem
server/
├── index.js              # Server Node.js Express API (PostgreSQL pool, migrations, endpoints)
public/
├── data/                 # Berkas JSON statis (meta.json, 114 surah, nabi, blog, doa, masjid, khazanah)
├── fonts/                # Berkas font WOFF2 self-hosted
├── manifest.webmanifest  # Metadata PWA Manifest V3
└── sw.js                 # Service Worker PWA Cache v7 (Offline First)
```

### 4.2 Pemetaan Tanggung Jawab Modul Komponen
- **`components/reader/`:** Bertanggung jawab merender lembar tilawah, medali nomor ayat, penanda akhir 'Ain (`ع`), spanduk pembatas juz, dan badge ulumul Qur'an.
- **`services/quranData.ts`:** Menjamin dataset Al-Qur'an hanya diunduh satu kali dan disimpan pada memori aplikasi untuk mencegah jeda render.
- **`hooks/useAudioPlayer.ts`:** Mengisolasi instance pemutar audio HTML5 dan mengoordinasikan efek penyorotan ayat aktif (*Ayah-Sync*) secara otomatis.

---

## BAB 5: SPESIFIKASI TEKNIS IMPLEMENTASI MODUL

### 5.1 Modul Tata Letak Adaptif, Layar Penuh Desktop & Mobile Safe-Area
- **Desktop Breakpoint (`>= 1024px`):**
  Menggunakan CSS Grid 2 kolom (`grid-template-columns: 340px 1fr`). Saat tombol *Layar Penuh* diklik, hook `useFullscreen` memanggil `document.documentElement.requestFullscreen()`. Komponen `ZenModeWrapper` menerapkan kelas utilitas CSS yang menyembunyikan header, panel samping, dan widget shalat, memusatkan lembar tilawah ke lebar optimal (`max-width: 900px`).
- **Mobile Breakpoint (`< 1024px`):**
  Menggunakan tata letak 1 kolom dengan tinggi viewport dinamis `100dvh` dan memperhatikan area batas sistem `env(safe-area-inset-bottom)` untuk menghindari tumpang tindih dengan bilah navigasi iOS/Android.

### 5.2 Modul Rendering Teks Arab RTL, Tajwid Berwarna & Optimasi DOM
- **Aturan CSS Teks Arab:**
  ```css
  .arabic-text {
    direction: rtl;
    unicode-bidi: isolate;
    text-align: right;
    word-spacing: 0.12em;
    font-feature-settings: "cv01" on, "cv02" on;
  }
  ```
- **Optimasi DOM Surat Panjang:**
  Surat berukuran raksasa (misal QS. Al-Baqarah: 286 ayat) dirender secara modular per kelompok **'Ain (Ruku')** untuk menjaga konsumsi RAM dan kecepatan rendering peramban perangkat bergerak.
- **Parser Tajwid Aman:**
  Tag tajwid (misal: `<tajweed class="ghunnah">مّ</tajweed>`) diurai menjadi pohon elemen virtual React `<span>` tanpa menggunakan fungsi rentan `dangerouslySetInnerHTML`. Pada mode *High-Contrast*, kelas tajwid otomatis dinonaktifkan (`color: inherit`).

### 5.3 Modul Sistem Tema Dinamis, Ayat Spotlight & Aksesibilitas Lansia
- Tema dikendalikan melalui atribut data `data-theme` pada elemen root HTML:
  - `light`: Latar `#FFFFFF`, teks `#111827`.
  - `dark`: Latar `#121212`, teks `#E5E7EB`.
  - `high-contrast`: Latar `#000000`, teks `#FFFFFF` / `#FACC15`, rasio kontras ≥ 15:1.
  - `sepia`: Latar `#FBF0D9`, teks `#3D2E1E`.
- **Ayat Spotlight:** Saat diaktifkan, kartu ayat yang sedang aktif memiliki kelas `ring-2 ring-emerald-500`, sedangkan ayat lainnya diberi `opacity: 0.35` dengan transisi halus 200 ms.

### 5.4 Modul Kalkulasi Waktu Aktual & Jadwal Shalat Offline (Adhan.js)
- Perhitungan jadwal shalat mengadopsi standar hisab **Kementerian Agama Republik Indonesia**:
  - Sudut Waktu Subuh (*Fajr Angle*): `20.0°`.
  - Sudut Waktu Isya (*Isha Angle*): `18.0°`.
  - Mazhab Penentuan Ashar: `Madhab.Shafi`.
- Waktu shalat dihitung luring berdasarkan koordinat lintang/bujur pengguna dan disinkronkan dengan interval waktu per detik.

### 5.5 Modul Audio Recitation, Ayah-Sync, Multi-Qari & Offline Audio Caching
- Menggunakan objek tunggal `Audio` di latar belakang dengan dukungan 5 qari mu'tabar.
- Pola URL streaming: `https://everyayah.com/data/{Qari_Identifier}/{Surah_3digit}{Ayah_3digit}.mp3`.
- Ketika audio ayat selesai berbunyi (`onended`), pemutar otomatis memicu event pemutaran ayat berikutnya dan memanggil `element.scrollIntoView({ behavior: 'smooth', block: 'center' })`.

### 5.6 Modul Algoritma Arah Kiblat Great Circle Ka'bah (Dinamis & Azimuth)
- Koordinat absolut Ka'bah: Lintang $\phi_k = 21.4225^\circ\text{ N}$, Bujur $\lambda_k = 39.8262^\circ\text{ E}$.
- Rumus Azimuth Kiblat $Q$ dari koordinat pengguna $(\phi, \lambda)$:
  $$\tan(Q) = \frac{\sin(\lambda_k - \lambda)}{\cos(\phi)\tan(\phi_k) - \sin(\phi)\cos(\lambda_k - \lambda)}$$
- Pada perangkat bergerak, sensor `DeviceOrientationEvent` memutar jarum kompas secara langsung dan memicu getaran haptic `navigator.vibrate(50)` ketika arah ponsel lurus dengan Ka'bah (toleransi $\pm 1.5^\circ$).

### 5.7 Modul Peta Interaktif Masjid Leaflet.js & Algoritma Rute Lansia
- Menghitung jarak lurus menggunakan formula Haversine.
- **Estimasi Waktu Jalan Kaki Lansia:**
  $$\text{Waktu (menit)} = \frac{\text{Jarak (meter)}}{50\text{ meter/menit}}$$
  Mengasumsikan kecepatan langkah santai lansia $\pm 3\text{ km/jam}$.
- Menyediakan filter fasilitas: wudhu tanpa tangga, kursi shalat, tanjakan kursi roda, pendingin udara, parkir luas, dan toilet duduk.

### 5.8 Modul Khazanah Ulumul Qur'an (Asbabun Nuzul, Gharib & Audiobook 3 Menit)
- Menyajikan 29 riwayat shahih Asbabun Nuzul dari kitab *Lubabun Nuqul* (As-Suyuthi) dan *Asbabun Nuzul* (Al-Wahidi).
- Menyajikan glosarium 28 kosakata sukar (*Gharibul Qur'an*) lengkap dengan akar kata bahasa Arab dan rahasia balaghah.
- Audiobook 3 menit didukung arsitektur *dual-engine*: Web Speech API suara Bahasa Indonesia lokal (100% luring) dan audio CDN streaming.

### 5.9 Modul Rencana Khatam Sakinah 556 'Ain & Progress Ring
- Menguraikan Al-Qur'an ke dalam 556 kelompok 'Ain tematik.
- Menerapkan 4 pilihan ritme: Ritme Sakinah (5 'Ain/hari ~ 111 hari), Ritme Istiqamah (10 'Ain/hari ~ 56 hari), Ritme 30 Hari (19 'Ain/hari), dan Ritme Mandiri.
- Visualisasi progres menggunakan komponen cincin persentase SVG melingkar yang menyejukkan mata.

### 5.10 Modul Portal Administrator, Chart.js Dual-Series Audit Trail & CMS Blog
- Akses rute `/admin` diverifikasi menggunakan otentikasi peran.
- Visualisasi audit trail menggunakan pustaka Chart.js dengan kurva ganda: warna Amber untuk operasi perubahan data (*CRUD*) dan warna Emerald untuk operasi pembacaan data (*View*).
- Dilengkapi modul CMS pengelolaan siklus hidup artikel blog (Diterbitkan, Draf, Diarsipkan, Dihapus).

### 5.11 Modul Portal Pengguna, Card Bookmark & Sinkronisasi Cloud
- Rute `/user` menyediakan manajemen kartu bookmark personal, pencatatan refleksi tadabbur, dan pengarsipan kata kunci pencarian.
- Sinkronisasi otomatis data bacaan ke tabel PostgreSQL `user_bookmarks` dan `user_saved_searches`.

### 5.12 Modul Gateway Email Buletin, Pengingat Tilawah & Pengaturan SMTP
- Komponen `EmailCampaignManager.tsx` mengelola penyusunan dan pengiriman warta email jamaah.
- Panel pengaturan server SMTP mendukung Host, Port, Enkripsi (STARTTLS/SSL), dan pengujian koneksi (*SMTP Ping*).

---

## BAB 6: STRATEGI CACHING, KETAHANAN OFFLINE & SERVICE WORKER (PWA)

### 6.1 Fase Pre-Caching Inti (App Shell, Font, Dataset Metadata)
Saat instalasi Service Worker (`sw.js`), aset-aset berikut di-cache ke dalam `quranweb-core-v7`:
- `index.html` dan bundel JavaScript/CSS hasil kompresi Vite.
- Seluruh font mandiri: `amiri-quran.woff2`, `amiri.woff2`, `scheherazade.woff2`.
- Berkas indeks Al-Qur'an: `public/data/meta.json` dan `translation_index.json`.
- Berkas metadata nabi, blog, doa, dan khazanah ulumul Qur'an.

### 6.2 Strategi Runtime Cache (CacheFirst & On-Demand)
- **Teks Surat Al-Qur'an (`public/data/surahs/*.json`):**
  Menerapkan strategi **CacheFirst**. Sekali sebuah surat dibuka oleh pengguna, berkas JSON surat tersebut otomatis tersimpan permanen di cache peramban untuk akses luring seterusnya.
- **Audio Recitation Murottal:**
  Hanya berkas audio yang secara eksplisit diunduh pengguna yang disimpan ke cache peramban guna mencegah kepenuhan memori internal perangkat pengguna.

### 6.3 Siklus Hidup Pembaruan Service Worker (sw.js)
- Berkas `sw.js` dikonfigurasi dengan header HTTP `Cache-Control: no-cache, no-store, must-revalidate` pada Nginx untuk memastikan peramban selalu memeriksa versi terbaru.
- Event `skipWaiting()` dipicu secara halus saat rilis versi baru terdeteksi.

---

## BAB 7: TARGET KUALITAS, PERFORMA & PENGUJIAN SISTEM

### 7.1 Ambang Batas Metrik Kinerja (Lighthouse Score >= 95)
- **Kinerja (*Performance*):** $\ge 95$ (Waktu muat awal LCP < 1,5 detik, TBT < 100 ms).
- **Aksesibilitas (*Accessibility*):** $\ge 98$ (Kepatuhan WCAG 2.1 AA/AAA, kontras warna tinggi).
- **Praktik Terbaik (*Best Practices*):** $100$ (Bebas kerentanan keamanan dan skrip berbahaya).
- **PWA Status:** Memenuhi seluruh syarat instalabilitas PWA peramban.

### 7.2 Uji Beban & Skalabilitas Tipografi (Responsivitas 320px s.d. 2560px)
- Terverifikasi bebas dari *horizontal scroll overflow* pada seluruh variasi resolusi layar, dari ponsel kompak (320px) hingga layar monitor 4K (2560px), termasuk saat pengaturan ukuran font Arab maksimal (`52px`) diaktifkan.

### 7.3 Verifikasi Integritas Data Mushaf & Konsistensi 'Ain
- Verifikasi otomatis memastikan integritas 114 Surat, 6.236 Ayat, 30 Juz, dan 556 batas 'Ain tematik tanpa ada ayat yang tertinggal atau terduplikasi.

### 7.4 Kompatibilitas Harakat Lintas Sistem Operasi
- Uji visual memastikan susunan harakat bertingkat (fathah, kasrah, dhammah, sukun, tasydid, tanwin, tanda mad) tampil sempurna pada Chrome Android, Safari iOS, macOS Safari/Chrome, dan Windows Edge/Chrome.

### 7.5 Verifikasi Ketahanan Mode Offline 100%
- Pengujian simulasi pemutusan jaringan (DevTools Network: Offline) membuktikan seluruh fitur membaca, navigasi 3D, jadwal shalat, kompas kiblat, dan tasbih haptic tetap berfungsi 100% luring.

---

## BAB 8: KONFIGURASI DEPLOYMENT & KONTAINERISASI DOCKER (PORT 3382)

### 8.1 Dockerfile Multi-Stage Teroptimasi (Node.js Builder + Nginx Runner)

```dockerfile
# Stage 1: Build Environment
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Web Server
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3382
CMD ["nginx", "-g", "daemon off;"]
```

### 8.2 Konfigurasi Reverse Proxy Nginx & Optimasi Kompresi Aset

```nginx
server {
    listen 3382;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Kompresi Gzip untuk Kecepatan Muat
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml font/woff2;
    gzip_min_length 256;

    # Cache Panjang untuk Aset Statis
    location ~* \.(woff2|png|jpg|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Penanganan Service Worker Bebas Cache
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Proxy ke Backend API Container
    location /api/ {
        proxy_pass http://api:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Dukungan SPA Client-Side Routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 8.3 Orkestrasi Docker Compose (Web, API, dan PostgreSQL 16)

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
- Perintah eksekusi kontainer: `docker compose up -d --build`.
- URL akses aplikasi: `http://localhost:3382`.

---

## BAB 9: STATUS REALISASI TEKNIS & MATRIKS KETERLACAKAN DOKUMEN

### 9.1 Rekapitulasi Eksekusi Teknis Step 1 s.d. Step 8 (Fase 1)
- **Step 1:** Fondasi proyek React TypeScript, dataset mandiri 114 surat, 30 juz, 556 'Ain, font WOFF2.
- **Step 2:** Komponen inti pembaca Al-Qur'an, tata arah RTL, pemisah 'Ain (`ع`), dan terjemahan Kemenag RI.
- **Step 3:** Tata letak adaptif desktop split-view, fullscreen zen mode (`F`), dan antarmuka mobile 1-kolom.
- **Step 4:** Riwayat bacaan terakhir (*Last Read*), penanda bookmark lokal, dan pencarian cepat.
- **Step 5:** 4 tema warna, mode lansia 1-klik, ayat spotlight, auto-scroll, dan integrasi awal telemetri server.
- **Step 6:** Widget waktu aktual dan kalkulasi jadwal shalat luring Kemenag RI via Adhan.js.
- **Step 7:** Tajwid berwarna 11 kaidah, panduan makhraj & waqaf, dan pemutar audio murottal 5 qari dunia.
- **Step 8:** Portal Administrator (`/admin`), Portal Pengguna (`/user`), audit trail, PWA offline, dan kontainerisasi Docker port `3382`.

### 9.2 Rekapitulasi Eksekusi Teknis Step 9 s.d. Step 16 (Fase 2)
- **Step 9:** Standarisasi 5 peran akun RBAC (`admin`, `asatidz`, `editor`, `user`, `guest`) dan modal logout santun.
- **Step 10:** Katalog Qashashul Anbiya' (Kisah 25 Nabi), rujukan ayat silang dua arah, dan lentera kisah mushaf.
- **Step 11:** Jurnal literasi tadabbur 5 pilar konten, shortcode widget ayat bersuara, dan CMS artikel draf.
- **Step 12:** Rencana khatam sakinah berbasis 556 'Ain, cincin progres melingkar, dan selebrasi konfeti santun.
- **Step 13:** Kompilasi 40 Doa Rabbana, dzikir harian, tasbih getar layar penuh (*Haptic Tasbih*), dan proteksi sesi.
- **Step 14:** Kompas arah kiblat adaptif (akselerometer ponsel pintar + desktop azimuth) dan grafik garis Chart.js audit trail.
- **Step 15:** Peta interaktif masjid terdekat berbasis Leaflet.js & OpenStreetMap lokal serta estimasi jalan santai lansia.
- **Step 16:** Badge riwayat Asbabun Nuzul (*Lubabun Nuqul* & *Al-Wahidi*), kamus mufradat *Gharibul Qur'an*, dan Audiobook tadabbur 3 menit dengan sleep timer.
- **Modul Ekstra:** Tab Email & Siaran di portal admin (`EmailCampaignManager.tsx`) untuk buletin mingguan, pengingat ibadah, serta konfigurasi server SMTP.

### 9.3 Matriks Referensi & Tautan Berkas Proyek
Seluruh bab dan sub-bab teknis pada dokumen TSD ini terhubung secara langsung dengan dokumentasi dan kode sumber proyek:
- **Dokumen Fungsional Terkait:** [FSD.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Document/FSD.md) & [FSD.docx](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Document/FSD.docx)
- **Dokumen Panduan Pengguna:** [USER_MANUAL.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Document/USER_MANUAL.md)
- **Cetak Biru Arsitektur Awal:** [MasterPlan.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/MasterPlan.md) & [MasterPlan-2.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/MasterPlan-2.md)
- **Rincian Eksekusi Kode Teknis:** [DEV_STEP.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/DEV_STEP.md) & [DEV_STEP_2.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/DEV_STEP_2.md)
- **Laporan Penjaminan & Audit Mutu:** [QualityAssurance.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/QualityAssurance.md)
- **Konfigurasi Lingkungan:** [Dockerfile](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Dockerfile) & [docker-compose.yml](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/docker-compose.yml)

---
*Dokumen TSD ini merupakan spesifikasi teknis resmi QuranWeb dan menjadi rujukan utama implementasi arsitektur perangkat lunak.*
