export default () => {
  const env = process.env;

  return {
    collector: {
      port: Number(env.COLLECTOR_PORT ?? 4000),
      endpoint: env.COLLECT_ENDPOINT ?? '/collect',
      internalToken: env.COLLECTOR_API_TOKEN ?? '',
    },
    rabbitmq: {
      url: env.RABBITMQ_URL ?? 'amqp://guest:guest@rabbitmq:5672',
      queue: env.RABBITMQ_QUEUE ?? 'widget_events',
    },
    clickhouse: {
      url: env.CLICKHOUSE_URL ?? 'http://clickhouse:8123',
      user: env.CLICKHOUSE_USER ?? 'default',
      password: env.CLICKHOUSE_PASSWORD ?? '',
      database: env.CLICKHOUSE_DB ?? 'analytics',
      eventsTable: env.CLICKHOUSE_EVENTS_TABLE ?? 'widget_events',
    },
  };
};
