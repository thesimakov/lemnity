import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import { Checkbox } from '@heroui/checkbox'
import { Input } from '@heroui/input'
import { useState } from 'react'

const DisplaySettingsField = () => {
  const [showWhenUserLeaves, setShowWhenUserLeaves] = useState(false)
  const [scrollBelow, setScrollBelow] = useState('20')
  const [scrollBelowEnabled, setScrollBelowEnabled] = useState(false)
  const [timerAfterOpen, setTimerAfterOpen] = useState('20')
  const [timerAfterOpenEnabled, setTimerAfterOpenEnabled] = useState(false)

  const isScrollBelowValid = (value: string) => {
    if (!scrollBelowEnabled) return true
    if (value.length == 0) return false
    if (Number(value) < 0) return false

    return true
  }

  const isTimerAfterOpenValid = (value: string) => {
    if (!timerAfterOpenEnabled) return true
    if (value.length == 0) return false
    if (Number(value) < 0) return false

    return true
  }

  return (
    <>
      <BorderedContainer className="flex-col gap-2">
        <span>Настройки показа</span>
        <BorderedContainer className="h-12 py-0">
          <Checkbox
            isSelected={showWhenUserLeaves}
            onValueChange={setShowWhenUserLeaves}
            classNames={{
              wrapper:
                'before:border-[#373737] rounded-[4px] before:rounded-[4px] after:rounded-[4px] after:bg-[#373737]',
              base: 'max-w-full',
              label: 'text-[#797979] text-base'
            }}
          >
            Когда пользователь покидает сайт
          </Checkbox>
        </BorderedContainer>
        <BorderedContainer className="flex-row gap-2 items-center h-12 py-0">
          <Checkbox
            isSelected={scrollBelowEnabled}
            onValueChange={v => {
              setScrollBelowEnabled(v)
              if(!v) setScrollBelow('')
            }}
            classNames={{
              wrapper:
                'before:border-[#373737] rounded-[4px] before:rounded-[4px] after:rounded-[4px] after:bg-[#373737]',
              base: 'max-w-full',
              label: 'nowrap text-[#797979] text-base'
            }}
          >
            При скролле ниже
          </Checkbox>
          <Input
            radius="sm"
            maxLength={2}
            className="w-[46px]"
            variant="bordered"
            placeholder="20"
            value={scrollBelow}
            isInvalid={!isScrollBelowValid(scrollBelow)}
            onChange={e => setScrollBelow(e.target.value)}
          />
          <span className="text-[#797979]">% страницы сайта</span>
        </BorderedContainer>
        <BorderedContainer className="flex-row gap-2 items-center h-12 py-0">
          <Checkbox
            isSelected={timerAfterOpenEnabled}
            onValueChange={v => {
              setTimerAfterOpenEnabled(v)
              if(!v) setTimerAfterOpen('')
            }}
            classNames={{
              wrapper:
                'before:border-[#373737] rounded-[4px] before:rounded-[4px] after:rounded-[4px] after:bg-[#373737]',
              base: 'max-w-full',
              label: 'nowrap text-[#797979] text-base'
            }}
          >
            Через
          </Checkbox>
          <Input
            radius="sm"
            maxLength={2}
            className="w-[46px]"
            variant="bordered"
            placeholder="20"
            value={timerAfterOpen}
            isInvalid={!isTimerAfterOpenValid(timerAfterOpen)}
            onChange={e => setTimerAfterOpen(e.target.value)}
          />
          <span className="text-[#797979]">секунд после открытия страницы</span>
        </BorderedContainer>
      </BorderedContainer>
    </>
  )
}

export default DisplaySettingsField
