import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class InternalTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers['x-collector-token'];
    const expected = this.config.get<string>('collector.internalToken');
    if (expected && token === expected) {
      return true;
    }
    throw new UnauthorizedException('Invalid internal token');
  }
}
