import type { WidgetTypeEnum } from '@lemnity/api-sdk'
import type {
  ActionTimerWidgetSettings,
  ActionTimerImagePosition,
  ColorScheme,
  FABMenuSectorItem,
  MessageKey,
  SectorItem,
  WidgetSpecificSettings
} from '@/stores/widgetSettings/types'
import type { IconName } from '@/components/IconPicker'
import type {
  Content,
  ContentAlignment,
  Format,
} from '@lemnity/widget-config/widgets/announcement'
import type { Icon } from '@lemnity/widget-config/widgets/base'

export type WidgetUpdater = (
  mutator: (settings: WidgetSpecificSettings) => WidgetSpecificSettings
) => void

export type TypedWidgetUpdater<T extends WidgetSpecificSettings> = (
  mutator: (settings: T) => T
) => void

// this is pure madness but here we are
export type WidgetActions = {
  setWidgetType: (
    widgetType: WidgetTypeEnum,
    nextSettings: WidgetSpecificSettings
  ) => void
  // FAB Menu actions
  setFABMenuSectors: (items: FABMenuSectorItem[]) => void
  updateFABMenuSector: (
    index: number,
    updates: Partial<FABMenuSectorItem>
  ) => void
  addFABMenuSector: (item: FABMenuSectorItem) => void
  deleteFABMenuSector: (id: string) => void
  setFABMenuButtonTextColor: (color: string) => void
  setFABMenuButtonBackgroundColor: (color: string) => void
  setFABMenuTriggerText: (text: string) => void
  setFABMenuTriggerIcon: (icon: IconName) => void
  // Wheel of fortune actions
  setWheelRandomize: (randomize: boolean) => void
  setWheelSectors: (items: SectorItem[]) => void
  updateWheelSector: (index: number, updates: Partial<SectorItem>) => void
  addWheelSector: (item: SectorItem) => void
  deleteWheelSector: (id: string) => void
  setWheelMessage: (key: Exclude<MessageKey, 'onWin'>, enabled: boolean, text: string) => void
  setWheelOnWinEnabled: (enabled: boolean) => void
  setWheelOnWinText: (text: string) => void
  setWheelOnWinTextSize: (textSize: number) => void
  setWheelOnWinDescription: (description: string) => void
  setWheelOnWinDescriptionSize: (descriptionSize: number) => void
  setWheelOnWinColorSchemeEnabled: (enabled: boolean) => void
  setWheelOnWinColorScheme: (scheme: ColorScheme) => void
  setWheelOnWinDiscountColors: (color: string, bgColor: string) => void
  setWheelOnWinPromoColors: (color: string, bgColor: string) => void
  // Action Timer actions
  updateActionTimer: (
    updates: Partial<ActionTimerWidgetSettings['countdown']>
  ) => void
  setActionTimerImage: (imageUrl?: string) => void
  setTextBeforeCountdown: (textBeforeCountdown: string) => void
  setTextBeforeCountdownColor: (textBeforeCountdownColor: string) => void
  setImagePosition: (position: ActionTimerImagePosition) => void
  setWheelBorderColor: (color: string) => void
  setWheelBorderThickness: (thickness: number) => void
  // Announcement actions
  setAnnouncementWidgetFormat: (format: Format) => void
  setAnnouncementCompanyLogoEnabled: (enabled: boolean) => void
  setAnnouncementCompanyLogoUrl: (url: string) => void
  setAnnouncementColorScheme: (colorScheme: ColorScheme) => void
  setAnnouncementBackgroundColor: (color: string) => void
  setAnnouncementBorderRadius: (radius: number) => void
  setAnnouncementContentEnabled: (enabled: boolean) => void
  setAnnouncementContentType: (contentType: Content) => void
  setAnnouncementContentAlignment: (
    alignment: ContentAlignment
  ) => void
  setAnnouncementContentUrl: (
    url: string
  ) => void
  // InfoSettingsSchema
  setAnnouncementInfoScreenTitle: (
    title: string
  ) => void
  setAnnouncementInfoScreenTitleColor: (
    titleColor: string
  ) => void
  setAnnouncementInfoScreenDescription: (
    description: string
  ) => void
  setAnnouncementInfoScreenDescriptionColor: (
    descriptionColor: string
  ) => void
  setAnnouncementInfoScreenCountdownDate: (
    countdownDate: string
  ) => void
  setAnnouncementInfoScreenCountdownEnabled: (
    countdownEnabled: boolean
  ) => void
  setAnnouncementInfoScreenCountdownBackgroundColor: (
    countdownBackgroundColor: string
  ) => void
  setAnnouncementInfoScreenCountdownFontColor: (
    countdownFontColor: string
  ) => void
  setAnnouncementInfoScreenButtonText: (
    buttonText: string
  ) => void
  setAnnouncementInfoScreenButtonFontColor: (
    buttonFontColor: string
  ) => void
  setAnnouncementInfoScreenButtonBackgroundColor: (
    buttonBackgroundColor: string
  ) => void
  setAnnouncementInfoScreenIcon: (
    icon: Icon
  ) => void
  setAnnouncementInfoScreenLink: (
    link: string
  ) => void
  // FormSettingsSchema
  setAnnouncementFormScreenTitle: (
    title: string
  ) => void
  setAnnouncementFormScreenTitleFontColor: (
    titleFontColor: string
  ) => void
  setAnnouncementFormScreenDescription: (
    description: string
  ) => void
  setAnnouncementFormScreenDescriptionFontColor: (
    descriptionFontColor: string
  ) => void
  setAnnouncementFormScreenContactAcquisitionEnabled: (
    contactAcquisitionEnabled: boolean
  ) => void
  setAnnouncementFormScreenNameFieldEnabled: (
    nameFieldEnabled: boolean
  ) => void
  setAnnouncementFormScreenNameFieldRequired: (
    nameFieldRequired: boolean
  ) => void
  setAnnouncementFormScreenEmailFieldEnabled: (
    emailFieldEnabled: boolean
  ) => void
  setAnnouncementFormScreenEmailFieldRequired: (
    emailFieldRequired: boolean
  ) => void
  setAnnouncementFormScreenPhoneFieldEnabled: (
    phoneFieldEnabled: boolean
  ) => void
  setAnnouncementFormScreenPhoneFieldRequired: (
    phoneFieldRequired: boolean
  ) => void
  setAnnouncementFormScreenAgreementEnabled: (
    enabled: boolean
  ) => void
  setAnnouncementFormScreenAgreementPolicyUrl: (
    policyUrl: string
  ) => void
  setAnnouncementFormScreenAgreementUrl: (
    agreementUrl: string
  ) => void
  setAnnouncementFormScreenAgreementColor: (
    color: string
  ) => void
  setAnnouncementFormScreenAdsInfoEnabled: (
    enabled: boolean
  ) => void
  setAnnouncementFormScreenAdsInfoPolicyUrl: (
    policyUrl: string
  ) => void
  setAnnouncementFormScreenAdsInfoColor: (
    color: string
  ) => void
  // RewardMessageSettingsSchema
  setAnnouncementRewardScreenTitle: (
    title: string
  ) => void
  setAnnouncementRewardScreenTitleFontSize: (
    titleFontSize: number
  ) => void
  setAnnouncementRewardScreenTitleFontColor: (
    titleFontColor: string
  ) => void
  setAnnouncementRewardScreenDescription: (
    description: string
  ) => void
  setAnnouncementRewardScreenDescriptionFontSize: (
    descriptionFontSize: number
  ) => void
  setAnnouncementRewardScreenDescriptionFontColor: (
    descriptionFontColor: string
  ) => void
  setAnnouncementRewardScreenDiscount: (
    discount: string
  ) => void
  setAnnouncementRewardScreenDiscountFontSize: (
    discountFontSize: number
  ) => void
  setAnnouncementRewardScreenDiscountFontColor: (
    discountFontColor: string
  ) => void
  setAnnouncementRewardScreenPromo: (
    promo: string
  ) => void
  setAnnouncementRewardScreenPromoFontSize: (
    promoFontSize: number
  ) => void
  setAnnouncementRewardScreenPromoFontColor: (
    promoFontColor: string
  ) => void
  setAnnouncementRewardScreenCustomColorSchemeEnabled: (
    customColorSchemeEnabled: boolean
  ) => void
  setAnnouncementRewardScreenDiscountBackgroundColor: (
    customDiscountBackgroundColor: string
  ) => void
  setAnnouncementRewardScreenPromoBackgroundColor: (
    customPromoBackgroundColor: string
  ) => void
}

export type WidgetSlice = {
  widgetSettingsUpdater: WidgetUpdater
} & WidgetActions
