export type CampaignType = 'newsletter' | 'reminder' | 'announcement' | 'custom';
export type TargetAudience = 'all_users' | 'leads' | 'manual';
export type CampaignStatus = 'sent' | 'draft' | 'failed';

export interface EmailConfig {
  smtp_host: string;
  smtp_port: number;
  smtp_secure: 'tls' | 'ssl' | 'none';
  smtp_user: string;
  smtp_password?: string;
  sender_name: string;
  sender_email: string;
  is_active: boolean;
}

export interface EmailCampaignItem {
  id: number;
  title: string;
  campaign_type: CampaignType;
  target_audience: TargetAudience;
  manual_recipients?: string;
  subject: string;
  content_html: string;
  status: CampaignStatus;
  recipient_count: number;
  sent_at: string;
  sent_by: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: CampaignType;
  subject: string;
  description: string;
  content_html: string;
}

export const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  smtp_host: 'smtp.gmail.com',
  smtp_port: 587,
  smtp_secure: 'tls',
  smtp_user: 'notifikasi@quranweb.id',
  smtp_password: '',
  sender_name: 'QuranWeb Official',
  sender_email: 'notifikasi@quranweb.id',
  is_active: true,
};

export const PRESET_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'newsletter-tadabbur',
    name: 'Buletin Tadabbur Mingguan',
    type: 'newsletter',
    subject: '📖 Buletin Tadabbur QuranWeb: Menemukan Kedamaian Hati di Tengah Kesibukan',
    description: 'Format buletin elegan memuat ayat pilihan, mutiara tadabbur, dan artikel inspirasi.',
    content_html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="background: linear-gradient(135deg, #059669, #047857); padding: 32px 24px; text-align: center; color: white;">
    <div style="font-size: 36px; margin-bottom: 8px;">📖</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">Buletin Tadabbur QuranWeb</h1>
    <p style="margin: 6px 0 0; opacity: 0.9; font-size: 13px;">Edisi Mingguan — Sahabat Tilawah & Refleksi Jiwa</p>
  </div>
  <div style="padding: 28px 24px;">
    <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
    <p style="font-size: 14px; line-height: 1.7; color: #475569;">Alhamdulillah, puji syukur kepada Allah SWT atas limpahan hidayah dan kenikmatan iman. Semoga hari Anda senantiasa dinaungi rahmat dan keberkahan Al-Qur'an.</p>
    
    <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 18px 20px; border-radius: 12px; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: bold; color: #059669; text-transform: uppercase; margin-bottom: 8px;">Ayat Tadabbur Pilihan</div>
      <div style="font-size: 19px; text-align: right; font-family: 'Amiri', serif; line-height: 2; color: #064e3b; margin-bottom: 10px;">
        أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
      </div>
      <div style="font-size: 13px; font-style: italic; color: #334155; line-height: 1.6;">
        "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram." (QS. Ar-Ra'd [13]: 28)
      </div>
    </div>

    <h3 style="font-size: 16px; color: #0f172a; margin: 20px 0 8px;">Kabar Tadabbur Pekan Ini</h3>
    <p style="font-size: 14px; line-height: 1.7; color: #475569;">
      Di tengah hiruk pikuk kehidupan, meluangkan waktu 10 menit bersama lembar mushaf adalah jeda paling berharga bagi ketenangan jiwa kita. Modul Asbabun Nuzul dan Audiobook Bertutur kini telah aktif di QuranWeb untuk menemani perjalanan tilawah Anda.
    </p>

    <div style="text-align: center; margin: 32px 0 16px;">
      <a href="https://quranweb.id" style="background: #059669; color: white; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">
        Lanjutkan Tilawah Hari Ini
      </a>
    </div>
  </div>
  <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b;">
    <p style="margin: 0 0 6px;">Email ini dikirim oleh <strong>QuranWeb Official</strong> untuk seluruh sahabat tilawah.</p>
    <p style="margin: 0;">Platform Al-Qur'an Digital Ramah Lansia & Umat Islam — Bebas Iklan Komersial</p>
  </div>
</div>`,
  },
  {
    id: 'reminder-khatam',
    name: 'Pengingat Tilawah & Rencana Khatam',
    type: 'reminder',
    subject: '⏰ Pengingat Tilawah QuranWeb: Waktunya Menyapa Lembar Al-Qur\'an Hari Ini',
    description: 'Pengingat lembut tilawah harian dan capaian ritme khatam sakinah berbasis Ain.',
    content_html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px 24px; text-align: center; color: white;">
    <div style="font-size: 34px; margin-bottom: 8px;">⏰</div>
    <h1 style="margin: 0; font-size: 21px; font-weight: bold;">Pengingat Tilawah Sakinah</h1>
    <p style="margin: 6px 0 0; opacity: 0.9; font-size: 13px;">Istiqamah bersama 1 'Ain Ba'da Shalat Fardhu</p>
  </div>
  <div style="padding: 28px 24px;">
    <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
    <p style="font-size: 14px; line-height: 1.7; color: #475569;">
      Bagaimana kabar tilawah Anda hari ini? Ingatlah bahwa amalan yang paling dicintai Allah adalah amalan yang konsisten (istiqamah) meskipun sedikit demi sedikit.
    </p>

    <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 12px; margin: 22px 0; text-align: center;">
      <div style="font-size: 12px; color: #1d4ed8; font-weight: bold; text-transform: uppercase;">Tips Ritme Khatam Sakinah</div>
      <div style="font-size: 18px; font-weight: bold; color: #1e3a8a; margin: 8px 0 4px;">1 'Ain Saja Setiap Selesai Shalat</div>
      <div style="font-size: 13px; color: #475569;">
        Dengan membaca 1 'Ain (~8-12 ayat) setiap selesai shalat fardhu, Anda akan menuntaskan 556 'Ain dalam waktu sekitar 3,5 bulan dengan hati lapang tanpa lelah mata.
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0 16px;">
      <a href="https://quranweb.id" style="background: #2563eb; color: white; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">
        Buka Rencana Khatam Saya
      </a>
    </div>
  </div>
  <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b;">
    <p style="margin: 0;">QuranWeb — Menemani Setiap Langkah Ibadah Harian Anda</p>
  </div>
</div>`,
  },
  {
    id: 'announcement-fitur',
    name: 'Warta Pengumuman Fitur Baru',
    type: 'announcement',
    subject: '📢 Warta QuranWeb: Pembaruan Fitur Asbabun Nuzul & Peta Masjid Terdekat',
    description: 'Pemberitahuan resmi kabar peluncuran fitur baru dan pembaruan sistem.',
    content_html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="background: linear-gradient(135deg, #d97706, #b45309); padding: 30px 24px; text-align: center; color: white;">
    <div style="font-size: 34px; margin-bottom: 8px;">📢</div>
    <h1 style="margin: 0; font-size: 21px; font-weight: bold;">Warta Pembaruan QuranWeb</h1>
    <p style="margin: 6px 0 0; opacity: 0.9; font-size: 13px;">Peningkatan Fitur untuk Kenyamanan Tilawah Anda</p>
  </div>
  <div style="padding: 28px 24px;">
    <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
    <p style="font-size: 14px; line-height: 1.7; color: #475569;">
      Tim Pengembang QuranWeb dengan senang hati mengabarkan bahwa beberapa fitur baru telah resmi diluncurkan untuk mempermudah tadabbur dan ibadah harian kaum muslimin:
    </p>

    <ul style="font-size: 14px; line-height: 1.8; color: #334155; padding-left: 20px; margin: 16px 0;">
      <li><strong>Asbabun Nuzul Autentik:</strong> 29 riwayat shahih sebab turunnya ayat dari kitab <em>Lubabun Nuqul</em> & <em>Al-Wahidi</em>.</li>
      <li><strong>Kamus Mufradat Gharib:</strong> Mengurai 28 kosakata sastra tinggi, akar kata (jadzr), dan balaghah Al-Qur'an.</li>
      <li><strong>Audiobook Bertutur 3 Menit:</strong> Narasi hangat kisah nabi dengan Sleep Timer dan tempo suara khusus lansia.</li>
      <li><strong>Peta Masjid Terdekat:</strong> Navigasi masjid ramah lansia berbasis OpenStreetMap lokal.</li>
    </ul>

    <div style="text-align: center; margin: 30px 0 16px;">
      <a href="https://quranweb.id" style="background: #d97706; color: white; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">
        Jelajahi Fitur Baru Sekarang
      </a>
    </div>
  </div>
  <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b;">
    <p style="margin: 0;">© 2026 QuranWeb — Dedikasi untuk Kemudahan Tilawah Umat</p>
  </div>
</div>`,
  },
];
