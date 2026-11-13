import React, { useState, useEffect } from 'react';
import { Compass, ChevronRight } from 'lucide-react';
import type { ProphetMeta, ProphetDetail } from '../../types/prophet';
import { fetchProphetsBySurah, fetchProphetById } from '../../services/prophets';
import { ProphetDetailModal } from './ProphetDetailModal';
import { logActivity } from '../../services/telemetry';

interface ProphetLanternBannerProps {
  surahId: number;
  surahName?: string;
  onNavigateToAyah: (surahId: number, ayahNumber: number) => void;
  onOpenProphetsCatalog: () => void;
}

export const ProphetLanternBanner: React.FC<ProphetLanternBannerProps> = ({
  surahId,
  surahName,
  onNavigateToAyah,
  onOpenProphetsCatalog,
}) => {
  const [relatedProphets, setRelatedProphets] = useState<ProphetMeta[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<ProphetDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProphetsBySurah(surahId).then((list) => {
      setRelatedProphets(list);
    });
  }, [surahId]);

  if (relatedProphets.length === 0) return null;

  const handleOpenDetail = async (prophetId: number) => {
    const detail = await fetchProphetById(prophetId);
    if (detail) {
      setSelectedDetail(detail);
      setModalOpen(true);
      logActivity('OPEN_PROPHET_FROM_LANTERN', {
        surahId,
        prophetId,
        prophetName: detail.name,
      });
    }
  };

  return (
    <>
      <div
        className="mb-4 rounded-2xl border p-3.5 sm:p-4 shadow-xs transition-all animate-in fade-in duration-300"
        style={{
          backgroundColor: 'var(--bg-accent-soft)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold shadow-xs">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Lentera Kisah Nabawi
                </span>
                <span className="text-[10px] opacity-75 font-medium" style={{ color: 'var(--text-secondary)' }}>
                  (Taut Silang QS. {surahName || surahId})
                </span>
              </div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                Surat ini mengabadikan kisah:{' '}
                <span style={{ color: 'var(--text-accent)' }}>
                  {relatedProphets.map((p) => p.name).join(', ')}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {relatedProphets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleOpenDetail(p.id)}
                className="inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-bold cursor-pointer transition-transform active:scale-95 shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                title={`Buka latar belakang & doa Nabi ${p.name}`}
              >
                <span>Sirah {p.name}</span>
                <ChevronRight className="h-3 w-3 text-amber-500" />
              </button>
            ))}

            <button
              type="button"
              onClick={onOpenProphetsCatalog}
              className="inline-flex items-center gap-1 text-[11px] font-semibold underline underline-offset-2 hover:opacity-80 ml-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>Katalog 25 Nabi</span>
            </button>
          </div>
        </div>
      </div>

      <ProphetDetailModal
        prophet={selectedDetail}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigateToAyah={(sId, aNum) => {
          setModalOpen(false);
          onNavigateToAyah(sId, aNum);
        }}
        onSelectProphet={(id) => handleOpenDetail(id)}
      />
    </>
  );
};
