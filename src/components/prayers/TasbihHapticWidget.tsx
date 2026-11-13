import React, { useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Sparkles,
  Check,
  Award,
} from 'lucide-react';
import { triggerHaptic, playSyntheticClick } from '../../services/prayers';
import { logActivity } from '../../services/telemetry';

const PHRASES = [
  { id: 'subhanallah', title: 'Subhanallah', arabic: 'سُبْحَانَ اللَّهِ', meaning: 'Maha Suci Allah' },
  { id: 'alhamdulillah', title: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', meaning: 'Segala Puji bagi Allah' },
  { id: 'allahuakbar', title: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', meaning: 'Allah Maha Besar' },
  { id: 'astaghfirullah', title: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', meaning: 'Aku memohon ampun kepada Allah' },
  { id: 'lailahaillallah', title: 'La ilaha illallah', arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', meaning: 'Tiada Tuhan selain Allah' },
  { id: 'shalawat', title: 'Shalawat Nabi', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', meaning: 'Ya Allah limpahkanlah shalawat atas Nabi Muhammad' },
];

interface TasbihHapticWidgetProps {
  elderMode?: boolean;
}

export const TasbihHapticWidget: React.FC<TasbihHapticWidgetProps> = ({
  elderMode = false,
}) => {
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33); // 33, 100, 0 (bebas)
  const [laps, setLaps] = useState<number>(0);
  const [selectedPhrase, setSelectedPhrase] = useState(PHRASES[0]);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [completedNotification, setCompletedNotification] = useState<boolean>(false);

  const handleTap = useCallback(() => {
    const nextCount = count + 1;
    setCount(nextCount);

    // Audio & Haptic Feedback
    if (soundEnabled) playSyntheticClick();

    if (target > 0 && nextCount % target === 0) {
      // Reached Target
      setLaps((l) => l + 1);
      setCompletedNotification(true);
      if (hapticEnabled) {
        if (target === 33) triggerHaptic('lap');
        else triggerHaptic('complete');
      }
      setTimeout(() => setCompletedNotification(false), 2000);
      logActivity('TASBIH_TARGET_REACHED', { phrase: selectedPhrase.id, target });
    } else {
      if (hapticEnabled) triggerHaptic('tap');
    }
  }, [count, target, hapticEnabled, soundEnabled, selectedPhrase.id]);

  const handleReset = () => {
    setCount(0);
    setLaps(0);
    setCompletedNotification(false);
    if (hapticEnabled) triggerHaptic('tap');
    logActivity('RESET_TASBIH');
  };

  // Keyboard shortcut: Spacebar or Enter to tap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTap]);

  const progressPercent = target > 0 ? Math.min(100, Math.round(((count % target) / target) * 100)) : 100;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Phrase Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PHRASES.map((p) => {
          const active = selectedPhrase.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPhrase(p)}
              className={`rounded-2xl px-3.5 py-2 text-xs font-bold shrink-0 transition-all cursor-pointer ${
                active ? 'shadow-sm' : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: active ? 'var(--bg-accent)' : 'var(--bg-card)',
                color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: `1px solid ${active ? 'transparent' : 'var(--border-color)'}`,
              }}
            >
              {p.title}
            </button>
          );
        })}
      </div>

      {/* Target Selector & Toggles Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 shadow-xs"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
            Target:
          </span>
          {[
            { label: '33x', value: 33 },
            { label: '100x', value: 100 },
            { label: 'Bebas', value: 0 },
          ].map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setTarget(t.value);
                setCount(0);
                setLaps(0);
              }}
              className={`rounded-xl px-3 py-1 text-xs font-bold cursor-pointer transition-all ${
                target === t.value ? 'shadow-xs' : ''
              }`}
              style={{
                backgroundColor: target === t.value ? 'var(--bg-accent)' : 'var(--bg-muted)',
                color: target === t.value ? 'var(--text-on-accent)' : 'var(--text-secondary)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Haptic & Sound Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold cursor-pointer border ${
              hapticEnabled ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400' : ''
            }`}
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: hapticEnabled ? undefined : 'var(--border-color)',
              color: hapticEnabled ? undefined : 'var(--text-secondary)',
            }}
            title="Getaran Haptic (Smartphone)"
          >
            <Vibrate className="h-3.5 w-3.5" />
            <span>{hapticEnabled ? 'Getar Aktif' : 'Getar Mati'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold cursor-pointer border ${
              soundEnabled ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400' : ''
            }`}
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: soundEnabled ? undefined : 'var(--border-color)',
              color: soundEnabled ? undefined : 'var(--text-secondary)',
            }}
            title="Suara Klik Halus"
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>{soundEnabled ? 'Suara' : 'Bisu'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-xl border hover:bg-red-500/10 text-red-500 cursor-pointer"
            style={{ borderColor: 'var(--border-color)' }}
            title="Reset Hitungan ke 0"
            aria-label="Reset Tasbih"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* BIG TOUCH COUNTER AREA (Ketuk di Mana Saja) */}
      <div
        onClick={handleTap}
        className={`relative select-none cursor-pointer rounded-3xl border p-8 sm:p-12 text-center shadow-xl transition-all active:scale-[0.985] flex flex-col items-center justify-center overflow-hidden ${
          completedNotification ? 'ring-4 ring-emerald-500/40' : ''
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: completedNotification ? '#10b981' : 'var(--border-color)',
          minHeight: elderMode ? '340px' : '300px',
        }}
      >
        {/* Soft Background Progress Glow */}
        <div
          className="absolute inset-0 bg-emerald-500/5 pointer-events-none transition-all duration-300"
          style={{ height: `${progressPercent}%`, top: 'auto', bottom: 0 }}
        />

        {/* Selected Phrase in Arabic */}
        <div
          className="text-2xl sm:text-3xl font-arabic-amiri font-bold mb-3 tracking-wide"
          style={{ color: 'var(--text-accent)' }}
          dir="rtl"
        >
          {selectedPhrase.arabic}
        </div>

        <div className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
          {selectedPhrase.meaning}
        </div>

        {/* HUGE COUNTER NUMBER */}
        <div
          className="my-4 font-black tracking-tighter"
          style={{
            fontSize: elderMode ? '5.5rem' : '4.5rem',
            lineHeight: 1,
            color: 'var(--text-primary)',
          }}
        >
          {count}
        </div>

        {/* Target & Lap Indicators */}
        <div className="flex items-center gap-3 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
          {target > 0 && (
            <span className="rounded-lg px-2.5 py-1 bg-black/5 dark:bg-white/5">
              Putaran: {count % target} / {target}
            </span>
          )}

          {laps > 0 && (
            <span className="rounded-lg px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Award className="h-3.5 w-3.5" />
              <span>{laps} Putaran ({laps * target}x)</span>
            </span>
          )}
        </div>

        {/* Gentle Touch Instruction */}
        <div className="mt-5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ketuk di mana saja pada kotak ini untuk menghitung dzikir</span>
        </div>

        {/* Congratulations Banner on Reaching Target */}
        {completedNotification && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold shadow-lg animate-bounce flex items-center gap-1.5">
            <Check className="h-4 w-4" />
            <span>Alhamdulillah tuntas {target}x dzikir!</span>
          </div>
        )}
      </div>

      {/* Elder Tips */}
      <div
        className="rounded-2xl border p-4 text-xs leading-relaxed italic"
        style={{
          backgroundColor: 'var(--bg-accent-soft)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        💡 <strong>Kenyamanan Berdzikir bagi Jamaah:</strong> Anda dapat memejamkan mata di pembaringan atau bersandar tenang. Ponsel akan bergetar halus pada tiap ketukan dan bergetar panjang saat genap mencapai 33x tasbih.
      </div>
    </div>
  );
};

