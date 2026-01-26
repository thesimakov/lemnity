import { AnimatePresence, motion } from 'framer-motion'
import CustomSwitch from './CustomSwitch'

export type SwitchableFieldProps = {
  title: string
  switchLabel?: string
  enabled: boolean
  onToggle: (nextEnabled: boolean) => void
  disabled?: boolean
  children?: React.ReactNode
  animationDuration?: number
  classNames?: {
    container?: string
    title?: string
    switchLabel?: string
    switch?: string
    content?: string
  }
}

const SwitchableField = ({
  title,
  switchLabel,
  enabled,
  onToggle,
  disabled = false,
  children,
  animationDuration = 0.3,
  classNames = {
    container: '',
    title: '',
    switchLabel: '',
    switch: '',
    content: ''
  }
}: SwitchableFieldProps) => {
  return (
    <div className={`flex flex-col p-3 rounded-lg border border-gray-200 ${classNames.container}`}>
      <div className="flex flex-row items-center gap-2.5">
        <div className='flex items-center justify-between grow gap-2.5'>
          <span className={`text-black text-base font-medium ${classNames.title}`}>{title}</span>
          {switchLabel && (
            <span className={`text-[10px] text-black ${classNames.switchLabel}`}>{switchLabel}</span>
          )}
        </div>
        <CustomSwitch
          isSelected={enabled}
          onValueChange={onToggle}
          isDisabled={disabled}
          selectedColor="group-data-[selected=true]:!bg-[#5951E5]"
          className={`ml-auto ${classNames.switch}`}
          size="sm"
        />
      </div>
      <AnimatePresence>
        {children && enabled ? (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: animationDuration, ease: 'easeInOut' }}
            className={`overflow-hidden`}
          >
            <div className={`pt-4 ${classNames.content}`}>{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default SwitchableField
