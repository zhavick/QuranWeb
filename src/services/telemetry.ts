import type { ReaderSettings, BookmarkItem, LastReadState } from '../types/quran';

const API_BASE = '/api';

export async function logVisitorAccess(): Promise<void> {
  try {
    await fetch(`${API_BASE}/telemetry/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: new Date().toISOString() }),
    });
  } catch {
    // Graceful fallback if backend is offline or standalone static
  }
}

export async function logActivity(
  activityType: string,
  payload?: Record<string, unknown>
): Promise<void> {
  try {
    await fetch(`${API_BASE}/telemetry/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activity_type: activityType,
        payload: payload || {},
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Ignore network error in offline mode
  }
}

export async function syncStagingSettings(
  settings: ReaderSettings,
  bookmarks: BookmarkItem[],
  lastRead: LastReadState | null
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/settings/staging`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...settings,
        bookmarks,
        lastRead,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitJoinInterest(
  email?: string,
  notes?: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/register-interest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, notes }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface StagingSettingsResponse {
  found: boolean;
  settings?: {
    theme?: string;
    elder_mode?: boolean;
    arabic_font_size?: number;
    translation_font_size?: number;
    line_height?: number;
    arabic_font?: string;
    show_translation?: boolean;
    tajweed_enabled?: boolean;
    spotlight_enabled?: boolean;
    auto_scroll_speed?: number;
    bookmarks?: BookmarkItem[];
    last_read?: LastReadState | null;
  };
}

export async function fetchStagingSettings(): Promise<StagingSettingsResponse> {
  try {
    const res = await fetch(`${API_BASE}/settings/staging`);
    if (res.ok) {
      return (await res.json()) as StagingSettingsResponse;
    }
  } catch {
    // Backend offline / static mode
  }
  return { found: false };
}

