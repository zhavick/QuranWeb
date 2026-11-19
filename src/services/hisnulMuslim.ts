// Service for Step 30: Hisnul Muslim (Kumpulan Doa Sehari-hari) & Web Speech Audio TTS
import {
  HisnulMuslimDua,
  HisnulMuslimCategoryInfo,
} from '../types/hisnulMuslim';
import { logActivity } from './telemetry';

const FAVORITES_STORAGE_KEY = 'quranweb_hisnul_muslim_favorites';

export const HISNUL_MUSLIM_CATEGORIES: HisnulMuslimCategoryInfo[] = [
  {
    id: 'semua',
    label: 'Semua Doa',
    icon: '✨',
    description: 'Seluruh kompilasi 100+ doa harian Hisnul Muslim shahih',
  },
  {
    id: 'rutinitas',
    label: 'Rutinitas Harian',
    icon: '🌅',
    description: 'Bangun/tidur, makan/minum, berpakaian, kamar mandi & cermin',
  },
  {
    id: 'shalat',
    label: 'Shalat & Wudhu',
    icon: '🕌',
    description: 'Wudhu, masjid, azan, istiftah, ruku, sujud, tahiyyat & salam',
  },
  {
    id: 'keluarga',
    label: 'Rumah & Keluarga',
    icon: '👨‍👩‍👧‍👦',
    description: 'Orang tua, anak keturunan, pernikahan, sakit & musibah',
  },
  {
    id: 'perjalanan',
    label: 'Perjalanan & Alam',
    icon: '🧭',
    description: 'Kendaraan, safar, pasar, angin, petir, hujan & hilal bulan',
  },
  {
    id: 'perlindungan',
    label: 'Perlindungan & Duka',
    icon: '🛡️',
    description: 'Sayyidul istighfar, kegundahan jiwa, utang, was-was & tolak bala',
  },
  {
    id: 'favorit',
    label: 'Doa Favorit',
    icon: '⭐',
    description: 'Daftar doa harian pilihan yang Anda tandai',
  },
];

let cachedDuas: HisnulMuslimDua[] | null = null;

/**
 * Fetch all 100+ Hisnul Muslim duas from local public JSON
 */
export async function fetchHisnulMuslimDuas(): Promise<HisnulMuslimDua[]> {
  if (cachedDuas && cachedDuas.length > 0) {
    return cachedDuas;
  }

  try {
    const res = await fetch('/data/hisnul_muslim.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = (await res.json()) as HisnulMuslimDua[];
    cachedDuas = data;
    return data;
  } catch (err) {
    console.error('Failed to load hisnul_muslim.json', err);
    return [];
  }
}

/**
 * Get favorite dua IDs from localStorage
 */
export function getFavoriteHisnulMuslimIds(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Toggle favorite status for a dua
 */
export function toggleFavoriteHisnulMuslim(id: number): number[] {
  const current = getFavoriteHisnulMuslimIds();
  let updated: number[];
  if (current.includes(id)) {
    updated = current.filter((item) => item !== id);
  } else {
    updated = [...current, id];
    // Gentle haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([30, 20, 30]);
      } catch {
        // ignore
      }
    }
  }

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save hisnul muslim favorites', e);
  }

  logActivity('TOGGLE_HISNUL_MUSLIM_FAVORITE', { id, isFavorite: updated.includes(id) });
  return updated;
}

/**
 * Web Speech API TTS for Arabic and Indonesian
 */
let currentSpeechUtterance: SpeechSynthesisUtterance | null = null;

export function isVoiceSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function isVoicePlaying(): boolean {
  return !!currentSpeechUtterance;
}

export function stopDuaVoice(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentSpeechUtterance = null;
}

export function playDuaVoice(
  text: string,
  lang: 'ar' | 'id',
  onEnd?: () => void,
  onError?: () => void
): boolean {
  if (!isVoiceSupported()) {
    onError?.();
    return false;
  }

  stopDuaVoice();

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    currentSpeechUtterance = utterance;

    if (lang === 'ar') {
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // slightly slower for clearer Arabic pronunciation
      utterance.pitch = 1.0;
    } else {
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
    }

    // Try finding specific voice matching language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) =>
      lang === 'ar' ? v.lang.startsWith('ar') : v.lang.startsWith('id')
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      currentSpeechUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      currentSpeechUtterance = null;
      onError?.();
    };

    window.speechSynthesis.speak(utterance);
    logActivity('PLAY_HISNUL_MUSLIM_SPEECH', { lang });
    return true;
  } catch (err) {
    console.error('SpeechSynthesis failed', err);
    onError?.();
    return false;
  }
}
