import type {
  CalendarEventsEntries,
  TimeEventInDayBlock,
  TimePlanActivity,
} from "@jupiter/webapi-client";

import { calendarEventLinkKey } from "#/core/calendar/component/calendar-navigation";
import { entityLinkStd, parseEntityLinkStd } from "#/core/common/entity-link";

// Which of this plan's activities a calendar event belongs to, if any. Events
// owned by an activity, or by a todo/habit/chore/project that is a target of
// one, open that activity. Everything else is just an event on the same days.
export function activityRefIdByCalendarEvent(
  activities: TimePlanActivity[],
  entries: CalendarEventsEntries | undefined,
  activityTimeEventBlocks: TimeEventInDayBlock[],
): Map<string, string> {
  const byEvent = new Map<string, string>();
  const activityRefIds = new Set(activities.map((a) => a.ref_id));
  const activityByTarget = new Map<string, string>();
  for (const activity of activities) {
    activityByTarget.set(activity.target, activity.ref_id);
  }

  function recordInDayBlock(refId: string, activityRefId: string) {
    byEvent.set(
      calendarEventLinkKey("time-event-in-day-block", refId),
      activityRefId,
    );
  }

  for (const block of activityTimeEventBlocks) {
    const { refId } = parseEntityLinkStd(block.owner);
    if (activityRefIds.has(refId)) {
      recordInDayBlock(block.ref_id, refId);
    }
  }

  if (entries === undefined) {
    return byEvent;
  }

  for (const entry of entries.time_plan_activity_entries) {
    const activityRefId = entry.time_plan_activity.ref_id;
    if (!activityRefIds.has(activityRefId)) {
      continue;
    }
    for (const timeEvent of entry.time_events) {
      recordInDayBlock(timeEvent.ref_id, activityRefId);
    }
  }

  for (const entry of entries.todo_task_entries) {
    const activityRefId = activityByTarget.get(
      entityLinkStd("TodoTask", entry.todo_task.ref_id),
    );
    if (activityRefId === undefined) {
      continue;
    }
    for (const timeEvent of entry.time_events) {
      recordInDayBlock(timeEvent.ref_id, activityRefId);
    }
  }

  for (const entry of entries.project_entries) {
    const activityRefId = activityByTarget.get(
      entityLinkStd("Project", entry.project.ref_id),
    );
    if (activityRefId === undefined) {
      continue;
    }
    for (const timeEvent of entry.time_events) {
      recordInDayBlock(timeEvent.ref_id, activityRefId);
    }
  }

  for (const entry of entries.habit_entries) {
    const activityRefId = activityByTarget.get(
      entityLinkStd("Habit", entry.habit.ref_id),
    );
    if (activityRefId === undefined) {
      continue;
    }
    for (const timeEvent of entry.time_events) {
      recordInDayBlock(timeEvent.ref_id, activityRefId);
    }
  }

  for (const entry of entries.chore_entries) {
    const activityRefId = activityByTarget.get(
      entityLinkStd("Chore", entry.chore.ref_id),
    );
    if (activityRefId === undefined) {
      continue;
    }
    for (const timeEvent of entry.time_events) {
      recordInDayBlock(timeEvent.ref_id, activityRefId);
    }
  }

  return byEvent;
}
