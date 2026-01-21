import { Button } from '@heroui/button'
import { type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SvgIcon from './SvgIcon'
import iconBin from '@/assets/icons/bin.svg'
import iconAdd from '@/assets/icons/add.svg'
import iconArrowDown from '@/assets/icons/arrow-down.svg'
import iconArrowUp from '@/assets/icons/arrow-up.svg'

export type EditableListItem<T> = T & {
  id: string
}

export type EditableListProps<T> = {
  items: EditableListItem<T>[]
  onItemsChange: (items: EditableListItem<T>[]) => void
  renderItem: (item: EditableListItem<T>, index: number) => ReactNode
  renderBelow?: (item: EditableListItem<T>, index: number) => ReactNode
  onAdd?: () => void
  onDelete?: (item: EditableListItem<T>, index: number) => void
  addButtonLabel?: string
  maxItems?: number
  minItems?: number
  showIndex?: boolean
  canDelete?: boolean
  canReorder?: boolean
  classNames?: {
    item?: string
    index?: string
    delete?: string
    reorder?: string
    add?: string
  }
  disabledReorderIds?: string[]
}

const EditableList = <T,>({
  items,
  onItemsChange,
  renderItem,
  renderBelow,
  onDelete,
  onAdd,
  addButtonLabel = 'Добавить',
  maxItems,
  minItems,
  showIndex = true,
  canDelete = true,
  canReorder = false,
  classNames = {
    item: '',
    index: '',
    delete: '',
    reorder: '',
    add: ''
  },
  disabledReorderIds = []
}: EditableListProps<T>) => {
  const handleDelete = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id))
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    if (disabledReorderIds?.includes(items[index].id)) return
    const newItems = [...items]
    ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
    onItemsChange(newItems)
  }

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return
    if (disabledReorderIds?.includes(items[index].id)) return
    const newItems = [...items]
    ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
    onItemsChange(newItems)
  }

  const canAddMore = !maxItems || items.length < maxItems

  return (
    <div className="flex flex-col gap-2.5 h-full w-full">
      {items.map((item, index) => {
        const below = renderBelow?.(item, index)
        return (
          <motion.div
            key={item.id}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col gap-2"
          >
            <div className={`flex items-center gap-2`}>
              {showIndex && (
                <div className={`min-w-10 ${classNames?.index}`}>
                  <span className={'text-sm font-normal text-gray-900'}>
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              )}
              {canReorder && (
                <div className={`flex flex-col ${classNames?.reorder || ''}`}>
                  <motion.button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0 || disabledReorderIds?.includes(item.id)}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    aria-label="Переместить вверх"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    {/* <div className='w-2 h-1.5'> */}
                    <SvgIcon src={iconArrowUp} size={9} className="text-current" />
                    {/* </div> */}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === items.length - 1 || disabledReorderIds?.includes(item.id)}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    aria-label="Переместить вниз"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    {/* <div className='w-2 h-1.5'> */}
                    <SvgIcon src={iconArrowDown} size={9} className="text-current" />
                    {/* </div> */}
                  </motion.button>
                </div>
              )}
              <div className="flex-1 h-full">{renderItem(item, index)}</div>
              {canDelete && (
                <Button
                  type="button"
                  onPress={onDelete ? () => onDelete(item, index) : () => handleDelete(item.id)}
                  isIconOnly
                  isDisabled={items.length <= (minItems ?? 0)}
                  variant="ghost"
                  // Необходимо переопределить дефолтное значение
                  // min-w-10
                  className={`min-w-7.75 w-7.75 border border-[#E8E8E8] h-10 rounded-[5px] text-red-500 hover:text-red-700 p-1 ${classNames?.delete}`}
                  aria-label="Удалить"
                >
                  <div className="w-3.25 h-4">
                    <SvgIcon src={iconBin} className="text-[#B7081B]" />
                  </div>
                </Button>
              )}
            </div>
            <AnimatePresence initial={false}>
              {below ? (
                <motion.div
                  key={`${item.id}-below`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  {below}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )
      })}
      {onAdd && canAddMore && (
        <Button
          variant="flat"
          onPress={onAdd}
          // radius="sm"
          className={`text-md w-fit rounded-[5px] ${classNames?.add}`}
          startContent={<SvgIcon src={iconAdd} size={'20px'} className="text-[#797979]" />}
        >
          {addButtonLabel}
        </Button>
      )}
    </div>
  )
}

export default EditableList
