import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Maximize2,
  Minimize2,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Compass,
  Bookmark,
  GraduationCap,
  Palette,
  Play,
  Pause,
  User,
  LogOut,
  Newspaper,
  Sparkles,
  Navigation,
  MapPin,
  Headphones,
} from 'lucide-react';
import type {
  QuranMeta,
  Ayah,
  ReaderSettings,
  LastReadState,
  BookmarkItem,
  NavigationTab,
} from './types/quran';
import { getQuranMeta, getSurahData, getMultipleSurahs } from './services/quranData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useFullscreen } from './hooks/useFullscreen';
import { useAutoScroll } from './hooks/useAutoScroll';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { NavigationPanel } from './components/navigation/NavigationPanel';
import { AyahCard } from './components/reader/AyahCard';
import { PrayerTimeWidget } from './components/prayer/PrayerTimeWidget';
import { SettingsModal } from './components/settings/SettingsModal';
import { TajweedMakhrajModal } from './components/settings/TajweedMakhrajModal';
import { AudioMiniPlayer } from './components/audio/AudioMiniPlayer';
import { JoinPromptModal } from './components/auth/JoinPromptModal';
import { LogoutConfirmModal } from './components/auth/LogoutConfirmModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { UserPortal } from './components/user/UserPortal';
import { ProphetsCatalog } from './components/prophets/ProphetsCatalog';
import { ProphetLanternBanner } from './components/prophets/ProphetLanternBanner';
import { BlogCatalog } from './components/blog/BlogCatalog';
import { PrayersCatalog } from './components/prayers/PrayersCatalog';
import { QiblaCompass } from './components/qibla/QiblaCompass';
import { MosqueMap } from './components/mosque/MosqueMap';
import { KhatamPlannerModal } from './components/khatam/KhatamPlannerModal';
import { AsbabunNuzulModal } from './components/literacy/AsbabunNuzulModal';
import { GharibulQuranModal } from './components/literacy/GharibulQuranModal';
import { AudioCapsuleModal } from './components/audio/AudioCapsuleModal';
import {
  fetchAsbabunNuzulList,
  fetchGharibulQuranList,
  getAsbabunNuzulForAyah,
  getGharibWordsForAyah,
} from './services/literacy';
import type { AsbabunNuzulItem, GharibulQuranWord } from './types/literacy';
import { getStoredUser, logoutUser, type AuthUser } from './services/auth';
import { fetchAppConfig, type AppConfig, DEFAULT_APP_CONFIG } from './services/admin';
import {
  logVisitorAccess,
  logActivity,
  syncStagingSettings,
  fetchStagingSettings,
} from './services/telemetry';

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'light',
  elderMode: false,
  arabicFontSize: 30,
  translationFontSize: 16,
  lineHeight: 2.2,
  arabicFont: 'amiri',
  showTranslation: true,
  tajweedEnabled: false,
  spotlightEnabled: false,
  autoScrollSpeed: 0,
};

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<
    'reader' | 'admin' | 'user' | 'prophets' | 'blog' | 'prayers' | 'kiblat' | 'masjid'
  >(() => {
    const p = window.location.pathname.toLowerCase();
    if (p === '/admin' || p.startsWith('/admin/')) return 'admin';
    if (p === '/user' || p.startsWith('/user/')) return 'user';
    if (p === '/kisah' || p.startsWith('/kisah/')) return 'prophets';
    if (p === '/blog' || p.startsWith('/blog/')) return 'blog';
    if (p === '/doa' || p.startsWith('/doa/')) return 'prayers';
    if (p === '/kiblat' || p.startsWith('/kiblat/')) return 'kiblat';
    if (p === '/masjid' || p.startsWith('/masjid/')) return 'masjid';
    return 'reader';
  });

  const [appConfig, setAppConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);

  useEffect(() => {
    fetchAppConfig().then((cfg) => setAppConfig(cfg));
  }, []);

  const navigateTo = useCallback(
    (route: 'reader' | 'admin' | 'user' | 'prophets' | 'blog' | 'prayers' | 'kiblat' | 'masjid') => {
      setCurrentRoute(route);
      const path =
        route === 'reader'
          ? '/'
          : route === 'prophets'
          ? '/kisah'
          : route === 'prayers'
          ? '/doa'
          : route === 'kiblat'
          ? '/kiblat'
          : route === 'masjid'
          ? '/masjid'
          : `/${route}`;
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    },
    []
  );

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p === '/admin' || p.startsWith('/admin/')) setCurrentRoute('admin');
      else if (p === '/user' || p.startsWith('/user/')) setCurrentRoute('user');
      else if (p === '/kisah' || p.startsWith('/kisah/')) setCurrentRoute('prophets');
      else if (p === '/blog' || p.startsWith('/blog/')) setCurrentRoute('blog');
      else if (p === '/doa' || p.startsWith('/doa/')) setCurrentRoute('prayers');
      else if (p === '/kiblat' || p.startsWith('/kiblat/')) setCurrentRoute('kiblat');
      else if (p === '/masjid' || p.startsWith('/masjid/')) setCurrentRoute('masjid');
      else setCurrentRoute('reader');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [meta, setMeta] = useState<QuranMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [navTab, setNavTab] = useState<NavigationTab | 'bookmark' | 'search'>('surah');
  const [viewMode, setViewMode] = useState<NavigationTab>('surah');
  const [selectedSurahId, setSelectedSurahId] = useState(1);
  const [selectedJuz, setSelectedJuz] = useState(1);
  const [selectedAin, setSelectedAin] = useState(1);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [quickAyahInput, setQuickAyahInput] = useState('');

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tajweedGuideOpen, setTajweedGuideOpen] = useState(false);
  const [khatamPlannerOpen, setKhatamPlannerOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [focusedAyahId, setFocusedAyahId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredUser());
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Step 16 Literacy State (Asbabun Nuzul, Gharibul Qur'an, Audiobook)
  const [asbabKeys, setAsbabKeys] = useState<Set<string>>(new Set());
  const [gharibKeys, setGharibKeys] = useState<Set<string>>(new Set());
  const [selectedAsbab, setSelectedAsbab] = useState<AsbabunNuzulItem | null>(null);
  const [selectedGharibWords, setSelectedGharibWords] = useState<GharibulQuranWord[]>([]);
  const [audioCapsuleOpen, setAudioCapsuleOpen] = useState(false);

  useEffect(() => {
    fetchAsbabunNuzulList().then((list) => {
      const keys = new Set(list.map((item) => `${item.surahId}:${item.ayahNumber}`));
      setAsbabKeys(keys);
    });
    fetchGharibulQuranList().then((list) => {
      const keys = new Set(list.map((item) => `${item.surahId}:${item.ayahNumber}`));
      setGharibKeys(keys);
    });
  }, []);

  const handleOpenAsbabunNuzul = useCallback(async (ayah: Ayah) => {
    const item = await getAsbabunNuzulForAyah(ayah.surahId, ayah.ayahNumber);
    if (item) {
      setSelectedAsbab(item);
    }
  }, []);

  const handleOpenGharibWords = useCallback(async (ayah: Ayah) => {
    const words = await getGharibWordsForAyah(ayah.surahId, ayah.ayahNumber);
    if (words.length > 0) {
      setSelectedGharibWords(words);
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getStoredUser());
    };
    window.addEventListener('quranweb_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('quranweb_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const [settings, setSettings] = useLocalStorage<ReaderSettings>(
    'quranweb_settings',
    DEFAULT_SETTINGS
  );
  const [lastRead, setLastRead] = useLocalStorage<LastReadState | null>(
    'quranweb_last_read',
    null
  );
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkItem[]>(
    'quranweb_bookmarks',
    []
  );

  const readerScrollRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  useAutoScroll(readerScrollRef, settings.autoScrollSpeed);

  const audio = useAudioPlayer(ayahs);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    logoutUser();
    setCurrentUser(null);
    setLogoutModalOpen(false);
    showToast('Anda telah berhasil keluar dari akun dengan aman. Selamat melanjutkan tilawah.');
  }, [showToast]);

  // Sync theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Log visitor IP on initial app load & restore PostgreSQL staging settings if available
  useEffect(() => {
    logVisitorAccess();
    fetchStagingSettings().then((res) => {
      if (res.found && res.settings) {
        const s = res.settings;
        setSettings((prev) => ({
          ...prev,
          theme: (s.theme as any) || prev.theme,
          elderMode: s.elder_mode ?? prev.elderMode,
          arabicFontSize: s.arabic_font_size || prev.arabicFontSize,
          translationFontSize: s.translation_font_size || prev.translationFontSize,
          lineHeight: s.line_height ? Number(s.line_height) : prev.lineHeight,
          arabicFont: (s.arabic_font as any) || prev.arabicFont,
          showTranslation: s.show_translation ?? prev.showTranslation,
          tajweedEnabled: s.tajweed_enabled ?? prev.tajweedEnabled,
          spotlightEnabled: s.spotlight_enabled ?? prev.spotlightEnabled,
          autoScrollSpeed: s.auto_scroll_speed ?? prev.autoScrollSpeed,
        }));
        if (s.bookmarks && Array.isArray(s.bookmarks) && s.bookmarks.length > 0) {
          setBookmarks((prev) => (prev.length === 0 ? s.bookmarks! : prev));
        }
        if (s.last_read && s.last_read.surahId) {
          setLastRead((prev) => prev ?? s.last_read!);
        }
      }
    });
  }, [setSettings, setBookmarks, setLastRead]);

  // Load metadata & handle deep linking URL params (?surah=2&ayah=255, ?juz=3, ?ain=10)
  useEffect(() => {
    getQuranMeta()
      .then((m) => {
        setMeta(m);
        const params = new URLSearchParams(window.location.search);
        const sParam = Number(params.get('surah'));
        const aParam = Number(params.get('ayah'));
        const jParam = Number(params.get('juz'));
        const ainParam = Number(params.get('ain'));

        if (sParam >= 1 && sParam <= 114) {
          setSelectedSurahId(sParam);
          setViewMode('surah');
          if (aParam >= 1) {
            setTimeout(() => {
              const el = document.getElementById(`ayah-${sParam}-${aParam}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }
        } else if (jParam >= 1 && jParam <= 30) {
          setSelectedJuz(jParam);
          setViewMode('juz');
        } else if (ainParam >= 1 && ainParam <= m.ains.length) {
          setSelectedAin(ainParam);
          setViewMode('ain');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Gagal memuat data.');
        setLoading(false);
      });
  }, []);

  // Sync state to URL without reloading page
  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams();
    if (viewMode === 'surah') {
      params.set('surah', String(selectedSurahId));
    } else if (viewMode === 'juz') {
      params.set('juz', String(selectedJuz));
    } else if (viewMode === 'ain') {
      params.set('ain', String(selectedAin));
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [viewMode, selectedSurahId, selectedJuz, selectedAin, loading]);

  // Load ayahs whenever viewMode or selection changes
  useEffect(() => {
    if (!meta) return;
    let cancelled = false;

    const load = async () => {
      try {
        if (viewMode === 'surah') {
          const data = await getSurahData(selectedSurahId);
          if (!cancelled) setAyahs(data.ayahs);
        } else if (viewMode === 'juz') {
          const juz = meta.juzs.find((j) => j.juzNumber === selectedJuz);
          if (!juz) return;
          const ids: number[] = [];
          for (let i = juz.startSurah; i <= juz.endSurah; i++) ids.push(i);
          const surahs = await getMultipleSurahs(ids);
          const filtered = surahs
            .flatMap((s) => s.ayahs)
            .filter((a) => a.juzNumber === selectedJuz);
          if (!cancelled) setAyahs(filtered);
        } else if (viewMode === 'ain') {
          const ain = meta.ains.find((a) => a.ainNumber === selectedAin);
          if (!ain) return;
          const data = await getSurahData(ain.surahId);
          const filtered = data.ayahs.filter((a) => a.ainNumber === selectedAin);
          if (!cancelled) setAyahs(filtered);
        }
        if (!cancelled && readerScrollRef.current) {
          readerScrollRef.current.scrollTop = 0;
        }
      } catch {
        // Ignore transient errors
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [meta, viewMode, selectedSurahId, selectedJuz, selectedAin]);

  // Ayah-Sync auto-scroll when audio plays
  useEffect(() => {
    if (audio.playingAyahId === null) return;
    const target = ayahs.find((a) => a.id === audio.playingAyahId);
    if (!target) return;
    const el = document.getElementById(`ayah-${target.surahId}-${target.ayahNumber}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [audio.playingAyahId, ayahs]);

  const updateSettings = useCallback(
    (patch: Partial<ReaderSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        syncStagingSettings(next, bookmarks, lastRead);
        logActivity('UPDATE_SETTINGS', patch as Record<string, unknown>);
        return next;
      });
    },
    [setSettings, bookmarks, lastRead]
  );

  const handleToggleElderMode = useCallback(() => {
    setSettings((prev) => {
      const nextElder = !prev.elderMode;
      const next: ReaderSettings = {
        ...prev,
        elderMode: nextElder,
        arabicFontSize: nextElder ? 42 : 30,
        translationFontSize: nextElder ? 20 : 16,
        lineHeight: nextElder ? 2.5 : 2.2,
        theme: nextElder ? 'high-contrast' : 'light',
        tajweedEnabled: nextElder ? false : prev.tajweedEnabled,
      };
      syncStagingSettings(next, bookmarks, lastRead);
      logActivity('TOGGLE_ELDER_MODE', { elderMode: nextElder });
      return next;
    });
  }, [setSettings, bookmarks, lastRead]);

  const surahNameMap = useMemo(() => {
    const map = new Map<number, string>();
    meta?.surahs.forEach((s) => map.set(s.id, s.nameLatin));
    return map;
  }, [meta]);

  const handlePrev = useCallback(() => {
    if (viewMode === 'surah' && selectedSurahId > 1) {
      setSelectedSurahId((s) => s - 1);
    } else if (viewMode === 'juz' && selectedJuz > 1) {
      setSelectedJuz((j) => j - 1);
    } else if (viewMode === 'ain' && selectedAin > 1) {
      setSelectedAin((a) => a - 1);
    }
  }, [viewMode, selectedSurahId, selectedJuz, selectedAin]);

  const handleNext = useCallback(() => {
    if (!meta) return;
    if (viewMode === 'surah' && selectedSurahId < 114) {
      setSelectedSurahId((s) => s + 1);
    } else if (viewMode === 'juz' && selectedJuz < 30) {
      setSelectedJuz((j) => j + 1);
    } else if (viewMode === 'ain' && selectedAin < meta.ains.length) {
      setSelectedAin((a) => a + 1);
    }
  }, [meta, viewMode, selectedSurahId, selectedJuz, selectedAin]);

  // Desktop Keyboard Shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === '+' || e.key === '=') {
        updateSettings({
          arabicFontSize: Math.min(52, settings.arabicFontSize + 2),
        });
      } else if (e.key === '-') {
        updateSettings({
          arabicFontSize: Math.max(20, settings.arabicFontSize - 2),
        });
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleFullscreen, updateSettings, settings.arabicFontSize, handlePrev, handleNext]);

  const handleToggleBookmark = useCallback(
    (ayah: Ayah) => {
      const id = `${ayah.surahId}:${ayah.ayahNumber}`;
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.id === id);
        if (exists) {
          const next = prev.filter((b) => b.id !== id);
          syncStagingSettings(settings, next, lastRead);
          logActivity('REMOVE_BOOKMARK', { surahId: ayah.surahId, ayahNumber: ayah.ayahNumber });
          showToast('Bookmark dihapus');
          return next;
        }
        const next = [
          {
            id,
            surahId: ayah.surahId,
            ayahNumber: ayah.ayahNumber,
            ainNumber: ayah.ainNumber,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ];
        syncStagingSettings(settings, next, lastRead);
        logActivity('ADD_BOOKMARK', { surahId: ayah.surahId, ayahNumber: ayah.ayahNumber });
        showToast('Ayat disimpan ke Bookmark');
        // Trigger CTA join prompt only for guest without active session
        if (!currentUser) {
          setTimeout(() => setJoinModalOpen(true), 600);
        }
        return next;
      });
    },
    [setBookmarks, settings, lastRead, showToast, currentUser]
  );

  const handleDeleteBookmark = useCallback(
    (id: string) => {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      showToast('Bookmark dihapus');
    },
    [setBookmarks, showToast]
  );

  const handleUpdateBookmarkNote = useCallback(
    (id: string, note: string) => {
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, note } : b))
      );
      showToast('Catatan bookmark disimpan');
    },
    [setBookmarks, showToast]
  );

  const handleSetLastRead = useCallback(
    (ayah: Ayah) => {
      setLastRead({
        mode: viewMode,
        surahId: ayah.surahId,
        ayahNumber: ayah.ayahNumber,
        juzNumber: ayah.juzNumber,
        ainNumber: ayah.ainNumber,
        updatedAt: new Date().toISOString(),
      });
      showToast('Ditandai sebagai Terakhir Dibaca');
    },
    [setLastRead, viewMode, showToast]
  );

  const handleShareLink = useCallback(
    (ayah: Ayah) => {
      const url = `${window.location.origin}${window.location.pathname}?surah=${ayah.surahId}&ayah=${ayah.ayahNumber}`;
      navigator.clipboard?.writeText(url).then(() => {
        showToast('Tautan ayat disalin!');
      });
    },
    [showToast]
  );

  const handleJumpToAyah = useCallback((surahId: number, ayahNumber: number) => {
    setViewMode('surah');
    setSelectedSurahId(surahId);
    setMobileDrawerOpen(false);
    setTimeout(() => {
      const el = document.getElementById(`ayah-${surahId}-${ayahNumber}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
  }, []);

  const currentSurahMeta = meta?.surahs.find((s) => s.id === selectedSurahId);
  const currentAinMeta = meta?.ains.find((a) => a.ainNumber === selectedAin);

  const headerTitle =
    viewMode === 'surah'
      ? `${currentSurahMeta?.id ?? 1}. ${currentSurahMeta?.nameLatin ?? ''}`
      : viewMode === 'juz'
      ? `Juz ${selectedJuz}`
      : `'Ain ke-${selectedAin} (${surahNameMap.get(currentAinMeta?.surahId ?? 1) ?? ''})`;

  const headerSubtitle =
    viewMode === 'surah'
      ? `${currentSurahMeta?.translationId ?? ''} • ${currentSurahMeta?.totalAyahs ?? 0} Ayat`
      : viewMode === 'juz'
      ? `Pembagian Juz ke-${selectedJuz} dari 30`
      : `Ayat ${currentAinMeta?.startAyah ?? 1}–${currentAinMeta?.endAyah ?? 1} • Juz ${currentAinMeta?.juzNumber ?? 1}`;

  const handleToggleTajweedQuick = useCallback(() => {
    if (settings.elderMode || settings.theme === 'high-contrast') {
      showToast('Tajwid dinonaktifkan otomatis dalam Mode Lansia / Kontras Tinggi demi keterbacaan.');
      return;
    }
    const nextVal = !settings.tajweedEnabled;
    updateSettings({ tajweedEnabled: nextVal });
    logActivity('TOGGLE_TAJWEED', { enabled: nextVal });
    showToast(nextVal ? 'Tajwid Berwarna diaktifkan' : 'Tajwid Berwarna dinonaktifkan');
  }, [settings.elderMode, settings.theme, settings.tajweedEnabled, updateSettings, showToast]);

  const isSectionPlaying =
    audio.isPlaying && ayahs.some((a) => a.id === audio.playingAyahId);

  const handleToggleSectionAudio = useCallback(() => {
    if (ayahs.length === 0) return;
    if (isSectionPlaying) {
      audio.togglePlayPause();
      logActivity('TOGGLE_AUDIO_PLAY_PAUSE', { isPlaying: false });
    } else {
      audio.setRepeatMode('list');
      audio.playAyah(ayahs[0].id);
      logActivity('PLAY_SECTION_AUDIO', {
        viewMode,
        firstAyahId: ayahs[0].id,
        qari: audio.qari.id,
      });
      const el = document.getElementById(`ayah-${ayahs[0].surahId}-${ayahs[0].ayahNumber}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [ayahs, isSectionPlaying, audio, viewMode]);

  const handleQuickAyahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(quickAyahInput);
    const maxAyahs = currentSurahMeta?.totalAyahs ?? 286;
    if (val >= 1 && val <= maxAyahs) {
      handleJumpToAyah(selectedSurahId, val);
      setQuickAyahInput('');
    }
  };

  if (currentRoute === 'admin') {
    return (
      <AdminPortal
        onBackToApp={() => navigateTo('reader')}
        onConfigChange={(cfg) => setAppConfig(cfg)}
      />
    );
  }

  if (currentRoute === 'user') {
    return (
      <UserPortal
        onBackToApp={() => navigateTo('reader')}
        onNavigateToAyah={(surahId, ayahNumber) => {
          handleJumpToAyah(surahId, ayahNumber);
          navigateTo('reader');
        }}
        onPerformSearch={(query) => {
          setNavTab('search');
          navigateTo('reader');
          showToast(`Mencari: ${query}`);
        }}
        onOpenBlogArticle={(slug) => {
          navigateTo('blog');
          if (slug) {
            window.history.pushState({}, '', `/blog/${slug}`);
          }
        }}
        onOpenKhatamPlanner={() => setKhatamPlannerOpen(true)}
      />
    );
  }

  if (currentRoute === 'prophets') {
    return (
      <ProphetsCatalog
        onBackToMushaf={() => navigateTo('reader')}
        onNavigateToAyah={(surahId, ayahNumber) => {
          handleJumpToAyah(surahId, ayahNumber);
          navigateTo('reader');
        }}
      />
    );
  }

  if (currentRoute === 'blog') {
    return (
      <BlogCatalog
        onBackToMushaf={() => navigateTo('reader')}
        onNavigateToAyah={(surahId, ayahNumber) => {
          handleJumpToAyah(surahId, ayahNumber);
          navigateTo('reader');
        }}
        onOpenProphetStory={() => navigateTo('prophets')}
      />
    );
  }

  if (currentRoute === 'prayers') {
    if (!currentUser) {
      setJoinModalOpen(true);
      navigateTo('reader');
      return null;
    }
    return (
      <PrayersCatalog
        onBackToMushaf={() => navigateTo('reader')}
        onNavigateToAyah={(surahId, ayahNumber) => {
          handleJumpToAyah(surahId, ayahNumber);
          navigateTo('reader');
        }}
        elderMode={settings.elderMode}
      />
    );
  }

  if (currentRoute === 'kiblat') {
    return (
      <QiblaCompass
        onBackToMushaf={() => navigateTo('reader')}
        elderMode={settings.elderMode}
      />
    );
  }

  if (currentRoute === 'masjid') {
    if (!currentUser) {
      setJoinModalOpen(true);
      navigateTo('reader');
      return null;
    }
    return (
      <MosqueMap
        onBackToMushaf={() => navigateTo('reader')}
        elderMode={settings.elderMode}
        theme={settings.theme}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center text-sm font-medium">
        Memuat Al-Qur&apos;an...
      </div>
    );
  }

  if (error || !meta) {
    return (
      <div className="flex h-[100dvh] items-center justify-center p-4 text-center text-sm text-red-500">
        {error ?? 'Gagal memuat metadata.'}
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      {/* Optional Admin Broadcast Announcement */}
      {appConfig.app_announcement && (
        <div
          className="px-4 py-1.5 text-center text-[11px] font-semibold border-b truncate"
          style={{
            backgroundColor: 'var(--bg-accent-soft)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-accent)',
          }}
        >
          📢 {appConfig.app_announcement}
        </div>
      )}

      {/* Top Header (Hidden in Fullscreen Zen Mode) */}
      {!isFullscreen && (
        <header
          className="flex h-14 shrink-0 items-center justify-between border-b px-3 sm:px-5"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Buka menu navigasi"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl lg:hidden cursor-pointer"
              style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-primary)' }}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('reader')}>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl font-bold text-sm font-arabic-amiri"
                style={{
                  backgroundColor: 'var(--bg-accent)',
                  color: 'var(--text-on-accent)',
                }}
              >
                {appConfig.app_logo}
              </div>
              <span className="hidden font-bold tracking-tight sm:inline" style={{ color: 'var(--text-primary)' }}>
                {appConfig.app_name}
              </span>
            </div>

            <div className="ml-2 truncate text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-accent)' }}>
              {headerTitle}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PrayerTimeWidget
              onOpenKhatamPlanner={currentUser ? () => setKhatamPlannerOpen(true) : undefined}
              onOpenQibla={() => navigateTo('kiblat')}
              onOpenMosqueMap={() => {
                if (!currentUser) {
                  setJoinModalOpen(true);
                } else {
                  navigateTo('masjid');
                }
              }}
            />

            {/* Adaptive User Session / Quick Logout */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser.role === 'admin' || currentUser.role === 'asatidz' || currentUser.role === 'editor') {
                      navigateTo('admin');
                    } else {
                      navigateTo('user');
                    }
                  }}
                  aria-label={`Profil ${currentUser.full_name} (${currentUser.role})`}
                  title={`Masuk sebagai ${currentUser.full_name} (${currentUser.role}) — Klik untuk buka portal`}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold cursor-pointer transition-all hover:opacity-95"
                  style={{
                    backgroundColor: 'var(--bg-accent-soft)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white uppercase shadow-xs"
                    style={{ backgroundColor: 'var(--bg-accent)' }}
                  >
                    {currentUser.username.charAt(0) || 'U'}
                  </span>
                  <span className="max-w-[70px] sm:max-w-[110px] truncate hidden xs:inline">
                    {currentUser.username}
                  </span>
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider hidden md:inline"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      color: 'var(--text-accent)',
                    }}
                  >
                    {currentUser.role}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLogoutModalOpen(true)}
                  aria-label="Keluar dari Akun (Logout)"
                  title="Keluar dari Akun (Logout)"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer transition-all hover:bg-red-500/10 hover:border-red-500/30 text-red-500"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigateTo('user')}
                aria-label="Masuk ke Akun / Dashboard"
                title="Masuk / Dashboard Pengguna (/user)"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <User className="h-4 w-4" />
              </button>
            )}

            {/* Tombol Akses Cepat Kisah Para Rasulullah */}
            <button
              type="button"
              onClick={() => navigateTo('prophets')}
              aria-label="Kisah Para Rasulullah (25 Nabi)"
              title="Kisah Para Rasulullah (Qashashul Anbiya' — 25 Nabi)"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <Compass className="h-4 w-4 text-amber-500" />
              <span className="hidden sm:inline">Kisah Rasul</span>
            </button>

            {/* Tombol Akses Cepat Jurnal Blog & Tadabbur */}
            <button
              type="button"
              onClick={() => navigateTo('blog')}
              aria-label="Jurnal Literasi & Blog Tadabbur"
              title="Jurnal Literasi & Blog Tadabbur Qur'ani (/blog)"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <Newspaper className="h-4 w-4 text-emerald-500" />
              <span className="hidden sm:inline">Jurnal Blog</span>
            </button>

            {/* Tombol Akses Cepat Kompas Arah Kiblat */}
            <button
              type="button"
              onClick={() => navigateTo('kiblat')}
              aria-label="Kompas Arah Kiblat"
              title="Kompas Arah Kiblat Adaptif (/kiblat)"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <Navigation className="h-4 w-4 text-emerald-500" />
              <span className="hidden sm:inline">Arah Kiblat</span>
            </button>

            {/* Tombol Akses Cepat Peta Masjid Terdekat (Hanya ditampilkan jika memiliki akun) */}
            {currentUser && (
              <button
                type="button"
                onClick={() => navigateTo('masjid')}
                aria-label="Peta Masjid Terdekat"
                title="Peta Masjid Terdekat OpenStreetMap (/masjid)"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span className="hidden md:inline">Peta Masjid</span>
              </button>
            )}

            {/* Tombol Akses Cepat Doa Qur'ani & Dzikir (Hanya ditampilkan jika memiliki akun) */}
            {currentUser && (
              <button
                type="button"
                onClick={() => navigateTo('prayers')}
                aria-label="Kumpulan Doa Qur'ani & Dzikir"
                title="Kumpulan Doa Qur'ani (40 Rabbana) & Tasbih Haptic (/doa)"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <span className="hidden sm:inline">Doa &amp; Dzikir</span>
              </button>
            )}

            {/* Tombol Audio Capsule / Audiobook 3 Menit (Step 16) */}
            <button
              type="button"
              onClick={() => {
                setAudioCapsuleOpen(true);
                logActivity('OPEN_AUDIO_CAPSULE');
              }}
              aria-label="Audiobook Tadabbur 3 Menit"
              title="Dengarkan Audio Narasi Tadabbur & Kisah Ringkas 3 Menit (Audiobook)"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <Headphones className="h-4 w-4 text-amber-500" />
              <span className="hidden xl:inline">Audiobook 3 Mnt</span>
            </button>

            {/* Tombol Akses Cepat Rencana Khatam Sakinah (Hanya ditampilkan jika memiliki akun) */}
            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  setKhatamPlannerOpen(true);
                  logActivity('OPEN_KHATAM_PLANNER');
                }}
                aria-label="Rencana Khatam Sakinah Berbasis 'Ain"
                title="Rencana Khatam Sakinah (Khatam Planner Berbasis 'Ain)"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Rencana Khatam</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setTajweedGuideOpen(true)}
              aria-label="Panduan Tajwid dan Makhraj"
              title="Panduan Tajwid & Makhraj"
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <GraduationCap className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setSettingsOpen(true);
                logActivity('OPEN_SETTINGS');
              }}
              aria-label="Pengaturan dan Aksesibilitas"
              title="Pengaturan & Aksesibilitas"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <Settings className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Mode Layar Penuh"
              title="Mode Layar Penuh (F)"
              className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Layar Penuh</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Split Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isFullscreen && (
          <aside
            className="hidden w-80 shrink-0 border-r lg:block"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <NavigationPanel
              meta={meta}
              activeTab={navTab}
              onTabChange={setNavTab}
              selectedSurahId={selectedSurahId}
              selectedJuz={selectedJuz}
              selectedAin={selectedAin}
              lastRead={lastRead}
              bookmarks={bookmarks}
              elderMode={settings.elderMode}
              onSelectSurah={(id) => {
                setViewMode('surah');
                setSelectedSurahId(id);
              }}
              onSelectJuz={(juz) => {
                setViewMode('juz');
                setSelectedJuz(juz);
              }}
              onSelectAin={(ain) => {
                setViewMode('ain');
                setSelectedAin(ain);
              }}
              onJumpToAyah={handleJumpToAyah}
              onDeleteBookmark={handleDeleteBookmark}
              onUpdateBookmarkNote={handleUpdateBookmarkNote}
              onOpenKhatamPlanner={currentUser ? () => setKhatamPlannerOpen(true) : undefined}
            />
          </aside>
        )}

        {/* Reader Area */}
        <main
          ref={readerScrollRef}
          className="relative flex-1 overflow-y-auto px-3 py-4 sm:px-6 lg:px-10 pb-24 lg:pb-16"
        >
          {/* Floating Exit Button in Fullscreen Zen Mode */}
          {isFullscreen && (
            <div className="fixed right-4 top-4 z-40 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                aria-label="Pengaturan"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Keluar Layar Penuh</span>
              </button>
            </div>
          )}

          <div className="mx-auto max-w-4xl">
            {/* Direct Mode Switcher Pills & Tajweed Quick Access in Reader Area */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="inline-flex items-center rounded-xl border p-1 text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  {(
                    [
                      { id: 'surah', label: 'Surat' },
                      { id: 'juz', label: 'Juz' },
                      { id: 'ain', label: "'Ain" },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setViewMode(m.id)}
                      className="rounded-lg px-3 py-1 transition-colors"
                      style={{
                        backgroundColor:
                          viewMode === m.id ? 'var(--bg-accent)' : 'transparent',
                        color:
                          viewMode === m.id
                            ? 'var(--text-on-accent)'
                            : 'var(--text-secondary)',
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Tajweed Quick Toggle Pill */}
                <button
                  type="button"
                  onClick={handleToggleTajweedQuick}
                  className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
                  style={{
                    backgroundColor:
                      settings.tajweedEnabled &&
                      !settings.elderMode &&
                      settings.theme !== 'high-contrast'
                        ? 'var(--bg-accent-soft)'
                        : 'var(--bg-muted)',
                    borderColor: 'var(--border-color)',
                    color:
                      settings.tajweedEnabled &&
                      !settings.elderMode &&
                      settings.theme !== 'high-contrast'
                        ? 'var(--text-accent)'
                        : 'var(--text-secondary)',
                  }}
                  title="Aktifkan / Nonaktifkan Tajwid Berwarna"
                >
                  <Palette className="h-3.5 w-3.5" />
                  <span>
                    Tajwid:{' '}
                    {settings.tajweedEnabled &&
                    !settings.elderMode &&
                    settings.theme !== 'high-contrast'
                      ? 'Aktif'
                      : 'Mati'}
                  </span>
                </button>

                {/* Open Tajweed Guide Button */}
                <button
                  type="button"
                  onClick={() => {
                    setTajweedGuideOpen(true);
                    logActivity('VIEW_TAJWEED_GUIDE');
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  title="Buka Panduan Edukasi Tajwid & Makhraj"
                >
                  <GraduationCap className="h-3.5 w-3.5" style={{ color: 'var(--text-accent)' }} />
                  <span className="hidden sm:inline">Panduan Tajwid</span>
                </button>
              </div>

              {/* Quick Jump Input in Surat Mode */}
              {viewMode === 'surah' && currentSurahMeta && (
                <form
                  onSubmit={handleQuickAyahSubmit}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Lompat:</span>
                  <input
                    type="number"
                    min={1}
                    max={currentSurahMeta.totalAyahs}
                    placeholder={`1–${currentSurahMeta.totalAyahs}`}
                    value={quickAyahInput}
                    onChange={(e) => setQuickAyahInput(e.target.value)}
                    className="w-16 rounded-lg border px-2 py-1 text-center font-semibold outline-none"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <button
                    type="submit"
                    className="rounded-lg px-2.5 py-1 font-semibold"
                    style={{
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--text-on-accent)',
                    }}
                  >
                    Go
                  </button>
                </form>
              )}
            </div>

            {/* Section Banner */}
            <div
              className="mb-5 rounded-2xl border p-5 text-center shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{
                    backgroundColor: 'var(--bg-accent-soft)',
                    color: 'var(--text-accent)',
                  }}
                >
                  {viewMode === 'surah'
                    ? 'Mode Surat'
                    : viewMode === 'juz'
                    ? 'Mode Juz'
                    : "Mode 'Ain (Ruku')"}
                </span>

                {/* Section Play Audio Button */}
                <button
                  type="button"
                  onClick={handleToggleSectionAudio}
                  className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold shadow-xs transition-transform active:scale-95"
                  style={{
                    backgroundColor: isSectionPlaying
                      ? 'var(--bg-accent-soft)'
                      : 'var(--bg-accent)',
                    borderColor: 'var(--border-color)',
                    color: isSectionPlaying
                      ? 'var(--text-accent)'
                      : 'var(--text-on-accent)',
                  }}
                  title="Putar bacaan murottal secara berurutan"
                >
                  {isSectionPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>Jeda Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>
                        Dengarkan {viewMode === 'surah' ? 'Surat' : viewMode === 'juz' ? 'Juz' : "'Ain"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {headerTitle}
              </h1>
              <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                {headerSubtitle}
              </p>
              {viewMode === 'surah' && selectedSurahId !== 1 && selectedSurahId !== 9 && (
                <p
                  className={`arabic-text font-arabic-${settings.arabicFont} mt-4 text-center! text-2xl sm:text-3xl`}
                  style={{ color: 'var(--text-accent)' }}
                >
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
              )}
            </div>

            {/* Prophet Lantern Banner (Bi-Directional Linking dari Mushaf ke Kisah Nabi) */}
            {viewMode === 'surah' && currentSurahMeta && (
              <ProphetLanternBanner
                surahId={selectedSurahId}
                surahName={currentSurahMeta.nameLatin}
                onNavigateToAyah={handleJumpToAyah}
                onOpenProphetsCatalog={() => navigateTo('prophets')}
              />
            )}

            {/* Ayah List */}
            <div className="space-y-4">
              {ayahs.map((ayah, idx) => {
                const prev = idx > 0 ? ayahs[idx - 1] : null;
                const showJuzHeader =
                  viewMode === 'surah' && (!prev || prev.juzNumber !== ayah.juzNumber);
                const isBookmarked = bookmarks.some(
                  (b) => b.id === `${ayah.surahId}:${ayah.ayahNumber}`
                );
                const isLastRead =
                  lastRead?.surahId === ayah.surahId &&
                  lastRead?.ayahNumber === ayah.ayahNumber;
                const isFocused = focusedAyahId === ayah.id;
                const isDimmed =
                  settings.spotlightEnabled &&
                  focusedAyahId !== null &&
                  focusedAyahId !== ayah.id;
                const ayahKey = `${ayah.surahId}:${ayah.ayahNumber}`;
                const hasAsbab = asbabKeys.has(ayahKey);
                const hasGharib = gharibKeys.has(ayahKey);

                return (
                  <AyahCard
                    key={ayah.id}
                    ayah={ayah}
                    surahName={viewMode !== 'surah' ? surahNameMap.get(ayah.surahId) : undefined}
                    settings={settings}
                    isBookmarked={isBookmarked}
                    isLastRead={isLastRead}
                    isPlaying={audio.playingAyahId === ayah.id && audio.isPlaying}
                    isFocused={isFocused}
                    isDimmed={isDimmed}
                    showJuzHeader={showJuzHeader}
                    hasAsbabunNuzul={hasAsbab}
                    hasGharibWords={hasGharib}
                    onToggleBookmark={handleToggleBookmark}
                    onSetLastRead={handleSetLastRead}
                    onPlayAudio={(a) => {
                      audio.playAyah(a.id);
                      logActivity('PLAY_AUDIO', {
                        surahId: a.surahId,
                        ayahNumber: a.ayahNumber,
                      });
                    }}
                    onShareLink={handleShareLink}
                    onFocusAyah={(id) =>
                      setFocusedAyahId((prevId) => (prevId === id ? null : id))
                    }
                    onOpenAsbabunNuzul={handleOpenAsbabunNuzul}
                    onOpenGharibWords={handleOpenGharibWords}
                  />
                );
              })}
            </div>

            {/* Prev / Next Navigation Footer */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--bg-accent)',
                  color: 'var(--text-on-accent)',
                }}
              >
                <span>Berikutnya</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {!isFullscreen && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t lg:hidden"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {(
            [
              { id: 'surah', label: 'Surat', icon: BookOpen },
              { id: 'juz', label: 'Juz', icon: Layers },
              { id: 'ain', label: "'Ain", icon: Compass },
              { id: 'bookmark', label: 'Simpan', icon: Bookmark },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const active = navTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setNavTab(item.id);
                  setMobileDrawerOpen(true);
                }}
                className="flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-semibold"
                style={{
                  color: active ? 'var(--text-accent)' : 'var(--text-secondary)',
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div
            className="relative z-10 flex h-full w-80 max-w-[85vw] flex-col border-r shadow-2xl"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Navigasi Al-Qur&apos;an
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Tutup menu"
                className="rounded-lg p-1"
                style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Drawer Quick Links: Kisah Rasul & Jurnal Blog */}
            <div className="p-3 border-b space-y-2" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  navigateTo('prophets');
                }}
                className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-accent)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-amber-500" />
                  <span>Kisah Para Rasulullah (25 Nabi)</span>
                </div>
                <span>Buka →</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  navigateTo('blog');
                }}
                className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-accent)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-emerald-500" />
                  <span>Jurnal &amp; Blog Tadabbur</span>
                </div>
                <span>Buka →</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  navigateTo('kiblat');
                }}
                className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-accent)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-emerald-500" />
                  <span>Kompas Arah Kiblat Adaptif</span>
                </div>
                <span>Buka →</span>
              </button>

              {/* Tombol Akses Cepat Peta Masjid Terdekat (Hanya saat login) */}
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    navigateTo('masjid');
                  }}
                  className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-accent-soft)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-accent)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <span>Peta Masjid Terdekat (OpenStreetMap)</span>
                  </div>
                  <span>Buka →</span>
                </button>
              )}

              {/* Tombol Akses Cepat Doa Qur'ani & Dzikir (Hanya saat login) */}
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    navigateTo('prayers');
                  }}
                  className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-accent-soft)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-accent)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <span>Doa Qur&apos;ani &amp; Tasbih Haptic</span>
                  </div>
                  <span>Buka →</span>
                </button>
              )}

              {/* Tombol Akses Cepat Audiobook 3 Menit (Step 16) */}
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setAudioCapsuleOpen(true);
                  logActivity('OPEN_AUDIO_CAPSULE');
                }}
                className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-accent)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-amber-500" />
                  <span>Audiobook Tadabbur &amp; Kisah (3 Mnt)</span>
                </div>
                <span>Dengar →</span>
              </button>

              {/* Tombol Akses Cepat Rencana Khatam Sakinah (Hanya saat login) */}
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setKhatamPlannerOpen(true);
                    logActivity('OPEN_KHATAM_PLANNER');
                  }}
                  className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-accent-soft)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-accent)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Rencana Khatam Sakinah (&apos;Ain)</span>
                  </div>
                  <span>Buka →</span>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              <NavigationPanel
                meta={meta}
                activeTab={navTab}
                onTabChange={setNavTab}
                selectedSurahId={selectedSurahId}
                selectedJuz={selectedJuz}
                selectedAin={selectedAin}
                lastRead={lastRead}
                bookmarks={bookmarks}
                elderMode={settings.elderMode}
                onSelectSurah={(id) => {
                  setViewMode('surah');
                  setSelectedSurahId(id);
                  setMobileDrawerOpen(false);
                }}
                onSelectJuz={(juz) => {
                  setViewMode('juz');
                  setSelectedJuz(juz);
                  setMobileDrawerOpen(false);
                }}
                onSelectAin={(ain) => {
                  setViewMode('ain');
                  setSelectedAin(ain);
                  setMobileDrawerOpen(false);
                }}
                onJumpToAyah={handleJumpToAyah}
                onDeleteBookmark={handleDeleteBookmark}
                onUpdateBookmarkNote={handleUpdateBookmarkNote}
                onOpenKhatamPlanner={
                  currentUser
                    ? () => {
                        setMobileDrawerOpen(false);
                        setKhatamPlannerOpen(true);
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Audio Mini Player */}
      <AudioMiniPlayer
        qari={audio.qari}
        onChangeQari={(q) => {
          audio.setQari(q);
          logActivity('CHANGE_QARI', { qari: q.id, name: q.name });
        }}
        isPlaying={audio.isPlaying}
        playingAyahId={audio.playingAyahId}
        repeatMode={audio.repeatMode}
        onChangeRepeat={(r) => {
          audio.setRepeatMode(r);
          logActivity('CHANGE_AUDIO_REPEAT', { mode: r });
        }}
        playbackSpeed={audio.playbackSpeed}
        onChangeSpeed={(s) => {
          audio.setPlaybackSpeed(s);
          logActivity('CHANGE_AUDIO_SPEED', { speed: s });
        }}
        currentTime={audio.currentTime}
        duration={audio.duration}
        volume={audio.volume}
        isMuted={audio.isMuted}
        onChangeVolume={audio.setVolume}
        onToggleMute={audio.toggleMute}
        onSeek={audio.seekTo}
        onTogglePlayPause={() => {
          audio.togglePlayPause();
          logActivity('TOGGLE_AUDIO_PLAY_PAUSE', { isPlaying: !audio.isPlaying });
        }}
        onStop={() => {
          audio.stopAudio();
          logActivity('STOP_AUDIO');
        }}
        audioError={audio.audioError}
        onClearError={audio.clearAudioError}
        currentAyah={ayahs.find((a) => a.id === audio.playingAyahId)}
        currentSurahName={currentSurahMeta?.nameLatin}
      />

      {/* Modals */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onToggleElderMode={handleToggleElderMode}
        bookmarks={bookmarks}
        onImportBookmarks={(items) => {
          setBookmarks(items);
          syncStagingSettings(settings, items, lastRead);
          showToast('Bookmark berhasil diimpor!');
        }}
        onOpenTajweedGuide={() => setTajweedGuideOpen(true)}
        onSyncDatabase={() => {
          syncStagingSettings(settings, bookmarks, lastRead);
          if (currentUser) {
            showToast('Pengaturan & bookmark tersinkronisasi ke akun Anda');
          } else {
            setJoinModalOpen(true);
          }
        }}
        onOpenUserPortal={() => navigateTo('user')}
        onOpenAdminPortal={() => navigateTo('admin')}
      />

      <TajweedMakhrajModal
        open={tajweedGuideOpen}
        onClose={() => setTajweedGuideOpen(false)}
      />

      {/* Join Registration CTA Modal */}
      <JoinPromptModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        user={currentUser}
      />

      {/* Khatam Planner Modal (Step 12) - Hanya jika user telah memiliki akun */}
      {currentUser && (
        <KhatamPlannerModal
          isOpen={khatamPlannerOpen}
          onClose={() => setKhatamPlannerOpen(false)}
          meta={meta}
          onNavigateToAin={(ainNumber) => {
            setViewMode('ain');
            setSelectedAin(ainNumber);
            setMobileDrawerOpen(false);
            setKhatamPlannerOpen(false);
            if (currentRoute !== 'reader') {
              navigateTo('reader');
            }
          }}
          elderMode={settings.elderMode}
        />
      )}

      {/* Asbabun Nuzul Modal (Step 16) */}
      <AsbabunNuzulModal
        item={selectedAsbab}
        onClose={() => setSelectedAsbab(null)}
      />

      {/* Gharibul Qur'an Modal (Step 16) */}
      <GharibulQuranModal
        isOpen={selectedGharibWords.length > 0}
        words={selectedGharibWords}
        onClose={() => setSelectedGharibWords([])}
      />

      {/* Audio Capsule Audiobook Modal (Step 16) */}
      <AudioCapsuleModal
        isOpen={audioCapsuleOpen}
        onClose={() => setAudioCapsuleOpen(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg lg:bottom-6"
          style={{
            backgroundColor: 'var(--bg-accent)',
            color: 'var(--text-on-accent)',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
};
