import type * as amqp from 'amqplib';
import type { GatewayConfig } from './config';
import type { GatewayState } from './state';
import type { PublishBody } from './types';

export async function sendToRabbit(
  config: Pick<GatewayConfig, 'defaultQueue' | 'defaultRoutingKey'>,
  ch: amqp.Channel,
  body: PublishBody,
) {
  const payload = Buffer.from(JSON.stringify(body.message));
  const persistent = body.persistent ?? true;
  const exchange = (body.exchange ?? '').trim();
  const queue = (body.queue ?? '').trim() || config.defaultQueue;
  const routingKey = (body.routingKey ?? '').trim() || config.defaultRoutingKey;

  if (exchange) {
    await ch.assertExchange(exchange, 'topic', { durable: true });
    return ch.publish(exchange, routingKey, payload, { persistent });
  }
  await ch.assertQueue(queue, { durable: true });
  return ch.sendToQueue(queue, payload, { persistent });
}

export function bufferPublish(
  config: Pick<GatewayConfig, 'maxOutboxSize'>,
  state: Pick<GatewayState, 'outbox' | 'outboxDropped'>,
  body: PublishBody,
) {
  if (state.outbox.length >= config.maxOutboxSize) {
    state.outboxDropped += 1;
    return false;
  }
  state.outbox.push(body);
  return true;
}

export async function flushOutbox(
  config: Pick<GatewayConfig, 'defaultQueue' | 'defaultRoutingKey'>,
  state: Pick<GatewayState, 'channel' | 'outbox'>,
  opts: { onError: (err: unknown) => void; onSendError: () => Promise<void> },
) {
  const ch = state.channel;
  if (!ch) return;
  if (!state.outbox.length) return;

  const items = state.outbox.splice(0, state.outbox.length);
  for (let i = 0; i < items.length; i += 1) {
    try {
      await sendToRabbit(config, ch, items[i]);
    } catch (err) {
      opts.onError(err);
      state.outbox.unshift(...items.slice(i));
      await opts.onSendError();
      return;
    }
  }
}
