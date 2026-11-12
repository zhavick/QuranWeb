import { useState, useEffect, useMemo, useCallback } from 'react';
import { Coordinates, CalculationParameters, PrayerTimes, Madhab } from 'adhan';
import { useLocalStorage } from './useLocalStorage';
import { logActivity } from '../services/telemetry';

export interface PrayerCity {
  name: string;
  province?: string;
  lat: number;
  lng: number;
}

export const INDONESIA_CITIES: PrayerCity[] = [
  // Jawa
  { name: 'Jakarta (DKI)', province: 'DKI Jakarta', lat: -6.2088, lng: 106.8456 },
  { name: 'Bandung', province: 'Jawa Barat', lat: -6.9175, lng: 107.6191 },
  { name: 'Bekasi', province: 'Jawa Barat', lat: -6.2383, lng: 106.9756 },
  { name: 'Bogor', province: 'Jawa Barat', lat: -6.5971, lng: 106.806 },
  { name: 'Depok', province: 'Jawa Barat', lat: -6.4025, lng: 106.7942 },
  { name: 'Tangerang', province: 'Banten', lat: -6.1783, lng: 106.6319 },
  { name: 'Serang', province: 'Banten', lat: -6.1104, lng: 106.1639 },
  { name: 'Semarang', province: 'Jawa Tengah', lat: -6.9667, lng: 110.4167 },
  { name: 'Surakarta (Solo)', province: 'Jawa Tengah', lat: -7.5755, lng: 110.8243 },
  { name: 'Yogyakarta', province: 'D.I. Yogyakarta', lat: -7.7956, lng: 110.3695 },
  { name: 'Surabaya', province: 'Jawa Timur', lat: -7.2575, lng: 112.7521 },
  { name: 'Malang', province: 'Jawa Timur', lat: -7.9666, lng: 112.6326 },

  // Sumatera
  { name: 'Banda Aceh', province: 'Aceh', lat: 5.5483, lng: 95.3238 },
  { name: 'Medan', province: 'Sumatera Utara', lat: 3.5952, lng: 98.6722 },
  { name: 'Padang', province: 'Sumatera Barat', lat: -0.9471, lng: 100.4172 },
  { name: 'Pekanbaru', province: 'Riau', lat: 0.5071, lng: 101.4478 },
  { name: 'Batam', province: 'Kepulauan Riau', lat: 1.1301, lng: 104.0529 },
  { name: 'Jambi', province: 'Jambi', lat: -1.6101, lng: 103.6131 },
  { name: 'Palembang', province: 'Sumatera Selatan', lat: -2.9761, lng: 104.7754 },
  { name: 'Bengkulu', province: 'Bengkulu', lat: -3.8004, lng: 102.2655 },
  { name: 'Bandar Lampung', province: 'Lampung', lat: -5.45, lng: 105.2667 },
  { name: 'Pangkal Pinang', province: 'Bangka Belitung', lat: -2.1333, lng: 106.1167 },

  // Kalimantan
  { name: 'Pontianak', province: 'Kalimantan Barat', lat: -0.0263, lng: 109.3425 },
  { name: 'Palangka Raya', province: 'Kalimantan Tengah', lat: -2.2161, lng: 113.9139 },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', lat: -3.3194, lng: 114.5908 },
  { name: 'Samarinda', province: 'Kalimantan Timur', lat: -0.5022, lng: 117.1536 },
  { name: 'Balikpapan', province: 'Kalimantan Timur', lat: -1.2379, lng: 116.8529 },
  { name: 'Tarakan', province: 'Kalimantan Utara', lat: 3.3271, lng: 117.5786 },

  // Sulawesi
  { name: 'Makassar', province: 'Sulawesi Selatan', lat: -5.1477, lng: 119.4327 },
  { name: 'Manado', province: 'Sulawesi Utara', lat: 1.4748, lng: 124.8421 },
  { name: 'Palu', province: 'Sulawesi Tengah', lat: -0.9003, lng: 119.8779 },
  { name: 'Kendari', province: 'Sulawesi Tenggara', lat: -3.9985, lng: 122.5126 },
  { name: 'Gorontalo', province: 'Gorontalo', lat: 0.5435, lng: 123.0568 },
  { name: 'Mamuju', province: 'Sulawesi Barat', lat: -2.6774, lng: 118.8895 },

  // Bali & Nusa Tenggara
  { name: 'Denpasar', province: 'Bali', lat: -8.6705, lng: 115.2126 },
  { name: 'Mataram (Lombok)', province: 'Nusa Tenggara Barat', lat: -8.5833, lng: 116.1167 },
  { name: 'Kupang', province: 'Nusa Tenggara Timur', lat: -10.1772, lng: 123.607 },

  // Maluku & Papua
  { name: 'Ambon', province: 'Maluku', lat: -3.6554, lng: 128.1908 },
  { name: 'Ternate', province: 'Maluku Utara', lat: 0.7904, lng: 127.3789 },
  { name: 'Jayapura', province: 'Papua', lat: -2.5337, lng: 140.7181 },
  { name: 'Sorong', province: 'Papua Barat Daya', lat: -0.8761, lng: 131.2558 },
  { name: 'Manokwari', province: 'Papua Barat', lat: -0.8615, lng: 134.062 },
  { name: 'Merauke', province: 'Papua Selatan', lat: -8.4991, lng: 140.4005 },

  // Internasional
  { name: 'Makkah', province: 'Arab Saudi', lat: 21.3891, lng: 39.8579 },
  { name: 'Madinah', province: 'Arab Saudi', lat: 24.5247, lng: 39.5692 },
];

// Standar Kemenag RI (Subuh 20°, Isya 18°, Madzhab Syafi'i, +2 menit Ihtiyat pengaman)
function getKemenagParams(): CalculationParameters {
  const params = new CalculationParameters('Other', 20, 18);
  params.madhab = Madhab.Shafi;
  // Menambahkan 2 menit pengaman (Ihtiyat standar Kemenag)
  params.adjustments = {
    fajr: 2,
    sunrise: -2,
    dhuhr: 2,
    asr: 2,
    maghrib: 2,
    isha: 2,
  };
  return params;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export interface PrayerTimeItem {
  key: string;
  label: string;
  time: Date;
  formatted: string;
  isNext: boolean;
  isPassed: boolean;
  isSecondary?: boolean; // Untuk Imsak dan Syuruq
}

export function usePrayerTimes() {
  const [city, setCity] = useLocalStorage<PrayerCity>('quranweb_prayer_city', INDONESIA_CITIES[0]);
  const [now, setNow] = useState<Date>(() => new Date());
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const changeCity = useCallback(
    (newCity: PrayerCity) => {
      setCity(newCity);
      logActivity('CHANGE_PRAYER_CITY', { cityName: newCity.name, lat: newCity.lat, lng: newCity.lng });
    },
    [setCity]
  );

  const detectGps = useCallback(() => {
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
        setCity(gpsCity);
        logActivity('GPS_DETECT_PRAYER_LOCATION', {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(err.message || 'Gagal mendeteksi lokasi GPS.');
        setGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [setCity]);

  const schedule = useMemo(() => {
    const coords = new Coordinates(city.lat, city.lng);
    const params = getKemenagParams();
    const pt = new PrayerTimes(coords, now, params);

    // Imsak = 10 menit sebelum Subuh (standar hisab Indonesia)
    const imsakTime = new Date(pt.fajr.getTime() - 10 * 60 * 1000);

    const allList: PrayerTimeItem[] = [
      { key: 'imsak', label: 'Imsak', time: imsakTime, formatted: formatTime(imsakTime), isNext: false, isPassed: now > imsakTime, isSecondary: true },
      { key: 'fajr', label: 'Subuh', time: pt.fajr, formatted: formatTime(pt.fajr), isNext: false, isPassed: now > pt.fajr },
      { key: 'sunrise', label: 'Terbit', time: pt.sunrise, formatted: formatTime(pt.sunrise), isNext: false, isPassed: now > pt.sunrise, isSecondary: true },
      { key: 'dhuhr', label: 'Dzuhur', time: pt.dhuhr, formatted: formatTime(pt.dhuhr), isNext: false, isPassed: now > pt.dhuhr },
      { key: 'asr', label: 'Ashar', time: pt.asr, formatted: formatTime(pt.asr), isNext: false, isPassed: now > pt.asr },
      { key: 'maghrib', label: 'Maghrib', time: pt.maghrib, formatted: formatTime(pt.maghrib), isNext: false, isPassed: now > pt.maghrib },
      { key: 'isha', label: 'Isya', time: pt.isha, formatted: formatTime(pt.isha), isNext: false, isPassed: now > pt.isha },
    ];

    // Shalat wajib yang dihitung sebagai target berikutnya (Fajr, Dhuhr, Asr, Maghrib, Isha)
    const fardhuOnly = allList.filter((item) => !item.isSecondary);

    let next = fardhuOnly.find((item) => item.time.getTime() > now.getTime());
    let isTomorrow = false;

    if (!next) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const ptTomorrow = new PrayerTimes(coords, tomorrow, params);
      next = {
        key: 'fajr',
        label: 'Subuh',
        time: ptTomorrow.fajr,
        formatted: formatTime(ptTomorrow.fajr),
        isNext: true,
        isPassed: false,
      };
      isTomorrow = true;
    }

    const diffMs = next.time.getTime() - now.getTime();
    const isImminent = diffMs <= 10 * 60 * 1000 && diffMs > 0; // <= 10 menit menuju shalat

    const timesWithNext = allList.map((item) => ({
      ...item,
      isNext: item.key === next.key && !isTomorrow,
    }));

    return {
      currentClock: now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      currentDateFormatted: now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      nextPrayerLabel: next.label,
      nextPrayerTime: formatTime(next.time),
      countdown: formatCountdown(diffMs),
      isImminent,
      times: timesWithNext,
    };
  }, [city, now]);

  return {
    city,
    setCity: changeCity,
    detectGps,
    gpsLoading,
    gpsError,
    ...schedule,
  };
}
