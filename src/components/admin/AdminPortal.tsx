import React, { useState, useEffect } from 'react';
import {
  Shield,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
  Users,
  Clock,
  Activity,
  Globe2,
  RefreshCw,
  Search,
  CheckCircle2,
  Lock,
  Download,
  AlertCircle,
} from 'lucide-react';
import {
  fetchAdminStats,
  fetchAuditLogs,
  fetchAppConfig,
  saveAppConfig,
  type AdminStats,
  type AuditLogItem,
  type AppConfig,
  DEFAULT_APP_CONFIG,
} from '../../services/admin';
import { getStoredUser, loginUser, logoutUser, type AuthUser } from '../../services/auth';

interface AdminPortalProps {
  onBackToApp: () => void;
  onConfigChange?: (config: AppConfig) => void;
}

type AdminTab = 'overview' | 'audit' | 'config';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToApp,
  onConfigChange,
}) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getStoredUser());
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditFilter, setAuditFilter] = useState('ALL');
  const [auditSearch, setAuditSearch] = useState('');
  const [appConfig, setAppConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [savingConfig, setSavingConfig] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadData = async () => {
    const s = await fetchAdminStats();
    setStats(s);
    setLoadingAudit(true);
    const logs = await fetchAuditLogs();
    setAuditLogs(logs);
    setLoadingAudit(false);
    const cfg = await fetchAppConfig();
    setAppConfig(cfg);
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      loadData();
    }
  }, [currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await loginUser(usernameInput, passwordInput);
    if (res.success && res.user) {
      if (res.user.role !== 'admin') {
        setLoginError('Akun ini tidak memiliki hak akses administrator.');
        logoutUser();
        return;
      }
      setCurrentUser(res.user);
    } else {
      setLoginError(res.message || 'Login gagal. Periksa username dan password.');
    }
  };

  const fillAdminCredentials = () => {
    setUsernameInput('admin');
    setPasswordInput('admin123');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleRefreshAudit = async () => {
    setLoadingAudit(true);
    const logs = await fetchAuditLogs(auditFilter === 'ALL' ? undefined : auditFilter, auditSearch);
    setAuditLogs(logs);
    setLoadingAudit(false);
    showToast('Audit log berhasil diperbarui.');
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    const res = await saveAppConfig(appConfig);
    setSavingConfig(false);
    showToast(res.message);
    if (onConfigChange) {
      onConfigChange(appConfig);
    }
  };

  const exportAuditLogs = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `audit_trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Audit log berhasil diekspor ke JSON.');
  };

  // ==========================================
  // VIEW: ADMIN LOGIN
  // ==========================================
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div
        className="flex min-h-screen items-center justify-center p-4"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <div
          className="w-full max-w-md rounded-2xl border p-6 shadow-2xl sm:p-8"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="mb-6 text-center">
            <div
              className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg"
              style={{ backgroundColor: 'var(--bg-accent)' }}
            >
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold sm:text-2xl" style={{ color: 'var(--text-primary)' }}>
              Portal Administrator
            </h1>
            <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              Masuk untuk mengelola telemetri, audit trail, dan konfigurasi situs
            </p>
          </div>

          {/* Preset Demo Box */}
          <div
            className="mb-5 rounded-xl border p-3 text-xs leading-relaxed"
            style={{
              backgroundColor: 'var(--bg-accent-soft)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <div className="font-bold flex items-center justify-between">
              <span>🔐 Kredensial Administrator:</span>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="underline hover:text-emerald-500 font-semibold cursor-pointer"
              >
                Gunakan Otomatis
              </button>
            </div>
            <div className="mt-1 font-mono text-[11px] space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
              <div>Username: <span className="font-bold text-emerald-600 dark:text-emerald-400">admin</span></div>
              <div>Password: <span className="font-bold text-emerald-600 dark:text-emerald-400">admin123</span></div>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-xs text-red-500 border border-red-500/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                Username / Email
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold shadow-md transition-transform active:scale-98"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              <Lock className="h-4 w-4" />
              <span>Masuk Dashboard Admin</span>
            </button>
          </form>

          <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: 'var(--border-color)' }}>
            <button
              type="button"
              onClick={onBackToApp}
              className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Beranda Al-Qur&apos;an</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top Admin Header */}
      <header
        className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm"
            style={{ backgroundColor: 'var(--bg-accent)' }}
          >
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {appConfig.app_name} Admin
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  color: 'var(--text-accent)',
                }}
              >
                Superadmin
              </span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              {currentUser.full_name} ({currentUser.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToApp}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Web Al-Qur&apos;an</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Admin Nav Tabs */}
      <div
        className="border-b px-4 sm:px-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
              activeTab === 'overview'
                ? 'shadow-xs'
                : 'hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            style={{
              backgroundColor: activeTab === 'overview' ? 'var(--bg-accent)' : 'transparent',
              color: activeTab === 'overview' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
            }}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Ikhtisar &amp; Statistik</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
              activeTab === 'audit'
                ? 'shadow-xs'
                : 'hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            style={{
              backgroundColor: activeTab === 'audit' ? 'var(--bg-accent)' : 'transparent',
              color: activeTab === 'audit' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
            }}
          >
            <FileText className="h-4 w-4" />
            <span>Audit Trail Penuh</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
              activeTab === 'config'
                ? 'shadow-xs'
                : 'hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            style={{
              backgroundColor: activeTab === 'config' ? 'var(--bg-accent)' : 'transparent',
              color: activeTab === 'config' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
            }}
          >
            <Settings className="h-4 w-4" />
            <span>Konfigurasi Situs</span>
          </button>
        </div>
      </div>

      {/* Admin Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* TAB 1: OVERVIEW & STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <div
                  className="rounded-2xl border p-4 shadow-sm"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span>Total Pembaca (IP)</span>
                    <Users className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="mt-2 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                    {stats?.total_visitors ?? 0}
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ↑ 14% dari minggu lalu
                  </div>
                </div>

                <div
                  className="rounded-2xl border p-4 shadow-sm"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span>Rata-rata Sesi</span>
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="mt-2 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                    {stats?.avg_session_minutes ?? 15} <span className="text-sm font-semibold">menit</span>
                  </div>
                  <div className="mt-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    Durasi tilawah aktif
                  </div>
                </div>

                <div
                  className="rounded-2xl border p-4 shadow-sm"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span>Total Aktivitas</span>
                    <Activity className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="mt-2 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                    {stats?.total_activities ?? 0}
                  </div>
                  <div className="mt-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    Log tercatat di PostgreSQL
                  </div>
                </div>

                <div
                  className="rounded-2xl border p-4 shadow-sm"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span>Pendaftar Akun</span>
                    <Shield className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="mt-2 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                    {stats?.total_leads ?? 0}
                  </div>
                  <div className="mt-1 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    Dari popup ajakan bergabung
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Geolocation IP Breakdown Chart */}
                <div
                  className="rounded-2xl border p-5 shadow-sm"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-2">
                      <Globe2 className="h-5 w-5" style={{ color: 'var(--text-accent)' }} />
                      <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        Geolokasi Pengunjung (Berdasarkan IP)
                      </h3>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Distribusi Wilayah
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {stats?.geolocation.map((geo) => {
                      const total = stats.geolocation.reduce((a, b) => a + b.count, 0) || 1;
                      const pct = Math.round((geo.count / total) * 100);
                      return (
                        <div key={geo.country} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span style={{ color: 'var(--text-primary)' }}>{geo.country}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {geo.count} pengunjung ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-black/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: 'var(--bg-accent)',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Weekly Traffic Trend Bar Chart */}
                <div
                  className="rounded-2xl border p-5 shadow-sm"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" style={{ color: 'var(--text-accent)' }} />
                      <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        Tren Kunjungan Harian (Senin - Minggu)
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Puncak Hari Jum&apos;at
                    </span>
                  </div>

                  <div className="flex h-44 items-end justify-between gap-2 pt-6">
                    {stats?.weekly_traffic.map((item) => {
                      const maxVal = Math.max(...(stats.weekly_traffic.map((w) => w.visits) || [100]));
                      const heightPct = Math.round((item.visits / maxVal) * 100);
                      const isPeak = item.day === 'Jum';
                      return (
                        <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                          <span className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                            {item.visits}
                          </span>
                          <div className="h-28 w-full max-w-[28px] rounded-t-lg bg-black/10 flex items-end overflow-hidden">
                            <div
                              className="w-full rounded-t-lg transition-all duration-500"
                              style={{
                                height: `${heightPct}%`,
                                backgroundColor: isPeak ? 'var(--bg-accent)' : 'var(--text-secondary)',
                                opacity: isPeak ? 1 : 0.6,
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold" style={{ color: isPeak ? 'var(--text-accent)' : 'var(--text-primary)' }}>
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT TRAIL MODULE */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              {/* Controls & Search Bar */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari IP, aktivitas, atau surat..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="w-full rounded-xl border pl-9 pr-3 py-1.5 text-xs outline-none"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>

                  <select
                    value={auditFilter}
                    onChange={(e) => setAuditFilter(e.target.value)}
                    className="rounded-xl border px-3 py-1.5 text-xs font-semibold outline-none"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="ALL">Semua Aktivitas</option>
                    <option value="READ_SURAH">Baca Surat</option>
                    <option value="PLAY_AUDIO">Putar Audio</option>
                    <option value="TOGGLE_TAJWEED">Toggle Tajwid</option>
                    <option value="ADD_BOOKMARK">Simpan Bookmark</option>
                    <option value="ELDER_MODE">Mode Lansia</option>
                    <option value="CHANGE_THEME">Ganti Tema</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRefreshAudit}
                    className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingAudit ? 'animate-spin' : ''}`} />
                    <span>Segarkan</span>
                  </button>

                  <button
                    type="button"
                    onClick={exportAuditLogs}
                    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold"
                    style={{
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--text-on-accent)',
                    }}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Ekspor JSON</span>
                  </button>
                </div>
              </div>

              {/* Audit Log Table */}
              <div
                className="rounded-2xl border shadow-sm overflow-hidden"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead
                      className="border-b uppercase font-bold text-[10px] tracking-wider"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Waktu Akses</th>
                        <th className="px-4 py-3">Alamat IP</th>
                        <th className="px-4 py-3">Jenis Kegiatan</th>
                        <th className="px-4 py-3">Detail Payload</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Tidak ada log aktivitas yang cocok dengan kriteria filter.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 font-mono font-semibold" style={{ color: 'var(--text-secondary)' }}>
                              #{log.id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-mono" style={{ color: 'var(--text-secondary)' }}>
                              {new Date(log.created_at).toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {log.ip_address}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold"
                                style={{
                                  backgroundColor: 'var(--bg-accent-soft)',
                                  color: 'var(--text-accent)',
                                }}
                              >
                                {log.activity_type}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px] max-w-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                              {JSON.stringify(log.payload || {})}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SITE CONFIGURATION MODULE */}
          {activeTab === 'config' && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Form Input */}
              <div
                className="lg:col-span-2 rounded-2xl border p-6 shadow-sm"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <div className="border-b pb-3 mb-5" style={{ borderColor: 'var(--border-color)' }}>
                  <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    Pengaturan Identitas &amp; Pengumuman Aplikasi
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Perubahan konfigurasi disimpan ke database dan langsung aktif pada situs
                  </p>
                </div>

                <form onSubmit={handleSaveConfig} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        Nama Aplikasi
                      </label>
                      <input
                        type="text"
                        value={appConfig.app_name}
                        onChange={(e) => setAppConfig({ ...appConfig, app_name: e.target.value })}
                        className="w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none"
                        style={{
                          backgroundColor: 'var(--bg-muted)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        Logo / Simbol Kaligrafi
                      </label>
                      <input
                        type="text"
                        value={appConfig.app_logo}
                        onChange={(e) => setAppConfig({ ...appConfig, app_logo: e.target.value })}
                        className="w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none font-arabic-amiri text-lg"
                        style={{
                          backgroundColor: 'var(--bg-muted)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Teks Hak Cipta (Copyright)
                    </label>
                    <input
                      type="text"
                      value={appConfig.app_copyright}
                      onChange={(e) => setAppConfig({ ...appConfig, app_copyright: e.target.value })}
                      className="w-full rounded-xl border px-3.5 py-2 text-xs outline-none"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Lisensi Aplikasi
                    </label>
                    <input
                      type="text"
                      value={appConfig.app_license}
                      onChange={(e) => setAppConfig({ ...appConfig, app_license: e.target.value })}
                      className="w-full rounded-xl border px-3.5 py-2 text-xs outline-none"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Pesan Pengumuman Pengguna (Broadcast Banner)
                    </label>
                    <textarea
                      rows={3}
                      value={appConfig.app_announcement}
                      onChange={(e) => setAppConfig({ ...appConfig, app_announcement: e.target.value })}
                      className="w-full rounded-xl border p-3 text-xs outline-none leading-relaxed"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingConfig}
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-accent)',
                        color: 'var(--text-on-accent)',
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{savingConfig ? 'Menyimpan...' : 'Simpan Konfigurasi'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview Card */}
              <div
                className="rounded-2xl border p-6 shadow-sm flex flex-col justify-between"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Pratinjau Langsung (Live Preview)
                  </h4>

                  <div
                    className="rounded-xl border p-4 mb-4"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-base font-bold text-white font-arabic-amiri shadow-xs"
                        style={{ backgroundColor: 'var(--bg-accent)' }}
                      >
                        {appConfig.app_logo}
                      </div>
                      <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {appConfig.app_name}
                      </span>
                    </div>

                    <div
                      className="rounded-lg p-2.5 text-[11px] leading-relaxed mb-3"
                      style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-primary)' }}
                    >
                      📢 {appConfig.app_announcement}
                    </div>

                    <div className="border-t pt-2.5 text-[10px] space-y-0.5" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                      <div>{appConfig.app_copyright}</div>
                      <div>Lisensi: {appConfig.app_license}</div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] italic" style={{ color: 'var(--text-secondary)' }}>
                  Perubahan nama dan logo akan disinkronkan secara global ke bilah atas dan footer pembaca.
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      {toastMsg && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xl animate-bounce"
          style={{
            backgroundColor: 'var(--bg-accent)',
            color: 'var(--text-on-accent)',
          }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
};

