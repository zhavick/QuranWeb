import { SurahTafsir, AyahTafsirItem } from '../types/tafsir';

const tafsirMemoryCache = new Map<number, SurahTafsir>();
const PREFERRED_TAB_KEY = 'quranweb_tafsir_tab';
const FONT_SIZE_KEY = 'quranweb_tafsir_font_size';

export async function fetchSurahTafsir(surahId: number): Promise<SurahTafsir> {
  if (tafsirMemoryCache.has(surahId)) {
    return tafsirMemoryCache.get(surahId)!;
  }

  try {
    const res = await fetch(`/data/tafsir/${surahId}.json`);
    if (!res.ok) {
      throw new Error(`Gagal mengambil data tafsir surah ${surahId}: ${res.statusText}`);
    }
    const data: SurahTafsir = await res.json();
    tafsirMemoryCache.set(surahId, data);
    return data;
  } catch (err) {
    console.error(`Error loading tafsir for surah ${surahId}:`, err);
    throw err;
  }
}

export async function getAyahTafsir(surahId: number, ayahNumber: number): Promise<AyahTafsirItem | null> {
  try {
    const surahData = await fetchSurahTafsir(surahId);
    if (surahData && surahData.tafsirs && surahData.tafsirs[ayahNumber]) {
      return surahData.tafsirs[ayahNumber];
    }
    return null;
  } catch (e) {
    console.error(`Failed to get ayah tafsir for ${surahId}:${ayahNumber}`, e);
    return null;
  }
}

export function getSavedTafsirTab(): 'wajiz' | 'tahlili' {
  try {
    const saved = localStorage.getItem(PREFERRED_TAB_KEY);
    return saved === 'tahlili' ? 'tahlili' : 'wajiz';
  } catch {
    return 'wajiz';
  }
}

export function saveTafsirTab(tab: 'wajiz' | 'tahlili'): void {
  try {
    localStorage.setItem(PREFERRED_TAB_KEY, tab);
  } catch (e) {
    console.error('Error saving tafsir tab preference:', e);
  }
}

export function getSavedTafsirFontSize(): number {
  try {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return saved ? parseInt(saved, 10) : 1; // 0: Normal, 1: Sedang, 2: Besar
  } catch {
    return 1;
  }
}

export function saveTafsirFontSize(step: number): void {
  try {
    localStorage.setItem(FONT_SIZE_KEY, step.toString());
  } catch (e) {
    console.error('Error saving tafsir font size:', e);
  }
}
