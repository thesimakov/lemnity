import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { hash } from 'argon2'
import { Prisma } from '@lemnity/database'
import { RegisterDto } from 'src/auth/dto/register.dto'

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
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async create(dto: RegisterDto) {
    const user: Prisma.UserCreateInput = {
      name: dto.name,
      email: dto.email,
      password: await hash(dto.password),
      phone: dto.phone
    }

    return this.prisma.user.create({
      data: user
    })
  }

  update(args: Prisma.UserUpdateArgs) {
    return this.prisma.user.update(args)
  }
}
