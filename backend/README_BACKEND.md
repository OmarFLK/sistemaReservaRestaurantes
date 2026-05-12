# Backend - Restaurant Reservation System

API inicial em FastAPI para autenticacao propria, mesas, reservas e disponibilidade server-side.

## Requisitos

- Python 3.12+
- PostgreSQL Neon
- `DATABASE_URL` no ambiente, sem commitar credenciais reais

## Configuracao do ambiente

Na raiz do repositorio, copie `.env.example` para `.env` e preencha com os valores reais localmente:

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST/DATABASE?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=https://your-frontend-domain.example
```

O arquivo `.env` deve permanecer fora do Git.

## Instalar dependencias

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Rodar migrations

```bash
alembic revision --autogenerate -m "initial tables"
alembic upgrade head
```

Este projeto ja inclui uma primeira migration versionada em `alembic/versions`.

## Rodar seed de desenvolvimento

```bash
python scripts/seed.py
```

Para criar usuarios iniciais, preencha localmente `SEED_ADMIN_EMAIL`,
`SEED_ADMIN_PASSWORD`, `SEED_CUSTOMER_EMAIL` e `SEED_CUSTOMER_PASSWORD`.
Sem essas variaveis, o seed cria apenas mesas e horarios padrao.

## Iniciar API

```bash
uvicorn app.main:app --reload
```

Documentacao interativa local:

- `http://127.0.0.1:8000/docs`

## Health checks

```bash
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/health/db
```

## Endpoints principais

### Health

- `GET /health`
- `GET /health/db`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Mesas

- `GET /tables`
- `GET /tables/{id}`
- `POST /admin/tables`
- `PUT /admin/tables/{id}`
- `DELETE /admin/tables/{id}`

As rotas `/admin/*` exigem token JWT de usuario com role `ADMIN`.

### Reservas

- `GET /reservations/my`
- `POST /reservations`
- `PUT /reservations/{id}`
- `DELETE /reservations/{id}`

O delete de reservas e cancelamento logico: a reserva muda para `CANCELLED`.

### Disponibilidade

- `GET /availability?date=YYYY-MM-DD&time=HH:mm&durationMinutes=90&partySize=number`

A disponibilidade e calculada no backend considerando mesas `ACTIVE`, capacidade minima e ausencia de reserva `CONFIRMED` com sobreposicao no intervalo solicitado.

## Integracao futura com React

Configure o frontend com:

```env
VITE_API_URL=https://your-backend-domain.example
```
