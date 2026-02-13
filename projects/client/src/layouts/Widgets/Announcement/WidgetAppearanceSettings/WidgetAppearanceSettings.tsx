import { useShallow } from 'zustand/react/shallow'

import WidgetType from './WidgetType'
import WidgetBackgroundColor from './WidgetBackgroundColor'
import WidgetBorderRadius from './WidgetBorderRadius'
import ContentSettings from './ContentSettings'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type {
  AnnouncementWidget,
} from '@lemnity/widget-config/widgets/announcement'
import { announcementWidgetDefaults } from '../defaults'

const WidgetAppearanceSettings = () => {
  const {
    format,
    colorScheme,
    backgroundColor,
    borderRadius,
    contentEnabled,
    contentType,
    contentAlignment,
    contentUrl,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const settings = s.settings?.widget as AnnouncementWidget
      return  {
        format: settings.appearence.format,
        colorScheme: settings.appearence.colorScheme,
        backgroundColor: settings.appearence.backgroundColor,
        borderRadius: settings.appearence.borderRadius,
        contentEnabled: settings.appearence.contentEnabled,
        contentType: settings.appearence.contentType,
        contentAlignment: settings.appearence.contentAlignment,
        contentUrl: settings.appearence.contentUrl,
      }
    })
  )
  
  const setWidgetFormat = useWidgetSettingsStore(
    s => s.setAnnouncementWidgetFormat
  )
  const setWidgetColorScheme = useWidgetSettingsStore(
    s => s.setAnnouncementColorScheme
  )
  const setWidgetBackgroundColor = useWidgetSettingsStore(
    s => s.setAnnouncementBackgroundColor
  )
  const setBorderRadius = useWidgetSettingsStore(
    s => s.setAnnouncementBorderRadius
  )
  const setContentEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementContentEnabled
  )
  const setContentType = useWidgetSettingsStore(
    s => s.setAnnouncementContentType
  )
  const setContentAlignment = useWidgetSettingsStore(
    s => s.setAnnouncementContentAlignment
  )
  const setContentUrl = useWidgetSettingsStore(
    s => s.setAnnouncementContentUrl
  )
  
  return (
    <div className="w-full min-w-85.5 flex flex-col gap-2.5">
      <h1 className="text-[25px] leading-7.5 font-normal text-[#060606]">
        Оформление
      </h1>

      <WidgetType
        format={format}
        onWidgetFormatChange={setWidgetFormat}
      />
      <WidgetBackgroundColor 
        colorScheme={colorScheme}
        backgroundColor={
          backgroundColor
          // defaults (by definition) are always initialized thus the need for !
          // to override the type
          // ..though if i understand corectly, the defaults should be applied
          // in the store, so this should never actually be undefined
          || announcementWidgetDefaults.appearence.backgroundColor!
        }
        onBackgroundColorChange={setWidgetBackgroundColor}
        onColorSchemeChange={setWidgetColorScheme}
      />
      <WidgetBorderRadius
        widgetBorderRadius={borderRadius}
        onBorderRadiuschange={setBorderRadius}
      />
      <ContentSettings
        contentEnabled={contentEnabled}
        contentType={contentType}
        contentAlignment={contentAlignment}
        contentUrl={contentUrl}
        onContentEnabledChange={setContentEnabled}
        onContentTypeChange={setContentType}
        onContentAlignmentChange={setContentAlignment}
        onContentUrlChange={setContentUrl}
      />
    </div>
  )
}

export default WidgetAppearanceSettings
