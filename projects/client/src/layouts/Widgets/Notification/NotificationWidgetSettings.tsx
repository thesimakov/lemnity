import FormSettings from './FormSettings'
import NotificationSettings from './NotificationSettings'

const NotificationWidgetSettings = () => {
  return (
    <div className='w-full min-w-85.5 flex flex-col gap-2.5'>
      <h1 className='text-[25px] leading-7.5 font-normal text-[#060606]'>
        Настройка виджета
      </h1>

      <FormSettings />
      <NotificationSettings />
    </div>
  )
}

export default NotificationWidgetSettings
