import React, { useState } from 'react';
import {
  X,
  Calculator,
  Coins,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  BookOpen
} from 'lucide-react';
import {
  DEFAULT_GOLD_PRICE,
  DEFAULT_RICE_PRICE,
  DEFAULT_ZAKAT_FITRAH_PER_PERSON,
  calculateZakatMaal,
  calculateZakatProfesi,
  calculateZakatFitrah,
} from '../../services/hijriCalendar';

interface ZakatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  elderMode?: boolean;
}

type ZakatTab = 'maal' | 'profesi' | 'fitrah' | 'doa';

function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

export const ZakatCalculatorModal: React.FC<ZakatCalculatorModalProps> = ({
  isOpen,
  onClose,
  elderMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<ZakatTab>('maal');

  // Form State: Zakat Maal
  const [totalAssets, setTotalAssets] = useState<number>(150000000); // Rp 150 jt
  const [goldPrice, setGoldPrice] = useState<number>(DEFAULT_GOLD_PRICE);

  // Form State: Zakat Profesi
  const [monthlyIncome, setMonthlyIncome] = useState<number>(10000000); // Rp 10 jt
  const [basicExpense, setBasicExpense] = useState<number>(3000000); // Rp 3 jt
  const [ricePrice, setRicePrice] = useState<number>(DEFAULT_RICE_PRICE);

  // Form State: Zakat Fitrah
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const [nominalPerPerson, setNominalPerPerson] = useState<number>(DEFAULT_ZAKAT_FITRAH_PER_PERSON);

  // Copied toast state
  const [copiedDoa, setCopiedDoa] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculations
  const maalResult = calculateZakatMaal(totalAssets, goldPrice);
  const profesiResult = calculateZakatProfesi(monthlyIncome, basicExpense, ricePrice);
  const fitrahResult = calculateZakatFitrah(familyMembers, nominalPerPerson);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDoa(id);
    setTimeout(() => setCopiedDoa(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`relative flex flex-col max-h-[92vh] w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden ${
          elderMode ? 'text-base font-medium' : 'text-sm'
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                <span>Kalkulator Zakat Komprehensif</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Fiqih BAZNAS
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">Hisab Zakat Maal, Profesi, Fitrah, dan Doa Ibadah</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b overflow-x-auto px-4 gap-2 pt-2" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-muted)' }}>
          {[
            { id: 'maal' as const, label: 'Zakat Maal (Harta)', icon: Coins },
            { id: 'profesi' as const, label: 'Zakat Profesi (Gaji)', icon: Briefcase },
            { id: 'fitrah' as const, label: 'Zakat Fitrah', icon: Users },
            { id: 'doa' as const, label: 'Doa Niat & Terima', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white/5'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 1. TAB ZAKAT MAAL */}
          {activeTab === 'maal' && (
            <div className="space-y-4">
              <div className="rounded-xl border p-3.5 text-xs leading-relaxed" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-color)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-accent)' }}>
                  💡 Kaidah Zakat Maal (Harta / Tabungan / Emas):
                </p>
                <p className="text-[var(--text-secondary)] mt-1">
                  Wajib dikeluarkan apabila harta yang dimiliki telah mencapai nisab setara <strong>85 gram emas murni</strong> dan telah mengendap selama 1 tahun penuh (haul). Tarif zakat adalah <strong>2,5%</strong>.
                </p>
              </div>

              {/* Form Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">Total Saldo Harta / Tabungan / Deposito (Rp)</label>
                  <input
                    type="number"
                    value={totalAssets}
                    onChange={(e) => setTotalAssets(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border p-2.5 text-xs font-semibold focus:outline-emerald-500"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  />
                  <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                    {formatRupiah(totalAssets)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">Harga Emas Murni Saat Ini (Rp / gram)</label>
                  <input
                    type="number"
                    value={goldPrice}
                    onChange={(e) => setGoldPrice(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border p-2.5 text-xs font-semibold focus:outline-emerald-500"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  />
                  <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                    Nisab (85g emas): {formatRupiah(maalResult.nisabValue)}
                  </span>
                </div>
              </div>

              {/* Result Box */}
              <div
                className="rounded-2xl border p-4.5 space-y-3"
                style={{
                  backgroundColor: maalResult.isObligated ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-muted)',
                  borderColor: maalResult.isObligated ? '#10b981' : 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Status Kewajiban Zakat</span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                      maalResult.isObligated
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {maalResult.isObligated ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                    <span>{maalResult.isObligated ? 'Wajib Mengeluarkan Zakat Maal' : 'Belum Mencapai Nisab'}</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <span className="text-xs text-[var(--text-secondary)]">Zakat Maal yang Wajib Dikeluarkan (2,5%):</span>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(maalResult.zakatDue)}
                    </div>
                  </div>
                  {!maalResult.isObligated && (
                    <div className="text-xs text-amber-600 dark:text-amber-400">
                      Kurang {formatRupiah(maalResult.deficitToNisab)} untuk mencapai nisab.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. TAB ZAKAT PROFESI */}
          {activeTab === 'profesi' && (
            <div className="space-y-4">
              <div className="rounded-xl border p-3.5 text-xs leading-relaxed" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-color)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-accent)' }}>
                  💡 Kaidah Zakat Penghasilan / Profesi:
                </p>
                <p className="text-[var(--text-secondary)] mt-1">
                  Berdasarkan fatwa MUI &amp; BAZNAS, nisab zakat profesi adalah senilai <strong>524 kg beras per bulan</strong>. Pendapatan bersih (setelah dikurangi kebutuhan pokok bulanan) dikenakan tarif zakat <strong>2,5%</strong>.
                </p>
              </div>

              {/* Form Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">Penghasilan Bruto Bulanan (Rp)</label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border p-2.5 text-xs font-semibold focus:outline-emerald-500"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  />
                  <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                    {formatRupiah(monthlyIncome)} / bulan
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">Kebutuhan Pokok / Cicilan Pokok (Rp)</label>
                  <input
                    type="number"
                    value={basicExpense}
                    onChange={(e) => setBasicExpense(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border p-2.5 text-xs font-semibold focus:outline-emerald-500"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  />
                  <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                    Penghasilan Bersih: {formatRupiah(profesiResult.netIncome)}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1.5">Harga Beras Standar Konsumsi (Rp / kg)</label>
                  <input
                    type="number"
                    value={ricePrice}
                    onChange={(e) => setRicePrice(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border p-2.5 text-xs font-semibold focus:outline-emerald-500"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  />
                  <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                    Nisab Bulanan (524 kg beras): {formatRupiah(profesiResult.nisabValue)}
                  </span>
                </div>
              </div>

              {/* Result Box */}
              <div
                className="rounded-2xl border p-4.5 space-y-3"
                style={{
                  backgroundColor: profesiResult.isObligated ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-muted)',
                  borderColor: profesiResult.isObligated ? '#10b981' : 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Status Kewajiban Zakat Profesi</span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                      profesiResult.isObligated
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {profesiResult.isObligated ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                    <span>{profesiResult.isObligated ? 'Wajib Mengeluarkan Zakat Profesi' : 'Belum Wajib Zakat'}</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <span className="text-xs text-[var(--text-secondary)]">Zakat Profesi yang Dikeluarkan per Bulan (2,5%):</span>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(profesiResult.zakatDue)}
                    </div>
                  </div>
                  {!profesiResult.isObligated && (
                    <div className="text-xs text-amber-600 dark:text-amber-400">
                      Pendapatan bersih kurang {formatRupiah(profesiResult.deficitToNisab)} dari batas nisab.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. TAB ZAKAT FITRAH */}
          {activeTab === 'fitrah' && (
            <div className="space-y-4">
              <div className="rounded-xl border p-3.5 text-xs leading-relaxed" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-color)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-accent)' }}>
                  💡 Kaidah Zakat Fitrah:
                </p>
                <p className="text-[var(--text-secondary)] mt-1">
                  Wajib bagi setiap jiwa muslim yang menemui sebagian Ramadhan dan sebagian Syawwal. Kadar zakat adalah <strong>2,5 kg atau 3,5 liter beras</strong> per jiwa, atau dikonversikan ke dalam mata uang rupiah sesuai ketetapan BAZNAS/Kemenag setempat.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">Jumlah Jiwa yang Ditanggung (Orang)</label>
                  <input
                    type="number"
                    min="1"
                    value={familyMembers}
                    onChange={(e) => setFamilyMembers(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border p-2.5 text-xs font-semibold focus:outline-emerald-500"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">Ketetapan Rupiah per Jiwa (Rp / orang)</label>
                  <input
                    type="number"
                    value={nominalPerPerson}
                    onChange={(e) => setNominalPerPerson(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border p-2.5 text-xs font-semibold focus:outline-emerald-500"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  />
                  <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                    Standar BAZNAS: Rp 45.000 s.d. Rp 55.000
                  </span>
                </div>
              </div>

              {/* Fitrah Result */}
              <div className="rounded-2xl border p-4.5 space-y-3 bg-emerald-500/10 border-emerald-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Kewajiban Zakat Fitrah ({familyMembers} Jiwa)
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {fitrahResult.totalRiceKg} kg Beras
                  </span>
                </div>

                <div className="border-t pt-3 flex items-baseline justify-between" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-xs text-[var(--text-secondary)]">Total yang Dibayarkan (Konversi Uang):</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(fitrahResult.totalMoney)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. TAB DOA NIAT & TERIMA */}
          {activeTab === 'doa' && (
            <div className="space-y-4">
              {/* Doa Muzakki */}
              <div className="rounded-xl border p-4 space-y-2.5" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    🤲 Doa Muzakki (Saat Menunaikan Zakat)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        'اللَّهُمَّ اجْعَلْهَا مَغْنَمًا وَلَا تَجْعَلْهَا مَغْرَمًا\nAllahummaj’alha maghnaman wa la taj’alha maghraman.\nArtinya: "Ya Allah, jadikanlah ia sebagai keuntungan (pahala) dan janganlah Engkau jadikan ia sebagai denda (beban kerugian)."\n(HR. Ibnu Majah no. 1797)',
                        'doa-1'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-emerald-500"
                  >
                    {copiedDoa === 'doa-1' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedDoa === 'doa-1' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <p className="font-arabic text-xl sm:text-2xl text-right leading-loose" dir="rtl">
                  اللَّهُمَّ اجْعَلْهَا مَغْنَمًا وَلَا تَجْعَلْهَا مَغْرَمًا
                </p>
                <p className="text-xs italic text-[var(--text-secondary)]">
                  Allahummaj’alha maghnaman wa la taj’alha maghraman.
                </p>
                <p className="text-xs text-[var(--text-primary)]">
                  &ldquo;Ya Allah, jadikanlah zakat ini sebagai pahala yang mendatangkan keuntungan dan jangan Engkau jadikan ia sebagai beban denda.&rdquo; (HR. Ibnu Majah no. 1797)
                </p>
              </div>

              {/* Doa Mustahiq / Penerima */}
              <div className="rounded-xl border p-4 space-y-2.5" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    🤲 Doa Penerima Zakat (Untuk Orang yang Berzakat)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        'آجَرَكَ اللَّهُ فِيمَا أَعْطَيْتَ وَبَارَكَ فِيمَا أَبْقَيْتَ وَجَعَلَهُ لَكَ طَهُورًا\nAajarakallahu fiima a’thaita wa baaraka fiima abqaita wa ja’alahu laka thahuura.\nArtinya: "Semoga Allah memberikan pahala atas apa yang telah engkau berikan, memberkahi apa yang masih engkau simpan, dan menjadikannya sebagai pembersih bagimu."',
                        'doa-2'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-emerald-500"
                  >
                    {copiedDoa === 'doa-2' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedDoa === 'doa-2' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <p className="font-arabic text-xl sm:text-2xl text-right leading-loose" dir="rtl">
                  آجَرَكَ اللَّهُ فِيمَا أَعْطَيْتَ وَبَارَكَ فِيمَا أَبْقَيْتَ وَجَعَلَهُ لَكَ طَهُورًا
                </p>
                <p className="text-xs italic text-[var(--text-secondary)]">
                  Aajarakallahu fiima a’thaita wa baaraka fiima abqaita wa ja’alahu laka thahuura.
                </p>
                <p className="text-xs text-[var(--text-primary)]">
                  &ldquo;Semoga Allah memberikan pahala atas apa yang telah engkau berikan, memberkahi harta yang masih engkau simpan, dan menjadikannya sebagai pembersih (jiwa dan harta) bagimu.&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t p-4 flex items-center justify-between" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-muted)' }}>
          <span className="text-[11px] text-[var(--text-secondary)]">
            *Dihitung berdasarkan panduan fikih zakat BAZNAS &amp; Kemenag RI.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Selesai Menghitung
          </button>
        </div>
      </div>
    </div>
  );
};
