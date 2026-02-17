import { useShallow } from 'zustand/react/shallow'

import AnnouncementWidget from './AnnouncementWidget'
import CountdownAnnouncementWidget from './CountdownAnnouncementWidget'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'

import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'

const AnnouncementPreview = () => {
  const { format, rewardScreenEnabled } = useWidgetSettingsStore(
    useShallow(s => {
      const widget = (s.settings?.widget as AnnouncementWidgetType)
      const settings = widget.appearence
      const rewardMessageSettings = widget.rewardMessageSettings

      return {
        format: settings.format,
        rewardScreenEnabled: rewardMessageSettings.rewardScreenEnabled,
      }
    })
  )

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
        <>
          <span className="text-xs py-3.75">
            Главный экран
          </span>
          <div className="w-fit h-fit scale-40 -translate-y-[31%]">
            <CountdownAnnouncementWidget variant="countdown" />
          </div>

          <span className="text-xs py-3.75 -translate-y-79.5">
            Экран формы
          </span>
          <div className="w-fit h-fit scale-40 -translate-y-[92%]">
            <CountdownAnnouncementWidget variant="form" />
          </div>

          <span className="text-xs py-3.75 -translate-y-159">
            Экран выигрыша
          </span>
          <div className="w-fit h-fit scale-40 -translate-y-[153%]">
            <CountdownAnnouncementWidget variant="reward" />
          </div>
        </>
      )}
    </div>
  )
}

export default AnnouncementPreview
