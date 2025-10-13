import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import { Input } from '@heroui/input'
import { Radio, RadioGroup } from '@heroui/radio'
import { useState } from 'react'

type Mode = 'everyPage' | 'periodically'

const DontShowField = () => {
  const [mode, setMode] = useState<Mode>('everyPage')

  const getRadioDot = (value: Mode, mode: Mode) => {
    return (
      <RadioGroup value={value} onValueChange={v => setMode(v as Mode)}>
        <Radio
          classNames={{
            label: 'text-gray-700',
            wrapper: 'border-[#373737] group-data-[selected=true]:!border-[#373737] border-small',
            control: 'bg-[#373737] w-3.5 h-3.5'
          }}
          value={mode}
        ></Radio>
      </RadioGroup>
    )
  }

  return (
    <BorderedContainer className="flex-col gap-2">
      <span>Не показывать</span>
      <div className="flex flex-row gap-2">
        <BorderedContainer
          className="w-full flex-row items-center gap-2 h-12"
          onClick={() => setMode('everyPage')}
        >
          {getRadioDot(mode, 'everyPage')}
          <span>После выигрыша</span>
        </BorderedContainer>
        <BorderedContainer
          className="w-full flex-row items-center gap-2 h-12"
          onClick={() => setMode('periodically')}
        >
          {getRadioDot(mode, 'periodically')}
          <span>После</span>
          <Input
            radius="sm"
            maxLength={2}
            className="min-w-[46px] w-[46px]"
            variant="bordered"
            placeholder="20"
          />
          <span>показов</span>
        </BorderedContainer>
      </div>
    </BorderedContainer>
  )
}

export default DontShowField
