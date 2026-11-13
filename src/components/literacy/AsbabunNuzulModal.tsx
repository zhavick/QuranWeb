import React, { useState } from 'react';
import { X, Sparkles, ScrollText, CheckCircle2 } from 'lucide-react';
import type { AsbabunNuzulItem } from '../../types/literacy';

interface AsbabunNuzulModalProps {
  item: AsbabunNuzulItem | null;
  onClose: () => void;
  elderMode?: boolean;
}

export const AsbabunNuzulModal: React.FC<AsbabunNuzulModalProps> = ({
  item,
  onClose,
  elderMode = false,
}) => {
  const [fontSizeStep, setFontSizeStep] = useState<number>(elderMode ? 2 : 1);

  if (!item) return null;

  const fontClasses = ['text-xs sm:text-sm', 'text-sm sm:text-base', 'text-base sm:text-lg'];
  const activeFontClass = fontClasses[fontSizeStep] || fontClasses[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Header Modal */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold">
                  Asbabun Nuzul (Sebab Turunnya Ayat)
                </h3>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: 'var(--bg-accent-soft)',
                    color: 'var(--text-accent)',
                  }}
                >
                  QS. {item.surahName}: {item.ayahNumber}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Konteks historis penurunan ayat berdasarkan riwayat hadits shahih
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Pengatur Ukuran Font */}
            <div className="hidden sm:flex items-center rounded-xl border p-0.5 text-xs font-bold" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setFontSizeStep(0)}
                className={`px-2 py-0.5 rounded-lg ${fontSizeStep === 0 ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSizeStep(1)}
                className={`px-2 py-0.5 rounded-lg ${fontSizeStep === 1 ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'}`}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSizeStep(2)}
                className={`px-2 py-0.5 rounded-lg ${fontSizeStep === 2 ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'}`}
              >
                A++
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border cursor-pointer hover:opacity-80"
              style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
              title="Tutup dialog Asbabun Nuzul"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Isi Naskah Konteks Historis */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
            <h4 className="text-base sm:text-lg font-extrabold text-amber-600 dark:text-amber-400">
              {item.title}
            </h4>
          </div>

          {/* Teks Peristiwa Historis */}
          <div
            className={`leading-relaxed space-y-3 font-serif ${activeFontClass}`}
            style={{ color: 'var(--text-primary)' }}
          >
            <p className="whitespace-pre-line text-justify leading-loose">
              {item.historicalContext}
            </p>
          </div>

          {/* Sanad Rawi & Kitab Rujukan */}
          <div
            className="rounded-2xl border p-3.5 space-y-1.5 text-xs"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Rujukan &amp; Sanad Periwayatan:</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              <div>
                <strong>Kitab Sumber:</strong> {item.sourceBook}
              </div>
              <div>
                <strong>Perawi:</strong> {item.narrator}
              </div>
            </div>
          </div>

          {/* Hikmah Kontekstual Bagi Kehidupan */}
          <div
            className="rounded-2xl border p-4 space-y-1.5 text-xs"
            style={{
              backgroundColor: 'var(--bg-accent-soft)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--text-accent)' }}>
              <Sparkles className="h-4 w-4" />
              <span>Pelajaran &amp; Hikmah Tadabbur:</span>
            </div>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item.wisdom}
            </p>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-bold cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-accent)',
              color: 'var(--text-on-accent)',
            }}
          >
            Tutup Naskah
          </button>
        </div>
      </div>
    </div>
  );
};
