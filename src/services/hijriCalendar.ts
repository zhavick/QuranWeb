// Service for Hijri Calendar, Sunnah Fasting, Islamic Holidays & Zakat Calculator
import {
  HijriDate,
  FastingInfo,
  IslamicHoliday,
  CalendarDayItem,
  ZakatMaalCalculation,
  ZakatProfesiCalculation,
  ZakatFitrahCalculation,
} from '../types/hijri';

const HIJRI_ADJUSTMENT_KEY = 'quranweb_hijri_adjustment'; // integer -2 to +2

export const HIJRI_MONTHS = [
  { id: 1, nameId: 'Muharram', nameAr: 'مُحَرَّم', nameEn: 'Muharram' },
  { id: 2, nameId: 'Safar', nameAr: 'صَفَر', nameEn: 'Safar' },
  { id: 3, nameId: "Rabi'ul Awwal", nameAr: 'رَبِيع الأَوَّل', nameEn: "Rabi' al-Awwal" },
  { id: 4, nameId: "Rabi'ul Akhir", nameAr: 'رَبِيع الآخِر', nameEn: "Rabi' al-Thani" },
  { id: 5, nameId: 'Jumadil Ula', nameAr: 'جُمَادَى الأُولَى', nameEn: 'Jumada al-Awwal' },
  { id: 6, nameId: 'Jumadil Akhirah', nameAr: 'جُمَادَى الآخِرَة', nameEn: 'Jumada al-Thani' },
  { id: 7, nameId: 'Rajab', nameAr: 'رَبَج', nameEn: 'Rajab' },
  { id: 8, nameId: "Sya'ban", nameAr: 'شَعْبَان', nameEn: "Sha'ban" },
  { id: 9, nameId: 'Ramadhan', nameAr: 'رَمَضَان', nameEn: 'Ramadan' },
  { id: 10, nameId: 'Syawwal', nameAr: 'شَوَّال', nameEn: 'Shawwal' },
  { id: 11, nameId: "Dzulqa'dah", nameAr: 'ذُو القَعْدَة', nameEn: "Dhu al-Qa'dah" },
  { id: 12, nameId: 'Dzulhijjah', nameAr: 'ذُو الحِجَّة', nameEn: 'Dhu al-Hijjah' },
];

export const ISLAMIC_HOLIDAYS: IslamicHoliday[] = [
  {
    name: 'Tahun Baru Islam (1 Muharram)',
    hijriMonth: 1,
    hijriDay: 1,
    description: 'Awal tahun baru penanggalan Hijriah, mengenang peristiwa hijrah Rasulullah SAW dari Makkah ke Madinah.',
  },
  {
    name: 'Hari Asyura (10 Muharram)',
    hijriMonth: 1,
    hijriDay: 10,
    description: 'Hari diselamatkannya Nabi Musa AS dari kejaran Fir’aun. Dianjurkan berpuasa Asyura beserta Tasu’a (9 Muharram).',
  },
  {
    name: 'Maulid Nabi Muhammad SAW (12 Rabi’ul Awwal)',
    hijriMonth: 3,
    hijriDay: 12,
    description: 'Peringatan kelahiran baginda Rasulullah Muhammad SAW sebagai rahmat bagi seluruh alam semesta.',
  },
  {
    name: 'Isra Mi’raj (27 Rajab)',
    hijriMonth: 7,
    hijriDay: 27,
    description: 'Perjalanan malam Rasulullah SAW dari Masjidil Haram ke Masjidil Aqsa hingga Sidratul Muntaha menjemput perintah shalat 5 waktu.',
  },
  {
    name: 'Malam Nisfu Sya’ban (15 Sya’ban)',
    hijriMonth: 8,
    hijriDay: 15,
    description: 'Malam pengampunan dosa dan penyerahan catatan amal ke hadirat Allah SWT, bersiap menyambut bulan Ramadhan.',
  },
  {
    name: 'Awal Bulan Suci Ramadhan (1 Ramadhan)',
    hijriMonth: 9,
    hijriDay: 1,
    description: 'Hari pertama kewajiban ibadah puasa Ramadhan, bulan diturunkannya permulaan Al-Qur’an dan pintu surga dibuka luas.',
  },
  {
    name: 'Nuzulul Qur’an (17 Ramadhan)',
    hijriMonth: 9,
    hijriDay: 17,
    description: 'Peringatan malam pertama kali ayat suci Al-Qur’an (Surat Al-’Alaq 1–5) diwahyukan kepada Nabi Muhammad SAW di Gua Hira.',
  },
  {
    name: 'Hari Raya Idul Fitri (1 Syawwal)',
    hijriMonth: 10,
    hijriDay: 1,
    description: 'Hari kemenangan umat Islam setelah sebulan penuh berpuasa. Diharamkan berpuasa pada hari ini.',
  },
  {
    name: 'Hari Arafah (9 Dzulhijjah)',
    hijriMonth: 12,
    hijriDay: 9,
    description: 'Puncak ibadah haji (wukuf di padang Arafah). Bagi yang tidak berhaji disunnahkan berpuasa penghapus dosa 2 tahun.',
  },
  {
    name: 'Hari Raya Idul Adha (10 Dzulhijjah)',
    hijriMonth: 12,
    hijriDay: 10,
    description: 'Hari raya kurban memperingati keikhlasan Nabi Ibrahim AS dan Nabi Ismail AS. Diharamkan berpuasa pada hari ini.',
  },
  {
    name: 'Hari Tasyrik (11–13 Dzulhijjah)',
    hijriMonth: 12,
    hijriDay: 11,
    description: 'Hari makan, minum, dan berdzikir kepada Allah setelah Idul Adha. Diharamkan berpuasa pada hari-hari ini.',
  },
];

// Get stored manual hisab adjustment (-2, -1, 0, 1, 2 days)
export function getHijriAdjustment(): number {
  try {
    const val = localStorage.getItem(HIJRI_ADJUSTMENT_KEY);
    return val !== null ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function setHijriAdjustment(adjustment: number): void {
  try {
    localStorage.setItem(HIJRI_ADJUSTMENT_KEY, String(adjustment));
  } catch (e) {
    console.error('Failed to save hijri adjustment', e);
  }
}

/**
 * Convert Gregorian date to Hijri date using Kuwaiti/Tabular astronomical algorithm
 * with customizable correction day offset (metode hisab Umm al-Qura).
 */
export function getHijriDate(gregorianDate: Date, adjustmentOffset?: number): HijriDate {
  const adj = adjustmentOffset !== undefined ? adjustmentOffset : getHijriAdjustment();

  const adjustedDate = new Date(gregorianDate);
  if (adj !== 0) {
    adjustedDate.setDate(adjustedDate.getDate() + adj);
  }

  // Astronomical Julian Date calculation
  let day = adjustedDate.getDate();
  let month = adjustedDate.getMonth(); // 0 - 11
  let year = adjustedDate.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  // Gregorian epoch offset for Hijri (16 July 622 CE = JD 1948439.5)
  const z = jd - 1948440 + 10632;
  const n = Math.floor((z - 1) / 10631);
  const z2 = z - 10631 * n + 354;
  const j =
    Math.floor((10985 - z2) / 5316) * Math.floor((50 * z2) / 17719) +
    Math.floor(z2 / 5670) * Math.floor((43 * z2) / 15238);
  const z3 =
    z2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;

  const hijriMonth = Math.floor((24 * z3) / 709);
  const hijriDay = z3 - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  const monthIdx = Math.max(1, Math.min(12, hijriMonth));
  const monthData = HIJRI_MONTHS[monthIdx - 1];

  return {
    day: hijriDay,
    month: monthIdx,
    year: hijriYear,
    monthNameEn: monthData.nameEn,
    monthNameAr: monthData.nameAr,
    monthNameId: monthData.nameId,
    formatted: `${hijriDay} ${monthData.nameId} ${hijriYear} H`,
  };
}

/**
 * Detect Fasting category for a specific date (Wajib, Sunnah, or Haram)
 */
export function getFastingInfo(date: Date, hijri: HijriDate): FastingInfo {
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, 4 = Thu

  // 1. Check Haram Days first
  // 1 Syawwal = Idul Fitri
  if (hijri.month === 10 && hijri.day === 1) {
    return {
      type: 'haram',
      name: 'Diharamkan Puasa (Idul Fitri)',
      isFasting: false,
      isHaram: true,
      badgeColor: '#ef4444',
      description: 'Hari raya Idul Fitri adalah hari bergembira, makan, dan bersilaturahmi. Diharamkan berpuasa.',
      hadithDalil: 'Rasulullah SAW melarang berpuasa pada dua hari: Hari Raya Idul Fitri dan Hari Raya Idul Adha.',
      hadithSource: 'HR. Bukhari no. 1990 & Muslim no. 1137',
    };
  }

  // 10 Dzulhijjah = Idul Adha
  if (hijri.month === 12 && hijri.day === 10) {
    return {
      type: 'haram',
      name: 'Diharamkan Puasa (Idul Adha)',
      isFasting: false,
      isHaram: true,
      badgeColor: '#ef4444',
      description: 'Hari raya kurban (Idul Adha). Umat Islam diharamkan berpuasa pada hari ini.',
      hadithDalil: 'Janganlah kalian berpuasa pada hari Idul Fitri dan Idul Adha.',
      hadithSource: 'HR. Bukhari no. 1995',
    };
  }

  // 11, 12, 13 Dzulhijjah = Hari Tasyrik
  if (hijri.month === 12 && (hijri.day === 11 || hijri.day === 12 || hijri.day === 13)) {
    return {
      type: 'haram',
      name: `Diharamkan Puasa (Hari Tasyrik ${hijri.day} Dzulhijjah)`,
      isFasting: false,
      isHaram: true,
      badgeColor: '#f97316',
      description: 'Hari Tasyrik adalah hari makan, minum, dan berdzikir mengingat Allah SWT.',
      hadithDalil: 'Hari-hari tasyrik adalah hari makan, minum, dan mengingat Allah.',
      hadithSource: 'HR. Muslim no. 1141',
    };
  }

  // 2. Puasa Wajib Ramadhan
  if (hijri.month === 9) {
    return {
      type: 'wajib_ramadhan',
      name: `Puasa Wajib Ramadhan (Hari ke-${hijri.day})`,
      isFasting: true,
      isHaram: false,
      badgeColor: '#10b981',
      description: 'Puasa fardhu bulan suci Ramadhan, salah satu rukun Islam yang wajib ditunaikan setiap mukallaf.',
      hadithDalil: 'Hai orang-orang yang beriman, diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu agar kamu bertakwa.',
      hadithSource: 'QS. Al-Baqarah: 183',
    };
  }

  // 3. Puasa Arafah (9 Dzulhijjah)
  if (hijri.month === 12 && hijri.day === 9) {
    return {
      type: 'arafah',
      name: 'Puasa Sunnah Arafah (9 Dzulhijjah)',
      isFasting: true,
      isHaram: false,
      badgeColor: '#8b5cf6',
      description: 'Disunnahkan bagi yang tidak melaksanakan wukuf di Arafah. Menghapuskan dosa setahun lalu dan setahun mendatang.',
      hadithDalil: 'Puasa Arafah dapat menghapuskan dosa setahun yang lalu dan setahun yang akan datang.',
      hadithSource: 'HR. Muslim no. 1162',
    };
  }

  // 4. Puasa Asyura (10 Muharram) & Tasu'a (9 Muharram)
  if (hijri.month === 1 && hijri.day === 10) {
    return {
      type: 'asyura',
      name: 'Puasa Sunnah Asyura (10 Muharram)',
      isFasting: true,
      isHaram: false,
      badgeColor: '#ec4899',
      description: 'Puasa hari Asyura untuk bersyukur atas pertolongan Allah kepada Nabi Musa AS, menghapus dosa setahun lalu.',
      hadithDalil: 'Puasa hari Asyura, aku berharap kepada Allah agar menghapuskan dosa setahun sebelumnya.',
      hadithSource: 'HR. Muslim no. 1162',
    };
  }
  if (hijri.month === 1 && hijri.day === 9) {
    return {
      type: 'tasua',
      name: 'Puasa Sunnah Tasu’a (9 Muharram)',
      isFasting: true,
      isHaram: false,
      badgeColor: '#f43f5e',
      description: 'Disunnahkan berpuasa pada hari ke-9 Muharram untuk menyelisihi kebiasaan kaum Yahudi sebelum hari Asyura.',
      hadithDalil: 'Sekiranya aku masih hidup sampai tahun depan, niscaya aku akan berpuasa pada hari kesembilan.',
      hadithSource: 'HR. Muslim no. 1134',
    };
  }

  // 5. Puasa Ayyamul Bidh (13, 14, 15 setiap bulan Hijriah)
  if (hijri.day === 13 || hijri.day === 14 || hijri.day === 15) {
    return {
      type: 'ayyamul_bidh',
      name: `Puasa Ayyamul Bidh (${hijri.day} ${hijri.monthNameId})`,
      isFasting: true,
      isHaram: false,
      badgeColor: '#eab308',
      description: 'Puasa hari-hari putih saat bulan purnama bersinar terang. Pahalanya seperti berpuasa sepanjang tahun.',
      hadithDalil: 'Wahai Abu Dzar, jika engkau ingin berpuasa tiga hari setiap bulan, maka berpuasalah pada tanggal 13, 14, dan 15.',
      hadithSource: 'HR. Tirmidzi no. 761 (Hadits Hasan)',
    };
  }

  // 6. Puasa 6 Hari Syawwal (misal 2 - 7 Syawwal)
  if (hijri.month === 10 && hijri.day >= 2 && hijri.day <= 7) {
    return {
      type: 'syawwal',
      name: `Puasa Sunnah Syawwal (Hari ke-${hijri.day - 1})`,
      isFasting: true,
      isHaram: false,
      badgeColor: '#06b6d4',
      description: 'Puasa 6 hari di bulan Syawwal setelah Idul Fitri. Pahalanya dilipatgandakan bagaikan puasa setahun penuh.',
      hadithDalil: 'Barangsiapa berpuasa Ramadhan kemudian mengikutinya dengan enam hari di bulan Syawwal, maka ia seperti berpuasa setahun penuh.',
      hadithSource: 'HR. Muslim no. 1164',
    };
  }

  // 7. Puasa Senin & Kamis
  if (dayOfWeek === 1 || dayOfWeek === 4) {
    const dayLabel = dayOfWeek === 1 ? 'Senin' : 'Kamis';
    return {
      type: 'senin_kamis',
      name: `Puasa Sunnah ${dayLabel}`,
      isFasting: true,
      isHaram: false,
      badgeColor: '#10b981',
      description: `Amalan puasa sunnah di hari ${dayLabel}, saat catatan amal manusia diangkat ke hadapan Allah Ta’ala.`,
      hadithDalil: 'Berbagai amalan dihadapkan (pada Allah) pada hari Senin dan Kamis, maka aku suka jika amalanku dihadapkan saat aku berpuasa.',
      hadithSource: 'HR. Tirmidzi no. 747',
    };
  }

  // Regular day
  return {
    type: 'none',
    name: 'Bukan Hari Puasa Rutin',
    isFasting: false,
    isHaram: false,
    badgeColor: 'transparent',
    description: 'Hari biasa. Dianjurkan memperbanyak amal shaleh, tilawah Al-Qur’an, dan dzikir harian.',
  };
}

/**
 * Generate monthly grid items (Gregorian month with Hijri dates & fasting tags)
 */
export function getMonthCalendarDays(year: number, monthIndex: number): CalendarDayItem[] {
  const result: CalendarDayItem[] = [];

  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  // Day of week of 1st day (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const startDayOfWeek = firstDayOfMonth.getDay();
  const totalDaysInMonth = lastDayOfMonth.getDate();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // 1. Previous month trailing days
  const prevMonthLastDate = new Date(year, monthIndex, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDate - i;
    const dateObj = new Date(year, monthIndex - 1, dayNum);
    const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const hijri = getHijriDate(dateObj);
    const fasting = getFastingInfo(dateObj, hijri);
    const holiday = ISLAMIC_HOLIDAYS.find((h) => h.hijriMonth === hijri.month && h.hijriDay === hijri.day);

    result.push({
      date: dateObj,
      dateString: dateStr,
      dayNumber: dayNum,
      month: monthIndex - 1,
      year: dateObj.getFullYear(),
      dayOfWeek: dateObj.getDay(),
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      hijri,
      fasting,
      holiday,
    });
  }

  // 2. Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dateObj = new Date(year, monthIndex, d);
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hijri = getHijriDate(dateObj);
    const fasting = getFastingInfo(dateObj, hijri);
    const holiday = ISLAMIC_HOLIDAYS.find((h) => h.hijriMonth === hijri.month && h.hijriDay === hijri.day);

    result.push({
      date: dateObj,
      dateString: dateStr,
      dayNumber: d,
      month: monthIndex,
      year,
      dayOfWeek: dateObj.getDay(),
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      hijri,
      fasting,
      holiday,
    });
  }

  // 3. Next month leading days (to complete 35 or 42 cells)
  const remainingCells = (7 - (result.length % 7)) % 7;
  for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
    const dateObj = new Date(year, monthIndex + 1, nextDay);
    const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const hijri = getHijriDate(dateObj);
    const fasting = getFastingInfo(dateObj, hijri);
    const holiday = ISLAMIC_HOLIDAYS.find((h) => h.hijriMonth === hijri.month && h.hijriDay === hijri.day);

    result.push({
      date: dateObj,
      dateString: dateStr,
      dayNumber: nextDay,
      month: monthIndex + 1,
      year: dateObj.getFullYear(),
      dayOfWeek: dateObj.getDay(),
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      hijri,
      fasting,
      holiday,
    });
  }

  return result;
}

// ==========================================
// ZAKAT CALCULATORS (Maal, Profesi, Fitrah)
// ==========================================

export const DEFAULT_GOLD_PRICE = 1450000; // Rp 1.450.000 / gram emas
export const DEFAULT_RICE_PRICE = 15000; // Rp 15.000 / kg beras
export const DEFAULT_ZAKAT_FITRAH_PER_PERSON = 45000; // Rp 45.000 / jiwa

/**
 * Hitung Zakat Maal (Harta / Tabungan / Emas)
 * Nisab: 85 gram emas. Tarif: 2.5%.
 */
export function calculateZakatMaal(
  totalAssets: number,
  goldPricePerGram: number = DEFAULT_GOLD_PRICE
): ZakatMaalCalculation {
  const nisabValue = 85 * goldPricePerGram;
  const isObligated = totalAssets >= nisabValue;
  const zakatDue = isObligated ? Math.round(totalAssets * 0.025) : 0;
  const deficitToNisab = isObligated ? 0 : Math.max(0, nisabValue - totalAssets);

  return {
    totalAssets,
    goldPricePerGram,
    nisabValue,
    isObligated,
    zakatDue,
    deficitToNisab,
  };
}

/**
 * Hitung Zakat Penghasilan / Profesi
 * Nisab: Senilai 524 kg beras per bulan. Tarif: 2.5%.
 */
export function calculateZakatProfesi(
  monthlyIncome: number,
  basicExpense: number = 0,
  ricePricePerKg: number = DEFAULT_RICE_PRICE
): ZakatProfesiCalculation {
  const nisabValue = 524 * ricePricePerKg; // misal 524 * 15.000 = Rp 7.860.000
  const netIncome = Math.max(0, monthlyIncome - basicExpense);
  const isObligated = netIncome >= nisabValue;
  const zakatDue = isObligated ? Math.round(netIncome * 0.025) : 0;
  const deficitToNisab = isObligated ? 0 : Math.max(0, nisabValue - netIncome);

  return {
    monthlyIncome,
    basicExpense,
    ricePricePerKg,
    nisabValue,
    netIncome,
    isObligated,
    zakatDue,
    deficitToNisab,
  };
}

/**
 * Hitung Zakat Fitrah
 * Standar: 2.5 kg / 3.5 liter beras atau konversi rupiah per jiwa keluarga.
 */
export function calculateZakatFitrah(
  familyCount: number,
  nominalPerPerson: number = DEFAULT_ZAKAT_FITRAH_PER_PERSON,
  riceKgPerPerson: number = 2.5
): ZakatFitrahCalculation {
  const count = Math.max(1, familyCount);
  const totalRiceKg = count * riceKgPerPerson;
  const totalMoney = count * nominalPerPerson;

  return {
    familyCount: count,
    ricePricePerKg: Math.round(nominalPerPerson / riceKgPerPerson),
    totalRiceKg,
    totalMoney,
  };
}
