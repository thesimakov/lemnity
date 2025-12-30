import type * as amqp from 'amqplib';
import type { PendingMsg, PublishBody, SubscriptionPublicInfo } from './types';

export type SubscriptionState = {
  id: string;
  queue: string;
  exchange: string | null;
  routingKey: string;
  webhookUrl: string;
  headers: Record<string, string>;
  batchSize: number;
  flushIntervalMs: number;
  consumerTag: string | null;
  consumerChannelEpoch: number | null;
  pending: PendingMsg[];
  flushTimer: NodeJS.Timeout | null;
  flushing: boolean;
  deliveredBatches: number;
  failedBatches: number;
  lastDeliveryError: string | null;
};

export type GatewayState = {
  connection: amqp.ChannelModel | null;
  channel: amqp.Channel | null;
  channelEpoch: number;
  lastError: string | null;
  connecting: Promise<void> | null;
  reconnecting: boolean;
  outbox: PublishBody[];
  outboxDropped: number;
  subscriptions: Record<string, SubscriptionState>;
};

export function createState(): GatewayState {
  return {
    connection: null,
    channel: null,
    channelEpoch: 0,
    lastError: null,
    connecting: null,
    reconnecting: false,
    outbox: [],
    outboxDropped: 0,
    subscriptions: {},
  };
}

export function setCriticalError(state: GatewayState, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  state.lastError = msg;
  process.stderr.write(`${msg}\n`);
}

export function toSubscriptionPublicInfo(s: SubscriptionState): SubscriptionPublicInfo {
  return {
    id: s.id,
    queue: s.queue,
    exchange: s.exchange,
    routingKey: s.routingKey,
    webhookUrl: s.webhookUrl,
    batchSize: s.batchSize,
    flushIntervalMs: s.flushIntervalMs,
    pending: s.pending.length,
    deliveredBatches: s.deliveredBatches,
    failedBatches: s.failedBatches,
    lastDeliveryError: s.lastDeliveryError,
  };
}
