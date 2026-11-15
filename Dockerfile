# Dockerfile — Portfolio MBARGA Ernest
# Conteneurise le site portfolio avec Node.js

FROM node:20-alpine

LABEL maintainer="mbargaernest"
LABEL org.opencontainers.image.title="mbarga-portfolio"
LABEL org.opencontainers.image.description="Portfolio personnel de MBARGA Ernest"

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json en premier pour profiter du cache Docker
# (cette couche ne change que si les dépendances changent)
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --omit=dev

# Copier le reste du code source
COPY . .

# Utilisateur non-root pour la sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Port exposé par server.js
EXPOSE 3000

# Healthcheck : vérifie que le serveur répond
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Lancer le serveur
CMD ["node", "server.js"]
