export interface SurahMeta {
  id: number;
  nameArabic: string;
  nameLatin: string;
  translationId: string;
  revelationPlace: 'Makkiyah' | 'Madaniyah';
  totalAyahs: number;
}

export interface JuzMeta {
  juzNumber: number;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export interface AinMeta {
  ainNumber: number;
  surahId: number;
  surahAinIndex: number;
  juzNumber: number;
  startAyah: number;
  endAyah: number;
}

export interface QuranMeta {
  surahs: SurahMeta[];
  juzs: JuzMeta[];
  ains: AinMeta[];
  totalAyahs: number;
}

export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  juzNumber: number;
  ainNumber: number;
  isAinEnd: boolean;
  textUthmani: string;
  textTajweed?: string;
  translationId: string;
}

export interface SurahData {
  surah: SurahMeta;
  ayahs: Ayah[];
}

export type ThemeMode = 'light' | 'dark' | 'high-contrast' | 'sepia';
export type ArabicFontFamily = 'lpmq' | 'amiri' | 'scheherazade';
export type NavigationTab = 'surah' | 'juz' | 'ain';

export interface ReaderSettings {
  theme: ThemeMode;
  elderMode: boolean;
  arabicFontSize: number;
  translationFontSize: number;
  lineHeight: number;
  arabicFont: ArabicFontFamily;
  showTranslation: boolean;
  tajweedEnabled: boolean;
  spotlightEnabled: boolean;
  autoScrollSpeed: number;
}

export interface LastReadState {
  mode: NavigationTab;
  surahId: number;
  ayahNumber: number;
  juzNumber: number;
  ainNumber: number;
  updatedAt: string;
}

export interface BookmarkItem {
  id: string;
  surahId: number;
  ayahNumber: number;
  ainNumber: number;
  note?: string;
  createdAt: string;
}

export interface TranslationSearchResult {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  juzNumber: number;
  ainNumber: number;
  translation: string;
}

