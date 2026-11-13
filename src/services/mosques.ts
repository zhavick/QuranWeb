import type { MosqueFacility, MosqueItem, NearbyMosquesFilter } from '../types/mosque';

export const MOSQUE_FACILITIES: MosqueFacility[] = [
  {
    id: 'ground_wudhu',
    label: 'Wudhu Lantai Dasar',
    description: 'Tempat wudhu ramah lansia tanpa tangga curam atau licin',
  },
  {
    id: 'prayer_chairs',
    label: 'Kursi Shalat Tersedia',
    description: 'Disediakan kursi kokoh bagi jamaah lansia yang shalat duduk',
  },
  {
    id: 'wheelchair_ramp',
    label: 'Tanjakan Kursi Roda',
    description: 'Akses ramp landai untuk kursi roda atau tongkat jalan',
  },
  {
    id: 'ac',
    label: 'Ruang Shalat Sejuk (AC)',
    description: 'Sirkulasi udara nyaman dan sejuk bagi kesehatan lansia',
  },
  {
    id: 'parking',
    label: 'Parkir Lapang & Drop-Off',
    description: 'Area penurunan penumpang lansia dekat dengan pintu utama',
  },
  {
    id: 'clean_toilet',
    label: 'Toilet Duduk Ramah Lansia',
    description: 'Toilet higienis dilengkapi kloset duduk dan pegangan tangan',
  },
];

let cachedMosques: MosqueItem[] | null = null;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Menghitung jarak garis lurus antara dua titik koordinat (dalam satuan meter)
 * Menggunakan formula Haversine
 */
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Radius bumi dalam meter
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lng2 - lng1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Estimasi durasi jalan kaki santai lansia (kecepatan santai ±3 km/jam ~ 50 meter/menit)
 * Sangat membantu lansia memperkirakan waktu berangkat sebelum iqamah dikumandangkan
 */
export function calculateElderWalkMinutes(distanceMeters: number): number {
  const METERS_PER_MINUTE = 50;
  return Math.max(1, Math.ceil(distanceMeters / METERS_PER_MINUTE));
}

/**
 * Membuat tautan navigasi suara belokan (turn-by-turn navigation) ke aplikasi eksternal
 */
export function getNavigationUrls(lat: number, lng: number, mosqueName: string) {
  const encodedName = encodeURIComponent(mosqueName);
  return {
    googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodedName}`,
    waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    appleMaps: `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}`,
  };
}

/**
 * Mengambil daftar masjid terdekat dari posisi koordinat pengguna
 * Mendukung query backend dan fallback offline data mandiri
 */
export async function fetchNearbyMosques(
  userLat: number,
  userLng: number,
  radiusKm: number = 25,
  filter?: NearbyMosquesFilter
): Promise<MosqueItem[]> {
  let rawList: MosqueItem[] = [];

  // 1. Coba ambil dari endpoint backend /api/mosques jika tersedia
  try {
    const res = await fetch(`/api/mosques?lat=${userLat}&lng=${userLng}&radius=${radiusKm}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.mosques) && data.mosques.length > 0) {
        rawList = data.mosques;
      }
    }
  } catch {
    // Backend offline / mode dev standalone, lanjut ke fallback
  }

  // 2. Fallback ke data seed lokal offline jika belum termuat
  if (rawList.length === 0) {
    if (!cachedMosques) {
      try {
        const seedRes = await fetch('/data/mosques_seed.json');
        if (seedRes.ok) {
          cachedMosques = await seedRes.json();
          rawList = cachedMosques || [];
        }
      } catch (err) {
        console.error('Failed to load local mosques seed:', err);
      }
    } else {
      rawList = cachedMosques;
    }
  }

  // 3. Hitung jarak dan waktu jalan kaki santai relatif terhadap koordinat pengguna
  const enriched = rawList.map((m) => {
    const distanceMeters = calculateDistanceMeters(userLat, userLng, m.lat, m.lng);
    const elderWalkMinutes = calculateElderWalkMinutes(distanceMeters);
    return {
      ...m,
      distanceMeters,
      elderWalkMinutes,
    };
  });

  // 4. Urutkan dari yang terdekat
  enriched.sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));

  // 5. Terapkan filter fasilitas dan pencarian teks jika ditentukan
  return enriched.filter((m) => {
    if (filter?.facilityRequired && filter.facilityRequired !== 'ALL') {
      if (!m.facilities.includes(filter.facilityRequired)) return false;
    }

    if (filter?.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchAddress = m.address.toLowerCase().includes(q);
      const matchCity = m.city.toLowerCase().includes(q);
      if (!matchName && !matchAddress && !matchCity) return false;
    }

    return true;
  });
}
