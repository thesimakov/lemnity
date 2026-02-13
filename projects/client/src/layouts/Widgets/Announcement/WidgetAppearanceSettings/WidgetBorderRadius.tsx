import { useState } from "react"
import { Slider } from "@heroui/slider"

import BorderedContainer from "@/layouts/BorderedContainer/BorderedContainer"

const WidgetBorderRadius = () => {
  const [widgetBorderRadius, setWidgetBorderRadius] = useState<number>(15)

  return (
    <BorderedContainer>
      <div className="w-full flex flex-col gap-3.5">
        <div className="flex flex-row justify-between">
          <h2 className="text-[16px] leading-4.75">Скругление окна</h2>
          <span className="text-[16px] leading-4.75 font-medium">
            {widgetBorderRadius}px
          </span>
        </div>

        <Slider
          value={widgetBorderRadius}
          // i don't like that the slider's value is of the type
          // number | number[] | undefined
          // for some unholy reason, but i don't want to create a wrapper for it
          // just to make the type correct, so here we are
          onChange={value => setWidgetBorderRadius(Number(value))}
          className=""
          size="sm"
          defaultValue={12}
          maxValue={20}
          minValue={0}
          step={1}
          aria-label="Скругление окна"
        />
      </div>
    </BorderedContainer>
  )
}

export default WidgetBorderRadius
