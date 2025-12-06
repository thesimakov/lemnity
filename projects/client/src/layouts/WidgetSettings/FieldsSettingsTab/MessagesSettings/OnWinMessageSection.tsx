import SwitchableField from '@/components/SwitchableField'
import { Textarea } from '@heroui/input'
import NumberField from '@/components/NumberField'
import OptionsChooser from '@/components/OptionsChooser'
import ColorAccessory from '@/components/ColorAccessory'
import { useFieldsSettings } from '@/stores/widgetSettings/fieldsHooks'
import useWidgetSettingsStore, { useWidgetStaticDefaults } from '@/stores/widgetSettingsStore'
import type { ColorScheme } from '@/stores/widgetSettings/types'

const OnWinMessageSection = () => {
  const {
    settings,
    setOnWinEnabled,
    setOnWinTextWithColor,
    setOnWinTextSize,
    setOnWinDescriptionWithColor,
    setOnWinDescriptionSize,
    setOnWinColorSchemeEnabled,
    setOnWinColorScheme,
    setOnWinDiscountColors,
    setOnWinPromoColors
  } = useFieldsSettings()
  const defaults = useWidgetStaticDefaults()

  const onWin = settings?.messages?.onWin ?? defaults?.fields.messages.onWin

  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const errs = showValidation ? getErrors('fields.messages.onWin') : []
  const err = (suffix: string) => errs.find(e => e.path.endsWith(`onWin.${suffix}`))?.message

  if (!onWin) return null

  const { enabled, text, textColor, textSize, description, descriptionColor, colorScheme, descriptionSize } = onWin
  const defaultScheme = defaults?.fields.messages.onWin.colorScheme
  const safeColorScheme = colorScheme ?? defaultScheme
  const { enabled: schemeEnabled, scheme, discount, promo } = safeColorScheme
  const isCustomSchemeActive = schemeEnabled && scheme === 'custom'
  const defaultDiscount = defaults?.fields.messages.onWin.colorScheme.discount ?? {
    color: '#000000',
    bgColor: '#FFF57F'
  }
  const defaultPromo = defaults?.fields.messages.onWin.colorScheme.promo ?? {
    color: '#FFFFFF',
    bgColor: '#0069FF'
  }
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
              onValueChange={value => setOnWinTextWithColor(value, textColor ?? '#000000')}
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
        <ColorAccessory color={textColor ?? '#000000'} onChange={color => setOnWinTextWithColor(text, color)} />
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
              onValueChange={value => setOnWinDescriptionWithColor(value, descriptionColor ?? '#000000')}
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
          <ColorAccessory color={descriptionColor ?? '#000000'} onChange={color => setOnWinDescriptionWithColor(description, color)} />
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
