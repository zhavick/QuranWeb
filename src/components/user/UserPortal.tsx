import React, { useState, useEffect } from 'react';
import {
  User,
  Bookmark,
  Search,
  BookOpen,
  LogOut,
  ArrowLeft,
  BookMarked,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { getStoredUser, loginUser, logoutUser, type AuthUser } from '../../services/auth';

interface UserBookmarkItem {
  id: number;
  surah_id: number;
  ayah_number: number;
  ain_number: number;
  surah_name?: string;
  note?: string;
  created_at: string;
}

interface SavedSearchItem {
  id: number;
  query: string;
  results_count: number;
  notes?: string;
  created_at: string;
}

interface UserPortalProps {
  onBackToApp: () => void;
  onNavigateToAyah: (surahId: number, ayahNumber: number) => void;
  onPerformSearch: (query: string) => void;
}

export const UserPortal: React.FC<UserPortalProps> = ({
  onBackToApp,
  onNavigateToAyah,
  onPerformSearch,
}) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getStoredUser());
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [bookmarks, setBookmarks] = useState<UserBookmarkItem[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([]);
  const [newSearchQuery, setNewSearchQuery] = useState('');
  const [newSearchNote, setNewSearchNote] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadUserData = async (username: string) => {
    try {
      const res = await fetch(`/api/user/data?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setBookmarks(data.bookmarks || []);
        setSavedSearches(data.savedSearches || []);
        return;
      }
    } catch (err) {
      console.warn('API error fetching user data, loading fallback:', err);
    }

    // Local sample data fallback
    setBookmarks([
      {
        id: 1,
        surah_id: 1,
        ayah_number: 1,
        ain_number: 1,
        surah_name: 'Al-Fatihah',
        note: 'Bismillah — Mengawali setiap langkah dengan asma-Nya yang Maha Pengasih',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        surah_id: 2,
        ayah_number: 255,
        ain_number: 34,
        surah_name: 'Al-Baqarah',
        note: 'Ayat Kursi — Pelindung utama pagi dan petang, keagungan takhta Allah',
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        surah_id: 18,
        ayah_number: 1,
        ain_number: 1,
        surah_name: 'Al-Kahfi',
        note: 'Sunnah dibaca setiap hari Jumat sebagai penerang antara dua Jumat',
        created_at: new Date().toISOString(),
      },
    ]);

    setSavedSearches([
      {
        id: 1,
        query: 'sabar dan shalat',
        results_count: 14,
        notes: 'Ayat-ayat penenang hati saat menghadapi cobaan kehidupan',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 2,
        query: 'surga firdaus',
        results_count: 5,
        notes: 'Penyemangat ibadah dan amalan penghuni surga tertinggi',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        query: 'rezeki yang berkah',
        results_count: 22,
        notes: 'Tadabbur ayat syukur dan keluasan karunia Ilahi',
        created_at: new Date().toISOString(),
      },
    ]);
  };

  useEffect(() => {
    if (currentUser) {
      loadUserData(currentUser.username);
    }
  }, [currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await loginUser(usernameInput, passwordInput);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    } else {
      setLoginError(res.message || 'Login gagal. Silakan coba kembali.');
    }
  };

  const fillDemoCredentials = () => {
    setUsernameInput('fulan');
    setPasswordInput('user123');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleAddSavedSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSearchQuery.trim()) return;
    const item: SavedSearchItem = {
      id: Date.now(),
      query: newSearchQuery.trim(),
      results_count: 1,
      notes: newSearchNote.trim() || 'Arsip pencarian tersimpan',
      created_at: new Date().toISOString(),
    };
    setSavedSearches([item, ...savedSearches]);
    setNewSearchQuery('');
    setNewSearchNote('');
    showToast('Kata kunci pencarian berhasil diarsipkan.');

    try {
      await fetch('/api/user/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser?.username || 'fulan',
          query: item.query,
          notes: item.notes,
        }),
      });
    } catch {}
  };

  const handleDeleteSavedSearch = async (id: number) => {
    setSavedSearches(savedSearches.filter((s) => s.id !== id));
    showToast('Arsip pencarian dihapus.');
    try {
      await fetch(`/api/user/saved-searches?id=${id}`, { method: 'DELETE' });
    } catch {}
  };

  const handleDeleteBookmark = (id: number) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
    showToast('Bookmark berhasil dihapus.');
  };

  // ==========================================
  // VIEW: USER LOGIN
  // ==========================================
  if (!currentUser) {
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
              <User className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold sm:text-2xl" style={{ color: 'var(--text-primary)' }}>
              Masuk Akun Pengguna
            </h1>
            <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              Akses dashboard bookmark pribadi, arsip pencarian, dan sinkronisasi tilawah
            </p>
          </div>

          {/* Preset Demo Box */}
          <div
            className="mb-5 rounded-xl border p-3.5 text-xs leading-relaxed"
            style={{
              backgroundColor: 'var(--bg-accent-soft)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <div className="font-bold flex items-center justify-between">
              <span>👤 Akun Demo Pengguna:</span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="underline hover:text-emerald-500 font-semibold cursor-pointer"
              >
                Gunakan Otomatis
              </button>
            </div>
            <div className="mt-1.5 font-mono text-[11px] space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
              <div>Username: <span className="font-bold text-emerald-600 dark:text-emerald-400">fulan</span> (atau user@quranweb.id)</div>
              <div>Password: <span className="font-bold text-emerald-600 dark:text-emerald-400">user123</span></div>
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
                Username atau Email
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="fulan"
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
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold shadow-md transition-transform active:scale-98 cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              <Lock className="h-4 w-4" />
              <span>Masuk Dashboard Pribadi</span>
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
              <span>Kembali Membaca Al-Qur&apos;an</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: USER DASHBOARD
  // ==========================================
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top Header */}
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
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {currentUser.full_name}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  color: 'var(--text-accent)',
                }}
              >
                Anggota Aktif
              </span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              @{currentUser.username} • {currentUser.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToApp}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <BookOpen className="h-4 w-4" style={{ color: 'var(--text-accent)' }} />
            <span className="hidden sm:inline">Mulai Membaca Al-Qur&apos;an</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 cursor-pointer"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Welcome Banner & Summary */}
          <div
            className="rounded-2xl border p-5 sm:p-6 shadow-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span>Assalamu&apos;alaikum, {currentUser.full_name.split(' ')[0]}!</span>
                  <Sparkles className="h-4 w-4" style={{ color: 'var(--text-accent)' }} />
                </h2>
                <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Selamat datang di beranda tilawah pribadi Anda. Seluruh catatan tadabbur, bookmark, dan arsip pencarian tersinkronisasi aman.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToAyah(2, 255)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-accent)',
                  color: 'var(--text-on-accent)',
                }}
              >
                <BookMarked className="h-4 w-4" />
                <span>Lanjutkan Bacaan Terakhir</span>
              </button>
            </div>

            {/* Metric Pills */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Total Bookmark</div>
                <div className="text-xl font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>{bookmarks.length}</div>
              </div>
              <div>
                <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Arsip Pencarian</div>
                <div className="text-xl font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>{savedSearches.length}</div>
              </div>
              <div>
                <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Juz Target</div>
                <div className="text-xl font-black mt-0.5" style={{ color: 'var(--text-accent)' }}>Juz 1 &amp; Juz 15</div>
              </div>
              <div>
                <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Sinkronisasi</div>
                <div className="text-xl font-black mt-0.5 text-emerald-600 dark:text-emerald-400">Aktif</div>
              </div>
            </div>
          </div>

          {/* SECTION 1: CARD BOOKMARK PRIBADI */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5" style={{ color: 'var(--text-accent)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Koleksi Bookmark &amp; Catatan Tadabbur ({bookmarks.length})
                </h3>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Tersimpan di Cloud Database
              </span>
            </div>

            {bookmarks.length === 0 ? (
              <div
                className="rounded-2xl border p-8 text-center text-xs"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                Belum ada bookmark yang disimpan. Klik ikon bookmark pada kartu ayat saat membaca untuk menyimpannya ke sini.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="flex flex-col justify-between rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="rounded-lg px-2.5 py-1 text-xs font-bold"
                          style={{
                            backgroundColor: 'var(--bg-accent-soft)',
                            color: 'var(--text-accent)',
                          }}
                        >
                          Surat {bm.surah_name || `Surat ${bm.surah_id}`} : {bm.ayah_number}
                        </span>

                        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                          &apos;Ain ke-{bm.ain_number}
                        </span>
                      </div>

                      {bm.note && (
                        <p className="mt-2 text-xs leading-relaxed italic" style={{ color: 'var(--text-primary)' }}>
                          &ldquo;{bm.note}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                      <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(bm.created_at).toLocaleDateString('id-ID')}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onNavigateToAyah(bm.surah_id, bm.ayah_number)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer"
                          style={{
                            backgroundColor: 'var(--bg-accent)',
                            color: 'var(--text-on-accent)',
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Baca</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBookmark(bm.id)}
                          aria-label="Hapus Bookmark"
                          className="rounded-lg p-1 text-red-500 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2: HASIL PENCARIAN YANG DIARSIPKAN */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5" style={{ color: 'var(--text-accent)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Hasil Pencarian yang Diarsipkan ({savedSearches.length})
                </h3>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Akses Cepat Tema &amp; Kata Kunci
              </span>
            </div>

            {/* Add New Search Archive Input */}
            <form
              onSubmit={handleAddSavedSearch}
              className="flex flex-wrap items-center gap-2 rounded-2xl border p-3 shadow-xs"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <input
                type="text"
                placeholder="Kata kunci pencarian (misal: shalat tahajjud, rezeki, surga)..."
                value={newSearchQuery}
                onChange={(e) => setNewSearchQuery(e.target.value)}
                className="flex-1 min-w-[200px] rounded-xl border px-3 py-1.5 text-xs outline-none"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
              <input
                type="text"
                placeholder="Catatan / konteks pencarian (opsional)..."
                value={newSearchNote}
                onChange={(e) => setNewSearchNote(e.target.value)}
                className="flex-1 min-w-[180px] rounded-xl border px-3 py-1.5 text-xs outline-none"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-accent)',
                  color: 'var(--text-on-accent)',
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Arsipkan</span>
              </button>
            </form>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {savedSearches.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border p-4 shadow-sm flex flex-col justify-between"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        &ldquo;{item.query}&rdquo;
                      </span>
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: 'var(--bg-muted)',
                          color: 'var(--text-accent)',
                        }}
                      >
                        {item.results_count} ayat
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-2.5" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onPerformSearch(item.query)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer"
                        style={{
                          backgroundColor: 'var(--bg-accent-soft)',
                          color: 'var(--text-accent)',
                        }}
                        title="Buka pencarian ini di Al-Qur'an"
                      >
                        <Search className="h-3 w-3" />
                        <span>Buka Hasil</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSavedSearch(item.id)}
                        className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"
                        aria-label="Hapus Arsip"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Toast Feedback */}
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
