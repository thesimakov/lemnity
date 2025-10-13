import SwitchableField from '@/components/SwitchableField'
import { Input, Textarea } from '@heroui/input'
import { useState } from 'react'

const AdsInfoField = () => {
  const [enabled, setEnabled] = useState(true)

  return (
    <SwitchableField title="Рекламная информация" enabled={enabled} onToggle={setEnabled}>
      <div className="flex flex-col gap-3">
        <Textarea
          radius="sm"
          variant="bordered"
          minRows={2}
          placeholder="Нажимая на кнопку, вы даёте своё согласие на получение рекламно-информационной рассылки."
          className="max-w-full"
          classNames={{
            input: 'placeholder:text-[#AFAFAF]'
          }}
        />
        <span className="text-lg font-normal">URL на политику получения рекламной информации</span>
      </div>
      <Input
        radius="sm"
        variant="bordered"
        placeholder="lemnity.ru/ads"
        className="max-w-full"
        classNames={{
          input: 'placeholder:text-[#AFAFAF]'
        }}
      />
    </SwitchableField>
  )
}

export default AdsInfoField
