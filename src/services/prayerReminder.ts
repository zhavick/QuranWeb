// Service for Step 29: Prayer Checklist & Tiered Smart Reminders
import {
  PrayerKey,
  PrayerAttendanceMode,
  SmartReminderSettings,
  ActiveReminderAlert,
  DetailedPrayerDailyRecord,
} from '../types/prayerReminder';
import {
  getPrayerTracking,
  savePrayerTracking,
} from './reportAnalytics';
import { logActivity } from './telemetry';

const REMINDER_SETTINGS_KEY = 'quranweb_prayer_reminder_settings';
const PRAYER_DETAILS_KEY = 'quranweb_prayer_attendance_details';

export const DEFAULT_REMINDER_SETTINGS: SmartReminderSettings = {
  enabled: true,
  reminder10m: true,
  reminder20m: true,
  customMinutes: 30,
  preExpiryWarning: true,
  soundAlert: true,
  vibrationAlert: true,
  notificationsEnabled: true,
  triggeredKeys: [],
};

export const PRAYER_DISPLAY_NAMES: Record<PrayerKey, string> = {
  fajr: 'Subuh',
  dhuhr: 'Dzuhur',
  asr: 'Ashar',
  maghrib: 'Maghrib',
  isha: 'Isya',
  dhuha: 'Dhuha',
  tahajud: 'Tahajud',
};

export const ATTENDANCE_MODE_LABELS: Record<PrayerAttendanceMode, { label: string; icon: string; desc: string }> = {
  mosque: {
    label: 'Berjamaah di Masjid',
    icon: '🕌',
    desc: 'Shalat fardhu berjamaah di masjid (pahala 27 derajat)',
  },
  home: {
    label: 'Munfarid / di Rumah',
    icon: '🏠',
    desc: 'Shalat sendiri atau berjamaah bersama keluarga di rumah',
  },
  ontime: {
    label: 'Tepat Waktu',
    icon: '⏰',
    desc: 'Ditunaikan di awal waktu shalat',
  },
  munfarid: {
    label: 'Sendiri (Munfarid)',
    icon: '👤',
    desc: 'Shalat sendiri dengan khusyuk',
  },
};

// Listeners for active floating banner / alert
type ReminderAlertListener = (alert: ActiveReminderAlert | null) => void;
const alertListeners = new Set<ReminderAlertListener>();
let currentActiveAlert: ActiveReminderAlert | null = null;

export function subscribeReminderAlert(listener: ReminderAlertListener): () => void {
  alertListeners.add(listener);
  // Send current state immediately
  listener(currentActiveAlert);
  return () => {
    alertListeners.delete(listener);
  };
}

function notifyAlertListeners(alert: ActiveReminderAlert | null): void {
  currentActiveAlert = alert;
  alertListeners.forEach((fn) => {
    try {
      fn(alert);
    } catch (e) {
      console.error('Error notifying reminder listener', e);
    }
  });
}

/**
 * Get stored settings or defaults
 */
export function getReminderSettings(): SmartReminderSettings {
  try {
    const raw = localStorage.getItem(REMINDER_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_REMINDER_SETTINGS };
    return { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_REMINDER_SETTINGS };
  }
}

/**
 * Save settings to localStorage
 */
export function saveReminderSettings(settings: SmartReminderSettings): void {
  try {
    localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save reminder settings', e);
  }
}

/**
 * Play a gentle 2-tone reminder chime using Web Audio API
 */
export function playReminderChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    
    // First tone (D5 - 587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Second tone (A5 - 880 Hz) - higher, pleasant chime
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.18);
    gain2.gain.setValueAtTime(0.25, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.85);

    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        // ignore
      }
    }, 1200);
  } catch (e) {
    console.warn('Web Audio reminder chime error', e);
  }
}

/**
 * Send Web Notification for smart reminder
 */
export function showReminderNotification(title: string, body: string): void {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'quranweb-prayer-reminder',
        renotify: true,
        vibrate: [100, 50, 100],
      } as NotificationOptions);
    }
  } catch (e) {
    console.warn('Web Notification failed', e);
  }
}

/**
 * Get prayer attendance details map
 */
export function getPrayerAttendanceDetails(dateStr: string): Partial<Record<PrayerKey, { mode: PrayerAttendanceMode; timestamp: string; notes?: string }>> {
  try {
    const raw = localStorage.getItem(PRAYER_DETAILS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed[dateStr] || {};
  } catch {
    return {};
  }
}

/**
 * Save prayer attendance details
 */
export function savePrayerAttendanceDetail(
  dateStr: string,
  prayerKey: PrayerKey,
  mode: PrayerAttendanceMode,
  notes?: string
): void {
  try {
    const raw = localStorage.getItem(PRAYER_DETAILS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed[dateStr]) parsed[dateStr] = {};
    parsed[dateStr][prayerKey] = {
      mode,
      timestamp: new Date().toISOString(),
      notes,
    };
    localStorage.setItem(PRAYER_DETAILS_KEY, JSON.stringify(parsed));
  } catch (e) {
    console.error('Failed to save prayer attendance detail', e);
  }
}

/**
 * Remove attendance detail
 */
export function removePrayerAttendanceDetail(dateStr: string, prayerKey: PrayerKey): void {
  try {
    const raw = localStorage.getItem(PRAYER_DETAILS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed[dateStr] && parsed[dateStr][prayerKey]) {
      delete parsed[dateStr][prayerKey];
      localStorage.setItem(PRAYER_DETAILS_KEY, JSON.stringify(parsed));
    }
  } catch (e) {
    console.error('Failed to remove prayer attendance detail', e);
  }
}

/**
 * Mark prayer as checked with attendance mode, auto-clearing reminders
 */
export function checkPrayerWithAttendance(
  dateStr: string,
  prayerKey: PrayerKey,
  mode: PrayerAttendanceMode,
  notes?: string
): DetailedPrayerDailyRecord {
  const all = getPrayerTracking();
  const existing = all[dateStr] || {
    date: dateStr,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    dhuha: false,
    tahajud: false,
    rawatib: false,
  };

  const updated = {
    ...existing,
    [prayerKey]: true,
  };

  all[dateStr] = updated;
  savePrayerTracking(all);
  savePrayerAttendanceDetail(dateStr, prayerKey, mode, notes);

  // Auto-clear active alert if it was for this prayer
  if (currentActiveAlert && currentActiveAlert.prayerKey === prayerKey) {
    notifyAlertListeners(null);
  }

  // Auto-mark remaining reminders for this prayer today as dismissed/triggered
  // so no further reminders ring today for this completed prayer
  const settings = getReminderSettings();
  const keysToMark = [
    `${dateStr}_${prayerKey}_10m`,
    `${dateStr}_${prayerKey}_20m`,
    `${dateStr}_${prayerKey}_custom`,
    `${dateStr}_${prayerKey}_pre_expiry`,
  ];
  const newTriggered = Array.from(new Set([...settings.triggeredKeys, ...keysToMark]));
  saveReminderSettings({
    ...settings,
    triggeredKeys: newTriggered,
  });

  // Haptic feedback
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate([40, 30, 40]);
    } catch {
      // ignore
    }
  }

  // Dispatch custom storage event for live UI update across components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('quranweb_prayer_tracking_updated'));
  }

  logActivity('CHECK_PRAYER_ATTENDANCE', { dateStr, prayerKey, mode });

  return {
    ...updated,
    details: getPrayerAttendanceDetails(dateStr),
  };
}

/**
 * Uncheck prayer
 */
export function uncheckPrayer(dateStr: string, prayerKey: PrayerKey): void {
  const all = getPrayerTracking();
  if (!all[dateStr]) return;

  all[dateStr][prayerKey] = false;
  savePrayerTracking(all);
  removePrayerAttendanceDetail(dateStr, prayerKey);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('quranweb_prayer_tracking_updated'));
  }
}

/**
 * Dismiss current active alert
 */
export function dismissActiveReminder(): void {
  notifyAlertListeners(null);
}

export interface PrayerTimeSlot {
  key: PrayerKey;
  label: string;
  time: Date;
  nextPrayerKey?: PrayerKey;
  nextPrayerLabel?: string;
  nextPrayerTime?: Date;
}

/**
 * Core monitoring loop: checks prayer times against current time and triggers tiered reminders
 */
export function checkAndTriggerReminders(
  slots: PrayerTimeSlot[],
  now: Date = new Date()
): ActiveReminderAlert | null {
  const settings = getReminderSettings();
  if (!settings.enabled) return null;

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const allTracking = getPrayerTracking();
  const todayTracking = allTracking[todayStr] || {
    date: todayStr,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  };

  const triggeredSet = new Set(settings.triggeredKeys);
  let newlyTriggeredKey: string | null = null;
  let newAlert: ActiveReminderAlert | null = null;

  for (const slot of slots) {
    const isChecked = !!todayTracking[slot.key];

    // If prayer is checked, skip all reminders for it (Auto-Clear)
    if (isChecked) continue;

    const startTime = slot.time.getTime();
    const nowTime = now.getTime();

    // Has this prayer started?
    if (nowTime < startTime) continue;

    const elapsedMinutes = Math.floor((nowTime - startTime) / 60000);

    // If next prayer has already started, this prayer's window has passed
    if (slot.nextPrayerTime && nowTime >= slot.nextPrayerTime.getTime()) {
      continue;
    }

    // 1. Reminder I: 10 minutes elapsed
    const key10m = `${todayStr}_${slot.key}_10m`;
    if (settings.reminder10m && elapsedMinutes >= 10 && elapsedMinutes < 20 && !triggeredSet.has(key10m)) {
      newlyTriggeredKey = key10m;
      newAlert = {
        id: key10m,
        prayerKey: slot.key,
        prayerLabel: slot.label,
        type: '10m',
        title: `Pengingat: Waktu Shalat ${slot.label}`,
        message: `Waktu ${slot.label} telah berjalan 10 menit. Mari sejenak mengambil air wudhu dan bersiap shalat.`,
        timestamp: now.toISOString(),
      };
      break;
    }

    // 2. Reminder II: 20 minutes elapsed
    const key20m = `${todayStr}_${slot.key}_20m`;
    if (settings.reminder20m && elapsedMinutes >= 20 && !triggeredSet.has(key20m)) {
      // If custom is configured and before this, or default 20m window
      if (!settings.customMinutes || elapsedMinutes < settings.customMinutes || settings.customMinutes > 20) {
        newlyTriggeredKey = key20m;
        newAlert = {
          id: key20m,
          prayerKey: slot.key,
          prayerLabel: slot.label,
          type: '20m',
          title: `Pengingat Khusyuk: Shalat ${slot.label}`,
          message: `Waktu ${slot.label} telah berjalan 20 menit. Dirikanlah shalat tepat waktu untuk ketenangan jiwa.`,
          timestamp: now.toISOString(),
        };
        break;
      }
    }

    // 3. Custom Reminder (e.g. 30m / 45m)
    if (settings.customMinutes > 0) {
      const keyCustom = `${todayStr}_${slot.key}_custom`;
      if (elapsedMinutes >= settings.customMinutes && !triggeredSet.has(keyCustom)) {
        newlyTriggeredKey = keyCustom;
        newAlert = {
          id: keyCustom,
          prayerKey: slot.key,
          prayerLabel: slot.label,
          type: 'custom',
          title: `Pengingat Tambahan: Shalat ${slot.label}`,
          message: `Waktu ${slot.label} telah berjalan ${settings.customMinutes} menit. Jangan tunda shalat Anda.`,
          timestamp: now.toISOString(),
        };
        break;
      }
    }

    // 4. Pre-Expiry Warning (15 minutes before next prayer)
    if (settings.preExpiryWarning && slot.nextPrayerTime) {
      const keyPreExpiry = `${todayStr}_${slot.key}_pre_expiry`;
      const minutesUntilNext = Math.floor((slot.nextPrayerTime.getTime() - nowTime) / 60000);

      if (minutesUntilNext > 0 && minutesUntilNext <= 15 && !triggeredSet.has(keyPreExpiry)) {
        newlyTriggeredKey = keyPreExpiry;
        const nextName = slot.nextPrayerLabel || 'berikutnya';
        newAlert = {
          id: keyPreExpiry,
          prayerKey: slot.key,
          prayerLabel: slot.label,
          type: 'pre_expiry',
          title: `Perhatian: Waktu ${slot.label} Segera Berakhir!`,
          message: `Waktu ${slot.label} tersisa ${minutesUntilNext} menit lagi sebelum masuk ${nextName}. Mari segera tunaikan shalat.`,
          timestamp: now.toISOString(),
        };
        break;
      }
    }
  }

  // If a new reminder was triggered:
  if (newlyTriggeredKey && newAlert) {
    // Record triggered key
    triggeredSet.add(newlyTriggeredKey);
    saveReminderSettings({
      ...settings,
      triggeredKeys: Array.from(triggeredSet),
    });

    // Audio chime
    if (settings.soundAlert) {
      playReminderChime();
    }

    // Vibration
    if (settings.vibrationAlert && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // ignore
      }
    }

    // Web Notification
    if (settings.notificationsEnabled) {
      showReminderNotification(newAlert.title, newAlert.message);
    }

    // Show floating alert in app
    notifyAlertListeners(newAlert);

    logActivity('TRIGGER_PRAYER_REMINDER', {
      prayerKey: newAlert.prayerKey,
      type: newAlert.type,
      title: newAlert.title,
    });

    return newAlert;
  }

  return null;
}
