import { Controller, Get } from '@nestjs/common';
import { RabbitmqService } from '../infra/rabbitmq.service';

@Controller()
export class HealthController {
  constructor(private readonly rabbitmq: RabbitmqService) {}

  @Get('healthz')
  healthz() {
    return { ok: true, rabbitmq: this.rabbitmq.getStatus() };
  }
}

