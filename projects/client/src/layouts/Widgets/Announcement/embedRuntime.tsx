import {
  useRef,
  useState,
  useEffect,
  type CSSProperties,
} from 'react'
import { useShallow } from 'zustand/react/shallow'
import { cn } from '@heroui/theme'

import AnnouncementWidget, {
  type AnnouncementWidgetVariant,
} from './AnnouncementWidget'
import CountdownAnnouncementWidget, {
  type CountdownWidgetVariant,
} from './CountdownAnnouncementWidget'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import useUrlImageOrDefault from './utils/useUrlImage'
import useClickOutside from '@/hooks/useClickOutside'
import { sendEvent, sendPublicRequest } from '@/common/api/publicApi'

import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'
import type { CountdownForm } from './CountdownFormScreen'
import { announcementWidgetDefaults } from './defaults'

const noBackgroundImageUrl = 'https://app.lemnity.ru/uploads/images/2026/01/2f539d8a-e1a6-4ced-a863-8e4aa37242d9-lemnity-pic.webp'

type EmbedRuntimeProps = {
  isPreview?: boolean
}

export const CountdownAnnouncementEmbedRuntime = (
  props: EmbedRuntimeProps
) => {
  const {
    widgetId,
    projectId,

    format,
    colorScheme,
    backgroundColor,
    borderRadius,

    contentType,
    contentAlignment,
    contentUrl,

    rewardScreenEnabled,
  } = useWidgetSettingsStore(
    useShallow(s => {
      const widget = s.settings?.widget as AnnouncementWidgetType
      const appearence = widget.appearence
      const rewardMessageSettings = widget.rewardMessageSettings
      const infoSettings = widget.infoSettings

      return {
        widgetId: s.settings?.id,
        projectId: s.projectId,

        format: appearence.format,
        colorScheme: appearence.colorScheme,
        backgroundColor: appearence.backgroundColor,
        borderRadius: appearence.borderRadius,

        contentType: infoSettings.contentType,
        contentAlignment: infoSettings.contentAlignment,
        contentUrl: infoSettings.contentUrl,

        rewardScreenEnabled: rewardMessageSettings.rewardScreenEnabled,
      }
    })
  )

  const {
    base64Image: contentBase64Image,
    // error,
    isLoading,
  } = useUrlImageOrDefault(contentUrl)

  const containerStyle: CSSProperties = {
    backgroundColor: colorScheme === 'primary'
      ? format === 'announcement' ? '#FFFFFF' : '#725DFF'
      : backgroundColor && backgroundColor.length !== 0
          ? backgroundColor
          : announcementWidgetDefaults.appearence.backgroundColor,
    borderRadius: borderRadius
      ?? announcementWidgetDefaults.appearence.borderRadius,
  }

  const backgroundImage = contentUrl && !isLoading
    ? contentBase64Image as string
    : noBackgroundImageUrl

  if (contentType === 'background') {
    containerStyle.backgroundImage = `url('${backgroundImage}')`
    containerStyle.backgroundSize = 'cover'
    containerStyle.backgroundPosition = contentAlignment
  }

  const [focused, setFocused] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetRef = useRef<HTMLDivElement | null>(null)

  useClickOutside(containerRef, () => {
    setFocused(false)

    if (!widgetId || !projectId || props.isPreview) {
      return
    }

    void sendEvent({
      event_name: format === 'countdown'
        ? 'countdown.close'
        : 'announcement.close',
      widget_id: widgetId,
      project_id: projectId,
    })
  })

  /** Sets the widget to "focused" state on click while minified */
  const handleFocusClick = () => {
    setFocused(true)

    if (!widgetId || !projectId || focused || props.isPreview) {
      return
    }

    void sendEvent({
      event_name: format === 'countdown'
        ? 'countdown.open'
        : 'announcement.open',
      widget_id: widgetId,
      project_id: projectId,
    })
  }

  const [countdownVariant, setCountdownVariant] =
    useState<CountdownWidgetVariant>('countdown')

  const handleCountdownScreenButtonPress = () => {
    if (rewardScreenEnabled) {
      setCountdownVariant('form')
    }
    
    if (!widgetId || !projectId || format !== 'countdown' || props.isPreview) {
      return
    }

    void sendEvent({
      event_name: rewardScreenEnabled
        ? 'countdown.transition_to_form'
        : 'countdown.link_opened',
      widget_id: widgetId,
      project_id: projectId,
    })
  }

  const handleFormScreenButtonPress = (formData: CountdownForm) => {
    setCountdownVariant('reward')

    if (!widgetId || !projectId || format !== 'countdown' || props.isPreview) {
      return
    }

    void sendEvent({
      event_name: 'countdown.transition_to_reward',
      widget_id: widgetId,
      project_id: projectId,
      payload: formData,
    })

    void sendPublicRequest({
      widgetId: widgetId,
      fullName: formData.name,
      phone: formData.phone,
      email: formData.email,
      url: window.location.href,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
    })
  }

  const [announementVariant, setAnnouncementVariant] =
    useState<AnnouncementWidgetVariant>('announcement')

  const handleAnnouncementButtonPress = () => {
    if (rewardScreenEnabled) {
      setAnnouncementVariant('reward')
    }

    if (
      !widgetId
      || !projectId
      || format !== 'announcement'
      || props.isPreview
    ) {
      return
    }

    void sendEvent({
      event_name: rewardScreenEnabled
        ? 'announcement.transition_to_reward'
        : 'announcement.link_opened',
      widget_id: widgetId,
      project_id: projectId,
    })
  }

  const sendBoundingRectToIframe = (rect: DOMRect, offset: number) => {
    window.parent.postMessage({
      scope: 'lemnity-embed',
      type: 'interactive-region',
      lock: false,
      rect: {
        left: window.innerWidth - rect.width - offset,
        top: window.innerHeight - rect.height - offset,
        width: rect.width,
        height: rect.height,
      },
    })
  }

  const handleMouseEnter = () => {
    if (focused || !containerRef.current) {
      return
    }
    sendBoundingRectToIframe(containerRef.current.getBoundingClientRect(), 24)
  }

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (focused || !containerRef.current) {
        return
      }
      sendBoundingRectToIframe(containerRef.current.getBoundingClientRect(), 16)
    }, 250) // 300 ms delay due to 'duration-300'
  }

  useEffect(() => {
    if (!widgetRef.current) {
      return
    }

    const boundingRect = widgetRef.current.getBoundingClientRect()
  
    if (focused) {
      sendBoundingRectToIframe(boundingRect, 24)
      return
    }

    setTimeout(() => {
      if (!containerRef.current) {
        return
      }

      sendBoundingRectToIframe(containerRef.current.getBoundingClientRect(), 16)
    }, 250) // 300 ms delay due to 'duration-300'
  }, [focused])

  return (
    <div
      data-lemnity-interactive
      // this isn't exatly the cleanest solution
      // but i am content with it for now
      // 
      // a marker to apply custom logic to in embedManager.tsx
      data-lemnity-announcement
      className='fixed bottom-6 right-6 pointer-events-none'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* TODO: should i replace this with a switch statement? */}
        <>
          <div
            ref={containerRef}
            className={cn(
              'w-fit h-fit group',
              'origin-bottom-right',

              !focused && 'scale-40',
              // !focused && 'translate-x-[30%] translate-y-[30%]',
              !focused && 'hover:scale-43',
              // !focused && 'hover:translate-x-[28%] hover:translate-y-[28%]',
              !focused && '*:pointer-events-none',
              'pointer-events-auto cursor-pointer',

              'transition-transform duration-250',
            )}
            // ✨ Magic ✨
            style={{ willChange: 'transform' }}
            onClick={handleFocusClick}
          >
            {format === 'countdown' && (
              <CountdownAnnouncementWidget
                ref={widgetRef}
                variant={countdownVariant}
                focused={focused}
                containerStyle={containerStyle}
                onCountdownScreenButtonPress={handleCountdownScreenButtonPress}
                onFormScreenButtonPress={handleFormScreenButtonPress}
              />
            )}
            {format === 'announcement' && (
              <AnnouncementWidget
                ref={widgetRef}
                variant={announementVariant}
                focused={focused}
                onButtonPress={handleAnnouncementButtonPress}
              />
            )}
          </div>
        </>
    </div>
  )
}
