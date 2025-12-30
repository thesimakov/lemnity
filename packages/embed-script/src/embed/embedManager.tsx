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
import { ensureContainer, ensureElement, fetchPublicWidget } from './utils'
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
  private iframe: HTMLIFrameElement | null = null
  private interactiveRect: { left: number; top: number; width: number; height: number; padding?: number } | null = null
  private pointerLock = false
  private lastClipPath: string | null = null
  
  private handleResize = () => {
    this.syncFrameInteractivity(true)
  }

  private handleMessage = (event: MessageEvent) => {
    const scopeOk = event.data && typeof event.data === 'object' && event.data.scope === 'lemnity-embed'
    if (!scopeOk) return

    const fromIframe = event.source === this.iframe?.contentWindow

    if (fromIframe) {
      this.handleChildMessage(event.data)
      return
    }

    // Forward external messages with our scope into the iframe
    if (this.iframe?.contentWindow) {
      this.iframe.contentWindow.postMessage(event.data, '*')
    }
  }

  private handleChildMessage(data: unknown) {
    if (!data || typeof data !== 'object') return
    const message = data as { type?: string; rect?: { left: number; top: number; width: number; height: number; padding?: number }; lock?: boolean }
    if (message.type === 'interactive-region') {
      this.interactiveRect = message.rect ?? null
      this.pointerLock = Boolean(message.lock)
      this.syncFrameInteractivity(true)
    }
  }

  private syncFrameInteractivity(force = false) {
    if (!this.iframe) return

    const setClipPath = (clipPath: string | null) => {
      if (!clipPath) {
        this.iframe!.style.clipPath = ''
        ;(this.iframe!.style as CSSStyleDeclaration & { WebkitClipPath?: string }).WebkitClipPath = ''
        this.lastClipPath = null
        return
      }
      if (this.lastClipPath === clipPath && !force) return
      this.iframe!.style.clipPath = clipPath
      ;(this.iframe!.style as CSSStyleDeclaration & { WebkitClipPath?: string }).WebkitClipPath = clipPath
      this.lastClipPath = clipPath
    }

    const vw = window.innerWidth
    const vh = window.innerHeight
    if (!vw || !vh) return

    if (this.pointerLock) {
      this.iframe!.style.pointerEvents = 'auto'
      setClipPath('inset(0px 0px 0px 0px)')
      return
    }

    if (!this.interactiveRect) {
      this.iframe!.style.pointerEvents = 'none'
      setClipPath('inset(100% 100% 100% 100%)')
      return
    }

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
    const { left, top, width, height, padding = 24 } = this.interactiveRect
    const x1 = clamp(left - padding, 0, vw)
    const y1 = clamp(top - padding, 0, vh)
    const x2 = clamp(left + width + padding, 0, vw)
    const y2 = clamp(top + height + padding, 0, vh)

    const topInset = y1
    const leftInset = x1
    const rightInset = Math.max(0, vw - x2)
    const bottomInset = Math.max(0, vh - y2)

    this.iframe!.style.pointerEvents = 'auto'
    setClipPath(`inset(${topInset}px ${rightInset}px ${bottomInset}px ${leftInset}px)`)
  }

  async init(options: InitOptions) {
    try {
      const { widgetId } = options
      await this.destroy()

      const payload = await fetchPublicWidget(widgetId)
      if (!payload.enabled) throw new Error('Widget is disabled')
      if (!payload.config) throw new Error('Widget config is empty')
      const widgetType = (payload.config.widgetType as WidgetTypeEnum | undefined) ?? payload.type
      if (!widgetType) throw new Error('Widget type is missing')

      useWidgetSettingsStore.getState().init(widgetId, widgetType, payload.projectId, payload.config)

      const container = ensureContainer(widgetId)
      const iframe = document.createElement('iframe')
      iframe.setAttribute('data-lemnity-embed-frame', 'true')

      Object.assign(iframe.style, {
        border: 'none',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        inset: '0',
        background: 'transparent',
        colorScheme: 'light',
        zIndex: '2147483001',
        pointerEvents: 'none',
        clipPath: 'inset(100% 100% 100% 100%)'
      })
      
      iframe.srcdoc = `<!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light dark">
        </head>
        <body style="margin:0;padding:0;background:transparent;">
          <div id="lemnity-root-host"></div>
          <script>
            (() => {
              const SCOPE = 'lemnity-embed'
              const selectors = [
                'button',
                'a[href]',
                '[role="button"]',
                '[data-lemnity-interactive]',
                'input:not([type="hidden"])',
                'select',
                'textarea',
                '[tabindex]:not([tabindex="-1"])'
              ].join(',')

              const getScopeRoot = () => document.getElementById('lemnity-theme-root') || document

              const post = (rect, lock = false) => {
                window.parent?.postMessage({ scope: SCOPE, type: 'interactive-region', rect, lock }, '*')
              }

              const toRect = el => {
                if (!el) return null
                const r = el.getBoundingClientRect()
                if (!r || (r.width === 0 && r.height === 0)) return null
                return { left: r.left, top: r.top, width: r.width, height: r.height }
              }

              const fallbackRect = () => {
                const size = 240
                return {
                  left: Math.max(0, window.innerWidth - size - 16),
                  top: Math.max(0, window.innerHeight - size - 16),
                  width: size,
                  height: size
                }
              }

              const mergeRects = rects => {
                const list = rects.filter(Boolean)
                if (!list.length) return null
                const left = Math.min(...list.map(r => r.left))
                const top = Math.min(...list.map(r => r.top))
                const right = Math.max(...list.map(r => r.left + r.width))
                const bottom = Math.max(...list.map(r => r.top + r.height))
                return { left, top, width: right - left, height: bottom - top }
              }

              const hasModal = () => {
                const modalSelector = '[aria-modal="true"],dialog[open],[role="dialog"],[data-lemnity-modal],.ReactModal__Content'
                const root = getScopeRoot()
                const el = root.querySelector(modalSelector)
                if (!el) return false
                const style = window.getComputedStyle(el)
                if (style.display === 'none') return false
                if (style.visibility === 'hidden') return false
                if (style.pointerEvents === 'none') return false
                if (el.getAttribute('aria-hidden') === 'true') return false
                const r = el.getBoundingClientRect()
                if (!r || (r.width === 0 && r.height === 0)) return false
                return true
              }

              let scheduled = false
              const schedule = () => {
                if (scheduled) return
                scheduled = true
                requestAnimationFrame(() => {
                  scheduled = false
                  const lock = hasModal()
                  const scope = getScopeRoot()
                  const merged = mergeRects(Array.from(scope.querySelectorAll(selectors)).map(toRect))
                  const rect = lock
                    ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
                    : merged ?? fallbackRect()
                  post(rect, lock)
                })
              }

              const mo = new MutationObserver(schedule)
              mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'class', 'open', 'aria-hidden', 'aria-modal'] })

              const ro = new ResizeObserver(schedule)
              ro.observe(document.documentElement)

              window.addEventListener('resize', schedule)
              window.addEventListener('focus', schedule, true)
              window.addEventListener('blur', schedule, true)
              window.addEventListener('pointerenter', schedule, true)
              window.addEventListener('pointerleave', schedule, true)

              schedule()
            })();
          </script>
        </body>
        </html>`

      container.appendChild(iframe)

      // Wait for iframe to load
      await new Promise<void>(resolve => {
        iframe.onload = () => resolve()
      })

      const iframeDoc = iframe.contentDocument
      if (!iframeDoc) throw new Error('Iframe document is not accessible')

      window.addEventListener('message', this.handleMessage)
      window.addEventListener('resize', this.handleResize, { passive: true })
      this.iframe = iframe
      this.pointerLock = false
      this.interactiveRect = null
      this.lastClipPath = null
      this.syncFrameInteractivity(true)


      const target = iframeDoc.body

// 1) Styles inside iframe document
ensureElement(iframeDoc.head, 'style[data-lemnity-embed]', (doc: Document) => {
  const styleTag = doc.createElement('style')
  styleTag.setAttribute('data-lemnity-embed', 'true')
  styleTag.textContent = styles
  return styleTag
})

// 2) Theme root
const themeRoot = ensureElement(target, '#lemnity-theme-root', (doc: Document) => {
  const div = doc.createElement('div')
  div.id = 'lemnity-theme-root'
  return div
})

// 3) React mount point
const mountNode = ensureElement(themeRoot, '.lemnity-embed-root', (doc: Document) => {
  const div = doc.createElement('div')
  div.className = 'lemnity-embed-root'
  return div
})

// 4) Portal root
const modalPortalRoot = ensureElement(themeRoot, '#lemnity-modal-root', (doc: Document) => {
  const div = doc.createElement('div')
  div.id = 'lemnity-modal-root'
  return div
})
      // Рендерим React дерево в документ фрейма
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
      // Удаляем весь контейнер вместе с iframe
      if (this.container.parentElement) {
        this.container.parentElement.removeChild(this.container)
      }
    }
    if (this.iframe) {
      window.removeEventListener('message', this.handleMessage)
      window.removeEventListener('resize', this.handleResize)
    }
    useWidgetSettingsStore.getState().reset()
    this.root = null
    this.container = null
    this.widgetId = null
    this.iframe = null
    this.interactiveRect = null
    this.pointerLock = false
    this.lastClipPath = null
  }

  postMessage(message: unknown) {
    if (!this.iframe?.contentWindow) return
    this.iframe.contentWindow.postMessage(
      {
        scope: 'lemnity-embed',
        ...((message && typeof message === 'object') ? message : { payload: message })
      },
      '*'
    )
  }
}

export default EmbedManager
