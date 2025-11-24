import { useState } from 'react'
import EditableList, { type EditableListItem } from '@/components/EditableList'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import { useWidgetStaticDefaults } from '@/stores/widgetSettingsStore'
import { WidgetTypeEnum } from '@lemnity/api-sdk'
import { useFABMenuSettings } from './hooks'
import type { FABMenuSectorItem, FABMenuWidgetSettings } from '@/layouts/Widgets/FABMenu/types'
import FABSectorItem from './FABSectorItem'
import FABMenuButtonPicker from './FABMenuButtonPicker'
import { createPlaceholderFABMenuSector } from './defaults'
import type { FABMenuButtonDefinition } from './buttonLibrary'

const FABMenuField = () => {
  const defaults = useWidgetStaticDefaults()
  const {
    settings,
    setFABMenuSectors,
    updateFABMenuSector,
    addFABMenuSector,
    deleteFABMenuSector
  } = useFABMenuSettings()

  const [pendingSectorId, setPendingSectorId] = useState<string | null>(null)

  const fallbackSettings =
    defaults?.widget?.type === WidgetTypeEnum.FAB_MENU
      ? (defaults.widget as FABMenuWidgetSettings)
      : undefined

  const sectors = (settings?.sectors ?? fallbackSettings?.sectors)?.items ?? []
  if (!sectors.length && !fallbackSettings) return null

  const handleAdd = () => {
    const placeholder = createPlaceholderFABMenuSector()
    addFABMenuSector(placeholder)
    setPendingSectorId(placeholder.id)
  }

  const handlePickerCancel = () => {
    if (pendingSectorId) {
      deleteFABMenuSector(pendingSectorId)
    }
    setPendingSectorId(null)
  }

  const handlePresetSelect = (preset: FABMenuButtonDefinition) => {
    if (!pendingSectorId) return
    const index = sectors.findIndex(item => item.id === pendingSectorId)
    if (index === -1) return
    updateFABMenuSector(index, {
      icon: preset.icon,
      label: preset.label,
      payload: preset.payload,
      color: preset.color,
      description: preset.description
    })
    setPendingSectorId(null)
  }

  const handleLabelChange = (index: number, label: string) => updateFABMenuSector(index, { label })
  const handleIconChange = (index: number, icon: FABMenuSectorItem['icon']) =>
    updateFABMenuSector(index, { icon })
  const handlePayloadTypeChange = (index: number, type: FABMenuSectorItem['payload']['type']) =>
    updateFABMenuSector(index, {
      payload: {
        ...sectors[index].payload,
        type
      }
    })
  const handlePayloadValueChange = (index: number, value: string) =>
    updateFABMenuSector(index, {
      payload: {
        ...sectors[index].payload,
        value
      }
    })
  const handlePayloadHelperChange = (index: number, helper: string) =>
    updateFABMenuSector(index, {
      payload: {
        ...sectors[index].payload,
        helper
      }
    })
  const handleColorChange = (index: number, color: string) => updateFABMenuSector(index, { color })

  const items: EditableListItem<FABMenuSectorItem>[] = sectors.map(item => item)

  return (
    <div className="flex flex-col gap-3">
      <BorderedContainer className="flex flex-col gap-2">
        <span className="text-lg pb-2 font-medium">Сектора</span>
        <hr className="border-gray-200" />
        <EditableList
          showIndex={false}
          items={items}
          onItemsChange={items => setFABMenuSectors(items)}
          canReorder
          classNames={{
            index: 'min-w-[40px]',
            delete: 'min-w-[40px]'
          }}
          renderItem={(sector, index) => (
            <FABSectorItem
              sector={sector}
              onLabelChange={label => handleLabelChange(index, label)}
              onIconChange={icon => handleIconChange(index, icon)}
              onPayloadTypeChange={type => handlePayloadTypeChange(index, type)}
              onPayloadValueChange={value => handlePayloadValueChange(index, value)}
              onColorChange={color => handleColorChange(index, color)}
              onHelperChange={helper => handlePayloadHelperChange(index, helper)}
              isPendingSelection={sector.id === pendingSectorId}
            />
          )}
          renderBelow={sector =>
            sector.id === pendingSectorId ? (
              <FABMenuButtonPicker onClose={handlePickerCancel} onSelect={handlePresetSelect} />
            ) : null
          }
          onDelete={(item: EditableListItem<FABMenuSectorItem>) => deleteFABMenuSector(item.id)}
          onAdd={handleAdd}
          addButtonLabel="Добавить кнопку"
          disabledReorderIds={pendingSectorId ? [pendingSectorId] : []}
        />
      </BorderedContainer>
    </div>
  )
}

export default FABMenuField
