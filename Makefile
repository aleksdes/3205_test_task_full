.PHONY: setup

setup:
	pnpm install
	cp -n .env.example .env || true
	pnpm build:backend
	pnpm --filter @3205_test_task/backend start &
	sleep 2
	pnpm generate-api:frontend
	kill %1 2>/dev/null || true
	pnpm dev

init:
	pnpm install
	pnpm build:backend
	pnpm --filter @3205_test_task/backend start &
	sleep 2
	pnpm generate-api:frontend
	kill %1 2>/dev/null || true

restart:
	pnpm build:backend
	pnpm --filter @3205_test_task/backend start &
	sleep 2
	pnpm generate-api:frontend
	kill %1 2>/dev/null || true
	pnpm dev

build:
	pnpm build:backend
	pnpm build:frontend
