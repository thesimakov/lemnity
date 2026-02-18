import { useRef, useState, type CSSProperties } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { cn } from '@heroui/theme'

import AnnouncementWidget from './AnnouncementWidget'
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

  return (
    <div className="fixed bottom-6 right-6">
      {/* TODO: should i replace this with aswitch statement? */}
      {format === 'announcement' && (
        <>
          <span className="text-xs py-3.75">
            Главный экран
          </span>
          <div className="w-fit h-fit scale-40">
            <AnnouncementWidget variant='announcement' />
          </div>
        </>
      )}

      {format === 'countdown' && (
        <>
          <div
            ref={containerRef}
            className={cn(
              'w-fit h-fit',
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
            <CountdownAnnouncementWidget
              variant={countdownVariant}
              containerStyle={containerStyle}
              onCountdownScreenButtonPress={handleCountdownScreenButtonPress}
              onFormScreenButtonPress={handleFormScreenButtonPress}
            />
          </div>
        </>
      )}
    </div>
  )
}
