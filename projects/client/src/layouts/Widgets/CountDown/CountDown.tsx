import { useActionTimerSettings } from '@/layouts/Widgets/CountDown/hooks'
import { buildActionTimerWidgetSettings } from './defaults'

const CountDown = () => {
  const { settings } = useActionTimerSettings()
  const countdownDefaults = buildActionTimerWidgetSettings().countdown
  const countdownSettings = settings?.countdown ?? countdownDefaults
  const { imageUrl } = countdownSettings

  return (
    <img
      className="relative overflow-hidden text-white object-cover"
      src={imageUrl ? imageUrl : ''}
    />
  )
}

export default CountDown
