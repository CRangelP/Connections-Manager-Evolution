# 🚀 Connections Manager Evolution

[![Version](https://img.shields.io/badge/version-1.5.0-blue.svg)](https://github.com/CRangelP/Connections-Manager-Evolution/releases)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Dashboard web moderno para gerenciamento de instâncias WhatsApp via **Evolution API** (v2.3.4).

## ✨ Funcionalidades

- 🔐 **Autenticação** com NextAuth.js
- 📱 **Gerenciamento de Instâncias** (criar, listar, deletar, reconectar)
- 📲 **QR Code Automático** para pareamento WhatsApp
- 💬 **Integração Chatwoot** automática
- 🌓 **Dark Mode** nativo
- 🐳 **Docker** pronto para produção
- 🔄 **Stateless** (sem persistência de dados)

## 📋 Stack Tecnológica

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Autenticação**: NextAuth.js (Credentials Provider)
- **Banco de Dados**: SQLite + Prisma ORM
- **UI**: TailwindCSS + shadcn/ui
- **Formulários**: React Hook Form + Zod
- **Estado**: TanStack Query (React Query)
- **Deploy**: Docker + Docker Compose

## ✨ Funcionalidades

### v1.0.0 - Recursos Principais
- ✅ **Autenticação segura** com NextAuth
- ✅ **Listagem de instâncias** WhatsApp em tempo real
- ✅ **Criação de novas instâncias**
- ✅ **Status de conexão** (Conectada/Desconectada)
- ✅ **Deleção de instâncias** com confirmação
- ✅ **Dark Mode** (Light/Dark theme toggle)
- ✅ **Máscara de telefone** brasileiro (+55 (62) 96899-855)
- ✅ **Interface responsiva** e moderna
- ✅ **Validação de formulários** com Zod
- ✅ **Tratamento de erros** robusto
- ✅ **Auto-refresh** a cada 30 segundos

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# Evolution API
EVOLUTION_API_BASE_URL=https://api.evolution.com.br
EVOLUTION_API_TOKEN=seu_token_aqui
EVOLUTION_API_TIMEOUT_MS=15000

# Admin User (usado no primeiro acesso)
ADMIN_EMAIL=admin@evolutiondash.com
ADMIN_PASSWORD=Admin@123
```

> **Nota:** O banco de dados SQLite é criado automaticamente em `prisma/dev.db` e não precisa de configuração adicional.

### 2. Instalação

```bash
npm install
```

### 3. Configurar Banco de Dados

```bash
# Gerar Prisma Client
npm run prisma:generate

# Push schema para o banco
npm run prisma:push

# Criar usuário admin
npm run prisma:seed
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

**Credenciais padrão:**
- Email: `admin@evolutiondash.com`
- Senha: `Admin@123`

## 🐳 Docker

### Requisitos
- Docker 20.10+
- Docker Compose 2.0+

### Configuração

1. **Copie o arquivo de ambiente:**
```bash
cp .env.docker.example .env
```

2. **Configure as variáveis obrigatórias:**
   - `NEXTAUTH_SECRET` (mínimo 32 caracteres)
   - `EVOLUTION_API_BASE_URL`
   - `EVOLUTION_API_TOKEN`
   - `CHATWOOT_*` (opcional, para integração Chatwoot)

### Build e Run com Docker Compose

```bash
# Build e iniciar em background
docker-compose up -d --build

# Ver logs em tempo real
docker-compose logs -f app

# Parar serviços
docker-compose down
```

### Build manual

```bash
# Build da imagem
docker build -t evolution-dashboard:1.5.0 .

# Executar (necessário .env configurado)
docker run -d \
  -p 3000:3000 \
  --name evolution-dashboard \
  --env-file .env \
  evolution-dashboard:1.5.0

# Ver logs em tempo real
docker logs -f evolution-dashboard

# Parar e remover container
docker stop evolution-dashboard && docker rm evolution-dashboard
```

### Observações Importantes

**Banco de Dados:**
- SQLite **não persistido** (recriado a cada restart)
- Apenas armazena usuário admin (credenciais do `.env`)
- Seed executado automaticamente a cada inicialização
- Dados de instâncias vêm da Evolution API (não armazenados)

**Segurança:**
- Container roda com usuário não-root (`nextjs:nodejs`)
- Imagem Alpine Linux (menor superfície de ataque)
- Apenas porta 3000 exposta

**Variáveis de Ambiente Obrigatórias:**
- `NEXTAUTH_URL` e `NEXTAUTH_SECRET`
- `EVOLUTION_API_BASE_URL` e `EVOLUTION_API_TOKEN`
- `ADMIN_EMAIL` e `ADMIN_PASSWORD`

**Variáveis Opcionais:**
- `CHATWOOT_ACCOUNT_ID`, `CHATWOOT_TOKEN`, `CHATWOOT_URL` (integração Chatwoot)

## 🎯 Como Usar

1. **Faça login** com credenciais do `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)
2. **Crie instância** clicando em "Nova Instância"
3. **Escaneie QR Code** com WhatsApp
4. **Chatwoot configurado** automaticamente ao fechar
5. **Gerencie instâncias** (reconectar, deletar)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Cleber Rangel**

- GitHub: [@CRangelP](https://github.com/CRangelP)
- Projeto: [Connections Manager Evolution](https://github.com/CRangelP/Connections-Manager-Evolution)

## 🙏 Agradecimentos

- [Evolution API](https://evolution-api.com/) - API WhatsApp
- [Next.js](https://nextjs.org/) - Framework React
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Chatwoot](https://www.chatwoot.com/) - Plataforma de atendimento

---

⭐ **Se este projeto foi útil, considere dar uma estrela!** ⭐

## 📁 Estrutura do Projeto

```
├── app/
│   ├── (protected)/          # Rotas protegidas (autenticadas)
│   │   └── page.tsx         # Dashboard de instâncias (rota raiz /)
│   ├── api/
│   │   ├── auth/            # NextAuth routes
│   │   └── evolution/       # Proxy para Evolution API
│   │       └── instances/   # CRUD de instâncias
│   │           ├── route.ts                    # GET (listar) e POST (criar)
│   │           └── [instanceName]/
│   │               ├── route.ts                # DELETE (deletar)
│   │               └── restart/route.ts        # POST (reconectar)
│   ├── login/               # Página de login
│   ├── layout.tsx           # Layout raiz
│   └── providers.tsx        # Providers (session, theme, query)
├── components/
│   ├── forms/               # Formulários e dialogs
│   │   ├── create-instance-dialog.tsx
│   │   └── delete-instance-dialog.tsx
│   ├── layout/              # Header e componentes de layout
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── auth.ts              # Configuração NextAuth
│   ├── prisma.ts            # Cliente Prisma
│   ├── evolution-client.ts  # Cliente Evolution API (axios)
│   ├── zod-schemas.ts       # Schemas de validação (Zod)
│   ├── format-phone.ts      # Formatação telefone brasileiro
│   └── query-provider.tsx   # React Query Provider
├── prisma/
│   ├── schema.prisma        # Schema do banco (SQLite)
│   ├── dev.db               # Banco de dados SQLite
│   └── seed.ts              # Seed do usuário admin
├── types/                   # TypeScript types
├── .env.example             # Exemplo de variáveis
├── Dockerfile               # Docker config
├── docker-compose.yml       # Docker Compose
└── middleware.ts            # Middleware de autenticação
```

## 🔒 Segurança

- ✅ Tokens da Evolution API **nunca** expostos no cliente
- ✅ Todas as chamadas via **Route Handlers** server-side
- ✅ Validação de inputs com **Zod** (client + server)
- ✅ Sessões JWT com **NextAuth**
- ✅ Middleware para proteção de rotas
- ✅ Senhas hasheadas com **bcrypt**

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm run start

# Lint
npm run lint

# Format
npm run format

# Prisma
npm run prisma:generate  # Gerar client
npm run prisma:push      # Push schema
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:seed      # Executar seed
```

## 📡 API Evolution

O projeto usa a **Evolution API v2.3.4** para gerenciamento de instâncias WhatsApp.

**Endpoints utilizados:**
- `GET /instance/fetchInstances` - Listar instâncias
- `POST /instance/create` - Criar instância
- `GET /instance/connectionState/:name` - Status da instância
- `DELETE /instance/delete/:name` - Deletar instância
- `GET /instance/connect/:name` - Obter QR Code

## 🌐 Deploy

### Opção 1: Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe o projeto no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

**Importante**: Configure o `DATABASE_URL` do Supabase nas variáveis de ambiente da Vercel.

### Opção 2: Docker

Use o `Dockerfile` e `docker-compose.yml` incluídos para deploy em qualquer servidor com Docker.

## 🔄 Alternar SQLite → PostgreSQL

O projeto está configurado para PostgreSQL (Supabase). Para usar SQLite localmente:

1. Altere no `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. Atualize no `.env`:
```env
DATABASE_URL="file:./dev.db"
```

3. Execute:
```bash
npm run prisma:push
npm run prisma:seed
```

## 📝 Licença

MIT

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

**Desenvolvido com ❤️ usando Next.js e Evolution API**
