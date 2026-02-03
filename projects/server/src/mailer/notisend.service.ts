import { Injectable, Logger } from '@nestjs/common'
import axios, { AxiosResponse } from 'axios'
import { HttpException, HttpStatus } from '@nestjs/common'

@Injectable()
export class NotisendService {
  private readonly logger = new Logger(NotisendService.name)
  private readonly apiUrl = 'https://api.notisend.ru/v1/email/templates'
  private readonly apiKey = process.env.NOTISEND_API_KEY

  constructor() {
    if (!this.apiKey) {
      this.logger.error('NOTISEND_API_KEY не задан в переменных окружения!');
    }
  }

  /**
   * Отправляет письмо с использованием шаблона Notisend
   * @param to - Email получателя
   * @param templateId - ID шаблона в Notisend (число или строка)
   * @param context - Переменные для подстановки в шаблон
   */
  async sendEmailWithTemplate(
    to: string,
    templateId: string | number,
    context?: Record<string, any>,
  ): Promise<AxiosResponse> {
    console.log(this.apiKey)
    try {
      const response = await axios.post(
        `${this.apiUrl}/${templateId}/messages`,
        {
          to: to,
          // payment: "credit",
          params: context,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      )

      this.logger.log(`Письмо отправлено на ${to}. ID шаблона: ${templateId}`);
      console.log(response)
      return response
    }
    catch (error) {
      this.logger.error(
        `Ошибка при отправке письма на ${to}: ${error}`
      )

      throw new HttpException(
        { message: 'Не удалось отправить письмо' },
        HttpStatus.SERVICE_UNAVAILABLE,
      )
    }
  }
}
