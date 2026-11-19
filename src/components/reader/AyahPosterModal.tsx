import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Share2,
  Sparkles,
  LayoutTemplate,
  Check,
  Palette,
  Eye,
  RefreshCw
} from 'lucide-react';
import type { Ayah } from '../../types/quran';
import {
  renderAyahPoster,
  downloadPosterAsPng,
  sharePosterToWhatsApp,
  POSTER_THEMES,
  PosterRatio,
  PosterTheme,
  PosterOptions
} from '../../services/posterGenerator';

interface AyahPosterModalProps {
  ayah: Ayah | null;
  surahName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AyahPosterModal: React.FC<AyahPosterModalProps> = ({
  ayah,
  surahName,
  isOpen,
  onClose,
}) => {
  const [ratio, setRatio] = useState<PosterRatio>('1:1');
  const [theme, setTheme] = useState<PosterTheme>('zamrud');
  const [rendering, setRendering] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewImgRef = useRef<HTMLImageElement | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');

  const triggerRender = async () => {
    if (!ayah || !canvasRef.current) return;
    setRendering(true);

    const options: PosterOptions = {
      surahId: ayah.surahId,
      surahName,
      ayahNumber: ayah.ayahNumber,
      textUthmani: ayah.textUthmani,
      translationId: ayah.translationId,
      ratio,
      theme,
    };

    try {
      await renderAyahPoster(canvasRef.current, options);
      const dataUrl = canvasRef.current.toDataURL('image/png', 0.95);
      setPreviewDataUrl(dataUrl);
    } catch (e) {
      console.error('Failed to render poster:', e);
    } finally {
      setRendering(false);
    }
  };

  useEffect(() => {
    if (isOpen && ayah) {
      triggerRender();
    }
  }, [isOpen, ayah, ratio, theme]);

  if (!isOpen || !ayah) return null;

  const showNotification = (msg: string) => {
    setCopiedMsg(msg);
    setTimeout(() => setCopiedMsg(null), 3000);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const filename = `QuranWeb_QS_${surahName}_${ayah.ayahNumber}_${ratio.replace(':', 'x')}.png`;
    downloadPosterAsPng(canvasRef.current, filename);
    showNotification('Gambar poster berhasil diunduh ke galeri!');
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    const options: PosterOptions = {
      surahId: ayah.surahId,
      surahName,
      ayahNumber: ayah.ayahNumber,
      textUthmani: ayah.textUthmani,
      translationId: ayah.translationId,
      ratio,
      theme,
    };
    await sharePosterToWhatsApp(canvasRef.current, options);
    showNotification('Membuka jendela pembagian WhatsApp...');
  };

  const themeKeys: PosterTheme[] = ['zamrud', 'safir', 'mihrab', 'senja'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden full-res Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-xs"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#059669',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#059669',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  QS. {surahName} : Ayat {ayah.ayahNumber}
                </span>
                <span className="text-xs opacity-60 font-medium hidden sm:inline">Generator Poster Ayat</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold leading-tight mt-0.5">
                Bagikan Kutipan Ayat ke WhatsApp &amp; Media Sosial
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border transition-all cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Feedback Toast */}
        {copiedMsg && (
          <div className="absolute top-18 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-fade-in">
            <Check className="h-4 w-4" />
            <span>{copiedMsg}</span>
          </div>
        )}

        {/* Modal Body: Split view Preview vs Controls */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-stretch">
          {/* Left: Live Visual Preview */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] p-3 rounded-2xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            {rendering ? (
              <div className="flex flex-col items-center gap-2 text-xs opacity-70">
                <RefreshCw className="h-6 w-6 animate-spin text-emerald-500" />
                <span>Merender grafis kaligrafi...</span>
              </div>
            ) : previewDataUrl ? (
              <div className="relative group max-h-[50vh] flex items-center justify-center overflow-hidden rounded-xl shadow-lg border" style={{ borderColor: 'var(--border-color)' }}>
                <img
                  ref={previewImgRef}
                  src={previewDataUrl}
                  alt="Pratinjau Poster Ayat"
                  className="max-h-[48vh] w-auto object-contain rounded-xl select-none"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none text-white text-xs font-semibold gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span>Pratinjau Resolusi Tinggi (1080px)</span>
                </div>
              </div>
            ) : null}
            <span className="text-[11px] opacity-60 mt-3">
              Format: {ratio === '1:1' ? 'Persegi (1080×1080 px)' : 'Status / Story (1080×1920 px)'} • Bebas Iklan
            </span>
          </div>

          {/* Right: Customization Controls */}
          <div className="w-full md:w-80 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Ratio Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-80">
                  <LayoutTemplate className="h-3.5 w-3.5" />
                  <span>Ukuran / Rasio Kanvas</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRatio('1:1')}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      ratio === '1:1'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    style={{
                      borderColor: ratio === '1:1' ? undefined : 'var(--border-color)',
                      color: ratio === '1:1' ? undefined : 'var(--text-primary)',
                    }}
                  >
                    <div className="w-6 h-6 border-2 border-current rounded-sm" />
                    <span>1:1 Persegi</span>
                    <span className="text-[10px] opacity-75 font-normal">Feed Instagram &amp; WA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRatio('9:16')}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      ratio === '9:16'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    style={{
                      borderColor: ratio === '9:16' ? undefined : 'var(--border-color)',
                      color: ratio === '9:16' ? undefined : 'var(--text-primary)',
                    }}
                  >
                    <div className="w-4 h-6 border-2 border-current rounded-sm" />
                    <span>9:16 Vertikal</span>
                    <span className="text-[10px] opacity-75 font-normal">Status WA &amp; Story</span>
                  </button>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-80">
                  <Palette className="h-3.5 w-3.5" />
                  <span>Pilihan Tema Ornamen Islami</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {themeKeys.map((k) => {
                    const cfg = POSTER_THEMES[k];
                    const isSelected = theme === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setTheme(k)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected ? 'ring-2 ring-emerald-500 shadow-xs' : 'hover:opacity-90'
                        }`}
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: isSelected ? 'var(--text-accent)' : 'var(--border-color)',
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full shrink-0 shadow-inner"
                          style={{
                            background: `linear-gradient(135deg, ${cfg.bgGradStart}, ${cfg.accentGold})`,
                          }}
                        />
                        <span className="truncate">{cfg.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ayah Snippet Info */}
              <div
                className="p-3.5 rounded-xl border text-xs space-y-1.5 leading-relaxed"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Kutipan yang Dirender:
                </div>
                <p className="line-clamp-2 opacity-80 italic">
                  "{ayah.translationId}"
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-3">
              <button
                type="button"
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                <span>Bagikan ke WhatsApp Sekarang</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <Download className="h-4 w-4" />
                <span>Unduh Berkas Gambar PNG (1080p)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
