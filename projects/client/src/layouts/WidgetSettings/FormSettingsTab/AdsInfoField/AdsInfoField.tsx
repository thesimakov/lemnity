import SwitchableField from '@/components/SwitchableField'
import { Input, Textarea } from '@heroui/input'
import useWidgetSettingsStore, { useFormSettings } from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'

const AdsInfoField = () => {
  const { setAdsInfo } = useFormSettings()
  const adsInfo = useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'adsInfo', STATIC_DEFAULTS.form.adsInfo)
  )
  const { enabled, text, policyUrl } = adsInfo
  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const errors = showValidation ? getErrors('form.adsInfo') : []

  return (
    <SwitchableField
      title="Рекламная информация"
      enabled={enabled}
      onToggle={enabled => setAdsInfo(enabled, text ?? '', policyUrl ?? '')}
    >
      <div className="flex flex-col gap-3">
        <Textarea
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
          onValueChange={text => setAdsInfo(enabled, text, policyUrl ?? '')}
        />
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
        onValueChange={url => setAdsInfo(enabled, text ?? '', url)}
      />
    </SwitchableField>
  )
}

export default AdsInfoField
