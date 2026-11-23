# AutoVitrine API — Classificados de Veículos

API RESTful completa com front-end integrado para anúncios de veículos, desenvolvida em **Node.js + Express** com arquitetura em camadas (*Controllers*, *Services*, *Repositories*), autenticação via **Token JWT**, controle de acesso por perfil (**RBAC** e prevenção contra **IDOR**), documentação interativa **OpenAPI / Swagger UI** e **persistência híbrida** (arquivo local `JSON` ou banco relacional `PostgreSQL` via **Prisma ORM**).

---

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação Local (Modo Arquivo JSON — Sem Docker)](#instalação-local-modo-arquivo-json--sem-docker)
- [Instalação com Docker Compose (PostgreSQL + Prisma + pgAdmin)](#instalação-com-docker-compose-postgresql--prisma--pgadmin)
- [Credenciais de Teste (Seed Inicial)](#credenciais-de-teste-seed-inicial)
- [Endpoints Principais](#endpoints-principais)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## Pré-requisitos

* **Para execução local (modo JSON):**
  * [Node.js](https://nodejs.org/) v20 ou superior (recomendado v20+ para suporte nativo a `--env-file` e `--watch`)
  * [Git](https://git-scm.com/)
* **Para execução com banco de dados relacional (opcional):**
  * [Docker Desktop](https://www.docker.com/products/docker-desktop/) ou Docker Engine com plugin `docker compose`

---

## Instalação Local (Modo Arquivo JSON — Sem Docker)

Este modo não exige instalação de nenhum banco de dados externo: a aplicação cria e gerencia automaticamente o arquivo `data/database.json` na primeira execução.

### 1. Clonar o repositório
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA_DO_REPOSITORIO>
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com o conteúdo abaixo:
```env
PORT=3000
DB_PROVIDER=json
JWT_SECRET=segredo_jwt_autovitrine_2026
```

### 4. Gerar o cliente Prisma
Mesmo utilizando o provedor `json`, gere o cliente do Prisma para carregar os módulos internos sem erros:
```bash
npx prisma generate
```

### 5. Iniciar o servidor
```bash
node --env-file=.env --watch src/server.js
```
*(Ou simplesmente `node src/server.js`, caso não deseje recarregamento automático).*

### 6. Acessar a aplicação no navegador
* **Front-End (Vitrine Web):** [http://localhost:3000](http://localhost:3000)
* **Documentação Interativa (Swagger UI):** [http://localhost:3000/docs](http://localhost:3000/docs)
* **Health Check & Métricas:** [http://localhost:3000/health](http://localhost:3000/health)

---

## Instalação com Docker Compose (PostgreSQL + Prisma + pgAdmin)

Para executar a aplicação conectada ao banco de dados relacional **PostgreSQL 16** e gerenciar as tabelas visualmente pelo **pgAdmin 4**:

### 1. Construir e subir os contêineres
```bash
docker compose up --build -d
```

### 2. Sincronizar as tabelas do Prisma no PostgreSQL e reiniciar a API
```bash
docker compose run --rm api npx prisma db push
docker compose restart api
```

### 3. Verificar o status dos serviços
```bash
docker compose ps
```

### 4. Acessar os serviços no navegador
* **Front-End (Vitrine Web):** [http://localhost:3000](http://localhost:3000)
* **Swagger UI:** [http://localhost:3000/docs](http://localhost:3000/docs)
* **Health Check (confirmará `POSTGRESQL`):** [http://localhost:3000/health](http://localhost:3000/health)
* **pgAdmin 4:** [http://localhost:5050](http://localhost:5050)
  * **Login do pgAdmin:** `admin@auto.com` / `admin123`
  * **Conexão com o banco (aba *Connection*):** Host `db`, Porta `5432`, Banco `autovitrine_db`, Usuário `postgres`, Senha `secret_password`

---

## Credenciais de Teste (Seed Inicial)

Na primeira inicialização (tanto no arquivo JSON quanto no PostgreSQL), dois usuários são criados automaticamente:

| Perfil (`role`) | E-mail | Senha | Permissões |
| :--- | :--- | :--- | :--- |
| **Administrador (`ADMIN`)** | `admin@auto.com` | `admin123` | Criar, editar e excluir **qualquer** anúncio |
| **Vendedor (`USER`)** | `vendedor@auto.com` | `123456` | Criar anúncios e editar **apenas os próprios** anúncios |

---

## Endpoints Principais

| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Público | Verifica disponibilidade da API e persistência ativa |
| `POST` | `/api/v1/auth/register` | Público | Cadastra um novo usuário (`201 Created`) |
| `POST` | `/api/v1/auth/login` | Público | Autentica credenciais e emite o Token JWT (`200 OK`) |
| `GET` | `/api/v1/carros` | Público | Lista todos os veículos (aceita filtro `?marca=`) |
| `GET` | `/api/v1/carros/:id` | Público | Retorna os detalhes de um veículo específico |
| `POST` | `/api/v1/carros` | Autenticado (`JWT`) | Publica um novo anúncio de veículo (`201 Created`) |
| `PUT` | `/api/v1/carros/:id` | Dono ou `ADMIN` | Atualiza um anúncio existente (`200 OK` / `403 Forbidden`) |
| `DELETE` | `/api/v1/carros/:id` | Apenas `ADMIN` | Remove um anúncio da vitrine (`204 No Content` / `403 Forbidden`) |

---

## Estrutura do Projeto

```text
├── .github/workflows/       # Pipeline de CI (GitHub Actions)
├── prisma/                  # Schema do banco relacional (Prisma ORM)
├── public/                  # Front-end HTML/CSS/JS integrado
├── src/
│   ├── config/              # Inicialização de banco e seed (Prisma)
│   ├── controllers/         # Camada de entrada/saída HTTP
│   ├── docs/                # Especificação OpenAPI / Swagger
│   ├── middlewares/         # Autenticação JWT, RBAC, Erros e Observabilidade
│   ├── repositories/
│   │   ├── json/            # Implementação em arquivo local (database.json)
│   │   └── postgres/        # Implementação em PostgreSQL (Prisma ORM)
│   ├── routes/              # Definição das rotas versionadas (/api/v1)
│   ├── services/            # Regras de negócio e validação de titularidade
│   └── server.js            # Ponto de entrada da aplicação Express
├── Dockerfile
├── docker-compose.yml
└── package.json
```
