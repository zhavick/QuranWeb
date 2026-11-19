// Types for Step 30: Hisnul Muslim (Kumpulan Doa Sehari-hari) & Panduan Shalat Bergambar

export type HisnulMuslimCategory =
  | 'rutinitas'
  | 'keluarga'
  | 'perjalanan'
  | 'perlindungan'
  | 'shalat';

export interface HisnulMuslimDua {
  id: number;
  title: string;
  category: HisnulMuslimCategory;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  fawaid?: string;
  repeatCount?: number;
}

export interface HisnulMuslimCategoryInfo {
  id: HisnulMuslimCategory | 'semua' | 'favorit';
  label: string;
  icon: string;
  description: string;
}

export type SalahStepType =
  | 'niat'
  | 'takbir'
  | 'iftitah'
  | 'fatihah'
  | 'ruku'
  | 'itidal'
  | 'sujud'
  | 'iftirasy'
  | 'tasyahud_awal'
  | 'tasyahud_akhir'
  | 'salam';

export interface SalahStepGuide {
  stepNumber: number;
  type: SalahStepType;
  title: string;
  subtitle: string;
  arabic: string;
  latin: string;
  translation: string;
  ruling: 'Rukun' | 'Sunnah Muakkad' | 'Syarat Sah';
  description: string;
  tips: string[];
  illustrationType: string;
}

export interface SunnahPrayerGuide {
  id: 'dhuha' | 'tahajud' | 'witir' | 'istikharah' | 'taubat' | 'hajat' | 'jenazah';
  name: string;
  arabicName: string;
  rakats: string;
  timing: string;
  virtue: string;
  procedure: string[];
  specialDua: {
    title: string;
    arabic: string;
    latin: string;
    translation: string;
    source: string;
  };
}
