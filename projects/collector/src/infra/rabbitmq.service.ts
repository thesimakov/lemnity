import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setTimeout as delay } from 'node:timers/promises';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private readonly gatewayUrl: string;
  private readonly queue: string;
  private readonly exchange: string;
  private readonly routingKey: string;
  private readonly internalEventsUrl: string;
  private readonly internalToken: string;
  private readonly subscriptionBatchSize: number;
  private readonly subscriptionFlushIntervalMs: number;
  private stopped = false;
  private lastError: string | null = null;
  private lastStatus: { connected: boolean } | null = null;

  constructor(private readonly configService: ConfigService) {
    this.queue = this.configService.get<string>('rabbitmq.queue', 'widget_events');
    this.exchange = (this.configService.get<string>('rabbitmq.exchange') ?? '').trim();
    this.routingKey = this.configService.get<string>('rabbitmq.routingKey') ?? 'collector.widget_events';
    this.internalEventsUrl =
      (this.configService.get<string>('collector.internalEventsUrl') ?? '').trim() ||
      'http://collector:4000/internal/events/collect';
    this.internalToken = (this.configService.get<string>('collector.internalToken') ?? '').trim();
    this.subscriptionBatchSize = Number(this.configService.get<number>('collector.gatewaySubscription.batchSize') ?? 100);
    this.subscriptionFlushIntervalMs = Number(
      this.configService.get<number>('collector.gatewaySubscription.flushIntervalMs') ?? 2000,
    );
    this.gatewayUrl =
      (this.configService.get<string>('rabbitmqGateway.url') ?? '').trim() || 'http://rabbitmq_gateway:4010';
  }

  async onModuleInit() {
    await this.refreshStatus();
    void this.ensureGatewaySubscription();
  }

  async onModuleDestroy() {
    this.stopped = true;
  }

  isConnected() {
    return this.lastStatus?.connected ?? false;
  }

  getStatus() {
    return {
      connected: this.isConnected(),
      lastError: this.lastError,
    };
  }

  async publish(
    message: unknown,
    opts?: { bufferWhenUnavailable?: boolean },
  ): Promise<{ ok: boolean; status: number; error: string | null }> {
    try {
      const res = await fetch(`${this.gatewayUrl}/publish`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message,
          queue: this.queue,
          exchange: this.exchange,
          routingKey: this.routingKey,
          bufferWhenUnavailable: opts?.bufferWhenUnavailable ?? false,
        }),
      });

      const ok = res.status >= 200 && res.status < 300;
      const error = ok ? null : `Gateway publish failed (${res.status})`;
      if (error) this.lastError = error;

      console.log(
        `2. collector(/publish to rabbitmq-gateway): ${JSON.stringify({
          ok,
          status: res.status,
          queue: this.queue,
          exchange: this.exchange || null,
          routingKey: this.routingKey,
        })}`,
      );

      await this.refreshStatus();
      return { ok, status: res.status, error };
    } catch (err) {
      this.handleCriticalError(err);
      return { ok: false, status: 0, error: this.lastError };
    }
  }

  async consume(onMessage: (msg: Record<string, unknown>) => Promise<void>) {
    void onMessage;
    this.lastError = 'consume is not supported via gateway client';
  }

  private async ensureGatewaySubscription() {
    let attempt = 0;
    while (!this.stopped) {
      attempt += 1;
      try {
        const ok = await this.ensureGatewaySubscriptionOnce();
        if (ok) {
          attempt = 0;
          await delay(5_000);
          continue;
        }
      } catch (err) {
        this.handleCriticalError(err);
      }

      const backoffMs = Math.min(10_000, 500 * 2 ** Math.min(attempt, 6));
      await delay(backoffMs);
    }
  }

  private async ensureGatewaySubscriptionOnce(): Promise<boolean> {
    const listRes = await fetch(`${this.gatewayUrl}/subscriptions`);
    if (!listRes.ok) {
      throw new Error(`Gateway subscriptions list failed (${listRes.status})`);
    }
    const list = (await listRes.json()) as {
      ok?: boolean;
      subscriptions?: Array<{
        id: string;
        queue: string;
        exchange: string | null;
        routingKey: string;
        webhookUrl: string;
      }>;
    };

    const desiredExchange = this.exchange.trim() || null;
    const exists = (list.subscriptions ?? []).some(
      (s) =>
        s.queue === this.queue &&
        s.exchange === desiredExchange &&
        s.routingKey === this.routingKey &&
        s.webhookUrl === this.internalEventsUrl,
    );
    if (exists) return true;

    const createRes = await fetch(`${this.gatewayUrl}/subscriptions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        queue: this.queue,
        exchange: desiredExchange ?? undefined,
        routingKey: this.routingKey,
        webhookUrl: this.internalEventsUrl,
        headers: this.internalToken ? { 'x-collector-token': this.internalToken } : {},
        batchSize: this.subscriptionBatchSize,
        flushIntervalMs: this.subscriptionFlushIntervalMs,
      }),
    });

    if (!createRes.ok) {
      const text = await createRes.text().catch(() => '');
      throw new Error(`Gateway subscription create failed (${createRes.status}): ${text || createRes.statusText}`);
    }

    this.lastError = null;
    await this.refreshStatus();
    return true;
  }

  private async refreshStatus() {
    try {
      const res = await fetch(`${this.gatewayUrl}/healthz`);
      if (!res.ok) {
        this.lastStatus = { connected: false };
        this.lastError = `Gateway health failed (${res.status})`;
        return;
      }
      const data = (await res.json()) as { rabbitmq?: { connected?: boolean }; lastError?: string };
      this.lastStatus = { connected: Boolean(data?.rabbitmq?.connected) };
      this.lastError = data?.lastError ?? null;
    } catch (err) {
      this.handleCriticalError(err);
      this.lastStatus = { connected: false };
    }
  }

  private handleCriticalError(err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    this.lastError = message;
    this.logger.error(message);
  }
}
