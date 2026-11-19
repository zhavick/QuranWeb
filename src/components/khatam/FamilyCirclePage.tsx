import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Users,
  Sparkles,
  Share2,
  Plus,
  CheckCircle2,
  Circle,
  KeyRound,
  Trash2,
  BookOpen,
  Copy,
  Check,
  Trophy,
  Sliders,
  X,
} from 'lucide-react';
import {
  FamilyCircle,
  CircleMember,
  KhatamTarget
} from '../../types/familyCircle';
import {
  getFamilyCircles,
  createFamilyCircle,
  joinFamilyCircle,
  assignJuzToMember,
  toggleCompleteJuz,
  deleteFamilyCircle,
  calculateCircleProgress,
  generateShareInvitationText
} from '../../services/familyCircle';
import { getStoredUser } from '../../services/auth';
import { logActivity } from '../../services/telemetry';

interface FamilyCirclePageProps {
  onBackToMushaf: () => void;
  elderMode?: boolean;
}

// 30 Juz metadata for friendly display
const JUZ_META = [
  { juz: 1, desc: 'Al-Fatihah 1 - Al-Baqarah 141' },
  { juz: 2, desc: 'Al-Baqarah 142 - Al-Baqarah 252' },
  { juz: 3, desc: 'Al-Baqarah 253 - Ali Imran 92' },
  { juz: 4, desc: 'Ali Imran 93 - An-Nisa 23' },
  { juz: 5, desc: 'An-Nisa 24 - An-Nisa 147' },
  { juz: 6, desc: 'An-Nisa 148 - Al-Maidah 81' },
  { juz: 7, desc: 'Al-Maidah 82 - Al-An\'am 110' },
  { juz: 8, desc: 'Al-An\'am 111 - Al-A\'raf 87' },
  { juz: 9, desc: 'Al-A\'raf 88 - Al-Anfal 40' },
  { juz: 10, desc: 'Al-Anfal 41 - At-Taubah 92' },
  { juz: 11, desc: 'At-Taubah 93 - Hud 5' },
  { juz: 12, desc: 'Hud 6 - Yusuf 52' },
  { juz: 13, desc: 'Yusuf 53 - Ibrahim 52' },
  { juz: 14, desc: 'Al-Hijr 1 - An-Nahl 128' },
  { juz: 15, desc: 'Al-Isra 1 - Al-Kahf 74' },
  { juz: 16, desc: 'Al-Kahf 75 - Ta-Ha 135' },
  { juz: 17, desc: 'Al-Anbiya 1 - Al-Hajj 78' },
  { juz: 18, desc: 'Al-Mu\'minun 1 - Al-Furqan 20' },
  { juz: 19, desc: 'Al-Furqan 21 - An-Naml 55' },
  { juz: 20, desc: 'An-Naml 56 - Al-Ankabut 45' },
  { juz: 21, desc: 'Al-Ankabut 46 - Al-Ahzab 30' },
  { juz: 22, desc: 'Al-Ahzab 31 - Ya-Sin 27' },
  { juz: 23, desc: 'Ya-Sin 28 - Az-Zumar 31' },
  { juz: 24, desc: 'Az-Zumar 32 - Fussilat 46' },
  { juz: 25, desc: 'Fussilat 47 - Al-Jathiyah 37' },
  { juz: 26, desc: 'Al-Ahqaf 1 - Az-Zariyat 30' },
  { juz: 27, desc: 'Az-Zariyat 31 - Al-Hadid 29' },
  { juz: 28, desc: 'Al-Mujadilah 1 - At-Tahrim 12' },
  { juz: 29, desc: 'Al-Mulk 1 - Al-Mursalat 50' },
  { juz: 30, desc: 'An-Naba 1 - An-Nas 6' },
];

export const FamilyCirclePage: React.FC<FamilyCirclePageProps> = ({
  onBackToMushaf,
  elderMode = false,
}) => {
  const [circles, setCircles] = useState<FamilyCircle[]>([]);
  const [selectedCircleId, setSelectedCircleId] = useState<string>('');
  const [currentUser] = useState(() => getStoredUser());

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [assignModalMember, setAssignModalMember] = useState<CircleMember | null>(null);

  // Form states
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleTarget, setNewCircleTarget] = useState<KhatamTarget>('monthly');
  const [newCreatorName, setNewCreatorName] = useState(currentUser?.full_name || 'Ayah / Ibu');
  const [newCircleNote, setNewCircleNote] = useState('');

  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinMemberName, setJoinMemberName] = useState(currentUser?.full_name || '');

  const [tempAssignedJuz, setTempAssignedJuz] = useState<number[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const list = getFamilyCircles();
    setCircles(list);
    if (list.length > 0) {
      setSelectedCircleId(list[0].id);
    }
    logActivity('VIEW_FAMILY_KHATAM_CIRCLE');

    // Auto-fill invite code if URL parameter present
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      setJoinCodeInput(codeParam.toUpperCase());
      setJoinModalOpen(true);
    }
  }, []);

  const activeCircle = useMemo(() => {
    return circles.find((c) => c.id === selectedCircleId) || circles[0] || null;
  }, [circles, selectedCircleId]);

  const progress = useMemo(() => {
    if (!activeCircle) {
      return {
        completedCount: 0,
        totalJuz: 30,
        percent: 0,
        isCompleted: false,
        assignedCount: 0,
        unassignedCount: 30,
      };
    }
    return calculateCircleProgress(activeCircle);
  }, [activeCircle]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName.trim()) {
      showToast('Mohon masukkan nama lingkaran keluarga.');
      return;
    }
    const created = createFamilyCircle({
      name: newCircleName,
      target: newCircleTarget,
      creatorName: newCreatorName,
      creatorUsername: currentUser?.username || 'user',
      note: newCircleNote,
    });
    setCircles(getFamilyCircles());
    setSelectedCircleId(created.id);
    setCreateModalOpen(false);
    setNewCircleName('');
    setNewCircleNote('');
    showToast(`Alhamdulillah! Lingkaran "${created.name}" berhasil dibentuk.`);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim() || !joinMemberName.trim()) {
      showToast('Mohon isi kode undangan dan nama Anda.');
      return;
    }
    const res = joinFamilyCircle(joinCodeInput, joinMemberName);
    showToast(res.message);
    if (res.success && res.circle) {
      setCircles(getFamilyCircles());
      setSelectedCircleId(res.circle.id);
      setJoinModalOpen(false);
      setJoinCodeInput('');
    }
  };

  const handleToggleJuz = (memberId: string, juzNumber: number) => {
    if (!activeCircle) return;
    const res = toggleCompleteJuz(activeCircle.id, memberId, juzNumber);
    if (res.circle) {
      setCircles(getFamilyCircles());
      if (res.justCompleted) {
        showToast(`🎉 Alhamdulillah! Juz ${juzNumber} telah selesai dibaca. Semoga berkah!`);
      } else {
        showToast(`Status Juz ${juzNumber} diperbarui menjadi sedang dibaca.`);
      }
    }
  };

  const handleOpenAssignModal = (member: CircleMember) => {
    setAssignModalMember(member);
    setTempAssignedJuz([...member.assignedJuz]);
  };

  const handleSaveAssignment = () => {
    if (!activeCircle || !assignModalMember) return;
    assignJuzToMember(activeCircle.id, assignModalMember.id, tempAssignedJuz);
    setCircles(getFamilyCircles());
    setAssignModalMember(null);
    showToast(`Tugas Juz untuk ${assignModalMember.name} berhasil diperbarui.`);
  };

  const handleCopyInviteCode = () => {
    if (!activeCircle) return;
    navigator.clipboard.writeText(activeCircle.inviteCode).then(() => {
      showToast(`Kode undangan ${activeCircle.inviteCode} disalin ke clipboard!`);
    });
  };

  const handleShareToWhatsApp = () => {
    if (!activeCircle) return;
    const text = generateShareInvitationText(activeCircle);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDeleteCircle = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus lingkaran "${name}"? Seluruh riwayat akan dihapus.`)) {
      deleteFamilyCircle(id);
      const updated = getFamilyCircles();
      setCircles(updated);
      if (updated.length > 0) {
        setSelectedCircleId(updated[0].id);
      }
      showToast(`Lingkaran "${name}" telah dihapus.`);
    }
  };

  // Find which member is assigned to which juz
  const juzAssignmentMap = useMemo(() => {
    const map = new Map<number, { member: CircleMember; isDone: boolean }>();
    if (!activeCircle) return map;

    activeCircle.members.forEach((m) => {
      m.assignedJuz.forEach((j) => {
        map.set(j, {
          member: m,
          isDone: m.completedJuz.includes(j),
        });
      });
    });
    return map;
  }, [activeCircle]);

  return (
    <div
      className={`min-h-screen pb-24 transition-colors ${elderMode ? 'text-base' : 'text-sm'}`}
      style={{
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Toast Feedback */}
      {toastMsg && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-5 py-3 text-xs sm:text-sm font-semibold shadow-2xl border animate-fade-in flex items-center gap-2.5 max-w-md text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Sticky Bar */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md px-4 py-3 sm:px-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToMushaf}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali ke Mushaf</span>
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
            <div>
              <h1 className="text-sm sm:text-base font-bold leading-tight flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Lingkaran Khatam Keluarga</span>
              </h1>
              <p className="text-[11px] opacity-70">Tilawah 30 Juz Gotong Royong Penuh Berkah</p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setJoinModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer shadow-xs"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              title="Gabung Lewat Kode Undangan"
            >
              <KeyRound className="h-3.5 w-3.5 text-sky-500" />
              <span className="hidden sm:inline">Gabung Kode</span>
            </button>

            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Buat Lingkaran Keluarga Baru"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Buat Grup Baru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Circle Selector Tabs (If multiple circles exist) */}
        {circles.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {circles.map((c) => {
              const isSelected = c.id === selectedCircleId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCircleId(c.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={{
                    backgroundColor: isSelected ? undefined : 'var(--bg-card)',
                    borderColor: isSelected ? undefined : 'var(--border-color)',
                    color: isSelected ? undefined : 'var(--text-secondary)',
                  }}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Hero Card: Family Circle Status & Visual Progress */}
        {activeCircle ? (
          <div
            className="rounded-3xl border p-6 sm:p-8 shadow-sm space-y-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Top Info Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: 'var(--border-color)' }}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {activeCircle.target === 'ramadhan'
                      ? 'Target Khatam Ramadhan'
                      : activeCircle.target === 'monthly'
                      ? 'Target Khatam Bulanan (30 Hari)'
                      : 'Target Rutin Santai Tanpa Batas'}
                  </span>
                  <span className="text-xs opacity-60">Kode: <strong className="font-mono">{activeCircle.inviteCode}</strong></span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {activeCircle.name}
                </h2>
                {activeCircle.note && (
                  <p className="text-xs sm:text-sm opacity-80 italic">
                    "{activeCircle.note}"
                  </p>
                )}
              </div>

              {/* Action Buttons: Copy code & WhatsApp Share */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyInviteCode}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                  }}
                  title="Salin Kode Undangan"
                >
                  <Copy className="h-3.5 w-3.5 text-sky-500" />
                  <span>Salin Kode</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareToWhatsApp}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  title="Ajak Keluarga lewat WhatsApp"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Ajak via WhatsApp</span>
                </button>

                {activeCircle.id !== 'circle-fam-demo-1' && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCircle(activeCircle.id, activeCircle.name)}
                    className="p-2 rounded-xl border text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                    style={{ borderColor: 'var(--border-color)' }}
                    title="Hapus Lingkaran Ini"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Middle: Big Visual Progress Indicator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Circular Gauge */}
              <div className="flex flex-col items-center justify-center p-4">
                <div className="relative flex items-center justify-center">
                  <svg className="w-44 h-44 transform -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="14"
                      fill="transparent"
                      className="text-black/10 dark:text-white/10"
                    />
                    <circle
                      cx="88"
                      cy="88"
                      r="70"
                      stroke="#10b981"
                      strokeWidth="14"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * progress.percent) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                      {progress.percent}%
                    </span>
                    <span className="text-xs font-semibold opacity-70">
                      {progress.completedCount} / 30 Juz
                    </span>
                  </div>
                </div>

                {progress.isCompleted ? (
                  <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <Trophy className="h-4 w-4" />
                    <span>Maa Syaa Allah! Khatam 30 Juz Sempurna!</span>
                  </div>
                ) : (
                  <p className="mt-3 text-xs opacity-70 text-center">
                    Tersisa <strong>{30 - progress.completedCount} Juz</strong> lagi menuju tuntas khatam.
                  </p>
                )}
              </div>

              {/* Stats Summary Cards */}
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                  <div className="text-xs opacity-70">Tuntas Dibaca</div>
                  <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                    {progress.completedCount} <span className="text-xs font-normal opacity-70">Juz</span>
                  </div>
                  <div className="text-[11px] opacity-60 mt-0.5">Alhamdulillah</div>
                </div>

                <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                  <div className="text-xs opacity-70">Sedang Dibaca</div>
                  <div className="text-2xl font-bold mt-1 text-sky-600 dark:text-sky-400">
                    {progress.assignedCount - progress.completedCount} <span className="text-xs font-normal opacity-70">Juz</span>
                  </div>
                  <div className="text-[11px] opacity-60 mt-0.5">Dalam Proses Tilawah</div>
                </div>

                <div className="p-4 rounded-2xl border col-span-2 sm:col-span-1" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                  <div className="text-xs opacity-70">Belum Ada Pembaca</div>
                  <div className="text-2xl font-bold mt-1 text-amber-500">
                    {progress.unassignedCount} <span className="text-xs font-normal opacity-70">Juz</span>
                  </div>
                  <div className="text-[11px] opacity-60 mt-0.5">Siap Diemban Anggota</div>
                </div>

                {/* Family Members Snapshot */}
                <div className="col-span-2 sm:col-span-3 p-4 rounded-2xl border flex items-center justify-between gap-4" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      {activeCircle.members.slice(0, 5).map((m) => (
                        <div
                          key={m.id}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-xs"
                          style={{ backgroundColor: m.avatarColor }}
                          title={m.name}
                        >
                          {m.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{activeCircle.members.length} Anggota Keluarga Tergabung</div>
                      <div className="text-[11px] opacity-70">Saling mengingatkan dan mendoakan dalam kebaikan.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('family-members-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer shrink-0"
                  >
                    Kelola Anggota ↓
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Section: Interactive 30-Juz Map Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>Peta Interaktif 30 Juz Khatam Keluarga</span>
              </h3>
              <p className="text-xs opacity-70">
                Klik kartu Juz untuk menandai selesai baca atau mengambil amanah Juz yang masih kosong.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {JUZ_META.map(({ juz, desc }) => {
              const assignment = juzAssignmentMap.get(juz);
              const isAssigned = Boolean(assignment);
              const isDone = assignment?.isDone || false;

              return (
                <div
                  key={juz}
                  onClick={() => {
                    if (isAssigned && assignment) {
                      handleToggleJuz(assignment.member.id, juz);
                    } else if (activeCircle && activeCircle.members.length > 0) {
                      // Claim for first member or show assignment
                      handleOpenAssignModal(activeCircle.members[0]);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md hover:scale-[1.02] ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-200'
                      : isAssigned
                      ? 'bg-sky-500/10 border-sky-500/30 text-sky-950 dark:text-sky-200'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isDone || isAssigned ? undefined : 'var(--bg-card)',
                    borderColor: isDone || isAssigned ? undefined : 'var(--border-color)',
                  }}
                  title={isAssigned ? `Klik untuk mengubah status tuntas Juz ${juz}` : `Klik untuk mengambil tugas Juz ${juz}`}
                >
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl text-xs font-extrabold"
                      style={{
                        backgroundColor: isDone ? '#10b981' : isAssigned ? '#0284c7' : 'rgba(150, 150, 150, 0.2)',
                        color: isDone || isAssigned ? '#ffffff' : 'var(--text-primary)',
                      }}
                    >
                      {juz}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : isAssigned ? (
                      <Circle className="h-5 w-5 text-sky-500 shrink-0 opacity-60" />
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        Kosong
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold leading-snug truncate">
                      {isAssigned ? assignment!.member.name : 'Belum Diambil'}
                    </div>
                    <div className="text-[10px] opacity-65 truncate mt-0.5" title={desc}>
                      {desc}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t text-[10px] font-semibold flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                    <span>{isDone ? 'Alhamdulillah Tuntas' : isAssigned ? 'Sedang Dibaca' : 'Ambil Juz Ini'}</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Family Members Management */}
        {activeCircle && (
          <section id="family-members-section" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Daftar Anggota Keluarga ({activeCircle.members.length})</span>
                </h3>
                <p className="text-xs opacity-70">
                  Atur pembagian Juz agar setiap anggota keluarga memiliki target tilawah yang jelas dan proporsional.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCircle.members.map((member) => {
                const assignedCount = member.assignedJuz.length;
                const completedCount = member.completedJuz.length;
                const memberPercent = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 0;

                return (
                  <div
                    key={member.id}
                    className="p-5 rounded-2xl border flex flex-col justify-between space-y-4 shadow-xs"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white font-bold text-sm shadow-sm"
                          style={{ backgroundColor: member.avatarColor }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-bold leading-tight">
                              {member.name}
                            </h4>
                            {member.role === 'leader' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                Inisiator
                              </span>
                            )}
                          </div>
                          <span className="text-xs opacity-70">
                            {assignedCount > 0
                              ? `${completedCount} dari ${assignedCount} Juz Selesai (${memberPercent}%)`
                              : 'Belum ada tugas Juz'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenAssignModal(member)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer shadow-xs shrink-0"
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border-color)',
                        }}
                      >
                        <Sliders className="h-3.5 w-3.5 text-sky-500" />
                        <span>Bagi Juz</span>
                      </button>
                    </div>

                    {/* Progress bar per member */}
                    <div className="space-y-1.5">
                      <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                          style={{ width: `${memberPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Assigned Juz badges */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-semibold opacity-70">Juz yang Diemban:</div>
                      {assignedCount === 0 ? (
                        <div className="text-xs opacity-50 italic">Belum memilih juz. Klik "Bagi Juz" untuk memilih.</div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {member.assignedJuz.map((j) => {
                            const isDone = member.completedJuz.includes(j);
                            return (
                              <button
                                key={j}
                                type="button"
                                onClick={() => handleToggleJuz(member.id, j)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isDone
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 opacity-80'
                                }`}
                                style={{
                                  backgroundColor: isDone ? undefined : 'var(--bg-surface)',
                                  borderColor: isDone ? undefined : 'var(--border-color)',
                                }}
                                title={isDone ? `Juz ${j} selesai (klik untuk batalkan)` : `Juz ${j} belum selesai (klik jika sudah tuntas)`}
                              >
                                {isDone ? <Check className="h-3 w-3" /> : <span>○</span>}
                                <span>Juz {j}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Modal 1: Buat Lingkaran Keluarga Baru */}
      {createModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)' }}
          onClick={() => setCreateModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Buat Lingkaran Khatam Baru</h3>
                  <p className="text-xs opacity-70">Ajak keluarga tilawah 30 juz gotong royong</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg border hover:opacity-80"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Nama Lingkaran / Grup Keluarga *
                </label>
                <input
                  type="text"
                  required
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  placeholder="Contoh: Keluarga Besar Bani Fulan / Keluarga Sakinah"
                  className="w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Nama Anda (Sebagai Inisiator / Kepala Grup) *
                </label>
                <input
                  type="text"
                  required
                  value={newCreatorName}
                  onChange={(e) => setNewCreatorName(e.target.value)}
                  placeholder="Contoh: Ayah / Ibu / Kakek"
                  className="w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Target Waktu Khatam
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'monthly', label: 'Bulanan', sub: '30 Hari' },
                    { id: 'ramadhan', label: 'Ramadhan', sub: 'Bulan Suci' },
                    { id: 'santai', label: 'Santai', sub: 'Tanpa Batas' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewCircleTarget(t.id as KhatamTarget)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center ${
                        newCircleTarget === t.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      style={{
                        borderColor: newCircleTarget === t.id ? undefined : 'var(--border-color)',
                      }}
                    >
                      <span>{t.label}</span>
                      <span className="text-[10px] opacity-75 font-normal">{t.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Pesan Semangat / Niat Keluarga (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={newCircleNote}
                  onChange={(e) => setNewCircleNote(e.target.value)}
                  placeholder="Semoga Allah merahmati rumah tangga kita dengan berkah Al-Qur'an..."
                  className="w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Bentuk Lingkaran Keluarga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Gabung Lewat Kode Undangan */}
      {joinModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)' }}
          onClick={() => setJoinModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Gabung Lingkaran Keluarga</h3>
                  <p className="text-xs opacity-70">Masukkan kode undangan dari keluarga Anda</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setJoinModalOpen(false)}
                className="p-1.5 rounded-lg border hover:opacity-80"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Kode Undangan Keluarga *
                </label>
                <input
                  type="text"
                  required
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="Contoh: QW-FAM-7892"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-mono font-bold uppercase tracking-wider outline-none shadow-xs text-center"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Nama Panggilan Anda di Keluarga *
                </label>
                <input
                  type="text"
                  required
                  value={joinMemberName}
                  onChange={(e) => setJoinMemberName(e.target.value)}
                  placeholder="Contoh: Kakak Hasan / Nenek / Paman"
                  className="w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setJoinModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Gabung Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Atur & Pilih Juz Anggota */}
      {assignModalMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)' }}
          onClick={() => setAssignModalMember(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-4 shrink-0" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <h3 className="text-base font-bold">
                  Bagi Penugasan Juz: {assignModalMember.name}
                </h3>
                <p className="text-xs opacity-70">
                  Pilih Juz 1 s.d. 30 yang ingin diemban oleh anggota ini ({tempAssignedJuz.length} Juz dipilih)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalMember(null)}
                className="p-1.5 rounded-lg border hover:opacity-80"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick batch selectors */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs shrink-0">
              <span className="opacity-70 text-[11px] font-semibold">Pilih Cepat:</span>
              <button
                type="button"
                onClick={() => setTempAssignedJuz([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])}
                className="px-2 py-0.5 rounded-lg border text-[11px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--border-color)' }}
              >
                Juz 1-10
              </button>
              <button
                type="button"
                onClick={() => setTempAssignedJuz([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])}
                className="px-2 py-0.5 rounded-lg border text-[11px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--border-color)' }}
              >
                Juz 11-20
              </button>
              <button
                type="button"
                onClick={() => setTempAssignedJuz([21, 22, 23, 24, 25, 26, 27, 28, 29, 30])}
                className="px-2 py-0.5 rounded-lg border text-[11px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--border-color)' }}
              >
                Juz 21-30
              </button>
              <button
                type="button"
                onClick={() => setTempAssignedJuz([28, 29, 30])}
                className="px-2 py-0.5 rounded-lg border text-[11px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 text-amber-500"
                style={{ borderColor: 'var(--border-color)' }}
              >
                Juz 'Amma (28-30)
              </button>
              <button
                type="button"
                onClick={() => setTempAssignedJuz([])}
                className="px-2 py-0.5 rounded-lg border text-[11px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 text-rose-500"
                style={{ borderColor: 'var(--border-color)' }}
              >
                Kosongkan
              </button>
            </div>

            {/* 30 Juz interactive selection pills */}
            <div className="flex-1 overflow-y-auto grid grid-cols-5 sm:grid-cols-6 gap-2 p-1">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => {
                const isSelected = tempAssignedJuz.includes(j);
                const currentHolder = activeCircle?.members.find((m) => m.assignedJuz.includes(j));
                const isHeldByOther = currentHolder && currentHolder.id !== assignModalMember.id;

                return (
                  <button
                    key={j}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setTempAssignedJuz(tempAssignedJuz.filter((x) => x !== j));
                      } else {
                        setTempAssignedJuz([...tempAssignedJuz, j].sort((a, b) => a - b));
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : isHeldByOther
                        ? 'opacity-50 border-dashed hover:opacity-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    style={{
                      backgroundColor: isSelected ? undefined : 'var(--bg-surface)',
                      borderColor: isSelected ? undefined : 'var(--border-color)',
                    }}
                    title={isHeldByOther ? `Saat ini dipegang oleh ${currentHolder?.name}` : `Juz ${j}`}
                  >
                    <span>Juz {j}</span>
                    {isHeldByOther && (
                      <span className="text-[9px] font-normal truncate max-w-full opacity-80">
                        {currentHolder?.name.split(' ')[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-xs opacity-70">
                {tempAssignedJuz.length} Juz akan ditugaskan
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalMember(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssignment}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Simpan Penugasan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
