# Release v1.5.0 - Integração Completa Chatwoot

## 🎉 Highlights

Este release traz **integração automática com Chatwoot**, **Docker production-ready**, e **código otimizado** sem redundâncias.

## ✨ Novidades

### 💬 Integração Automática com Chatwoot
- Configuração automática ao fechar QR code (criar/reconectar)
- Endpoint `POST /api/chatwoot/set/{instanceName}`
- Variáveis de ambiente: `CHATWOOT_ACCOUNT_ID`, `CHATWOOT_TOKEN`, `CHATWOOT_URL`
- `nameInbox` usa automaticamente o nome da instância
- Toast informativo durante configuração

### 🐳 Docker Production-Ready
- Health check endpoint `/api/health`
- Logging rotacionado (10MB, 3 arquivos)
- Network dedicada (evolution-network)
- Container stateless (sem persistência)
- Imagem Alpine Linux otimizada

### 🧹 Código Otimizado
- Helper `chatwoot-helper.ts` centraliza lógica
- Remove imports não utilizados
- Elimina código duplicado (-20 linhas)
- DRY (Don't Repeat Yourself) aplicado

## ⚙️ Configuração Chatwoot

```typescript
{
  enabled: true,
  reopenConversation: true,      // Reabrir conversas
  conversationPending: false,    // Não criar como pendente
  importContacts: false,         // Não importar contatos
  importMessages: false,         // Não importar mensagens
  mergeBrazilContacts: true,     // Mesclar contatos BR
  ignoreJids: ["@g.us"]         // Ignorar grupos
}
```

## 🚀 Quick Start

### Docker Compose

```bash
# Clone o repositório
git clone https://github.com/CRangelP/Connections-Manager-Evolution.git
cd Connections-Manager-Evolution

# Configure variáveis
cp .env.docker.example .env
nano .env

# Inicie
docker-compose up -d --build

# Acesse
http://localhost:3000
```

### Desenvolvimento Local

```bash
# Instale dependências
npm install

# Configure banco
npm run prisma:push
npm run prisma:seed

# Inicie dev server
npm run dev
```

## 📋 Variáveis de Ambiente

### Obrigatórias
- `NEXTAUTH_URL` e `NEXTAUTH_SECRET`
- `EVOLUTION_API_BASE_URL` e `EVOLUTION_API_TOKEN`
- `ADMIN_EMAIL` e `ADMIN_PASSWORD`

### Opcionais (Chatwoot)
- `CHATWOOT_ACCOUNT_ID`
- `CHATWOOT_TOKEN`
- `CHATWOOT_URL`

## 🔧 Correções

- ✅ Next.js 15 async `params` warnings corrigidos
- ✅ API routes atualizadas com `await params`
- ✅ Dockerfile otimizado com wget para healthcheck
- ✅ .dockerignore aprimorado

## 📦 Arquivos Importantes

- `docker-compose.yml` - Orquestração Docker
- `.env.docker.example` - Template de ambiente
- `lib/chatwoot-helper.ts` - Helper Chatwoot
- `app/api/health/route.ts` - Health check endpoint

## 🎯 Breaking Changes

Nenhum breaking change nesta versão.

## 📊 Estatísticas

- **Commits**: 15+
- **Arquivos modificados**: 25+
- **Linhas adicionadas**: 500+
- **Código otimizado**: -20 linhas duplicadas
- **Docker-ready**: 100% ✅

## 🙏 Agradecimentos

Obrigado a todos que contribuíram para este release!

---

**Full Changelog**: [v1.4.0...v1.5.0](https://github.com/CRangelP/Connections-Manager-Evolution/compare/v1.4.0...v1.5.0)
