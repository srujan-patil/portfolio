FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS builder
RUN npm ci --only=production

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -S appgrp && adduser -S appuser -G appgrp
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .
RUN chown -R appuser:appgrp /app
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "src/index.js"]