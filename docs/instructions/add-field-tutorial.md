# Как добавить новое поле в виджет

1. **Согласуй схему и типы**
   - Добавь поле в `packages/widget-config/src/widgets/<Widget>/schema.ts` (или соответствующую surface в `base.ts`, если это стандартное поле). Укажи точную zod-валидацию и обязательность.
   - Если поле должно триммиться/очищаться, обнови `packages/widget-config/src/widgets/<Widget>/canonicalize.ts`.
   - Обнови клиентские типы (`projects/client/src/stores/widgetSettings/types.ts`) и дефолты (`layouts/Widgets/<Widget>/defaults.ts`, а при необходимости `stores/widgetSettings/defaults.ts`), чтобы новое поле всегда имело базовое значение.

2. **Свяжи поле со стором**
   - В `layouts/Widgets/<Widget>/actions.ts` добавь `set<ИмяПоля>` в `create...Actions`, чтобы Zustand мог обновлять значение.
   - Пропиши метод в `projects/client/src/stores/widgetSettings/widgetActions/types.ts` и прокинь его через `createWidgetSlice`.
   - Обнови хук (`layouts/Widgets/<Widget>/hooks.ts` или `stores/widgetSettings/fieldsHooks.ts`), чтобы вернуть новый сеттер и текущее значение.

3. **Добавь поле в UI настроек**
   - В нужной секции (`layouts/WidgetSettings/...`) добавь компонент (`Input`, `NumberField`, `SwitchableField` и т.д.).
   - Подключи соответствующий хук (`useFieldsSettings`, `useDisplaySettings`, специализированный hook виджета) и подставь значение с дефолтом через `useWidgetStaticDefaults`/`withDefaults`.
   - Укажи ограничения (`min/max`, placeholder, подписи) в UI, чтобы они совпадали с требованиями схемы.

4. **Передай значение в превью/рендер**
   - Расширь пропсы экранов (`DesktopScreen`, `MobileScreen`, панель) и основной компоненты виджета.
   - Подмешивай дефолты через `withDefaults`, прежде чем использовать значение в рендере, и при необходимости нормализуй (например, clamp по диапазону).

5. **Проверка**
   - Проверь, что поле присутствует во всех слоях: схема `widget-config`, канонизатор, клиентские типы/дефолты, actions/hooks, UI.
   - Прогоняй `pnpm --filter @lemnity/widget-config build`, `pnpm --filter client lint:check` и убедись, что сервер принимает/отдаёт конфиг без ошибок.
   - В визуальном редакторе проверь, что поле сохраняется, попадает в preview и уходит на сервер в каноническом виде.

