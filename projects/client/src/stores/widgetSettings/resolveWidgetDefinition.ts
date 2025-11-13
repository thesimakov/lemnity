import { WidgetTypeEnum } from '@lemnity/api-sdk'

export const resolveWidgetDefinition =
  <T extends Record<WidgetTypeEnum, U>, U>(definitions: T) =>
  (widgetType: WidgetTypeEnum): U =>
    definitions[widgetType]
