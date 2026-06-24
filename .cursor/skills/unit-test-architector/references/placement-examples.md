# Примеры размещения `__unit-tests__`

Структура `src/` может отличаться (`app/` в корне и т.д.) — важно правило: **каталог `__unit-tests__` соседен слайсу/области**, а не вынесен в общий `tests/unit` на весь монорепо (если иное не принято в конкретном репозитории).

## Entity

```
entities/
  user/
    model/
    api/
    ui/
    __unit-tests__/
      map-user-dto.test.ts
      user-factory.test.ts
```

## Feature

```
features/
  auth-by-phone/
    model/
    ui/
    api/
    __unit-tests__/
      send-otp-flow.test.ts
```

## Widget

```
widgets/
  cart-summary/
    ui/
    model/
    __unit-tests__/
      totals.test.ts
```

## App

```
app/
  providers/
  __unit-tests__/
    compose-providers.test.ts
```

## Shared

Класть `__unit-tests__` рядом с пакетом утилит, например:

```
shared/
  lib/
    date/
      format.ts
      __unit-tests__/
        format.test.ts
```

## Имена файлов

- Согласовать с проектом: `*.test.ts`, `*.spec.ts` — как уже в `vitest`/`jest` config или конфигах другого ранера тестов, определенного в `package.json`, или в соседних тестах.
