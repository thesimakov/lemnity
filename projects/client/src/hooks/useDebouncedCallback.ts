import { useCallback, useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDebouncedCallback = <T extends any[]>(callback: (...args: T) => void, delay: number) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestCallback = useRef(callback)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    latestCallback.current = callback
  }, [callback])

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        latestCallback.current(...args)
      }, delay)
    },
    [delay]
  )
}

export default useDebouncedCallback
