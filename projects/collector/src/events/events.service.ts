import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitmqService } from '../infra/rabbitmq.service';
import { ClickhouseService } from '../infra/clickhouse.service';
import { CollectedEvent } from './events.types';

@Injectable()
export class EventsService {
  private readonly fallback: string;

  constructor(
    private readonly rabbit: RabbitmqService,
    private readonly clickhouse: ClickhouseService,
    private readonly config: ConfigService,
  ) {
    this.fallback = (this.config.get<string>('collector.rabbitmqFallback') ?? 'clickhouse').trim();
  }

  async enqueueEvent(event: CollectedEvent) {
    const normalizedEvent: CollectedEvent = {
      ...event,
      event_time: event.event_time ?? new Date(),
    };

    const publish = await this.rabbit.publish(normalizedEvent, {
      bufferWhenUnavailable: this.fallback !== 'clickhouse',
    });

    if (!publish.ok && this.fallback === 'clickhouse') {
      const inserted = await this.clickhouse.insertEvents([normalizedEvent]);
      return { publish, fallback: { used: true, inserted } };
    }
    return { publish, fallback: { used: false, inserted: 0 } };
  }
}
