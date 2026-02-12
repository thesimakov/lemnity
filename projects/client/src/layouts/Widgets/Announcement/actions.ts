 import type {
  TypedWidgetUpdater,
} from '@/stores/widgetSettings/widgetActions/types'
import {
  type AnnouncementWidget,
  type Content,
  type ContentAlignment,
  type Format,
} from '@lemnity/widget-config/widgets/announcement'
import { buildAnnouncementWidgetSettings } from './defaults'
import type { Icon } from '@lemnity/widget-config/widgets/base'

export const createAnnouncementActions = (
  updateWidget: TypedWidgetUpdater<AnnouncementWidget>
) => ({
  // WidgetAppearenceSchema
  setAnnouncementWidgetFormat: (format: Format) =>
    updateWidget(widget => ({
      ...widget,
      appearence: {
        ...widget.appearence,
        format,
      }
    })),
  setAnnouncementCompanyLogoEnabled: (enabled: boolean) =>
    updateWidget(widget => ({
      ...widget,
      appearence: {
        ...widget.appearence,
        companyLogoEnabled: enabled,
      }
    })),
  setAnnouncementCompanyLogoUrl: (url: string) =>
    updateWidget(widget => ({
      ...widget,
      appearence: {
        ...widget.appearence,
        companyLogoUrl: url,
      }
    })),
  setAnnouncementBackgroundColor: (color: string) =>
    updateWidget(widget => ({
      ...widget,
      appearence: {
        ...widget.appearence,
        backgroundColor: color,
      }
    })),
  setAnnouncementBorderRadius: (radius: number) =>
    updateWidget(widget => ({
      ...widget,
      appearence: {
        ...widget.appearence,
        borderRadius: radius,
      }
    })),
  setAnnouncementContentEnabled: (enabled: boolean) =>
    updateWidget(widget => ({
      ...widget,
      appearence: {
        ...widget.appearence,
        contentEnabled: enabled,
      }
    })),
  setAnnouncementContentType: (contentType: Content) =>
    updateWidget(widget => ({
      ...widget,
      appearence: {
        ...widget.appearence,
        contentType,
      }
    })),
  setAnnouncementContentAlignment: (alignment: ContentAlignment) =>
    updateWidget(widget => ({
      ...widget,
      appearence: {
        ...widget.appearence,
        contentAlignment: alignment,
      }
    })),
  setAnnouncementContentUrl: (url: string) =>
    updateWidget(widget => ({
      ...widget,
      appearence: {
        ...widget.appearence,
        contentUrl: url,
      }
    })),
  // InfoSettingsSchema
  setAnnouncementInfoScreenTitle: (title: string) =>
    updateWidget(widget => {
      const prevInfoSettings =
        widget.infoSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().infoSettings!

      return {
        ...widget,
        infoSettings: {
          ...prevInfoSettings,
          title,
        }
      }
    }),
  setAnnouncementInfoScreenDescription: (description: string) =>
    updateWidget(widget => {
      const prevInfoSettings =
        widget.infoSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().infoSettings!

      return {
        ...widget,
        infoSettings: {
          ...prevInfoSettings,
          description,
        }
      }
    }),
  setAnnouncementInfoScreenCountdownDate: (countdownDate: string) =>
    updateWidget(widget => {
      const prevInfoSettings =
        widget.infoSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().infoSettings!

      return {
        ...widget,
        infoSettings: {
          ...prevInfoSettings,
          countdownDate,
        }
      }
    }),
  setAnnouncementInfoScreenCountdownEnabled: (countdownEnabled: boolean) =>
    updateWidget(widget => {
      const prevInfoSettings =
        widget.infoSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().infoSettings!

      return {
        ...widget,
        infoSettings: {
          ...prevInfoSettings,
          countdownEnabled,
        }
      }
    }),
  setAnnouncementInfoScreenCountdownBackgroundColor: (
    countdownBackgroundColor: string
  ) =>
    updateWidget(widget => {
      const prevInfoSettings =
        widget.infoSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().infoSettings!
        
      return {
        ...widget,
        infoSettings: {
          ...prevInfoSettings,
          countdownBackgroundColor,
        }
      }
    }),
  setAnnouncementInfoScreenCountdownDigitColor: (countdownDigitColor: string) =>
    updateWidget(widget => {
      const prevInfoSettings =
        widget.infoSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().infoSettings!
        
      return {
        ...widget,
        infoSettings: {
          ...prevInfoSettings,
          countdownDigitColor,
        }
      }
    }),
  setAnnouncementInfoScreenButtonText: (buttonText: string) =>
    updateWidget(widget => {
      const prevInfoSettings =
        widget.infoSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().infoSettings!

      return {
        ...widget,
        infoSettings: {
          ...prevInfoSettings,
          buttonText,
        }
      }
    }),
  setAnnouncementInfoScreenButtonFontColor: (buttonFontColor: string) =>
    updateWidget(widget => {
      const prevInfoSettings =
        widget.infoSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().infoSettings!

      return {
        ...widget,
        infoSettings: {
          ...prevInfoSettings,
          buttonFontColor,
        }
      }
    }),
  setAnnouncementInfoScreenButtonBackgroundColor: (
    buttonBackgroundColor: string
  ) =>
    updateWidget(widget => {
      const prevInfoSettings =
        widget.infoSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().infoSettings!
      
      return {
        ...widget,
        infoSettings: {
          ...prevInfoSettings,
          buttonBackgroundColor,
        }
      }
    }),
  setAnnouncementInfoScreenIcon: (icon: Icon) =>
    updateWidget(widget => {
      const prevInfoSettings =
        widget.infoSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().infoSettings!

      return {
        ...widget,
        infoSettings: {
          ...prevInfoSettings,
          icon,
        }
      }
    }),
  setAnnouncementInfoScreenLink: (link: string) =>
    updateWidget(widget => {
      const prevInfoSettings =
        widget.infoSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().infoSettings!

      return {
        ...widget,
        infoSettings: {
          ...prevInfoSettings,
          link,
        }
      }
    }),
  // FormSettingsSchema
  setAnnouncementFormScreenTitle: (title: string) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          title,
        }
      }
    }),
  setAnnouncementFormScreenTitleFontColor: (titleFontColor: string) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          titleFontColor,
        }
      }
    }),
  setAnnouncementFormScreenDescription: (description: string) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          description,
        }
      }
    }),
  setAnnouncementFormScreenDescriptionFontColor: (
    descriptionFontColor: string
  ) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          descriptionFontColor,
        }
      }
    }),
  setAnnouncementFormScreenContactAcquisitionEnabled: (
    contactAcquisitionEnabled: boolean
  ) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          contactAcquisitionEnabled,
        }
      }
    }),
  setAnnouncementFormScreenNameFieldEnabled: (nameFieldEnabled: boolean) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          nameFieldEnabled,
        }
      }
    }),
  setAnnouncementFormScreenNameFieldRequired: (nameFieldRequired: boolean) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          nameFieldRequired,
        }
      }
    }),
  setAnnouncementFormScreenEmailFieldEnabled: (emailFieldEnabled: boolean) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          emailFieldEnabled,
        }
      }
    }),
  setAnnouncementFormScreenEmailFieldRequired: (emailFieldRequired: boolean) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          emailFieldRequired,
        }
      }
    }),
  setAnnouncementFormScreenPhoneFieldEnabled: (phoneFieldEnabled: boolean) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          phoneFieldEnabled,
        }
      }
    }),
  setAnnouncementFormScreenPhoneFieldRequired: (phoneFieldRequired: boolean) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          phoneFieldRequired,
        }
      }
    }),
  setAnnouncementFormScreenAgreementEnabled: (agreementEnabled: boolean) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          agreementEnabled,
        }
      }
    }),
  setAnnouncementFormScreenAgreement: (
    enabled: boolean,
    policyUrl: string,
    agreementUrl: string,
    color: string
  ) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          agreement: {
            ...prevFormSettings.agreement,
            enabled,
            policyUrl,
            agreementUrl,
            color,
          }
        }
      }
    }),
  setAnnouncementFormScreenAdsInfoEnabled: (adsInfoEnabled: boolean) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          adsInfoEnabled,
        }
      }
    }),
  setAnnouncementFormScreenAdsInfo: (
    enabled: boolean,
    policyUrl: string,
    color: string
  ) =>
    updateWidget(widget => {
      const prevFormSettings =
        widget.formSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().formSettings!

      return {
        ...widget,
        formSettings: {
          ...prevFormSettings,
          adsInfo: {
            ...prevFormSettings.adsInfo,
            enabled,
            policyUrl,
            color,
          }
        }
      }
    }),
  // RewardMessageSettingsSchema
  setAnnouncementRewardScreenTitle: (title: string) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          title,
        }
      }
    }),
  setAnnouncementRewardScreenTitleFontSize: (titleFontSize: number) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          titleFontSize,
        }
      }
    }),
  setAnnouncementRewardScreenTitleFontColor: (titleFontColor: string) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          titleFontColor,
        }
      }
    }),
  setAnnouncementRewardScreenDescription: (description: string) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          description,
        }
      }
    }),
  setAnnouncementRewardScreenDescriptionFontSize: (
    descriptionFontSize: number
  ) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          descriptionFontSize,
        }
      }
    }),
  setAnnouncementRewardScreenDescriptionFontColor: (
    descriptionFontColor: string
  ) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          descriptionFontColor,
        }
      }
    }),
  setAnnouncementRewardScreenDiscount: (discount: string) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          discount,
        }
      }
    }),
  setAnnouncementRewardScreenDiscountFontSize: (discountFontSize: number) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          discountFontSize,
        }
      }
    }),
  setAnnouncementRewardScreenDiscountFontColor: (discountFontColor: string) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          discountFontColor,
        }
      }
    }),
  setAnnouncementRewardScreenPromo: (promo: string) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          promo,
        }
      }
    }),
  setAnnouncementRewardScreenPromoFontSize: (promoFontSize: number) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          promoFontSize,
        }
      }
    }),
  setAnnouncementRewardScreenPromoFontColor: (promoFontColor: string) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          promoFontColor,
        }
      }
    }),
  setAnnouncementRewardScreenCustomColorSchemeEnabled: (
    customColorSchemeEnabled: boolean
  ) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          customColorSchemeEnabled,
        }
      }
    }),
  setAnnouncementRewardScreenDiscountBackgroundColor: (
    customDiscountBackgroundColor: string
  ) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          customDiscountBackgroundColor,
        }
      }
    }),
  setAnnouncementRewardScreenPromoBackgroundColor: (
    customPromoBackgroundColor: string
  ) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          customPromoBackgroundColor,
        }
      }
    })
})
