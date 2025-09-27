import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email' })
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token' })
  @IsString()
  token: string

  @ApiProperty({ description: 'New Password' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  @IsString()
  newPassword: string
}
