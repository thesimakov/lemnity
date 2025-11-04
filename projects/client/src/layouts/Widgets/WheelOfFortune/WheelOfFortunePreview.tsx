import useWidgetPreviewStore from '@/stores/widgetPreviewStore'
import DesktopPreview from '../Common/DesktopPreview/DesktopPreview'
import MobilePreview from '../Common/MobilePreview/MobilePreview'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { useEffect, useRef, useState } from 'react'

type WheelOfFortunePreviewProps = {
  spinTrigger?: number
}

const WheelOfFortunePreview = ({ spinTrigger }: WheelOfFortunePreviewProps) => {
  const mode = useWidgetPreviewStore(s => s.mode)
  const windowFormat = useWidgetSettingsStore(
    s => s.settings.form.template?.templateSettings?.windowFormat
  )

  const ref = useRef<HTMLDivElement>(null)
  const modalWindowRef = useRef<HTMLDivElement>(null)
  const [modalWidth, setModalWidth] = useState<number | null>(null)

  useEffect(() => {
    if (ref?.current && modalWindowRef?.current) {
      const scaleFactor = ref.current.clientWidth / modalWindowRef.current.clientWidth
      ref.current.style.transform = `scale(${scaleFactor})`
      ref.current.style.transformOrigin = 'top left'
      setModalWidth(modalWindowRef.current.clientWidth)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.current, modalWindowRef?.current])

  if (mode === 'mobile') return <MobilePreview spinTrigger={spinTrigger} />

  if (windowFormat === 'modalWindow') {
    return (
      <div ref={ref} className="flex flex-col gap-5">
        <div>
          <p className="font-rubik text-[25px] py-[15px]">Главный экран</p>
          <DesktopPreview
            ref={modalWindowRef}
            screen="main"
            onSubmit={() => {}}
            spinTrigger={spinTrigger}
          />
        </div>
        <hr
          className="scale-100 h-px border-0 bg-default-300 self-start "
          style={{ width: modalWidth ? `${modalWidth}px` : undefined }}
        ></hr>
        <div>
          <p className="font-rubik text-[25px] mb-5">Призовой экран</p>
          <DesktopPreview 
            screen="prize" 
            onSubmit={() => {}} 
            ref={modalWindowRef}
            spinTrigger={spinTrigger} />
        </div>
      </div>
    )
  }

  return <DesktopPreview screen="panel" onSubmit={() => {}} spinTrigger={spinTrigger} />
}

export default WheelOfFortunePreview
