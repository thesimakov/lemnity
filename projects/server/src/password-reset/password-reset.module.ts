import { Module, Logger } from '@nestjs/common'
import { PasswordResetService } from './password-reset.service'
import { PrismaService } from '../prisma.service'
import { UserModule } from '../user/user.module'
import { NotisendService } from 'src/mailer/notisend.service'

@Module({
  imports: [UserModule],
  providers: [PasswordResetService, PrismaService, NotisendService, Logger],
  exports: [PasswordResetService]
})
export class PasswordResetModule {}
