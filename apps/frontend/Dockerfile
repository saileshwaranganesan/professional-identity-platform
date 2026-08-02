# Multi-stage Dockerfile for React SPA Frontend
FROM node:22-alpine AS build

WORKDIR /app

# Enable Corepack & pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependency installation layer
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Source files & compilation
COPY . .

ARG VITE_API_BASE_URL=http://localhost:8080/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN pnpm run build

# Minimal Nginx production runtime
FROM nginx:1.27-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built SPA bundle from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
