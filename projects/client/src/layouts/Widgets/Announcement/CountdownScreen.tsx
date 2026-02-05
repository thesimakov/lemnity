/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import CountdownTimer from '@/components/CountdownTimer'
import { cn } from '@heroui/theme'
import { Button } from '@heroui/button'

import CompanyLogo from './CompanyLogo'

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

export default CountdownScreen
