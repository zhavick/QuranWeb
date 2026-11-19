import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Compass,
} from 'lucide-react';
import { ActiveAdhanState } from '../../types/adhan';
import { stopAdhan } from '../../services/adhanAudio';
import { togglePrayerCheck } from '../../services/reportAnalytics';

interface AdhanPlayerModalProps {
  state: ActiveAdhanState | null;
  onClose: () => void;
  elderMode?: boolean;
}

const ADHAN_LYRICS = [
  { ar: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ', latin: 'Allahu Akbar, Allahu Akbar (2x)', id: 'Allah Maha Besar, Allah Maha Besar' },
  { ar: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ', latin: 'Asyhadu alla ilaha illallah (2x)', id: 'Aku bersaksi tiada Tuhan selain Allah' },
  { ar: 'أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ', latin: 'Asyhadu anna Muhammadar Rasulullah (2x)', id: 'Aku bersaksi bahwa Muhammad adalah utusan Allah' },
  { ar: 'حَيَّ عَلَى الصَّلَاةِ', latin: "Hayya 'alash-shalah (2x)", id: 'Marilah mendirikan shalat' },
  { ar: 'حَيَّ عَلَى الْفَلَاحِ', latin: "Hayya 'alal-falah (2x)", id: 'Marilah menuju kemenangan' },
  { ar: 'الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ', latin: 'Ash-shalatu khairum minan-naum (2x - Khusus Subuh)', id: 'Shalat itu lebih baik daripada tidur', isFajrOnly: true },
  { ar: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ', latin: 'Allahu Akbar, Allahu Akbar (1x)', id: 'Allah Maha Besar, Allah Maha Besar' },
  { ar: 'لَا إِلَهَ إِلَّا اللَّهُ', latin: 'La ilaha illallah (1x)', id: 'Tiada Tuhan selain Allah' },
];

export const AdhanPlayerModal: React.FC<AdhanPlayerModalProps> = ({
  state,
  onClose,
  elderMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'lyrics' | 'doa'>('lyrics');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isWudhuChecked, setIsWudhuChecked] = useState<boolean>(false);
  const [copiedDoa, setCopiedDoa] = useState<boolean>(false);

  useEffect(() => {
    if (state?.isOpen) {
      setIsMuted(false);
      setIsWudhuChecked(false);
    }
  }, [state]);

  if (!state || !state.isOpen) return null;

  const handleMuteToggle = () => {
    stopAdhan();
    setIsMuted(true);
  };

  const handleWudhuClick = () => {
    setIsWudhuChecked(true);
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    togglePrayerCheck(todayStr, state.prayerKey);
    setTimeout(() => {
      stopAdhan();
      onClose();
    }, 1200);
  };

  const handleClose = () => {
    stopAdhan();
    onClose();
  };

  const copyDoa = () => {
    const text = `اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ\n\n` +
      `Allahumma rabba hadzihid da’watit tammah wash-shalatil qa’imah, ati muhammadanil wasilata wal fadhilah, wab’atshu maqamam mahmudanilladzi wa’adtah.\n\n` +
      `Artinya: "Ya Allah, Pemilik panggilan yang sempurna ini dan shalat yang didirikan, berikanlah kepada Nabi Muhammad wasilah (kedudukan tinggi) dan keutamaan, serta bangkitkanlah beliau pada tempat yang terpuji sebagaimana telah Engkau janjikan." (HR. Bukhari no. 614)`;
    navigator.clipboard.writeText(text);
    setCopiedDoa(true);
    setTimeout(() => setCopiedDoa(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`relative flex flex-col max-h-[92vh] w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden ${
          elderMode ? 'text-base' : 'text-sm'
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Animated Banner Header */}
        <div
          className="relative overflow-hidden p-6 text-center text-white space-y-3"
          style={{
            background: 'linear-gradient(135deg, #06281e 0%, #0d523e 50%, #061a14 100%)',
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Tutup Panggilan Shalat"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Sound Wave Pulse Icon */}
          <div className="relative inline-flex items-center justify-center">
            {!isMuted && (
              <>
                <span className="absolute h-16 w-16 rounded-full bg-emerald-500/30 animate-ping" />
                <span className="absolute h-20 w-20 rounded-full bg-emerald-500/15 animate-pulse" />
              </>
            )}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg border border-emerald-400/40">
              {isMuted ? <VolumeX className="h-7 w-7 text-white/70" /> : <Volume2 className="h-7 w-7 animate-bounce" />}
            </div>
          </div>

          <div>
            <span className="inline-block rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Panggilan Shalat Masuk • {state.currentTimeFormatted} WIB
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight text-white">
              WAKTU SHALAT {state.prayerLabel.toUpperCase()} TELAH TIBA
            </h2>
            <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
              Dilantunkan oleh: {state.muadzinName} ({state.muadzinLocation})
            </p>
          </div>

          {/* Mute Button */}
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={handleMuteToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                isMuted
                  ? 'bg-gray-700/60 text-gray-300 border border-gray-600'
                  : 'bg-red-500/80 hover:bg-red-600 text-white border border-red-400/40'
              }`}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span>{isMuted ? 'Suara Telah Diheningkan' : 'Heningkan Suara (Mute)'}</span>
            </button>
          </div>
        </div>

        {/* Tab Selector: Lafadz Azan vs Doa Sesudah Azan */}
        <div className="flex border-b px-4 gap-2 pt-2" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-muted)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('lyrics')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'lyrics'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white/5'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Lafadz Azan &amp; Jawaban</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('doa')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'doa'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white/5'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Doa Sesudah Azan</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'lyrics' ? (
            <div className="space-y-2.5">
              <p className="text-[11px] text-[var(--text-secondary)]">
                Disunnahkan bagi yang mendengarkan azan untuk menirukan lafadz yang diucapkan muadzin, kecuali pada lafadz <em>Hayya &apos;alash shalah</em> dan <em>Hayya &apos;alal falah</em> dengan menjawab: <strong>La haula wa la quwwata illa billah</strong>.
              </p>

              <div className="space-y-2">
                {ADHAN_LYRICS.map((item, idx) => {
                  if (item.isFajrOnly && state.prayerKey !== 'fajr') return null;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-all hover:bg-black/5 dark:hover:bg-white/5"
                      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-app)' }}
                    >
                      <div>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {item.latin}
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          {item.id}
                        </p>
                      </div>
                      <p className="font-arabic text-lg sm:text-xl text-right self-end sm:self-center font-bold" dir="rtl">
                        {item.ar}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className="rounded-xl border p-4.5 space-y-3"
                style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>Lafadz Doa Sesudah Azan</span>
                  </span>
                  <button
                    type="button"
                    onClick={copyDoa}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-emerald-500 cursor-pointer"
                  >
                    {copiedDoa ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedDoa ? 'Tersalin' : 'Salin Doa'}</span>
                  </button>
                </div>

                <p className="font-arabic text-xl sm:text-2xl text-right leading-loose font-bold" dir="rtl">
                  اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
                </p>

                <p className="text-xs italic text-[var(--text-secondary)] leading-relaxed">
                  Allahumma rabba hadzihid da&apos;watit tammah wash-shalatil qa&apos;imah, ati muhammadanil wasilata wal fadhilah, wab&apos;atshu maqamam mahmudanilladzi wa&apos;adtah.
                </p>

                <p className="text-xs text-[var(--text-primary)] leading-relaxed border-t pt-2" style={{ borderColor: 'var(--border-color)' }}>
                  &ldquo;Ya Allah, Pemilik seruan yang sempurna ini dan shalat yang didirikan, berikanlah kepada Nabi Muhammad wasilah (kedudukan tinggi di surga) dan keutamaan, serta bangkitkanlah beliau pada tempat yang terpuji sebagaimana telah Engkau janjikan.&rdquo;
                </p>

                <span className="text-[10px] font-semibold text-[var(--text-secondary)] block text-right">
                  — HR. Bukhari no. 614
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div
          className="border-t p-4 flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-muted)' }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border-color)' }}
          >
            Tutup Dialog
          </button>

          <button
            type="button"
            onClick={handleWudhuClick}
            disabled={isWudhuChecked}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isWudhuChecked
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02]'
            }`}
          >
            {isWudhuChecked ? <CheckCircle2 className="h-4 w-4" /> : <Compass className="h-4 w-4" />}
            <span>{isWudhuChecked ? 'Shalat Dicatat! Alhamdulillah' : 'Sudah Bersiap / Mengambil Wudhu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
