import WidgetType from './WidgetType'
import WidgetBackgroundColor from './WidgetBackgroundColor'
import WidgetBorderRadius from './WidgetBorderRadius'
import ContentSettings from './ContentSettings'

const DisplaySettings = () => {
  return (
    <div className="w-full min-w-85.5 flex flex-col gap-2.5">
      <h1 className="text-[25px] leading-7.5 font-normal text-[#060606]">
        Оформление
      </h1>

      <WidgetType />
      <WidgetBackgroundColor />
      <WidgetBorderRadius />
      <ContentSettings />
    </div>
  )
}

export default DisplaySettings
