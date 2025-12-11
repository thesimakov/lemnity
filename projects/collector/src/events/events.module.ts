import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClickhouseModule } from '../infra/clickhouse.module';
import { RabbitmqModule } from '../infra/rabbitmq.module';
import { EventsConsumer } from './events.consumer';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [ConfigModule, RabbitmqModule, ClickhouseModule],
  controllers: [EventsController],
  providers: [EventsService, EventsConsumer],
})
export class EventsModule {}
