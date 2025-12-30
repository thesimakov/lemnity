export type GatewayConfig = {
  port: number;
  rabbitUrl: string;
  defaultQueue: string;
  defaultExchange: string | null;
  defaultRoutingKey: string;
  prefetch: number;
  batchSize: number;
  flushIntervalMs: number;
  maxOutboxSize: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): GatewayConfig {
  return {
    port: Number(env.RABBITMQ_GATEWAY_PORT ?? env.PORT ?? 4010),
    rabbitUrl: env.RABBITMQ_URL ?? '',
    defaultQueue: env.RABBITMQ_QUEUE ?? 'default_queue',
    defaultExchange: (env.RABBITMQ_EXCHANGE ?? '').trim() || null,
    defaultRoutingKey: env.RABBITMQ_ROUTING_KEY ?? 'default',
    prefetch: Number(env.RABBITMQ_PREFETCH ?? 200),
    batchSize: Number(env.RABBITMQ_BATCH_SIZE ?? 100),
    flushIntervalMs: Number(env.RABBITMQ_FLUSH_INTERVAL_MS ?? 2000),
    maxOutboxSize: Number(env.RABBITMQ_OUTBOX_MAX ?? 5000),
  };
}
