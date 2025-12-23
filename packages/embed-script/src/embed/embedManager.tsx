import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { WidgetTypeEnum } from '@lemnity/api-sdk'
import styles from './embed.css?inline'
import { getWidgetDefinition } from '@/layouts/Widgets/registry'
import { FABMenuEmbedRuntime } from '@/layouts/Widgets/FABMenu/embedRuntime'
import { WheelEmbedRuntime } from '@/layouts/Widgets/WheelOfFortune/embedRuntime'
import { ActionTimerEmbedRuntime } from '@/layouts/Widgets/CountDown/embedRuntime'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type { InitOptions } from './types'
import { ensureAttr, ensureContainer, ensureElement, fetchPublicWidget } from './utils'
import { HeroUIProvider } from '@heroui/system'
import { ModalPortalProvider } from '@/components/Modal/Modal'
import { UNSAFE_PortalProvider } from '@react-aria/overlays'

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
    try {
      const { widgetId } = options
      await this.destroy()

      const payload = await fetchPublicWidget(widgetId)
      if (!payload.enabled) throw new Error('Widget is disabled')
      if (!payload.config) throw new Error('Widget config is empty')
      const widgetType = (payload.config.widgetType as WidgetTypeEnum | undefined) ?? payload.type
      if (!widgetType) throw new Error('Widget type is missing')

      useWidgetSettingsStore.getState().init(widgetId, widgetType, payload.config)

      const container = ensureContainer(widgetId)
      const shadow = container.shadowRoot ?? container.attachShadow({ mode: 'open' })

      // 1) Styles inside Shadow DOM
      ensureElement(shadow, 'style[data-lemnity-embed]', () => {
        const styleTag = document.createElement('style')
        styleTag.setAttribute('data-lemnity-embed', 'true')
        styleTag.textContent = styles
        shadow.appendChild(styleTag)
        return styleTag
      })

      // 2) Theme root (HeroUI tokens are scoped to `:root` + `[data-theme]`)
      const themeRoot = ensureElement(shadow, '#lemnity-theme-root', () => {
        const div = document.createElement('div')
        div.id = 'lemnity-theme-root'
        shadow.appendChild(div)
        return div
      })
      ensureAttr(themeRoot, 'data-theme', 'light')

      // 3) React mount point
      const mountNode = ensureElement(themeRoot, '.lemnity-embed-root', () => {
        const div = document.createElement('div')
        div.className = 'lemnity-embed-root'
        themeRoot.appendChild(div)
        return div
      })
      // Back-compat if any selectors rely on `[data-theme]` on the mount node
      ensureAttr(mountNode, 'data-theme', themeRoot.getAttribute('data-theme') ?? 'light')

      // 4) Portal root for our Modal + React Aria overlays
      const modalPortalRoot = ensureElement(themeRoot, '#lemnity-modal-root', () => {
        const div = document.createElement('div')
        div.id = 'lemnity-modal-root'
        themeRoot.appendChild(div)
        return div
      })
      ensureAttr(modalPortalRoot, 'data-theme', themeRoot.getAttribute('data-theme') ?? 'light')

      const root = createRoot(mountNode)
      root.render(
        <React.StrictMode>
          <UNSAFE_PortalProvider getContainer={() => modalPortalRoot}>
            <ModalPortalProvider value={modalPortalRoot}>
              <HeroUIProvider>
                <EmbedRuntime widgetType={widgetType} />
              </HeroUIProvider>
            </ModalPortalProvider>
          </UNSAFE_PortalProvider>
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
    if (this.container) {
      const shadow = this.container.shadowRoot
      // If we can't remove the host container (e.g. it existed before embed init),
      // ensure we still clean up our Shadow DOM artifacts.
      if (shadow) {
        shadow.querySelector('style[data-lemnity-embed]')?.remove()
        shadow.querySelector('#lemnity-theme-root')?.remove()
      }

      // Only remove the host container if we created it.
      if (
        this.container.parentElement &&
        this.container.getAttribute('data-lemnity-embed-container') === 'true'
      ) {
        this.container.parentElement.removeChild(this.container)
      }
    }
    useWidgetSettingsStore.getState().reset()
    this.root = null
    this.container = null
    this.widgetId = null
  }
}

export default EmbedManager
