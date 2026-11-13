export type ProphetEra = 'permulaan' | 'israil' | 'penutup';

export interface ProphetTimelineItem {
  phase: string;
  title: string;
  description: string;
  readingMinutes: number;
}

export interface ProphetWisdom {
  title: string;
  lesson: string;
}

export interface ProphetDua {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  surahId: number;
  ayahNumber: number;
  reference: string;
}

export interface ProphetQuranReference {
  surahId: number;
  surahName: string;
  ayahStart: number;
  ayahEnd: number;
  topic: string;
}

export interface ProphetMeta {
  id: number;
  slug: string;
  name: string;
  arabicName: string;
  title: string;
  era: ProphetEra;
  eraLabel: string;
  isUlulAzmi: boolean;
  period: string;
  region: string;
  people: string;
  mentionsInQuran: number;
  summary: string;
  relatedSurahIds: number[];
}

export interface ProphetDetail extends ProphetMeta {
  timeline: ProphetTimelineItem[];
  wisdoms: ProphetWisdom[];
  duas: ProphetDua[];
  quranReferences: ProphetQuranReference[];
}

