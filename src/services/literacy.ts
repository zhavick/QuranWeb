import type {
  AsbabunNuzulItem,
  GharibulQuranWord,
  AudioCapsuleItem,
} from '../types/literacy';

let cachedAsbab: AsbabunNuzulItem[] | null = null;
let cachedGharib: GharibulQuranWord[] | null = null;
let cachedCapsules: AudioCapsuleItem[] | null = null;

/**
 * Mengambil daftar seluruh riwayat Asbabun Nuzul
 */
export async function fetchAsbabunNuzulList(): Promise<AsbabunNuzulItem[]> {
  if (cachedAsbab) return cachedAsbab;
  try {
    const res = await fetch('/data/asbabun_nuzul.json');
    if (res.ok) {
      cachedAsbab = await res.json();
      return cachedAsbab || [];
    }
    return [];
  } catch (err) {
    console.error('Error fetching Asbabun Nuzul:', err);
    return [];
  }
}

/**
 * Mengambil satu riwayat Asbabun Nuzul untuk surat dan nomor ayat tertentu
 */
export async function getAsbabunNuzulForAyah(
  surahId: number,
  ayahNumber: number
): Promise<AsbabunNuzulItem | null> {
  const list = await fetchAsbabunNuzulList();
  return list.find((item) => item.surahId === surahId && item.ayahNumber === ayahNumber) || null;
}

/**
 * Mengambil seluruh kamus mufradat kata sukar (Gharibul Qur'an)
 */
export async function fetchGharibulQuranList(): Promise<GharibulQuranWord[]> {
  if (cachedGharib) return cachedGharib;
  try {
    const res = await fetch('/data/gharibul_quran.json');
    if (res.ok) {
      cachedGharib = await res.json();
      return cachedGharib || [];
    }
    return [];
  } catch (err) {
    console.error('Error fetching Gharibul Quran:', err);
    return [];
  }
}

/**
 * Mengambil kata-kata gharib untuk surat dan nomor ayat tertentu
 */
export async function getGharibWordsForAyah(
  surahId: number,
  ayahNumber: number
): Promise<GharibulQuranWord[]> {
  const list = await fetchGharibulQuranList();
  return list.filter((item) => item.surahId === surahId && item.ayahNumber === ayahNumber);
}

/**
 * Mengambil daftar audio narasi bertutur 3-5 menit (Audio Capsule)
 */
export async function fetchAudioCapsules(): Promise<AudioCapsuleItem[]> {
  if (cachedCapsules) return cachedCapsules;
  try {
    const res = await fetch('/data/audio_capsules.json');
    if (res.ok) {
      cachedCapsules = await res.json();
      return cachedCapsules || [];
    }
    return [];
  } catch (err) {
    console.error('Error fetching Audio Capsules:', err);
    return [];
  }
}

