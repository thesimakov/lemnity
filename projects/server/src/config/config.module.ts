import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ConfigService } from './config.service'

@Module({
  providers: [ConfigService, PrismaService],
  exports: [ConfigService]
})
export class WidgetConfigModule {}


