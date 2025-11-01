import useWidgetPreviewStore from '@/stores/widgetPreviewStore'
import DesktopPreview from '../Common/DesktopPreview/DesktopPreview'
import MobilePreview from '../Common/MobilePreview/MobilePreview'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { useEffect, useRef, useState } from 'react'

const WheelOfFortunePreview = () => {
  const mode = useWidgetPreviewStore(s => s.mode)
  const windowFormat = useWidgetSettingsStore(
    s => s.settings.form.template?.templateSettings?.windowFormat
  )

  const ref = useRef<HTMLDivElement>(null)
  const modalWindowRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (ref?.current && modalWindowRef?.current) {
      setScale(ref.current.clientWidth / modalWindowRef.current.clientWidth)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.current, modalWindowRef?.current])

  if (mode === 'mobile') return <MobilePreview />

  if (windowFormat === 'modalWindow') {
    return (
      <div
        ref={ref}
        className="flex flex-col gap-10 origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <DesktopPreview ref={modalWindowRef} screen="main" />
        <DesktopPreview screen="prize" />
      </div>
    )
  }

  return <DesktopPreview screen="panel" />
}

export default WheelOfFortunePreview
