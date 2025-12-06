import type {
  ContactField,
  FieldsUpdater,
  ColorScheme,
  ContentPosition,
  WindowFormat,
  TemplateImageMode,
  MessageKey
} from './types'
import { mergeDeep, splitPath } from './utils'

export type FieldsActions = {
  setCompanyLogoEnabled: (enabled: boolean) => void
  setCompanyLogoFile: (fileName: string, url?: string) => void
  setTemplateEnabled: (enabled: boolean) => void
  setTemplateKey: (key: string) => void
  setTemplateImageEnabled: (enabled: boolean) => void
  setTemplateImageFile: (fileName: string, url?: string) => void
  setTemplateImageMode: (mode: TemplateImageMode) => void
  setWindowFormat: (format: WindowFormat) => void
  setContentPosition: (position: ContentPosition) => void
  setColorScheme: (scheme: ColorScheme) => void
  setCustomColor: (color: string) => void
  setFormTitle: (text: string, color: string) => void
  setFormDescription: (text: string, color: string) => void
  setFormButtonText: (text: string, color: string, backgroundColor: string, icon: string) => void
  setCountdownEnabled: (enabled: boolean) => void
  setContactField: (field: ContactField, enabled: boolean, required: boolean) => void
  setAgreement: (
    enabled: boolean,
    text: string,
    policyUrl: string,
    agreementUrl: string,
    color: string
  ) => void
  setAdsInfo: (enabled: boolean, text: string, policyUrl: string, color: string) => void
  setOnWinEnabled: (enabled: boolean) => void
  setOnWinText: (text: string) => void
  setOnWinTextWithColor: (text: string, color: string) => void
  setOnWinTextSize: (size: number) => void
  setOnWinDescription: (description: string) => void
  setOnWinDescriptionWithColor: (description: string, color: string) => void
  setOnWinDescriptionSize: (size: number) => void
  setOnWinColorSchemeEnabled: (enabled: boolean) => void
  setOnWinColorScheme: (scheme: 'primary' | 'custom') => void
  setOnWinDiscountColors: (color: string, bgColor: string) => void
  setOnWinPromoColors: (color: string, bgColor: string) => void
  setMessageEnabled: (key: MessageKey, enabled: boolean) => void
  setMessageText: (key: MessageKey, text: string) => void
  setFormLink: (link: string) => void
  setFormBorderEnabled: (enabled: boolean) => void
  setFormBorderColor: (color: string) => void
}

export type FieldsSlice = {
  fieldsSettingsUpdater: FieldsUpdater
} & FieldsActions

export const createFieldsSlice = (updateFields: FieldsUpdater): FieldsSlice => {
  // Generic path-based helpers for scalability
  const updateByPath = (path: string, partial: Record<string, unknown>) =>
    updateFields(s => mergeDeep(s, splitPath(path), partial))

  return {
    fieldsSettingsUpdater: updateFields,
    setCompanyLogoEnabled: enabled => updateByPath('companyLogo', { enabled }),
    setCompanyLogoFile: (fileName, url) => updateByPath('companyLogo', { fileName, url }),
    // Keep slice minimal and consistent: just flip the flag.
    // Branch creation is done lazily by deep setters and defaults; cleanup is done in normalize/trim.
    setTemplateEnabled: enabled => updateByPath('template', { enabled }),
    setTemplateKey: key => updateByPath('template', { key }),
    setTemplateImageEnabled: enabled =>
      updateByPath('template.templateSettings.image', { enabled }),
    setTemplateImageFile: (fileName, url) =>
      updateByPath('template.templateSettings.image', { fileName, url }),
    setTemplateImageMode: mode => updateByPath('template.templateSettings', { imageMode: mode }),
    setWindowFormat: format => updateByPath('template.templateSettings', { windowFormat: format }),
    setContentPosition: position =>
      updateByPath('template.templateSettings', { contentPosition: position }),
    setColorScheme: scheme => updateByPath('template.templateSettings', { colorScheme: scheme }),
    setCustomColor: color => updateByPath('template.templateSettings', { customColor: color }),
    setFormTitle: (text, color) => updateByPath('formTexts', { title: { text, color } }),
    setFormDescription: (text, color) =>
      updateByPath('formTexts', { description: { text, color } }),
    setFormButtonText: (text, color, backgroundColor, icon) =>
      updateByPath('formTexts', { button: { text, color, backgroundColor, icon } }),
    setCountdownEnabled: enabled => updateByPath('countdown', { enabled }),
    setContactField: (field, enabled, required) =>
      updateByPath('contacts', { [field]: { enabled, required } } as Record<string, unknown>),
    setAgreement: (enabled, text, policyUrl, agreementUrl, color) =>
      updateByPath('agreement', { enabled, text, policyUrl, agreementUrl, color }),
    setAdsInfo: (enabled, text, policyUrl, color) =>
      updateByPath('adsInfo', { enabled, text, policyUrl, color }),
    setOnWinEnabled: enabled => updateByPath('messages.onWin', { enabled }),
    setOnWinText: text => updateByPath('messages.onWin', { text }),
    setOnWinTextWithColor: (text, color) => updateByPath('messages.onWin', { text, textColor: color }),
    setOnWinTextSize: size => updateByPath('messages.onWin', { textSize: size }),
    setOnWinDescription: description => updateByPath('messages.onWin', { description }),
    setOnWinDescriptionWithColor: (description, color) => updateByPath('messages.onWin', { description, descriptionColor: color }),
    setOnWinDescriptionSize: size => updateByPath('messages.onWin', { descriptionSize: size }),
    setOnWinColorSchemeEnabled: enabled => updateByPath('messages.onWin.colorScheme', { enabled }),
    setOnWinColorScheme: scheme => updateByPath('messages.onWin.colorScheme', { scheme }),
    setOnWinDiscountColors: (color, bgColor) =>
      updateByPath('messages.onWin.colorScheme.discount', { color, bgColor }),
    setOnWinPromoColors: (color, bgColor) =>
      updateByPath('messages.onWin.colorScheme.promo', { color, bgColor }),
    setMessageEnabled: (key, enabled) => updateByPath(`messages.${key}`, { enabled }),
    setMessageText: (key, text) => updateByPath(`messages.${key}`, { text }),
    setFormLink: link => updateFields(s => ({ ...s, link })),
    setFormBorderEnabled: enabled => updateByPath('border', { enabled }),
    setFormBorderColor: color => updateByPath('border', { color })
  }
}
