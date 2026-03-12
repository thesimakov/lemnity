import {
  Popover as HeroPopover,
  type PopoverProps as HeroPopoverProps,
} from '@heroui/popover'
import { cn } from '@heroui/theme'

const Popover = (props: HeroPopoverProps) => {
  const classNames = {
    ...props.classNames,
    base: cn(
      'bg-white rounded-[10px]',
      'shadow-[0px_8px_15px_6px_rgba(0,0,0,0.15)]',
      props.classNames?.base,
    ),
    content: cn(
      'w-149.5 flex-row flex-wrap gap-2.5 p-4 justify-start',
      props.classNames?.content,
    ),
  }

  return (
    <HeroPopover {...props} classNames={classNames}>
      {props.children}
    </HeroPopover>
  )
}

export default Popover
