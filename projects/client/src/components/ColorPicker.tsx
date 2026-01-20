// import { cn } from '@heroui/theme'
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover'

type ColorCircleProps = {
  color: string
  stroke?: string
  selected?: boolean
}

const ColorCircle = (props: ColorCircleProps) => {
  return (
    <div
      className={"rounded-full w-9.5 h-9.5"}
      style={{ backgroundColor: props.color }}
    />
  )
}

type ColorPickerItem = {
  color: string
  stroke?: string
}

type ColorPickerProps = {
  children: React.ReactNode
}

const defaultColors: ColorPickerItem[] = [
  { color: '#D9D9D9' },
  { color: '#757575' },
  { color: '#F14821' },
  { color: '#FF9E43' },
  { color: '#FFC943' },
  { color: '#66D576' },
  { color: '#5AD8CC' },
  { color: '#3DADFF' },
  { color: '#884EFF' },
  { color: '#FB4ABF' },
  { color: '#FFC0EB' },
  { color: '#FFFFFF', stroke: '#6E4949' },
  { color: '#B3B3B3' },
  { color: '#D9D9D9' },
  { color: '#FEC7C2' },
  { color: '#FFE1BF' },
  { color: '#FFEBBC' },
  { color: '#CCF4D2' },
  { color: '#C6FAF8' },
  { color: '#C1E5FF' },
  { color: '#DDD3F4' },
]

const ColorPicker = ({ children }: ColorPickerProps) => {
  return (
    <Popover placement='bottom-start'>
      <PopoverTrigger>
        {children}
      </PopoverTrigger>
      <PopoverContent>
        {/* <div
          className={cn(
            "w-149.5 h-30.5 bg-white rounded-[10px]",
            "shadow-[0px_8px_15px_6px_rgba(0,0,0,0.15)]"
          )}
        > */}
          {defaultColors.map((item) => (
            <ColorCircle
              key={item.color}
              color={item.color}
              stroke={item.stroke}
            />
          ))}
        {/* </div> */}
      </PopoverContent>
    </Popover>
  )
}

export default ColorPicker