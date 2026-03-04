import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
// import { Button } from '@heroui/button'
import { Input, Button, ButtonChevron, Popover } from '@/components'
import { cn } from '@heroui/theme'

import EditableList, { type EditableListItem } from '@/components/EditableList'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import SvgIcon from '@/components/SvgIcon'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { uuidv4 } from '@/common/utils/uuidv4'

import type {
  NotificationWidgetType,
  Notification,
  Expiration,
} from '@lemnity/widget-config/widgets/notification'
import gearIcon from '@/assets/icons/gear.svg'
import { notificationWidgetDefaults } from './defaults'
import { PopoverContent, PopoverTrigger } from '@heroui/popover'

type NotificationItemProps = {
  notification: Notification
  index: number
  pendingItemId: string | null
  setPendingItemId: (id: string | null) => void
  onTextChange: (text: string) => void
}

const NotificationItem = (props: NotificationItemProps) => {
  const isActive = props.notification.id === props.pendingItemId

  const handleButtonPress = () => {
    if (
      typeof props.pendingItemId === 'string'
      && props.pendingItemId !== props.notification.id
    ) {
      props.setPendingItemId(null)
      // костыль. я пока не знаю, как сделать правильно
      // https://stackoverflow.com/a/75403839/21210000
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#late_timeouts
      setTimeout(() => {
        props.setPendingItemId(props.notification.id)
      })
      return
    }

    props.setPendingItemId(
      isActive
        ? null
        : props.notification.id
      )
  }

  return (
    <div className='flex flex-row gap-2.5'>
      <Input
        value={props.notification.text}
        onValueChange={props.onTextChange}
      />
      <Button
        className={isActive ? 'bg-[#E8E8E8]' : 'bg-white'}
        onPress={handleButtonPress}
      >
        <div className='w-4 h-4'>
          <SvgIcon src={gearIcon} preserveOriginalColors />
        </div>
        <ButtonChevron open={isActive} />
      </Button>
    </div>
  )
}

type ExpirationPopoverProps = {
  expiration: Expiration
  pendingItemId: string | null
  onExpirationChange: (expiration: Expiration) => void
}

const ExpirationPopover = (props: ExpirationPopoverProps) => {
  const [open, setOpen] = useState(false)

  const expirationVariants: Expiration[] = ['6', '12', '24', '48']
  const popoverClassNames = {
    base: 'rounded-[5px]',
    content: 'w-32.5 p-2.5 flex-col rounded-[5px]',
  }

  const handleTriggerPress = () => {
    setOpen(!open)
  }

  return (
    <Popover placement='right-end' classNames={popoverClassNames}>
      <PopoverTrigger>
        <Button onPress={handleTriggerPress}>
          <ButtonChevron open={open} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <span className='text-[11px] leading-3.25'>
          Выберите, как долго уведомление будет видно
        </span>

        {expirationVariants.map(variant => (
          <Button
            key={uuidv4()}
            className={cn(
              'w-full h-[unset] px-4 py-2.5',
              props.expiration === variant
                ? 'border-[#915DC0]'
                : 'border-[#E8E8E8]',
            )}
            onPress={() => props.onExpirationChange(variant)}
          >
            <span className='text-base leading-3.75'>
              {`${variant} ${variant === '24' ? 'часа' : 'часов'}`}
            </span>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

type NotificationItemSettingsProps = {
  notification: Notification
  pendingItemId: string | null
  onUrlTextChange: (urlText: string) => void
  onUrlChange: (urlText: string) => void
  onExpirationChange: (expiration: Expiration) => void
}

const NotificationItemSettings = (props: NotificationItemSettingsProps) => {
  return (
    <div
      className='w-full p-3 flex flex-col gap-2.5 bg-[#E8E8E8] rounded-[5px]'
    >
      <span className='text-[16px] leading-3.75 text-[#3D3D3B]'>
        Настройка кнопки
      </span>      

      <div className='w-full flex flex-row flex-wrap gap-2.5'>
        <Input
          value={props.notification.urlText}
          onValueChange={props.onUrlTextChange}
        />
        <Input
          value={props.notification.url}
          onValueChange={props.onUrlChange}
        />
        <ExpirationPopover
          expiration={props.notification.expiration}
          pendingItemId={props.pendingItemId}
          onExpirationChange={props.onExpirationChange}
        />
      </div>
    </div>
  )
}

const NotificationSettings = () => {
  const {
    notifications,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const settings = (s.settings?.widget as NotificationWidgetType)

      return {
        notifications: settings.notifications,
      }
    })
  )

  // console.log(notifications)

  const [pendingItemId, setPendingItemId] = useState<string | null>(null)

  const setNotifications = useWidgetSettingsStore(
    s => s.setNotifications
  )
  const addNotification = useWidgetSettingsStore(
    s => s.addNotification
  )
  const deleteNotification = useWidgetSettingsStore(
    s => s.deleteNotification
  )
  const updateNotification = useWidgetSettingsStore(
    s => s.updateNotification
  )

  const handleAdd = () => {
    addNotification({
      ...notificationWidgetDefaults.notifications[0],
      id: uuidv4()
    })
  }
  const handleDelete = (item: EditableListItem<Notification>) => {
    deleteNotification(item.id)
  }

  const handleTextChange = (index: number, text: string) => {
    updateNotification(index, { text })
  }
  const handleUrlTextChange = (index: number, urlText: string) => {
    updateNotification(index, { urlText })
  }
  const handleUrlChange = (index: number, url: string) => {
    updateNotification(index, { url })
  }
  const handleExpirationChange = (index: number, expiration: Expiration) => {
    updateNotification(index, { expiration })
  }

  const renderItem = (item: Notification, index: number) => (
    <NotificationItem
      notification={item}
      index={index}
      pendingItemId={pendingItemId}
      setPendingItemId={setPendingItemId}
      onTextChange={value => handleTextChange(index, value)}
    />
  )
  const renderBelow = (item: Notification, index: number) => (
    item.id === pendingItemId && (
      <NotificationItemSettings
        notification={item}
        pendingItemId={pendingItemId}
        onUrlTextChange={value => handleUrlTextChange(index, value)}
        onUrlChange={value => handleUrlChange(index, value)}
        onExpirationChange={value => handleExpirationChange(index, value)}
      />
    )
  )

  const classNames = {
    index: 'min-w-[40px]',
    delete: 'h-12.75',
  }

  return (
    <BorderedContainer>
      <div className='w-full flex flex-col gap-6'>
        <div className='h-9.25 shrink-0 flex justify-between'>
          <span className='text-lg leading-5.25 font-medium'>
            Секторы
          </span>
          <span className='text-lg text-[#C0C0C0] leading-5.25'>
            Максимум 5
          </span>
        </div>

        <div className='w-full flex flex-col gap-2.5'>
          {notifications && (
            <EditableList
              showIndex={false}
              items={notifications}
              maxItems={5}
              onItemsChange={setNotifications}
              canReorder
              classNames={classNames}
              renderItem={renderItem}
              renderBelow={renderBelow}
              onDelete={handleDelete}
              onAdd={handleAdd}
              addButtonLabel='Добавить сектор'
              // disabledReorderIds={pendingItemId ? [pendingItemId] : []}
            />
          )}
        </div>
      </div>
    </BorderedContainer>
  )
}

export default NotificationSettings
