import { useState } from 'react'
import { DateInput } from '@heroui/date-input'
import { cn } from '@heroui/theme'
import { parseAbsoluteToLocal } from '@internationalized/date'

import SwitchableField from '@/components/SwitchableField'
import ColorPicker from '@/components/ColorPicker'


const CountdownSettings = () => {
  const [enabled, setEnabled] = useState(true)

  return (
    <SwitchableField
      title="Обратный отсчёт"
      enabled={enabled}
      onToggle={setEnabled}
      classNames={{
        title: 'text-[16px] leading-4.75 font-normal',
      }}
    >
      <div className="w-full flex flex-row flex-wrap gap-2.5">
        <DateInput
          hourCycle={24}
          defaultValue={parseAbsoluteToLocal(new Date().toISOString())}
          classNames={{
            base: 'min-w-76 flex-1',
            inputWrapper: cn(
              'rounded-md border bg-white border-[#E8E8E8] rounded-[5px]',
              'shadow-none h-12.5 px-2.5',
            ),
            input: 'placeholder:text-[#AAAAAA] text-base'
          }}
          aria-label="Дата окончания события"
        />

        <ColorPicker
          initialColor="#000000"
          onColorChange={() => {}}
        />
        <ColorPicker
          initialColor="#FFFFFF"
          onColorChange={() => {}}
        />
      </div>
    </SwitchableField>
  )
}

export default CountdownSettings
