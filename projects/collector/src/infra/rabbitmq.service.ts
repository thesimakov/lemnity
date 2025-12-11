import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: any = null;
  private channel: any = null;
  private queue: string;

  constructor(private readonly configService: ConfigService) {
    this.queue = this.configService.get<string>('rabbitmq.queue', 'widget_events');
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await (this.connection as unknown as { close?: () => Promise<void> })?.close?.().catch(() => undefined);
  }

  private async connect() {
    const url = this.configService.get<string>('rabbitmq.url');
    if (!url) {
      throw new Error('RABBITMQ_URL is not set');
    }
    const connection = await connect(url);
    this.connection = connection;
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });
  }

  private async ensureChannel() {
    if (!this.channel) {
      await this.connect();
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
