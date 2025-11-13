import SwitchableField from '@/components/SwitchableField'
import { Input, Textarea } from '@heroui/input'
import useWidgetSettingsStore, { useWidgetStaticDefaults } from '@/stores/widgetSettingsStore'
import { useFormSettings } from '@/stores/widgetSettings/formHooks'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'
import ColorAccessory from '@/components/ColorAccessory'

const AdsInfoField = () => {
  const { setAdsInfo } = useFormSettings()
  const staticDefaults = useWidgetStaticDefaults()
  const adsInfo = useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'adsInfo', staticDefaults!.form.adsInfo)
  )
  const { enabled, text, policyUrl, color } = adsInfo
  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const errors = showValidation ? getErrors('form.adsInfo') : []

  const handleToggle = (nextEnabled: boolean) => {
    setAdsInfo(nextEnabled, text ?? '', policyUrl ?? '', color ?? '#000000')
  }

  return (
    <SwitchableField title="Рекламная информация" enabled={enabled} onToggle={handleToggle}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-2">
          <Textarea
            isDisabled
            radius="sm"
            variant="bordered"
            minRows={2}
            placeholder="Нажимая на кнопку, вы даёте своё согласие на получение рекламно-информационной рассылки."
            className="max-w-full"
            classNames={{
              input: 'placeholder:text-[#AFAFAF]'
            }}
            value={text ?? ''}
            isInvalid={enabled && errors.some(e => e.path.endsWith('text'))}
            errorMessage={errors.find(e => e.path.endsWith('text'))?.message}
            onValueChange={text => setAdsInfo(enabled, text, policyUrl ?? '', color ?? '#000000')}
          />
          <ColorAccessory
            color={color ?? '#000000'}
            onChange={color => setAdsInfo(enabled, text ?? '', policyUrl ?? '', color)}
          />
        </div>
        <span className="text-lg font-normal">URL на политику получения рекламной информации</span>
      </div>
      <Input
        radius="sm"
        variant="bordered"
        placeholder="lemnity.ru/ads"
        className="max-w-full"
        classNames={{
          input: 'placeholder:text-[#AFAFAF]'
        }}
        value={policyUrl ?? ''}
        isInvalid={enabled && errors.some(e => e.path.endsWith('policyUrl'))}
        errorMessage={errors.find(e => e.path.endsWith('policyUrl'))?.message}
        onValueChange={url => setAdsInfo(enabled, text ?? '', url, color ?? '#000000')}
      />
    </SwitchableField>
  )
}

export default AdsInfoField
