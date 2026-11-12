import React, { useState } from 'react';
import {
  Play,
  Pause,
  Square,
  Repeat,
  Volume2,
  VolumeX,
  Gauge,
  AlertCircle,
  X,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  QARI_OPTIONS,
  type QariOption,
  type RepeatMode,
  type PlaybackSpeed,
} from '../../hooks/useAudioPlayer';
import type { Ayah } from '../../types/quran';

interface AudioMiniPlayerProps {
  qari: QariOption;
  onChangeQari: (q: QariOption) => void;
  isPlaying: boolean;
  playingAyahId: number | null;
  repeatMode: RepeatMode;
  onChangeRepeat: (r: RepeatMode) => void;
  playbackSpeed: PlaybackSpeed;
  onChangeSpeed: (s: PlaybackSpeed) => void;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onChangeVolume: (v: number) => void;
  onToggleMute: () => void;
  onSeek: (seconds: number) => void;
  onTogglePlayPause: () => void;
  onStop: () => void;
  audioError: string | null;
  onClearError: () => void;
  currentAyah?: Ayah | null;
  currentSurahName?: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const AudioMiniPlayer: React.FC<AudioMiniPlayerProps> = ({
  qari,
  onChangeQari,
  isPlaying,
  playingAyahId,
  repeatMode,
  onChangeRepeat,
  playbackSpeed,
  onChangeSpeed,
  currentTime,
  duration,
  volume,
  isMuted,
  onChangeVolume,
  onToggleMute,
  onSeek,
  onTogglePlayPause,
  onStop,
  audioError,
  onClearError,
  currentAyah,
  currentSurahName,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (playingAyahId === null) return null;

  const cycleRepeat = () => {
    const next: RepeatMode =
      repeatMode === 'none' ? 'ayah' : repeatMode === 'ayah' ? 'list' : 'none';
    onChangeRepeat(next);
  };

  const cycleSpeed = () => {
    const speeds: PlaybackSpeed[] = [0.75, 1.0, 1.25, 1.5];
    const currIdx = speeds.indexOf(playbackSpeed);
    const next = speeds[(currIdx + 1) % speeds.length];
    onChangeSpeed(next);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="fixed bottom-16 left-2 right-2 z-40 mx-auto max-w-3xl rounded-2xl border shadow-2xl backdrop-blur-md transition-all lg:bottom-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Optional Audio Error Toast */}
      {audioError && (
        <div
          className="flex items-center justify-between border-b px-4 py-1.5 text-xs font-semibold"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
          }}
        >
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{audioError}</span>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="rounded p-0.5 hover:bg-red-500/10"
            aria-label="Tutup pesan error"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Scrubber Progress Bar */}
      <div className="relative h-1.5 w-full cursor-pointer bg-black/10 overflow-hidden rounded-t-2xl">
        <div
          className="h-full transition-all"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: 'var(--bg-accent)',
          }}
        />
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="Audio timeline"
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="p-3 sm:p-3.5 space-y-2">
        {/* Main Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Ayah info & Qari Selector */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                <span className="truncate">
                  {currentSurahName ? `${currentSurahName} : ` : 'Ayat '}
                  {currentAyah ? currentAyah.ayahNumber : playingAyahId}
                </span>
                <span className="text-[10px] font-normal" style={{ color: 'var(--text-secondary)' }}>
                  ({formatTime(currentTime)} / {formatTime(duration)})
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-1">
                <select
                  aria-label="Pilih Qari Murottal"
                  value={qari.id}
                  onChange={(e) => {
                    const found = QARI_OPTIONS.find((q) => q.id === e.target.value);
                    if (found) onChangeQari(found);
                  }}
                  className="max-w-[170px] sm:max-w-[240px] truncate rounded-md border px-1.5 py-0.5 text-[11px] font-medium outline-none"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {QARI_OPTIONS.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right: Audio Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Speed Pill */}
            <button
              type="button"
              onClick={cycleSpeed}
              title={`Kecepatan Putar: ${playbackSpeed}x`}
              className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-bold transition-colors"
              style={{
                backgroundColor: playbackSpeed !== 1.0 ? 'var(--bg-accent-soft)' : 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: playbackSpeed !== 1.0 ? 'var(--text-accent)' : 'var(--text-secondary)',
              }}
            >
              <Gauge className="h-3 w-3" />
              <span>{playbackSpeed}x</span>
            </button>

            {/* Repeat Mode Pill */}
            <button
              type="button"
              onClick={cycleRepeat}
              title={
                repeatMode === 'none'
                  ? 'Putar 1x'
                  : repeatMode === 'ayah'
                  ? 'Ulangi Ayat Ini'
                  : 'Lanjut Otomatis ke Ayat Berikutnya'
              }
              className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-bold transition-colors"
              style={{
                backgroundColor: repeatMode !== 'none' ? 'var(--bg-accent-soft)' : 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: repeatMode !== 'none' ? 'var(--text-accent)' : 'var(--text-secondary)',
              }}
            >
              <Repeat className="h-3 w-3" />
              <span className="hidden sm:inline">
                {repeatMode === 'none' ? '1x' : repeatMode === 'ayah' ? 'Ulang Ayat' : 'Lanjut'}
              </span>
              <span className="sm:hidden">
                {repeatMode === 'none' ? '1x' : repeatMode === 'ayah' ? '1' : 'All'}
              </span>
            </button>

            {/* Volume Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowVolumeSlider((prev) => !prev)}
                onDoubleClick={onToggleMute}
                aria-label="Pengaturan Volume"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: isMuted ? 'var(--text-secondary)' : 'var(--text-primary)',
                }}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>

              {showVolumeSlider && (
                <div
                  className="absolute bottom-10 right-0 z-50 flex items-center gap-2 rounded-xl border p-2 shadow-xl"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <button
                    type="button"
                    onClick={onToggleMute}
                    className="p-1 text-xs"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => onChangeVolume(Number(e.target.value))}
                    className="h-1.5 w-20 cursor-pointer accent-emerald-600"
                    aria-label="Slider Volume"
                  />
                </div>
              )}
            </div>

            {/* Play / Pause Button */}
            <button
              type="button"
              onClick={onTogglePlayPause}
              aria-label={isPlaying ? 'Jeda Audio' : 'Lanjutkan Putar'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-md transition-transform active:scale-95"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>

            {/* Stop Button */}
            <button
              type="button"
              onClick={onStop}
              aria-label="Hentikan Audio"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              <Square className="h-3.5 w-3.5" />
            </button>

            {/* Expand / Collapse Details Button */}
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-label="Tampilkan detail audio"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border sm:hidden"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Info Drawer for Mobile / Small Screens */}
        {isExpanded && (
          <div
            className="border-t pt-2 text-xs flex flex-col gap-1 sm:hidden"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <div>
              Qari: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{qari.name}</span>
            </div>
            <div>
              Mode: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {repeatMode === 'none' ? 'Putar 1x Saja' : repeatMode === 'ayah' ? 'Ulang Ayat Terus Menerus' : 'Lanjut ke Ayat Berikutnya'}
              </span>
            </div>
            <div>
              Kecepatan: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{playbackSpeed}x</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
