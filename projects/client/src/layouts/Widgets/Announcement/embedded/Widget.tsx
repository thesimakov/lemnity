import type { Ref, CSSProperties } from 'react'
import { useShallow } from 'zustand/react/shallow'

import AnnouncementWidget, {
  type AnnouncementWidgetVariant,
} from '../AnnouncementWidget'
import CountdownAnnouncementWidget, {
  type CountdownWidgetVariant,
} from '../CountdownAnnouncementWidget'

import { useIsMobileViewport } from '@/hooks/useIsMobileViewport'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import useUrlImageOrDefault from '../utils/useUrlImage'

import type { AnnouncementWidgetType } from '@lemnity/widget-config/widgets/announcement'
import type { CountdownForm } from '../CountdownFormScreen'
import { announcementWidgetDefaults } from '../defaults'

const noBackgroundImageUrl = 'https://app.lemnity.ru/uploads/images/2026/01/2f539d8a-e1a6-4ced-a863-8e4aa37242d9-lemnity-pic.webp'

export type WidgetProps = {
  ref: Ref<HTMLDivElement>
  focused: boolean
  countdownVariant: CountdownWidgetVariant
  announementVariant: AnnouncementWidgetVariant
  onCountdownScreenButtonPress: () => void
  onFormScreenButtonPress: (formData: CountdownForm) => void
  onAnnouncementButtonPress: () => void
}

const Widget = ({ref, ...props}: WidgetProps) => {
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
      const infoSettings = widget.infoSettings

      return {
        format: appearence.format,
        colorScheme: appearence.colorScheme,
        backgroundColor: appearence.backgroundColor,
        borderRadius: appearence.borderRadius,

        contentType: infoSettings.contentType,
        contentAlignment: infoSettings.contentAlignment,
        contentUrl: infoSettings.contentUrl,
      }
    })
  )

  const {
    base64Image: contentBase64Image,
    // error,
    isLoading,
  } = useUrlImageOrDefault(contentUrl)

  const mobile = useIsMobileViewport()

  const containerStyle: CSSProperties = {
    backgroundColor: colorScheme === 'primary'
      ? format === 'announcement' ? '#FFFFFF' : '#725DFF'
      : backgroundColor && backgroundColor.length !== 0
          ? backgroundColor
          : announcementWidgetDefaults.appearence.backgroundColor,
    borderRadius: mobile
      ? undefined
      : borderRadius ?? announcementWidgetDefaults.appearence.borderRadius,
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
    <>
      {format === 'countdown' && (
        <CountdownAnnouncementWidget
          ref={ref}
          variant={props.countdownVariant}
          focused={props.focused}
          containerStyle={containerStyle}
          onCountdownScreenButtonPress={props.onCountdownScreenButtonPress}
          onFormScreenButtonPress={props.onFormScreenButtonPress}
        />
      )}
      {format === 'announcement' && (
        <AnnouncementWidget
          ref={ref}
          variant={props.announementVariant}
          focused={props.focused}
          onButtonPress={props.onAnnouncementButtonPress}
        />
      )}
    </>
  )
}

export default Widget
