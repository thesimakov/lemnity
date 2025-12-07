import { Module } from '@nestjs/common'
import { StatsController } from './stats.controller'
import { StatsService } from './stats.service'
import { CollectorModule } from '../collector/collector.module'
import { PrismaService } from '../prisma.service'

@Module({
  imports: [CollectorModule],
  controllers: [StatsController],
  providers: [StatsService, PrismaService]
})
export class StatsModule {}
