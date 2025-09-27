import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator"

export class RegisterDto {
  @ApiProperty({ description: 'Name' })
  @IsString()
  name:string

  @ApiProperty({ description: 'Email' })
  @IsEmail()
  email: string

  @ApiProperty({ description: 'Password' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  password: string
}