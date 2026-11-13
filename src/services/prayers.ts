import type { RabbanaDua, DzikirItem } from '../types/prayers';

let cachedDuas: RabbanaDua[] | null = null;
let cachedDzikr: DzikirItem[] | null = null;

const STORAGE_KEY_FAVORITE_DUAS = 'quranweb_favorite_duas';

export async function fetchRabbanaDuas(): Promise<RabbanaDua[]> {
  if (cachedDuas) return cachedDuas;
  try {
    const res = await fetch('/data/rabbana_duas.json');
    if (res.ok) {
      const data: RabbanaDua[] = await res.json();
      cachedDuas = data;
      return data;
    }
  } catch (err) {
    console.warn('Error fetching rabbana duas:', err);
  }
  return cachedDuas || [];
}

export async function fetchDailyDzikr(): Promise<DzikirItem[]> {
  if (cachedDzikr) return cachedDzikr;
  try {
    const res = await fetch('/data/daily_dzikr.json');
    if (res.ok) {
      const data: DzikirItem[] = await res.json();
      cachedDzikr = data;
      return data;
    }
  } catch (err) {
    console.warn('Error fetching daily dzikr:', err);
  }
  return cachedDzikr || [];
}

export function getFavoriteDuaIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITE_DUAS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteDua(id: number): boolean {
  try {
    const list = getFavoriteDuaIds();
    const exists = list.includes(id);
    const updated = exists ? list.filter((item) => item !== id) : [...list, id];
    localStorage.setItem(STORAGE_KEY_FAVORITE_DUAS, JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
}

/**
 * Memberikan respon getaran haptic pada smartphone
 */
export function triggerHaptic(type: 'tap' | 'lap' | 'complete'): void {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    if (type === 'tap') {
      // Getaran halus 1x pada tiap ketukan tasbih
      navigator.vibrate(18);
    } else if (type === 'lap') {
      // Getaran panjang 2x saat hitungan 33x
      navigator.vibrate([35, 60, 35]);
    } else if (type === 'complete') {
      // Getaran berirama saat mencapai hitungan 100x atau target
      navigator.vibrate([50, 60, 50, 60, 120]);
    }
  } catch {
    // Ignore browser restriction / lack of permission
  }
}

/**
 * Memainkan audio klik sintetis halus menggunakan Web Audio API
 */
export function playSyntheticClick(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio context limitation
  }
}

/**
 * Menghasilkan tautan audio EveryAyah untuk murottal per ayat
 */
export function getAyahAudioUrl(surahId: number, ayahNumber: number): string {
  const sStr = String(surahId).padStart(3, '0');
  const aStr = String(ayahNumber).padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`;
}

