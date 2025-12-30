import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PublicRequestController } from './public-request.controller'
import { RequestController } from './request.controller'
import { RequestService } from './request.service'

@Module({
  controllers: [RequestController, PublicRequestController],
  providers: [RequestService, PrismaService]
})
export class RequestModule {}
