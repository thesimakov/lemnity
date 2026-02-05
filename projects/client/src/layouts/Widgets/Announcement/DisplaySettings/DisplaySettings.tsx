import WidgetBackgroundColor from "./WidgetBackgroundColor"
import WidgetType from "./WidgetType"

const DisplaySettings = () => {
  return (
    <div className="w-full flex flex-col gap-2.5">
      <h1 className="text-[25px] leading-7.5 font-normal text-[#060606]">Оформление</h1>
      <WidgetType />
      <WidgetBackgroundColor />
    </div>
  )
}

export default DisplaySettings
