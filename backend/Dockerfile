# syntax=docker/dockerfile:1

############################
# 1) deps (prod only)
############################
FROM node:24-alpine AS deps
WORKDIR /app

# Copie minimale pour maximiser le cache
COPY package.json package-lock.json ./

# Installe uniquement les deps prod
RUN npm ci --omit=dev --no-audit --no-fund \
  && npm cache clean --force

############################
# 2) runtime
############################
FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# User non-root avec UID/GID fixes (K8s-friendly)
RUN addgroup -g 10001 -S appgroup \
 && adduser  -u 10001 -S appuser -G appgroup

# Copier deps + code
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./

# Permissions
RUN chown -R 10001:10001 /app

USER 10001:10001

EXPOSE 3000

# Healthcheck léger (wget présent sur alpine via busybox)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- --timeout=2 http://127.0.0.1:${PORT}/api/health || exit 1

CMD ["node", "src/index.js"]
