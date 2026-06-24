---
name: integration-test-architector
description: Проектирует и добавляет интеграционные тесты в FSD-проекте в `__integration-tests__` рядом со слайсом/слоем; без реальных HTTP к серверам, с моками API и фикстурами ответов. Используй при сценариях «несколько модулей вместе», флоу фичи/виджета, маршрутизация+провайдеры, контракты между сегментами — при написании или рефакторинге интеграционных тестов, размещении по FSD, моках транспорта; целевое покрытие не выше 90%.
---

**перед работой ВАЖНО**
По умолчанию **не изменяй** файлы `.cursor/**` (skills/rules/agents/commands): они считаются “инфраструктурой промтов”.
Исключение: если пользователь **явно** попросил улучшить/исправить ИИ‑инфраструктуру — изменения допустимы, но их нужно перечислить в результате.

# Integration-test architector (FSD)

## Когда применять

Пользователь просит интеграционные тесты, сквозные сценарии внутри слайса, «собрать model+api+ui», тесты с роутером/стором/провайдерами — или правит код в `entities` / `features` / `widgets` / `pages` / `app` / `shared`.

Архитектура: [applying-fsd-architecture](../applying-fsd-architecture/SKILL.md). Отличие от unit-слоя: [references/scope.md](references/scope.md).

## Обязательные шаги перед кодом

1. **Стек** — из целевого приложения: `package.json`, при наличии `vitest.config.*`, `jest.config.*`, `playwright.config.*`, `vite.config.*`, другой раннер тестов (тестовый блок). Раннер, Testing Library, MSW и т.д. — **только из проекта**; новые зависимости — с явным добавлением в `package.json`. Если в workspace только правила — опираться на `package.json` приложения, которое указывает пользователь.
2. **Размещение** — все файлы только в **`__integration-tests__`**, рядом с тестируемой областью того же слайса/слоя (таблица ниже).
3. **Сеть** — запрещены реальные запросы к API (включая stage). Мокать клиент, `fetch`, слой `api/`, DTO-ответы; при необходимости MSW только в тестовой среде без боевого хоста. Паттерны: [references/mocking.md](references/mocking.md).
4. **Покрытие** — ориентир **не выше 90%** по строкам/веткам для интеграционного набора: критичные пользовательские/технические флоу, без 100% и без дублирования unit. Детали: [references/coverage.md](references/coverage.md).

## Куда класть `__integration-tests__`

| Область | Путь (пример) |
|--------|----------------|
| Сущность | `src/entities/<slice>/__integration-tests__/` |
| Фича | `src/features/<slice>/__integration-tests__/` |
| Виджет | `src/widgets/<slice>/__integration-tests__/` |
| Страница | `src/pages/<slice>/__integration-tests__/` |
| App | `src/app/__integration-tests__/` или `app/__integration-tests__/` |
| Shared | `src/shared/<segment>/__integration-tests__/` — рядом с тестируемым модулем |

Импорты — через **public API** слайса, как в проде.

## Что покрывать в первую очередь

- Сквозной сценарий: несколько сегментов (`model` + `ui`, `api` с моками + `model`) в одном тесте.
- Обвязка: Router, QueryClient, i18n, тема — по стеку проекта, без сети.
- Границы контрактов между частями слайса.

Примеры структуры: [references/placement-examples.md](references/placement-examples.md). Ссылки FSD: [references/fsd-links.md](references/fsd-links.md).
