import { useShallow } from 'zustand/react/shallow'
import { cn } from '@heroui/theme'

import NotificationEmbedRuntime from './embedRuntime'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'

import type {
  NotificationWidgetType,
} from '@lemnity/widget-config/widgets/notification'
import { notificationWidgetDefaults as defaults } from './defaults'

const WidgetPreview = () => {
  const triggerPosition = useWidgetSettingsStore(
    useShallow(s => {
      const settings = (s.settings?.widget as NotificationWidgetType)
      return settings.triggerPosition
          ?? defaults.triggerPosition
    })
  )

  return (
    <div className='w-full h-full flex'>
      <div
        className={cn(
          'mt-auto mb-3',
          triggerPosition === 'bottom-right'
            ? 'ml-auto mr-0'
            : 'ml-0 mr-auto',
        )}
      >
        <NotificationEmbedRuntime preview />
      </div>
    </div>
  )
}

export default WidgetPreview
