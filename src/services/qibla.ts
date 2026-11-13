import type { QiblaCalculationResult, RasydulQiblahEvent } from '../types/qibla';

/**
 * Koordinat Geografis Ka'bah Al-Musyarrafah di Masjidil Haram, Makkah Al-Mukarramah
 * Lintang: 21° 25' 20.95" N (21.422487)
 * Bujur: 39° 49' 34.34" E (39.826206)
 */
export const KAABA_LAT = 21.422487;
export const KAABA_LNG = 39.826206;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Menghitung sudut arah Kiblat (Azimuth) dari koordinat geografis tertentu
 * Menggunakan rumus Trigonometri Speris (Spherical Great Circle Bearing)
 * @returns Derajat arah kiblat relatif terhadap Utara Sejati (0° - 360°) searah jarum jam
 */
export function calculateQiblaBearing(lat: number, lng: number): number {
  const phi1 = toRadians(lat);
  const phi2 = toRadians(KAABA_LAT);
  const deltaLambda = toRadians(KAABA_LNG - lng);

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let qibla = toDegrees(Math.atan2(y, x));
  return (qibla + 360) % 360;
}

/**
 * Menghitung jarak lurus ke Ka'bah di Makkah menggunakan formula Haversine
 * @returns Jarak dalam satuan kilometer (km)
 */
export function calculateDistanceToKaaba(lat: number, lng: number): number {
  const EARTH_RADIUS_KM = 6371;
  const dLat = toRadians(KAABA_LAT - lat);
  const dLng = toRadians(KAABA_LNG - lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat)) * Math.cos(toRadians(KAABA_LAT)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c);
}

/**
 * Mengonversi sudut derajat azimuth menjadi teks arah mata angin Indonesia
 */
export function getCardinalDirection(degrees: number): string {
  const normalized = (degrees + 360) % 360;
  if (normalized >= 348.75 || normalized < 11.25) return 'Utara (N)';
  if (normalized >= 11.25 && normalized < 33.75) return 'Utara Timur Laut (NNE)';
  if (normalized >= 33.75 && normalized < 56.25) return 'Timur Laut (NE)';
  if (normalized >= 56.25 && normalized < 78.75) return 'Timur Timur Laut (ENE)';
  if (normalized >= 78.75 && normalized < 101.25) return 'Timur (E)';
  if (normalized >= 101.25 && normalized < 123.75) return 'Timur Tenggara (ESE)';
  if (normalized >= 123.75 && normalized < 146.25) return 'Tenggara (SE)';
  if (normalized >= 146.25 && normalized < 168.75) return 'Selatan Tenggara (SSE)';
  if (normalized >= 168.75 && normalized < 191.25) return 'Selatan (S)';
  if (normalized >= 191.25 && normalized < 213.75) return 'Selatan Barat Daya (SSW)';
  if (normalized >= 213.75 && normalized < 236.25) return 'Barat Daya (SW)';
  if (normalized >= 236.25 && normalized < 258.75) return 'Barat Barat Daya (WSW)';
  if (normalized >= 258.75 && normalized < 281.25) return 'Barat (W)';
  if (normalized >= 281.25 && normalized < 303.75) return 'Barat Barat Laut (WNW)';
  if (normalized >= 303.75 && normalized < 326.25) return 'Barat Laut (NW)';
  return 'Utara Barat Laut (NNW)';
}

/**
 * Informasi fenomena Rasydul Qiblah (Istiwa A'zham)
 * Peristiwa astronomi tahunan saat matahari melintas tepat di atas Ka'bah
 */
export const RASYDUL_QIBLAH_EVENTS: RasydulQiblahEvent[] = [
  {
    title: "Rasydul Qiblah Siklus Pertama (Istiwa A'zham)",
    gregorianDate: '27 - 28 Mei',
    timeWIB: '16:18 WIB (09:18 GMT)',
    description:
      'Matahari tepat berada di atas Ka’bah pada deklinasi +21° 25’. Bayangan benda tegak lurus pada jam tersebut akan mengarah persis ke kiblat.',
  },
  {
    title: "Rasydul Qiblah Siklus Kedua (Istiwa A'zham)",
    gregorianDate: '15 - 16 Juli',
    timeWIB: '16:27 WIB (09:27 GMT)',
    description:
      'Matahari kembali melintasi zenith Ka’bah sebelum bergerak ke belahan bumi selatan. Sangat akurat untuk kalibrasi manual di rumah/masjid.',
  },
];

/**
 * Menghasilkan kalkulasi komprehensif arah kiblat untuk satu titik koordinat
 */
export function getQiblaInfo(lat: number, lng: number, cityName: string): QiblaCalculationResult {
  const bearing = calculateQiblaBearing(lat, lng);
  const distance = calculateDistanceToKaaba(lat, lng);
  const cardinal = getCardinalDirection(bearing);

  return {
    latitude: lat,
    longitude: lng,
    cityName,
    qiblaBearing: Number(bearing.toFixed(2)),
    distanceKm: distance,
    cardinalDirection: cardinal,
    compassDeviationFromNorth: Number(bearing.toFixed(2)),
  };
}

