import EditableList, { type EditableListItem } from '@/components/EditableList'
import { Checkbox } from '@heroui/checkbox'
import { useCallback, useState } from 'react'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import SectorItem, { type SectorData } from '../SectorItem/SectorItem'

const WidgetSettingsField = () => {
  const [randomize, setRandomize] = useState<boolean>(false)
  const [sectors, setSectors] = useState<EditableListItem<SectorData>[]>([
    {
      id: '1',
      mode: 'text',
      text: 'Бесплатная установка',
      icon: 'trophy',
      color: '#FF6B6B'
    },
    {
      id: '2',
      mode: 'icon',
      text: 'Бесплатная замерка',
      icon: 'star',
      color: '#4ECDC4'
    },
    {
      id: '3',
      mode: 'icon',
      text: 'Бесплатная установка',
      icon: 'rocket',
      color: '#45B7D1'
    }
  ])

  const handleAdd = () => {
    const newSector: EditableListItem<SectorData> = {
      id: Date.now().toString(),
      mode: 'text',
      text: 'Бесплатная установка',
      icon: 'trophy',
      color: '#98D8C8'
    }
    setSectors([...sectors, newSector])
  }

  const getRandomOrderCheckbox = () => {
    return (
      <Checkbox
        isSelected={randomize}
        onValueChange={setRandomize}
        classNames={{
          wrapper:
            'before:border-[#373737] rounded-[4px] before:rounded-[4px] after:rounded-[4px] after:bg-[#373737]',
          base: 'max-w-full',
          label: 'text-gray-700 text-base'
        }}
      >
        В случайном порядке
      </Checkbox>
    )
  }

  const updateSector = useCallback(
    (index: number, updates: Partial<SectorData>) => {
      const updated = [...sectors]
      updated[index] = { ...updated[index], ...updates }
      setSectors(updated)
      console.log(index, updates, updated)
    },
    [sectors]
  )

  const [openedIndex, setOpenedIndex] = useState<number | null>(null)

  const settingsSector = (sector: EditableListItem<SectorData>, index: number) => {
    return openedIndex === index ? (
      <div className="bg-[#EAEAEA] border border-[#E8E8E8] rounded-lg p-4 flex flex-col gap-3">
        <span className="text-md">Настройки слота</span>
        <Input
          variant="faded"
          classNames={{
            input: 'placeholder:text-[#AAAAAA]',
            inputWrapper: 'bg-white'
          }}
          placeholder="Укажите промокод слота"
          radius="sm"
          size="lg"
          description="Промокод можно показывать после выпадения приза"
        />
        <Input
          variant="faded"
          classNames={{
            input: 'placeholder:text-[#AAAAAA]',
            inputWrapper: 'bg-white'
          }}
          placeholder="Вероятность выпадения"
          radius="sm"
          size="lg"
          description="Оставьте поле пустым во всех бонусах для равномерного выпадения. Процент считается по формуле сумма всех полей ÷ количество бонусов. Посмотреть процент можно выше. Вероятность выпадения — 100%"
        />
        <div className="flex gap-3">
          <Button radius="sm" className="bg-[#C8E9C7] text-[#138C26]">
            Сохранить
          </Button>
          <Button radius="sm" className="bg-[#FFD3C8] text-[#C01010]">
            Отменить
          </Button>
        </div>
      </div>
    ) : null
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-2xl">Настройка виджета</span>
      <div className="flex flex-col gap-2 p-3 rounded-lg border border-gray-200">
        <span className="text-black font-semibold pb-2">Сектора</span>
        {getRandomOrderCheckbox()}
        <EditableList
          items={sectors}
          onItemsChange={setSectors}
          maxItems={12}
          classNames={{
            index:
              'flex items-center justify-center min-w-[40px] rounded-md border h-full border-[#E8E8E8]',
            delete:
              'flex items-center justify-center min-w-[40px] rounded-md border h-full border-[#E8E8E8]'
          }}
          renderItem={(sector, index) => (
            <SectorItem
              key={sector.id}
              sector={sector}
              onModeChange={mode => updateSector(index, { mode })}
              onTextChange={text => updateSector(index, { text })}
              onIconChange={icon => updateSector(index, { icon })}
              onColorChange={color => updateSector(index, { color })}
              onSettings={() => setOpenedIndex(prev => (prev === index ? null : index))}
            />
          )}
          renderBelow={settingsSector}
          onAdd={handleAdd}
          onDelete={(item: EditableListItem<SectorData>, index: number) => {
            setSectors(sectors.filter(s => s.id !== item.id))
            if (openedIndex !== null && index <= openedIndex) {
              setOpenedIndex(null)
            }
          }}
          addButtonLabel="Добавить сектор"
        />
      </div>
    </div>
  )
}

export default WidgetSettingsField
