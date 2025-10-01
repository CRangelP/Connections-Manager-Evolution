#!/bin/sh
set -e

echo "🚀 Iniciando Connections Manager Evolution..."

# Criar banco SQLite e aplicar schema
echo "📦 Criando banco de dados..."
node_modules/.bin/prisma db push --skip-generate

# Executar seed manualmente (criar usuário admin)
echo "🌱 Executando seed (criando admin)..."
node_modules/.bin/tsx prisma/seed.ts

echo "✅ Banco de dados pronto!"
echo "👤 Admin criado com credenciais do .env"

# Iniciar aplicação
echo "🎯 Iniciando aplicação..."
exec node server.js
