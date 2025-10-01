# Estágio de dependências
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Estágio de builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gerar Prisma Client (não fazer db push no build)
RUN npx prisma generate

# Variáveis necessárias para o build do Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_SECRET=dummy-secret-for-build-only

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS runner
WORKDIR /app

# Instalar wget para healthcheck
RUN apk add --no-cache wget

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Criar diretório para banco de dados SQLite com permissões corretas
RUN mkdir -p /app/prisma && chown -R nextjs:nodejs /app/prisma

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copiar schema do Prisma para migrations/seeds no runtime
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
