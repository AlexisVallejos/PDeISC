# Un solo contenedor: la API Node sirve /api y también la web de Expo.

# 1) Exporta la app Expo como sitio web estático
FROM node:22-alpine AS web
WORKDIR /web
COPY app/package*.json ./
RUN npm ci
COPY app/ ./
RUN npx expo export --platform web --output-dir dist

# 2) API + web compilada
FROM node:22-alpine
WORKDIR /srv
COPY api/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY api/ ./
COPY --from=web /web/dist ./public
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1
USER node
CMD ["node", "server.js"]
