import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Heart,
  BookOpen,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ArbainHadith } from '../../types/hadith';
import { getThemeBadgeColor } from '../../services/hadith';

interface HadithDetailModalProps {
  hadith: ArbainHadith | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onNavigateToAyah: (surahId: number, ayahNumber: number) => void;
  fontSizeStep: number;
}

export const HadithDetailModal: React.FC<HadithDetailModalProps> = ({
  hadith,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onNavigateToAyah,
  fontSizeStep,
}) => {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    // Reset state when modal changes
    setCopied(false);
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);
    };
  }, [hadith]);

  if (!isOpen || !hadith) return null;

  const themeMeta = getThemeBadgeColor(hadith.theme);

  // Dynamic font sizing
  const arabicSizes = ['text-2xl leading-relaxed', 'text-3xl leading-loose', 'text-4xl leading-loose'];
  const contentSizes = ['text-sm leading-relaxed', 'text-base leading-relaxed', 'text-lg leading-relaxed'];

  const arabicClass = arabicSizes[Math.min(fontSizeStep, 2)];
  const contentClass = contentSizes[Math.min(fontSizeStep, 2)];

  const handleCopy = () => {
    const text = `Hadits Arba'in An-Nawawiyah No. ${hadith.number}: ${hadith.title}\n\n${hadith.arabic}\n\nLatin: ${hadith.latin}\n\nArtinya:\n"${hadith.translation}"\n\n(${hadith.rawi})\n\nFaidah:\n${hadith.keyTakeaways.map((k, i) => `${i + 1}. ${k}`).join('\n')}\n\nDisalin dari QuranWeb`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Peramban Anda tidak mendukung sintesis suara (Web Speech API).');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Prefer Arabic voice for matan, fallback to Indonesian for translation
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    const indonesianVoice = voices.find((v) => v.lang.startsWith('id'));

    const utterance1 = new SpeechSynthesisUtterance(hadith.arabic);
    if (arabicVoice) {
      utterance1.voice = arabicVoice;
      utterance1.lang = 'ar-SA';
      utterance1.rate = 0.85;
    } else {
      utterance1.lang = 'ar';
      utterance1.rate = 0.85;
    }

    const utterance2 = new SpeechSynthesisUtterance(`Hadits nomor ${hadith.number}. ${hadith.title}. ${hadith.translation}`);
    if (indonesianVoice) {
      utterance2.voice = indonesianVoice;
      utterance2.lang = 'id-ID';
    } else {
      utterance2.lang = 'id';
    }
    utterance2.rate = 0.95;

    utterance1.onend = () => {
      window.speechSynthesis.speak(utterance2);
    };

    utterance2.onend = () => {
      setSpeaking(false);
    };

    utterance1.onerror = () => setSpeaking(false);
    utterance2.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm shadow-xs"
              style={{
                backgroundColor: themeMeta.bg,
                color: themeMeta.text,
                border: `1px solid ${themeMeta.border}`,
              }}
            >
              #{hadith.number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: themeMeta.bg,
                    color: themeMeta.text,
                    border: `1px solid ${themeMeta.border}`,
                  }}
                >
                  {themeMeta.label}
                </span>
                <span className="text-xs opacity-60 font-medium">Al-Arba'in An-Nawawiyyah</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold leading-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {hadith.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleFavorite(hadith.id)}
              className="p-2 rounded-lg border transition-all cursor-pointer"
              title={isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
              style={{
                backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card)',
                borderColor: isFavorite ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)',
                color: isFavorite ? '#ef4444' : 'var(--text-secondary)',
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleSpeak}
              className="p-2 rounded-lg border transition-all cursor-pointer"
              title={speaking ? 'Hentikan Audio' : 'Dengarkan Pelafalan'}
              style={{
                backgroundColor: speaking ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                borderColor: speaking ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
                color: speaking ? '#059669' : 'var(--text-secondary)',
              }}
            >
              {speaking ? <VolumeX className="h-4 w-4 animate-pulse" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-lg border transition-all cursor-pointer"
              title="Salin Hadits"
              style={{
                backgroundColor: copied ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                borderColor: copied ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
                color: copied ? '#059669' : 'var(--text-secondary)',
              }}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg border transition-all cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Matan Arab */}
          <div
            className="p-5 sm:p-6 rounded-2xl border text-right shadow-xs"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <p
              className={`font-arabic-amiri ${arabicClass} text-right`}
              style={{ color: 'var(--text-primary)', direction: 'rtl' }}
            >
              {hadith.arabic}
            </p>
          </div>

          {/* Transliterasi Latin */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Transliterasi</h4>
            <p className="text-xs sm:text-sm italic opacity-80 leading-relaxed font-serif">
              "{hadith.latin}"
            </p>
          </div>

          {/* Terjemahan Bahasa Indonesia */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-accent)' }}>
              Terjemahan Makna
            </h4>
            <div
              className={`p-4 rounded-xl border ${contentClass}`}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <p className="font-sans leading-relaxed">
                "{hadith.translation}"
              </p>
              <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border-color)' }}>
                <span className="font-semibold" style={{ color: themeMeta.text }}>
                  {hadith.rawi}
                </span>
                <span className="text-[11px] opacity-60">Sanad Shahih / Hasan</span>
              </div>
            </div>
          </div>

          {/* Faidah & Kandungan Hadits */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                Faidah &amp; Mutiara Kandungan Hadits
              </h4>
            </div>
            <div
              className="rounded-xl border p-4 space-y-2.5"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              {hadith.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold mt-0.5"
                    style={{
                      backgroundColor: themeMeta.bg,
                      color: themeMeta.text,
                      border: `1px solid ${themeMeta.border}`,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed opacity-90">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tautan Silang Ayat Al-Qur'an Terkait */}
          {hadith.relatedAyahs && hadith.relatedAyahs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                  Rujukan Ayat Al-Qur'an Terkait
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {hadith.relatedAyahs.map((ref, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToAyah(ref.surahId, ref.ayahNumber);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl border text-left transition-all hover:scale-[1.01] cursor-pointer group"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: '#059669',
                        }}
                      >
                        {ref.surahId}
                      </div>
                      <div>
                        <div className="text-xs font-semibold leading-tight group-hover:text-emerald-600 transition-colors">
                          QS. {ref.surahName} : Ayat {ref.ayahNumber}
                        </div>
                        <div className="text-[11px] opacity-60">Buka di Lembar Tilawah</div>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 group-hover:text-emerald-600 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t shrink-0 text-xs"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
        >
          <div className="flex items-center gap-2 opacity-70">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Kitab Al-Arba'in An-Nawawiyyah • 42 Hadits Sahih</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            Tutup Lembar Hadits
          </button>
        </div>
      </div>
    </div>
  );
};
