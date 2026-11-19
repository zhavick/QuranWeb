import { ArbainHadith, HadithTheme } from '../types/hadith';

let cachedHadithList: ArbainHadith[] | null = null;
const FAVORITES_KEY = 'quranweb_arbain_favorites';

export async function fetchArbainHadithList(): Promise<ArbainHadith[]> {
  if (cachedHadithList && cachedHadithList.length > 0) {
    return cachedHadithList;
  }

  try {
    const response = await fetch('/data/arbain_hadith.json');
    if (!response.ok) {
      throw new Error(`Gagal memuat data Hadits Arba'in: ${response.statusText}`);
    }
    const data: ArbainHadith[] = await response.json();
    cachedHadithList = data;
    return data;
  } catch (error) {
    console.error('Error fetching arbain hadith:', error);
    throw error;
  }
}

export function getFavoriteHadithIds(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteHadith(id: number): number[] {
  try {
    const current = getFavoriteHadithIds();
    const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Gagal memperbarui favorit hadits:', e);
    return getFavoriteHadithIds();
  }
}

export function filterHadiths(
  list: ArbainHadith[],
  query: string,
  theme: HadithTheme,
  onlyFavorites: boolean,
  favoriteIds: number[]
): ArbainHadith[] {
  let result = [...list];

  if (theme !== 'all') {
    result = result.filter((h) => h.theme === theme);
  }

  if (onlyFavorites) {
    result = result.filter((h) => favoriteIds.includes(h.id));
  }

  const cleanQuery = query.trim().toLowerCase();
  if (cleanQuery) {
    result = result.filter((h) => {
      const matchNum = h.number.toString() === cleanQuery || `hadits ${h.number}`.includes(cleanQuery);
      const matchTitle = h.title.toLowerCase().includes(cleanQuery);
      const matchTranslation = h.translation.toLowerCase().includes(cleanQuery);
      const matchRawi = h.rawi.toLowerCase().includes(cleanQuery);
      const matchArabic = h.arabic.includes(cleanQuery);
      const matchLatin = h.latin.toLowerCase().includes(cleanQuery);
      const matchKey = h.keyTakeaways.some((k) => k.toLowerCase().includes(cleanQuery));

      return matchNum || matchTitle || matchTranslation || matchRawi || matchArabic || matchLatin || matchKey;
    });
  }

  return result;
}

export function getThemeBadgeColor(theme: string): { bg: string; text: string; border: string; label: string } {
  switch (theme) {
    case 'akidah':
      return {
        bg: 'rgba(59, 130, 246, 0.1)',
        text: '#2563eb',
        border: 'rgba(59, 130, 246, 0.25)',
        label: 'Akidah & Tauhid',
      };
    case 'ibadah':
      return {
        bg: 'rgba(16, 185, 129, 0.1)',
        text: '#059669',
        border: 'rgba(16, 185, 129, 0.25)',
        label: 'Ibadah & Syariat',
      };
    case 'akhlak':
      return {
        bg: 'rgba(245, 158, 11, 0.1)',
        text: '#d97706',
        border: 'rgba(245, 158, 11, 0.25)',
        label: 'Akhlak & Adab',
      };
    case 'muamalah':
      return {
        bg: 'rgba(139, 92, 246, 0.1)',
        text: '#7c3aed',
        border: 'rgba(139, 92, 246, 0.25)',
        label: 'Muamalah & Sosial',
      };
    default:
      return {
        bg: 'rgba(107, 114, 128, 0.1)',
        text: '#4b5563',
        border: 'rgba(107, 114, 128, 0.25)',
        label: 'Umum',
      };
  }
}
