import { Select, SelectItem } from '@heroui/select'
import { Button } from '@heroui/button'
import SvgIcon from '@/components/SvgIcon'
import iconSettings from '@/assets/icons/gear.svg'
import { Textarea } from '@heroui/input'
import { Radio, RadioGroup } from '@heroui/radio'
import iconTrophy from '@/assets/icons/trophy.svg'
import iconSparkles from '@/assets/icons/sparkles.svg'
import iconRocket from '@/assets/icons/rocket.svg'
import type { SectorItem as SectorData, SectorItemMode as Mode } from '@stores/widgetSettings/types'

type SectorItemProps = {
  sector: SectorData
  onModeChange: (mode: Mode) => void
  onTextChange: (text: string) => void
  onTextSizeChange: (textSize: number) => void
  onIconChange: (icon: string) => void
  onSettings: () => void
}

const prizeOptions = [
  { key: 'trophy', label: iconTrophy },
  { key: 'star', label: iconSparkles },
  { key: 'rocket', label: iconRocket }
]

const SectorItem = ({
  sector,
  onModeChange,
  onTextChange,
  onIconChange,
  onSettings
}: SectorItemProps) => {
  const getRadioDot = (mode: Mode) => {
    return (
      <RadioGroup value={sector.mode} onValueChange={v => onModeChange(v as Mode)}>
        <Radio
          classNames={{
            label: 'text-gray-700',
            wrapper: 'border-[#373737] group-data-[selected=true]:!border-[#373737] border-small',
            control: 'bg-[#373737] w-[14.5px] h-[14.5px]'
          }}
          value={mode}
        ></Radio>
      </RadioGroup>
    )
  }

  const radioInput = () => {
    return (
      <div
        className={`flex items-center gap-2 flex-1 h-full rounded-md border pl-3 pr-0.5 border-[#E4E4E7]`}
        onClick={() => onModeChange('text')}
      >
        {getRadioDot('text')}
        <div className="flex items-center gap-2 flex-1">
          <Textarea
            value={sector.text ?? ''}
            onChange={e => {
              e.stopPropagation()
            }}
            onValueChange={val => onTextChange(val)}
            variant="bordered"
            radius="sm"
            minRows={1}
            classNames={{
              inputWrapper: 'border-none shadow-none px-0 min-h-8',
              input: 'text-base py-0 min-h-8 resize-none overflow-hidden'
            }}
          />
        </div>
      </div>
    )
  }

  const radioIcon = () => {
    return (
      <div
        onClick={() => onModeChange('icon')}
        className={`flex items-center gap-2 h-full rounded-md border px-2 border-[#D9D9E0]`}
      >
        {getRadioDot('icon')}
        <Select
          selectedKeys={sector.icon ? [sector.icon] : []}
          onSelectionChange={keys => {
            const selected = Array.from(keys)[0]
            if (selected) onIconChange(String(selected))
          }}
          onClick={() => onModeChange('icon')}
          aria-label="Иконка приза"
          classNames={{
            trigger: 'shadow-none !bg-transparent h-8 w-[72px] min-w-[72px] border-gray-200'
          }}
          renderValue={items => {
            return items.map(item => (
              <SvgIcon
                src={prizeOptions.find(opt => opt.key === item.textValue)!.label}
                size={'20px'}
              />
            ))
          }}
        >
          {prizeOptions.map(opt => (
            <SelectItem key={opt.key} textValue={opt.key}>
              <span className="text-xl">
                <SvgIcon src={opt.label} size={'20px'} />
              </span>
            </SelectItem>
          ))}
        </Select>
      </div>
    )
  }

  return (
    <div className="flex items-center w-full h-full gap-2">
      {radioInput()}
      {radioIcon()}
      <Button
        isIconOnly
        variant="light"
        onPress={onSettings}
        className="flex rounded-md border h-full border-[#E8E8E8] w-10 min-h-10"
        aria-label="Настройки"
      >
        <SvgIcon src={iconSettings} size={20} className="text-[#1E73BE]" />
      </Button>
    </div>
  )
}

export default SectorItem
