# Master Plan & Brainstorming: Aplikasi Quran Web

Dokumen ini berisi hasil brainstorming dan perencanaan awal untuk membangun aplikasi **Quran Web** yang sederhana, ringan, nyaman digunakan oleh umat Islam, memiliki pembagian navigasi berdasarkan **Surat**, **Juz**, dan **'Ain (Ruku')**, serta adaptif antara tampilan **layar penuh di Desktop** dan **proporsional di Mobile Device**.

---

## 1. Visi & Tujuan Produk

- **Tujuan Utama:** Menyediakan aplikasi web Al-Qur'an yang cepat, bersih, bebas distraksi, dan mudah diakses dari perangkat apa pun tanpa harus menginstal aplikasi berat.
- **Keunggulan Utama:**
  1. **Tiga Mode Navigasi Utama:** Pembagian berdasarkan **Surat** (114 surat), **Juz** (30 juz), dan **'Ain / Ruku'** (±556–558 ruku' tematik).
  2. **Pengalaman Baca Adaptif:**
     - **Desktop:** Dapat diperluas menjadi tampilan layar penuh (*Fullscreen Reading Mode*) dengan tata letak lebar yang nyaman dan panel navigasi yang dapat disembunyikan.
     - **Mobile:** Mengikuti ukuran layar secara proporsional (*mobile-first*, tipografi dinamis, nyaman digenggam dan digulir dengan satu tangan).

---

## 2. Sumber Data (Data Sources)

Untuk aplikasi yang sederhana namun akurat, pemilihan sumber data sangat krusial, terutama karena kebutuhan pembagian **'Ain (Ruku')** yang tidak selalu tersedia di semua API Al-Qur'an lokal.

### Opsi A: Dataset Statis JSON Lokal / CDN *(Direkomendasikan untuk MVP)*
Menyimpan data Al-Qur'an dalam format JSON terstruktur di dalam proyek (atau di-*host* di CDN statis).
- **Sumber Referensi Data:**
  - **Tanzil.net:** Teks Al-Qur'an Utsmani/Imlaei yang terverifikasi.
  - **Quran.com API v4 / AlQuran Cloud:** Untuk mengambil pemetaan metadata `juz_number` dan `ruku_number` ('Ain).
  - **Kemenag RI / EQuran.id:** Untuk terjemahan Bahasa Indonesia resmi.
- **Kelebihan:**
  - Kecepatan akses sangat tinggi (*zero latency* dari API eksternal).
  - Tidak bergantung pada *uptime* server pihak ketiga.
  - Mudah mendukung mode **Offline (PWA)**.
  - Konsistensi data `'Ain` terjamin setelah dikurasi satu kali.

### Opsi B: Integrasi API Publik Secara Langsung
1. **AlQuran Cloud API (`api.alquran.cloud/v1`)**
   - Mendukung endpoint berdasarkan `surah`, `juz`, dan **`ruku` ('Ain)** secara native.
   - Menyediakan teks Arab dan terjemahan Indonesia (`id.indonesian`).
2. **Quran.com API v4 (`api.quran.com/api/v4`)**
   - Sangat lengkap (teks Utsmani, halaman Mushaf, `juz_number`, `ruku_number`, `hizb_number`, dan terjemahan).
3. **EQuran.id API (`equran.id/api/v2`)**
   - Sangat baik untuk teks Arab, terjemahan Kemenag, tafsir, dan audio murottal, namun **belum menyediakan indeks `'Ain` (Ruku') secara langsung**, sehingga perlu digabungkan dengan tabel pemetaan `'Ain` tersendiri.

### Catatan Khusus Mengenai Pembagian `'Ain (Ruku')`
- Dalam Mushaf (terutama Mushaf Standar Indonesia dan Indo-Pak), `'Ain` ditandai dengan huruf **ع** sebagai penanda satu kesatuan topik/paragraf (umumnya terdiri dari 556 atau 558 ruku' di seluruh Al-Qur'an).
- Disarankan membuat **tabel indeks pemetaan `'Ain`** yang mencatat `ain_number`, `surah_id`, `start_ayah`, `end_ayah`, serta `juz_number` agar perpindahan antar-'Ain berjalan mulus.

### Contoh Skema Data Inti
```json
{
  "id": 1,
  "surah": 2,
  "ayah": 1,
  "juz": 1,
  "ain": 2,
  "text_uthmani": "الم",
  "translation_id": "Alif Lam Mim."
}
```

---

## 3. Arsitektur Modul Aplikasi

Aplikasi dapat dibagi menjadi beberapa modul sederhana yang terpisah dengan jelas:

### 3.1. Modul Indeks & Navigasi (`Navigation Module`)
- **Daftar Surat:** 114 surat (nomor, nama Arab, nama Latin, arti, tempat turun, jumlah ayat).
- **Daftar Juz:** 30 juz beserta informasi mulai dari Surat/Ayat ke-berapa hingga Surat/Ayat ke-berapa.
- **Daftar 'Ain (Ruku'):** Daftar ruku' yang dapat difilter per surat atau ditampilkan berurutan (Ruku' 1 s.d. akhir), sangat membantu pengguna yang menargetkan bacaan harian per-'Ain.

### 3.2. Modul Pembaca Al-Qur'an (`Quran Reader Module`)
- Menampilkan teks Arab dengan arah baca kanan-ke-kiri (`dir="rtl"`).
- Menampilkan nomor ayat bergaya ornamen/lingkaran khas Mushaf.
- Menampilkan **penanda batas Juz** dan **penanda batas 'Ain** (misalnya ikon/simbol `ع` atau pembatas visual di awal/akhir setiap ruku').
- **Opsi tampilan:**
  - **Mode Terjemahan (Default):** Setiap ayat Arab dilengkapi **terjemahan Bahasa Indonesia resmi (Kemenag RI)** di bawahnya agar pengguna memahami makna bacaan (selaras dengan pembagian tematik `'Ain`).
  - **Mode Fokus / Mushaf:** Hanya menampilkan teks Arab tanpa terjemahan bagi pengguna yang ingin fokus tilawah cepat atau hafalan.

### 3.3. Modul Tata Letak Adaptif & Layar Penuh (`Responsive & Fullscreen Module`)
- **Perilaku di Desktop:**
  - Menggunakan tata letak *split-view* (sidebar navigasi Surat/Juz/'Ain di kiri, area baca utama di kanan).
  - Menyediakan tombol **Mode Layar Penuh (Fullscreen)** menggunakan *Browser Fullscreen API* (`requestFullscreen()`) sekaligus menyembunyikan sidebar (*Zen/Focus Mode*) sehingga layar 100% didedikasikan untuk membaca Al-Qur'an.
- **Perilaku di Mobile:**
  - Tata letak satu kolom yang proporsional (`100%` lebar layar dengan padding aman/*safe-area*).
  - Tipografi responsif menggunakan CSS `clamp()` agar ukuran huruf Arab otomatis menyesuaikan lebar layar HP (misal 360px hingga 430px) tanpa terpotong atau terlalu kecil.
  - Navigasi menggunakan *Bottom Bar* atau *Slide-over Drawer* agar mudah dijangkau ibu jari.

### 3.4. Modul Penanda & Riwayat (`Bookmark & Last Read Module`)
- **Terakhir Dibaca (*Last Read*):** Otomatis menyimpan posisi surat/juz/'ain dan ayat terakhir yang dibaca menggunakan `localStorage`.
- **Bookmark:** Pengguna dapat menandai ayat atau `'Ain` tertentu untuk dibuka kembali dengan cepat.

### 3.5. Modul Preferensi Tampilan & Aksesibilitas (`Settings & Accessibility Module`)
- **Skala Font Luas (Ramah Lansia):** Pengaturan ukuran font Arab dan terjemahan dengan rentang yang lebar (misalnya hingga ukuran ekstra besar `44px–52px` untuk lansia), disertai penyesuaian *line-height* otomatis agar harakat tidak bertabrakan dan teks tetap membungkus rapi tanpa *horizontal scroll*.
- **Mode Lansia (*One-Click Easy Mode*):** Pintasan 1-klik yang otomatis mengaktifkan font besar, kontras tinggi, tombol navigasi lebih besar, dan antarmuka yang lebih sederhana.
- **Tema & *Inverse Color*:** Pilihan **Light (Terang)**, **Dark / Inverse (Gelap)**, **High Contrast** (hitam pekat dengan teks putih/kuning tajam untuk *low-vision* dan fokus baca), serta **Sepia / Krem Mushaf**.
- **Fokus Ayat (*Ayat Spotlight*):** Menyorot ayat yang sedang dibaca/diklik sementara ayat lain sedikit diredupkan agar mata tidak salah lompat baris.
- **Pilihan Font Arab & Jarak Baris:** Pilihan antara font standar Indonesia (**LPMQ Isep Misbah**) atau Timur Tengah (**Amiri / Scheherazade**), serta pengaturan jarak antar baris (*line spacing*).
- **Kenyamanan Tambahan:** Toggle tampilkan/sembunyikan terjemahan, *Auto-Scroll* lambat untuk membaca tanpa menggulir manual, dan *Keyboard Shortcuts* di desktop (`F` untuk Fullscreen, `+`/`-` untuk ukuran font).

### 3.6. Modul Pencarian Cepat (`Search Module`)
- Pencarian nama surat (misal ketik `"Yasin"` atau `"36"`), loncat ke Juz (misal `"Juz 30"`), atau pencarian kata kunci pada terjemahan.

### 3.7. Modul Audio Murottal / Recitation *(Pendukung Belajar & Tilawah)*
- **Urgensi:** Sangat bermanfaat bagi pemula maupun pembaca umum untuk mendengar pelafalan makhraj, panjang-pendek (*mad*), dan waqaf yang benar dari qari'/ulama pembaca Al-Qur'an yang mu'tabar (misal: Syaikh Mahmud Khalil Al-Husary untuk belajar tartil, atau Syaikh Mishary Rashid Alafasy).
- **Fitur Utama:**
  - Pemutar audio per ayat, per `'Ain`, atau per surat dengan *mini-player* di bagian bawah layar.
  - **Sinkronisasi Ayat (*Ayah-Sync*):** Ayat yang sedang dibaca otomatis disorot (*highlight*) mengikuti suara qari'.
  - **Mode Ulangi (*Repeat / Loop*):** Mengulang satu ayat atau satu `'Ain` tertentu untuk latihan bacaan atau hafalan.
  - **Strategi Penyimpanan Audio:** Streaming *on-demand* dari CDN/Object Storage (agar ukuran aplikasi awal tetap ringan), dengan opsi **simpan offline per surat/'Ain** ke *Cache API / IndexedDB*.

### 3.8. Modul Waktu Aktual & Jadwal Shalat *(Fitur Pelengkap Ibadah)*
- **Urgensi:** Meski bukan fungsi inti pembaca Al-Qur'an, menampilkan **jam aktual saat ini** dan **jadwal shalat** sangat bermanfaat agar pengguna yang sedang khusyuk tilawah tetap sadar jika waktu shalat sudah dekat atau masuk.
- **Fitur Ringkas:**
  - Menampilkan jam digital aktual (*real-time*) dan penanda **waktu shalat berikutnya** beserta hitung mundur (*countdown*).
  - Menampilkan daftar 5 waktu shalat wajib (Subuh, Dzuhur, Ashar, Maghrib, Isya) + Imsak/Terbit (opsional) dalam popover/modal ringkas.
  - Pemilihan lokasi secara manual (pilih kota) atau opsional via GPS browser (*tanpa memaksa popup izin lokasi saat pertama kali web dibuka*).
  - **Prinsip Anti-Distraksi:** Indikator waktu tampil ringkas di header/panel, dan **otomatis disembunyikan saat Mode Layar Penuh (*Zen Mode*) diaktifkan** di Desktop.

### 3.9. Modul Edukasi Pemula: Tajwid Berwarna & Panduan Makhraj *(Fase Lanjutan)*
- **Mode Tajwid Berwarna (Opsional / *Toggle ON/OFF*):**
  - Mewarnai hukum bacaan pada ayat (seperti *Ghunnah/Ikhfa*, *Qalqalah*, *Mad*, dan *Idgham*) untuk membantu pemula.
  - Bersifat opsional dan otomatis dinonaktifkan ketika **Mode High Contrast / Mode Lansia** aktif agar keterbacaan tetap maksimal.
  - Menggunakan dataset terkurasi/terverifikasi (misal `text_uthmani_tajweed` dari Quran.com API v4), **bukan** parser regex manual sendiri demi akurasi hukum bacaan.
  - Dilengkapi **Legenda Warna Tajwid** agar pengguna langsung memahami arti setiap warna.
- **Panduan Ringkas Tajwid & Makharijul Huruf:**
  - Disajikan dalam halaman/modal referensi terpisah (tidak mewarnai huruf berdasarkan makhraj di dalam ayat agar tidak membingungkan).
  - Berisi ringkasan 5 area *Makharijul Huruf* (*Al-Jauf, Al-Halq, Al-Lisan, Asy-Syafatan, Al-Khaisyum*) beserta daftar huruf dan contoh hukum tajwid dasar.

---

## 4. Rekomendasi Teknologi (Tech Stack)

Untuk menjaga aplikasi tetap **sederhana, cepat, dan mudah dipelihara**, berikut rekomendasi *tech stack* yang paling ideal:

| Komponen | Rekomendasi Utama | Alternatif | Alasan Pemilihan |
| :--- | :--- | :--- | :--- |
| **Framework Frontend** | **Next.js (React)** atau **Vite + React** | Astro / SvelteKit | Ekosistem matang, cepat, mudah diatur untuk *static export* maupun pengembangan lanjutan. |
| **Bahasa** | **TypeScript** | JavaScript | Menjamin struktur data `Surah`, `Juz`, `Ain`, dan `Ayah` aman dari bug tipe data. |
| **Styling** | **Tailwind CSS** | Vanilla CSS | Sangat cepat untuk membuat desain responsif (*mobile-first* & *desktop fullscreen*) dan tema Dark/Light/Sepia. |
| **Font Arab** | **LPMQ Isep Misbah** atau **Amiri / Scheherazade New** | KFGQPC Uthmanic Script HAFS | Harakat jelas, tidak bertumpuk, dan familiar bagi pembaca Al-Qur'an di Indonesia. |
| **Penyimpanan Lokal** | **Browser `localStorage` / `IndexedDB`** | Backend DB (Supabase) | Data preferensi instan tersimpan langsung di browser pengguna. |
| **Database Server** | **PostgreSQL (pg)** + Node.js API | SQLite / Supabase | Mencatat log IP pengunjung, audit trail kegiatan, tabel staging per IP, portal `/admin` & `/user`, serta konfigurasi identitas situs. |
| **Portal Akses** | **Rute `/admin` & `/user`** | - | Portal Administrator (chart geolokasi, audit trail, branding) dan Portal Pengguna (card bookmark & arsip pencarian). |
| **Dukungan Offline** | **PWA (Progressive Web App)** | - | Memungkinkan pengguna "menginstal" web di HP/Desktop dan membaca Al-Qur'an tanpa koneksi internet. |
| **Kalkulasi Jadwal Shalat** | **Adhan.js (`adhan`)** | Aladhan API / MyQuran API | Menghitung waktu shalat secara lokal di browser (offline-ready) dengan standar Kemenag RI / MWL berdasarkan koordinat kota. |
| **Container & Port** | **Docker + Nginx (Port 3382)** | Local Node Server | Menjalankan aplikasi secara terisolasi via container Nginx pada port kustom `3382`. |
| **Hosting / Deployment** | **Docker / Vercel / Cloudflare Pages** | GitHub Pages / Netlify | Siap dijalankan mandiri via Docker container maupun platform CDN global statis. |

---

## 5. Konsep Tata Letak (UI/UX Wireframe)

### Tampilan Desktop (Normal & Layar Penuh)
```text
+-------------------------------------------------------------------+
| [Logo QuranWeb] [Cari...]   [🕒 18:05 | Maghrib -00:12] [Tema][⛶] |
+------------------+------------------------------------------------+
| Tab:             |  Surat Al-Baqarah  |  Juz 1  |  'Ain ke-2      |
| [Surat|Juz|'Ain] |------------------------------------------------|
|                  |                                                |
| > 1. Al-Fatihah  |  [Teks Arab Rata Kanan, ukuran besar & jelas]  |
| > 2. Al-Baqarah  |  Terjemahan Bahasa Indonesia rata kiri         |
|   - 'Ain 1       |                                                |
|   - 'Ain 2 (Aktif)| --------------------------------------------  |
| > 3. Ali 'Imran  |  [Penanda Akhir 'Ain (ع)]                      |
| ...              |                                                |
+------------------+------------------------------------------------+
*Saat tombol [⛶ Full] diklik: Header & Sidebar dapat disembunyikan
 (auto-hide / toggle) agar area baca memenuhi 100% layar desktop.
```

### Tampilan Mobile (Proporsional)
```text
+---------------------------+
| [☰]  Al-Baqarah (Juz 1)   |
|      'Ain ke-2      [⚙]   |
+---------------------------+
|                           |
|  [Teks Arab Proporsional] |
|  Terjemahan Indonesia     |
|                           |
|  -----------------------  |
|  [Penanda Akhir 'Ain (ع)] |
|                           |
+---------------------------+
| [Surat] [Juz] ['Ain] [★]  |  <-- Bottom Navigation Bar
+---------------------------+
```

---

## 6. Roadmap Pengembangan (Bertahap)

### Fase 1: Fondasi & MVP (*Minimum Viable Product*)
- Inisialisasi proyek (misal: Next.js/React + Tailwind CSS + TypeScript).
- Pengumpulan & validasi dataset JSON (114 Surat, 30 Juz, dan pemetaan lengkap `'Ain`).
- Pembuatan halaman Reader dengan navigasi Surat, Juz, dan `'Ain`.
- Implementasi desain responsif (proporsional di mobile) dan tombol **Mode Layar Penuh** di desktop.

### Fase 2: Kenyamanan Tilawah, Aksesibilitas & Pendukung Ibadah
- Fitur *Last Read* dan *Bookmark* (berbasis `localStorage`).
- Pengaturan ukuran font Arab (termasuk skala ekstra besar & **Mode Lansia**), jarak baris, pilihan font (LPMQ / Amiri), tema baca (Light / Dark / **High Contrast (Inverse)** / Sepia), **Ayat Spotlight**, *Auto-Scroll*, serta toggle terjemahan.
- Fitur pencarian cepat Surat/Juz/'Ain/Terjemahan & *Keyboard Shortcuts* di desktop.
- Widget **Waktu Aktual & Jadwal Shalat** (jam real-time, countdown shalat berikutnya, pilihan kota/GPS opsional).

### Fase 3: Pengalaman Maksimal & Portal Manajemen (Step 8)
- **Portal Administrator (`/admin`):** Akses pengelola dengan autentikasi aman (`admin` / `admin123`), dashboard chart penggunaan berdasarkan geolokasi IP pengunjung (negara asal), modul **Audit Trail Penuh** dengan filter kegiatan dan ekspor data, serta modul **Konfigurasi Identitas Situs** (ubah nama, logo, lisensi, copyright, dan banner pengumuman pengguna).
- **Portal Pengguna & Anggota (`/user`):** Akses pengguna dengan akun demo (`fulan` / `user123`), dashboard kartu bookmark pribadi (*card bookmark*), modul **Hasil Pencarian yang Diarsipkan** (*search archive*), dan sinkronisasi preferensi tilawah.
- Dukungan **PWA** agar aplikasi bisa diinstal dan dibaca saat *offline*.
- **Mode Tajwid Berwarna** (toggle ON/OFF menggunakan dataset terkurasi + legenda warna) dan halaman **Panduan Ringkas Tajwid & Makhraj** untuk pemula.
- Integrasi audio murottal 5 qari mu'tabar dengan pengatur kecepatan bacaan (*playback speed* 0.75x–1.5x) dan sinkronisasi ayat (*Ayah-Sync*).
- Paket kontainerisasi **Docker** (PostgreSQL 16 + Node API + Nginx Web pada port 3382) untuk kemudahan *deployment* mandiri di server pribadi/VPS.

---

## 7. Hal Teknis yang Perlu Diperhatikan Sejak Awal

1. **Rendering Teks Arab (`RTL` & Font):** Selalu gunakan properti CSS `direction: rtl; unicode-bidi: isolate;` pada kontainer teks Arab agar tanda baca dan nomor ayat tidak berantakan ketika bercampur dengan karakter Latin.
2. **Line-Height Teks Arab:** Berikan `line-height` yang cukup lega (misalnya `2.0` hingga `2.4`) agar harakat (fathah, kasrah, dhammah, tasydid) tidak saling bertabrakan antar baris, baik di desktop maupun di mobile.
3. **Konsistensi Standar `'Ain`:** Pastikan dari awal memilih satu standar ruku' (misalnya standar Mushaf Utsmani/Kemenag) dan mencantumkan keterangan standar tersebut jika diperlukan.
4. **Performa Rendering Surat Panjang:** Untuk surat panjang seperti Al-Baqarah (286 ayat), gunakan teknik *pagination per 'Ain / per halaman* atau *virtualized list* agar halaman tetap ringan saat dibuka di HP dengan spesifikasi rendah.
5. **Ketahanan Data & Mode Offline (Tanpa Ketergantungan API Eksternal):** Seluruh dataset teks Al-Qur'an, pemetaan Juz/`'Ain`, dan terjemahan (±2–5 MB) **disimpan mandiri di dalam aplikasi/hosting sendiri** (bukan *fetch* langsung ke API pihak ketiga setiap kali user membuka halaman) serta di-*cache* di browser (**PWA / IndexedDB**). Dengan demikian, jika sumber eksternal bermasalah atau pengguna kehilangan koneksi internet, aplikasi tetap dapat digunakan secara penuh.

