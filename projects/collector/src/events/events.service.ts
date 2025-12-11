import { Injectable } from '@nestjs/common';
import { RabbitmqService } from '../infra/rabbitmq.service';
import { CollectedEvent } from './events.types';

@Injectable()
export class EventsService {
  constructor(private readonly rabbit: RabbitmqService) {}

  async enqueueEvent(event: CollectedEvent) {
    await this.rabbit.publish({
      ...event,
      event_time: event.event_time ?? new Date(),
    });
  }
}
