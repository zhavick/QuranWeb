import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Heart,
  Play,
  Pause,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Sun,
  Sunset,
  Clock,
  Compass,
} from 'lucide-react';
import type { RabbanaDua, DuaCategory, DzikirItem, DzikirTime } from '../../types/prayers';
import {
  fetchRabbanaDuas,
  fetchDailyDzikr,
  getFavoriteDuaIds,
  toggleFavoriteDua,
  getAyahAudioUrl,
} from '../../services/prayers';
import { TasbihHapticWidget } from './TasbihHapticWidget';
import { logActivity } from '../../services/telemetry';

interface PrayersCatalogProps {
  onBackToMushaf: () => void;
  onNavigateToAyah: (surahId: number, ayahNumber: number) => void;
  elderMode?: boolean;
}

export const PrayersCatalog: React.FC<PrayersCatalogProps> = ({
  onBackToMushaf,
  onNavigateToAyah,
  elderMode = false,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'rabbana' | 'dzikir' | 'tasbih'>('rabbana');
  const [duas, setDuas] = useState<RabbanaDua[]>([]);
  const [dailyDzikr, setDailyDzikr] = useState<DzikirItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [duaCategory, setDuaCategory] = useState<DuaCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [dzikirSubTab, setDzikirSubTab] = useState<DzikirTime>('bada_shalat');

  // Font size scale: 0: normal, 1: large, 2: extra large
  const [fontSizeStep, setFontSizeStep] = useState<number>(elderMode ? 1 : 0);

  // Audio Playback state
  const [playingDuaId, setPlayingDuaId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  useEffect(() => {
    fetchRabbanaDuas().then((d) => setDuas(d));
    fetchDailyDzikr().then((z) => setDailyDzikr(z));
    setFavoriteIds(getFavoriteDuaIds());
  }, []);

  const handleToggleFavorite = (id: number) => {
    const isNowFav = toggleFavoriteDua(id);
    setFavoriteIds(getFavoriteDuaIds());
    showToast(isNowFav ? 'Doa ditambahkan ke favorit' : 'Doa dihapus dari favorit');
  };

  const handleCopyDua = (dua: RabbanaDua) => {
    const text = `🤲 ${dua.theme} (QS. ${dua.surahName} [${dua.surahId}]: ${dua.ayahRange || dua.ayahNumber})\n\n${dua.arabic}\n\n"${dua.latin}"\n\nArtinya:\n"${dua.translation}"\n\n— Melalui QuranWeb`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(dua.id);
      showToast('Doa berhasil disalin ke clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handlePlayAudio = (dua: RabbanaDua) => {
    if (playingDuaId === dua.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingDuaId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audioUrl = getAyahAudioUrl(dua.surahId, dua.audioAyahNumber || dua.ayahNumber);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      setPlayingDuaId(null);
    };

    audio.onerror = () => {
      setPlayingDuaId(null);
      showToast('Gagal memutar audio doa');
    };

    audio.play();
    setPlayingDuaId(dua.id);
    logActivity('PLAY_DUA_AUDIO', { duaId: dua.id, surahId: dua.surahId });
  };

  // Filtered Rabbana Duas
  const filteredDuas = useMemo(() => {
    return duas.filter((d) => {
      if (duaCategory !== 'semua' && d.category !== duaCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTheme = d.theme.toLowerCase().includes(q);
        const matchesSurah = d.surahName.toLowerCase().includes(q);
        const matchesTrans = d.translation.toLowerCase().includes(q);
        const matchesLatin = d.latin.toLowerCase().includes(q);
        if (!matchesTheme && !matchesSurah && !matchesTrans && !matchesLatin) return false;
      }
      return true;
    });
  }, [duas, duaCategory, searchQuery]);

  // Filtered Daily Dzikr
  const filteredDzikr = useMemo(() => {
    return dailyDzikr.filter((item) => item.time === dzikirSubTab);
  }, [dailyDzikr, dzikirSubTab]);

  const arabicFontSizeClass = fontSizeStep === 2 ? 'text-3xl' : fontSizeStep === 1 ? 'text-2xl' : 'text-xl';
  const transFontSizeClass = fontSizeStep === 2 ? 'text-base' : fontSizeStep === 1 ? 'text-sm' : 'text-xs';

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top Header */}
      <header
        className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6 shadow-xs backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMushaf}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            title="Kembali ke Mushaf Al-Qur'an"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>Kumpulan Doa Qur&apos;ani &amp; Dzikir</span>
              <Sparkles className="h-4 w-4 text-emerald-500" />
            </h1>
            <p className="text-[11px] truncate hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
              40 Doa Rabbana, Dzikir Pagi-Petang, dan Tasbih Digital Haptic
            </p>
          </div>
        </div>

        {/* Font Size Adjuster Controls */}
        <div className="flex items-center gap-1.5 rounded-xl border p-1" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-muted)' }}>
          {[
            { label: 'A', step: 0 },
            { label: 'A+', step: 1 },
            { label: 'A++', step: 2 },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setFontSizeStep(item.step)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                fontSizeStep === item.step ? 'shadow-xs' : ''
              }`}
              style={{
                backgroundColor: fontSizeStep === item.step ? 'var(--bg-accent)' : 'transparent',
                color: fontSizeStep === item.step ? 'var(--text-on-accent)' : 'var(--text-secondary)',
              }}
              title={`Ukuran Huruf ${item.label}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div
        className="sticky top-16 z-20 flex items-center justify-center border-b px-4 py-2"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2 max-w-xl w-full">
          {[
            { id: 'rabbana', label: '40 Doa Rabbana', icon: BookOpen },
            { id: 'dzikir', label: 'Dzikir Harian', icon: Sun },
            { id: 'tasbih', label: 'Tasbih Haptic', icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveMainTab(tab.id as typeof activeMainTab);
                  if (audioRef.current) audioRef.current.pause();
                  setPlayingDuaId(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  active ? 'shadow-sm' : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: active ? 'var(--bg-accent)' : 'var(--bg-muted)',
                  color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace Container */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* ======================================================= */}
          {/* TAB 1: 40 DOA RABBANA */}
          {/* ======================================================= */}
          {activeMainTab === 'rabbana' && (
            <div className="space-y-5">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3 h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari tema doa (misal: keluarga, ampunan, orang tua, sabar)..."
                    className="w-full rounded-2xl border pl-10 pr-4 py-2.5 text-xs outline-none shadow-xs"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                  {[
                    { id: 'semua', label: 'Semua (40)' },
                    { id: 'keluarga', label: 'Keluarga' },
                    { id: 'ampunan', label: 'Ampunan' },
                    { id: 'kesabaran', label: 'Kesabaran' },
                    { id: 'kebaikan', label: 'Kebaikan' },
                    { id: 'perlindungan', label: 'Perlindungan' },
                    { id: 'keteguhan', label: 'Keteguhan' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setDuaCategory(cat.id as DuaCategory)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                        duaCategory === cat.id ? 'shadow-xs' : ''
                      }`}
                      style={{
                        backgroundColor: duaCategory === cat.id ? 'var(--bg-accent)' : 'var(--bg-card)',
                        color: duaCategory === cat.id ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                        border: `1px solid ${duaCategory === cat.id ? 'transparent' : 'var(--border-color)'}`,
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duas List */}
              <div className="space-y-4">
                {filteredDuas.map((dua) => {
                  const isPlaying = playingDuaId === dua.id;
                  const isFav = favoriteIds.includes(dua.id);
                  const isCopied = copiedId === dua.id;

                  return (
                    <article
                      key={dua.id}
                      className={`rounded-3xl border p-5 sm:p-6 shadow-sm transition-all space-y-4 ${
                        isPlaying ? 'ring-2 ring-emerald-500/30' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold text-white shadow-xs"
                            style={{ backgroundColor: 'var(--bg-accent)' }}
                          >
                            {dua.id}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                              {dua.theme}
                            </h3>
                            <span className="text-[11px] font-semibold" style={{ color: 'var(--text-accent)' }}>
                              QS. {dua.surahName} [{dua.surahId}]: {dua.ayahRange || dua.ayahNumber}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Play Murottal Button */}
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(dua)}
                            className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                              isPlaying ? 'bg-emerald-600 text-white' : 'border'
                            }`}
                            style={{
                              backgroundColor: isPlaying ? undefined : 'var(--bg-muted)',
                              borderColor: isPlaying ? undefined : 'var(--border-color)',
                              color: isPlaying ? undefined : 'var(--text-primary)',
                            }}
                            title="Dengarkan Murottal Doa"
                          >
                            {isPlaying ? <Pause className="h-3.5 w-3.5 animate-pulse" /> : <Play className="h-3.5 w-3.5" />}
                            <span className="hidden sm:inline">{isPlaying ? 'Jeda' : 'Audio'}</span>
                          </button>

                          {/* Copy Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyDua(dua)}
                            className="p-1.5 rounded-xl border cursor-pointer hover:opacity-80"
                            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                            title="Salin Doa"
                          >
                            {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>

                          {/* Favorite Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(dua.id)}
                            className={`p-1.5 rounded-xl border cursor-pointer transition-colors ${
                              isFav ? 'text-red-500 bg-red-500/10 border-red-500/30' : 'hover:text-red-500'
                            }`}
                            style={{ borderColor: isFav ? undefined : 'var(--border-color)', color: isFav ? undefined : 'var(--text-secondary)' }}
                            title={isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                          >
                            <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Arabic Text */}
                      <div
                        className={`font-arabic-amiri font-bold text-right leading-loose pt-1 ${arabicFontSizeClass}`}
                        style={{ color: 'var(--text-primary)' }}
                        dir="rtl"
                      >
                        {dua.arabic}
                      </div>

                      {/* Transliteration Latin */}
                      <div className="text-xs italic leading-relaxed" style={{ color: 'var(--text-accent)' }}>
                        {dua.latin}
                      </div>

                      {/* Indonesian Translation */}
                      <p className={`leading-relaxed border-l-2 pl-3 py-0.5 ${transFontSizeClass}`} style={{ borderColor: 'var(--text-accent)', color: 'var(--text-secondary)' }}>
                        &ldquo;{dua.translation}&rdquo;
                      </p>

                      {/* Aspek / Faedah Doa */}
                      <div
                        className="rounded-2xl p-3 text-xs leading-relaxed flex items-start justify-between gap-3"
                        style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-primary)' }}
                      >
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                          <span className="text-[11px] leading-relaxed">{dua.aspekDoa}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onNavigateToAyah(dua.surahId, dua.ayahNumber)}
                          className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold shrink-0 cursor-pointer shadow-2xs"
                          style={{
                            backgroundColor: 'var(--bg-accent)',
                            color: 'var(--text-on-accent)',
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Buka Mushaf</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 2: DZIKIR HARIAN */}
          {/* ======================================================= */}
          {activeMainTab === 'dzikir' && (
            <div className="space-y-5">
              {/* Dzikir Sub-Tabs */}
              <div className="flex items-center justify-center gap-2">
                {[
                  { id: 'bada_shalat', label: 'Ba\'da Shalat Fardhu', icon: Clock },
                  { id: 'pagi', label: 'Dzikir Pagi', icon: Sun },
                  { id: 'petang', label: 'Dzikir Petang', icon: Sunset },
                ].map((st) => {
                  const Icon = st.icon;
                  const active = dzikirSubTab === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setDzikirSubTab(st.id as DzikirTime)}
                      className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                        active ? 'shadow-xs' : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: active ? 'var(--bg-accent)' : 'var(--bg-card)',
                        color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                        border: `1px solid ${active ? 'transparent' : 'var(--border-color)'}`,
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dzikir Cards List */}
              <div className="space-y-4">
                {filteredDzikr.map((item, idx) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border p-5 sm:p-6 shadow-sm space-y-3.5"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center justify-between gap-2 border-b pb-2.5" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          {item.title}
                        </h3>
                      </div>

                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-accent)' }}
                      >
                        Dibaca {item.targetCount}x
                      </span>
                    </div>

                    <div
                      className={`font-arabic-amiri font-bold text-right leading-loose pt-1 ${arabicFontSizeClass}`}
                      style={{ color: 'var(--text-primary)' }}
                      dir="rtl"
                    >
                      {item.arabic}
                    </div>

                    {item.latin && (
                      <div className="text-xs italic leading-relaxed" style={{ color: 'var(--text-accent)' }}>
                        {item.latin}
                      </div>
                    )}

                    <p className={`leading-relaxed border-l-2 pl-3 py-0.5 ${transFontSizeClass}`} style={{ borderColor: 'var(--text-accent)', color: 'var(--text-secondary)' }}>
                      &ldquo;{item.translation}&rdquo;
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2.5 text-[11px]" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                      {item.source && <span>Rujukan: {item.source}</span>}
                      {item.note && <span className="italic text-emerald-600 dark:text-emerald-400">💡 {item.note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 3: TASBIH DIGITAL HAPTIC */}
          {/* ======================================================= */}
          {activeMainTab === 'tasbih' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Tasbih Digital Haptic Layar Penuh
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Sentuh di mana saja pada permukaan piringan tasbih untuk berdzikir tanpa harus memelototi layar HP
                </p>
              </div>

              <TasbihHapticWidget elderMode={elderMode || fontSizeStep > 0} />
            </div>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      {toastMsg && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xl animate-bounce"
          style={{
            backgroundColor: 'var(--bg-accent)',
            color: 'var(--text-on-accent)',
          }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
};
