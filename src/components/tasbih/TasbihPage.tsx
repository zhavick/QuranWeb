import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Sparkles,
  Check,
  Award,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Flame,
  Info
} from 'lucide-react';
import { TasbihCountMode, TasbihPhrase } from '../../types/tasbih';
import { TASBIH_PHRASES, loadTasbihStats, incrementTasbihStats } from '../../services/tasbih';
import { triggerHaptic, playSyntheticClick, playSyntheticChime } from '../../services/prayers';
import { logActivity } from '../../services/telemetry';
import { BackToMushafButton } from '../common/BackToMushafButton';

interface TasbihPageProps {
  onBackToMushaf: () => void;
  elderMode?: boolean;
}

export const TasbihPage: React.FC<TasbihPageProps> = ({
  onBackToMushaf,
  elderMode = false,
}) => {
  // Mode: 'up' (hitung naik) atau 'down' (hitung mundur)
  const [countMode, setCountMode] = useState<TasbihCountMode>('up');
  const [selectedPhrase, setSelectedPhrase] = useState<TasbihPhrase>(TASBIH_PHRASES[0]);
  const [target, setTarget] = useState<number>(33); // 33, 99, 100, 1000, 0 (bebas)
  const [customTargetInput, setCustomTargetInput] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  // Counter state:
  // Untuk 'up': mulai dari 0, bertambah 1 setiap ketukan
  // Untuk 'down': mulai dari target, berkurang 1 setiap ketukan hingga 0
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [laps, setLaps] = useState<number>(0);
  const [completedNotification, setCompletedNotification] = useState<string | null>(null);

  // Settings
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [fontSizeStep, setFontSizeStep] = useState<number>(elderMode ? 1 : 0);
  const [stats, setStats] = useState(() => loadTasbihStats());
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [rippleAnim, setRippleAnim] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Set counter saat phrase atau mode atau target berubah
  const initCounterForMode = useCallback((mode: TasbihCountMode, tgt: number) => {
    if (mode === 'up') {
      setCurrentCount(0);
    } else {
      // Hitung mundur: mulai dari target (minimal 1 jika bebas)
      setCurrentCount(tgt > 0 ? tgt : 33);
    }
    setCompletedNotification(null);
  }, []);

  const handlePhraseSelect = (phrase: TasbihPhrase) => {
    setSelectedPhrase(phrase);
    setTarget(phrase.defaultTarget);
    setShowCustomInput(false);
    initCounterForMode(countMode, phrase.defaultTarget);
    logActivity('TASBIH_SELECT_PHRASE', { id: phrase.id, title: phrase.title });
  };

  const handleModeChange = (newMode: TasbihCountMode) => {
    setCountMode(newMode);
    initCounterForMode(newMode, target);
    showToast(newMode === 'up' ? 'Mode Hitung Naik aktif' : 'Mode Hitung Mundur aktif');
    logActivity('TASBIH_CHANGE_MODE', { mode: newMode });
  };

  const handleTargetChange = (newTarget: number) => {
    setTarget(newTarget);
    setShowCustomInput(false);
    initCounterForMode(countMode, newTarget);
    setLaps(0);
  };

  const handleCustomTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customTargetInput, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 99999) {
      setTarget(parsed);
      initCounterForMode(countMode, parsed);
      setLaps(0);
      setShowCustomInput(false);
      showToast(`Target kustom ${parsed}x diatur`);
    } else {
      showToast('Masukkan target angka antara 1 sampai 99.999');
    }
  };

  // Main Tap Handler
  const handleTap = useCallback(() => {
    setRippleAnim(true);
    setTimeout(() => setRippleAnim(false), 200);

    // Suara ketukan halus
    if (soundEnabled) {
      playSyntheticClick();
    }

    if (countMode === 'up') {
      const nextCount = currentCount + 1;
      setCurrentCount(nextCount);

      // Simpan statistik harian
      const updated = incrementTasbihStats(1, target > 0 && nextCount % target === 0 ? 1 : 0);
      setStats(updated);

      if (target > 0 && nextCount % target === 0) {
        // Genap 1 putaran target
        const newLaps = laps + 1;
        setLaps(newLaps);
        setCompletedNotification(`Alhamdulillah! Tuntas ${target}x dzikir (Putaran ke-${newLaps})`);

        if (hapticEnabled) triggerHaptic('complete');
        if (soundEnabled) playSyntheticChime();

        setTimeout(() => setCompletedNotification(null), 3000);
        logActivity('TASBIH_TARGET_COMPLETED', { mode: 'up', phrase: selectedPhrase.id, target, laps: newLaps });
      } else {
        if (hapticEnabled) triggerHaptic('tap');
      }
    } else {
      // Hitung Mundur (Count Down)
      if (currentCount <= 1) {
        // Selesai hitungan mundur ke 0
        setCurrentCount(0);
        const newLaps = laps + 1;
        setLaps(newLaps);
        setCompletedNotification(`Alhamdulillah! Hitung mundur ${target}x tuntas (Putaran ke-${newLaps})`);

        if (hapticEnabled) triggerHaptic('complete');
        if (soundEnabled) playSyntheticChime();

        const updated = incrementTasbihStats(1, 1);
        setStats(updated);

        setTimeout(() => {
          setCompletedNotification(null);
          // Mulai putaran mundur berikutnya secara otomatis
          setCurrentCount(target > 0 ? target : 33);
        }, 2200);

        logActivity('TASBIH_TARGET_COMPLETED', { mode: 'down', phrase: selectedPhrase.id, target, laps: newLaps });
      } else {
        const nextCount = currentCount - 1;
        setCurrentCount(nextCount);

        const updated = incrementTasbihStats(1, 0);
        setStats(updated);

        if (hapticEnabled) triggerHaptic('tap');
      }
    }
  }, [countMode, currentCount, target, laps, soundEnabled, hapticEnabled, selectedPhrase.id]);

  const handleReset = () => {
    initCounterForMode(countMode, target);
    setLaps(0);
    setCompletedNotification(null);
    if (hapticEnabled) triggerHaptic('tap');
    showToast('Hitungan tasbih direset');
    logActivity('TASBIH_RESET', { phrase: selectedPhrase.id });
  };

  // Keyboard accessibility (Spacebar or Enter to tap)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && e.target === document.body) {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTap]);

  // Hitung persentase progres putaran
  const progressPercent = useMemo(() => {
    if (target <= 0) return 100;
    if (countMode === 'up') {
      const step = currentCount % target;
      if (step === 0 && currentCount > 0) return 100;
      return Math.min(100, Math.round((step / target) * 100));
    } else {
      // Hitung mundur: progress dari 0% menuju 100% saat berkurang ke 0
      const remaining = currentCount;
      const done = Math.max(0, target - remaining);
      return Math.min(100, Math.round((done / target) * 100));
    }
  }, [countMode, currentCount, target]);

  // Scaled typography classes
  const arabicSizeClass =
    fontSizeStep === 2 ? 'text-4xl sm:text-5xl leading-loose' :
    fontSizeStep === 1 ? 'text-3xl sm:text-4xl leading-relaxed' :
    'text-2xl sm:text-3xl leading-relaxed';

  const counterSizeClass =
    fontSizeStep === 2 ? 'text-7xl sm:text-9xl' :
    fontSizeStep === 1 ? 'text-6xl sm:text-8xl' :
    'text-5xl sm:text-7xl';

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] pb-24 transition-colors select-none">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-color)] px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BackToMushafButton
              onClick={onBackToMushaf}
              elderMode={elderMode}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  Tasbih Digital
                </h1>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Dzikir &amp; Wirid
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] hidden sm:block">
                Menghitung dzikir harian dengan kemudahan mode hitung naik dan hitung mundur
              </p>
            </div>
          </div>

          {/* Quick Actions (Font Scaling) */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-[var(--bg-main)] rounded-lg p-0.5 border border-[var(--border-color)]">
              <button
                onClick={() => setFontSizeStep(0)}
                className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
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
                className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
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
                className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                  fontSizeStep === 2
                    ? 'bg-emerald-600 text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="Ukuran Ekstra Besar"
              >
                A++
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Mode Switcher Banner: Hitung Naik vs Hitung Mundur */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--bg-card)] p-2 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <div className="text-xs font-bold text-[var(--text-secondary)] px-2">
            PILIHAN CARA BERTASBIH:
          </div>

          <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleModeChange('up')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                countMode === 'up'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Hitung Naik (0 → Target)</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('down')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                countMode === 'down'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              <span>Hitung Mundur (Target → 0)</span>
            </button>
          </div>
        </div>

        {/* Phrase Selection Chips */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Pilihan Kalimat Dzikir:
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {selectedPhrase.title}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {TASBIH_PHRASES.map((phrase) => {
              const active = selectedPhrase.id === phrase.id;
              return (
                <button
                  key={phrase.id}
                  type="button"
                  onClick={() => handlePhraseSelect(phrase)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-color)] hover:border-emerald-500/40'
                  }`}
                >
                  <span>{phrase.title}</span>
                  <span className={`ml-1.5 text-[10px] opacity-80 ${active ? 'text-emerald-100' : 'text-[var(--text-secondary)]'}`}>
                    ({phrase.defaultTarget}x)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Presets & Quick Settings Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-color)] text-xs">
          {/* Target options */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-[var(--text-secondary)] mr-1">Target:</span>
            {[33, 99, 100, 1000].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTargetChange(t)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  target === t && !showCustomInput
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                {t}x
              </button>
            ))}

            {countMode === 'up' && (
              <button
                type="button"
                onClick={() => handleTargetChange(0)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  target === 0 && !showCustomInput
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
                title="Bebas tanpa batasan target"
              >
                Bebas ∞
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer border ${
                showCustomInput
                  ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40'
                  : 'bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-color)]'
              }`}
            >
              Kustom...
            </button>
          </div>

          {/* Feedback Toggles */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHapticEnabled(!hapticEnabled)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold border cursor-pointer transition-colors ${
                hapticEnabled
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-color)]'
              }`}
              title="Getaran Haptic (Smartphone)"
            >
              <Vibrate className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{hapticEnabled ? 'Getar Aktif' : 'Getar Mati'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold border cursor-pointer transition-colors ${
                soundEnabled
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-color)]'
              }`}
              title="Suara Klik Halus"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Suara Aktif' : 'Bisu'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-500 cursor-pointer transition-colors"
              title="Reset Hitungan ke Awal"
              aria-label="Reset Hitungan"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Custom Target Input Drawer */}
        {showCustomInput && (
          <form
            onSubmit={handleCustomTargetSubmit}
            className="flex items-center gap-2 bg-[var(--bg-card)] p-3 rounded-2xl border border-emerald-500/30 shadow-md animate-fade-in"
          >
            <span className="text-xs font-bold text-[var(--text-secondary)]">Target Kustom:</span>
            <input
              type="number"
              min="1"
              max="99999"
              value={customTargetInput}
              onChange={(e) => setCustomTargetInput(e.target.value)}
              placeholder="Contoh: 300..."
              className="w-32 px-3 py-1.5 text-xs rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-sm"
            >
              Terapkan
            </button>
            <button
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Batal
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* THE MAIN INTERACTIVE TASBIH CARD (DAPAT DIKETUK) */}
        {/* ======================================================== */}
        <div
          onClick={handleTap}
          role="button"
          tabIndex={0}
          aria-label={`Ketuk untuk bertasbih ${selectedPhrase.title}`}
          className={`relative select-none cursor-pointer rounded-3xl border-2 p-6 sm:p-10 text-center shadow-2xl transition-all duration-150 active:scale-[0.985] flex flex-col items-center justify-between overflow-hidden group ${
            rippleAnim ? 'ring-4 ring-emerald-500/30' : ''
          }`}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: completedNotification ? '#10b981' : 'var(--border-color)',
            minHeight: elderMode ? '420px' : '380px',
          }}
        >
          {/* Background Ambient Progress Fill (Bottom to Top) */}
          <div
            className="absolute inset-0 bg-emerald-500/10 pointer-events-none transition-all duration-300 ease-out"
            style={{
              height: `${progressPercent}%`,
              top: 'auto',
              bottom: 0,
            }}
          />

          {/* Top Info Inside Card */}
          <div className="w-full flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)]">
              {countMode === 'up' ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-[var(--text-secondary)]">Mode: Hitung Naik</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-bold text-[var(--text-secondary)]">Mode: Hitung Mundur</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {laps > 0 && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  <span>Putaran ke-{laps} ({laps * (target > 0 ? target : currentCount)}x)</span>
                </span>
              )}

              <span className="px-3 py-1 rounded-full bg-[var(--bg-main)] text-[var(--text-secondary)] font-bold border border-[var(--border-color)]">
                {target > 0 ? `Target: ${target}x` : 'Bebas'}
              </span>
            </div>
          </div>

          {/* Center: Arabic Calligraphy, Latin & Translation */}
          <div className="my-auto py-4 z-10 max-w-xl space-y-2">
            <h2
              className={`font-arabic-amiri font-bold text-emerald-700 dark:text-emerald-300 tracking-wide select-all ${arabicSizeClass}`}
              dir="rtl"
            >
              {selectedPhrase.arabic}
            </h2>
            <p className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              {selectedPhrase.latin}
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed italic">
              "{selectedPhrase.meaning}"
            </p>

            {/* HUGE COUNTER DISPLAY */}
            <div className="py-4">
              <div
                className={`font-black tracking-tighter text-[var(--text-primary)] transition-transform duration-100 ${counterSizeClass} ${
                  rippleAnim ? 'scale-105 text-emerald-600 dark:text-emerald-400' : ''
                }`}
                style={{ lineHeight: 1 }}
              >
                {currentCount}
              </div>

              <div className="mt-2 text-xs font-semibold text-[var(--text-secondary)]">
                {countMode === 'up' ? (
                  target > 0 ? (
                    <span>
                      {currentCount % target} dari {target} ketukan ({progressPercent}%)
                    </span>
                  ) : (
                    <span>Total {currentCount} ketukan tasbih</span>
                  )
                ) : (
                  <span>
                    Sisa {currentCount} ketukan menuju 0 ({progressPercent}% selesai)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Tap Call-to-action & Celebrations */}
          <div className="w-full z-10 flex flex-col items-center gap-2">
            {/* Visual Progress Bar */}
            <div className="w-full max-w-md bg-[var(--bg-main)] h-2 rounded-full overflow-hidden border border-[var(--border-color)]">
              <div
                className="bg-emerald-600 h-full transition-all duration-200 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
              <Sparkles className="h-4 w-4" />
              <span>Ketuk di mana saja pada kotak kartu ini atau tekan Spasi</span>
            </div>
          </div>

          {/* Congratulations Toast inside Card on Lap Completion */}
          {completedNotification && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 rounded-full px-5 py-2 bg-emerald-600 text-white text-xs font-bold shadow-2xl animate-bounce flex items-center gap-2 border border-emerald-400/40">
              <Check className="h-4 w-4" />
              <span>{completedNotification}</span>
            </div>
          )}
        </div>

        {/* Daily Stats & Fadilah Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Daily Stats Card */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Statistik Dzikir Hari Ini
                  </h3>
                  <span className="text-xs text-[var(--text-primary)] font-medium">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <div className="text-[11px] font-semibold text-[var(--text-secondary)]">
                  Total Ketukan Dzikir
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {stats.todayCount.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <div className="text-[11px] font-semibold text-[var(--text-secondary)]">
                  Putaran Tuntas
                </div>
                <div className="text-2xl font-black text-amber-500 mt-1">
                  {stats.totalLaps.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>

          {/* Fadilah & Dalil Card */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 shadow-sm space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Keutamaan (Fadilah) {selectedPhrase.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                {selectedPhrase.fadilah}
              </p>
            </div>

            {selectedPhrase.dalil && (
              <div className="pt-2 border-t border-[var(--border-color)] flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium">
                <BookOpen className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Rujukan: {selectedPhrase.dalil}</span>
              </div>
            )}
          </div>
        </div>

        {/* Elder Mode Tip */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-[var(--text-secondary)] leading-relaxed flex items-start gap-3">
          <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[var(--text-primary)] block mb-0.5">
              Kenyamanan Berdzikir bagi Jamaah &amp; Lansia:
            </span>
            Anda dapat memejamkan mata sambil berbaring atau duduk santai. Sentuh di mana saja pada kartu tasbih untuk menambah atau mengurangi hitungan. Ponsel akan bergetar lembut pada tiap ketukan dan memainkan melodi halus saat target putaran tercapai.
          </div>
        </div>
      </main>
    </div>
  );
};
