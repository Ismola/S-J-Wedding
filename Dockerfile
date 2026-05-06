FROM node:22.12.0-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22.12.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.12.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=${HOST:-0.0.0.0}
ENV PORT=${PORT:-80}
ENV MONGO_URI=${MONGO_URI:-mongodb://mongo:27017}
ENV MONGO_DB_NAME=${MONGO_DB_NAME:-sj_wedding}

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json

EXPOSE 80
CMD ["node", "./dist/server/entry.mjs"]
