import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Post,
  Req,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import type { Request } from 'express'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { RequestService } from './request.service'
import { CreatePublicRequestDto } from './dto/create-public-request.dto'
import { RequestEntity } from './entities/request.entity'
import { extractRequestOriginHost } from '../common/origin'

@ApiTags('public-requests')
@Controller('public/requests')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PublicRequestController {
  constructor(private readonly requests: RequestService) {}

  @Post()
  @ApiResponse({ status: 201, type: RequestEntity })
  async create(@Body() body: CreatePublicRequestDto, @Req() req: Request): Promise<RequestEntity> {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      ''

    try {
      return await this.requests.createPublic(body, {
        ip,
        userAgent: req.headers['user-agent'],
        originHost: extractRequestOriginHost(req)
      })
    } catch (e) {
      if (e instanceof HttpException) throw e
      throw new InternalServerErrorException('Failed to create request')
    }
  }
}
