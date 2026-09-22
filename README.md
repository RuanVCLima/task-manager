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
Criar equipes
Listar equipes
Atualizar equipes
Excluir equipes
Membros de equipes
Adicionar usuários a equipes
Listar membros de uma equipe
Remover membros de uma equipe
Tarefas
Criar tarefas
Buscar tarefa por ID
Listar tarefas
Filtrar tarefas
Atualizar tarefas
Excluir tarefas

As tarefas possuem status:

pending
inProgress
completed

E prioridade:

high
medium
low
Histórico de tarefas
Consultar o histórico de alterações de uma tarefa
Registrar alterações realizadas nas tarefas
🔐 Autorização

A API possui rotas públicas e privadas.

Rotas públicas
POST /users
POST /sessions
Rotas privadas

As demais funcionalidades exigem autenticação:

/teams
/team-members
/tasks
/task-history

O middleware de autenticação é aplicado às rotas privadas.

Algumas operações também possuem autorização baseada na função do usuário.

Por exemplo, as operações de equipes exigem um usuário com a função admin.

📌 Endpoints
Users
Criar usuário
POST /users

Exemplo:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Sessions
Autenticar usuário
POST /sessions

Exemplo:

{
  "email": "john@example.com",
  "password": "password123"
}

Resposta:

{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

O endpoint de sessão valida email e senha e retorna o token JWT junto com os dados do usuário, sem a senha.

Teams
Criar equipe
POST /teams
Listar equipes
GET /teams
Atualizar equipe
PATCH /teams/:id
Excluir equipe
DELETE /teams/:id

As operações de equipes estão disponíveis nas rotas /teams e possuem autorização para usuários admin.

Team Members
Adicionar membro
POST /team-members

Body:

{
  "userId": "user-uuid",
  "teamsId": "team-uuid"
}
Listar membros
GET /team-members
Remover membro
DELETE /team-members

As operações de criação e remoção de membros exigem admin, enquanto a consulta pode ser realizada por admin ou member.

Tasks
Criar tarefa
POST /tasks

Exemplo:

{
  "title": "Implement authentication",
  "description": "Create JWT authentication",
  "status": "pending",
  "priority": "high",
  "assignedTo": "user-uuid",
  "teamId": "team-uuid"
}
Buscar tarefa por ID
GET /tasks/:id
Listar tarefas
GET /tasks

Filtros disponíveis:

GET /tasks?assignedTo=<uuid>
GET /tasks?status=pending
GET /tasks?priority=high
Atualizar tarefa
PATCH /tasks/:id
Excluir tarefa
DELETE /tasks/:id

As rotas de tarefas estão organizadas com operações de criação, consulta individual, listagem, atualização e exclusão.

Task History
Consultar histórico de uma tarefa
GET /task-history/:id

O histórico é consultado através do ID da tarefa e retornado em ordem cronológica definida pela aplicação.

🏗️ Estrutura do projeto

src/
├── configs/
├── controller/
├── database/
├── middleware/
├── routes/
├── test/
├── utils/
├── app.ts
├── env.ts
└── server.ts

prisma/
├── migrations/
└── schema.prisma

docker-compose.yml
eslint.config.mjs
jest.config.cjs
prisma.config.ts
tsconfig.json
package.json

A aplicação utiliza uma instância do Express com express.json(), registra as rotas e possui um middleware global para tratamento de erros.
⚙️ Variáveis de ambiente

Crie um arquivo .env na raiz do projeto:

DATABASE_URL="postgresql://user:password@localhost:5432/task_manager"
JWT_SECRET="your-secret-key"
PORT=3333

As variáveis DATABASE_URL e JWT_SECRET são obrigatórias, enquanto PORT possui valor padrão 3333.

Você pode utilizar o .env.example como referência:

DATABASE_URL=
JWT_SECRET=
PORT=
📦 Instalação

Clone o repositório:

git clone https://github.com/RuanVCLima/task-manager.git

Entre no diretório:

cd task-manager

Instale as dependências:

npm install

Configure as variáveis de ambiente:

cp .env.example .env

Depois configure o banco de dados de acordo com o DATABASE_URL.

Execute as migrations do Prisma:

npx prisma migrate dev

Gere o Prisma Client:

npx prisma generate
▶️ Executando o projeto
Desenvolvimento
npm run dev
Build
npm run build
Produção
npm start

O servidor utiliza a porta definida pela variável PORT.

🧪 Testes

O projeto utiliza Jest e Supertest para testes automatizados da API.

Execute os testes com:

npm test

Para executar os testes em modo de observação:

npm run test:watch

Os testes cobrem diferentes operações da API, incluindo autenticação e gerenciamento de recursos.

🐳 Docker

O projeto também possui configuração através do Docker Compose.

Para iniciar os serviços:

docker compose up -d

Para parar os serviços:

docker compose down
🧹 Qualidade de código

O projeto utiliza ESLint para análise estática e Prettier para formatação do código.

Para verificar problemas:

npm run lint

Para formatar o código:

npm run format
📚 Objetivo do projeto

Este projeto foi desenvolvido com o objetivo de praticar e consolidar conhecimentos em desenvolvimento de APIs REST utilizando Node.js e TypeScript.

Entre os principais conceitos trabalhados estão:

Arquitetura de APIs REST
Express
TypeScript
Prisma ORM
PostgreSQL
Autenticação com JWT
Autorização baseada em funções
Validação de dados com Zod
Hash de senhas com bcrypt
Middlewares
Tratamento de erros
Testes automatizados
Migrations
Docker
ESLint e Prettier
Organização de rotas e controllers
👨‍💻 Autor

Ruan Victor Cabral de Lima

Desenvolvedor focado em desenvolvimento web e backend com Node.js e TypeScript.
