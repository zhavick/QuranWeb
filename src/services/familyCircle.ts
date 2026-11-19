import { FamilyCircle, CircleMember, KhatamTarget, CircleProgressSummary } from '../types/familyCircle';

const STORAGE_KEY = 'quranweb_family_circles';

const AVATAR_COLORS = [
  '#10b981', // emerald
  '#0284c7', // sky
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1', // indigo
];

function getRandomColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'QW-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Initial default seed circle for instant preview
const DEFAULT_CIRCLES: FamilyCircle[] = [
  {
    id: 'circle-fam-demo-1',
    name: 'Keluarga Sakinah Bani Ibrahim',
    inviteCode: 'QW-FAM-7892',
    creatorUsername: 'fulan',
    target: 'monthly',
    note: 'Khatam 30 Juz bersama keluarga besar untuk tabungan amal jariyah & mempererat tali silaturahmi.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    members: [
      {
        id: 'mem-1',
        name: 'Ayah (Fulan)',
        role: 'leader',
        assignedJuz: [1, 2, 3, 4, 5, 6],
        completedJuz: [1, 2, 3, 4],
        avatarColor: '#10b981',
      },
      {
        id: 'mem-2',
        name: 'Ibu Fatimah',
        role: 'member',
        assignedJuz: [7, 8, 9, 10, 11, 12],
        completedJuz: [7, 8, 9],
        avatarColor: '#ec4899',
      },
      {
        id: 'mem-3',
        name: 'Kakek Mansyur',
        role: 'member',
        assignedJuz: [28, 29, 30],
        completedJuz: [29, 30],
        avatarColor: '#f59e0b',
      },
      {
        id: 'mem-4',
        name: 'Kakak Hasan',
        role: 'member',
        assignedJuz: [13, 14, 15, 16, 17, 18],
        completedJuz: [13, 14],
        avatarColor: '#0284c7',
      },
      {
        id: 'mem-5',
        name: 'Adik Aisyah',
        role: 'member',
        assignedJuz: [19, 20, 21, 22, 23, 24, 25, 26, 27],
        completedJuz: [19, 20],
        avatarColor: '#8b5cf6',
      },
    ],
  },
];

export function getFamilyCircles(): FamilyCircle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CIRCLES));
      return DEFAULT_CIRCLES;
    }
    const parsed: FamilyCircle[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_CIRCLES;
  } catch (e) {
    console.error('Error reading family circles:', e);
    return DEFAULT_CIRCLES;
  }
}

export function saveFamilyCircles(circles: FamilyCircle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(circles));
    window.dispatchEvent(new CustomEvent('quranweb_family_circles_changed'));
  } catch (e) {
    console.error('Error saving family circles:', e);
  }
}

export function getFamilyCircleById(id: string): FamilyCircle | null {
  const circles = getFamilyCircles();
  return circles.find((c) => c.id === id) || null;
}

export function getFamilyCircleByCode(code: string): FamilyCircle | null {
  const clean = code.trim().toUpperCase();
  const circles = getFamilyCircles();
  return circles.find((c) => c.inviteCode.toUpperCase() === clean) || null;
}

export function createFamilyCircle(data: {
  name: string;
  target: KhatamTarget;
  creatorName: string;
  creatorUsername: string;
  note?: string;
}): FamilyCircle {
  const circles = getFamilyCircles();
  const newCircle: FamilyCircle = {
    id: `circle-${Date.now()}`,
    name: data.name.trim(),
    inviteCode: generateInviteCode(),
    creatorUsername: data.creatorUsername,
    target: data.target,
    note: data.note?.trim(),
    createdAt: new Date().toISOString(),
    members: [
      {
        id: `mem-${Date.now()}-1`,
        name: data.creatorName.trim() || 'Inisiator Keluarga',
        role: 'leader',
        assignedJuz: [],
        completedJuz: [],
        avatarColor: '#10b981',
      },
    ],
  };

  const updated = [newCircle, ...circles];
  saveFamilyCircles(updated);
  return newCircle;
}

export function joinFamilyCircle(
  inviteCode: string,
  memberName: string
): { circle: FamilyCircle | null; message: string; success: boolean } {
  const cleanCode = inviteCode.trim().toUpperCase();
  const circles = getFamilyCircles();
  const circleIndex = circles.findIndex((c) => c.inviteCode.toUpperCase() === cleanCode);

  if (circleIndex === -1) {
    return {
      circle: null,
      message: 'Kode undangan tidak ditemukan. Periksa kembali kode keluarga Anda.',
      success: false,
    };
  }

  const circle = { ...circles[circleIndex] };
  const existingMember = circle.members.find(
    (m) => m.name.toLowerCase() === memberName.trim().toLowerCase()
  );

  if (existingMember) {
    return {
      circle,
      message: `Selamat datang kembali, ${memberName}! Anda telah terdaftar di grup ini.`,
      success: true,
    };
  }

  const newMember: CircleMember = {
    id: `mem-${Date.now()}`,
    name: memberName.trim(),
    role: 'member',
    assignedJuz: [],
    completedJuz: [],
    avatarColor: getRandomColor(),
  };

  circle.members = [...circle.members, newMember];
  circles[circleIndex] = circle;
  saveFamilyCircles(circles);

  return {
    circle,
    message: `Alhamdulillah! Berhasil bergabung ke lingkaran "${circle.name}".`,
    success: true,
  };
}

export function assignJuzToMember(
  circleId: string,
  memberId: string,
  juzNumbers: number[]
): FamilyCircle | null {
  const circles = getFamilyCircles();
  const circleIndex = circles.findIndex((c) => c.id === circleId);
  if (circleIndex === -1) return null;

  const circle = { ...circles[circleIndex] };
  circle.members = circle.members.map((m) => {
    if (m.id === memberId) {
      // Remove any completed juz that are no longer assigned
      const validCompleted = m.completedJuz.filter((j) => juzNumbers.includes(j));
      return {
        ...m,
        assignedJuz: juzNumbers.sort((a, b) => a - b),
        completedJuz: validCompleted,
      };
    }
    // Remove these assigned juz from other members to prevent double-assignment
    const filteredAssigned = m.assignedJuz.filter((j) => !juzNumbers.includes(j));
    const filteredCompleted = m.completedJuz.filter((j) => filteredAssigned.includes(j));
    return {
      ...m,
      assignedJuz: filteredAssigned,
      completedJuz: filteredCompleted,
    };
  });

  circles[circleIndex] = circle;
  saveFamilyCircles(circles);
  return circle;
}

export function toggleCompleteJuz(
  circleId: string,
  memberId: string,
  juzNumber: number
): { circle: FamilyCircle | null; justCompleted: boolean } {
  const circles = getFamilyCircles();
  const circleIndex = circles.findIndex((c) => c.id === circleId);
  if (circleIndex === -1) return { circle: null, justCompleted: false };

  const circle = { ...circles[circleIndex] };
  let justCompleted = false;

  circle.members = circle.members.map((m) => {
    if (m.id === memberId) {
      const isAlreadyDone = m.completedJuz.includes(juzNumber);
      if (isAlreadyDone) {
        return {
          ...m,
          completedJuz: m.completedJuz.filter((j) => j !== juzNumber),
        };
      } else {
        justCompleted = true;
        return {
          ...m,
          completedJuz: [...m.completedJuz, juzNumber].sort((a, b) => a - b),
        };
      }
    }
    return m;
  });

  circles[circleIndex] = circle;
  saveFamilyCircles(circles);
  return { circle, justCompleted };
}

export function deleteFamilyCircle(circleId: string): boolean {
  const circles = getFamilyCircles();
  const filtered = circles.filter((c) => c.id !== circleId);
  if (filtered.length === circles.length) return false;
  saveFamilyCircles(filtered);
  return true;
}

export function calculateCircleProgress(circle: FamilyCircle): CircleProgressSummary {
  const completedSet = new Set<number>();
  const assignedSet = new Set<number>();

  circle.members.forEach((m) => {
    m.assignedJuz.forEach((j) => assignedSet.add(j));
    m.completedJuz.forEach((j) => completedSet.add(j));
  });

  const completedCount = completedSet.size;
  const totalJuz = 30;
  const percent = Math.round((completedCount / totalJuz) * 100);
  const isCompleted = completedCount === totalJuz;

  return {
    completedCount,
    totalJuz,
    percent,
    isCompleted,
    assignedCount: assignedSet.size,
    unassignedCount: totalJuz - assignedSet.size,
  };
}

export function generateShareInvitationText(circle: FamilyCircle): string {
  const progress = calculateCircleProgress(circle);
  return `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nMari bersama-sama meraih berkah khatam Al-Qur'an 30 Juz di *${circle.name}* melalui QuranWeb.\n\n📊 Progres Bersama Saat Ini: ${progress.completedCount}/30 Juz (${progress.percent}%)\n🔑 Kode Undangan: *${circle.inviteCode}*\n\nBuka QuranWeb dan gabung ke lingkaran tilawah keluarga kita:\n${window.location.origin}/khatam-keluarga?code=${circle.inviteCode}\n\nSemoga setiap huruf yang kita baca menjadi syafaat dan tabungan amal jariyah bagi keluarga kita di yaumil akhir. Aamiin ya Rabbal 'Alamin.`;
}
