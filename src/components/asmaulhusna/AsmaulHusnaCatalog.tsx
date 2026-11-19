import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  BookOpen,
  LayoutGrid,
  List,
  Heart,
  Info,
  X,
  ExternalLink
} from 'lucide-react';
import { AsmaulHusnaItem } from '../../types/asmaulHusna';
import { fetchAsmaulHusna } from '../../services/asmaulHusna';
import { logActivity } from '../../services/telemetry';
import { BackToMushafButton } from '../common/BackToMushafButton';

interface AsmaulHusnaCatalogProps {
  onBackToMushaf: () => void;
  onNavigateToAyah: (surahId: number, ayahNumber: number) => void;
  elderMode?: boolean;
}

const FAVORITES_KEY = 'quranweb_asmaul_husna_favs';

export const AsmaulHusnaCatalog: React.FC<AsmaulHusnaCatalogProps> = ({
  onBackToMushaf,
  onNavigateToAyah,
  elderMode = false,
}) => {
  const [items, setItems] = useState<AsmaulHusnaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [fontSizeStep, setFontSizeStep] = useState<number>(elderMode ? 1 : 0);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<AsmaulHusnaItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchAsmaulHusna()
      .then((data) => {
        setItems(data);
        setLoading(false);
        logActivity('VIEW_ASMAUL_HUSNA_CATALOG');
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleCopy = (item: AsmaulHusnaItem) => {
    const text = `${item.id}. ${item.arabic} (${item.latin})\nArtinya: ${item.translation}\nMakna: ${item.meaning}${
      item.surahRef ? `\nDalil: QS. ${item.surahRef.surahName}: ${item.surahRef.ayahNumber}` : ''
    }`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(item.id);
      showToast('Asmaul Husna disalin ke clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleSpeak = (item: AsmaulHusnaItem) => {
    if (!('speechSynthesis' in window)) {
      showToast('Browser tidak mendukung sintesis suara');
      return;
    }

    if (speakingId === item.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Gunakan bahasa Arab jika tersedia, fallback ke Indonesia
    const utterance = new SpeechSynthesisUtterance(item.arabic);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;

    // Fallback jika suara Arab tidak tersedia di sistem
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arVoice) {
      utterance.voice = arVoice;
    } else {
      utterance.text = `${item.latin}. Artinya: ${item.translation}`;
      utterance.lang = 'id-ID';
    }

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(item.id);
    window.speechSynthesis.speak(utterance);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filterFavorites && !favoriteIds.includes(item.id)) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.id.toString() === q ||
        item.latin.toLowerCase().includes(q) ||
        item.arabic.includes(q) ||
        item.translation.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        (item.surahRef && item.surahRef.surahName.toLowerCase().includes(q))
      );
    });
  }, [items, searchQuery, filterFavorites, favoriteIds]);

  // Scaled typography classes
  const arabicSizeClass =
    fontSizeStep === 2 ? 'text-4xl md:text-5xl leading-loose' :
    fontSizeStep === 1 ? 'text-3xl md:text-4xl leading-loose' :
    'text-2xl md:text-3xl leading-relaxed';

  const bodySizeClass =
    fontSizeStep === 2 ? 'text-base md:text-lg' :
    fontSizeStep === 1 ? 'text-sm md:text-base' :
    'text-xs md:text-sm';

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] pb-24 transition-colors">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-color)] px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BackToMushafButton
              onClick={onBackToMushaf}
              elderMode={elderMode}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  Asmaul Husna
                </h1>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  99 Nama Allah
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] hidden sm:block">
                Mengenal dan meneladani sifat-sifat keagungan Allah Subhanahu wa Ta'ala
              </p>
            </div>
          </div>

          {/* Quick Actions (Font Scaling & Layout) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center bg-[var(--bg-main)] rounded-lg p-0.5 border border-[var(--border-color)]">
              <button
                onClick={() => setFontSizeStep(0)}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  fontSizeStep === 0
                    ? 'bg-emerald-600 text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="Ukuran Normal"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeStep(1)}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  fontSizeStep === 1
                    ? 'bg-emerald-600 text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="Ukuran Besar"
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeStep(2)}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  fontSizeStep === 2
                    ? 'bg-emerald-600 text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="Ukuran Ekstra Besar"
              >
                A++
              </button>
            </div>

            <div className="hidden sm:flex items-center bg-[var(--bg-main)] rounded-lg p-0.5 border border-[var(--border-color)]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid'
                    ? 'bg-emerald-600 text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="Tampilan Grid"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list'
                    ? 'bg-emerald-600 text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="Tampilan List"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Banner Motivasi & Fadilah */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white p-5 sm:p-7 shadow-xl border border-emerald-700/40">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-medium border border-emerald-400/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Hadits Keutamaan</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-amber-200">
              «إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا مِائَةً إِلا وَاحِدًا مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ»
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              "Sesungguhnya Allah memiliki 99 nama, seratus kurang satu. Barangsiapa yang menghafal dan menjaganya (ihsha'), maka ia akan masuk surga." (HR. Bukhari no. 2736 & Muslim no. 2677)
            </p>
          </div>
          {/* Islamic Geometric Ambient Background Pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
            <span className="text-9xl font-bold">﷽</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama (cth: Ar-Rahman, Pengasih, nomor 1, dll)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
              >
                Hapus
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFilterFavorites((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                filterFavorites
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 font-semibold'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Heart className={`h-4 w-4 ${filterFavorites ? 'fill-rose-500' : ''}`} />
              <span>Favorit ({favoriteIds.length})</span>
            </button>
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Menampilkan {filteredItems.length} dari 99 nama
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent" />
            <p className="text-sm text-[var(--text-secondary)]">Memuat daftar Asmaul Husna...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-8">
            <Sparkles className="h-8 w-8 text-amber-500 mx-auto opacity-70" />
            <p className="font-semibold text-[var(--text-primary)]">Tidak ditemukan nama yang sesuai</p>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
              Cobalah dengan kata kunci lain seperti transliterasi Latin, bahasa Arab, atau arti dalam bahasa Indonesia.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterFavorites(false);
              }}
              className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
            >
              Reset Pencarian
            </button>
          </div>
        )}

        {/* Grid / List of Asmaul Husna */}
        {!loading && filteredItems.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'flex flex-col gap-3'
            }
          >
            {filteredItems.map((item) => {
              const isFav = favoriteIds.includes(item.id);
              const isSpeaking = speakingId === item.id;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="group relative bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] hover:border-emerald-500/40 p-5 transition-all duration-200 hover:shadow-lg flex flex-col justify-between"
                >
                  {/* Top Bar: Number & Actions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                          {item.id}
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                          {item.latin}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSpeak(item)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSpeaking
                              ? 'bg-emerald-600 text-white animate-pulse'
                              : 'text-[var(--text-secondary)] hover:text-emerald-600 hover:bg-[var(--bg-hover)]'
                          }`}
                          title={isSpeaking ? 'Hentikan Suara' : 'Dengarkan Pengucapan'}
                          aria-label={`Dengarkan pengucapan ${item.latin}`}
                        >
                          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>

                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-rose-500 hover:bg-[var(--bg-hover)] transition-colors"
                          title={isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                          aria-label={`Favoritkan ${item.latin}`}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isFav ? 'fill-rose-500 text-rose-500' : ''
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => handleCopy(item)}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-emerald-600 hover:bg-[var(--bg-hover)] transition-colors"
                          title="Salin Teks"
                          aria-label={`Salin data ${item.latin}`}
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Arabic Calligraphy */}
                    <div className="my-4 text-center">
                      <h3
                        className={`font-arabic-amiri font-bold text-emerald-700 dark:text-emerald-300 ${arabicSizeClass} tracking-wide select-all`}
                        dir="rtl"
                      >
                        {item.arabic}
                      </h3>
                    </div>

                    {/* Indonesian Translation & Meaning */}
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                        {item.translation}
                      </div>
                      <p className={`text-[var(--text-secondary)] line-clamp-3 leading-relaxed ${bodySizeClass}`}>
                        {item.meaning}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Bar: Quran Reference & Detail Button */}
                  <div className="mt-4 pt-3 border-t border-[var(--border-color)]/60 flex items-center justify-between text-xs">
                    {item.surahRef ? (
                      <button
                        onClick={() => onNavigateToAyah(item.surahRef!.surahId, item.surahRef!.ayahNumber)}
                        className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                        title={`Buka QS. ${item.surahRef.surahName} ayat ${item.surahRef.ayahNumber} di Mushaf`}
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>QS. {item.surahRef.surahName}: {item.surahRef.ayahNumber}</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </button>
                    ) : (
                      <span className="text-[var(--text-secondary)] italic">Dalil Al-Qur'an</span>
                    )}

                    <button
                      onClick={() => setSelectedDetail(item)}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-main)] hover:bg-emerald-600 hover:text-white text-[var(--text-secondary)] font-medium transition-colors border border-[var(--border-color)]"
                    >
                      Detail & Tadabbur
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Detail & Tadabbur */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                  {selectedDetail.id}
                </span>
                <div>
                  <h3 className="font-bold text-base text-[var(--text-primary)]">
                    {selectedDetail.latin}
                  </h3>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {selectedDetail.translation}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Arabic Center Display */}
            <div className="py-4 text-center bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]">
              <span className="text-4xl sm:text-5xl font-arabic-amiri font-bold text-emerald-600 dark:text-emerald-400 select-all" dir="rtl">
                {selectedDetail.arabic}
              </span>
              <p className="text-sm font-semibold text-[var(--text-primary)] mt-3">
                {selectedDetail.latin}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Artinya: "{selectedDetail.translation}"
              </p>
            </div>

            {/* Theological Explanation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-emerald-500" />
                <span>Penjelasan Makna Hakiki</span>
              </h4>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--bg-main)]/60 p-3.5 rounded-xl border border-[var(--border-color)]">
                {selectedDetail.meaning}
              </p>
            </div>

            {/* Faedah & Tadabbur */}
            {selectedDetail.faedah && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Faidah & Refleksi Kehidupan</span>
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/20">
                  {selectedDetail.faedah}
                </p>
              </div>
            )}

            {/* Quran Reference */}
            {selectedDetail.surahRef && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Rujukan Ayat Al-Qur'an</span>
                </h4>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      Surah {selectedDetail.surahRef.surahName} : Ayat {selectedDetail.surahRef.ayahNumber}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Surah ke-{selectedDetail.surahRef.surahId}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const ref = selectedDetail.surahRef!;
                      setSelectedDetail(null);
                      onNavigateToAyah(ref.surahId, ref.ayahNumber);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <span>Buka Ayat</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
              <button
                onClick={() => handleSpeak(selectedDetail)}
                className="px-3 py-2 rounded-xl border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] flex items-center gap-1.5"
              >
                <Volume2 className="h-4 w-4" />
                <span>Pelafalan</span>
              </button>
              <button
                onClick={() => handleCopy(selectedDetail)}
                className="px-3 py-2 rounded-xl border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] flex items-center gap-1.5"
              >
                <Copy className="h-4 w-4" />
                <span>Salin</span>
              </button>
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
