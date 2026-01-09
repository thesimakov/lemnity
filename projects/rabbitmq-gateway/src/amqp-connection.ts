import { setTimeout as delay } from 'node:timers/promises';
import * as amqp from 'amqplib';
import type { GatewayConfig } from './config';
import type { GatewayState } from './state';

export function createAmqpConnectionManager(opts: {
  config: Pick<GatewayConfig, 'rabbitUrl' | 'prefetch'>;
  state: Pick<GatewayState, 'connection' | 'channel' | 'channelEpoch' | 'lastError' | 'connecting' | 'reconnecting'>;
  onError: (err: unknown) => void;
  onConnected: () => Promise<void>;
}) {
  const { config, state, onError, onConnected } = opts;

  async function safeClose() {
    const ch = state.channel;
    const conn = state.connection;
    state.channel = null;
    state.connection = null;
    await ch?.close().catch(() => undefined);
    await conn?.close().catch(() => undefined);
  }

  async function connectOnce() {
    if (!config.rabbitUrl) {
      state.lastError = 'RABBITMQ_URL is not configured';
      return;
    }

    try {
      const conn = await amqp.connect(config.rabbitUrl);
      const ch = await conn.createConfirmChannel();

      conn.on('error', (err) => onError(err));
      conn.on('close', () => {
        state.connection = null;
        state.channel = null;
        void scheduleReconnect();
      });

      await ch.prefetch(config.prefetch);

      state.connection = conn;
      state.channel = ch;
      state.channelEpoch += 1;
      state.lastError = null;

      await onConnected();
    } catch (err) {
      onError(err);
      await safeClose();
      void scheduleReconnect();
    }
  }

  async function tryConnect() {
    if (state.channel && state.connection) return;
    if (state.connecting) {
      await state.connecting;
      return;
    }
    state.connecting = connectOnce().finally(() => {
      state.connecting = null;
    });
    await state.connecting;
  }

  async function scheduleReconnect() {
    if (state.reconnecting) return;
    state.reconnecting = true;
    while (!state.channel) {
      await delay(2000);
      await tryConnect();
    }
    state.reconnecting = false;
  }

  return { tryConnect, safeClose, scheduleReconnect };
}
