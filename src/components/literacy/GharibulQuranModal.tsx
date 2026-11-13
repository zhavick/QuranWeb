import React, { useState } from 'react';
import { Languages, X, Sparkles } from 'lucide-react';
import type { GharibulQuranWord } from '../../types/literacy';

interface GharibulQuranModalProps {
  isOpen?: boolean;
  words: GharibulQuranWord[];
  onClose: () => void;
  elderMode?: boolean;
}

export const GharibulQuranModal: React.FC<GharibulQuranModalProps> = ({
  isOpen = true,
  words,
  onClose,
  elderMode = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!isOpen || !words || words.length === 0) return null;

  const currentWord = words[selectedIndex] || words[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="flex flex-col w-full max-w-xl max-h-[90vh] rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold">
                  Kamus Mufradat Kosakata Sukar
                </h3>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: 'var(--bg-accent-soft)',
                    color: 'var(--text-accent)',
                  }}
                >
                  Gharibul Qur&apos;an
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Eksplorasi akar kata (jadzr) dan rahasia balaghah sastra Al-Qur&apos;an
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border cursor-pointer hover:opacity-80"
            style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
            title="Tutup kamus mufradat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Pemilihan Kata jika dalam satu ayat ada lebih dari 1 kata */}
        {words.length > 1 && (
          <div className="flex items-center gap-2 px-5 pt-3 border-b pb-2 overflow-x-auto" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-xs font-semibold mr-1" style={{ color: 'var(--text-secondary)' }}>
              Pilih Kata:
            </span>
            {words.map((w, idx) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  selectedIndex === idx ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: selectedIndex === idx ? 'var(--bg-accent)' : 'var(--bg-muted)',
                  color: selectedIndex === idx ? 'var(--text-on-accent)' : 'var(--text-primary)',
                }}
              >
                <span className="font-arabic text-sm">{w.wordArabic}</span> ({w.transliteration})
              </button>
            ))}
          </div>
        )}

        {/* Body Penjelasan Mufradat */}
        <div className={`flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 ${elderMode ? 'text-base sm:text-lg' : ''}`}>
          {/* Kartu Sorotan Kata Arab & Akar Kata */}
          <div
            className="rounded-2xl border p-4 text-center space-y-2"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="font-arabic text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400 py-1">
              {currentWord.wordArabic}
            </div>
            <div className="text-sm font-semibold italic" style={{ color: 'var(--text-secondary)' }}>
              /{currentWord.transliteration}/
            </div>

            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 border text-xs font-bold" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Akar Kata (Jadzr):</span>
              <span className="font-arabic text-base text-amber-600 dark:text-amber-400 font-bold">
                {currentWord.rootArabic}
              </span>
            </div>
          </div>

          {/* Makna Leksikal Dasar */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Makna Leksikal Dasar:
            </h4>
            <div className="rounded-xl border p-3 text-xs sm:text-sm font-medium" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              {currentWord.literalMeaning}
            </div>
          </div>

          {/* Rahasia Balaghah & Kedalaman Makna */}
          <div
            className="rounded-2xl border p-4 space-y-2 text-xs sm:text-sm"
            style={{
              backgroundColor: 'var(--bg-accent-soft)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--text-accent)' }}>
              <Sparkles className="h-4 w-4" />
              <span>Konteks Balaghah &amp; Kedalaman Sastra:</span>
            </div>
            <p className="leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {currentWord.balaghahMeaning}
            </p>
          </div>

          {/* Catatan Tadabbur Ayat */}
          <div className="rounded-2xl border p-3.5 space-y-1 text-xs" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}>
            <span className="font-bold" style={{ color: 'var(--text-secondary)' }}>
              Pesan Tadabbur Ayat:
            </span>
            <p className="leading-relaxed opacity-90">{currentWord.contextualNote}</p>
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
            Tutup Kamus
          </button>
        </div>
      </div>
    </div>
  );
};
