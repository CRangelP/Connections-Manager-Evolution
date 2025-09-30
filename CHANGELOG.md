# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-09-30

### 🎉 Lançamento Inicial

#### Adicionado
- **Autenticação** com NextAuth.js (Credentials Provider)
- **Gerenciamento de instâncias** WhatsApp via Evolution API
  - Listagem de todas as instâncias
  - Criação de novas instâncias
  - Deleção de instâncias com confirmação
- **Status em tempo real** (Conectada/Desconectada)
- **Dark Mode** completo com theme toggle
  - Tema padrão: Light
  - Suporte a tema do sistema
  - Persistência no localStorage
- **Máscara de telefone** brasileiro
  - Formato: +55 (62) 96899-855
  - Suporte para celular (9 dígitos) e fixo (8 dígitos)
- **Interface moderna**
  - Design responsivo (Mobile, Tablet, Desktop)
  - Cards informativos com Owner e Phone
  - Badge de status colorido (Verde: Conectada, Vermelho: Desconectada)
- **Auto-refresh** automático a cada 30 segundos
- **Validação de formulários** com Zod + React Hook Form
- **Tratamento de erros** robusto
- **Docker** configurado para deploy

#### Tecnologias
- Next.js 15.5.4 (App Router)
- TypeScript
- TailwindCSS 4 + shadcn/ui
- Prisma ORM + PostgreSQL
- TanStack Query (React Query)
- next-themes (Dark Mode)

#### Interface
- Nome do app: **Painel Principal**
- Tema escuro: Background preto (#000000)
- Tema claro: Background slate-50
- Remoção do menu de navegação (acesso direto a /instances)
