import {
  Input as HeroInput,
  type InputProps as HeroInputProps,
} from '@heroui/input'
import { cn } from '@heroui/theme'

const Input = (props: HeroInputProps) => {
  const inputClassnames = {
    ...props.classNames,
    base: cn(
      'min-w-76 flex-1',
      props.classNames?.base,
    ),
    inputWrapper: cn(
      'rounded-md bg-white border border-[#E8E8E8] rounded-[5px]',
      'shadow-none min-h-12.5 px-2.5',
      props.classNames?.inputWrapper,
    ),
    input: cn(
      'placeholder:text-[#AAAAAA] text-base',
      props.classNames?.input,
    ),
  }

  return <HeroInput {...props} classNames={inputClassnames}/>
}

export default Input
