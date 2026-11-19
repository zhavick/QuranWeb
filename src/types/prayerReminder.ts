// Types for Step 29: Prayer Checklist & Tiered Smart Reminders

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'dhuha' | 'tahajud';

export type PrayerAttendanceMode = 'mosque' | 'home' | 'ontime' | 'munfarid';

export interface PrayerAttendanceDetail {
  mode: PrayerAttendanceMode;
  timestamp: string; // ISO string
  notes?: string;
}

export interface DetailedPrayerDailyRecord {
  date: string; // YYYY-MM-DD
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  dhuha?: boolean;
  tahajud?: boolean;
  rawatib?: boolean;
  details?: Partial<Record<PrayerKey, PrayerAttendanceDetail>>;
}

export interface SmartReminderSettings {
  enabled: boolean;
  reminder10m: boolean; // 10 minutes after prayer start
  reminder20m: boolean; // 20 minutes after prayer start
  customMinutes: number; // 0 = disabled, 30, 45, etc.
  preExpiryWarning: boolean; // 15 mins before next prayer
  soundAlert: boolean;
  vibrationAlert: boolean;
  notificationsEnabled: boolean;
  // History of triggered reminder tags for today to prevent duplicates
  triggeredKeys: string[]; // e.g. "2026-11-19_dhuhr_10m"
}

export interface ActiveReminderAlert {
  id: string;
  prayerKey: PrayerKey;
  prayerLabel: string;
  type: '10m' | '20m' | 'custom' | 'pre_expiry';
  title: string;
  message: string;
  timestamp: string;
}
