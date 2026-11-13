import type { QuranMeta, SurahData, TranslationSearchResult } from '../types/quran';

let metaCache: QuranMeta | null = null;
const surahCache = new Map<number, SurahData>();
let translationIndexCache: [number, number, number, number, string][] | null = null;

export async function getQuranMeta(): Promise<QuranMeta> {
  if (metaCache) return metaCache;
  const res = await fetch('/data/meta.json');
  if (!res.ok) throw new Error('Gagal memuat metadata Al-Qur\'an.');
  metaCache = (await res.json()) as QuranMeta;
  return metaCache;
}

export async function getSurahData(surahId: number): Promise<SurahData> {
  const cached = surahCache.get(surahId);
  if (cached) return cached;
  const res = await fetch(`/data/surahs/${surahId}.json`);
  if (!res.ok) throw new Error(`Gagal memuat Surat ke-${surahId}.`);
  const data = (await res.json()) as SurahData;
  surahCache.set(surahId, data);
  return data;
}

export async function getMultipleSurahs(surahIds: number[]): Promise<SurahData[]> {
  const uniqueIds = Array.from(new Set(surahIds));
  return Promise.all(uniqueIds.map((id) => getSurahData(id)));
}

export async function cacheAllSurahsOffline(
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  const total = 114;
  const batchSize = 10;
  let loaded = 0;

  // Pre-fetch dataset kisah nabi
  try {
    fetch('/data/prophets_meta.json');
    fetch('/data/prophets_data.json');
  } catch {
    // Ignore offline error
  }

  for (let start = 1; start <= total; start += batchSize) {
    const batch: Promise<SurahData>[] = [];
    for (let id = start; id < start + batchSize && id <= total; id++) {
      batch.push(getSurahData(id));
    }
    await Promise.all(batch);
    loaded = Math.min(start + batchSize - 1, total);
    onProgress?.(loaded, total);
  }
}

export async function searchTranslation(
  keyword: string,
  surahMap: Map<number, string>,
  maxResults = 50
): Promise<TranslationSearchResult[]> {
  const cleanKeyword = keyword.trim().toLowerCase();
  if (!cleanKeyword || cleanKeyword.length < 2) return [];

  if (!translationIndexCache) {
    const res = await fetch('/data/translation_index.json');
    if (!res.ok) throw new Error('Gagal memuat indeks pencarian terjemahan.');
    translationIndexCache = (await res.json()) as [number, number, number, number, string][];
  }

  const results: TranslationSearchResult[] = [];
  for (const item of translationIndexCache) {
    const [surahId, ayahNumber, juzNumber, ainNumber, translation] = item;
    if (translation.toLowerCase().includes(cleanKeyword)) {
      results.push({
        surahId,
        surahName: surahMap.get(surahId) ?? `Surat ${surahId}`,
        ayahNumber,
        juzNumber,
        ainNumber,
        translation,
      });
      if (results.length >= maxResults) break;
    }
  }

  return results;
}

