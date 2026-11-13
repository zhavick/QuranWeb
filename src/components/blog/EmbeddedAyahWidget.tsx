import React, { useState, useRef } from 'react';
import { BookOpen, Volume2, Pause, Copy, Check } from 'lucide-react';
import type { EmbeddedAyah } from '../../types/blog';
import { logActivity } from '../../services/telemetry';

interface EmbeddedAyahWidgetProps {
  ayah: EmbeddedAyah;
  onNavigateToAyah: (surahId: number, ayahNumber: number) => void;
}

export const EmbeddedAyahWidget: React.FC<EmbeddedAyahWidgetProps> = ({
  ayah,
  onNavigateToAyah,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pad numbers for Audio URL (e.g., 013028.mp3)
  const surahPadded = String(ayah.surahId).padStart(3, '0');
  const ayahPadded = String(ayah.ayahNumber).padStart(3, '0');
  const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${surahPadded}${ayahPadded}.mp3`;

  const handleToggleAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      logActivity('PLAY_EMBEDDED_AYAH_AUDIO', {
        surahId: ayah.surahId,
        ayahNumber: ayah.ayahNumber,
      });
    }
  };

  const handleCopy = () => {
    const text = `${ayah.arabic}\n\n"${ayah.translation}"\n\n(QS. ${ayah.surahName} [${ayah.surahId}]: ${ayah.ayahNumber} - QuranWeb)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="my-6 rounded-2xl border p-4 sm:p-5 shadow-xs transition-all"
      style={{
        backgroundColor: 'var(--bg-accent-soft)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 mb-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs">
            📖
          </span>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-accent)' }}>
            QS. {ayah.surahName} [{ayah.surahId}]: Ayat {ayah.ayahNumber}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mini Audio Button */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold cursor-pointer transition-all shadow-xs ${
              isPlaying
                ? 'bg-amber-500 text-white'
                : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--text-accent)]'
            }`}
            title="Dengarkan murottal ayat ini (Syaikh Misyari Rasyid)"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3 w-3 text-amber-500" />
                <span>Audio</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-7 w-7 items-center justify-center rounded-xl border cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            title="Salin teks ayat & terjemahan"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Teks Arab */}
      <p
        className="arabic-text font-arabic-amiri text-2xl sm:text-3xl text-right leading-loose py-2"
        style={{ color: 'var(--text-accent)' }}
      >
        {ayah.arabic}
      </p>

      {/* Transliterasi Latin */}
      {ayah.latin && (
        <p className="mt-1 text-xs italic font-medium" style={{ color: 'var(--text-secondary)' }}>
          &ldquo;{ayah.latin}&rdquo;
        </p>
      )}

      {/* Terjemahan */}
      <p className="mt-2 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        <strong>Artinya:</strong> {ayah.translation}
      </p>

      {/* Footer Taut Silang ke Mushaf */}
      <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>
          Standar Resmi Kemenag RI
        </span>

        <button
          type="button"
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            onNavigateToAyah(ayah.surahId, ayah.ayahNumber);
            logActivity('JUMP_FROM_BLOG_AYAH', {
              surahId: ayah.surahId,
              ayahNumber: ayah.ayahNumber,
            });
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-transform active:scale-95"
          style={{ color: 'var(--text-accent)' }}
          title="Buka ayat ini di lembar tilawah mushaf"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Buka Ayat di Mushaf →</span>
        </button>
      </div>
    </div>
  );
};

