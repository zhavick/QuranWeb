#!/usr/bin/env bash
# ==============================================================================
# QuranWeb - Unified Docker Deployment & Lifecycle Manager Script
# ==============================================================================
# Deskripsi : Skrip otomatisasi deployment multi-container (Nginx + API + Postgres)
# Penggunaan: ./docker_deploy.sh [up|down|restart|status|logs|health|clean|help]
# ==============================================================================

set -e

# Warna Terminal
C_RESET='\033[0m'
C_BOLD='\033[1m'
C_GREEN='\033[32m'
C_BLUE='\033[34m'
C_YELLOW='\033[33m'
C_RED='\033[31m'
C_CYAN='\033[36m'

print_banner() {
  echo -e "${C_CYAN}${C_BOLD}"
  echo "  ___                            __        __   _     "
  echo " / _ \ _   _ _ __ __ _ _ __      \ \      / /__| |__  "
  echo "| | | | | | | '__/ _\` | '_ \ _____ \ \ /\ / / _ \ '_ \ "
  echo "| |_| | |_| | | | (_| | | | |_____| \ V  V /  __/ |_) |"
  echo " \__\_\\__,_|_|  \__,_|_| |_|       \_/\_/ \___|_.__/ "
  echo -e "${C_RESET}"
  echo -e "${C_BOLD}  Platform Al-Qur'an Digital Modern Ramah Lansia${C_RESET}"
  echo -e "  Port Web: ${C_GREEN}3382${C_RESET} | Database: ${C_GREEN}5572${C_RESET} | API: ${C_GREEN}4000${C_RESET}"
  echo -e "  ------------------------------------------------------------"
}

# 1. Verifikasi Ketersediaan Docker & Docker Compose
check_requirements() {
  if ! command -v docker &> /dev/null; then
    echo -e "${C_RED}[ERROR] Docker tidak ditemukan di sistem ini.${C_RESET}"
    echo "Silakan install Docker terlebih dahulu: https://docs.docker.com/get-docker/"
    exit 1
  fi

  if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
  elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
  else
    echo -e "${C_RED}[ERROR] Docker Compose plugin maupun docker-compose binary tidak ditemukan.${C_RESET}"
    exit 1
  fi
}

# 2. Sinkronisasi File Environment (.env)
setup_env() {
  if [ ! -f .env ]; then
    if [ -f .env.example ]; then
      echo -e "${C_YELLOW}[INFO] Berkas .env tidak ditemukan. Menyalin dari .env.example...${C_RESET}"
      cp .env.example .env
      echo -e "${C_GREEN}[OK] Berkas .env berhasil dibuat.${C_RESET}"
    fi
  fi
}

# 3. Action: Deploy & Start Containers
action_up() {
  print_banner
  echo -e "${C_BLUE}[1/3] Menyiapkan environment deployment...${C_RESET}"
  setup_env

  echo -e "${C_BLUE}[2/3] Membangun image & menyalakan kontainer (Background Mode)...${C_RESET}"
  $DOCKER_COMPOSE_CMD up -d --build

  echo -e "${C_GREEN}[3/3] Seluruh service berhasil dijalankan!${C_RESET}"
  echo ""
  echo -e "${C_BOLD}Akses Layanan QuranWeb:${C_RESET}"
  echo -e "  • Web Application : ${C_GREEN}http://localhost:3382${C_RESET}"
  echo -e "  • Portal Admin    : ${C_GREEN}http://localhost:3382/admin${C_RESET}"
  echo -e "  • Portal Anggota  : ${C_GREEN}http://localhost:3382/user${C_RESET}"
  echo -e "  • Backend API     : ${C_GREEN}http://localhost:4000/api/health${C_RESET} (atau via proxy /api)"
  echo -e "  • PostgreSQL Port : ${C_GREEN}localhost:5572${C_RESET} (Database: quranweb)"
  echo ""
  echo -e "Untuk memantau log sistem: ${C_YELLOW}./docker_deploy.sh logs${C_RESET}"
  echo -e "Untuk menghentikan service: ${C_YELLOW}./docker_deploy.sh down${C_RESET}"
}

# 4. Action: Stop Containers
action_down() {
  echo -e "${C_YELLOW}[INFO] Menghentikan kontainer QuranWeb...${C_RESET}"
  $DOCKER_COMPOSE_CMD down
  echo -e "${C_GREEN}[OK] Seluruh kontainer berhasil dihentikan.${C_RESET}"
}

# 5. Action: Restart Containers
action_restart() {
  echo -e "${C_YELLOW}[INFO] Merestart seluruh service QuranWeb...${C_RESET}"
  $DOCKER_COMPOSE_CMD restart
  echo -e "${C_GREEN}[OK] Service berhasil direstart.${C_RESET}"
}

# 6. Action: Check Status
action_status() {
  print_banner
  echo -e "${C_BOLD}Status Kontainer:${C_RESET}"
  $DOCKER_COMPOSE_CMD ps
}

# 7. Action: Stream Logs
action_logs() {
  echo -e "${C_BLUE}[INFO] Menampilkan live log dari seluruh kontainer (Tekan Ctrl+C untuk keluar)...${C_RESET}"
  $DOCKER_COMPOSE_CMD logs -f --tail=100
}

# 8. Action: Health Check
action_health() {
  echo -e "${C_BLUE}[INFO] Memeriksa status kesehatan service...${C_RESET}"
  WEB_PORT=$(grep WEB_PORT .env 2>/dev/null | cut -d '=' -f2 || echo "3382")
  WEB_PORT=${WEB_PORT:-3382}

  # Test Web HTTP
  if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${WEB_PORT}" || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
      echo -e "  • Web Server (Port ${WEB_PORT}) : ${C_GREEN}[HEALTHY] HTTP $HTTP_CODE${C_RESET}"
    else
      echo -e "  • Web Server (Port ${WEB_PORT}) : ${C_RED}[UNHEALTHY] HTTP $HTTP_CODE${C_RESET}"
    fi

    API_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${WEB_PORT}/api/stats" || echo "000")
    if [ "$API_CODE" = "200" ]; then
      echo -e "  • Backend API (Reverse Proxy) : ${C_GREEN}[HEALTHY] HTTP $API_CODE${C_RESET}"
    else
      echo -e "  • Backend API (Reverse Proxy) : ${C_YELLOW}[CHECK] HTTP $API_CODE${C_RESET}"
    fi
  else
    echo -e "${C_YELLOW}[WARN] curl tidak terpasang, menampilkan status Docker ps:${C_RESET}"
    $DOCKER_COMPOSE_CMD ps
  fi
}

# 9. Action: Clean Deployment
action_clean() {
  echo -e "${C_RED}${C_BOLD}[PERINGATAN] Tindakan ini akan menghentikan kontainer dan menghapus image lokal QuranWeb.${C_RESET}"
  read -p "Lanjutkan pembersihan? (y/N): " -r CONFIRM
  if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
    $DOCKER_COMPOSE_CMD down --rmi local -v --remove-orphans
    echo -e "${C_GREEN}[OK] Lingkungan Docker telah dibersihkan.${C_RESET}"
  else
    echo "Dibatalkan."
  fi
}

# 10. Help Menu
action_help() {
  print_banner
  echo -e "${C_BOLD}Panduan Perintah:${C_RESET}"
  echo "  ./docker_deploy.sh [perintah]"
  echo ""
  echo "Perintah yang Tersedia:"
  echo -e "  ${C_GREEN}up${C_RESET} | ${C_GREEN}start${C_RESET}    : Build image dan jalankan kontainer di latar belakang (Default)"
  echo -e "  ${C_GREEN}down${C_RESET} | ${C_GREEN}stop${C_RESET}   : Hentikan seluruh kontainer service"
  echo -e "  ${C_GREEN}restart${C_RESET}        : Restart seluruh service tanpa rebuild"
  echo -e "  ${C_GREEN}status${C_RESET} | ${C_GREEN}ps${C_RESET}     : Lihat status kontainer yang sedang aktif"
  echo -e "  ${C_GREEN}logs${C_RESET}           : Pantau stream log secara real-time"
  echo -e "  ${C_GREEN}health${C_RESET}         : Periksa kesehatan endpoint web dan reverse proxy API"
  echo -e "  ${C_GREEN}clean${C_RESET}          : Hentikan dan bersihkan image lokal & volume sampah"
  echo -e "  ${C_GREEN}help${C_RESET}           : Menampilkan menu bantuan ini"
  echo ""
}

# Entrypoint Logic
check_requirements

COMMAND="${1:-up}"

case "$COMMAND" in
  up|start)
    action_up
    ;;
  down|stop)
    action_down
    ;;
  restart)
    action_restart
    ;;
  status|ps)
    action_status
    ;;
  logs)
    action_logs
    ;;
  health)
    action_health
    ;;
  clean)
    action_clean
    ;;
  help|--help|-h)
    action_help
    ;;
  *)
    echo -e "${C_RED}[ERROR] Perintah tidak dikenal: $COMMAND${C_RESET}"
    action_help
    exit 1
    ;;
esac
