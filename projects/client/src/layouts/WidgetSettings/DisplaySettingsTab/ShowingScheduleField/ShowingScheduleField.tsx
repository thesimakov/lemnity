import OptionsChooser from '@/components/OptionsChooser'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import { useState } from 'react'
import WeekdayChooser from '../WeekdayChooser/WeekdayChooser'

const dateOptions = [
  { key: 'fromDate', label: 'От: Дата / Время / Год' },
  { key: 'toDate', label: 'До: Дата / Время / Год' }
]

const timeOptions = [
  { key: 'fromTime', label: 'С: 8:00' },
  { key: 'toTime', label: 'До: 21:00' }
]

const ShowingScheduleField = () => {
  const [dateEnabled, setDateEnabled] = useState(true)
  const [dateValue, setDateValue] = useState('fromDate')
  const [timeValue, setTimeValue] = useState('fromTime')
  const [timeEnabled, setTimeEnabled] = useState(true)
  return (
    <BorderedContainer className="flex flex-col gap-2">
      <span>Расписание показа</span>
      <OptionsChooser
        title="Дата показа"
        options={dateOptions}
        value={dateValue}
        onChange={setDateValue}
        toggle={true}
        enabled={dateEnabled}
        onToggle={setDateEnabled}
        noBorder
        classNames="!p-0"
      />
      <OptionsChooser
        title="Время показа"
        options={timeOptions}
        value={timeValue}
        onChange={setTimeValue}
        toggle={true}
        enabled={timeEnabled}
        onToggle={setTimeEnabled}
        noBorder
        classNames="!p-0"
      />
      <WeekdayChooser />
    </BorderedContainer>
  )
}

export default ShowingScheduleField
