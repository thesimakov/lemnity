import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'
import crypto from 'node:crypto'
import { hash as hashPassword } from 'argon2'
import { NotisendService } from 'src/mailer/notisend.service'

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private notisendService: NotisendService,
    private readonly logger: Logger,
  ) {}

  private get ttlMinutes(): number {
    return parseInt(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES ?? '15', 10)
  }

  private async sendPasswordResetEmail(email: string, token: string) {
    const baseUrl = process.env.FRONTEND_URL
    const resetPath = process.env.PASSWORD_RESET_URL_PATH
    const url = `${baseUrl}${resetPath}?token=${token}`

    await this.notisendService.sendEmailWithTemplate(
      email,
      '1645034', // ID шаблона notisend
      {
        passwordResetUrl: url,
        ttlMinutes: Math.trunc(this.ttlMinutes).toString(),
      }
    )

    this.logger.log(`Password reset email sent to ${email} with URL: ${url}`)
  }

  async request(email: string) {
    const user = await this.userService.getByEmail(email)
    if (!user) return

    const rawToken = crypto
      .randomBytes(32)
      .toString('hex')
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex')
    const expiresAt = new Date(Date.now() + this.ttlMinutes * 60 * 1000)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, created] = await this.prisma.$transaction([
      this.prisma.passwordResetToken.deleteMany({
        where: { userId: user.id }
      }),
      this.prisma.passwordResetToken.create({
        data: { userId: user.id, tokenHash, expiresAt }
      })
    ])

    try {
      await this.sendPasswordResetEmail(user.email, rawToken)
    }
    catch (e) {
      await this.prisma.passwordResetToken
        .delete({ where: { id: created.id } })
        .catch(() => {})

      this.logger.error(
        `Failed to send password reset email to ${email}:\n ${e}`
      )

      throw new ServiceUnavailableException(
        'Failed to send password reset email'
      )
    }
  }

  async reset(rawToken: string, newPassword: string) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex')
    const record = await this.prisma.passwordResetToken.findFirst({
      where: { tokenHash }
    })

    if (!record)
      throw new BadRequestException('Invalid token')
    if (record.usedAt)
      throw new BadRequestException('Token already used')
    if (record.expiresAt.getTime() < Date.now())
      throw new BadRequestException('Token expired')

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
