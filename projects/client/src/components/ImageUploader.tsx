import { useEffect, useState } from 'react'
import CustomSwitch from './CustomSwitch'
import SvgIcon from './SvgIcon'
import iconUpload from '@/assets/icons/upload-stub.svg'
import imageUpload from '@/assets/icons/image-upload.svg'

type ImageUploaderProps = {
  checked?: boolean
  setChecked?: (checked: boolean) => void
  title: string
  recommendedResolution: string
  fileSize: string
  formats?: string[]
  classNames?: string
  hideSwitch?: boolean
  onFileSelect?: (file: File | null) => void
  isInvalid?: boolean
  errorMessage?: string
}

const ImageUploader = ({
  checked,
  setChecked = () => {},
  title,
  recommendedResolution,
  fileSize,
  formats = ['png', 'jpeg'],
  classNames,
  hideSwitch,
  onFileSelect,
  isInvalid,
  errorMessage
}: ImageUploaderProps) => {
  const [fileName, setFileName] = useState<string>('Нажмите чтобы выбрать файл')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFileName(file ? file.name : 'Нажмите чтобы выбрать файл')
    onFileSelect?.(file)

    setPreviewUrl(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-lg border border-gray-200 ${classNames}`}>
      <div className="flex flex-row gap-2">
        <span className="text-black">{title}</span>
        {!hideSwitch && (
          <CustomSwitch
            isSelected={checked}
            onValueChange={setChecked}
            selectedColor="group-data-[selected=true]:!bg-[#5951E5]"
            className="ml-auto"
            size="sm"
          />
        )}
      </div>
      <div className="flex flex-row gap-3 w-full">
        <img
          src={previewUrl ?? imageUpload}
          alt="image"
          className="w-14 h-14 object-cover rounded-md"
        />
        <label
          htmlFor="img"
          className="flex-1 h-14 flex items-center gap-3 px-3 py-2 bg-[#F4F4F5] hover:bg-[#E4E4E7] border-2 border-[#E4E4E7] rounded-md cursor-pointer transition-colors"
        >
          <SvgIcon src={iconUpload} size={20} className="text-black w-min" />
          <span className="text-sm text-gray-700 truncate">{fileName}</span>
          <input
            id="img"
            type="file"
            accept={`image/${formats.join(', image/')}`}
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <span className="text-sm text-gray-600 shrink-0 leading-tight">
          Размер файла: {fileSize}
          <br />
          Рекомендуемый размер: {recommendedResolution}
          <br />
          Формат: {formats.join(', ')}
        </span>
      </div>
      {checked && isInvalid && <span className="text-sm text-red-500">{errorMessage}</span>}
    </div>
  )
}

export default ImageUploader
