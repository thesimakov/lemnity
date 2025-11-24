import type { WidgetTypeId } from './widgets/base.js'

export type MutableWidgetSettings = Record<string, unknown> & {
  widgetType?: string
  widget?: Record<string, unknown> & { type?: string }
  display?: Record<string, unknown>
  fields?: Record<string, unknown>
  integration?: Record<string, unknown>
}

export type WidgetCanonicalizer = (settings: MutableWidgetSettings) => MutableWidgetSettings

export type CanonicalizerMap = Partial<Record<WidgetTypeId, WidgetCanonicalizer>>


