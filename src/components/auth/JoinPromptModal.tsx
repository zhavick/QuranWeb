import React, { useState } from 'react';
import { X, UserPlus, CheckCircle, Sparkles } from 'lucide-react';
import { submitJoinInterest } from '../../services/telemetry';

interface JoinPromptModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const JoinPromptModal: React.FC<JoinPromptModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitJoinInterest(email.trim() || undefined, 'Tertarik mendaftar dari popup CTA simpan data');
      setDone(true);
      setTimeout(() => {
        onSuccess('Alhamdulillah! Terima kasih telah bergabung bersama Quran Web.');
        onClose();
      }, 1200);
    } catch {
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="relative w-full max-w-md rounded-3xl border p-6 shadow-2xl transition-all"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 rounded-xl p-1.5"
          style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
        >
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <div className="py-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-teal-500 mb-3" />
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Pendaftaran Diterima
            </h3>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Pengaturan dan bookmark Anda sedang disiapkan untuk sinkronisasi akun.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-center space-y-4">
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: 'var(--bg-accent-soft)',
                color: 'var(--text-accent)',
              }}
            >
              <UserPlus className="h-7 w-7" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold mb-1" style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-accent)' }}>
                <Sparkles className="h-3 w-3" />
                <span>Simpan Permanen Lintas Perangkat</span>
              </div>
              <h2 className="text-lg font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                Apakah Anda ingin bergabung dengan kami? Daftar sekarang
              </h2>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Pengaturan bacaan, mode lansia, dan bookmark Anda saat ini tersimpan sementara di database berdasarkan IP Anda. Bergabunglah agar bacaan Anda dapat dilanjutkan dari HP, tablet, maupun laptop kapan saja.
              </p>
            </div>

            <div className="space-y-2 pt-1 text-left">
              <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Email Anda (Opsional):
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border py-2.5 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                Nanti Saja
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl py-2.5 text-xs font-bold"
                style={{
                  backgroundColor: 'var(--bg-accent)',
                  color: 'var(--text-on-accent)',
                }}
              >
                {loading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

