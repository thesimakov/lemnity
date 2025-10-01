import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'

export type ProjectPublicType = Prisma.ProjectGetPayload<{
  select: {
    id: true
    title: true
    websiteUrl: true
    createdAt: true
    updatedAt: true
    enabled: true
  }
}>

export class Project implements ProjectPublicType {
  @ApiProperty() id: string
  @ApiProperty() title: string
  @ApiProperty() websiteUrl: string
  @ApiProperty() createdAt: Date
  @ApiProperty() updatedAt: Date
  @ApiProperty() enabled: boolean
}
