import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Layers,
  Bookmark,
  BookMarked,
  Compass,
  Trash2,
  Edit3,
  Check,
  FileText,
  Filter,
} from 'lucide-react';
import type {
  QuranMeta,
  NavigationTab,
  LastReadState,
  BookmarkItem,
  TranslationSearchResult,
} from '../../types/quran';
import { searchTranslation } from '../../services/quranData';
import { logActivity } from '../../services/telemetry';

interface NavigationPanelProps {
  meta: QuranMeta;
  activeTab: NavigationTab | 'bookmark' | 'search';
  onTabChange: (tab: NavigationTab | 'bookmark' | 'search') => void;
  selectedSurahId: number;
  selectedJuz: number;
  selectedAin: number;
  lastRead: LastReadState | null;
  bookmarks: BookmarkItem[];
  elderMode: boolean;
  onSelectSurah: (surahId: number) => void;
  onSelectJuz: (juzNumber: number) => void;
  onSelectAin: (ainNumber: number) => void;
  onJumpToAyah: (surahId: number, ayahNumber: number) => void;
  onDeleteBookmark: (id: string) => void;
  onUpdateBookmarkNote: (id: string, note: string) => void;
  onOpenKhatamPlanner?: () => void;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  meta,
  activeTab,
  onTabChange,
  selectedSurahId,
  selectedJuz,
  selectedAin,
  lastRead,
  bookmarks,
  elderMode,
  onSelectSurah,
  onSelectJuz,
  onSelectAin,
  onJumpToAyah,
  onDeleteBookmark,
  onUpdateBookmarkNote,
  onOpenKhatamPlanner,
}) => {
  const [query, setQuery] = useState('');
  const [ainSurahFilter, setAinSurahFilter] = useState<number>(0); // 0 = all
  const [searchMode, setSearchMode] = useState<'meta' | 'translation'>('meta');
  const [translationResults, setTranslationResults] = useState<TranslationSearchResult[]>([]);
  const [isSearchingTranslation, setIsSearchingTranslation] = useState(false);
  const [editingBookmarkId, setEditingBookmarkId] = useState<string | null>(null);
  const [bookmarkNoteInput, setBookmarkNoteInput] = useState('');

  const surahMap = useMemo(() => {
    const map = new Map<number, string>();
    meta.surahs.forEach((s) => map.set(s.id, s.nameLatin));
    return map;
  }, [meta.surahs]);

  // Debounced translation search
  useEffect(() => {
    if (searchMode !== 'translation' || query.trim().length < 2) {
      setTranslationResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingTranslation(true);
      try {
        const res = await searchTranslation(query, surahMap, 40);
        setTranslationResults(res);
        logActivity('SEARCH_TRANSLATION', { query, count: res.length });
      } catch {
        setTranslationResults([]);
      } finally {
        setIsSearchingTranslation(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchMode, surahMap]);

  const filteredSurahs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return meta.surahs;
    return meta.surahs.filter(
      (s) =>
        s.nameLatin.toLowerCase().includes(q) ||
        s.translationId.toLowerCase().includes(q) ||
        String(s.id) === q
    );
  }, [meta.surahs, query]);

  const filteredJuzs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return meta.juzs;
    return meta.juzs.filter((j) => {
      const startName = surahMap.get(j.startSurah)?.toLowerCase() ?? '';
      return String(j.juzNumber).includes(q) || startName.includes(q);
    });
  }, [meta.juzs, query, surahMap]);

  const filteredAins = useMemo(() => {
    let list = meta.ains;
    if (ainSurahFilter > 0) {
      list = list.filter((a) => a.surahId === ainSurahFilter);
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((a) => {
      const sName = surahMap.get(a.surahId)?.toLowerCase() ?? '';
      return String(a.ainNumber) === q || sName.includes(q);
    });
  }, [meta.ains, ainSurahFilter, query, surahMap]);

  const lastReadSurahName = lastRead ? surahMap.get(lastRead.surahId) : '';

  const handleStartEditNote = (b: BookmarkItem) => {
    setEditingBookmarkId(b.id);
    setBookmarkNoteInput(b.note ?? '');
  };

  const handleSaveNote = (id: string) => {
    onUpdateBookmarkNote(id, bookmarkNoteInput.trim());
    setEditingBookmarkId(null);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Last Read Shortcut */}
      {lastRead && (
        <div className="p-3 pb-0">
          <button
            type="button"
            onClick={() => onJumpToAyah(lastRead.surahId, lastRead.ayahNumber)}
            className="flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors"
            style={{
              backgroundColor: 'var(--bg-accent-soft)',
              borderColor: 'var(--bg-accent)',
              color: 'var(--text-accent)',
            }}
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                <BookMarked className="h-3.5 w-3.5" />
                <span>Lanjutkan Bacaan</span>
              </div>
              <div className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {lastReadSurahName} : Ayat {lastRead.ayahNumber}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Juz {lastRead.juzNumber} • &apos;Ain {lastRead.ainNumber}
              </div>
            </div>
            <span className="text-xs font-bold">Buka →</span>
          </button>
        </div>
      )}

      {/* Search Bar & Mode Switcher */}
      <div className="p-3 pb-1 space-y-2">
        <div
          className="flex items-center gap-2 rounded-xl border px-3 py-2"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === 'meta'
                ? "Cari nama surat, juz, atau 'ain..."
                : 'Cari kata dalam terjemahan (cth: puasa, rezeki)...'
            }
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Search Mode Toggle Buttons */}
        <div className="flex rounded-lg border p-0.5 text-[11px] font-semibold" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-muted)' }}>
          <button
            type="button"
            onClick={() => setSearchMode('meta')}
            className={`flex-1 rounded-md py-1 text-center transition-colors ${
              searchMode === 'meta' ? 'shadow-xs' : ''
            }`}
            style={{
              backgroundColor: searchMode === 'meta' ? 'var(--bg-card)' : 'transparent',
              color: searchMode === 'meta' ? 'var(--text-accent)' : 'var(--text-secondary)',
            }}
          >
            Nama &amp; Nomor
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchMode('translation');
              onTabChange('search');
            }}
            className={`flex-1 rounded-md py-1 text-center transition-colors ${
              searchMode === 'translation' ? 'shadow-xs' : ''
            }`}
            style={{
              backgroundColor: searchMode === 'translation' ? 'var(--bg-card)' : 'transparent',
              color: searchMode === 'translation' ? 'var(--text-accent)' : 'var(--text-secondary)',
            }}
          >
            Kata Kunci Terjemahan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 px-3 py-2">
        {(
          [
            { id: 'surah', label: 'Surat', icon: BookOpen },
            { id: 'juz', label: 'Juz', icon: Layers },
            { id: 'ain', label: "'Ain", icon: Compass },
            { id: 'bookmark', label: 'Simpan', icon: Bookmark },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id && searchMode !== 'translation';
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSearchMode('meta');
                onTabChange(tab.id);
              }}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl font-semibold transition-colors ${
                elderMode ? 'py-2.5 text-xs' : 'py-2 text-[11px]'
              }`}
              style={{
                backgroundColor: active ? 'var(--bg-accent)' : 'var(--bg-muted)',
                color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 'Ain Sub-Filter (Filter 'Ain by Surah) */}
      {activeTab === 'ain' && searchMode !== 'translation' && (
        <div className="flex items-center gap-2 px-3 pb-2">
          <Filter className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-secondary)' }} />
          <select
            value={ainSurahFilter}
            onChange={(e) => setAinSurahFilter(Number(e.target.value))}
            aria-label="Filter 'Ain berdasarkan Surat"
            className="w-full rounded-lg border px-2 py-1 text-xs outline-none"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <option value={0}>Semua Surat ({meta.ains.length} &apos;Ain)</option>
            {meta.surahs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}. {s.nameLatin}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Khatam Planner Shortcut in 'Ain Tab */}
      {activeTab === 'ain' && searchMode !== 'translation' && onOpenKhatamPlanner && (
        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={onOpenKhatamPlanner}
            className="flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer hover:opacity-95"
            style={{
              backgroundColor: 'var(--bg-accent-soft)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-accent)',
            }}
          >
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-500" />
              <span>Rencana Khatam Sakinah</span>
            </div>
            <span className="text-[11px] font-semibold">Buka ➔</span>
          </button>
        </div>
      )}

      {/* List Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5">
        {/* Translation Search Results */}
        {searchMode === 'translation' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              <span>
                {isSearchingTranslation
                  ? 'Mencari...'
                  : `${translationResults.length} hasil ditemukan`}
              </span>
            </div>

            {query.trim().length < 2 ? (
              <div
                className="rounded-xl border p-5 text-center text-xs"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                Ketik minimal 2 huruf untuk mencari kata di seluruh 6.236 ayat terjemahan.
              </div>
            ) : translationResults.length === 0 && !isSearchingTranslation ? (
              <div
                className="rounded-xl border p-5 text-center text-xs"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                Tidak ditemukan ayat dengan kata kunci &quot;{query}&quot;.
              </div>
            ) : (
              translationResults.map((r) => (
                <button
                  key={`${r.surahId}:${r.ayahNumber}`}
                  type="button"
                  onClick={() => onJumpToAyah(r.surahId, r.ayahNumber)}
                  className="w-full rounded-xl border p-3 text-left transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold" style={{ color: 'var(--text-accent)' }}>
                    <span>
                      {r.surahName} : Ayat {r.ayahNumber}
                    </span>
                    <span className="font-normal" style={{ color: 'var(--text-secondary)' }}>
                      Juz {r.juzNumber} • &apos;Ain {r.ainNumber}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {r.translation}
                  </p>
                </button>
              ))
            )}
          </div>
        )}

        {/* Surahs Tab */}
        {searchMode !== 'translation' && activeTab === 'surah' &&
          filteredSurahs.map((s) => {
            const active = selectedSurahId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSurah(s.id)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 text-left transition-colors ${
                  elderMode ? 'py-3.5' : 'py-2.5'
                }`}
                style={{
                  backgroundColor: active ? 'var(--bg-accent-soft)' : 'var(--bg-card)',
                  borderColor: active ? 'var(--bg-accent)' : 'var(--border-color)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                    style={{
                      backgroundColor: active ? 'var(--bg-accent)' : 'var(--bg-muted)',
                      color: active ? 'var(--text-on-accent)' : 'var(--text-primary)',
                    }}
                  >
                    {s.id}
                  </span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {s.nameLatin}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {s.translationId} • {s.totalAyahs} ayat
                    </div>
                  </div>
                </div>
                <span
                  className="font-arabic-amiri text-lg"
                  style={{ color: 'var(--text-accent)' }}
                >
                  {s.nameArabic}
                </span>
              </button>
            );
          })}

        {/* Juzs Tab */}
        {searchMode !== 'translation' && activeTab === 'juz' &&
          filteredJuzs.map((j) => {
            const active = selectedJuz === j.juzNumber;
            return (
              <button
                key={j.juzNumber}
                type="button"
                onClick={() => onSelectJuz(j.juzNumber)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 text-left transition-colors ${
                  elderMode ? 'py-3.5' : 'py-2.5'
                }`}
                style={{
                  backgroundColor: active ? 'var(--bg-accent-soft)' : 'var(--bg-card)',
                  borderColor: active ? 'var(--bg-accent)' : 'var(--border-color)',
                }}
              >
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    Juz {j.juzNumber}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {surahMap.get(j.startSurah)} ({j.startAyah}) — {surahMap.get(j.endSurah)} ({j.endAyah})
                  </div>
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-accent)' }}>
                  Buka
                </span>
              </button>
            );
          })}

        {/* 'Ain Tab */}
        {searchMode !== 'translation' && activeTab === 'ain' &&
          filteredAins.map((a) => {
            const active = selectedAin === a.ainNumber;
            return (
              <button
                key={a.ainNumber}
                type="button"
                onClick={() => onSelectAin(a.ainNumber)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 text-left transition-colors ${
                  elderMode ? 'py-3.5' : 'py-2.5'
                }`}
                style={{
                  backgroundColor: active ? 'var(--bg-accent-soft)' : 'var(--bg-card)',
                  borderColor: active ? 'var(--bg-accent)' : 'var(--border-color)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                    style={{
                      backgroundColor: active ? 'var(--bg-accent)' : 'var(--bg-muted)',
                      color: active ? 'var(--text-on-accent)' : 'var(--text-primary)',
                    }}
                  >
                    ع{a.ainNumber}
                  </span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {surahMap.get(a.surahId)} • &apos;Ain ke-{a.surahAinIndex}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Ayat {a.startAyah}–{a.endAyah} • Juz {a.juzNumber}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-accent)' }}>
                  Buka
                </span>
              </button>
            );
          })}

        {/* Bookmarks Tab */}
        {searchMode !== 'translation' && activeTab === 'bookmark' && (
          <>
            {bookmarks.length === 0 ? (
              <div
                className="rounded-xl border p-6 text-center text-sm"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                Belum ada ayat yang di-bookmark. Tekan ikon bookmark pada ayat untuk menyimpannya di sini.
              </div>
            ) : (
              bookmarks.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl border p-3 transition-colors space-y-2"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onJumpToAyah(b.surahId, b.ayahNumber)}
                      className="text-left flex-1"
                    >
                      <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {surahMap.get(b.surahId)} : Ayat {b.ayahNumber}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        &apos;Ain ke-{b.ainNumber}
                      </div>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditNote(b)}
                        aria-label="Edit catatan bookmark"
                        title="Tambah/Edit Catatan"
                        className="rounded-lg p-1.5"
                        style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteBookmark(b.id)}
                        aria-label="Hapus bookmark"
                        title="Hapus Bookmark"
                        className="rounded-lg p-1.5"
                        style={{ backgroundColor: 'var(--bg-muted)', color: '#ef4444' }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bookmark Note */}
                  {editingBookmarkId === b.id ? (
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        value={bookmarkNoteInput}
                        onChange={(e) => setBookmarkNoteInput(e.target.value)}
                        placeholder="Tulis catatan kecil..."
                        className="flex-1 rounded-lg border px-2 py-1 text-xs outline-none"
                        style={{
                          backgroundColor: 'var(--bg-muted)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveNote(b.id)}
                        className="rounded-lg px-2 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: 'var(--bg-accent)',
                          color: 'var(--text-on-accent)',
                        }}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : b.note ? (
                    <div
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <FileText className="h-3 w-3 shrink-0" style={{ color: 'var(--text-accent)' }} />
                      <span className="truncate">{b.note}</span>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
