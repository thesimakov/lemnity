import { cn } from '@heroui/theme'
import SvgIcon from '@/components/SvgIcon'
import { Button } from '@heroui/button'

import lemnityBlackLogo from '@/assets/logos/lemnity-black-logo.svg'
import crossIcon from '@/assets/icons/cross.svg'
import CountdownTimer from '@/components/CountdownTimer'
import { useState } from 'react'
import FreePlanBrandingLink from '@/components/FreePlanBrandingLink'

const CountdownScreen = () => {
  // @ts-expect-error aboba
  const [initialTime, setInitialTime] = useState<number>(259200)

  return (
    <>
      <div className="w-42 h-9.5 fill-white text-white">
        <SvgIcon src={lemnityBlackLogo} alt="Company Logo" />
      </div>
    
      <div
      className={cn(
        'w-full flex flex-col items-center justify-center gap-3.75',
        'mt-3.75 px-8.5',
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

const CountdownAnnouncementWidget = () => {
  return (
    <div
      className={cn(
        'w-99.5 h-129.5 pt-14 rounded-2xl bg-[#725DFF]',
        'flex flex-col items-center relative'
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

      <CountdownScreen />

      <div className='mt-auto mb-4'>
        <FreePlanBrandingLink color='#FFFFFF' />
      </div>
    </div>
  )
}

export default CountdownAnnouncementWidget