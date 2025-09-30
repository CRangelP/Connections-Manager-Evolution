segue um “prompt de instruções” pronto para você colar em um agente de codificação e ele já sair implementando o projeto em **TypeScript + Next.js** (com autenticação e CRUD de instâncias da Evolution API). Ajuste só os nomes/descrições conforme quiser.

---

# PROMPT PARA AGENTE DE CÓDIGO

## Objetivo

Construir um **dashboard web** em **Next.js (App Router) + TypeScript** com **autenticação de usuário/senha** e telas para **listar, criar, visualizar e deletar instâncias** de WhatsApp usando a **Evolution API**. O front deve ser moderno e responsivo. Todo acesso à Evolution API deve ocorrer **no servidor** (nunca expor tokens no cliente).

## Requisitos funcionais

1. **Autenticação**

   * Login e logout com **NextAuth** (Credentials) + **Prisma** + **SQLite** (ou Postgres, parametrizável).
   * Páginas protegidas: qualquer rota de app só acessível autenticado.
   * Recuperação de sessão server-side (middleware/route guard).

2. **Instâncias (Evolution API)** (postman para endpoints: https://www.postman.com/agenciadgcode/evolution-api/collection/nm0wqgt/evolution-api-v2-3 )

   * Listar instâncias existentes.
   * Criar nova instância com **nome** e demais parâmetros necessários.
   * Deletar instância existente.
   * Visualizar detalhes de uma instância (status, QR code se aplicável, etc.).
   * Todas as ações chamam **Route Handlers**/Server Actions que **proxy** para a Evolution API.
   * Erros da Evolution API devem ser tratados e exibidos de forma amigável.

3. **UI/UX**

   * **Tailwind CSS** + **shadcn/ui** (botões, inputs, cards, diálogos, toasts).
   * **React Hook Form** + **Zod** para formulários tipados e validação.
   * **TanStack Query (React Query)** para estados assíncronos e cache (chamadas às rotas internas).
   * Layout responsivo, dark mode opcional, feedback de loading/erro/sucesso.

4. **Segurança**

   * **NUNCA** enviar `EVOLUTION_API_TOKEN` ao cliente.
   * Validar inputs com Zod em **client** e **server**.
   * Rate limiting básico nas rotas de API internas.
   * Headers adequados (no-store para recursos sensíveis), CSRF via NextAuth (quando aplicável), checagem de sessão nas rotas.

5. **Qualidade**

   * **ESLint** (com config para TS/React/Next) e **Prettier**.
   * Testes de unidade básicos (Vitest) para utilitários e validações.
   * Testes de integração mínimos para as Route Handlers (mocks da Evolution API).

6. **Deploy**

   * Scripts prontos para **Vercel** (preferencial) e **Docker** (opcional).
   * Variáveis de ambiente documentadas.

---

## Dependências (adicionar ao projeto)

* Base:

  * `"next"`, `"react"`, `"react-dom"`, `"typescript"`, `"@types/node"`, `"@types/react"`, `"@types/react-dom"`
* Estilo e UI:

  * `"tailwindcss"`, `"postcss"`, `"autoprefixer"`
  * `"class-variance-authority"`, `"clsx"`, `"tailwind-merge"`, `"lucide-react"`
  * **shadcn/ui**: gerar componentes conforme uso (Button, Card, Input, Dialog, Toast, Badge, Skeleton, Alert)
* Forms e validação:

  * `"react-hook-form"`, `"zod"`, `"@hookform/resolvers"`
* Data fetching:

  * `"@tanstack/react-query"`
* Auth e DB:

  * `"next-auth"`, `"bcryptjs"`
  * `"prisma"`, `"@prisma/client"`
* Utilitários:

  * `"axios"` (ou `fetch` nativo), `"ky"` (opcional)
  * `"joi"` (não usar se já estiver com Zod; manter apenas Zod)
* Testes/qualidade:

  * `"eslint"`, `"eslint-config-next"`, `"prettier"`
  * `"vitest"`, `"@vitest/ui"`, `"@testing-library/react"`, `"@testing-library/jest-dom"`, `"@testing-library/user-event"`
* Rate limiting (opcional):

  * `"@upstash/ratelimit"`, `"@upstash/redis"` ou implementar in-memory simples

---

## Estrutura de pastas sugerida

```
/
├─ app/
│  ├─ (auth)/
│  │  └─ login/page.tsx
│  ├─ (protected)/
│  │  ├─ layout.tsx        // verifica sessão e renderiza children
│  │  ├─ dashboard/page.tsx
│  │  └─ instances/
│  │     ├─ page.tsx       // lista/cria
│  │     └─ [id]/page.tsx  // detalhes/ações
│  ├─ api/
│  │  └─ evolution/
│  │     ├─ instances/route.ts           // GET=listar, POST=criar
│  │     └─ instances/[id]/route.ts      // GET=detalhes, DELETE=deletar
│  └─ layout.tsx
├─ components/
│  ├─ ui/   // shadcn generated
│  ├─ forms/
│  └─ layout/
├─ lib/
│  ├─ auth.ts                // NextAuth config
│  ├─ prisma.ts              // Prisma client
│  ├─ zod-schemas.ts         // schemas de validação
│  ├─ evolution-client.ts    // cliente server-side para Evolution API
│  ├─ rate-limit.ts          // helper opcional
│  └─ utils.ts
├─ styles/
│  └─ globals.css
├─ prisma/
│  └─ schema.prisma
├─ env.d.ts
├─ .env.example
└─ package.json
```

---

## Variáveis de ambiente (.env)

```
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gerar_uma_chave_segura

# DB
DATABASE_URL="file:./dev.db"   # SQLite (DEV) | use Postgres no PROD se preferir

# Evolution API
EVOLUTION_API_BASE_URL=https://api.evolution.com.br    # ajustar URL real
EVOLUTION_API_TOKEN=seu_token_da_evolution_api
EVOLUTION_API_TIMEOUT_MS=15000
```

> **Importante**: `EVOLUTION_API_*` só podem ser usados **no servidor** (Route Handlers/Server Actions). Nunca em código de cliente.

---

## Modelos Prisma (mínimo)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "sqlite" // ou "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  name          String?
  email         String   @unique
  passwordHash  String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Session { // se optar por session store custom; NextAuth também pode usar JWT-only
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  expires   DateTime
}
```

---

## NextAuth (Credentials)

* Implementar `authorize(credentials)` validando email e senha via `bcryptjs` contra `User.passwordHash`.
* Sessões por JWT (mais simples) ou com adapter Prisma (se quiser revogação server-side).
* Proteger rotas no segmento `(protected)` com um **server component** que verifica `getServerSession()` e redireciona para `/login`.

---

## Evolution API – Contratos (exemplo)

> Ajuste os caminhos conforme a documentação real da Evolution API.

* **Listar instâncias**

  * **GET** `${EVOLUTION_API_BASE_URL}/instances`
  * Headers: `Authorization: Bearer ${EVOLUTION_API_TOKEN}`
* **Criar instância**

  * **POST** `${EVOLUTION_API_BASE_URL}/instances`
  * Body: `{ name: string }` (+ outros campos que a API exigir)
* **Detalhar instância**

  * **GET** `${EVOLUTION_API_BASE_URL}/instances/:id`
* **Deletar instância**

  * **DELETE** `${EVOLUTION_API_BASE_URL}/instances/:id`
* **Obter QR code** (se aplicável)

  * **GET** `${EVOLUTION_API_BASE_URL}/instances/:id/qrcode`

**Observação**: todas as chamadas acima devem ser encapsuladas em `lib/evolution-client.ts` e consumidas **apenas** pelas rotas internas em `app/api/evolution/...`.

---

## Validações (Zod)

* `CreateInstanceSchema = z.object({ name: z.string().min(3).max(50) })`
* `DeleteInstanceSchema = z.object({ id: z.string().min(1) })`
* Use os schemas tanto no **form client** (resolver do RHF) quanto no **server** (antes de chamar a Evolution API).

---

## Rotas internas (Route Handlers)

* `GET /api/evolution/instances` → chama Evolution para listar; retorna `{ data, meta }`.
* `POST /api/evolution/instances` → valida corpo (Zod), chama Evolution para criar, retorna objeto criado.
* `GET /api/evolution/instances/:id` → retorna detalhes.
* `DELETE /api/evolution/instances/:id` → deleta.

**Todas** verificam sessão com `getServerSession()` e retornam `401` sem usuário logado. Implementar try/catch, mapear erros da Evolution em mensagens claras e status coerentes (400/404/500).

---

## Páginas/telas

1. **/login**

   * Form (email, senha), submit com RHF.
   * Feedback de erro do NextAuth.
2. **/dashboard**

   * Cards com resumo (qtd. instâncias, status).
3. **/instances**

   * Tabela (React Query) com paginação/empty state.
   * Botão “Criar instância” → Dialog com form (RHF + Zod) → `POST /api/evolution/instances`.
   * Ações por linha: “Ver”, “Deletar” (confirm dialog).
4. **/instances/[id]**

   * Detalhes, status, QR code (se existir endpoint).
   * Botões de ação específicos conforme a API (ex.: “Atualizar status”, etc.).

---

## Estado e fetch

* **React Query**:

  * `useQuery(['instances'], fetcher)` para listar.
  * `useMutation` para criar/deletar, invalidando `['instances']`.
* Fetcher usa as **rotas internas** (`/api/evolution/...`) e **não** chama a Evolution diretamente do cliente.

---

## Rate limiting (opcional)

* Implementar um middleware simples por IP/usuário para `POST`/`DELETE` nas rotas internas (ex.: Upstash) para evitar abuso.

---

## Scripts e Config

* `npx create-next-app@latest --ts`
* **Tailwind**: `npx tailwindcss init -p`; configurar `content` apontando para `./app/**/*.{ts,tsx}`, `./components/**/*.{ts,tsx}`.
* **shadcn/ui**: `npx shadcn-ui@latest init` e gerar componentes necessários.
* **Prisma**:

  * `npx prisma init`
  * `npx prisma migrate dev -n init`
  * `npx prisma generate`
* **Lint/Format**:

  * `"lint": "next lint"`, `"format": "prettier --write ."`
* **Dev/Build**:

  * `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`

---

## Critérios de aceitação

1. Usuário consegue **criar conta seed** (ou inserir diretamente via Prisma se quiser simplificar) e **logar**.
2. Rotas em `(protected)` redirecionam para `/login` quando não autenticado.
3. Tela **/instances** lista dados vindo da Evolution (via rotas internas).
4. Criar instância funciona, validações impedem nomes inválidos e erros são exibidos.
5. Deletar instância pede confirmação e atualiza a lista sem recarregar a página.
6. **Tokens da Evolution não aparecem** em nenhuma resposta de rede no cliente.
7. ESLint/Prettier sem erros; testes básicos passam (`vitest`).
8. Deploy no Vercel compila; variáveis de ambiente documentadas em `.env.example`.

---

## Entregáveis

* Repositório com código, README (setup, envs, scripts, deploy), `.env.example`.
* Prints/GIF rápido mostrando login, listar, criar e deletar instância.
* Pequena suíte de testes (2–4 testes chave).
* Instruções de deploy (Vercel) e nota sobre como alternar SQLite→Postgres.

---

## Observações finais para o agente

* Escrever tudo em **TypeScript estrito**.
* Componentizar UI com foco em acessibilidade (roles, aria-*).
* Logar erros de servidor no console apenas em dev; em prod, preparar `logger.ts` (no-op) para futura observabilidade.
* Manter separação clara: **cliente chama API interna**, API interna fala com **Evolution**.

---

Pronto. É só colar esse prompt no seu agente de código que ele já tem um checklist completo para implementar o projeto com Next.js + TypeScript, auth e as operações da Evolution API. Quer que eu gere também um **esqueleto de projeto** já com os arquivos base?
