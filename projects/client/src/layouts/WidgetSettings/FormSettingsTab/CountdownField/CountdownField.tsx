import { useEffect, useState } from 'react'
import SwitchableField from '@/components/SwitchableField'
import { Input } from '@heroui/input'
import { useFormSettings } from '@/stores/widgetSettings/formHooks'
import { useActionTimerSettings } from '@/layouts/Widgets/CountDown/hooks'
import { formatDateForInput } from '@/layouts/Widgets/CountDown/utils'

const CountdownField = () => {
  const { settings, setCountdownEnabled } = useFormSettings()
  const { settings: widgetSettings, updateActionTimer } = useActionTimerSettings()

  const countdownForm = settings?.countdown
  const isCountdownEnabled = countdownForm?.enabled ?? false
  const eventDate = widgetSettings?.countdown.eventDate ?? null

  const [inputValue, setInputValue] = useState(() => formatDateForInput(eventDate))

  useEffect(() => {
    setInputValue(formatDateForInput(eventDate))
  }, [eventDate])

  const handleToggle = (next: boolean) => {
    if (isCountdownEnabled === next) return
    setCountdownEnabled(next)
  }

  const handleDateChange = (value: string) => {
    setInputValue(value)
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      const utcIso = parsed.toISOString()
      updateActionTimer({ eventDate: utcIso })
    }
  }

  return (
    <SwitchableField
      title="Обратный отсчёт"
      enabled={isCountdownEnabled}
      onToggle={handleToggle}
      classNames={{ content: 'flex flex-col gap-4' }}
    >
      <Input
        radius="sm"
        variant="bordered"
        type="datetime-local"
        value={inputValue}
        placeholder="Выберите дату"
        onValueChange={handleDateChange}
      />
    </SwitchableField>
  )
}

export default CountdownField
