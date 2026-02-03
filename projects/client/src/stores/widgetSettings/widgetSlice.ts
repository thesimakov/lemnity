import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type { ActionTimerWidgetSettings, WidgetSpecificSettings } from './types'
import type {
  WidgetActions,
  WidgetSlice,
  WidgetUpdater,
  TypedWidgetUpdater
} from './widgetActions/types'
import type { WheelOfFortuneWidgetSettings } from '@/stores/widgetSettings/types'
import { createWheelActions } from '@/layouts/Widgets/WheelOfFortune/actions'
import { createActionTimerActions } from '@/layouts/Widgets/CountDown/actions'
import type { FABMenuWidgetSettings } from '@/layouts/Widgets/FABMenu/types'
import { createFABMenuActions } from '@/layouts/Widgets/FABMenu/actions'
import type { AnnouncementWidgetSettings } from '@/layouts/Widgets/Announcement/types'
import { createAnnouncementActions } from '@/layouts/Widgets/Announcement/acttions'

export const createWidgetSlice = (updateWidget: WidgetUpdater): WidgetSlice => {
  const createTypedUpdater =
    <T extends WidgetSpecificSettings>(
      predicate: (widget: WidgetSpecificSettings) => widget is T
    ) =>
    (mutator: (settings: T) => T) =>
      updateWidget(widget => (predicate(widget) ? mutator(widget as T) : widget))

  const wheelUpdater: TypedWidgetUpdater<WheelOfFortuneWidgetSettings> = createTypedUpdater(
    (widget): widget is WheelOfFortuneWidgetSettings =>
      widget.type === WidgetTypeEnum.WHEEL_OF_FORTUNE
  )

  const actionTimerUpdater: TypedWidgetUpdater<ActionTimerWidgetSettings> = createTypedUpdater(
    (widget): widget is ActionTimerWidgetSettings => widget.type === WidgetTypeEnum.ACTION_TIMER
  )

  const fabMenuUpdater: TypedWidgetUpdater<FABMenuWidgetSettings> = createTypedUpdater(
    (widget): widget is FABMenuWidgetSettings => widget.type === WidgetTypeEnum.FAB_MENU
  )

  const announcementUpdater: TypedWidgetUpdater<AnnouncementWidgetSettings> = createTypedUpdater(
    (widget): widget is AnnouncementWidgetSettings => widget.type === WidgetTypeEnum.ANNOUNCEMENT
  )

  const specificActions = {
    ...createWheelActions(wheelUpdater),
    ...createActionTimerActions(actionTimerUpdater),
    ...createFABMenuActions(fabMenuUpdater),
    ...createAnnouncementActions(announcementUpdater)
  } as Omit<WidgetActions, 'setWidgetType'>

  return {
    widgetSettingsUpdater: updateWidget,
    setWidgetType: (widgetType: WidgetTypeEnum, nextSettings: WidgetSpecificSettings) =>
      updateWidget(() => ({ ...nextSettings, type: widgetType }) as WidgetSpecificSettings),
    ...specificActions
  }
}
