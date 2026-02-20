import type {
  DisplaySettings,
  FieldsSettings,
  IntegrationSettings,
} from '@/stores/widgetSettings/types'
import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'

export const announcementWidgetDefaults: AnnouncementWidgetType = {
  type: WidgetTypeEnum.ANNOUNCEMENT,
  appearence: {
    format: 'announcement',

    companyLogoEnabled: true,
    companyLogoUrl: undefined,

    colorScheme: 'primary',
    backgroundColor: '#FFC943',
    borderRadius: 15,
  },
  infoSettings: {
    contentType: 'imageOnTop',
    contentAlignment: 'center',
    contentUrl: undefined,

    title: 'Укажите заголовок',
    titleColor: '#000000',
    description: 'Напишите описание к действию или какое нибудь предложение',
    descriptionColor: '#000000',

    countdownDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    countdownEnabled: true,
    countdownBackgroundColor: '#FFFFFF',
    countdownFontColor: '#000000',

    buttonText: 'Действие',
    buttonFontColor: '#000000',
    buttonBackgroundColor: '#FFB400',
    icon: 'Reload',
    link: 'https://lemnity.ru',
  },
  formSettings: {
    title: 'Получите скидку',
    titleFontColor: '#000000',
    description: 'Укажите свой email и получите купон, который можно использовать при покупке',
    descriptionFontColor: '#000000',

    contactAcquisitionEnabled: true,
    nameFieldEnabled: true,
    nameFieldRequired: false,
    emailFieldEnabled: true,
    emailFieldRequired: true,
    phoneFieldEnabled: false,
    phoneFieldRequired: false,

    agreement: {
      enabled: true,
      policyUrl: '',
      agreementUrl: '',
      color: '#000000'
    },

    adsInfo: {
      enabled: true,
      policyUrl: '',
      color: '#000000'
    }
  },
  rewardMessageSettings: {
    rewardScreenEnabled: true,

    title: 'Ваша скидка:',
    titleFontSize: 40,
    titleFontColor: '#000000',

    description:
      'Не забудьте использовать промокод во время оформления заказа!',
    descriptionFontSize: 16,
    descriptionFontColor: '#000000',

    discount: 'Скидка 10%',
    discountFontSize: 20,
    discountFontColor: '#000000',

    promo: 'PROMO-10P',
    promoFontSize: 25,
    promoFontColor: '#FFFFFF',

    customColorSchemeEnabled: false,
    customDiscountBackgroundColor: '#FFF57F',
    customPromoBackgroundColor: '#0F3095',
  },
  brandingEnabled: true,
}

export const buildAnnouncementWidgetSettings = (): AnnouncementWidgetType =>
  announcementWidgetDefaults

export const buildAnnouncementFieldsSettings = (): FieldsSettings =>
  ({}) as FieldsSettings
export const buildAnnouncementDisplaySettings = (): DisplaySettings =>
  ({}) as DisplaySettings
export const buildAnnouncementIntegrationSettings = (): IntegrationSettings =>
  ({}) as IntegrationSettings
