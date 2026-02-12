# Build stage (install production deps only, cache package install)
FROM node:20-alpine AS deps
WORKDIR /app

# copy package files first to leverage layer cache
COPY package.json package-lock.json* ./
# install only production deps (faster, smaller)
ENV NODE_ENV=production
RUN npm ci --omit=dev --no-audit --no-fund

# Runtime stage (non-root, minimal)
FROM node:20-alpine AS runtime
WORKDIR /app

# create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# copy only what's needed from deps stage
COPY --from=deps /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=deps /usr/local/bin /usr/local/bin

# Copy app source (only what's required)
COPY src/ ./src/
COPY package.json ./

# ensure production NODE_ENV (use runtime override if needed)
ENV NODE_ENV=production
ENV PORT=3000

# set permissions
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

# simple healthcheck (works in docker / k8s probing can override)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget -qO- --timeout=2 http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "src/index.js"]
