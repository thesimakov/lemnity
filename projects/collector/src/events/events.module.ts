import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClickhouseModule } from '../infra/clickhouse.module';
import { InternalTokenGuard } from '../auth/internal-token.guard';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { InternalEventsController } from './internal-events.controller';

@Module({
  imports: [ConfigModule, ClickhouseModule],
  controllers: [EventsController, InternalEventsController],
  providers: [EventsService, InternalTokenGuard],
})
export class EventsModule {}
