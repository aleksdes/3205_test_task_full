# 3205 Test Task

Monorepo с бэкендом (Express + TypeScript) и фронтендом (Vue 3 + Vite).

## Разворачивание

```bash
# Разворачивание через Docker
make init
docker compose build
docker compose up -d

# Frontend будет доступен на http://localhost:8000/jobs
# ===================

# Локальное разворачивание
# Быстрый старт (делает всё сразу)
make setup
# ===================


# Или пошагово:
pnpm install
cp .env.example .env
pnpm build:backend
pnpm generate-api:frontend
pnpm dev
```

## Структура

- `apps/backend` — Express-сервер, отдаёт данные из JSON-файлов,
- Swagger-документация по `/openapi.json`
- `apps/frontend` — Vue 3 SPA (Pinia, PrimeVue, FSD, TypeScript)
