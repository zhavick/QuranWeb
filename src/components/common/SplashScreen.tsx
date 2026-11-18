import React, { useState, useEffect, useRef } from 'react';

interface SplashScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOADING_MESSAGES = [
  { at: 0, text: 'Menyiapkan mushaf & indeks 114 surah...' },
  { at: 40, text: 'Memuat tipografi Arab & terjemahan...' },
  { at: 80, text: 'Menyelaraskan antarmuka bacaan...' },
  { at: 100, text: 'Mushaf siap dibaca. Silakan masuk.' },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ isOpen, onClose }) => {
  const [progressValue, setProgressValue] = useState(0);
  const [statusText, setStatusText] = useState(LOADING_MESSAGES[0].text);
  const [isExiting, setIsExiting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setProgressValue(0);
    setStatusText(LOADING_MESSAGES[0].text);
    setIsExiting(false);

    let current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      current = Math.min(current + 4, 100);
      setProgressValue(current);

      for (let i = LOADING_MESSAGES.length - 1; i >= 0; i--) {
        if (current >= LOADING_MESSAGES[i].at) {
          setStatusText(LOADING_MESSAGES[i].text);
          break;
        }
      }

      if (current >= 100 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 45);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  const handleEnterApp = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .islamic-splash-pattern {
          background-color: #041f1c;
          background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d4af37' stroke-width='0.75' stroke-opacity='0.09'%3E%3Crect x='18' y='18' width='44' height='44'/%3E%3Crect x='18' y='18' width='44' height='44' transform='rotate(45 40 40)'/%3E%3Ccircle cx='40' cy='40' r='14'/%3E%3Cpath d='M40 0V80M0 40H80' stroke-opacity='0.04'/%3E%3C/g%3E%3C/svg%3E");
        }

        .quran-splash-logo-path {
          stroke-dasharray: 280;
          stroke-dashoffset: 280;
          animation: drawGoldSplash 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes drawGoldSplash {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes splashFloatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes splashGlowPulse {
          0%, 100% { opacity: 0.28; }
          50% { opacity: 0.5; }
        }

        @keyframes splashFadeUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .splash-animate-float {
          animation: splashFloatSlow 7s ease-in-out infinite;
        }

        .splash-animate-glow {
          animation: splashGlowPulse 5s ease-in-out infinite;
        }

        .splash-animate-fadeup {
          animation: splashFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .gold-frame-shadow {
          box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.75), 0 0 25px rgba(212, 175, 55, 0.14);
        }
      `}</style>

      <section
        id="quran-splash"
        className={`fixed inset-0 z-[100] flex flex-col justify-between islamic-splash-pattern overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 transition-all duration-700 ease-out text-[#fdfbf7] ${
          isExiting
            ? 'opacity-0 scale-105 pointer-events-none'
            : 'opacity-100 scale-100'
        }`}
      >
        {/* Efek Cahaya Ambien Hangat */}
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[540px] sm:h-[540px] bg-[#d4af37]/15 rounded-full blur-[120px] pointer-events-none splash-animate-glow" />
        <div className="fixed bottom-10 right-10 w-[260px] h-[260px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* BARIS ATAS: Salam Pembuka & Basmalah */}
        <header className="relative z-10 flex flex-col items-center text-center pt-1 splash-animate-fadeup">
          <p
            className="font-arabic-amiri text-2xl sm:text-3xl text-[#f3e5ab] tracking-wide drop-shadow-sm"
            dir="rtl"
            lang="ar"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#d4af37]/60" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#d4af37]/90 font-medium">
              Mushaf Digital Al-Qur&apos;an
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#d4af37]/60" />
          </div>
        </header>

        {/* KONTEN UTAMA TENGAH: Visual Al-Qur'an, Logo & Preamble */}
        <main className="relative z-10 max-w-5xl w-full mx-auto my-auto py-6 sm:py-8">
          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center rounded-3xl p-6 sm:p-9 lg:p-10 shadow-2xl backdrop-blur-xl border border-[#d4af37]/25"
            style={{ backgroundColor: 'rgba(7, 43, 39, 0.85)' }}
          >
            {/* KOLOM KIRI (5 Kolom): Image Al-Qur'an & Logo Kustom QuranWeb */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-[#d4af37]/35 gold-frame-shadow group">
                {/* Gambar Mushaf Al-Qur'an */}
                <div className="aspect-[4/3] sm:aspect-[4/4] bg-[#041f1c] relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=85"
                    alt="Mushaf Al-Qur'an Terbuka dengan Pencahayaan Hangat"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 opacity-90"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://placehold.co/700x700/041f1c/d4af37?text=QuranWeb+Mushaf';
                    }}
                  />
                  {/* Gradasi Gelap Lembut */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041f1c] via-[#041f1c]/40 to-transparent" />
                </div>

                {/* Overlay Logo QuranWeb */}
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#041f1c]/95 border border-[#d4af37]/60 shadow-xl flex items-center justify-center mb-3 splash-animate-float">
                    <svg
                      className="w-11 h-11"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient
                          id="goldGradSplash"
                          x1="8"
                          y1="8"
                          x2="56"
                          y2="56"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="#F3E5AB" />
                          <stop offset="50%" stopColor="#D4AF37" />
                          <stop offset="100%" stopColor="#AA8220" />
                        </linearGradient>
                      </defs>
                      {/* Bingkai Rub el Hizb */}
                      <rect
                        x="16"
                        y="16"
                        width="32"
                        height="32"
                        rx="3"
                        stroke="url(#goldGradSplash)"
                        strokeWidth="2.2"
                        className="quran-splash-logo-path"
                      />
                      <rect
                        x="16"
                        y="16"
                        width="32"
                        height="32"
                        rx="3"
                        transform="rotate(45 32 32)"
                        stroke="url(#goldGradSplash)"
                        strokeWidth="2.2"
                        className="quran-splash-logo-path"
                      />
                      {/* Siluet Mushaf Terbuka */}
                      <path
                        d="M21 37V26C25 26 29 27.5 32 30C35 27.5 39 26 43 26V37C39 37 35 38.5 32 41C29 38.5 25 37 21 37Z"
                        stroke="#FDFBF7"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="quran-splash-logo-path"
                      />
                      <path
                        d="M32 30V41"
                        stroke="#D4AF37"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-bold tracking-wide text-white">
                    Quran<span className="text-[#d4af37]">Web</span>
                  </h1>
                  <p className="text-xs text-emerald-100/75 mt-0.5">
                    Cahaya Petunjuk dalam Genggaman Digital
                  </p>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN (7 Kolom): Preamble & Informasi Aplikasi */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              {/* Muqaddimah */}
              <div className="space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#041f1c]/90 border border-[#d4af37]/30 text-[#d4af37] text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  <span>Muqaddimah &amp; Pengantar Aplikasi</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#fdfbf7] leading-snug">
                  Mendekatkan Diri dengan Al-Qur&apos;an Secara Tenang, Jernih, dan Bebas Gangguan
                </h2>

                <div className="space-y-3 text-sm sm:text-[15px] text-emerald-100/85 leading-relaxed font-light">
                  <p>
                    <strong className="font-medium text-[#f3e5ab]">
                      Assalamu’alaikum Warahmatullahi Wabarakatuh.
                    </strong>
                    <br />
                    Segala puji bagi Allah Subhanahu wa Ta&apos;ala yang telah menurunkan Al-Qur&apos;an
                    sebagai petunjuk bagi seluruh manusia.
                  </p>
                  <p>
                    <strong className="font-semibold text-white">QuranWeb</strong> hadir sebagai ikhtiar
                    digital dari{' '}
                    <span className="text-[#f3e5ab] font-medium">MaktabIT Technology</span> untuk
                    menyediakan ruang tilawah dan tadabbur berbasis web yang ringan, berestetika bersih,
                    serta nyaman dibaca di berbagai perangkat tanpa gangguan iklan.
                  </p>
                </div>
              </div>

              {/* Intisari Fitur QuranWeb (4 Poin) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#041f1c]/75 border border-emerald-800/70">
                  <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Mushaf 30 Juz Lengkap</h3>
                    <p className="text-[11px] text-emerald-200/70 mt-0.5">
                      Rasm jelas dengan tipografi Arab yang nyaman di mata.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#041f1c]/75 border border-emerald-800/70">
                  <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Terjemahan &amp; Makna</h3>
                    <p className="text-[11px] text-emerald-200/70 mt-0.5">
                      Dilengkapi terjemahan resmi Kemenag RI yang akurat.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#041f1c]/75 border border-emerald-800/70">
                  <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Navigasi Surah Instan</h3>
                    <p className="text-[11px] text-emerald-200/70 mt-0.5">
                      Akses cepat ke 114 surah, 30 juz, dan ruku&apos; &apos;Ain.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#041f1c]/75 border border-emerald-800/70">
                  <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Penanda Terakhir Baca</h3>
                    <p className="text-[11px] text-emerald-200/70 mt-0.5">
                      Menyimpan progres tilawah dan bookmark secara otomatis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bilah Kesiapan & Tombol Masuk Utama */}
              <div className="pt-3 border-t border-[#d4af37]/20 space-y-4">
                {/* Indikator Kesiapan Modul */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-200/80">{statusText}</span>
                    <span className="font-mono text-[#d4af37] font-semibold">
                      {progressValue}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#041f1c] rounded-full overflow-hidden border border-emerald-800">
                    <div
                      className="h-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] rounded-full transition-all duration-200"
                      style={{ width: `${progressValue}%` }}
                    />
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleEnterApp}
                    className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-400 hover:from-[#f3e5ab] hover:to-[#d4af37] text-[#041f1c] font-bold text-sm shadow-lg shadow-[#d4af37]/20 transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    <span>Mulai Membaca Al-Qur&apos;an</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>

                  <a
                    href="https://github.com/zhavick/QuranWeb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#041f1c]/80 hover:bg-[#041f1c] text-emerald-100/85 hover:text-white border border-emerald-700/70 text-xs font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                    <span>Repositori Proyek</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* BARIS BAWAH: BRANDING PEMBUAT (MAKTABIT TECHNOLOGY + LOGO) */}
        <footer className="relative z-10 max-w-5xl w-full mx-auto pt-2 pb-1 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/75">
          {/* Identitas & Logo Resmi MaktabIT Technology */}
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-2xl border border-[#d4af37]/25 shadow-md"
            style={{ backgroundColor: 'rgba(7, 43, 39, 0.9)' }}
          >
            {/* Logo SVG Kustom MaktabIT Technology */}
            <div className="w-9 h-9 rounded-xl bg-[#041f1c] border border-[#d4af37]/40 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Bingkai Segi Delapan MaktabIT */}
                <path
                  d="M24 8H48L64 24V48L48 64H24L8 48V24L24 8Z"
                  stroke="#D4AF37"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Monogram M / Buku Terbuka */}
                <path
                  d="M20 46V26L36 37L52 26V46"
                  stroke="#FDFBF7"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Titik Simpul Digital */}
                <circle cx="36" cy="20" r="3.5" fill="#10B981" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-emerald-300/70">
                Dikembangkan oleh
              </span>
              <span className="font-bold text-sm text-white tracking-tight">
                Maktab<span className="text-[#d4af37]">IT</span> Technology
              </span>
            </div>
          </div>

          {/* Keterangan Versi & Lisensi */}
          <div className="text-center sm:text-right text-[11px] text-emerald-200/60">
            <div>QuranWeb v2.1 • Software Engineering &amp; Digital Literacy</div>
            <div>&copy; 2026 MaktabIT Technology. Bebas Iklan &amp; Terbuka untuk Kebaikan.</div>
          </div>
        </footer>
      </section>
    </>
  );
};
