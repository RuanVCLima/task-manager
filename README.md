# Task Manager API

API REST desenvolvida para gerenciamento de usuários, equipes, membros, tarefas e histórico de alterações.

O projeto foi desenvolvido com Node.js e TypeScript, utilizando Express para construção da API, Prisma como ORM e PostgreSQL como banco de dados.

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod
- JWT
- bcrypt
- Jest
- Supertest
- tsup
- ESLint
- Prettier
- Docker / Docker Compose

## 📋 Funcionalidades

### Usuários

- Cadastro de usuários
- Autenticação
- Criptografia de senhas
- Autorização baseada em função
- Usuários com diferentes níveis de acesso

### Autenticação

A API utiliza JWT para autenticação.

Após realizar o login, o usuário recebe um token que deve ser enviado nas requisições protegidas através do header:

```http
Authorization: Bearer <token>
```
Equipes

-Listar equipes
-Criar equipes
-Atualizar equipes
-Excluir equipes
-Membros de equipes
-Adicionar usuários a equipes
-Listar membros de uma equipe
-Remover membros de uma equipe
-Tarefas
-Criar tarefas
-Buscar tarefa por ID
-Listar tarefas
-Filtrar tarefas
-Atualizar tarefas
-Excluir tarefas

As tarefas possuem status:

`pending`
`inProgress`
`completed`
E prioridade:

`high`
`medium`
`low`

Histórico de tarefas
-Consultar o histórico de alterações de uma tarefa
-Registrar alterações realizadas nas tarefas

🔐 Autorização

A API possui rotas públicas e privadas.

Rotas públicas

```http
POST /users
POST /sessions
```
Rotas privadas

As demais funcionalidades exigem autenticação:

```http
/teams
/team-members
/tasks
/task-history 
```

O middleware de autenticação é aplicado às rotas privadas.

Algumas operações também possuem autorização baseada na função do usuário.

Por exemplo, as operações de equipes exigem um usuário com a função admin.

📌 Endpoints

Users

Criar usuário
```http
POST /users
```

Exemplo:

```JSON
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
Sessions

Autenticar usuário

```http
POST /sessions 
```

Exemplo:

```JSON
{
  "email": "john@example.com",
  "password": "password123"
}
```


Resposta:

```JSON
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

```

O endpoint de sessão valida email e senha e retorna o token JWT junto com os dados do usuário, sem a senha.

Teams

Criar equipe

```http
POST /teams
```
Listar equipes
```http
GET /teams

```
Atualizar equipe
```http
PATCH /teams/:id

```
Excluir equipe
```http
DELETE /teams/:id

```

As operações de equipes estão disponíveis nas rotas /teams e possuem autorização para usuários admin.

Team Members

Adicionar membro
```http
POST /team-members

```

Body:
```JSON
{
  "userId": "user-uuid",
  "teamsId": "team-uuid"
}

```

Listar membros
```http
GET /team-members

```
Remover membro
```http
DELETE /team-members
```

As operações de criação e remoção de membros exigem admin, enquanto a consulta pode ser realizada por admin ou member.

Tasks

Criar tarefa
```http
POST /tasks

```

Exemplo:
```JSON
{
  "title": "Implement authentication",
  "description": "Create JWT authentication",
  "status": "pending",
  "priority": "high",
  "assignedTo": "user-uuid",
  "teamId": "team-uuid"
}

```
Buscar tarefa por ID
```http
GET /tasks/:id
```
Listar tarefas
```http
GET /tasks
```

Filtros disponíveis:

```http

GET /tasks?assignedTo=<uuid>
GET /tasks?status=pending
GET /tasks?priority=high
```

Atualizar tarefa
```http
PATCH /tasks/:id

```
Excluir tarefa
```http
DELETE /tasks/:id

```
As rotas de tarefas estão organizadas com operações de criação, consulta individual, listagem, atualização e exclusão.

Task History

Consultar histórico de uma tarefa
```http
GET /task-history/:id
```
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
O histórico é consultado através do ID da tarefa e retornado em ordem cronológica definida pela aplicação.

## 🏗️ Estrutura do projeto

```text
task-manager/
│
├── 📁 prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── 📁 src/
│   │
│   ├── 📁 configs/
│   │   └── ...
│   │
│   ├── 📁 controller/
│   │   ├── session-controller.ts
│   │   ├── task-controller.ts
│   │   ├── task-history-controller.ts
│   │   └── team-members-controller.ts
│   │
│   ├── 📁 database/
│   │   └── prisma.ts
│   │
│   ├── 📁 middleware/
│   │   ├── ensure-authenticated.ts
│   │   ├── error-handling.ts
│   │   └── verify-user-authorization.ts
│   │
│   ├── 📁 routes/
│   │   ├── sessions-routes.ts
│   │   ├── task-history-routes.ts
│   │   ├── task-routes.ts
│   │   ├── team-members-routes.ts
│   │   ├── teams-routes.ts
│   │   └── users-routes.ts
│   │
│   ├── 📁 test/
│   │   └── ...
│   │
│   ├── 📁 utils/
│   │   └── AppError.ts
│   │
│   ├── app.ts
│   ├── env.ts
│   └── server.ts
│
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 docker-compose.yml
├── 📄 eslint.config.mjs
├── 📄 jest.config.cjs
├── 📄 package.json
├── 📄 prisma.config.ts
├── 📄 tsconfig.json
└── 📄 README.md
```

| Diretório | Descrição |
|---|---|
| `prisma/` | Schema e migrations do banco de dados |
| `src/configs/` | Configurações da aplicação |
| `src/controller/` | Controllers responsáveis pela lógica das requisições |
| `src/database/` | Configuração e acesso ao Prisma |
| `src/middleware/` | Middlewares de autenticação, autorização e tratamento de erros |
| `src/routes/` | Definição das rotas da API |
| `src/test/` | Testes automatizados |
| `src/utils/` | Utilitários da aplicação |

A aplicação utiliza uma instância do Express com express.json(), registra as rotas e possui um middleware global para tratamento de erros.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

⚙️ Variáveis de ambiente

Crie um arquivo .env na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/task_manager"
JWT_SECRET="your-secret-key"
PORT=3333

```

As variáveis DATABASE_URL e JWT_SECRET são obrigatórias, enquanto PORT possui valor padrão 3333.

Você pode utilizar o .env.example como referência:

```env
DATABASE_URL=
JWT_SECRET=
PORT=

```

📦 Instalação

Clone o repositório:

```bash
git clone https://github.com/RuanVCLima/task-manager.git
```

Entre no diretório:

```bash
cd task-manager
```
Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Depois configure o banco de dados de acordo com o DATABASE_URL.

Execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

▶️ Executando o projeto

Desenvolvimento

```bash
npm run dev
```
Build

```bash
npm run build
```
Produção

```bash
npm start
```

O servidor utiliza a porta definida pela variável PORT.

🧪 Testes

O projeto utiliza Jest e Supertest para testes automatizados da API.

Execute os testes com:

```bash
npm test
```

Para executar os testes em modo de observação:

```bash
npm run test:watch
```

Os testes cobrem diferentes operações da API, incluindo autenticação e gerenciamento de recursos.

🐳 Docker

O projeto também possui configuração através do Docker Compose.

Para iniciar os serviços:

```bash
docker compose up -d
```

Para parar os serviços:

```bash
docker compose down
```

🧹 Qualidade de código

O projeto utiliza ESLint para análise estática e Prettier para formatação do código.

Para verificar problemas:

```bash
npm run lint
```

Para formatar o código:

```bash
npm run format
```

📚 Objetivo do projeto

Este projeto foi desenvolvido com o objetivo de praticar e consolidar conhecimentos em desenvolvimento de APIs REST utilizando Node.js e TypeScript.

Entre os principais conceitos trabalhados estão:

-Arquitetura de APIs REST
-Express
-TypeScript
-Prisma ORM
-PostgreSQL
-Autenticação com JWT
-Autorização baseada em funções
-Validação de dados com Zod
-Hash de senhas com bcrypt
-Middlewares
-Tratamento de erros
-Testes automatizados
-Migrations
-Docker
-ESLint e Prettier
-Organização de rotas e controllers
👨‍💻 Autor

Ruan Victor Cabral de Lima

Desenvolvedor focado em desenvolvimento web e backend com Node.js e TypeScript.
