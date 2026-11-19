import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hadithList = [
  {
    id: 1,
    number: 1,
    title: "Niat dan Keikhlasan dalam Beramal",
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوِ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.",
    latin: "Innamal a'maalu bin-niyyaat, wa innamaa likullimri'in maa nawaa. Faman kaanat hijratuhuu ilallaahi wa rasuulih, fahijratuhuu ilallaahi wa rasuulih. Wa man kaanat hijratuhuu lidunyaa yushiibuhaa awimra'atin yankihuhaa, fahijratuhuu ilaa maa haajara ilayh.",
    translation: "Sesungguhnya setiap amalan bergantung pada niatnya, dan setiap orang hanya akan mendapatkan apa yang ia niatkan. Barangsiapa yang hijrahnya karena Allah dan Rasul-Nya, maka hijrahnya itu kepada Allah dan Rasul-Nya. Dan barangsiapa yang hijrahnya karena urusan dunia yang ingin diraihnya atau karena wanita yang ingin dinikahinya, maka hijrahnya sesuai dengan apa yang ia tuju.",
    rawi: "HR. Al-Bukhari (No. 1) & Muslim (No. 1907)",
    theme: "akidah",
    keyTakeaways: [
      "Niat adalah tolok ukur sah dan diterimanya amalan batiniah.",
      "Keikhlasan semata-mata mengharap ridha Allah membedakan amalan ibadah dari sekadar kebiasaan adat.",
      "Setiap perbuatan mubah bernilai pahala jika diniatkan untuk mendekatkan diri kepada Allah."
    ],
    relatedAyahs: [
      { surahId: 98, surahName: "Al-Bayyinah", ayahNumber: 5 },
      { surahId: 39, surahName: "Az-Zumar", ayahNumber: 2 }
    ]
  },
  {
    id: 2,
    number: 2,
    title: "Tingkatan Islam, Iman, dan Ihsan (Hadits Jibril)",
    arabic: "بَيْنَمَا نَحْنُ عِنْدَ رَسُولِ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ شَدِيدُ سَوَادِ الشَّعْرِ، لاَ يُرَى عَلَيْهِ أَثَرُ السَّفَرِ وَلاَ يَعْرِفُهُ مِنَّا أَحَدٌ... فَقَالَ: يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ... أَخْبِرْنِي عَنِ الإِيمَانِ... أَخْبِرْنِي عَنِ الإِحْسَانِ: أَنْ تَعْبُدَ اللهَ كَأَنَّكَ تَرَاهُ فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ.",
    latin: "Bainamaa nahnu 'inda Rasuulillaahi shallallaahu 'alayhi wa sallama dzaata yawmin idz thala'a 'alaynaa rajulun syadiidu bayaadhits-tsiyaabi syadiidu sawaadisy-sya'r, laa yuraa 'alayhi atsarus-safar wa laa ya'rifuhuu minnaa ahad... Faqaala: Yaa Muhammadu akhbirnii 'anil Islaam... akhbirnii 'anil Iimaan... akhbirnii 'anil Ihsaan: An ta'budallaaha ka'annaka taraahu fa illam takun taraahu fa innahuu yaraak.",
    translation: "Ketika kami sedang duduk bersama Rasulullah SAW pada suatu hari, tiba-tiba muncul seorang laki-laki yang berpakaian sangat putih dan berambut sangat hitam, tidak tampak padanya bekas perjalanan jauh dan tak seorang pun dari kami yang mengenalnya... Ia bertanya: 'Wahai Muhammad, kabarkan kepadaku tentang Islam... Iman... dan Ihsan.' Beliau menjawab: 'Ihsan adalah engkau beribadah kepada Allah seakan-akan engkau melihat-Nya. Jika engkau tidak dapat melihat-Nya, maka sesungguhnya Dia melihatmu.'",
    rawi: "HR. Muslim (No. 8)",
    theme: "akidah",
    keyTakeaways: [
      "Agama Islam mencakup tiga tingkatan: Islam (amalan lahir), Iman (keyakinan batin), dan Ihsan (kesadaran muraqabah).",
      "Pentingnya menjaga adab kesopanan dan kerapian pakaian dalam majelis ilmu.",
      "Malaikat Jibril datang dalam wujud manusia untuk mengajarkan pokok-pokok agama kepada para sahabat."
    ],
    relatedAyahs: [
      { surahId: 16, surahName: "An-Nahl", ayahNumber: 128 },
      { surahId: 26, surahName: "Asy-Syu'ara'", ayahNumber: 218 }
    ]
  },
  {
    id: 3,
    number: 3,
    title: "Lima Rukun Islam Sebagai Fondasi Bangunan Agama",
    arabic: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ.",
    latin: "Buniya al-Islaamu 'alaa khamsin: syahaadati an laa ilaaha illallaahu wa anna Muhammadar-Rasuulullaah, wa iqaamish-shalaah, wa iitaa'iz-zakaah, wa hajjil-bayti, wa shawmi Ramadhaan.",
    translation: "Islam dibangun di atas lima perkara: bersaksi bahwa tidak ada tuhan yang berhak disembah selain Allah dan bahwa Muhammad adalah utusan Allah, mendirikan shalat, menunaikan zakat, berhaji ke Baitullah, dan berpuasa di bulan Ramadhan.",
    rawi: "HR. Al-Bukhari (No. 8) & Muslim (No. 16)",
    theme: "ibadah",
    keyTakeaways: [
      "Islam diibaratkan seperti sebuah bangunan kokoh yang bertumpu pada lima tiang penyangga utama.",
      "Dua kalimat syahadat adalah fondasi dasar, sedangkan shalat adalah pilar paling agung.",
      "Kewajiban zakat, haji, dan puasa menyempurnakan ketundukan spiritual dan sosial seorang muslim."
    ],
    relatedAyahs: [
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 183 },
      { surahId: 3, surahName: "Ali 'Imran", ayahNumber: 97 }
    ]
  },
  {
    id: 4,
    number: 4,
    title: "Penciptaan Manusia di Rahim dan Ketetapan Takdir",
    arabic: "إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا نُطْفَةً، ثُمَّ يَكُونُ عَلَقَةً مِثْلَ ذَلِكَ، ثُمَّ يَكُونُ مُضْغَةً مِثْلَ ذَلِكَ، ثُمَّ يُرْسَلُ إِلَيْهِ الْمَلَكُ فَيَنْفُخُ فِيهِ الرُّوحَ، وَيُؤْمَرُ بِأَرْبَعِ كَلِمَاتٍ: بِكَتْبِ رِزْقِهِ، وَأَجَلِهِ، وَعَمَلِهِ، وَشَقِيٌّ أَوْ سَعِيدٌ...",
    latin: "Inna ahadakum yujma'u khalquhuu fii bathni ummihii arba'iina yawman nuthfah, tsumma yakuunu 'alaqatan mitsla dzaalik, tsumma yakuunu mudhghatan mitsla dzaalik, tsumma yursalu ilayhil-malaku fayanfukhu fiihir-ruuh, wa yu'maru bi-arba'i kalimaatin: bikatbi rizqihii, wa ajalihii, wa 'amalihii, wa syaqiyyun aw sa'iid...",
    translation: "Sesungguhnya setiap orang di antara kalian dikumpulkan penciptaannya dalam perut ibunya selama empat puluh hari berupa nuthfah (setetes mani), kemudian menjadi 'alaqah (segumpal darah) selama itu pula, kemudian menjadi mudhghah (segumpal daging) selama itu pula. Kemudian diutuslah malaikat kepadanya untuk meniupkan ruh padanya dan diperintahkan mencatat empat ketetapan: rezekinya, ajalnya, amalnya, serta apakah ia celaka atau bahagia...",
    rawi: "HR. Al-Bukhari (No. 3208) & Muslim (No. 2643)",
    theme: "akidah",
    keyTakeaways: [
      "Tahapan embrionologi penciptaan manusia membuktikan keagungan qudrah Allah SWT.",
      "Ketetapan takdir Allah (Qadha dan Qadar) telah tertulis sejak di alam rahim.",
      "Pentingnya senantiasa berdoa memohon ketetapan iman dan husnul khatimah hingga akhir hayat."
    ],
    relatedAyahs: [
      { surahId: 23, surahName: "Al-Mu'minun", ayahNumber: 12 },
      { surahId: 22, surahName: "Al-Hajj", ayahNumber: 5 }
    ]
  },
  {
    id: 5,
    number: 5,
    title: "Menolak Perkara Baru yang Mengada-Ada dalam Agama (Bid'ah)",
    arabic: "مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ فِيهِ فَهُوَ رَدٌّ.",
    latin: "Man ahdatsa fii amrinaa haadzaa maa laysa fiihi fahuwa radd.",
    translation: "Barangsiapa mengada-adakan perkara baru dalam urusan agama kami ini yang bukan berasal darinya, maka perkara tersebut tertolak.",
    rawi: "HR. Al-Bukhari (No. 2697) & Muslim (No. 1718)",
    theme: "ibadah",
    keyTakeaways: [
      "Ibadah bersifat tauqifiyyah (berdasarkan dalil wahyu syariat).",
      "Amalan ibadah yang tidak ada tuntunannya dari Rasulullah SAW tidak akan diterima di sisi Allah.",
      "Kewajiban menjaga kemurnian ajaran Islam dari segala bentuk penyimpangan."
    ],
    relatedAyahs: [
      { surahId: 59, surahName: "Al-Hasyr", ayahNumber: 7 },
      { surahId: 33, surahName: "Al-Ahzab", ayahNumber: 21 }
    ]
  },
  {
    id: 6,
    number: 6,
    title: "Menjauhi Syubhat dan Menjaga Kesucian Segumpal Daging (Hati)",
    arabic: "إِنَّ الْحَلاَلَ بَيِّنٌ وَإِنَّ الْحَرَامَ بَيِّنٌ، وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ لاَ يَعْلَمُهُنَّ كَثِيرٌ مِنَ النَّاسِ، فَمَنِ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ... أَلاَ وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ أَلاَ وَهِيَ الْقَلْبُ.",
    latin: "Innal halaala bayyinun wa innal haraama bayyinun, wa baynahumaa umuurun musytabihaatun laa ya'lamuhunna katsiirun minan-naas. Famanittaqasy-syubuhaatis-tabra'a lidiinihii wa 'irdhih... Alaa wa inna fil-jasadi mudhghatan idzaa shalahat shalahal-jasadu kulluh, wa idzaa fasadat fasadal-jasadu kulluh, alaa wa hiyal-qalb.",
    translation: "Sesungguhnya yang halal itu jelas dan yang haram itu jelas. Di antara keduanya terdapat perkara-perkara syubhat (samar-samar) yang tidak diketahui oleh kebanyakan manusia. Barangsiapa yang menjauhi perkara syubhat, maka ia telah menyelamatkan agama dan kehormatannya... Ketahuilah, di dalam tubuh terdapat segumpal daging; jika ia baik maka baiklah seluruh tubuh, dan jika ia rusak maka rusaklah seluruh tubuh. Ketahuilah, segumpal daging itu adalah hati.",
    rawi: "HR. Al-Bukhari (No. 52) & Muslim (No. 1599)",
    theme: "akhlak",
    keyTakeaways: [
      "Hukum syariat terbagi menjadi tiga: halal jelas, haram jelas, dan syubhat (samar).",
      "Sikap wara' (berhati-hati) dengan meninggalkan syubhat menjaga kesucian kehormatan seorang mukmin.",
      "Kebaikan seluruh anggota badan berpusat pada kebersihan dan ketakwaan hati."
    ],
    relatedAyahs: [
      { surahId: 26, surahName: "Asy-Syu'ara'", ayahNumber: 88 },
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 168 }
    ]
  },
  {
    id: 7,
    number: 7,
    title: "Agama Adalah Nasihat yang Tulus",
    arabic: "الدِّينُ النَّصِيحَةُ. قُلْنَا: لِمَنْ؟ قَالَ: للهِ، وَلِكِتَابِهِ، وَلِرَسُولِهِ، وَلِأَئِمَّةِ الْمُسْلِمِينَ، وَعَامَّتِهِمْ.",
    latin: "Ad-diinun-nashiihah. Qulnaa: Liman? Qaala: Lillaahi, wa likitaabihii, wa lirasuulihii, wa li-a'immatil-muslimiina, wa 'aammatihim.",
    translation: "Agama itu adalah nasihat. Kami bertanya: 'Untuk siapa?' Beliau bersabda: 'Untuk Allah, Kitab-Nya, Rasul-Nya, para pemimpin kaum muslimin, dan segenap kaum muslimin pada umumnya.'",
    rawi: "HR. Muslim (No. 55)",
    theme: "akidah",
    keyTakeaways: [
      "Nasihat bermakna ketulusan niat, kesetiaan, dan menghendaki kebaikan bagi pihak lain.",
      "Nasihat kepada Allah dan Kitab-Nya diwujudkan melalui keimanan, ketaatan, dan tadabbur Al-Qur'an.",
      "Nasihat kepada sesama muslim dilakukan dengan amar ma'ruf nahi munkar secara santun dan bijaksana."
    ],
    relatedAyahs: [
      { surahId: 103, surahName: "Al-'Asr", ayahNumber: 3 },
      { surahId: 7, surahName: "Al-A'raf", ayahNumber: 62 }
    ]
  },
  {
    id: 8,
    number: 8,
    title: "Kehormatan Darah, Harta, dan Hak Jiwa Muslim",
    arabic: "أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لاَ إِلَهَ إِلاَّ اللهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللهِ، وَيُقِيمُوا الصَّلاَةَ، وَيُؤْتُوا الزَّكَاةَ، فَإِذَا فَعَلُوا ذَلِكَ عَصَمُوا مِنِّي دِمَاءَهُمْ وَأَمْوَالَهُمْ إِلاَّ بِحَقِّ الإِسْلاَمِ، وَحِسَابُهُمْ عَلَى اللهِ.",
    latin: "Umirtu an uqaatilan-naasa hattaa yasy-haduu an laa ilaaha illallaahu wa anna Muhammadar-Rasuulullaah, wa yuqiimush-shalaah, wa yu'tuz-zakaah, fa idzaa fa'aluu dzaalika 'ashamuu minnii dimaa'ahum wa amwaalahum illaa bihaqqil-Islaam, wa hisaabuhum 'alallaah.",
    translation: "Aku diperintahkan untuk memerangi manusia hingga mereka bersaksi bahwa tidak ada tuhan selain Allah dan bahwa Muhammad adalah utusan Allah, mendirikan shalat, dan menunaikan zakat. Jika mereka telah melakukannya, maka darah dan harta mereka terlindungi dariku kecuali dengan hak Islam, dan hisab mereka diserahkan kepada Allah.",
    rawi: "HR. Al-Bukhari (No. 25) & Muslim (No. 22)",
    theme: "muamalah",
    keyTakeaways: [
      "Pengucapan dua kalimat syahadat serta penunaian rukun Islam menjamin perlindungan darah dan harta seseorang.",
      "Penilaian terhadap keimanan seseorang di dunia didasarkan pada bukti lahiriah, sedangkan urusan hati diserahkan kepada Allah.",
      "Tingginya nilai toleransi dan perlindungan hukum bagi jiwa yang telah menyatakan keislamannya."
    ],
    relatedAyahs: [
      { surahId: 9, surahName: "At-Taubah", ayahNumber: 5 },
      { surahId: 4, surahName: "An-Nisa'", ayahNumber: 94 }
    ]
  },
  {
    id: 9,
    number: 9,
    title: "Melaksanakan Perintah Sesuai Kesanggupan dan Menjauhi Larangan",
    arabic: "مَا نَهَيْتُكُمْ عَنْهُ فَاجْتَنِبُوهُ، وَمَا أَمَرْتُكُمْ بِهِ فَأْتُوا مِنْهُ مَا اسْتَطَعْتُمْ، فَإِنَّمَا أَهْلَكَ الَّذِينَ مِنْ قَبْلِكُمْ كَثْرَةُ مَسَائِلِهِمْ وَاخْتِلاَفُهُمْ عَلَى أَنْبِيَائِهِمْ.",
    latin: "Maa nahaytukum 'anhu fajtanibuuh, wa maa amartukum bihii fa'tuu minhu mastatha'tum, fa innamaa ahlakal-ladziina min qablikum katsratu masaa'ilihim wakhtilaafuhum 'alaa anbiyaa'ihim.",
    translation: "Apa yang aku larang atas kalian maka jauhilah seluruhnya, dan apa yang aku perintahkan kepada kalian maka laksanakanlah semampu kalian. Sesungguhnya yang membinasakan umat-umat sebelum kalian adalah banyaknya pertanyaan mereka yang tak perlu dan perselisihan mereka terhadap para nabi mereka.",
    rawi: "HR. Al-Bukhari (No. 7288) & Muslim (No. 1337)",
    theme: "ibadah",
    keyTakeaways: [
      "Larangan harus ditinggalkan secara mutlak tanpa kompromi.",
      "Perintah syariat dikerjakan sesuai batas kemampuan manusiawi tanpa memaksakan diri (kaidah kemudahan/rukshah).",
      "Menghindari perdebatan yang sia-sia dan pertanyaan hipotetis yang tidak membawa manfaat amal."
    ],
    relatedAyahs: [
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 286 },
      { surahId: 64, surahName: "At-Taghabun", ayahNumber: 16 }
    ]
  },
  {
    id: 10,
    number: 10,
    title: "Makan dari Sumber yang Halal dan Rahasia Terkabulnya Doa",
    arabic: "إِنَّ اللهَ تَعَالَى طَيِّبٌ لاَ يَقْبَلُ إِلاَّ طَيِّبًا... ثُمَّ ذَكَرَ الرَّجُلَ يُطِيلُ السَّفَرَ أَشْعَثَ أَغْبَرَ يَمُدُّ يَدَيْهِ إِلَى السَّمَاءِ: يَا رَبِّ يَا رَبِّ، وَمَطْعَمُهُ حَرَامٌ، وَمَشْرَبُهُ حَرَامٌ، وَمَلْبَسُهُ حَرَامٌ، وَغُذِيَ بِالْحَرَامِ، فَأَنَّى يُسْتَجَابُ لِذَلِكَ؟!",
    latin: "Innallaaha Ta'aalaa thayyibun laa yaqbalu illaa thayyibaa... Tsumma dzakarar-rajula yuthiilus-safara asy'atsa aghbara yamuddu yadayhi ilas-samaa': Yaa Rabbi yaa Rabb, wa math'amuhuu haraam, wa masyrabuhuu haraam, wa malbasuhuu haraam, wa ghudziya bil-haraam, fa-annaa yustajaabu lidzaalik?!",
    translation: "Sesungguhnya Allah Ta'ala itu Maha Baik dan tidak menerima kecuali yang baik... Kemudian beliau menceritakan seorang laki-laki yang menempuh perjalanan jauh, berambut kusut dan berdebu, ia menengadahkan kedua tangannya ke langit seraya berdoa: 'Wahai Rabbku, wahai Rabbku!' Padahal makanannya haram, minumannya haram, pakaiannya haram, dan ia tumbuh dari yang haram, maka bagaimana mungkin doanya akan dikabulkan?!",
    rawi: "HR. Muslim (No. 1015)",
    theme: "muamalah",
    keyTakeaways: [
      "Harta dan rezeki yang halal adalah syarat utama dikabulkannya doa dan diterimanya sedekah.",
      "Mengonsumsi barang haram menjadi hijab (penghalang) terkabulnya munajat seorang hamba.",
      "Adab berdoa: menengadahkan tangan dengan penuh ketundukan dan merendahkan diri kepada Allah."
    ],
    relatedAyahs: [
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 172 },
      { surahId: 23, surahName: "Al-Mu'minun", ayahNumber: 51 }
    ]
  },
  {
    id: 11,
    number: 11,
    title: "Meninggalkan yang Meragukan Menuju Kepastian Hati",
    arabic: "دَعْ مَا يَرِيبُكَ إِلَى مَا لاَ يَرِيبُكَ.",
    latin: "Da' maa yariibuka ilaa maa laa yariibuk.",
    translation: "Tinggalkanlah apa yang meragukanmu menuju apa yang tidak meragukanmu.",
    rawi: "HR. At-Tirmidzi (No. 2518) & An-Nasa'i (No. 5711) - Hadits Hasan Shahih",
    theme: "akhlak",
    keyTakeaways: [
      "Kebenaran menghadirkan ketenangan pada hati nurani, sedangkan kebatilan memicu keraguan dan kegelisahan.",
      "Pentingnya membangun prinsip kehati-hatian (wara') dalam urusan muamalah dan makanan.",
      "Menjaga kejernihan batin dari godaan bisikan syubhat."
    ],
    relatedAyahs: [
      { surahId: 49, surahName: "Al-Hujurat", ayahNumber: 12 }
    ]
  },
  {
    id: 12,
    number: 12,
    title: "Meninggalkan Hal yang Tidak Bermanfaat Adalah Tanda Kebaikan Islam",
    arabic: "مِنْ حُسْنِ إِسْلاَمِ الْمَرْءِ تَرْكُهُ مَا لاَ يَعْنِيهِ.",
    latin: "Min husni Islaamil-mar'i tarkuhuu maa laa ya'niih.",
    translation: "Termasuk tanda kebaikan keislaman seseorang adalah ia meninggalkan apa yang tidak bermanfaat baginya.",
    rawi: "HR. At-Tirmidzi (No. 2317) & Ibnu Majah (No. 3976) - Hadits Hasan",
    theme: "akhlak",
    keyTakeaways: [
      "Seorang muslim hendaknya memusatkan waktu dan pikirannya pada hal-hal yang bernilai ibadah dan kemaslahatan dunia-akhirat.",
      "Menghindari campur tangan dalam urusan pribadi orang lain yang bukan haknya.",
      "Disiplin waktu dan menjaga fokus hidup dari distraksi kesia-siaan."
    ],
    relatedAyahs: [
      { surahId: 23, surahName: "Al-Mu'minun", ayahNumber: 3 },
      { surahId: 28, surahName: "Al-Qashash", ayahNumber: 55 }
    ]
  },
  {
    id: 13,
    number: 13,
    title: "Kesempurnaan Iman: Mencintai Kebaikan untuk Saudara Seiman",
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.",
    latin: "Laa yu'minu ahadukum hattaa yuhibba li-akhiihi maa yuhibbu linafsih.",
    translation: "Tidak sempurna iman salah seorang di antara kalian sampai ia mencintai bagi saudaranya apa yang ia cintai untuk dirinya sendiri.",
    rawi: "HR. Al-Bukhari (No. 13) & Muslim (No. 45)",
    theme: "akhlak",
    keyTakeaways: [
      "Ukhuwah Islamiyah menuntut adanya rasa empati yang tulus terhadap sesama muslim.",
      "Menjauhi sifat iri, dengki (hasad), dan kebencian terhadap nikmat yang diperoleh orang lain.",
      "Merasa gembira ketika saudara mendapatkan kebaikan dan berduka ketika saudara ditimpa kesulitan."
    ],
    relatedAyahs: [
      { surahId: 49, surahName: "Al-Hujurat", ayahNumber: 10 },
      { surahId: 59, surahName: "Al-Hasyr", ayahNumber: 9 }
    ]
  },
  {
    id: 14,
    number: 14,
    title: "Kesucian Nyawa Seorang Muslim dan Batasan Hukum Qishash",
    arabic: "لاَ يَحِلُّ دَمُ امْرِئٍ مُسْلِمٍ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللهُ وَأَنِّي رَسُولُ اللهِ إِلاَّ بِإِحْدَى ثَلاَثٍ: الثَّيِّبُ الزَّانِي، وَالنَّفْسُ بِالنَّفْسِ، وَالتَّارِكُ لِدِينِهِ الْمُفَارِقُ لِلْجَمَاعَةِ.",
    latin: "Laa yahillu damu imri'in muslimin yasyhadu an laa ilaaha illallaahu wa annii rasuulullaahi illaa bi-ihdaa tsalaats: Ats-tsayyibuz-zaanii, wan-nafsu bin-nafs, wat-taariku lidiinihil-mufaariqu lil-jamaa'ah.",
    translation: "Tidak halal darah seorang muslim yang bersaksi bahwa tidak ada sesembahan yang benar selain Allah dan bahwa aku adalah utusan Allah, kecuali karena salah satu dari tiga perkara: orang yang telah menikah yang berzina, jiwa dibalas dengan jiwa (qishash pembunuhan sengaja), dan orang yang meninggalkan agamanya (murtad) serta memisahkan diri dari jamaah.",
    rawi: "HR. Al-Bukhari (No. 6878) & Muslim (No. 1676)",
    theme: "muamalah",
    keyTakeaways: [
      "Tingginya kemuliaan nyawa seorang muslim yang tidak boleh ditumpahkan tanpa hak syar'i.",
      "Ketetapan sanksi pidana dalam syariat Islam semata-mata untuk menjaga ketertiban umum dan kehormatan peradaban.",
      "Kewenangan penegakan hukum hanya berada di tangan otoritas hakim/pemerintah yang sah, bukan tindakan main hakim sendiri."
    ],
    relatedAyahs: [
      { surahId: 5, surahName: "Al-Ma'idah", ayahNumber: 32 },
      { surahId: 17, surahName: "Al-Isra'", ayahNumber: 33 }
    ]
  },
  {
    id: 15,
    number: 15,
    title: "Berkata Baik atau Diam, Memuliakan Tetangga dan Tamu",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ.",
    latin: "Man kaana yu'minu billaahi wal-yawmil-aakhiri falyaqul khayran aw liyashmut, wa man kaana yu'minu billaahi wal-yawmil-aakhiri falyukrim jaarah, wa man kaana yu'minu billaahi wal-yawmil-aakhiri falyukrim dhayfah.",
    translation: "Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah ia berkata yang baik atau diam. Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah ia memuliakan tetangganya. Dan barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah ia memuliakan tamunya.",
    rawi: "HR. Al-Bukhari (No. 6018) & Muslim (No. 47)",
    theme: "akhlak",
    keyTakeaways: [
      "Menjaga lisan dari ghibah, fitnah, dan perkataan sia-sia adalah bukti nyata keimanan.",
      "Menghormati hak-hak tetangga dan tidak mengganggu kenyamanan mereka.",
      "Kewajiban memuliakan tamu dengan pelayanan yang hangat dan tulus."
    ],
    relatedAyahs: [
      { surahId: 4, surahName: "An-Nisa'", ayahNumber: 36 },
      { surahId: 50, surahName: "Qaf", ayahNumber: 18 }
    ]
  },
  {
    id: 16,
    number: 16,
    title: "Wasiat Rasulullah: Jangan Marah",
    arabic: "أَنَّ رَجُلاً قَالَ لِلنَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: أَوْصِنِي، قَالَ: لاَ تَغْضَبْ، فَرَدَّدَ مِرَارًا، قَالَ: لاَ تَغْضَبْ.",
    latin: "Anna rajulan qaala lin-Nabiyyi shallallaahu 'alayhi wa sallama: Awshinii, qaala: Laa taghdhab, faraddada miraaraa, qaala: Laa taghdhab.",
    translation: "Bahwa seorang laki-laki berkata kepada Nabi SAW: 'Wasiatilah aku.' Beliau bersabda: 'Janganlah engkau marah.' Orang itu mengulangi permintaannya berulang kali, beliau tetap bersabda: 'Janganlah engkau marah.'",
    rawi: "HR. Al-Bukhari (No. 6116)",
    theme: "akhlak",
    keyTakeaways: [
      "Marah adalah pintu gerbang segala keburukan dan hilangnya akal sehat sesaat.",
      "Kekuatan sejati bukanlah menang dalam bergulat, melainkan mampu menguasai diri saat amarah memuncak.",
      "Anjuran meredam amarah dengan berwudhu, merubah posisi duduk/berbaring, dan membaca ta'awwudz."
    ],
    relatedAyahs: [
      { surahId: 3, surahName: "Ali 'Imran", ayahNumber: 134 },
      { surahId: 42, surahName: "Asy-Syura", ayahNumber: 37 }
    ]
  },
  {
    id: 17,
    number: 17,
    title: "Kewajiban Berbuat Ihsan (Kebaikan Profesional) dalam Segala Hal",
    arabic: "إِنَّ اللهَ كَتَبَ الإِحْسَانَ عَلَى كُلِّ شَيْءٍ، فَإِذَا قَتَلْتُمْ فَأَحْسِنُوا الْقِتْلَةَ، وَإِذَا ذَبَحْتُمْ فَأَحْسِنُوا الذِّبْحَةَ، وَلْيُحِدَّ أَحَدُكُمْ شَفْرَتَهُ، وَلْيُرِحْ ذَبِيحَتَهُ.",
    latin: "Innallaaha katabal-ihsaana 'alaa kulli syay', fa idzaa qataltum fa ahsinul-qitlah, wa idzaa dzabahtum fa ahsinudz-dzibhata, wal-yuhidda ahadukum syafratahuu wal-yurih dzabiihatah.",
    translation: "Sesungguhnya Allah telah mewajibkan berbuat ihsan (kebajikan dan profesionalisme) atas segala sesuatu. Maka apabila kalian membunuh (dalam peperangan/qishash) bunuhlah dengan cara yang baik, dan apabila kalian menyembelih maka sembelihlah dengan cara yang baik; hendaklah salah seorang di antara kalian menajamkan pisaunya dan memberi kenyamanan pada hewan sembelihannya.",
    rawi: "HR. Muslim (No. 1955)",
    theme: "muamalah",
    keyTakeaways: [
      "Prinsip ihsan mencakup seluruh aspek kehidupan, pekerjaan, ibadah, dan muamalah terhadap sesama makhluk.",
      "Kasih sayang Islam merangkul dunia satwa dengan melarang menyiksa hewan sembelihan.",
      "Menuntut kualitas dan keahlian terbaik (itqan) dalam mengerjakan setiap amanah."
    ],
    relatedAyahs: [
      { surahId: 16, surahName: "An-Nahl", ayahNumber: 90 },
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 195 }
    ]
  },
  {
    id: 18,
    number: 18,
    title: "Bertakwa di Mana pun Berada dan Berakhlak Mulia",
    arabic: "اتَّقِ اللهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ.",
    latin: "Ittaqillaaha haitsumaa kunta, wa atbi'is-sayyi'atal-hasanata tamhuhaa, wa khaaliqin-naasa bikhuluqin hasan.",
    translation: "Bertakwalah kepada Allah di mana pun engkau berada, iringilah perbuatan buruk dengan perbuatan baik niscaya kebaikan itu akan menghapusnya, dan pergauililah manusia dengan akhlak yang mulia.",
    rawi: "HR. At-Tirmidzi (No. 1987) - Hadits Hasan",
    theme: "akhlak",
    keyTakeaways: [
      "Ketakwaan tidak boleh bergantung pada tempat atau saat dilihat orang, melainkan kesadaran batin yang senantiasa hadir.",
      "Perbuatan dosa dan kekhilafan dapat dilebur dengan bersegera beristighfar dan memperbanyak amal kebajikan.",
      "Keluhuran akhlak adalah bukti nyata buah dari keimanan seorang hamba."
    ],
    relatedAyahs: [
      { surahId: 11, surahName: "Hud", ayahNumber: 114 },
      { surahId: 68, surahName: "Al-Qalam", ayahNumber: 4 }
    ]
  },
  {
    id: 19,
    number: 19,
    title: "Jagalah Allah Niscaya Allah Menjagamu (Wasiat Ibnu Abbas)",
    arabic: "يَا غُلاَمُ إِنِّي أُعَلِّمُكَ كَلِمَاتٍ: احْفَظِ اللهَ يَحْفَظْكَ، احْفَظِ اللهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللهِ، وَاعْلَمْ أَنَّ الأُمَّةَ لَوِ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوكَ بِشَيْءٍ لَمْ يَنْفَعُوكَ إِلاَّ بِشَيْءٍ قَدْ كَتَبَهُ اللهُ لَكَ...",
    latin: "Yaa ghulaamu innii u'allimuka kalimaat: Ihfazhillaaha yahfazhk, ihfazhillaaha tajid-hu tujaahak, idzaa sa'alta fas'alillaah, wa idzasta'anta fasta'in billaah, wa'lam annal-ummata lawijtama'at 'alaa an yanfa'uuka bisyay'in lam yanfa'uuka illaa bisyay'in qad katabahullaahu lak...",
    translation: "Wahai anak muda, sesungguhnya aku akan mengajarkan kepadamu beberapa kalimat: Jagalah Allah, niscaya Dia akan menjagamu. Jagalah Allah, niscaya engkau mendapati-Nya di hadapanmu. Jika engkau meminta, memohonlah kepada Allah; dan jika engkau memohon pertolongan, mintalah pertolongan kepada Allah. Ketahuilah bahwa seandainya seluruh umat bersatu padu untuk memberimu suatu manfaat, mereka tidak akan mampu melakukannya kecuali apa yang telah ditetapkan Allah bagimu...",
    rawi: "HR. At-Tirmidzi (No. 2516) - Hadits Hasan Shahih",
    theme: "akidah",
    keyTakeaways: [
      "Menjaga batasan-batasan perintah Allah mendatangkan pemeliharaan dan pertolongan ilahi.",
      "Memurnikan tauhid dalam berdoa, bertawakkal, dan bersandar hanya kepada Allah semata.",
      "Segala manfaat dan mudharat hakikatnya berada dalam genggaman takdir Allah Ta'ala."
    ],
    relatedAyahs: [
      { surahId: 1, surahName: "Al-Fatihah", ayahNumber: 5 },
      { surahId: 10, surahName: "Yunus", ayahNumber: 107 }
    ]
  },
  {
    id: 20,
    number: 20,
    title: "Rasa Malu Sebagian dari Panggilan Keimanan",
    arabic: "إِنَّ مِمَّا أَدْرَكَ النَّاسُ مِنْ كَلاَمِ النُّبُوَّةِ الأُولَى: إِذَا لَمْ تَسْتَحْيِ فَاصْنَعْ مَا شِئْتَ.",
    latin: "Inna mimmaa adrakan-naasu min kalaamin-nubuwwatil-uulaa: Idzaa lam tastahyi fashna' maa syi't.",
    translation: "Sesungguhnya salah satu ajaran yang didapati manusia dari ucapan para nabi terdahulu adalah: 'Jika engkau tidak punya rasa malu, maka perbuatlah apa yang engkau kehendaki.'",
    rawi: "HR. Al-Bukhari (No. 3484)",
    theme: "akhlak",
    keyTakeaways: [
      "Rasa malu (haya') adalah benteng pertahanan moral tertinggi yang mencegah manusia dari keburukan.",
      "Hilangnya rasa malu menyebabkan manusia berani mendurhakai aturan agama dan norma kesusilaan.",
      "Rasa malu kepada Allah menuntun seseorang merasa diawasi di manapun ia berada."
    ],
    relatedAyahs: [
      { surahId: 96, surahName: "Al-'Alaq", ayahNumber: 14 }
    ]
  },
  {
    id: 21,
    number: 21,
    title: "Kunci Keselamatan: Beriman Kepada Allah Lalu Beristiqomah",
    arabic: "قُلْتُ: يَا رَسُولَ اللهِ، قُلْ لِي فِي الإِسْلاَمِ قَوْلاً لاَ أَسْأَلُ عَنْهُ أَحَدًا غَيْرَكَ. قَالَ: قُلْ: آمَنْتُ بِاللهِ، ثُمَّ اسْتَقِمْ.",
    latin: "Qultu: Yaa Rasuulallaahi, qul lii fil-Islaami qawlan laa as'alu 'anhu ahadan ghayrak. Qaala: Qul: Aamantu billaahi, tsummastaqim.",
    translation: "Aku berkata: 'Wahai Rasulullah, katakanlah kepadaku suatu perkataan dalam Islam yang tidak akan aku tanyakan lagi kepada seorang pun selain engkau.' Beliau bersabda: 'Katakanlah: Aku beriman kepada Allah, kemudian istiqomahlah.'",
    rawi: "HR. Muslim (No. 38)",
    theme: "akidah",
    keyTakeaways: [
      "Istiqomah di atas jalan tauhid dan ketaatan adalah karamah terbesar seorang hamba.",
      "Islam merangkum keimanan yang kokoh di dalam hati dengan konsistensi amal perbuatan secara terus-menerus.",
      "Pahala agung bagi orang yang istiqomah: ketenangan jiwa dan jaminan surga."
    ],
    relatedAyahs: [
      { surahId: 41, surahName: "Fushshilat", ayahNumber: 30 },
      { surahId: 46, surahName: "Al-Ahqaf", ayahNumber: 13 }
    ]
  },
  {
    id: 22,
    number: 22,
    title: "Jalan Menuju Surga dengan Menunaikan Ibadah Fardhu",
    arabic: "أَنَّ رَجُلاً سَأَلَ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فَقَالَ: أَرَأَيْتَ إِذَا صَلَّيْتُ الْمَكْتُوبَاتِ، وَصُمْتُ رَمَضَانَ، وَأَحْلَلْتُ الْحَلاَلَ، وَحَرَّمْتُ الْحَرَامَ، وَلَمْ أَزِدْ عَلَى ذَلِكَ شَيْئًا، أَأَدْخُلُ الْجَنَّةَ؟ قَالَ: نَعَمْ.",
    latin: "Anna rajulan sa'ala Rasuulallaahi shallallaahu 'alayhi wa sallama faqaala: A-ra'ayta idzaa shallaytul-maktubaat, wa shumtu Ramadhaan, wa ahlaltul-halaal, wa harramtul-haraam, wa lam azid 'alaa dzaalika syay'aa, a-adkhulul-jannah? Qaala: Na'am.",
    translation: "Bahwa seorang laki-laki bertanya kepada Rasulullah SAW: 'Bagaimana pendapatmu jika aku menunaikan shalat-shalat fardhu, berpuasa di bulan Ramadhan, menghalalkan yang halal dan mengharamkan yang haram, dan aku tidak menambah sesuatu pun atas hal itu, apakah aku akan masuk surga?' Beliau menjawab: 'Ya.'",
    rawi: "HR. Muslim (No. 15)",
    theme: "ibadah",
    keyTakeaways: [
      "Menunaikan kewajiban-kewajiban pokok agama adalah jalan lurus dan terjamin menuju surga Allah.",
      "Pentingnya komitmen menjaga yang halal dan menjauhi yang haram dalam kehidupan sehari-hari.",
      "Kemudahan syariat Islam yang tidak membebani hamba-Nya melampaui kemampuan."
    ],
    relatedAyahs: [
      { surahId: 23, surahName: "Al-Mu'minun", ayahNumber: 1 },
      { surahId: 4, surahName: "An-Nisa'", ayahNumber: 31 }
    ]
  },
  {
    id: 23,
    number: 23,
    title: "Kesucian Sebagian dari Iman dan Keutamaan Dzikir",
    arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ للهِ تَمْلأُ الْمِيزَانَ، وَسُبْحَانَ اللهِ وَالْحَمْدُ للهِ تَمْلآنِ - أَوْ تَمْلأُ - مَا بَيْنَ السَّمَاءِ وَالأَرْضِ، وَالصَّلاَةُ نُورٌ، وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ، وَالْقُرْآنُ حُجَّةٌ لَكَ أَوْ عَلَيْكَ...",
    latin: "Ath-thuhuuru syathrul-iimaan, wal-hamdu lillaahi tamla'ul-miizaan, wa subhaanallaahi wal-hamdu lillaahi tamla'aani - aw tamla'u - maa baynas-samaa'i wal-ardh, wash-shalaatu nuur, wash-shadaqatu burhaan, wash-shabru dhiyaa', wal-Qur'aanu hujjatun laka aw 'alayk...",
    translation: "Kesucian itu adalah sebagian dari iman, kalimat 'Alhamdulillah' memenuhi timbangan amal, 'Subhanallah walhamdulillah' memenuhi antara langit dan bumi, shalat adalah cahaya, sedekah adalah bukti nyata, sabar adalah pelita yang menerangi, dan Al-Qur'an adalah pembelamu atau penuntutmu...",
    rawi: "HR. Muslim (No. 223)",
    theme: "ibadah",
    keyTakeaways: [
      "Thaharah lahiriah dan batiniah menempati kedudukan teramat agung dalam Islam.",
      "Dahsyatnya timbangan pahala kalimat tahmid dan tasbih di yaumil hisab.",
      "Al-Qur'an akan menjadi pembela bagi yang membaca dan mengamalkannya, atau penuntut bagi yang mengabaikannya."
    ],
    relatedAyahs: [
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 222 },
      { surahId: 9, surahName: "At-Taubah", ayahNumber: 108 }
    ]
  },
  {
    id: 24,
    number: 24,
    title: "Haramnya Berbuat Zhalim (Hadits Qudsi)",
    arabic: "يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي وَجَعَلْتُهُ بَيْنَكُمْ مُحَرَّمًا فَلاَ تَظَالَمُوا، يَا عِبَادِي كُلُّكُمْ ضَالٌّ إِلاَّ مَنْ هَدَيْتُهُ فَاسْتَهْدُونِي أَهْدِكُمْ، يَا عِبَادِي كُلُّكُمْ جَائِعٌ إِلاَّ مَنْ أَطْعَمْتُهُ فَاسْتَطْعِمُونِي أُطْعِمْكُمْ...",
    latin: "Yaa 'ibaadii innii harramtuzh-zhulma 'alaa nafsii wa ja'altuhuu baynakum muharraman falaa tazhaalamuu, yaa 'ibaadii kullukum dhaallun illaa man hadaytuhuu fastahduunii ahdikum, yaa 'ibaadii kullukum jaa'i'un illaa man ath'amtuhuu fastath'imuunii uth'imkum...",
    translation: "Wahai hamba-hamba-Ku, sesungguhnya Aku telah mengharamkan kezaliman atas diri-Ku dan Aku jadikan ia haram di antara kalian, maka janganlah kalian saling berbuat zalim! Wahai hamba-hamba-Ku, kalian semua tersesat kecuali orang yang Aku beri petunjuk, maka mintalah petunjuk kepada-Ku niscaya Aku beri kalian petunjuk! Wahai hamba-hamba-Ku, kalian semua lapar kecuali orang yang Aku beri makan, maka mintalah makan kepada-Ku niscaya Aku beri kalian makan!...",
    rawi: "HR. Muslim (No. 2577)",
    theme: "akidah",
    keyTakeaways: [
      "Kezaliman adalah kegelapan gulita di hari kiamat dan dilarang keras antar-manusia.",
      "Ketergantungan mutlak seluruh makhluk kepada hidayah, rezeki, dan perlindungan Allah.",
      "Ketaatan manusia tidak menambah kebesaran kerajaan Allah, dan kemaksiatan tidak sedikit pun mengurangi kekuasaan-Nya."
    ],
    relatedAyahs: [
      { surahId: 14, surahName: "Ibrahim", ayahNumber: 42 },
      { surahId: 40, surahName: "Ghafir", ayahNumber: 17 }
    ]
  },
  {
    id: 25,
    number: 25,
    title: "Luasnya Pintu Sedekah: Dzikir dan Setiap Kebaikan",
    arabic: "يَا رَسُولَ اللهِ، ذَهَبَ أَهْلُ الدُّثُورِ بِالأُجُورِ... قَالَ: أَوَلَيْسَ قَدْ جَعَلَ اللهُ لَكُمْ مَا تَصَّدَّقُونَ؟ إِنَّ بِكُلِّ تَسْبِيحَةٍ صَدَقَةً، وَكُلِّ تَكْبِيرَةٍ صَدَقَةً، وَكُلِّ تَحْمِيدَةٍ صَدَقَةً، وَكُلِّ تَهْلِيلَةٍ صَدَقَةً، وَأَمْرٌ بِالْمَعْرُوفِ صَدَقَةٌ، وَنَهْيٌ عَنْ مُنْكَرٍ صَدَقَةٌ...",
    latin: "Yaa Rasuulallaahi, dzahaba ahlud-dutsuuri bil-ujuur... Qaala: Awa laysa qad ja'alallaahu lakum maa tashshaddaquun? Inna bikulli tasbiihatin shadaqah, wa kulli takbiiratin shadaqah, wa kulli tahmiidatin shadaqah, wa kulli tahliilatin shadaqah, wa amrun bil-ma'ruufi shadaqah, wa nahyun 'an munkarin shadaqah...",
    translation: "Wahai Rasulullah, orang-orang kaya telah memborong banyak pahala... Beliau bersabda: 'Bukankah Allah telah menjadikan bagi kalian apa yang dapat kalian sedekahkan? Sesungguhnya setiap tasbih adalah sedekah, setiap takbir adalah sedekah, setiap tahmid adalah sedekah, setiap tahlil adalah sedekah, amar ma'ruf adalah sedekah, nahi munkar adalah sedekah, bahkan pada hubungan halal suami istri terdapat sedekah...'",
    rawi: "HR. Muslim (No. 1006)",
    theme: "ibadah",
    keyTakeaways: [
      "Pahala sedekah tidak terbatas pada materi atau uang saja.",
      "Dzikir lisan (tasbih, tahmid, takbir, tahlil) bernilai sedekah yang berbobot di sisi Allah.",
      "Menyalurkan syahwat pada jalan yang halal bernilai ibadah dan pahala sedekah."
    ],
    relatedAyahs: [
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 261 },
      { surahId: 3, surahName: "Ali 'Imran", ayahNumber: 133 }
    ]
  },
  {
    id: 26,
    number: 26,
    title: "Hak Sedekah pada Setiap Persendian Tubuh Manusia",
    arabic: "كُلُّ سُلاَمَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ، كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ: تَعْدِلُ بَيْنَ الاثْنَيْنِ صَدَقَةٌ، وَتُعِينُ الرَّجُلَ فِي دَابَّتِهِ فَتَحْمِلُهُ عَلَيْهَا أَوْ تَرْفَعُ لَهُ عَلَيْهَا مَتَاعَهُ صَدَقَةٌ، وَالْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ، وَكُلُّ خُطْوَةٍ تَمْشِيهَا إِلَى الصَّلاَةِ صَدَقَةٌ، وَتُمِيطُ الأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ.",
    latin: "Kullu sulaamaa minan-naasi 'alayhi shadaqah, kulla yawmin tathlu'u fiihisy-syams: ta'dilu baynats-naini shadaqah, wa tu'iinur-rajula fii daabbatihii fatahmiluhuu 'alayhaa aw tarfa'u lahuu 'alayhaa mataa'ahuu shadaqah, wal-kalimatuth-thayyibatu shadaqah, wa kullu khuthwatin tamsyiihaa ilash-shalaati shadaqah, wa tumiithul-adzaa 'anith-thariiqi shadaqah.",
    translation: "Setiap persendian manusia memiliki kewajiban sedekah setiap hari ketika matahari terbit: mendamaikan dua orang yang berselisih secara adil adalah sedekah, menolong seseorang menaiki kendaraannya atau mengangkat barang bawaannya adalah sedekah, perkataan yang baik adalah sedekah, setiap langkah kaki menuju shalat adalah sedekah, dan menyingkirkan duri/rintangan dari jalanan adalah sedekah.",
    rawi: "HR. Al-Bukhari (No. 2989) & Muslim (No. 1009)",
    theme: "muamalah",
    keyTakeaways: [
      "Bentuk rasa syukur atas nikmat kesehatan 360 persendian tubuh manusia diwujudkan melalui amal saleh harian.",
      "Menolong sesama, mendamaikan sengketa, dan menjaga ketertiban fasilitas umum bernilai ibadah agung.",
      "Setiap langkah menuju masjid untuk shalat berjamaah menghapus dosa dan meninggikan derajat."
    ],
    relatedAyahs: [
      { surahId: 4, surahName: "An-Nisa'", ayahNumber: 114 },
      { surahId: 14, surahName: "Ibrahim", ayahNumber: 7 }
    ]
  },
  {
    id: 27,
    number: 27,
    title: "Kebaikan Adalah Akhlak Mulia dan Dosa Menggelisahkan Hati",
    arabic: "الْبِرُّ حُسْنُ الْخُلُقِ، وَالإِثْمُ مَا حَاكَ فِي نَفْسِكَ وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ.",
    latin: "Al-birru husnul-khuluq, wal-itsmu maa haaka fii nafsika wa karihta an yaththali'a 'alayhin-naas.",
    translation: "Kebaikan (kebajikan) itu adalah akhlak yang mulia. Dan dosa itu adalah apa yang menggelisahkan hatimu dan engkau benci jika orang lain mengetahuinya.",
    rawi: "HR. Muslim (No. 2553)",
    theme: "akhlak",
    keyTakeaways: [
      "Hakikat kebajikan sejati terpancar melalui kelembutan tutur kata dan keluhuran pekerti.",
      "Hati nurani seorang mukmin memiliki radar alami yang merasa gelisah terhadap perbuatan dosa.",
      "Menghindari amalan yang memicu rasa malu bila terungkap di hadapan khalayak."
    ],
    relatedAyahs: [
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 177 },
      { surahId: 3, surahName: "Ali 'Imran", ayahNumber: 92 }
    ]
  },
  {
    id: 28,
    number: 28,
    title: "Berpegang Teguh pada Sunnah Nabi dan Khulafaur Rasyidin",
    arabic: "أُوصِيكُمْ بِتَقْوَى اللهِ، وَالسَّمْعِ وَالطَّاعَةِ وَإِنْ تَأَمَّرَ عَلَيْكُمْ عَبْدٌ، فَإِنَّهُ مَنْ يَعِشْ مِنْكُمْ بَعْدِي فَسَيَرَى اخْتِلاَفًا كَثِيرًا، فَعَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الْخُلَفَاءِ الرَّاشِدِينَ الْمَهْدِيِّينَ عَضُّوا عَلَيْهَا بِالنَّوَاجِذِ...",
    latin: "Uushiikum bitaqwallaah, was-sam'i wath-thaa'ati wa in ta'ammara 'alaykum 'abd, fa innahuu man ya'isy minkum ba'dii fasayaraa ikhtilaafan katsiiraa, fa'alaykum bisunnatii wa sunnatil-khulafaa'ir-raasyidiinal-mahdiyyiina 'adhdhuu 'alayhaa bin-nawaajidz...",
    translation: "Aku berwasiat kepada kalian untuk bertakwa kepada Allah, serta patuh dan taat meskipun yang memimpin kalian adalah seorang budak. Karena sesungguhnya barangsiapa yang hidup di antara kalian sepeninggalku akan melihat banyak perselisihan. Maka wajib atas kalian berpegang teguh pada sunnahku dan sunnah Khulafaur Rasyidin yang mendapat petunjuk, gigitlah sunnah itu dengan gigi geraham...",
    rawi: "HR. Abu Dawud (No. 4607) & At-Tirmidzi (No. 2676) - Hadits Hasan Shahih",
    theme: "akidah",
    keyTakeaways: [
      "Wasiat terakhir Rasulullah menekankan ketakwaan dan menjaga persatuan umat.",
      "Sunnah Nabi dan jalan Khulafaur Rasyidin adalah pedoman keselamatan di tengah maraknya fitnah akhir zaman.",
      "Menghindari bid'ah dalam agama yang dapat memecah belah keutuhan umat Islam."
    ],
    relatedAyahs: [
      { surahId: 3, surahName: "Ali 'Imran", ayahNumber: 103 },
      { surahId: 4, surahName: "An-Nisa'", ayahNumber: 59 }
    ]
  },
  {
    id: 29,
    number: 29,
    title: "Pintu Kebaikan, Pokok Agama, dan Menjaga Lisan (Mu'adz bin Jabal)",
    arabic: "قُلْتُ: يَا رَسُولَ اللهِ، أَخْبِرْنِي بِعَمَلٍ يُدْخِلُنِي الْجَنَّةَ وَيُبَاعِدُنِي عَنِ النَّارِ... قَالَ: أَلاَ أُخْبِرُكَ بِمَلاَكِ ذَلِكَ كُلِّهِ؟ قُلْتُ: بَلَى يَا نَبِيَّ اللهِ، فَأَخَذَ بِلِسَانِهِ وَقَالَ: كُفَّ عَلَيْكَ هَذَا. قُلْتُ: وَإِنَّا لَمُؤَاخَذُونَ بِمَا نَتَكَلَّمُ بِهِ؟! فَقَالَ: ثَكِلَتْكَ أُمُّكَ يَا مُعَاذُ، وَهَلْ يَكُبُّ النَّاسَ فِي النَّارِ عَلَى وُجُوهِهِمْ إِلاَّ حَصَائِدُ أَلْسِنَتِهِمْ؟!",
    latin: "Qultu: Yaa Rasuulallaahi, akhbirnii bi'amalin yudkhilunil-jannata wa yubaa'idunii 'anin-naar... Qaala: Alaa ukhbiruka bimilaaki dzaalika kullih? Qultu: Balaa yaa Nabiyyallaah, fa akhadza bilisaanihii wa qaala: Kuffa 'alayka haadzaa. Qultu: Wa innaa lamu'aakhadzuuna bimaa natakallamu bih?! Faqaala: Tsakilatka ummuka yaa Mu'aadz, wa hal yakubbun-naasa fin-naari 'alaa wujuuhihim illaa hashaa'idu alsinatihim?!",
    translation: "Aku bertanya: 'Wahai Rasulullah, kabarkan kepadaku amalan yang dapat memasukkanku ke surga dan menjauhkanku dari neraka...' Beliau bersabda: 'Maukah aku beritahukan kepadamu tentang kunci dari semua itu?' Aku menjawab: 'Tentu, wahai Nabi Allah.' Beliau memegang lidahnya seraya bersabda: 'Jagalah ini.' Aku bertanya: 'Apakah kita akan disiksa karena apa yang kita bicarakan?!' Beliau bersabda: 'Celakalah engkau wahai Mu'adz, tidaklah manusia disungkurkan wajahnya ke dalam neraka melainkan akibat dari buah panen lisan mereka?!'",
    rawi: "HR. At-Tirmidzi (No. 2616) - Hadits Hasan Shahih",
    theme: "akhlak",
    keyTakeaways: [
      "Menjaga lisan adalah pengendali utama seluruh amal kebaikan seorang muslim.",
      "Mayoritas dosa manusia berakar dari ucapan: dusta, ghibah, namimah, dan kesaksian palsu.",
      "Kunci surga terletak pada tauhid, shalat, zakat, puasa, haji, dan jihad di jalan Allah."
    ],
    relatedAyahs: [
      { surahId: 50, surahName: "Qaf", ayahNumber: 18 },
      { surahId: 17, surahName: "Al-Isra'", ayahNumber: 36 }
    ]
  },
  {
    id: 30,
    number: 30,
    title: "Batasan Hukum Ketetapan Allah dan Kemudahan Syariat",
    arabic: "إِنَّ اللهَ تَعَالَى فَرَضَ فَرَائِضَ فَلاَ تُضَيِّعُوهَا، وَحَدَّ حُدُودًا فَلاَ تَعْتَدُوهَا، وَحَرَّمَ أَشْيَاءَ فَلاَ تَنْتَهِكُوهَا، وَسَكَتَ عَنْ أَشْيَاءَ رَحْمَةً لَكُمْ غَيْرَ نِسْيَانٍ فَلاَ تَبْحَثُوا عَنْهَا.",
    latin: "Innallaaha Ta'aalaa faradha faraa'idha falaa tudhayyi'uuhaa, wa hadda huduudan falaa ta'taduuhaa, wa harrama asyyaa'a falaa tantahikuuhaa, wa sakata 'an asyyaa'a rahmatan lakum ghayra nisyaanin falaa tabhatsuu 'anhaa.",
    translation: "Sesungguhnya Allah Ta'ala telah mewajibkan kewajiban-kewajiban maka janganlah kalian menyia-nyiakannya, menetapkan batasan-batasan hukum maka janganlah kalian melampauinya, mengharamkan hal-hal maka janganlah kalian melanggarnya, dan mendiamkan beberapa perkara sebagai rahmat bagi kalian tanpa lupa maka janganlah kalian memperdebatkannya.",
    rawi: "HR. Ad-Daraquthni (No. 4396) & Al-Baihaqi - Hadits Hasan",
    theme: "ibadah",
    keyTakeaways: [
      "Syariat Islam teratur secara seimbang: ada kewajiban mutlak, batasan hukum, dan hal yang diharamkan.",
      "Perkara yang tidak disebutkan secara eksplisit hukumnya adalah bentuk kasih sayang dan kelonggaran syariat.",
      "Larangan bersikap berlebihan (*ghuluw*) dan mengada-ada perkara yang memberatkan diri."
    ],
    relatedAyahs: [
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 187 },
      { surahId: 5, surahName: "Al-Ma'idah", ayahNumber: 101 }
    ]
  },
  {
    id: 31,
    number: 31,
    title: "Hakikat Zuhud: Dicintai Allah dan Dicintai Manusia",
    arabic: "أَتَى النَّبِيَّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ رَجُلٌ فَقَالَ: يَا رَسُولَ اللهِ، دُلَّنِي عَلَى عَمَلٍ إِذَا عَمِلْتُهُ أَحَبَّنِيَ اللهُ وَأَحَبَّنِيَ النَّاسُ، فَقَالَ: ازْهَدْ فِي الدُّنْيَا يُحِبَّكَ اللهُ، وَازْهَدْ فِيمَا عِنْدَ النَّاسِ يُحِبَّكَ النَّاسُ.",
    latin: "Atan-Nabiyya shallallaahu 'alayhi wa sallama rajulun faqaala: Yaa Rasuulallaah, dullanii 'alaa 'amalin idzaa 'amiltuhuu ahabaniyallaahu wa ahabaniyan-naas, faqaala: Iz-had fid-dunyaa yuhibbakallaah, waz-had fiimaa 'indan-naasi yuhibbakan-naas.",
    translation: "Seseorang datang kepada Nabi SAW seraya berkata: 'Wahai Rasulullah, tunjukkanlah kepadaku suatu amalan yang apabila aku kerjakan niscaya Allah mencintaiku dan manusia pun mencintaiku.' Beliau bersabda: 'Zuhudlah terhadap dunia niscaya Allah mencintaimu, dan zuhudlah terhadap apa yang ada di tangan manusia niscaya manusia mencintaimu.'",
    rawi: "HR. Ibnu Majah (No. 4102) - Hadits Hasan",
    theme: "akhlak",
    keyTakeaways: [
      "Zuhud hakiki bukanlah meninggalkan harta, melainkan tidak menggantungkan hati pada gemerlap duniawi.",
      "Tidak tamak atau iri terhadap hak milik orang lain melahirkan kedamaian sosial dan cinta sesama.",
      "Mengutamakan ridha Allah di atas kepuasan materi fana."
    ],
    relatedAyahs: [
      { surahId: 57, surahName: "Al-Hadid", ayahNumber: 23 },
      { surahId: 87, surahName: "Al-A'la", ayahNumber: 16 }
    ]
  },
  {
    id: 32,
    number: 32,
    title: "Kaidah Fiqih Agung: Tidak Boleh Menimbulkan Bahaya (Laa Dharara wa Laa Dhiraar)",
    arabic: "لاَ ضَرَرَ وَلاَ ضِرَارَ.",
    latin: "Laa dharara wa laa dhiraar.",
    translation: "Tidak boleh membahayakan diri sendiri dan tidak boleh pula menimbulkan bahaya bagi orang lain.",
    rawi: "HR. Ibnu Majah (No. 2340) & Ad-Daraquthni - Hadits Hasan",
    theme: "muamalah",
    keyTakeaways: [
      "Kaidah asasi fiqih Islam melarang segala bentuk kemudaratan, polusi, kezaliman, dan kecurangan.",
      "Tidak dibenarkan membalas suatu keburukan dengan menimbulkan bahaya yang lebih merusak.",
      "Prinsip kehati-hatian dalam transaksi bisnis, keselamatan publik, dan hubungan bertetangga."
    ],
    relatedAyahs: [
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 233 },
      { surahId: 7, surahName: "Al-A'raf", ayahNumber: 56 }
    ]
  },
  {
    id: 33,
    number: 33,
    title: "Bukti bagi Penggugat dan Sumpah bagi yang Mengingkari",
    arabic: "لَوْ يُعْطَى النَّاسُ بِدَعْوَاهُمْ لاَدَّعَى رِجَالٌ أَمْوَالَ قَوْمٍ وَدِمَاءَهُمْ، وَلَكِنِ الْبَيِّنَةُ عَلَى الْمُدَّعِي وَالْيَمِينُ عَلَى مَنْ أَنْكَرَ.",
    latin: "Law yu'than-naasu bida'waahum ladda'aa rijaalun amwaala qawmin wa dimaa'ahum, wa laakinnal-bayyinatu 'alal-mudda'ii wal-yamiinu 'alaa man ankar.",
    translation: "Seandainya setiap manusia diberikan apa yang mereka klaim begitu saja, niscaya orang-orang akan mengklaim harta dan darah suatu kaum. Akan tetapi, bukti wajib atas orang yang menuduh (menggugat) dan sumpah wajib bagi orang yang mengingkari (tergugat).",
    rawi: "HR. Al-Baihaqi (No. 20950) - Hadits Hasan",
    theme: "muamalah",
    keyTakeaways: [
      "Hukum peradilan Islam berdiri di atas asas keadilan, kepastian hukum, dan praduga tak bersalah.",
      "Tuduhan tanpa didasari bukti autentik (bayyinah) tidak dapat diterima dalam hukum Islam.",
      "Sumpah atas nama Allah adalah pelindung terakhir bagi pihak yang mengingkari tuduhan."
    ],
    relatedAyahs: [
      { surahId: 4, surahName: "An-Nisa'", ayahNumber: 58 },
      { surahId: 49, surahName: "Al-Hujurat", ayahNumber: 6 }
    ]
  },
  {
    id: 34,
    number: 34,
    title: "Mengubah Kemungkaran: Dengan Tangan, Lisan, dan Hati",
    arabic: "مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ، وَذَلِكَ أَضْعَفُ الإِيمَانِ.",
    latin: "Man ra'aa minkum munkaran falyughayyirhu biyadih, fa illam yastathi' fabilisaanih, fa illam yastathi' fabiqalbih, wa dzaalika adh'aful-iimaan.",
    translation: "Barangsiapa di antara kalian melihat kemungkaran, hendaklah ia mengubahnya dengan tangannya (kekuasaan). Jika ia tidak mampu, maka dengan lisannya (nasihat). Dan jika ia tidak mampu, maka dengan hatinya (menolak dalam hati), dan yang demikian itu adalah selemah-lemah iman.",
    rawi: "HR. Muslim (No. 49)",
    theme: "akhlak",
    keyTakeaways: [
      "Amar ma'ruf nahi munkar adalah kewajiban kolektif untuk menjaga moral masyarakat.",
      "Tindakan pencegahan dilakukan bertahap sesuai kapasitas wewenang dan kemampuan masing-masing.",
      "Mengingkari kemaksiatan dengan hati adalah batas minimal keimanan seorang muslim."
    ],
    relatedAyahs: [
      { surahId: 3, surahName: "Ali 'Imran", ayahNumber: 104 },
      { surahId: 9, surahName: "At-Taubah", ayahNumber: 71 }
    ]
  },
  {
    id: 35,
    number: 35,
    title: "Persaudaraan Sejati: Larangan Hasad, Dusta, dan Saling Menjatuhkan",
    arabic: "لاَ تَحَاسَدُوا، وَلاَ تَنَاجَشُوا، وَلاَ تَبَاغَضُوا، وَلاَ تَدَابَرُوا، وَلاَ يَبِعْ بَعْضُكُمْ عَلَى بَيْعِ بَعْضٍ، وَكُونُوا عِبَادَ اللهِ إِخْوَانًا، الْمُسْلِمُ أَخُو الْمُسْلِمِ: لاَ يَظْلِمُهُ، وَلاَ يَخْذُلُهُ، وَلاَ يَحْقِرُهُ، التَّقْوَى هَاهُنَا - وَيُشِيرُ إِلَى صَدْرِهِ ثَلاَثَ مَرَّاتٍ - بِحَسْبِ امْرِئٍ مِنَ الشَّرِّ أَنْ يَحْقِرَ أَخَاهُ الْمُسْلِمَ...",
    latin: "Laa tahaasaduu, wa laa tanaajasyuu, wa laa tabaabhadhuu, wa laa tadaabaruu, wa laa yabi' ba'dhukum 'alaa bay'i ba'dh, wa kuunuu 'ibaadallaahi ikhwaanaa, Al-muslimu akhul-muslim: laa yazhlimuh, wa laa yakhdzuluh, wa laa yahqiruh, At-taqwaa haahunaa - wa yusyiiru ilaa shadrihii tsalaatsa marraat - bihasbimri'in minasy-syarri an yahqira akhaahul-muslim...",
    translation: "Janganlah kalian saling mendengki, jangan saling berbuat curang dalam jual beli (najasy), jangan saling membenci, jangan saling membelakangi, dan jangan sebagian kalian membeli atas jualan sebagian yang lain. Jadilah kalian hamba-hamba Allah yang bersaudara. Seorang muslim adalah saudara bagi muslim lainnya: tidak boleh menzaliminya, tidak boleh menelantarkannya, dan tidak boleh meremehkannya. Takwa itu letaknya di sini—beliau menunjuk ke dadanya tiga kali. Cukuplah seseorang dianggap melakukan kejahatan jika ia merendahkan saudaranya sesama muslim...",
    rawi: "HR. Muslim (No. 2564)",
    theme: "muamalah",
    keyTakeaways: [
      "Menjaga kerukunan, persatuan, dan kehormatan ukhuwah Islamiyah di atas segala perbedaan.",
      "Mengharamkan hasad, boikot permusuhan, dan perlakuan diskriminatif terhadap sesama muslim.",
      "Hakikat takwa bersumber dari ketulusan hati yang memancarkan penghormatan kepada sesama manusia."
    ],
    relatedAyahs: [
      { surahId: 49, surahName: "Al-Hujurat", ayahNumber: 11 },
      { surahId: 59, surahName: "Al-Hasyr", ayahNumber: 10 }
    ]
  },
  {
    id: 36,
    number: 36,
    title: "Membantu Kesulitan Saudara, Menuntut Ilmu, dan Naungan Majelis Dzikir",
    arabic: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ، وَمَنْ يَسَّرَ عَلَى مُعْسِرٍ يَسَّرَ اللهُ عَلَيْهِ فِي الدُّنْيَا وَالآخِرَةِ، وَمَنْ سَتَرَ مُسْلِمًا سَتَرَهُ اللهُ فِي الدُّنْيَا وَالآخِرَةِ، وَاللهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ، وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ...",
    latin: "Man naffasa 'an mu'minin kurbatan min kurabid-dunyaa naffasallaahu 'anhu kurbatan min kurabi yawmil-qiyaamah, wa man yassara 'alaa mu'sirin yassarallaahu 'alayhi fid-dunyaa wal-aakhirah, wa man satara musliman satarahullaahu fid-dunyaa wal-aakhirah, wallaahu fii 'awnil-'abdi maa kaanal-'abdu fii 'awni akhiih, wa man salaka thariiqan yaltamisu fiihi 'ilman sahhalallaahu lahuu bihii thariiqan ilal-jannah...",
    translation: "Barangsiapa melepaskan kesusahan seorang mukmin dari kesusahan dunia, niscaya Allah melepaskan kesusahannya dari kesusahan hari kiamat. Barangsiapa memudahkan orang yang kesulitan, niscaya Allah mudahkan baginya di dunia dan akhirat. Barangsiapa menutupi aib seorang muslim, niscaya Allah menutupi aibnya di dunia dan akhirat. Allah senantiasa menolong hamba-Nya selama hamba itu menolong saudaranya. Dan barangsiapa menempuh jalan untuk menuntut ilmu, niscaya Allah mudahkan baginya jalan menuju surga...",
    rawi: "HR. Muslim (No. 2699)",
    theme: "muamalah",
    keyTakeaways: [
      "Balasan setimpal dari Allah bagi siapa saja yang meringankan beban penderitaan orang lain.",
      "Keutamaan agung menuntut ilmu agama dan menghadiri majelis Al-Qur'an.",
      "Menutup aib saudara muslim dan tidak menyebarluaskan keburukannya ke publik."
    ],
    relatedAyahs: [
      { surahId: 58, surahName: "Al-Mujadilah", ayahNumber: 11 },
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 280 }
    ]
  },
  {
    id: 37,
    number: 37,
    title: "Kebaikan Berlipat Ganda dan Rahmat Karunia Allah Ta'ala",
    arabic: "إِنَّ اللهَ كَتَبَ الْحَسَنَاتِ وَالسَّيِّئَاتِ ثُمَّ بَيَّنَ ذَلِكَ: فَمَنْ هَمَّ بِحَسَنَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللهُ عِنْدَهُ حَسَنَةً كَامِلَةً، وَإِنْ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللهُ عِنْدَهُ عَشْرَ حَسَنَاتٍ إِلَى سَبْعِمِائَةِ ضِعْفٍ إِلَى أَضْعَافٍ كَثِيرَةٍ...",
    latin: "Innallaaha katabal-hasanaati was-sayyi'aati tsumma bayyana dzaalik: faman hamma bihasanatin falam ya'malhaa katabahallaahu 'indahuu hasanatan kaamilah, wa in hamma bihaa fa'amilahaa katabahallaahu 'indahuu 'asyra hasanaatin ilaa sab'imi'ati dhi'fin ilaa adh'aafan katsiirah...",
    translation: "Sesungguhnya Allah telah menetapkan kebaikan dan keburukan kemudian menjelaskannya: Barangsiapa yang berniat melakukan suatu kebaikan lalu ia tidak jadi melakukannya, maka Allah menulis di sisi-Nya sebagai satu kebaikan sempurna. Dan jika ia berniat lalu mengerjakannya, maka Allah menulis di sisi-Nya sepuluh kebaikan hingga tujuh ratus kali lipat hingga berlipat ganda yang sangat banyak...",
    rawi: "HR. Al-Bukhari (No. 6491) & Muslim (No. 131)",
    theme: "akidah",
    keyTakeaways: [
      "Luasnya rahmat Allah yang mendahului murka-Nya.",
      "Niat kebajikan semata sudah diganjar pahala penuh oleh Allah.",
      "Keburukan yang baru terlintas di hati tidak dicatat sebagai dosa sebelum dilakukan."
    ],
    relatedAyahs: [
      { surahId: 6, surahName: "Al-An'am", ayahNumber: 160 },
      { surahId: 4, surahName: "An-Nisa'", ayahNumber: 40 }
    ]
  },
  {
    id: 38,
    number: 38,
    title: "Kedudukan Para Kekasih Allah (Wali Allah) dan Amalan Nawafil",
    arabic: "مَنْ عَادَى لِي وَلِيًّا فَقَدْ آذَنْتُهُ بِالْحَرْبِ، وَمَا تَقَرَّبَ إِلَيَّ عَبْدِي بِشَيْءٍ أَحَبَّ إِلَيَّ مِمَّا افْتَرَضْتُ عَلَيْهِ، وَمَا يَزَالُ عَبْدِي يَتَقَرَّبُ إِلَيَّ بِالنَّوَافِلِ حَتَّى أُحِبَّهُ، فَإِذَا أَحْبَبْتُهُ: كُنْتُ سَمْعَهُ الَّذِي يَسْمَعُ بِهِ، وَبَصَرَهُ الَّذِي يُبْصِرُ بِهِ، وَيَدَهُ الَّتِي يَبْطِشُ بِهَا، وَرِجْلَهُ الَّتِي يَمْشِي بِهَا، وَإِنْ سَأَلَنِي لَأُعْطِيَنَّهُ، وَلَئِنِ اسْتَعَاذَنِي لَأُعِيذَنَّهُ...",
    latin: "Man 'aadaa lii waliyyan faqad aadzantuhuu bil-harb, wa maa taqarraba ilayya 'abdii bisyay'in ahabba ilayya mimmāf-taradhtu 'alayh, wa maa yazaalu 'abdii yataqarrabu ilayya bin-nawaafili hattaa uhibbah, fa idzaa ahbabtuh: kuntu sam'ahul-ladzii yasma'u bih, wa basharahul-ladzii yubshiru bih, wa yadahul-latii yabthisyu bihaa, wa rijlahul-latii yamsyii bihaa, wa in sa'alanii la-u'thiyannah, wa la'inistia'aadzanii la-u'iidzannah...",
    translation: "Barangsiapa yang memusuhi wali (kekasih)-Ku, maka sungguh Aku telah menyatakan perang terhadapnya. Dan tidaklah hamba-Ku mendekatkan diri kepada-Ku dengan sesuatu yang lebih Aku cintai daripada apa yang telah Aku wajibkan atasnya. Hamba-Ku senantiasa mendekatkan diri kepada-Ku dengan amalan-amalan sunnah (nawafil) hingga Aku mencintainya. Apabila Aku telah mencintainya, maka Aku menjadi pendengarannya yang ia gunakan untuk mendengar, penglihatannya yang ia gunakan untuk melihat, tangannya yang ia gunakan untuk bertindak, dan kakinya yang ia gunakan untuk melangkah. Jika ia meminta kepada-Ku pasti Aku beri, dan jika ia memohon perlindungan kepada-Ku pasti Aku lindungi...",
    rawi: "HR. Al-Bukhari (No. 6502)",
    theme: "ibadah",
    keyTakeaways: [
      "Peringatan keras bagi siapa saja yang memusuhi orang-orang saleh kekasih Allah.",
      "Kewajiban fardhu adalah amalan paling dicintai Allah, disempurnakan oleh amalan sunnah.",
      "Tingkatan makrifat tertinggi di mana pendengaran, penglihatan, dan langkah seorang hamba berada dalam taufiq ilahi."
    ],
    relatedAyahs: [
      { surahId: 10, surahName: "Yunus", ayahNumber: 62 },
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 257 }
    ]
  },
  {
    id: 39,
    number: 39,
    title: "Kemurahan Rahmat: Dimaafkannya Kekeliruan, Lupa, dan Keterpaksaan",
    arabic: "إِنَّ اللهَ تَجَاوَزَ لِي عَنْ أُمَّتِي: الْخَطَأَ، وَالنِّسْيَانَ، وَمَا اسْتُكْرِهُوا عَلَيْهِ.",
    latin: "Innallaaha tajaawaza lii 'an ummatii: al-khatha'a, wan-nisyaana, wa mastukrihuu 'alayh.",
    translation: "Sesungguhnya Allah telah memaafkan dari umatku: kekeliruan (yang tidak disengaja), lupa, dan apa yang dipaksakan atas mereka.",
    rawi: "HR. Ibnu Majah (No. 2045) & Al-Baihaqi - Hadits Hasan",
    theme: "ibadah",
    keyTakeaways: [
      "Islam adalah agama rahmat yang mengangkat beban dosa dari perbuatan yang tidak disengaja.",
      "Orang yang lupa atau dipaksa melakukan hal terlarang tidak dikenai dosa syariat.",
      "Kewajiban mengganti hutang atau shalat yang terlupa begitu teringat kembali."
    ],
    relatedAyahs: [
      { surahId: 2, surahName: "Al-Baqarah", ayahNumber: 286 },
      { surahId: 16, surahName: "An-Nahl", ayahNumber: 106 }
    ]
  },
  {
    id: 40,
    number: 40,
    title: "Hiduplah di Dunia Bagaikan Orang Asing atau Pengembara Jalanan",
    arabic: "أَخَذَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ بِمَنْكِبِي فَقَالَ: كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ. وَكَانَ ابْنُ عُمَرَ رَضِيَ اللهُ عَنْهُمَا يَقُولُ: إِذَا أَمْسَيْتَ فَلاَ تَنْتَظِرِ الصَّبَاحَ، وَإِذَا أَصْبَحْتَ فَلاَ تَنْتَظِرِ الْمَسَاءَ، وَخُذْ مِنْ صِحَّتِكَ لِمَرَضِكَ، وَمِنْ حَيَاتِكَ لِمَوْتِكَ.",
    latin: "Akhadza Rasuulullaahi shallallaahu 'alayhi wa sallama bimankibii faqaala: Kun fid-dunyaa ka-annaka ghariibun aw 'aabiru sabiil. Wa kaanabnu 'Umara radhiyallaahu 'anhumaa yaquul: Idzaa amsayta falaa tantazhirish-shabaah, wa idzaa ashbahta falaa tantazhiril-masaa', wa khudz min shihhatika limaradhik, wa min hayaatika limawtik.",
    translation: "Rasulullah SAW memegang kedua pundakku seraya bersabda: 'Hiduplah engkau di dunia ini seakan-akan engkau orang asing atau seorang pengembara yang melintasi jalan.' Dan Ibnu Umar RA berkata: 'Jika engkau berada di sore hari janganlah menunggu pagi hari, dan jika engkau berada di pagi hari janganlah menunggu sore hari. Pergunakanlah masa sehatmu sebelum datang sakitmu, dan masa hidupmu sebelum datang kematianmu.'",
    rawi: "HR. Al-Bukhari (No. 6416)",
    theme: "akhlak",
    keyTakeaways: [
      "Dunia adalah tempat persinggahan sementara, sedangkan kampung akhirat adalah tempat tinggal yang kekal.",
      "Menghindari angan-angan panjang (thulul amal) yang melalaikan bekal amal saleh.",
      "Memanfaatkan modal usia dan kesehatan sebelum datang masa udzur dan ajal menjemput."
    ],
    relatedAyahs: [
      { surahId: 57, surahName: "Al-Hadid", ayahNumber: 20 },
      { surahId: 29, surahName: "Al-'Ankabut", ayahNumber: 64 }
    ]
  },
  {
    id: 41,
    number: 41,
    title: "Menundukkan Hawa Nafsu Mengikuti Petunjuk Wahyu Rasulullah",
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يَكُونَ هَوَاهُ تَبَعًا لِمَا جِئْتُ بِهِ.",
    latin: "Laa yu'minu ahadukum hattaa yakuuna hawaahu taba'an limaa ji'tu bih.",
    translation: "Tidak sempurna iman salah seorang di antara kalian sampai hawa nafsunya tunduk mengikuti apa yang aku bawa (ajaran wahyu).",
    rawi: "HR. Al-Baghawi dalam Syarhus Sunnah - Hadits Hasan",
    theme: "akidah",
    keyTakeaways: [
      "Kesempurnaan iman mensyaratkan ketundukan hawa nafsu pada syariat Allah dan Rasul-Nya.",
      "Menjadikan Al-Qur'an dan Sunnah sebagai hakim pemutus atas setiap kecenderungan pribadi.",
      "Menjaga kemurnian niat dan tidak mendahulukan logika rasional di atas nash wahyu yang sahih."
    ],
    relatedAyahs: [
      { surahId: 4, surahName: "An-Nisa'", ayahNumber: 65 },
      { surahId: 28, surahName: "Al-Qashash", ayahNumber: 50 }
    ]
  },
  {
    id: 42,
    number: 42,
    title: "Luasnya Ampunan Allah bagi Siapa Saja yang Bertaubat (Hadits Qudsi)",
    arabic: "يَا ابْنَ آدَمَ إِنَّكَ مَا دَعَوْتَنِي وَرَجَوْتَنِي غَفَرْتُ لَكَ عَلَى مَا كَانَ فِيكَ وَلاَ أُبَالِي، يَا ابْنَ آدَمَ لَوْ بَلَغَتْ ذُنُوبُكَ عَنَانَ السَّمَاءِ ثُمَّ اسْتَغْفَرْتَنِي غَفَرْتُ لَكَ، يَا ابْنَ آدَمَ إِنَّكَ لَوْ أَتَيْتَنِي بِقُرَابِ الأَرْضِ خَطَايَا ثُمَّ لَقِيتَنِي لاَ تُشْرِكُ بِي شَيْئًا لَأَتَيْتُكَ بِقُرَابِهَا مَغْفِرَةً.",
    latin: "Yabna Aadama innaka maa da'awtanii wa rajawtanii ghafartu laka 'alaa maa kaana fiika wa laa ubaalii, yabna Aadama law balaghat dzunuubuka 'anaanas-samaa'i tsummastaghfartanii ghafartu lak, yabna Aadama innaka law ataytanii biquraabil-ardhi khathaayaa tsumma laqiitanii laa tusyriku bii syay'an la-ataytuka biquraabihaa maghfirah.",
    translation: "Wahai anak cucu Adam, sesungguhnya selama engkau berdoa kepada-Ku dan berharap kepada-Ku, niscaya Aku ampuni apa yang telah ada padamu dan Aku tidak peduli. Wahai anak cucu Adam, seandainya dosa-dosamu membumbung tinggi mencapai awan di langit kemudian engkau memohon ampun kepada-Ku, niscaya Aku ampuni engkau. Wahai anak cucu Adam, sesungguhnya seandainya engkau datang kepada-Ku dengan membawa kesalahan sepenuh bumi lalu engkau menemui-Ku dalam keadaan tidak mempersekutukan-Ku dengan sesuatu apa pun, niscaya Aku akan mendatangimu dengan ampunan sepenuh bumi pula.",
    rawi: "HR. At-Tirmidzi (No. 3540) - Hadits Hasan Shahih",
    theme: "akidah",
    keyTakeaways: [
      "Pintu taubat dan pengampunan Allah senantiasa terbuka seluas langit dan bumi bagi hamba-Nya yang bersungguh-sungguh.",
      "Kemurnian tauhid adalah syarat terpenting terhapusnya dosa-dosa besar.",
      "Larangan berputus asa dari rahmat Allah seberapa pun besarnya dosa di masa lalu."
    ],
    relatedAyahs: [
      { surahId: 39, surahName: "Az-Zumar", ayahNumber: 53 },
      { surahId: 4, surahName: "An-Nisa'", ayahNumber: 48 }
    ]
  }
];

const targetPath = path.resolve(__dirname, '../public/data/arbain_hadith.json');
fs.writeFileSync(targetPath, JSON.stringify(hadithList, null, 2), 'utf8');
console.log(`Berhasil membuat dataset 42 Hadits Arba'in di: ${targetPath}`);
