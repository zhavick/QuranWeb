import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Search,
  CheckCircle2,
  Phone,
  Footprints,
  ExternalLink,
  Info,
  Accessibility,
  Armchair,
  Droplets,
  Wind,
  Car,
} from 'lucide-react';
import { INDONESIA_CITIES, type PrayerCity } from '../../hooks/usePrayerTimes';
import type { MosqueFacilityId, MosqueItem, NearbyMosquesFilter } from '../../types/mosque';
import type { ThemeMode } from '../../types/quran';
import {
  fetchNearbyMosques,
  getNavigationUrls,
  MOSQUE_FACILITIES,
} from '../../services/mosques';
import { logActivity } from '../../services/telemetry';

interface MosqueMapProps {
  onBackToMushaf: () => void;
  elderMode?: boolean;
  theme?: ThemeMode;
}

export const MosqueMap: React.FC<MosqueMapProps> = ({
  onBackToMushaf,
  elderMode = false,
  theme = 'light',
}) => {
  // 1. Lokasi pengguna aktif (sinkron dengan preferensi kota jadwal shalat / GPS)
  const [city, setCity] = useState<PrayerCity>(() => {
    try {
      const saved = localStorage.getItem('quranweb_prayer_city');
      return saved ? JSON.parse(saved) : INDONESIA_CITIES[0];
    } catch {
      return INDONESIA_CITIES[0];
    }
  });

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: city.lat,
    lng: city.lng,
  });

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // 2. Daftar masjid dan filter
  const [mosques, setMosques] = useState<MosqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMosque, setSelectedMosque] = useState<MosqueItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<MosqueFacilityId | 'ALL'>('ALL');

  // 3. Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Muat data masjid saat koordinat atau filter berubah
  const loadMosques = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    const filter: NearbyMosquesFilter = {
      searchQuery,
      facilityRequired: selectedFacility,
    };
    const list = await fetchNearbyMosques(lat, lng, 35, filter);
    setMosques(list);
    setLoading(false);
    if (list.length > 0 && !selectedMosque) {
      setSelectedMosque(list[0]);
    }
  }, [searchQuery, selectedFacility, selectedMosque]);

  useEffect(() => {
    loadMosques(userCoords.lat, userCoords.lng);
  }, [loadMosques, userCoords.lat, userCoords.lng]);

  // Handler pergantian kota dari dropdown
  const handleCityChange = (newCity: PrayerCity) => {
    setCity(newCity);
    setUserCoords({ lat: newCity.lat, lng: newCity.lng });
    try {
      localStorage.setItem('quranweb_prayer_city', JSON.stringify(newCity));
    } catch {
      // Ignore
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([newCity.lat, newCity.lng], 14, { duration: 1.2 });
    }
  };

  // Deteksi GPS Lokasi Pengguna
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation tidak didukung peramban ini.');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserCoords(coords);
        const gpsCity: PrayerCity = {
          name: 'Lokasi GPS Anda',
          province: 'Otomatis',
          lat: coords.lat,
          lng: coords.lng,
        };
        setCity(gpsCity);
        setGpsLoading(false);
        try {
          localStorage.setItem('quranweb_prayer_city', JSON.stringify(gpsCity));
        } catch {
          // Ignore
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 15, { duration: 1.2 });
        }
        logActivity('GPS_DETECT_MOSQUE_MAP', coords);
      },
      (err) => {
        setGpsError(err.message || 'Gagal mendeteksi lokasi GPS.');
        setGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Inisialisasi Peta Leaflet.js
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Buat instance map
    const map = L.map(mapContainerRef.current, {
      center: [userCoords.lat, userCoords.lng],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    });

    // Tile Layer OpenStreetMap
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | QuranWeb Open Waqf',
    });
    tileLayer.addTo(map);

    // Group layer untuk marker
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    logActivity('VIEW_MOSQUE_MAP', { lat: userCoords.lat, lng: userCoords.lng });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sinkronisasi Marker Pengguna & Masjid pada Peta Leaflet
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersLayerRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Marker Posisi Pengguna (Pulsing Dot)
    const userDivIcon = L.divIcon({
      className: 'quranweb-user-marker',
      html: `
        <div style="position:relative; width:22px; height:22px;">
          <div style="position:absolute; width:22px; height:22px; background:rgba(16,185,129,0.3); border-radius:50%; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:absolute; top:3px; left:3px; width:16px; height:16px; background:#10b981; border:3px solid #ffffff; border-radius:50%; box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    const userMarker = L.marker([userCoords.lat, userCoords.lng], {
      icon: userDivIcon,
      title: 'Posisi Anda Saat Ini',
      zIndexOffset: 1000,
    });
    userMarker.bindTooltip('<b>Posisi Anda</b><br>' + city.name, { direction: 'top' });
    group.addLayer(userMarker);
    userMarkerRef.current = userMarker;

    // 2. Marker Masjid-Masjid
    mosques.forEach((mosque) => {
      const isSelected = selectedMosque?.id === mosque.id;
      const markerHtml = `
        <div style="
          width: 36px;
          height: 36px;
          background: ${isSelected ? '#f59e0b' : '#059669'};
          border: 3px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          <svg style="transform: rotate(45deg); width:18px; height:18px; fill:#ffffff;" viewBox="0 0 24 24">
            <path d="M12 2L15 8H9L12 2Z"/>
            <path d="M4 10H20V21H4V10Z"/>
            <circle cx="12" cy="15" r="3" fill="#ffffff" opacity="0.3"/>
          </svg>
        </div>
      `;

      const mosqueDivIcon = L.divIcon({
        className: `quranweb-mosque-marker-${mosque.id}`,
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const m = L.marker([mosque.lat, mosque.lng], {
        icon: mosqueDivIcon,
        title: mosque.name,
      });

      const navUrls = getNavigationUrls(mosque.lat, mosque.lng, mosque.name);

      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; max-width: 240px; padding: 2px;">
          <div style="font-weight: bold; font-size: 13px; color: #0f172a; margin-bottom: 2px;">
            ${mosque.name}
          </div>
          ${mosque.arabicName ? `<div style="font-family: 'Amiri', serif; font-size: 13px; color: #059669; margin-bottom: 4px;">${mosque.arabicName}</div>` : ''}
          <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
            ${mosque.address}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; background: #f1f5f9; padding: 6px 8px; border-radius: 8px; margin-bottom: 8px;">
            <div>
              <span style="font-size: 10px; color: #64748b;">Jarak</span>
              <div style="font-weight: bold; color: #059669;">${((mosque.distanceMeters || 0) / 1000).toFixed(1)} km</div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 10px; color: #64748b;">Jalan Santai</span>
              <div style="font-weight: bold; color: #d97706;">~${mosque.elderWalkMinutes} mnt</div>
            </div>
          </div>
          <a href="${navUrls.googleMaps}" target="_blank" rel="noopener noreferrer" style="
            display: block;
            text-align: center;
            background: #059669;
            color: #ffffff;
            font-weight: bold;
            font-size: 11px;
            padding: 6px 10px;
            border-radius: 8px;
            text-decoration: none;
          ">
            Buka Navigasi Suara ➔
          </a>
        </div>
      `;

      m.bindPopup(popupHtml);

      m.on('click', () => {
        setSelectedMosque(mosque);
      });

      group.addLayer(m);
    });
  }, [city.name, mosques, selectedMosque, userCoords]);

  // Fungsi saat kartu masjid di daftar samping diklik
  const handleSelectMosque = (mosque: MosqueItem) => {
    setSelectedMosque(mosque);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([mosque.lat, mosque.lng], 16, {
        duration: 1.0,
      });
    }
  };

  // Helper render ikon fasilitas ramah lansia
  const renderFacilityBadge = (facId: MosqueFacilityId) => {
    const meta = MOSQUE_FACILITIES.find((f) => f.id === facId);
    if (!meta) return null;

    let IconComponent = Accessibility;
    if (facId === 'ground_wudhu') IconComponent = Droplets;
    if (facId === 'prayer_chairs') IconComponent = Armchair;
    if (facId === 'wheelchair_ramp') IconComponent = Accessibility;
    if (facId === 'ac') IconComponent = Wind;
    if (facId === 'parking') IconComponent = Car;

    return (
      <span
        key={facId}
        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold"
        style={{
          backgroundColor: 'var(--bg-accent-soft)',
          color: 'var(--text-accent)',
        }}
        title={meta.description}
      >
        <IconComponent className="h-3 w-3 shrink-0" />
        <span>{meta.label}</span>
      </span>
    );
  };

  // Filter CSS untuk OpenStreetMap Tiles menyesuaikan tema QuranWeb
  const mapFilterCss = useMemo(() => {
    switch (theme) {
      case 'dark':
        return 'brightness(0.7) invert(1) contrast(1.8) hue-rotate(200deg) saturate(0.4)';
      case 'sepia':
        return 'sepia(0.65) brightness(0.92) contrast(1.05)';
      case 'high-contrast':
        return 'contrast(1.35) saturate(1.15)';
      default:
        return 'none';
    }
  }, [theme]);

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
              <MapPin className="h-5 w-5 text-emerald-500" />
              <h1 className="text-base sm:text-lg font-bold tracking-tight">
                Peta Masjid Terdekat (OpenStreetMap)
              </h1>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Panduan shalat berjamaah ramah lansia dengan estimasi jalan santai dan navigasi belokan
            </p>
          </div>
        </div>

        {/* Info Cepat Jumlah Masjid */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
          <span
            className="rounded-xl border px-3 py-1.5"
            style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
          >
            Ditemukan: <strong className="text-emerald-500">{mosques.length}</strong> Masjid
          </span>
        </div>
      </header>

      {/* Konten Utama: Split Map & List */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-5 flex flex-col gap-4">
        {/* Bar Pemilihan Wilayah & Filter Fasilitas */}
        <section
          className="rounded-2xl border p-3.5 shadow-xs space-y-3"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Lokasi Acuan & GPS */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                <Navigation className="h-4 w-4 text-emerald-500" />
                <span>Titik Posisi:</span>
              </div>

              <select
                value={city.name}
                onChange={(e) => {
                  const found = INDONESIA_CITIES.find((c) => c.name === e.target.value);
                  if (found) handleCityChange(found);
                }}
                className="rounded-xl border px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                {INDONESIA_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.province})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleDetectGps}
                disabled={gpsLoading}
                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                title="Gunakan koordinat GPS perangkat Anda"
              >
                <Navigation className={`h-3.5 w-3.5 text-emerald-500 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Mencari...' : 'GPS Posisi Saya'}</span>
              </button>
            </div>

            {/* Pencarian Nama Masjid */}
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama masjid atau jalan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border pl-8 pr-3 py-1.5 text-xs outline-none"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {/* Filter Cepat Fasilitas Ramah Lansia */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-[11px] font-semibold mr-1" style={{ color: 'var(--text-secondary)' }}>
              Fasilitas:
            </span>
            <button
              type="button"
              onClick={() => setSelectedFacility('ALL')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                selectedFacility === 'ALL' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: selectedFacility === 'ALL' ? 'var(--bg-accent)' : 'var(--bg-muted)',
                color: selectedFacility === 'ALL' ? 'var(--text-on-accent)' : 'var(--text-primary)',
              }}
            >
              Semua
            </button>
            {MOSQUE_FACILITIES.map((fac) => {
              const isSelected = selectedFacility === fac.id;
              return (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() => setSelectedFacility(isSelected ? 'ALL' : fac.id)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--bg-accent)' : 'var(--bg-muted)',
                    color: isSelected ? 'var(--text-on-accent)' : 'var(--text-primary)',
                  }}
                  title={fac.description}
                >
                  <span>{fac.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {gpsError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Grid Peta & Daftar Masjid */}
        <div className="grid gap-4 lg:grid-cols-12 flex-1 items-start">
          {/* Peta Interaktif Leaflet.js (Kiri/Atas) */}
          <div
            className="lg:col-span-7 rounded-3xl border shadow-sm overflow-hidden h-[380px] sm:h-[480px] lg:h-[560px] relative"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div
              ref={mapContainerRef}
              className="w-full h-full z-10"
              style={{
                filter: mapFilterCss,
              }}
            />

            {/* Floating Quick Legend / Status */}
            <div
              className="absolute bottom-3 left-3 z-20 rounded-xl border px-3 py-1.5 text-[11px] font-bold shadow-md backdrop-blur-md flex items-center gap-2"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Posisi Anda</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
                <span>Masjid Terdekat</span>
              </div>
            </div>
          </div>

          {/* Daftar Kartu Masjid Ramah Lansia (Kanan/Bawah) */}
          <div className="lg:col-span-5 space-y-3 h-[380px] sm:h-[480px] lg:h-[560px] flex flex-col">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Daftar Masjid Terurut Jarak
              </h2>
              <span className="text-xs opacity-75 font-mono">
                Kecepatan Lansia: ~50m/mnt (3km/j)
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loading ? (
                <div className="flex items-center justify-center p-8 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Memuat data masjid terdekat...
                </div>
              ) : mosques.length === 0 ? (
                <div className="rounded-2xl border p-8 text-center space-y-2" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Tidak ada masjid yang cocok dengan kriteria filter di sekitar wilayah ini.
                  </p>
                </div>
              ) : (
                mosques.map((mosque) => {
                  const isSelected = selectedMosque?.id === mosque.id;
                  const navUrls = getNavigationUrls(mosque.lat, mosque.lng, mosque.name);
                  const distKm = ((mosque.distanceMeters || 0) / 1000).toFixed(1);

                  return (
                    <article
                      key={mosque.id}
                      onClick={() => handleSelectMosque(mosque)}
                      className={`rounded-2xl border p-4 transition-all cursor-pointer shadow-xs ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'hover:border-emerald-500/50'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--bg-secondary)' : 'var(--bg-card)',
                        borderColor: isSelected ? undefined : 'var(--border-color)',
                      }}
                    >
                      {/* Baris Atas: Nama & Jarak */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                              {mosque.name}
                            </h3>
                            {mosque.isVerified && (
                              <span title="Terverifikasi">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              </span>
                            )}
                          </div>
                          {mosque.arabicName && (
                            <p className="font-arabic text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                              {mosque.arabicName}
                            </p>
                          )}
                          <p className="text-xs mt-1 leading-snug" style={{ color: 'var(--text-secondary)' }}>
                            {mosque.address}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs px-2 py-0.5">
                            {distKm} km
                          </span>
                        </div>
                      </div>

                      {/* Estimasi Jalan Santai Lansia */}
                      <div
                        className="mt-3 flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold"
                        style={{
                          backgroundColor: 'var(--bg-muted)',
                        }}
                      >
                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                          <Footprints className="h-4 w-4 shrink-0" />
                          <span>~{mosque.elderWalkMinutes} Menit Jalan Santai</span>
                        </div>
                        <span className="text-[10px] opacity-75">Sebelum Iqamah</span>
                      </div>

                      {/* Fasilitas Ramah Lansia */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {mosque.facilities.map((f) => renderFacilityBadge(f))}
                      </div>

                      {/* Tombol Navigasi Suara 1-Klik */}
                      <div className="mt-3 pt-2.5 border-t flex items-center justify-between gap-2" style={{ borderColor: 'var(--border-color)' }}>
                        {mosque.phone && (
                          <a
                            href={`tel:${mosque.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{mosque.phone}</span>
                          </a>
                        )}

                        <div className="flex items-center gap-1.5 ml-auto">
                          <a
                            href={navUrls.googleMaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                            title="Navigasi suara belokan di Google Maps"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Google Maps</span>
                          </a>

                          <a
                            href={navUrls.waze}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-xs"
                            title="Buka rute di Waze"
                          >
                            <span>Waze</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
