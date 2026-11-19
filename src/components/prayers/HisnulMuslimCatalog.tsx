import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Heart,
  Volume2,
  Square,
  Copy,
  Check,
  BookOpen,
  Info,
  X,
} from 'lucide-react';
import {
  HisnulMuslimDua,
  HisnulMuslimCategory,
} from '../../types/hisnulMuslim';
import {
  fetchHisnulMuslimDuas,
  getFavoriteHisnulMuslimIds,
  toggleFavoriteHisnulMuslim,
  HISNUL_MUSLIM_CATEGORIES,
  playDuaVoice,
  stopDuaVoice,
} from '../../services/hisnulMuslim';
import { BackToMushafButton } from '../common/BackToMushafButton';
import { SalahGuideModal } from './SalahGuideModal';
import { logActivity } from '../../services/telemetry';

interface HisnulMuslimCatalogProps {
  onBackToMushaf: () => void;
  elderMode?: boolean;
}

export const HisnulMuslimCatalog: React.FC<HisnulMuslimCatalogProps> = ({
  onBackToMushaf,
  elderMode = false,
}) => {
  const [duas, setDuas] = useState<HisnulMuslimDua[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HisnulMuslimCategory | 'semua' | 'favorit'>('semua');
  const [favorites, setFavorites] = useState<number[]>(() => getFavoriteHisnulMuslimIds());
  const [fontSizeStep, setFontSizeStep] = useState<number>(elderMode ? 1 : 0);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [salahGuideOpen, setSalahGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchHisnulMuslimDuas().then((data) => {
      setDuas(data);
      setLoading(false);
    });
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFavorite = (id: number) => {
    const updated = toggleFavoriteHisnulMuslim(id);
    setFavorites(updated);
    triggerToast(updated.includes(id) ? 'Doa ditambahkan ke favorit ⭐' : 'Doa dihapus dari favorit');
  };

  const handleCopyText = (dua: HisnulMuslimDua) => {
    const textToCopy = `[${dua.title}] - Hisnul Muslim (QuranWeb)\n\n${dua.arabic}\n\n"${dua.transliteration}"\n\nArtinya:\n${dua.translation}\n\nSumber: ${dua.source}${dua.fawaid ? `\nKeutamaan: ${dua.fawaid}` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(dua.id);
    triggerToast('Teks doa berhasil disalin ke clipboard ✓');
    logActivity('COPY_HISNUL_MUSLIM_DUA', { id: dua.id, title: dua.title });
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePlayAudio = (dua: HisnulMuslimDua) => {
    if (playingId === dua.id) {
      stopDuaVoice();
      setPlayingId(null);
      return;
    }

    stopDuaVoice();
    setPlayingId(dua.id);

    const success = playDuaVoice(
      dua.arabic,
      'ar',
      () => setPlayingId(null),
      () => {
        setPlayingId(null);
        triggerToast('Gagal memutar audio TTS peramban.');
      }
    );

    if (!success) {
      setPlayingId(null);
      triggerToast('Peramban tidak mendukung Web Speech Audio.');
    }
  };

  // Filtered list
  const filteredDuas = useMemo(() => {
    return duas.filter((d) => {
      // Category filter
      if (selectedCategory === 'favorit') {
        if (!favorites.includes(d.id)) return false;
      } else if (selectedCategory !== 'semua') {
        if (d.category !== selectedCategory) return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q) ||
        d.translation.toLowerCase().includes(q) ||
        (d.source && d.source.toLowerCase().includes(q)) ||
        (d.fawaid && d.fawaid.toLowerCase().includes(q))
      );
    });
  }, [duas, selectedCategory, favorites, searchQuery]);

  return (
    <div
      className="min-h-screen pb-20 transition-colors"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Standard Navigation Bar */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <BackToMushafButton
              onClick={onBackToMushaf}
              label="Kembali ke Mushaf"
              elderMode={elderMode}
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <h1 className="font-bold text-base sm:text-lg">
                  Kumpulan Doa Sehari-hari
                </h1>
                <span className="hidden sm:inline rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  Hisnul Muslim
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] hidden sm:block">
                Perisai doa harian berlandaskan hadits-hadits shahih karya Syaikh Al-Qahthani
              </p>
            </div>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2">
            {/* Salah Guide Button */}
            <button
              type="button"
              onClick={() => setSalahGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Panduan Shalat</span>
            </button>

            {/* Font Size Step */}
            <div className="flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] p-0.5">
              <button
                type="button"
                onClick={() => setFontSizeStep(0)}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  fontSizeStep === 0 ? 'bg-[var(--bg-card)] shadow-xs text-emerald-600' : 'text-[var(--text-secondary)]'
                }`}
                title="Ukuran Font Standar"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSizeStep(1)}
                className={`px-2 py-1 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  fontSizeStep === 1 ? 'bg-[var(--bg-card)] shadow-xs text-emerald-600' : 'text-[var(--text-secondary)]'
                }`}
                title="Ukuran Font Sedang"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSizeStep(2)}
                className={`px-2 py-1 text-base font-bold rounded-lg transition-all cursor-pointer ${
                  fontSizeStep === 2 ? 'bg-[var(--bg-card)] shadow-xs text-emerald-600' : 'text-[var(--text-secondary)]'
                }`}
                title="Ukuran Font Besar (Ramah Lansia)"
              >
                A++
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-5 sm:px-6 space-y-6">
        {/* Banner Motivasi Spiritual & Shortcut Shalat */}
        <div
          className="rounded-3xl border p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="space-y-1.5 z-10 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Benteng Seorang Muslim (حِصْنُ الْمُسْلِمِ)</span>
            </span>
            <h2 className="text-base sm:text-xl font-bold text-[var(--text-primary)]">
              Perisai Diri dalam Setiap Gerak &amp; Nafas Kehidupan
            </h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-xl leading-relaxed">
              &ldquo;Doa adalah senjata orang mukmin, pilar penegak agama, dan cahaya langit serta bumi.&rdquo; (HR. Abu Ya&apos;la &amp; Al-Hakim). Tersedia 100+ doa shahih lengkap dengan audio pelafalan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSalahGuideOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shrink-0 cursor-pointer shadow-md transition-all hover:scale-102"
          >
            <BookOpen className="h-4 w-4" />
            <span>Buka Panduan Shalat Bergambar ➔</span>
          </button>
        </div>

        {/* Search Bar & Instant Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari doa harian... (misal: bangun tidur, makan, utang, bepergian, shalat, istighfar)"
              className="w-full rounded-2xl border pl-10 pr-10 py-3 text-xs sm:text-sm outline-none transition-all shadow-xs focus:ring-2 focus:ring-emerald-500/40"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs opacity-60 hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {HISNUL_MUSLIM_CATEGORIES.map((cat) => {
              const count =
                cat.id === 'semua'
                  ? duas.length
                  : cat.id === 'favorit'
                  ? favorites.length
                  : duas.filter((d) => d.category === cat.id).length;

              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-emerald-500/40 hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter Results */}
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-1">
          <span>
            Menampilkan <strong>{filteredDuas.length}</strong> dari {duas.length} doa harian
          </span>
          {selectedCategory === 'favorit' && favorites.length === 0 && (
            <span className="text-amber-500 font-medium">Belum ada doa yang ditandai favorit ⭐</span>
          )}
        </div>

        {/* Duas List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
            <p className="text-xs text-[var(--text-secondary)]">Memuat kumpulan doa Hisnul Muslim...</p>
          </div>
        ) : filteredDuas.length === 0 ? (
          <div
            className="py-16 text-center rounded-2xl border p-8 space-y-3"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="text-4xl">🔍</div>
            <h3 className="font-bold text-sm sm:text-base">Doa tidak ditemukan</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
              Tidak ada doa yang sesuai dengan kata kunci &ldquo;{searchQuery}&rdquo;. Coba gunakan kata kunci lain seperti &ldquo;tidur&rdquo;, &ldquo;sakit&rdquo;, atau &ldquo;rezeki&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('semua');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDuas.map((dua) => {
              const isFav = favorites.includes(dua.id);
              const isPlaying = playingId === dua.id;
              const isCopied = copiedId === dua.id;

              return (
                <div
                  key={dua.id}
                  id={`dua-${dua.id}`}
                  className="rounded-2xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-md space-y-3.5"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: isFav ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 font-bold text-xs text-emerald-700 dark:text-emerald-300">
                        {dua.id}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
                          {dua.title}
                        </h3>
                        <span className="text-[10px] font-semibold text-[var(--text-secondary)] capitalize">
                          Kategori: {dua.category}
                        </span>
                      </div>
                    </div>

                    {/* Actions: Favorite & Audio & Copy */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {dua.repeatCount && dua.repeatCount > 1 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 mr-1">
                          Dibaca {dua.repeatCount}x
                        </span>
                      )}

                      {/* Play Voice TTS */}
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(dua)}
                        title={isPlaying ? 'Hentikan Audio' : 'Dengarkan Pelafalan Doa'}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                          isPlaying
                            ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                            : 'border-[var(--border-color)] bg-[var(--bg-muted)] hover:border-emerald-500/50 text-[var(--text-primary)]'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Square className="h-3 w-3 fill-current" />
                            <span className="text-[11px] hidden sm:inline">Hening</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3 text-emerald-500" />
                            <span className="text-[11px] hidden sm:inline">Suara</span>
                          </>
                        )}
                      </button>

                      {/* Copy Text */}
                      <button
                        type="button"
                        onClick={() => handleCopyText(dua)}
                        title="Salin Teks Doa Lengkap"
                        className="p-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] hover:border-emerald-500/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>

                      {/* Favorite Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(dua.id)}
                        title={isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                        className="p-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] hover:border-emerald-500/50 cursor-pointer"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${
                            isFav ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-secondary)]'
                          }`}
                        />
                      </button>
                    </div>
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
                      className={`font-arabic leading-loose font-normal text-emerald-900 dark:text-emerald-100 ${
                        fontSizeStep === 2
                          ? 'text-2xl sm:text-3xl'
                          : fontSizeStep === 1
                          ? 'text-xl sm:text-2xl'
                          : 'text-lg sm:text-xl'
                      }`}
                      dir="rtl"
                    >
                      {dua.arabic}
                    </p>
                  </div>

                  {/* Latin Transliteration */}
                  <div
                    className={`italic font-medium text-emerald-700 dark:text-emerald-300 ${
                      fontSizeStep === 2 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                    }`}
                  >
                    &ldquo;{dua.transliteration}&rdquo;
                  </div>

                  {/* Indonesian Translation */}
                  <div
                    className={`text-[var(--text-primary)] leading-relaxed ${
                      fontSizeStep === 2 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                    }`}
                  >
                    <strong>Artinya:</strong> {dua.translation}
                  </div>

                  {/* Footer Source & Fawaid */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)] text-[11px] text-[var(--text-secondary)]">
                    <div className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {dua.source}
                    </div>

                    {dua.fawaid && (
                      <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                        <Info className="h-3 w-3 text-amber-500 shrink-0" />
                        <span className="italic">{dua.fawaid}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-5 py-2.5 text-xs font-bold text-white bg-black/85 backdrop-blur-md shadow-2xl animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Salah Guide Modal */}
      <SalahGuideModal
        isOpen={salahGuideOpen}
        onClose={() => setSalahGuideOpen(false)}
        elderMode={elderMode}
      />
    </div>
  );
};
