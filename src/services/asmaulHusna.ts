import { AsmaulHusnaItem } from '../types/asmaulHusna';

let cachedAsmaulHusna: AsmaulHusnaItem[] | null = null;

export async function fetchAsmaulHusna(): Promise<AsmaulHusnaItem[]> {
  if (cachedAsmaulHusna && cachedAsmaulHusna.length > 0) {
    return cachedAsmaulHusna;
  }

  try {
    const res = await fetch('/data/asmaul_husna.json');
    if (!res.ok) {
      throw new Error(`Gagal memuat Asmaul Husna: ${res.statusText}`);
    }
    const data: AsmaulHusnaItem[] = await res.json();
    cachedAsmaulHusna = data;
    return data;
  } catch (error) {
    console.error('Error fetching Asmaul Husna data:', error);
    throw error;
  }
}
