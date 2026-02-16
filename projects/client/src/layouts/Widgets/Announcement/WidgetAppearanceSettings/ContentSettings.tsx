import CustomRadioGroup from '@/components/CustomRadioGroup'
import ImageUploader from '@/components/ImageUploader'
import SwitchableField from '@/components/SwitchableField'
import type {
  Content,
  ContentAlignment,
  Format,
} from '@lemnity/widget-config/widgets/announcement'

type ContentSettingsProps = {
  contentEnabled: boolean
  contentType: Content
  contentAlignment?: ContentAlignment
  contentUrl?: string
  format: Format
  onContentEnabledChange: (enabled: boolean) => void
  onContentTypeChange: (contentType: Content) => void
  onContentAlignmentChange: (alignment: ContentAlignment) => void
  onContentUrlChange: (url: string) => void
}

type ContentTypeOptions = {
  label: string
  value: Content
}

type ContentAlignmentOptions = {
  label: string
  value: ContentAlignment
}

const ContentSettings = (props: ContentSettingsProps) => {
  const contentTypeOptions: ContentTypeOptions[] = [
    { label: 'Картинка сверху', value: 'imageOnTop' },
    { label: 'Фон всего окна', value: 'background' },
    { label: 'Видео', value: 'video' },
  ]

  const contentAlignmentOptions: ContentAlignmentOptions[] = [
    { label: 'Сверху', value: 'top' },
    { label: 'По центру', value: 'center' },
    { label: 'Снизу', value: 'bottom' },
  ]

  const handleContentTypeChange = (value: string) => {
    // because generics are for loosers apparently
    // (looking at you, Hero UI)
    props.onContentTypeChange(value as Content)
  }

  const handleAlignmentChange = (value: string) => {
    props.onContentAlignmentChange(value as ContentAlignment)
  }

  return (
    <SwitchableField
      title="Контент"
      enabled={props.contentEnabled}
      onToggle={props.onContentEnabledChange}
      classNames={{
        title: 'text-[16px] leading-4.75 font-normal',
      }}
    >
      <div className="flex flex-col gap-2.5">
        {props.format === 'announcement' && <>
          <CustomRadioGroup
            options={contentTypeOptions}
            value={props.contentType}
            onValueChange={handleContentTypeChange}
          />
        </>}

        <ImageUploader
          classNames={{ container: 'w-full' }}
          hideSwitch
          hidePreview
          noBorder
          noPadding
          recommendedResolution="600x600"
          fileSize="До 25 Mb"
          formats={['png', 'jpeg', 'jpg', 'webp']}
          url={props.contentUrl || ''}
          // onFileSelect={handleImageUpload}
          // isInvalid={!!imageUrlError}
          // errorMessage={imageUrlError?.message}
        />

        {props.contentType !== 'video' && props.format === 'announcement' && (
          <>
            <h2 className="text-[16px] leading-4.75">Выравнивание</h2>
            <CustomRadioGroup
              options={contentAlignmentOptions}
              value={props.contentAlignment}
              onValueChange={handleAlignmentChange}
            />
          </>
        )}
      </div>
    </SwitchableField>
  )
}

export default ContentSettings
