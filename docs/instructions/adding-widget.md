## Как добавить новый тип виджета

1. **Обнови Prisma enum**
   - Добавь новое значение в `projects/server/prisma/schema/models/widgets.prisma` → `enum WidgetType`.

0.5 **Синхронизация каталога виджетов**
- После добавления нового типа открой `projects/client/src/layouts/Widgets/constants.ts` и добавь его в `WidgetTypes`/`AVAILABLE_WIDGETS`, чтобы он отображался на странице выбора виджета и имел нужный статус (available/soon).

2. **Пропиши миграцию (prod/поддерживаемая ветка)**
   ```bash
   cd /Users/albert/Documents/GitHub/lemnity
   pnpm --filter server exec npx prisma migrate dev --name add-<widget>
   pnpm --filter server exec npx prisma db push
   pnpm --filter server exec npx prisma generate
   docker compose restart server
   ```

3. **Без миграций (локальная разработка, reset)**
   ```bash
   cd /Users/albert/Documents/GitHub/lemnity
   pnpm --filter server exec npx prisma migrate reset
   pnpm --filter server exec npx prisma db push
   pnpm --filter server exec npx prisma generate
   docker compose restart server
   ```

4. **SDK и клиент**
   - Запусти сервер (или убедись, что он уже работает) и подгрузил новый Prisma Client.
   - Сгенерируй API SDK:
     ```bash
     cd /Users/albert/Documents/GitHub/lemnity
     pnpm generate:api
     ```

5. **Frontend**
   - Создай папку `projects/client/src/layouts/Widgets/<WidgetName>` и добавь:
     - Превью-компоненты (панель, desktop, mobile).
     - `defaults.ts` / `metadata.ts` / `settings` секции рядом.
     - Секции настроек как `WidgetSettingsSection`.
   - Обнови `projects/client/src/stores/widgetSettings/widgetDefinitions.ts` и `layouts/Widgets/registry.ts`, импортируя данные из новой папки.

6. **Перезапуск**
   - Всегда используем `docker compose restart server`, чтобы сервер заново подхватил
     prisma-схемы и swagger-док.

