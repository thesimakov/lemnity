import useWidgetPreviewStore from '@/stores/widgetPreviewStore'
import DesktopPreview from '../Common/DesktopPreview/DesktopPreview'
import MobilePreview from '../Common/MobilePreview/MobilePreview'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'

const WheelOfFortunePreview = () => {
  const mode = useWidgetPreviewStore(s => s.mode)
  const windowFormat = useWidgetSettingsStore(
    s => s.settings.form.template?.templateSettings?.windowFormat
  )

  if (mode === 'mobile') return <MobilePreview />

  if (windowFormat === 'modalWindow') {
    return (
      <div className="flex flex-col gap-10">
        <DesktopPreview screen="main" />
        <DesktopPreview screen="prize" />
      </div>
    )
  }

  return <DesktopPreview screen="panel" />
}

export default WheelOfFortunePreview
