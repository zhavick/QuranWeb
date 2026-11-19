export interface AyahTafsirItem {
  ayahNumber: number;
  wajiz: string;
  tahlili: string;
  source?: string;
}

export interface SurahTafsir {
  surahId: number;
  surahName: string;
  totalAyahs: number;
  tafsirs: Record<number, AyahTafsirItem>;
}

export interface SelectedTafsirContext {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  textUthmani: string;
  translationId: string;
  tafsir: AyahTafsirItem;
}
