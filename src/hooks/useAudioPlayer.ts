import { useState, useRef, useEffect, useCallback } from 'react';
import type { Ayah } from '../types/quran';

export interface QariOption {
  id: string;
  name: string;
  edition: string;
}

export const QARI_OPTIONS: QariOption[] = [
  { id: 'alafasy', name: 'Syaikh Mishary Rashid Alafasy', edition: 'ar.alafasy' },
  { id: 'husary', name: 'Syaikh Mahmoud Khalil Al-Husary (Tartil)', edition: 'ar.husary' },
  { id: 'minshawi', name: 'Syaikh Muhammad Siddiq Al-Minshawi', edition: 'ar.minshawi' },
  { id: 'sudais', name: 'Syaikh Abdurrahman As-Sudais', edition: 'ar.abdurrahmaansudais' },
  { id: 'shaatree', name: 'Syaikh Abu Bakr Asy-Syathiri', edition: 'ar.shaatree' },
];

export type RepeatMode = 'none' | 'ayah' | 'list';
export type PlaybackSpeed = 0.75 | 1.0 | 1.25 | 1.5;

export function useAudioPlayer(ayahs: Ayah[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [qari, setQari] = useState<QariOption>(QARI_OPTIONS[0]);
  const [playingAyahId, setPlayingAyahId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('list');
  const [playbackSpeed, setPlaybackSpeedState] = useState<PlaybackSpeed>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const ayahsRef = useRef(ayahs);
  ayahsRef.current = ayahs;

  const repeatRef = useRef(repeatMode);
  repeatRef.current = repeatMode;

  const qariRef = useRef(qari);
  qariRef.current = qari;

  const speedRef = useRef(playbackSpeed);
  speedRef.current = playbackSpeed;

  const getAudioUrl = useCallback((globalAyahId: number, edition: string) => {
    return `https://cdn.islamic.network/quran/audio/128/${edition}/${globalAyahId}.mp3`;
  }, []);

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }
    return audioRef.current;
  }, []);

  const playAyah = useCallback(
    (globalAyahId: number) => {
      const audio = initAudio();
      setAudioError(null);
      const url = getAudioUrl(globalAyahId, qariRef.current.edition);
      audio.src = url;
      audio.playbackRate = speedRef.current;
      audio.muted = isMuted;
      audio.volume = volume;

      setPlayingAyahId(globalAyahId);
      setIsPlaying(true);
      setCurrentTime(0);

      audio.play().catch((err) => {
        console.warn('Audio playback error:', err);
        setIsPlaying(false);
        setAudioError('Koneksi audio gagal dimuat. Periksa sambungan internet Anda.');
      });
    },
    [getAudioUrl, initAudio, isMuted, volume]
  );

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || playingAyahId === null) {
      if (ayahsRef.current.length > 0) {
        playAyah(ayahsRef.current[0].id);
      }
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          setAudioError('Gagal memutar audio.');
        });
    }
  }, [isPlaying, playingAyahId, playAyah]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setPlayingAyahId(null);
    setCurrentTime(0);
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  const setPlaybackSpeed = useCallback((speed: PlaybackSpeed) => {
    setPlaybackSpeedState(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      if (clamped === 0) {
        audioRef.current.muted = true;
        setIsMuted(true);
      } else if (audioRef.current.muted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const next = !audioRef.current.muted;
      audioRef.current.muted = next;
      setIsMuted(next);
    } else {
      setIsMuted((prev) => !prev);
    }
  }, []);

  const changeQari = useCallback(
    (newQari: QariOption) => {
      setQari(newQari);
      qariRef.current = newQari;
      if (playingAyahId !== null && isPlaying) {
        playAyah(playingAyahId);
      }
    },
    [playingAyahId, isPlaying, playAyah]
  );

  // Setup audio event listeners
  useEffect(() => {
    const audio = initAudio();

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (playingAyahId === null) return;
      if (repeatRef.current === 'ayah') {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        return;
      }
      const list = ayahsRef.current;
      const idx = list.findIndex((a) => a.id === playingAyahId);
      if (idx >= 0 && idx + 1 < list.length) {
        const nextAyah = list[idx + 1];
        playAyah(nextAyah.id);
        // Smooth scroll next ayah into view
        const el = document.getElementById(`ayah-${nextAyah.surahId}-${nextAyah.ayahNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (repeatRef.current === 'list' && list.length > 0) {
        playAyah(list[0].id);
        const el = document.getElementById(`ayah-${list[0].surahId}-${list[0].ayahNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        setIsPlaying(false);
        setPlayingAyahId(null);
        setCurrentTime(0);
      }
    };

    const handleError = () => {
      setIsPlaying(false);
      setAudioError('Terjadi kendala saat memuat audio qari.');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [playingAyahId, playAyah, initAudio]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return {
    qari,
    setQari: changeQari,
    playingAyahId,
    isPlaying,
    repeatMode,
    setRepeatMode,
    playbackSpeed,
    setPlaybackSpeed,
    currentTime,
    duration,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    seekTo,
    playAyah,
    togglePlayPause,
    stopAudio,
    audioError,
    clearAudioError: () => setAudioError(null),
  };
}
