import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { Channel, Connection } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private queue: string;

  constructor(private readonly configService: ConfigService) {
    this.queue = this.configService.get<string>('rabbitmq.queue', 'widget_events');
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  private async connect() {
    const url = this.configService.get<string>('rabbitmq.url');
    if (!url) {
      throw new Error('RABBITMQ_URL is not set');
    }
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });
  }

  async publish(message: unknown) {
    if (!this.channel) {
      await this.connect();
    }
    const payload = Buffer.from(JSON.stringify(message));
    return this.channel!.sendToQueue(this.queue, payload, { persistent: true });
  }

  async consume(onMessage: (msg: Record<string, any>) => Promise<void>) {
    if (!this.channel) {
      await this.connect();
    }
    await this.channel!.consume(this.queue, async (msg) => {
      if (!msg) {
        return;
      }
      try {
        const data = JSON.parse(msg.content.toString());
        await onMessage(data);
        this.channel!.ack(msg);
      } catch (error) {
        this.channel!.nack(msg, false, false);
      }
    });
  }
}
