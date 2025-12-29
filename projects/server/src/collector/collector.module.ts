import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CollectorService } from './collector.service'
import { CollectorController } from './collector.controller'

@Module({
  imports: [ConfigModule],
  controllers: [CollectorController],
  providers: [CollectorService],
  exports: [CollectorService]
})
export class CollectorModule {}
