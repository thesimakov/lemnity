import useWidgetPreviewStore from '@/stores/widgetPreviewStore'
import DesktopPreview from '../Common/DesktopPreview/DesktopPreview'
import MobilePreview from '../Common/MobilePreview/MobilePreview'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { useEffect, useRef } from 'react'

type WheelOfFortunePreviewProps = {
  spinTrigger?: number
}

const WheelOfFortunePreview = ({ spinTrigger }: WheelOfFortunePreviewProps) => {
  const mode = useWidgetPreviewStore(s => s.mode)
  const windowFormat = useWidgetSettingsStore(
    s => s.settings.form.template?.templateSettings?.windowFormat
  )

  const ref = useRef<HTMLDivElement>(null)
  const mainScreenRef = useRef<HTMLDivElement>(null)
  const prizeScreenRef = useRef<HTMLDivElement>(null)
  const mainScreenContainerRef = useRef<HTMLDivElement>(null)
  const prizeScreenContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateScale = () => {
      if (ref?.current && mainScreenRef?.current && mainScreenContainerRef?.current) {
        // Временно убираем transform для получения оригинальной высоты
        mainScreenRef.current.style.transform = ''
        
        const scaleFactor = ref.current.clientWidth / mainScreenRef.current.clientWidth
        const originalHeight = mainScreenRef.current.clientHeight
        
        mainScreenRef.current.style.transform = `scale(${scaleFactor})`
        mainScreenRef.current.style.transformOrigin = 'top left'
        mainScreenContainerRef.current.style.height = `${originalHeight * scaleFactor}px`
      }
      if (ref?.current && prizeScreenRef?.current && prizeScreenContainerRef?.current) {
        // Временно убираем transform для получения оригинальной высоты
        prizeScreenRef.current.style.transform = ''
        
        const scaleFactor = ref.current.clientWidth / prizeScreenRef.current.clientWidth
        const originalHeight = prizeScreenRef.current.clientHeight
        
        prizeScreenRef.current.style.transform = `scale(${scaleFactor})`
        prizeScreenRef.current.style.transformOrigin = 'top left'
        prizeScreenContainerRef.current.style.height = `${originalHeight * scaleFactor}px`
      }
    }

    updateScale()

    const resizeObserver = new ResizeObserver(updateScale)
    
    if (ref.current) resizeObserver.observe(ref.current)
    if (mainScreenRef.current) resizeObserver.observe(mainScreenRef.current)
    if (prizeScreenRef.current) resizeObserver.observe(prizeScreenRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [windowFormat])

  if (mode === 'mobile') return <MobilePreview spinTrigger={spinTrigger} />

  if (windowFormat === 'modalWindow') {
    return (
      <div ref={ref} className="flex flex-col gap-2 origin-top-left">
        <p className="font-rubik font-normal text-xs">Главный экран</p>
        <div id="main-screen" ref={mainScreenContainerRef}>
          <DesktopPreview
            ref={mainScreenRef}
            screen="main"
            onSubmit={() => {}}
            spinTrigger={spinTrigger}
          />
        </div>
        <hr className="w-full h-px border-0 bg-default-300 self-start" />
        <p className="font-rubik font-normal text-xs">Призовой экран</p>
        <div ref={prizeScreenContainerRef}>
          <DesktopPreview
            ref={prizeScreenRef}
            screen="prize"
            onSubmit={() => {}}
            spinTrigger={spinTrigger}
          />
        </div>
      </div>
    )
  }

  return <DesktopPreview screen="panel" onSubmit={() => {}} spinTrigger={spinTrigger} />
}

export default WheelOfFortunePreview
