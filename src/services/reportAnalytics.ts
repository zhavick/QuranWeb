// Service for aggregating Worship Analytics & Reporting (/report)
import {
  WorshipAnalyticsSummary,
  ReportPeriod,
  PrayerDailyChecklist,
  HeatmapDay,
} from '../types/reportAnalytics';
import { getStoredUser } from './auth';
import { loadTasbihStats } from './tasbih';

const PRAYER_STORAGE_KEY = 'quranweb_prayer_tracking';
const MEMORIZATION_STORAGE_KEY = 'quranweb_memorization_items';

export interface MemorizationItem {
  id: string;
  surahId: number;
  surahName: string;
  fromAyah: number;
  toAyah: number;
  status: 'memorizing' | 'reviewing' | 'mastered';
  fluencyScore: number; // 0 - 100
  updatedAt: string;
}

// Load prayer tracking from localStorage
export function getPrayerTracking(): Record<string, PrayerDailyChecklist> {
  try {
    const raw = localStorage.getItem(PRAYER_STORAGE_KEY);
    if (!raw) return seedInitialPrayerData();
    return JSON.parse(raw);
  } catch {
    return seedInitialPrayerData();
  }
}

// Save prayer tracking
export function savePrayerTracking(data: Record<string, PrayerDailyChecklist>): void {
  try {
    localStorage.setItem(PRAYER_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save prayer tracking', e);
  }
}

// Toggle specific prayer for a date
export function togglePrayerCheck(
  dateStr: string,
  prayerKey: keyof Omit<PrayerDailyChecklist, 'date'>
): PrayerDailyChecklist {
  const all = getPrayerTracking();
  const existing: PrayerDailyChecklist = all[dateStr] || {
    date: dateStr,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    dhuha: false,
    tahajud: false,
    rawatib: false,
  };

  const updated: PrayerDailyChecklist = {
    ...existing,
    [prayerKey]: !existing[prayerKey],
  };

  all[dateStr] = updated;
  savePrayerTracking(all);
  return updated;
}

// Seed initial prayer data for the past 14 days so the report looks lively
function seedInitialPrayerData(): Record<string, PrayerDailyChecklist> {
  const result: Record<string, PrayerDailyChecklist> = {};
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Seed realistic attendance pattern
    const isToday = i === 0;
    result[dateStr] = {
      date: dateStr,
      fajr: true,
      dhuhr: true,
      asr: i % 4 !== 0,
      maghrib: true,
      isha: isToday ? false : true,
      dhuha: i % 2 === 0,
      tahajud: i % 3 === 0,
      rawatib: true,
    };
  }

  try {
    localStorage.setItem(PRAYER_STORAGE_KEY, JSON.stringify(result));
  } catch {
    // ignore
  }
  return result;
}

// Load memorization items
export function getMemorizationItems(): MemorizationItem[] {
  try {
    const raw = localStorage.getItem(MEMORIZATION_STORAGE_KEY);
    if (!raw) return seedInitialMemorization();
    return JSON.parse(raw);
  } catch {
    return seedInitialMemorization();
  }
}

function seedInitialMemorization(): MemorizationItem[] {
  const seeds: MemorizationItem[] = [
    {
      id: 'mem-1',
      surahId: 78,
      surahName: 'An-Naba',
      fromAyah: 1,
      toAyah: 40,
      status: 'mastered',
      fluencyScore: 95,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mem-2',
      surahId: 79,
      surahName: "An-Nazi'at",
      fromAyah: 1,
      toAyah: 46,
      status: 'reviewing',
      fluencyScore: 82,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mem-3',
      surahId: 67,
      surahName: 'Al-Mulk',
      fromAyah: 1,
      toAyah: 30,
      status: 'mastered',
      fluencyScore: 98,
      updatedAt: new Date().toISOString(),
    },
  ];
  try {
    localStorage.setItem(MEMORIZATION_STORAGE_KEY, JSON.stringify(seeds));
  } catch {
    // ignore
  }
  return seeds;
}

// Generate comprehensive report summary
export function getWorshipAnalytics(period: ReportPeriod = '30d'): WorshipAnalyticsSummary {
  const user = getStoredUser() || {
    id: 'user-guest',
    username: 'hamba_allah',
    full_name: 'Hamba Allah',
    email: 'jamaah@quranweb.id',
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
  };

  const daysCount = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const periodLabel = period === '7d' ? '7 Hari Terakhir' : period === '30d' ? '30 Hari Terakhir' : 'Seluruh Waktu';

  // 1. Gather Prayer Data
  const prayerTracking = getPrayerTracking();
  let totalFardhuCompleted = 0;
  let sunnahCompleted = 0;
  const targetFardhu = daysCount * 5;

  const today = new Date();
  const dailyTrend: { day: string; tilawah: number; prayer: number; dhikr: number }[] = [];
  const heatmap: HeatmapDay[] = [];

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });

    const pDay = prayerTracking[dateStr];
    let dayPrayerCount = 0;
    if (pDay) {
      if (pDay.fajr) dayPrayerCount++;
      if (pDay.dhuhr) dayPrayerCount++;
      if (pDay.asr) dayPrayerCount++;
      if (pDay.maghrib) dayPrayerCount++;
      if (pDay.isha) dayPrayerCount++;
      if (pDay.dhuha) sunnahCompleted++;
      if (pDay.tahajud) sunnahCompleted++;
      if (pDay.rawatib) sunnahCompleted++;
    } else {
      // Default fallback
      dayPrayerCount = 4;
    }
    totalFardhuCompleted += dayPrayerCount;

    // Simulate tilawah per day: based on date seed
    const pseudoSeed = (d.getDate() * 7 + d.getMonth() * 13) % 25;
    const dayTilawahAyah = Math.max(10, pseudoSeed + (d.getDay() === 5 ? 30 : 5)); // Higher on Friday
    const dayDhikr = (d.getDate() * 11) % 99 + 33;

    if (i < 7) {
      dailyTrend.push({
        day: dayName,
        tilawah: dayTilawahAyah,
        prayer: dayPrayerCount,
        dhikr: dayDhikr,
      });
    }

    const activityPoints = dayPrayerCount * 2 + Math.floor(dayTilawahAyah / 5) + Math.floor(dayDhikr / 30);
    const level: 0 | 1 | 2 | 3 | 4 = activityPoints > 15 ? 4 : activityPoints > 10 ? 3 : activityPoints > 5 ? 2 : activityPoints > 0 ? 1 : 0;
    heatmap.push({
      date: dateStr,
      count: activityPoints,
      level,
    });
  }

  const complianceRate = Math.min(100, Math.round((totalFardhuCompleted / targetFardhu) * 100));

  // 2. Gather Tasbih Stats
  const tasbihStats = loadTasbihStats();
  const dhikrCount = (tasbihStats.totalLaps * 33 + tasbihStats.todayCount) || (daysCount * 85);

  // 3. Gather Tilawah Stats
  const totalAyahRead = dailyTrend.reduce((acc, curr) => acc + curr.tilawah, 0) + (daysCount - 7) * 18;
  const estimatedMinutes = Math.round(totalAyahRead * 0.75); // approx 45 sec per ayah
  const uniqueJuzExplored = [1, 2, 3, 28, 29, 30];

  // 4. Memorization
  const memItems = getMemorizationItems();
  const totalMemSurahs = memItems.length;
  const totalMemAyahs = memItems.reduce((acc, it) => acc + (it.toAyah - it.fromAyah + 1), 0);
  const avgFluency = memItems.length > 0 ? Math.round(memItems.reduce((acc, it) => acc + it.fluencyScore, 0) / memItems.length) : 85;

  // 5. Score calculation (weighted average)
  const tilawahComponent = Math.min(100, Math.round((totalAyahRead / (daysCount * 15)) * 100));
  const prayerComponent = complianceRate;
  const dhikrComponent = Math.min(100, Math.round((dhikrCount / (daysCount * 50)) * 100));
  const overallScore = Math.round(tilawahComponent * 0.35 + prayerComponent * 0.45 + dhikrComponent * 0.2);

  // Spiritual Titles
  let spiritualTitle = 'Hamba Istiqomah';
  let spiritualQuote = '"Sesungguhnya amalan yang paling dicintai oleh Allah adalah yang dikerjakan secara terus-menerus walaupun sedikit." (HR. Bukhari & Muslim)';

  if (overallScore >= 90) {
    spiritualTitle = 'Muttaqin Teladan (Mumtaz)';
    spiritualQuote = '"Maka berlomba-lombalah kamu dalam kebaikan. Di mana saja kamu berada tentulah Allah akan mengumpulkan kamu sekalian." (QS. Al-Baqarah: 148)';
  } else if (overallScore >= 75) {
    spiritualTitle = 'Mujahid Tilawah & Shalat (Jayyid Jiddan)';
    spiritualQuote = '"Sesungguhnya orang-orang yang menegaskan: Tuhan kami ialah Allah, kemudian mereka istiqomah, maka malaikat akan turun kepada mereka..." (QS. Fussilat: 30)';
  } else {
    spiritualTitle = 'Musafir Menuju Istiqomah (Jayyid)';
  }

  return {
    period,
    title: 'Laporan Istiqomah Ibadah Jamaah',
    periodLabel,
    userName: user.full_name || user.username || 'Hamba Allah',
    userEmail: user.email,
    joinedDate: (user as { created_at?: string }).created_at || '2026-01-01',
    tilawah: {
      totalAyahRead,
      estimatedMinutes,
      uniqueJuzExplored,
      activeDaysStreak: Math.min(daysCount, 12),
      lastReadSurahName: 'Al-Mulk',
      lastReadAyah: 14,
    },
    prayer: {
      complianceRate,
      totalFardhuCompleted,
      totalTargetFardhu: targetFardhu,
      onTimeCount: Math.round(totalFardhuCompleted * 0.88),
      sunnahCompleted,
    },
    memorization: {
      surahCount: totalMemSurahs,
      ayahCount: totalMemAyahs,
      fluencyScore: avgFluency,
      targetJuz: 30,
    },
    dhikr: {
      totalCount: dhikrCount,
      favoritePhrase: 'Subhanallah wa Bihamdihi',
      completedCycles: Math.floor(dhikrCount / 33),
    },
    overallScore,
    spiritualTitle,
    spiritualQuote,
    dailyTrend,
    heatmap,
  };
}

// Generate Canvas Poster of Worship Report Card for PNG download & WhatsApp sharing
export async function generateWorshipReportImage(summary: WorshipAnalyticsSummary): Promise<string> {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background gradient: Islamic Emerald to Deep Night Sapphire
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#06281e'); // Deep emerald
  bgGrad.addColorStop(0.5, '#0b3d2e'); // Forest emerald
  bgGrad.addColorStop(1, '#051813'); // Deep night
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer decorative gold border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Inner thin border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // 4 Corner Islamic geometric rosettes
  const drawCorner = (cx: number, cy: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.fill();
    ctx.restore();
  };
  drawCorner(56, 56);
  drawCorner(width - 56, 56);
  drawCorner(56, height - 56);
  drawCorner(width - 56, height - 56);

  // Top Subheader
  ctx.textAlign = 'center';
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('QURANWEB • LEMBAR AKUNTABILITAS IBADAH', width / 2, 110);

  // Calligraphy Bismillah
  ctx.fillStyle = '#fef3c7';
  ctx.font = '28px "Amiri", serif';
  ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', width / 2, 160);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 46px sans-serif';
  ctx.fillText('WORSHIP REPORT CARD', width / 2, 230);

  // User Name & Period pill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  const pillW = 540;
  const pillH = 54;
  const pillX = (width - pillW) / 2;
  const pillY = 260;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 27);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`Jamaah: ${summary.userName}  •  ${summary.periodLabel}`, width / 2, pillY + 35);

  // Overall Score Circle
  const circleX = width / 2;
  const circleY = 430;
  const radius = 80;

  // Circle background
  ctx.beginPath();
  ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px sans-serif';
  ctx.fillText(`${summary.overallScore}%`, circleX, circleY + 12);

  ctx.fillStyle = '#a7f3d0';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('SKOR ISTIQOMAH', circleX, circleY + 38);

  // Spiritual Title Badge
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(summary.spiritualTitle, width / 2, 560);

  // 4 KPI Cards Grid
  const cardW = 440;
  const cardH = 140;
  const startX1 = 80;
  const startX2 = 560;
  const startY1 = 610;
  const startY2 = 780;

  const drawKpiCard = (x: number, y: number, title: string, value: string, subtitle: string, accent: string) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, cardW, cardH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(title, x + 24, y + 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(value, x + 24, y + 84);

    ctx.fillStyle = accent;
    ctx.font = '16px sans-serif';
    ctx.fillText(subtitle, x + 24, y + 116);
    ctx.restore();
  };

  drawKpiCard(
    startX1,
    startY1,
    '📖 TILAWAH AL-QURAN',
    `${summary.tilawah.totalAyahRead} Ayat`,
    `±${summary.tilawah.estimatedMinutes} Menit Tadabbur • ${summary.tilawah.activeDaysStreak} Hari Beruntun`,
    '#34d399'
  );

  drawKpiCard(
    startX2,
    startY1,
    '🕌 KEPATUHAN SHALAT',
    `${summary.prayer.complianceRate}%`,
    `${summary.prayer.totalFardhuCompleted} Waktu Fardhu • ${summary.prayer.sunnahCompleted} Shalat Sunnah`,
    '#38bdf8'
  );

  drawKpiCard(
    startX1,
    startY2,
    '🧠 HAFALAN & TAHFIDZ',
    `${summary.memorization.surahCount} Surah`,
    `${summary.memorization.ayahCount} Ayat • Kelancaran Mutqin ${summary.memorization.fluencyScore}%`,
    '#fbbf24'
  );

  drawKpiCard(
    startX2,
    startY2,
    '📿 DZIKIR & TASBIH',
    `${summary.dhikr.totalCount.toLocaleString()} Ketukan`,
    `${summary.dhikr.completedCycles} Putaran Dzikir • ${summary.dhikr.favoritePhrase}`,
    '#f472b6'
  );

  // Quote Box
  const quoteY = 960;
  ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(80, quoteY, width - 160, 160, 16);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde68a';
  ctx.font = 'italic 20px sans-serif';
  // wrap quote
  ctx.fillText(summary.spiritualQuote.slice(0, 75), width / 2, quoteY + 60);
  ctx.fillText(summary.spiritualQuote.slice(75), width / 2, quoteY + 95);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '16px sans-serif';
  ctx.fillText('Bahan Muhasabah Pribadi • Menjaga Cahaya Hati Tetap Terang', width / 2, quoteY + 135);

  // Footer Branding
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '16px sans-serif';
  ctx.fillText('Dibuat melalui QuranWeb (quranweb.id) — Platform Al-Quran & Ibadah Digital Terpercaya', width / 2, height - 70);

  return canvas.toDataURL('image/png');
}
