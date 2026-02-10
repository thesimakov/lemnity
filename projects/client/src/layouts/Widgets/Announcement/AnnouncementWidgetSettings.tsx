import RewardMessageSettings from './RewardMessageSettings'
import InfoSettings from './InfoSettings'
import FormSettings from './FormSettings'
import WidgetAppearanceSettings from './WidgetAppearanceSettings'

const AnnouncementWidgetSettings = () => {
  return (
    <div className="w-full px-4.75 flex flex-col gap-2.5">
      <WidgetAppearanceSettings />
      <InfoSettings />
      <FormSettings />
      <RewardMessageSettings />
    </div>
  )
}

export default AnnouncementWidgetSettings
