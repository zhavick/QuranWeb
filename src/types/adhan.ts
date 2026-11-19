// Data Types for Audio Adhan & Prayer Notification Engine

export type MuadzinId =
  | 'makkah'
  | 'madinah'
  | 'alaqsa'
  | 'nusantara'
  | 'subuh_syahdu';

export type AdhanPlayMode = 'full' | 'takbir' | 'beep' | 'mute';

export interface MuadzinInfo {
  id: MuadzinId;
  name: string;
  location: string;
  description: string;
  audioUrlFull: string;
  audioUrlTakbir: string;
  isFajrSpecial?: boolean;
}

export interface PrayerAdhanSettings {
  autoAdhanEnabled: boolean;
  selectedMuadzin: MuadzinId;
  fajrMuadzin: MuadzinId;
  volume: number; // 0 to 1
  prayerModes: {
    fajr: AdhanPlayMode;
    dhuhr: AdhanPlayMode;
    asr: AdhanPlayMode;
    maghrib: AdhanPlayMode;
    isha: AdhanPlayMode;
  };
  notificationsEnabled: boolean;
  lastPlayedKey?: string; // YYYY-MM-DD_prayerKey
}

export interface ActiveAdhanState {
  isOpen: boolean;
  prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  prayerLabel: string;
  muadzinName: string;
  muadzinLocation: string;
  playMode: AdhanPlayMode;
  audioUrl?: string;
  currentTimeFormatted: string;
}
