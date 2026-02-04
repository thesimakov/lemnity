/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TypedWidgetUpdater } from "@/stores/widgetSettings/widgetActions/types";
import type { AnnouncementWidgetSettings } from "./types";

// @ts-expect-error: unused war
export const createAnnouncementActions = (updateWidget: TypedWidgetUpdater<AnnouncementWidgetSettings>) => ({
  // ...
})
