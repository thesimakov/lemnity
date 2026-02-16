import { useMemo } from 'react'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type {
  AnnouncementWidget,
} from '@lemnity/widget-config/widgets/announcement'

export const useAnnouncementSettings = () => {
  const widget = useWidgetSettingsStore(
    s => s.settings?.widget
  )

  const setWidgetFormat = useWidgetSettingsStore(
    s => s.setAnnouncementWidgetFormat
  )
  const setCompanyLogoEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementCompanyLogoEnabled
  )
  const setCompanyLogoUrl = useWidgetSettingsStore(
    s => s.setAnnouncementCompanyLogoUrl
  )
  const setColorScheme = useWidgetSettingsStore(
    s => s.setAnnouncementColorScheme
  )
  const setBackgroundColor = useWidgetSettingsStore(
    s => s.setAnnouncementBackgroundColor
  )
  const setBorderRadius = useWidgetSettingsStore(
    s => s.setAnnouncementBorderRadius
  )
  const setContentEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementContentEnabled
  )
  const setContentType = useWidgetSettingsStore(
    s => s.setAnnouncementContentType
  )
  const setContentAlignment = useWidgetSettingsStore(
    s => s.setAnnouncementContentAlignment
  )
  const setContentUrl = useWidgetSettingsStore(
    s => s.setAnnouncementContentUrl
  )
  const setInfoScreenTitle = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenTitle
  )
  const setInfoScreenTitleColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenTitleColor
  )
  const setInfoScreenDescription = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenDescription
  )
  const setInfoScreenDescriptionColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenDescriptionColor
  )
  const setInfoScreenCountdownDate = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenCountdownDate
  )
  const setInfoScreenCountdownEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenCountdownEnabled
  )
  const setInfoScreenCountdownBackgroundColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenCountdownBackgroundColor
  )
  const setInfoScreenCountdownFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenCountdownFontColor
  )
  const setInfoScreenButtonText = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenButtonText
  )
  const setInfoScreenButtonFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenButtonFontColor
  )
  const setInfoScreenButtonBackgroundColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenButtonBackgroundColor
  )
  const setInfoScreenIcon = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenIcon
  )
  const setInfoScreenLink = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenLink
  )
  const setFormScreenTitle = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenTitle
  )
  const setFormScreenTitleFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenTitleFontColor
  )
  const setFormScreenDescription = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenDescription
  )
  const setFormScreenDescriptionFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenDescriptionFontColor
  )
  const setFormScreenContactAcquisitionEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenContactAcquisitionEnabled
  )
  const setFormScreenNameFieldEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenNameFieldEnabled
  )
  const setFormScreenNameFieldRequired = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenNameFieldRequired
  )
  const setFormScreenEmailFieldEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenEmailFieldEnabled
  )
  const setFormScreenEmailFieldRequired = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenEmailFieldRequired
  )
  const setFormScreenPhoneFieldEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenPhoneFieldEnabled
  )
  const setFormScreenPhoneFieldRequired = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenPhoneFieldRequired
  )
  const setFormScreenAgreementEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenAgreementEnabled
  )
  // const setFormScreenAgreement = useWidgetSettingsStore(
  //   s => s.setAnnouncementFormScreenAgreement
  // )
  const setFormScreenAdsInfoEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenAdsInfoEnabled
  )
  // const setFormScreenAdsInfo = useWidgetSettingsStore(
  //   s => s.setAnnouncementFormScreenAdsInfo
  // )
  const setRewardScreenTitle = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenTitle
  )
  const setRewardScreentitleFontSize = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenTitleFontSize
  )
  const setRewardScreenTitleFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenTitleFontColor
  )
  const setRewardScreenDescription = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenDescription
  )
  const setRewardScreenDescriptionFontSize = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenDescriptionFontSize
  )
  const setRewardScreenDescriptionFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenDescriptionFontColor
  )
  const setRewardScreenDiscount = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenDiscount
  )
  const setRewardScreenDiscountFontSize = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenDiscountFontSize
  )
  const setRewardScreenDiscountFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenDiscountFontColor
  )
  const setRewardScreenPromo = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenPromo
  )
  const setRewardScreenPromoFontSize = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenPromoFontSize
  )
  const setRewardScreenPromoFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenPromoFontColor
  )
  const setRewardScreenCustomColorSchemeEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenCustomColorSchemeEnabled
  )
  const setRewardScreenCustomDiscountBackgroundColor = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenDiscountBackgroundColor
  )
  const setRewardScreenCustomPromoBackgroundColor = useWidgetSettingsStore(
    s => s.setAnnouncementRewardScreenPromoBackgroundColor
  )

  const settings = widget?.type === WidgetTypeEnum.ANNOUNCEMENT
    ? (widget as AnnouncementWidget)
    : null
  
    return useMemo(
      () => ({
        settings,
        setWidgetFormat,
        setCompanyLogoEnabled,
        setCompanyLogoUrl,
        setColorScheme,
        setBackgroundColor,
        setBorderRadius,
        setContentEnabled,
        setContentType,
        setContentAlignment,
        setContentUrl,
        setInfoScreenTitle,
        setInfoScreenTitleColor,
        setInfoScreenDescription,
        setInfoScreenDescriptionColor,
        setInfoScreenCountdownDate,
        setInfoScreenCountdownEnabled,
        setInfoScreenCountdownBackgroundColor,
        setInfoScreenCountdownFontColor,
        setInfoScreenButtonText,
        setInfoScreenButtonFontColor,
        setInfoScreenButtonBackgroundColor,
        setInfoScreenIcon,
        setInfoScreenLink,
        setFormScreenTitle,
        setFormScreenTitleFontColor,
        setFormScreenDescription,
        setFormScreenDescriptionFontColor,
        setFormScreenContactAcquisitionEnabled,
        setFormScreenNameFieldEnabled,
        setFormScreenNameFieldRequired,
        setFormScreenEmailFieldEnabled,
        setFormScreenEmailFieldRequired,
        setFormScreenPhoneFieldEnabled,
        setFormScreenPhoneFieldRequired,
        setFormScreenAgreementEnabled,
        // setFormScreenAgreement,
        setFormScreenAdsInfoEnabled,
        // setFormScreenAdsInfo,
        setRewardScreenTitle,
        setRewardScreentitleFontSize,
        setRewardScreenTitleFontColor,
        setRewardScreenDescription,
        setRewardScreenDescriptionFontSize,
        setRewardScreenDescriptionFontColor,
        setRewardScreenDiscount,
        setRewardScreenDiscountFontSize,
        setRewardScreenDiscountFontColor,
        setRewardScreenPromo,
        setRewardScreenPromoFontSize,
        setRewardScreenPromoFontColor,
        setRewardScreenCustomColorSchemeEnabled,
        setRewardScreenCustomDiscountBackgroundColor,
        setRewardScreenCustomPromoBackgroundColor,
      }),
      [
        settings,
        setWidgetFormat,
        setCompanyLogoEnabled,
        setCompanyLogoUrl,
        setColorScheme,
        setBackgroundColor,
        setBorderRadius,
        setContentEnabled,
        setContentType,
        setContentAlignment,
        setContentUrl,
        setInfoScreenTitle,
        setInfoScreenTitleColor,
        setInfoScreenDescription,
        setInfoScreenDescriptionColor,
        setInfoScreenCountdownDate,
        setInfoScreenCountdownEnabled,
        setInfoScreenCountdownBackgroundColor,
        setInfoScreenCountdownFontColor,
        setInfoScreenButtonText,
        setInfoScreenButtonFontColor,
        setInfoScreenButtonBackgroundColor,
        setInfoScreenIcon,
        setInfoScreenLink,
        setFormScreenTitle,
        setFormScreenTitleFontColor,
        setFormScreenDescription,
        setFormScreenDescriptionFontColor,
        setFormScreenContactAcquisitionEnabled,
        setFormScreenNameFieldEnabled,
        setFormScreenNameFieldRequired,
        setFormScreenEmailFieldEnabled,
        setFormScreenEmailFieldRequired,
        setFormScreenPhoneFieldEnabled,
        setFormScreenPhoneFieldRequired,
        setFormScreenAgreementEnabled,
        // setFormScreenAgreement,
        setFormScreenAdsInfoEnabled,
        // setFormScreenAdsInfo,
        setRewardScreenTitle,
        setRewardScreentitleFontSize,
        setRewardScreenTitleFontColor,
        setRewardScreenDescription,
        setRewardScreenDescriptionFontSize,
        setRewardScreenDescriptionFontColor,
        setRewardScreenDiscount,
        setRewardScreenDiscountFontSize,
        setRewardScreenDiscountFontColor,
        setRewardScreenPromo,
        setRewardScreenPromoFontSize,
        setRewardScreenPromoFontColor,
        setRewardScreenCustomColorSchemeEnabled,
        setRewardScreenCustomDiscountBackgroundColor,
        setRewardScreenCustomPromoBackgroundColor,
      ]
    )
}