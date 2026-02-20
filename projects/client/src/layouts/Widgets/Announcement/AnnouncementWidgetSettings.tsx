import { useShallow } from 'zustand/react/shallow'

import RewardMessageSettings from './RewardMessageSettings'
import InfoSettings from './InfoSettings'
import FormSettings from './FormSettings'
import WidgetAppearanceSettings from './WidgetAppearanceSettings'
import DisableBranding from '@/layouts/WidgetSettings/FieldsSettingsTab/DisableBranding/DisableBranding'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'

const AnnouncementWidgetSettings = () => {
  const { format, brandingEnabled } = useWidgetSettingsStore(
    useShallow(s => {
      const widget = s.settings?.widget as AnnouncementWidgetType
      const settings = widget.appearence

      return {
        format: settings.format,
        brandingEnabled: widget.brandingEnabled,
      }
    })
  )

  const setBrandingEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementBrandingEnabled
  )

  return (
    <div className="w-full px-4.75 flex flex-col gap-2.5">
      <WidgetAppearanceSettings />
      <InfoSettings />
      {format === 'countdown' && <FormSettings />}
      <RewardMessageSettings />
      <DisableBranding
        enabled={brandingEnabled}
        onBrandingEnabledToggle={setBrandingEnabled}
      />
    </div>
  )
}

export default AnnouncementWidgetSettings
