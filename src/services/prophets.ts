import type { ProphetMeta, ProphetDetail } from '../types/prophet';

let cachedProphetsMeta: ProphetMeta[] | null = null;
let cachedProphetsData: ProphetDetail[] | null = null;

/**
 * Mengambil ringkasan metadata 25 Nabi & Rasul untuk katalog dan filter
 */
export async function fetchProphetsMeta(): Promise<ProphetMeta[]> {
  if (cachedProphetsMeta) return cachedProphetsMeta;

  try {
    const res = await fetch('/data/prophets_meta.json');
    if (!res.ok) throw new Error('Gagal memuat metadata nabi');
    const data: ProphetMeta[] = await res.json();
    cachedProphetsMeta = data;
    return data;
  } catch (err) {
    console.error('Error fetching prophets_meta:', err);
    // Fallback ambil dari prophets_data jika meta belum siap
    const all = await fetchAllProphets();
    return all.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      arabicName: p.arabicName,
      title: p.title,
      era: p.era,
      eraLabel: p.eraLabel,
      isUlulAzmi: p.isUlulAzmi,
      period: p.period,
      region: p.region,
      people: p.people,
      mentionsInQuran: p.mentionsInQuran,
      summary: p.summary,
      relatedSurahIds: p.relatedSurahIds,
    }));
  }
}

/**
 * Mengambil dataset lengkap 25 Nabi & Rasul beserta linimasa, doa, dan referensi ayat
 */
export async function fetchAllProphets(): Promise<ProphetDetail[]> {
  if (cachedProphetsData) return cachedProphetsData;

  try {
    const res = await fetch('/data/prophets_data.json');
    if (!res.ok) throw new Error('Gagal memuat data lengkap nabi');
    const data: ProphetDetail[] = await res.json();
    cachedProphetsData = data;
    return data;
  } catch (err) {
    console.error('Error fetching prophets_data:', err);
    return [];
  }
}

/**
 * Mengambil detail satu nabi berdasarkan ID (1–25)
 */
export async function fetchProphetById(id: number): Promise<ProphetDetail | null> {
  const all = await fetchAllProphets();
  return all.find((p) => p.id === id) || null;
}

/**
 * Mengambil detail satu nabi berdasarkan slug (misal 'adam', 'yusuf', 'muhammad')
 */
export async function fetchProphetBySlug(slug: string): Promise<ProphetDetail | null> {
  const all = await fetchAllProphets();
  return all.find((p) => p.slug === slug.toLowerCase()) || null;
}

/**
 * Mengambil daftar nabi yang terkait dengan surat Al-Qur'an tertentu
 * Digunakan untuk Lentera Kisah (Bi-Directional Linking dari mushaf ke kisah)
 */
export async function fetchProphetsBySurah(surahId: number): Promise<ProphetMeta[]> {
  const metaList = await fetchProphetsMeta();
  return metaList.filter((p) => p.relatedSurahIds && p.relatedSurahIds.includes(surahId));
}

