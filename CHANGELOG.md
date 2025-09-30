# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.5.0] - 2025-09-30

### Adicionado
- **Integração automática com Chatwoot**
  - Configura Chatwoot ao fechar QR code (criar/reconectar)
  - Endpoint POST `/api/chatwoot/set/{instanceName}`
  - Método `setChatwoot()` no evolution-client
  - Variáveis de ambiente: `CHATWOOT_ACCOUNT_ID`, `CHATWOOT_TOKEN`, `CHATWOOT_URL`
  - `nameInbox` usa automaticamente o nome da instância
  - Toast informativo durante configuração

### Alterado
- **Configuração Chatwoot otimizada**:
  - `reopenConversation: true` (reabrir conversas)
  - `conversationPending: false` (não criar como pendente)
  - `importContacts: false` (não importar contatos)
  - `importMessages: false` (não importar mensagens)
  - `mergeBrazilContacts: true` (mesclar contatos brasileiros)
  - `ignoreJids: ["@g.us"]` (ignorar grupos)

### Corrigido
- **Next.js 15 `params` async**: Corrige warnings sobre `params` não await
- **API routes atualizadas** para async params

## [1.4.0] - 2025-09-30

### Removido
- **Pasta vazia** `app/(protected)/instances/` (não mais necessária)
- **Endpoint obsoleto** `/api/evolution/instances/[instanceName]/qrcode` (QR code agora vem na criação)
- **Logs de debug** removidos para produção

### Alterado
- **README atualizado** com estrutura correta do projeto
- **Estrutura de pastas** refletindo arquitetura atual
- **Documentação Docker** com versão 1.4.0

### Melhorado
- **Código mais limpo** sem arquivos não utilizados
- **Documentação precisa** da estrutura de rotas
- **Build otimizado** sem dependências obsoletas

## [1.3.0] - 2025-09-30

### Adicionado
- **Botão Reconectar** em cada instância
  - Fluxo: logout → aguarda 1s → connect
  - Exibe QR code em dialog após reconexão
  - Ícone RefreshCw (seta circular)
  - Cor verde escuro (bg-green-700)
  - Toast informativo em cada etapa

### Alterado
- **URL simplificada**: `/instances` → `/` (raiz do site)
- **Cor do botão Reconectar**: amarelo → verde escuro
- **Middleware atualizado** para proteger rota raiz
- **Links atualizados** (header e login)

### Corrigido
- **Formato de resposta do restart**: transforma em array igual create instance
- **Exibição de QR code** na reconexão
- **Cache do Next.js** ao mover rotas

## [1.1.0] - 2025-09-30

### Adicionado
- **QR Code automático** ao criar instância
  - Exibido automaticamente em dialog após criação
  - Imagem base64 extraída da resposta da API
  - Interface intuitiva com título dinâmico
  - Botão "Fechar" para dispensar
- **Migração para SQLite**
  - Banco de dados local sem dependências externas
  - Arquivo `prisma/dev.db` criado automaticamente
  - Removida necessidade de PostgreSQL/Supabase
  - Simplifica deployment e configuração

### Alterado
- **Nome do aplicativo**: "Evolution Dashboard" → "Painel Principal"
- **Remoção de menu de navegação**: Acesso direto a `/instances`
- **Dark mode mais escuro**: Background preto (#000000) ao invés de slate-950
- **Descrições simplificadas**: Textos mais concisos e diretos
- **Remoção do botão "Ver Detalhes"**: Mantido apenas botão "Deletar"
- **Badge verde** para status "Conectada" (melhor visibilidade)

### Corrigido
- **Payload de criação de instância**: Adicionado campo `integration: 'WHATSAPP-BAILEYS'`
- **Campo token removido**: Token já está no header `apikey`
- **Extração de telefone**: Corrigido mapeamento de `ownerJid` para telefone formatado
- **Tratamento de erros**: Logs detalhados com status, message e details

### Removido
- Pasta `/app/(protected)/dashboard` (não mais necessária)
- Pasta `/app/(protected)/instances/[instanceName]` (página de detalhes)
- Campo `DATABASE_URL` do `.env` (SQLite não requer)
- Logs de debug do QR code (código limpo para produção)

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
