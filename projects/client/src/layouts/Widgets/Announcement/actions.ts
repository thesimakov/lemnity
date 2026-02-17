 import type {
  TypedWidgetUpdater,
} from '@/stores/widgetSettings/widgetActions/types'
import {
  type AnnouncementWidgetType,
  type Content,
  type ContentAlignment,
  type Format,
} from '@lemnity/widget-config/widgets/announcement'
import { buildAnnouncementWidgetSettings } from './defaults'
import type { ColorScheme, Icon } from '@lemnity/widget-config/widgets/base'

export const createAnnouncementActions = (
  updateWidget: TypedWidgetUpdater<AnnouncementWidgetType>
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
  setAnnouncementColorScheme: (colorScheme: ColorScheme) =>
    updateWidget(widget => ({
      ...widget,
      appearence: {
        ...widget.appearence,
        colorScheme,
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
    // InfoSettingsSchema
    setAnnouncementContentType: (contentType: Content) =>
      updateWidget(widget => ({
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          contentType,
        }
      })),
    setAnnouncementContentAlignment: (alignment: ContentAlignment) =>
      updateWidget(widget => ({
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          contentAlignment: alignment,
        }
      })),
    setAnnouncementContentUrl: (url: string | undefined) =>
      updateWidget(widget => ({
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          contentUrl: url,
        }
      })),
  setAnnouncementInfoScreenTitle: (title: string) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          title,
        }
      }
    }),
  setAnnouncementInfoScreenTitleColor: (titleColor: string) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          titleColor,
        }
      }
    }),
  setAnnouncementInfoScreenDescription: (description: string) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          description,
        }
      }
    }),
  setAnnouncementInfoScreenDescriptionColor: (descriptionColor: string) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          descriptionColor,
        }
      }
    }),
  setAnnouncementInfoScreenCountdownDate: (countdownDate: string) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          countdownDate,
        }
      }
    }),
  setAnnouncementInfoScreenCountdownEnabled: (countdownEnabled: boolean) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          countdownEnabled,
        }
      }
    }),
  setAnnouncementInfoScreenCountdownBackgroundColor: (
    countdownBackgroundColor: string
  ) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          countdownBackgroundColor,
        }
      }
    }),
  setAnnouncementInfoScreenCountdownFontColor: (countdownFontColor: string) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          countdownFontColor,
        }
      }
    }),
  setAnnouncementInfoScreenButtonText: (buttonText: string) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          buttonText,
        }
      }
    }),
  setAnnouncementInfoScreenButtonFontColor: (buttonFontColor: string) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          buttonFontColor,
        }
      }
    }),
  setAnnouncementInfoScreenButtonBackgroundColor: (
    buttonBackgroundColor: string
  ) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          buttonBackgroundColor,
        }
      }
    }),
  setAnnouncementInfoScreenIcon: (icon: Icon) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
          icon,
        }
      }
    }),
  setAnnouncementInfoScreenLink: (link: string) =>
    updateWidget(widget => {
      return {
        ...widget,
        infoSettings: {
          ...widget.infoSettings,
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
  setAnnouncementFormScreenAgreementEnabled: (enabled: boolean) =>
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
            enabled: enabled,
          }
        }
      }
    }),
  setAnnouncementFormScreenAgreementPolicyUrl: (policyUrl: string) =>
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
            policyUrl: policyUrl,
          }
        }
      }
    }),
  setAnnouncementFormScreenAgreementUrl: (agreementUrl: string) =>
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
            agreementUrl: agreementUrl,
          }
        }
      }
    }),
  setAnnouncementFormScreenAgreementColor: (color: string) =>
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
            color: color,
          }
        }
      }
    }),
  setAnnouncementFormScreenAdsInfoEnabled: (enabled: boolean) =>
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
            enabled: enabled,
          }
        }
      }
    }),
  setAnnouncementFormScreenAdsInfoPolicyUrl: (policyUrl: string) =>
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
            policyUrl: policyUrl,
          }
        }
      }
    }),
  setAnnouncementFormScreenAdsInfoColor: (color: string) =>
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
            color: color,
          }
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
  setAnnouncementRewardScreenEnabled: (enabled: boolean) =>
    updateWidget(widget => {
      const prevRewardMessageSettings =
        widget.rewardMessageSettings
        // This function builds the defaults so every field is present
        ?? buildAnnouncementWidgetSettings().rewardMessageSettings!

      return {
        ...widget,
        rewardMessageSettings: {
          ...prevRewardMessageSettings,
          rewardScreenEnabled: enabled,
        }
      }
    }),
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
