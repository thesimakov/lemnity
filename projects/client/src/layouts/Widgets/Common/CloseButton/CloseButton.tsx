import { useState, type CSSProperties } from 'react'
import SvgIcon from '@/components/SvgIcon'
import iconCross from '@/assets/icons/cross.svg'

type CloseButtonProps = {
  position: 'left' | 'right'
  onClose?: () => void
  className?: string
  ariaLabel?: string
}

const baseStyle: CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  padding: 0,
  margin: 0,
  border: '1px solid #000',
  borderRadius: '10px',
  top: '16px',
  minWidth: '32px',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  color: '#000',
  transition: 'background-color 0.2s ease-in-out',
  cursor: 'pointer'
}

const positionStyles: Record<'left' | 'right', CSSProperties> = {
  left: { left: '16px' },
  right: { right: '16px' }
}

const CloseButton = ({ position, onClose, className, ariaLabel = 'Закрыть' }: CloseButtonProps) => {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      style={{
        ...baseStyle,
        ...positionStyles[position],
        opacity: hovered ? 0.5 : 1
      }}
      className={className}
      onClick={onClose}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <SvgIcon src={iconCross} className="text-black" size="18px" />
    </button>
  )
}

export default CloseButton
