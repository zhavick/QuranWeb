import React, { useState } from 'react';
import {
  X,
  Bell,
  Clock,
  Volume2,
  Vibrate,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { SmartReminderSettings } from '../../types/prayerReminder';
import {
  getReminderSettings,
  saveReminderSettings,
  playReminderChime,
  showReminderNotification,
} from '../../services/prayerReminder';
import { requestNotificationPermission } from '../../services/adhanAudio';

interface PrayerReminderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  elderMode?: boolean;
}

export const PrayerReminderSettingsModal: React.FC<PrayerReminderSettingsModalProps> = ({
  isOpen,
  onClose,
  elderMode = false,
}) => {
  const [settings, setSettings] = useState<SmartReminderSettings>(() => getReminderSettings());
  const [notifGranted, setNotifGranted] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });
  const [testSuccess, setTestSuccess] = useState(false);

  if (!isOpen) return null;

  const updateSettings = (partial: Partial<SmartReminderSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    saveReminderSettings(updated);
  };

  const handleRequestNotif = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
    updateSettings({ notificationsEnabled: granted });
  };

  const handleTestChime = () => {
    playReminderChime();
    if (settings.vibrationAlert && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([150, 80, 150]);
      } catch {
        // ignore
      }
    }
    if (settings.notificationsEnabled && notifGranted) {
      showReminderNotification(
        'Pengingat Shalat (Uji Coba)',
        'Waktu Dzuhur telah berjalan 10 menit. Mari sejenak mengambil air wudhu.'
      );
    }
    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  const handleResetHistory = () => {
    updateSettings({ triggeredKeys: [] });
    alert('Riwayat pemicu pengingat hari ini berhasil direset. Seluruh pengingat bertahap siap diuji kembali.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`relative flex flex-col max-h-[92vh] w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${
          elderMode ? 'text-base' : 'text-sm'
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">Pengingat Shalat Bertahap</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Smart Reminders pencegah shalat terlupa & terlewatkan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-xs opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Master Switch Card */}
          <div
            className="flex items-center justify-between rounded-xl border p-4 shadow-xs"
            style={{
              backgroundColor: settings.enabled ? 'var(--bg-accent-soft)' : 'var(--bg-muted)',
              borderColor: settings.enabled ? 'var(--border-color)' : 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  settings.enabled ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'
                }`}
              >
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-sm">Aktifkan Smart Reminders</div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Memantau waktu shalat dan memberi pengingat bertahap ramah
                </div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => updateSettings({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Section: Tahapan Pengingat Bertahap */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span>Jadwal Tahapan Pengingat</span>
            </h3>

            {/* Reminder I: 10m */}
            <div className="flex items-start justify-between p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)]">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Reminder I: 10 Menit Pasca-Masuk Waktu</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Notifikasi ramah untuk mengambil air wudhu dan bersiap shalat.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.reminder10m}
                disabled={!settings.enabled}
                onChange={(e) => updateSettings({ reminder10m: e.target.checked })}
                className="mt-1 h-4 w-4 rounded accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Reminder II: 20m */}
            <div className="flex items-start justify-between p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)]">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Reminder II: 20 Menit Pasca-Masuk Waktu</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Notifikasi pengingat khusyuk: <em>&ldquo;Dirikanlah shalat untuk ketenangan jiwa&rdquo;</em>.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.reminder20m}
                disabled={!settings.enabled}
                onChange={(e) => updateSettings({ reminder20m: e.target.checked })}
                className="mt-1 h-4 w-4 rounded accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Custom Reminder Interval */}
            <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 font-bold text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <div className="font-bold text-xs sm:text-sm">Pengingat Tambahan (Kustom)</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Pilih jeda waktu pengingat tambahan setelah shalat masuk.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-9 pt-1">
                {[
                  { val: 0, label: 'Nonaktif' },
                  { val: 30, label: '30 Menit' },
                  { val: 45, label: '45 Menit' },
                  { val: 60, label: '60 Menit' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    disabled={!settings.enabled}
                    onClick={() => updateSettings({ customMinutes: opt.val })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      settings.customMinutes === opt.val
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-blue-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pre-Expiry Warning (15m before next) */}
            <div className="flex items-start justify-between p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)]">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-rose-600 font-bold text-xs shrink-0 mt-0.5">
                  !
                </span>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Peringatan Segera Berakhir (Pre-Expiry)</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Pengingat penting 15 menit sebelum masuk waktu shalat berikutnya agar tidak terlewat.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.preExpiryWarning}
                disabled={!settings.enabled}
                onChange={(e) => updateSettings({ preExpiryWarning: e.target.checked })}
                className="mt-1 h-4 w-4 rounded accent-rose-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Section: Mode Peringatan & Umpan Balik */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Nada Dering & Getaran</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] cursor-pointer">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-semibold">Chime Harmoni Ramah</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundAlert}
                  disabled={!settings.enabled}
                  onChange={(e) => updateSettings({ soundAlert: e.target.checked })}
                  className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] cursor-pointer">
                <div className="flex items-center gap-2">
                  <Vibrate className="h-4 w-4 text-teal-500" />
                  <span className="text-xs font-semibold">Getaran Haptic (HP)</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.vibrationAlert}
                  disabled={!settings.enabled}
                  onChange={(e) => updateSettings({ vibrationAlert: e.target.checked })}
                  className="h-4 w-4 rounded accent-teal-600 cursor-pointer"
                />
              </label>
            </div>

            {/* Browser Notification Permission */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <div>
                  <div className="text-xs font-bold">Notifikasi Web Browser</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    {notifGranted ? 'Izin notifikasi telah aktif' : 'Belum diizinkan oleh browser'}
                  </div>
                </div>
              </div>

              {!notifGranted ? (
                <button
                  type="button"
                  onClick={handleRequestNotif}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                >
                  Izinkan Notifikasi
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  Aktif ✓
                </span>
              )}
            </div>
          </div>

          {/* Auto-Clear info card */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
              <strong>Mekanisme Pembatalan Otomatis (Auto-Clear):</strong> Segera setelah Anda mencentang shalat pada widget checklist, seluruh pengingat tersisa untuk waktu shalat tersebut otomatis dibatalkan tanpa mengganggu ibadah Anda.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t px-5 py-3.5 bg-black/5 dark:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestChime}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-emerald-500/50 text-xs font-semibold cursor-pointer"
            >
              <Volume2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>{testSuccess ? 'Chime Berbunyi! ✓' : 'Uji Chime'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetHistory}
              title="Reset riwayat pengingat hari ini untuk uji coba ulang"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline">Reset Riwayat Hari Ini</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
