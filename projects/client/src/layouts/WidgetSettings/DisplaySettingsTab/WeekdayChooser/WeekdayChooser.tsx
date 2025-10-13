import { useMemo, useRef, useState } from 'react'
import SwitchableField from '@/components/SwitchableField'

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

const DAY_LABEL: Record<DayKey, string> = {
  mon: 'Пн',
  tue: 'Вт',
  wed: 'Ср',
  thu: 'Чт',
  fri: 'Пт',
  sat: 'Сб',
  sun: 'Вс'
}

type WeekdayChooserProps = {
  title?: string
  enabled?: boolean
  onToggleEnabled?: (val: boolean) => void
  selectedDays?: DayKey[]
  onDaysChange?: (days: DayKey[]) => void
  weekdaysOnly?: boolean
  onWeekdaysOnlyChange?: (val: boolean) => void
}

const allWeekdays: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri']
const allDays: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const WeekdayChooser = ({
  title = 'Дни недели',
  enabled: enabledProp,
  onToggleEnabled,
  selectedDays: selectedProp,
  onDaysChange,
  weekdaysOnly: weekdaysOnlyProp,
  onWeekdaysOnlyChange
}: WeekdayChooserProps) => {
  const isControlledEnabled = typeof enabledProp === 'boolean'
  const [enabledState, setEnabledState] = useState<boolean>(enabledProp ?? true)
  const enabled = isControlledEnabled ? (enabledProp as boolean) : enabledState

  const isControlledDays = Array.isArray(selectedProp)
  const [daysState, setDaysState] = useState<DayKey[]>(selectedProp ?? allDays)
  const days = isControlledDays ? (selectedProp as DayKey[]) : daysState

  const isControlledWeekdaysOnly = typeof weekdaysOnlyProp === 'boolean'
  const [weekdaysOnlyState, setWeekdaysOnlyState] = useState<boolean>(weekdaysOnlyProp ?? false)
  const weekdaysOnly = isControlledWeekdaysOnly ? (weekdaysOnlyProp as boolean) : weekdaysOnlyState

  // keep previous selection to restore when disabling "weekdays only"
  const prevSelectionRef = useRef<DayKey[] | null>(null)

  const isSelected = useMemo(() => new Set(days), [days])

  const setEnabled = (val: boolean) => {
    if (!isControlledEnabled) setEnabledState(val)
    onToggleEnabled?.(val)
  }

  const updateDays = (next: DayKey[]) => {
    if (!isControlledDays) setDaysState(next)
    onDaysChange?.(next)
  }

  const setWeekdaysOnly = (val: boolean) => {
    if (val) {
      // store previous to restore when turning off
      prevSelectionRef.current = days
      updateDays(allWeekdays)
    } else {
      updateDays(prevSelectionRef.current ?? days)
      prevSelectionRef.current = null
    }
    if (!isControlledWeekdaysOnly) setWeekdaysOnlyState(val)
    onWeekdaysOnlyChange?.(val)
  }

  const toggleDay = (day: DayKey) => {
    if (weekdaysOnly && (day === 'sat' || day === 'sun')) return
    const set = new Set(days)
    if (set.has(day)) set.delete(day)
    else set.add(day)
    updateDays(allDays.filter(d => set.has(d)))
  }

  const DayCard = ({ day }: { day: DayKey }) => {
    const selected = isSelected.has(day)
    const disabled = weekdaysOnly && (day === 'sat' || day === 'sun')
    return (
      <button
        type="button"
        onClick={() => toggleDay(day)}
        disabled={!enabled || disabled}
        className={`h-12  rounded-xl border px-4 flex items-center justify-center text-lg transition-colors ${
          selected ? 'bg-[#E9E9EB] border-[#D7D7DB]' : 'bg-white border-[#E4E4E7]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-pressed={selected}
      >
        <span className="text-gray-600">{DAY_LABEL[day]}</span>
      </button>
    )
  }

  return (
    <SwitchableField
      title={title}
      enabled={enabled}
      onToggle={setEnabled}
      classNames={{ container: ' border-none !p-0', content: '!pt-2', title: 'font-normal' }}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          {allDays.slice(0, 6).map(d => (
            <DayCard key={d} day={d} />
          ))}
          <DayCard day="sun" />
        </div>
        <div className="h-12 w-px bg-[#E4E4E7]" />
        <button
          type="button"
          onClick={() => setWeekdaysOnly(!weekdaysOnly)}
          disabled={!enabled}
          className={`h-12 rounded-xl border mx-auto w-full flex items-center justify-center text-lg transition-colors ${
            weekdaysOnly ? 'bg-[#E9E9EB] border-[#D7D7DB]' : 'bg-white border-[#E4E4E7]'
          }`}
          aria-pressed={weekdaysOnly}
        >
          <span className="text-gray-600">Только по будням</span>
        </button>
      </div>
    </SwitchableField>
  )
}

export default WeekdayChooser
