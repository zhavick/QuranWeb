import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Clock,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Volume2,
  Share2,
  Check,
} from 'lucide-react';
import type { ProphetDetail } from '../../types/prophet';
import { logActivity } from '../../services/telemetry';

interface ProphetDetailModalProps {
  prophet: ProphetDetail | null;
  open: boolean;
  onClose: () => void;
  onNavigateToAyah: (surahId: number, ayahNumber: number) => void;
  onSelectProphet?: (id: number) => void;
  totalProphets?: number;
}

type StoryTab = 'timeline' | 'duas' | 'wisdoms' | 'quran';

export const ProphetDetailModal: React.FC<ProphetDetailModalProps> = ({
  prophet,
  open,
  onClose,
  onNavigateToAyah,
  onSelectProphet,
  totalProphets = 25,
}) => {
  const [activeTab, setActiveTab] = useState<StoryTab>('timeline');
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);

  if (!open || !prophet) return null;

  const handleCopyDua = (duaText: string, id: string) => {
    navigator.clipboard.writeText(duaText);
    setCopiedDuaId(id);
    setTimeout(() => setCopiedDuaId(null), 2500);
  };

  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 'large':
        return 'text-base sm:text-lg leading-relaxed';
      case 'xlarge':
        return 'text-lg sm:text-xl leading-loose';
      default:
        return 'text-sm sm:text-base leading-relaxed';
    }
  };

  const prevId = prophet.id > 1 ? prophet.id - 1 : totalProphets;
  const nextId = prophet.id < totalProphets ? prophet.id + 1 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Modal Top Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-bold font-mono text-sm shadow-xs"
              style={{
                backgroundColor: 'var(--bg-accent-soft)',
                color: 'var(--text-accent)',
                borderColor: 'var(--border-color)',
              }}
            >
              #{prophet.id}
            </span>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold truncate">
                  Kisah {prophet.name}
                </h2>
                {prophet.isUlulAzmi && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-amber-900 bg-amber-400/90 dark:text-amber-100 dark:bg-amber-600/80 shadow-xs"
                    title="Termasuk 5 Rasul Ulul Azmi yang memiliki keteguhan luar biasa"
                  >
                    ★ Ulul Azmi
                  </span>
                )}
              </div>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                {prophet.title} • {prophet.eraLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Adjuster (Elder-Friendly) */}
            <div
              className="hidden sm:inline-flex items-center rounded-xl border p-0.5 text-xs font-semibold"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
              }}
            >
              <button
                type="button"
                onClick={() => setFontSizeLevel('normal')}
                className={`rounded-lg px-2 py-1 transition-colors ${
                  fontSizeLevel === 'normal' ? 'bg-black/10 dark:bg-white/10 font-bold' : ''
                }`}
                title="Ukuran teks standar"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSizeLevel('large')}
                className={`rounded-lg px-2 py-1 transition-colors ${
                  fontSizeLevel === 'large' ? 'bg-black/10 dark:bg-white/10 font-bold' : ''
                }`}
                title="Ukuran teks besar (Ramah Lansia)"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSizeLevel('xlarge')}
                className={`rounded-lg px-2 py-1 transition-colors ${
                  fontSizeLevel === 'xlarge' ? 'bg-black/10 dark:bg-white/10 font-bold' : ''
                }`}
                title="Ukuran teks ekstra besar"
              >
                A++
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup lembar kisah"
              className="flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Hero Banner Profil Singkat */}
        <div
          className="px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--bg-accent-soft)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="space-y-1">
            <p
              className="text-2xl sm:text-3xl font-bold font-arabic-amiri text-right sm:text-left"
              style={{ color: 'var(--text-accent)' }}
            >
              {prophet.arabicName}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>📍 Wilayah: <strong style={{ color: 'var(--text-primary)' }}>{prophet.region}</strong></span>
              <span>👥 Kaum: <strong style={{ color: 'var(--text-primary)' }}>{prophet.people}</strong></span>
              <span>📖 Disebut: <strong style={{ color: 'var(--text-primary)' }}>{prophet.mentionsInQuran} kali</strong> di Al-Qur&apos;an</span>
            </div>
          </div>

          {/* Quick Prev / Next Prophet Navigation */}
          {onSelectProphet && (
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  onSelectProphet(prevId);
                  logActivity('VIEW_PROPHET_STORY', { id: prevId });
                }}
                className="inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                title="Buka kisah nabi sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden xs:inline">Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectProphet(nextId);
                  logActivity('VIEW_PROPHET_STORY', { id: nextId });
                }}
                className="inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                title="Buka kisah nabi berikutnya"
              >
                <span className="hidden xs:inline">Berikutnya</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <div
          className="flex items-center gap-1 px-5 pt-3 border-b overflow-x-auto no-scrollbar shrink-0 text-xs font-semibold"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-[var(--text-accent)] text-[var(--text-accent)] font-bold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Linimasa Babak Kisah ({prophet.timeline.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('duas')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'duas'
                ? 'border-[var(--text-accent)] text-[var(--text-accent)] font-bold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span>Doa-Doa Nabawi ({prophet.duas.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wisdoms')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wisdoms'
                ? 'border-[var(--text-accent)] text-[var(--text-accent)] font-bold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Mutiara Hikmah ({prophet.wisdoms.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quran')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quran'
                ? 'border-[var(--text-accent)] text-[var(--text-accent)] font-bold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Rujukan di Mushaf ({prophet.quranReferences.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: TIMELINE KISAH */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Ringkasan Eksekutif */}
              <div
                className="rounded-2xl border p-4.5 shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-accent)' }}>
                  Ikhtisar Perjalanan Kenabian
                </h4>
                <p className={`${getFontSizeClass()} whitespace-pre-line`} style={{ color: 'var(--text-primary)' }}>
                  {prophet.summary}
                </p>
              </div>

              {/* Babak Linimasa */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-color)]">
                {prophet.timeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-2 group">
                    {/* Bullet marker */}
                    <span
                      className="absolute -left-6 sm:-left-8 top-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border-2 bg-[var(--bg-card)] border-[var(--text-accent)] ring-4 ring-[var(--bg-card)] shadow-xs transition-transform group-hover:scale-125"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-accent)]" />
                    </span>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: 'var(--bg-accent-soft)',
                          color: 'var(--text-accent)',
                        }}
                      >
                        {item.phase}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        <Clock className="h-3 w-3" />
                        <span>{item.readingMinutes} menit baca</span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>

                    <p className={`${getFontSizeClass()} whitespace-pre-line`} style={{ color: 'var(--text-secondary)' }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DO'A NABAWAI (DU'A AL-ANBIYA') */}
          {activeTab === 'duas' && (
            <div className="space-y-4">
              <div
                className="rounded-2xl border p-4 shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-accent)' }}>
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                  <span>Kompilasi Doa Mustajab yang Diabadikan dalam Al-Qur&apos;an</span>
                </div>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Doa para nabi dipanjatkan dalam kepasrahan total dan menjadi wasilah munajat mustajab bagi setiap muslim di saat lapang maupun sempit.
                </p>
              </div>

              {prophet.duas.map((dua) => (
                <div
                  key={dua.id}
                  className="rounded-2xl border p-5 shadow-xs space-y-4 transition-all"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {dua.title}
                    </h4>
                    <span
                      className="rounded-lg px-2.5 py-1 text-xs font-mono font-semibold"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {dua.reference}
                    </span>
                  </div>

                  {/* Teks Arab Doa */}
                  <p
                    className="arabic-text font-arabic-amiri text-2xl sm:text-3xl text-right leading-loose py-2"
                    style={{ color: 'var(--text-accent)' }}
                  >
                    {dua.arabic}
                  </p>

                  {/* Transliterasi Latin */}
                  <p className="text-xs sm:text-sm italic font-medium" style={{ color: 'var(--text-secondary)' }}>
                    &ldquo;{dua.latin}&rdquo;
                  </p>

                  {/* Arti Terjemahan */}
                  <p className={`${getFontSizeClass()}`} style={{ color: 'var(--text-primary)' }}>
                    <strong>Artinya:</strong> {dua.translation}
                  </p>

                  {/* Tombol Interaksi Doa (Bi-Directional Linking) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const fullDuaText = `${dua.title}\n\n${dua.arabic}\n\n"${dua.latin}"\n\nArtinya: ${dua.translation}\n\n(${dua.reference} - QuranWeb)`;
                        handleCopyDua(fullDuaText, dua.id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {copiedDuaId === dua.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-600 font-bold">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3.5 w-3.5" />
                          <span>Salin Doa</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToAyah(dua.surahId, dua.ayahNumber);
                        logActivity('JUMP_FROM_PROPHET_DUA', {
                          prophet: prophet.slug,
                          surahId: dua.surahId,
                          ayahNumber: dua.ayahNumber,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-transform active:scale-95 shadow-xs"
                      style={{
                        backgroundColor: 'var(--bg-accent)',
                        color: 'var(--text-on-accent)',
                      }}
                      title="Buka lembar tilawah mushaf pada ayat doa ini lengkap dengan audio murottal"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Buka Ayat di Mushaf &amp; Audio</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MUTIARA HIKMAH */}
          {activeTab === 'wisdoms' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {prophet.wisdoms.map((w, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border p-5 shadow-xs space-y-2 flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {w.title}
                      </h4>
                    </div>
                    <p className={`${getFontSizeClass()}`} style={{ color: 'var(--text-secondary)' }}>
                      {w.lesson}
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    Hikmah Tadabbur • QuranWeb Elder Care
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: RUJUKAN DI MUSHAF AL-QUR'AN */}
          {activeTab === 'quran' && (
            <div className="space-y-4">
              <div
                className="rounded-2xl border p-4 shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Kisah {prophet.name} terpancar di berbagai surat mulia. Klik salah satu rujukan di bawah untuk langsung menuju lembar mushaf tilawah:
                </p>
              </div>

              <div className="space-y-3">
                {prophet.quranReferences.map((ref, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 shadow-xs transition-all hover:border-[var(--text-accent)]"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="rounded-md px-2 py-0.5 text-xs font-bold font-mono"
                          style={{
                            backgroundColor: 'var(--bg-accent-soft)',
                            color: 'var(--text-accent)',
                          }}
                        >
                          QS. {ref.surahName} [{ref.surahId}]: {ref.ayahStart}
                          {ref.ayahEnd !== ref.ayahStart ? `–${ref.ayahEnd}` : ''}
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {ref.topic}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToAyah(ref.surahId, ref.ayahStart);
                        logActivity('JUMP_FROM_PROPHET_REF', {
                          prophet: prophet.slug,
                          surahId: ref.surahId,
                          ayahNumber: ref.ayahStart,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer shrink-0 transition-transform active:scale-95"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                      title="Buka surat dan ayat ini di lembar tilawah mushaf"
                    >
                      <BookOpen className="h-3.5 w-3.5" style={{ color: 'var(--text-accent)' }} />
                      <span>Buka Mushaf</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t shrink-0 text-xs"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          <span>
            {prophet.name} ({prophet.period}) • {prophet.eraLabel}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-1.5 font-semibold cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-accent)',
              color: 'var(--text-on-accent)',
            }}
          >
            Tutup Lembar Kisah
          </button>
        </div>
      </div>
    </div>
  );
};
