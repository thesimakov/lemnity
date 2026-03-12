import {
  Button as HeroButton,
  type ButtonProps as HeroButtonProps,
} from '@heroui/button'
import { cn } from '@heroui/theme'

const Button = (props: HeroButtonProps) => {
  const className = cn(
    'rounded-[5px] h-12.5 bg-white',
    'border border-[#E4E4E7] px-2.5',
    'flex items-center justify-center gap-2.5',
    props.className,
  )

  return (
    <HeroButton {...props} className={className}>
      {props.children}
    </HeroButton>
  )
}

export default Button
