import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CollectorService } from './collector.service'

@Module({
  imports: [ConfigModule],
  providers: [CollectorService],
  exports: [CollectorService]
})
export class CollectorModule {}
