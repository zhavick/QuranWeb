import React, { useState, useMemo } from 'react';
import { X, BookOpen, Search, Palette, Sparkles, Compass } from 'lucide-react';

interface TajweedMakhrajModalProps {
  open: boolean;
  onClose: () => void;
}

type TabType = 'tajweed' | 'makhraj' | 'waqaf';

interface TajweedRule {
  name: string;
  category: string;
  className: string;
  duration: string;
  letters: string;
  desc: string;
  example: string;
  transliteration: string;
}

const TAJWEED_RULES: TajweedRule[] = [
  {
    name: 'Ghunnah Musyaddadah',
    category: 'Ghunnah',
    className: 'tajweed-ghunnah',
    duration: '2 Harakat',
    letters: 'نّ  مّ',
    desc: 'Nun atau Mim yang bertasydid wajib dibaca mendengung ditahan selama 2 harakat di pangkal hidung.',
    example: 'إِنَّ ٱللَّهَ  •  عَمَّ يَتَسَآءَلُونَ',
    transliteration: "Inna-llaha  •  'Amma yatasaa'aluun",
  },
  {
    name: 'Ikhfa Haqiqi',
    category: 'Nun Mati & Tanwin',
    className: 'tajweed-ikhfa',
    duration: '2 Harakat (Samar)',
    letters: 'ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك (15 Huruf)',
    desc: 'Nun mati (نْ) atau tanwin bertemu salah satu dari 15 huruf ikhfa. Bunyi nun disamarkan mendekati makhraj huruf berikutnya disertai dengung.',
    example: 'مِن شَرِّ  •  كُنتُمْ  •  أَندَادًا',
    transliteration: "Min syarri  •  Kuntum  •  Andadaa",
  },
  {
    name: 'Ikhfa Syafawi',
    category: 'Mim Mati',
    className: 'tajweed-ikhfa',
    duration: '2 Harakat (Samar)',
    letters: 'ب (Ba)',
    desc: 'Mim mati (مْ) bertemu huruf Ba (ب). Bibir dirapatkan ringan disertai dengung samar.',
    example: 'تَرْمِيهِم بِحِجَارَةٍ  •  فَاحْكُم بَيْنَهُم',
    transliteration: "Tarmiihim bihijarah  •  Fahkum baynahum",
  },
  {
    name: 'Idgham Bi Ghunnah',
    category: 'Nun Mati & Tanwin',
    className: 'tajweed-idgham',
    duration: '2 Harakat (Melebur + Dengung)',
    letters: 'ي ن م و (Yanmu)',
    desc: 'Nun mati atau tanwin melebur masuk ke huruf setelahnya disertai suara dengung 2 harakat.',
    example: 'مَن يَقُولُ  •  مِن مَّالٍ  •  هُدًى لِّلْمُتَّقِينَ',
    transliteration: "May yaquulu  •  Mim maalin",
  },
  {
    name: 'Idgham Bila Ghunnah',
    category: 'Nun Mati & Tanwin',
    className: 'tajweed-idgham',
    duration: 'Melebur tanpa dengung',
    letters: 'ل  ر (Lam & Ra)',
    desc: 'Nun mati atau tanwin melebur seutuhnya ke dalam huruf Lam atau Ra tanpa dengung sama sekali.',
    example: 'مِن رَّبِّهِمْ  •  غَفُورٌ رَّحِيمٌ',
    transliteration: "Mir rabbihim  •  Ghafuurur rahiim",
  },
  {
    name: 'Idgham Mimi / Mitslain',
    category: 'Mim Mati',
    className: 'tajweed-idgham',
    duration: '2 Harakat (Dengung)',
    letters: 'م (Mim bertemu Mim)',
    desc: 'Mim mati (مْ) bertemu huruf Mim berharakat. Keduanya melebur sempurna dengan dengung.',
    example: 'لَهُم مَّغْفِرَةٌ  •  فِى قُلُوبِهِم مَّرَضٌ',
    transliteration: "Lahum maghfirah  •  Fii quluubihim maradun",
  },
  {
    name: 'Iqlab',
    category: 'Nun Mati & Tanwin',
    className: 'tajweed-iqlab',
    duration: '2 Harakat',
    letters: 'ب (Ba)',
    desc: 'Nun mati atau tanwin berubah bunyinya menjadi bunyi Mim (م) disertai dengung saat bertemu huruf Ba.',
    example: 'مِنۢ بَعْدِ  •  أَلِيمٌۢ بِمَا',
    transliteration: "Mim ba'di  •  Aliimum bimaa",
  },
  {
    name: 'Qalqalah (Pantulan Suara)',
    category: 'Qalqalah',
    className: 'tajweed-qalqalah',
    duration: 'Memantul Ringan / Kuat',
    letters: 'ق ط ب ج د (Baju Di Toko)',
    desc: 'Huruf qalqalah saat sukun (asli atau sukun karena waqaf) dipantulkan suaranya secara tegas.',
    example: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ (Waqaf)  •  يَجْعَلُونَ  •  ٱقْرَأْ',
    transliteration: "Qul huwallahu ahad  •  Yaj'aluuna  •  Iqra'",
  },
  {
    name: 'Mad Wajib Muttashil & Jaiz Munfashil',
    category: 'Hukum Mad',
    className: 'tajweed-madd',
    duration: '4 s.d. 5 Harakat',
    letters: 'Huruf Mad bertemu Hamzah',
    desc: 'Huruf mad (ا و ي) bertemu huruf Hamzah dalam 1 kata (Muttashil) atau berbeda kata (Munfashil).',
    example: 'إِذَا جَآءَ نَصْرُ ٱللَّهِ  •  بِمَآ أُنزِلَ',
    transliteration: "Idzaa jaa'a nashrullah  •  Bimaa unzila",
  },
  {
    name: 'Mad Lazim (Kilmi / Harfi)',
    category: 'Hukum Mad',
    className: 'tajweed-madd',
    duration: '6 Harakat (Wajib Panjang)',
    letters: 'Mad bertemu Tasydid / Sukun Asli',
    desc: 'Wajib dipanjangkan penuh hingga 6 harakat (3 alif) tanpa boleh dikurangi.',
    example: 'وَلَا ٱلضَّآلِّينَ  •  الٓمٓ  •  قٓ',
    transliteration: "Wa ladh-dhaaaalliin  •  Alif-Laaam-Miiim",
  },
  {
    name: 'Hamzatul Wasl & Lam Syamsiyyah',
    category: 'Wasal & Syamsiyyah',
    className: 'tajweed-silent',
    duration: 'Dilewati (Tidak dibaca)',
    letters: 'ٱ  •  ال (Syamsiyyah)',
    desc: 'Huruf yang tertulis dalam rasm mushaf tetapi tidak dilafalkan ketika dibaca sambung (wasal).',
    example: 'وَٱلشَّمْسِ  •  بِٱلْحَقِّ',
    transliteration: "Wasy-syamsi  •  Bil-haqqi",
  },
];

const MAKHRAJ_AREAS = [
  {
    title: '1. Al-Jauf (الْجَوْف) - Rongga Mulut & Tenggorokan',
    letters: 'ا  و  ي (Huruf Mad)',
    explanation:
      'Merupakan makhraj muqaddar (perkiraan tanpa titik sentuh tertentu). Tempat keluarnya suara vokal panjang: Alif mati didahului fathah, Wawu mati didahului dhammah, dan Ya mati didahului kasrah.',
    tips: 'Buka rongga mulut secara rileks dan jangan menekan lidah ke langit-langit.',
  },
  {
    title: '2. Al-Halq (الْحَلْق) - Tenggorokan',
    letters: 'ء  هـ  ع  ح  غ  خ (6 Huruf Halqi)',
    explanation:
      'Terbagi menjadi 3 bagian:\n• Pangkal Tenggorokan (Aqshal Halq): ء (Hamzah) dan هـ (Ha tipis).\n• Tengah Tenggorokan (Wasthul Halq): ع (\'Ain) dan ح (Ha pedas/bersih).\n• Ujung Tenggorokan (Adnal Halq): غ (Ghain) dan خ (Kha).',
    tips: "Pembeda penting: huruf 'Ain (ع) berada di tengah tenggorokan dengan sedikit desakan suara, berbeda dari Hamzah (ء).",
  },
  {
    title: '3. Al-Lisan (اللِّسَان) - Lidah',
    letters: '18 Huruf (Bagian Terbanyak)',
    explanation:
      'Memiliki 10 titik makhraj:\n• Pangkal Lidah menyentuh langit-langit lunak: ق (Qaf) dan kaku: ك (Kaf).\n• Tengah Lidah menyentuh langit-langit: ج (Jim), ش (Syin), ي (Ya non-mad).\n• Tepi Lidah menyentuh geraham atas: ض (Dhad).\n• Ujung Lidah: ل (Lam), ن (Nun), ر (Ra), ط د ت (gigi seri atas), ص ز س (antara gigi seri atas & bawah), serta ظ ذ ث (ujung lidah menempel ujung gigi seri atas).',
    tips: 'Huruf Dhad (ض) keluar dari tepi lidah kiri/kanan bertemu gigi geraham, bukan dari ujung lidah.',
  },
  {
    title: '4. Asy-Syafatan (الشَّفَتَان) - Dua Bibir',
    letters: 'ف  و  ب  م (4 Huruf)',
    explanation:
      '• Huruf Fa (ف): Perut bibir bawah menyentuh ujung gigi seri atas.\n• Huruf Wawu (و): Membulatkan kedua bibir tanpa merapatkannya.\n• Huruf Ba (ب) & Mim (م): Merapatkan bibir atas dan bawah (Ba lebih kuat, Mim lebih ringan).',
    tips: 'Mim selalu disertai dengung dari hidung, sedangkan Ba tidak.',
  },
  {
    title: '5. Al-Khaisyum (الْخَيْشُوم) - Pangkal Hidung',
    letters: 'Ghunnah (نّ  مّ  Ikhfa  Idgham)',
    explanation:
      'Rongga hidung yang menjadi sumber keluarnya suara dengung (Ghunnah). Makhraj ini aktif saat membaca Nun tasydid, Mim tasydid, Ikhfa, Idgham Bighunnah, dan Iqlab.',
    tips: 'Jika hidung dipencet saat membaca Ghunnah, suara dengung akan terputus.',
  },
];

const WAQAF_RULES = [
  {
    symbol: 'مـ',
    name: 'Waqaf Lazim',
    priority: 'Wajib Berhenti',
    desc: 'Harus berhenti pada tanda ini. Jika diteruskan dikhawatirkan dapat merusak makna ayat.',
    example: 'إِنَّمَا يَسْتَجِيبُ ٱلَّذِينَ يَسْمَعُونَ ۘ وَٱلْمَوْتَىٰ يَبْعَثُهُمُ ٱللَّهُ',
  },
  {
    symbol: 'قلى',
    name: 'Al-Waqfu Aula',
    priority: 'Lebih Utama Berhenti',
    desc: 'Diperbolehkan lanjut, namun berhenti di tanda ini jauh lebih utama dan dianjurkan.',
    example: 'قُل رَّبِّىٓ أَعْلَمُ بِعِدَّتِهِم مَّا يَعْلَمُهُمْ إِلَّا قَلِيلٌ ۗ',
  },
  {
    symbol: 'ج',
    name: 'Waqaf Ja’iz',
    priority: 'Boleh Berhenti / Lanjut',
    desc: 'Status berhenti dan melanjutkan bacaan adalah sama kuat (seimbang), boleh memilih salah satunya.',
    example: 'نَحْنُ نَقُصُّ عَلَيْكَ نَبَأَهُم بِٱلْحَقِّ ۚ',
  },
  {
    symbol: 'صلى',
    name: 'Al-Washlu Aula',
    priority: 'Lebih Utama Lanjut',
    desc: 'Boleh berhenti jika nafas tidak kuat, namun menyambung (wasal) jauh lebih utama.',
    example: 'وَإِن يَمْسَسْكَ ٱللَّهُ بِضُرٍّۢ فَلَا كَاشِفَ لَهُۥٓ إِلَّا هُوَ ۖ',
  },
  {
    symbol: 'لا',
    name: 'Waqaf Laa',
    priority: 'Dilarang Berhenti',
    desc: 'Jangan berhenti pada kata yang bertanda ini kecuali jika terletak persis di akhir ayat.',
    example: 'ٱلَّذِينَ تَتَوَفَّىٰهُمُ ٱلْمَلَٰٓئِكَةُ طَيِّبِينَ ۙ يَقُولُونَ سَلَٰمٌ عَلَيْكُمُ',
  },
  {
    symbol: '∴ ... ∴',
    name: 'Waqaf Mu’anaqah (Taqabul)',
    priority: 'Berhenti di Salah Satu',
    desc: 'Dua tanda titik tiga. Pembaca boleh berhenti di salah satu tanda, tetapi TIDAK boleh berhenti pada kedua-duanya.',
    example: 'ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ',
  },
  {
    symbol: 'س',
    name: 'Saktah',
    priority: 'Berhenti Tanpa Bernafas',
    desc: 'Berhenti sejenak sekadar 2 harakat tanpa mengambil nafas, lalu melanjutkan bacaan.',
    example: 'عِوَجَا ۜ قَيِّمًۭا (QS. Al-Kahfi: 1–2)',
  },
];

export const TajweedMakhrajModal: React.FC<TajweedMakhrajModalProps> = ({
  open,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('tajweed');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRules = useMemo(() => {
    if (!searchQuery.trim()) return TAJWEED_RULES;
    const q = searchQuery.toLowerCase();
    return TAJWEED_RULES.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.letters.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredMakhraj = useMemo(() => {
    if (!searchQuery.trim()) return MAKHRAJ_AREAS;
    const q = searchQuery.toLowerCase();
    return MAKHRAJ_AREAS.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.letters.toLowerCase().includes(q) ||
        m.explanation.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredWaqaf = useMemo(() => {
    if (!searchQuery.trim()) return WAQAF_RULES;
    const q = searchQuery.toLowerCase();
    return WAQAF_RULES.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.symbol.toLowerCase().includes(q) ||
        w.desc.toLowerCase().includes(q) ||
        w.priority.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 backdrop-blur-sm animate-fade-in">
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5" style={{ color: 'var(--text-accent)' }} />
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Panduan Edukasi Tajwid &amp; Makhraj
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Referensi praktis hukum tajwid, makharijul huruf, dan tanda waqaf
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panduan tajwid"
            className="rounded-xl p-1.5 transition-colors"
            style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div
          className="flex flex-col gap-3 border-b px-5 py-3"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Tabs */}
            <div
              className="inline-flex rounded-xl border p-1 text-xs font-semibold"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('tajweed')}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
                style={{
                  backgroundColor: activeTab === 'tajweed' ? 'var(--bg-accent)' : 'transparent',
                  color: activeTab === 'tajweed' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                }}
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Warna Tajwid ({TAJWEED_RULES.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('makhraj')}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
                style={{
                  backgroundColor: activeTab === 'makhraj' ? 'var(--bg-accent)' : 'transparent',
                  color: activeTab === 'makhraj' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Makharijul Huruf (5)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('waqaf')}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
                style={{
                  backgroundColor: activeTab === 'waqaf' ? 'var(--bg-accent)' : 'transparent',
                  color: activeTab === 'waqaf' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                }}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Tanda Waqaf ({WAQAF_RULES.length})</span>
              </button>
            </div>

            {/* Quick Filter */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search
                className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                style={{ color: 'var(--text-secondary)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kaidah / hukum..."
                className="w-full rounded-xl border pl-8 pr-3 py-1.5 text-xs outline-none"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: TAJWEED */}
          {activeTab === 'tajweed' && (
            <div className="space-y-3">
              <div
                className="rounded-xl border p-3 text-xs leading-relaxed"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                💡 <span className="font-semibold">Tips Belajar:</span> Warna tajwid di bawah ini
                diselaraskan langsung dengan teks Arab di lembar baca. Anda dapat mematikan atau
                menghidupkannya kapan saja melalui tombol pintas tajwid di bilah atas.
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {filteredRules.map((rule) => (
                  <div
                    key={rule.name}
                    className="flex flex-col justify-between rounded-2xl border p-4 shadow-sm transition-hover"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-sm font-bold ${rule.className}`}>
                          {rule.name}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-accent)',
                          }}
                        >
                          {rule.duration}
                        </span>
                      </div>

                      <div
                        className="font-arabic-amiri text-sm mb-1"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Huruf: {rule.letters}
                      </div>

                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {rule.desc}
                      </p>
                    </div>

                    <div
                      className="mt-3 rounded-xl border p-2.5"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>
                        Contoh Ayat:
                      </div>
                      <div
                        className="font-arabic-amiri text-base leading-relaxed text-right"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {rule.example}
                      </div>
                      <div className="text-[11px] italic mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {rule.transliteration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MAKHARIJUL HURUF */}
          {activeTab === 'makhraj' && (
            <div className="space-y-4">
              <div
                className="rounded-xl border p-3 text-xs leading-relaxed"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                🗣️ <span className="font-semibold">Makharijul Huruf (مَخَارِجُ الْحُرُوفِ):</span>{' '}
                Tempat keluarnya huruf-huruf hijaiyah ketika dilafalkan, terbagi dalam 5 kawasan
                organ bicara utama dari rongga mulut hingga hidung.
              </div>

              <div className="space-y-3.5">
                {filteredMakhraj.map((m) => (
                  <div
                    key={m.title}
                    className="rounded-2xl border p-4 shadow-sm"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 mb-2" style={{ borderColor: 'var(--border-color)' }}>
                      <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {m.title}
                      </h3>
                      <span
                        className="font-arabic-amiri rounded-lg px-2.5 py-0.5 text-base font-semibold"
                        style={{
                          backgroundColor: 'var(--bg-accent-soft)',
                          color: 'var(--text-accent)',
                        }}
                      >
                        {m.letters}
                      </span>
                    </div>

                    <p className="whitespace-pre-line text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {m.explanation}
                    </p>

                    <div
                      className="mt-3 rounded-lg border px-3 py-2 text-xs italic"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      💡 <span className="font-semibold">Catatan Praktis:</span> {m.tips}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TANDA WAQAF */}
          {activeTab === 'waqaf' && (
            <div className="space-y-3">
              <div
                className="rounded-xl border p-3 text-xs leading-relaxed"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                🛑 <span className="font-semibold">Adab Waqaf &amp; Ibtida:</span> Berhenti pada
                tanda waqaf yang tepat menjaga kesucian dan keutuhan makna kalam Ilahi.
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {filteredWaqaf.map((w) => (
                  <div
                    key={w.name}
                    className="rounded-2xl border p-4 shadow-sm flex flex-col justify-between"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="font-arabic-amiri inline-flex h-9 w-9 items-center justify-center rounded-xl text-xl font-bold"
                          style={{
                            backgroundColor: 'var(--bg-accent-soft)',
                            color: 'var(--text-accent)',
                          }}
                        >
                          {w.symbol}
                        </span>
                        <div className="text-right">
                          <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                            {w.name}
                          </div>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{
                              backgroundColor: 'var(--bg-muted)',
                              color: 'var(--text-accent)',
                            }}
                          >
                            {w.priority}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {w.desc}
                      </p>
                    </div>

                    <div
                      className="mt-3 rounded-xl border p-2.5 text-right font-arabic-amiri text-sm leading-relaxed"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {w.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="flex items-center justify-between border-t px-5 py-3 text-xs"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>
            Standar Rasm Utsmani &amp; Tajwid Kemenag RI
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 font-semibold transition-transform active:scale-95"
            style={{
              backgroundColor: 'var(--bg-accent)',
              color: 'var(--text-on-accent)',
            }}
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
