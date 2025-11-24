import type { WidgetSettings } from './types'
import { mergeObjectsDeep } from './utils'
import { canonicalizeWidgetConfig } from '@lemnity/widget-config'

export function normalize(current: WidgetSettings, defaults: WidgetSettings): WidgetSettings {
  return mergeObjectsDeep(defaults, current)
}

export const trimInactiveBranches = (settings: WidgetSettings): WidgetSettings => {
  return canonicalizeWidgetConfig(settings) as WidgetSettings
}
