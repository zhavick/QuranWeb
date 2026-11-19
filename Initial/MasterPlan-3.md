# Master Plan 3 & Brainstorming: Ekosistem Al-Qur'an Masa Depan, Tahfidz, Amalan Harian, Keluarga & Aksesibilitas Suara
## Rencana Strategis Pengembangan Tahap 3 QuranWeb: Menuju Ekosistem Ibadah, Edukasi, dan Kehidupan Muslim yang Paripurna

* **Nama Dokumen:** MasterPlan-3.md
* **Versi Dokumen:** 3.0.0 (Strategic Conceptual Blueprint)
* **Status Dokumen:** Perencanaan Strategis & Brainstorming Arsitektur Tahap 3
* **Tanggal Penyusunan:** 19 November 2026
* **Penulis / Arsitek:** Tim Pengembang & Tim Desain QuranWeb
* **Basis Kesinambungan:** 
  - [MasterPlan.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/MasterPlan.md) (Fase 1: Mushaf Inti, 3 Dimensi Navigasi, Desain Lansia)
  - [MasterPlan-2.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Initial/MasterPlan-2.md) (Fase 2: Sirah Nabawi, Blog, Doa, Kiblat, Peta Masjid, Asmaul Husna, Tasbih Digital)
  - [FSD.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Document/FSD.md) & [TSD.md](file:///c:/TEMP/VSCODE/QuranWeb/QuranWeb/Document/TSD.md) (Spesifikasi Fungsional & Teknis v2.2.0)
* **Kategori:** Al-Qur'an Mastery, Tahfidz, Kalender Hijriah, Fiqih Ibadah, Hadits Arba'in, Syiar Keluarga, dan Voice Accessibility
* **Target Pengguna:** Seluruh Lapisan Umat Islam (Anak-anak, Santri, Orang Dewasa, Lansia, Pengajar Al-Qur'an, dan Keluarga Muslim)

---

## DAFTAR ISI

- [BAB 1: PENDAHULUAN & ARAH STRATEGIS TAHAP 3](#bab-1-pendahuluan--arah-strategis-tahap-3)
  - [1.1 Kilas Balik Pencapaian Tahap 1 & Tahap 2](#11-kilas-balik-pencapaian-tahap-1--tahap-2)
  - [1.2 Visi & Filosofi Pengembangan Tahap 3](#12-visi--filosofi-pengembangan-tahap-3)
  - [1.3 Lima Pilar Transformasi Strategis](#13-lima-pilar-transformasi-strategis)
- [BAB 2: PILAR I - PENDALAMAN AL-QUR'AN & HAFALAN MANDIRI (AL-QUR'AN MASTERY)](#bab-2-pilar-i---pendalaman-al-quran--hafalan-mandiri-al-quran-mastery)
  - [2.1 Fitur 1: Tafsir Ringkas Kemenag RI & Tafsir Tahlili per Ayat (`/tafsir`)](#21-fitur-1-tafsir-ringkas-kemenag-ri--tafsir-tahlili-per-ayat-tafsir)
  - [2.2 Fitur 2: Mode Uji Hafalan / Tahfidz Masker (*Blind/Hide Ayah Mode*)](#22-fitur-2-mode-uji-hafalan--tahfidz-masker-blindhide-ayah-mode)
  - [2.3 Fitur 3: Pengulang Murottal Hafalan (*Ayah Audio Looper / Repeat A-B*)](#23-fitur-3-pengulang-murottal-hafalan-ayah-audio-looper--repeat-a-b)
  - [2.4 Fitur 4: Perekam Suara Tilawah Mandiri (*Self-Voice Recorder & Makhraj Compare*)](#24-fitur-4-perekam-suara-tilawah-mandiri-self-voice-recorder--makhraj-compare)
- [BAB 3: PILAR II - IBADAH HARIAN & PRAKTIK SYIAR (DAILY ISLAMIC LIFE & SUNNAH)](#bab-3-pilar-ii---ibadah-harian--praktik-syiar-daily-islamic-life--sunnah)
  - [3.1 Fitur 5: Modul Kalender Hijriah & Pengingat Puasa Sunnah (`/kalender`)](#31-fitur-5-modul-kalender-hijriah--pengingat-puasa-sunnah-kalender)
  - [3.2 Fitur 6: Kumpulan Doa Sehari-hari (*Hisnul Muslim* / Benteng Muslim) (`/doa-harian`)](#32-fitur-6-kumpulan-doa-sehari-hari-hisnul-muslim--benteng-muslim-doa-harian)
  - [3.3 Fitur 7: Kalkulator Zakat Harta & Fitrah Ramah Lansia (`/zakat`)](#33-fitur-7-kalkulator-zakat-harta--fitrah-ramah-lansia-zakat)
  - [3.4 Fitur 8: Panduan Visual Tata Cara Shalat Wajib & Sunnah (`/panduan-shalat`)](#34-fitur-8-panduan-visual-tata-cara-shalat-wajib--sunnah-panduan-shalat)
- [BAB 4: PILAR III - KELUARGA, KEBERSIAMAAN & MEDIA SOSIAL (FAMILY & SOCIAL SYIAR)](#bab-4-pilar-iii---keluarga-kebersamaan--media-sosial-family--social-syiar)
  - [4.1 Fitur 9: Pembuat Kartu Kutipan Ayat Indah (*Ayah Poster Maker / Share to WhatsApp*)](#41-fitur-9-pembuat-kartu-kutipan-ayat-indah-ayah-poster-maker--share-to-whatsapp)
  - [4.2 Fitur 10: Lingkaran Khatam Bersama Keluarga (*Family Khatam Circle*)](#42-fitur-10-lingkaran-khatam-bersama-keluarga-family-khatam-circle)
  - [4.3 Fitur 11: Buku Catatan Amalan Harian (*Mutaba'ah Yaumiyah / Daily Habit Tracker*)](#43-fitur-11-buku-catatan-amalan-harian-mutabaah-yaumiyah--daily-habit-tracker)
- [BAB 5: PILAR IV - KHAZANAH HADITS NABAWI & FIQIH RINGKAS](#bab-5-pilar-iv---khazanah-hadits-nabawi--fiqih-ringkas)
  - [5.1 Fitur 12: Modul Hadits Arba'in An-Nawawiyah 42 Hadits Pokok (`/hadits`)](#51-fitur-12-modul-hadits-arbain-an-nawawiyah-42-hadits-pokok-hadits)
- [BAB 6: PILAR V - AKSESIBILITAS SUARA & AI BEBAS SENTUH (VOICE & TOUCHLESS NAVIGATION)](#bab-6-pilar-v---aksesibilitas-suara--ai-bebas-sentuh-voice--touchless-navigation)
  - [6.1 Fitur 13: Pencarian Ayat Melalui Suara (*Voice Search*)](#61-fitur-13-pencarian-ayat-melalui-suara-voice-search)
  - [6.2 Fitur 14: Pembalik Halaman Bebas Sentuh (*Hands-Free Page Turner*)](#62-fitur-14-pembalik-halaman-bebas-sentuh-hands-free-page-turner)
- [BAB 7: ARSITEKTUR TEKNIS, STRATEGI DATA & INTEGRASI LOGIKAL](#bab-7-arsitektur-teknis-strategi-data--integrasi-logikal)
  - [7.1 Desain Arsitektur Client-Side Heavy & Zero-Bloat](#71-desain-arsitektur-client-side-heavy--zero-bloat)
  - [7.2 Skema Penyimpanan Data Offline-First (PWA Precache v9)](#72-skema-penyimpanan-data-offline-first-pwa-precache-v9)
  - [7.3 Pemanfaatan Modern Web APIs (Canvas, MediaRecorder, SpeechRecognition)](#73-pemanfaatan-modern-web-apis-canvas-mediarecorder-speechrecognition)
- [BAB 8: MATRIKS PERBANDINGAN & ANALISIS NILAI TAMBAH](#bab-8-matriks-perbandingan--analisis-nilai-tambah)
- [BAB 9: ROADMAP EKSEKUSI TAHAP 3 (STEP 22 S.D. STEP 28)](#bab-9-roadmap-eksekusi-tahap-3-step-22-sd-step-28)
- [BAB 10: KESIMPULAN & KOMITMEN DIGITAL WAQAF](#bab-10-kesimpulan--komitmen-digital-waqaf)

---

## BAB 1: PENDAHULUAN & ARAH STRATEGIS TAHAP 3

### 1.1 Kilas Balik Pencapaian Tahap 1 & Tahap 2
Aplikasi **QuranWeb** telah melalui dua tahapan besar rekayasa perangkat lunak:
1. **Fase 1 (Step 1 s.d. 8):** Membangun fondasi tilawah digital mandiri dengan 114 Surat, 30 Juz, 556 'Ain tematik, 4 tema warna, mode lansia 1-klik (font 42px+, tap target 44px+), jadwal shalat offline Adhan.js, tajwid berwarna 11 kaidah, pemutar murottal 5 qari, portal admin/pengguna, dan kontainer Docker terpadu port 3382.
2. **Fase 2 (Step 9 s.d. 21):** Memperluas ekosistem spiritual mencakup 25 Kisah Nabi & Rasul terhubung mushaf, Jurnal Blog Tadabbur 5 pilar, Rencana Khatam Sakinah 'Ain, 40 Doa Rabbana, Kompas Kiblat adaptif, Peta Masjid OpenStreetMap dengan rute lansia, Asbabun Nuzul, Kamus Gharib, Audiobook 3 Menit, Pendaftaran Akun Jamaah (`/daftar`), Menu Navbar Strip 3, Splash Screen berornamen islami, Modul Asmaul Husna (99 nama Allah), dan Modul Tasbih Digital Card (Hitung Naik & Mundur).

### 1.2 Visi & Filosofi Pengembangan Tahap 3
Tahap 3 mentransformasi QuranWeb dari **"Aplikasi Pembaca Mushaf & Khazanah Sejarah"** menjadi **"Pusat Ekosistem Ibadah Harian, Pembelajaran Al-Qur'an Mandiri & Silaturahmi Keluarga Muslim"**.

Prinsip dasar yang tetap dipegang teguh:
- **Waqaf Digital Tanpa Iklan:** Tetap 100% bebas dari iklan komersial, banner pop-up, dan pelacak pihak ketiga yang merusak kekhusyukan tilawah.
- **Inklusivitas & Kelembutan Lansia:** Setiap fitur baru wajib memenuhi standar keramahan lansia (huruf besar, kontras WCAG AAA, antarmuka sederhana, dan tidak membebani memori kognitif).
- **Ketahanan Offline (Local-First):** Fitur-fitur vital dapat beroperasi secara mandiri tanpa ketergantungan koneksi internet aktif.

### 1.3 Lima Pilar Transformasi Strategis
Rencana Tahap 3 dikelompokkan ke dalam 5 pilar tematik:
1. **Pilar I:** Pendalaman Al-Qur'an & Hafalan Mandiri (*Al-Qur'an Mastery*)
2. **Pilar II:** Ibadah Harian & Praktik Syiar (*Daily Islamic Life & Sunnah*)
3. **Pilar III:** Keluarga, Kebersamaan & Media Sosial (*Family & Social Syiar*)
4. **Pilar IV:** Khazanah Hadits Nabawi & Fiqih Ringkas (*Prophetic Wisdom*)
5. **Pilar V:** Aksesibilitas Suara & AI Bebas Sentuh (*Voice & Touchless Navigation*)

---

## BAB 2: PILAR I - PENDALAMAN AL-QUR'AN & HAFALAN MANDIRI (AL-QUR'AN MASTERY)

### 2.1 Fitur 1: Tafsir Ringkas Kemenag RI & Tafsir Tahlili per Ayat (`/tafsir`)
* **Latar Belakang:** Saat ini aplikasi telah memiliki riwayat sebab turunnya ayat (*Asbabun Nuzul*) dan kamus kosakata sukar (*Gharibul Qur'an*). Namun, pemahaman komprehensif atas konteks ayat membutuhkan uraian tafsir yang terpercaya.
* **Konsep Desain:**
  - Setiap kartu ayat (`AyahCard`) dilengkapi tombol lencana baru berwarna safir **"Tafsir"**.
  - Mengklik tombol membuka modal telaah tafsir yang menyajikan dua tingkatan kedalaman:
    1. **Tafsir Ringkas / Wajiz Kemenag RI:** Uraian 1–2 paragraf ringkas yang mudah dipahami lansia dalam hitungan menit.
    2. **Tafsir Tahlili / Analitik:** Penjelasan ayat secara mendalam mencakup korelasi antarayat (*munasabah*), kandungan hukum fiqih, dan hikmah amaliah.
  - Dilengkapi kontrol ukuran huruf 3 tingkat (A, A+, A++) dan salin naskah tafsir ke clipboard.

### 2.2 Fitur 2: Mode Uji Hafalan / Tahfidz Masker (*Blind/Hide Ayah Mode*)
* **Latar Belakang:** Banyak jamaah lanjut usia maupun santri muda yang ingin mengulang hafalan (*muraja'ah*) juz-juz pendek (Juz 30), namun mudah terdistraksi jika teks Arab langsung terlihat di layar.
* **Konsep Desain:**
  - Tombol beralih **"Mode Uji Hafalan"** di bilah atas mushaf.
  - Saat aktif, teks Arab pada setiap ayat disembunyikan (*masked*) menggunakan balok kabur lembut atau kotak placeholder interaktif, hanya menyisakan nomor ayat dan penggalan terjemahan.
  - **Interaksi Ketukan Bertahap:**
    - Ketukan 1: Menampilkan huruf/kata pertama ayat sebagai pemicu ingatan (*clue*).
    - Ketukan 2: Membuka seluruh ayat berharakat penuh untuk memvalidasi kebenaran hafalan.
  - Indikator evaluasi diri mandiri: Tombol centang *"Lancar"* atau *"Perlu Diulang"* yang mencatat statistik hafalan pribadi.

### 2.3 Fitur 3: Pengulang Murottal Hafalan (*Ayah Audio Looper / Repeat A-B*)
* **Latar Belakang:** Menghafal Al-Qur'an memerlukan metode *takrar* (pengulangan mendengar secara intensif).
* **Konsep Desain:**
  - Widget kontrol audio murottal diperkaya dengan pengaturan **Putar Ulang (Looping)**:
    - Pilihan perulangan per ayat: `1x`, `3x`, `5x`, `7x`, `10x`, atau `Tanpa Batas (∞)`.
    - **Jeda Hening Menirukan (Echo Pause):** Jeda waktu hening otomatis antar-pengulangan (misal: 3 detik atau sepanjang durasi ayat tersebut) agar pembaca dapat melafalkan kembali ayat yang baru didengar dengan ritme santai.
    - **Mode Rentang Ayat (A-B Repeat):** Menentukan rentang ayat untuk diulang bersamaan (contoh: QS. Al-Mulk ayat 1 s.d. 5 diputar ulang 5 putaran).

### 2.4 Fitur 4: Perekam Suara Tilawah Mandiri (*Self-Voice Recorder & Makhraj Compare*)
* **Latar Belakang:** Pembaca sering tidak menyadari kesalahan tajwid atau panjang-pendek mad saat membaca sendiri.
* **Konsep Desain:**
  - Tombol mikrofon **"Rekam Bacaan Saya"** pada setiap kartu ayat menggunakan browser `MediaRecorder API`.
  - Rekaman disimpan secara aman di memori lokal peramban (*IndexedDB*), 100% privat tanpa diunggah ke internet.
  - **Dual Audio Player:** Menyandingkan pemutar suara rekaman pengguna di sisi kiri dan audio murottal qari rujukan di sisi kanan, memungkinkan jamaah mengevaluasi ketepatan makhraj huruf dan ketukan mad secara mandiri.

---

## BAB 3: PILAR II - IBADAH HARIAN & PRAKTIK SYIAR (DAILY ISLAMIC LIFE & SUNNAH)

### 3.1 Fitur 5: Modul Kalender Hijriah & Pengingat Puasa Sunnah (`/kalender`)
* **Latar Belakang:** Umat Islam membutuhkan panduan penanggalan qamariyah yang presisi untuk menjaga rutinitas puasa sunnah dan mengagungkan hari-hari besar Islam.
* **Konsep Desain:**
  - Halaman khusus `/kalender` yang menyajikan kalender bulanan terintegrasi Masehi dan Hijriah (standar hisab Kemenag RI / Ummul Qura).
  - **Penanda Visual Puasa Sunnah & Momentum Agung:**
    - 🟢 *Puasa Senin & Kamis* (badge hijau lembut).
    - 🟡 *Puasa Ayyamul Bidh* (tanggal 13, 14, 15 tiap bulan hijriah - badge emas).
    - 🔵 *Puasa Sunnah Pilihan:* Asyura & Tasu'a (Muharram), Arafah (Dzulhijjah), dan Syawal.
    - 🔴 *Hari Diharamkan Berpuasa:* Hari Raya Idul Fitri, Idul Adha, dan Hari Tasyrik.
  - Kartu pengingat harian: *"Besok adalah hari Senin, disunnahkan berpuasa"* yang tampil di bilah atas aplikasi.

### 3.2 Fitur 6: Kumpulan Doa Sehari-hari (*Hisnul Muslim* / Benteng Muslim) (`/doa-harian`)
* **Latar Belakang:** Melengkapi modul 40 Doa Rabbana Al-Qur'an yang telah ada dengan kompilasi doa aktivitas harian berlandaskan hadits shahih.
* **Konsep Desain:**
  - Katalog doa terstruktur berdasarkan momen kehidupan:
    - *Adab Bangun & Menjelang Tidur*
    - *Keluar & Masuk Rumah / Masjid*
    - *Makan, Minum & Berpakaian*
    - *Perjalanan & Berkendara*
    - *Perlindungan dari Penyakit, Rasa Cemas & Hutang*
    - *Menjenguk Orang Sakit & Doa Istikharah*
  - Setiap doa dilengkapi lafadz Arab besar, transliterasi Latin, arti, faedah riwayat perawi hadits, dan tombol salin 1-klik.

### 3.3 Fitur 7: Kalkulator Zakat Harta & Fitrah Ramah Lansia (`/zakat`)
* **Latar Belakang:** Banyak jamaah sepuh maupun keluarga muslim yang ragu dalam menghitung nisab dan haul zakat harta simpanan mereka.
* **Konsep Desain:**
  - Antarmuka kalkulator yang bersih, bersahabat, dan menggunakan angka rupiah yang jelas:
    1. **Zakat Maal (Tabungan, Deposito, Emas):** Otomatis membandingkan total harta dengan nisab 85 gram emas murni (harga emas dapat disesuaikan) dengan tarif 2,5%.
    2. **Zakat Penghasilan / Profesi:** Perhitungan per bulan atau per tahun dari pendapatan bersih.
    3. **Zakat Fitrah:** Panduan hitung beras (2,5 kg / 3,5 liter) dikalikan jumlah anggota keluarga.
  - Dilengkapi penjelasan syarat wajib zakat, dalil Al-Qur'an (QS. At-Taubah: 103), serta rincian 8 golongan penerima zakat (*asnaf*).

### 3.4 Fitur 8: Panduan Visual Tata Cara Shalat Wajib & Sunnah (`/panduan-shalat`)
* **Latar Belakang:** Memberikan rujukan tata cara shalat yang benar, khusyuk, dan sesuai sunnah bagi mualaf, anak-anak, maupun lansia yang ingin menyegarkan kembali bacaan shalatnya.
* **Konsep Desain:**
  - Panduan langkah demi langkah rukun shalat (dari takbiratul ihram hingga salam).
  - Teks bacaan doa iftitah, bacaan ruku', i'tidal, sujud, dan tasyahud dengan tulisan Arab besar dan terjemahan.
  - Modul Shalat Sunnah Utama: Tata cara dan niat shalat Tahajjud, Witir, Dhuha, Rawatib, Shalat Gerhana (Khusuf/Kusuf), dan Shalat Jenazah lengkap 4 takbir.

---

## BAB 4: PILAR III - KELUARGA, KEBERSIAMAAN & MEDIA SOSIAL (FAMILY & SOCIAL SYIAR)

### 4.1 Fitur 9: Pembuat Kartu Kutipan Ayat Indah (*Ayah Poster Maker / Share to WhatsApp*)
* **Latar Belakang:** Jamaah sering ingin membagikan ayat Al-Qur'an yang menyentuh hati ke grup WhatsApp keluarga atau media sosial, namun kesulitan membuat desain yang rapi dan elegan.
* **Konsep Desain:**
  - Tombol **"Bagikan Poster"** pada setiap kartu ayat.
  - Generator poster otomatis berbasis HTML5 Canvas (`toBlob` / `toDataURL`):
    - Teks Arab kaligrafi di bagian atas berlatar ornamen kubah atau geometris islami.
    - Terjemahan bahasa Indonesia dan nama Surat + Ayat di bagian bawah.
    - Watermark anggun *"QuranWeb • Bacaan Tenang Ramah Lansia"*.
    - Pilihan rasio aspek: Persegi (1:1 untuk feed/WhatsApp) dan Vertikal (9:16 untuk Story/Status).
  - Tombol 1-klik: **"Unduh Gambar PNG"** dan **"Kirim ke WhatsApp"**.

### 4.2 Fitur 10: Lingkaran Khatam Bersama Keluarga (*Family Khatam Circle*)
* **Latar Belakang:** Tradisi khatam bersama keluarga di bulan Ramadhan atau momentum syukuran sering kali tercecer pencatatannya di grup obrolan teks.
* **Konsep Desain:**
  - Jamaah terdaftar dapat membuat grup khatam: contoh *"Khatam Ramadhan Bani Sastro"*.
  - Pembuat grup membagikan kode undangan singkat (misal: `QW-KELUARGA-77`).
  - Anggota keluarga yang bergabung dapat memilih Juz (1 s.d. 30) atau paket 'Ain yang ingin dituntaskan.
  - Dashboard visual menampilkan cincin progres keluarga secara langsung: Juz mana yang sedang dibaca, siapa pembacanya, dan persentase penyelesaian bersama.

### 4.3 Fitur 11: Buku Catatan Amalan Harian (*Mutaba'ah Yaumiyah / Daily Habit Tracker*)
* **Latar Belakang:** Memelihara istiqomah dalam ibadah harian melalui evaluasi diri yang menenangkan (*muhasabah*) tanpa menimbulkan rasa terbebani.
* **Konsep Desain:**
  - Kotak centang harian sederhana di Portal Pengguna:
    - [x] Shalat 5 Waktu Berjamaah di Masjid
    - [x] Tilawah Minimal 1 'Ain Hari Ini
    - [x] Dzikir Pagi & Petang
    - [x] Shalat Dhuha / Shalat Malam
    - [x] Sedekah Subuh
  - Kalender mini yang menampilkan titik-titik hijau keistiqomahan (*streak of good deeds*) dan kutipan hadits penyemangat.

---

## BAB 5: PILAR IV - KHAZANAH HADITS NABAWI & FIQIH RINGKAS

### 5.1 Fitur 12: Modul Hadits Arba'in An-Nawawiyah 42 Hadits Pokok (`/hadits`)
* **Latar Belakang:** Kitab *Al-Arba'in An-Nawawiyyah* karya Imam Abu Zakariya Yahya bin Syaraf An-Nawawi adalah himpunan hadits paling masyhur yang memuat kaidah-kaidah agung Islam.
* **Konsep Desain:**
  - Rute mandiri `/hadits` dengan katalog 42 hadits shahih.
  - Setiap hadits disajikan dengan:
    - Nomor urut dan judul tema pokok (misal: *Niat & Ikhlas, Rukun Islam, Tingkatan Iman & Ihsan, Menjaga Lisan, Mencintai Saudara*).
    - Teks matan hadits Arab berharakat besar dan terjemahan bahasa Indonesia mengalir.
    - Nama sahabat perawi hadits (Umar bin Khattab, Abu Hurairah, Aisyah, dll.).
    - Uraian intisari faidah hukum dan akhlak kontekstual untuk kehidupan masa kini.
  - Dilengkapi pencarian kata kunci, pengatur ukuran huruf, audio pelafalan Arab, dan filter hadits favorit.

---

## BAB 6: PILAR V - AKSESIBILITAS SUARA & AI BEBAS SENTUH (VOICE & TOUCHLESS NAVIGATION)

### 6.1 Fitur 13: Pencarian Ayat Melalui Suara (*Voice Search*)
* **Latar Belakang:** Mengetik kata Arab atau Latin di keyboard ponsel pintar sering kali sulit bagi lansia dengan jari kaku, mata lelah, atau tremor.
* **Konsep Desain:**
  - Ikon mikrofon di samping kotak pencarian Al-Qur'an.
  - Memanfaatkan `Web Speech Recognition API` (dengan bahasa default `id-ID` dan `ar-SA`).
  - Pengguna cukup berucap: *"Surat Yasin ayat tiga puluh enam"* atau *"Tentang berbakti kepada orang tua"*, sistem otomatis menerjemahkan ucapan menjadi teks pencarian dan membuka hasilnya seketika.

### 6.2 Fitur 14: Pembalik Halaman Bebas Sentuh (*Hands-Free Page Turner*)
* **Latar Belakang:** Memfasilitasi orang tua yang sedang duduk bersandar, berbaring di pembaringan karena udzur sakit, atau kedua tangannya sedang memegang tasbih fisik.
* **Konsep Desain:**
  - Mode suara hening (*Gentle Voice Commands*):
    - *"Lanjut"* / *"Berikutnya"* $\rightarrow$ Menggulir ke ayat berikutnya secara halus.
    - *"Kembali"* / *"Sebelumnya"* $\rightarrow$ Menggulir ke ayat sebelumnya.
    - *"Putar"* $\rightarrow$ Memulai lantunan murottal ayat yang sedang aktif.
    - *"Berhenti"* $\rightarrow$ Menghentikan suara murottal.
  - Pengenalan perintah diproses sepenuhnya di sisi peramban klien tanpa mengirim rekaman suara ke server pihak ketiga demi menjaga kerahasiaan dan privasi keluarga.

---

## BAB 7: ARSITEKTUR TEKNIS, STRATEGI DATA & INTEGRASI LOGIKAL

### 7.1 Desain Arsitektur Client-Side Heavy & Zero-Bloat
Seluruh modul pada Tahap 3 tetap mempertahankan filosofi arsitektur QuranWeb:
1. **Dataset JSON Statis Mandiri:** Data naskah tafsir ringkas, 42 Hadits Arba'in, dan doa hisnul muslim di-host secara lokal di direktori `public/data/` (`tafsir_wajiz.json`, `arbain_hadith.json`, `hisnul_muslim.json`).
2. **Kalkulasi Astronomis & Kalender Sisi Klien:** Perhitungan konversi tanggal Hijriah dan puasa sunnah dihitung menggunakan algoritma matematika hisab astronomi langsung di peramban tanpa panggilan API server.
3. **Penyimpanan Lokal Terisolasi:** Bookmark hadits, rekaman audio suara sendiri (*voice clips*), dan catatan mutaba'ah disimpan di `localStorage` dan `IndexedDB` perangkat pengguna.

### 7.2 Skema Penyimpanan Data Offline-First (PWA Precache v9)
Ketika Fase 3 diimplementasikan, Service Worker akan dinaikkan versinya ke `quranweb-cache-v9`:
- Pre-caching berkas dataset baru: `arbain_hadith.json`, `hisnul_muslim.json`, dan indeks tafsir wajiz.
- Memastikan modul hadits, doa harian, dan kalkulator zakat dapat digunakan di daerah tanpa sinyal internet (seperti saat bepergian ke pelosok, di pesawat terbang, atau di ruang rawat inap).

### 7.3 Pemanfaatan Modern Web APIs
- **HTML5 Canvas API:** Menghasilkan poster gambar ayat Al-Qur'an beresolusi tinggi tanpa memerlukan server rendering (zero server load).
- **Web MediaRecorder API:** Merekam suara tilawah pengguna secara langsung ke format audio WebM/Opus hemat ruang.
- **Web Speech Recognition API:** Menerjemahkan suara pengguna menjadi teks perintah navigasi dan pencarian ayat.
- **Web Audio API Oscillator:** Melanjutkan penggunaan sintesis nada klik dan melodi kristal tasbih tanpa dependensi aset eksternal.

---

## BAB 8: MATRIKS PERBANDINGAN & ANALISIS NILAI TAMBAH

| Aspek Fitur | Aplikasi Al-Qur'an Konvensional | QuranWeb dengan Pembaruan Lengkap Tahap 3 |
| :--- | :--- | :--- |
| **Pendalaman Tafsir** | Tafsir panjang berbelit atau link web eksternal penuh iklan. | **Tafsir Wajiz & Tahlili 1-Klik:** Teks bersih, font besar, terhubung Asbabun Nuzul & Gharib. |
| **Uji Hafalan (Tahfidz)** | Harus menutup sebagian layar dengan kertas atau tangan. | **Mode Masker Cerdas:** Menutup teks otomatis, buka kata demi kata dengan ketukan lembut. |
| **Perulangan Murottal** | Putar ulang manual per ayat yang merepotkan. | **Ayah Looper & Echo Pause:** Ulang otomatis 3x/5x/10x dengan jeda hening menirukan bacaan. |
| **Kalender Islam** | Penuh iklan banner tanggalan dan notifikasi komersial. | **Kalender Hijriah Terpadu:** Penanda otomatis puasa sunnah, fase bulan & jadwal shalat. |
| **Khazanah Hadits** | Kitab hadits terpisah yang berat dan sulit dicari. | **Hadits Arba'in An-Nawawiyah:** 42 hadits pokok lengkap dengan faidah kontekstual modern. |
| **Doa Sehari-hari** | Tersebar di banyak buku doa saku. | **Hisnul Muslim Digital:** Doa aktivitas harian lengkap dengan lafadz, arti, dan riwayat. |
| **Zakat & Fiqih Harta** | Dihitung manual dengan rumus yang membingungkan. | **Kalkulator Zakat Ramah Lansia:** Otomatis bandingkan nisab emas dan tarif 2,5%. |
| **Syiar Media Sosial** | Salin tempel teks mentah yang berantakan di WhatsApp. | **Pembuat Poster Ayat Indah:** 1-klik cetak gambar kaligrafi elegan siap kirim ke WhatsApp. |
| **Khatam Bersama** | Obrolan grup WhatsApp yang mudah tenggelam. | **Lingkaran Khatam Keluarga:** Dashboard cincin progres bersama yang membahagiakan. |
| **Navigasi Lansia** | Wajib menatap dan mengetik layar kecil. | **Pencarian Suara & Pembalik Halaman Bebas Sentuh:** Perintah suara santun tanpa sentuh layar. |

---

## BAB 9: ROADMAP EKSEKUSI TAHAP 3 (STEP 22 S.D. STEP 28)

Rekomendasi urutan implementasi teknis Tahap 3 disusun secara modular dan bertahap:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ROADMAP PENGEMBANGAN TAHAP 3                         │
└─────────────────────────────────────────────────────────────────────────────┘
  │
  ├── [Fase A: Khazanah Ilmiah & Hadits Nabawi]
  │   ├── Step 22: Modul Hadits Arba'in An-Nawawiyah (/hadits) & Dataset JSON
  │   └── Step 23: Integrasi Tafsir Ringkas Kemenag RI per Ayat pada AyahCard
  │
  ├── [Fase B: Syiar Keluarga & Media Sosial]
  │   ├── Step 24: Generator Poster Kutipan Ayat ke WhatsApp (HTML5 Canvas)
  │   └── Step 25: Lingkaran Khatam Bersama Keluarga (Family Khatam Circle)
  │
  ├── [Fase C: Amalan Sunnah & Fiqih Harian]
  │   ├── Step 26: Kalender Hijriah, Penanda Puasa Sunnah & Kalkulator Zakat
  │   └── Step 27: Kumpulan Doa Sehari-hari (Hisnul Muslim) & Panduan Shalat
  │
  └── [Fase D: Inovasi Aksesibilitas Suara & Tahfidz Cerdas]
      └── Step 28: Mode Uji Hafalan (Tahfidz Masker) & Kontrol Suara Bebas Sentuh
```

### Rincian Pembagian Tahapan Eksekusi:

1. **Step 22: Modul Hadits Arba'in An-Nawawiyah (`/hadits`)**
   - Penyusunan dataset `public/data/arbain_hadith.json` (42 hadits matan Arab, latin, terjemahan, perawi, faidah).
   - Pembuatan komponen `src/components/hadith/HadithCatalog.tsx` dengan pencarian, filter tema, dan kontrol font lansia.
   - Pendaftaran rute `/hadits` dan tautan menu drawer 3-garis.

2. **Step 23: Integrasi Tafsir Ringkas Kemenag RI per Ayat**
   - Penyiapan dataset tafsir ringkas resmi Kemenag RI.
   - Penambahan lencana sapphire *"Tafsir"* pada `AyahCard.tsx` dan pembuatan modal `TafsirModal.tsx`.
   - Penyediaan opsi tab Tafsir Wajiz (ringkas) dan Tafsir Tahlili (mendalam).

3. **Step 24: Generator Poster Kutipan Ayat ke WhatsApp (*Ayah Poster Maker*)**
   - Pembuatan utilitas rendering Canvas `src/services/posterGenerator.ts`.
   - Dialog pembuat poster pada kartu ayat dengan pratinjau live, pilihan tema ornamen, rasio 1:1 / 9:16, tombol unduh PNG, dan tombol bagikan langsung ke WhatsApp.

4. **Step 25: Lingkaran Khatam Bersama Keluarga (*Family Khatam Circle*)**
   - Antarmuka pembuatan dan pengelolaan grup tilawah keluarga di Portal Pengguna (`/user`).
   - Visualisasi cincin progres grup dan penugasan Juz/'Ain antar-anggota keluarga.

5. **Step 26: Kalender Hijriah, Penanda Puasa Sunnah & Kalkulator Zakat**
   - Perhitungan hisab kalender Hijriah dan deteksi otomatis puasa sunnah (Senin-Kamis, Ayyamul Bidh).
   - Halaman `/kalender` interaktif dan komponen `/zakat` untuk zakat maal, profesi, dan fitrah.

6. **Step 27: Kumpulan Doa Sehari-hari (*Hisnul Muslim*) & Panduan Shalat**
   - Kompilasi doa aktivitas harian berlandaskan hadits shahih pada rute `/doa-harian`.
   - Modul rukun shalat bergambar dan doa shalat sunnah (Tahajjud, Dhuha, Jenazah).

7. **Step 28: Mode Uji Hafalan (Tahfidz Masker), Audio Looper & Navigasi Suara**
   - Pengaktifan mode masker ayat pada lembar mushaf dan kontrol pengulang murottal (*Repeat A-B*).
   - Integrasi Web Speech Recognition API untuk pencarian ayat dan pembalik halaman bebas sentuh (*hands-free*).

---

## BAB 10: KESIMPULAN & KOMITMEN DIGITAL WAQAF

Dokumen **Master Plan 3** ini meneguhkan komitmen jangka panjang QuranWeb sebagai **Waqaf Digital Peradaban Islam**:

1. **Bukan Sekadar Aplikasi Membaca:** QuranWeb menjelma menjadi pendamping hidup harian umat Islam—menuntun shalat tepat waktu, membimbing hafalan, memfasilitasi sedekah zakat, menyalakan sirah nabawi, dan mempererat ukhuwah tilawah dalam keluarga.
2. **Kenyamanan Hakiki Pembaca Lansia:** Setiap baris kode yang ditulis diniatkan untuk memuliakan para sesepuh dan orang tua kita, memastikan mereka dapat beribadah dan bertadabbur dengan rasa aman, tenang, dan bahagia tanpa hambatan teknologi.
3. **Pahala Jariyah yang Terus Mengalir:** Dengan menjaga keikhlasan prinsip bebas iklan komersial, setiap ayat yang dibaca, setiap hadits yang diresapi, dan setiap dzikir yang dihitung pada tasbih digital QuranWeb menjadi tabungan amal jariyah yang kekal bagi tim pengembang, pengguna, dan seluruh umat Islam.

---
*Dokumen Master Plan 3 ini merupakan cetak biru ideation dan strategi arsitektur resmi yang siap menjadi landasan eksekusi bertahap pada siklus pengembangan berikutnya.*
