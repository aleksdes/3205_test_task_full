# `app` layer — правила и паттерны по текущей кодовой базе

Документ фиксирует **реально применённые** в проекте паттерны слоя `src/app` и даёт рекомендации, чтобы будущий код был **единообразным**.

## Роль слоя `app` в этом проекте

В текущей реализации `app` — это:
- инициализация Vue-приложения и подключение плагинов/интеграций;
- настройка роутера + guards + декларация маршрутов;
- подключение глобальных “side-effect” импортов (даты/стили);
- верхнеуровневая оболочка UI (`App.vue`), которая отображает layout-виджеты/роутер и глобальные предупреждения.


## Точки входа и bootstrap

- **Единственная точка входа**: `src/main.ts`.
  - Паттерн: `application.mount('#app')` (вся инициализация до `mount` живёт в `src/app/index.ts`).
- **Агрегатор приложения**: `src/app/index.ts`.
  - Паттерн: создаётся `application = createApp(App)` и к нему “подвешиваются” setup-функции.
  - Паттерн: глобальные импорты с побочными эффектами подключаются здесь же (например, `@/shared/lib/dayjs.ts`, `@/shared/ui/theme/styles/index.scss`).

### Порядок инициализации (зафиксирован кодом)

В `src/app/index.ts` порядок такой:
- создаём `application`;
- если в проекте используется Sentry инициализируем Sentry с доступом к `router` (`initSentry(application, router)`);
- подключаем `router` (`useRouterSetup`);
- подключаем UI framework (`usePrimeVueSetup`);
- подключаем state management (`usePiniaSetup`);
- подключаем интеграции графиков (`useHighchartsSetup`);
- подключаем метрику (`useYMSetup`).
- иные подключения любых других библиотек 
  
**Рекомендация**: придерживаться этого же принципа — интеграции, которым нужен `router`, инициализировать до `app.use(router)` только если библиотека этого требует; иначе держать правило “сначала `router`, потом плагины UI/state, затем интеграции”.

## Конвенция `*-setup` модулей (интеграции/плагины)

В проекте сложился чёткий формат “setup-модулей”:
- папка: `src/app/<name>-setup/`
- файл реализации: `<name>-setup.ts`
- публичный API: `index.ts` с ре-экспортом
- экспортируемая функция:
  - либо `use<Name>Setup(app: App)` — если это `app.use(...)`, директивы, плагины (`pinia`, `primevue`, `highcharts`, `yandex-metrika`);
  - либо `init<Name>(...)` — если это условная инициализация “один раз” (`sentry`).

**Рекомендации для будущих интеграций**:
- **Сигнатура**:
  - всегда явно типизировать границы: `app: App`, `router: Router` и т.п.;
  - не использовать `any` на границе (сейчас есть `base-init.ts`, см. ниже).
- **Side effects**:
  - setup должен быть “чистым” по I/O: максимум чтение `import.meta.env`, регистрация плагина, подписка на события;
  - если нужно подключить глобальные стили/полифилы — делать это в `src/app/index.ts`
- **Public API**:
  - внешний импорт должен идти через `src/app/<name>-setup/index.ts`, а не deep-import в `<name>-setup.ts`.

## Router setup: структура и паттерны

### `router-setup` как слайс внутри `app`

`src/app/router-setup/` — автономный блок с публичным API:
- `router` создаётся в `router-setup.ts`;
- `useRouterSetup(app)` регистрирует `router` и guards;
- публичный экспорт — `src/app/router-setup/index.ts`.

### Роуты: композиция через `routeCompositionFactory`

Паттерн маршрутов:
- для каждого маршрута создаётся `useXRoute = routeCompositionFactory({ ... })`;
- наружу используется `useXRoute.raw` (как `RouteRecordRaw`).

Плюсы паттерна:
- единый способ описывать `path/component`;
- есть место для типизации/валидации аргументов на уровне роутера.

### Валидация params/query на границе роутера

Паттерн: для некоторых роутов в `routeCompositionFactory` передаётся второй аргумент с `params/query`, валидируемыми через **Zod**:
- пример `query`: `src/app/router-setup/routes/auth-scope-routes.ts` (`code`, `state`);
- пример `params`: `src/app/router-setup/routes/admin-scope-routes.ts` (`id`).

**Рекомендация**: всё внешнее (URL params/query) продолжать валидировать на границе роутера (Zod), чтобы дальше по коду работать с нормализованными значениями.

### Layout-группировка маршрутов

Маршруты группируются не “вручную”, а через фабрику композиции:
- в `src/app/router-setup/routes/index.ts` создаются группы `withEmptyLayout`, `withSidebarLayout`, `withBaseLayout`;
- layout-компоненты берутся из `widgets/_layout` (`BaseAuthScaffold`, `SidebarScaffold`, `BaseScaffold`).

**Рекомендации**:
- новые layout’ы добавлять как виджеты (`widgets/...`), а выбор layout’а оставлять в `app/router-setup/routes/index.ts`;
- маршруты страниц подключать в scope-файлах (`auth-scope-routes.ts`, `user-scope-routes.ts`, `admin-scope-routes.ts`), чтобы `routes/index.ts` оставался “склеивающим”.

### Guards: policy в `RouteMeta`

В проекте используется расширение `RouteMeta`:
- `src/app/router-setup/types.d.ts` добавляет `meta.policy` и `meta.arguments`;
- `RouteAccessibility` описан как enum.

Guards читают `to.meta.policy`:
- `accessibility-handler.ts` обрабатывает `routeAccessibility` и `allow`;
- `redirect-to-default.ts` делает redirect с `/` на дефолтный маршрут;

**Рекомендации**:
- если логика доступа/ролей относится к приложению в целом — держать её в guards и управлять через `meta.policy`;
- если guard зависит от UI (toast/confirm) — это допустимо в `app`, но лучше, чтобы он не тянул бизнес-логику напрямую (см. раздел “Расхождения”).

## `App.vue`: что считается нормой в верхнем UI

Текущие паттерны `App.vue`:
- глобальные `Toast`-группы на разных позициях;
- глобальные “предупреждающие” UI-компоненты (`DataLossWarning`, `NetworkAccessibilityWarning`);
- `SplashScreen` до момента “готовности приложения” (`appReady`);
- `router-view` как единственная точка рендера страниц после ready;
- `PWABadge` как интеграционный верхний UI для обновлений PWA.

**Рекомендации**:
- всю глобальную UI-обвязку держать в `App.vue`, не размазывать по страницам;
- вводить новые глобальные оверлеи/тосты/баннеры через виджеты (`widgets/*`) или `shared/ui`, а в `App.vue` только подключать.

## Инициализация “готовности приложения”

Паттерн инициализации в `App.vue`:
- `start()` вызывается сразу при создании компонента;
- есть `appReady` и “finally” выставляет ready независимо от ошибок;
- используется `baseInit(Promise...)` для параллельной загрузки.


## Прочие наблюдения по единообразию

- **Именование**:
  - в `app` применяется `kebab-case` для папок (`router-setup`, `pinia-setup`, и т.д.) — сохранять.
  - экспортируемые функции — `useXSetup`/`initX` — сохранять.
- **Public API**:
  - почти везде есть `index.ts` как точка входа — сохранять и не делать deep-import’ы.

## Чеклист для добавления нового кода в `app`

- **Новый плагин/интеграция**: оформить как `src/app/<name>-setup/` + `use<Name>Setup(app)` + ре-экспорт в `index.ts`.
- **Новая метрика/трекинг**: держать в `app`, конфиг через `import.meta.env`, не тянуть доменные модули.
- **Новые роуты**:
  - декларации `useXRoute = routeCompositionFactory(...)`;
  - `.raw` используется при сборке `RouteRecordRaw`;
  - params/query валидировать Zod’ом на границе;
  - группировать по scope (`auth/user/admin`) и по layout’ам.
- **Новый guard**: подключать из `router-guards/index.ts` (и следить, чтобы guard реально был включён в `setupGuards`).
- **Глобальный UI**: подключать в `App.vue`, но стараться, чтобы реализация жила в `widgets/*` или `shared/ui`.

