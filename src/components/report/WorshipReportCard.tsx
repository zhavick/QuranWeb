import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Share2,
  Check,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { WorshipAnalyticsSummary } from '../../types/reportAnalytics';
import { generateWorshipReportImage } from '../../services/reportAnalytics';

interface WorshipReportCardModalProps {
  summary: WorshipAnalyticsSummary;
  isOpen: boolean;
  onClose: () => void;
}

export const WorshipReportCardModal: React.FC<WorshipReportCardModalProps> = ({
  summary,
  isOpen,
  onClose,
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    setGenerating(true);
    generateWorshipReportImage(summary)
      .then((url) => {
        setImageUrl(url);
        setGenerating(false);
      })
      .catch((err) => {
        console.error('Error generating card image', err);
        setGenerating(false);
      });
  }, [isOpen, summary]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `QuranWeb_Worship_Report_${summary.userName.replace(/\s+/g, '_')}_${summary.period}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareWhatsApp = () => {
    const text = `Alhamdulillah! Berikut ringkasan istiqomah ibadah saya di QuranWeb (${summary.periodLabel}):\n\n` +
      `📖 Tilawah: ${summary.tilawah.totalAyahRead} Ayat (±${summary.tilawah.estimatedMinutes} menit)\n` +
      `🕌 Kepatuhan Shalat: ${summary.prayer.complianceRate}% (${summary.prayer.totalFardhuCompleted} waktu fardhu)\n` +
      `📿 Dzikir: ${summary.dhikr.totalCount.toLocaleString()} ketukan tasbih\n` +
      `🌟 Predikat: ${summary.spiritualTitle}\n\n` +
      `Mari saling mendoakan dan menjaga keistiqomahan di jalan Allah: https://quranweb.id`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative flex flex-col max-h-[92vh] w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">Worship Report Card</h2>
              <p className="text-xs text-[var(--text-secondary)]">Kartu Prestasi Spiritual &amp; Evaluasi Muhasabah</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body / Image Preview */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
          {generating ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Sparkles className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-xs font-medium text-[var(--text-secondary)]">Merajut infografis ibadah Anda...</p>
            </div>
          ) : imageUrl ? (
            <div className="relative group max-h-[58vh] overflow-hidden rounded-xl border shadow-md" style={{ borderColor: 'var(--border-color)' }}>
              <img
                src={imageUrl}
                alt="Worship Report Card"
                className="w-full h-auto max-h-[58vh] object-contain rounded-xl"
              />
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-red-500">
              Gagal memuat pratinjau kartu laporan.
            </div>
          )}

          {/* Motivation Note */}
          <div className="mt-3 w-full rounded-xl p-3 border text-center text-xs" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-color)' }}>
            <p className="font-semibold" style={{ color: 'var(--text-accent)' }}>
              &ldquo;Bahan muhasabah dan evaluasi diri pribadi di hadapan Allah Ta&apos;ala.&rdquo;
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t p-4" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-muted)' }}>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <BookOpen className="h-4 w-4 text-[var(--text-secondary)]" />}
            <span>{copied ? 'Tersalin' : 'Salin Tautan'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Kirim ke WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={generating || !imageUrl}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Unduh Gambar PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
