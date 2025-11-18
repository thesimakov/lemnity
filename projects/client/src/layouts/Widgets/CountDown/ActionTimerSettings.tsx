import { useCallback } from 'react'
import ImageUploader from '@/components/ImageUploader'
import { useActionTimerSettings } from '@/layouts/Widgets/CountDown/hooks'
import { uploadImage } from '@/api/upload'
import { buildActionTimerWidgetSettings } from '@/layouts/Widgets/CountDown/defaults'

const ActionTimerSettings = () => {
  const { settings, setActionTimerImage } = useActionTimerSettings()
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
    <ImageUploader
      classNames={{ container: 'w-full' }}
      hideSwitch
      title="Промо картинка"
      recommendedResolution="600x600"
      fileSize="До 25 Mb"
      formats={['png', 'jpeg', 'jpg', 'webp']}
      url={imageUrl}
      onFileSelect={handleImageUpload}
    />
  )
}

export default ActionTimerSettings
