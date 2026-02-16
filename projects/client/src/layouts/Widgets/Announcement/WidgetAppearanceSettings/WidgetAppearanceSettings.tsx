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
import CompanyLogo from './CompanyLogo'

const WidgetAppearanceSettings = () => {
  const {
    format,
    companyLogoEnabled,
    companyLogoUrl,
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
      const settings = (s.settings?.widget as AnnouncementWidget).appearence
      return  {
        format: settings.format,
        companyLogoEnabled: settings.companyLogoEnabled,
        companyLogoUrl: settings.companyLogoUrl,
        colorScheme: settings.colorScheme,
        backgroundColor: settings.backgroundColor,
        borderRadius: settings.borderRadius,
        contentEnabled: settings.contentEnabled,
        contentType: settings.contentType,
        contentAlignment: settings.contentAlignment,
        contentUrl: settings.contentUrl,
      }
    })
  )
  
  const setWidgetFormat = useWidgetSettingsStore(
    s => s.setAnnouncementWidgetFormat
  )
  const setCompanyLogoEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementCompanyLogoEnabled
  )
  const setCompanyLogoUrl = useWidgetSettingsStore(
    s => s.setAnnouncementCompanyLogoUrl
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
      {format === 'countdown' && (
        <CompanyLogo
          enabled={companyLogoEnabled}
          logoUrl={companyLogoUrl}
          onToggle={setCompanyLogoEnabled}
          onLogoUrlChange={setCompanyLogoUrl}
        />
      )}
      <WidgetBackgroundColor 
        colorScheme={colorScheme}
        backgroundColor={
          backgroundColor
          // defaults (by definition) are always initialized thus the need for !
          // to override the type
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
        format={format}
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
