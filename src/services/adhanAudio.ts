// Service for Auto-Adhan Audio Player, Multi-Muadzin, and Browser Notifications
import {
  MuadzinInfo,
  PrayerAdhanSettings,
  ActiveAdhanState,
} from '../types/adhan';
import { logActivity } from './telemetry';

const ADHAN_SETTINGS_KEY = 'quranweb_adhan_settings';

export const MUADZIN_LIST: MuadzinInfo[] = [
  {
    id: 'makkah',
    name: 'Syaikh Ali Mulla (Masjidil Haram)',
    location: 'Makkah Al-Mukarramah',
    description: 'Lantunan azan legendaris Masjidil Haram yang khusyuk, megah, dan menggetarkan sanubari.',
    audioUrlFull: 'https://cdn.aladhan.com/audio/adhans/makkah.mp3',
    audioUrlTakbir: 'https://cdn.aladhan.com/audio/adhans/takbir-makkah.mp3',
  },
  {
    id: 'madinah',
    name: 'Syaikh Abdul Majid Surayhi (Masjid Nabawi)',
    location: 'Madinah Al-Munawwarah',
    description: 'Lantunan suara syahdu dan lembut penuh kehangatan dari kota Rasulullah SAW.',
    audioUrlFull: 'https://cdn.aladhan.com/audio/adhans/madina.mp3',
    audioUrlTakbir: 'https://cdn.aladhan.com/audio/adhans/takbir-makkah.mp3',
  },
  {
    id: 'alaqsa',
    name: 'Muadzin Masjid Al-Aqsa',
    location: 'Baitul Maqdis, Al-Quds',
    description: 'Kumandang azan penuh wibawa dan ketenangan dari kiblat pertama umat Islam.',
    audioUrlFull: 'https://cdn.aladhan.com/audio/adhans/alaqsa.mp3',
    audioUrlTakbir: 'https://cdn.aladhan.com/audio/adhans/takbir-makkah.mp3',
  },
  {
    id: 'nusantara',
    name: 'Muadzin Masjid Istiqlal / Kemenag RI',
    location: 'Nusantara, Indonesia',
    description: 'Langgam khas Nusantara yang menyejukkan hati dan akrab di telinga masyarakat Indonesia.',
    audioUrlFull: 'https://cdn.aladhan.com/audio/adhans/egypt.mp3',
    audioUrlTakbir: 'https://cdn.aladhan.com/audio/adhans/takbir-makkah.mp3',
  },
  {
    id: 'subuh_syahdu',
    name: 'Muadzin Khusus Subuh (Ash-shalatu khairum minan naum)',
    location: 'Masjidil Haram Makkah',
    description: 'Lantunan azan khusus waktu Subuh dengan tambahan lafadz "Ash-shalatu khairum minan naum".',
    audioUrlFull: 'https://cdn.aladhan.com/audio/adhans/fajr-makkah.mp3',
    audioUrlTakbir: 'https://cdn.aladhan.com/audio/adhans/takbir-makkah.mp3',
    isFajrSpecial: true,
  },
];

export const DEFAULT_ADHAN_SETTINGS: PrayerAdhanSettings = {
  autoAdhanEnabled: true,
  selectedMuadzin: 'makkah',
  fajrMuadzin: 'subuh_syahdu',
  volume: 0.85,
  prayerModes: {
    fajr: 'full',
    dhuhr: 'full',
    asr: 'full',
    maghrib: 'full',
    isha: 'full',
  },
  notificationsEnabled: true,
};

// Global audio element reference
let adhanAudioElement: HTMLAudioElement | null = null;
let activeAudioContext: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];

// Event listeners for UI modal
type AdhanTriggerCallback = (state: ActiveAdhanState) => void;
const listeners: Set<AdhanTriggerCallback> = new Set();

export function subscribeAdhanTrigger(cb: AdhanTriggerCallback): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function notifyListeners(state: ActiveAdhanState): void {
  listeners.forEach((cb) => cb(state));
}

// Load settings from localStorage
export function getAdhanSettings(): PrayerAdhanSettings {
  try {
    const raw = localStorage.getItem(ADHAN_SETTINGS_KEY);
    if (!raw) return DEFAULT_ADHAN_SETTINGS;
    return { ...DEFAULT_ADHAN_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ADHAN_SETTINGS;
  }
}

// Save settings to localStorage
export function saveAdhanSettings(settings: PrayerAdhanSettings): void {
  try {
    localStorage.setItem(ADHAN_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save adhan settings', e);
  }
}

// Request Browser Web Notification Permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  try {
    const perm = await Notification.requestPermission();
    const isGranted = perm === 'granted';
    const current = getAdhanSettings();
    saveAdhanSettings({ ...current, notificationsEnabled: isGranted });
    logActivity('REQUEST_NOTIFICATION_PERMISSION', { granted: isGranted });
    return isGranted;
  } catch {
    return false;
  }
}

// Show browser notification
export function showPrayerNotification(prayerName: string, message?: string): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(`🕌 Waktu Shalat ${prayerName} Telah Tiba`, {
      body: message || 'Mari sejenak menyucikan diri dan mendirikan shalat menghadap Allah SWT.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: `prayer-${prayerName.toLowerCase()}`,
      requireInteraction: false,
    });
  } catch (e) {
    console.error('Notification error', e);
  }
}

// Fallback Harmonic Chime Synthesizer using Web Audio API
export function playSyntheticChime(durationSec: number = 5): void {
  stopAdhan();
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    activeAudioContext = new AudioContextClass();
    const ctx = activeAudioContext;

    // Harmonic frequencies for gentle Islamic chime: E4 (329.63Hz), G#4 (415.30Hz), B4 (493.88Hz), E5 (659.25Hz)
    const freqs = [329.63, 415.3, 493.88, 659.25];
    activeOscillators = [];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + idx * 0.4;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + durationSec);
      activeOscillators.push(osc);
    });
  } catch (e) {
    console.warn('Web Audio API chime failed', e);
  }
}

/**
 * Play Adhan Audio with auto fallback and modal notification trigger
 */
export function triggerAdhan(
  prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha',
  prayerLabel: string,
  isManualPreview: boolean = false
): void {
  const settings = getAdhanSettings();
  if (!settings.autoAdhanEnabled && !isManualPreview) return;

  const mode = settings.prayerModes[prayerKey] || 'full';
  if (mode === 'mute' && !isManualPreview) {
    if (settings.notificationsEnabled) {
      showPrayerNotification(prayerLabel);
    }
    return;
  }

  // Determine muadzin
  const muadzinId = prayerKey === 'fajr' ? settings.fajrMuadzin : settings.selectedMuadzin;
  const muadzin = MUADZIN_LIST.find((m) => m.id === muadzinId) || MUADZIN_LIST[0];

  stopAdhan();

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  // Update last played key to prevent double play
  if (!isManualPreview) {
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    settings.lastPlayedKey = `${todayStr}_${prayerKey}`;
    saveAdhanSettings(settings);
  }

  // Trigger UI Modal
  notifyListeners({
    isOpen: true,
    prayerKey,
    prayerLabel,
    muadzinName: muadzin.name,
    muadzinLocation: muadzin.location,
    playMode: mode,
    audioUrl: mode === 'takbir' ? muadzin.audioUrlTakbir : muadzin.audioUrlFull,
    currentTimeFormatted: timeFormatted,
  });

  // Browser Notification
  if (settings.notificationsEnabled && !isManualPreview) {
    showPrayerNotification(
      prayerLabel,
      `Waktu shalat ${prayerLabel} (${timeFormatted} WIB) telah tiba. Dilantunkan oleh ${muadzin.name}.`
    );
  }

  // Audio Playback
  if (mode === 'beep') {
    playSyntheticChime(6);
    return;
  }

  // Full or Takbir mode: play HTML5 Audio with fallback
  try {
    const targetUrl = mode === 'takbir' ? muadzin.audioUrlTakbir : muadzin.audioUrlFull;
    adhanAudioElement = new Audio(targetUrl);
    adhanAudioElement.volume = settings.volume;

    const playPromise = adhanAudioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play prevented or offline, fallback to synthetic chime', err);
        playSyntheticChime(8);
      });
    }

    // Auto close audio on completion
    adhanAudioElement.onended = () => {
      stopAdhan();
    };
  } catch (err) {
    console.error('Audio initialization failed, using synthetic chime', err);
    playSyntheticChime(8);
  }

  logActivity('TRIGGER_ADHAN', { prayerKey, prayerLabel, mode, muadzin: muadzin.name });
}

/**
 * Stop any running adhan audio or synthesizer
 */
export function stopAdhan(): void {
  if (adhanAudioElement) {
    try {
      adhanAudioElement.pause();
      adhanAudioElement.currentTime = 0;
    } catch {
      // ignore
    }
    adhanAudioElement = null;
  }

  if (activeOscillators.length > 0) {
    activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    activeOscillators = [];
  }

  if (activeAudioContext) {
    try {
      activeAudioContext.close();
    } catch {
      // ignore
    }
    activeAudioContext = null;
  }
}
