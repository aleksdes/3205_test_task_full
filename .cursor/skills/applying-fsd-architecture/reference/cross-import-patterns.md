# Паттерны разрешения кросс-импортов

Подробные стратегии и примеры кода для разрешения кросс-импортов между
слайсами одного слоя. Включает паттерн `@x` и рекомендации, как не допускать
избыточной связанности между entities.

---

## Проблема

Кросс-импорт возникает, когда двум слайсам на одном слое нужно ссылаться на
код друг друга. Это нарушает базовое правило импортов в FSD. Стратегии ниже
нужно пробовать **строго по порядку** — всегда сначала пытайся применить более
раннюю стратегию.

---

## Стратегия 1: Объединить слайсы

Если два слайса почти всегда меняются вместе, скорее всего это одна концепция,
и их нужно объединить.

**Признаки, что пора объединять:**

- Изменения в одном слайсе почти всегда тянут изменения во втором
- У двух слайсов в основном одинаковые зависимости
- Разработчики регулярно путаются, какой слайс за что отвечает

```text
// До: две фичи, которые всегда меняются вместе
features/send-message/
  ui/MessageInput.tsx
  model/message-draft.ts
features/message-list/
  ui/MessageList.tsx
  model/messages.ts

// После: одна цельная фича
features/messaging/
  ui/
    MessageInput.tsx
    MessageList.tsx
  model/
    message-draft.ts
    messages.ts
  index.ts
```

**Когда использовать:** у двух слайсов пересекаются зоны ответственности, и
они стабильно эволюционируют вместе.

**Когда НЕ использовать:** слайсы действительно независимы и просто делят
небольшой кусок логики.

---

## Стратегия 2: Вынести общую логику в Entities

Если несколько features/widgets используют одну и ту же доменную логику,
вынеси эту логику на слой entities. UI и логика, завязанная на конкретное
взаимодействие, должны остаться на верхнем слое.

```text
// До: две фичи дублируют логику заказа
features/order-create/
  model/order.ts        ← Типы заказа + валидация (дублируются)
  ui/OrderForm.tsx
features/order-history/
  model/order.ts        ← Типы заказа + форматирование (дублируются)
  ui/OrderList.tsx

// После: общая доменная логика в entities, UI остается в features
entities/order/
  model/
    order.ts            ← Общие типы + доменная логика
  index.ts              ← Public API

features/order-create/
  ui/
    OrderForm.tsx       ← UI остается в фиче
  model/
    order-form.ts       ← Логика формы, специфичная для фичи
  index.ts
features/order-history/
  ui/
    OrderList.tsx       ← UI остается в фиче
  model/
    order-display.ts    ← Логика отображения, специфичная для фичи
  index.ts
```

**Ключевой принцип:** выноси только реально общую доменную логику (типы,
правила валидации, бизнес-вычисления). Фиче-специфичные UI, state management и
API-вызовы остаются внутри feature.

---

## Стратегия 3: Композиция на более высоком слое (Inversion of Control)

Используй inversion of control: родительский слой (`pages` или `app`)
импортирует оба слайса и связывает их между собой. Сами слайсы не должны
импортировать друг друга напрямую.

### React: Render Props / Children

```typescript
// Проблема: features/comment-list хочет показывать аватары из
// features/user-profile — но импорт на одном слое запрещен.

// Решение: pages/post композирует оба слайса и передает данные вниз.

// pages/post/ui/PostPage.tsx
import { CommentList } from '@/features/comments';
import { UserAvatar } from '@/entities/user';

const PostPage = ({ post }) => (
  <CommentList
    comments={post.comments}
    renderAuthor={(userId) => <UserAvatar userId={userId} />}
  />
);
```

### Vue: Именованные слоты

```vue
<!-- pages/post/ui/PostPage.vue -->
<template>
  <CommentList :comments="post.comments">
    <template #author="{ userId }">
      <UserAvatar :userId="userId" />
    </template>
  </CommentList>
</template>
```

### Любой фреймворк: Dependency Injection

```typescript
// features/notifications/model/notifications.ts
// Вместо прямого импорта из features/user принимаем callback:
interface NotificationDeps {
  getUserName: (userId: string) => string;
}

export const createNotificationService = (deps: NotificationDeps) => ({
  formatNotification: (notification) =>
    `${deps.getUserName(notification.userId)}: ${notification.message}`,
});

// pages/dashboard/model/setup.ts — связываем зависимости здесь
import { createNotificationService } from "@/features/notifications";
import { getUserName } from "@/entities/user";

export const notificationService = createNotificationService({ getUserName });
```

**Когда использовать:** слайсы действительно независимы, а их связь — это
вопрос композиции, а не общей доменной логики.

---

## Стратегия 4: Нотация `@x` (последний вариант)

Если ни одна из стратегий выше не подходит, используй `@x` для явных,
контролируемых кросс-импортов **только между entities**.

### Как работает `@x`

Каждая entity может открыть специальную директорию `@x/`, в которой лежат
файлы, названные по entity-потребителю. Это делает кросс-импорт явным и
аудируемым.

```text
entities/
  user/
    @x/
      order.ts          ← Экспортируется специально для entity order
    model/
      user.ts
    index.ts
  order/
    model/
      order-summary.ts  ← Импортирует из user/@x/order
    index.ts
```

```typescript
// entities/user/@x/order.ts — экспортирует только то, что нужно order
export { getUserDisplayName } from "../model/user";

// entities/order/model/order-summary.ts
import { getUserDisplayName } from "@/entities/user/@x/order";

export const formatOrderSummary = (order, userId) => {
  const name = getUserDisplayName(userId);
  return `${name}'s order #${order.id}`;
};
```

### Правила `@x`

1. **Документируй, зачем нужен `@x`**, и почему не подошли другие стратегии.
2. **Периодически пересматривай решение** — требования меняются, `@x` может
   стать не нужен.
3. **`@x` создает связанность между entities.** Злоупотребление повышает цену
   рефакторинга. Держи поверхность экспортов `@x` минимальной.
4. **Используй `@x` только между entities.** Для features/widgets/pages должен
   применяться подход из Стратегии 3 (композиция).
5. **Обычные кросс-импорты (без `@x`) все еще запрещены.** `@x` — единственный
   допустимый способ кросс-импорта между entities.

---

## Избыточные Entities — частая первопричина

Многие проблемы кросс-импортов начинаются с того, что entities создают слишком
рано и слишком много. Если entities выделены преждевременно, им часто приходится
ссылаться друг на друга, что запускает каскад `@x`-зависимостей.

### Признаки избыточных entities

- Несколько entities имеют `@x`-зависимости друг на друга
- Entities используются только в одной странице или одной фиче
- Entity-слайсы слишком тонкие (по сути тип + реэкспорт)
- Для изменения одной фичи регулярно приходится править несколько entities

### Как исправить

1. **Проведи аудит использования entities.** Найди те, что используются только
   в одном месте.
2. **Верни single-use entities обратно в потребляющую страницу или фичу.**
   Для поиска используй правило Steiger `insignificant-slice`.
3. **Объедини тесно связанные entities.** Если `order` и `order-item` почти
   всегда меняются вместе, объедини их в одну entity `order`.

### До и после

```text
// До: слишком много entities и @x-зависимостей
entities/user/
  @x/order.ts
  @x/notification.ts
entities/order/
  @x/user.ts           ← Циклический @x!
entities/notification/
  model/notification.ts ← Используется только в pages/dashboard

// После: упрощенная структура
entities/user/
  model/user.ts         ← Оставлено, потому что реально переиспользуется
entities/order/
  model/order.ts        ← Оставлено, @x больше не нужен
pages/dashboard/
  model/notification.ts ← Возвращено назад — одно место использования
shared/api/
  types.ts              ← Общие типы ответов API
```

---

## Схема принятия решения

Когда сталкиваешься с потребностью в кросс-импорте:

```text
Двум слайсам на одном слое нужно разделить код
  │
  ├─ Они почти всегда меняются вместе?
  │   └─ ДА → Стратегия 1: объединить слайсы
  │
  ├─ Общая часть — это доменная логика (типы, валидация, бизнес-правила)?
  │   └─ ДА → Стратегия 2: вынести в entities
  │
  ├─ Связь между ними — это вопрос композиции (сборка UI, связывание данных)?
  │   └─ ДА → Стратегия 3: композиция на более высоком слое (IoC)
  │
  └─ Ничего из этого не подходит, и оба слайса — entities?
      └─ ДА → Стратегия 4: нотация @x
      └─ НЕТ → Пересмотри границы слайсов. Потребность в кросс-импорте часто
               сигнализирует, что декомпозиция слайсов сделана неверно.
```