import { useMemo } from 'react'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type { FieldsSettings } from '@/stores/widgetSettings/types'
import type { FieldsActions } from '@/stores/widgetSettings/fieldsSlice'

type UseFieldsSettingsReturn = {
  settings: FieldsSettings
} & FieldsActions

export const useFieldsSettings = (): UseFieldsSettingsReturn => {
  const settings = useWidgetSettingsStore(s => s.settings!.fields)
  const setCompanyLogoEnabled = useWidgetSettingsStore(s => s.setCompanyLogoEnabled)
  const setCompanyLogoFile = useWidgetSettingsStore(s => s.setCompanyLogoFile)
  const setTemplateEnabled = useWidgetSettingsStore(s => s.setTemplateEnabled)
  const setTemplateKey = useWidgetSettingsStore(s => s.setTemplateKey)
  const setTemplateImageEnabled = useWidgetSettingsStore(s => s.setTemplateImageEnabled)
  const setTemplateImageFile = useWidgetSettingsStore(s => s.setTemplateImageFile)
  const setWindowFormat = useWidgetSettingsStore(s => s.setWindowFormat)
  const setContentPosition = useWidgetSettingsStore(s => s.setContentPosition)
  const setColorScheme = useWidgetSettingsStore(s => s.setColorScheme)
  const setCustomColor = useWidgetSettingsStore(s => s.setCustomColor)
  const setFormTitle = useWidgetSettingsStore(s => s.setFormTitle)
  const setFormDescription = useWidgetSettingsStore(s => s.setFormDescription)
  const setFormButtonText = useWidgetSettingsStore(s => s.setFormButtonText)
  const setCountdownEnabled = useWidgetSettingsStore(s => s.setCountdownEnabled)
  const setContactField = useWidgetSettingsStore(s => s.setContactField)
  const setAgreement = useWidgetSettingsStore(s => s.setAgreement)
  const setAdsInfo = useWidgetSettingsStore(s => s.setAdsInfo)
  const setOnWinEnabled = useWidgetSettingsStore(s => s.setOnWinEnabled)
  const setOnWinText = useWidgetSettingsStore(s => s.setOnWinText)
  const setOnWinTextSize = useWidgetSettingsStore(s => s.setOnWinTextSize)
  const setOnWinDescription = useWidgetSettingsStore(s => s.setOnWinDescription)
  const setOnWinDescriptionSize = useWidgetSettingsStore(s => s.setOnWinDescriptionSize)
  const setOnWinColorSchemeEnabled = useWidgetSettingsStore(s => s.setOnWinColorSchemeEnabled)
  const setOnWinColorScheme = useWidgetSettingsStore(s => s.setOnWinColorScheme)
  const setOnWinDiscountColors = useWidgetSettingsStore(s => s.setOnWinDiscountColors)
  const setOnWinPromoColors = useWidgetSettingsStore(s => s.setOnWinPromoColors)
  const setMessageEnabled = useWidgetSettingsStore(s => s.setMessageEnabled)
  const setMessageText = useWidgetSettingsStore(s => s.setMessageText)
  const setFormLink = useWidgetSettingsStore(s => s.setFormLink)
  const setFormBorderEnabled = useWidgetSettingsStore(s => s.setFormBorderEnabled)
  const setFormBorderColor = useWidgetSettingsStore(s => s.setFormBorderColor)

  return useMemo(
    () => ({
      settings,
      setCompanyLogoEnabled,
      setCompanyLogoFile,
      setTemplateEnabled,
      setTemplateKey,
      setTemplateImageEnabled,
      setTemplateImageFile,
      setWindowFormat,
      setContentPosition,
      setColorScheme,
      setCustomColor,
      setFormTitle,
      setFormDescription,
      setFormButtonText,
      setCountdownEnabled,
      setContactField,
      setAgreement,
      setAdsInfo,
      setOnWinEnabled,
      setOnWinText,
      setOnWinTextSize,
      setOnWinDescription,
      setOnWinDescriptionSize,
      setOnWinDiscountColors,
      setOnWinPromoColors,
      setOnWinColorSchemeEnabled,
      setOnWinColorScheme,
      setMessageEnabled,
      setMessageText,
      setFormLink,
      setFormBorderEnabled,
      setFormBorderColor
    }),
    [
      settings,
      setCompanyLogoEnabled,
      setCompanyLogoFile,
      setTemplateEnabled,
      setTemplateKey,
      setTemplateImageEnabled,
      setTemplateImageFile,
      setWindowFormat,
      setContentPosition,
      setColorScheme,
      setCustomColor,
      setFormTitle,
      setFormDescription,
      setFormButtonText,
      setCountdownEnabled,
      setContactField,
      setAgreement,
      setAdsInfo,
      setOnWinEnabled,
      setOnWinText,
      setOnWinTextSize,
      setOnWinDescription,
      setOnWinDescriptionSize,
      setOnWinDiscountColors,
      setOnWinPromoColors,
      setOnWinColorSchemeEnabled,
      setOnWinColorScheme,
      setMessageEnabled,
      setMessageText,
      setFormLink,
      setFormBorderEnabled,
      setFormBorderColor
    ]
  )
}
