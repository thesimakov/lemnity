import FreePlanBrandingLink from '@/components/FreePlanBrandingLink'
import { Button } from '@heroui/button'
import { cn } from '@heroui/theme'
import CountdownRewardScreen from './CountdownRewardScreen'

const AnnouncementWidgetContent = () => {
  return (
    <>
      <img
        src="https://app.lemnity.ru/uploads/images/2026/01/2f539d8a-e1a6-4ced-a863-8e4aa37242d9-lemnity-pic.webp"
        alt="Announcement Widget Image"
        className="w-full h-67 object-cover rounded-[10px]"
      />

      <span className='text-3xl'>Премьера «Я буду ЖИТЬ»</span>
      <span className='text-[16px]'>по пьесе Н. Пинчука «На выписку», драматичекий ритуал в 1 дейстии, 16+</span>

      <div className='w-full mt-auto mb-0'>
        <a
          href="https://lemnity.ru"
          target="_blank"
        >
          <Button
            className={cn(
              'w-full h-13.5 rounded-[13px] bg-[#FFB400] text-black text-[20px]'
            )}
          >
            Билеты
          </Button>
        </a>
      </div>
    </>
  )
}

const AnnouncementWidget = () => {
  return (
    <div
      className={cn(
        'w-99.5 h-129.5 p-3.75 pb-0 rounded-2xl bg-white border border-black',
        'flex flex-col items-center text-center'
      )}
    >
      {/* <AnnouncementWidgetContent /> */}
      <CountdownRewardScreen isAnnouncement />
      
      <div className="flex justify-center py-2 mt-auto mb-0">
        <FreePlanBrandingLink />
      </div>
    </div>
  )
}

export default AnnouncementWidget
