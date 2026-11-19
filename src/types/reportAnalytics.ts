// Data Types for Worship Analytics & Reporting (/report)

export type ReportPeriod = '7d' | '30d' | 'all';

export interface PrayerDailyChecklist {
  date: string; // YYYY-MM-DD
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  dhuha?: boolean;
  tahajud?: boolean;
  rawatib?: boolean;
}

export interface TilawahStats {
  totalAyahRead: number;
  estimatedMinutes: number;
  uniqueJuzExplored: number[];
  activeDaysStreak: number;
  lastReadSurahName?: string;
  lastReadAyah?: number;
}

export interface PrayerStats {
  complianceRate: number; // 0 - 100 (%)
  totalFardhuCompleted: number;
  totalTargetFardhu: number;
  onTimeCount: number;
  sunnahCompleted: number;
}

export interface MemorizationStats {
  surahCount: number;
  ayahCount: number;
  fluencyScore: number; // 0 - 100 (%)
  targetJuz: number;
}

export interface DhikrStats {
  totalCount: number;
  favoritePhrase: string;
  completedCycles: number;
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // total activity actions
  level: 0 | 1 | 2 | 3 | 4; // intensity
}

export interface WorshipAnalyticsSummary {
  period: ReportPeriod;
  title: string;
  periodLabel: string;
  userName: string;
  userEmail: string;
  joinedDate: string;
  tilawah: TilawahStats;
  prayer: PrayerStats;
  memorization: MemorizationStats;
  dhikr: DhikrStats;
  overallScore: number; // 0 - 100
  spiritualTitle: string; // misal "Hamba Istiqomah", "Pecinta Tilawah"
  spiritualQuote: string;
  dailyTrend: { day: string; tilawah: number; prayer: number; dhikr: number }[];
  heatmap: HeatmapDay[];
}
