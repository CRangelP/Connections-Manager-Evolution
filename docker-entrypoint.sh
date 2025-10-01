#!/bin/sh
set -e

echo "🚀 Iniciando Connections Manager Evolution..."

# Criar banco SQLite e aplicar schema
echo "📦 Criando banco de dados..."
npx prisma db push --skip-generate

# Executar seed (criar usuário admin)
echo "🌱 Executando seed (criando admin)..."
npx prisma db seed

echo "✅ Banco de dados pronto!"
echo "👤 Admin criado com credenciais do .env"

# Iniciar aplicação
echo "🎯 Iniciando aplicação..."
exec node server.js
