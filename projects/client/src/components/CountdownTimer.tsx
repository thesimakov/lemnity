import { useState, useRef, useEffect } from 'react'
import { Duration } from "luxon"
import { cn } from '@heroui/theme'

type CountdownSectionProps = {
  value: [string, string]
  label: string
}

const CountdownSection = (props: CountdownSectionProps) => {
  return (
    <div className='flex flex-col gap-1'>
      <div className='flex flex-row gap-1'>
        {props.value.map((displayValue, index) => (
          <div
            key={index}
            className={cn(
              'w-11 h-18.5 flex items-center justify-center',
              'rounded-[5px] bg-white',
            )}
          >
            <span className='font-medium text-[30px] leading-9'>
              {displayValue}
            </span>
          </div>
        ))}
      </div>

      <div
        className={cn(
          'w-full h-5 flex items-center justify-center',
          'rounded-[5px] bg-white'
        )}
      >
        <span className='font-medium text-[12px] leading-3.5'>
          {props.label}
        </span>
      </div>
    </div>
  )
}


const CountdownDelimiter = () => (
  <div className='w-4 h-full flex items-center justify-center pb-6'>
    <span className={cn(
      'font-roboto font-bold text-[30px] leading-8.75 text-white',
      'animate-clock'
    )}>
      :
    </span>
  </div>
)


type CountdownTimerProps = {
  initialTime: number
  onComplete?: () => void
  onTick?: (currentTime: number) => void
  isPaused?: boolean
}

const CountdownTimer = ({
  initialTime,
  onComplete,
  onTick,
  isPaused = false
}: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const intervalRef = useRef<null | ReturnType<typeof setInterval>>(null)
  const previousTime = useRef(Date.now())

  const durationObject = Duration
    .fromObject({ seconds: timeRemaining })
    .shiftTo('days', 'hours', 'minutes')
    .toObject()
  
  const days = convertDurationUnitToString(durationObject.days)
  const hours = convertDurationUnitToString(durationObject.hours)
  const minutes = convertDurationUnitToString(durationObject.minutes)

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    if (isPaused) {
      clearTimer()
      return
    }

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now()
      const deltaTime = Math.floor((currentTime - previousTime.current) / 1000)

      previousTime.current = currentTime

      setTimeRemaining(prevTime => {
        const newTime = Math.max(0, prevTime - deltaTime)
        onTick?.(newTime)

        if (newTime === 0) {
          clearTimer()
          onComplete?.()
        }

        return newTime
      })
    }, 1000)

    return clearTimer
  }, [isPaused, onComplete, onTick])

  // Reset hook to handle initialTime changes
  useEffect(() => {
    setTimeRemaining(initialTime)
    previousTime.current = Date.now()
  }, [initialTime])

  return (
    <div className="flex flex-row">
      <CountdownSection
        value={[days.charAt(0), days.charAt(1)]}
        label="дней"
      />
      <CountdownDelimiter />
      <CountdownSection
        value={[hours.charAt(0), hours.charAt(1)]}
        label="часов"
      />
      <CountdownDelimiter />
      <CountdownSection
        value={[minutes.charAt(0), minutes.charAt(1)]}
        label="минут"
      />
    </div>
  )
}

const convertDurationUnitToString = (unit: number | undefined) => {
  const value = unit ?? 0
  return value
    .toString()
    .padStart(2, '0')
}

export default CountdownTimer
