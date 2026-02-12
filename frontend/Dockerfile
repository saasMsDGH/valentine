# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# speed up npm install with only lock + package
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# copy source and build
COPY . .
# build in production config; adjust if your angular.json target is different
ARG NG_ENV=production
ENV NODE_ENV=production
RUN npm run build:prod

# Production stage: nginx
FROM nginx:stable-alpine AS production
# create nginx user-owned dir and remove default html to ensure clean image
RUN rm -rf /usr/share/nginx/html/*

# copy custom nginx config (expect frontend/nginx.conf in repo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy built files from build stage
COPY --from=build /app/dist/valentine /usr/share/nginx/html

# set non-root nginx if required (alpine nginx runs as nginx user by default)
EXPOSE 80

# lightweight healthcheck: / (index) must exist
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget -qO- --timeout=2 http://127.0.0.1/ || exit 1

# prefer to run nginx in foreground (default for this image)
CMD ["nginx", "-g", "daemon off;"]
