import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Compass,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Calendar,
  Sparkles,
  RotateCcw,
  Sliders,
  ListFilter,
  Check,
  Search,
  Bell,
  Heart,
} from 'lucide-react';
import type { QuranMeta } from '../../types/quran';
import type { KhatamPlan, KhatamRhythm } from '../../types/khatam';
import {
  getKhatamPlan,
  saveKhatamPlan,
  resetKhatamPlan,
  setPlanRhythm,
  toggleAinCompleted,
  calculateKhatamStats,
  getRhythmOptions,
  getNextScheduledAins,
} from '../../services/khatam';
import { SakinahRing } from './SakinahRing';
import { logActivity } from '../../services/telemetry';

interface KhatamPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: QuranMeta | null;
  onNavigateToAin: (ainNumber: number) => void;
  elderMode?: boolean;
}

export const KhatamPlannerModal: React.FC<KhatamPlannerModalProps> = ({
  isOpen,
  onClose,
  meta,
  onNavigateToAin,
  elderMode = false,
}) => {
  const [plan, setPlan] = useState<KhatamPlan>(getKhatamPlan());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rhythm' | 'list'>('dashboard');
  const [customInput, setCustomInput] = useState<number>(plan.targetAinsPerDay);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [listFilter, setListFilter] = useState<'all' | 'completed' | 'remaining'>('all');
  const [searchSurah, setSearchSurah] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    const handlePlanChange = () => {
      setPlan(getKhatamPlan());
    };
    window.addEventListener('quranweb_khatam_plan_changed', handlePlanChange);
    return () => {
      window.removeEventListener('quranweb_khatam_plan_changed', handlePlanChange);
    };
  }, []);

  const stats = useMemo(() => calculateKhatamStats(plan, meta), [plan, meta]);
  const rhythmOptions = useMemo(() => getRhythmOptions(), []);
  const scheduledAins = useMemo(() => getNextScheduledAins(plan, meta, 5), [plan, meta]);

  const surahNameMap = useMemo(() => {
    const map = new Map<number, string>();
    meta?.surahs.forEach((s) => map.set(s.id, s.nameLatin));
    return map;
  }, [meta]);

  const handleToggleAin = (ainNum: number) => {
    const { isNowCompleted } = toggleAinCompleted(ainNum);
    setPlan(getKhatamPlan());
    logActivity('TOGGLE_KHATAM_AIN', { ainNumber: ainNum, completed: isNowCompleted });
    showToast(isNowCompleted ? `'Ain ke-${ainNum} ditandai selesai! Alhamdulillah.` : `'Ain ke-${ainNum} dibatalkan.`);
  };

  const handleChangeRhythm = (rhythm: KhatamRhythm, customTarget?: number) => {
    const updated = setPlanRhythm(rhythm, customTarget);
    setPlan(updated);
    logActivity('CHANGE_KHATAM_RHYTHM', { rhythm, targetPerDay: updated.targetAinsPerDay });
    showToast(`Ritme tilawah berhasil diubah.`);
  };

  const handleConfirmReset = () => {
    const newPlan = resetKhatamPlan();
    setPlan(newPlan);
    setResetModalOpen(false);
    logActivity('RESET_KHATAM_PLAN');
    showToast('Rencana khatam berhasil diatur ulang.');
  };

  // Filtered ains for Tab 3
  const filteredAinList = useMemo(() => {
    if (!meta || !meta.ains) return [];
    return meta.ains.filter((a) => {
      const isCompleted = plan.completedAinIds.includes(a.ainNumber);
      if (listFilter === 'completed' && !isCompleted) return false;
      if (listFilter === 'remaining' && isCompleted) return false;
      if (searchSurah.trim()) {
        const sName = surahNameMap.get(a.surahId)?.toLowerCase() || '';
        const q = searchSurah.toLowerCase().trim();
        const matchesName = sName.includes(q);
        const matchesAin = String(a.ainNumber).includes(q);
        if (!matchesName && !matchesAin) return false;
      }
      return true;
    });
  }, [meta, plan.completedAinIds, listFilter, searchSurah, surahNameMap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden animate-scale-up"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4 shrink-0"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-sm"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Rencana Khatam Sakinah
                </h2>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase"
                  style={{
                    backgroundColor: 'var(--bg-accent-soft)',
                    color: 'var(--text-accent)',
                  }}
                >
                  Berbasis &apos;Ain (Ruku&apos;)
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Metode tilawah bertahap ramah lansia, menyejukkan hati tanpa kelelahan mata
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela"
            className="flex h-10 w-10 items-center justify-center rounded-xl border transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation Switcher */}
        <div
          className="flex items-center gap-1 border-b px-4 py-2 shrink-0 overflow-x-auto"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          {[
            { id: 'dashboard', label: 'Progres & Hari Ini', icon: BookOpen },
            { id: 'rhythm', label: 'Atur Ritme Tilawah', icon: Sliders },
            { id: 'list', label: 'Daftar 556 \'Ain', icon: ListFilter },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  active ? 'shadow-xs' : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: active ? 'var(--bg-accent)' : 'transparent',
                  color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ==================================================== */}
          {/* TAB 1: PROGRES & TILAWAH HARI INI */}
          {/* ==================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Ring & Stats Overview Card */}
              <div
                className="rounded-3xl border p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center gap-6"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {/* Visual Sakinah Progress Ring */}
                <div className="shrink-0">
                  <SakinahRing
                    percent={stats.percent}
                    currentAin={plan.currentAin}
                    totalAins={stats.totalAins}
                    surahName={stats.currentSurahName}
                    size={elderMode ? 240 : 210}
                  />
                </div>

                {/* Plan Highlights */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {rhythmOptions.find((r) => r.id === plan.rhythm)?.title || 'Ritme Sakinah'}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>•</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Target: {plan.targetAinsPerDay} &apos;Ain/hari
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                      Tuntas {stats.completedCount} dari {stats.totalAins} &apos;Ain Al-Qur&apos;an
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Tersisa <strong style={{ color: 'var(--text-accent)' }}>{stats.remainingCount} &apos;Ain</strong> lagi. Dengan ritme saat ini, insya Allah khatam pada{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>{stats.estimatedFinishDate}</strong> (±{stats.estimatedDaysLeft} hari).
                    </p>
                  </div>

                  {/* Gentle Elder Reminder Note */}
                  <div
                    className="rounded-2xl border p-3 text-xs leading-relaxed italic flex items-start gap-2.5 text-left"
                    style={{
                      backgroundColor: 'var(--bg-accent-soft)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <Heart className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>
                      &ldquo;Tilawah tidak perlu terburu-buru mengejar angka. Membaca satu &apos;Ain dengan menghayati artinya jauh lebih menenteramkan jiwa.&rdquo;
                    </span>
                  </div>

                  {/* Daily Target Progress Counter */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                    <div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Hari Ini Selesai</div>
                      <div className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                        {stats.todayCompletedCount} / {stats.todayTargetCount} &apos;Ain
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Hari Berjalan</div>
                      <div className="text-base font-bold mt-0.5" style={{ color: 'var(--text-accent)' }}>
                        {stats.daysActive} Hari
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Status Khatam</div>
                      <div className="text-base font-bold mt-0.5 text-emerald-600 dark:text-emerald-400">
                        {plan.isCompleted ? 'Alhamdulillah Khatam!' : 'Sedang Berjalan'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIVE 'AIN CARD (Target Bacaan Sekarang) */}
              <div
                className="rounded-3xl border p-5 shadow-xs space-y-4"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-xs">
                      ع{plan.currentAin}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      Target Bacaan Saat Ini: &apos;Ain ke-{plan.currentAin}
                    </h4>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {stats.currentAinMeta ? `Juz ${stats.currentAinMeta.juzNumber}` : 'Al-Qur\'an'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      Surat {stats.currentSurahName}
                    </div>
                    {stats.currentAinMeta && (
                      <div className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Ayat {stats.currentAinMeta.startAyah} s.d. {stats.currentAinMeta.endAyah} • (&apos;Ain ke-{stats.currentAinMeta.surahAinIndex} dalam surat ini)
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToAin(plan.currentAin);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-accent)',
                        color: 'var(--text-on-accent)',
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Buka &apos;Ain Ini di Mushaf</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleAin(plan.currentAin)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                        plan.completedAinIds.includes(plan.currentAin)
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'hover:opacity-90'
                      }`}
                      style={{
                        backgroundColor: plan.completedAinIds.includes(plan.currentAin) ? undefined : 'var(--bg-muted)',
                        borderColor: plan.completedAinIds.includes(plan.currentAin) ? undefined : 'var(--border-color)',
                        color: plan.completedAinIds.includes(plan.currentAin) ? undefined : 'var(--text-primary)',
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        {plan.completedAinIds.includes(plan.currentAin) ? 'Sudah Selesai' : 'Tandai Selesai'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* JADWAL TILAWAH BA'DA SHALAT FARDHU */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" style={{ color: 'var(--text-accent)' }} />
                    <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      Rencana &apos;Ain Usai Shalat Fardhu Hari Ini
                    </h4>
                  </div>
                  <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    Ritme 5 Waktu Shalat
                  </span>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
                  {scheduledAins.map((item, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-3 flex flex-col justify-between transition-all ${
                        item.isCompleted ? 'opacity-70 bg-emerald-500/5 border-emerald-500/30' : ''
                      }`}
                      style={{
                        backgroundColor: item.isCompleted ? undefined : 'var(--bg-card)',
                        borderColor: item.isCompleted ? undefined : 'var(--border-color)',
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold truncate" style={{ color: 'var(--text-accent)' }}>
                            {item.prayerIcon} {item.prayerName}
                          </span>
                          <span className="text-[10px] font-bold rounded-md px-1.5 py-0.5 bg-black/10 dark:bg-white/10">
                            ع{item.ainNumber}
                          </span>
                        </div>

                        <div className="text-xs font-bold truncate mt-1" style={{ color: 'var(--text-primary)' }}>
                          Surat {item.surahName}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                          Ayat {item.startAyah}–{item.endAyah}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t pt-2" style={{ borderColor: 'var(--border-color)' }}>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigateToAin(item.ainNumber);
                          }}
                          className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Baca ➔
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleAin(item.ainNumber)}
                          className={`rounded-lg p-1 transition-colors cursor-pointer ${
                            item.isCompleted ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-400 hover:text-emerald-500'
                          }`}
                          title={item.isCompleted ? 'Batalkan tanda selesai' : 'Tandai selesai dibaca'}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: ATUR RITME TILAWAH */}
          {/* ==================================================== */}
          {activeTab === 'rhythm' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Pilih Ritme Tilawah yang Menenangkan
                </h3>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Pilih ritme membaca yang paling sesuai dengan kondisi kesehatan mata dan kelonggaran waktu ibadah harian Anda. Anda dapat mengubahnya kapan saja tanpa kehilangan progres.
                </p>
              </div>

              {/* Rhythm Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {rhythmOptions.map((opt) => {
                  const isSelected = plan.rhythm === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleChangeRhythm(opt.id, opt.id === 'custom' ? customInput : undefined)}
                      className={`relative rounded-3xl border p-5 flex flex-col justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                          : 'hover:shadow-sm hover:border-zinc-400'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--bg-accent-soft)' : 'var(--bg-card)',
                        borderColor: isSelected ? 'var(--bg-accent)' : 'var(--border-color)',
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase"
                            style={{
                              backgroundColor: opt.recommended ? '#10b981' : 'var(--bg-muted)',
                              color: opt.recommended ? '#ffffff' : 'var(--text-secondary)',
                            }}
                          >
                            {opt.badge}
                          </span>

                          <span className="text-xs font-bold" style={{ color: 'var(--text-accent)' }}>
                            {opt.ainsPerDay} &apos;Ain/hari
                          </span>
                        </div>

                        <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                          {opt.title}
                        </h4>
                        <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {opt.subtitle}
                        </div>

                        <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {opt.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                          Estimasi: ±{opt.estimatedDays} Hari
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1 ${
                            isSelected ? 'bg-emerald-500 text-white' : 'border'
                          }`}
                          style={{
                            borderColor: isSelected ? 'transparent' : 'var(--border-color)',
                            color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                          }}
                        >
                          {isSelected ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            'Pilih'
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Ain Input if Custom is Selected */}
              {plan.rhythm === 'custom' && (
                <div
                  className="rounded-2xl border p-4 shadow-xs space-y-2"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <label className="block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    Tentukan Jumlah Target &apos;Ain Harian Sendiri:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={customInput}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCustomInput(val);
                        handleChangeRhythm('custom', val);
                      }}
                      className="flex-1 accent-emerald-500"
                    />
                    <span className="font-bold text-sm w-16 text-right" style={{ color: 'var(--text-accent)' }}>
                      {customInput} &apos;Ain
                    </span>
                  </div>
                </div>
              )}

              {/* Prayer Reminder Option */}
              <div
                className="rounded-2xl border p-4 flex items-center justify-between gap-4"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      Pengingat Santun Shalat Fardhu
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Tampilkan sapaan lembut pada jadwal shalat untuk membaca 1 &apos;Ain penyejuk hati
                    </div>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={plan.prayerRemindersEnabled}
                  onChange={(e) => {
                    const updated = { ...plan, prayerRemindersEnabled: e.target.checked };
                    saveKhatamPlan(updated);
                    setPlan(updated);
                    showToast(e.target.checked ? 'Pengingat santun diaktifkan' : 'Pengingat santun dinonaktifkan');
                  }}
                  className="h-5 w-5 rounded-md accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Danger Zone: Reset Plan */}
              <div className="border-t pt-4 flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <div className="text-xs font-bold text-red-500">Mulai Ulang Rencana Khatam</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    Kembalikan progres membaca ke awal &apos;Ain ke-1
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Atur Ulang Rencana</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: DAFTAR 556 'AIN */}
          {/* ==================================================== */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    value={searchSurah}
                    onChange={(e) => setSearchSurah(e.target.value)}
                    placeholder="Cari nomor 'Ain atau nama surat..."
                    className="w-full rounded-xl border pl-9 pr-3 py-2 text-xs outline-none"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'all', label: 'Semua (556)' },
                    { id: 'completed', label: `Selesai (${plan.completedAinIds.length})` },
                    { id: 'remaining', label: `Belum (${stats.remainingCount})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setListFilter(f.id as typeof listFilter)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                        listFilter === f.id ? 'shadow-xs' : ''
                      }`}
                      style={{
                        backgroundColor: listFilter === f.id ? 'var(--bg-accent)' : 'var(--bg-muted)',
                        color: listFilter === f.id ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of 556 'Ains */}
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-[50vh] overflow-y-auto pr-1">
                {filteredAinList.map((a) => {
                  const isDone = plan.completedAinIds.includes(a.ainNumber);
                  const isCurrent = plan.currentAin === a.ainNumber;
                  const sName = surahNameMap.get(a.surahId) || `Surat ${a.surahId}`;

                  return (
                    <div
                      key={a.ainNumber}
                      className={`rounded-2xl border p-3 flex items-center justify-between gap-2 transition-all ${
                        isCurrent
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : isDone
                          ? 'opacity-80 bg-emerald-500/5'
                          : ''
                      }`}
                      style={{
                        backgroundColor: isCurrent || isDone ? undefined : 'var(--bg-card)',
                        borderColor: isCurrent ? undefined : 'var(--border-color)',
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                            isDone ? 'bg-emerald-500 text-white' : 'bg-black/10 dark:bg-white/10'
                          }`}
                          style={{
                            color: isDone ? '#ffffff' : 'var(--text-primary)',
                          }}
                        >
                          ع{a.ainNumber}
                        </span>

                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                            {sName}
                          </div>
                          <div className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>
                            Ayat {a.startAyah}–{a.endAyah} • Juz {a.juzNumber}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigateToAin(a.ainNumber);
                          }}
                          className="rounded-lg p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                          title="Buka 'Ain ini di mushaf"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleAin(a.ainNumber)}
                          className={`rounded-lg p-1.5 cursor-pointer transition-colors ${
                            isDone ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-400 hover:text-emerald-500'
                          }`}
                          title={isDone ? 'Batalkan tanda selesai' : 'Tandai selesai dibaca'}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="flex items-center justify-between border-t px-5 py-3 shrink-0 text-xs"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>556 &apos;Ain Terpetakan Sempurna</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-1.5 font-bold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Plan */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setResetModalOpen(false)} />
          <div
            className="relative z-10 w-full max-w-md rounded-2xl border p-5 shadow-2xl space-y-4 text-center"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Konfirmasi Atur Ulang Rencana
              </h4>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Apakah Anda yakin ingin mengatur ulang rencana khatam? Seluruh daftar &apos;Ain yang telah ditandai selesai akan kembali ke &apos;Ain ke-1.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="rounded-xl px-4 py-2 text-xs font-bold bg-red-600 text-white shadow-md cursor-pointer"
              >
                Ya, Atur Ulang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed bottom-6 right-6 z-60 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xl animate-bounce"
          style={{
            backgroundColor: 'var(--bg-accent)',
            color: 'var(--text-on-accent)',
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};

