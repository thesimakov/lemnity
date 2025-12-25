import { Select, SelectItem, type SelectedItems } from '@heroui/select'
import { Input } from '@heroui/input'
import SvgIcon from '@/components/SvgIcon'
import iconArrowUp from '@/assets/icons/arrow-up.svg'
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
const ICON_DEFAULT_PAYLOAD_TYPE = FAB_MENU_BUTTON_PRESETS.reduce(
  (acc, preset) => ({ ...acc, [preset.icon]: preset.payload.type }),
  {} as Record<FABMenuIconKey, FABMenuPayloadType>
)

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
  onIconChange,
  onPayloadTypeChange,
  onPayloadValueChange,
  isPendingSelection
}: FABSectorItemProps) => {
  const renderValue = (items: SelectedItems<object>) => {
    if (isPendingSelection) {
      return <span className="text-sm font-semibold text-gray-900">Выбрать кнопку</span>
    }

    return items.map(item => (
      <span key={item.textValue} className="flex items-center justify-start gap-2 text-sm">
        {FAB_MENU_ICON_OPTIONS[item.textValue as FABMenuIconKey].showIcon && (
          <SvgIcon
            src={FAB_MENU_ICON_OPTIONS[item.textValue as FABMenuIconKey].icon}
            size={16}
            className="w-min"
          />
        )}
        {FAB_MENU_ICON_OPTIONS[item.textValue as FABMenuIconKey].label}
      </span>
    ))
  }

  const handleIconChange = (keys: SharedSelection) => {
    const selected = Array.from(keys)[0]
    if (!selected) return
    const nextIcon = selected as FABMenuIconKey
    onIconChange(nextIcon)
    const defaultType = ICON_DEFAULT_PAYLOAD_TYPE[nextIcon]
    if (defaultType) onPayloadTypeChange(defaultType)
  }

  const handlePayloadTypeChange = (keys: SharedSelection) => {
    const next = Array.from(keys)[0]
    if (next) onPayloadTypeChange(next as FABMenuPayloadType)
  }

  const renderPendingTrigger = () => (
    <div
      className="pointer-events-none flex items-center gap-2 rounded-md border border-[#D9D9E0] bg-white px-3 py-2 text-sm w-full"
      aria-label="Выбрать кнопку"
    >
      <SvgIcon src={iconHeartDislike} size={16} className="text-current w-min" />
      Выбрать кнопку
      <SvgIcon src={iconArrowUp} size={10} className="text-gray-500 w-min ml-auto" />
    </div>
  )

  const renderPayloadType = () => {
    if (isPendingSelection) return renderPendingTrigger()

    return (
      <Select
        selectedKeys={sector.icon ? [sector.icon] : []}
        onSelectionChange={handleIconChange}
        aria-label="Тип иконки"
        classNames={{
          trigger:
            'shadow-none border border-[#D9D9E0] rounded-md min-w-[160px] h-10 flex items-center bg-white'
        }}
        renderValue={renderValue}
      >
        {Object.entries(FAB_MENU_ICON_OPTIONS).map(([key, entry]) => (
          <SelectItem key={key} textValue={key}>
            <div className="flex items-center gap-2">
              {entry.showIcon && (
                <SvgIcon src={entry.icon} size="16px" className="w-min text-black" />
              )}
              <span className="text-sm">{entry.label}</span>
            </div>
          </SelectItem>
        ))}
      </Select>
    )
  }

  const renderCustomLabel = () => {
    if (sector.icon !== 'custom') return null
    if (isPendingSelection) return null
    return (
      <Input
        placeholder="Название кнопки"
        value={sector.label}
        onValueChange={onLabelChange}
        classNames={{
          inputWrapper: 'rounded-md border bg-white border-[#E8E8E8] h-10 min-h-10'
        }}
        size="lg"
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
          trigger:
            'shadow-none border border-[#E8E8E8] rounded-md min-w-[160px] h-10 flex items-center bg-white'
        }}
        renderValue={items =>
          items.map(item => {
            const option = options.find(opt => opt.type === item.textValue)
            return <span className="text-sm">{option?.label ?? item.textValue}</span>
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
    return (
      <Input
        placeholder={FAB_MENU_PAYLOAD_PLACEHOLDERS[sector.payload.type] ?? ''}
        value={sector.payload.value}
        onValueChange={onPayloadValueChange}
        classNames={{
          inputWrapper: 'rounded-md border bg-white border-[#E4E4E7] h-10 min-h-10'
        }}
        size="lg"
      />
    )
  }
  return (
    <div className="flex flex-col gap-2">
      <div className={`flex flex-row gap-2 h-10 w-full ${isPendingSelection ? 'opacity-95' : ''}`}>
        {renderPayloadType()}
        {renderCustomLabel()}
        {renderPayloadSubtype()}
        {renderPayloadValue()}
      </div>
    </div>
  )
}

export default FABSectorItem
