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

start:
	pnpm dev

restart:
	pnpm build:backend
	pnpm --filter @3205_test_task/backend start &
	sleep 2
	pnpm generate-api:frontend
	kill %1 2>/dev/null || true
	pnpm dev