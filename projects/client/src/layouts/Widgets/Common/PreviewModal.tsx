import React from 'react'
import { Button } from '@heroui/button'
import SvgIcon from '@/components/SvgIcon'
import iconCross from '@/assets/icons/cross.svg'
import DesktopPreview from './DesktopPreview/DesktopPreview'
import Modal from '@/components/Modal/Modal'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  screen: 'main' | 'prize' | 'panel'
  onSubmit: () => void
  containerClassName?: string
  spinTrigger?: number
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  screen,
  onSubmit,
  containerClassName,
  spinTrigger
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      role="dialog"
      closeOnBackdrop
      closeOnEsc
      containerClassName={`max-w-[928px] max-h-[500px] ${containerClassName}`}
    >
      <div className="relative">
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="absolute z-10 p-0 m-0 border border-gray-300 rounded-[10px] right-4 top-4 min-w-8 w-8 h-8 bg-white text-gray-700 hover:bg-gray-50"
          onClick={onClose}
        >
          <SvgIcon src={iconCross} className="text-gray-700" size="18px" />
        </Button>
        <DesktopPreview
          screen={screen}
          hideCloseButton
          onSubmit={onSubmit}
          spinTrigger={spinTrigger}
        />
      </div>
    </Modal>
  )
}

export default PreviewModal
