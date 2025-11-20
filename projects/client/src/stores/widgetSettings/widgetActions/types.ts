import type { WidgetTypeEnum } from '@lemnity/api-sdk'
import type {
  ActionTimerWidgetSettings,
  ActionTimerImagePosition,
  ColorScheme,
  MessageKey,
  SectorItem,
  WidgetSpecificSettings
} from '@/stores/widgetSettings/types'

export type WidgetUpdater = (
  mutator: (settings: WidgetSpecificSettings) => WidgetSpecificSettings
) => void

export type TypedWidgetUpdater<T extends WidgetSpecificSettings> = (
  mutator: (settings: T) => T
) => void

export type WidgetActions = {
  setWidgetType: (widgetType: WidgetTypeEnum, nextSettings: WidgetSpecificSettings) => void
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
  updateActionTimer: (updates: Partial<ActionTimerWidgetSettings['countdown']>) => void
  setActionTimerImage: (imageUrl?: string) => void
  setTextBeforeCountdown: (textBeforeCountdown: string) => void
  setTextBeforeCountdownColor: (textBeforeCountdownColor: string) => void
  setImagePosition: (position: ActionTimerImagePosition) => void
  setWheelBorderColor: (color: string) => void
  setWheelBorderThickness: (thickness: number) => void
}

export type WidgetSlice = {
  widgetSettingsUpdater: WidgetUpdater
} & WidgetActions
