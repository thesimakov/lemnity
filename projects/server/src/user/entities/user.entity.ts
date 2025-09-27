import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client"

export type UserPublicType = Prisma.UserGetPayload<{
  select: { id: true; email: true; name: true; role: true; createdAt: true; updatedAt: true }
}>

export class User implements UserPublicType {
    @ApiProperty() id: string
    @ApiProperty({ format: 'email' }) email: string
    @ApiProperty({ nullable: true }) name: string | null
    @ApiProperty({ enum: ['USER', 'ADMIN'] }) role: 'USER' | 'ADMIN'
    @ApiProperty({ type: String, format: 'date-time' }) createdAt: Date
    @ApiProperty({ type: String, format: 'date-time' }) updatedAt: Date
}
