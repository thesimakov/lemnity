import { ApiProperty } from '@nestjs/swagger'
import { IsIn } from 'class-validator'

const statuses = ['new', 'processed', 'not_processed', 'used'] as const
type Status = (typeof statuses)[number]

export class UpdateRequestDto {
  @ApiProperty({ enum: statuses })
  @IsIn(statuses)
  status: Status
}
