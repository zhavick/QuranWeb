export interface AsmaulHusnaItem {
  id: number;
  arabic: string;
  latin: string;
  translation: string;
  meaning: string;
  surahRef?: {
    surahId: number;
    surahName: string;
    ayahNumber: number;
  };
  faedah?: string;
}
