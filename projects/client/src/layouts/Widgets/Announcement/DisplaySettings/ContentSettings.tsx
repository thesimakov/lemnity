import CustomRadioGroup from "@/components/CustomRadioGroup"
import ImageUploader from "@/components/ImageUploader"
import SwitchableField from "@/components/SwitchableField"
import { useState } from "react"

type ContentType = 'imageOnTop' | 'background' | 'video'
type ContentAlignment = 'top' | 'center' | 'bottom'

const ContentSettings = () => {
  const [enabled, setEnabled] = useState(true)
  const [contentType, setContentType] = useState<ContentType>('imageOnTop')
  const [alignment, setAlignment] = useState<ContentAlignment>('center')

  const contentTypeOptions = [
    { label: 'Картинка сверху', value: 'imageOnTop' },
    { label: 'Фон всего окна', value: 'background' },
    { label: 'Видео', value: 'video' },
  ]

  const contentAlignmentOptions = [
    { label: 'Сверху', value: 'top' },
    { label: 'По центру', value: 'center' },
    { label: 'Снизу', value: 'bottom' },
  ]

  const handleContentTypeChange = (value: string) => {
    // because generics are for loosers apparently
    // (looking at you, Hero UI)
    setContentType(value as ContentType)
  }

  const handleAlignmentChange = (value: string) => {
    setAlignment(value as ContentAlignment)
  }

  return (
    <SwitchableField
      title="Контент"
      enabled={enabled}
      onToggle={setEnabled}
      classNames={{
        title: 'text-[16px] leading-4.75 font-normal',
      }}
    >
      <div className="flex flex-col gap-2.5">
        <CustomRadioGroup
          options={contentTypeOptions}
          value={contentType}
          onValueChange={handleContentTypeChange}
        />

        <ImageUploader
          classNames={{ container: 'w-full' }}
          hideSwitch
          hidePreview
          noBorder
          noPadding
          recommendedResolution="600x600"
          fileSize="До 25 Mb"
          formats={['png', 'jpeg', 'jpg', 'webp']}
          url={''}
          // onFileSelect={handleImageUpload}
          // isInvalid={!!imageUrlError}
          // errorMessage={imageUrlError?.message}
        />

        <h2 className="text-[16px] leading-4.75">Выравнивание</h2>
        {contentType !== 'video' && (
          <CustomRadioGroup
            options={contentAlignmentOptions}
            value={alignment}
            onValueChange={handleAlignmentChange}
          />
        )}
      </div>
    </SwitchableField>
  )
}

export default ContentSettings
