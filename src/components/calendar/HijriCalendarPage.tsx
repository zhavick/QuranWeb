import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Sparkles,
  BookOpen,
  Sliders,
  Star,
  Copy,
  Check,
} from 'lucide-react';
import { CalendarDayItem } from '../../types/hijri';
import {
  getMonthCalendarDays,
  getHijriAdjustment,
  setHijriAdjustment,
} from '../../services/hijriCalendar';
import { BackToMushafButton } from '../common/BackToMushafButton';
import { ZakatCalculatorModal } from '../zakat/ZakatCalculatorModal';

interface HijriCalendarPageProps {
  onBackToMushaf: () => void;
  elderMode?: boolean;
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];

export const HijriCalendarPage: React.FC<HijriCalendarPageProps> = ({
  onBackToMushaf,
  elderMode = false,
}) => {
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(today.getMonth());
  const [adjustment, setAdjustment] = useState<number>(() => getHijriAdjustment());

  // Filter mode: 'all' | 'fasting' | 'holidays'
  const [filterMode, setFilterMode] = useState<'all' | 'fasting' | 'holidays'>('all');

  // Selected Day state for detail panel
  const [selectedDay, setSelectedDay] = useState<CalendarDayItem | null>(null);

  // Zakat modal state
  const [zakatModalOpen, setZakatModalOpen] = useState(false);

  // Adjustment popover state
  const [showAdjSettings, setShowAdjSettings] = useState(false);

  // Copied state
  const [copiedDalil, setCopiedDalil] = useState(false);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    return getMonthCalendarDays(currentYear, currentMonthIndex);
  }, [currentYear, currentMonthIndex, adjustment]);

  // Set default selected day to today if within current month, otherwise 1st day of month
  const activeSelected = useMemo(() => {
    if (selectedDay) {
      // Find matching date in newly generated days
      const match = calendarDays.find((d) => d.dateString === selectedDay.dateString);
      if (match) return match;
    }
    const todayItem = calendarDays.find((d) => d.isToday);
    if (todayItem) return todayItem;
    return calendarDays.find((d) => d.isCurrentMonth) || calendarDays[0];
  }, [selectedDay, calendarDays]);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  const handleResetToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonthIndex(today.getMonth());
    const todayItem = calendarDays.find((d) => d.isToday);
    if (todayItem) setSelectedDay(todayItem);
  };

  const handleAdjustmentChange = (newAdj: number) => {
    setAdjustment(newAdj);
    setHijriAdjustment(newAdj);
  };

  // Approximate Hijri months spanning this Gregorian month
  const hijriSpan = useMemo(() => {
    const firstDay = calendarDays.find((d) => d.isCurrentMonth);
    const lastDay = [...calendarDays].reverse().find((d) => d.isCurrentMonth);
    if (!firstDay || !lastDay) return '';
    if (firstDay.hijri.month === lastDay.hijri.month) {
      return `${firstDay.hijri.monthNameId} ${firstDay.hijri.year} H`;
    }
    return `${firstDay.hijri.monthNameId} - ${lastDay.hijri.monthNameId} ${lastDay.hijri.year} H`;
  }, [calendarDays]);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDalil(true);
    setTimeout(() => setCopiedDalil(false), 2000);
  };

  return (
    <div
      className={`min-h-screen pb-24 transition-colors ${elderMode ? 'text-base' : 'text-sm'}`}
      style={{
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Header Bar */}
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
                  <CalendarIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Kalender Hijriah &amp; Puasa Sunnah</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Umm al-Qura
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Penanggalan Islam, Penanda Puasa Ayyamul Bidh &amp; Hari Besar
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAdjSettings(!showAdjSettings)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}
              title="Koreksi Hisab Penanggalan"
            >
              <Sliders className="h-3.5 w-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Koreksi: {adjustment >= 0 ? `+${adjustment}` : adjustment} hr</span>
            </button>

            <button
              type="button"
              onClick={() => setZakatModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Kalkulator Zakat</span>
            </button>
          </div>
        </div>
      </header>

      {/* Manual Adjustment Dropdown Box */}
      {showAdjSettings && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3">
          <div className="rounded-2xl border p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div>
              <p className="text-xs font-bold flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-emerald-500" />
                <span>Penyesuaian Koreksi Hisab Lokal (± Hari)</span>
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Gunakan fitur ini jika penetapan rukyatul hilal di wilayah Anda berselisih 1 atau 2 hari dari hisab Umm al-Qura.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {[-2, -1, 0, 1, 2].map((adjVal) => (
                <button
                  key={adjVal}
                  type="button"
                  onClick={() => handleAdjustmentChange(adjVal)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    adjustment === adjVal
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)]'
                  }`}
                  style={{ borderColor: adjustment === adjVal ? '#10b981' : 'var(--border-color)' }}
                >
                  {adjVal > 0 ? `+${adjVal}` : adjVal} hr
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Calendar Body */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Month Navigation & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Month & Year Title with Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}
                title="Bulan Berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-baseline gap-2">
                <span>{MONTH_NAMES_ID[currentMonthIndex]} {currentYear}</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  ({hijriSpan})
                </span>
              </h2>
            </div>

            <button
              type="button"
              onClick={handleResetToday}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              style={{ borderColor: 'var(--border-color)' }}
            >
              Hari Ini
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex rounded-xl border p-1" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-muted)' }}>
            {[
              { id: 'all' as const, label: 'Semua Hari' },
              { id: 'fasting' as const, label: 'Jadwal Puasa' },
              { id: 'holidays' as const, label: 'Hari Besar Islam' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterMode(f.id)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  filterMode === f.id ? 'shadow-xs' : 'hover:opacity-75'
                }`}
                style={{
                  backgroundColor: filterMode === f.id ? 'var(--bg-card)' : 'transparent',
                  color: filterMode === f.id ? 'var(--text-accent)' : 'var(--text-secondary)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Grid Container + Detail Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Monthly Calendar Grid */}
          <div
            className="lg:col-span-2 rounded-2xl border p-4 sm:p-5 shadow-xs space-y-3"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            {/* Day of Week Header Row */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
              {DAY_NAMES.map((name, i) => (
                <div key={i} className={i === 5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-secondary)]'}>
                  {name}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarDays.map((item, idx) => {
                const isSelected = activeSelected.dateString === item.dateString;
                const isFasting = item.fasting.isFasting;
                const isHaram = item.fasting.isHaram;
                const hasHoliday = Boolean(item.holiday);

                // Filter logic
                const matchesFilter =
                  filterMode === 'all' ||
                  (filterMode === 'fasting' && (isFasting || isHaram)) ||
                  (filterMode === 'holidays' && hasHoliday);

                const opacityClass = !item.isCurrentMonth
                  ? 'opacity-30'
                  : !matchesFilter
                  ? 'opacity-25'
                  : 'opacity-100';

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDay(item)}
                    className={`relative flex flex-col justify-between p-1.5 sm:p-2 rounded-xl border min-h-[72px] sm:min-h-[82px] text-left transition-all cursor-pointer ${opacityClass} ${
                      isSelected
                        ? 'ring-2 ring-emerald-500 shadow-md scale-[1.02]'
                        : 'hover:border-emerald-500/50'
                    }`}
                    style={{
                      backgroundColor: item.isToday
                        ? 'rgba(16, 185, 129, 0.08)'
                        : isSelected
                        ? 'var(--bg-muted)'
                        : 'var(--bg-app)',
                      borderColor: item.isToday ? '#10b981' : isSelected ? '#10b981' : 'var(--border-color)',
                    }}
                  >
                    {/* Top Row: Gregorian Day & Hijri Day */}
                    <div className="flex items-start justify-between w-full">
                      <span className={`text-sm sm:text-base font-black ${item.isToday ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                        {item.dayNumber}
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-arabic">
                        {item.hijri.day}
                      </span>
                    </div>

                    {/* Middle: Badges for Fasting or Holiday */}
                    <div className="w-full space-y-0.5 overflow-hidden">
                      {isFasting && (
                        <div
                          className="truncate text-[9px] font-bold px-1 py-0.5 rounded text-white text-center"
                          style={{ backgroundColor: item.fasting.badgeColor }}
                        >
                          {item.fasting.type === 'ayyamul_bidh' ? 'Ayyamul Bidh' : item.fasting.type === 'wajib_ramadhan' ? 'Ramadhan' : 'Puasa'}
                        </div>
                      )}
                      {isHaram && (
                        <div className="truncate text-[9px] font-bold px-1 py-0.5 rounded bg-red-600 text-white text-center">
                          Haram Puasa
                        </div>
                      )}
                      {hasHoliday && (
                        <div className="flex items-center justify-center text-amber-500 text-[10px]">
                          <Star className="h-3 w-3 fill-amber-500" />
                        </div>
                      )}
                    </div>

                    {/* Bottom Indicator for Today */}
                    {item.isToday && (
                      <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 self-center">
                        Hari Ini
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t text-[11px] text-[var(--text-secondary)]" style={{ borderColor: 'var(--border-color)' }}>
              <span className="font-semibold text-[var(--text-primary)]">Keterangan:</span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                Puasa Ramadhan / Senin-Kamis
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
                Puasa Ayyamul Bidh (13-15)
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600 inline-block" />
                Diharamkan Puasa
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                Hari Besar Islam
              </span>
            </div>
          </div>

          {/* Right Col: Detail Tanggal & Dalil Amalan */}
          <div className="space-y-4">
            <div
              className="rounded-2xl border p-5 shadow-xs space-y-4"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              {/* Header Detail */}
              <div className="border-b pb-3 space-y-1" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Detail Penanggalan</span>
                <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
                  {DAY_NAMES[activeSelected.dayOfWeek]}, {activeSelected.dayNumber} {MONTH_NAMES_ID[activeSelected.month]} {activeSelected.year}
                </h3>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{activeSelected.hijri.formatted} ({activeSelected.hijri.monthNameAr})</span>
                </p>
              </div>

              {/* Status Puasa Box */}
              <div
                className="rounded-xl border p-3.5 space-y-2"
                style={{
                  backgroundColor: activeSelected.fasting.isFasting
                    ? 'rgba(16, 185, 129, 0.08)'
                    : activeSelected.fasting.isHaram
                    ? 'rgba(239, 68, 68, 0.08)'
                    : 'var(--bg-muted)',
                  borderColor: activeSelected.fasting.isFasting
                    ? '#10b981'
                    : activeSelected.fasting.isHaram
                    ? '#ef4444'
                    : 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {activeSelected.fasting.name}
                  </span>
                  {activeSelected.fasting.isFasting && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                      Sunnah / Wajib
                    </span>
                  )}
                  {activeSelected.fasting.isHaram && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                      Diharamkan
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {activeSelected.fasting.description}
                </p>
              </div>

              {/* Islamic Holiday Info */}
              {activeSelected.holiday && (
                <div className="rounded-xl border p-3.5 space-y-1.5 bg-amber-500/10 border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span>{activeSelected.holiday.name}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {activeSelected.holiday.description}
                  </p>
                </div>
              )}

              {/* Dalil Sahih Quote */}
              {activeSelected.fasting.hadithDalil && (
                <div className="rounded-xl border p-3.5 space-y-2" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Dalil Hadits Sahih</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => copyText(`${activeSelected.fasting.hadithDalil}\n(${activeSelected.fasting.hadithSource})`)}
                      className="flex items-center gap-1 text-[10px] font-semibold text-[var(--text-secondary)] hover:text-emerald-500"
                    >
                      {copiedDalil ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedDalil ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <blockquote className="text-xs italic text-[var(--text-primary)] border-l-2 border-emerald-500 pl-2.5">
                    &ldquo;{activeSelected.fasting.hadithDalil}&rdquo;
                  </blockquote>
                  <span className="text-[10px] font-semibold text-[var(--text-secondary)] block text-right">
                    — {activeSelected.fasting.hadithSource}
                  </span>
                </div>
              )}

              {/* Amalan Niat Puasa */}
              {activeSelected.fasting.isFasting && (
                <div className="rounded-xl border p-3.5 space-y-2" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-color)' }}>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-accent)' }}>
                    Lafadz Niat Puasa
                  </span>
                  <p className="font-arabic text-right text-base" dir="rtl">
                    {activeSelected.fasting.type === 'senin_kamis' && activeSelected.dayOfWeek === 1
                      ? 'نَوَيْتُ صَوْمَ يَوْمِ الِاثْنَيْنِ سُنَّةً لِلَّهِ تَعَالَى'
                      : activeSelected.fasting.type === 'senin_kamis' && activeSelected.dayOfWeek === 4
                      ? 'نَوَيْتُ صَوْمَ يَوْمِ الْخَمِيسِ سُنَّةً لِلَّهِ تَعَالَى'
                      : activeSelected.fasting.type === 'ayyamul_bidh'
                      ? 'نَوَيْتُ صَوْمَ أَيَّامِ الْبِيضِ سُنَّةً لِلَّهِ تَعَالَى'
                      : 'نَوَيْتُ صَوْمَ هَذَا الْيَوْمِ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى'}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    &ldquo;Aku berniat puasa sunnah karena Allah Ta&apos;ala.&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Quick Banner Kalkulator Zakat */}
            <div
              className="rounded-2xl border p-4 shadow-xs flex items-center justify-between gap-3"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">Sudahkah Berzakat?</p>
                <p className="text-[11px] text-[var(--text-secondary)]">Hitung kewajiban zakat maal &amp; profesi Anda dengan tepat.</p>
              </div>
              <button
                type="button"
                onClick={() => setZakatModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                Buka Hitungan
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Zakat Modal */}
      <ZakatCalculatorModal
        isOpen={zakatModalOpen}
        onClose={() => setZakatModalOpen(false)}
        elderMode={elderMode}
      />
    </div>
  );
};
