import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ScrollText,
  BookmarkCheck
} from 'lucide-react';
import type { SelectedTafsirContext } from '../../types/tafsir';
import {
  getSavedTafsirTab,
  saveTafsirTab,
  getSavedTafsirFontSize,
  saveTafsirFontSize
} from '../../services/tafsir';

interface TafsirModalProps {
  context: SelectedTafsirContext | null;
  onClose: () => void;
  elderMode?: boolean;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  context,
  onClose,
  elderMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'wajiz' | 'tahlili'>(getSavedTafsirTab);
  const [fontSizeStep, setFontSizeStep] = useState<number>(() => {
    return elderMode ? 2 : getSavedTafsirFontSize();
  });
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setCopied(false);
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);
    };
  }, [context]);

  if (!context) return null;

  const handleTabChange = (tab: 'wajiz' | 'tahlili') => {
    setActiveTab(tab);
    saveTafsirTab(tab);
  };

  const handleFontChange = (step: number) => {
    setFontSizeStep(step);
    saveTafsirFontSize(step);
  };

  const currentTafsirText = activeTab === 'wajiz' ? context.tafsir.wajiz : context.tafsir.tahlili;

  const fontClasses = [
    'text-xs sm:text-sm leading-relaxed',
    'text-sm sm:text-base leading-relaxed',
    'text-base sm:text-lg leading-loose'
  ];
  const activeFontClass = fontClasses[Math.min(fontSizeStep, 2)];

  const handleCopy = () => {
    const text = `Tafsir Al-Qur'an Kemenag RI\nQS. ${context.surahName} [${context.surahId}:${context.ayahNumber}]\n\n${context.textUthmani}\n\nTerjemahan:\n"${context.translationId}"\n\n${activeTab === 'wajiz' ? 'Tafsir Wajiz (Ringkas)' : 'Tafsir Tahlili (Mendalam)'}:\n${currentTafsirText}\n\nSumber: Kementerian Agama Republik Indonesia (Kemenag RI) - QuranWeb`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda tidak mendukung Web Speech API.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.startsWith('id'));

    const intro = `Tafsir surah ${context.surahName} ayat ${context.ayahNumber}. ${activeTab === 'wajiz' ? 'Tafsir Wajiz' : 'Tafsir Tahlili'}. ${currentTafsirText}`;
    const utterance = new SpeechSynthesisUtterance(intro);
    if (idVoice) {
      utterance.voice = idVoice;
      utterance.lang = 'id-ID';
    } else {
      utterance.lang = 'id';
    }
    utterance.rate = 0.95;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
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
                backgroundColor: 'rgba(14, 165, 233, 0.15)',
                color: '#0284c7',
                border: '1px solid rgba(14, 165, 233, 0.3)',
              }}
            >
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{
                    backgroundColor: 'rgba(14, 165, 233, 0.15)',
                    color: '#0284c7',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                  }}
                >
                  QS. {context.surahName} : {context.ayahNumber}
                </span>
                <span className="text-xs opacity-60 font-medium hidden sm:inline">Kemenag RI</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold leading-tight mt-0.5">
                Tafsir Resmi Kementerian Agama RI
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Scaler */}
            <div className="flex items-center border rounded-xl overflow-hidden shadow-xs" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => handleFontChange(0)}
                className={`px-2 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  fontSizeStep === 0 ? 'bg-sky-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Ukuran Font Normal"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontChange(1)}
                className={`px-2 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  fontSizeStep === 1 ? 'bg-sky-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Ukuran Font Sedang (Lansia)"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => handleFontChange(2)}
                className={`px-2 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  fontSizeStep === 2 ? 'bg-sky-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Ukuran Font Besar"
              >
                A++
              </button>
            </div>

            {/* Quick Actions */}
            <button
              type="button"
              onClick={handleSpeak}
              className="p-2 rounded-xl border transition-all cursor-pointer"
              title={speaking ? 'Hentikan Pembacaan Suara' : 'Dengarkan Tafsir'}
              style={{
                backgroundColor: speaking ? 'rgba(14, 165, 233, 0.15)' : 'var(--bg-card)',
                borderColor: speaking ? 'rgba(14, 165, 233, 0.4)' : 'var(--border-color)',
                color: speaking ? '#0284c7' : 'var(--text-secondary)',
              }}
            >
              {speaking ? <VolumeX className="h-4 w-4 animate-pulse" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-xl border transition-all cursor-pointer"
              title="Salin Naskah Tafsir"
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
        </div>

        {/* Tab Switcher */}
        <div
          className="flex items-center px-5 pt-3 pb-1 border-b gap-2 shrink-0 overflow-x-auto"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <button
            type="button"
            onClick={() => handleTabChange('wajiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
              activeTab === 'wajiz'
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            style={{
              borderColor: activeTab === 'wajiz' ? undefined : 'var(--border-color)',
              color: activeTab === 'wajiz' ? undefined : 'var(--text-secondary)',
            }}
          >
            <BookOpen className="h-4 w-4" />
            <span>Tafsir Wajiz (Ringkas)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('tahlili')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
              activeTab === 'tahlili'
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            style={{
              borderColor: activeTab === 'tahlili' ? undefined : 'var(--border-color)',
              color: activeTab === 'tahlili' ? undefined : 'var(--text-secondary)',
            }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Tafsir Tahlili (Mendalam)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* Ayat Al-Qur'an Card */}
          <div
            className="p-5 rounded-2xl border space-y-3 shadow-xs"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <p
              className="font-arabic-amiri text-2xl sm:text-3xl leading-loose text-right"
              style={{ color: 'var(--text-primary)', direction: 'rtl' }}
            >
              {context.textUthmani}
            </p>
            <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-xs sm:text-sm italic opacity-85 leading-relaxed font-sans">
                "{context.translationId}"
              </p>
            </div>
          </div>

          {/* Tafsir Content Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                  {activeTab === 'wajiz' ? 'Penjelasan Intisari Tafsir Wajiz' : 'Uraian Analisis Tafsir Tahlili'}
                </h4>
              </div>
              <span className="text-[11px] opacity-60">Lajnah Kemenag RI</span>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-2xl border shadow-xs ${activeFontClass}`}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <div className="whitespace-pre-line leading-relaxed font-sans opacity-95">
                {currentTafsirText}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t shrink-0 text-xs"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div className="flex items-center gap-1.5 opacity-70">
            <ScrollText className="h-3.5 w-3.5 text-sky-500" />
            <span className="hidden sm:inline">Penyusun: Kementerian Agama Republik Indonesia</span>
            <span className="sm:hidden">Kemenag RI</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              {copied ? 'Tersalin!' : 'Salin Tafsir'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-semibold transition-all hover:bg-sky-700 cursor-pointer"
            >
              Tutup Lembar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
