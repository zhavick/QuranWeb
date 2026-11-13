import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Clock,
  Bookmark,
  Sparkles,
  FileText,
} from 'lucide-react';
import type { BlogArticle, BlogPillar } from '../../types/blog';
import { fetchBlogArticles, isArticleReadLater, toggleReadLater } from '../../services/blog';
import { BlogDetailView } from './BlogDetailView';
import { logActivity } from '../../services/telemetry';

interface BlogCatalogProps {
  onBackToMushaf: () => void;
  onNavigateToAyah: (surahId: number, ayahNumber: number) => void;
  onOpenProphetStory?: (slug: string) => void;
  initialArticleSlug?: string | null;
}

export const BlogCatalog: React.FC<BlogCatalogProps> = ({
  onBackToMushaf,
  onNavigateToAyah,
  onOpenProphetStory,
  initialArticleSlug,
}) => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<BlogPillar | 'ALL'>('ALL');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBlogArticles().then((data) => {
      setArticles(data);
      setLoading(false);
      logActivity('VIEW_BLOG_CATALOG');

      if (initialArticleSlug) {
        const target = data.find((a) => a.slug === initialArticleSlug);
        if (target) {
          setSelectedArticle(target);
        }
      }
    });
  }, [initialArticleSlug]);

  const handleToggleBookmark = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    toggleReadLater(articleId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(articleId)) next.delete(articleId);
      else next.add(articleId);
      return next;
    });
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      if (selectedPillar !== 'ALL' && a.pillar !== selectedPillar) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchExcerpt = a.excerpt.toLowerCase().includes(q);
        const matchTags = a.tags.some((t) => t.toLowerCase().includes(q));
        const matchAuthor = a.author.name.toLowerCase().includes(q);
        if (!matchTitle && !matchExcerpt && !matchTags && !matchAuthor) {
          return false;
        }
      }
      return true;
    });
  }, [articles, selectedPillar, searchQuery]);

  // Jika artikel sedang dibaca di tampilan detail
  if (selectedArticle) {
    return (
      <BlogDetailView
        article={selectedArticle}
        onBackToCatalog={() => setSelectedArticle(null)}
        onNavigateToAyah={onNavigateToAyah}
        onOpenProphetStory={onOpenProphetStory}
      />
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Header */}
      <header
        className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 sm:px-8 backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMushaf}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Mushaf</span>
          </button>

          <div className="hidden sm:block h-5 w-px bg-[var(--border-color)]" />

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold leading-none">
                Jurnal &amp; Tadabbur Qur&apos;ani
              </h1>
              <span className="text-[11px] leading-tight" style={{ color: 'var(--text-secondary)' }}>
                Literasi Islami Bermartabat Bebas Iklan
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span
            className="rounded-full px-3 py-1 font-mono font-bold"
            style={{
              backgroundColor: 'var(--bg-accent-soft)',
              color: 'var(--text-accent)',
            }}
          >
            {filteredArticles.length} Artikel
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Editorial Banner */}
        <div
          className="relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-emerald-900 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>5 Pilar Konten • Mencerahkan Jiwa Tanpa Distraksi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Menghubungkan Firman Allah dengan Realitas Kehidupan
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Membaca Al-Qur&apos;an tidak berhenti pada pelafalan huruf. Telusuri artikel-artikel reflektif seputar tafsir maudhu&apos;i, kesehatan ibadah lansia, mutiara rasm &amp; tajwid, hingga penyejuk hati yang disusun oleh para asatidz dan dewan redaksi.
            </p>
          </div>

          <div
            className="absolute -right-8 -bottom-10 select-none text-9xl font-bold font-arabic-amiri opacity-5 dark:opacity-10 pointer-events-none"
            style={{ color: 'var(--text-accent)' }}
          >
            تدبر
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div
          className="rounded-2xl border p-4 shadow-sm space-y-4"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari artikel (misal: ketenangan, lansia, 'ain, istighfar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border pl-10 pr-3.5 py-2 text-xs sm:text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--text-accent)]"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* 5 Pillars Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs font-semibold">
            <span className="text-[11px] mr-1 hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>
              Pilar Konten:
            </span>
            {(
              [
                { id: 'ALL', label: 'Semua Pilar' },
                { id: 'tafsir', label: 'Tafsir Maudhu\'i' },
                { id: 'elder-care', label: 'Elder Care (Lansia)' },
                { id: 'ulumul-quran', label: 'Ulumul Qur\'an' },
                { id: 'tazkiyah', label: 'Penyejuk Jiwa' },
                { id: 'warta', label: 'Warta QuranWeb' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedPillar(tab.id)}
                className={`rounded-xl px-3 py-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  selectedPillar === tab.id
                    ? 'font-bold shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                style={{
                  backgroundColor:
                    selectedPillar === tab.id ? 'var(--bg-accent)' : 'var(--bg-muted)',
                  color:
                    selectedPillar === tab.id
                      ? 'var(--text-on-accent)'
                      : 'var(--text-secondary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Memuat artikel jurnal...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredArticles.length === 0 && (
          <div
            className="rounded-3xl border p-12 text-center shadow-xs space-y-3"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <BookOpen className="h-10 w-10 mx-auto text-emerald-500 opacity-60" />
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Tidak ditemukan artikel yang sesuai
            </h3>
            <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Pencarian &ldquo;{searchQuery}&rdquo; tidak membuahkan hasil. Coba ganti kata kunci atau pilih pilar konten lain.
            </p>
          </div>
        )}

        {/* Article Cards Grid */}
        {!loading && filteredArticles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((a) => {
              const saved = isArticleReadLater(a.id) || savedIds.has(a.id);
              return (
                <div
                  key={a.id}
                  className="group relative flex flex-col justify-between rounded-3xl border p-5 shadow-xs transition-all hover:shadow-md hover:border-[var(--text-accent)] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                  onClick={() => {
                    setSelectedArticle(a);
                    logActivity('READ_BLOG_ARTICLE', { id: a.id, title: a.title });
                  }}
                >
                  <div className="space-y-3">
                    {/* Top Card: Pillar & Reading Time */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: 'var(--bg-accent-soft)',
                          color: 'var(--text-accent)',
                        }}
                      >
                        {a.pillarLabel}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          <Clock className="h-3 w-3" />
                          <span>{a.readingTimeMinutes} mnt</span>
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmark(e, a.id)}
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                            saved
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-[var(--bg-muted)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-amber-500'
                          }`}
                          title={saved ? 'Tersimpan di Baca Nanti' : 'Simpan ke Baca Nanti'}
                        >
                          <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-white' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold group-hover:text-[var(--text-accent)] transition-colors leading-snug">
                      {a.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs line-clamp-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {a.excerpt}
                    </p>
                  </div>

                  {/* Card Bottom Author & Date */}
                  <div className="pt-4 mt-4 border-t flex items-center justify-between gap-2" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-xs"
                        style={{ backgroundColor: 'var(--bg-accent)' }}
                      >
                        {a.author.avatarText || 'A'}
                      </div>
                      <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {a.author.name}
                      </span>
                    </div>

                    <span className="text-[11px] shrink-0 font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(a.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
