import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { WidgetTypeEnum } from '@lemnity/api-sdk'
import styles from './embed.css?inline'
import baseStyles from '@/index.css?inline'
import { getWidgetDefinition } from '@/layouts/Widgets/registry'
import { FABMenuEmbedRuntime } from '@/layouts/Widgets/FABMenu/embedRuntime'
import { WheelEmbedRuntime } from '@/layouts/Widgets/WheelOfFortune/embedRuntime'
import { ActionTimerEmbedRuntime } from '@/layouts/Widgets/CountDown/embedRuntime'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type { PreviewMode } from '@/stores/widgetPreviewStore'
import { getApiBase } from './utils'
import type { InitOptions, PublicWidgetResponse } from './types'

const buildPublicWidgetUrl = (widgetId: string) => {
  const base = getApiBase().replace(/\/$/, '')
  return `${base}/public/widgets/${encodeURIComponent(widgetId)}`
}

const fetchPublicWidget = async (widgetId: string): Promise<PublicWidgetResponse> => {
  const res = await fetch(buildPublicWidgetUrl(widgetId), {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) {
    throw new Error(`Failed to load widget ${widgetId}: ${res.status}`)
  }
  const contentType = res.headers.get('content-type')?.toLowerCase() ?? ''
  if (!contentType.includes('application/json')) {
    const body = await res.text().catch(() => '')
    throw new Error(
      `Failed to load widget ${widgetId}: expected JSON, got ${contentType || 'unknown'}${
        body ? ` - ${body.slice(0, 120)}` : ''
      }`
    )
  }
  return (await res.json()) as PublicWidgetResponse
}

const ensureContainer = (target: string | HTMLElement | undefined, widgetId: string) => {
  if (target instanceof HTMLElement) return target
  if (typeof target === 'string') {
    const existing = document.querySelector<HTMLElement>(target)
    if (existing) return existing
  }
  const el = document.createElement('div')
  el.id = `lemnity-widget-${widgetId}`
  el.style.zIndex = '2147483000'
  el.style.display = 'block'
  el.style.position = 'fixed'
  document.body.appendChild(el)
  return el
}

const EmbedRuntime = ({ widgetType, mode }: { widgetType: WidgetTypeEnum; mode: PreviewMode }) => {
  switch (widgetType) {
    case WidgetTypeEnum.FAB_MENU:
      return <FABMenuEmbedRuntime />
    case WidgetTypeEnum.WHEEL_OF_FORTUNE:
      return <WheelEmbedRuntime />
    case WidgetTypeEnum.ACTION_TIMER:
      return <ActionTimerEmbedRuntime />
    default:
      return <EmbeddedWidget widgetType={widgetType} mode={mode} />
  }
}

export const EmbeddedWidget = ({
  widgetType,
  mode
}: {
  widgetType: WidgetTypeEnum
  mode: PreviewMode
}) => {
  const definition = getWidgetDefinition(widgetType)
  const PanelComponent = definition?.preview?.panel
  if (!PanelComponent) return null
  return <PanelComponent mode={mode} />
}

class EmbedManager {
  private root: Root | null = null
  private container: HTMLElement | null = null
  private widgetId: string | null = null

  async init(options: InitOptions) {
    try{
    const { widgetId, mode = 'desktop', container } = options
    await this.destroy()

    const payload = await fetchPublicWidget(widgetId)
    if (!payload.enabled) throw new Error('Widget is disabled')
    if (!payload.config) throw new Error('Widget config is empty')
    const widgetType = (payload.config.widgetType as WidgetTypeEnum | undefined) ?? payload.type
    if (!widgetType) throw new Error('Widget type is missing')

    const store = useWidgetSettingsStore.getState()
    store.init(widgetId, widgetType, payload.config)

    const host = ensureContainer(container, widgetId)
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' })

    // Inject styles into shadow
    if (!shadow.querySelector('style[data-lemnity-embed]')) {
      const styleTag = document.createElement('style')
      styleTag.setAttribute('data-lemnity-embed', 'true')
      styleTag.textContent = `${styles}\n${baseStyles}`
      shadow.appendChild(styleTag)
    }

    const mountNode =
      shadow.querySelector<HTMLElement>('.lemnity-embed-root') ??
      (() => {
        const div = document.createElement('div')
        div.className = 'lemnity-embed-root'
        shadow.appendChild(div)
        return div
      })()

    const root = createRoot(mountNode)
    root.render(
      <React.StrictMode>
        <EmbedRuntime widgetType={widgetType} mode={mode} />
      </React.StrictMode>
    )

    this.root = root
    this.container = host
    this.widgetId = widgetId
    } catch (error) {
      console.error('Error initializing embed manager', error)
    }
  }

  async destroy(widgetId?: string) {
    if (widgetId && this.widgetId && widgetId !== this.widgetId) return
    if (this.root) {
      this.root.unmount()
    }
    if (this.container && this.container.parentElement) {
      this.container.parentElement.removeChild(this.container)
    }
    useWidgetSettingsStore.getState().reset()
    this.root = null
    this.container = null
    this.widgetId = null
  }
}

export default EmbedManager
