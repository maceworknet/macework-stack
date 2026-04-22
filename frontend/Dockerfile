# 1. Base image
FROM node:20-alpine AS base

# 2. Dependencies
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# 3. Builder
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma generate
RUN npx prisma generate

# Next build
RUN npm run build

# 4. Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Sadece gerekli dosyaları al
COPY --from=builder /app ./

# Port
EXPOSE 3000

# Prisma migrate + app start
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]