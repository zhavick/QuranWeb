import React from 'react';
import { Sparkles } from 'lucide-react';

interface SakinahRingProps {
  percent: number;
  currentAin: number;
  totalAins: number;
  surahName?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const SakinahRing: React.FC<SakinahRingProps> = ({
  percent,
  currentAin,
  totalAins,
  surahName,
  size = 220,
  strokeWidth = 14,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.min(100, Math.max(0, percent));
  const offset = circumference - (safePercent / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 drop-shadow-md"
      >
        <defs>
          <linearGradient id="sakinahRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          <filter id="gentleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-black/10 dark:text-white/10"
        />

        {/* Active Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#sakinahRingGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          filter="url(#gentleGlow)"
        />
      </svg>

      {/* Center Informational Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none select-none">
        <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
          <Sparkles className="h-3 w-3" />
          <span>Cincin Sakinah</span>
        </div>

        <div className="my-1 text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {safePercent}%
        </div>

        <div className="text-xs font-bold leading-tight" style={{ color: 'var(--text-accent)' }}>
          &apos;Ain ke-{currentAin}
        </div>

        {surahName && (
          <div className="mt-0.5 text-[11px] font-medium truncate max-w-[140px]" style={{ color: 'var(--text-secondary)' }}>
            {surahName}
          </div>
        )}

        <div className="mt-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
          dari {totalAins} &apos;Ain Al-Qur&apos;an
        </div>
      </div>
    </div>
  );
};

