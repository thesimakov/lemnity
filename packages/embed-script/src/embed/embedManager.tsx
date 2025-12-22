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
import type { InitOptions } from './types'
import { ensureContainer, fetchPublicWidget } from './utils'
import { HeroUIProvider } from '@heroui/system'
import { ModalPortalProvider } from '@/components/Modal/Modal'

const EmbedRuntime = ({ widgetType }: { widgetType: WidgetTypeEnum }) => {
  switch (widgetType) {
    case WidgetTypeEnum.FAB_MENU:
      return <FABMenuEmbedRuntime />
    case WidgetTypeEnum.WHEEL_OF_FORTUNE:
      return <WheelEmbedRuntime />
    case WidgetTypeEnum.ACTION_TIMER:
      return <ActionTimerEmbedRuntime />
    default:
      return <EmbeddedWidget widgetType={widgetType} />
  }
}

export const EmbeddedWidget = ({
  widgetType
}: {
  widgetType: WidgetTypeEnum
}) => {
  const definition = getWidgetDefinition(widgetType)
  const PanelComponent = definition?.preview?.panel
  if (!PanelComponent) return null
  return <PanelComponent mode="desktop"/>
}

class EmbedManager {
  private root: Root | null = null
  private container: HTMLElement | null = null
  private widgetId: string | null = null

  async init(options: InitOptions) {
    try{
    const { widgetId } = options
    await this.destroy()

    const payload = await fetchPublicWidget(widgetId)
    if (!payload.enabled) throw new Error('Widget is disabled')
    if (!payload.config) throw new Error('Widget config is empty')
    const widgetType = (payload.config.widgetType as WidgetTypeEnum | undefined) ?? payload.type
    if (!widgetType) throw new Error('Widget type is missing')

    const store = useWidgetSettingsStore.getState()
    store.init(widgetId, widgetType, payload.config)

    const container = ensureContainer(widgetId)
    const shadow = container.shadowRoot ?? container.attachShadow({ mode: 'open' })

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

    const modalPortalRoot =
      shadow.querySelector<HTMLElement>('#lemnity-modal-root') ??
      (() => {
        const div = document.createElement('div')
        div.id = 'lemnity-modal-root'
        shadow.appendChild(div)
        return div
      })()

    const root = createRoot(mountNode)
    root.render(
      <React.StrictMode>
        <ModalPortalProvider value={modalPortalRoot}>
          <HeroUIProvider>
            <EmbedRuntime widgetType={widgetType} />
          </HeroUIProvider>
        </ModalPortalProvider>
      </React.StrictMode>
    )

    this.root = root
    this.container = container
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
