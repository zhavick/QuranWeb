import React from 'react';
import { ArrowLeft } from 'lucide-react';

export interface BackToMushafButtonProps {
  onClick: () => void;
  label?: string;
  elderMode?: boolean;
  className?: string;
}

export const BackToMushafButton: React.FC<BackToMushafButtonProps> = ({
  onClick,
  label = 'Kembali ke Mushaf',
  elderMode = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer select-none ${
        elderMode ? 'px-4 py-2.5 text-sm sm:text-base' : 'px-3.5 py-2 text-xs sm:text-sm'
      } ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
      }}
      title={label}
      aria-label={label}
    >
      <ArrowLeft
        className={`shrink-0 transition-transform group-hover:-translate-x-0.5 ${
          elderMode ? 'h-5 w-5 text-emerald-600 dark:text-emerald-400' : 'h-4 w-4 text-emerald-600 dark:text-emerald-400'
        }`}
      />
      <span className="truncate">{label}</span>
    </button>
  );
};
