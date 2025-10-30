import type { StateCreator } from 'zustand'

export type ButtonPosition = 'bottom-left' | 'top-right' | 'bottom-right'
export type StartShowing = 'onClick' | 'timer'
export type IconType = 'image' | 'button'
export type HideIcon = 'always' | 'afterFormSending'
export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
export type FrequencyMode = 'everyPage' | 'periodically'
export type FrequencyUnit = 'sec' | 'min'
export type ContactField = 'phone' | 'email' | 'name'
export type MessageKey = 'onWin' | 'limitShows' | 'limitWins' | 'allPrizesGiven'
export type ColorScheme = 'primary' | 'custom'
export type ContentPosition = 'left' | 'right'
export type WindowFormat = 'sidePanel' | 'modalWindow'
export type SectorItemMode = 'text' | 'icon'

export type SectorItem = {
  id: string
  mode: SectorItemMode
  text?: string
  icon?: string
  color: string
  promo?: string
  chance?: number
}

export type FormSettings = {
  companyLogo: { enabled: boolean; fileName?: string; url?: string }
  template: {
    enabled: boolean
    key?: string
    templateSettings?: {
      image: { enabled: boolean; fileName?: string; url?: string }
      windowFormat: WindowFormat
      contentPosition: ContentPosition
      colorScheme: ColorScheme
      customColor: string
    }
  }
  formTexts: {
    title: { text: string; color: string }
    description: { text: string; color: string }
    button: { text: string; color: string }
  }
  countdown: { enabled: boolean; endDate?: Date }
  contacts: {
    phone: { enabled: boolean; required: boolean }
    email: { enabled: boolean; required: boolean }
    name: { enabled: boolean; required: boolean }
  }
  agreement: { enabled: boolean; text: string; policyUrl: string }
  adsInfo: { enabled: boolean; text: string; policyUrl: string }
  sectors: {
    randomize: boolean
    items: SectorItem[]
  }
  messages: {
    onWin: { enabled: boolean; text: string }
    limitShows: { enabled: boolean; text: string }
    limitWins: { enabled: boolean; text: string }
    allPrizesGiven: { enabled: boolean; text: string }
  }
}

export type DisplaySettings = {
  startShowing: StartShowing
  timer: { delayMs: number }
  icon: {
    type: IconType
    image?: { fileName: string; url: string }
    button?: {
      text: string
      buttonColor: string
      textColor: string
    }
    position: ButtonPosition
    hide: HideIcon
  }
  weekdays: { enabled: boolean; days: DayKey[]; weekdaysOnly: boolean }
  showRules: {
    onExit: boolean
    scrollBelow: { enabled: boolean; percent: number | null }
    afterOpen: { enabled: boolean; seconds: number | null }
  }
  frequency: { mode: FrequencyMode; value?: number; unit?: FrequencyUnit }
  dontShow: { afterWin: boolean; afterShows: number | null }
  limits: { afterWin: boolean; afterShows: number | null }
  schedule: {
    date: { enabled: boolean; value: string }
    time: { enabled: boolean; value: string }
  }
}

export type IntegrationSettings = {
  scriptSnippet: string
}

export type WidgetSettings = {
  id: string
  form: FormSettings
  display: DisplaySettings
  integration: IntegrationSettings
}

// Utility types for slice creators
export type FormUpdater = (mutator: (s: FormSettings) => FormSettings) => void
export type DisplayUpdater = (mutator: (s: DisplaySettings) => DisplaySettings) => void
export type IntegrationUpdater = (mutator: (s: IntegrationSettings) => IntegrationSettings) => void

export type WidgetSettingsState = {
  settings: WidgetSettings
}

export type StoreSlice<T> = StateCreator<T, [], [], T>
