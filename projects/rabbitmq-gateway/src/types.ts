import type * as amqp from 'amqplib';

export type PublishBody = {
  message: unknown;
  queue?: string;
  exchange?: string;
  routingKey?: string;
  persistent?: boolean;
  bufferWhenUnavailable?: boolean;
};

export type PendingMsg = { raw: amqp.ConsumeMessage; parsed: unknown; channel: amqp.Channel };

export type SubscriptionCreateBody = {
  queue: string;
  webhookUrl: string;
  exchange?: string;
  routingKey?: string;
  headers?: Record<string, string>;
  batchSize?: number;
  flushIntervalMs?: number;
};

export type SubscriptionPublicInfo = {
  id: string;
  queue: string;
  exchange: string | null;
  routingKey: string;
  webhookUrl: string;
  headerKeys: string[];
  hasCollectorTokenHeader: boolean;
  batchSize: number;
  flushIntervalMs: number;
  pending: number;
  deliveredBatches: number;
  failedBatches: number;
  lastDeliveryError: string | null;
};
