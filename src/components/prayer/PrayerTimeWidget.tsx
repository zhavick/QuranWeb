import React, { useState } from 'react';
import { Clock, MapPin, Navigation, Calendar, AlertCircle, X, Bell, Compass } from 'lucide-react';
import { usePrayerTimes, INDONESIA_CITIES } from '../../hooks/usePrayerTimes';

interface PrayerTimeWidgetProps {
  onOpenKhatamPlanner?: () => void;
  onOpenQibla?: () => void;
  onOpenMosqueMap?: () => void;
}

export const PrayerTimeWidget: React.FC<PrayerTimeWidgetProps> = ({
  onOpenKhatamPlanner,
  onOpenQibla,
  onOpenMosqueMap,
}) => {
  const {
    city,
    setCity,
    detectGps,
    gpsLoading,
    gpsError,
    currentClock,
    currentDateFormatted,
    nextPrayerLabel,
    nextPrayerTime,
    countdown,
    isImminent,
    times,
  } = usePrayerTimes();
  const [open, setOpen] = useState(false);

  // Group cities by region/island
  const cityGroups = [
    { label: 'Jawa & Banten', items: INDONESIA_CITIES.slice(0, 12) },
    { label: 'Sumatera', items: INDONESIA_CITIES.slice(12, 22) },
    { label: 'Kalimantan', items: INDONESIA_CITIES.slice(22, 28) },
    { label: 'Sulawesi', items: INDONESIA_CITIES.slice(28, 34) },
    { label: 'Bali & Nusa Tenggara', items: INDONESIA_CITIES.slice(34, 37) },
    { label: 'Maluku & Papua', items: INDONESIA_CITIES.slice(37, 43) },
    { label: 'Tanah Suci', items: INDONESIA_CITIES.slice(43) },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Waktu aktual dan jadwal shalat"
        className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors ${
          isImminent ? 'animate-pulse' : ''
        }`}
        style={{
          backgroundColor: isImminent ? 'var(--bg-accent-soft)' : 'var(--bg-muted)',
          borderColor: isImminent ? 'var(--bg-accent)' : 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-accent)' }} />
        <span className="font-mono font-semibold hidden sm:inline">{currentClock}</span>
        <span className="hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>|</span>
        <span className="flex items-center gap-1">
          {isImminent && <Bell className="h-3 w-3 text-amber-500 animate-bounce" />}
          <strong style={{ color: 'var(--text-accent)' }}>{nextPrayerLabel}</strong>{' '}
          <span className="font-mono">{nextPrayerTime}</span>
          <span className="ml-1 hidden md:inline font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            (-{countdown})
          </span>
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 z-50 mt-2 w-80 rounded-3xl border p-4 shadow-2xl"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Header Modal */}
            <div className="mb-3 flex items-start justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-accent)' }}>
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Jadwal Shalat (Kemenag RI)</span>
                </div>
                <div className="mt-0.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {currentDateFormatted}
                </div>
                <div className="font-mono text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  {currentClock}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-xs"
                style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Countdown Banner */}
            <div
              className="mb-3 rounded-xl p-2.5 text-center text-xs font-semibold"
              style={{
                backgroundColor: isImminent ? '#fef3c7' : 'var(--bg-muted)',
                color: isImminent ? '#92400e' : 'var(--text-primary)',
              }}
            >
              <div className="flex items-center justify-center gap-1.5">
                <MapPin className="h-3 w-3 text-teal-600" />
                <span>{city.name}</span>
                {city.province && city.province !== city.name && (
                  <span className="text-[11px] font-normal opacity-80">({city.province})</span>
                )}
              </div>
              <div className="mt-1 font-mono text-xs">
                -{countdown} menuju <strong>{nextPrayerLabel}</strong> ({nextPrayerTime})
              </div>
            </div>

            {/* Prayer Times Grid */}
            <div className="space-y-1">
              {times.map((t) => (
                <div
                  key={t.key}
                  className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-xs transition-colors ${
                    t.isNext ? 'font-bold' : t.isSecondary ? 'opacity-70' : 'font-medium'
                  }`}
                  style={{
                    backgroundColor: t.isNext ? 'var(--bg-accent-soft)' : 'transparent',
                    color: t.isNext ? 'var(--text-accent)' : 'var(--text-primary)',
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    {t.isNext && <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />}
                    <span>{t.label}</span>
                    {t.isSecondary && <span className="text-[10px] font-normal">(sunnah/batas)</span>}
                  </span>
                  <span className="font-mono">{t.formatted}</span>
                </div>
              ))}
            </div>

            {/* Khatam Planner Gentle Shortcut */}
            {onOpenKhatamPlanner && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenKhatamPlanner();
                }}
                className="mt-3 flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all hover:opacity-95 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-accent)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-emerald-500" />
                  <span>Rencana Khatam &apos;Ain Ba&apos;da Shalat</span>
                </div>
                <span>Buka ➔</span>
              </button>
            )}

            {/* Qibla Compass Shortcut */}
            {onOpenQibla && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenQibla();
                }}
                className="mt-2 flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all hover:opacity-95 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-emerald-500" />
                  <span>Kompas Arah Kiblat Adaptif</span>
                </div>
                <span>Buka ➔</span>
              </button>
            )}

            {/* Nearby Mosque Map Shortcut */}
            {onOpenMosqueMap && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenMosqueMap();
                }}
                className="mt-2 flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all hover:opacity-95 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <span>Peta Masjid Terdekat (OpenStreetMap)</span>
                </div>
                <span>Buka ➔</span>
              </button>
            )}

            {/* City Selection & GPS */}
            <div className="mt-3 border-t pt-3 space-y-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                <span>Pilih Wilayah / Kota:</span>
                <span className="text-[10px] font-normal">+2 menit ihtiyat</span>
              </div>

              <div className="flex gap-2">
                <select
                  value={city.name}
                  onChange={(e) => {
                    const found = INDONESIA_CITIES.find((c) => c.name === e.target.value);
                    if (found) setCity(found);
                  }}
                  className="flex-1 rounded-xl border px-2.5 py-1.5 text-xs outline-none"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {!INDONESIA_CITIES.some((c) => c.name === city.name) && (
                    <option value={city.name}>{city.name}</option>
                  )}
                  {cityGroups.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.items.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={detectGps}
                  disabled={gpsLoading}
                  title="Deteksi Lokasi GPS Otomatis"
                  className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0"
                  style={{
                    backgroundColor: 'var(--bg-accent)',
                    color: 'var(--text-on-accent)',
                  }}
                >
                  <Navigation className="h-3 w-3" />
                  <span>{gpsLoading ? '...' : 'GPS'}</span>
                </button>
              </div>

              {gpsError && (
                <div className="flex items-center gap-1 text-[11px] text-red-500 pt-0.5">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{gpsError}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
