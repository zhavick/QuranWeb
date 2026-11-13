export type DuaCategory =
  | 'semua'
  | 'keluarga'
  | 'ampunan'
  | 'keteguhan'
  | 'perlindungan'
  | 'kebaikan'
  | 'kesabaran';

export interface RabbanaDua {
  id: number;
  surahId: number;
  surahName: string;
  ayahNumber: number;
  ayahRange?: string; // misal "193-194"
  arabic: string;
  latin: string;
  translation: string;
  theme: string;
  category: DuaCategory;
  aspekDoa: string; // penjelasan ringkas faedah doa
  audioAyahNumber?: number; // nomor ayat awal untuk audio EveryAyah
}

export type DzikirTime = 'bada_shalat' | 'pagi' | 'petang';

export interface DzikirItem {
  id: string;
  time: DzikirTime;
  title: string;
  arabic: string;
  latin?: string;
  translation: string;
  targetCount: number; // 1, 3, 33, 100
  note?: string;
  source?: string;
}

export interface TasbihSession {
  count: number;
  target: number; // 33, 100, 0 (bebas)
  phrase: string;
  totalLaps: number;
  hapticEnabled: boolean;
  soundEnabled: boolean;
}

