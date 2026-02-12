# syntax=docker/dockerfile:1

############################
# 1) Build Angular
############################
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build


############################
# 2) Runtime: NGINX unprivileged (non-root)
############################
FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime

# Copie du build Angular
# ⚠️ IMPORTANT: Angular sort souvent dans /app/dist/<project-name>/
# Si ton /app/dist contient un seul sous-dossier, tu peux copier ce sous-dossier.
# Sinon adapte explicitement.
COPY --from=build /app/dist/valentine/browser/ /usr/share/nginx/html/

# Conf NGINX (écoute 8080)
# -> place-la dans frontend/nginx/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

# L'image est déjà non-root + CMD nginx par défaut
