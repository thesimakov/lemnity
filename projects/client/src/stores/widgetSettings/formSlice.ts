import type {
  MessageKey,
  SectorItem,
  ContactField,
  FormUpdater,
  ColorScheme,
  ContentPosition,
  WindowFormat
} from './types'
import { mergeDeep, splitPath } from './utils'

export type FormActions = {
  setCompanyLogoEnabled: (enabled: boolean) => void
  setCompanyLogoFile: (fileName: string, url?: string) => void
  setTemplateEnabled: (enabled: boolean) => void
  setTemplateKey: (key: string) => void
  setTemplateImageEnabled: (enabled: boolean) => void
  setTemplateImageFile: (fileName: string, url?: string) => void
  setWindowFormat: (format: WindowFormat) => void
  setContentPosition: (position: ContentPosition) => void
  setColorScheme: (scheme: ColorScheme) => void
  setCustomColor: (color: string) => void
  setFormTitle: (text: string, color: string) => void
  setFormDescription: (text: string, color: string) => void
  setFormButtonText: (text: string, color: string, backgroundColor: string, icon: string) => void
  setCountdownEnabled: (enabled: boolean) => void
  setContactField: (field: ContactField, enabled: boolean, required: boolean) => void
  setAgreement: (enabled: boolean, text: string, policyUrl: string, agreementUrl: string) => void
  setAdsInfo: (enabled: boolean, text: string, policyUrl: string) => void
  setRandomize: (randomize: boolean) => void
  setSectors: (items: SectorItem[]) => void
  updateSector: (index: number, updates: Partial<SectorItem>) => void
  addSector: (item: SectorItem) => void
  deleteSector: (id: string) => void
  setMessage: (key: MessageKey, enabled: boolean, text: string) => void
  setOnWinEnabled: (enabled: boolean) => void
  setOnWinText: (text: string) => void
  setOnWinTextSize: (textSize: number) => void
  setOnWinDescription: (description: string) => void
  setOnWinDescriptionSize: (descriptionSize: number) => void
  setOnWinColorSchemeEnabled: (enabled: boolean) => void
  setOnWinColorScheme: (scheme: ColorScheme) => void
  setOnWinDiscountColors: (color: string, bgColor: string) => void
  setOnWinPromoColors: (color: string, bgColor: string) => void
}

export type FormSlice = {
  formSettingsUpdater: FormUpdater
} & FormActions

export const createFormSlice = (updateForm: FormUpdater): FormSlice => {
  // Generic path-based helpers for scalability
  const updateByPath = (path: string, partial: Record<string, unknown>) =>
    updateForm(s => mergeDeep(s, splitPath(path), partial))

  return {
    formSettingsUpdater: updateForm,
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
    setAgreement: (enabled, text, policyUrl, agreementUrl) =>
      updateByPath('agreement', { enabled, text, policyUrl, agreementUrl }),
    setAdsInfo: (enabled, text, policyUrl) => updateByPath('adsInfo', { enabled, text, policyUrl }),
    setRandomize: randomize => updateByPath('sectors', { randomize }),
    setSectors: items => updateByPath('sectors', { items }),
    updateSector: (index, updates) =>
      updateForm(s => ({
        ...s,
        sectors: {
          ...s.sectors,
          items: s.sectors.items.map((item, i) => (i === index ? { ...item, ...updates } : item))
        }
      })),
    addSector: item =>
      updateForm(s => ({ ...s, sectors: { ...s.sectors, items: [...s.sectors.items, item] } })),
    deleteSector: id =>
      updateForm(s => ({
        ...s,
        sectors: { ...s.sectors, items: s.sectors.items.filter(item => item.id !== id) }
      })),
    setMessage: (key, enabled, text) =>
      updateForm(s => ({ ...s, messages: { ...s.messages, [key]: { enabled, text } } })),
    setOnWinEnabled: enabled => updateByPath('messages.onWin', { enabled }),
    setOnWinText: text => updateByPath('messages.onWin', { text }),
    setOnWinTextSize: textSize => updateByPath('messages.onWin', { textSize }),
    setOnWinDescription: description => updateByPath('messages.onWin', { description }),
    setOnWinDescriptionSize: descriptionSize => updateByPath('messages.onWin', { descriptionSize }),
    setOnWinColorSchemeEnabled: enabled => updateByPath('messages.onWin.colorScheme', { enabled }),
    setOnWinColorScheme: scheme => updateByPath('messages.onWin.colorScheme', { scheme }),
    setOnWinDiscountColors: (color, bgColor) =>
      updateByPath('messages.onWin.colorScheme', { discount: { color, bgColor } }),
    setOnWinPromoColors: (color, bgColor) =>
      updateByPath('messages.onWin.colorScheme', { promo: { color, bgColor } })
  }
}
