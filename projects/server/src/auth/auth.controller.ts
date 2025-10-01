import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Body,
  Res,
  Req,
  UnauthorizedException
} from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import { AuthService } from './auth.service'
import type { Response, Request } from 'express'
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset.dto'
import { RegisterDto } from './dto/register.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { LoginResponse } from './entities/responses/login.entity'
import { RegisterResponse } from './entities/responses/register.entity'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  @ApiResponse({ status: 403, description: 'invalid_credentials' })
  @ApiResponse({ status: 200, type: LoginResponse })
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponse> {
    const { refreshToken, ...response } = await this.authService.login(dto)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  @ApiResponse({ status: 200, type: RegisterResponse })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<RegisterResponse> {
    const { refreshToken, ...response } = await this.authService.register(dto)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @HttpCode(200)
  @Post('logout')
  @ApiResponse({ status: 200, type: Boolean })
  async logout(@Res({ passthrough: true }) res: Response): Promise<boolean> {
    this.authService.removeRefreshTokenFromResponse(res)

    return true
  }

  @HttpCode(200)
  @Post('login/refresh')
  @ApiResponse({ status: 200, type: LoginResponse })
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponse> {
    const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME]

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(res)
      throw new UnauthorizedException('Refresh token not found in cookies')
    }

    const { refreshToken, ...response } =
      await this.authService.getNewTokens(refreshTokenFromCookies)

    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('forgot-password')
  @ApiResponse({ status: 200, type: Boolean })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<boolean> {
    await this.authService.issuePasswordReset(dto.email)
    return true
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('reset-password')
  @ApiResponse({ status: 200, type: Boolean })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<boolean> {
    await this.authService.resetPassword(dto.token, dto.newPassword)
    return true
  }
}
