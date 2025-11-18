import { useCallback } from 'react'
import ImageUploader from '@/components/ImageUploader'
import { useActionTimerSettings } from '@/layouts/Widgets/CountDown/hooks'
import { uploadImage } from '@/api/upload'
import { buildActionTimerWidgetSettings } from '@/layouts/Widgets/CountDown/defaults'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import OptionsChooser, { type OptionItem } from '@/components/OptionsChooser'
import type { ActionTimerImagePosition } from '@/stores/widgetSettings/types'

const imagePositionOptions: OptionItem[] = [
  { key: 'left', label: 'С левой стороны' },
  { key: 'center', label: 'По центру' },
  { key: 'right', label: 'С правой стороны' }
]

const ActionTimerSettings = () => {
  const { settings, setActionTimerImage, setImagePosition } = useActionTimerSettings()
  const countdownDefaults = buildActionTimerWidgetSettings().countdown
  const countdownSettings = settings?.countdown ?? countdownDefaults

  const { imageUrl } = countdownSettings

  const handleImageUpload = useCallback(
    (file: File | null) => {
      if (file) {
        uploadImage(file).then(({ url }: { url: string }) => {
          setActionTimerImage(url)
        })
      } else {
        setActionTimerImage(undefined)
      }
    },
    [setActionTimerImage]
  )

  return (
    <BorderedContainer className="flex flex-col gap-3">
      <ImageUploader
        classNames={{ container: 'w-full' }}
        hideSwitch
        title="Промо изображение"
        recommendedResolution="600x600"
        fileSize="До 25 Mb"
        formats={['png', 'jpeg', 'jpg', 'webp']}
        url={imageUrl}
        onFileSelect={handleImageUpload}
        noBorder
        noPadding
      />
      <OptionsChooser
        title="Выравнивание"
        options={imagePositionOptions}
        value={settings?.countdown?.imagePosition ?? 'center'}
        onChange={v => setImagePosition(v as ActionTimerImagePosition)}
      />
    </BorderedContainer>
  )
}

export default ActionTimerSettings
