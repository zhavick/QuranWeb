export type HadithTheme = 'all' | 'akidah' | 'ibadah' | 'akhlak' | 'muamalah';

export interface RelatedAyahRef {
  surahId: number;
  surahName: string;
  ayahNumber: number;
}

export interface ArbainHadith {
  id: number;
  number: number;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  rawi: string;
  theme: 'akidah' | 'ibadah' | 'akhlak' | 'muamalah';
  keyTakeaways: string[];
  relatedAyahs?: RelatedAyahRef[];
}
