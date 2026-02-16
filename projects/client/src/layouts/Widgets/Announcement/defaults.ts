import type {
  DisplaySettings,
  FieldsSettings,
  IntegrationSettings,
} from '@/stores/widgetSettings/types'
import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type {
  AnnouncementWidget,
} from '@lemnity/widget-config/widgets/announcement'

export const announcementWidgetDefaults: AnnouncementWidget = {
  type: WidgetTypeEnum.ANNOUNCEMENT,
  appearence: {
    format: 'announcement',

    companyLogoEnabled: false,
    companyLogoUrl: undefined,

    colorScheme: 'primary',
    backgroundColor: '#FFC943',
    borderRadius: 15,

    contentEnabled: false,
    contentType: 'imageOnTop',
    contentAlignment: 'center',
    contentUrl: undefined,
  },
  infoSettings: {
    title: 'Заголовок виджета',
    titleColor: '#FFFFFF',
    description: 'Описание виджета',
    descriptionColor: '#FFFFFF',

    countdownDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    countdownEnabled: true,
    countdownBackgroundColor: '#FFFFFF',
    countdownFontColor: '#000000',

    buttonText: 'Нажми меня',
    buttonFontColor: '#000000',
    buttonBackgroundColor: '#FFB400',
    icon: 'Sparkles',
    link: 'https://google.com',
  },
  formSettings: {
    title: 'Заголовок формы',
    titleFontColor: '#000000',
    description: 'Описание формы',
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
      policyUrl: 'https://google.com',
      agreementUrl: 'https://google.com',
      color: '#000000'
    },

    adsInfo: {
      enabled: false,
      policyUrl: 'https://google.com',
      color: '#000000'
    }
  },
  rewardMessageSettings: {
    title: 'Заголовок сообщения о награде',
    titleFontSize: 40,
    titleFontColor: '#FFFFFF',

    description: 'Описание сообщения о награде',
    descriptionFontSize: 16,
    descriptionFontColor: '#FFFFFF',

    discount: 'Скидка',
    discountFontSize: 20,
    discountFontColor: '#000000',

    promo: 'Промо-акция',
    promoFontSize: 25,
    promoFontColor: '#FFFFFF',

    customColorSchemeEnabled: false,
    customDiscountBackgroundColor: undefined,
    customPromoBackgroundColor: undefined,
  },
  brandingEnabled: false,
}

export const buildAnnouncementWidgetSettings = (): AnnouncementWidget =>
  announcementWidgetDefaults

export const buildAnnouncementFieldsSettings = (): FieldsSettings =>
  ({}) as FieldsSettings
export const buildAnnouncementDisplaySettings = (): DisplaySettings =>
  ({}) as DisplaySettings
export const buildAnnouncementIntegrationSettings = (): IntegrationSettings =>
  ({}) as IntegrationSettings
