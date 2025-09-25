import { IsEmail, IsString, MaxLength, MinLength } from "class-validator"

export class RegisterDto {
  @IsString()
  name:string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  password: string
}