import { Module } from '@nestjs/common'
import { WidgetService } from './widget.service'
import { WidgetController } from './widget.controller'
import { PrismaService } from '../prisma.service'
import { WidgetConfigModule } from '../config/config.module'

@Module({
  imports: [WidgetConfigModule],
  controllers: [WidgetController],
  providers: [WidgetService, PrismaService]
})
export class WidgetModule {}
