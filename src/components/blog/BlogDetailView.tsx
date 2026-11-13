import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Bookmark,
  Share2,
  Check,
  Compass,
  MessageSquare,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import type { BlogArticle } from '../../types/blog';
import { EmbeddedAyahWidget } from './EmbeddedAyahWidget';
import {
  isArticleReadLater,
  toggleReadLater,
  getUserReflectionForArticle,
  saveUserReflection,
} from '../../services/blog';
import { logActivity } from '../../services/telemetry';

interface BlogDetailViewProps {
  article: BlogArticle;
  onBackToCatalog: () => void;
  onNavigateToAyah: (surahId: number, ayahNumber: number) => void;
  onOpenProphetStory?: (slug: string) => void;
}

export const BlogDetailView: React.FC<BlogDetailViewProps> = ({
  article,
  onBackToCatalog,
  onNavigateToAyah,
  onOpenProphetStory,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSaved, setIsSaved] = useState(() => isArticleReadLater(article.id));
  const [reflectionText, setReflectionText] = useState(() =>
    getUserReflectionForArticle(article.id)
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Track scroll progress for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSave = () => {
    const nextState = toggleReadLater(article.id);
    setIsSaved(nextState);
    logActivity('TOGGLE_READ_LATER', { articleId: article.id, saved: nextState });
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserReflection(article.id, article.title, reflectionText);
    setReflectionSaved(true);
    setTimeout(() => setReflectionSaved(false), 2500);
    logActivity('SAVE_USER_REFLECTION', { articleId: article.id });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 'large':
        return 'text-lg sm:text-xl leading-relaxed';
      case 'xlarge':
        return 'text-xl sm:text-2xl leading-loose';
      default:
        return 'text-base sm:text-lg leading-relaxed';
    }
  };

  // Helper untuk merender konten dengan parsing shortcode [ayah surah=X ayah=Y]
  const renderContentWithEmbeddedAyahs = () => {
    const parts = article.content.split(/(\[ayah\s+surah=\d+\s+ayah=\d+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/\[ayah\s+surah=(\d+)\s+ayah=(\d+)\]/);
      if (match) {
        const sId = Number(match[1]);
        const aNum = Number(match[2]);
        const foundAyah = article.embeddedAyahs.find(
          (a) => a.surahId === sId && a.ayahNumber === aNum
        );

        if (foundAyah) {
          return (
            <EmbeddedAyahWidget
              key={index}
              ayah={foundAyah}
              onNavigateToAyah={onNavigateToAyah}
            />
          );
        }
      }

      // Paragraf teks biasa
      return part.split('\n\n').map((para, pIdx) => {
        if (!para.trim()) return null;

        // Render bullet list jika dimulai dengan tanda - atau angka
        if (para.startsWith('1. ') || para.startsWith('- ')) {
          return (
            <div key={`${index}-${pIdx}`} className={`my-3 pl-4 space-y-1.5 ${getFontSizeClass()}`}>
              {para.split('\n').map((line, lIdx) => (
                <p key={lIdx} style={{ color: 'var(--text-primary)' }}>
                  {line}
                </p>
              ))}
            </div>
          );
        }

        return (
          <p
            key={`${index}-${pIdx}`}
            className={`my-4 ${getFontSizeClass()}`}
            style={{ color: 'var(--text-primary)' }}
          >
            {para}
          </p>
        );
      });
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Reading Progress Bar (Fixed Top) */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/10 dark:bg-white/10">
        <div
          className="h-full bg-emerald-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Editorial Top Bar */}
      <header
        className="sticky top-0 z-40 flex h-16 items-center justify-between border-b px-4 sm:px-8 backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Katalog Jurnal</span>
          </button>

          <span
            className="hidden sm:inline-block rounded-md px-2.5 py-0.5 text-xs font-bold"
            style={{
              backgroundColor: 'var(--bg-accent-soft)',
              color: 'var(--text-accent)',
            }}
          >
            {article.pillarLabel}
          </span>
        </div>

        {/* Action Controls: Font Size, Read Later, Share */}
        <div className="flex items-center gap-2">
          {/* Font Size Adjuster */}
          <div
            className="inline-flex items-center rounded-xl border p-0.5 text-xs font-semibold"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
            }}
          >
            <button
              type="button"
              onClick={() => setFontSizeLevel('normal')}
              className={`rounded-lg px-2 py-1 transition-colors ${
                fontSizeLevel === 'normal' ? 'bg-black/10 dark:bg-white/10 font-bold' : ''
              }`}
              title="Ukuran font standar"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSizeLevel('large')}
              className={`rounded-lg px-2 py-1 transition-colors ${
                fontSizeLevel === 'large' ? 'bg-black/10 dark:bg-white/10 font-bold' : ''
              }`}
              title="Ukuran font besar"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSizeLevel('xlarge')}
              className={`rounded-lg px-2 py-1 transition-colors ${
                fontSizeLevel === 'xlarge' ? 'bg-black/10 dark:bg-white/10 font-bold' : ''
              }`}
              title="Ukuran font ekstra besar (Ramah Lansia)"
            >
              A++
            </button>
          </div>

          {/* Read Later Button */}
          <button
            type="button"
            onClick={handleToggleSave}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all shadow-xs ${
              isSaved
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-[var(--bg-muted)] border-[var(--border-color)] text-[var(--text-primary)]'
            }`}
            title={isSaved ? 'Hapus dari Baca Nanti' : 'Simpan ke Baca Nanti'}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-white' : ''}`} />
            <span className="hidden xs:inline">{isSaved ? 'Tersimpan' : 'Baca Nanti'}</span>
          </button>

          {/* Share Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            title="Salin tautan artikel"
          >
            {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Reading Canvas (Max-Width 720px for Optimal Reading Fatigue) */}
      <main className="flex-1 max-w-[740px] mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        {/* Article Header Meta */}
        <div className="space-y-4 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-bold"
              style={{
                backgroundColor: 'var(--bg-accent-soft)',
                color: 'var(--text-accent)',
              }}
            >
              {article.pillarLabel}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <Clock className="h-3 w-3" />
              <span>{article.readingTimeMinutes} menit baca</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
            &ldquo;{article.excerpt}&rdquo;
          </p>

          {/* Author Badge */}
          <div className="flex items-center gap-3 pt-2">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: 'var(--bg-accent)' }}
            >
              {article.author.avatarText || 'AU'}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {article.author.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {article.author.role} • {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Article Body Content */}
        <article className="prose max-w-none text-justify sm:text-left">
          {renderContentWithEmbeddedAyahs()}
        </article>

        {/* Taut Silang Cerdas ke Modul Kisah Nabi jika ada */}
        {article.relatedProphetSlug && (
          <div
            className="my-8 rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
            style={{
              backgroundColor: 'var(--bg-accent-soft)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Taut Silang Sirah Nabawi
                </h4>
                <p className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Ingin mendalami perjuangan dan mukjizat {article.relatedProphetName || 'Nabi'}?
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onOpenProphetStory && article.relatedProphetSlug) {
                  onOpenProphetStory(article.relatedProphetSlug);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer transition-transform active:scale-95 shadow-xs shrink-0 self-start sm:self-center"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Buka Sirah Lengkap →</span>
            </button>
          </div>
        )}

        {/* Tags Footnote */}
        <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-xs font-semibold mr-1" style={{ color: 'var(--text-secondary)' }}>
            Topik Bahasan:
          </span>
          {article.tags.map((t, idx) => (
            <span
              key={idx}
              className="rounded-lg border px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Kotak Catatan Tadabbur Pribadi (*Personal Reflection Box*) */}
        <div
          className="my-8 rounded-3xl border p-5 sm:p-6 shadow-sm space-y-4"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Catatan Tadabbur Pribadi Anda
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Hanya Anda yang dapat membaca catatan ini. Tersimpan di peramban dan akun profil Anda.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveReflection} className="space-y-3">
            <textarea
              rows={3}
              placeholder="Tuliskan renungan batin atau komitmen amal dari ayat dan bacaan ini..."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="w-full rounded-2xl border p-3.5 text-xs sm:text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--text-accent)]"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                {reflectionSaved ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Tersimpan aman!
                  </span>
                ) : (
                  'Tersimpan otomatis saat Anda menekan tombol simpan.'
                )}
              </span>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-transform active:scale-95 shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-accent)',
                  color: 'var(--text-on-accent)',
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Simpan Catatan</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

