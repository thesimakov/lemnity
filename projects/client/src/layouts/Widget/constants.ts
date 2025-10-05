import { WidgetTypeEnum } from '@lemnity/api-sdk/models'

export const WidgetTypes = {
  WHEEL_OF_FORTUNE: 'WHEEL_OF_FORTUNE',
  CONVEYOR_OF_GIFTS: 'CONVEYOR_OF_GIFTS',
  ACTION_TIMER: 'ACTION_TIMER',
  POSTCARD: 'POSTCARD',
  TREASURE_CHEST_WITH_ACTION: 'TREASURE_CHEST_WITH_ACTION',
  ADVENT_CALENDAR: 'ADVENT_CALENDAR',
  TEASER: 'TEASER'
}

export interface AvailableWidget {
  type: WidgetTypeEnum
  title: string
  description: string
  isAvailable: boolean
  badge?: 'new' | 'popular' | 'soon'
}

export const AVAILABLE_WIDGETS: AvailableWidget[] = [
  {
    type: WidgetTypeEnum.WHEEL,
    title: 'Колесо фортуны',
    description: 'Лиды, вовлечение, вознаграждение',
    isAvailable: true,
    badge: 'new'
  },
  {
    type: WidgetTypeEnum.PIPELINE,
    title: 'Конвейер подарков',
    description: 'Лиды, вовлечение, вознаграждение',
    isAvailable: false,
    badge: 'soon'
  },
  {
    type: WidgetTypeEnum.TIMER,
    title: 'Таймер акции',
    description: 'Лиды, вовлечение, вознаграждение',
    isAvailable: false,
    badge: 'soon'
  },
  {
    type: WidgetTypeEnum.POSTCARD,
    title: 'Открытка',
    description: 'Лиды, вовлечение, вознаграждение',
    isAvailable: false,
    badge: 'soon'
  },
  {
    type: 'CHEST' as WidgetTypeEnum,
    title: 'Сундук с акцией',
    description: 'Лиды, вовлечение, вознаграждение',
    isAvailable: false,
    badge: 'soon'
  },
  {
    type: 'ADVENT' as WidgetTypeEnum,
    title: 'Advent календарь',
    description: 'Лиды, вовлечение, вознаграждение',
    isAvailable: false,
    badge: 'soon'
  },
  {
    type: 'TEASER' as WidgetTypeEnum,
    title: 'Дразнилка',
    description: 'Лиды, вовлечение, вознаграждение',
    isAvailable: false,
    badge: 'soon'
  }
]
