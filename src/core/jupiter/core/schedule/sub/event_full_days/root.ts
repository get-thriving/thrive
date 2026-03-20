import type { ScheduleEventInDay } from "@jupiter/webapi-client";
import { ScheduleStreamSource } from "@jupiter/webapi-client";

export function isCorePropertyEditable(event: ScheduleEventInDay): boolean {
  return event.source === ScheduleStreamSource.TODO;
}
