import React from 'react';
import { Bookmark, Play, Pause, Check, Share2, BookMarked, BookOpen, Languages } from 'lucide-react';
import type { Ayah, ReaderSettings } from '../../types/quran';
import { TajweedRenderer } from './TajweedRenderer';

interface AyahCardProps {
  ayah: Ayah;
  surahName?: string;
  settings: ReaderSettings;
  isBookmarked: boolean;
  isLastRead: boolean;
  isPlaying: boolean;
  isFocused: boolean;
  isDimmed: boolean;
  showJuzHeader?: boolean;
  hasAsbabunNuzul?: boolean;
  hasGharibWords?: boolean;
  onToggleBookmark: (ayah: Ayah) => void;
  onSetLastRead: (ayah: Ayah) => void;
  onPlayAudio: (ayah: Ayah) => void;
  onShareLink: (ayah: Ayah) => void;
  onFocusAyah: (ayahId: number) => void;
  onOpenAsbabunNuzul?: (ayah: Ayah) => void;
  onOpenGharibWords?: (ayah: Ayah) => void;
}

function toArabicDigits(num: number): string {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num)
    .split('')
    .map((d) => digits[Number(d)] ?? d)
    .join('');
}

export const AyahCard: React.FC<AyahCardProps> = ({
  ayah,
  surahName,
  settings,
  isBookmarked,
  isLastRead,
  isPlaying,
  isFocused,
  isDimmed,
  showJuzHeader,
  hasAsbabunNuzul,
  hasGharibWords,
  onToggleBookmark,
  onSetLastRead,
  onPlayAudio,
  onShareLink,
  onFocusAyah,
  onOpenAsbabunNuzul,
  onOpenGharibWords,
}) => {
  const fontClass = `font-arabic-${settings.arabicFont}`;
  const effectiveTajweed =
    settings.tajweedEnabled &&
    settings.theme !== 'high-contrast' &&
    !settings.elderMode;

  return (
    <div id={`ayah-${ayah.surahId}-${ayah.ayahNumber}`}>
      {showJuzHeader && (
        <div
          className="my-4 flex items-center justify-center gap-3 rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: 'var(--bg-accent-soft)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-accent)',
          }}
        >
          <span>Juz {ayah.juzNumber}</span>
        </div>
      )}

      <article
        onClick={() => onFocusAyah(ayah.id)}
        className={`rounded-2xl border p-4 sm:p-6 transition-all duration-200 ${
          isDimmed ? 'opacity-35' : 'opacity-100'
        }`}
        style={{
          backgroundColor:
            isPlaying || isFocused ? 'var(--highlight-bg)' : 'var(--bg-card)',
          borderColor:
            isPlaying || isLastRead ? 'var(--bg-accent)' : 'var(--border-color)',
        }}
      >
        {/* Top Action Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-xs font-bold"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              {surahName ? `${surahName} : ` : ''}
              {ayah.ayahNumber}
            </span>
            <span
              className="rounded-md px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-secondary)',
              }}
            >
              Juz {ayah.juzNumber} • &apos;Ain {ayah.ainNumber}
            </span>
            {isLastRead && (
              <span
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  color: 'var(--text-accent)',
                }}
              >
                <BookMarked className="h-3 w-3" /> Terakhir Dibaca
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onPlayAudio(ayah)}
              aria-label={`Putar audio ayat ${ayah.ayahNumber}`}
              className={`inline-flex items-center justify-center rounded-lg transition-colors ${
                settings.elderMode ? 'h-11 w-11' : 'h-9 w-9'
              }`}
              style={{
                backgroundColor: isPlaying ? 'var(--bg-accent)' : 'var(--bg-muted)',
                color: isPlaying ? 'var(--text-on-accent)' : 'var(--text-secondary)',
              }}
              title="Putar Audio Murottal"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(ayah)}
              aria-label={`Bookmark ayat ${ayah.ayahNumber}`}
              className={`inline-flex items-center justify-center rounded-lg transition-colors ${
                settings.elderMode ? 'h-11 w-11' : 'h-9 w-9'
              }`}
              style={{
                backgroundColor: isBookmarked ? 'var(--bg-accent-soft)' : 'var(--bg-muted)',
                color: isBookmarked ? 'var(--text-accent)' : 'var(--text-secondary)',
              }}
              title="Simpan Bookmark"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => onSetLastRead(ayah)}
              aria-label={`Tandai terakhir dibaca ayat ${ayah.ayahNumber}`}
              className={`inline-flex items-center justify-center rounded-lg transition-colors ${
                settings.elderMode ? 'h-11 w-11' : 'h-9 w-9'
              }`}
              style={{
                backgroundColor: isLastRead ? 'var(--bg-accent-soft)' : 'var(--bg-muted)',
                color: isLastRead ? 'var(--text-accent)' : 'var(--text-secondary)',
              }}
              title="Tandai Terakhir Dibaca"
            >
              <Check className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onShareLink(ayah)}
              aria-label={`Salin tautan ayat ${ayah.ayahNumber}`}
              className={`inline-flex items-center justify-center rounded-lg transition-colors ${
                settings.elderMode ? 'h-11 w-11' : 'h-9 w-9'
              }`}
              style={{
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-secondary)',
              }}
              title="Salin Tautan Ayat"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Arabic Text */}
        <p
          className={`arabic-text ${fontClass} mb-4 select-text`}
          style={{
            fontSize: `${settings.arabicFontSize}px`,
            lineHeight: settings.lineHeight,
            color: 'var(--text-primary)',
          }}
        >
          <TajweedRenderer
            textUthmani={ayah.textUthmani}
            textTajweed={ayah.textTajweed}
            enabled={effectiveTajweed}
          />{' '}
          <span
            className="inline-block px-1 text-[0.75em]"
            style={{ color: 'var(--text-accent)' }}
          >
            ﴿{toArabicDigits(ayah.ayahNumber)}﴾
          </span>
        </p>

        {/* Indonesian Translation */}
        {settings.showTranslation && (
          <p
            className="leading-relaxed"
            style={{
              fontSize: `${settings.translationFontSize}px`,
              color: 'var(--text-secondary)',
            }}
          >
            {ayah.translationId}
          </p>
        )}

        {/* Asbabun Nuzul & Gharib Mufradat Badges */}
        {(hasAsbabunNuzul || hasGharibWords) && (
          <div
            className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-dashed"
            style={{ borderColor: 'var(--border-color)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {hasAsbabunNuzul && (
              <button
                type="button"
                onClick={() => onOpenAsbabunNuzul?.(ayah)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all hover:opacity-90 active:scale-95 shadow-xs cursor-pointer"
                style={{
                  backgroundColor: 'rgba(217, 119, 6, 0.12)',
                  color: '#d97706',
                  border: '1px solid rgba(217, 119, 6, 0.3)',
                }}
                title="Buka Penjelasan Asbabun Nuzul (Sebab & Konteks Turunnya Ayat)"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Asbabun Nuzul</span>
              </button>
            )}
            {hasGharibWords && (
              <button
                type="button"
                onClick={() => onOpenGharibWords?.(ayah)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all hover:opacity-90 active:scale-95 shadow-xs cursor-pointer"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
                title="Buka Kamus Kata Langka / Sulit (Gharibul Qur'an & Balaghah)"
              >
                <Languages className="h-3.5 w-3.5" />
                <span>Mufradat Gharib</span>
              </button>
            )}
          </div>
        )}
      </article>

      {/* 'Ain (Ruku') End Marker */}
      {ayah.isAinEnd && (
        <div className="my-4 flex items-center gap-3 px-2">
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-color)' }} />
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-accent)',
            }}
          >
            <span className="font-arabic-amiri text-base leading-none">ع</span>
            <span>Akhir &apos;Ain ke-{ayah.ainNumber}</span>
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-color)' }} />
        </div>
      )}
    </div>
  );
};

