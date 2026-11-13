import React, { useState, useEffect, useRef } from 'react';
import {
  Headphones,
  Play,
  Pause,
  X,
  BookOpen,
  Volume2,
  Moon,
  Mic,
  Music,
} from 'lucide-react';
import type { AudioCapsuleItem } from '../../types/literacy';
import { fetchAudioCapsules } from '../../services/literacy';
import { logActivity } from '../../services/telemetry';

interface AudioCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  elderMode?: boolean;
}

export const AudioCapsuleModal: React.FC<AudioCapsuleModalProps> = ({
  isOpen,
  onClose,
  elderMode = false,
}) => {
  const [capsules, setCapsules] = useState<AudioCapsuleItem[]>([]);
  const [selectedCapsule, setSelectedCapsule] = useState<AudioCapsuleItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [useSpeechSynth, setUseSpeechSynth] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(240); // default 4 mins
  const [playbackRate, setPlaybackRate] = useState<number>(elderMode ? 0.75 : 1.0);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemainingSeconds, setSleepTimerRemainingSeconds] = useState<number | null>(null);
  const [fontSizeStep, setFontSizeStep] = useState<number>(elderMode ? 2 : 1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const synthTimerRef = useRef<any>(null);

  // Stop any active speech synthesis and audio
  const stopAllPlayback = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchAudioCapsules().then((list) => {
        setCapsules(list);
        if (list.length > 0 && !selectedCapsule) {
          setSelectedCapsule(list[0]);
        }
      });
      logActivity('OPEN_AUDIO_CAPSULE_MODAL');
    } else {
      stopAllPlayback();
    }
    return () => {
      stopAllPlayback();
    };
  }, [isOpen]);

  // Audio Playback Rate & Speech Rate Control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
    // If playing with speech synth, restart speaking with new rate
    if (isPlaying && useSpeechSynth && selectedCapsule) {
      speakTranscript(selectedCapsule.transcriptText, playbackRate);
    }
  }, [playbackRate]);

  // Speech Synthesis Speaker
  const speakTranscript = (text: string, rate: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean text of quotes and extra formatting for smoother narration
    const cleanText = text.replace(/[*#]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = rate;
    utterance.pitch = 0.95; // warm, comforting tone for storytelling

    // Try finding Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.startsWith('id') || v.lang.includes('ID'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);

    // Track simulated progress bar for speech synthesis
    if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    synthTimerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Sleep Timer Countdown
  useEffect(() => {
    if (sleepTimerMinutes === null) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setSleepTimerRemainingSeconds(null);
      return;
    }

    setSleepTimerRemainingSeconds(sleepTimerMinutes * 60);

    timerIntervalRef.current = setInterval(() => {
      setSleepTimerRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerIntervalRef.current);
          stopAllPlayback();
          setSleepTimerMinutes(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [sleepTimerMinutes]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!selectedCapsule) return;

    if (isPlaying) {
      stopAllPlayback();
    } else {
      if (useSpeechSynth) {
        speakTranscript(selectedCapsule.transcriptText, playbackRate);
      } else {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {
            // Fallback to speech synthesis if audio stream fails/offline
            speakTranscript(selectedCapsule.transcriptText, playbackRate);
          });
          setIsPlaying(true);
        }
      }
    }
  };

  const handleSelectCapsule = (item: AudioCapsuleItem) => {
    stopAllPlayback();
    setSelectedCapsule(item);
    setCurrentTime(0);
    setDuration(item.durationMinutes * 60);

    if (useSpeechSynth) {
      speakTranscript(item.transcriptText, playbackRate);
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        speakTranscript(item.transcriptText, playbackRate);
      });
      setIsPlaying(true);
    }
  };

  const handleClose = () => {
    stopAllPlayback();
    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatSleepTimer = (secs: number | null) => {
    if (secs === null || secs <= 0) return 'Nonaktif';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const fontClasses = ['text-xs sm:text-sm', 'text-sm sm:text-base', 'text-base sm:text-lg'];
  const activeFontClass = fontClasses[fontSizeStep] || fontClasses[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="flex flex-col w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Hidden Audio Element with Fallback Synth Source */}
        <audio
          ref={audioRef}
          src={selectedCapsule?.audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current && !useSpeechSynth) {
              setCurrentTime(audioRef.current.currentTime);
              setDuration(audioRef.current.duration || 240);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Header Modal */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold">
                  Audiobook Narasi Bertutur 3–5 Menit
                </h3>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: 'var(--bg-accent-soft)',
                    color: 'var(--text-accent)',
                  }}
                >
                  Ramah Lansia
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Solusi tadabbur hangat saat kelelahan mata, dilengkapi suara bertutur otomatis & pengatur waktu tidur
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border cursor-pointer hover:opacity-80"
            style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
            title="Tutup pemutar audiobook"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Konten Utama: Split Playlist & Active Player */}
        <div className="grid gap-4 md:grid-cols-12 flex-1 overflow-hidden p-4 sm:p-5">
          {/* KOLOM KIRI: Daftar Pilihan Narasi (Playlist) */}
          <div className="md:col-span-5 flex flex-col space-y-2.5 overflow-hidden border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
              <span>Kapsul Narasi Tersedia</span>
              <span className="font-mono text-emerald-500">{capsules.length} Rekaman</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {capsules.map((item) => {
                const isSelected = selectedCapsule?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectCapsule(item)}
                    className={`w-full text-left rounded-2xl border p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'hover:border-emerald-500/40'
                    }`}
                    style={{
                      backgroundColor: isSelected ? 'var(--bg-secondary)' : 'var(--bg-card)',
                      borderColor: isSelected ? undefined : 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
                      <span
                        className="rounded-md px-1.5 py-0.5 font-bold"
                        style={{
                          backgroundColor: 'var(--bg-accent-soft)',
                          color: 'var(--text-accent)',
                        }}
                      >
                        {item.categoryLabel}
                      </span>
                      <span className="font-mono font-semibold opacity-75">{item.durationMinutes} mnt</span>
                    </div>

                    <div className="text-xs font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>

                    <div className="text-[11px] mt-1 opacity-70 flex items-center justify-between">
                      <span>Oleh: {item.narratorName}</span>
                      {isSelected && isPlaying && (
                        <span className="flex items-center gap-1 text-emerald-500 font-bold text-[10px]">
                          <Volume2 className="h-3 w-3 animate-pulse" /> Sedang Diputar
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* KOLOM KANAN: Player Control & Naskah Narasi Bertutur */}
          <div className="md:col-span-7 flex flex-col space-y-3 overflow-hidden">
            {selectedCapsule ? (
              <>
                {/* Control Box Pemutar */}
                <div
                  className="rounded-2xl border p-4 shadow-sm space-y-3"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                        {selectedCapsule.title}
                      </h4>
                      <p className="text-xs opacity-75 mt-0.5">
                        Dituturkan oleh: <strong>{selectedCapsule.narratorName}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={togglePlay}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-accent)',
                        color: 'var(--text-on-accent)',
                      }}
                      title={isPlaying ? 'Jeda Audio' : 'Putar Audio'}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                    </button>
                  </div>

                  {/* Mode Suara: Web Speech vs Audio Stream */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl border bg-black/5 dark:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      <Volume2 className="h-3.5 w-3.5 text-emerald-500" />
                      Mode Suara:
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          stopAllPlayback();
                          setUseSpeechSynth(true);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          useSpeechSynth ? 'bg-emerald-600 text-white shadow-xs' : 'opacity-60 hover:opacity-100'
                        }`}
                        title="Membacakan naskah bahasa Indonesia dengan Web Speech API (100% Offline)"
                      >
                        <Mic className="h-3 w-3" />
                        Narasi AI (Offline)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          stopAllPlayback();
                          setUseSpeechSynth(false);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          !useSpeechSynth ? 'bg-emerald-600 text-white shadow-xs' : 'opacity-60 hover:opacity-100'
                        }`}
                        title="Streaming audio qari / narator dari server"
                      >
                        <Music className="h-3 w-3" />
                        Audio Qari (CDN)
                      </button>
                    </div>
                  </div>

                  {/* Progress Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCurrentTime(val);
                        if (!useSpeechSynth && audioRef.current) {
                          audioRef.current.currentTime = val;
                        }
                      }}
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 bg-gray-300 dark:bg-gray-700"
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono opacity-70">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Pengaturan Tempo (Ramah Lansia) & Sleep Timer */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    {/* Kecepatan Suara */}
                    <div className="rounded-xl border p-2 text-xs space-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                      <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        <span>Tempo Bicara:</span>
                        <span className="font-bold text-emerald-500">{playbackRate}x</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[0.75, 1.0, 1.25].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => setPlaybackRate(rate)}
                            className={`flex-1 rounded-lg py-0.5 text-[10px] font-bold transition-all cursor-pointer ${
                              playbackRate === rate ? 'bg-emerald-500 text-white' : 'bg-black/5 dark:bg-white/5 opacity-70'
                            }`}
                          >
                            {rate === 0.75 ? '0.75x (Lansia)' : `${rate}x`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sleep Timer */}
                    <div className="rounded-xl border p-2 text-xs space-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                      <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        <div className="flex items-center gap-1">
                          <Moon className="h-3 w-3 text-indigo-400" />
                          <span>Sleep Timer:</span>
                        </div>
                        <span className="font-mono text-amber-500 font-bold text-[10px]">
                          {formatSleepTimer(sleepTimerRemainingSeconds)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[null, 15, 30, 45].map((mins) => (
                          <button
                            key={String(mins)}
                            type="button"
                            onClick={() => setSleepTimerMinutes(mins)}
                            className={`flex-1 rounded-lg py-0.5 text-[10px] font-bold transition-all cursor-pointer ${
                              sleepTimerMinutes === mins ? 'bg-indigo-600 text-white' : 'bg-black/5 dark:bg-white/5 opacity-70'
                            }`}
                          >
                            {mins === null ? 'Mati' : `${mins}m`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Naskah Transkrip Bertutur */}
                <div className="flex-1 overflow-y-auto rounded-2xl border p-4 space-y-2.5 shadow-inner" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-1.5 font-bold text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <BookOpen className="h-4 w-4 text-emerald-500" />
                      <span>Naskah Narasi Bertutur</span>
                    </div>

                    {/* Pengatur Ukuran Font Teks */}
                    <div className="flex items-center rounded-xl border p-0.5 text-xs font-bold" style={{ borderColor: 'var(--border-color)' }}>
                      <button
                        type="button"
                        onClick={() => setFontSizeStep(0)}
                        className={`px-2 py-0.5 rounded-lg ${fontSizeStep === 0 ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'}`}
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontSizeStep(1)}
                        className={`px-2 py-0.5 rounded-lg ${fontSizeStep === 1 ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'}`}
                      >
                        A+
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontSizeStep(2)}
                        className={`px-2 py-0.5 rounded-lg ${fontSizeStep === 2 ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'}`}
                      >
                        A++
                      </button>
                    </div>
                  </div>

                  <div className={`font-serif leading-loose whitespace-pre-line text-justify ${activeFontClass}`} style={{ color: 'var(--text-primary)' }}>
                    {selectedCapsule.transcriptText}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center flex-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Pilih salah satu kapsul narasi di sebelah kiri untuk mulai mendengarkan.
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl px-4 py-2 text-xs font-bold cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-accent)',
              color: 'var(--text-on-accent)',
            }}
          >
            Tutup Pemutar
          </button>
        </div>
      </div>
    </div>
  );
};
