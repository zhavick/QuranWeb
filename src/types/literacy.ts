export interface AsbabunNuzulItem {
  id: string;
  surahId: number;
  surahName: string;
  ayahNumber: number;
  title: string;
  historicalContext: string;
  narrator: string; // Misal: "HR. Al-Bukhari no. 4770 & Muslim no. 3014"
  sourceBook: string; // Misal: "Lubabun Nuqul fi Asbabin Nuzul (Imam As-Suyuthi)"
  wisdom: string;
}

export interface GharibulQuranWord {
  id: string;
  surahId: number;
  surahName: string;
  ayahNumber: number;
  wordArabic: string;
  rootArabic: string; // Akar kata / jadzr (misal: "ص-م-د")
  transliteration: string;
  literalMeaning: string;
  balaghahMeaning: string;
  contextualNote: string;
}

export interface AudioCapsuleItem {
  id: string;
  title: string;
  narratorName: string;
  durationMinutes: number;
  category: 'tadabbur' | 'prophet' | 'tazkiyah';
  categoryLabel: string;
  audioUrl: string;
  summary: string;
  transcriptText: string;
  relatedSurahId?: number;
  relatedAyahNumber?: number;
}

