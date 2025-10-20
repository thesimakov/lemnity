import OptionsChooser from '@/components/OptionsChooser'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import WeekdayChooser from '../WeekdayChooser/WeekdayChooser'
import useWidgetSettingsStore, { useDisplaySettings } from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'
import { useShallow } from 'zustand/react/shallow'

const dateOptions = [
  { key: 'fromDate', label: 'От: Дата / Время / Год' },
  { key: 'toDate', label: 'До: Дата / Время / Год' }
]

const timeOptions = [
  { key: 'fromTime', label: 'С: 8:00' },
  { key: 'toTime', label: 'До: 21:00' }
]

const ShowingScheduleField = () => {
  const { setScheduleDate, setScheduleTime } = useDisplaySettings()
  const date = useWidgetSettingsStore(
    useShallow(s =>
      withDefaultsPath<typeof STATIC_DEFAULTS.display.schedule.date>(
        s.settings?.display,
        'schedule.date',
        STATIC_DEFAULTS.display.schedule.date
      )
    )
  )
  const time = useWidgetSettingsStore(
    useShallow(s =>
      withDefaultsPath<typeof STATIC_DEFAULTS.display.schedule.time>(
        s.settings?.display,
        'schedule.time',
        STATIC_DEFAULTS.display.schedule.time
      )
    )
  )
  const { value: dateValue, enabled: dateEnabled } = date
  const { value: timeValue, enabled: timeEnabled } = time

  return (
    <BorderedContainer className="flex flex-col gap-2">
      <span>Расписание показа</span>
      <OptionsChooser
        title="Дата показа"
        options={dateOptions}
        value={dateValue}
        onChange={value => setScheduleDate(dateEnabled ?? true, value)}
        showSwitch
        switchedOn={dateEnabled}
        isDisabled={!dateEnabled}
        onToggle={enabled => setScheduleDate(enabled, dateValue)}
        noBorder
        classNames="!p-0"
      />
      <OptionsChooser
        title="Время показа"
        options={timeOptions}
        value={timeValue}
        onChange={value => setScheduleTime(timeEnabled ?? true, value)}
        showSwitch
        switchedOn={timeEnabled}
        isDisabled={!timeEnabled}
        onToggle={enabled => setScheduleTime(enabled, timeValue)}
        noBorder
        classNames="!p-0"
      />
      <WeekdayChooser />
    </BorderedContainer>
  )
}

export default ShowingScheduleField
