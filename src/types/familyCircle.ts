export type KhatamTarget = 'ramadhan' | 'monthly' | 'santai';

export interface CircleMember {
  id: string;
  name: string;
  role: 'leader' | 'member';
  assignedJuz: number[]; // Array of juz numbers 1..30
  completedJuz: number[]; // Array of completed juz numbers 1..30
  avatarColor: string;
}

export interface FamilyCircle {
  id: string;
  name: string;
  inviteCode: string;
  creatorUsername: string;
  target: KhatamTarget;
  members: CircleMember[];
  createdAt: string;
  note?: string;
}

export interface CircleProgressSummary {
  completedCount: number;
  totalJuz: number;
  percent: number;
  isCompleted: boolean;
  assignedCount: number;
  unassignedCount: number;
}
