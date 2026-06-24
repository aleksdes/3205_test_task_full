# Примеры размещения `__integration-tests__`

Каталог **`__integration-tests__`** — на одном уровне с тестируемым функционалом **внутри того же слайса/области слоя**, не в общем `tests/integration` на весь монорепо (если иное не принято в репозитории).

Корень `src/` может называться иначе — ориентир на соседство со слайсом.

## Entity

```
entities/
  user/
    model/
    api/
    ui/
    __integration-tests__/
      profile-form-and-model.test.tsx
```

## Feature

```
features/
  auth-by-phone/
    model/
    ui/
    api/
    __integration-tests__/
      full-login-flow.test.tsx
```

## Widget

```
widgets/
  cart-summary/
    ui/
    model/
    __integration-tests__/
      summary-with-mocked-cart-api.test.tsx
```

## Page

```
pages/
  checkout/
    ui/
    __integration-tests__/
      checkout-route.test.tsx
```

## App

```
app/
  providers/
  __integration-tests__/
    providers-tree.test.tsx
```

## Shared

```
shared/
  lib/
    api-client/
      client.ts
      __integration-tests__/
        client-with-mocks.test.ts
```

## Имена файлов

Согласовать с проектом: `*.test.ts`, `*.spec.ts`, `*.integration.test.ts` — как в конфиге vitest/jest или конфигах другого ранера тестов, определенного в `package.json`, или в соседних тестах.
