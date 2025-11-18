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
  const { imageUrl, imagePosition } = countdownSettings

  return (
    <div className="overflow-hidden rounded-2xl self-center h-full">
      <img
        className={`overflow-hidden rounded-2xl text-white h-full object-cover ${className ?? ''}`}
        style={{ objectPosition: imagePosition }}
        src={imageUrl ? imageUrl : ''}
      />
    </div>
  )
}

export default CountDown
