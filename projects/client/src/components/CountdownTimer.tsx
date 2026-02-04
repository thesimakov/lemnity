// import React, { useState, useRef, useEffect } from 'react'

// type CountdownTimerProps = {
//   initialTime: number
//   onComplete: () => void
// }

// const CountdownTimer = (props: CountdownTimerProps) => {
//   const [timeRemaining, setTimeRemaining] = useState(props.initialTime)

//   const intervalRef =
//     useRef<undefined | ReturnType<typeof setInterval>>(undefined)

//   useEffect(() => {
//     // Start the countdown
//     intervalRef.current = setInterval(() => {
//       setTimeRemaining(prevTime => {
//         if (prevTime <= 1) {
//           // Clear interval when we reach zero
//           clearInterval(intervalRef.current)
//           // Call completion handler if provided
//           props.onComplete?.()
//           return 0
//         }
//         return prevTime - 1
//       })
//     }, 1000)

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current)
//       }
//     }
//   }, []) // Empty dependency array means this effect runs once on mount

//   // Convert seconds to hours, minutes, seconds
//   const hours = Math.floor(timeRemaining / 3600)
//   const minutes = Math.floor((timeRemaining % 3600) / 60)
//   const seconds = timeRemaining % 60
//   return (
//     <div className="countdown-timer">
//       {hours.toString().padStart(2, '0')}:
//       {minutes.toString().padStart(2, '0')}:
//       {seconds.toString().padStart(2, '0')}
//     </div>
//   )
// }

// export default CountdownTimer

import React, { useState, useRef, useEffect } from 'react'

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
    <div className="countdown-timer">
      {formatTime(timeRemaining)}
    </div>
  )
}

const formatTime = (totalSeconds: number) => {
  const days = Math.floor(totalSeconds / 3600 / 24)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${days.toString()}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default CountdownTimer
