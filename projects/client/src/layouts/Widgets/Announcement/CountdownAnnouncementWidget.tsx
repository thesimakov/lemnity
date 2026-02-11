import { cn } from '@heroui/theme'
import { Button } from '@heroui/button'

import SvgIcon from '@/components/SvgIcon'
import FreePlanBrandingLink from '@/components/FreePlanBrandingLink'
import CountdownScreen from './CountdownScreen'
import CountdownRewardScreen from './CountdownRewardScreen'
import CountdownFormScreen from './CountdownFormScreen'

import crossIcon from '@/assets/icons/cross.svg'

type CountdownWidgetVariant = 'countdown' | 'form' | 'reward'

type CountdownWidgetProps = {
  variant?: CountdownWidgetVariant
}

const CountdownAnnouncementWidget = (props: CountdownWidgetProps) => {
  return (
    <div
      className={cn(
        'w-99.5 h-129.5 px-9 rounded-2xl',
        'flex flex-col items-center relative',
        'bg-[#725DFF]',
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

      {props.variant === 'countdown' && <CountdownScreen />}
      {props.variant === 'form' && <CountdownFormScreen />}
      {props.variant === 'reward' && <CountdownRewardScreen />}

      <div className='mt-auto mb-4 flex'>
        <FreePlanBrandingLink color='#FFFFFF' />
      </div>
    </div>
  )
}

export default CountdownAnnouncementWidget