import 'dotenv/config';
import { loadConfig } from './config';
import { createState, setCriticalError } from './state';
import { createAmqpConnectionManager } from './amqp-connection';
import { createSubscriptionManager } from './consumer';
import { flushOutbox } from './outbox';
import { createHttpServer } from './http-server';

const config = loadConfig();
const state = createState();

const onError = (err: unknown) => setCriticalError(state, err);

const subscriptions = createSubscriptionManager({
  config: {
    batchSize: config.batchSize,
    flushIntervalMs: config.flushIntervalMs,
  },
  state,
  getChannel: () => state.channel,
  onError,
});

const amqpManager = createAmqpConnectionManager({
  config: {
    rabbitUrl: config.rabbitUrl,
    prefetch: config.prefetch,
  },
  state,
  onError,
  onConnected: async () => {
    await flushOutbox(
      { defaultQueue: config.defaultQueue, defaultRoutingKey: config.defaultRoutingKey },
      state,
      {
        onError,
        onSendError: async () => {
          await amqpManager.safeClose();
          void amqpManager.scheduleReconnect();
        },
      },
    );
    await subscriptions.startAll();
  },
});

const server = createHttpServer({
  config: {
    defaultQueue: config.defaultQueue,
    defaultRoutingKey: config.defaultRoutingKey,
    maxOutboxSize: config.maxOutboxSize,
  },
  state,
  tryConnect: amqpManager.tryConnect,
  safeClose: amqpManager.safeClose,
  scheduleReconnect: amqpManager.scheduleReconnect,
  onError,
  subscriptions: {
    create: async (body) => {
      const created = await subscriptions.create(body);
      return { id: created.id };
    },
    remove: subscriptions.remove,
  },
});

process.on('SIGTERM', async () => {
  await amqpManager.safeClose();
  server.close(() => process.exit(0));
});

process.on('SIGINT', async () => {
  await amqpManager.safeClose();
  server.close(() => process.exit(0));
});

void amqpManager.tryConnect();
server.listen(config.port, '0.0.0.0');
