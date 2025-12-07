## Сбор событий виджетов (`/collect`)

- Endpoint: `POST https://app.lemnity.ru/collect`
- Транспорт: HTTPS, JSON body
- Аутентификация: по умолчанию нет; при необходимости можно добавить токен/подпись через заголовок `X-Widget-Token`.
- Формат запроса:
  ```json
  {
    "event_name": "opened",
    "widget_id": "w_123",
    "project_id": "p_123",          // опционально
    "session_id": "session-abc",     // опционально
    "user_id": "u_123",              // опционально
    "url": "https://site/page",
    "referrer": "https://google.com",
    "user_agent": "UA string",
    "payload": { "extra": "data" }   // произвольный JSON
  }
  ```
- Ответ: `{"status":"accepted"}` (событие кладётся в RabbitMQ, далее в ClickHouse).
- Ограничения: `event_name`, `widget_id` ≤ 128 символов; остальные строковые поля опциональны.
- Хедеры, которые забираем автоматически: `X-Forwarded-For` (IP), `User-Agent` и `Referer` (если не заданы в теле).

### Поток данных
1) Nginx проксирует `/collect` на `collector` сервис.  
2) Collector (Nest) валидирует DTO и публикует в очередь RabbitMQ `widget_events`.  
3) Consumer читает очередь батчами и пишет в ClickHouse таблицу `${CLICKHOUSE_DB}.${CLICKHOUSE_EVENTS_TABLE}` (по умолчанию `analytics.widget_events`).

### Чтение статистики (для server)
- Endpoint (внутренний, токенизированный):  
  - `POST /internal/stats/summary` — суммарное число событий по фильтру.  
  - `POST /internal/stats/timeseries` — time series (bucket по `granularity`: hour/day).  
  - `POST /internal/stats/events` — сырые события с пагинацией.
- Фильтры (`StatsFilterDto`): `widget_id` (обяз.), опционально `project_id`, `event_name`, `url`, `referrer`, `session_id`, `from`, `to`, `granularity` (`hour|day`), `limit` (<=5000), `offset`.
- Аутентификация: заголовок `X-Collector-Token: ${COLLECTOR_API_TOKEN}`; вызовы идут только с server → collector по внутренней сети.
- Server использует сервис `CollectorService` (Nest) c env `COLLECTOR_API_URL`, `COLLECTOR_API_TOKEN`, чтобы дергать эти эндпоинты.

### ClickHouse схема
```
event_time DateTime
widget_id  String
project_id String
session_id String
event_name String
user_id    String
url        String
referrer   String
user_agent String
ip         String
payload    JSON
PRIMARY KEY (event_time, widget_id)
```

### Переменные окружения (основные)
- `RABBITMQ_URL` (пример: `amqp://guest:guest@rabbitmq:5672`)
- `RABBITMQ_QUEUE` (по умолчанию `widget_events`)
- `CLICKHOUSE_URL` (пример: `http://clickhouse:8123`)
- `CLICKHOUSE_USER` / `CLICKHOUSE_PASSWORD`
- `CLICKHOUSE_DB` (по умолчанию `analytics`)
- `CLICKHOUSE_EVENTS_TABLE` (по умолчанию `widget_events`)
- `COLLECTOR_PORT` (по умолчанию `4000`)
- `COLLECT_ENDPOINT` (по умолчанию `/collect`)
- `COLLECTOR_API_TOKEN` (общий токен server→collector)
- `COLLECTOR_API_URL` (по умолчанию `http://collector:4000`)

### Минимальная интеграция на стороне виджета
```js
await fetch('https://app.lemnity.ru/collect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event_name: 'opened',
    widget_id: '<your_widget_id>',
    project_id: '<project>',
    session_id: '<session-or-cookie>',
    payload: { foo: 'bar' }
  })
});
```
