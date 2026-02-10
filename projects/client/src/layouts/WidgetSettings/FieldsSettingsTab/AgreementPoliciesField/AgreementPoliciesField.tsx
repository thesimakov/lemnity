import { useRef } from 'react'
import { Input } from '@heroui/input'
import { cn } from '@heroui/theme'

import useWidgetSettingsStore, {
  useWidgetStaticDefaults,
} from '@/stores/widgetSettingsStore'
import { useFieldsSettings } from '@/stores/widgetSettings/fieldsHooks'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'
import { useElementSize } from '@/hooks/useElementSize'

import SwitchableField from '@/components/SwitchableField'
import ColorPicker from '@/components/ColorPicker'

const AgreementPoliciesField = () => {
  const staticDefaults = useWidgetStaticDefaults()

  const agreement = useWidgetSettingsStore(s =>
    withDefaultsPath(
      s.settings?.fields,
      'agreement',
      staticDefaults!.fields.agreement
    )
  )
  const { enabled, text, policyUrl, agreementUrl, color } = agreement
  const { setAgreement } = useFieldsSettings()

  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const errors = showValidation ? getErrors('fields.agreement') : []

  const containerDivRef = useRef<HTMLDivElement>(null)
  const { width: containerWidth } = useElementSize(containerDivRef)

  const inputStyles = {
    base: 'min-w-76 flex-1',
    inputWrapper: cn(
      'border bg-white border-[#E8E8E8] rounded-[5px]',
      'shadow-none h-12.75 px-2.5',
    ),
    input: 'placeholder:text-[#AAAAAA] text-base',
  }

  const handleToggle = (nextEnabled: boolean) => setAgreement(
    nextEnabled,
    text ?? '',
    policyUrl ?? '',
    agreementUrl ?? '',
    color ?? '#000000'
  )

  return (
    <SwitchableField
      title="Согласие и политика"
      enabled={enabled}
      onToggle={handleToggle}
    >
      <div
        ref={containerDivRef}
        className="flex flex-col gap-2.5 @container"
      >
        <div className="flex flex-row gap-2.5 flex-wrap @min-[467px]:flex-nowrap">
          <span
            className={cn(
              'w-full min-h-12.75 px-2.5 flex items-center',
              'border bg-white border-[#E8E8E8] rounded-[5px]',
              'text-[13px] text-[#AFAFAF]',
            )}
          >
            Я даю Согласие на обработку персональных данных в соотвествии с
            Политикой конфиденциальности
          </span>

          <ColorPicker
            triggerText={
              containerWidth < 467
                ? 'Цвет текста'
                : undefined
            }
            initialColor={color ?? '#000000'}
            onColorChange={newColor => setAgreement(
              enabled,
              text ?? '',
              policyUrl ?? '',
              agreementUrl ?? '',
              newColor
            )}
          />
        </div>

        <span className="text-lg font-normal">URL согласие</span>
        <Input
          variant="bordered"
          placeholder="lemnity.ru/policy"
          classNames={inputStyles}
          value={agreementUrl ?? ''}
          isInvalid={enabled && errors.some(
            e => e.path.endsWith('agreementUrl')
          )}
          errorMessage={
            errors
              .find(e => e.path.endsWith('agreementUrl'))
              ?.message
          }
          onValueChange={url => setAgreement(
            enabled,
            text ?? '',
            policyUrl ?? '',
            url,
            color ?? '#000000'
          )}
        />

        <span className="text-lg font-normal">
          URL политики обработки персональных данных
        </span>
        <Input
          variant="bordered"
          placeholder="lemnity.ru/policy"
          classNames={inputStyles}
          value={policyUrl ?? ''}
          isInvalid={enabled && errors.some(
            e => e.path.endsWith('policyUrl')
          )}
          errorMessage={
            errors
              .find(e => e.path.endsWith('policyUrl'))
              ?.message
          }
          onValueChange={url => setAgreement(
            enabled,
            text ?? '',
            url,
            agreementUrl ?? '',
            color ?? '#000000'
          )}
        />
      </div>
    </SwitchableField>
  )
}

export default AgreementPoliciesField
