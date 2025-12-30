import { ApiProperty } from '@nestjs/swagger'
import { RequestEntity } from '../request.entity'

export class RequestsResponse {
  @ApiProperty({ type: [RequestEntity] })
  requests: RequestEntity[]

  @ApiProperty()
  total: number
}
