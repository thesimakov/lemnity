import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { MailerService as NestMailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailerService {
  constructor(private readonly mailer: NestMailerService) {}

  async sendPasswordResetEmail(
    to: string,
    rawToken: string,
    opts?: { name?: string; ttlMinutes?: number }
  ) {
    const baseUrl = process.env.FRONTEND_URL
    const resetPath = process.env.PASSWORD_RESET_URL_PATH
    const url = `${baseUrl}${resetPath}?token=${rawToken}`
    const ttlMinutes = opts?.ttlMinutes

    const sendPromise = this.mailer.sendMail({
      to,
      subject: 'Reset your password',
      template: './password-reset',
      context: { name: opts?.name, url, ttlMinutes }
    })

    try {
      return await sendPromise
    } catch (e: any) {
      if (e && (e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED' || e.command === 'CONN')) {
        throw new ServiceUnavailableException('Mail service unavailable')
      }

      throw e
    }
  }
}
