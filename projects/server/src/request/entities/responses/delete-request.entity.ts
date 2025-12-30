import { ApiProperty } from '@nestjs/swagger'

export class DeleteRequestResponse {
  @ApiProperty()
  id: string
}
