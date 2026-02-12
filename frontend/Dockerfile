# syntax=docker/dockerfile:1

############################
# Build Angular
############################
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build


############################
# Runtime: nginx unprivileged
############################
FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime

USER 0

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/valentine/browser/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

USER 101

EXPOSE 8080
