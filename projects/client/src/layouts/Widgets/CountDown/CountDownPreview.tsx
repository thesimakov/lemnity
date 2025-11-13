import useWidgetPreviewStore from '@/stores/widgetPreviewStore'
import { useEffect, useRef, useState } from 'react'
import CountDown from './CountDown'

type CountDownPreviewProps = {
  endDate?: Date | string
  imageUrl?: string
}

const CountDownPreview = ({ endDate, imageUrl }: CountDownPreviewProps) => {
  const mode = useWidgetPreviewStore(s => s.mode)
  const ref = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState<number | null>(null)

  useEffect(() => {
    if (ref?.current && innerRef?.current && mode === 'desktop') {
      const scaleFactor = ref.current.clientWidth / innerRef.current.clientWidth
      ref.current.style.transform = `scale(${scaleFactor})`
      ref.current.style.transformOrigin = 'top left'
      setContentWidth(innerRef.current.clientWidth)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.current, innerRef?.current, mode])

  if (mode === 'mobile') {
    return (
      <div className="w-full">
        <CountDown endDate={endDate} imageUrl={imageUrl} />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div ref={ref}>
        <div ref={innerRef} className="w-[928px]">
          <CountDown endDate={endDate} imageUrl={imageUrl} />
        </div>
      </div>
      <hr
        className="scale-100 h-px border-0 bg-default-300 self-start "
        style={{ width: contentWidth ? `${contentWidth}px` : undefined }}
      ></hr>
    </div>
  )
}

export default CountDownPreview
