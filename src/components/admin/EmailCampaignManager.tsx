import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Users,
  Eye,
  RefreshCw,
  Sparkles,
  Search,
  ExternalLink,
  X,
  Inbox,
} from 'lucide-react';
import type {
  EmailCampaignItem,
  CampaignType,
  TargetAudience,
  EmailTemplate,
} from '../../types/email';
import {
  PRESET_EMAIL_TEMPLATES,
} from '../../types/email';
import {
  fetchCampaigns,
  sendEmailCampaign,
  testSmtpConnection,
  fetchEmailConfig,
} from '../../services/email';

interface EmailCampaignManagerProps {
  currentUsername: string;
  showToast: (msg: string) => void;
  onNavigateToConfig: () => void;
}

export const EmailCampaignManager: React.FC<EmailCampaignManagerProps> = ({
  currentUsername,
  showToast,
  onNavigateToConfig,
}) => {
  const [campaigns, setCampaigns] = useState<EmailCampaignItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [subTab, setSubTab] = useState<'compose' | 'history'>('compose');

  // Form State
  const [title, setTitle] = useState<string>('');
  const [campaignType, setCampaignType] = useState<CampaignType>('newsletter');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('all_users');
  const [manualRecipients, setManualRecipients] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [contentHtml, setContentHtml] = useState<string>('');
  const [activePreview, setActivePreview] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // History Filter & Preview Modal
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaignItem | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const list = await fetchCampaigns();
    setCampaigns(list);
    setLoading(false);
  };

  const applyTemplate = (tpl: EmailTemplate) => {
    setTitle(tpl.name);
    setCampaignType(tpl.type);
    setSubject(tpl.subject);
    setContentHtml(tpl.content_html);
    showToast(`Template "${tpl.name}" berhasil diterapkan.`);
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !contentHtml.trim()) {
      showToast('Mohon lengkapi judul, subjek, dan naskah email.');
      return;
    }

    if (targetAudience === 'manual' && !manualRecipients.trim()) {
      showToast('Mohon masukkan minimal satu alamat email penerima.');
      return;
    }

    setIsSending(true);
    try {
      const res = await sendEmailCampaign({
        title,
        campaign_type: campaignType,
        target_audience: targetAudience,
        manual_recipients: manualRecipients,
        subject,
        content_html: contentHtml,
        status: 'sent',
        recipient_count: targetAudience === 'all_users' ? 24 : targetAudience === 'leads' ? 16 : manualRecipients.split(',').length,
        sent_by: currentUsername,
      });

      setIsSending(false);
      showToast(res.message);
      await loadCampaigns();
      setSubTab('history');
    } catch {
      setIsSending(false);
      showToast('Gagal mengirim kampanye email.');
    }
  };

  const handleTestSend = async () => {
    if (!subject.trim() || !contentHtml.trim()) {
      showToast('Mohon isi subjek dan naskah email terlebih dahulu untuk uji coba.');
      return;
    }

    setIsTesting(true);
    const config = await fetchEmailConfig();
    const testRecipient = config.sender_email || 'admin@quranweb.id';

    const res = await testSmtpConnection(testRecipient, config);
    setIsTesting(false);
    showToast(res.message);
  };

  // Filtered History
  const filteredCampaigns = campaigns.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'all' || c.campaign_type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner & Sub-Tabs */}
      <div
        className="rounded-2xl border p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Modul Email Buletin &amp; Pengingat
              </h2>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: 'var(--bg-accent-soft)',
                  color: 'var(--text-accent)',
                }}
              >
                SMTP Aktif
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Kirim buletin tadabbur, pengingat tilawah rutin, dan warta pengumuman kepada jamaah.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToConfig}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            title="Atur parameter server SMTP di Konfigurasi Situs"
          >
            <span>Pengaturan SMTP</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-60" />
          </button>

          <div className="flex rounded-xl border p-1" style={{ borderColor: 'var(--border-color)' }}>
            <button
              type="button"
              onClick={() => setSubTab('compose')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                subTab === 'compose' ? 'bg-emerald-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Kirim Pesan
            </button>
            <button
              type="button"
              onClick={() => setSubTab('history')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                subTab === 'history' ? 'bg-emerald-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Riwayat ({campaigns.length})
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUB-TAB 1: COMPOSE EMAIL CAMPAIGN */}
      {/* ============================================================== */}
      {subTab === 'compose' && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* SISI KIRI: Template Cepat & Parameter Target (4 Kolom) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Kartu Template Siap Pakai */}
            <div
              className="rounded-2xl border p-4 shadow-sm space-y-3"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Template Pesan Instan
                </span>
                <span className="text-[10px] font-mono opacity-60">3 Template</span>
              </div>

              <div className="space-y-2">
                {PRESET_EMAIL_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="w-full text-left rounded-xl border p-3 transition-all hover:border-emerald-500/60 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="text-emerald-500">{tpl.name}</span>
                      <span className="opacity-60 text-[10px] uppercase font-mono">{tpl.type}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed line-clamp-2 opacity-80" style={{ color: 'var(--text-secondary)' }}>
                      {tpl.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Kartu Sasaran Penerima */}
            <div
              className="rounded-2xl border p-4 shadow-sm space-y-3"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                <Users className="h-4 w-4 text-indigo-500" />
                <span>Sasaran Target Jamaah</span>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
                  <input
                    type="radio"
                    name="targetAudience"
                    value="all_users"
                    checked={targetAudience === 'all_users'}
                    onChange={() => setTargetAudience('all_users')}
                    className="mt-0.5 accent-emerald-500"
                  />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--text-primary)' }}>Semua Jamaah Terdaftar</span>
                    <span className="text-[11px] opacity-75" style={{ color: 'var(--text-secondary)' }}>Akun anggota terdaftar di basis data QuranWeb (~24 jamaah).</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
                  <input
                    type="radio"
                    name="targetAudience"
                    value="leads"
                    checked={targetAudience === 'leads'}
                    onChange={() => setTargetAudience('leads')}
                    className="mt-0.5 accent-emerald-500"
                  />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--text-primary)' }}>Leads / Pengunjung Tertarik</span>
                    <span className="text-[11px] opacity-75" style={{ color: 'var(--text-secondary)' }}>Email pengunjung dari popup ajakan pendaftaran (~16 leads).</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
                  <input
                    type="radio"
                    name="targetAudience"
                    value="manual"
                    checked={targetAudience === 'manual'}
                    onChange={() => setTargetAudience('manual')}
                    className="mt-0.5 accent-emerald-500"
                  />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--text-primary)' }}>Daftar Email Manual</span>
                    <span className="text-[11px] opacity-75" style={{ color: 'var(--text-secondary)' }}>Ketik atau salin alamat email tujuan khusus.</span>
                  </div>
                </label>
              </div>

              {targetAudience === 'manual' && (
                <div className="pt-1">
                  <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Alamat Email (Pisahkan dengan koma):
                  </label>
                  <textarea
                    rows={2}
                    value={manualRecipients}
                    onChange={(e) => setManualRecipients(e.target.value)}
                    placeholder="jamaah1@gmail.com, ustadz@domain.com"
                    className="w-full rounded-xl border p-2 text-xs outline-none font-mono"
                    style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* SISI KANAN: Form Pengirim & Live Preview (8 Kolom) */}
          <div className="lg:col-span-8">
            <div
              className="rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Penyusunan Pesan Email
                </h3>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActivePreview(!activePreview)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      activePreview ? 'bg-indigo-600 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{activePreview ? 'Tutup Pratinjau' : 'Lihat Pratinjau HTML'}</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendCampaign} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Judul Internal Kampanye
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: Buletin Pekan ke-2 Tadabbur"
                      className="w-full rounded-xl border px-3.5 py-2 text-xs outline-none"
                      style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Kategori Pesan
                    </label>
                    <select
                      value={campaignType}
                      onChange={(e) => setCampaignType(e.target.value as CampaignType)}
                      className="w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none"
                      style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    >
                      <option value="newsletter">📰 Buletin Tadabbur (Newsletter)</option>
                      <option value="reminder">⏰ Pengingat Ibadah &amp; Khatam</option>
                      <option value="announcement">📢 Warta &amp; Pengumuman Sistem</option>
                      <option value="custom">✉️ Pesan Khusus / Bebas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    Subjek Email (Subject Line)
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contoh: 📖 Buletin Tadabbur QuranWeb: Menyapa Fajar Bersama Al-Qur'an"
                    className="w-full rounded-xl border px-3.5 py-2 text-xs outline-none"
                    style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                {activePreview ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                      Tampilan Pratinjau Email (Live HTML View):
                    </label>
                    <div
                      className="rounded-2xl border p-4 max-h-[460px] overflow-y-auto bg-gray-100 dark:bg-gray-900 shadow-inner"
                      style={{ borderColor: 'var(--border-color)' }}
                      dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        Naskah Email (Dukungan Format HTML / Rich Email)
                      </label>
                      <span className="text-[10px] opacity-60">Inline CSS didukung</span>
                    </div>
                    <textarea
                      rows={12}
                      required
                      value={contentHtml}
                      onChange={(e) => setContentHtml(e.target.value)}
                      placeholder="Tuliskan naskah email dalam format HTML atau teks biasa..."
                      className="w-full rounded-xl border p-3 font-mono text-xs outline-none leading-relaxed"
                      style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                )}

                {/* Tombol Aksi */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={handleTestSend}
                    disabled={isTesting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                    title="Kirim email uji coba ke alamat email admin terlebih dahulu"
                  >
                    <Mail className="h-4 w-4 text-emerald-500" />
                    <span>{isTesting ? 'Mengirim Uji Coba...' : 'Kirim Uji Coba ke Admin'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--text-on-accent)',
                    }}
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSending ? 'Mengirim Siaran...' : 'Kirim Siaran Sekarang'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: OUTBOX / DELIVERY HISTORY */}
      {/* ============================================================== */}
      {subTab === 'history' && (
        <div
          className="rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Riwayat Pengiriman Pesan (Outbox)
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Daftar rekaman seluruh email buletin, pengingat, dan warta yang telah dikirimkan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Jenis */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-xl border px-3 py-1.5 text-xs font-semibold outline-none"
                style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
              >
                <option value="all">Semua Kategori</option>
                <option value="newsletter">Buletin Tadabbur</option>
                <option value="reminder">Pengingat Ibadah</option>
                <option value="announcement">Warta Pengumuman</option>
                <option value="custom">Pesan Bebas</option>
              </select>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 opacity-50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari subjek/judul..."
                  className="rounded-xl border pl-8 pr-3 py-1.5 text-xs outline-none w-36 sm:w-48"
                  style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
                />
              </div>

              <button
                type="button"
                onClick={loadCampaigns}
                disabled={loading}
                className="rounded-xl border p-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                style={{ borderColor: 'var(--border-color)' }}
                title="Muat Ulang Riwayat"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Tabel Riwayat */}
          {filteredCampaigns.length === 0 ? (
            <div className="py-12 text-center text-xs opacity-60">
              <Inbox className="h-8 w-8 mx-auto mb-2 opacity-40" />
              Belum ada riwayat email yang cocok dengan filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[11px] font-bold opacity-75" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th className="py-3 px-3">Judul &amp; Subjek</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Target</th>
                    <th className="py-3 px-3">Penerima</th>
                    <th className="py-3 px-3">Waktu Kirim</th>
                    <th className="py-3 px-3">Pengirim</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                  {filteredCampaigns.map((item) => (
                    <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-semibold">
                        <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          {item.title}
                        </div>
                        <div className="text-[11px] opacity-75 truncate max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                          {item.subject}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase font-mono"
                          style={{
                            backgroundColor:
                              item.campaign_type === 'newsletter'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : item.campaign_type === 'reminder'
                                ? 'rgba(59, 130, 246, 0.15)'
                                : 'rgba(245, 158, 11, 0.15)',
                            color:
                              item.campaign_type === 'newsletter'
                                ? '#059669'
                                : item.campaign_type === 'reminder'
                                ? '#2563eb'
                                : '#d97706',
                          }}
                        >
                          {item.campaign_type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        {item.target_audience === 'all_users'
                          ? 'Semua Jamaah'
                          : item.target_audience === 'leads'
                          ? 'Leads CTA'
                          : 'Manual'}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {item.recipient_count} orang
                      </td>
                      <td className="py-3 px-3 text-[11px] opacity-75">
                        {new Date(item.sent_at).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] opacity-70">
                        {item.sent_by}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCampaign(item)}
                          className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                          style={{ borderColor: 'var(--border-color)' }}
                        >
                          <Eye className="h-3 w-3" />
                          <span>Lihat Naskah</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL PREVIEW DETAIL PESAN TERKIRIM */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="flex flex-col w-full max-w-2xl max-h-[85vh] rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center justify-between p-4 border-b shrink-0" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedCampaign.title}
                </h4>
                <p className="text-xs opacity-75" style={{ color: 'var(--text-secondary)' }}>
                  Subjek: {selectedCampaign.subject}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border hover:opacity-75 cursor-pointer"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900">
              <div
                className="p-4 rounded-xl bg-white text-black shadow-xs"
                dangerouslySetInnerHTML={{ __html: selectedCampaign.content_html }}
              />
            </div>

            <div className="p-3 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
