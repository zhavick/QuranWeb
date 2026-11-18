# Panduan Deployment Docker (Docker Deploy Guide)
## QuranWeb: Platform Al-Qur'an Digital Modern Ramah Lansia

Dokumen ini merupakan panduan resmi bagi developer dan tim DevOps untuk melakukan *deployment*, orkestrasi kontainer, serta pemeliharaan siklus hidup aplikasi **QuranWeb** secara mandiri menggunakan **Docker** dan **Docker Compose**.

---

## 1. Arsitektur Kontainer & Topologi Jaringan

Aplikasi QuranWeb dirancang menggunakan arsitektur modular multi-kontainer yang ringan, terisolasi, dan tangguh:

```text
+---------------------------------------------------------------------------------+
|                                 HOST SYSTEM                                     |
|                                                                                 |
|   [Port 3382]                                   [Port 5572]                     |
|        │                                             │                          |
|        ▼                                             ▼                          |
|  ┌───────────────────┐    ┌─────────────────┐   ┌───────────────────────────┐   |
|  │    quran-web      │    │    quran-api    │   │      quran-postgres       │   |
|  │  (Nginx Alpine)   ├───►│  (Node.js 20)   ├──►│    (PostgreSQL 16)        │   |
|  │ - Port: 3382      │/api│ - Port: 4000    │   │ - Port Internal: 5432     │   |
|  │ - SPA Static PWA  │    │ - Telemetri, IP │   │ - Volume: postgres_data   │   |
|  │ - Reverse Proxy   │    │ - Auth & Email  │   │ - Healthcheck terintegrasi│   |
|  └───────────────────┘    └─────────────────┘   └───────────────────────────┘   |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### Tabel Rincian Kontainer:

| Nama Kontainer | Base Image | Port Eksternal | Port Internal | Fungsi Utama |
| :--- | :--- | :---: | :---: | :--- |
| **`quran-web`** | `nginx:alpine` | **`3382`** | `3382` | Web server Nginx serving PWA statis, cache asset, dan reverse proxy `/api`. |
| **`quran-api`** | `node:20-alpine` | - | `4000` | Backend API (telemetri IP, audit logs, sinkronisasi staging, email campaign). |
| **`quran-postgres`** | `postgres:16-alpine` | **`5572`** | `5432` | Basis data relasional persisten (visitor logs, users, bookmarks, mosques cache). |

> **Catatan Arsitektur Build:** Service `quran-web` dan `quran-api` dibangun dari satu berkas **`Dockerfile`** terpadu (*Unified Multi-Stage Dockerfile*) menggunakan target build spesifik (`target: web` untuk frontend Nginx dan `target: api` untuk backend Node.js), menyederhanakan siklus pemeliharaan berkas kontainer.

---

## 2. Prasyarat Sistem

Sebelum melakukan deployment, pastikan perangkat Anda memiliki:
* **Docker Engine** versi `24.0.0+`
* **Docker Compose** versi `v2.20.0+` (atau plugin `docker compose`)
* Sistem Operasi: Linux (Ubuntu/Debian/CentOS), macOS, atau Windows 10/11 (dengan Docker Desktop aktif).

---

## 3. Cara Cepat Deployment (1-Klik Otomatis)

QuranWeb menyediakan skrip orchestrator siap pakai untuk mempermudah developer:

### A. Pengguna Linux & macOS (Bash Script)

Beri izin eksekusi sekali saja, lalu jalankan:
```bash
chmod +x docker_deploy.sh
./docker_deploy.sh
```

### B. Pengguna Windows (Batch Script)

Cukup klik dua kali berkas **`docker_deploy.bat`** di Windows Explorer, atau jalankan melalui Command Prompt / PowerShell:
```cmd
docker_deploy.bat
```

> **Catatan Otomatisasi:** Skrip akan otomatis memeriksa ketersediaan berkas `.env`. Jika belum ada, skrip akan membuatkannya secara instan dari `.env.example`.

---

## 4. Perintah Operasional Harian

Skrip `docker_deploy.sh` (Linux/macOS) dan `docker_deploy.bat` (Windows) mendukung berbagai parameter kontrol:

| Perintah | Deskripsi Tindakan |
| :--- | :--- |
| `./docker_deploy.sh up` | Membangun image dan menyalakan seluruh kontainer di latar belakang (*background mode*). |
| `./docker_deploy.sh down` | Menghentikan dan melepaskan seluruh kontainer service dengan aman. |
| `./docker_deploy.sh restart` | Merestart seluruh kontainer tanpa proses rebuild ulang. |
| `./docker_deploy.sh status` | Memeriksa status kesehatan dan port kontainer yang sedang berjalan. |
| `./docker_deploy.sh logs` | Menampilkan *streaming live logs* dari seluruh kontainer secara *real-time*. |
| `./docker_deploy.sh health` | Menguji ketersediaan HTTP response dari Web Server port 3382. |
| `./docker_deploy.sh clean` | Menghentikan kontainer dan membersihkan local images serta anonymous volumes. |
| `./docker_deploy.sh help` | Menampilkan daftar bantuan dan panduan perintah CLI. |

---

## 5. Konfigurasi Variabel Lingkungan (`.env`)

Untuk mengubah port atau kredensial database, salin berkas `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Isi berkas `.env`:
```ini
# Port Web Nginx diakses pengguna
WEB_PORT=3382

# Port PostgreSQL diakses dari Host
DB_PORT=5572

# Port Internal Service Node API
API_PORT=4000

# Kredensial Database PostgreSQL
POSTGRES_DB=quranweb
POSTGRES_USER=quran_user
POSTGRES_PASSWORD=quran_secret_password

# Mode Node.js
NODE_ENV=production
```

---

## 6. Akses Layanan Pasca-Deployment

Setelah kontainer aktif, buka peramban (*web browser*) Anda:

* **Aplikasi Web Utama (Mushaf Tilawah):**  
  👉 [`http://localhost:3382`](http://localhost:3382)
* **Portal Administrator (Pengelola & Redaksi):**  
  👉 [`http://localhost:3382/admin`](http://localhost:3382/admin)  
  *Kredensial Default:* `admin` / `admin123`
* **Portal Pengguna (Dashboard Pribadi):**  
  👉 [`http://localhost:3382/user`](http://localhost:3382/user)  
  *Kredensial Demo:* `fulan` / `user123`
* **Koneksi Database PostgreSQL:**  
  `Host: localhost`, `Port: 5572`, `User: quran_user`, `Pass: quran_secret_password`, `Database: quranweb`

---

## 7. Pemeliharaan & Manajemen Basis Data (PostgreSQL)

### A. Backup Database (Dump Data)
Jalankan perintah berikut untuk mengekspor seluruh isi database PostgreSQL ke berkas `.sql`:
```bash
docker exec -t quran-postgres pg_dump -U quran_user quranweb > backup_quranweb_$(date +%Y%m%d).sql
```

### B. Restore Database
Untuk memulihkan data dari berkas cadangan:
```bash
cat backup_quranweb_20261118.sql | docker exec -i quran-postgres psql -U quran_user -d quranweb
```

---

## 8. Panduan Deployment Produksi (Reverse Proxy & SSL)

Jika Anda mendeploy QuranWeb di server VPS publik (misal: DigitalOcean, AWS, GCP, Linode, IdCloudHost) dengan nama domain (misal: `quran.domainanda.com`), pasang Nginx di sistem host sebagai reverse proxy SSL:

```nginx
server {
    listen 80;
    server_name quran.domainanda.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name quran.domainanda.com;

    ssl_certificate /etc/letsencrypt/live/quran.domainanda.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quran.domainanda.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3382;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 9. Pemecahan Masalah (Troubleshooting)

**1. Port 3382 atau 5572 bentrok (*Address already in use*)**
* Solusi: Buka berkas `.env`, ubah `WEB_PORT` (misal ke `3383`) atau `DB_PORT` (misal ke `5573`), lalu jalankan kembali `./docker_deploy.sh up`.

**2. API merespons 502 Bad Gateway saat baru pertama kali start**
* Solusi: Kontainer PostgreSQL membutuhkan waktu 2–5 detik untuk inisialisasi basis data pertama kali. Fitur *healthcheck* otomatis akan memastikan service API terhubung begitu database siap. Tunggu beberapa detik lalu refresh halaman web.

**3. Ingin melakukan rebuild total secara bersih**
* Solusi: Jalankan `./docker_deploy.sh clean` kemudian `./docker_deploy.sh up`.
