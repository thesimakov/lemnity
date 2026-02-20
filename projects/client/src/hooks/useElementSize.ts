import { useEffect, useState } from 'react'

type Size = {
  width: number
  height: number
}

export const useElementSize = (element: React.RefObject<HTMLElement | null>) => {
  const [size, setSize] = useState<Size>({
    width: element?.current?.offsetWidth ?? 0,
    height: element?.current?.offsetHeight ?? 0,
  })

  useEffect(() => {
    if (!element || !element.current) {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      setSize({
        // language server can't see the guard above because reasons,
        // so we need to do it again here
        width: element?.current?.offsetWidth ?? 0,
        height: element?.current?.offsetHeight ?? 0,
      })
    })

    resizeObserver.observe(element.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [element])

  return size
}
