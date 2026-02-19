import type { CSSProperties } from 'react'
import { useShallow } from 'zustand/react/shallow'

import AnnouncementWidget from './AnnouncementWidget'
import CountdownAnnouncementWidget from './CountdownAnnouncementWidget'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import useUrlImageOrDefault from './utils/useUrlImage'

import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'
import { announcementWidgetDefaults } from './defaults'

const noBackgroundImageUrl = 'https://app.lemnity.ru/uploads/images/2026/01/2f539d8a-e1a6-4ced-a863-8e4aa37242d9-lemnity-pic.webp'

const AnnouncementPreview = () => {
  const {
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

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {format === 'announcement' && (
        <>
          <span className="text-xs py-3.75">
            Главный экран
          </span>
          <div className="w-fit h-fit scale-40 -translate-y-[31%]">
            <AnnouncementWidget variant='announcement' />
          </div>

          {rewardScreenEnabled && (
            <>
              <span className="text-xs py-3.75 -translate-y-79.5">
                Экран выигрыша
              </span>
              <div className="w-fit h-fit scale-40 -translate-y-[92%]">
                <AnnouncementWidget variant='reward' />
              </div>
            </>
          )}
        </>
      )}

      {format === 'countdown' && (
        <div className="flex flex-col gap-2 h-full">
          <span className="text-xs">
            Главный экран
          </span>
          <div className="w-fit scale-40 origin-top-left" style={{height: '210px'}}>
            <CountdownAnnouncementWidget
              variant="countdown"
              containerStyle={containerStyle}
            />
          </div>

          <span className="text-xs">
            Экран формы
          </span>
          <div className="w-fit scale-40 origin-top-left" style={{height: '210px'}}>
            <CountdownAnnouncementWidget
              variant="form"
              containerStyle={containerStyle}
            />
          </div>

          <span className="text-xs">
            Экран выигрыша
          </span>
          <div className="w-fit scale-40 origin-top-left" style={{height: '51.8px'}}>
            <CountdownAnnouncementWidget
              variant="reward"
              containerStyle={containerStyle}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AnnouncementPreview
