import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { hash } from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getById(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async getPublicByIdOrThrow(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async create(dto: AuthDto) {
    const user: Prisma.UserCreateInput = {
      email: dto.email,
      password: await hash(dto.password)
    }

    return this.prisma.user.create({
      data: user
    })
  }
}
