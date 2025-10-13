import { useState } from 'react'
import { Input } from '@heroui/input'
import ColorAccessory from '@/components/ColorAccessory'

const ButtonSettingsField = () => {
  const [text, setText] = useState('')
  const [buttonColor, setButtonColor] = useState('#FFB34F')
  const [textColor, setTextColor] = useState('#FFFFFF')

  return (
    <div className="flex flex-col gap-2">
      <span>Текст в кнопке</span>
      <div className="flex flex-row gap-2 nowrap">
        <Input
          radius="sm"
          type="text"
          variant="bordered"
          value={text}
          onChange={e => setText(e.target.value)}
          className="max-w-full"
          classNames={{
            inputWrapper: 'h-14',
            input: 'placeholder:text-[#AFAFAF]'
          }}
        />
        <ColorAccessory color={buttonColor} onChange={setButtonColor} label="Кнопка" />
        <ColorAccessory color={textColor} onChange={setTextColor} label="Текст" />
      </div>
    </div>
  )
}

export default ButtonSettingsField
