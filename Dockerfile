# ==============================================================================
# QuranWeb - Unified Multi-Stage Dockerfile (Frontend SPA + Backend API)
# ==============================================================================
# Target:
#   1. web (Default): Nginx Alpine serving static SPA on port 3382
#   2. api          : Node.js 20 Alpine serving REST API on port 4000
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base Builder for Frontend Static Asset
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html tsconfig.json vite.config.ts ./
COPY src ./src
COPY public ./public

RUN npm run build

# ------------------------------------------------------------------------------
# Target: Backend API Service (Node.js on Port 4000)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS api
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server ./server

EXPOSE 4000
CMD ["node", "server/index.js"]

# ------------------------------------------------------------------------------
# Target: Web Frontend Runner (Nginx on Port 3382 - Default Target)
# ------------------------------------------------------------------------------
FROM nginx:alpine AS web
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3382
CMD ["nginx", "-g", "daemon off;"]
