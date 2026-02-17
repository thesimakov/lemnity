import { useShallow } from 'zustand/react/shallow'

import RewardMessageSettings from './RewardMessageSettings'
import InfoSettings from './InfoSettings'
import FormSettings from './FormSettings'
import WidgetAppearanceSettings from './WidgetAppearanceSettings'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'

const AnnouncementWidgetSettings = () => {
  const { format } = useWidgetSettingsStore(
    useShallow(s => {
      const settings = (s.settings?.widget as AnnouncementWidgetType).appearence

      return {
        format: settings.format,
      }
    })
  )

  return (
    <div className="w-full px-4.75 flex flex-col gap-2.5">
      <WidgetAppearanceSettings />
      <InfoSettings />
      {format === 'countdown' && <FormSettings />}
      <RewardMessageSettings />
    </div>
  )
}

export default AnnouncementWidgetSettings
