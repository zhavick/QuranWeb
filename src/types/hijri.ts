// Data Types for Hijri Calendar, Sunnah Fasting, and Islamic Holidays

export interface HijriDate {
  day: number;
  month: number; // 1 - 12
  year: number;
  monthNameEn: string;
  monthNameAr: string;
  monthNameId: string;
  formatted: string; // e.g. "14 Ramadhan 1448 H"
}

export type FastingType =
  | 'wajib_ramadhan'
  | 'senin_kamis'
  | 'ayyamul_bidh'
  | 'asyura'
  | 'tasua'
  | 'arafah'
  | 'syawwal'
  | 'haram'
  | 'none';

export interface FastingInfo {
  type: FastingType;
  name: string;
  isFasting: boolean;
  isHaram: boolean;
  badgeColor: string; // CSS or Tailwind color
  description: string;
  hadithDalil?: string;
  hadithSource?: string;
}

export interface IslamicHoliday {
  name: string;
  hijriDay: number;
  hijriMonth: number;
  description: string;
}

export interface CalendarDayItem {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number; // 1 - 31
  month: number; // 0 - 11
  year: number;
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  isCurrentMonth: boolean;
  isToday: boolean;
  hijri: HijriDate;
  fasting: FastingInfo;
  holiday?: IslamicHoliday;
}

export interface ZakatMaalCalculation {
  totalAssets: number;
  goldPricePerGram: number;
  nisabValue: number; // 85 * goldPricePerGram
  isObligated: boolean;
  zakatDue: number; // 2.5% of totalAssets
  deficitToNisab: number;
}

export interface ZakatProfesiCalculation {
  monthlyIncome: number;
  basicExpense: number;
  ricePricePerKg: number;
  nisabValue: number; // 524 * ricePricePerKg
  netIncome: number;
  isObligated: boolean;
  zakatDue: number; // 2.5% of netIncome
  deficitToNisab: number;
}

export interface ZakatFitrahCalculation {
  familyCount: number;
  ricePricePerKg: number;
  totalRiceKg: number; // familyCount * 2.5
  totalMoney: number; // totalRiceKg * ricePricePerKg (or standard nominal)
}
