import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validateEnv } from './config/validation';
import { ClickhouseModule } from './infra/clickhouse.module';
import { RabbitmqModule } from './infra/rabbitmq.module';
import { EventsModule } from './events/events.module';
import { StatsModule } from './stats/stats.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    RabbitmqModule,
    ClickhouseModule,
    EventsModule,
    StatsModule,
    HealthModule,
  ],
})
export class AppModule {}
