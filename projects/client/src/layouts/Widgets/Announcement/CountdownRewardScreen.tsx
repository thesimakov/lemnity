import { cn } from "@heroui/theme"
import CompanyLogo from "./CompanyLogo"

type CountdownRewardScreenProps = {
  isAnnouncement?: boolean
}

const CountdownRewardScreen = (props: CountdownRewardScreenProps) => {
  return (
    <>
      <div className='mt-20.75'>
        <CompanyLogo black={props.isAnnouncement} />
      </div>

      <div
        className={cn(
          'w-full flex flex-col items-center justify-center mt-3.75 gap-3.75',
        )}
      >
        <span
          className={cn(
            'font-semibold text-[40px] leading-11.75',
            props.isAnnouncement ? 'text-black' : 'text-white'
          )}
        >
          Ваша скидка:
        </span>

        <div
          className={cn(
            'h-11 bg-[#FFF57F] rounded-full py-0.75 min-w-62.25 max-w-full',
            'flex items-center justify-center'
          )}
        >
          <span
            className={cn(
              'text-[20px] leading-6 text-black',
            )}
          >
            Скидка 10%
          </span>
        </div>

        <span
          className={cn(
            'text-[16px] leading-4.75 text-center',
            props.isAnnouncement ? 'text-black' : 'text-white'
          )}
        >
          Не забудьте использовать промокод во время оформления заказа!
        </span>

        <div
          className={cn(
            'w-full p-4 flex flex-col items-center justify-center gap-1',
            'rounded-[3px] border border-dashed bg-[#0069FF]/59',
            props.isAnnouncement ? 'border-black' : 'border-white'
          )}
        >
          <span
            className={cn(
              'text-[12px] leading-3.5',
              props.isAnnouncement ? 'text-black' : 'text-white'
            )}
          >
            Промокод
          </span>
          <span
            className={cn(
              'font-semibold text-[25px] leading-7.5',
              props.isAnnouncement ? 'text-black' : 'text-white'
            )}
          >
            PROMO-10P
          </span>
        </div>
      </div>
    </>
  )
}

export default CountdownRewardScreen
