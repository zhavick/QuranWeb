# Panduan Pengguna (User Manual): Quran Web

Selamat datang di **Quran Web**, aplikasi Al-Qur'an digital yang dirancang sederhana, cepat, bebas distraksi, dan nyaman digunakan oleh seluruh umat Islam—mulai dari pemula, santri, hingga orang tua/lansia.

Aplikasi ini memiliki keunggulan navigasi berdasarkan **Surat**, **Juz**, dan **'Ain (Ruku')**, serta adaptif antara **Mode Layar Penuh di Desktop** dan **Proporsional di Perangkat Mobile**.

---

## Daftar Isi
1. [Cara Membuka & Menjalankan Aplikasi](#1-cara-membuka--menjalankan-aplikasi)
2. [Navigasi Al-Qur'an (Surat, Juz, dan 'Ain)](#2-navigasi-al-quran-surat-juz-dan-ain)
3. [Pengalaman Tampilan (Desktop Fullscreen vs Mobile)](#3-pengalaman-tampilan-desktop-fullscreen-vs-mobile)
4. [Fitur Aksesibilitas & Mode Lansia](#4-fitur-aksesibilitas--mode-lansia)
5. [Pengaturan Tema & Inverse Color](#5-pengaturan-tema--inverse-color)
6. [Penanda Bacaan (Last Read & Bookmark)](#6-penanda-bacaan-last-read--bookmark)
7. [Tajwid Berwarna, Panduan Makhraj & Tanda Waqaf](#7-tajwid-berwarna-panduan-makhraj--tanda-waqaf)
8. [Audio Murottal & Sinkronisasi Ayat (Ayah-Sync)](#8-audio-murottal--sinkronisasi-ayat-ayah-sync)
9. [Jam Digital & Jadwal Shalat Kemenag RI](#9-jam-digital--jadwal-shalat-kemenag-ri)
10. [Mode Offline & Instalasi PWA](#10-mode-offline--instalasi-pwa)
11. [Daftar Pintasan Keyboard (Desktop)](#11-daftar-pintasan-keyboard-desktop)
12. [Integrasi Database PostgreSQL, Staging per IP & Ajakan Bergabung](#12-integrasi-database-postgresql-staging-per-ip--ajakan-bergabung)
13. [Portal Administrator (/admin)](#13-portal-administrator-admin)
14. [Portal Pengguna & Anggota (/user)](#14-portal-pengguna--anggota-user)
15. [Pertanyaan yang Sering Diajukan (FAQ)](#15-pertanyaan-yang-sering-diajukan-faq)

---

## 1. Cara Membuka & Menjalankan Aplikasi

### A. Menggunakan Web Browser (Pengembangan / Lokal)
1. Buka terminal di folder proyek.
2. Jalankan perintah:
   ```bash
   npm run dev
   ```
3. Buka peramban (Chrome, Edge, Safari, Firefox) pada alamat `http://localhost:5173`.

### B. Menggunakan Docker Container (Port 3382)
Aplikasi telah dilengkapi kontainer mandiri berbasis Nginx Alpine pada port **3382**:
1. Jalankan perintah Docker Compose:
   ```bash
   docker compose up -d --build
   ```
2. Buka peramban pada alamat:
   ```text
   http://localhost:3382
   ```
3. Untuk menghentikan container:
   ```bash
   docker compose down
   ```

---

## 2. Navigasi Al-Qur'an (Surat, Juz, dan 'Ain)

Quran Web menyediakan 3 metode navigasi utama yang dapat diakses melalui panel navigasi di sebelah kiri (pada Desktop) atau tombol menu bawah (pada Mobile):

1. **Tab Surat (114 Surat):**
   - Menampilkan daftar surat lengkap dari Surat Al-Fatihah hingga Surat An-Nas.
   - Dilengkapi nomor surat, nama Arab, transliterasi Latin, arti nama, dan jumlah ayat.
2. **Tab Juz (30 Juz):**
   - Memudahkan Anda yang memiliki target tilawah harian (One Day One Juz).
   - Menampilkan rentang surat dan ayat awal hingga akhir untuk masing-masing juz.
3. **Tab 'Ain / Ruku' (556 'Ain):**
   - Pembagian Al-Qur'an berdasarkan kesatuan topik/paragraf pembahasan.
   - Dilengkapi **Filter Surat**: Anda dapat memilih surat tertentu (misal: Surat Al-Baqarah) untuk langsung menampilkan seluruh 'Ain pada surat tersebut tanpa harus menggulir 556 daftar 'Ain.
   - Pada teks ayat, batas akhir setiap 'Ain ditandai dengan ornamen huruf **ع** dan keterangan nomor 'Ain.
4. **Pencarian Cerdas (2 Mode):**
   - **Mode Nama & Nomor:** Cari surat berdasarkan nama Latin (misal: *"Yasin"*, *"Kahf"*), nomor surat (misal: *"36"*), maupun nomor juz/'Ain.
   - **Mode Kata Kunci Terjemahan:** Cari kata atau tema apa pun di seluruh **6.236 ayat terjemahan** (misal: ketik *"puasa"*, *"rezeki"*, *"orang tua"*). Hasil pencarian akan muncul instan lengkap dengan nama surat, nomor ayat, dan cuplikan terjemahan.
5. **Lompat Cepat ke Ayat:**
   - Di bagian atas area baca saat membuka surat, masukkan nomor ayat pada kolom **"Lompat ke ayat:"** lalu tekan Enter atau tombol **"Go"** untuk melompat seketika ke ayat yang dituju.
6. **Tombol Alih Mode Cepat (Pills Switcher):**
   - Di area baca terdapat tombol alih cepat **[ Surat ] [ Juz ] [ 'Ain ]** yang memudahkan Anda berpindah sudut pandang membaca dengan satu sentuhan.

---

## 3. Pengalaman Tampilan (Desktop Fullscreen vs Mobile)

### A. Tampilan Desktop
- **Tata Letak Split-View:** Panel navigasi berada di sisi kiri dan area membaca Al-Qur'an berada di sisi kanan.
- **Mode Layar Penuh (*Fullscreen / Zen Mode*):**
  - Klik tombol **"Layar Penuh"** di header atas (atau tekan tombol huruf **`F`** pada keyboard).
  - Layar akan masuk ke mode penuh 100%, header dan sidebar otomatis disembunyikan untuk memberikan suasana tilawah yang hening tanpa distraksi.
  - Untuk keluar dari mode layar penuh, klik tombol melayang **"Keluar Layar Penuh"** di pojok kanan atas atau tekan tombol **`Esc`**.

### B. Tampilan Mobile Device (Smartphone / Tablet)
- **Desain Proporsional (100% Lebar Layar):** Teks Arab dan terjemahan otomatis menyesuaikan lebar layar ponsel tanpa ada geser horizontal (*no horizontal scroll*).
- **Aman untuk Notch & Navigasi Ponsel:** Memanfaatkan area aman (*safe-area-inset*) sehingga teks tidak tertutup poni layar atau bilah navigasi ponsel.
- **Bottom Navigation Bar:** Di bagian bawah layar ponsel terdapat menu cepat: **Surat**, **Juz**, **'Ain**, dan **Simpan (Bookmark)** yang membuka laci navigasi dari bawah (*slide-over drawer*).

---

## 4. Fitur Aksesibilitas & Mode Lansia

Bagi orang tua, lansia, atau pembaca yang memiliki keterbatasan penglihatan (*low vision*):

1. **Mode Lansia (1-Klik Aktif):**
   - Buka menu **Pengaturan** (ikon gerigi `⚙`).
   - Tekan tombol **"Aktifkan"** pada kartu **Mode Lansia (1-Klik)**.
   - Seketika ukuran font Arab membesar ke skala ekstra nyaman (`42px`), jarak baris dilonggarkan (`line-height: 2.5`), kontras dinaikkan ke tingkat maksimal, dan tombol navigasi diperbesar agar mudah disentuh.
2. **Pengaturan Ukuran Font Kustom:**
   - Anda dapat menggeser slider **Ukuran Huruf Arab** (mulai dari `20px` hingga `52px`).
   - Slider **Ukuran Terjemahan** (mulai dari `14px` hingga `26px`).
   - Slider **Jarak Antar Baris (Line Height)** agar harakat fathah, kasrah, dan tasydid tidak saling bertabrakan.
3. **Pilihan Font Arab:**
   - **Amiri Quran:** Font bergaya mushaf resmi dengan harakat dan ligatur kaligrafi yang sangat indah.
   - **LPMQ:** Standar Mushaf Kementerian Agama RI.
   - **Scheherazade New:** Font Naskh modern yang sangat jelas dan mudah dibaca.
4. **Fokus 1 Ayat (*Ayat Spotlight*):**
   - Aktifkan fitur ini di pengaturan jika Anda sering salah baris saat membaca.
   - Klik pada salah satu ayat: ayat tersebut akan tetap terang benderang, sementara ayat-ayat lain di atas dan bawahnya akan sedikit diredupkan.
5. **Auto-Scroll Lambat (*Hands-Free*):**
   - Pilih kecepatan **Lambat** atau **Sedang** pada menu pengaturan agar halaman Al-Qur'an menggulir sendiri ke bawah secara perlahan tanpa perlu disentuh.

---

## 5. Pengaturan Tema & Inverse Color

Quran Web menyediakan 4 palet warna yang dirancang khusus untuk kenyamanan mata:

1. **Terang (Light):** Latar belakang putih bersih dengan aksen hijau toska lembut, ideal untuk membaca di siang hari atau ruangan terang.
2. **Gelap (Dark / Inverse):** Latar belakang abu-abu gelap dengan teks terang, mengurangi radiasi silau layar ponsel saat malam hari.
3. **High Contrast:** Latar belakang **hitam pekat murni (`#000000`)** dengan teks **putih tajam (`#FFFFFF`)** dan aksen kuning keemasan. Memberikan rasio kontras tertinggi untuk fokus maksimal dan pengguna lansia.
4. **Sepia (Krem Mushaf):** Latar warna kertas mushaf kuno yang hangat, sangat nyaman di mata untuk tilawah dalam durasi berjam-jam.

---

## 6. Penanda Bacaan (Last Read & Bookmark)

1. **Lanjutkan Bacaan Terakhir (*Last Read*):**
   - Pada setiap ayat, terdapat tombol **Centang (`✓`)**. Klik tombol tersebut untuk menandai ayat tersebut sebagai bacaan terakhir Anda.
   - Setiap kali membuka web, kartu hijau **"Lanjutkan Bacaan"** akan muncul di bagian atas panel navigasi. Cukup klik kartu tersebut untuk langsung melompat ke ayat terakhir.
2. **Bookmark Ayat & Catatan Pribadi:**
   - Klik ikon **Bookmark** pada ayat yang ingin disimpan sebagai catatan atau pengingat tilawah.
   - Semua ayat tersimpan dapat dilihat pada tab **"Simpan"** di panel navigasi.
   - **Tambah / Edit Catatan:** Tekan ikon pensil (`✎`) pada kartu bookmark untuk menulis catatan pribadi (misal: *"Ayat tentang sabar"*, *"Hafalan pekan ini"*).
   - **Hapus Bookmark Langsung:** Tekan ikon tempat sampah merah (`🗑`) untuk menghapus bookmark tertentu.
3. **Salin Tautan Ayat & Sinkronisasi URL:**
   - Klik ikon **Bagikan (`Share`)** pada ayat untuk menyalin URL langsung (misal: `http://localhost:3382/?surah=2&ayah=255`). Tautan ini dapat dikirim ke keluarga atau teman lewat WhatsApp.
   - Bilah alamat peramban (*URL bar*) juga otomatis menyinkronkan posisi Surat, Juz, atau 'Ain yang sedang Anda baca secara *real-time*.
4. **Cadangkan / Pindahkan Bookmark (Export & Import JSON):**
   - Di menu Pengaturan, gunakan tombol **"Export Bookmark"** untuk mengunduh file `.json`.
   - Gunakan tombol **"Import Bookmark"** untuk memulihkan bookmark di ponsel atau laptop lain tanpa perlu membuat akun.

---

## 7. Tajwid Berwarna, Panduan Makhraj & Tanda Waqaf

### 1-Klik Pintasan Tajwid Berwarna
- Anda dapat menyalakan atau mematikan tajwid berwarna langsung dari bilah atas lembar baca melalui tombol pintas **"Tajwid: Aktif / Mati"** tanpa harus membuka menu pengaturan.
- Teks ayat akan diwarnai sesuai dengan kaidah ilmu tajwid:
  - **Hijau:** Ghunnah & Ikhfa (bacaan dengung 2 harakat).
  - **Biru:** Qalqalah (pantulan huruf ق ط ب ج د).
  - **Ungu:** Idgham & Iqlab (peleburan bunyi huruf & perubahan ke mim).
  - **Merah / Oranye:** Mad (panjang bacaan 2, 4–5, hingga 6 harakat).
  - **Abu-abu:** Huruf yang tidak dilafalkan (Hamzatul Wasl / Lam Syamsiyah).
- *Catatan Keterbacaan:* Pewarnaan tajwid otomatis dinonaktifkan saat **Mode High Contrast** atau **Mode Lansia** aktif untuk menjaga ketajaman kontras tulisan bagi mata.

### Panduan Edukasi Lengkap (Tajwid, Makhraj & Waqaf)
- Klik tombol **"Panduan Tajwid"** atau ikon **Topi Toga (`🎓`)** di bilah atas untuk membuka modal edukasi interaktif 3 tab:
  1. **Tab Warna Tajwid:** Memuat 11 kaidah hukum tajwid lengkap dengan jumlah harakat, huruf, penjelasan cara baca praktis, serta contoh ayat Al-Qur'an dan transliterasinya. Dilengkapi pencarian instan.
  2. **Tab Makharijul Huruf:** Penjelasan detail 5 kawasan utama keluarnya huruf (*Al-Jauf, Al-Halq, Al-Lisan, Asy-Syafatan, Al-Khaisyum*) beserta tips membedakan huruf mirip bagi lidah orang Indonesia (misal: 'Ain vs Hamzah, Dhad vs Zhal).
  3. **Tab Tanda Waqaf & Ibtida':** Memahami tanda waqaf mushaf (*Lazim, Aula, Ja'iz, Washlu Aula, Laa, Mu'anaqah, Saktah*) agar berhenti dan menyambung bacaan sesuai kaidah.

---

## 8. Audio Murottal & Sinkronisasi Ayat (Ayah-Sync)

1. **Memutar Audio Ayat & Seluruh Surat:**
   - **Putar Per Ayat:** Klik tombol **Putar (`▶`)** pada kartu nomor ayat mana pun.
   - **Putar Seluruh Bagian:** Klik tombol **"Dengarkan Surat / 'Ain Ini"** pada spanduk atas lembar baca untuk mendengarkan bacaan berurutan secara otomatis.
2. **Pilihan 5 Qari' Mu'tabar:**
   - Melalui menu dropdown pada pemutar mini (*Mini Player*), Anda dapat memilih qari':
     - **Syaikh Mishary Rashid Alafasy** (bacaan merdu, fasih, dan tartil).
     - **Syaikh Mahmoud Khalil Al-Husary** (standar mujawwad/tartil rujukan dunia untuk belajar tajwid & makhraj).
     - **Syaikh Muhammad Siddiq Al-Minshawi** (bacaan khusyuk, jernih, dan menyentuh hati).
     - **Syaikh Abdurrahman As-Sudais** (Imam Masjidil Haram, tempo mantap dan bertenaga).
     - **Syaikh Abu Bakr Asy-Syathiri** (bacaan tartil mendalam dan menyejukkan).
3. **Pengatur Kecepatan Bacaan (Playback Speed):**
   - Tekan tombol speedometer kecepatan untuk memilih:
     - **0.75x:** Tempo lambat (sangat ideal bagi pemula yang sedang menirukan makhraj & tajwid).
     - **1.0x:** Kecepatan normal tartil.
     - **1.25x / 1.5x:** Kecepatan tadarus / muraja'ah hafalan.
4. **Bilah Linimasa & Pengatur Volume:**
   - Geser *progress scrubber* untuk melompat maju atau mundur dalam ayat yang sedang diputar.
   - Terdapat penunjuk durasi aktual (`mm:ss / mm:ss`) dan tombol mute/slider volume mandiri.
5. **Sorotan Sinkronisasi (*Ayah-Sync Highlight*) & Auto-Scroll:**
   - Saat audio qari' melafalkan suatu ayat, kartu ayat tersebut otomatis disorot dengan warna aksen dan layar menggulir secara mulus ke posisi ayat aktif.
6. **Mode Ulangi (Repeat / Loop):**
   - **1x:** Berhenti setelah ayat selesai.
   - **Ulang Ayat:** Terus mengulang 1 ayat yang sama (sangat cocok untuk menghafal ayat).
   - **Lanjut:** Otomatis memutar berurutan ke ayat-ayat berikutnya hingga akhir surat.

---

## 9. Jam Digital & Jadwal Shalat Kemenag RI

Di bagian header atas, terdapat indikator jam digital aktual (*real-time*) beserta nama dan waktu shalat berikutnya lengkap dengan hitung mundur (*countdown*).

1. **Jadwal 5 Waktu Shalat + Imsak & Terbit (Syuruq):**
   - Klik pada widget jam untuk membuka modal detail: menampilkan waktu **Imsak**, **Subuh**, **Terbit (Syuruq)**, **Dzuhur**, **Ashar**, **Maghrib**, dan **Isya**.
   - Waktu shalat yang sedang aktif disorot dengan warna aksen, dan jika waktu shalat tinggal 10 menit lagi, widget akan menampilkan animasi lonceng pengingat (*imminent reminder*).
2. **Pilihan 45+ Kota Seluruh Indonesia & Tanah Suci:**
   - Dropdown kota dikelompokkan rapi per pulau/wilayah:
     - **Jawa & Banten:** Jakarta, Bandung, Bekasi, Bogor, Depok, Tangerang, Serang, Semarang, Solo, Yogyakarta, Surabaya, Malang.
     - **Sumatera:** Banda Aceh, Medan, Padang, Pekanbaru, Batam, Jambi, Palembang, Bengkulu, Bandar Lampung, Pangkal Pinang.
     - **Kalimantan:** Pontianak, Palangka Raya, Banjarmasin, Samarinda, Balikpapan, Tarakan.
     - **Sulawesi:** Makassar, Manado, Palu, Kendari, Gorontalo, Mamuju.
     - **Bali & Nusa Tenggara:** Denpasar, Mataram (Lombok), Kupang.
     - **Maluku & Papua:** Ambon, Ternate, Jayapura, Sorong, Manokwari, Merauke.
     - **Tanah Suci:** Makkah Al-Mukarramah, Madinah Al-Munawwarah.
3. **Deteksi Lokasi GPS Otomatis:**
   - Cukup klik tombol **"GPS"** untuk mendeteksi koordinat lintang dan bujur lokasi Anda secara instan dan akurat.
   - Aplikasi tidak pernah memunculkan popup izin lokasi secara paksa. Deteksi GPS hanya berjalan jika Anda menekan tombol GPS secara sadar.
4. **Formula Resmi Kemenag RI & Pengaman Ihtiyat:**
   - Menggunakan parameter hisab resmi Kementerian Agama RI (sudut Subuh 20°, sudut Isya 18°, Madzhab Syafi'i) dengan penambahan **+2 menit Ihtiyat pengaman** agar waktu shalat tidak mendahului jadwal resmi masjid/Kemenag.
5. **Anti-Distraksi di Layar Penuh (Zen Mode):**
   - Saat Anda mengaktifkan **Mode Layar Penuh (`F`)**, widget jadwal shalat otomatis disembunyikan agar Anda 100% fokus tilawah Al-Qur'an tanpa distraksi visual.

---

## 10. Mode Offline & Instalasi PWA

Quran Web adalah aplikasi **Progressive Web App (PWA)** yang dapat bekerja tanpa jaringan internet:

1. **Menyimpan Seluruh Surat Secara Offline:**
   - Buka menu **Pengaturan (`⚙`)**.
   - Klik tombol **"Simpan Semua 114 Surat Offline"**.
   - Aplikasi akan mengunduh seluruh 114 surat ke dalam memori browser (hanya berukuran ±3–5 MB).
   - Setelah selesai, Anda dapat mematikan koneksi internet (Wi-Fi/Data) dan seluruh Al-Qur'an tetap dapat dibaca secara lancar!
2. **Instalasi ke Layar Utama (Add to Home Screen):**
   - **Di Android (Chrome):** Tekan tombol titik tiga di browser, lalu pilih *"Tambahkan ke Layar Utama"* atau *"Instal Aplikasi"*.
   - **Di iPhone / iPad (Safari):** Tekan tombol Bagikan (*Share icon*), gulir ke bawah, lalu pilih *"Tambah ke Layar Utama (Add to Home Screen)"*.
   - **Di Laptop (Chrome / Edge):** Klik ikon instal di bilah alamat browser di sebelah kanan. Aplikasi akan terbuka seperti aplikasi komputer native tanpa bingkai browser.

---

## 11. Daftar Pintasan Keyboard (Desktop)

Untuk pengguna komputer/laptop, Anda dapat menavigasi aplikasi dengan cepat menggunakan keyboard:

| Tombol | Fungsi |
| :--- | :--- |
| **`F`** | Menyalakan / Mematikan Mode Layar Penuh (*Fullscreen Zen Mode*) |
| **`+`** atau **`=`** | Memperbesar ukuran teks Arab (+2px) |
| **`-`** | Memperkecil ukuran teks Arab (-2px) |
| **`Arrow Left (←)`** | Pindah ke Surat / Juz / 'Ain sebelumnya |
| **`Arrow Right (→)`** | Pindah ke Surat / Juz / 'Ain berikutnya |
| **`Esc`** | Keluar dari Mode Layar Penuh atau menutup modal pengaturan |

---

## 12. Integrasi Database PostgreSQL, Staging per IP & Ajakan Bergabung

Aplikasi Quran Web kini dilengkapi sistem database **PostgreSQL** yang bekerja di latar belakang untuk memberikan kenyamanan ekstra:

1. **Pencatatan Log Akses & Aktivitas per IP Address:**
   - Sistem mencatat alamat IP pengunjung saat membuka aplikasi (`visitor_logs`) dan aktivitas pengaturan (`activity_logs`).
   - Hal ini memungkinkan pengelola memantau penggunaan aplikasi, performa server, dan preferensi populer (seperti penggunaan mode lansia dan tema gelap).
2. **Penyimpanan Pengaturan Sementara per IP (`temp_ip_settings`):**
   - Hasil pengaturan Anda (seperti mode lansia, pilihan tema, ukuran font, dan daftar bookmark) secara otomatis disinkronkan ke database pada tabel khusus yang diisolasi berdasarkan IP address perangkat Anda.
   - Hal ini menjamin konfigurasi Anda **tidak akan berbenturan** dengan pengaturan pengunjung lain yang mengakses dari jaringan berbeda.
3. **Popup Ajakan Bergabung: *"Apakah Anda ingin bergabung dengan kami? Daftar sekarang"***
   - Ketika Anda melakukan aksi penyimpanan (misal: menandai bookmark atau menekan tombol *"Simpan & Sinkronkan Pengaturan ke Database"* di menu Pengaturan), sistem akan menampilkan popup ramah:
     > **"Apakah Anda ingin bergabung dengan kami? Daftar sekarang"**
   - Anda dapat memasukkan email untuk mendaftarkan akun agar seluruh riwayat bacaan, hafalan, dan bookmark dapat disinkronkan secara permanen lintas perangkat (laptop, ponsel, tablet).
   - Jika Anda hanya ingin membaca santai, cukup pilih tombol **"Nanti Saja"** dan aplikasi tetap dapat digunakan secara penuh tanpa hambatan.

---

## 13. Portal Administrator (`/admin`)

Untuk pengelola dan administrator sistem, QuranWeb menyediakan portal khusus pada rute `/admin` pada domain web yang sama:

1. **Akses & Kredensial Administrator:**
   - **URL:** `http://localhost:3382/admin` (atau klik tombol *"Portal Admin"* di dalam menu Pengaturan).
   - **Username:** `admin` (atau `admin@quranweb.id`)
   - **Password:** `admin123`
   - *Catatan:* Tersedia tombol 1-klik *"Gunakan Otomatis"* pada layar login untuk mengisi kredensial secara cepat.
2. **Dashboard Statistik & Chart Penggunaan:**
   - **Metrik Utama:** Total pembaca unik (IP), rata-rata durasi sesi tilawah (menit), total interaksi/aktivitas, dan jumlah pendaftar baru (*leads*).
   - **Chart Geolokasi IP:** Visualisasi sebaran pembaca berdasarkan negara asal (Indonesia, Malaysia, Singapura, Arab Saudi, dll.).
   - **Chart Tren Mingguan:** Grafik batang intensitas pembaca harian dari Senin sampai Minggu (menampilkan lonjakan tilawah pada hari Jum'at).
3. **Modul Audit Trail Penuh:**
   - Menampilkan seluruh rekaman log aktivitas pengguna dari database PostgreSQL secara lengkap (ID, Waktu, Alamat IP, Jenis Kegiatan, dan Detail Payload seperti Surat/Ayat/Setting).
   - Dilengkapi filter kategori aktivitas (*READ_SURAH, PLAY_AUDIO, TOGGLE_TAJWEED, ADD_BOOKMARK, ELDER_MODE, dll.*), pencarian instan berbasis IP/kata kunci, serta tombol **Ekspor JSON**.
4. **Modul Konfigurasi Situs & Pengumuman:**
   - Mengubah nama aplikasi secara dinamis (default: `QuranWeb`).
   - Mengubah logo/simbol kaligrafi aplikasi (default: `ق`).
   - Mengubah teks hak cipta (*copyright*) dan lisensi aplikasi (*Open Waqf License / MIT*).
   - Mengirim pesan pengumuman (*broadcast banner*) kepada seluruh pembaca Al-Qur'an secara langsung.

---

## 14. Portal Pengguna & Anggota (`/user`)

Untuk pembaca yang ingin menikmati pengalaman tilawah yang terpersonalisasi, QuranWeb menyediakan portal akun anggota pada rute `/user`:

1. **Akses & Kredensial Pengguna Demo:**
   - **URL:** `http://localhost:3382/user` (atau klik ikon pengguna `👤` pada bilah atas atau di menu Pengaturan).
   - **Username:** `fulan` (atau `user@quranweb.id`)
   - **Password:** `user123`
   - *Catatan:* Tersedia tombol 1-klik *"Gunakan Otomatis"* pada formulir login untuk masuk langsung tanpa repot mengetik.
2. **Dashboard Bookmark Pribadi (Card Bookmark):**
   - Menampilkan koleksi ayat yang Anda tandai dalam format kartu modern.
   - Setiap kartu memuat nama surat, nomor ayat, nomor 'Ain, catatan tadabbur pribadi, serta tanggal penyimpanan.
   - Klik tombol **"Baca"** untuk langsung melompat ke lembar baca Al-Qur'an pada posisi ayat tersebut.
3. **Hasil Pencarian yang Diarsipkan (Search Archive):**
   - Anda dapat menyimpan kata kunci dan tema pencarian terjemahan penting (misal: *"sabar dan shalat"*, *"surga firdaus"*, *"rezeki yang berkah"*) lengkap dengan catatan kontekstual.
   - Klik tombol **"Buka Hasil"** untuk langsung mencari ayat-ayat terkait di Al-Qur'an dengan 1 klik.
4. **Sinkronisasi Lintas Perangkat:**
   - Posisi bacaan terakhir (*last read*) dan pengaturan preferensi tersimpan di cloud database sehingga Anda dapat melanjutkan tilawah di komputer maupun ponsel pintar secara konsisten.

---

## 15. Pertanyaan yang Sering Diajukan (FAQ)

**Q: Apakah saya perlu mendaftar atau membuat akun?**  
*A:* Tidak perlu. Seluruh fitur membaca, bookmark, terakhir dibaca, dan pengaturan tersimpan aman di peramban perangkat Anda sendiri (*zero sign-up*).

**Q: Apakah data bookmark saya akan hilang jika saya menutup peramban?**  
*A:* Tidak. Bookmark dan posisi bacaan Anda disimpan secara permanen di memori lokal (*localStorage*) peramban. Namun jika Anda membersihkan riwayat peramban secara total (*Clear Browsing Data*), data dapat terhapus. Gunakan fitur **"Export Bookmark"** di menu Pengaturan secara berkala untuk mencadangkannya.

**Q: Mengapa mode tajwid berwarna tidak aktif saat saya menyalakan Mode Lansia?**  
*A:* Mode Lansia dan Mode High Contrast memprioritaskan ketajaman dan keterbacaan kontras huruf. Pewarnaan warna-warni dapat menurunkan tingkat kontras huruf bagi mata lansia, sehingga sistem secara otomatis menonaktifkan tajwid berwarna demi kenyamanan membaca yang optimal.

**Q: Bagaimana jika koneksi internet saya mati di tengah perjalanan?**  
*A:* Jika Anda sudah melakukan instalasi PWA atau menekan tombol *"Simpan Semua 114 Surat Offline"*, seluruh teks Al-Qur'an, terjemahan, bookmark, dan perhitungan jadwal shalat akan tetap berjalan 100% normal tanpa membutuhkan internet sama sekali.

