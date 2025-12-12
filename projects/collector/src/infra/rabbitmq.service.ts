/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: any = null;
  private channel: any = null;
  private queue: string;

  constructor(private readonly configService: ConfigService) {
    this.queue = this.configService.get<string>('rabbitmq.queue', 'widget_events');
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    const conn = this.connection as unknown as { close?: () => Promise<void> } | null;
    await conn?.close?.().catch(() => undefined);
  }

  private async connectWithRetry() {
    const url = this.configService.get<string>('rabbitmq.url');
    if (!url) {
      throw new Error('RABBITMQ_URL is not set');
    }

    const maxAttempts = 10;
    const baseDelayMs = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const connection = await amqp.connect(url);
        this.connection = connection;
        this.channel = await connection.createChannel();
        await this.channel.assertQueue(this.queue, { durable: true });
        return;
      } catch (err) {
        const isLast = attempt === maxAttempts;
        if (isLast) {
          throw err;
        }
        // Простой backoff: растём до 10s
        const delay = Math.min(baseDelayMs * attempt, 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  private async ensureChannel(): Promise<amqp.Channel> {
    if (!this.channel) {
      await this.connectWithRetry();
    }
    if (!this.channel) {
      throw new Error('Failed to establish RabbitMQ channel');
    }
    return this.channel;
  }

  async publish(message: unknown) {
    const channel = await this.ensureChannel();
    const payload = Buffer.from(JSON.stringify(message));
    return channel.sendToQueue(this.queue, payload, { persistent: true });
  }

  async consume(onMessage: (msg: Record<string, unknown>) => Promise<void>) {
    const channel = await this.ensureChannel();
    await channel.consume(this.queue, async (msg) => {
      if (!msg) {
        return;
      }
      try {
        const data = JSON.parse(msg.content.toString());
        await onMessage(data);
        channel.ack(msg);
      } catch {
        channel.nack(msg, false, false);
      }
    });
  }
}
