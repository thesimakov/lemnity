import { Button } from "@heroui/button"
import { Checkbox } from "@heroui/checkbox"
import { Input } from "@heroui/input"
import { cn } from "@heroui/theme"

import CompanyLogo from "./CompanyLogo"
import SvgIcon from "@/components/SvgIcon"

import reloadIcon from '@/assets/icons/reload.svg'

const CountdownFormScreen = () => {
  const inputStyles = {
    inputWrapper: 'rounded-[5px] px-2.25 border border-[#9A9A9A] bg-white',
    input: 'placeholder:text-black text-[16px] leading-4.75'
  }

  const checkboxStyles = {
    wrapper: cn(
      'w-4 h-4 before:border-1 before:border-white rounded-[4px]',
      'before:rounded-[4px] after:rounded-[4px] after:bg-transparent',
    ),
    icon: 'w-3 h-3 group-hover:text-black',
    base: 'self-start'
  }

  return (
    <>
      <div className='mt-12.5'>
        <CompanyLogo />
      </div>

      <div
        className={cn(
          'w-full flex flex-col items-center justify-center mt-3.75 gap-3.75',
        )}
      >
        <span
          className={cn(
            'font-medium text-[35px] leading-10.25 text-white text-center'
          )}
        >
          Получите скидку
        </span>
        <span
          className={cn(
            'text-[16px] leading-4.75 text-white text-center'
          )}
        >
          Укажите свой email и получите купон, который можно использовать при покупки
        </span>

        <Input
          placeholder="Имя и Фамилия"
          classNames={inputStyles}
        />
        <Input
          placeholder="Ваш email"
          classNames={inputStyles}
        />

        <Button
          className={cn(
            'w-full h-10 rounded-[5px] bg-[#FFB400] text-[16px] leading-4.75',
            'gap-2.25'
          )}
        >
          <div className='w-3.75 h-3.75'>
            <SvgIcon src={reloadIcon} />
          </div>
          Получить скидку
        </Button>


        <div className='w-full flex flex-row'>
          <Checkbox
            classNames={checkboxStyles}
          >
          </Checkbox>
          <span className='text-[9px] leading-2.75 text-white ml-1'>
            Я даю&nbsp;
            <a
              href='https://lemnity.ru/agreement'
              target="_blank"
              className='underline'
            >
              Согласие
            </a>
            &nbsp;на обработку персональных данных в соответствии с&nbsp;
            <a
              href='https://lemnity.ru/political'
              target="_blank"
              className='underline'
            >
              Политикой конфиденциальности.
            </a>
          </span>
        </div>

        <div className='w-full flex flex-row'>
          <Checkbox
            classNames={checkboxStyles}
          >
          </Checkbox>
          <span className='text-[9px] leading-2.75 text-white ml-1'>
            Нажимая на кнопку, вы даёте своё согласие на получение рекламно-информационной рассылки.
          </span>
        </div>
      </div>
    </>
  )
}

export default CountdownFormScreen
