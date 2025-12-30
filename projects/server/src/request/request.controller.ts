import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { ListRequestsDto } from './dto/list-requests.dto'
import { UpdateRequestDto } from './dto/update-request.dto'
import { DeleteRequestResponse } from './entities/responses/delete-request.entity'
import { RequestsResponse } from './entities/responses/requests.entity'
import { RequestEntity } from './entities/request.entity'
import { RequestService } from './request.service'

@ApiTags('requests')
@Controller('requests')
@Auth()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class RequestController {
  constructor(private readonly requests: RequestService) {}

  @Get()
  @ApiResponse({ status: 200, type: RequestsResponse })
  findAll(
    @CurrentUser('id') userId: string,
    @Query() query: ListRequestsDto
  ): Promise<RequestsResponse> {
    return this.requests.list(userId, query)
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: RequestEntity })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRequestDto
  ): Promise<RequestEntity> {
    return this.requests.update(userId, id, dto)
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: DeleteRequestResponse })
  remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<DeleteRequestResponse> {
    return this.requests.remove(userId, id)
  }
}
