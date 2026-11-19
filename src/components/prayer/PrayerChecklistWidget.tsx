import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  X,
  Sliders,
  Check,
} from 'lucide-react';
import {
  PrayerKey,
  PrayerAttendanceMode,
} from '../../types/prayerReminder';
import {
  getPrayerTracking,
} from '../../services/reportAnalytics';
import {
  PRAYER_DISPLAY_NAMES,
  ATTENDANCE_MODE_LABELS,
  getPrayerAttendanceDetails,
  checkPrayerWithAttendance,
  uncheckPrayer,
} from '../../services/prayerReminder';

interface PrayerChecklistWidgetProps {
  compact?: boolean;
  elderMode?: boolean;
  onOpenSettings?: () => void;
  className?: string;
}

interface PrayerItemConfig {
  key: PrayerKey;
  label: string;
  isSunnah?: boolean;
}

const PRAYER_LIST: PrayerItemConfig[] = [
  { key: 'fajr', label: 'Subuh' },
  { key: 'dhuhr', label: 'Dzuhur' },
  { key: 'asr', label: 'Ashar' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha', label: 'Isya' },
  { key: 'dhuha', label: 'Dhuha', isSunnah: true },
  { key: 'tahajud', label: 'Tahajud', isSunnah: true },
];

export const PrayerChecklistWidget: React.FC<PrayerChecklistWidgetProps> = ({
  compact = false,
  elderMode = false,
  onOpenSettings,
  className = '',
}) => {
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [todayStr] = useState<string>(getTodayStr);
  const [checklist, setChecklist] = useState(() => {
    const all = getPrayerTracking();
    return all[todayStr] || {
      date: todayStr,
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
      dhuha: false,
      tahajud: false,
    };
  });

  const [details, setDetails] = useState(() => getPrayerAttendanceDetails(todayStr));
  const [selectedPrayerToAttend, setSelectedPrayerToAttend] = useState<PrayerKey | null>(null);

  const refreshData = useCallback(() => {
    const all = getPrayerTracking();
    setChecklist(
      all[todayStr] || {
        date: todayStr,
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
        dhuha: false,
        tahajud: false,
      }
    );
    setDetails(getPrayerAttendanceDetails(todayStr));
  }, [todayStr]);

  useEffect(() => {
    const handleUpdate = () => refreshData();
    window.addEventListener('quranweb_prayer_tracking_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('quranweb_prayer_tracking_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshData]);

  const fardhuKeys: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const completedFardhuCount = fardhuKeys.filter((k) => !!checklist[k]).length;
  const sunnahKeys: PrayerKey[] = ['dhuha', 'tahajud'];
  const completedSunnahCount = sunnahKeys.filter((k) => !!checklist[k]).length;

  const handlePrayerClick = (prayerKey: PrayerKey) => {
    const isCurrentlyChecked = !!checklist[prayerKey];
    if (isCurrentlyChecked) {
      // Uncheck directly
      uncheckPrayer(todayStr, prayerKey);
      refreshData();
    } else {
      // Open attendance mode picker dialog
      setSelectedPrayerToAttend(prayerKey);
    }
  };

  const handleConfirmAttendance = (mode: PrayerAttendanceMode) => {
    if (!selectedPrayerToAttend) return;
    checkPrayerWithAttendance(todayStr, selectedPrayerToAttend, mode);
    setSelectedPrayerToAttend(null);
    refreshData();
  };

  const handleQuickCheck = (prayerKey: PrayerKey) => {
    // Direct check with default on-time
    checkPrayerWithAttendance(todayStr, prayerKey, 'ontime');
    refreshData();
  };

  if (compact) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {/* Progress badge */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Checklist Shalat Hari Ini:
          </span>
          <span className="rounded-full px-2 py-0.5 font-bold text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {completedFardhuCount}/5 Fardhu
            {completedSunnahCount > 0 && ` • +${completedSunnahCount} Sunnah`}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="grid grid-cols-5 gap-1.5">
          {PRAYER_LIST.slice(0, 5).map((p) => {
            const isChecked = !!checklist[p.key];
            const detail = details[p.key];
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => handlePrayerClick(p.key)}
                title={`${p.label}: ${isChecked ? (detail ? ATTENDANCE_MODE_LABELS[detail.mode]?.label : 'Sudah') : 'Belum'} (Klik untuk ${isChecked ? 'batalkan' : 'centang'})`}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs scale-[0.98]'
                    : 'border-[var(--border-color)] bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:border-emerald-500/30 font-medium'
                }`}
              >
                {isChecked ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mb-0.5" />
                ) : (
                  <Circle className="h-4 w-4 opacity-40 mb-0.5" />
                )}
                <span className="text-[11px] leading-tight truncate w-full">{p.label}</span>
                {isChecked && detail && (
                  <span className="text-[9px] opacity-75 mt-0.5 truncate">{ATTENDANCE_MODE_LABELS[detail.mode]?.icon || '✓'}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sunnah Row */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[var(--border-color)]">
          {PRAYER_LIST.slice(5).map((p) => {
            const isChecked = !!checklist[p.key];
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => handlePrayerClick(p.key)}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-teal-500/15 border-teal-500/40 text-teal-700 dark:text-teal-300 font-bold'
                    : 'border-[var(--border-color)] bg-[var(--bg-muted)] text-[var(--text-secondary)] font-medium'
                }`}
              >
                {isChecked ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                ) : (
                  <Circle className="h-3.5 w-3.5 opacity-40" />
                )}
                <span>{p.label} (Sunnah)</span>
              </button>
            );
          })}
        </div>

        {/* Modal for Selecting Attendance Mode */}
        {selectedPrayerToAttend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div
              className="w-full max-w-sm rounded-2xl border p-4 shadow-2xl space-y-3"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🕌</span>
                  <span className="font-bold text-sm">
                    Catat Shalat {PRAYER_DISPLAY_NAMES[selectedPrayerToAttend]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPrayerToAttend(null)}
                  className="rounded-lg p-1 text-xs opacity-70 hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)]">
                Pilih status pelaksanaan shalat untuk memperkaya catatan amal di Laporan Ibadah:
              </p>

              <div className="space-y-1.5">
                {(['mosque', 'ontime', 'home'] as PrayerAttendanceMode[]).map((mode) => {
                  const info = ATTENDANCE_MODE_LABELS[mode];
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleConfirmAttendance(mode)}
                      className="flex items-center gap-3 w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] hover:border-emerald-500/50 hover:bg-emerald-500/10 text-left transition-colors cursor-pointer"
                    >
                      <span className="text-lg">{info.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[var(--text-primary)]">{info.label}</div>
                        <div className="text-[11px] text-[var(--text-secondary)] truncate">{info.desc}</div>
                      </div>
                      <Check className="h-4 w-4 text-emerald-500 opacity-60" />
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleQuickCheck(selectedPrayerToAttend)}
                  className="text-xs text-[var(--text-accent)] font-semibold hover:underline"
                >
                  Centang Cepat Saja ➔
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Widget View (e.g. inside Modal or dedicated section)
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 shadow-sm space-y-4 ${
        elderMode ? 'text-base' : 'text-sm'
      } ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <span>Pelacak Kepatuhan Shalat</span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                {completedFardhuCount}/5 Waktu
              </span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Centang setiap shalat yang telah ditunaikan. Otomatis membatalkan pengingat bertahap.
            </p>
          </div>
        </div>

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            title="Atur Pengingat Bertahap (Smart Reminders)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] hover:border-emerald-500/40 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Sliders className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Pengingat</span>
          </button>
        )}
      </div>

      {/* 5 Fardhu Prayer Cards */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center justify-between">
          <span>Shalat Fardhu 5 Waktu</span>
          <span className="text-[11px] font-normal lowercase">klik centang saat selesai</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {PRAYER_LIST.slice(0, 5).map((p) => {
            const isChecked = !!checklist[p.key];
            const detail = details[p.key];
            return (
              <div
                key={p.key}
                onClick={() => handlePrayerClick(p.key)}
                className={`flex sm:flex-col items-center justify-between sm:justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-xs'
                    : 'bg-[var(--bg-muted)] border-[var(--border-color)] hover:border-emerald-500/30'
                }`}
              >
                <div className="flex sm:flex-col items-center gap-2.5 sm:gap-1 text-left sm:text-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg">
                    {isChecked ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-[var(--text-secondary)] opacity-40" />
                    )}
                  </div>
                  <div>
                    <span className={`block font-bold ${isChecked ? 'text-emerald-700 dark:text-emerald-300' : 'text-[var(--text-primary)]'}`}>
                      {p.label}
                    </span>
                    {isChecked && detail ? (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {ATTENDANCE_MODE_LABELS[detail.mode]?.label}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        {isChecked ? 'Selesai' : 'Belum'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="sm:hidden">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isChecked ? 'bg-emerald-500/20 text-emerald-600' : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]'}`}>
                    {isChecked ? 'Tuntas' : 'Centang'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sunnah Prayers */}
      <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Shalat Sunnah Muakkad & Qiyamul Lail
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRAYER_LIST.slice(5).map((p) => {
            const isChecked = !!checklist[p.key];
            return (
              <div
                key={p.key}
                onClick={() => handlePrayerClick(p.key)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-teal-500/10 border-teal-500/40 shadow-xs'
                    : 'bg-[var(--bg-muted)] border-[var(--border-color)] hover:border-teal-500/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg">
                    {isChecked ? (
                      <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-[var(--text-secondary)] opacity-40" />
                    )}
                  </div>
                  <div>
                    <span className={`block font-bold ${isChecked ? 'text-teal-700 dark:text-teal-300' : 'text-[var(--text-primary)]'}`}>
                      Shalat {p.label}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      {p.key === 'dhuha' ? 'Pagi hari setelah terbit matahari' : 'Malam hari sepertiga akhir'}
                    </span>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isChecked ? 'bg-teal-500/20 text-teal-600' : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]'}`}>
                  {isChecked ? 'Ditunaikan' : 'Catat'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance Mode Dialog Modal */}
      {selectedPrayerToAttend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-md rounded-2xl border p-5 shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base">
                    Catat Shalat {PRAYER_DISPLAY_NAMES[selectedPrayerToAttend]}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">Pilih status pelaksanaan shalat:</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPrayerToAttend(null)}
                className="rounded-lg p-1 text-xs opacity-70 hover:opacity-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              {(['mosque', 'ontime', 'home', 'munfarid'] as PrayerAttendanceMode[]).map((mode) => {
                const info = ATTENDANCE_MODE_LABELS[mode];
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleConfirmAttendance(mode)}
                    className="flex items-center gap-3 w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] hover:border-emerald-500/50 hover:bg-emerald-500/10 text-left transition-colors cursor-pointer group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{info.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {info.label}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">{info.desc}</div>
                    </div>
                    <Check className="h-4 w-4 text-emerald-500 opacity-60 group-hover:opacity-100" />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => handleQuickCheck(selectedPrayerToAttend)}
                className="text-xs text-[var(--text-accent)] font-semibold hover:underline cursor-pointer"
              >
                Centang Cepat Saja ➔
              </button>

              <button
                type="button"
                onClick={() => setSelectedPrayerToAttend(null)}
                className="px-4 py-1.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
