import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class NotisendService {
  private readonly logger = new Logger(NotisendService.name);

  // Базовый URL API Notisend
  private readonly apiUrl = 'https://api.notisend.ru/v1/email/templates';

  // Ключ API берётся из переменных окружения
  private readonly apiKey = process.env.NOTISEND_API_KEY;

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
          to: to, // Notisend ожидает массив email-адресов
          // payment: "credit",
          params: context, // переменные для шаблона
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Письмо отправлено на ${to}. ID шаблона: ${templateId}`);
      console.log(response)
      return response;
    } catch (error) {
      this.logger.error(
        `Ошибка при отправке письма на ${to}: ${error}`
      );

      // Неожиданная ошибка (сеть, тайм-аут и т.п.)
      throw new HttpException(
        {
          message: 'Не удалось отправить письмо',
          // details: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
