import { Module } from '@nestjs/common'
import { PasswordResetService } from './password-reset.service'
import { PrismaService } from '../prisma.service'
import { UserModule } from '../user/user.module'
import { MailerModule } from '../mailer/mailer.module'

@Module({
  imports: [UserModule, MailerModule],
  providers: [PasswordResetService, PrismaService],
  exports: [PasswordResetService]
})
export class PasswordResetModule {}
