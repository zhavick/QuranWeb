import type { AinMeta } from './quran';

export type KhatamRhythm = 'sakinah' | 'istiqamah' | 'fokus' | 'custom';

export interface KhatamPlan {
  id: string;
  rhythm: KhatamRhythm;
  targetAinsPerDay: number;
  startDate: string; // ISO String
  targetEndDate: string; // ISO String
  currentAin: number; // 1 s.d. 556
  completedAinIds: number[]; // daftar nomor ain yang telah selesai
  dailyLog: Record<string, number[]>; // 'YYYY-MM-DD' -> [ainNumber1, ainNumber2, ...]
  prayerRemindersEnabled: boolean;
  isCompleted: boolean;
  completedAt?: string;
}

export interface KhatamStats {
  totalAins: number;
  completedCount: number;
  remainingCount: number;
  percent: number;
  daysActive: number;
  todayCompletedCount: number;
  todayTargetCount: number;
  estimatedDaysLeft: number;
  estimatedFinishDate: string;
  currentAinMeta: AinMeta | null;
  currentSurahName: string;
}

export interface RhythmOption {
  id: KhatamRhythm;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  ainsPerDay: number;
  estimatedDays: number;
  recommended: boolean;
}

