import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  Compass,
  Navigation,
  MapPin,
  Smartphone,
  Sun,
  Info,
  CheckCircle2,
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react';
import { INDONESIA_CITIES, type PrayerCity } from '../../hooks/usePrayerTimes';
import {
  getQiblaInfo,
  RASYDUL_QIBLAH_EVENTS,
  KAABA_LAT,
  KAABA_LNG,
} from '../../services/qibla';
import { logActivity } from '../../services/telemetry';

interface QiblaCompassProps {
  onBackToMushaf: () => void;
  elderMode?: boolean;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({
  onBackToMushaf,
  elderMode = false,
}) => {
  // 1. Lokasi aktif (ambil dari cache doa/shalat atau default Jakarta)
  const [city, setCity] = useState<PrayerCity>(() => {
    try {
      const saved = localStorage.getItem('quranweb_prayer_city');
      return saved ? JSON.parse(saved) : INDONESIA_CITIES[0];
    } catch {
      return INDONESIA_CITIES[0];
    }
  });

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // 2. Sensor orientasi perangkat (DeviceOrientation)
  const [heading, setHeading] = useState<number | null>(null);
  const [hasSensor, setHasSensor] = useState<boolean | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showRasydulModal, setShowRasydulModal] = useState(false);
  const lastVibrateTimeRef = useRef<number>(0);

  // Kalkulasi kiblat berdasarkan koordinat kota aktif
  const qiblaResult = useMemo(() => {
    return getQiblaInfo(city.lat, city.lng, city.name);
  }, [city]);

  // Periksa apakah arah perangkat tepat menghadap kiblat (toleransi ±1.5°)
  const isAlignedWithQibla = useMemo(() => {
    if (heading === null) return false;
    // Selisih antara arah hadap kompas dengan derajat kiblat
    const diff = Math.abs((heading - qiblaResult.qiblaBearing + 360) % 360);
    const smallestDiff = diff > 180 ? 360 - diff : diff;
    return smallestDiff <= 1.5;
  }, [heading, qiblaResult.qiblaBearing]);

  // Efek getaran haptic saat tepat menghadap Ka'bah
  useEffect(() => {
    if (isAlignedWithQibla && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const now = Date.now();
      if (now - lastVibrateTimeRef.current > 1200) {
        lastVibrateTimeRef.current = now;
        try {
          navigator.vibrate([40, 60, 40]);
        } catch {
          // Ignore
        }
      }
    }
  }, [isAlignedWithQibla]);

  // Generate QR Code untuk tautan di smartphone
  useEffect(() => {
    const mobileUrl = `${window.location.origin}/kiblat`;
    QRCode.toDataURL(mobileUrl, {
      width: 220,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));

    logActivity('VIEW_QIBLA_COMPASS', { cityName: city.name, qiblaBearing: qiblaResult.qiblaBearing });
  }, [city.name, qiblaResult.qiblaBearing]);

  // Handler orientasi perangkat
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    // 1. Dukungan iOS Safari (webkitCompassHeading)
    const iosEvent = e as any;
    if (typeof iosEvent.webkitCompassHeading === 'number') {
      const compassHeading = iosEvent.webkitCompassHeading;
      setHeading(compassHeading);
      setHasSensor(true);
      return;
    }

    // 2. Dukungan Android Chrome (alpha)
    if (e.alpha !== null && e.alpha !== undefined) {
      // Pada Android, alpha bernilai 0 saat menghadap utara jika absolute = true
      // Heading searah jarum jam: 360 - alpha
      const androidHeading = (360 - e.alpha) % 360;
      setHeading(androidHeading);
      setHasSensor(true);
    }
  }, []);

  // Meminta izin sensor orientasi pada iOS 13+
  const requestSensorPermission = async () => {
    const DeviceOrientation = window.DeviceOrientationEvent as any;
    if (DeviceOrientation && typeof DeviceOrientation.requestPermission === 'function') {
      try {
        const state = await DeviceOrientation.requestPermission();
        if (state === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setHasSensor(false);
        }
      } catch (err) {
        console.warn('Izin sensor ditolak atau gagal:', err);
        setHasSensor(false);
      }
    } else {
      // Perangkat non-iOS yang langsung mengizinkan listener
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  // Deteksi awal keberadaan sensor orientasi
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const DeviceOrientation = window.DeviceOrientationEvent as any;
    const isIOS = DeviceOrientation && typeof DeviceOrientation.requestPermission === 'function';

    if (!isIOS) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    // Timer fallback jika perangkat tidak mengirimkan sinyal orientasi (Desktop PC / Laptop)
    const sensorTimeout = setTimeout(() => {
      setHasSensor((prev) => (prev === null ? false : prev));
    }, 2000);

    return () => {
      clearTimeout(sensorTimeout);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  // Sinkronisasi kota ke penyimpanan lokal
  const handleCityChange = (newCity: PrayerCity) => {
    setCity(newCity);
    try {
      localStorage.setItem('quranweb_prayer_city', JSON.stringify(newCity));
    } catch {
      // Ignore
    }
  };

  // Deteksi GPS
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation tidak didukung peramban.');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const gpsCity: PrayerCity = {
          name: 'Lokasi GPS Anda',
          province: 'Otomatis',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        handleCityChange(gpsCity);
        setGpsLoading(false);
        logActivity('GPS_DETECT_QIBLA', { lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setGpsError(err.message || 'Gagal mendeteksi lokasi GPS.');
        setGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/kiblat`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Sudut rotasi piringan kompas: jika sensor aktif, putar piringan sebesar -heading derajat
  const dialRotation = heading !== null ? -heading : 0;
  // Sudut jarum Ka'bah: relatif terhadap piringan kompas
  const kaabaAngleOnDial = qiblaResult.qiblaBearing;

  return (
    <div
      className={`min-h-screen flex flex-col ${elderMode ? 'text-base' : 'text-sm'}`}
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Header Bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-primary-alpha, var(--bg-card))',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMushaf}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            title="Kembali ke Mushaf Al-Qur'an"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-emerald-500" />
              <h1 className="text-base sm:text-lg font-bold tracking-tight">
                Kompas Arah Kiblat Adaptif
              </h1>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Penunjuk arah Ka&apos;bah presisi berbasis trigonometri speris Great Circle
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowRasydulModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
          style={{
            backgroundColor: 'var(--bg-muted)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
          title="Lihat jadwal Rasydul Qiblah (Istiwa A'zham)"
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span className="hidden sm:inline">Rasydul Qiblah</span>
        </button>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Bar Pemilihan Lokasi & GPS */}
        <section
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-xs"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Titik Acuan Lokasi
              </span>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>{city.name}</span>
                {city.province && (
                  <span className="text-xs font-normal opacity-70">({city.province})</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={city.name}
              onChange={(e) => {
                const found = INDONESIA_CITIES.find((c) => c.name === e.target.value);
                if (found) handleCityChange(found);
              }}
              className="rounded-xl border px-3 py-2 text-xs font-semibold outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <optgroup label="Kota-Kota Pilihan">
                {INDONESIA_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.province})
                  </option>
                ))}
              </optgroup>
            </select>

            <button
              type="button"
              onClick={handleDetectGps}
              disabled={gpsLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              title="Deteksi koordinat GPS lokasi Anda saat ini"
            >
              <Navigation className={`h-3.5 w-3.5 text-emerald-500 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{gpsLoading ? 'Mendeteksi...' : 'GPS Otomatis'}</span>
            </button>
          </div>
        </section>

        {gpsError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Status Penyelarasan Kiblat (Alignment Alert) */}
        {isAlignedWithQibla && (
          <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/15 p-4 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 animate-pulse shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold">
                Alhamdulillah! Posisi Anda Tepat Menghadap Ka&apos;bah Al-Musyarrafah
              </h4>
              <p className="text-xs opacity-90">
                Ponsel telah lurus sejajar dengan sudut kiblat {qiblaResult.qiblaBearing}° (toleransi ±1.5°). Getaran haptic aktif.
              </p>
            </div>
          </div>
        )}

        {/* Layout Utama: Kompas Interaktif & Panel Data Adaptif */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* KOLOM KIRI: Visualisasi Piringan Kompas Adaptif */}
          <section
            className="lg:col-span-7 rounded-3xl border p-6 shadow-sm flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Header Badge di Atas Kompas */}
            <div className="flex items-center justify-between w-full mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  {hasSensor ? 'Sensor Kompas Aktif' : 'Panduan Sudut Azimuth'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                {qiblaResult.qiblaBearing}° {qiblaResult.cardinalDirection}
              </span>
            </div>

            {/* Piringan Kompas Visual SVG */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-4 flex items-center justify-center">
              {/* Cincin Luar Bersinar saat Aligned */}
              <div
                className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${
                  isAlignedWithQibla
                    ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-105'
                    : 'border-emerald-500/20'
                }`}
              />

              {/* Piringan Kompas yang Berputar Mengikuti Heading Perangkat */}
              <div
                className="w-full h-full relative transition-transform duration-200 ease-out"
                style={{
                  transform: `rotate(${dialRotation}deg)`,
                }}
              >
                {/* SVG Dial Kompas */}
                <svg viewBox="0 0 320 320" className="w-full h-full select-none">
                  {/* Background Dial */}
                  <circle
                    cx="160"
                    cy="160"
                    r="154"
                    fill="var(--bg-secondary)"
                    stroke="var(--border-color)"
                    strokeWidth="2"
                  />

                  {/* Lingkaran Dalam */}
                  <circle
                    cx="160"
                    cy="160"
                    r="120"
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />

                  {/* Titik-Titik Derajat (Tiap 15 derajat) */}
                  {Array.from({ length: 24 }).map((_, i) => {
                    const deg = i * 15;
                    const isMajor = deg % 90 === 0;
                    const isSemi = deg % 30 === 0;
                    const len = isMajor ? 14 : isSemi ? 9 : 5;
                    return (
                      <line
                        key={deg}
                        x1="160"
                        y1="10"
                        x2="160"
                        y2={10 + len}
                        transform={`rotate(${deg} 160 160)`}
                        stroke={isMajor ? '#10b981' : 'var(--text-secondary)'}
                        strokeWidth={isMajor ? 2.5 : 1}
                        opacity={isMajor ? 1 : 0.5}
                      />
                    );
                  })}

                  {/* Huruf Arah Mata Angin */}
                  {/* Utara (U / North) - Ditandai Aksen Merah Zamrud */}
                  <text
                    x="160"
                    y="40"
                    textAnchor="middle"
                    className="font-black text-sm fill-emerald-600 dark:fill-emerald-400"
                  >
                    U
                  </text>
                  {/* Timur (T / East) */}
                  <text
                    x="285"
                    y="165"
                    textAnchor="middle"
                    className="font-bold text-xs"
                    fill="var(--text-secondary)"
                  >
                    T
                  </text>
                  {/* Selatan (S / South) */}
                  <text
                    x="160"
                    y="292"
                    textAnchor="middle"
                    className="font-bold text-xs"
                    fill="var(--text-secondary)"
                  >
                    S
                  </text>
                  {/* Barat (B / West) */}
                  <text
                    x="35"
                    y="165"
                    textAnchor="middle"
                    className="font-bold text-xs"
                    fill="var(--text-secondary)"
                  >
                    B
                  </text>

                  {/* JARUM TARGET KIBLAT (Ka'bah Pointer) Berwarna Emas Zamrud */}
                  <g transform={`rotate(${kaabaAngleOnDial} 160 160)`}>
                    {/* Garis Arah Kiblat */}
                    <line
                      x1="160"
                      y1="160"
                      x2="160"
                      y2="34"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Simbol Ka'bah Emas di Ujung Jarum */}
                    <g transform="translate(148, 14)">
                      {/* Kotak Ka'bah Mini */}
                      <rect
                        width="24"
                        height="24"
                        rx="4"
                        fill="#0f172a"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        className="shadow-md"
                      />
                      {/* Kiswah Pita Emas */}
                      <line x1="0" y1="7" x2="24" y2="7" stroke="#f59e0b" strokeWidth="2.5" />
                    </g>
                  </g>

                  {/* Jarum Kompas Utara (Merah) & Selatan (Abu) */}
                  <polygon points="160,55 166,160 154,160" fill="#ef4444" opacity="0.9" />
                  <polygon points="160,265 166,160 154,160" fill="var(--text-secondary)" opacity="0.4" />

                  {/* Poros Tengah Kompas */}
                  <circle cx="160" cy="160" r="10" fill="var(--bg-card)" stroke="#10b981" strokeWidth="3" />
                  <circle cx="160" cy="160" r="4" fill="#10b981" />
                </svg>
              </div>

              {/* Indikator Arah Hadap Atas Layar (Garis Pembidik Statis) */}
              <div className="absolute top-0 flex flex-col items-center pointer-events-none">
                <div className="w-0.5 h-6 bg-red-500 ring-2 ring-red-500/20" />
                <div className="w-2 h-2 rotate-45 bg-red-500 -mt-1" />
              </div>
            </div>

            {/* Keterangan Heading Sensor */}
            <div className="text-center mt-2 space-y-1">
              {heading !== null ? (
                <>
                  <div className="text-xs font-mono font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Hadap Ponsel: <span className="font-bold text-emerald-500">{Math.round(heading)}°</span> | Arah Kiblat:{' '}
                    <span className="font-bold text-amber-500">{qiblaResult.qiblaBearing}°</span>
                  </div>
                  <p className="text-[11px] opacity-70">
                    Putar ponsel Anda hingga garis merah di atas bertemu tepat pada kotak Ka&apos;bah emas.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Arahkan kompas fisik atau pandangan ke sudut <strong>{qiblaResult.qiblaBearing}°</strong> dari Utara ke arah Barat.
                  </p>
                </>
              )}
            </div>

            {/* Tombol Permintaan Izin Sensor iOS jika diperlukan */}
            {typeof window !== 'undefined' &&
              (window as any).DeviceOrientationEvent &&
              typeof (window as any).DeviceOrientationEvent.requestPermission === 'function' &&
              !permissionGranted && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={requestSensorPermission}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--text-on-accent)',
                    }}
                  >
                    <Smartphone className="h-4 w-4" />
                    <span>Aktifkan Sensor Kompas HP</span>
                  </button>
                </div>
              )}
          </section>

          {/* KOLOM KANAN: Data Detail, Mode Laptop & QR Code Smartphone */}
          <div className="lg:col-span-5 space-y-4">
            {/* Kartu Ringkasan Derajat Kiblat & Jarak */}
            <div
              className="rounded-3xl border p-5 shadow-xs space-y-4"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Data Koordinat &amp; Trigonometri
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Dihitung secara luring (offline) berdasarkan letak geografis Ka&apos;bah Al-Musyarrafah
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}>
                  <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-secondary)' }}>
                    Sudut Azimuth Kiblat
                  </span>
                  <div className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {qiblaResult.qiblaBearing}°
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>
                    {qiblaResult.cardinalDirection}
                  </span>
                </div>

                <div className="rounded-xl border p-3" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}>
                  <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-secondary)' }}>
                    Jarak Lurus ke Ka&apos;bah
                  </span>
                  <div className="mt-1 text-2xl font-black font-mono" style={{ color: 'var(--text-primary)' }}>
                    {qiblaResult.distanceKm.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Kilometer (Great Circle)
                  </span>
                </div>
              </div>

              <div className="rounded-xl border p-3 text-xs space-y-1.5" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Koordinat Lokasi Anda:</span>
                  <span className="font-mono font-bold">{city.lat.toFixed(4)}°, {city.lng.toFixed(4)}°</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Koordinat Ka&apos;bah Makkah:</span>
                  <span className="font-mono font-bold">{KAABA_LAT.toFixed(4)}° N, {KAABA_LNG.toFixed(4)}° E</span>
                </div>
              </div>
            </div>

            {/* Kartu Khusus Laptop / PC Desktop: QR Code Sinkronisasi HP */}
            <div
              className="rounded-3xl border p-5 shadow-xs space-y-3"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Buka Kompas Dinamis di Smartphone
                </h3>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Sensor kompas magnetik umumnya tidak tersedia pada laptop/PC. Pindai kode QR ini dengan kamera HP Anda untuk mendapatkan kompas berputar real-time dan getaran haptic:
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                {qrCodeDataUrl ? (
                  <div className="p-2 rounded-2xl bg-white border border-gray-200 shadow-sm shrink-0">
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code Kompas Kiblat QuranWeb"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center text-xs">
                    Membuat QR...
                  </div>
                )}

                <div className="space-y-2 text-xs flex-1">
                  <div className="rounded-xl border p-2.5 space-y-1" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}>
                    <div className="font-bold text-[11px] text-emerald-600 dark:text-emerald-400">
                      Keunggulan di HP:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-80">
                      <li>Piringan kompas berputar otomatis</li>
                      <li>Getaran haptic saat posisi tepat</li>
                      <li>Navigasi akurat langsung di atas sajadah</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold cursor-pointer transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedLink ? 'Tautan Disalin!' : 'Salin Tautan Web'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Kartu Tips Penyelarasan Bayangan Matahari */}
            <div
              className="rounded-3xl border p-5 shadow-xs space-y-2 text-xs"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--text-primary)' }}>
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Tips Kalibrasi di Laptop &amp; Rumah:</span>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Jika menggunakan kompas manual atau arah matahari terbit/terbenam di Indonesia:
              </p>
              <div className="rounded-xl border p-3 space-y-1 font-mono text-[11px]" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}>
                <div>• Cari arah Barat tepat (270°)</div>
                <div>• Geser sekitar <strong>25° ke arah kanan (Barat Laut / Utara)</strong></div>
                <div>• Garis lurus tersebut adalah arah Ka&apos;bah di Makkah ({qiblaResult.qiblaBearing}°)</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL RASYDUL QIBLAH (ISTIWA A'ZHAM) */}
      {showRasydulModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="flex flex-col w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b shrink-0"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold">Fenomena Rasydul Qiblah (Istiwa A&apos;zham)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRasydulModal(false)}
                className="rounded-xl p-1.5 border cursor-pointer hover:opacity-80"
                style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh] text-xs">
              <p style={{ color: 'var(--text-secondary)' }}>
                <strong>Rasydul Qiblah</strong> (disebut juga <em>Istiwa A&apos;zham</em>) adalah peristiwa astronomis ketika posisi matahari melintas tepat di atas Ka&apos;bah di Makkah (titik Zenith / Deklinasi +21° 25&apos;). Pada saat tersebut, bayangan setiap tongkat atau benda yang berdiri tegak lurus di seluruh belahan dunia yang mengalami siang hari akan <strong>mengarah tepat membelakangi matahari menuju Ka&apos;bah</strong>.
              </p>

              <div className="space-y-3">
                {RASYDUL_QIBLAH_EVENTS.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border p-4 space-y-1.5"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400 text-sm">{item.gregorianDate}</span>
                      <span className="rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 font-mono text-[11px]">
                        {item.timeWIB}
                      </span>
                    </div>
                    <div className="font-semibold text-xs">{item.title}</div>
                    <p className="opacity-80 text-[11px] leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              <div
                className="rounded-2xl border p-3.5 space-y-2"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--text-accent)' }}>
                  <HelpCircle className="h-4 w-4" />
                  <span>Cara Mengukur Mandiri di Rumah / Masjid:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  <li>Siapkan tiang atau tongkat yang dipastikan berdiri tegak lurus di bidang datar (gunakan bandul lot tukang).</li>
                  <li>Lakukan pengukuran tepat pada jam di atas menggunakan jam yang telah terkalibrasi BMKG / jam atom internet.</li>
                  <li>Tarik garis lurus dari ujung bayangan ke pangkal tiang. Garis tersebut adalah arah kiblat mutlak yang 100% akurat.</li>
                </ol>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setShowRasydulModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-accent)',
                  color: 'var(--text-on-accent)',
                }}
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
