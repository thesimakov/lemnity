import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { cn } from '@heroui/theme'
import { PopoverContent, PopoverTrigger } from '@heroui/popover'

import EditableList, { type EditableListItem } from '@/components/EditableList'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import SvgIcon from '@/components/SvgIcon'
import {
  Input,
  Button,
  ButtonChevron,
  Popover,
  FontSizeSettings,
} from '@/components'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { uuidv4 } from '@/common/utils/uuidv4'

import type {
  NotificationWidgetType,
  Notification,
  Expiration,
} from '@lemnity/widget-config/widgets/notification'
import gearIcon from '@/assets/icons/gear.svg'
import { notificationWidgetDefaults as defaults } from './defaults'

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

  const inputClassNames = {
    inputWrapper: 'min-h-10',
  }

  return (
    <div className='flex flex-row gap-2.5'>
      <Input
        classNames={inputClassNames}
        value={props.notification.text}
        onValueChange={props.onTextChange}
      />
      <Button
        className={cn(
          'min-w-14.25 h-10 px-0',
          isActive ? 'bg-[#E8E8E8]' : 'bg-white',
        )}
        onPress={handleButtonPress}
      >
        <div className='flex flex-row w-fit gap-1'>
          <div className='w-4 h-4'>
            <SvgIcon src={gearIcon} preserveOriginalColors />
          </div>
          <ButtonChevron open={isActive} />
        </div>
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
        <Button
          className='min-w-16.75 h-10 px-0'
          onPress={handleTriggerPress}
        >
          <div className='flex flex-row gap-1.25'>
            <span className='text-base leading-3.75'>
              {props.expiration}
            </span>
            <ButtonChevron open={open} />
          </div>
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
  onUrlFontSizeChange: (size: number) => void
}

const NotificationItemSettings = (props: NotificationItemSettingsProps) => {
  const inputClassNames = {
    inputWrapper: 'min-h-10',
    base: 'min-w-60',
  }

  return (
    <div
      className='w-full p-3 flex flex-col gap-2.5 bg-[#E8E8E8] rounded-[5px]'
    >
      <span className='text-[16px] leading-3.75 text-[#3D3D3B]'>
        Настройка кнопки
      </span>      

      <div className='w-full flex flex-row flex-wrap gap-2.5 @container'>
        <Input
          classNames={inputClassNames}
          value={props.notification.urlText}
          onValueChange={props.onUrlTextChange}
        />
        <Input
          classNames={inputClassNames}
          value={props.notification.url}
          onValueChange={props.onUrlChange}
        />
        <div
          className={cn(
            'w-full flex flex-row justify-between gap-2.5',
            '@min-[700px]:justify-start @min-[700px]:max-w-fit',
          )}
        >
          <FontSizeSettings
            xs
            value={props.notification.urlFontSize}
            onChange={props.onUrlFontSizeChange}
          />
          <ExpirationPopover
            expiration={props.notification.expiration}
            pendingItemId={props.pendingItemId}
            onExpirationChange={props.onExpirationChange}
          />
        </div>
      </div>
    </div>
  )
}

const NotificationSettings = () => {
  const { delay, notifications } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const settings = (s.settings?.widget as NotificationWidgetType)

      return {
        delay: settings.delay
          ?? defaults.delay,
        notifications: settings.notifications
          ?? defaults.notifications,
      }
    })
  )

  const [pendingItemId, setPendingItemId] = useState<string | null>(null)

  const setNotificationDelay = useWidgetSettingsStore(
    s => s.setNotificationDelay
  )
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
      ...defaults.notifications[0],
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
  const handleUrlFontSizeChange = (index: number, urlFontSize: number) => {
    updateNotification(index, { urlFontSize })
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
        onUrlFontSizeChange={value => handleUrlFontSizeChange(index, value)}
      />
    )
  )

  const listClassNames = {
    index: 'min-w-[40px]',
    // delete: 'h-12.75',
  }
  const inputClassNames = {
    base: 'min-w-[unset] max-w-19',
    inputWrapper: 'min-h-10',
    input: cn(
      '[&::-webkit-outer-spin-button]:appearance-none',
      '[&::-webkit-inner-spin-button]:appearance-none',
      '[&]:remove-spin-buttons',
    )
  }

  const handleDelayChange = (value: string) => {
    setNotificationDelay(+value)
  }

  return (
    <BorderedContainer>
      <div className='w-full flex flex-col'>
        <div className='h-9.25 shrink-0 flex justify-between'>
          <span className='text-lg leading-5.25 font-medium'>
            Секторы
          </span>
          <span className='text-lg text-[#C0C0C0] leading-5.25'>
            Максимум 5
          </span>
        </div>

        <div className='flex flex-row gap-2.5 items-center'>
          <Input
            type='number'
            value={delay.toString()}
            min={0}
            classNames={inputClassNames}
            onValueChange={handleDelayChange}
            endContent='сек'
          />
          <span className='text-base leading-3.75'>
            Укажите задержку перед показом уведомлений
          </span>
        </div>

        <hr className='border-[#E1E1E1] my-2.5' />

        <div className='w-full flex flex-col gap-2.5'>
          {notifications && (
            <EditableList
              showIndex={false}
              items={notifications}
              maxItems={5}
              onItemsChange={setNotifications}
              canReorder
              classNames={listClassNames}
              renderItem={renderItem}
              renderBelow={renderBelow}
              onDelete={handleDelete}
              onAdd={handleAdd}
              addButtonLabel='Добавить сектор'
            />
          )}
        </div>
      </div>
    </BorderedContainer>
  )
}

export default NotificationSettings
