@echo off
setlocal enabledelayedexpansion

:: ==============================================================================
:: QuranWeb - Windows Docker Deployment & Lifecycle Manager
:: ==============================================================================
:: Penggunaan: docker_deploy.bat [up|down|restart|status|logs|health|clean|help]
:: ==============================================================================

title QuranWeb Docker Deployment Manager

set ACTION=%1
if "%ACTION%"=="" set ACTION=up

echo ============================================================
echo   QuranWeb - Platform Al-Qur'an Digital Modern Ramah Lansia
echo   Port Web: 3382 ^| Database: 5572 ^| API: 4000
echo ============================================================
echo.

:: 1. Verifikasi Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker tidak ditemukan atau belum berjalan di Windows Anda.
    echo Pastikan Docker Desktop telah diinstal dan berstatus 'Running'.
    pause
    exit /b 1
)

:: 2. Sinkronisasi File Environment (.env)
if not exist .env (
    if exist .env.example (
        echo [INFO] Menyalin konfigurasi bawaan dari .env.example ke .env...
        copy .env.example .env >nul
        echo [OK] Berkas .env berhasil dibuat.
    )
)

:: 3. Routing Aksi
if /i "%ACTION%"=="up" goto do_up
if /i "%ACTION%"=="start" goto do_up
if /i "%ACTION%"=="down" goto do_down
if /i "%ACTION%"=="stop" goto do_down
if /i "%ACTION%"=="restart" goto do_restart
if /i "%ACTION%"=="status" goto do_status
if /i "%ACTION%"=="ps" goto do_status
if /i "%ACTION%"=="logs" goto do_logs
if /i "%ACTION%"=="health" goto do_health
if /i "%ACTION%"=="clean" goto do_clean
if /i "%ACTION%"=="help" goto do_help
if /i "%ACTION%"=="/?" goto do_help
if /i "%ACTION%"=="-h" goto do_help

echo [ERROR] Perintah '%ACTION%' tidak dikenali.
goto do_help

:do_up
echo [1/3] Menyiapkan environment deployment...
echo [2/3] Membangun image dan menyalakan kontainer (Background Mode)...
docker compose up -d --build
if %errorlevel% neq 0 (
    echo [ERROR] Gagal menjalankan kontainer Docker.
    exit /b %errorlevel%
)
echo [3/3] Seluruh service berhasil dijalankan!
echo.
echo Akses Layanan QuranWeb:
echo   - Web Mushaf    : http://localhost:3382
echo   - Portal Admin  : http://localhost:3382/admin
echo   - Portal Anggota: http://localhost:3382/user
echo   - Database Host : localhost:5572 (Database: quranweb)
echo.
echo Untuk memantau log: docker_deploy.bat logs
echo Untuk menghentikan : docker_deploy.bat down
goto end

:do_down
echo [INFO] Menghentikan seluruh kontainer QuranWeb...
docker compose down
echo [OK] Kontainer berhasil dihentikan.
goto end

:do_restart
echo [INFO] Merestart seluruh kontainer QuranWeb...
docker compose restart
echo [OK] Service berhasil direstart.
goto end

:do_status
echo [INFO] Status Kontainer QuranWeb:
docker compose ps
goto end

:do_logs
echo [INFO] Menampilkan live log dari seluruh kontainer (Tekan Ctrl+C untuk keluar)...
docker compose logs -f --tail=100
goto end

:do_health
echo [INFO] Memeriksa status kesehatan kontainer...
docker compose ps
echo.
echo Mencoba koneksi ke Web Server port 3382...
powershell -Command "try { $res = Invoke-WebRequest -Uri 'http://localhost:3382' -UseBasicParsing -TimeoutSec 3; Write-Host ('[HEALTHY] Web Server HTTP ' + $res.StatusCode) -ForegroundColor Green } catch { Write-Host ('[UNHEALTHY] Web Server belum siap: ' + $_.Exception.Message) -ForegroundColor Yellow }"
goto end

:do_clean
echo [PERINGATAN] Tindakan ini akan menghentikan kontainer dan membersihkan image lokal QuranWeb.
set /p CONFIRM=Lanjutkan pembersihan? (y/N): 
if /i "%CONFIRM%"=="y" (
    docker compose down --rmi local -v --remove-orphans
    echo [OK] Lingkungan Docker telah dibersihkan.
) else (
    echo Pembersihan dibatalkan.
)
goto end

:do_help
echo Panduan Perintah docker_deploy.bat:
echo   docker_deploy.bat [perintah]
echo.
echo Perintah yang Tersedia:
echo   up ^| start   : Build dan jalankan kontainer di latar belakang (Default)
echo   down ^| stop  : Hentikan seluruh kontainer service
echo   restart       : Restart seluruh service
echo   status ^| ps  : Periksa status kontainer yang sedang berjalan
echo   logs          : Pantau stream log secara real-time
echo   health        : Uji kesehatan endpoint web server port 3382
echo   clean         : Hentikan dan bersihkan image lokal serta volume
echo   help          : Menampilkan panduan bantuan ini
goto end

:end
endlocal
