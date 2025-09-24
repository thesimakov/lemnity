import { Controller, Post, Body, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common'
import { ForgotPasswordDto, ResetPasswordDto } from '../auth/dto/reset.dto'
import { PasswordResetService } from './password-reset.service'

@Controller('auth')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.passwordResetService.request(dto.email)
    return true
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.passwordResetService.reset(dto.token, dto.newPassword)
    return true
  }
}
