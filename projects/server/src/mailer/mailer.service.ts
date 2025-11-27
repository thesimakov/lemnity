import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { MailerService as NestMailerService } from '@nestjs-modules/mailer'
import { SentMessageInfo } from 'nodemailer'

type MailSendError = { code?: string; command?: string }

const isMailSendError = (value: unknown): value is MailSendError =>
  typeof value === 'object' && value !== null

@Injectable()
export class MailerService {
  constructor(private readonly mailer: NestMailerService) {}

  async sendPasswordResetEmail(
    to: string,
    rawToken: string,
    opts?: { name?: string; ttlMinutes?: number }
  ): Promise<SentMessageInfo> {
    const baseUrl = process.env.FRONTEND_URL
    const resetPath = process.env.PASSWORD_RESET_URL_PATH
    const url = `${baseUrl}${resetPath}?token=${rawToken}`
    const ttlMinutes = opts?.ttlMinutes

    const sendPromise = (await this.mailer.sendMail({
      to,
      subject: 'Reset your password',
      template: './password-reset',
      context: { name: opts?.name, url, ttlMinutes }
    })) as Promise<SentMessageInfo>

    try {
      return sendPromise
    } catch (e: unknown) {
      if (
        isMailSendError(e) &&
        (e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED' || e.command === 'CONN')
      ) {
        throw new ServiceUnavailableException('Mail service unavailable')
      }

      throw e
    }
  }
}
