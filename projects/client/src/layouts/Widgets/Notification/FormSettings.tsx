import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import ButtonAppearenceSettings from '@/layouts/WidgetSettings/DisplaySettingsTab/ButtonAppearenceSettings/ButtonAppearenceSettings'
import ButtonPositionChooser from '@/layouts/WidgetSettings/DisplaySettingsTab/ButtonPositionChooser/ButtonPositionChooser'
import type { ButtonPosition } from '@/stores/widgetSettingsStore'

const ALLOWED_POSITIONS: ButtonPosition[] = ['bottom-left', 'bottom-right']

const FormSettings = () => {
  return (
    <BorderedContainer>
      <div className='w-full flex flex-col gap-6'>
        <h2 className='text-[16px] leading-4.75 font-medium'>Форма</h2>

        <div className='w-full flex flex-col gap-2.5'>
          <span className='leading-4.75'>Кнопка</span>

          <ButtonAppearenceSettings
            buttonIcon='Sparkles'
            buttonText=''
            buttonBackgroundColor='#5951E5'
            buttonTextColor='#FFFFFF'
            onBackgroundColorChange={() => {}}
            onFontColorChange={() => {}}
            onTriggerTextChange={() => {}}
          />
          <ButtonPositionChooser
            noBorder
            noPadding
            value={'bottom-left'}
            options={ALLOWED_POSITIONS}
            onChange={() => {}}
          />
        </div>
      </div>
    </BorderedContainer>
  )
}

export default FormSettings
