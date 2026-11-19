import { TasbihPhrase, TasbihStats } from '../types/tasbih';

export const TASBIH_PHRASES: TasbihPhrase[] = [
  {
    id: 'subhanallah',
    title: 'Subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    latin: 'Subhanallah',
    meaning: 'Maha Suci Allah',
    defaultTarget: 33,
    fadilah: 'Menghapus dosa-dosa dan menanam pohon kurma di surga.',
    dalil: 'HR. Muslim no. 597 & Tirmidzi no. 3464',
  },
  {
    id: 'alhamdulillah',
    title: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    latin: 'Alhamdulillah',
    meaning: 'Segala Puji bagi Allah',
    defaultTarget: 33,
    fadilah: 'Memenuhi timbangan amal kebaikan (mizan) di hari kiamat.',
    dalil: 'HR. Muslim no. 223',
  },
  {
    id: 'allahuakbar',
    title: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    latin: 'Allahu Akbar',
    meaning: 'Allah Maha Besar',
    defaultTarget: 33,
    fadilah: 'Mengagungkan kebesaran Allah di atas segala urusan dunia.',
    dalil: 'HR. Bukhari no. 3113 & Muslim no. 597',
  },
  {
    id: 'lailahaillallah',
    title: 'Tahlil',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    latin: 'Laa ilaaha illallah',
    meaning: 'Tiada Tuhan selain Allah',
    defaultTarget: 100,
    fadilah: 'Dzikir yang paling utama, kunci surga dan benteng keselamatan.',
    dalil: 'HR. Tirmidzi no. 3383 & Ahmad no. 8414',
  },
  {
    id: 'astaghfirullah',
    title: 'Istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    latin: 'Astaghfirullah',
    meaning: 'Aku memohon ampun kepada Allah',
    defaultTarget: 100,
    fadilah: 'Membuka pintu rezeki, mendatangkan jalan keluar dari setiap kesempitan.',
    dalil: 'HR. Abu Dawud no. 1518 & Ibnu Majah no. 3819',
  },
  {
    id: 'shalawat',
    title: 'Shalawat Nabi',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    latin: 'Allahumma shalli \'ala Muhammad',
    meaning: 'Ya Allah limpahkanlah shalawat atas Nabi Muhammad',
    defaultTarget: 100,
    fadilah: 'Siapa yang bershalawat satu kali, Allah akan bershalawat baginya sepuluh kali.',
    dalil: 'HR. Muslim no. 408',
  },
  {
    id: 'hauqalah',
    title: 'Hauqalah',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    latin: 'Laa hawla wa laa quwwata illa billaah',
    meaning: 'Tiada daya dan kekuatan kecuali dengan pertolongan Allah',
    defaultTarget: 33,
    fadilah: 'Salah satu harta simpanan surga (kanzun min kunuzil jannah).',
    dalil: 'HR. Bukhari no. 4205 & Muslim no. 2704',
  },
  {
    id: 'subhanallah_wabihamdihi',
    title: 'Tasbih & Tahmid',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    latin: 'Subhanallahi wa bihamdihi',
    meaning: 'Maha Suci Allah dan dengan memuji-Nya',
    defaultTarget: 100,
    fadilah: 'Dihapuskan kesalahan-kesalahannya meski sebanyak buih di lautan.',
    dalil: 'HR. Bukhari no. 6405 & Muslim no. 2691',
  },
];

const TASBIH_STATS_KEY = 'quranweb_tasbih_stats';

function getTodayStr(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function loadTasbihStats(): TasbihStats {
  const today = getTodayStr();
  try {
    const raw = localStorage.getItem(TASBIH_STATS_KEY);
    if (!raw) return { todayDate: today, todayCount: 0, totalLaps: 0 };
    const parsed: TasbihStats = JSON.parse(raw);
    if (parsed.todayDate !== today) {
      // Hari baru, reset count harian tapi pertahankan riwayat laps akumulatif
      return { todayDate: today, todayCount: 0, totalLaps: parsed.totalLaps || 0 };
    }
    return parsed;
  } catch {
    return { todayDate: today, todayCount: 0, totalLaps: 0 };
  }
}

export function incrementTasbihStats(countToAdd = 1, lapIncrement = 0): TasbihStats {
  const current = loadTasbihStats();
  const updated: TasbihStats = {
    todayDate: current.todayDate,
    todayCount: current.todayCount + countToAdd,
    totalLaps: current.totalLaps + lapIncrement,
  };
  try {
    localStorage.setItem(TASBIH_STATS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save tasbih stats', err);
  }
  return updated;
}
