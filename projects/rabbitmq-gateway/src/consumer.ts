import { randomUUID } from 'node:crypto';
import type * as amqp from 'amqplib';
import type { GatewayConfig } from './config';
import type { GatewayState } from './state';
import type { SubscriptionCreateBody } from './types';

export function createSubscriptionManager(opts: {
  config: Pick<GatewayConfig, 'batchSize' | 'flushIntervalMs'>;
  state: Pick<GatewayState, 'subscriptions' | 'channelEpoch'>;
  getChannel: () => amqp.Channel | null;
  onError: (err: unknown) => void;
}) {
  const { config, state, getChannel, onError } = opts;

  function listIds() {
    return Object.keys(state.subscriptions);
  }

  async function ensureTopology(ch: amqp.Channel, s: { queue: string; exchange: string | null; routingKey: string }) {
    await ch.assertQueue(s.queue, { durable: true });
    if (s.exchange) {
      await ch.assertExchange(s.exchange, 'topic', { durable: true });
      await ch.bindQueue(s.queue, s.exchange, s.routingKey);
    }
  }

  async function deliverBatch(subscriptionId: string) {
    const s = state.subscriptions[subscriptionId];
    if (!s) return;
    if (s.flushing) return;
    if (!s.pending.length) return;

    s.flushing = true;
    const batch = s.pending.splice(0, s.pending.length);
    const messages = batch.map((x) => x.parsed);

    try {
      const res = await fetch(s.webhookUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...s.headers,
        },
        body: JSON.stringify({
          subscriptionId: s.id,
          queue: s.queue,
          exchange: s.exchange,
          routingKey: s.routingKey,
          messages,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Webhook failed (${res.status}): ${text || res.statusText}`);
      }

      for (const msg of batch) {
        try {
          msg.channel.ack(msg.raw);
        } catch (err) {
          onError(err);
        }
      }
      s.deliveredBatches += 1;
      s.lastDeliveryError = null;
    } catch (err) {
      s.failedBatches += 1;
      s.lastDeliveryError = err instanceof Error ? err.message : String(err);
      onError(err);
      for (const msg of batch) {
        try {
          msg.channel.nack(msg.raw, false, true);
        } catch (nackErr) {
          onError(nackErr);
        }
      }
    } finally {
      s.flushing = false;
    }
  }

  function startFlushTimer(subscriptionId: string) {
    const s = state.subscriptions[subscriptionId];
    if (!s) return;
    if (s.flushTimer) return;
    s.flushTimer = setInterval(() => {
      void deliverBatch(subscriptionId);
    }, s.flushIntervalMs);
  }

  async function startConsumer(subscriptionId: string) {
    const ch = getChannel();
    if (!ch) return;

    const s = state.subscriptions[subscriptionId];
    if (!s) return;

    if (s.consumerChannelEpoch !== null && s.consumerChannelEpoch === state.channelEpoch && s.consumerTag) {
      return;
    }

    s.consumerTag = null;
    s.consumerChannelEpoch = state.channelEpoch;

    await ensureTopology(ch, { queue: s.queue, exchange: s.exchange, routingKey: s.routingKey });
    startFlushTimer(subscriptionId);

    const res = await ch.consume(s.queue, async (msg) => {
      if (!msg) return;
      try {
        const parsed = JSON.parse(msg.content.toString()) as unknown;
        s.pending.push({ raw: msg, parsed, channel: ch });
        if (s.pending.length >= s.batchSize) {
          await deliverBatch(subscriptionId);
        }
      } catch (err) {
        onError(err);
        ch.nack(msg, false, false);
      }
    });

    s.consumerTag = res.consumerTag;
  }

  async function startAll() {
    const ids = listIds();
    for (const id of ids) {
      await startConsumer(id);
    }
  }

  async function create(body: SubscriptionCreateBody) {
    const queue = (body.queue ?? '').trim();
    const webhookUrl = (body.webhookUrl ?? '').trim();
    if (!queue) throw new Error('queue is required');
    if (!webhookUrl) throw new Error('webhookUrl is required');

    const id = randomUUID();
    const exchange = (body.exchange ?? '').trim() || null;
    const routingKey = (body.routingKey ?? '').trim() || '';
    const batchSize = Number(body.batchSize ?? config.batchSize);
    const flushIntervalMs = Number(body.flushIntervalMs ?? config.flushIntervalMs);

    state.subscriptions[id] = {
      id,
      queue,
      exchange,
      routingKey,
      webhookUrl,
      headers: body.headers ?? {},
      batchSize,
      flushIntervalMs,
      consumerTag: null,
      consumerChannelEpoch: null,
      pending: [],
      flushTimer: null,
      flushing: false,
      deliveredBatches: 0,
      failedBatches: 0,
      lastDeliveryError: null,
    };

    await startConsumer(id);
    return state.subscriptions[id];
  }

  async function remove(id: string) {
    const s = state.subscriptions[id];
    if (!s) return false;

    if (s.flushTimer) clearInterval(s.flushTimer);
    s.flushTimer = null;

    const ch = getChannel();
    if (ch && s.consumerTag) {
      await ch.cancel(s.consumerTag).catch(() => undefined);
    }
    s.consumerTag = null;
    s.consumerChannelEpoch = null;

    for (const msg of s.pending.splice(0, s.pending.length)) {
      try {
        msg.channel.nack(msg.raw, false, true);
      } catch {
        // ignore
      }
    }

    delete state.subscriptions[id];
    return true;
  }

  return {
    create,
    remove,
    startAll,
    deliverBatch,
  };
}
