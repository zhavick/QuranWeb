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
  Clock,
  BookOpenCheck,
  Newspaper,
  BookText,
  Compass,
} from 'lucide-react';
import { getStoredUser, loginUser, logoutUser, type AuthUser } from '../../services/auth';
import {
  getReadLaterList,
  toggleReadLater,
  getUserReflections,
  saveUserReflection,
  fetchBlogArticles,
} from '../../services/blog';
import type { BlogArticle, UserReflection } from '../../types/blog';

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
  onOpenBlogArticle?: (slug?: string) => void;
  onOpenKhatamPlanner?: () => void;
}

export const UserPortal: React.FC<UserPortalProps> = ({
  onBackToApp,
  onNavigateToAyah,
  onPerformSearch,
  onOpenBlogArticle,
  onOpenKhatamPlanner,
}) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getStoredUser());
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'searches' | 'readLater' | 'reflections'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<UserBookmarkItem[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([]);
  const [readLaterArticles, setReadLaterArticles] = useState<BlogArticle[]>([]);
  const [reflections, setReflections] = useState<UserReflection[]>([]);
  const [newSearchQuery, setNewSearchQuery] = useState('');
  const [newSearchNote, setNewSearchNote] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadUserData = async (username: string) => {
    // 1. Load Blog Read Later and Reflections
    try {
      const rlSlugs = getReadLaterList();
      const allArticles = await fetchBlogArticles();
      const matched = allArticles.filter((a) => rlSlugs.includes(a.slug));
      setReadLaterArticles(matched);
      setReflections(getUserReflections());
    } catch (e) {
      console.warn('Failed loading blog user data:', e);
    }

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

  const handleRemoveReadLater = (slug: string) => {
    toggleReadLater(slug);
    setReadLaterArticles((prev) => prev.filter((a) => a.slug !== slug));
    showToast('Artikel dihapus dari daftar baca nanti.');
  };

  const handleDeleteReflection = (articleId: string) => {
    saveUserReflection(articleId, '', '');
    setReflections((prev) => prev.filter((r) => r.articleId !== articleId));
    showToast('Catatan tadabbur dihapus.');
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

              <div className="flex flex-wrap items-center gap-2">
                {onOpenKhatamPlanner && (
                  <button
                    type="button"
                    onClick={onOpenKhatamPlanner}
                    className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all hover:opacity-90 cursor-pointer shadow-xs"
                    style={{
                      backgroundColor: 'var(--bg-accent-soft)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-accent)',
                    }}
                  >
                    <Compass className="h-4 w-4 text-emerald-500" />
                    <span>Rencana Khatam Sakinah</span>
                  </button>
                )}

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
                <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Daftar Baca Nanti</div>
                <div className="text-xl font-black mt-0.5" style={{ color: 'var(--text-accent)' }}>{readLaterArticles.length}</div>
              </div>
              <div>
                <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Catatan Tadabbur</div>
                <div className="text-xl font-black mt-0.5 text-emerald-600 dark:text-emerald-400">{reflections.length}</div>
              </div>
            </div>
          </div>

          {/* Navigation Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('bookmarks')}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
              style={{
                backgroundColor: activeTab === 'bookmarks' ? 'var(--bg-accent)' : 'var(--bg-card)',
                color: activeTab === 'bookmarks' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: `1px solid ${activeTab === 'bookmarks' ? 'transparent' : 'var(--border-color)'}`,
              }}
            >
              <Bookmark className="h-4 w-4" />
              <span>Bookmark Ayat</span>
              <span className="rounded-full px-1.5 py-0.5 text-[10px] bg-black/15 dark:bg-white/15 font-bold">
                {bookmarks.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('searches')}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
              style={{
                backgroundColor: activeTab === 'searches' ? 'var(--bg-accent)' : 'var(--bg-card)',
                color: activeTab === 'searches' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: `1px solid ${activeTab === 'searches' ? 'transparent' : 'var(--border-color)'}`,
              }}
            >
              <Search className="h-4 w-4" />
              <span>Arsip Pencarian</span>
              <span className="rounded-full px-1.5 py-0.5 text-[10px] bg-black/15 dark:bg-white/15 font-bold">
                {savedSearches.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('readLater')}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
              style={{
                backgroundColor: activeTab === 'readLater' ? 'var(--bg-accent)' : 'var(--bg-card)',
                color: activeTab === 'readLater' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: `1px solid ${activeTab === 'readLater' ? 'transparent' : 'var(--border-color)'}`,
              }}
            >
              <Clock className="h-4 w-4" />
              <span>Daftar Baca Nanti</span>
              <span className="rounded-full px-1.5 py-0.5 text-[10px] bg-black/15 dark:bg-white/15 font-bold">
                {readLaterArticles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reflections')}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
              style={{
                backgroundColor: activeTab === 'reflections' ? 'var(--bg-accent)' : 'var(--bg-card)',
                color: activeTab === 'reflections' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: `1px solid ${activeTab === 'reflections' ? 'transparent' : 'var(--border-color)'}`,
              }}
            >
              <BookOpenCheck className="h-4 w-4" />
              <span>Catatan Tadabbur</span>
              <span className="rounded-full px-1.5 py-0.5 text-[10px] bg-black/15 dark:bg-white/15 font-bold">
                {reflections.length}
              </span>
            </button>
          </div>

          {/* SECTION 1: CARD BOOKMARK PRIBADI */}
          {activeTab === 'bookmarks' && (
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
          )}

          {/* SECTION 2: HASIL PENCARIAN YANG DIARSIPKAN */}
          {activeTab === 'searches' && (
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
          )}

          {/* SECTION 3: DAFTAR BACA NANTI (BLOG ARTICLES) */}
          {activeTab === 'readLater' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" style={{ color: 'var(--text-accent)' }} />
                  <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    Daftar Baca Nanti ({readLaterArticles.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenBlogArticle?.()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline cursor-pointer"
                  style={{ color: 'var(--text-accent)' }}
                >
                  <Newspaper className="h-3.5 w-3.5" />
                  <span>Jelajahi Jurnal Blog</span>
                </button>
              </div>

              {readLaterArticles.length === 0 ? (
                <div
                  className="rounded-2xl border p-8 text-center text-xs space-y-3"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <p>Belum ada artikel yang ditandai untuk dibaca nanti.</p>
                  <button
                    type="button"
                    onClick={() => onOpenBlogArticle?.()}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-xs cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-on-accent)' }}
                  >
                    <BookText className="h-3.5 w-3.5" />
                    <span>Buka Katalog Jurnal Blog</span>
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {readLaterArticles.map((art) => (
                    <div
                      key={art.slug}
                      className="flex flex-col justify-between rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className="rounded-lg px-2.5 py-1 text-[10px] font-bold"
                            style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-accent)' }}
                          >
                            {art.pillarLabel}
                          </span>
                          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                            ⏱ {art.readingTimeMinutes} mnt
                          </span>
                        </div>

                        <h4 className="text-sm font-bold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                          {art.title}
                        </h4>
                        <p className="mt-1 text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {art.excerpt}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                          Oleh {art.author.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenBlogArticle?.(art.slug)}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer"
                            style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-on-accent)' }}
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Baca</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveReadLater(art.slug)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"
                            title="Hapus dari Daftar Baca Nanti"
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
          )}

          {/* SECTION 4: CATATAN TADABBUR PRIBADI */}
          {activeTab === 'reflections' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpenCheck className="h-5 w-5" style={{ color: 'var(--text-accent)' }} />
                  <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    Catatan Tadabbur Pribadi ({reflections.length})
                  </h3>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Refleksi hikmah pada artikel Jurnal Blog
                </span>
              </div>

              {reflections.length === 0 ? (
                <div
                  className="rounded-2xl border p-8 text-center text-xs space-y-3"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <p>Belum ada catatan tadabbur pribadi yang ditulis.</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    Buka artikel jurnal blog mana pun dan tulis refleksi hati Anda pada kotak &ldquo;Catatan Tadabbur Saya&rdquo; di bagian bawah artikel.
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenBlogArticle?.()}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-xs cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-on-accent)' }}
                  >
                    <BookText className="h-3.5 w-3.5" />
                    <span>Mulai Menjelajah Artikel</span>
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {reflections.map((ref) => (
                    <div
                      key={ref.articleId}
                      className="flex flex-col justify-between rounded-2xl border p-4 shadow-sm"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-bold text-xs truncate max-w-[200px]" style={{ color: 'var(--text-accent)' }}>
                            {ref.articleTitle || ref.articleId}
                          </span>
                          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(ref.updatedAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <p
                          className="text-xs leading-relaxed italic border-l-2 pl-3 py-1 mt-2"
                          style={{
                            borderColor: 'var(--text-accent)',
                            color: 'var(--text-primary)',
                            backgroundColor: 'var(--bg-muted)',
                          }}
                        >
                          &ldquo;{ref.note}&rdquo;
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-2 border-t pt-2.5" style={{ borderColor: 'var(--border-color)' }}>
                        <button
                          type="button"
                          onClick={() => onOpenBlogArticle?.(ref.articleId)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer"
                          style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-accent)' }}
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Buka Artikel</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReflection(ref.articleId)}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
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
