FROM node:20-alpine AS base

# deps
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma   # 👈 BUNU EKLE

RUN npm install

# builder
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]