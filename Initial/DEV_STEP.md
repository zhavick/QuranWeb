# Urutan Pengembangan Aplikasi (Development Steps): Quran Web

Dokumen ini membagi proses pengembangan aplikasi **Quran Web** menjadi beberapa tahapan (*step*) yang terstruktur—dimulai dari modul yang paling fundamental di awal hingga modul pelengkap dan optimasi di bagian paling akhir.

---

## Prinsip Penentuan Urutan

1. **Data & Pembaca Inti Lebih Dulu:** Aplikasi harus bisa menampilkan ayat Al-Qur'an berdasarkan **Surat, Juz, dan 'Ain** dengan benar sebelum menambahkan fitur pendukung.
2. **Responsif & Fullscreen Sejak Awal:** Tata letak Desktop (*Fullscreen*) dan Mobile (*Proporsional*) dibangun bersamaan dengan navigasi utama agar tidak perlu merombak UI di tengah jalan.
3. **Fitur Pelengkap & Berat di Akhir:** Fitur seperti Jadwal Shalat, Tajwid Berwarna, Audio *Recitation*, dan PWA *Offline* dikerjakan setelah alur baca utama stabil.

---

## Ringkasan Urutan Modul (Step 1 s.d. Step 8)

| Urutan | Fokus Utama | Modul yang Dikerjakan | Prioritas | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Step 1** | Fondasi Proyek & Data | Setup Repo, Font Arab Self-Hosted, Kurasi Dataset (`meta.json` & `surahs/*.json`) | Wajib (Core) | **Selesai (Done)** |
| **Step 2** | Pembaca Al-Qur'an Inti | `Quran Reader Module` (RTL, Terjemahan Kemenag, Penanda Juz & `'Ain`) | Wajib (Core) | **Selesai (Done)** |
| **Step 3** | Navigasi & Tata Letak Adaptif | `Navigation Module` (Surat, Juz, `'Ain`) + `Desktop Fullscreen` & `Mobile Proporsional` | Wajib (Core) | **Selesai (Done)** |
| **Step 4** | Riwayat & Pencarian | `Last Read`, `Bookmark` (`localStorage`), Share Link, & `Quick Search` | Tinggi | **Selesai (Done)** |
| **Step 5** | Aksesibilitas & Backend DB | `Settings & Accessibility` + **PostgreSQL Staging & IP Logging** (Log IP, Log Aktivitas, Temp Table Setting per IP, Modal CTA Registrasi) | Tinggi | **Selesai (Done)** |
| **Step 6** | Pendukung Ibadah | `Waktu Aktual & Jadwal Shalat` (`Adhan.js`, Countdown, Pilih Kota/GPS) | Menengah | **Selesai (Done)** |
| **Step 7** | Edukasi & Audio | `Tajwid Berwarna` (Toggle + Legenda), `Panduan Makhraj`, & `Audio Recitation` (*Ayah-Sync*) | Lanjutan | **Selesai (Done)** |
| **Step 8** | Portal Admin & Pengguna, PWA & Rilis | `Portal Admin (/admin)` (Charts Geolokasi, Audit Trail Penuh, Konfigurasi Identitas/Branding), `Portal Pengguna (/user)` (Card Bookmark, Arsip Pencarian), `PWA Offline`, Docker (Port 3382) | Akhir (Release) | **Selesai (Done)** |

---

## Detail Tahapan Pengembangan

### Step 1 (Paling Awal): Setup Proyek & Kurasi Dataset
- Inisialisasi proyek (React + TypeScript + Tailwind CSS).
- Menyiapkan font Arab self-hosted (`.woff2`): **LPMQ Isep Misbah**, **Amiri**, dan **Scheherazade New**.
- Menyusun dan memvalidasi dataset statis mandiri:
  - `meta.json`: Indeks 114 Surat, 30 Juz, dan 556/558 `'Ain` (Ruku').
  - `surahs/{id}.json`: Teks Arab Utsmani, metadata `juz`/`ain`/`isAinEnd`, dan terjemahan Kemenag RI.
- **Kriteria Selesai:** Seluruh struktur data tervalidasi (6.236 ayat lengkap) dan dapat di-load oleh aplikasi tanpa error.

### Step 2: Modul Pembaca Al-Qur'an Inti (`Quran Reader Module`)
- Membuat service loader data (`quranData.ts`) dengan *lazy-loading* per surat.
- Membangun komponen `AyahCard` dengan aturan CSS `direction: rtl; unicode-bidi: isolate;` dan `line-height` lega.
- Menampilkan **terjemahan per ayat** di bawah teks Arab dengan toggle ke *Mode Fokus / Mushaf*.
- Menampilkan penanda batas **Juz** dan simbol batas **`'Ain` (ع)** serta *pagination* per `'Ain` untuk surat panjang.
- **Kriteria Selesai:** Ayat tampil rapi, harakat tidak bertumpuk, dan penanda Surat/Juz/`'Ain` terlihat jelas.

### Step 3: Modul Navigasi & Tata Letak Adaptif (`Desktop Fullscreen` vs `Mobile`)
- Membangun `Navigation Module` dengan 3 tab utama: **Surat**, **Juz**, dan **'Ain**.
- **Desktop Layout:** *Split-view* (sidebar kiri + area baca kanan) dan tombol **Mode Layar Penuh (*Fullscreen / Zen Mode*)** menggunakan Browser Fullscreen API.
- **Mobile Layout:** Tata letak 1 kolom proporsional (`100dvh`, *safe-area*, *fluid typography* tanpa *horizontal scroll*) dengan *Bottom Navigation / Drawer*.
- **Kriteria Selesai:** Navigasi lancar di ketiga mode (Surat, Juz, `'Ain`), mode layar penuh desktop berfungsi baik, dan tampilan mobile proporsional.

### Step 4: Modul Penanda, Riwayat & Pencarian (`Bookmark`, `Last Read`, `Search`)
- Mengimplementasikan penyimpanan otomatis **Last Read** dan **Bookmark** ke `localStorage`.
- Menambahkan fitur *Shareable URL* (`?surah=2&ayah=255`) dan *Export/Import Bookmark* (JSON).
- Membangun **Pencarian Cepat** berdasarkan nama/nomor surat, nomor Juz, nomor `'Ain`, dan kata kunci terjemahan.
- **Kriteria Selesai:** Posisi bacaan terakhir tersimpan setelah browser ditutup, dan pencarian merespons instan.

### Step 5: Modul Preferensi Tampilan, Aksesibilitas & Integrasi Database PostgreSQL
- **Aksesibilitas & Tampilan:**
  - 4 tema warna: **Light**, **Dark (Inverse)**, **High Contrast**, dan **Sepia**.
  - Kontrol ukuran font skala luas (hingga `52px` untuk lansia), pengaturan *line spacing*, pilihan jenis font Arab, dan tombol 1-klik **Mode Lansia**.
  - **Ayat Spotlight**, **Auto-Scroll** lambat, dan **Keyboard Shortcuts** desktop.
- **Sisipan Database PostgreSQL (Logging & Staging Setting per IP):**
  1. **Pencatatan Log IP Pembuka Aplikasi (`visitor_logs`):** Mencatat setiap IP address pengunjung saat pertama kali dan berkala membuka web, user-agent, dan waktu akses.
  2. **Pencatatan Log Kegiatan per IP (`activity_logs`):** Mencatat aksi dari setiap IP address (misal: membuka menu setting, mengubah ukuran font, menyalakan mode lansia, mengubah tema, memutar audio, dll.).
  3. **Tabel Staging Sementara per IP (`temp_ip_settings`):** Menyimpan konfigurasi setting dan bookmark sementara yang diisolasi berdasarkan IP address pengguna agar konfigurasi satu pengunjung tidak berbenturan dengan pengunjung lain.
  4. **Modal / Popup Call-to-Action (CTA):** Saat pengunjung melakukan tindakan penyimpanan setting atau bookmarking, sistem menampilkan modal ajakan bergabung:
     > *"Apakah Anda ingin bergabung dengan kami? Daftar sekarang"*
     untuk menawarkan pendaftaran akun permanen.
- **Kriteria Selesai:** Teks responsif di semua tema/mode lansia, backend API terhubung ke PostgreSQL, pencatatan log IP & kegiatan berjalan, setting tersimpan di tabel per-IP, dan popup ajakan tampil saat penyimpanan.

### Step 6: Modul Waktu Aktual & Jadwal Shalat
- Mengintegrasikan library `adhan` (*Adhan.js*) dengan parameter **Kemenag RI**.
- Membangun widget ringkas di header: jam aktual *real-time* + hitung mundur waktu shalat berikutnya, serta modal detail 5 waktu shalat.
- Menambahkan pemilihan kota manual dan tombol opsional deteksi GPS (tanpa popup otomatis saat awal buka).
- Memastikan widget otomatis tersembunyi saat **Mode Layar Penuh (*Zen Mode*)** aktif.
- **Kriteria Selesai:** Jadwal shalat akurat sesuai lokasi terpilih dan berjalan tanpa koneksi internet.

### Step 7: Modul Edukasi Pemula & Audio Recitation
- **Tajwid Berwarna, Panduan Makhraj & Tanda Waqaf:**
  - Menambahkan tombol pintas 1-klik **Toggle Tajwid Berwarna** langsung di bilah pembaca (dengan proteksi otomatis nonaktif pada *High Contrast / Mode Lansia* demi keterbacaan mata).
  - Membangun modal edukasi interaktif 3 tab: **Hukum Tajwid & Legenda Warna** (11 kaidah + contoh ayat), **5 Makharijul Huruf** (dengan tips artikulasi untuk lisan Indonesia), dan **Tanda Waqaf & Ibtida'** (7 jenis waqaf) lengkap dengan filter pencarian instan.
- **Audio Recitation (Murottal Berkualitas Tinggi):**
  - Pemutar audio mini (*Audio Mini-Player*) responsif dengan 5 pilihan qari' mu'tabar: Mishary Rashid Alafasy, Mahmoud Khalil Al-Husary, Muhammad Siddiq Al-Minshawi, Abdurrahman As-Sudais, dan Abu Bakr Asy-Syathiri.
  - Pengatur kecepatan bacaan (*Playback Speed*): `0.75x` (belajar tartil), `1.0x` (normal), `1.25x`, dan `1.5x` (tadarus).
  - Bilah linimasa waktu (*scrubber* & seek slider), display durasi (`mm:ss / mm:ss`), dan pengatur volume/mute mandiri.
  - Tombol aksi **"Dengarkan Surat / 'Ain Ini"** langsung dari spanduk atas untuk pemutaran otomatis berurutan (*continuous playback*).
  - **Ayah-Sync Highlight & Auto-Scroll:** Penandaan ayat aktif secara visual dan pengguliran otomatis layar ke ayat yang sedang bersuara.
  - Mode ulangi (*Repeat Mode*): `1x` (normal), `Ulang Ayat` (tahfidz), dan `Lanjut` (berurutan).
  - Penanganan error streaming dan pencatatan log telemetri aktivitas audio ke PostgreSQL backend.
- **Kriteria Selesai:** Tajwid akurat, modal panduan komprehensif, pemutar audio canggih dengan 5 qari & multi-speed, serta sinkronisasi ayat berjalan lancar tanpa error.

### Step 8 (Paling Akhir): Portal Admin & Pengguna, PWA Offline & Kontainerisasi Rilis
- **Portal Administrator (`/admin`):**
  - Akses melalui rute `/admin` dengan sistem otentikasi aman (Username: `admin`, Password: `admin123`).
  - **Dashboard Statistik & Chart Visual:** Ringkasan jumlah pembaca unik, rata-rata durasi sesi baca, total aktivitas, dan pendaftar baru (*leads*); dilengkapi grafik batang interaktif geolokasi IP berdasarkan negara asal (Indonesia, Malaysia, Singapura, Arab Saudi, dll.) dan grafik tren kunjungan mingguan.
  - **Modul Audit Trail Penuh:** Tampilan tabel riwayat log kegiatan komprehensif dari database PostgreSQL (`activity_logs`), filter per kategori kegiatan, pencarian berbasis IP/kata kunci, grafik frekuensi, serta tombol ekspor ke format JSON.
  - **Modul Konfigurasi Situs & Pengumuman:** Antarmuka pengelola untuk mengubah nama aplikasi, logo/simbol kaligrafi, teks hak cipta (copyright), lisensi aplikasi, dan banner pengumuman (broadcast announcement) kepada seluruh pengguna dengan pratinjau langsung (*live preview*).
- **Portal Pengguna & Anggota (`/user`):**
  - Akses melalui rute `/user` dengan akun demo yang telah disediakan (Username: `fulan`, Password: `user123`).
  - **Dashboard Card Bookmark Pribadi:** Tampilan kartu-kartu ayat yang ditandai beserta nama surat, nomor ayat, 'Ain, catatan tadabbur pribadi, dan tombol 1-klik untuk langsung membaca di lembar tilawah.
  - **Hasil Pencarian yang Diarsipkan (Search Archive):** Formulir dan daftar tema/kata kunci pencarian terjemahan yang disimpan (misal: "sabar", "surga", "rezeki") lengkap dengan catatan dan tombol 1-klik buka hasil di Al-Qur'an.
  - **Sinkronisasi Profil:** Penyimpanan preferensi bacaan dan riwayat terakhir dibaca secara persisten di database.
- **PWA Offline, Docker & Deployment:**
  - Mengonfigurasi **PWA Service Worker** (`sw.js`) untuk *pre-caching* aplikasi + font + `meta.json`, serta *runtime caching* surat & audio unduhan.
  - Tombol *"Simpan Semua 114 Surat Offline"* di menu pengaturan.
  - Multi-stage `Dockerfile` dan `docker-compose.yml` (PostgreSQL 16 + API Node.js + Web Nginx) pada port `3382`.
- **Kriteria Selesai:** Portal `/admin` dan `/user` berfungsi penuh dengan kredensial yang ditentukan, dashboard chart geolokasi dan audit trail tampil lengkap, modul konfigurasi aktif, dan aplikasi terverifikasi build 100% pada port `3382`.

