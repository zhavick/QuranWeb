import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Sparkles,
  Compass,
  Star,
} from 'lucide-react';
import type { ProphetMeta, ProphetDetail, ProphetEra } from '../../types/prophet';
import { fetchProphetsMeta, fetchProphetById } from '../../services/prophets';
import { ProphetDetailModal } from './ProphetDetailModal';
import { logActivity } from '../../services/telemetry';

interface ProphetsCatalogProps {
  onBackToMushaf: () => void;
  onNavigateToAyah: (surahId: number, ayahNumber: number) => void;
  initialProphetId?: number | null;
}

export const ProphetsCatalog: React.FC<ProphetsCatalogProps> = ({
  onBackToMushaf,
  onNavigateToAyah,
  initialProphetId,
}) => {
  const [prophetsMeta, setProphetsMeta] = useState<ProphetMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<ProphetEra | 'ALL'>('ALL');
  const [onlyUlulAzmi, setOnlyUlulAzmi] = useState(false);

  // Modal State
  const [selectedProphetDetail, setSelectedProphetDetail] = useState<ProphetDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProphetsMeta().then((data) => {
      setProphetsMeta(data);
      setLoading(false);
      logActivity('VIEW_PROPHETS_CATALOG');

      // Jika ada initialProphetId (misal dari lentera mushaf)
      if (initialProphetId) {
        handleOpenProphet(initialProphetId);
      }
    });
  }, [initialProphetId]);

  const handleOpenProphet = async (id: number) => {
    const detail = await fetchProphetById(id);
    if (detail) {
      setSelectedProphetDetail(detail);
      setModalOpen(true);
      logActivity('VIEW_PROPHET_STORY', { id, name: detail.name });
    }
  };

  // Filter Data Nabi
  const filteredProphets = useMemo(() => {
    return prophetsMeta.filter((p) => {
      // Filter Era
      if (selectedEra !== 'ALL' && p.era !== selectedEra) {
        return false;
      }
      // Filter Ulul Azmi
      if (onlyUlulAzmi && !p.isUlulAzmi) {
        return false;
      }
      // Filter Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchArabic = p.arabicName.includes(q);
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchRegion = p.region.toLowerCase().includes(q);
        const matchPeople = p.people.toLowerCase().includes(q);
        const matchSummary = p.summary.toLowerCase().includes(q);
        if (!matchName && !matchArabic && !matchTitle && !matchRegion && !matchPeople && !matchSummary) {
          return false;
        }
      }
      return true;
    });
  }, [prophetsMeta, selectedEra, onlyUlulAzmi, searchQuery]);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Navbar */}
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
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
            >
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold leading-none">
                Kisah Para Rasulullah
              </h1>
              <span className="text-[11px] leading-tight" style={{ color: 'var(--text-secondary)' }}>
                Qashashul Anbiya&apos; • 25 Nabi &amp; Rasul Terpilih
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
            {filteredProphets.length} / 25 Nabi
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Pengantar Sejuk & Ramah Lansia */}
        <div
          className="relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-amber-900 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Teladan Sepanjang Zaman • Sanad Shahih Tanpa Israiliyyat</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Menghidupkan Sirah, Menancapkan Ketauhidan
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Al-Qur&apos;anul Karim sarat dengan kisah perjuangan para nabi menghadapi ujian hidup, dakwah kepada kaumnya, serta doa-doa mustajab yang diabadikan. Telusuri hikmahnya dan temukan ayat-ayat bersangkutan di lembar tilawah mushaf.
            </p>
          </div>

          <div
            className="absolute -right-8 -bottom-10 select-none text-9xl font-bold font-arabic-amiri opacity-5 dark:opacity-10 pointer-events-none"
            style={{ color: 'var(--text-accent)' }}
          >
            الأنبياء
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div
          className="rounded-2xl border p-4 shadow-sm space-y-4"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nabi (misal: Yusuf, Musa, Khalilullah, Makkah)..."
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

            {/* Ulul Azmi Quick Toggle Button */}
            <button
              type="button"
              onClick={() => setOnlyUlulAzmi(!onlyUlulAzmi)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer transition-all shadow-xs ${
                onlyUlulAzmi
                  ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                  : 'bg-[var(--bg-muted)] border-[var(--border-color)] text-[var(--text-secondary)]'
              }`}
              title="Tampilkan hanya 5 Rasul Ulul Azmi (Nuh, Ibrahim, Musa, Isa, Muhammad)"
            >
              <Star className={`h-3.5 w-3.5 ${onlyUlulAzmi ? 'fill-white' : ''}`} />
              <span>5 Rasul Ulul Azmi</span>
            </button>
          </div>

          {/* Era Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs font-semibold">
            <span className="text-[11px] mr-1 hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>
              Pilih Era:
            </span>
            {(
              [
                { id: 'ALL', label: 'Semua Era (25)' },
                { id: 'permulaan', label: 'Era Permulaan (5)' },
                { id: 'israil', label: 'Era Kebangkitan & Bani Israil (19)' },
                { id: 'penutup', label: 'Era Penutup Kenabian (1)' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedEra(tab.id)}
                className={`rounded-xl px-3 py-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  selectedEra === tab.id
                    ? 'font-bold shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                style={{
                  backgroundColor:
                    selectedEra === tab.id ? 'var(--bg-accent)' : 'var(--bg-muted)',
                  color:
                    selectedEra === tab.id
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

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 text-center text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Memuat data 25 Nabi &amp; Rasul...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProphets.length === 0 && (
          <div
            className="rounded-3xl border p-12 text-center shadow-xs space-y-3"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <Compass className="h-10 w-10 mx-auto text-amber-500 opacity-60" />
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Tidak ditemukan kisah nabi yang sesuai
            </h3>
            <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Pencarian &ldquo;{searchQuery}&rdquo; tidak cocok dengan filter aktif. Coba gunakan kata kunci lain atau reset filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedEra('ALL');
                setOnlyUlulAzmi(false);
              }}
              className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              Reset Semua Filter
            </button>
          </div>
        )}

        {/* 25 Prophets Grid Cards */}
        {!loading && filteredProphets.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProphets.map((p) => (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between rounded-3xl border p-5 shadow-xs transition-all hover:shadow-md hover:border-[var(--text-accent)] cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
                onClick={() => handleOpenProphet(p.id)}
              >
                <div className="space-y-3">
                  {/* Card Header: Number, Era & Arabic Name */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-bold shadow-xs"
                        style={{
                          backgroundColor: 'var(--bg-accent-soft)',
                          color: 'var(--text-accent)',
                        }}
                      >
                        #{p.id}
                      </span>
                      {p.isUlulAzmi && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold text-amber-900 bg-amber-400/90 dark:text-amber-100 dark:bg-amber-600/80 shadow-xs"
                          title="5 Rasul Ulul Azmi"
                        >
                          ★ Ulul Azmi
                        </span>
                      )}
                    </div>

                    <span
                      className="arabic-text font-arabic-amiri text-xl font-bold"
                      style={{ color: 'var(--text-accent)' }}
                    >
                      {p.arabicName}
                    </span>
                  </div>

                  {/* Name & Title */}
                  <div>
                    <h3 className="text-base font-bold group-hover:text-[var(--text-accent)] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {p.title}
                    </p>
                  </div>

                  {/* Metadata Chips: Wilayah, Kaum, Sebutan */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    <span
                      className="rounded-md px-2 py-0.5 border"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      📍 {p.region.split('(')[0].trim()}
                    </span>
                    <span
                      className="rounded-md px-2 py-0.5 border"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      📖 {p.mentionsInQuran}x di Qur&apos;an
                    </span>
                  </div>

                  {/* Summary Snippet */}
                  <p className="text-xs line-clamp-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {p.summary}
                  </p>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-4 mt-4 border-t flex items-center justify-between gap-2" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {p.eraLabel}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProphet(p.id);
                    }}
                    className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-transform active:scale-95 shadow-xs"
                    style={{
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--text-on-accent)',
                    }}
                  >
                    <span>Baca Kisah</span>
                    <BookOpen className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Prophet Detail Modal */}
      <ProphetDetailModal
        prophet={selectedProphetDetail}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigateToAyah={(surahId, ayahNumber) => {
          setModalOpen(false);
          onNavigateToAyah(surahId, ayahNumber);
        }}
        onSelectProphet={(id) => handleOpenProphet(id)}
        totalProphets={25}
      />
    </div>
  );
};
