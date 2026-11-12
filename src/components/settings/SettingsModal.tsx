import React, { useState } from 'react';
import { X, Eye, Download, Upload, HardDriveDownload, BookOpen, User, Shield } from 'lucide-react';
import type {
  ReaderSettings,
  ThemeMode,
  ArabicFontFamily,
  BookmarkItem,
} from '../../types/quran';
import { cacheAllSurahsOffline } from '../../services/quranData';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (patch: Partial<ReaderSettings>) => void;
  onToggleElderMode: () => void;
  bookmarks: BookmarkItem[];
  onImportBookmarks: (items: BookmarkItem[]) => void;
  onOpenTajweedGuide: () => void;
  onSyncDatabase: () => void;
  onOpenUserPortal?: () => void;
  onOpenAdminPortal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  settings,
  onUpdateSettings,
  onToggleElderMode,
  bookmarks,
  onImportBookmarks,
  onOpenTajweedGuide,
  onSyncDatabase,
  onOpenUserPortal,
  onOpenAdminPortal,
}) => {
  const [offlineStatus, setOfflineStatus] = useState<string>('');
  const [caching, setCaching] = useState(false);

  if (!open) return null;

  const handleOfflineCache = async () => {
    setCaching(true);
    setOfflineStatus('Menyimpan 0 / 114 surat...');
    try {
      await cacheAllSurahsOffline((loaded, total) => {
        setOfflineStatus(`Menyimpan ${loaded} / ${total} surat...`);
      });
      setOfflineStatus('Seluruh 114 surat siap dibaca offline!');
    } catch {
      setOfflineStatus('Gagal mengunduh sebagian surat.');
    } finally {
      setCaching(false);
    }
  };

  const handleExportBookmarks = () => {
    const blob = new Blob([JSON.stringify(bookmarks, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quranweb-bookmarks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as BookmarkItem[];
        if (Array.isArray(parsed)) {
          onImportBookmarks(parsed);
        }
      } catch {
        // Ignore invalid JSON
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="flex max-h-[88vh] w-full max-w-lg flex-col rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Pengaturan &amp; Aksesibilitas
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pengaturan"
            className="rounded-lg p-1.5"
            style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Elder Mode 1-Click */}
          <div
            className="flex items-center justify-between rounded-xl border p-3.5"
            style={{
              backgroundColor: settings.elderMode ? 'var(--bg-accent-soft)' : 'var(--bg-muted)',
              borderColor: settings.elderMode ? 'var(--bg-accent)' : 'var(--border-color)',
            }}
          >
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                <Eye className="h-4 w-4" style={{ color: 'var(--text-accent)' }} />
                <span>Mode Lansia (1-Klik)</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Font Arab ekstra besar, kontras tinggi, tombol lebih besar.
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleElderMode}
              className="rounded-xl px-3.5 py-2 text-xs font-bold"
              style={{
                backgroundColor: settings.elderMode ? 'var(--bg-accent)' : 'var(--bg-card)',
                color: settings.elderMode ? 'var(--text-on-accent)' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              }}
            >
              {settings.elderMode ? 'Aktif' : 'Aktifkan'}
            </button>
          </div>

          {/* Themes */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Tema &amp; Inverse Color
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  { id: 'light', label: 'Terang' },
                  { id: 'dark', label: 'Gelap' },
                  { id: 'high-contrast', label: 'High Contrast' },
                  { id: 'sepia', label: 'Sepia' },
                ] as { id: ThemeMode; label: string }[]
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onUpdateSettings({ theme: t.id })}
                  className="rounded-xl border px-3 py-2 text-xs font-semibold"
                  style={{
                    backgroundColor: settings.theme === t.id ? 'var(--bg-accent)' : 'var(--bg-muted)',
                    color: settings.theme === t.id ? 'var(--text-on-accent)' : 'var(--text-primary)',
                    borderColor: settings.theme === t.id ? 'var(--bg-accent)' : 'var(--border-color)',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Arabic Font Size */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold">
              <span style={{ color: 'var(--text-secondary)' }}>Ukuran Huruf Arab</span>
              <span style={{ color: 'var(--text-accent)' }}>{settings.arabicFontSize}px</span>
            </div>
            <input
              type="range"
              min={20}
              max={52}
              step={2}
              value={settings.arabicFontSize}
              onChange={(e) => onUpdateSettings({ arabicFontSize: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          {/* Translation Font Size */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold">
              <span style={{ color: 'var(--text-secondary)' }}>Ukuran Terjemahan</span>
              <span style={{ color: 'var(--text-accent)' }}>{settings.translationFontSize}px</span>
            </div>
            <input
              type="range"
              min={14}
              max={26}
              step={1}
              value={settings.translationFontSize}
              onChange={(e) => onUpdateSettings({ translationFontSize: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          {/* Line Height */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold">
              <span style={{ color: 'var(--text-secondary)' }}>Jarak Antar Baris (Line Height)</span>
              <span style={{ color: 'var(--text-accent)' }}>{settings.lineHeight.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={1.9}
              max={2.8}
              step={0.1}
              value={settings.lineHeight}
              onChange={(e) => onUpdateSettings({ lineHeight: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          {/* Arabic Font Family */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Jenis Font Arab
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'lpmq', label: 'LPMQ (RI)' },
                  { id: 'amiri', label: 'Amiri' },
                  { id: 'scheherazade', label: 'Scheherazade' },
                ] as { id: ArabicFontFamily; label: string }[]
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onUpdateSettings({ arabicFont: f.id })}
                  className="rounded-xl border px-2 py-2 text-xs font-semibold"
                  style={{
                    backgroundColor: settings.arabicFont === f.id ? 'var(--bg-accent)' : 'var(--bg-muted)',
                    color: settings.arabicFont === f.id ? 'var(--text-on-accent)' : 'var(--text-primary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm" style={{ borderColor: 'var(--border-color)' }}>
              <span>Tampilkan Terjemahan</span>
              <input
                type="checkbox"
                checked={settings.showTranslation}
                onChange={(e) => onUpdateSettings({ showTranslation: e.target.checked })}
                className="h-4 w-4 accent-teal-600"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span>Tajwid Berwarna (Pemula)</span>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Nonaktif otomatis saat Mode High Contrast / Lansia.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.tajweedEnabled}
                onChange={(e) => onUpdateSettings({ tajweedEnabled: e.target.checked })}
                className="h-4 w-4 accent-teal-600"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTajweedGuide();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold"
              style={{
                backgroundColor: 'var(--bg-accent-soft)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-accent)',
              }}
            >
              <BookOpen className="h-4 w-4" />
              <span>Buka Panduan Tajwid &amp; Makharijul Huruf</span>
            </button>

            <label className="flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm" style={{ borderColor: 'var(--border-color)' }}>
              <span>Ayat Spotlight (Fokus 1 Ayat)</span>
              <input
                type="checkbox"
                checked={settings.spotlightEnabled}
                onChange={(e) => onUpdateSettings({ spotlightEnabled: e.target.checked })}
                className="h-4 w-4 accent-teal-600"
              />
            </label>

            <div className="flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm" style={{ borderColor: 'var(--border-color)' }}>
              <span>Auto-Scroll Lambat</span>
              <select
                value={settings.autoScrollSpeed}
                onChange={(e) => onUpdateSettings({ autoScrollSpeed: Number(e.target.value) })}
                className="rounded-lg border px-2 py-1 text-xs"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value={0}>Mati</option>
                <option value={1}>Lambat</option>
                <option value={2}>Sedang</option>
              </select>
            </div>
          </div>

          {/* Akses Portal Pengguna & Admin */}
          <div className="border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Portal Akses Akun
            </div>
            <div className="grid grid-cols-2 gap-2">
              {onOpenUserPortal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenUserPortal();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  title="Masuk ke Dashboard Akun Pengguna (/user)"
                >
                  <User className="h-3.5 w-3.5" style={{ color: 'var(--text-accent)' }} />
                  <span>Akun Pengguna (/user)</span>
                </button>
              )}

              {onOpenAdminPortal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdminPortal();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  title="Buka Portal Administrator (/admin)"
                >
                  <Shield className="h-3.5 w-3.5" style={{ color: 'var(--text-accent)' }} />
                  <span>Portal Admin (/admin)</span>
                </button>
              )}
            </div>
          </div>

          {/* Offline, Database Staging & Bookmark Backup */}
          <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSyncDatabase();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors"
              style={{
                backgroundColor: 'var(--bg-accent-soft)',
                borderColor: 'var(--bg-accent)',
                color: 'var(--text-accent)',
              }}
            >
              <span>💾 Simpan &amp; Sinkronkan Pengaturan ke Database</span>
            </button>

            <button
              type="button"
              onClick={handleOfflineCache}
              disabled={caching}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--text-on-accent)',
              }}
            >
              <HardDriveDownload className="h-4 w-4" />
              <span>{caching ? 'Menyimpan...' : 'Simpan Semua 114 Surat Offline'}</span>
            </button>
            {offlineStatus && (
              <div className="text-center text-xs font-medium" style={{ color: 'var(--text-accent)' }}>
                {offlineStatus}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportBookmarks}
                className="flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Bookmark</span>
              </button>

              <label
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Import Bookmark</span>
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

