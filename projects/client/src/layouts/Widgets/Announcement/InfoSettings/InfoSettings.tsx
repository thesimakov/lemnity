import TextSettings from '@/components/TextSettings'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import CountdownSettings from './CountdownSettings'
import ButtonAppearenceSettings from '@/layouts/WidgetSettings/DisplaySettingsTab/ButtonAppearenceSettings/ButtonAppearenceSettings'
import { Input } from '@heroui/input'
import { cn } from '@heroui/theme'

const InfoSettings = () => {
  return (
    <div className="w-full min-w-85.5 flex flex-col gap-2.5">
      <h1 className="text-[25px] leading-7.5 font-normal text-[#060606]">
        Окно информации
      </h1>


      <BorderedContainer>
        <div className="w-full flex flex-col">
          <TextSettings
            title="Заголовок"
            placeholder="Укажите заголовок"
            noFontSize
          />
        </div>
      </BorderedContainer>

      <BorderedContainer>
        <div className="w-full flex flex-col">
          <TextSettings
            title="Описание"
            placeholder="Получите супер скидку до 30 % на покупку билета в АРТ КАФЕ."
            noFontSize
          />
        </div>
      </BorderedContainer>

      <CountdownSettings />

      <BorderedContainer>
        <div className="w-full flex flex-col gap-2.5">
          <h2 className="text-[16px] leading-4.75">Кнопка</h2>
          <ButtonAppearenceSettings
            onTriggerTextChange={() => {}}
            onTriggerIconChange={() => {}}
            onFontColorChange={() => {}}
            onBackgroundColorChange={() => {}}
            buttonText={'Получить скидку'}
            buttonTextColor={'#FFB34F'}
            buttonBackgroundColor={'#0F3095'}
            buttonIcon={'Sparkles'}
          />

          <h2 className="text-[16px] leading-4.75">Ссылка</h2>
            <Input
            placeholder={"lemnity.ru/ads"}
            classNames={{
              base: 'min-w-76 flex-1',
              inputWrapper: cn(
                'rounded-md border bg-white border-[#E8E8E8] rounded-[5px]',
                'shadow-none h-12.5 px-2.5',
              ),
              input: 'placeholder:text-[#AAAAAA] text-base'
            }}
          />
        </div>
      </BorderedContainer>
    </div>
  )
}

export default InfoSettings
