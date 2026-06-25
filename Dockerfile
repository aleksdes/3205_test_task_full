FROM node:22-alpine AS builder

ARG VITE_API_TARGET

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @3205_test_task/backend build
RUN VITE_API_TARGET=${VITE_API_TARGET} pnpm --filter @3205_test_task/frontend build

FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

WORKDIR /app

ENV NODE_ENV=production
ENV BACKEND_HOST=localhost
ENV BACKEND_PORT=8000

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json apps/backend/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist

RUN mkdir -p apps/backend/data && echo '{"jobs":[],"taskUrls":[]}' > apps/backend/data/bd.json

EXPOSE 8000

CMD ["node", "apps/backend/dist/index.js"]
