# Functional Specification Document (FSD): Aplikasi Quran Web

Dokumen ini menjabarkan spesifikasi fungsional aplikasi **Quran Web** berdasarkan hasil brainstorming pada [MasterPlan.md](file:///Users/mac/Projects/2026/QuranWeb/Initial/MasterPlan.md). Dokumen ini berfokus pada perilaku sistem, kebutuhan fungsional, dan arsitektur penyimpanan tanpa implementasi kode.

---

## 1. Tujuan & Ruang Lingkup

- **Tujuan:** Membangun aplikasi web Al-Qur'an yang sederhana, cepat, dan nyaman dibaca dengan dukungan navigasi berdasarkan **Surat**, **Juz**, dan **'Ain (Ruku')**, serta tampilan **layar penuh pada Desktop** dan **proporsional pada Mobile Device**.
- **Ruang Lingkup Sistem:**
  - **Prinsip Guest-First:** Pengguna umum dapat langsung membuka dan membaca Al-Qur'an secara instan tanpa kewajiban registrasi atau login.
  - **Backend & Database PostgreSQL:** Dilengkapi server Node.js API dan PostgreSQL untuk pencatatan log IP pengunjung (`visitor_logs`), riwayat kegiatan (`activity_logs`), staging pengaturan per IP (`temp_ip_settings`), serta portal akun `/admin` dan `/user`.
  - **Dukungan PWA Offline & Kontainerisasi Docker:** Aplikasi dapat diinstal sebagai PWA dan dijalankan melalui Docker compose pada port kustom **3382**.

---

## 2. Keputusan Penyimpanan Data & Interaksi Pengguna

### 2.1. Penyimpanan Data, Database PostgreSQL & Ketahanan Offline
- **Data Teks Al-Qur'an (Surat, Ayat, Juz, 'Ain, Terjemahan):** Bersifat statis mandiri di aplikasi (JSON lokal) dan di-*cache* ke `IndexedDB` / *Cache API* PWA sehingga tetap berfungsi penuh saat *offline*.
- **Penyimpanan Lokal Sisi Klien:** `localStorage` digunakan untuk penyimpanan instan bebas lag di perangkat pembaca.
- **Database Server (PostgreSQL) - Sisipan Step 5 & Step 8:**
  1. **Visitor IP Log (`visitor_logs`):** Mencatat IP address setiap pembuka web, jenis browser (User-Agent), negara asal (geolokasi), dan waktu kunjungan.
  2. **Activity Log (`activity_logs`):** Mencatat aktivitas interaktif dari masing-masing IP (misal: membuka menu setting, mengubah tema, menyalakan mode lansia, memilih surat, memutar audio murottal).
  3. **Tabel Staging Sementara per IP (`temp_ip_settings`):** Menyimpan konfigurasi setting dan bookmark sementara yang terisolasi berdasarkan IP address pengguna agar setting seorang pengunjung tidak berbenturan dengan pengunjung lainnya.
  4. **Tabel Akun & Otentikasi (`users`):** Mengelola hak akses administrator (`/admin`) dan anggota (`/user`).
  5. **Tabel Konfigurasi Aplikasi (`app_configurations`):** Menyimpan identitas dinamis aplikasi (nama, logo, lisensi, copyright, broadcast pengumuman).
  6. **Tabel Arsip Pencarian & Bookmark Cloud (`user_saved_searches`, `user_bookmarks`):** Menyimpan riwayat pencarian terjemahan yang diarsipkan dan bookmark akun pengguna.
  7. **Popup Call-to-Action (CTA) Bergabung:** Ketika pengguna melakukan tindakan penyimpanan (misal: menyimpan bookmark atau konfigurasi), sistem menampilkan popup ramah:
     > *"Apakah Anda ingin bergabung dengan kami? Daftar sekarang"*
     untuk memfasilitasi pengguna yang ingin menyinkronkan data bacaannya secara permanen antar perangkat.

### 2.2. Interaksi Pengguna & Konsep Guest-First
- Pengguna dapat langsung membaca tanpa kewajiban login (*guest-first*).
- Riwayat dan pengaturan pengguna di-*stage* di database berdasarkan IP address secara otomatis di latar belakang.
- Pendaftaran akun bersifat opsional melalui ajakan popup CTA saat pengguna menyimpan data bacaannya.

---

## 3. Aktor Pengguna (User Roles)

| Aktor | Deskripsi | Hak Akses |
| :--- | :--- | :--- |
| **Pengunjung / Pembaca (Guest User)** | Pengguna umum yang mengakses tanpa login. | Mengakses seluruh teks Al-Qur'an (Surat, Juz, 'Ain), mode layar penuh, mencari ayat/surat, menyimpan *Last Read*, *Bookmark*, dan mengatur preferensi tampilan secara lokal. |
| **Anggota Terdaftar (Registered User - `/user`)** | Pengguna yang telah masuk menggunakan akun (Demo: `fulan` / `user123`). | Memiliki seluruh hak akses pengunjung ditambah Dashboard Pengguna pribadi: mengelola kartu bookmark (*card bookmark*), mengarsipkan kata kunci pencarian terjemahan, dan menyinkronkan tilawah ke database. |
| **Administrator (Admin User - `/admin`)** | Pengelola sistem dengan otentikasi khusus (Demo: `admin` / `admin123`). | Mengakses Dashboard Statistik & Chart Geolokasi Pengunjung, Modul Audit Trail Penuh dengan filter dan ekspor JSON, serta Modul Konfigurasi Identitas Situs (logo, nama aplikasi, copyright, lisensi, pengumuman pengguna). |

---

## 4. Spesifikasi Fungsional (Functional Requirements)

### FR-01: Modul Navigasi & Indeks (Surat, Juz, 'Ain)
- **FR-01.1:** Sistem menyediakan 3 tab/mode navigasi utama: **Surat**, **Juz**, dan **'Ain (Ruku')**.
- **FR-01.2:** Pada tab **Surat**, sistem menampilkan daftar 114 surat berisi nomor surat, nama Arab, nama Latin, arti nama, jumlah ayat, dan kategori (Makkiyah/Madaniyah).
- **FR-01.3:** Pada tab **Juz**, sistem menampilkan daftar 30 juz beserta informasi rentang Surat dan Ayat awal hingga akhir pada masing-masing juz.
- **FR-01.4:** Pada tab **'Ain**, sistem menampilkan daftar seluruh 'Ain (Ruku') secara berurutan atau terkelompok per surat, lengkap dengan keterangan surat dan rentang ayatnya.
- **FR-01.5:** Memilih salah satu item (Surat, Juz, atau 'Ain) akan langsung memuat dan menggulir (*scroll*) area baca ke posisi awal bagian tersebut.

### FR-02: Modul Pembaca Al-Qur'an (Quran Reader)
- **FR-02.1:** Sistem menampilkan teks Al-Qur'an dengan arah kanan-ke-kiri (`RTL`) menggunakan font Arab yang jelas dan memiliki harakat terbaca.
- **FR-02.2:** Setiap ayat memiliki penanda nomor ayat yang jelas.
- **FR-02.3:** Sistem menampilkan penanda visual batas **Juz** dan batas **'Ain** (misalnya simbol huruf **ع** atau pemisah antar-ruku') di dalam alur bacaan.
- **FR-02.4 (Terjemahan & Mode Fokus):** Sistem menyediakan **terjemahan per ayat** (standar resmi Kemenag RI) agar pengguna dapat memahami makna setiap ayat, dengan dua mode tampilan:
  - **Mode Terjemahan (Default):** Menampilkan teks Arab beserta terjemahan Bahasa Indonesia di bawahnya.
  - **Mode Fokus / Mushaf:** Hanya menampilkan teks Arab tanpa terjemahan untuk fokus tilawah atau hafalan.
- **FR-02.5:** Sistem menyediakan tombol navigasi cepat **Sebelumnya / Berikutnya** (antar-Surat, antar-Juz, atau antar-'Ain sesuai mode aktif).

### FR-03: Modul Tata Letak Adaptif & Mode Layar Penuh
- **FR-03.1 (Perilaku Desktop):**
  - Pada layar lebar (Desktop), sistem menampilkan tata letak *split-view* (panel navigasi di sisi kiri dan area baca di sisi kanan).
  - Sistem menyediakan tombol **Layar Penuh (*Fullscreen Mode*)** yang mengaktifkan *Browser Fullscreen API* dan menyembunyikan panel navigasi/header (*Zen Mode*) agar area baca memenuhi layar.
  - Pengguna dapat keluar dari mode layar penuh dengan tombol yang sama atau menekan tombol `Esc`.
- **FR-03.2 (Perilaku Mobile):**
  - Pada perangkat mobile, sistem menampilkan tata letak satu kolom yang mengikuti lebar layar secara proporsional tanpa *horizontal scroll*.
  - Ukuran teks Arab dan elemen antarmuka menyesuaikan lebar layar perangkat secara otomatis (*fluid typography*).
  - Panel navigasi Surat/Juz/'Ain diakses melalui *bottom navigation bar* atau *slide-over drawer* agar mudah dijangkau satu tangan.

### FR-04: Modul Last Read & Bookmark (Lokal)
- **FR-04.1:** Sistem secara otomatis (atau melalui satu klik tombol *"Tandai Terakhir Dibaca"*) menyimpan posisi ayat, surat, juz, dan 'Ain terakhir ke `localStorage`.
- **FR-04.2:** Pada halaman utama atau panel navigasi, sistem menampilkan pintasan **"Lanjutkan Bacaan (*Last Read*)"** jika riwayat bacaan tersedia.
- **FR-04.3:** Pengguna dapat menambahkan atau menghapus **Bookmark** pada ayat atau 'Ain tertentu yang tersimpan di `localStorage`.
- **FR-04.4:** Pengguna dapat menyalin tautan langsung (*Share Link*) ke ayat tertentu untuk dibuka di perangkat lain.

### FR-05: Modul Preferensi Pembaca & Aksesibilitas (Reader Settings & Accessibility)
- **FR-05.1 (Skala Font & Mode Lansia):** Pengguna dapat memperbesar atau memperkecil ukuran font Arab dan terjemahan dalam rentang yang luas (hingga ukuran ekstra besar untuk lansia) tanpa menyebabkan *horizontal scroll*, serta tersedia tombol pintasan **Mode Lansia** (1-klik untuk font besar, kontras tinggi, dan kontrol navigasi lebih besar).
- **FR-05.2 (Tema & *Inverse Color*):** Pengguna dapat memilih tema baca: **Light (Terang)**, **Dark / Inverse (Gelap)**, **High Contrast** (latar hitam pekat dengan teks putih/kuning kontras tinggi untuk fokus maksimal), dan **Sepia (Krem Mushaf)**.
- **FR-05.3 (Tipografi & Jarak Baris):** Pengguna dapat memilih jenis font Arab (pilihan: **Amiri Quran** (Mushaf Standar), **Amiri**, **LPMQ**, dan **Scheherazade New**) serta mengatur jarak antar baris (*line spacing*) agar harakat tetap jelas terbaca tanpa bertumpuk.
- **FR-05.4 (Fokus Ayat & Auto-Scroll):** Sistem menyediakan opsi **Ayat Spotlight** (menyorot ayat aktif dan meredupkan ayat sekitarnya agar tidak salah baris) serta fitur **Auto-Scroll** lambat dengan kecepatan yang dapat diatur.
- **FR-05.5 (Pintasan Keyboard Desktop):** Pada perangkat desktop, pengguna dapat menggunakan pintasan keyboard (seperti `F` untuk *Fullscreen*, `+`/`-` untuk ukuran font, dan panah kiri/kanan untuk pindah bagian).
- **FR-05.6:** Seluruh preferensi tersimpan otomatis di `localStorage` sehingga tetap berlaku saat aplikasi dibuka kembali.

### FR-06: Modul Pencarian Cepat
- **FR-06.1:** Pengguna dapat mencari surat berdasarkan nama Latin atau nomor surat.
- **FR-06.2:** Pengguna dapat langsung menuju Juz (1–30) atau 'Ain tertentu melalui kolom pencarian/filter.
- **FR-06.3 (Opsional Fase 1/2):** Pengguna dapat mencari kata kunci di dalam teks terjemahan Bahasa Indonesia.

### FR-07: Modul Waktu Aktual & Jadwal Shalat *(Fitur Pelengkap - Fase 2)*
- **FR-07.1:** Sistem menampilkan jam aktual (*real-time*) sesuai zona waktu lokal pengguna secara ringkas pada header (Desktop) atau panel atas/menu (Mobile).
- **FR-07.2:** Sistem menampilkan informasi **waktu shalat berikutnya** beserta hitung mundur (*countdown*), serta detail 5 waktu shalat wajib (Subuh, Dzuhur, Ashar, Maghrib, Isya) saat widget diklik.
- **FR-07.3:** Pengguna dapat memilih lokasi secara manual (daftar kota) atau menggunakan deteksi lokasi GPS browser secara opsional (*tidak memunculkan popup izin lokasi secara otomatis saat pertama kali membuka web*).
- **FR-07.4:** Perhitungan jadwal shalat menggunakan standar kalkulasi yang relevan (default: **Kemenag RI**) dan tersimpan preferensi lokasinya di `localStorage`.
- **FR-07.5:** Saat pengguna mengaktifkan **Mode Layar Penuh (*Zen Mode*)** di Desktop, widget jam dan jadwal shalat ikut disembunyikan agar tidak mengganggu fokus tilawah.

### FR-08: Modul Tajwid Berwarna & Panduan Makhraj *(Fitur Edukasi Pemula)*
- **FR-08.1 (1-Klik Saklar Tajwid Berwarna):** Sistem menyediakan saklar pintas (*quick toggle pill*) langsung di bilah atas pembaca untuk mengaktifkan atau menonaktifkan pewarnaan hukum tajwid pada teks ayat secara instan.
- **FR-08.2 (Kompatibilitas Aksesibilitas):** Saat pengguna mengaktifkan **Mode High Contrast / Inverse** atau **Mode Lansia**, pewarnaan tajwid otomatis dinonaktifkan demi menjamin ketajaman kontras huruf.
- **FR-08.3 (Legenda Tajwid & 11 Kaidah):** Sistem menyediakan modal edukasi interaktif 3 tab yang menguraikan kaidah hukum tajwid lengkap dengan jumlah ketukan/harakat, huruf, penjelasan praktis, dan contoh ayat Al-Qur'an (Ghunnah, Ikhfa, Idgham, Iqlab, Qalqalah, Mad, Wasal/Syamsiyyah).
- **FR-08.4 (Panduan Makharijul Huruf & Tanda Waqaf):** Tab kedua menyajikan panduan detail 5 kawasan makhraj organ bicara (*Al-Jauf, Al-Halq, Al-Lisan, Asy-Syafatan, Al-Khaisyum*) dan tab ketiga menyajikan 7 jenis tanda waqaf (*Lazim, Aula, Ja'iz, Washlu Aula, Laa, Mu'anaqah, Saktah*).

### FR-09: Modul Audio Recitation / Murottal Mutakhir *(Step 7)*
- **FR-09.1 (Pilihan 5 Qari' Mu'tabar & Pemutaran):** Pengguna dapat memutar audio murottal dari 5 qari' (Syaikh Mishary Rashid Alafasy, Syaikh Mahmoud Khalil Al-Husary, Syaikh Muhammad Siddiq Al-Minshawi, Syaikh Abdurrahman As-Sudais, Syaikh Abu Bakr Asy-Syathiri).
- **FR-09.2 (Ayah-Sync Highlight & Auto-Scroll):** Saat audio diputar, sistem otomatis menyorot kartu ayat aktif dan menggulir layar secara mulus ke posisi ayat tersebut.
- **FR-09.3 (Kecepatan Putar / Playback Speed):** Tersedia pengatur kecepatan tempo bacaan: `0.75x` (belajar tartil pemula), `1.0x` (normal), `1.25x`, dan `1.5x` (tadarus).
- **FR-09.4 (Scrubber Linimasa & Volume):** Mini player dilengkapi slider pemutar waktu ayat (`mm:ss / mm:ss`), pengatur volume mandiri, dan tombol mute.
- **FR-09.5 (Pemutaran Berkelanjutan / Section Play):** Disediakan tombol aksi *"Dengarkan Surat / 'Ain Ini"* pada spanduk atas lembar baca untuk memutar seluruh ayat dalam surat/'Ain secara berurutan (*continuous playback*).
- **FR-09.6 (Mode Ulangi / Repeat):** Pengguna dapat memilih mode `1x` (normal), `Ulang Ayat` (tahfidz/hafalan), dan `Lanjut` (berurutan ke ayat berikutnya).

### FR-10: Modul Telemetri IP, Staging Database PostgreSQL & Popup Registrasi *(Step 5)*
- **FR-10.1 (Pencatatan Log IP Pembuka Aplikasi):** Saat aplikasi dimuat, backend secara otomatis mencatat alamat IP client, User-Agent, referer, dan waktu kunjungan ke tabel `visitor_logs`.
- **FR-10.2 (Pencatatan Log Kegiatan per IP):** Setiap aksi interaksi penting (membuka modal setting, mengubah ukuran font/line-height, mengaktifkan/menonaktifkan mode lansia, mengubah tema tampilan, memutar murottal, dll.) dicatat ke tabel `activity_logs` beserta IP address dan payload perubahannya.
- **FR-10.3 (Tabel Staging Sementara per IP):** Sistem mengelola tabel `temp_ip_settings` di PostgreSQL untuk mengisolasi hasil konfigurasi dan bookmark sementara berdasarkan IP address pengguna. Hal ini memastikan preferensi seorang pengunjung tidak berbenturan dengan pengunjung lain yang membuka dari IP berbeda.
- **FR-10.4 (Popup Ajakan Pendaftaran / CTA):** Saat pengguna melakukan aksi penyimpanan (misal menandai bookmark atau menyimpan catatan), sistem memunculkan popup ajakan:
  > *"Apakah Anda ingin bergabung dengan kami? Daftar sekarang"*
  Pengguna dapat memilih mendaftar atau melanjutkan membaca tanpa terganggu.

### FR-11: Portal Administrator & Dashboard Audit Trail (`/admin`) *(Step 8)*
- **FR-11.1 (Akses URL `/admin` & Otentikasi):** Rute `/admin` pada domain web yang sama mengarah ke portal login administrator dengan username dan password terotentikasi (Default demo: `admin` / `admin123`).
- **FR-11.2 (Dashboard Statistik & Chart Visual):** Menampilkan ringkasan metrik utama (Total Pembaca IP unik, Rata-rata durasi sesi baca, Total interaksi tercatat, Pendaftar baru), dilengkapi chart grafik batang geolokasi IP berdasarkan negara asal (Indonesia, Malaysia, Singapura, Arab Saudi, dll.) dan tren kunjungan harian.
- **FR-11.3 (Modul Audit Trail Penuh):** Menampilkan riwayat log aktivitas secara komprehensif dari database PostgreSQL, lengkap dengan filter jenis kegiatan, pencarian berbasis IP/kata kunci, grafik frekuensi aktivitas, serta tombol ekspor ke format JSON.
- **FR-11.4 (Konfigurasi Identitas Situs & Pengumuman):** Modul interaktif untuk mengubah nama aplikasi, logo/simbol kaligrafi, teks hak cipta (copyright), lisensi aplikasi, dan banner pengumuman (broadcast announcement) kepada seluruh pengguna.

### FR-12: Portal Pengguna & Dashboard Pribadi (`/user`) *(Step 8)*
- **FR-12.1 (Akses URL `/user` & Otentikasi Pengguna):** Rute `/user` menyediakan antarmuka login dan registrasi anggota dengan contoh kredensial demo (Username: `fulan` atau `user@quranweb.id`, Password: `user123`).
- **FR-12.2 (Dashboard Card Bookmark Pribadi):** Menampilkan kartu-kartu ayat yang ditandai oleh pengguna beserta nama surat, nomor ayat, 'Ain, catatan tadabbur pribadi, dan tombol 1-klik untuk langsung membuka ayat di lembar baca.
- **FR-12.3 (Hasil Pencarian yang Diarsipkan):** Menyediakan fitur arsip kata kunci dan tema pencarian (misal: "sabar", "surga", "rezeki") lengkap dengan catatan konteks, jumlah temuan ayat, dan pintasan 1-klik untuk membuka hasil pencarian tersebut di Al-Qur'an.
- **FR-12.4 (Sinkronisasi Tilawah & Terakhir Dibaca):** Menyimpan posisi terakhir dibaca secara persisten dan menyinkronkan preferensi bacaan lintas perangkat.

---

## 5. Spesifikasi Non-Fungsional (Non-Functional Requirements)

| Kategori | Spesifikasi |
| :--- | :--- |
| **Performa** | Waktu muat awal (*initial load*) cepat (< 2 detik pada koneksi standar); perpindahan antar Surat/Juz/'Ain terasa instan karena data statis. |
| **Responsivitas** | Tampilan tetap rapi dan proporsional dari layar mobile kecil (lebar 320px–375px) hingga layar desktop besar (1920px+ / 4K). |
| **Tipografi & RTL** | Teks Arab menggunakan `direction: rtl` dengan `line-height` minimal `2.0` agar harakat tidak bertumpuk di semua OS (Android, iOS, macOS, Windows), termasuk saat ukuran font diperbesar hingga skala lansia. |
| **Aksesibilitas** | Mendukung kontras warna standar WCAG (termasuk mode *High Contrast / Inverse*), label `aria-label` pada kontrol utama, dan navigasi keyboard di desktop. |
| **Privasi & Keamanan** | Tidak mengumpulkan data pribadi pengguna karena tidak ada proses login maupun penyimpanan di server. |
| **Ketersediaan Offline** | Siap dikembangkan menjadi PWA (*Progressive Web App*) agar dapat dibuka tanpa internet setelah kunjungan pertama. |
| **Port & Kontainerisasi** | Aplikasi dapat dijalankan melalui Docker container (Nginx Alpine) yang mengekspos port `3382` secara default. |

---

## 6. Batasan & Asumsi (Constraints & Assumptions)

1. Tidak ada fitur sosial, komentar, atau manajemen akun pengguna pada versi awal.
2. Data *Bookmark* dan *Last Read* bergantung pada penyimpanan browser perangkat masing-masing (jika *clear browser data* dilakukan, data lokal akan terhapus, kecuali pengguna melakukan ekspor atau menyimpan tautan).
3. Penomoran **'Ain (Ruku')** mengacu pada satu standar mushaf yang konsisten (misal standar Mushaf Utsmani/Kemenag) yang ditetapkan pada tahap kurasi dataset.
4. Data **Tajwid Berwarna** wajib berasal dari dataset/API yang telah terverifikasi (seperti `text_uthmani_tajweed`), bukan hasil deteksi aturan teks manual yang belum tervalidasi.

---

## 7. Status Implementasi & Keterkaitan Dokumen

Seluruh kebutuhan fungsional Fase 1 telah berhasil diimplementasikan, dan fondasi konseptual Fase 2 telah dirumuskan secara terstruktur:
- **Dokumen Perencanaan Arsitektur Fase 1:** [MasterPlan.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/MasterPlan.md)
- **Cetak Biru Ekosistem & Brainstorming Fase 2:** [MasterPlan-2.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/MasterPlan-2.md) (Modul Kisah 25 Rasul, Jurnal Blog, Standarisasi Akun RBAC, Logout Halaman Depan, Rencana Khatam 'Ain, Doa & Tasbih Haptic, Kompas Kiblat, dan Peta Masjid OpenStreetMap)
- **Spesifikasi Teknis & Kode:** [TSD.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Document/TSD.md)
- **Urutan Tahapan Fase 1 (Selesai):** [DEV_STEP.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/DEV_STEP.md) (Step 1 s.d. Step 8 telah berstatus **Selesai**)
- **Urutan Tahapan Fase 2 (Ready to Develop):** [DEV_STEP_2.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/DEV_STEP_2.md) (Panduan eksekusi bertahap Step 9 s.d. Step 17)
- **Buku Panduan Pengguna:** [USER_MANUAL.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Document/USER_MANUAL.md) (15 bab komprehensif, mencakup panduan baca, audio, jadwal shalat, serta portal `/admin` dan `/user`)
- **Kontainerisasi Deployment:** [Dockerfile](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Dockerfile) & [docker-compose.yml](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/docker-compose.yml) pada port `3382`.

