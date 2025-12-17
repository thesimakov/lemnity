import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type { WidgetSettings } from '@/stores/widgetSettings/types'
import type { PreviewMode } from '@/stores/widgetPreviewStore'

export type InitOptions = {
  widgetId: string
  mode?: PreviewMode
  container?: string | HTMLElement
  apiBase?: string
}

export type PublicWidgetResponse = {
  id: string
  projectId: string
  type: WidgetTypeEnum
  enabled: boolean
  config: WidgetSettings | null
}