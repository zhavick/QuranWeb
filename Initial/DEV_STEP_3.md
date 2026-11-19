# Urutan Pengembangan Aplikasi Fase 3 (Development Steps Phase 3): Quran Web

Dokumen ini merupakan panduan teknis tahapan pengembangan komprehensif (*step-by-step implementation guide*) untuk **Fase 3** aplikasi **Quran Web**, yang diturunkan secara presisi dari cetak biru strategis **Master Plan 3** (`Initial/MasterPlan-3.md`). Dokumen ini melanjutkan kesuksesan Fase 1 (Step 1 s.d. 8) dan Fase 2 (Step 9 s.d. 21).

* **Nama Dokumen:** DEV_STEP_3.md
* **Status Dokumen:** Rencana Kerja Resmi Implementasi Fase 3 (Official Technical Execution Blueprint)
* **Cakupan Fase:** Step 22 s.d. Step 31
* **Pilar Utama:** Hadits Arba'in, Tafsir Kemenag Wajiz & Tahlili, Syiar Media Sosial WhatsApp, Ekosistem Ibadah Keluarga, Portal Analitik Ibadah (`/report`), Kalender Hijriah & Zakat, Audio Azan Otomatis, Pelacak Kepatuhan Shalat & Smart Reminder, Hisnul Muslim, serta Aksesibilitas Suara & Tahfidz Cerdas.

---

## 1. Prinsip Utama Eksekusi Fase 3

1. **Keotentikan Sanad & Validitas Riwayat (Step 22 & 23):**
   Seluruh data teks hadits dan tafsir wajib merujuk pada naskah shahih terstandarisasi (Kitab Al-Arba'in An-Nawawiyah dan Tafsir Resmi Kementerian Agama Republik Indonesia) dengan struktur data offline mandiri berformat JSON.
2. **Syiar Santun Tanpa Riya' & Penguatan Ukhuwah (Step 24 & 25):**
   Fitur visual poster Al-Qur'an dan Lingkaran Khatam Keluarga dirancang dengan pendekatan estetis, syahdu, serta mengutamakan motivasi spiritual keluarga, bukan ajang kompetisi atau pamer ibadah.
3. **Akuntabilitas Spiritual Terukur Melalui Portal Analitik (Step 26):**
   Dashboard analitik `/report` menyatukan data tilawah, shalat, hafalan, dan dzikir ke dalam metrik yang menyejukkan hati, memberikan umpan balik istiqomah personal yang dapat diekspor menjadi *Worship Report Card*.
4. **Disiplin Ibadah Tanpa Paksaan (Step 27 s.d. 29):**
   Modul jadwal shalat disempurnakan dengan kumandang azan otomatis multimuadzin, integrasi hisab kalender Hijriah, serta pelacak kepatuhan shalat (*prayer checklist*) dengan pengingat bertahap (10 menit, 20 menit, dan interval kustom) yang otomatis berhenti saat shalat selesai ditunaikan.
5. **Inklusivitas Lansia, Penghafal Al-Qur'an & Aksesibilitas Suara (Step 30 & 31):**
   Penyediaan doa harian *Hisnul Muslim*, mode penguji hafalan (*tahfidz masker*), pengulang audio A-B (*murottal looper*), serta navigasi suara (*hands-free page turner*) untuk memudahkan para sesepuh beribadah tanpa kelelahan fisik.
6. **Performa Ringan, Zero Bloat & Offline-First:**
   Semua modul baru memanfaatkan API peramban bawaan (*HTML5 Canvas, Web Audio API, Web Speech API, Web Notification API*) dan caching Service Worker PWA tanpa ketergantungan berlebihan pada library eksternal yang membebani memori.

---

## 2. Matriks Ringkasan Tahapan Pengembangan Fase 3 (Step 22 s.d. Step 31)

| Step | Pilar / Kategori | Modul yang Dikerjakan | File Utama Terkait | Prioritas | Target Luaran |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Step 22** | Pilar IV: Hadits | **Modul Hadits Arba'in An-Nawawiyah (`/hadits`):** Katalog 42 hadits pokok Islam, teks Arab berharakat, transliterasi Latin, terjemahan Indonesia, mukharrij, faidah syarah, pencarian cepat, dan audio makhraj. | `public/data/arbain_hadith.json`<br>`src/components/hadith/HadithCatalog.tsx`<br>`src/components/hadith/HadithDetailModal.tsx` | Tinggi | **Selesai (Done)** | Halaman katalog `/hadits` responsif, filter 4 tema besar (Akidah, Ibadah, Akhlak, Muamalah), dan dialog tadabbur hadits. |
| **Step 23** | Pilar I: Tilawah | **Integrasi Tafsir Ringkas Kemenag RI per Ayat:** Tafsir Wajiz (ringkas) dan Tafsir Tahlili (mendalam) resmi Kemenag RI, tersemat langsung pada kartu ayat mushaf tilawah. | `public/data/tafsir/*.json`<br>`src/components/reader/AyahCard.tsx`<br>`src/components/reader/TafsirModal.tsx`<br>`src/services/tafsir.ts` | Tinggi | **Selesai (Done)** | Lencana safir *"Tafsir"* di kartu ayat membuka modal telaah tafsir resmi Kemenag RI dengan kontrol font ramah lansia. |
| **Step 24** | Pilar III: Syiar | **Generator Poster Kutipan Ayat ke WhatsApp (*Ayah Poster Maker*):** Pembuat gambar kutipan ayat otomatis berbasis HTML5 Canvas untuk status WhatsApp dan Instagram. | `src/services/posterGenerator.ts`<br>`src/components/reader/AyahPosterModal.tsx`<br>`src/components/reader/AyahCard.tsx` | Menengah | **Selesai (Done)** | Dialog pembuat poster pada kartu ayat dengan 4 ornamen Islami, rasio 1:1 & 9:16, tombol unduh PNG, dan tombol share ke WhatsApp. |
| **Step 25** | Pilar III: Keluarga | **Lingkaran Khatam Bersama Keluarga (*Family Khatam Circle*):** Fitur grup tilawah keluarga, pembagian penugasan Juz/'Ain, cincin progres bersama, dan notifikasi motivasi sakinah. | `src/components/khatam/FamilyCirclePage.tsx`<br>`src/services/familyCircle.ts`<br>`server/index.js` (skema grup) | Menengah | **Selesai (Done)** | Antarmuka manajemen grup khatam keluarga, kode undangan bergabung, cincin visual progres 30 Juz, dan penugasan Juz per anggota. |
| **Step 26** | Pilar III: Analitik & UX | **Portal Laporan Analitik Ibadah Jamaah (`/report`), Worship Report Card & Standarisasi Tombol Kembali Universal:** Penyeragaman desain tombol kembali di seluruh modul web menjadi satu komponen baku, dashboard analitik komprehensif tilawah Al-Qur'an, kepatuhan shalat, hafalan juz 'amma, dan dzikir tasbih. | `src/components/common/BackToMushafButton.tsx`<br>`src/components/report/WorshipReportPage.tsx`<br>`src/services/reportAnalytics.ts`<br>`src/components/report/WorshipReportCard.tsx` | Tinggi | **Selesai (Done)** | Rute `/report` dengan grafik tren, metrik istiqomah mingguan/bulanan, ekspor *Worship Report Card* PNG, serta tombol kembali yang seragam di seluruh modul. |
| **Step 27** | Pilar II: Ibadah | **Kalender Hijriah, Penanda Puasa Sunnah & Kalkulator Zakat:** Kalender hisab Umm al-Qura/Kemenag, deteksi otomatis puasa sunnah, dan kalkulator zakat maal, profesi & fitrah. | `src/components/calendar/HijriCalendarPage.tsx`<br>`src/components/zakat/ZakatCalculatorModal.tsx`<br>`src/services/hijriCalendar.ts` | Menengah | **Selesai (Done)** | Rute `/kalender` penanda puasa Senin-Kamis & Ayyamul Bidh, modal hitung zakat otomatis berbasis nisab emas/beras, dan koreksi hisab lokal. |
| **Step 28** | Pilar II: Shalat | **Audio Lantunan Azan Otomatis (Auto-Adhan) & Notifikasi Masuk Waktu Shalat:** Pemutar suara azan otomatis saat waktu shalat tiba dengan 5 pilihan muadzin ternama dan modal panggilan shalat. | `src/services/adhanAudio.ts`<br>`src/components/prayer/AdhanPlayerModal.tsx`<br>`src/components/prayer/PrayerTimesModal.tsx` | Tinggi | Audio azan berkumandang otomatis tepat waktu shalat, dialog lafadz azan & doa sesudah azan, serta Web Notification API. |
| **Step 29** | Pilar II: Shalat | **Pelacak Kepatuhan Shalat (Prayer Checklist) & Pengingat Bertahap (Smart Reminder):** Checklist centang shalat fardhu/sunnah, reminder 10m, 20m, interval kustom, dan pembatalan otomatis. | `src/components/prayer/PrayerChecklistWidget.tsx`<br>`src/services/prayerReminder.ts`<br>`src/components/prayer/PrayerReminderSettings.tsx` | Tinggi | Widget checklist shalat pada header dan modal jadwal shalat, notifikasi pengingat bertahap anti-terlewat shalat. |
| **Step 30** | Pilar II: Sunnah | **Kumpulan Doa Sehari-hari (*Hisnul Muslim*) & Panduan Shalat Bergambar:** Kompilasi doa aktivitas harian berlandaskan hadits shahih dan panduan shalat fardhu/sunnah lengkap. | `public/data/hisnul_muslim.json`<br>`src/components/prayers/HisnulMuslimCatalog.tsx`<br>`src/components/prayers/SalahGuideModal.tsx` | Menengah | Halaman `/doa-harian` dengan pencarian instan, audio Web Speech, dan panduan shalat sunnah Dhuha, Tahajud & Jenazah. |
| **Step 31** | Pilar I & V: AI/Suara | **Mode Uji Hafalan (Tahfidz Masker), Audio Looper A-B & Navigasi Suara AI:** Fitur sensor kata ayat untuk muroja'ah, pemutar audio loop A-B, voice search, dan pembalik halaman bebas sentuh. | `src/components/reader/TahfidzMaskerControls.tsx`<br>`src/components/audio/AudioLooperControls.tsx`<br>`src/services/voiceAssistant.ts` | Lanjutan | Masker kata interaktif di mushaf, pengulang audio ayat berulang, dan kendali suara navigasi halaman bebas sentuh tangan. |

---

## 3. Rincian Teknis Eksekusi Bertahap (Step-by-Step Implementation)

---

### Step 22: Modul Hadits Arba'in An-Nawawiyah (`/hadits`)
* **Status:** **Selesai (Done)**
* **Tujuan:** Menghadirkan naskah 42 hadits monumental karya Imam An-Nawawi yang menjadi pilar ajaran Islam, lengkap dengan matan Arab berharakat, transliterasi Latin, terjemahan Indonesia, perawi, faidah syarah, dan pelafalan audio.
* **Tugas Spesifik:**
  1. **Penyusunan Dataset Mandiri (`public/data/arbain_hadith.json`):**
     - Menghimpun 42 Hadits Arba'in lengkap dengan struktur:
       ```typescript
       interface ArbainHadith {
         id: number;
         number: number;
         title: string;
         arabic: string;
         latin: string;
         translation: string;
         rawi: string; // Misal: HR. Bukhari & Muslim
         theme: 'akidah' | 'ibadah' | 'akhlak' | 'muamalah';
         keyTakeaways: string[];
         relatedAyahs?: { surahId: number; ayahNumber: number }[];
       }
       ```
  2. **Komponen Katalog Hadits (`src/components/hadith/HadithCatalog.tsx`):**
     - Menampilkan kartu hadits dengan tipografi Arab yang anggun (`font-arabic-amiri`).
     - Fitur pencarian cepat multi-kriteria (nomor hadits, perawi, kata kunci terjemahan, judul).
     - Filter berdasarkan 4 pilar tema besar (Akidah, Ibadah, Akhlak, Muamalah).
     - Kontrol font scaler 3 tingkat (Normal, Sedang, Besar) untuk kenyamanan lansia.
  3. **Modal Telaah Syarah Hadits (`src/components/hadith/HadithDetailModal.tsx`):**
     - Membuka lembar pendalaman naskah hadits dengan latar sejuk (*card-based*).
     - Tombol audio pelafalan berbasis Web Speech API makhraj Arab / Indonesia.
     - Tautan silang 1-klik menuju ayat Al-Qur'an terkait pada lembar tilawah mushaf.
     - Tombol salin teks hadits (Arab + Terjemahan) untuk kemudahan dakwah.
  4. **Pendaftaran Navigasi & Proteksi Akses:**
     - Menambahkan rute `/hadits` pada `src/App.tsx`.
     - Menyematkan opsi navigasi "Hadits Arba'in" dengan ikon buku hadits di Menu Drawer 3-Garis (Strip 3).
     - Menambahkan precache data di Service Worker (`sw.js` cache v9).
* **Kriteria Selesai (DoD):** Seluruh 42 Hadits Arba'in dapat dicari, dibaca, didengar audionya, disalin, dan dibuka secara luring tanpa kuota internet dengan 0 error kompilasi TypeScript (`tsc -b`).

---

### Step 23: Integrasi Tafsir Ringkas Kemenag RI per Ayat (Tafsir Wajiz & Tahlili)
* **Status:** **Selesai (Done)**
* **Tujuan:** Menyediakan akses langsung ke tafsir resmi Kementerian Agama Republik Indonesia pada setiap ayat di lembar mushaf tilawah, membantu jamaah memahami konteks dan kedalaman firman Allah SWT.
* **Tugas Spesifik:**
  1. **Struktur Data Tafsir Terbuka (`public/data/tafsir/*.json` atau Lazy Loaded Index):**
     - Menyusun dataset tafsir per surah atau per juz agar tidak membebani ukuran bundle awal aplikasi.
     - Format data mencakup dua tingkatan penjelasan:
       - **Tafsir Wajiz:** Intisari ringkas dan lugas (cocok untuk pembacaan cepat harian dan lansia).
       - **Tafsir Tahlili:** Analisis mendalam mencakup kosa kata, latar belakang asbabun nuzul, munasabah (hubungan antar-ayat), serta kandungan hukum fiqih.
  2. **Lencana Tafsir pada Kartu Ayat (`src/components/reader/AyahCard.tsx`):**
     - Menambahkan tombol lencana safir bertuliskan *"Tafsir"* berdampingan dengan tombol Asbabun Nuzul dan Mufradat Gharib.
     - Ukuran tombol memenuhi standar aksesibilitas minimum `44px × 44px`.
  3. **Komponen Modal Telaah Tafsir (`src/components/reader/TafsirModal.tsx`):**
     - Menampilkan nomor surah, nomor ayat, teks Arab, dan terjemahan resmi Kemenag.
     - Toggle tab dinamis antara *Tafsir Wajiz* dan *Tafsir Tahlili*.
     - Pengatur ukuran huruf tafsir (Font Size Slider 14px s.d. 26px) yang persisten di `localStorage`.
     - Tombol salin kutipan tafsir berformat rapi untuk rujukan kajian.
  4. **Layanan Pengambilan Data Tafsir (`src/services/tafsir.ts`):**
     - Mekanisme *caching on-demand* ke `IndexedDB` atau Service Worker cache sehingga surah yang pernah dibuka tafsirnya dapat diakses 100% offline.
* **Kriteria Selesai (DoD):** Setiap kartu ayat dapat menampilkan modal tafsir Kemenag (Wajiz dan Tahlili) secara instan, ukuran teks dapat diperbesar secara responsif, dan data tersimpan luring pada cache peramban.

---

### Step 24: Generator Poster Kutipan Ayat ke WhatsApp (*Ayah Poster Maker*)
* **Status:** **Selesai (Done)**
* **Tujuan:** Memfasilitasi jamaah menyebarkan kebaikan ayat-ayat suci Al-Qur'an ke media sosial dan status WhatsApp dalam bentuk kartu grafis yang elegan, bersih dari iklan, dan beresolusi tinggi tanpa aplikasi desain eksternal.
* **Tugas Spesifik:**
  1. **Mesin Rendering HTML5 Canvas Lokal (`src/services/posterGenerator.ts`):**
     - Merender kaligrafi Arab, teks terjemahan bahasa Indonesia, nama surah, dan nomor ayat ke dalam kanvas grafis beresolusi tinggi (2x/3x retina display) murni menggunakan peramban pengguna (*zero backend computation*).
     - Menghitung pemotongan baris (*word-wrapping*) otomatis untuk teks Arab dan Latin agar tidak terpotong.
  2. **Komponen Dialog Pembuat Poster (`src/components/reader/AyahPosterModal.tsx`):**
     - Pilihan Rasio Kanvas:
       - **1:1 (Persegi 1080×1080 px):** Ideal untuk postingan feed Instagram, Facebook, dan foto profil.
       - **9:16 (Vertikal 1080×1920 px):** Ideal untuk Status WhatsApp, Instagram Story, dan TikTok.
     - Pilihan 4 Preset Tema Ornamen Islami:
       - *Zamrud Madinah:* Nuansa hijau tua elegan dengan aksen garis emas masjid Nabawi.
       - *Safir Malam:* Nuansa biru gelap syahdu bertabur ornamen geometris Islam.
       - *Mihrab Emas:* Nuansa krem hangat dengan bingkai ukiran mihrab klasik.
       - *Mawar Senja:* Nuansa ungu sepia lembut yang ramah untuk pembaca lansia.
     - Pratinjau Langsung (*Live Interactive Preview*): Setiap perubahan rasio atau tema langsung ter-render seketika.
  3. **Aksi Pembagian & Pengunduhan 1-Klik:**
     - Tombol **"Unduh Gambar PNG"**: Menyimpan berkas gambar berkualitas tinggi langsung ke galeri gawai pengguna.
     - Tombol **"Bagikan ke WhatsApp"**: Memanfaatkan Web Share API (`navigator.share`) dengan lampiran gambar, atau fallback pembuatan tautan langsung `https://api.whatsapp.com/send?text=...`.
  4. **Pemicu pada Kartu Ayat:**
     - Menambahkan tombol aksi berikon gambar (*Image / Share Card*) pada bilah utilitas di bawah `AyahCard.tsx`.
* **Kriteria Selesai (DoD):** Poster ayat dapat digenerate secara mulus pada rasio 1:1 dan 9:16 dalam 4 tema visual, file PNG dapat diunduh tanpa cacat piksel, dan tombol bagikan WhatsApp berfungsi pada smartphone maupun desktop.

---

### Step 25: Lingkaran Khatam Bersama Keluarga (*Family Khatam Circle*)
* **Status:** **Selesai (Done)**
* **Tujuan:** Menghidupkan kebiasaan membaca Al-Qur'an di dalam keluarga melalui pembagian tugas Juz atau 'Ain tilawah secara gotong-royong, dengan pelacak visual yang menenangkan dan bebas tekanan kompetitif.
* **Tugas Spesifik:**
  1. **Struktur Data Grup Khatam Keluarga (`src/services/familyCircle.ts` & `server/index.js`):**
     - Model grup: ID unik, nama keluarga (misal: "Keluarga Besar Bani Fulan"), target khatam (Khatam Ramadhan, Khatam Bulanan, Rutin Santai), status pembagian 30 Juz / 554 'Ain.
     - Setiap anggota keluarga memiliki peran: Inisiator (Kepala Grup) atau Anggota Jamaah.
  2. **Antarmuka Manajemen Grup Tilawah (`src/components/khatam/FamilyCirclePage.tsx`):**
     - Halaman pembuatan grup baru dan form input nama anggota keluarga.
     - Pembuatan kode undangan unik (*Invite Code / Share Link*) yang dapat dikirimkan lewat WhatsApp untuk mengundang anak, cucu, kakek, atau nenek.
     - Penugasan mandiri atau acak: Anggota dapat memilih Juz yang ingin dibaca (misal Ayah Juz 1–3, Ibu Juz 4–6, Kakek 'Ain Surat Al-Baqarah).
  3. **Visualisasi Cincin Kemajuan Keluarga (*Circular Family Progress Ring*):**
     - Diagram lingkaran interaktif 30 segmen juz yang berubah warna saat anggota keluarga menandai juz yang telah tuntas dibaca.
     - Notifikasi apresiasi santun: Pesan kebahagiaan ketika salah satu anggota merampungkan juz-nya (*"Alhamdulillah, Nenek telah menyelesaikan Juz 30"*).
  4. **Integrasi Akun & Sinkronisasi:**
     - Terkoneksi dengan sistem login dan database PostgreSQL melalui endpoint `/api/family-circles`.
     - Dukungan mode luring lokal (`localStorage`) jika digunakan secara mandiri di satu perangkat tablet keluarga.
* **Kriteria Selesai (DoD):** Pengguna terdaftar dapat membuat grup tilawah keluarga, membagikan kode undangan, membagi 30 juz secara interaktif, menandai progres penyelesaian, dan memantau lingkaran kemajuan bersama secara real-time.

---

### Step 26: Portal Laporan Analitik Ibadah Jamaah (`/report`), Worship Report Card & Standarisasi Tombol Kembali Universal
* **Status:** **Selesai (Done)**
* **Tujuan:** Menyediakan standarisasi desain tombol navigasi kembali yang seragam dan elegan di seluruh modul aplikasi, serta pusat rekapitulasi data ibadah personal yang komprehensif bagi pengguna terdaftar, merangkum pencapaian tilawah Al-Qur'an, kepatuhan shalat 5 waktu & sunnah, capaian tahfidz hafalan, serta dzikir harian ke dalam satu halaman laporan bermakna.
* **Tugas Spesifik:**
  1. **Standarisasi Komponen Tombol Kembali Universal (`src/components/common/BackToMushafButton.tsx`):**
     - Membangun komponen tombol kembali tunggal, konsisten, dan ramah lansia (`min-h-[40px]`, ikon panah `ArrowLeft`, label teks jelas `"Kembali ke Mushaf"` / kustom, `rounded-xl`, `border`, `bg-card`, hover halus, dan responsif).
     - Menggantikan seluruh tombol kembali beraneka ragam di semua modul: `AsmaulHusnaCatalog`, `TasbihPage`, `ProphetsCatalog`, `BlogCatalog`, `BlogDetailView`, `PrayersCatalog`, `QiblaCompass`, `MosqueMap`, `HadithCatalog`, `FamilyCirclePage`, `UserPortal`, `AdminPortal`, dan modul laporan baru.
  2. **Layanan Agregator Metrik Ibadah (`src/services/reportAnalytics.ts`):**
     - Mengumpulkan dan mengolah data dari berbagai modul:
       - Tilawah Al-Qur'an: Total ayat dibaca, durasi waktu, sebaran juz, konsistensi harian.
       - Disiplin Shalat: Persentase shalat tepat waktu, total shalat fardhu tercatat, shalat berjamaah vs munfarid.
       - Tahfidz: Jumlah surah/ayat dalam daftar hafalan, skor kelancaran tes masker.
       - Dzikir Tasbih: Total ketukan dzikir, rekap amalan Asmaul Husna dan doa harian.
  3. **Halaman Dashboard Analitik (`src/components/report/WorshipReportPage.tsx`):**
     - Rute baru terproteksi `/report` khusus pengguna terdaftar.
     - Ringkasan KPI Ibadah dalam 4 kartu istiqomah: *Tilawah Score*, *Prayer Compliance*, *Memorization Progress*, dan *Dhikr Count*.
     - Grafik tren aktivitas harian dan mingguan menggunakan SVG Canvas lokal yang ringan dan bebas ketergantungan berat.
     - Kalender panas (*Activity Heatmap*) yang menampilkan intensitas interaksi dengan Al-Qur'an sepanjang bulan.
  4. **Worship Report Card Generator (`src/components/report/WorshipReportCard.tsx`):**
     - Komponen kartu infografis ringkasan mingguan/bulanan berdesain kartu penghargaan santun (*"Laporan Istiqomah Ibadah"*).
     - Generator gambar PNG resolusi tinggi berbasis Canvas untuk diunduh atau dibagikan ke keluarga / media sosial.
  5. **Proteksi Akses & Tautan Menu:**
     - Session Guard: Tamu diarahkan ke halaman login/daftar sebelum mengakses `/report`.
     - Tautan menu langsung "Laporan Ibadah" pada Menu Drawer 3-Garis dan Portal Pengguna (`/user`).
* **Kriteria Selesai (DoD):** Seluruh modul memiliki bentuk tombol kembali yang seragam dan konsisten, halaman `/report` berhasil mengonsolidasikan seluruh data riwayat ibadah secara akurat, grafik tren tersaji responsif pada desktop dan smartphone, serta fitur unduh *Worship Report Card* menghasilkan infografis bersih tanpa error.

---

### Step 27: Kalender Hijriah, Penanda Puasa Sunnah & Kalkulator Zakat
* **Status:** **Selesai (Done)**
* **Tujuan:** Menghadirkan kalender penanggalan Islam (Hijriah) yang terhubung dengan kalender Masehi, lengkap dengan deteksi jadwal puasa sunnah serta kalkulator hisab zakat komprehensif.
* **Tugas Spesifik:**
  1. **Mesin Konversi Penanggalan Hijriah (`src/services/hijriCalendar.ts`):**
     - Mengimplementasikan algoritma konversi hisab penanggalan Hijriah terakreditasi (metode Umm al-Qura / Kemenag RI dengan penyesuaian koreksi hisab ±1 hingga ±2 hari).
     - Deteksi otomatis hari-hari amalan sunnah:
       - Puasa Senin dan Kamis.
       - Puasa Ayyamul Bidh (tanggal 13, 14, dan 15 setiap bulan Hijriah).
       - Hari-hari besar Islam (1 Muharram, Asyura 10 Muharram, Maulid Nabi, Isra Mi'raj, Nisfu Sya'ban, Ramadhan, Idul Fitri, Arafah 9 Dzulhijjah, Idul Adha & Hari Tasyrik).
  2. **Halaman Kalender Interaktif (`src/components/calendar/HijriCalendarPage.tsx`):**
     - Rute baru `/kalender` menampilkan grid kalender bulanan dwibahasa (tanggal Masehi dan tanggal Hijriah berdampingan).
     - Penanda lencana warna lembut pada tanggal puasa sunnah, dilengkapi detail dalil keutamaan puasa bila diklik.
  3. **Modul Kalkulator Zakat Komprehensif (`src/components/zakat/ZakatCalculatorModal.tsx`):**
     - **Zakat Maal (Harta & Emas):** Perhitungan nisab 85 gram emas, haul 1 tahun, tarif 2.5%, dengan input harga emas per gram terkini (dapat disesuaikan manual).
     - **Zakat Penghasilan / Profesi:** Perhitungan nisab senilai 524 kg beras, penghasilan bulanan bruto/netto, dan pengeluaran pokok.
     - **Zakat Fitrah:** Perhitungan beras 2.5 kg / 3.5 liter atau konversi rupiah per jiwa keluarga.
     - Rangkuman total kewajiban zakat, fidyah, dan sedekah, serta doa ketika menyerahkan zakat.
* **Kriteria Selesai (DoD):** Penanggalan Hijriah tampil akurat di halaman `/kalender`, penanda puasa sunnah tampil jelas, dan kalkulator zakat menghasilkan hitungan matematis tepat sesuai kaidah fiqih kontemporer.

---

### Step 28: Audio Lantunan Azan Otomatis (Auto-Adhan) & Notifikasi Masuk Waktu Shalat
* **Status:** Menunggu Step 27
* **Tujuan:** Memastikan pengguna tidak pernah melewatkan waktu shalat dengan melantunkan suara azan merdu secara otomatis ketika jadwal shalat fardhu tiba, dilengkapi notifikasi layar dan adab doa sesudah azan.
* **Tugas Spesifik:**
  1. **Mesin Audio Azan Otomatis (`src/services/adhanAudio.ts`):**
     - Menghubungkan perhitungan jadwal shalat astronomis (`src/services/prayerTimes.ts`) dengan interval timer peramban (`setInterval` presisi tinggi dengan koreksi drift).
     - Menyediakan pustaka berkas audio lantunan azan berformat kompresi efisien (AAC/MP3 Web-optimized):
       - *Muadzin Makkah Al-Mukarramah* (suara khusyuk Masjidil Haram).
       - *Muadzin Madinah Al-Munawwarah* (suara syahdu Masjid Nabawi).
       - *Muadzin Masjid Al-Aqsa* (suara penuh wibawa).
       - *Muadzin Kemenag Nusantara* (langgam khas Nusantara).
       - *Muadzin Khusus Subuh* (melantunkan lafadz *Ash-shalatu khairum minan naum*).
  2. **Mode Konfigurasi Fleksibel per Waktu Shalat:**
     - Pengguna dapat memilih mode azan untuk masing-masing waktu (Subuh, Dzuhur, Ashar, Maghrib, Isya):
       - *Full Adhan:* Lantunan azan lengkap 3–4 menit.
       - *Takbir Saja (Short Chime):* Hanya kumandang takbir awal 30 detik (cocok untuk lingkungan kantor).
       - *Nada Lembut / Beep:* Suara lonceng kristal pendek.
       - *Mode Senyap (Mute):* Hanya notifikasi visual tanpa audio.
  3. **Pop-up Dialog Panggilan Shalat (`src/components/prayer/AdhanPlayerModal.tsx`):**
     - Muncul otomatis saat waktu shalat masuk: kaligrafi lafadz azan, hitung mundur menuju waktu berikutnya, tombol **"Heningkan Suara (Mute)"**, dan teks doa sesudah azan berharakat beserta artinya.
  4. **Integrasi Notifikasi Layar (Web Notification API & PWA):**
     - Meminta izin notifikasi peramban (`Notification.requestPermission()`).
     - Mengirim notifikasi sistem di desktop dan smartphone bahkan saat tab diminimalkan atau layar mati (melalui Service Worker background handler).
* **Kriteria Selesai (DoD):** Lantunan audio azan terdengar otomatis saat detik waktu shalat tiba, muadzin dapat diganti sesuai preferensi, tombol heningkan berfungsi seketika, dan notifikasi peramban muncul tanpa hambatan.

---

### Step 29: Pelacak Kepatuhan Shalat (Prayer Checklist) & Pengingat Bertahap (Smart Reminders)
* **Status:** Menunggu Step 28
* **Tujuan:** Membantu jamaah menjaga disiplin shalat 5 waktu secara konsisten melalui checklist interaktif harian serta sistem pengingat bertahap ramah (*smart reminder*) yang mencegah shalat terlewatkan.
* **Tugas Spesifik:**
  1. **Widget Checklist Shalat Harian (`src/components/prayer/PrayerChecklistWidget.tsx`):**
     - Terpasang pada Header Navbar, Drawer Menu, dan Modal Jadwal Shalat.
     - 5 tombol centang interaktif (Subuh, Dzuhur, Ashar, Maghrib, Isya) ditambah 2 shalat sunnah utama (Dhuha & Tahajud).
     - Opsi rincian status saat mencentang:
       - *Tepat Waktu (On-Time)*
       - *Berjamaah di Masjid*
       - *Munfarid (Sendiri di Rumah)*
  2. **Mesin Pengingat Bertahap (*Tiered Smart Reminder*) (`src/services/prayerReminder.ts`):**
     - Logika pemantauan status centang sejak waktu shalat masuk:
       - **Reminder I (10 Menit Pasca-Masuk Waktu):** Notifikasi halus: *"Waktu Dzuhur telah berjalan 10 menit. Mari sejenak mengambil air wudhu."*
       - **Reminder II (20 Menit Pasca-Masuk Waktu):** Notifikasi peringatan: *"Waktu Dzuhur telah berjalan 20 menit. Dirikanlah shalat untuk ketenangan jiwa."*
       - **Reminder Kustom:** Pengguna dapat menentukan interval tambahan (misal: 30 menit atau 45 menit).
       - **Peringatan Waktu Segera Berakhir (*Pre-Expiry Warning*):** Notifikasi 15 menit sebelum masuk waktu shalat berikutnya (*"Waktu Ashar tersisa 15 menit lagi"*).
  3. **Mekanisme Pembatalan Otomatis (*Auto-Clear Reminder*):**
     - Segera setelah pengguna mencentang tombol shalat, seluruh timer pengingat untuk waktu shalat tersebut otomatis dibatalkan (*cleared*).
  4. **Penyimpanan Data Riwayat Shalat:**
     - Data tersimpan di `localStorage` (untuk tamu) dan disinkronkan ke database PostgreSQL tabel `prayer_logs` untuk pengguna berakun, yang langsung menjadi input bagi portal laporan `/report`.
* **Kriteria Selesai (DoD):** Checklist shalat merespons centang dengan umpan balik visual dan haptic, sistem reminder bertahap memicu notifikasi pada interval yang tepat, serta riwayat shalat tersimpan aman di database.

---

### Step 30: Kumpulan Doa Sehari-hari (*Hisnul Muslim*) & Panduan Shalat Bergambar
* **Status:** Menunggu Step 29
* **Tujuan:** Menyediakan perisai doa harian dari bangun tidur hingga kembali terlelap bersumber dari kitab masyhur *Hisnul Muslim* (Benteng Seorang Muslim), serta panduan shalat fardhu dan sunnah yang shahih dan mudah dipahami.
* **Tugas Spesifik:**
  1. **Penyusunan Dataset Mandiri (`public/data/hisnul_muslim.json`):**
     - Menghimpun 100+ doa harian terstandar, dikelompokkan ke dalam kategori:
       - Doa Rutinitas Harian (Bangun/Tidur, Masuk/Keluar Kamar Mandi, Berpakaian, Makan/Minum).
       - Doa Rumah Tangga & Keluarga (Masuk/Keluar Rumah, Hubungan Suami Istri, Mendoakan Orang Tua & Anak).
       - Doa Perjalanan & Alam (Bepergian, Berkendara, Masuk Pasar, Hujan, Petir, Angin Kencang).
       - Doa Perlindungan & Penawar Duka (Memohon Perlindungan dari Bahaya, Penyakit, Utang, Was-was, dan Kesedihan).
     - Setiap doa memuat: teks Arab berharakat, transliterasi Latin, arti bahasa Indonesia, dan perawi hadits shahih.
  2. **Halaman Katalog Doa Harian (`src/components/prayers/HisnulMuslimCatalog.tsx`):**
     - Rute `/doa-harian` dengan bilah pencarian cepat instan, tombol filter kategori, tombol penanda favorit, dan fitur salin teks.
     - Audio pelafalan doa berbasis Web Speech API dan TTS Arab luring.
  3. **Modul Panduan Shalat Bergambar (`src/components/prayers/SalahGuideModal.tsx`):**
     - Panduan rukun shalat fardhu langkah demi langkah dilengkapi ilustrasi gerakan shalat yang benar.
     - Panduan khusus shalat sunnah: Shalat Dhuha, Shalat Tahajud & Witir, Shalat Istikharah, Shalat Taubat, Shalat Hajat, dan Shalat Jenazah (4 takbir lengkap dengan doa per takbir).
* **Kriteria Selesai (DoD):** Modul `/doa-harian` beroperasi dengan navigasi cepat tanpa latensi, seluruh teks doa dapat dibaca dan didengarkan, serta panduan shalat fardhu dan sunnah dapat dipelajari dengan mudah oleh lansia dan mualaf.

---

### Step 31: Mode Uji Hafalan (Tahfidz Masker), Audio Looper A-B & Navigasi Suara AI
* **Status:** Menunggu Step 30
* **Tujuan:** Menjadikan QuranWeb mitra terbaik para penghafal Al-Qur'an (huffadz) dan jamaah yang ingin melancarkan juz 'amma, melalui teknologi sensor kata interaktif (*tahfidz masker*), pengulang audio repetisi A-B, serta kontrol navigasi suara bebas sentuh tangan (*hands-free page turner*).
* **Tugas Spesifik:**
  1. **Mode Masker Sensor Kata (*Tahfidz Masker Controls*) (`src/components/reader/TahfidzMaskerControls.tsx`):**
     - Toggle aktivasi "Mode Tahfidz" pada toolbar tilawah mushaf.
     - Pilihan 3 Tingkat Kesulitan Masker:
       - *Tingkat 1 (Mudah):* Menutupi 2 kata terakhir di setiap ayat untuk menguji ingatan penutup ayat (*fawashil*).
       - *Tingkat 2 (Sedang):* Menutupi separuh kata di tengah ayat secara berselang-seling.
       - *Tingkat 3 (Mutqin):* Menutupi seluruh teks Arab ayat (menjadi siluet kabur).
     - Interaktivitas Ketukan: Mengetuk area ayat yang tertutup akan membuka teks selama 3 detik (*peek view*) lalu otomatis tertutup kembali, membantu memverifikasi ingatan tanpa membuka mushaf lain.
  2. **Pengulang Murottal Mandiri (*Audio Looper Repeat A-B*) (`src/components/audio/AudioLooperControls.tsx`):**
     - Fitur penanda Titik A (awal ayat/potongan) dan Titik B (akhir ayat/potongan) pada bilah pemutar murottal.
     - Pilihan frekuensi pengulangan otomatis: 3x, 5x, 10x, atau Loop Tanpa Henti (*Infinite Repeat*) hingga hafalan benar-benar mutqin.
  3. **Navigasi Suara & Pembalik Halaman Bebas Sentuh (*Hands-Free Voice Turner*) (`src/services/voiceAssistant.ts`):**
     - Mengintegrasikan Web Speech Recognition API bawaan peramban (*zero external API cost*):
       - Perintah Suara Berpindah: *"Lanjut / Halaman Berikutnya"*, *"Kembali / Halaman Sebelumnya"*, *"Buka Surat Al-Kahfi"*, *"Mulai Murottal"*, *"Hening"*.
       - Sangat bermanfaat bagi jamaah lansia yang tangannya gemetar (*tremor*), memiliki keterbatasan gerak fisik, atau sedang memegang mushaf fisik sambil mencocokkan bacaan.
* **Kriteria Selesai (DoD):** Mode masker kata bekerja mulus di seluruh 114 surah, audio murottal dapat di-loop pada rentang A-B tanpa jeda rusak, dan perintah suara dapat membalik halaman dengan akurasi pengenalan tinggi.

---

## 4. Skema Integrasi Database & API Backend Fase 3

Untuk mendukung sinkronisasi data antar-perangkat bagi pengguna terdaftar pada Fase 3, skema database PostgreSQL di `server/index.js` diperkaya dengan tabel-tabel berikut:

```sql
-- 1. Tabel Riwayat Shalat Harian
CREATE TABLE IF NOT EXISTS prayer_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    prayer_date DATE NOT NULL,
    prayer_name VARCHAR(20) NOT NULL, -- 'subuh', 'dzuhur', 'ashar', 'maghrib', 'isya', 'dhuha', 'tahajud'
    status VARCHAR(20) NOT NULL,      -- 'on_time', 'late', 'congregation', 'missed'
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, prayer_date, prayer_name)
);

-- 2. Tabel Lingkaran Khatam Keluarga
CREATE TABLE IF NOT EXISTS family_circles (
    id SERIAL PRIMARY KEY,
    circle_name VARCHAR(100) NOT NULL,
    invite_code VARCHAR(16) UNIQUE NOT NULL,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(30) DEFAULT 'monthly', -- 'monthly', 'ramadhan', 'casual'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS family_circle_members (
    id SERIAL PRIMARY KEY,
    circle_id INTEGER REFERENCES family_circles(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    assigned_juz INTEGER[] DEFAULT '{}',
    completed_juz INTEGER[] DEFAULT '{}',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(circle_id, user_id)
);

-- 3. Tabel Konfigurasi Preferensi Azan & Reminder
CREATE TABLE IF NOT EXISTS user_prayer_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    muazzin_voice VARCHAR(50) DEFAULT 'makkah',
    subuh_mode VARCHAR(20) DEFAULT 'full',
    dzuhur_mode VARCHAR(20) DEFAULT 'full',
    ashar_mode VARCHAR(20) DEFAULT 'full',
    maghrib_mode VARCHAR(20) DEFAULT 'full',
    isya_mode VARCHAR(20) DEFAULT 'full',
    reminder_10m BOOLEAN DEFAULT TRUE,
    reminder_20m BOOLEAN DEFAULT TRUE,
    custom_reminder_minutes INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Riwayat Hafalan & Tahfidz
CREATE TABLE IF NOT EXISTS tahfidz_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    surah_id INTEGER NOT NULL,
    start_ayah INTEGER NOT NULL,
    end_ayah INTEGER NOT NULL,
    mastery_level VARCHAR(20) DEFAULT 'learning', -- 'learning', 'fluent', 'mutqin'
    last_tested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, surah_id, start_ayah, end_ayah)
);
```

---

## 5. Matriks Pengujian & Verifikasi Kualitas (Quality Assurance Phase 3)

| ID Uji | Modul Target | Prosedur Pengujian | Hasil yang Diharapkan | Status |
| :---: | :--- | :--- | :--- | :---: |
| **QA-3.01** | Hadits Arba'in | Buka rute `/hadits`, cari kata kunci "Niat", dan ubah ukuran font. | Tampil Hadits No. 1 riwayat Umar bin Khattab, font membesar tanpa tumpang tindih. | **Passed** |
| **QA-3.02** | Tafsir Kemenag | Klik lencana *"Tafsir"* pada QS Al-Fatihah ayat 1 di mushaf tilawah. | Muncul modal dengan tab Tafsir Wajiz dan Tahlili resmi Kemenag RI, respons < 150ms. | **Passed** |
| **QA-3.03** | Poster Maker | Klik ikon poster pada ayat, pilih tema *Mihrab Emas* rasio 9:16, unduh PNG. | File gambar PNG beresolusi 1080×1920 tersimpan di gawai dengan tipografi Arab tajam. | **Passed** |
| **QA-3.04** | Family Circle | Buat grup keluarga, salin link undangan, dan buka pada akun anggota lain. | Anggota baru berhasil bergabung dan memilih Juz penugasan tilawah. | **Passed** |
| **QA-3.05** | Portal `/report` | Akses `/report` setelah menyelesaikan tilawah dan centang shalat. | Grafik tren ter-update, total ayat dan skor kepatuhan shalat terakumulasi akurat. | **Passed** |
| **QA-3.06** | Kalender Hijriah | Buka `/kalender`, periksa penanda puasa Ayyamul Bidh bulan berjalan. | Tanggal 13, 14, 15 Hijriah bertanda lencana puasa sunnah dengan dalil sahih. | **Passed** |
| **QA-3.07** | Audio Azan | Simulasikan waktu saat shalat Maghrib masuk dengan memajukan jam uji. | Lantunan suara muadzin Makkah berbunyi otomatis dan modal panggilan shalat muncul. | Pending |
| **QA-3.08** | Smart Reminder | Biarkan waktu shalat masuk tanpa dicentang selama 10 dan 20 menit. | Notifikasi pengingat bertahap muncul di menit ke-10 dan ke-20; batal saat dicentang. | Pending |
| **QA-3.09** | Hisnul Muslim | Buka `/doa-harian`, klik doa sebelum tidur, tekan tombol dengarkan audio. | Web Speech membacakan lafadz Arab / terjemahan doa dengan intonasi jelas. | Pending |
| **QA-3.10** | Tahfidz Masker | Aktifkan Mode Masker Tingkat 3 pada QS An-Nas, ketuk ayat untuk intip (*peek*). | Seluruh ayat tersamarkan; ketukan membuka teks selama 3 detik lalu tertutup kembali. | Pending |

---

## 6. Penataan Service Worker & Caching Luring PWA v9

Untuk mendukung ketersediaan luring penuh seluruh fitur Fase 3, Service Worker ditingkatkan ke **Cache Version 9 (`quranweb-cache-v9`)**:

1. **Precache Aset Inti Fase 3:**
   - `/data/arbain_hadith.json`
   - `/data/hisnul_muslim.json`
   - `/data/tafsir/surah_info.json`
   - Audio azan pendek & chime takbir Web Audio API.
2. **Dynamic Cache:**
   - File dataset tafsir per surah `/data/tafsir/*.json` menggunakan strategi *Stale-While-Revalidate* berkuota maksimal 114 surah.
   - Ubin kalender Hijriah dan grafik laporan ibadah disimpan pada memori lokal *Cache Storage*.

---

## 7. Rangkuman Target Akhir Rilis Fase 3

Dengan tuntasnya eksekusi **DEV_STEP_3 (Step 22 s.d. Step 31)**, QuranWeb akan mencapai kematangan penuh:
- Bukan sekadar mushaf digital, melainkan **Pusat Ekosistem Spiritual Muslim Komprehensif**.
- Mengayomi seluruh anggota keluarga—dari kakek-nenek lansia, orang tua, hingga anak-cucu generasi muda.
- Terbebas dari iklan komersial yang mengganggu kekhusyukan, berdiri kokoh sebagai **Waqaf Digital Peradaban Islam** yang abadi.

---
*Dokumen ini merupakan cetak biru resmi urutan pengembangan teknis Fase 3 (DEV_STEP_3.md) yang siap dieksekusi langkah demi langkah oleh tim pengembang.*
