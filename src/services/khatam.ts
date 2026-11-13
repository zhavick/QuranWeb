import type { KhatamPlan, KhatamRhythm, KhatamStats, RhythmOption } from '../types/khatam';
import type { QuranMeta, AinMeta } from '../types/quran';

const STORAGE_KEY_KHATAM_PLAN = 'quranweb_khatam_plan';
const TOTAL_AINS_DEFAULT = 556;

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getRhythmOptions(): RhythmOption[] {
  return [
    {
      id: 'sakinah',
      title: 'Ritme Sakinah',
      subtitle: '1 \'Ain Tiap Usai Shalat Fardhu',
      badge: 'Rekomendasi Lansia',
      description: 'Hanya butuh 3–4 menit seusai shalat fardhu (5 \'Ain per hari). Mata tidak lelah, hati senantiasa terikat dengan Al-Qur\'an.',
      ainsPerDay: 5,
      estimatedDays: 111,
      recommended: true,
    },
    {
      id: 'istiqamah',
      title: 'Ritme Istiqamah',
      subtitle: '2 \'Ain Tiap Usai Shalat Fardhu',
      badge: 'Pensiunan & Waktu Luang',
      description: 'Membaca 2 \'Ain setelah shalat (10 \'Ain per hari). Selesai khatam dalam waktu ±56 hari (~2 bulan).',
      ainsPerDay: 10,
      estimatedDays: 56,
      recommended: false,
    },
    {
      id: 'fokus',
      title: 'Ritme 30 Hari',
      subtitle: '1 Juz Per Hari (±19 \'Ain)',
      badge: 'Ramadhan & Target Cepat',
      description: 'Menuntaskan 1 Juz per hari (~18–20 \'Ain per hari) untuk momentum bulan suci Ramadhan atau penuntut ilmu.',
      ainsPerDay: 19,
      estimatedDays: 30,
      recommended: false,
    },
    {
      id: 'custom',
      title: 'Ritme Mandiri',
      subtitle: 'Tentukan Target Sesuai Kenyamanan',
      badge: 'Fleksibel',
      description: 'Atur jumlah target \'Ain harian bebas tanpa beban dan tanpa penalti.',
      ainsPerDay: 3,
      estimatedDays: 185,
      recommended: false,
    },
  ];
}

export function createInitialPlan(rhythm: KhatamRhythm = 'sakinah', targetPerDay?: number): KhatamPlan {
  const options = getRhythmOptions();
  const selected = options.find((o) => o.id === rhythm) || options[0];
  const ainsPerDay = targetPerDay || selected.ainsPerDay;
  const daysNeeded = Math.ceil(TOTAL_AINS_DEFAULT / ainsPerDay);

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + daysNeeded);

  return {
    id: `khatam_${Date.now()}`,
    rhythm,
    targetAinsPerDay: ainsPerDay,
    startDate: startDate.toISOString(),
    targetEndDate: endDate.toISOString(),
    currentAin: 1,
    completedAinIds: [],
    dailyLog: {},
    prayerRemindersEnabled: true,
    isCompleted: false,
  };
}

export function getKhatamPlan(): KhatamPlan {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_KHATAM_PLAN);
    if (!raw) {
      const initial = createInitialPlan('sakinah');
      saveKhatamPlan(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.completedAinIds) {
      const initial = createInitialPlan('sakinah');
      saveKhatamPlan(initial);
      return initial;
    }
    return parsed;
  } catch (err) {
    console.warn('Error reading khatam plan from localStorage:', err);
    return createInitialPlan('sakinah');
  }
}

export function saveKhatamPlan(plan: KhatamPlan): void {
  try {
    localStorage.setItem(STORAGE_KEY_KHATAM_PLAN, JSON.stringify(plan));
    // Trigger custom event so other components update re-actively
    window.dispatchEvent(new Event('quranweb_khatam_plan_changed'));
  } catch (err) {
    console.error('Error saving khatam plan to localStorage:', err);
  }
}

export function resetKhatamPlan(): KhatamPlan {
  const newPlan = createInitialPlan('sakinah');
  saveKhatamPlan(newPlan);
  return newPlan;
}

export function setPlanRhythm(rhythm: KhatamRhythm, customTarget?: number): KhatamPlan {
  const plan = getKhatamPlan();
  const options = getRhythmOptions();
  const opt = options.find((o) => o.id === rhythm) || options[0];
  const targetAins = customTarget || opt.ainsPerDay;

  const totalAins = TOTAL_AINS_DEFAULT;
  const remaining = Math.max(0, totalAins - plan.completedAinIds.length);
  const daysNeeded = Math.ceil(remaining / targetAins);

  const newEndDate = new Date();
  newEndDate.setDate(newEndDate.getDate() + daysNeeded);

  const updated: KhatamPlan = {
    ...plan,
    rhythm,
    targetAinsPerDay: targetAins,
    targetEndDate: newEndDate.toISOString(),
  };

  saveKhatamPlan(updated);
  return updated;
}

export function toggleAinCompleted(ainNumber: number): { plan: KhatamPlan; isNowCompleted: boolean } {
  const plan = getKhatamPlan();
  const todayKey = getTodayKey();
  const alreadyCompleted = plan.completedAinIds.includes(ainNumber);

  let updatedCompleted: number[];
  const todayList = plan.dailyLog[todayKey] ? [...plan.dailyLog[todayKey]] : [];

  if (alreadyCompleted) {
    // Unmark
    updatedCompleted = plan.completedAinIds.filter((id) => id !== ainNumber);
    const updatedToday = todayList.filter((id) => id !== ainNumber);
    plan.dailyLog[todayKey] = updatedToday;
  } else {
    // Mark completed
    updatedCompleted = [...plan.completedAinIds, ainNumber].sort((a, b) => a - b);
    if (!todayList.includes(ainNumber)) {
      todayList.push(ainNumber);
    }
    plan.dailyLog[todayKey] = todayList;
  }

  // Determine current active ain
  const totalAins = TOTAL_AINS_DEFAULT;
  let nextActiveAin = 1;
  for (let i = 1; i <= totalAins; i++) {
    if (!updatedCompleted.includes(i)) {
      nextActiveAin = i;
      break;
    }
  }

  const isAllCompleted = updatedCompleted.length >= totalAins;

  const updatedPlan: KhatamPlan = {
    ...plan,
    completedAinIds: updatedCompleted,
    currentAin: nextActiveAin,
    isCompleted: isAllCompleted,
    completedAt: isAllCompleted && !plan.isCompleted ? new Date().toISOString() : plan.completedAt,
  };

  saveKhatamPlan(updatedPlan);
  return { plan: updatedPlan, isNowCompleted: !alreadyCompleted };
}

export function calculateKhatamStats(plan: KhatamPlan, meta: QuranMeta | null): KhatamStats {
  const totalAins = meta?.ains.length || TOTAL_AINS_DEFAULT;
  const completedCount = plan.completedAinIds.length;
  const remainingCount = Math.max(0, totalAins - completedCount);
  const percent = Math.min(100, Math.round((completedCount / totalAins) * 1000) / 10);

  const startMs = new Date(plan.startDate).getTime();
  const nowMs = Date.now();
  const daysActive = Math.max(1, Math.ceil((nowMs - startMs) / (1000 * 60 * 60 * 24)));

  const todayKey = getTodayKey();
  const todayCompletedCount = (plan.dailyLog[todayKey] || []).length;
  const todayTargetCount = plan.targetAinsPerDay;

  const ainsPerDay = Math.max(1, plan.targetAinsPerDay);
  const estimatedDaysLeft = Math.ceil(remainingCount / ainsPerDay);

  const finishDate = new Date();
  finishDate.setDate(finishDate.getDate() + estimatedDaysLeft);
  const estimatedFinishDate = finishDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Details for current ain
  let currentAinMeta: AinMeta | null = null;
  let currentSurahName = 'Al-Fatihah';

  if (meta && meta.ains) {
    currentAinMeta = meta.ains.find((a) => a.ainNumber === plan.currentAin) || meta.ains[0] || null;
    if (currentAinMeta && meta.surahs) {
      const s = meta.surahs.find((surah) => surah.id === currentAinMeta?.surahId);
      if (s) currentSurahName = s.nameLatin;
    }
  }

  return {
    totalAins,
    completedCount,
    remainingCount,
    percent,
    daysActive,
    todayCompletedCount,
    todayTargetCount,
    estimatedDaysLeft,
    estimatedFinishDate,
    currentAinMeta,
    currentSurahName,
  };
}

export interface ScheduledAinItem {
  prayerName: string;
  prayerIcon: string;
  ainNumber: number;
  surahName: string;
  surahId: number;
  startAyah: number;
  endAyah: number;
  isCompleted: boolean;
}

export function getNextScheduledAins(
  plan: KhatamPlan,
  meta: QuranMeta | null,
  count: number = 5
): ScheduledAinItem[] {
  const prayers = [
    { name: 'Ba\'da Subuh', icon: '🌅' },
    { name: 'Ba\'da Dzuhur', icon: '☀️' },
    { name: 'Ba\'da Ashar', icon: '🌤️' },
    { name: 'Ba\'da Maghrib', icon: '🌇' },
    { name: 'Ba\'da Isya', icon: '🌙' },
  ];

  const result: ScheduledAinItem[] = [];
  let pointer = plan.currentAin;
  const total = meta?.ains.length || TOTAL_AINS_DEFAULT;

  for (let i = 0; i < count; i++) {
    const ainNum = pointer <= total ? pointer : pointer - total;
    const prayer = prayers[i % prayers.length];

    let surahName = 'Al-Qur\'an';
    let surahId = 1;
    let startAyah = 1;
    let endAyah = 7;

    if (meta && meta.ains) {
      const a = meta.ains.find((item) => item.ainNumber === ainNum);
      if (a) {
        surahId = a.surahId;
        startAyah = a.startAyah;
        endAyah = a.endAyah;
        const s = meta.surahs.find((surah) => surah.id === a.surahId);
        if (s) surahName = s.nameLatin;
      }
    }

    result.push({
      prayerName: prayer.name,
      prayerIcon: prayer.icon,
      ainNumber: ainNum,
      surahName,
      surahId,
      startAyah,
      endAyah,
      isCompleted: plan.completedAinIds.includes(ainNum),
    });

    pointer++;
  }

  return result;
}

