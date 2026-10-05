# Un solo contenedor: la API Node sirve /api y también la web compilada con Vite.

# 1) Compila la web de React
FROM node:22-alpine AS web
WORKDIR /web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

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
