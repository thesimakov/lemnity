import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CollectorService } from './collector.service'
import { CollectorController } from './collector.controller'
import { PrismaService } from '../prisma.service'

@Module({
  imports: [ConfigModule],
  controllers: [CollectorController],
  providers: [CollectorService, PrismaService],
  exports: [CollectorService]
})
export class CollectorModule {}
