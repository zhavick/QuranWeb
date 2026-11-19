import React, { useState, useEffect } from 'react';
import {
  Clock,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ActiveReminderAlert, PrayerAttendanceMode } from '../../types/prayerReminder';
import {
  subscribeReminderAlert,
  dismissActiveReminder,
  checkPrayerWithAttendance,
} from '../../services/prayerReminder';

interface PrayerReminderBannerProps {
  elderMode?: boolean;
}

export const PrayerReminderBanner: React.FC<PrayerReminderBannerProps> = ({
  elderMode = false,
}) => {
  const [alert, setAlert] = useState<ActiveReminderAlert | null>(null);

  useEffect(() => {
    const unsub = subscribeReminderAlert((newAlert) => {
      setAlert(newAlert);
    });
    return () => unsub();
  }, []);

  if (!alert) return null;

  const isPreExpiry = alert.type === 'pre_expiry';

  const handleMarkAsDone = (mode: PrayerAttendanceMode = 'ontime') => {
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    checkPrayerWithAttendance(todayStr, alert.prayerKey, mode);
    dismissActiveReminder();
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] animate-slide-up">
      <div
        className={`rounded-2xl border p-4 sm:p-5 shadow-2xl backdrop-blur-md relative overflow-hidden ${
          elderMode ? 'text-base' : 'text-sm'
        }`}
        style={{
          backgroundColor: isPreExpiry ? 'rgba(255, 241, 242, 0.96)' : 'var(--bg-card)',
          borderColor: isPreExpiry ? '#fda4af' : 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Glow Accent Border Left */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-1.5 ${
            isPreExpiry ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
        />

        <div className="flex items-start gap-3 pl-1">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isPreExpiry
                ? 'bg-rose-500/20 text-rose-600 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-600'
            }`}
          >
            {isPreExpiry ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Clock className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
              <span className={isPreExpiry ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}>
                {alert.title}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
              {alert.message}
            </p>

            {/* Quick Actions */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleMarkAsDone('ontime')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Sudah Shalat</span>
              </button>

              <button
                type="button"
                onClick={() => handleMarkAsDone('mosque')}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] hover:bg-emerald-500/10 text-xs font-semibold cursor-pointer"
              >
                <span>🕌 Di Masjid</span>
              </button>

              <button
                type="button"
                onClick={dismissActiveReminder}
                className="px-2.5 py-1.5 rounded-xl text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Nanti
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissActiveReminder}
            className="absolute top-3 right-3 rounded-lg p-1 text-xs opacity-70 hover:opacity-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
