export type TasbihCountMode = 'up' | 'down';

export interface TasbihPhrase {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  meaning: string;
  defaultTarget: number;
  fadilah?: string;
  dalil?: string;
}

export interface TasbihStats {
  todayDate: string;
  todayCount: number;
  totalLaps: number;
}
