import React, { useEffect } from 'react';
import { LogOut, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { AuthUser } from '../../services/auth';

interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: AuthUser | null;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  user,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open || !user) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-md rounded-3xl border p-6 shadow-2xl sm:p-7"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup jendela konfirmasi"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-muted)',
            color: 'var(--text-secondary)',
          }}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center">
          <div
            className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
            }}
          >
            <LogOut className="h-7 w-7" />
          </div>

          <h2
            id="logout-dialog-title"
            className="text-lg font-bold sm:text-xl tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Konfirmasi Keluar Akun
          </h2>

          <p className="mt-1.5 text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Assalamu'alaikum,{' '}
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {user.full_name}
            </span>
          </p>
        </div>

        {/* Content & Elder-friendly Assurance Box */}
        <div className="mt-5 space-y-3">
          <div
            className="rounded-2xl border p-3.5 text-xs sm:text-sm leading-relaxed"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
            }}
          >
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
              Apakah Anda yakin ingin mengakhiri sesi masuk pada akun ini?
            </p>

            <div className="mt-3 space-y-2 text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Ayat terakhir dibaca (Last Read) tetap tersimpan aman.</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Seluruh bookmark dan catatan tadabbur Anda terlindungi.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Elder Accessible: min-h-11 / 44px touch target) */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/2 min-h-11 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            Batal & Tetap Masuk
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-1/2 min-h-11 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all cursor-pointer hover:opacity-95"
            style={{
              backgroundColor: '#dc2626',
            }}
          >
            Ya, Keluar Akun
          </button>
        </div>
      </div>
    </div>
  );
};

