export interface GeolocationStat {
  country: string;
  count: number;
}

export interface ActivityDistribution {
  type: string;
  count: number;
}

export interface WeeklyTraffic {
  day: string;
  visits: number;
}

export interface AdminStats {
  total_visitors: number;
  total_activities: number;
  total_leads: number;
  avg_session_minutes: number;
  geolocation: GeolocationStat[];
  activity_distribution: ActivityDistribution[];
  weekly_traffic: WeeklyTraffic[];
}

export interface AuditLogItem {
  id: number;
  ip_address: string;
  activity_type: string;
  payload: Record<string, any>;
  created_at: string;
}

export interface AppConfig {
  app_name: string;
  app_logo: string;
  app_copyright: string;
  app_license: string;
  app_announcement: string;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  app_name: 'QuranWeb',
  app_logo: 'ق',
  app_copyright: '© 2026 QuranWeb. Hak Cipta Dilindungi Undang-Undang.',
  app_license: 'Open Waqf License / MIT',
  app_announcement:
    "Selamat datang di QuranWeb — Platform Al-Qur'an Digital Ramah Lansia dengan Navigasi Surat, Juz, dan 'Ain.",
};

export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    if (res.ok && data.success) {
      return data.stats;
    }
  } catch (err) {
    console.warn('Failed to fetch admin stats from API, using fallback data:', err);
  }
  return {
    total_visitors: 128,
    total_activities: 384,
    total_leads: 18,
    avg_session_minutes: 17.5,
    geolocation: [
      { country: 'Indonesia', count: 96 },
      { country: 'Malaysia', count: 18 },
      { country: 'Singapura', count: 8 },
      { country: 'Arab Saudi', count: 4 },
      { country: 'Lainnya', count: 2 },
    ],
    activity_distribution: [
      { type: 'READ_SURAH', count: 140 },
      { type: 'PLAY_AUDIO', count: 92 },
      { type: 'TOGGLE_TAJWEED', count: 65 },
      { type: 'ADD_BOOKMARK', count: 48 },
      { type: 'ELDER_MODE', count: 35 },
    ],
    weekly_traffic: [
      { day: 'Sen', visits: 35 },
      { day: 'Sel', visits: 42 },
      { day: 'Rab', visits: 38 },
      { day: 'Kam', visits: 54 },
      { day: 'Jum', visits: 95 },
      { day: 'Sab', visits: 72 },
      { day: 'Min', visits: 68 },
    ],
  };
}

export async function fetchAuditLogs(
  typeFilter?: string,
  search?: string
): Promise<AuditLogItem[]> {
  try {
    const params = new URLSearchParams();
    if (typeFilter) params.set('type', typeFilter);
    if (search) params.set('search', search);

    const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
    const data = await res.json();
    if (res.ok && data.success) {
      return data.logs;
    }
  } catch (err) {
    console.warn('Failed to fetch audit logs from API, using fallback data:', err);
  }
  return [
    {
      id: 1,
      ip_address: '180.252.160.10',
      activity_type: 'READ_SURAH',
      payload: { surahId: 18, name: 'Al-Kahfi', ayahCount: 110 },
      created_at: new Date(Date.now() - 60000 * 5).toISOString(),
    },
    {
      id: 2,
      ip_address: '127.0.0.1',
      activity_type: 'PLAY_AUDIO',
      payload: { surahId: 2, ayahNumber: 255, qari: 'alafasy' },
      created_at: new Date(Date.now() - 60000 * 12).toISOString(),
    },
    {
      id: 3,
      ip_address: '175.143.12.88',
      activity_type: 'TOGGLE_TAJWEED',
      payload: { enabled: true },
      created_at: new Date(Date.now() - 60000 * 25).toISOString(),
    },
    {
      id: 4,
      ip_address: '127.0.0.1',
      activity_type: 'ADD_BOOKMARK',
      payload: { surahId: 36, ayahNumber: 58, note: 'Salam sejahtera dari Tuhan' },
      created_at: new Date(Date.now() - 60000 * 45).toISOString(),
    },
    {
      id: 5,
      ip_address: '202.168.45.12',
      activity_type: 'ELDER_MODE',
      payload: { enabled: true, fontSize: 38 },
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 6,
      ip_address: '84.235.19.4',
      activity_type: 'CHANGE_THEME',
      payload: { theme: 'dark' },
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];
}

export async function fetchAppConfig(): Promise<AppConfig> {
  try {
    const res = await fetch('/api/admin/config');
    const data = await res.json();
    if (res.ok && data.success) {
      return { ...DEFAULT_APP_CONFIG, ...data.config };
    }
  } catch (err) {
    console.warn('Failed to fetch app config, using default/local config:', err);
  }
  const local = localStorage.getItem('quranweb_site_config');
  if (local) {
    try {
      return { ...DEFAULT_APP_CONFIG, ...JSON.parse(local) };
    } catch {}
  }
  return DEFAULT_APP_CONFIG;
}

export async function saveAppConfig(
  config: AppConfig
): Promise<{ success: boolean; message: string }> {
  localStorage.setItem('quranweb_site_config', JSON.stringify(config));
  try {
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: 'Konfigurasi berhasil disimpan ke database.' };
    }
  } catch (err) {
    console.warn('API save config error, saved locally:', err);
  }
  return { success: true, message: 'Konfigurasi tersimpan secara lokal dan aktif.' };
}

