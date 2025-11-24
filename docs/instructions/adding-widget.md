## Как добавить новый тип виджета

### 1. Prisma + API слой
1. Добавь новое значение в `projects/server/prisma/schema/widget.prisma` → `enum WidgetType`.
2. Прогони миграцию (боевые/поддерживаемые ветки):
   ```bash
   pnpm --filter server exec npx prisma migrate dev --name add-<widget>
   pnpm --filter server exec npx prisma db push
   pnpm --filter server exec npx prisma generate
   ```
   Для локальной разработки можно сделать `prisma migrate reset`, затем `db push` и `generate`.
3. Перезапусти сервер, чтобы он подхватил новую схему (`docker compose restart server`).

### 2. SDK и клиентские типы
1. Запусти общий генератор:
   ```bash
   pnpm generate:api
   ```
   Он обновит `@lemnity/api-sdk`, чтобы новый тип оказался в `WidgetTypeEnum`.
2. Проверь, что клиент собирается и видит свежий enum.
3. Обнови `projects/client/src/layouts/Widgets/constants.ts` (`WidgetTypes`, `AVAILABLE_WIDGETS`, статусы), иначе UI не покажет новый виджет в списках.

### 3. `@lemnity/widget-config`
1. Создай папку `packages/widget-config/src/widgets/<WidgetName>/`.
2. Опиши схему `widget` (например, `const widgetSchema = z.object({ ... })`).
3. Если `fields`, `display`, `integration` отличаются от стандартных, определи свои поверхности и передай их в `buildWidgetSettingsSchema`.
4. Добавь файл `canonicalize.ts`, который чистит неактивные ветки и специфичные поля виджета.
5. Зарегистрируй схему и канонизатор в `packages/widget-config/src/widgets/index.ts` и `packages/widget-config/src/canonicalize.ts`.
6. Если требуется миграция старых данных, подними `CURRENT_VERSION` и добавь шаг в `migrations.ts`.
7. Собери пакет: `pnpm --filter @lemnity/widget-config build`.

### 4. Клиент (UI и store)
1. Создай папку `projects/client/src/layouts/Widgets/<WidgetName>`:
   - `defaults.ts` (widget/fields/display/integration).
   - `metadata.ts` (preview + settings sections).
   - Компоненты превью (`Preview`, `DesktopScreen`, `MobileScreen`) и настройки.
2. В `projects/client/src/stores/widgetSettings/widgetDefinitions.ts` зарегистрируй билдеры (`buildWidgetSettings`, `buildFieldsSettings`, `buildDisplaySettings`, `buildIntegrationSettings`) и `settingsSurfaces`.
3. В `layouts/Widgets/registry.ts` добавь metadata нового виджета.
4. В `widgetSlice.ts` подключи специфичные actions (`create<Widget>Actions`), а при необходимости обнови `fieldsSlice`/`displaySlice`/`integrationSlice`.

### 5. Серверные проверки
1. Убедись, что `ConfigService` принимает новый тип без дополнительных правок (канонизатор уже в пакете).
2. При необходимости добавь обработчики в resolver/контроллеры (например, если нужны специфичные DTO поля).
3. Прогоняй `pnpm --filter server lint` и (по возможности) тесты.

### 6. Проверка end-to-end
- `pnpm --filter client lint:check`
- Ручной прогон через страницу редактирования виджета (vite dev server).
- Проверить, что сервер принимает сохранённый конфиг и отдаёт его обратно уже в каноническом виде.

