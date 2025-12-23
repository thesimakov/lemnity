# test-platform

Небольшой проект-песочница для ручного тестирования **`embed-script`**.

Идея простая: в реальной интеграции у нас меняется только `widgetId` в теге `<script>`, а по нему подтягивается и рендерится нужный виджет. Этот проект делает переключение между виджетами максимально быстрым

## Как пользоваться

1. Запусти `test-platform` как обычно (через `pnpm dev` в workspace или через `projects/test-platform`).
2. Открой `http://localhost:5175/`.
3. Вставь в поле **Paste embed script tag** строку вида:

   `<script src="http://localhost:5173/embed.js?widgetId=cmiv69y9l0001fln0tqtma359" type="module" defer></script>`

4. Нажми **Load** — страница обновится и загрузит виджет с этим `widgetId`.

## Что под капотом

- **Источник `widgetId`**:
  - берём из URL: `?widgetId=...`
  - если в URL нет — берём из `localStorage`
- **История**: последние `widgetId` сохраняются в `localStorage` и показываются как **Recent**.
- **Загрузка embed**: `index.html` динамически инжектит `<script type="module" ...>` с нужным `widgetId`.
- Работает только при наличии в базе актуального виджета с его widgetId и сохраненным конфигом

## Полезное

- **Задать виджет через URL**: `?widgetId=...`
- **Сбросить**: кнопка **Clear** (чистит `widgetId` и перезагружает страницу)