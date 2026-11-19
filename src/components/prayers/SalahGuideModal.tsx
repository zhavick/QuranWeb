import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Square,
  Info,
  Clock,
  Heart,
} from 'lucide-react';
import { SalahStepGuide, SunnahPrayerGuide } from '../../types/hisnulMuslim';
import { playDuaVoice, stopDuaVoice } from '../../services/hisnulMuslim';

interface SalahGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  elderMode?: boolean;
}

export const SALAH_STEPS: SalahStepGuide[] = [
  {
    stepNumber: 1,
    type: 'niat',
    title: '1. Niat & Berdiri Tegak (Qiyam)',
    subtitle: 'Menghadap Kiblat dengan Khusyuk',
    ruling: 'Rukun',
    arabic: 'أُصَلِّي فَرْضَ (الظُّهْرِ/الْعَصْرِ...) مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
    latin: "Ushallii fardhadh-... mustaqbilal-qiblati adaa-an lillaahi Ta'aalaa.",
    translation: 'Aku berniat shalat fardhu (...) menghadap kiblat, tunai karena Allah Ta\'ala.',
    description: 'Niat bertempat di dalam hati berbarengan dengan Takbiratul Ihram. Berdiri tegak lurus menghadap kiblat adalah rukun shalat bagi yang mampu secara fisik. Jika lansia atau sakit tidak mampu berdiri, diperbolehkan shalat sambil duduk di kursi atau berbaring miring.',
    tips: [
      'Pandangan mata diarahkan ke tempat sujud untuk menjaga kekhusyukan.',
      'Kedua kaki dibuka wajar selebar bahu, tidak terlalu renggang dan tidak terlalu rapat.',
    ],
    illustrationType: 'standing',
  },
  {
    stepNumber: 2,
    type: 'takbir',
    title: '2. Takbiratul Ihram & Bersedekap',
    subtitle: 'Mengangkat Kedua Tangan Sejajar Bahu/Telinga',
    ruling: 'Rukun',
    arabic: 'اللَّهُ أَكْبَرُ',
    latin: 'Allaahu Akbar.',
    translation: 'Allah Maha Besar.',
    description: 'Mengangkat kedua telapak tangan terbuka dengan jari-jari merapat wajar hingga setinggi bahu atau ujung daun telinga seraya mengucapkan lafadz takbir. Setelah itu, meletakkan tangan kanan di atas punggung tangan kiri, pergelangan, atau lengan di atas dada atau di bawah dada di atas pusar.',
    tips: [
      'Ucapkan takbir dengan suara yang terdengar oleh telinga sendiri.',
      'Tangan kanan memegang pergelangan tangan kiri dengan tenang dan tidak bergerak-gerak.',
    ],
    illustrationType: 'takbir',
  },
  {
    stepNumber: 3,
    type: 'iftitah',
    title: '3. Doa Iftitah (Istiftah)',
    subtitle: 'Doa Pembuka Shalat Sunnah Muakkad',
    ruling: 'Sunnah Muakkad',
    arabic: 'وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالأَرْضَ حَنِيفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ، إِنَّ صَلاَتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ، لاَ شَرِيكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ',
    latin: "Wajjahtu wajhiya lilladzii fatharos-samaawaati wal-ardho haniifam-muslimaw-wa maa ana minal-musyrikiin. Inna sholaatii wa nusukii wa mahyaaya wa mamaatii lillaahi Robbil-'aalamiin. Laa syariika lahuu wa bidzaalika umirtu wa ana minal-muslimiin.",
    translation: 'Aku hadapkan wajahku kepada Dzat yang menciptakan langit dan bumi dengan lurus dan berserah diri, dan aku bukanlah termasuk orang-orang musyrik. Sesungguhnya shalatku, ibadahku, hidupku, dan matiku hanyalah untuk Allah Tuhan seluruh alam, tiada sekutu bagi-Nya dan dengan demikianlah aku diperintahkan dan aku termasuk orang-orang yang berserah diri.',
    description: 'Dibaca perlahan (sirr) setelah takbiratul ihram sebelum membaca ta\'awwudz dan surat Al-Fatihah.',
    tips: [
      'Boleh juga membaca versi "Allahumma ba\'id baini wa baina khathayaya" yang shahih dalam riwayat Bukhari-Muslim.',
      'Membaca ta\'awwudz: A\'uudzu billaahi minasy-syaithoonir-rojiim.',
    ],
    illustrationType: 'iftitah',
  },
  {
    stepNumber: 4,
    type: 'fatihah',
    title: '4. Membaca Surat Al-Fatihah & Ayat Pendek',
    subtitle: 'Induk Kitab yang Wajib Dibaca Setiap Rakaat',
    ruling: 'Rukun',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    latin: "Bismillaahir-Rohmaanir-Rohiim. Alhamdulillaahi Robbil-'aalamiin. Ar-Rohmaanir-Rohiim. Maaliki yaumid-diin. Iyyaaka na'budu wa iyyaaka nasta'iin. Ihdinash-shiroothol-mustaqiim. Shirootholladziina an'amta 'alaihim ghoiril-maghdhuubi 'alaihim waladh-dhoolliin.",
    translation: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam. Yang Maha Pengasih lagi Maha Penyayang. Pemilik hari pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan. Tunjukilah kami jalan yang lurus, (yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.',
    description: 'Al-Fatihah adalah rukun wajib di setiap rakaat shalat fardhu maupun sunnah. Tidak sah shalat orang yang tidak membaca Surat Al-Fatihah. Disunnahkan mengucapkan "Aamiin" setelah selesai membaca ayat terakhir.',
    tips: [
      'Baca dengan tartil dan perhatikan makhraj serta panjang-pendek tajwid huruf.',
      'Pada rakaat ke-1 dan ke-2, sunnah melanjutkan dengan membaca salah satu surat pendek atau potongan ayat Al-Qur\'an.',
    ],
    illustrationType: 'fatihah',
  },
  {
    stepNumber: 5,
    type: 'ruku',
    title: '5. Ruku\' & Thuma\'ninah',
    subtitle: 'Membungkukkan Punggung Lurus Sejajar',
    ruling: 'Rukun',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
    latin: "Subhaana Robbiyal-'Azhiimi wa bihamdih.",
    translation: 'Maha Suci Tuhanku Yang Maha Agung dan dengan memuji-Nya.',
    description: 'Mengangkat tangan bertakbir seraya membungkuk. Posisi punggung lurus mendatar sehingga seandainya diletakkan bejana air di atasnya tidak tumpah. Kedua telapak tangan memegang lutut dengan jemari meregang kuat seperti mencengkeram lutut.',
    tips: [
      'Wajib thuma\'ninah (diam sejenak minimal selama ucapan satu kali tasbih).',
      'Bacaan tasbih diulang 3 kali dengan khusyuk meresapi keagungan Allah.',
    ],
    illustrationType: 'ruku',
  },
  {
    stepNumber: 6,
    type: 'itidal',
    title: '6. Bangkit dari Ruku\' (I\'tidal) & Thuma\'ninah',
    subtitle: 'Berdiri Tegak Kembali dengan Tenang',
    ruling: 'Rukun',
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
    latin: "Sami'allaahu liman hamidah. Robbanaa wa lakal-hamdu hamdan katsiiron thoyyiban mubaarokan fiih.",
    translation: 'Semoga Allah mendengar pujian orang yang memuji-Nya. Wahai Tuhan kami, bagi-Mu segala puji, pujian yang banyak, baik, lagi penuh keberkahan padanya.',
    description: 'Bangkit dari ruku\' sambil mengangkat kedua tangan setinggi bahu/telinga seraya mengucapkan "Sami\'allahu liman hamidah", lalu berdiri tegak lurus kembali dengan thuma\'ninah membaca doa tahmid.',
    tips: [
      'Jangan terburu-buru sujud sebelum seluruh persendian tulang kembali tegak lurus.',
    ],
    illustrationType: 'itidal',
  },
  {
    stepNumber: 7,
    type: 'sujud',
    title: '7. Sujud Pertama dengan 7 Anggota Badan',
    subtitle: 'Puncak Kerendahan Hamba di Hadapan Sang Khalik',
    ruling: 'Rukun',
    arabic: 'سُبْحَانَ رَبِّيَ الأَعْلَى وَبِحَمْدِهِ',
    latin: "Subhaana Robbiyal-A'laa wa bihamdih.",
    translation: 'Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya.',
    description: 'Turun bersujud bertakbir tanpa mengangkat tangan. Sujud wajib menempelkan 7 anggota badan ke lantai: dahi beserta hidung, kedua telapak tangan, kedua lutut, dan ujung jari-jemari kedua kaki yang ditekuk menghadap kiblat.',
    tips: [
      'Lengan atas direnggangkan dari lambung (bagi laki-laki), siku tidak boleh menempel ke lantai seperti anjing.',
      'Tasbih sujud dibaca minimal 3 kali dengan thuma\'ninah.',
    ],
    illustrationType: 'sujud',
  },
  {
    stepNumber: 8,
    type: 'iftirasy',
    title: '8. Duduk di Antara Dua Sujud (Iftirasy)',
    subtitle: 'Duduk di Atas Telapak Kaki Kiri',
    ruling: 'Rukun',
    arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
    latin: "Robbighfir lii warhamnii wajburnii warfa'nii warzuqnii wahdinii wa 'aafinii wa'fu 'annii.",
    translation: 'Wahai Tuhanku, ampunilah aku, sayangilah aku, cukupkanlah kekuranganku, tinggikanlah derajatku, karuniakanlah rezeki kepadaku, berilah aku petunjuk, sehatkanlah aku, dan maafkanlah kesalahanku.',
    description: 'Bangkit bertakbir dari sujud pertama lalu duduk iftirasy: membentangkan telapak kaki kiri dan mendudukinya, sedangkan kaki kanan ditegakkan dengan jari-jari ditekuk menghadap kiblat. Kedua telapak tangan diletakkan di atas paha dekat lutut.',
    tips: [
      'Wajib thuma\'ninah dan membaca doa permohonan ampunan yang komprehensif ini.',
      'Setelah itu bertakbir dan melakukan Sujud Kedua persis seperti sujud pertama.',
    ],
    illustrationType: 'iftirasy',
  },
  {
    stepNumber: 9,
    type: 'tasyahud_akhir',
    title: '9. Duduk Tasyahud Akhir (Tawarruk) & Shalawat',
    subtitle: 'Membaca Tahiyyat, Shalawat Ibrahimiyah & Doa',
    ruling: 'Rukun',
    arabic: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ، السَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ. اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ...',
    latin: "At-tahiyyaatul-mubaarokaatush-sholawaatuth-thoyyibaatu lillaah, as-salaamu 'alaika ayyuhan-Nabiyyu wa rohmatullaahi wa barokaatuh, as-salaamu 'alainaa wa 'alaa 'ibaadillaahis-shoolihiin. Asyhadu an laa ilaaha illallaah wa asyhadu anna Muhammadar-Rosuulullaah. Allaahumma sholli 'alaa Muhammad...",
    translation: 'Segala penghormatan yang penuh berkah, salawat dan kebaikan adalah milik Allah. Semoga keselamatan, rahmat Allah dan berkah-Nya tercurah kepadamu wahai Nabi. Semoga keselamatan tercurah kepada kami dan hamba-hamba Allah yang saleh. Aku bersaksi bahwa tiada sesembahan selain Allah dan aku bersaksi bahwa Muhammad adalah utusan Allah. Ya Allah, curahkanlah selawat kepada Muhammad...',
    description: 'Pada rakaat terakhir shalat, duduk tawarruk: memasukkan kaki kiri di bawah betis kanan dan mendudukkan pantat langsung ke lantai. Telunjuk tangan kanan diangkat/diacungkan saat membaca syahadat tauhid.',
    tips: [
      'Lengkapi dengan Shalawat Ibrahimiyah hingga selesai.',
      'Sunnah membaca doa perlindungan dari 4 perkara (azab neraka, azab kubur, fitnah kehidupan/kematian, dan dajjal).',
    ],
    illustrationType: 'tasyahud',
  },
  {
    stepNumber: 10,
    type: 'salam',
    title: '10. Mengucapkan Salam ke Kanan dan ke Kiri',
    subtitle: 'Penutup Rukun Shalat',
    ruling: 'Rukun',
    arabic: 'السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    latin: "As-salaamu 'alaikum wa rohmatullaah.",
    translation: 'Semoga keselamatan dan rahmat Allah tercurah kepada kalian.',
    description: 'Menolehkan wajah ke sebelah kanan hingga pipi putih terlihat dari belakang seraya mengucapkan salam pertama (rukun). Kemudian menolehkan wajah ke sebelah kiri seraya mengucapkan salam kedua (sunnah).',
    tips: [
      'Niatkan menyapa para malaikat pencatat amal dan jamaah shalat di sekeliling Anda.',
      'Selesai salam, lanjutkan dengan istighfar 3x dan dzikir ba\'da shalat.',
    ],
    illustrationType: 'salam',
  },
];

export const SUNNAH_PRAYERS: SunnahPrayerGuide[] = [
  {
    id: 'dhuha',
    name: 'Shalat Sunnah Dhuha',
    arabicName: 'صَلاَةُ الضُّحَى',
    rakats: '2 s.d. 8 Rakaat (dikerjakan tiap 2 rakaat salam)',
    timing: 'Sejak matahari naik setinggi tombak (sekitar 15-20 menit setelah terbit/syuruq) hingga menjelang waktu Dzuhur (saat matahari tepat di atas kepala).',
    virtue: 'Menggantikan sedekah untuk seluruh 360 persendian tubuh manusia setiap hari, serta dicatat sebagai hamba yang bertobat (awwaabiin).',
    procedure: [
      'Niat shalat Dhuha 2 rakaat lillahi Ta\'ala.',
      'Rakaat 1: Al-Fatihah dilanjutkan Surat Asy-Syams atau Adh-Dhuha.',
      'Rakaat 2: Al-Fatihah dilanjutkan Surat Al-Lail atau Al-Ikhlas.',
      'Ruku\', sujud, dan tasyahud akhir sama persis seperti shalat fardhu 2 rakaat.',
      'Setelah salam, membaca doa khusus shalat Dhuha.',
    ],
    specialDua: {
      title: 'Doa Ba\'da Shalat Dhuha',
      arabic: 'اللَّهُمَّ إِنَّ الضُّحَاءَ ضُحَاؤُكَ، وَالْبَهَاءَ بَهَاؤُكَ، وَالْجَمَالَ جَمَالُكَ، وَالْقُوَّةَ قُوَّتُكَ، وَالْقُدْرَةَ قُدْرَتُكَ، وَالْعِصْمَةَ عِصْمَتُكَ. اللَّهُمَّ إِنْ كَانَ رِزْقِي فِي السَّمَاءِ فَأَنْزِلْهُ، وَإِنْ كَانَ فِي الأَرْضِ فَأَخْرِجْهُ، وَإِنْ كَانَ مُعَسَّرًا فَيَسِّرْهُ، وَإِنْ كَانَ حَرَامًا فَطَهِّرْهُ، وَإِنْ كَانَ بَعِيدًا فَقَرِّبْهُ، بِحَقِّ ضُحَائِكَ وَبَهَائِكَ وَجَمَالِكَ وَقُوَّتِكَ وَقُدْرَتِكَ، آتِنِي مَا آتَيْتَ عِبَادَكَ الصَّالِحِينَ',
      latin: "Allaahumma innadh-dhuhaa-a dhuhaa-uka, wal-bahaa-a bahaa-uka, wal-jamaala jamaaluka, wal-quwwata quwwatuka, wal-qudrota qudrotuka, wal-'ishmata 'ishmatuka. Allaahumma in kaana rizqii fis-samaa-i fa-anzilhu, wa in kaana fil-ardhi fa-akhrijhu, wa in kaana mu'assaron fa-yassirhu, wa in kaana harooman fa-thohhirhu, wa in kaana ba'iidan fa-qorribhu, bi-haqqi dhuhaa-ika wa bahaa-ika wa jamaalika wa quwwatika wa qudrotika, aatinii maa aataita 'ibaadakas-shoolihiin.",
      translation: 'Ya Allah, sesungguhnya waktu dhuha adalah waktu dhuha-Mu, keagungan adalah keagungan-Mu, keindahan adalah keindahan-Mu, kekuatan adalah kekuatan-Mu, kekuasaan adalah kekuasaan-Mu, dan perlindungan adalah perlindungan-Mu. Ya Allah, jika rezekiku masih di atas langit maka turunkanlah, jika di dalam bumi maka keluarkanlah, jika sukar maka mudahkanlah, jika haram maka sucikanlah, jika jauh maka dekatkanlah, dengan hak waktu dhuha-Mu, keagungan-Mu, keindahan-Mu, kekuatan-Mu, dan kekuasaan-Mu, limpahkanlah kepadaku apa yang Engkau limpahkan kepada hamba-hamba-Mu yang saleh.',
      source: 'Doa Matsur Ulama Ahlussunnah Wal Jamaah',
    },
  },
  {
    id: 'tahajud',
    name: 'Shalat Tahajud & Qiyamul Lail',
    arabicName: 'صَلاَةُ التَّهَجُّدِ',
    rakats: 'Minimal 2 Rakaat hingga 8 Rakaat (ditutup Witir ganjil)',
    timing: 'Pada sepertiga malam terakhir setelah bangun tidur malam (antara pukul 01.30 s.d. sebelum masuk Subuh).',
    virtue: 'Kedudukan terpuji (Maqamam Mahmuda), doa dikabulkan, pintu taubat terbuka lebar, dan ciri khas hamba-hamba pilihan Allah.',
    procedure: [
      'Disyaratkan telah tidur malam terlebih dahulu walaupun sebentar.',
      'Mengawali dengan 2 rakaat ringan (khafifatain).',
      'Dilanjutkan rakaat panjang dengan bacaan tartil dan perenungan tadabbur.',
      'Berdoa di saat sujud panjang.',
      'Menutup rangkaian malam dengan shalat Witir 1 atau 3 rakaat.',
    ],
    specialDua: {
      title: 'Doa Tahajud Rasulullah SAW',
      arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَاوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَاوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ، أَنْتَ الْحَقُّ وَوَعْدُكَ الْحَقُّ وَقَوْلُكَ الْحَقُّ وَلِقَاؤُكَ الْحَقُّ وَالْجَنَّةُ حَقٌّ وَالنَّارُ حَقٌّ وَالنَّبِيُّونَ حَقٌّ وَمُحَمَّدٌ حَقٌّ وَالسَّاعَةُ حَقٌّ...',
      latin: "Allaahumma lakal-hamdu Anta nuurus-samaawaati wal-ardhi wa man fiihinna, wa lakal-hamdu Anta qoyyimus-samaawaati wal-ardhi wa man fiihinna, Antal-Haqqu wa wa'dukal-haqqu wa qoulukal-haqqu wa liqoo-uka haqqun wal-jannatu haqqun wan-naaru haqqun wan-nabiyyuuna haqqun wa Muhammadun haqqun was-saa'atu haqqun...",
      translation: 'Ya Allah, bagi-Mu segala puji, Engkaulah Cahaya langit dan bumi serta apa yang ada di dalamnya. Bagi-Mu segala puji, Engkaulah Pengurus langit dan bumi serta apa yang ada di dalamnya. Engkaulah Yang Maha Benar, janji-Mu adalah benar, firman-Mu adalah benar, pertemuan dengan-Mu adalah benar, surga adalah benar, neraka adalah benar, para nabi adalah benar, Muhammad adalah benar, dan hari kiamat adalah benar...',
      source: 'HR. Bukhari no. 1120 & Muslim no. 769',
    },
  },
  {
    id: 'istikharah',
    name: 'Shalat Sunnah Istikharah',
    arabicName: 'صَلاَةُ الاِسْتِخَارَةِ',
    rakats: '2 Rakaat salam',
    timing: 'Kapan saja di luar waktu yang diharamkan shalat, paling utama di keheningan malam.',
    virtue: 'Mendapat bimbingan langsung dari Allah dalam menentukan keputusan penting (pekerjaan, jodoh, studi, dll.) agar terhindar dari penyesalan.',
    procedure: [
      'Berniat shalat sunnah istikharah 2 rakaat.',
      'Rakaat 1: membaca Al-Fatihah dan Al-Kafirun.',
      'Rakaat 2: membaca Al-Fatihah dan Al-Ikhlas.',
      'Selesai salam, memuji Allah, bershalawat kepada Nabi, kemudian membaca doa Istikharah sambil menyebutkan perkara yang dihadapi.',
    ],
    specialDua: {
      title: 'Doa Khusus Istikharah',
      arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ، وَتَعْلَمُ وَلاَ أَعْلَمُ، وَأَنْتَ عَلاَّمُ الْغُيُوبِ...',
      latin: "Allaahumma innii astakhiiruka bi-'ilmika, wa astaqdiruka bi-qudrotika, wa as-aluka min fadhlikal-'azhiim, fa-innaka taqdiru wa laa aqdir, wa ta'lamu wa laa a'lam, wa Anta 'Allaamul-ghuyuub...",
      translation: 'Ya Allah, sesungguhnya aku memohon petunjuk pilihan kepada-Mu dengan ilmu-Mu, memohon kekuatan kepada-Mu dengan kodrat-Mu, dan memohon karunia-Mu yang agung. Karena sesungguhnya Engkau Maha Kuasa sedang aku tidak berkuasa, Engkau Maha Mengetahui sedang aku tidak mengetahui...',
      source: 'HR. Bukhari no. 1166',
    },
  },
  {
    id: 'jenazah',
    name: 'Shalat Jenazah (Fardhu Kifayah)',
    arabicName: 'صَلاَةُ الْجَنَازَةِ',
    rakats: '4 Takbir Berdiri Tegak (Tanpa Ruku\' dan Sujud)',
    timing: 'Setelah jenazah dimandikan dan dikafani.',
    virtue: 'Mendapatkan pahala sebesar 1 Gunung Qirath (sebesar Gunung Uhud) bagi yang menyalatkan jenazah.',
    procedure: [
      'Berdiri tegak menghadap kiblat dengan posisi imam di arah kepala jenazah laki-laki atau pinggang jenazah perempuan.',
      'Takbir ke-1: Membaca Surat Al-Fatihah secara sirr.',
      'Takbir ke-2: Mengangkat tangan bertakbir, lalu membaca Shalawat Ibrahimiyah.',
      'Takbir ke-3: Mengangkat tangan bertakbir, lalu mendoakan jenazah dengan khusyuk.',
      'Takbir ke-4: Mengangkat tangan bertakbir, membaca doa penutup keluarga, lalu salam ke kanan dan ke kiri.',
    ],
    specialDua: {
      title: 'Doa Takbir ke-3 untuk Jenazah',
      arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الأَبْيَضَ مِنَ الدَّنَسِ، وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلاً خَيْرًا مِنْ أَهْلِهِ...',
      latin: "Allaahummaghfir lahu warhamhu wa 'aafihii wa'fu 'anhu, wa akrim nuzulahu, wa wassi' mudkholahu, waghsilhu bil-maa-i wits-tsalji wal-barod, wa naqqihii minal-khothooyaa kamaa naqqoitats-tsaubal-abyadho minad-danas, wa abdilhu daaron khoirom-min daarihi, wa ahlan khoirom-min ahlih...",
      translation: 'Ya Allah, ampunilah dia, rahmatilah dia, selamatkanlah dia dan maafkanlah kesalahannya. Muliakanlah tempat persinggahannya, lapangkanlah kuburnya, bersihkanlah dia dengan air, salju, dan es. Bersihkanlah dia dari kesalahan-kesalahannya sebagaimana Engkau membersihkan pakaian putih dari kotoran. Gantikanlah baginya rumah yang lebih baik dari rumahnya, dan keluarga yang lebih baik dari keluarganya...',
      source: 'HR. Muslim no. 963',
    },
  },
  {
    id: 'taubat',
    name: 'Shalat Sunnah Taubat',
    arabicName: 'صَلاَةُ التَّوْبَةِ',
    rakats: '2 Rakaat salam',
    timing: 'Kapan saja saat tergelincir dalam dosa atau merasa ingin memperbarui keimanan.',
    virtue: 'Membuka pintu pengampunan Ilahi, merontokkan beban dosa, dan mengembalikan kesucian hati.',
    procedure: [
      'Berwudhu dengan sempurna membasuh seluruh anggota wudhu.',
      'Shalat 2 rakaat dengan penuh penyesalan dan thuma\'ninah.',
      'Memperbanyak istighfar dan membaca Sayyidul Istighfar setelah salam.',
      'Bertekad kuat tidak mengulangi perbuatan maksiat dan menggantinya dengan amal kebaikan.',
    ],
    specialDua: {
      title: 'Doa Sayyidul Istighfar Ba\'da Shalat Taubat',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ',
      latin: "Allaahumma Anta Robbii laa ilaaha illaa Anta, kholaqtanii wa ana 'abduka, wa ana 'alaa 'ahdika wa wa'dika mastatho'tu, a'uudzu bika min syarri maa shona'tu, abuu-u laka bini'matika 'alayya, wa abuu-u bi-dzambii faghfir lii fa-innahu laa yaghfirudz-dzunuuba illaa Anta.",
      translation: 'Ya Allah, Engkaulah Tuhanku, tiada sesembahan yang berhak disembah selain Engkau. Engkau yang menciptakan aku dan aku adalah hamba-Mu. Aku memegang teguh perjanjian dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan apa yang telah kuperbuat. Aku mengakui nikmat-Mu atasku dan aku mengakui dosaku kepada-Mu, maka ampunilah aku karena sesungguhnya tiada yang dapat mengampuni dosa selain Engkau.',
      source: 'HR. Bukhari no. 6306',
    },
  },
];

export const SalahGuideModal: React.FC<SalahGuideModalProps> = ({
  isOpen,
  onClose,
  elderMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'fardhu' | 'sunnah'>('fardhu');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedSunnahId, setSelectedSunnahId] = useState<string>('dhuha');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const currentStep = SALAH_STEPS[currentStepIndex];
  const currentSunnah = SUNNAH_PRAYERS.find((s) => s.id === selectedSunnahId) || SUNNAH_PRAYERS[0];

  const handleNextStep = () => {
    stopDuaVoice();
    setIsPlayingAudio(false);
    if (currentStepIndex < SALAH_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    stopDuaVoice();
    setIsPlayingAudio(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handlePlayVoice = (text: string) => {
    if (isPlayingAudio) {
      stopDuaVoice();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    playDuaVoice(
      text,
      'ar',
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`relative flex flex-col max-h-[92vh] w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden ${
          elderMode ? 'text-base' : 'text-sm'
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                <span>Panduan Shalat Bergambar &amp; Doa Lengkap</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Fardhu &amp; Sunnah
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Tata cara shalat berlandaskan dalil hadits shahih ramah lansia &amp; mualaf
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopDuaVoice();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b bg-black/5 dark:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
          <button
            type="button"
            onClick={() => {
              stopDuaVoice();
              setIsPlayingAudio(false);
              setActiveTab('fardhu');
            }}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'fardhu'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-[var(--bg-card)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>🕋 10 Rukun Shalat Fardhu Bergambar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopDuaVoice();
              setIsPlayingAudio(false);
              setActiveTab('sunnah');
            }}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sunnah'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-[var(--bg-card)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>🌟 Panduan Shalat Sunnah &amp; Jenazah</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeTab === 'fardhu' ? (
            /* TAB 1: 10 RUKUN SHALAT FARDHU */
            <div className="space-y-5">
              {/* Step Navigation Pill Indicator */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-thin">
                {SALAH_STEPS.map((s, idx) => (
                  <button
                    key={s.stepNumber}
                    type="button"
                    onClick={() => {
                      stopDuaVoice();
                      setIsPlayingAudio(false);
                      setCurrentStepIndex(idx);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      currentStepIndex === idx
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{s.stepNumber}</span>
                    <span className="hidden md:inline">{s.title.split('.')[1]?.trim()}</span>
                  </button>
                ))}
              </div>

              {/* Main Step Card */}
              <div
                className="rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {/* Step Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        {currentStep.ruling}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)] font-medium">
                        Langkah {currentStepIndex + 1} dari {SALAH_STEPS.length}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mt-1 text-[var(--text-primary)]">
                      {currentStep.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">{currentStep.subtitle}</p>
                  </div>

                  {/* Audio Button */}
                  <button
                    type="button"
                    onClick={() => handlePlayVoice(currentStep.arabic)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer hover:bg-emerald-500/20 transition-colors"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Square className="h-3.5 w-3.5 fill-current" />
                        <span>Hentikan Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Dengarkan Lafadz</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Arabic Text Display */}
                <div
                  className="rounded-2xl p-4 sm:p-5 text-right border"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <p
                    className="font-arabic text-xl sm:text-2xl leading-loose font-normal text-emerald-800 dark:text-emerald-200"
                    dir="rtl"
                  >
                    {currentStep.arabic}
                  </p>
                </div>

                {/* Transliteration & Translation */}
                <div className="space-y-2">
                  <div className="text-xs sm:text-sm font-semibold italic text-emerald-700 dark:text-emerald-300">
                    &ldquo;{currentStep.latin}&rdquo;
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    <strong>Artinya:</strong> {currentStep.translation}
                  </div>
                </div>

                {/* Description & Fiqh Tips */}
                <div className="rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5 p-4 space-y-3">
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    {currentStep.description}
                  </p>

                  {currentStep.tips && currentStep.tips.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-accent)] flex items-center gap-1">
                        <Info className="h-3.5 w-3.5" />
                        <span>Catatan Adab &amp; Fiqh Shalat:</span>
                      </div>
                      <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-1">
                        {currentStep.tips.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Prev / Next Bottom Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Sebelumnya</span>
                </button>

                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  {currentStepIndex + 1} / {SALAH_STEPS.length}
                </span>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={currentStepIndex === SALAH_STEPS.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            /* TAB 2: PANDUAN SHALAT SUNNAH */
            <div className="space-y-5">
              {/* Sunnah Prayer Pill Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {SUNNAH_PRAYERS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      stopDuaVoice();
                      setIsPlayingAudio(false);
                      setSelectedSunnahId(s.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedSunnahId === s.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>

              {/* Sunnah Detail Card */}
              <div
                className="rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-start justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                      {currentSunnah.name}
                    </h3>
                    <p className="font-arabic text-base text-emerald-600 dark:text-emerald-400">
                      {currentSunnah.arabicName}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    {currentSunnah.rakats}
                  </span>
                </div>

                {/* Timing & Virtue Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] p-3 space-y-1">
                    <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Waktu Pelaksanaan:</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">{currentSunnah.timing}</p>
                  </div>

                  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] p-3 space-y-1">
                    <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Keutamaan Agung:</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">{currentSunnah.virtue}</p>
                  </div>
                </div>

                {/* Tata Cara Langkah */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Tata Cara Shalat:
                  </div>
                  <ol className="list-decimal pl-5 text-xs text-[var(--text-primary)] space-y-1.5 leading-relaxed">
                    {currentSunnah.procedure.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Doa Khusus */}
                {currentSunnah.specialDua && (
                  <div
                    className="rounded-2xl border p-4 sm:p-5 space-y-3"
                    style={{
                      backgroundColor: 'var(--bg-accent-soft)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-accent)] flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{currentSunnah.specialDua.title}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handlePlayVoice(currentSunnah.specialDua.arabic)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold cursor-pointer hover:bg-emerald-700 transition-colors"
                      >
                        {isPlayingAudio ? (
                          <>
                            <Square className="h-3 w-3 fill-current" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3" />
                            <span>Suara</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="rounded-xl p-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-right">
                      <p className="font-arabic text-lg sm:text-xl leading-loose font-normal text-emerald-800 dark:text-emerald-200" dir="rtl">
                        {currentSunnah.specialDua.arabic}
                      </p>
                    </div>

                    <p className="text-xs font-semibold italic text-emerald-700 dark:text-emerald-300">
                      &ldquo;{currentSunnah.specialDua.latin}&rdquo;
                    </p>

                    <p className="text-xs text-[var(--text-secondary)]">
                      <strong>Artinya:</strong> {currentSunnah.specialDua.translation}
                    </p>

                    <div className="text-[10px] text-[var(--text-secondary)] font-medium">
                      Sumber: {currentSunnah.specialDua.source}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t px-5 py-3.5 flex items-center justify-between bg-black/5 dark:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-xs text-[var(--text-secondary)]">
            Disusun berdasarkan tuntunan fiqh shahih Ahlussunnah wal Jamaah
          </span>

          <button
            type="button"
            onClick={() => {
              stopDuaVoice();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
