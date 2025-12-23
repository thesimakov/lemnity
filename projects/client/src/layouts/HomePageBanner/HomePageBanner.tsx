import { Button } from '@heroui/button'
import homePageBanner from '@/assets/banners/new-year-banner.png'

const HomePageBanner = () => {
  return (
    <div className="border-1 rounded-[10px] border-[#E5E5E5] p-4 h-full w-full flex flex-row gap-4">
      <div className='min-w-[212px] max-w-[212px] flex flex-col gap-[13px]'>
        <div className='rounded-full bg-[#725DFF]/15 w-[125px] h-[25px] flex items-center justify-center text-[13px] text-[#4400FF] font-roboto'>
          Новый виджет
        </div>

        <div className='grow font-roboto font-bold text-[20px] leading-[23px]'>
          Новогодний шаблон! Укрась свой сайт к НГ-2026
        </div>

        <Button
          className='w-[150px] h-[30px] rounded-[5px] border-1 border-[#E8E8E8] bg-[#FF6B00]/15 text-[#FF5A2A] text-[16px]'
        >
          Забронировать
        </Button>
      </div>
      <div className='rounded-[10px] grow min-w-[207px] bg-pink-500'>
        <img src={homePageBanner} alt="New Year Template" className="w-full h-full rounded-[10px] object-cover" />
      </div>
    </div>
  )
}

export default HomePageBanner