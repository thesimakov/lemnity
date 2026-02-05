/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { cn } from '@heroui/theme'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Checkbox } from '@heroui/checkbox'

import SvgIcon from '@/components/SvgIcon'
import CountdownTimer from '@/components/CountdownTimer'
import FreePlanBrandingLink from '@/components/FreePlanBrandingLink'

import lemnityBlackLogo from '@/assets/logos/lemnity-black-logo.svg'
import crossIcon from '@/assets/icons/cross.svg'
import reloadIcon from '@/assets/icons/reload.svg'


const CompanyLogo = () => (
  <div className="w-42 h-9.5 fill-white text-white">
    <SvgIcon src={lemnityBlackLogo} alt="Company Logo" />
  </div>
)

// @ts-expect-error aboba
const CountdownScreen = () => {
  // @ts-expect-error aboba
  const [initialTime, setInitialTime] = useState<number>(259200)

  return (
    <>
      <div className='mt-14'>
        <CompanyLogo />
      </div>
    
      <div
        className={cn(
          'w-full flex flex-col items-center justify-center mt-3.75 gap-3.75',
        )}
      >
        <span className="text-white font-bold text-[40px] leading-12 text-center">
          До Нового года осталось
        </span>
        <span className="text-white text-[16px] leading-4.75 text-center">
          Вы можете разместить здесь описание
        </span>

        <CountdownTimer initialTime={initialTime} />

        <Button className="w-full h-10.75 bg-[#FFB400] rounded-md text-[20px]">
          Хочу скидку!
        </Button>
      </div>
    </>
  )
}


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

const CountdownRewardScreen = () => {
  return (
    <>
      <div className='mt-20.75'>
        <CompanyLogo />
      </div>

      <div
        className={cn(
          'w-full flex flex-col items-center justify-center mt-3.75 gap-3.75',
        )}
      >
        <span className="font-semibold text-white text-[40px] leading-11.75">
          Ваша скидка:
        </span>

        <div
          className={cn(
            'h-11 bg-[#FFF57F] rounded-full py-0.75 min-w-62.25 max-w-full',
            'flex items-center justify-center'
          )}
        >
          <span className="text-[20px] leading-6">
            Скидка 10%
          </span>
        </div>

        <span className="text-[16px] leading-4.75 text-white text-center">
          Не забудьте использовать промокод во время оформления заказа!
        </span>

        <div
          className={cn(
            'w-full p-4 flex flex-col items-center justify-center gap-1',
            'rounded-[3px] border border-dashed border-white',
            'bg-[#0069FF]/59'
          )}
        >
          <span className="text-[12px] leading-3.5 text-white">
            Промокод
          </span>
          <span className="font-semibold text-[25px] leading-7.5 text-white">
            PROMO-10P
          </span>
        </div>
      </div>
    </>
  )
}


const CountdownAnnouncementWidget = () => {
  return (
    <div
      className={cn(
        'w-99.5 h-129.5 px-9 rounded-2xl bg-[#725DFF]',
        'flex flex-col items-center relative',
      )}
    >
      <Button
        className={cn(
          'min-w-11.25 w-11.25 h-7.5 top-4.5 right-4.5 rounded-[5px] bg-white',
          'px-0 absolute flex justify-center items-center'
        )}>
        <div className="w-4 h-4 fill-black">
          <SvgIcon src={crossIcon} alt="Close" />
        </div>
      </Button>

      {/* <CountdownScreen /> */}
      {/* <CountdownFormScreen /> */}
      <CountdownRewardScreen />

      <div className='mt-auto mb-4 flex'>
        <FreePlanBrandingLink color='#FFFFFF' />
      </div>
    </div>
  )
}

export default CountdownAnnouncementWidget