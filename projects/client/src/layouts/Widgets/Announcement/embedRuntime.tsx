import { useRef, useState, type CSSProperties } from 'react'
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

import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'
import { announcementWidgetDefaults } from './defaults'

const noBackgroundImageUrl = 'https://app.lemnity.ru/uploads/images/2026/01/2f539d8a-e1a6-4ced-a863-8e4aa37242d9-lemnity-pic.webp'

export const CountdownAnnouncementEmbedRuntime = () => {
  const {
    format,
    colorScheme,
    backgroundColor,
    borderRadius,

    contentType,
    contentAlignment,
    contentUrl,
  } = useWidgetSettingsStore(
    useShallow(s => {
      const widget = s.settings?.widget as AnnouncementWidgetType
      const appearence = widget.appearence
      const rewardMessageSettings = widget.rewardMessageSettings
      const infoSettings = widget.infoSettings

      return {
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
  const containerRef = useRef(null)

  useClickOutside(containerRef, () => setFocused(false))

  const [countdownVariant, setCountdownVariant] =
    useState<CountdownWidgetVariant>('countdown')

  const handleCountdownScreenButtonPress = () => setCountdownVariant('form')
  const handleFormScreenButtonPress = () => setCountdownVariant('reward')

  const [announementVariant, setAnnouncementVariant] =
    useState<AnnouncementWidgetVariant>('announcement')
  
  const handleAnnouncementButtonPress = () => setAnnouncementVariant('reward')

  return (
    <div
      data-lemnity-interactive
      className="fixed bottom-6 right-6"
    >
      {/* TODO: should i replace this with a switch statement? */}
        <>
          <div
            ref={containerRef}
            className={cn(
              'w-fit h-fit group',
              // 'origin-bottom-right',

              !focused && 'scale-40',
              !focused && 'translate-x-[30%] translate-y-[30%]',
              !focused && 'hover:scale-43',
              !focused && 'hover:translate-x-[28%] hover:translate-y-[28%]',
              !focused && '*:pointer-events-none',

              'transition-transform duration-300',
            )}
            // ✨ Magic ✨
            style={{ willChange: 'transform' }}
            onClick={() => setFocused(true)}
          >
            {format === 'countdown' && (
              <CountdownAnnouncementWidget
                variant={countdownVariant}
                focused={focused}
                containerStyle={containerStyle}
                onCountdownScreenButtonPress={handleCountdownScreenButtonPress}
                onFormScreenButtonPress={handleFormScreenButtonPress}
              />
            )}
            {format === 'announcement' && (
              <AnnouncementWidget
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
