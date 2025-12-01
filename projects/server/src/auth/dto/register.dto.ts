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
    description:
      'Phone number starting with + followed by digits (12-16 characters: + and 11-15 digits)'
  })
  @IsString()
  @Matches(/^\+\d{11,}$/, {
    message: 'Phone number must start with + followed by at least 11 digits'
  })
  @MinLength(12, { message: 'Phone number must contain at least 12 characters (+ and 11 digits)' })
  @MaxLength(16, { message: 'Phone number must contain at most 16 characters (+ and 15 digits)' })
  phone: string
}
