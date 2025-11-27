import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ description: 'Name' })
  @IsString()
  name: string

  @ApiProperty({ description: 'Email' })
  @IsEmail()
  email: string

  @ApiProperty({ description: 'Password' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  password: string

  @ApiProperty({
    description: 'Phone number containing only digits (10-15 characters)'
  })
  @IsString()
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  @MinLength(10, { message: 'Phone number must contain at least 10 digits' })
  @MaxLength(15, { message: 'Phone number must contain at most 15 digits' })
  phone: string
}
