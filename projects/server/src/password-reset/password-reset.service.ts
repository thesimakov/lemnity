import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'
import { MailerService } from '../mailer/mailer.service'
import crypto from 'node:crypto'
import { hash as hashPassword } from 'argon2'

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailerService
  ) {}

  private get ttlMinutes(): number {
    return parseInt(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES ?? '15', 10)
  }

  async request(email: string) {
    const user = await this.userService.getByEmail(email)
    if (!user) return

    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expiresAt = new Date(Date.now() + this.ttlMinutes * 60 * 1000)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, created] = await this.prisma.$transaction([
      this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      this.prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } })
    ])

    try {
      await this.mailService.sendPasswordResetEmail(user.email, rawToken, {
        name: user.name || undefined,
        ttlMinutes: this.ttlMinutes
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      await this.prisma.passwordResetToken.delete({ where: { id: created.id } }).catch(() => {})
      throw new ServiceUnavailableException('Failed to send password reset email')
    }
  }

  async reset(rawToken: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const record = await this.prisma.passwordResetToken.findFirst({ where: { tokenHash } })
    if (!record) throw new BadRequestException('Invalid token')
    if (record.usedAt) throw new BadRequestException('Token already used')
    if (record.expiresAt.getTime() < Date.now()) throw new BadRequestException('Token expired')

    await this.prisma.$transaction([
      this.userService.update({
        where: { id: record.userId },
        data: { password: await hashPassword(newPassword) }
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() }
      })
    ])
  }
}
