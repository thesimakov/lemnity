import { useEffect, useState } from 'react'

export const useViewportWidth = () => {
  const [width, setWidth] = useState<number>(window.innerWidth)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setWidth(window.innerWidth)
    })

    resizeObserver.observe(document.documentElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return width
}
