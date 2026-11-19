import React, { useState } from 'react';
import {
  X,
  Volume2,
  Bell,
  Play,
  Square,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  PrayerAdhanSettings,
  MuadzinId,
  AdhanPlayMode,
} from '../../types/adhan';
import {
  MUADZIN_LIST,
  getAdhanSettings,
  saveAdhanSettings,
  triggerAdhan,
  stopAdhan,
  requestNotificationPermission,
} from '../../services/adhanAudio';

interface PrayerTimesModalProps {
  isOpen: boolean;
  onClose: () => void;
  elderMode?: boolean;
}

export const PrayerTimesModal: React.FC<PrayerTimesModalProps> = ({
  isOpen,
  onClose,
  elderMode = false,
}) => {
  const [settings, setSettings] = useState<PrayerAdhanSettings>(() => getAdhanSettings());
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [notifGranted, setNotifGranted] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  if (!isOpen) return null;

  const updateSettings = (partial: Partial<PrayerAdhanSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    saveAdhanSettings(updated);
  };

  const handlePreviewMuadzin = (id: MuadzinId) => {
    if (previewingId === id) {
      stopAdhan();
      setPreviewingId(null);
      return;
    }
    stopAdhan();
    setPreviewingId(id);
    const muadzin = MUADZIN_LIST.find((m) => m.id === id);
    if (!muadzin) return;

    try {
      const audio = new Audio(muadzin.audioUrlTakbir);
      audio.volume = settings.volume;
      audio.play().catch(() => {});
      audio.onended = () => setPreviewingId(null);
    } catch {
      setPreviewingId(null);
    }
  };

  const handleRequestNotif = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
    updateSettings({ notificationsEnabled: granted });
  };

  const handleTestAdhan = () => {
    stopAdhan();
    triggerAdhan('maghrib', 'Maghrib (Uji Coba)', true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`relative flex flex-col max-h-[92vh] w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden ${
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                <span>Pengaturan Audio Azan Otomatis</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Auto-Adhan
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">Pilihan Muadzin, Mode Suara &amp; Notifikasi Shalat</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 1. Global Toggle Auto-Adhan */}
          <div
            className="rounded-xl border p-4 flex items-center justify-between gap-4"
            style={{
              backgroundColor: settings.autoAdhanEnabled ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-muted)',
              borderColor: settings.autoAdhanEnabled ? '#10b981' : 'var(--border-color)',
            }}
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[var(--text-primary)] block">
                Kumandangkan Azan Otomatis Saat Waktu Shalat Masuk
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                Audio azan berkumandang otomatis dan dialog panggilan shalat muncul saat jadwal tiba.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.autoAdhanEnabled}
                onChange={(e) => updateSettings({ autoAdhanEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* 2. Pilihan Muadzin Default */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Pilihan Muadzin Utama (Dzuhur, Ashar, Maghrib, Isya):
            </label>
            <div className="space-y-2">
              {MUADZIN_LIST.filter((m) => !m.isFajrSpecial).map((m) => {
                const isSelected = settings.selectedMuadzin === m.id;
                const isPlaying = previewingId === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => updateSettings({ selectedMuadzin: m.id })}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-xs'
                        : 'border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 pr-2">
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-400'}`}>
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{m.name}</p>
                        <p className="text-[11px] text-[var(--text-secondary)]">{m.location} • {m.description.slice(0, 60)}...</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewMuadzin(m.id);
                      }}
                      className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 shrink-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      {isPlaying ? <Square className="h-3 w-3 text-red-500 fill-red-500" /> : <Play className="h-3 w-3 text-emerald-500 fill-emerald-500" />}
                      <span>{isPlaying ? 'Stop' : 'Dengar'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Mode Suara Tiap Waktu Shalat */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Mode Suara per Waktu Shalat:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { key: 'fajr' as const, label: 'Subuh (Fajr)' },
                { key: 'dhuhr' as const, label: 'Dzuhur (Dhuhr)' },
                { key: 'asr' as const, label: 'Ashar (Asr)' },
                { key: 'maghrib' as const, label: 'Maghrib' },
                { key: 'isha' as const, label: 'Isya (Isha)' },
              ].map((p) => {
                const currentMode = settings.prayerModes[p.key];
                return (
                  <div
                    key={p.key}
                    className="flex items-center justify-between p-2.5 rounded-xl border"
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-muted)' }}
                  >
                    <span className="text-xs font-bold">{p.label}</span>
                    <select
                      value={currentMode}
                      onChange={(e) => {
                        const newMode = e.target.value as AdhanPlayMode;
                        updateSettings({
                          prayerModes: {
                            ...settings.prayerModes,
                            [p.key]: newMode,
                          },
                        });
                      }}
                      className="rounded-lg border px-2 py-1 text-xs font-semibold outline-none"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <option value="full">Lengkap (3-4 mnt)</option>
                      <option value="takbir">Takbir (30 dtk)</option>
                      <option value="beep">Nada Lonceng Singkat</option>
                      <option value="mute">Senyap (Mute)</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Volume Slider */}
          <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Volume Suara Azan:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                {Math.round(settings.volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* 5. Browser Notification Permission */}
          <div className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div>
              <p className="text-xs font-bold flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-emerald-500" />
                <span>Notifikasi Layar Peramban (Desktop &amp; Mobile)</span>
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {notifGranted
                  ? 'Izin notifikasi aktif. Anda akan menerima pemberitahuan visual saat shalat tiba.'
                  : 'Aktifkan agar tetap menerima panggilan shalat saat layar HP mati atau tab berada di latar belakang.'}
              </p>
            </div>
            {!notifGranted ? (
              <button
                type="button"
                onClick={handleRequestNotif}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
              >
                Izinkan Notifikasi
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Aktif</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="border-t p-4 flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-muted)' }}
        >
          <button
            type="button"
            onClick={handleTestAdhan}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Uji Coba Panggilan Azan</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Simpan &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
