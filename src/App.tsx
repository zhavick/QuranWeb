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
  UserPlus,
  Clock,
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
import { RegisterView } from './components/auth/RegisterView';
import { SplashScreen } from './components/common/SplashScreen';
import { AdminPortal } from './components/admin/AdminPortal';
import { UserPortal } from './components/user/UserPortal';
import { ProphetsCatalog } from './components/prophets/ProphetsCatalog';
import { ProphetLanternBanner } from './components/prophets/ProphetLanternBanner';
import { BlogCatalog } from './components/blog/BlogCatalog';
import { PrayersCatalog } from './components/prayers/PrayersCatalog';
import { AsmaulHusnaCatalog } from './components/asmaulhusna/AsmaulHusnaCatalog';
import { TasbihPage } from './components/tasbih/TasbihPage';
import { HadithCatalog } from './components/hadith/HadithCatalog';
import { QiblaCompass } from './components/qibla/QiblaCompass';
import { MosqueMap } from './components/mosque/MosqueMap';
import { KhatamPlannerModal } from './components/khatam/KhatamPlannerModal';
import { AsbabunNuzulModal } from './components/literacy/AsbabunNuzulModal';
import { GharibulQuranModal } from './components/literacy/GharibulQuranModal';
import { AudioCapsuleModal } from './components/audio/AudioCapsuleModal';
import { TafsirModal } from './components/reader/TafsirModal';
import { AyahPosterModal } from './components/reader/AyahPosterModal';
import { getAyahTafsir } from './services/tafsir';
import type { SelectedTafsirContext } from './types/tafsir';
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
    'reader' | 'admin' | 'user' | 'register' | 'prophets' | 'blog' | 'prayers' | 'kiblat' | 'masjid' | 'asmaul-husna' | 'tasbih' | 'hadits'
  >(() => {
    const p = window.location.pathname.toLowerCase();
    if (p === '/admin' || p.startsWith('/admin/')) return 'admin';
    if (p === '/daftar' || p === '/register' || p.startsWith('/daftar/') || p.startsWith('/register/')) return 'register';
    if (p === '/user' || p.startsWith('/user/')) return 'user';
    if (p === '/kisah' || p.startsWith('/kisah/')) return 'prophets';
    if (p === '/blog' || p.startsWith('/blog/')) return 'blog';
    if (p === '/doa' || p.startsWith('/doa/')) return 'prayers';
    if (p === '/kiblat' || p.startsWith('/kiblat/')) return 'kiblat';
    if (p === '/masjid' || p.startsWith('/masjid/')) return 'masjid';
    if (p === '/asmaul-husna' || p === '/asma' || p.startsWith('/asmaul-husna/') || p.startsWith('/asma/')) return 'asmaul-husna';
    if (p === '/tasbih' || p === '/tashbih' || p.startsWith('/tasbih/') || p.startsWith('/tashbih/')) return 'tasbih';
    if (p === '/hadits' || p === '/hadith' || p.startsWith('/hadits/') || p.startsWith('/hadith/')) return 'hadits';
    return 'reader';
  });

  const [appConfig, setAppConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);

  useEffect(() => {
    fetchAppConfig().then((cfg) => setAppConfig(cfg));
  }, []);

  const navigateTo = useCallback(
    (route: 'reader' | 'admin' | 'user' | 'register' | 'prophets' | 'blog' | 'prayers' | 'kiblat' | 'masjid' | 'asmaul-husna' | 'tasbih' | 'hadits') => {
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
          : route === 'register'
          ? '/daftar'
          : route === 'asmaul-husna'
          ? '/asmaul-husna'
          : route === 'tasbih'
          ? '/tasbih'
          : route === 'hadits'
          ? '/hadits'
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
      else if (p === '/daftar' || p === '/register' || p.startsWith('/daftar/') || p.startsWith('/register/')) setCurrentRoute('register');
      else if (p === '/user' || p.startsWith('/user/')) setCurrentRoute('user');
      else if (p === '/kisah' || p.startsWith('/kisah/')) setCurrentRoute('prophets');
      else if (p === '/blog' || p.startsWith('/blog/')) setCurrentRoute('blog');
      else if (p === '/doa' || p.startsWith('/doa/')) setCurrentRoute('prayers');
      else if (p === '/kiblat' || p.startsWith('/kiblat/')) setCurrentRoute('kiblat');
      else if (p === '/masjid' || p.startsWith('/masjid/')) setCurrentRoute('masjid');
      else if (p === '/asmaul-husna' || p === '/asma' || p.startsWith('/asmaul-husna/') || p.startsWith('/asma/')) setCurrentRoute('asmaul-husna');
      else if (p === '/tasbih' || p === '/tashbih' || p.startsWith('/tasbih/') || p.startsWith('/tashbih/')) setCurrentRoute('tasbih');
      else if (p === '/hadits' || p === '/hadith' || p.startsWith('/hadits/') || p.startsWith('/hadith/')) setCurrentRoute('hadits');
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
  const [mobileDrawerTab, setMobileDrawerTab] = useState<'menu' | 'quran'>('menu');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tajweedGuideOpen, setTajweedGuideOpen] = useState(false);
  const [khatamPlannerOpen, setKhatamPlannerOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [focusedAyahId, setFocusedAyahId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [splashOpen, setSplashOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const p = window.location.pathname.toLowerCase();
    return p === '/' || p === '' || p === '/index.html';
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredUser());
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Step 16 Literacy State (Asbabun Nuzul, Gharibul Qur'an, Audiobook)
  const [asbabKeys, setAsbabKeys] = useState<Set<string>>(new Set());
  const [gharibKeys, setGharibKeys] = useState<Set<string>>(new Set());
  const [selectedAsbab, setSelectedAsbab] = useState<AsbabunNuzulItem | null>(null);
  const [selectedGharibWords, setSelectedGharibWords] = useState<GharibulQuranWord[]>([]);
  const [selectedTafsir, setSelectedTafsir] = useState<SelectedTafsirContext | null>(null);
  const [selectedPosterAyah, setSelectedPosterAyah] = useState<Ayah | null>(null);
  const [audioCapsuleOpen, setAudioCapsuleOpen] = useState(false);

  // Live actual time state for header marquee banner
  const [currentActualTime, setCurrentActualTime] = useState(() => {
    return new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentActualTime(
        new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleOpenTafsir = useCallback(async (ayah: Ayah) => {
    const tafsirItem = await getAyahTafsir(ayah.surahId, ayah.ayahNumber);
    if (tafsirItem) {
      const surahName = surahNameMap.get(ayah.surahId) || `Surah ${ayah.surahId}`;
      setSelectedTafsir({
        surahId: ayah.surahId,
        surahName,
        ayahNumber: ayah.ayahNumber,
        textUthmani: ayah.textUthmani,
        translationId: ayah.translationId,
        tafsir: tafsirItem,
      });
      logActivity('VIEW_TAFSIR_AYAH', {
        surahId: ayah.surahId,
        ayahNumber: ayah.ayahNumber,
      });
    }
  }, [surahNameMap]);

  const handleOpenPoster = useCallback((ayah: Ayah) => {
    setSelectedPosterAyah(ayah);
    logActivity('OPEN_POSTER_MODAL', {
      surahId: ayah.surahId,
      ayahNumber: ayah.ayahNumber,
    });
  }, []);

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

  if (currentRoute === 'register') {
    return (
      <RegisterView
        onBackToMushaf={() => navigateTo('reader')}
        onNavigateToLogin={() => navigateTo('user')}
        onRegisterSuccess={(newUser) => {
          setCurrentUser(newUser);
          showToast(`Alhamdulillah! Selamat datang, ${newUser.full_name}.`);
          navigateTo('user');
        }}
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

  if (currentRoute === 'asmaul-husna') {
    if (!currentUser) {
      setJoinModalOpen(true);
      navigateTo('reader');
      return null;
    }
    return (
      <AsmaulHusnaCatalog
        onBackToMushaf={() => navigateTo('reader')}
        onNavigateToAyah={(surahId, ayahNumber) => {
          handleJumpToAyah(surahId, ayahNumber);
          navigateTo('reader');
        }}
        elderMode={settings.elderMode}
      />
    );
  }

  if (currentRoute === 'tasbih') {
    if (!currentUser) {
      setJoinModalOpen(true);
      navigateTo('reader');
      return null;
    }
    return (
      <TasbihPage
        onBackToMushaf={() => navigateTo('reader')}
        elderMode={settings.elderMode}
      />
    );
  }

  if (currentRoute === 'hadits') {
    if (!currentUser) {
      setJoinModalOpen(true);
      navigateTo('reader');
      return null;
    }
    return (
      <HadithCatalog
        onBackToMushaf={() => navigateTo('reader')}
        onNavigateToAyah={(surahId, ayahNumber) => {
          handleJumpToAyah(surahId, ayahNumber);
          navigateTo('reader');
        }}
        elderMode={settings.elderMode}
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
      {/* Live Actual Clock & Horizontal Marquee Announcement */}
      {appConfig.app_announcement && (
        <div
          className="relative flex items-center border-b overflow-hidden text-[11px] font-semibold select-none h-8 shrink-0"
          style={{
            backgroundColor: 'var(--bg-accent-soft)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-accent)',
          }}
        >
          {/* Jam Aktual Saat Ini (di bagian depan) */}
          <div
            className="flex items-center gap-1.5 px-3 h-full shrink-0 z-10 border-r shadow-xs font-mono font-bold tracking-wider"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            title="Waktu / Jam Aktual Saat Ini"
          >
            <Clock className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            <span>{currentActualTime}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-semibold">WIB</span>
          </div>

          {/* Marquee Scroller (Bergerak dari Kanan ke Kiri Hingga Hilang dan Muncul Lagi) */}
          <div className="flex-1 overflow-hidden relative h-full flex items-center">
            <div
              className="animate-marquee whitespace-nowrap cursor-default"
              title="Arahkan kursor atau sentuh untuk menjeda tulisan bergerak"
            >
              <span className="inline-flex items-center gap-3 pr-16">
                <span className="inline-flex items-center gap-1.5 font-sans">
                  <span>📢</span>
                  <span>{appConfig.app_announcement}</span>
                </span>
                <span className="opacity-40">•</span>
                <span className="opacity-80 font-mono text-[10px]">🕒 {currentActualTime} WIB</span>
                <span className="opacity-40">•</span>
                <span className="text-emerald-600 dark:text-emerald-400">✨ Platform Al-Qur&apos;an Digital Ramah Lansia</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Header (Hidden in Fullscreen Zen Mode) */}
      {!isFullscreen && (
        <header
          className="flex h-14 shrink-0 items-center justify-between border-b px-3 sm:px-5 max-w-full overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Left: Logo & Current Surah/Section Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className="flex items-center gap-2 cursor-pointer shrink-0"
              onClick={() => navigateTo('reader')}
              title="Kembali ke Pembaca Al-Qur'an"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl font-bold text-sm font-arabic-amiri shrink-0"
                style={{
                  backgroundColor: 'var(--bg-accent)',
                  color: 'var(--text-on-accent)',
                }}
              >
                {appConfig.app_logo}
              </div>
              <span className="font-bold tracking-tight text-sm sm:text-base hidden xs:inline" style={{ color: 'var(--text-primary)' }}>
                {appConfig.app_name}
              </span>
            </div>

            <div
              className="truncate text-xs sm:text-sm font-semibold max-w-[130px] xs:max-w-[200px] sm:max-w-[320px]"
              style={{ color: 'var(--text-accent)' }}
              title={headerTitle}
            >
              • {headerTitle}
            </div>
          </div>

          {/* Right Header Toolbar (Clean, Unified & Clutter-Free across all devices) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Widget Jadwal Shalat */}
            <PrayerTimeWidget
              onOpenKhatamPlanner={currentUser ? () => {
                setKhatamPlannerOpen(true);
                logActivity('OPEN_KHATAM_PLANNER');
              } : undefined}
              onOpenQibla={() => navigateTo('kiblat')}
              onOpenMosqueMap={() => {
                if (!currentUser) {
                  setJoinModalOpen(true);
                } else {
                  navigateTo('masjid');
                }
              }}
            />

            {/* Quick Settings Icon */}
            <button
              type="button"
              onClick={() => {
                setSettingsOpen(true);
                logActivity('OPEN_SETTINGS');
              }}
              aria-label="Pengaturan dan Aksesibilitas"
              title="Pengaturan & Aksesibilitas"
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* Fullscreen Zen Mode Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Mode Layar Penuh"
              title="Mode Layar Penuh (F)"
              className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold cursor-pointer transition-all shadow-xs"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Layar Penuh</span>
            </button>

            {/* SINGLE UNIFIED 3-STRIP MENU BUTTON (Dropdown/Drawer untuk Desktop & Mobile) */}
            <button
              type="button"
              onClick={() => {
                setMobileDrawerOpen(true);
                setMobileDrawerTab('menu');
              }}
              aria-label="Buka Menu Dropdown 3 Strip"
              title="Menu Lengkap & Fitur QuranWeb"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold cursor-pointer transition-all shadow-xs hover:opacity-90"
              style={{
                backgroundColor: 'var(--bg-accent-soft)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-accent)',
              }}
            >
              <Menu className="h-5 w-5" />
              <span className="font-semibold text-xs">Menu</span>
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
                    onOpenTafsir={handleOpenTafsir}
                    onOpenPoster={handleOpenPoster}
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

      {/* Slide-Over 3-Strip Dropdown Menu & Navigation Panel (Desktop & Mobile) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div
            className="relative z-10 flex h-full w-88 sm:w-96 max-w-[92vw] flex-col border-l shadow-2xl transition-transform"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Drawer Header */}
            <div
              className="flex items-center justify-between border-b px-4 py-3 shrink-0"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs font-arabic-amiri"
                  style={{
                    backgroundColor: 'var(--bg-accent)',
                    color: 'var(--text-on-accent)',
                  }}
                >
                  {appConfig.app_logo}
                </div>
                <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Menu {appConfig.app_name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Tutup menu"
                className="rounded-lg p-1.5 cursor-pointer"
                style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Segmented Tab Switcher: [ ☰ Menu & Fitur ] vs [ 📑 Navigasi Al-Qur'an ] */}
            <div className="p-2.5 border-b shrink-0" style={{ borderColor: 'var(--border-color)' }}>
              <div
                className="grid grid-cols-2 gap-1 rounded-xl border p-1 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setMobileDrawerTab('menu')}
                  className="flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all cursor-pointer"
                  style={{
                    backgroundColor:
                      mobileDrawerTab === 'menu' ? 'var(--bg-accent)' : 'transparent',
                    color:
                      mobileDrawerTab === 'menu'
                        ? 'var(--text-on-accent)'
                        : 'var(--text-secondary)',
                  }}
                >
                  <Menu className="h-3.5 w-3.5" />
                  <span>Menu &amp; Fitur</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileDrawerTab('quran')}
                  className="flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all cursor-pointer"
                  style={{
                    backgroundColor:
                      mobileDrawerTab === 'quran' ? 'var(--bg-accent)' : 'transparent',
                    color:
                      mobileDrawerTab === 'quran'
                        ? 'var(--text-on-accent)'
                        : 'var(--text-secondary)',
                  }}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Al-Qur&apos;an</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT */}
            {mobileDrawerTab === 'menu' ? (
              <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
                {/* 1. Waktu Shalat & Jam Aktual Widget */}
                <div
                  className="rounded-2xl border p-3 shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-accent)' }}>
                      Waktu Aktual &amp; Shalat
                    </span>
                  </div>
                  <PrayerTimeWidget
                    onOpenKhatamPlanner={currentUser ? () => {
                      setMobileDrawerOpen(false);
                      setKhatamPlannerOpen(true);
                    } : undefined}
                    onOpenQibla={() => {
                      setMobileDrawerOpen(false);
                      navigateTo('kiblat');
                    }}
                    onOpenMosqueMap={() => {
                      setMobileDrawerOpen(false);
                      if (!currentUser) setJoinModalOpen(true);
                      else navigateTo('masjid');
                    }}
                  />
                </div>

                {/* 2. Profil Akun / Sesi Pengguna */}
                <div
                  className="rounded-2xl border p-3 shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-accent)' }}>
                    Akun Pengguna
                  </span>
                  {currentUser ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white uppercase shadow-xs"
                          style={{ backgroundColor: 'var(--bg-accent)' }}
                        >
                          {currentUser.username.charAt(0) || 'U'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                            {currentUser.full_name}
                          </div>
                          <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                            @{currentUser.username} • <span className="font-semibold uppercase" style={{ color: 'var(--text-accent)' }}>{currentUser.role}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setMobileDrawerOpen(false);
                            if (currentUser.role === 'admin' || currentUser.role === 'asatidz' || currentUser.role === 'editor') {
                              navigateTo('admin');
                            } else {
                              navigateTo('user');
                            }
                          }}
                          className="flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold cursor-pointer transition-all"
                          style={{
                            backgroundColor: 'var(--bg-accent-soft)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-accent)',
                          }}
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>Dashboard</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setMobileDrawerOpen(false);
                            setLogoutModalOpen(true);
                          }}
                          className="flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold cursor-pointer transition-all text-red-500 hover:bg-red-500/10"
                          style={{
                            backgroundColor: 'var(--bg-muted)',
                            borderColor: 'var(--border-color)',
                          }}
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Keluar</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs mb-2.5" style={{ color: 'var(--text-secondary)' }}>
                        Masuk atau daftar untuk menyimpan bookmark, rencana khatam, dan akses penuh fitur Islami.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setMobileDrawerOpen(false);
                            navigateTo('user');
                          }}
                          className="flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold shadow-xs cursor-pointer"
                          style={{
                            backgroundColor: 'var(--bg-muted)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>Masuk</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setMobileDrawerOpen(false);
                            navigateTo('register');
                          }}
                          className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold shadow-xs cursor-pointer"
                          style={{
                            backgroundColor: 'var(--bg-accent)',
                            color: 'var(--text-on-accent)',
                          }}
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>Daftar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Daftar Fitur & Layanan Islami */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider block mb-2 px-1" style={{ color: 'var(--text-accent)' }}>
                    Fitur &amp; Layanan Islami
                  </span>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        navigateTo('prophets');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className="h-4 w-4 text-amber-500 shrink-0" />
                        <span>Kisah Para Rasulullah (25 Nabi)</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Buka →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        navigateTo('blog');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Newspaper className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Jurnal &amp; Blog Tadabbur</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Buka →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        navigateTo('kiblat');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Navigation className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Kompas Arah Kiblat Adaptif</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Buka →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        if (!currentUser) setJoinModalOpen(true);
                        else navigateTo('masjid');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Peta Masjid Terdekat (OpenStreetMap)</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Buka →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        if (!currentUser) setJoinModalOpen(true);
                        else navigateTo('prayers');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Doa Qur&apos;ani (40 Rabbana) &amp; Tasbih</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Buka →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        if (!currentUser) setJoinModalOpen(true);
                        else navigateTo('asmaul-husna');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                        <span>Asmaul Husna (99 Nama Allah)</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Buka →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        if (!currentUser) setJoinModalOpen(true);
                        else navigateTo('tasbih');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Tasbih Digital (Hitung Naik &amp; Mundur)</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Buka →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        if (!currentUser) setJoinModalOpen(true);
                        else navigateTo('hadits');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="h-4 w-4 text-sky-500 shrink-0" />
                        <span>Hadits Arba'in An-Nawawiyah (42 Hadits)</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Buka →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        setAudioCapsuleOpen(true);
                        logActivity('OPEN_AUDIO_CAPSULE');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Headphones className="h-4 w-4 text-amber-500 shrink-0" />
                        <span>Audiobook Tadabbur &amp; Kisah (3 Mnt)</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Dengar →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        if (!currentUser) setJoinModalOpen(true);
                        else {
                          setKhatamPlannerOpen(true);
                          logActivity('OPEN_KHATAM_PLANNER');
                        }
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Rencana Khatam Sakinah (&apos;Ain)</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Buka →</span>
                    </button>
                  </div>
                </div>

                {/* 4. Pengaturan Cepat & Aksesibilitas */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider block mb-2 px-1" style={{ color: 'var(--text-accent)' }}>
                    Aksesibilitas &amp; Tampilan
                  </span>
                  <div className="space-y-1.5">
                    {/* Mode Lansia Quick Switch */}
                    <button
                      type="button"
                      onClick={handleToggleElderMode}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: settings.elderMode ? 'var(--bg-accent-soft)' : 'var(--bg-card)',
                        borderColor: settings.elderMode ? 'var(--bg-accent)' : 'var(--border-color)',
                        color: settings.elderMode ? 'var(--text-accent)' : 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="h-4 w-4 shrink-0" />
                        <span>Mode Lansia (Font Besar &amp; Nyaman)</span>
                      </div>
                      <span
                        className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: settings.elderMode ? 'var(--bg-accent)' : 'var(--bg-muted)',
                          color: settings.elderMode ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                        }}
                      >
                        {settings.elderMode ? 'Aktif' : 'Mati'}
                      </span>
                    </button>

                    {/* Tajwid Berwarna Quick Switch */}
                    <button
                      type="button"
                      onClick={handleToggleTajweedQuick}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: settings.tajweedEnabled && !settings.elderMode && settings.theme !== 'high-contrast' ? 'var(--bg-accent-soft)' : 'var(--bg-card)',
                        borderColor: settings.tajweedEnabled && !settings.elderMode && settings.theme !== 'high-contrast' ? 'var(--bg-accent)' : 'var(--border-color)',
                        color: settings.tajweedEnabled && !settings.elderMode && settings.theme !== 'high-contrast' ? 'var(--text-accent)' : 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Palette className="h-4 w-4 shrink-0" />
                        <span>Tajwid Berwarna</span>
                      </div>
                      <span
                        className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: settings.tajweedEnabled && !settings.elderMode && settings.theme !== 'high-contrast' ? 'var(--bg-accent)' : 'var(--bg-muted)',
                          color: settings.tajweedEnabled && !settings.elderMode && settings.theme !== 'high-contrast' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                        }}
                      >
                        {settings.tajweedEnabled && !settings.elderMode && settings.theme !== 'high-contrast' ? 'Aktif' : 'Mati'}
                      </span>
                    </button>

                    {/* Panduan Edukasi Tajwid */}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        setTajweedGuideOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <GraduationCap className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Panduan Tajwid &amp; Makhraj</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Buka →</span>
                    </button>

                    {/* Pengaturan Lengkap */}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        setSettingsOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings className="h-4 w-4 shrink-0" />
                        <span>Pengaturan Tampilan &amp; Font</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Buka →</span>
                    </button>

                    {/* Fullscreen */}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        toggleFullscreen();
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Maximize2 className="h-4 w-4 shrink-0" />
                        <span>Mode Layar Penuh (Zen Mode)</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Aktifkan</span>
                    </button>

                    {/* Tampilkan Muqaddimah / Splash Screen (MaktabIT Technology) */}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        setSplashOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-accent-soft)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-accent)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
                        <span>Tampilkan Muqaddimah / Splash</span>
                      </div>
                      <span className="text-[10px] font-bold">Buka →</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB NAVIGASI AL-QUR'AN (FULL HEIGHT) */
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
            )}
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
        onNavigateToRegister={() => navigateTo('register')}
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

      {/* Tafsir Kemenag RI Modal (Step 23) */}
      <TafsirModal
        context={selectedTafsir}
        onClose={() => setSelectedTafsir(null)}
        elderMode={settings.elderMode}
      />

      {/* Generator Poster Kutipan Ayat ke WhatsApp (Step 24) */}
      <AyahPosterModal
        ayah={selectedPosterAyah}
        surahName={
          selectedPosterAyah
            ? surahNameMap.get(selectedPosterAyah.surahId) || `Surah ${selectedPosterAyah.surahId}`
            : ''
        }
        isOpen={Boolean(selectedPosterAyah)}
        onClose={() => setSelectedPosterAyah(null)}
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

      {/* Splash Screen & Muqaddimah (MaktabIT Technology) */}
      <SplashScreen
        isOpen={splashOpen}
        onClose={() => setSplashOpen(false)}
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
