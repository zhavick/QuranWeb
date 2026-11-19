import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Download,
  Flame,
  Heart,
  Sparkles,
  TrendingUp,
  Compass,
} from 'lucide-react';
import {
  WorshipAnalyticsSummary,
  ReportPeriod,
  PrayerDailyChecklist
} from '../../types/reportAnalytics';
import {
  getWorshipAnalytics,
  getPrayerTracking,
  togglePrayerCheck
} from '../../services/reportAnalytics';
import { BackToMushafButton } from '../common/BackToMushafButton';
import { WorshipReportCardModal } from './WorshipReportCard';
import { logActivity } from '../../services/telemetry';

interface WorshipReportPageProps {
  onBackToMushaf: () => void;
  elderMode?: boolean;
}

export const WorshipReportPage: React.FC<WorshipReportPageProps> = ({
  onBackToMushaf,
  elderMode = false,
}) => {
  const [period, setPeriod] = useState<ReportPeriod>('30d');
  const [summary, setSummary] = useState<WorshipAnalyticsSummary>(() => getWorshipAnalytics('30d'));
  const [cardModalOpen, setCardModalOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Today's prayer checklist
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const [prayerData, setPrayerData] = useState<Record<string, PrayerDailyChecklist>>(() => getPrayerTracking());

  const todayPrayer = prayerData[todayStr] || {
    date: todayStr,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    dhuha: false,
    tahajud: false,
    rawatib: false,
  };

  useEffect(() => {
    logActivity('VIEW_REPORT');
  }, []);

  // Refresh summary when period or prayer changes
  useEffect(() => {
    setSummary(getWorshipAnalytics(period));
  }, [period, prayerData]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTogglePrayer = (key: keyof Omit<PrayerDailyChecklist, 'date'>, label: string) => {
    const updated = togglePrayerCheck(todayStr, key);
    setPrayerData(getPrayerTracking());
    const isChecked = updated[key];
    showToast(isChecked ? `Alhamdulillah! Shalat ${label} telah dicatat.` : `Catatan shalat ${label} dibatalkan.`);
  };

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

      {/* Top Navigation Bar */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md px-4 py-3 sm:px-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BackToMushafButton
              onClick={onBackToMushaf}
              elderMode={elderMode}
            />
            <div className="h-5 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold leading-tight flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Portal Laporan Analitik Ibadah</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  /report
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Akuntabilitas &amp; Rekapitulasi Amalan Jamaah Istiqomah
              </p>
            </div>
          </div>

          {/* Period Tabs & Action */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl border p-1" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-muted)' }}>
              {(['7d', '30d', 'all'] as ReportPeriod[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    period === p ? 'shadow-xs' : 'hover:opacity-75'
                  }`}
                  style={{
                    backgroundColor: period === p ? 'var(--bg-card)' : 'transparent',
                    color: period === p ? 'var(--text-accent)' : 'var(--text-secondary)',
                  }}
                >
                  {p === '7d' ? '7 Hari' : p === '30d' ? '30 Hari' : 'Semua'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCardModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Worship Report Card</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Banner Ringkasan Istiqomah */}
        <section
          className="relative overflow-hidden rounded-2xl border p-5 sm:p-7 shadow-sm transition-all"
          style={{
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-accent-soft) 100%)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: 'var(--bg-accent)', color: '#ffffff' }}>
                <Sparkles className="h-3.5 w-3.5" />
                <span>{summary.spiritualTitle}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Assalamu&apos;alaikum, {summary.userName}!
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {summary.spiritualQuote}
              </p>
            </div>

            {/* Score Ring Widget */}
            <div className="flex items-center gap-4 bg-white/5 dark:bg-black/10 backdrop-blur-md rounded-2xl p-4 border" style={{ borderColor: 'var(--border-color)' }}>
              <div className="relative flex items-center justify-center w-20 h-20">
                <svg className="w-20 h-20 -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="7"
                    className="text-gray-200 dark:text-gray-800"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#10b981"
                    strokeWidth="7"
                    strokeDasharray={201}
                    strokeDashoffset={201 - (201 * summary.overallScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-lg font-black">{summary.overallScore}%</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Skor Istiqomah</p>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {summary.overallScore >= 80 ? 'Sangat Terjaga' : 'Terus Ditingkatkan'}
                </p>
                <p className="text-[10px] text-[var(--text-secondary)]">Periode: {summary.periodLabel}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Pilar Metrik Utama */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Tilawah */}
          <div
            className="rounded-2xl border p-4.5 space-y-3 shadow-xs hover:border-emerald-500/50 transition-all"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Pilar Tilawah</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black">{summary.tilawah.totalAyahRead.toLocaleString()}</div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Ayat Al-Qur&apos;an Dibaca</p>
            </div>
            <div className="border-t pt-2 space-y-1 text-[11px] text-[var(--text-secondary)]" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between">
                <span>Durasi Tilawah:</span>
                <span className="font-semibold text-[var(--text-primary)]">±{summary.tilawah.estimatedMinutes} Menit</span>
              </div>
              <div className="flex justify-between">
                <span>Streak Beruntun:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{summary.tilawah.activeDaysStreak} Hari</span>
              </div>
              <div className="flex justify-between">
                <span>Terakhir Dibaca:</span>
                <span className="font-semibold text-[var(--text-primary)]">QS {summary.tilawah.lastReadSurahName} : {summary.tilawah.lastReadAyah}</span>
              </div>
            </div>
          </div>

          {/* 2. Shalat */}
          <div
            className="rounded-2xl border p-4.5 space-y-3 shadow-xs hover:border-sky-500/50 transition-all"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Kepatuhan Shalat</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
                <Compass className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black">{summary.prayer.complianceRate}%</div>
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">Fardhu Ditegakkan</p>
            </div>
            <div className="border-t pt-2 space-y-1 text-[11px] text-[var(--text-secondary)]" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between">
                <span>Fardhu Tercatat:</span>
                <span className="font-semibold text-[var(--text-primary)]">{summary.prayer.totalFardhuCompleted} / {summary.prayer.totalTargetFardhu} Waktu</span>
              </div>
              <div className="flex justify-between">
                <span>Tepat Waktu:</span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">{summary.prayer.onTimeCount} Waktu</span>
              </div>
              <div className="flex justify-between">
                <span>Shalat Sunnah:</span>
                <span className="font-semibold text-[var(--text-primary)]">{summary.prayer.sunnahCompleted} Rakaat/Waktu</span>
              </div>
            </div>
          </div>

          {/* 3. Hafalan / Tahfidz */}
          <div
            className="rounded-2xl border p-4.5 space-y-3 shadow-xs hover:border-amber-500/50 transition-all"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Hafalan Tahfidz</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black">{summary.memorization.surahCount} Surah</div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{summary.memorization.ayahCount} Ayat Terjaga</p>
            </div>
            <div className="border-t pt-2 space-y-1 text-[11px] text-[var(--text-secondary)]" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between">
                <span>Skor Kelancaran:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{summary.memorization.fluencyScore}% Mutqin</span>
              </div>
              <div className="flex justify-between">
                <span>Target Fokus:</span>
                <span className="font-semibold text-[var(--text-primary)]">Juz {summary.memorization.targetJuz} (Juz &apos;Amma)</span>
              </div>
              <div className="flex justify-between">
                <span>Status Muroja&apos;ah:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Aktif Rutin</span>
              </div>
            </div>
          </div>

          {/* 4. Dzikir & Tasbih */}
          <div
            className="rounded-2xl border p-4.5 space-y-3 shadow-xs hover:border-pink-500/50 transition-all"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Dzikir &amp; Tasbih</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
                <Heart className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black">{summary.dhikr.totalCount.toLocaleString()}</div>
              <p className="text-xs font-semibold text-pink-600 dark:text-pink-400">Ketukan Dzikir Terucap</p>
            </div>
            <div className="border-t pt-2 space-y-1 text-[11px] text-[var(--text-secondary)]" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between">
                <span>Putaran 33x:</span>
                <span className="font-semibold text-[var(--text-primary)]">{summary.dhikr.completedCycles} Siklus</span>
              </div>
              <div className="truncate">
                <span>Favorit: </span>
                <span className="font-semibold text-[var(--text-primary)]">{summary.dhikr.favoritePhrase}</span>
              </div>
              <div className="flex justify-between">
                <span>Doa Harian:</span>
                <span className="font-semibold text-pink-600 dark:text-pink-400">Tercatat</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Prayer Checklist for Today */}
        <section
          className="rounded-2xl border p-5 shadow-xs space-y-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Pelacak Kepatuhan Shalat Hari Ini ({todayStr})</span>
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Centang setiap shalat yang telah Anda tunaikan untuk memperbarui analitik Anda secara langsung.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Sinkronisasi Otomatis
            </span>
          </div>

          {/* 5 Fardhu + Sunnah Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { key: 'fajr' as const, label: 'Subuh' },
              { key: 'dhuhr' as const, label: 'Dzuhur' },
              { key: 'asr' as const, label: 'Ashar' },
              { key: 'maghrib' as const, label: 'Maghrib' },
              { key: 'isha' as const, label: 'Isya' },
              { key: 'dhuha' as const, label: 'Dhuha (Sunnah)' },
              { key: 'tahajud' as const, label: 'Tahajud (Sunnah)' },
            ].map((p) => {
              const isChecked = Boolean(todayPrayer[p.key]);
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handleTogglePrayer(p.key, p.label)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                  }`}
                  style={{
                    borderColor: isChecked ? '#10b981' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {isChecked ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-[var(--text-secondary)]" />
                    )}
                    <span className="text-xs font-bold">{p.label}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {isChecked ? 'Sudah Ditunaikan' : 'Belum Ditunaikan'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Tren Aktivitas & Heatmap Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grafik Tren Mingguan (SVG Chart) */}
          <div
            className="lg:col-span-2 rounded-2xl border p-5 shadow-xs space-y-4"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span>Tren Intensitas Ibadah Harian (7 Hari)</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">Jumlah ayat tilawah &amp; shalat per hari</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                  Tilawah
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500 inline-block" />
                  Shalat (x5)
                </span>
              </div>
            </div>

            {/* SVG Visual Bar Chart */}
            <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 px-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
              {summary.dailyTrend.map((t, idx) => {
                const maxAyah = 45;
                const tilawahHeight = Math.min(100, Math.round((t.tilawah / maxAyah) * 100));
                const prayerHeight = Math.min(100, Math.round((t.prayer / 5) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="text-[10px] text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.tilawah} ay
                    </div>
                    <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-36">
                      {/* Tilawah Bar */}
                      <div
                        className="w-3 rounded-t-md bg-emerald-500 transition-all duration-500"
                        style={{ height: `${tilawahHeight}%` }}
                        title={`${t.day}: ${t.tilawah} ayat`}
                      />
                      {/* Prayer Bar */}
                      <div
                        className="w-3 rounded-t-md bg-sky-500 transition-all duration-500"
                        style={{ height: `${prayerHeight}%` }}
                        title={`${t.day}: ${t.prayer} shalat fardhu`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] mt-1">{t.day}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-center text-[var(--text-secondary)]">
              Keterangan: Batang hijau = Ayat Al-Qur&apos;an dibaca; Batang biru = Shalat fardhu ditegakkan.
            </p>
          </div>

          {/* Activity Heatmap 30 Hari */}
          <div
            className="rounded-2xl border p-5 shadow-xs space-y-4"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <span>Peta Panas Istiqomah (30 Hari)</span>
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Frekuensi keterlibatan ibadah harian</p>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 pt-2">
              {summary.heatmap.slice(-30).map((h, i) => {
                const colorMap = [
                  'bg-gray-100 dark:bg-gray-800 text-gray-400',
                  'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600',
                  'bg-emerald-300 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200',
                  'bg-emerald-500 dark:bg-emerald-600 text-white',
                  'bg-emerald-700 dark:bg-emerald-500 text-white font-bold',
                ];
                return (
                  <div
                    key={i}
                    className={`h-9 rounded-lg flex items-center justify-center text-[10px] transition-transform hover:scale-105 cursor-default ${colorMap[h.level]}`}
                    title={`${h.date}: ${h.count} poin aktivitas ibadah`}
                  >
                    {h.date.split('-')[2]}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <span>Kurang Aktif</span>
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-sm bg-gray-200 dark:bg-gray-800 inline-block" />
                <span className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-950 inline-block" />
                <span className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-700 inline-block" />
                <span className="h-3 w-3 rounded-sm bg-emerald-600 dark:bg-emerald-500 inline-block" />
              </div>
              <span>Sangat Istiqomah</span>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Infografis Card */}
      <WorshipReportCardModal
        summary={summary}
        isOpen={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
      />
    </div>
  );
};
