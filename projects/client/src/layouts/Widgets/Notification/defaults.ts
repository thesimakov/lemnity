import type {
  DisplaySettings,
  FieldsSettings,
  IntegrationSettings,
} from '@/stores/widgetSettings/types'
import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type {
  NotificationWidgetType,
} from '@lemnity/widget-config/widgets/notification'

import { uuidv4 } from '@/common/utils/uuidv4'


export const notificationWidgetDefaults: NotificationWidgetType = {
  type: WidgetTypeEnum.NOTIFICATION,

  triggerText: '',
  triggerBackgroundColor: '#5951E5',
  triggerTextColor: '#FFFFFF',
  triggerIcon: 'Sparkles',

  delay: 30000,

  notifications: [
    {
      id: uuidv4(),
      expiration: '24',
      text: 'Вам доступен сервис «Подбор персонала». Бесплатно размещайте вакансии и получайте отклики в приложение',
      url: 'https://google.ru',
      urlFontSize: 16,
      urlText: 'Подробнее >',
    },
    {
      id: uuidv4(),
      expiration: '24',
      text: 'Внимание! у нас скоро будет распродажа 11.11. Скидки до 90%. Вам нужно заполнить анкету чтобы не пропустить начало акции',
      url: 'https://google.ru',
      urlFontSize: 16,
      urlText: 'Перейти к анкете >',
    },
    {
      id: uuidv4(),
      expiration: '24',
      text: 'Внимание! у нас скоро будет распродажа 11.11. Скидки до 90%',
      url: 'https://google.ru',
      urlFontSize: 16,
      urlText: 'Подробнее >',
    },
  ],

  brandingEnabled: true,
}

export const buildNotificationWidgetSettings = (): NotificationWidgetType =>
  notificationWidgetDefaults

export const buildNotificationFieldsSettings = (): FieldsSettings =>
  ({}) as FieldsSettings
export const buildNotificationDisplaySettings = (): DisplaySettings =>
  ({}) as DisplaySettings
export const buildNotificationIntegrationSettings = (): IntegrationSettings =>
  ({}) as IntegrationSettings
