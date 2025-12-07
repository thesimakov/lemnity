import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClickhouseModule } from '../infra/clickhouse.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { InternalTokenGuard } from '../auth/internal-token.guard';

@Module({
  imports: [ConfigModule, ClickhouseModule],
  controllers: [StatsController],
  providers: [StatsService, InternalTokenGuard],
})
export class StatsModule {}
