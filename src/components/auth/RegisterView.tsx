import React, { useState } from 'react';
import {
  UserPlus,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { registerUser, type AuthUser } from '../../services/auth';
import { BackToMushafButton } from '../common/BackToMushafButton';

interface RegisterViewProps {
  onBackToMushaf: () => void;
  onNavigateToLogin?: () => void;
  onRegisterSuccess: (user: AuthUser) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onBackToMushaf,
  onNavigateToLogin,
  onRegisterSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [syncDeviceData, setSyncDeviceData] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMsg('Seluruh kolom formulir wajib diisi.');
      return;
    }

    if (username.trim().length < 3) {
      setErrorMsg('Username minimal harus 3 karakter tanpa spasi.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Format alamat email tidak valid.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal harus 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok. Mohon periksa kembali.');
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });

      if (res.success && res.user) {
        setSuccessMsg(res.message || 'Pendaftaran berhasil! Mengalihkan ke akun Anda...');
        setTimeout(() => {
          onRegisterSuccess(res.user!);
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Pendaftaran gagal. Silakan coba kembali.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kendala saat mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="w-full max-w-lg">
        {/* Top Back Link */}
        <div className="mb-4">
          <BackToMushafButton
            onClick={onBackToMushaf}
          />
        </div>

        {/* Main Card */}
        <div
          className="rounded-3xl border p-6 shadow-2xl sm:p-8"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Header */}
          <div className="text-center">
            <div
              className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              <UserPlus className="h-7 w-7" />
            </div>

            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold mb-2"
              style={{
                backgroundColor: 'var(--bg-accent-soft)',
                color: 'var(--text-accent)',
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Daftar Akun Jamaah Baru</span>
            </div>

            <h1 className="text-xl font-bold sm:text-2xl" style={{ color: 'var(--text-primary)' }}>
              Bergabung Bersama QuranWeb
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Simpan bookmark tilawah, pantau rencana khatam, dan akses jurnal tadabbur lintas perangkat dengan aman tanpa iklan.
            </p>
          </div>

          {/* Benefits Badges */}
          <div className="my-5 grid grid-cols-2 gap-2 text-[11px]">
            <div
              className="flex items-center gap-2 rounded-xl border p-2.5"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" />
              <span>Data Aman & Tanpa Iklan</span>
            </div>
            <div
              className="flex items-center gap-2 rounded-xl border p-2.5"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <HeartHandshake className="h-4 w-4 shrink-0 text-amber-600" />
              <span>Ramah Lansia & Mata Lelah</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="font-medium leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-teal-500/20 bg-teal-500/10 p-3.5 text-xs text-teal-600">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="font-medium leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lengkap */}
            <div>
              <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                Nama Lengkap / Panggilan
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5" style={{ color: 'var(--text-secondary)' }}>
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Muhammad Ihsan"
                  className="w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Username & Email in Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Username */}
              <div>
                <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                  Username Unik
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="ihsan99"
                    className="w-full rounded-xl border pl-8 pr-3.5 py-2.5 text-sm outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5" style={{ color: 'var(--text-secondary)' }}>
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ihsan@example.com"
                    className="w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Kata Sandi & Konfirmasi Sandi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password */}
              <div>
                <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                  Kata Sandi (Min 6 Karakter)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5" style={{ color: 'var(--text-secondary)' }}>
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                  Ulangi Kata Sandi
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5" style={{ color: 'var(--text-secondary)' }}>
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label={showConfirmPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox Sync Device */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={syncDeviceData}
                onChange={(e) => setSyncDeviceData(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-teal-600"
              />
              <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Sinkronkan bookmark dan preferensi bacaan saat ini ke akun baru ini secara otomatis.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold shadow-lg transition-transform active:scale-98 cursor-pointer disabled:opacity-60"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              {loading ? (
                <span>Menyiapkan Akun Jamaah...</span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Daftarkan Akun Jamaah</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Sudah memiliki akun terdaftar?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-bold underline hover:opacity-80 cursor-pointer"
                style={{ color: 'var(--text-accent)' }}
              >
                Masuk di Sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
