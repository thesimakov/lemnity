import SwitchableField from '@/components/SwitchableField'
import { Input, Textarea } from '@heroui/input'
import useWidgetSettingsStore, { useFormSettings } from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'
import ColorAccessory from '@/components/ColorAccessory'

const AgreementPoliciesField = () => {
  const { setAgreement } = useFormSettings()
  const agreement = useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'agreement', STATIC_DEFAULTS.form.agreement)
  )
  const { enabled, text, policyUrl, agreementUrl, color } = agreement
  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const errors = showValidation ? getErrors('form.agreement') : []

  return (
    <SwitchableField
      title="Согласие и политика"
      enabled={enabled}
      onToggle={enabled => setAgreement(enabled, text ?? '', policyUrl ?? '', agreementUrl ?? '', color ?? '#000000')}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-2">
          <Textarea
            isDisabled
            radius="sm"
            variant="bordered"
            minRows={2}
            placeholder="Я даю согласие на обработку моих персональных данных ООО Компания (ИНН 0000000000) в целях обработки заявки и обратной связи. Политика конфиденциальности по ссылке."
            className="max-w-full"
            classNames={{
              input: 'placeholder:text-[#AFAFAF]'
            }}
            value={text ?? ''}
            isInvalid={enabled && errors.some(e => e.path.endsWith('text'))}
            errorMessage={errors.find(e => e.path.endsWith('text'))?.message}
            onValueChange={text => setAgreement(enabled, text, policyUrl ?? '', agreementUrl ?? '', color ?? '#000000')}
          />
          <ColorAccessory
            color={color ?? '#000000'}
            onChange={newColor => setAgreement(enabled, text ?? '', policyUrl ?? '', agreementUrl ?? '', newColor)}
          />
        </div>
        <span className="text-lg font-normal">URL согласие</span>
        <Input
          radius="sm"
          variant="bordered"
          placeholder="lemnity.ru/policy"
          className="max-w-full"
          classNames={{
            input: 'placeholder:text-[#AFAFAF]'
          }}
          value={agreementUrl ?? ''}
          isInvalid={enabled && errors.some(e => e.path.endsWith('agreementUrl'))}
          errorMessage={errors.find(e => e.path.endsWith('agreementUrl'))?.message}
          onValueChange={url => setAgreement(enabled, text ?? '', policyUrl ?? '', url, color ?? '#000000')}
        />
        <span className="text-lg font-normal">URL политики обработки персональных данных</span>
        <Input
          radius="sm"
          variant="bordered"
          placeholder="lemnity.ru/policy"
          className="max-w-full"
          classNames={{
            input: 'placeholder:text-[#AFAFAF]'
          }}
          value={policyUrl ?? ''}
          isInvalid={enabled && errors.some(e => e.path.endsWith('policyUrl'))}
          errorMessage={errors.find(e => e.path.endsWith('policyUrl'))?.message}
          onValueChange={url => setAgreement(enabled, text ?? '', url, agreementUrl ?? '', color ?? '#000000')}
        />
      </div>
    </SwitchableField>
  )
}

export default AgreementPoliciesField
