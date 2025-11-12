import SwitchableField from '@/components/SwitchableField'
import { Textarea } from '@heroui/input'
import NumberField from '@/components/NumberField'
import OptionsChooser from '@/components/OptionsChooser'
import ColorAccessory from '@/components/ColorAccessory'
import useWidgetSettingsStore, { useFormSettings } from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'
import type { ColorScheme } from '@/stores/widgetSettings/types'

const OnWinMessageSection = () => {
  const {
    setOnWinEnabled,
    setOnWinText,
    setOnWinTextSize,
    setOnWinDescription,
    setOnWinDescriptionSize,
    setOnWinColorSchemeEnabled,
    setOnWinColorScheme,
    setOnWinDiscountColors,
    setOnWinPromoColors
  } = useFormSettings()

  const { onWin } = useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'messages', STATIC_DEFAULTS.form.messages)
  )

  const { enabled, text, textSize, description, colorScheme, descriptionSize } = onWin

  // Safe color scheme snapshot (fallback to defaults if undefined/trimmed)
  const safeColorScheme = colorScheme ?? STATIC_DEFAULTS.form.messages.onWin.colorScheme
  const { enabled: schemeEnabled, scheme, discount, promo } = safeColorScheme

  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const errs = showValidation ? getErrors('form.messages.onWin') : []
  const err = (suffix: string) => errs.find(e => e.path.endsWith(`onWin.${suffix}`))?.message

  const isCustomSchemeActive = schemeEnabled && scheme === 'custom'

  // Fallbacks when primary scheme trimmed discount/promo in trimInactiveBranches
  const defaultDiscount = STATIC_DEFAULTS.form.messages.onWin.colorScheme.discount
  const defaultPromo = STATIC_DEFAULTS.form.messages.onWin.colorScheme.promo
  const safeDiscount = discount ?? defaultDiscount
  const safePromo = promo ?? defaultPromo

  const colorPickers = (
    <div
      className={`flex flex-col gap-3 pt-3 ${
        isCustomSchemeActive ? '' : 'opacity-60 pointer-events-none'
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-sm font-medium text-gray-700">Скидка</span>
          <div className="flex flex-row flex-nowrap items-center gap-2">
            <ColorAccessory
              classNames={{ label: 'w-full' }}
              label="Цвет шрифта"
              color={safeDiscount.color}
              onChange={c => setOnWinDiscountColors(c, safeDiscount.bgColor)}
            />
            <ColorAccessory
              classNames={{ label: 'w-full' }}
              label="Цвет фона"
              color={safeDiscount.bgColor}
              onChange={bg => setOnWinDiscountColors(safeDiscount.color, bg)}
            />
          </div>
          {isCustomSchemeActive &&
          (err('colorScheme.discount.color') || err('colorScheme.discount.bgColor')) ? (
            <span className="text-xs text-red-500">
              {err('colorScheme.discount.color') ?? err('colorScheme.discount.bgColor')}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-sm font-medium text-gray-700">Промокод</span>
          <div className="flex flex-row flex-nowrap items-center gap-2">
            <ColorAccessory
              classNames={{ label: 'w-full' }}
              label="Цвет шрифта"
              color={safePromo.color}
              onChange={c => setOnWinPromoColors(c, safePromo.bgColor)}
            />
            <ColorAccessory
              classNames={{ label: 'w-full' }}
              label="Цвет фона"
              color={safePromo.bgColor}
              onChange={bg => setOnWinPromoColors(safePromo.color, bg)}
            />
          </div>
          {isCustomSchemeActive &&
          (err('colorScheme.promo.color') || err('colorScheme.promo.bgColor')) ? (
            <span className="text-xs text-red-500">
              {err('colorScheme.promo.color') ?? err('colorScheme.promo.bgColor')}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )

  return (
    <SwitchableField
      classNames={{ content: 'flex flex-col gap-6', title: 'font-normal' }}
      enabled={enabled}
      onToggle={setOnWinEnabled}
      title="Текст при выигрыше"
    >
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">Заголовок</span>
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-3">
          <div className="flex-1">
            <Textarea
              radius="sm"
              minRows={2}
              placeholder="Поздравляем! Вы выиграли, заберите ваш приз!"
              classNames={{ input: 'placeholder:text-[#AFAFAF]' }}
              value={text}
              isInvalid={enabled && Boolean(err('text'))}
              errorMessage={err('text')}
              onValueChange={setOnWinText}
            />
          </div>
          <div className="flex flex-col gap-1 md:w-auto">
            <NumberField
              label="Размер текста"
              max={100}
              min={0}
              value={textSize}
              onChange={setOnWinTextSize}
              classNames={{ container: '!h-14 !px-3 !py-0' }}
            />
            {enabled && err('textSize') ? (
              <span className="text-xs text-red-500">{err('textSize')}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">Описание</span>
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-3">
          <div className="flex-1">
            <Textarea
              radius="sm"
              minRows={2}
              placeholder="Добавьте описание приза или инструкции для пользователя"
              classNames={{ input: 'placeholder:text-[#AFAFAF]' }}
              value={description}
              isInvalid={enabled && Boolean(err('description'))}
              errorMessage={err('description')}
              onValueChange={setOnWinDescription}
            />
          </div>
          <div className="flex flex-col gap-1 md:w-auto">
            <NumberField
              label="Размер текста"
              max={100}
              min={0}
              value={descriptionSize}
              onChange={setOnWinDescriptionSize}
              classNames={{ container: '!h-14 !px-3 !py-0' }}
            />
            {enabled && err('descriptionSize') ? (
              <span className="text-xs text-red-500">{err('descriptionSize')}</span>
            ) : null}
          </div>
        </div>
      </div>

      <SwitchableField
        classNames={{ title: 'font-normal' }}
        enabled={schemeEnabled}
        onToggle={setOnWinColorSchemeEnabled}
        title="Цветовая гамма"
      >
        <OptionsChooser
          noBorder
          noPadding
          value={scheme}
          onChange={key => setOnWinColorScheme(key as ColorScheme)}
          options={[
            { key: 'primary', label: 'Основная' },
            { key: 'custom', label: 'Пользовательская', below: colorPickers }
          ]}
        />
      </SwitchableField>
    </SwitchableField>
  )
}

export default OnWinMessageSection
