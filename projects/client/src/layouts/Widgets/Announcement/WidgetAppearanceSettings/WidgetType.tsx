import { useState } from "react"

import CustomRadioGroup from "@/components/CustomRadioGroup"
import BorderedContainer from "@/layouts/BorderedContainer/BorderedContainer"

type AnnouncementWidgetType = 'announcement' | 'countdown'

const WidgetType = () => {
  const [type, setWidgetType] = useState<AnnouncementWidgetType>('announcement')

  const options = [
    { label: 'Анонс', value: 'announcement' },
    { label: 'Обратный отсчёт', value: 'countdown' },
  ]

  const handleTypeChange = (value: string) => {
    setWidgetType(value as AnnouncementWidgetType)
  }

  return (
    <BorderedContainer>
      <div className="w-full flex flex-col gap-6">
        <h2 className="text-[16px] leading-4.75">Формат</h2>

        <CustomRadioGroup
          options={options}
          value={type}
          onValueChange={handleTypeChange}
        />
      </div>
    </BorderedContainer>
  )
}

export default WidgetType
