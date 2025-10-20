import SwitchableField from '@/components/SwitchableField'
import { Radio, RadioGroup } from '@heroui/radio'
import { useFormSettings } from '@/stores/widgetSettingsStore'

const CountdownField = () => {
  const { settings, setCountdownEnabled } = useFormSettings()

  return (
    <SwitchableField
      title="Обратный отсчёт"
      enabled={settings?.countdown?.enabled ?? false}
      onToggle={setCountdownEnabled}
    >
      <RadioGroup value="countdown">
        <Radio
          classNames={{
            base: '!max-w-none flex-1 h-14 rounded-md border data-[selected=true]:border-[#D9D9E0] data-[selected=true]:bg-white border-[#E4E4E7] bg-[#F8F8FA] hover:bg-[#F1F1F4] p-2 m-0',
            labelWrapper: 'pl-2 py-1',
            label: 'text-gray-700',
            wrapper: 'border-[#373737] group-data-[selected=true]:!border-[#373737] border-small',
            control: 'bg-[#373737] w-3.5 h-3.5'
          }}
          value="countdown"
        >
          Осталось: Дата / Время / Год
        </Radio>
      </RadioGroup>
    </SwitchableField>
  )
}

export default CountdownField
