import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Copy,
  Check,
  LayoutGrid,
  List,
  X
} from 'lucide-react';
import { ArbainHadith, HadithTheme } from '../../types/hadith';
import {
  fetchArbainHadithList,
  getFavoriteHadithIds,
  toggleFavoriteHadith,
  filterHadiths,
  getThemeBadgeColor
} from '../../services/hadith';
import { HadithDetailModal } from './HadithDetailModal';
import { logActivity } from '../../services/telemetry';
import { BackToMushafButton } from '../common/BackToMushafButton';

interface HadithCatalogProps {
  onBackToMushaf: () => void;
  onNavigateToAyah: (surahId: number, ayahNumber: number) => void;
  elderMode?: boolean;
}

export const HadithCatalog: React.FC<HadithCatalogProps> = ({
  onBackToMushaf,
  onNavigateToAyah,
  elderMode = false,
}) => {
  const [hadiths, setHadiths] = useState<ArbainHadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<HadithTheme>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [fontSizeStep, setFontSizeStep] = useState<number>(elderMode ? 1 : 0);

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [selectedHadith, setSelectedHadith] = useState<ArbainHadith | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setFavoriteIds(getFavoriteHadithIds());
    fetchArbainHadithList()
      .then((data) => {
        setHadiths(data);
        setLoading(false);
        logActivity('VIEW_HADITH_ARBAIN_CATALOG');
      })
      .catch((err) => {
        console.error(err);
        setError('Gagal memuat dataset Hadits Arba\'in. Pastikan koneksi atau file lokal tersedia.');
        setLoading(false);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleToggleFavorite = (id: number) => {
    const updated = toggleFavoriteHadith(id);
    setFavoriteIds(updated);
    const isNowFav = updated.includes(id);
    showToast(isNowFav ? 'Hadits ditambahkan ke favorit' : 'Hadits dihapus dari favorit');
  };

  const handleQuickCopy = (hadith: ArbainHadith, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Hadits Arba'in No. ${hadith.number}: ${hadith.title}\n\n${hadith.arabic}\n\nArtinya:\n"${hadith.translation}"\n\n(${hadith.rawi})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(hadith.id);
      showToast('Kutipan hadits berhasil disalin!');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleQuickSpeak = (hadith: ArbainHadith, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      showToast('Browser tidak mendukung pembacaan suara.');
      return;
    }

    if (speakingId === hadith.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    const indonesianVoice = voices.find((v) => v.lang.startsWith('id'));

    const utterance1 = new SpeechSynthesisUtterance(hadith.arabic);
    if (arabicVoice) {
      utterance1.voice = arabicVoice;
      utterance1.lang = 'ar-SA';
      utterance1.rate = 0.85;
    } else {
      utterance1.lang = 'ar';
      utterance1.rate = 0.85;
    }

    const utterance2 = new SpeechSynthesisUtterance(`Hadits nomor ${hadith.number}. ${hadith.title}. ${hadith.translation}`);
    if (indonesianVoice) {
      utterance2.voice = indonesianVoice;
      utterance2.lang = 'id-ID';
    } else {
      utterance2.lang = 'id';
    }
    utterance2.rate = 0.95;

    utterance1.onend = () => {
      window.speechSynthesis.speak(utterance2);
    };

    utterance2.onend = () => {
      setSpeakingId(null);
    };

    utterance1.onerror = () => setSpeakingId(null);
    utterance2.onerror = () => setSpeakingId(null);

    setSpeakingId(hadith.id);
    window.speechSynthesis.speak(utterance1);
  };

  const filteredList = useMemo(() => {
    return filterHadiths(hadiths, searchQuery, selectedTheme, onlyFavorites, favoriteIds);
  }, [hadiths, searchQuery, selectedTheme, onlyFavorites, favoriteIds]);

  // Typography scale
  const arabicFontClasses = ['text-xl leading-relaxed', 'text-2xl leading-relaxed', 'text-3xl leading-loose'];
  const textFontClasses = ['text-xs sm:text-sm', 'text-sm sm:text-base', 'text-base sm:text-lg'];

  const arabicSizeClass = arabicFontClasses[Math.min(fontSizeStep, 2)];
  const textSizeClass = textFontClasses[Math.min(fontSizeStep, 2)];

  const themeOptions: { id: HadithTheme; label: string; count: number }[] = [
    { id: 'all', label: 'Semua (42)', count: hadiths.length },
    { id: 'akidah', label: 'Akidah', count: hadiths.filter((h) => h.theme === 'akidah').length },
    { id: 'ibadah', label: 'Ibadah', count: hadiths.filter((h) => h.theme === 'ibadah').length },
    { id: 'akhlak', label: 'Akhlak', count: hadiths.filter((h) => h.theme === 'akhlak').length },
    { id: 'muamalah', label: 'Muamalah', count: hadiths.filter((h) => h.theme === 'muamalah').length },
  ];

  return (
    <div
      className="min-h-screen pb-20 transition-colors"
      style={{
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xl border animate-fade-in flex items-center gap-2"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md px-4 py-3 sm:px-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BackToMushafButton
              onClick={onBackToMushaf}
              elderMode={elderMode}
            />
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
            <div>
              <h1 className="text-sm sm:text-base font-bold leading-tight flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Hadits Arba'in An-Nawawiyah</span>
              </h1>
              <p className="text-[11px] opacity-70">42 Hadits Pokok Fondasi Ajaran Islam</p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Scaler */}
            <div className="flex items-center border rounded-xl overflow-hidden shadow-xs" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setFontSizeStep(0)}
                className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  fontSizeStep === 0 ? 'bg-emerald-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Ukuran Font Standar"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSizeStep(1)}
                className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  fontSizeStep === 1 ? 'bg-emerald-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Ukuran Font Sedang (Lansia)"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSizeStep(2)}
                className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  fontSizeStep === 2 ? 'bg-emerald-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Ukuran Font Besar"
              >
                A++
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border rounded-xl overflow-hidden shadow-xs" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Tampilan Grid Kartu"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-emerald-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Tampilan Daftar Ramping"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3">
        <div
          className="relative rounded-2xl border p-5 sm:p-6 overflow-hidden shadow-xs"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#059669',
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Karya Monumental Imam An-Nawawi (631–676 H)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Pusat Pelajaran Hadits Arba'in An-Nawawiyah
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-80">
              Menghimpun 42 matan hadits pokok yang merangkum kaidah-kaidah agung Islam. Dilengkapi dengan lafadz Arab berharakat, transliterasi Latin, terjemahan resmi, faedah mutiara hadits, serta tautan silang rujukan ayat Al-Qur'an.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari hadits (nomor, perawi, judul, atau kata kunci)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all shadow-xs"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
              onlyFavorites
                ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            style={{
              backgroundColor: onlyFavorites ? undefined : 'var(--bg-card)',
              borderColor: onlyFavorites ? undefined : 'var(--border-color)',
            }}
          >
            <Heart className={`h-4 w-4 ${onlyFavorites ? 'fill-current' : 'text-rose-500'}`} />
            <span>Favorit Saya ({favoriteIds.length})</span>
          </button>
        </div>

        {/* Theme Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {themeOptions.map((opt) => {
            const isSelected = selectedTheme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedTheme(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{
                  backgroundColor: isSelected ? undefined : 'var(--bg-card)',
                  borderColor: isSelected ? undefined : 'var(--border-color)',
                  color: isSelected ? undefined : 'var(--text-secondary)',
                }}
              >
                {opt.label} ({opt.count})
              </button>
            );
          })}
        </div>

        {/* Result Counter & Active Filter Indicator */}
        <div className="flex items-center justify-between text-xs opacity-70 px-1 pt-1">
          <span>Menampilkan {filteredList.length} dari {hadiths.length} Hadits</span>
          {(searchQuery || selectedTheme !== 'all' || onlyFavorites) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTheme('all');
                setOnlyFavorites(false);
              }}
              className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            <p className="text-xs sm:text-sm opacity-70">Memuat naskah Hadits Arba'in...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl border text-center space-y-3 max-w-md mx-auto" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-sm text-rose-500 font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
            >
              Coba Muat Ulang
            </button>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Search className="h-6 w-6 opacity-40" />
            </div>
            <h3 className="text-base font-bold">Tidak ada hadits yang cocok</h3>
            <p className="text-xs opacity-70 max-w-sm mx-auto">
              Cobalah mengganti kata kunci pencarian atau memilih kategori tema yang lain.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
                : 'space-y-3'
            }
          >
            {filteredList.map((hadith) => {
              const isFav = favoriteIds.includes(hadith.id);
              const themeBadge = getThemeBadgeColor(hadith.theme);
              const isSpeaking = speakingId === hadith.id;
              const isCopied = copiedId === hadith.id;

              return (
                <div
                  key={hadith.id}
                  onClick={() => setSelectedHadith(hadith)}
                  className={`group relative rounded-2xl border p-4 sm:p-5 transition-all hover:shadow-lg hover:border-emerald-500/40 cursor-pointer flex flex-col justify-between ${
                    viewMode === 'list' ? 'sm:flex-row sm:items-center sm:gap-6' : ''
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  {/* Top Meta info */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
                          style={{
                            backgroundColor: themeBadge.bg,
                            color: themeBadge.text,
                            border: `1px solid ${themeBadge.border}`,
                          }}
                        >
                          #{hadith.number}
                        </div>
                        <span
                          className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: themeBadge.bg,
                            color: themeBadge.text,
                            border: `1px solid ${themeBadge.border}`,
                          }}
                        >
                          {themeBadge.label}
                        </span>
                      </div>

                      {/* Quick Icons */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleQuickSpeak(hadith, e)}
                          className="p-1.5 rounded-lg border transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          title="Dengarkan Suara Hadits"
                          style={{
                            borderColor: 'var(--border-color)',
                            color: isSpeaking ? '#059669' : 'var(--text-secondary)',
                          }}
                        >
                          {isSpeaking ? <VolumeX className="h-3.5 w-3.5 animate-pulse text-emerald-500" /> : <Volume2 className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleQuickCopy(hadith, e)}
                          className="p-1.5 rounded-lg border transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          title="Salin Hadits"
                          style={{
                            borderColor: 'var(--border-color)',
                            color: isCopied ? '#059669' : 'var(--text-secondary)',
                          }}
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(hadith.id)}
                          className="p-1.5 rounded-lg border transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          title="Favoritkan"
                          style={{
                            borderColor: 'var(--border-color)',
                            color: isFav ? '#ef4444' : 'var(--text-secondary)',
                          }}
                        >
                          <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-current text-rose-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold leading-snug group-hover:text-emerald-600 transition-colors">
                      {hadith.title}
                    </h3>

                    {/* Matan Arab Preview */}
                    <p
                      className={`font-arabic-amiri ${arabicSizeClass} text-right line-clamp-2 pt-1`}
                      style={{ color: 'var(--text-primary)', direction: 'rtl' }}
                    >
                      {hadith.arabic}
                    </p>

                    {/* Translation Snippet */}
                    <p className={`line-clamp-2 opacity-80 ${textSizeClass} leading-relaxed font-sans`}>
                      "{hadith.translation}"
                    </p>
                  </div>

                  {/* Bottom Footer Details */}
                  <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs shrink-0 ${viewMode === 'list' ? 'sm:mt-0 sm:pt-0 sm:border-t-0 sm:flex-col sm:items-end sm:gap-2' : ''}`} style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-[11px] font-medium opacity-70">
                      {hadith.rawi}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Pelajari Tadabbur →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Detail Hadits */}
      <HadithDetailModal
        hadith={selectedHadith}
        isOpen={Boolean(selectedHadith)}
        onClose={() => setSelectedHadith(null)}
        isFavorite={selectedHadith ? favoriteIds.includes(selectedHadith.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onNavigateToAyah={onNavigateToAyah}
        fontSizeStep={fontSizeStep}
      />
    </div>
  );
};
