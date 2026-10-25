# Plataforma de Eventos — Web e API (Next.js)

Sistema web de gerenciamento de eventos e API REST consumida pelo aplicativo mobile.
Projeto da atividade avaliativa de **Desenvolvimento Mobile** — IFMA Campus Timon.

**Integrantes:** _Nome 1_ e _Nome 2_

## Visão geral

O mesmo projeto Next.js entrega duas coisas:

- **Painel do administrador** (`/admin`): login, listagem, detalhes, cadastro, edição e exclusão de eventos.
- **API REST** (`/api/...`): autenticação, eventos e inscrições, usada pelo app mobile.

O app mobile fica em um projeto separado (`../mobile`) e conversa com esta API por HTTP.

```
App mobile (Expo)  ──fetch──►  API (Next.js)  ──Prisma──►  PostgreSQL (Docker)
```

## Tecnologias

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma ORM 7 + PostgreSQL
- Zod (validação dos dados da API)
- bcryptjs (hash de senhas) e jsonwebtoken (JWT)

## Pré-requisitos

- Node.js 18 ou superior
- Docker Desktop (para o PostgreSQL)

## Como executar

### 1. Subir o banco de dados (PostgreSQL no Docker)

```bash
docker run --name eventos-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=eventos -p 5433:5432 -v eventos-data:/var/lib/postgresql/data -d postgres:16
```

O banco fica na porta **5433** do computador (a 5432 costuma estar ocupada por outro PostgreSQL instalado no Windows).
Depois da primeira vez, basta ligar e desligar o container `eventos-db` pelo Docker Desktop, ou com `docker start eventos-db` / `docker stop eventos-db`.
Os dados ficam guardados no volume `eventos-data`.

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto `web`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/eventos"
JWT_SECRET="troque-por-um-segredo-grande-e-aleatorio"
```

O arquivo `.env` não deve ser enviado ao repositório.

### 4. Criar as tabelas (migrations) e gerar o Prisma Client

```bash
npx prisma migrate deploy
npx prisma generate
```

Para desenvolvimento, quando o schema for alterado, use `npx prisma migrate dev --name nome-da-mudanca`.

### 5. Criar o usuário administrador

```bash
npx tsx prisma/seed.ts
```

Credenciais do administrador:

| E-mail | Senha |
|---|---|
| `admin@email.com` | `admin123` |

### 6. Iniciar o servidor

```bash
npm run dev
```

- Painel do administrador: <http://localhost:3000/admin/login>
- API: <http://localhost:3000/api/events>

Para o aplicativo mobile acessar a API pelo celular, o servidor precisa estar acessível na rede local (o Next.js mostra o endereço `Network` ao iniciar, algo como `http://192.168.0.32:3000`). O celular e o computador devem estar na mesma rede Wi-Fi.

## Modelo de dados (Prisma)

- **User** — `id`, `name`, `email` (único), `password` (hash), `role` (`USER` ou `ADMIN`)
- **Event** — `id`, `title`, `description`, `date`, `time`, `location`, `image` (URL, opcional)
- **Registration** — `id`, `userId`, `eventId`

Relacionamentos:

- Um usuário tem várias inscrições; um evento tem várias inscrições.
- `Registration` liga usuário e evento (relação muitos-para-muitos).
- `@@unique([userId, eventId])` impede inscrição duplicada no mesmo evento.
- `onDelete: Cascade` remove as inscrições quando o usuário ou o evento é excluído.

O schema está em `prisma/schema.prisma` e as migrations em `prisma/migrations/`.

## Endpoints da API

Rotas protegidas exigem o header `Authorization: Bearer <token>`, obtido no login.

| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| POST | `/api/auth/register` | Cadastrar usuário (sempre com perfil `USER`) | Público |
| POST | `/api/auth/login` | Realizar login e receber o token | Público |
| GET | `/api/events` | Listar eventos | Público |
| GET | `/api/events/:id` | Consultar evento | Público |
| POST | `/api/events` | Criar evento | Somente `ADMIN` |
| PUT | `/api/events/:id` | Atualizar evento | Somente `ADMIN` |
| DELETE | `/api/events/:id` | Excluir evento | Somente `ADMIN` |
| GET | `/api/registrations` | Listar inscrições do usuário logado | Autenticado |
| POST | `/api/events/:id/registrations` | Inscrever o usuário logado no evento | Autenticado |
| DELETE | `/api/registrations/:id` | Cancelar inscrição (somente a própria) | Autenticado |

Códigos de resposta usados: `200`, `201`, `400` (dados inválidos), `401` (não autenticado), `403` (sem permissão), `404` (não encontrado) e `409` (e-mail ou inscrição já existente).

### Exemplo de corpo para criar evento

```json
{
  "title": "Semana de TI",
  "description": "Palestras e oficinas",
  "date": "2026-11-10",
  "time": "19:00",
  "location": "Auditório IFMA",
  "image": "https://exemplo.com/imagem.jpg"
}
```

## Segurança e validação

- Senhas armazenadas com hash (bcrypt).
- Autenticação por JWT (validade de 7 dias).
- Criação, edição e exclusão de eventos restritas ao perfil `ADMIN`, o que impede o aplicativo de alterar eventos.
- O usuário só cancela as próprias inscrições; o id do usuário vem do token, nunca do corpo da requisição.
- Todos os dados recebidos pela API são validados com Zod (`lib/validations.ts`).

## Estrutura do projeto

```
web/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── events/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── registrations/route.ts
│   │   └── registrations/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── admin/
│   │   ├── page.tsx                  (lista de eventos)
│   │   ├── login/page.tsx
│   │   └── events/
│   │       ├── new/page.tsx
│   │       └── [id]/
│   │           ├── page.tsx          (detalhes)
│   │           └── edit/page.tsx
│   └── generated/prisma/             (Prisma Client gerado)
├── components/EventForm.tsx
├── lib/
│   ├── prisma.ts                     (conexão com o banco)
│   ├── auth.ts                       (JWT e proteção de rotas)
│   ├── validations.ts                (schemas Zod)
│   ├── api-client.ts                 (fetch usado pelo painel)
│   └── use-require-admin.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── prisma.config.ts
```

## Problemas comuns

- **`P1000: Authentication failed` ao rodar a migration:** outro PostgreSQL está usando a porta 5432. Use a porta 5433 no Docker e na `DATABASE_URL`, como descrito acima.
- **Acentos quebrados em testes pelo PowerShell:** é uma limitação de codificação do PowerShell 5 ao enviar e exibir o texto. No painel web e no app os acentos funcionam normalmente.
- **API não responde:** confira se o container `eventos-db` está ligado e se o `npm run dev` está rodando.