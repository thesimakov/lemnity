import CustomRadioGroup from '@/components/CustomRadioGroup'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import type { Format } from '@lemnity/widget-config/widgets/announcement'

type WidgetTypeProps = {
  format: Format
  onWidgetFormatChange: (format: Format) => void
}

type WidgetTypeOption = {
  label: string
  value: Format
}

const WidgetType = (props: WidgetTypeProps) => {
  const options: WidgetTypeOption[] = [
    { label: 'Анонс', value: 'announcement' },
    { label: 'Обратный отсчёт', value: 'countdown' },
  ]

  const handleTypeChange = (value: string) => {
    props.onWidgetFormatChange(value as Format)
  }

  return (
    <BorderedContainer>
      <div className="w-full flex flex-col gap-6">
        <h2 className="text-[16px] leading-4.75">Формат</h2>

        <CustomRadioGroup
          options={options}
          value={props.format}
          onValueChange={handleTypeChange}
        />
      </div>
    </BorderedContainer>
  )
}

export default WidgetType
