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
CORS_ORIGINS=http://localhost:5173
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

Credenciais criadas apenas para desenvolvimento:

- Admin: `admin@restaurante.com` / `admin123`
- Cliente: `cliente@restaurante.com` / `123456`

## Iniciar API

```bash
uvicorn app.main:app --reload
```

Documentacao interativa:

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

- `GET /availability?date=YYYY-MM-DD&time=HH:mm&partySize=number`

A disponibilidade e calculada no backend considerando mesas `ACTIVE`, capacidade minima e ausencia de reserva `CONFIRMED` no mesmo dia e horario.

## Integracao futura com React

Configure o frontend com:

```env
VITE_API_URL=http://localhost:8000
```

Depois substitua os mocks em `frontend/src/services` por chamadas reais aos endpoints acima.
