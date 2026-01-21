import { Select, SelectItem } from '@heroui/select'
import { Input } from '@heroui/input'
import SvgIcon from '@/components/SvgIcon'
import iconHeartDislike from '@/assets/icons/heart-dislike.svg'
import {
  FAB_MENU_BUTTON_PRESETS,
  FAB_MENU_ICON_OPTIONS,
  FAB_MENU_PAYLOAD_PLACEHOLDERS
} from '@/layouts/Widgets/FABMenu/buttonLibrary'
import type {
  FABMenuIconKey,
  FABMenuPayloadType,
  FABMenuSectorItem
} from '@/layouts/Widgets/FABMenu/types'
import type { SharedSelection } from '@heroui/system'
import { cn } from '@heroui/theme'
import { PatternFormat } from 'react-number-format'
import { useState } from 'react'

type FABSectorItemProps = {
  sector: FABMenuSectorItem
  onLabelChange: (label: string) => void
  onIconChange: (icon: FABMenuIconKey) => void
  onPayloadTypeChange: (type: FABMenuPayloadType) => void
  onPayloadValueChange: (value: string) => void
  onColorChange: (color: string) => void
  onHelperChange: (helper: string) => void
  isPendingSelection?: boolean
}

const MESSENGER_ICONS: FABMenuIconKey[] = FAB_MENU_BUTTON_PRESETS.filter(
  preset => preset.group === 'messenger'
).map(preset => preset.icon)
const MESSENGER_PAYLOAD_TYPES: FABMenuPayloadType[] = ['nickname', 'link']

const isMessengerIcon = (icon: FABMenuIconKey) => MESSENGER_ICONS.includes(icon)
const getMessengerPayloadOptions = () =>
  PAYLOAD_OPTIONS.filter(option => MESSENGER_PAYLOAD_TYPES.includes(option.type))

const PAYLOAD_OPTIONS: { label: string; type: FABMenuPayloadType }[] = [
  { label: 'Email', type: 'email' },
  { label: 'Телефон', type: 'phone' },
  { label: 'Ссылка', type: 'link' },
  { label: 'Никнейм', type: 'nickname' },
  { label: 'Скрипт', type: 'script' },
  { label: 'Якорь', type: 'anchor' }
]

const FABSectorItem = ({
  sector,
  onLabelChange,
  // onIconChange,
  onPayloadTypeChange,
  onPayloadValueChange,
  isPendingSelection
}: FABSectorItemProps) => {
  const [isInputInvalid, setIsInputInvalid] = useState(false)

  const handlePayloadTypeChange = (keys: SharedSelection) => {
    const next = Array.from(keys)[0]
    if (next) onPayloadTypeChange(next as FABMenuPayloadType)
  }

  const renderPendingTrigger = () => (
    <div
      className={cn(
        'pointer-events-none flex items-center gap-2 rounded-md',
        'border border-[#E4E4E7] bg-white px-2.5 py-2 text-base w-full'
      )}
      aria-label="Выбрать кнопку"
    >
      <SvgIcon
        src={iconHeartDislike}
        size={24}
        className="text-current w-min"
      />
      Выбрать кнопку
    </div>
  )

  const renderPayloadType = () => {
    if (isPendingSelection) {
      return renderPendingTrigger()
    }

    const handleSectorLabelChnage = (value: string) => {
      if (value.length > 14) {
        // TODO: сообщение пользователю
        setIsInputInvalid(true)
        return
      }

      setIsInputInvalid(false)
      onLabelChange(value)
    }

    return (
      <Input
        value={sector.label}
        onValueChange={handleSectorLabelChnage}
        placeholder={sector.label}
        isInvalid={isInputInvalid}
        classNames={{
          inputWrapper: cn(
            'border bg-white border-[#E4E4E7] rounded-[5px]',
            'shadow-none h-12.75 min-h-10 px-2.5',
          ),
          input: 'text-base'
        }}
        startContent={FAB_MENU_ICON_OPTIONS[sector.icon].showIcon && (
          <SvgIcon
            src={FAB_MENU_ICON_OPTIONS[sector.icon].icon}
            size={20}
            className="w-min text-black"
          />
        )}
      />
    )
  }

  const renderPayloadSubtype = () => {
    if (!isMessengerIcon(sector.icon)) return null
    if (isPendingSelection) return null
    const options = getMessengerPayloadOptions()

    return (
      <Select
        selectedKeys={sector.payload.type ? [sector.payload.type] : []}
        onSelectionChange={handlePayloadTypeChange}
        aria-label="Тип действия"
        classNames={{
          trigger: cn(
            'shadow-none border border-[#E8E8E8] rounded-md h-10 px-2.5',
            'flex items-center bg-white',
          ),
          base: 'w-74',
        }}
        renderValue={items =>
          items.map(item => {
            const option = options.find(opt => opt.type === item.textValue)
            return (
              <span className="text-base">
                {option?.label ?? item.textValue}
              </span>
            )
          })
        }
      >
        {options.map(option => (
          <SelectItem key={option.type} textValue={option.type}>
            <span className="text-sm">{option.label}</span>
          </SelectItem>
        ))}
      </Select>
    )
  }

  const renderPayloadValue = () => {
    if (isPendingSelection) return null
    if (!sector.payload.type) return null

    if ('phone' === sector.payload.type) {
      return (
        <PatternFormat
          customInput={Input}
          format="+7 (###) ###-##-##"
          mask="_"
          value={
            sector.payload.value.startsWith('+7')
              ? sector.payload.value.substring(2)
              : sector.payload.value
          }
          onValueChange={(values) => {
            const cleanValue = values.value ? `+7${values.value}` : ''
            onPayloadValueChange(cleanValue)
          }}
          // Hero UI Input props
          placeholder={FAB_MENU_PAYLOAD_PLACEHOLDERS[sector.payload.type] ?? ''}
          classNames={{
          inputWrapper: cn(
              'shadow-none rounded-md border bg-white border-[#E4E4E7]',
              'rounded-[5px] h-10 min-h-10 px-2.5',
            ),
          }}
          size="lg"
        />
      )
    }

    return (
      <Input
        placeholder={FAB_MENU_PAYLOAD_PLACEHOLDERS[sector.payload.type] ?? ''}
        value={sector.payload.value}
        onValueChange={onPayloadValueChange}
        classNames={{
          inputWrapper: cn(
            'shadow-none rounded-md border bg-white border-[#E4E4E7]',
            'rounded-[5px] h-10 min-h-10 px-2.5',
          ),
        }}
        size="lg"
      />
    )
  }
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          'flex flex-row gap-2 h-10 w-full',
          isPendingSelection && 'opacity-95'
        )}
      >
        {renderPayloadType()}
        {renderPayloadSubtype()}
        {renderPayloadValue()}
      </div>
    </div>
  )
}

export default FABSectorItem
