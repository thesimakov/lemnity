import { Button } from '@heroui/button'
import SvgIcon from '@/components/SvgIcon'
import iconCross from '@/assets/icons/cross.svg'

type CloseButtonProps = {
  position: 'left' | 'right'
  onClose?: () => void
  className?: string
  ariaLabel?: string
}

const CloseButton = ({ position, onClose, className, ariaLabel = 'Закрыть' }: CloseButtonProps) => {
  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      className={`z-1 absolute p-0 m-0 border border-black rounded-[10px] ${
        position === 'left' ? 'left-4' : 'right-4'
      } top-4 min-w-8 w-8 h-8 bg-white text-white hover:bg-white/50 ${className || ''}`}
      onPress={onClose}
      aria-label={ariaLabel}
    >
      <SvgIcon src={iconCross} className="text-black" size="18px" />
    </Button>
  )
}

export default CloseButton
