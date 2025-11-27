import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt, type StrategyOptionsWithoutRequest } from 'passport-jwt'
import { UserService } from '../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService
  ) {
    const secretOrKey = configService.get<string>('JWT_SECRET')
    if (!secretOrKey) {
      throw new Error('JWT_SECRET must be configured')
    }

    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey
    }

    super(options)
  }

  validate({ id }: { id: string }) {
    return this.userService.getById(id)
  }
}
