---
name: check
description: Быстрые проверки качества (lint + typecheck + build) без изменения зависимостей.
---

## Что делает

Проверки, которые должны быть зелёными перед тем как считать задачу “готово”:

- lint: `npm run lint`
- typecheck: `npx vue-tsc --noEmit`
- unit tests: `npm run test:unit`
- integration tests (по условиям ниже): `npm run test:integration`
- build (если правки могут влиять на сборку): `npm run build`

## Правила

- Если запрос пользователя — “быстро” и scope маленький: минимум `lint` + `typecheck`.
- Если трогали `model/`/`lib/` и бизнес-логику: добавить `test:unit`.
- Если трогали UI/композицию/интеграцию частей: добавить `test:integration`.
- Если менялись импорты/алиасы/конфиги/Vite/плагины/глобальные стили: обязательно добавить `build`.
- Зависимости и lock‑файлы не трогать (см. `.cursor/rules/package.mdc`).

