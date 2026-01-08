import { useCallback, useEffect, useState } from 'react'

export function useIsMobileViewport(breakpointPx = 768) {
  const getMatches = useCallback(() => {
    const mqMatches = window.matchMedia(`(max-width: ${breakpointPx}px)`).matches
    if (mqMatches) return true

    const ua = navigator.userAgent
    const uaDataMobile = (navigator as Navigator & { userAgentData?: { mobile?: boolean } })
      .userAgentData?.mobile
    const uaMobile =
      Boolean(uaDataMobile) ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua)
    const iPadOS = /Macintosh/i.test(ua) && (navigator.maxTouchPoints ?? 0) > 1

    return uaMobile || iPadOS
  }, [breakpointPx])

  const [isMobile, setIsMobile] = useState(getMatches)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`)
    const onChange = () => setIsMobile(getMatches())
    onChange()

    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [breakpointPx, getMatches])

  return isMobile
}
