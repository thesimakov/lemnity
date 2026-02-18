import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { Duration } from "luxon"
import { cn } from '@heroui/theme'

type CountdownSectionProps = {
  value: [string, string]
  label: string
  backgroundColor?: string
  fontColor?: string
}

const CountdownSection = (props: CountdownSectionProps) => {
  const style: CSSProperties = {
    backgroundColor: props.backgroundColor,
    color: props.fontColor,
  }

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex flex-row gap-1'>
        {props.value.map((displayValue, index) => (
          <div
            key={index}
            className={cn(
              'w-11.5 h-18.5 flex items-center justify-center',
              'rounded-[5px] bg-white',
              'transition-colors duration-250',
            )}
            style={style}
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
          'rounded-[5px] bg-white',
          'transition-colors duration-250',
        )}
        style={style}
      >
        <span className='font-medium text-[12px] leading-3.5'>
          {props.label}
        </span>
      </div>
    </div>
  )
}


const CountdownDelimiter = () => (
  <div className='w-7.25 h-18.5 flex items-center justify-center pb-1'>
    <span className={cn(
      'font-roboto font-bold text-[30px] leading-8.75 text-white',
      'animate-clock',
    )}>
      :
    </span>
  </div>
)


type CountdownTimerProps = {
  initialTime: number
  isPaused?: boolean
  backgroundColor?: string
  fontColor?: string
  onComplete?: () => void
  onTick?: (currentTime: number) => void
}

const CountdownTimer = ({
  initialTime,
  onComplete,
  onTick,
  isPaused = false,
  backgroundColor,
  fontColor,
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
    <div className="w-full flex flex-row">
      <CountdownSection
        value={[days.charAt(0), days.charAt(1)]}
        label="дней"
        backgroundColor={backgroundColor}
        fontColor={fontColor}
      />
      <CountdownDelimiter />
      <CountdownSection
        value={[hours.charAt(0), hours.charAt(1)]}
        label="часов"
        backgroundColor={backgroundColor}
        fontColor={fontColor}
      />
      <CountdownDelimiter />
      <CountdownSection
        value={[minutes.charAt(0), minutes.charAt(1)]}
        label="минут"
        backgroundColor={backgroundColor}
        fontColor={fontColor}
      />
    </div>
  )
}

const convertDurationUnitToString = (unit: number | undefined) => {
  const value = unit ? Math.floor(unit) : 0
  return value
    .toString()
    .padStart(2, '0')
}

export default CountdownTimer
