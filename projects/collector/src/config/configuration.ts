export default () => {
  const env = process.env;

  const rabbitmqHost = env.RABBITMQ_HOST ?? 'rabbitmq';
  const rabbitmqPort = Number(env.RABBITMQ_PORT ?? 5672);
  const rabbitmqUser = env.RABBITMQ_USER ?? 'guest';
  const rabbitmqPassword = env.RABBITMQ_PASSWORD ?? 'guest';
  const rabbitmqUrl =
    env.RABBITMQ_URL ??
    `amqp://${encodeURIComponent(rabbitmqUser)}:${encodeURIComponent(rabbitmqPassword)}@${rabbitmqHost}:${rabbitmqPort}`;

  return {
    collector: {
      port: Number(env.COLLECTOR_PORT ?? 4000),
      endpoint: env.COLLECT_ENDPOINT ?? '/collect',
      internalToken: env.COLLECTOR_API_TOKEN ?? '',
      rabbitmqFallback: env.COLLECTOR_RABBITMQ_FALLBACK ?? 'clickhouse',
      internalEventsUrl:
        env.COLLECTOR_INTERNAL_EVENTS_URL ??
        `http://collector:${Number(env.COLLECTOR_PORT ?? 4000)}/internal/events/collect`,
      gatewaySubscription: {
        batchSize: Number(env.COLLECTOR_GATEWAY_SUB_BATCH_SIZE ?? 100),
        flushIntervalMs: Number(env.COLLECTOR_GATEWAY_SUB_FLUSH_INTERVAL_MS ?? 2000),
      },
    },
    rabbitmqGateway: {
      url: env.RABBITMQ_GATEWAY_URL ?? 'http://rabbitmq_gateway:4010',
    },
    rabbitmq: {
      host: rabbitmqHost,
      port: rabbitmqPort,
      user: rabbitmqUser,
      password: rabbitmqPassword,
      url: rabbitmqUrl,
      queue: env.RABBITMQ_QUEUE ?? 'widget_events',
      exchange: env.RABBITMQ_EXCHANGE ?? '',
      routingKey: env.RABBITMQ_ROUTING_KEY ?? 'collector.widget_events',
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
