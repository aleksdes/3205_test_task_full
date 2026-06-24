## Что это

`.cursor/` — инфраструктура агентной разработки: **rules** (инварианты), **skills** (процессы), **agents** (роли субагентов), **commands** (точки входа).

Главная цель: чтобы разработка шла **через процесс** (план → реализация → ревью → тесты), а артефакты были воспроизводимыми (в первую очередь `tasks-planner/**`).

## Ключевые инварианты

- **`.cursor/** не трогаем по умолчанию**: любые изменения в rules/skills/agents/commands делаются **только** по явному запросу “улучши/исправь ИИ‑инфраструктуру” и всегда перечисляются в результате.
- **Архитектура**: Feature‑Sliced Design, public API, направление зависимостей — см. `rules/architecture.mdc` и `skills/applying-fsd-architecture/SKILL.md`.
- **TypeScript strict / Vue SFC**: `rules/typescript.mdc`, `rules/vue3-sfc-typescript.mdc`.
- **Зависимости**: версии не трогать, lock‑файлы не перегенерировать — `rules/package.mdc`.

## Когда что запускать

### Большие/комплексные задачи

Запускать `orchestrate`:

- декомпозиция через `agent-planner` в `tasks-planner/<ветка|дата>/<task>/tasks.md`;
- реализация по подзадачам через `agent-worker`;
- обязательное `agent-code-reviewer`;
- потом тесты (`unit-test-creator` → `integration-test-creator`) и прогон (`test-runner`).

См. `skills/orchestrate-jobs/SKILL.md`.

### Небольшие точечные задачи

Запускать `implementer` — прямое внесение правок в код с соблюдением FSD и TS strict.

## Карта папок

- `rules/`: alwaysApply‑правила (архитектура, TS, Vite, зависимости, язык).
- `skills/`: процессные навыки (FSD, orchestrate, тестовая архитектура).
- `agents/`: роли субагентов (planner/worker/reviewer/test-runner/design/*).
- `commands/`: “ярлыки” для запуска типовых процессов (`orchestrate`, `implementer`, `add-*test`).

## Артефакты процесса (важно)

Единая точка правды по большой задаче — `tasks-planner/**/tasks.md`:

- каждая подзадача — отдельный `.md` файл;
- статусы только ✅/❌;
- статус “✅” ставится **после** реализации + ревью без блокеров (и, если требуется, после тестов).

## DoD / проверки

Быстрый минимум для “готово” в этом репозитории (пока нет тест‑раннера в `package.json`):

- `npm run lint`
- `npx vue-tsc --noEmit`
- `npm run test:unit`
- `npm run test:integration` (если затронут UI/интеграционные контракты)
- `npm run build` — если правки могли задеть сборку/импорты/конфиги

См. `.cursor/commands/check.md` и `.cursor/skills/orchestrate-jobs/references/definition-of-done.md`.

