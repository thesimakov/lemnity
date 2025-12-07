import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClickhouseService } from '../infra/clickhouse.service';
import { RabbitmqService } from '../infra/rabbitmq.service';
import { CollectedEvent } from './events.types';

@Injectable()
export class EventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(EventsConsumer.name);
  private buffer: CollectedEvent[] = [];
  private readonly flushIntervalMs = 2000;
  private readonly maxBatchSize = 100;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly rabbit: RabbitmqService,
    private readonly clickhouse: ClickhouseService,
  ) {}

  async onModuleInit() {
    this.startFlushTimer();

    await this.rabbit.consume(async (message) => {
      this.buffer.push(message as CollectedEvent);
      if (this.buffer.length >= this.maxBatchSize) {
        await this.flush();
      }
    });
  }

  private startFlushTimer() {
    if (this.flushTimer) return;
    this.flushTimer = setInterval(async () => {
      try {
        await this.flush();
      } catch (error) {
        this.logger.error('Batch flush failed', error as Error);
      }
    }, this.flushIntervalMs);
  }

  private async flush() {
    if (!this.buffer.length) return;
    const batch = this.buffer;
    this.buffer = [];
    await this.clickhouse.insertEvents(batch);
  }
}
