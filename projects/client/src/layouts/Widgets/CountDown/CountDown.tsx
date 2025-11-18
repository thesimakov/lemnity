import { useActionTimerSettings } from '@/layouts/Widgets/CountDown/hooks'
import { buildActionTimerWidgetSettings } from './defaults'

type CountDownProps = {
  className?: string
}

const CountDown = (props?: CountDownProps) => {
  const { className } = props ?? {}
  const { settings } = useActionTimerSettings()
  const countdownDefaults = buildActionTimerWidgetSettings().countdown
  const countdownSettings = settings?.countdown ?? countdownDefaults
  const { imageUrl } = countdownSettings

  return (
    <div className="overflow-hidden rounded-3xl self-center">
      <img
        className={`overflow-hidden rounded-3xl text-white object-contain ${className ?? ''}`}
        src={imageUrl ? imageUrl : ''}
      />
    </div>
  )
}

export default CountDown
