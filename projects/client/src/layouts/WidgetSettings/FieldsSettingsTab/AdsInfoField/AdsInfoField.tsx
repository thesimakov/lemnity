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

const AdsInfoField = () => {
  const staticDefaults = useWidgetStaticDefaults()

  const adsInfo = useWidgetSettingsStore(s =>
    withDefaultsPath(
      s.settings?.fields,
      'adsInfo',
      // let's shoot in the foot and assume that staticDefaults is always
      // defined, because why the hell not, ALBERT
      // TO FIX THIS PROPERLY WE NEED TO REWORK THE WHOLE SETTINGS STRUCTURE
      staticDefaults!.fields.adsInfo
    )
  )
  const { enabled, text, policyUrl, color } = adsInfo
  const { setAdsInfo } = useFieldsSettings()

  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const errors = showValidation ? getErrors('fields.adsInfo') : []

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

  const handleToggle = (nextEnabled: boolean) => setAdsInfo(
    nextEnabled,
    text ?? '',
    policyUrl ?? '',
    color ?? '#000000'
  )

  return (
    <SwitchableField
      title="Рекламная информация"
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
            Нажимая на кнопку, вы даёте своё согласие на получение
            рекламно-информационной рассылки.
          </span>
          
          <ColorPicker
            triggerText={
              containerWidth < 467
                ? 'Цвет текста'
                : undefined
            }
            initialColor={color ?? '#000000'}
            onColorChange={color => setAdsInfo(
              enabled,
              text ?? '',
              policyUrl ?? '',
              color
            )}
          />
        </div>

        <span className="text-lg font-normal">
          URL на политику получения рекламной информации
        </span>
        <Input
          variant="bordered"
          placeholder="lemnity.ru/ads"
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
          onValueChange={url => setAdsInfo(
            enabled,
            text ?? '',
            url,
            color ?? '#000000'
          )}
        />
      </div>

    </SwitchableField>
  )
}

export default AdsInfoField
