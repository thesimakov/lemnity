import React from 'react'
import { useSwitch } from '@heroui/switch'
import type { SwitchProps } from '@heroui/switch'
import { cn } from '@heroui/theme'

interface CustomSwitchProps extends Omit<SwitchProps, 'color'> {
  className?: string
  selectedColor?: string
}

const CustomSwitch: React.FC<CustomSwitchProps> = props => {
  const { size = 'lg', selectedColor, ...rest } = props

  const widthClasses = {
    sm: 'w-15',
    md: 'w-16',
    lg: 'w-17'
  }

  const {
    slots,
    Component,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
    getThumbProps
  } = useSwitch({
    size,
    ...rest
  })

  const { thumb } = slots
  const wrapperBgColor = isSelected ? selectedColor || '!bg-green-500' : '!bg-red-500'

  return (
    <Component {...getBaseProps()}>
      <input {...getInputProps()} />
      <div
        {...getWrapperProps({
          className: cn(
            widthClasses[size] || widthClasses.md,
            '!bg-transparent', // обнуляем фон от HeroUI
            wrapperBgColor // динамические цвета
          )
        })}
      >
        <span
          className={`
            ${isSelected ? 'left-2' : 'right-2'}
            absolute text-xs font-normal text-white z-10
            transition-opacity duration-200
            `}
        >
          {isSelected ? 'Вкл' : 'Выкл'}
        </span>
        <span
          {...getThumbProps()}
          className={`${thumb({ size })} group-data-[selected=true]:ms-9`}
        />
      </div>
    </Component>
  )
}

export default CustomSwitch
