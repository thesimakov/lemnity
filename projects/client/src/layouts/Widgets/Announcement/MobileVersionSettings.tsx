import SwitchableField from '@/components/SwitchableField'
import CustomRadioGroup, {
  type CustomRadioGroupOption,
} from '@/components/CustomRadioGroup'
import ImageUploader from '@/components/ImageUploader'

import { uploadImage } from '@/api/upload'

import type { MobileTrigger } from '@lemnity/widget-config/widgets/announcement'
import ButtonAppearenceSettings from '@/layouts/WidgetSettings/DisplaySettingsTab/ButtonAppearenceSettings/ButtonAppearenceSettings'
import useUrlImageOrDefault from './utils/useUrlImage'

// const noBackgroundImageUrl = 'https://app.lemnity.ru/uploads/images/2026/01/2f539d8a-e1a6-4ced-a863-8e4aa37242d9-lemnity-pic.webp'
type MobileVersionSettingsProps = {
  enabled: boolean
  triggerType: MobileTrigger
  imageUrl?: string
  triggerText: string
  triggerFontColor: string
  triggerBackgroundColor: string
  onToggle: (enabled: boolean) => void
  onTriggerTypeChange: (type: MobileTrigger) => void
  onImageUrlChange: (url: string | undefined) => void
  onTriggerTextChange: (text: string) => void
  onTriggerFontColorChange: (color: string) => void
  onTriggerBackgroundColorChange: (color: string) => void
}

const radioOptions: CustomRadioGroupOption[] = [
  { label: 'Картинка', value: 'image' },
  { label: 'Кнопка', value: 'button' },
]

const MobileVersionSettings = (props: MobileVersionSettingsProps) => {
  const {
    base64Image,
    // error,
    // isLoading,
  } = useUrlImageOrDefault(props.imageUrl)

  const handleTriggerTypeChange = (value: string) => {
    props.onTriggerTypeChange(value as MobileTrigger)
  }

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      props.onImageUrlChange(undefined)
      return
    }

    uploadImage(file).then(({ url }) => {
      props.onImageUrlChange(url)
    })
  }

  return (
    <SwitchableField
      title='Мобильная версия'
      enabled={props.enabled}
      onToggle={props.onToggle}
    >
      <div className="flex flex-col gap-2.5">
        <CustomRadioGroup
          options={radioOptions}
          value={props.triggerType}
          onValueChange={handleTriggerTypeChange}
        />

        {props.triggerType === 'image'
          ? (
            <div className='w-full py-4'>
              <div className='w-full flex flex-row gap-3.75'>
                <img
                  src={base64Image as string}
                  alt="image"
                  className="w-21.25 h-21.25 object-cover rounded-[5px]"
                />
                <div className='w-full flex flex-col gap-2.5'>
                  <span className='text-[16px] leading-4.75'>
                    Использовать свою картинку
                  </span>
                  <ImageUploader
                    classNames={{ container: 'w-full' }}
                    hideSwitch
                    hidePreview
                    noBorder
                    noPadding
                    recommendedResolution="600x600"
                    fileSize="До 25 Mb"
                    formats={['png', 'jpeg', 'jpg', 'webp']}
                    url={props.imageUrl || ''}
                    onFileSelect={handleImageUpload}
                    // isInvalid={!!imageUrlError}
                    // errorMessage={imageUrlError?.message}
                  />
                </div>
              </div>
            </div>
          )
          : (
            <ButtonAppearenceSettings
              noIcon
              buttonText={props.triggerText}
              buttonBackgroundColor={props.triggerBackgroundColor}
              buttonTextColor={props.triggerFontColor}
              onBackgroundColorChange={props.onTriggerBackgroundColorChange}
              onFontColorChange={props.onTriggerFontColorChange}
              onTriggerTextChange={props.onTriggerTextChange}
            />
          )}
      </div>
    </SwitchableField>
  )
}

export default MobileVersionSettings