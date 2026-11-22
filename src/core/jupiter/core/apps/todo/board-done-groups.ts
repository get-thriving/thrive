import type { InboxTask, InboxTaskStatus } from "@jupiter/webapi-client";
import { DateTime } from "luxon";

import { isCompleted } from "#/core/common/sub/inbox_tasks/status";

/**
 * How far back the done column reaches for archived tasks. It counts calendar
 * days in the user's timezone and includes today, so the column never shows
 * more than this many day groups of them.
 */
export const TODO_BOARD_ARCHIVE_WINDOW_DAYS = 7;

export interface TodoBoardDoneGroup {
  /** The day, as `yyyy-MM-dd` in the user's timezone. */
  day: string;
  inboxTasks: Array<InboxTask>;
}

/**
 * When the work on a task ended. A task that was archived without ever being
 * completed falls back to when it was archived.
 *
 * `optimisticStatus` is what the board shows while a drag is still being
 * saved: a task just dropped into done has no completion time yet, so it
 * counts as finished now.
 */
export function todoBoardFinishedTime(
  inboxTask: InboxTask,
  timezone: string,
  now: DateTime,
  optimisticStatus?: InboxTaskStatus,
): DateTime {
  if (
    optimisticStatus !== undefined &&
    isCompleted(optimisticStatus) &&
    !isCompleted(inboxTask.status)
  ) {
    return now.setZone(timezone);
  }

  const raw =
    inboxTask.completed_time ??
    inboxTask.archived_time ??
    inboxTask.last_modified_time;
  return DateTime.fromISO(raw, { zone: "UTC" }).setZone(timezone);
}

/** The first moment the done column reaches back to for archived tasks. */
export function todoBoardArchiveWindowStart(
  timezone: string,
  now: DateTime,
): DateTime {
  return now
    .setZone(timezone)
    .startOf("day")
    .minus({ days: TODO_BOARD_ARCHIVE_WINDOW_DAYS - 1 });
}

/**
 * Whether an archived task belongs in the done column: it has to have been
 * finished (an archived task that was still open is not "done"), and finished
 * inside the window.
 */
export function isTodoBoardRecentlyFinishedArchivedTask(
  inboxTask: InboxTask,
  timezone: string,
  now: DateTime,
): boolean {
  if (!inboxTask.archived || !isCompleted(inboxTask.status)) {
    return false;
  }

  return (
    todoBoardFinishedTime(inboxTask, timezone, now) >=
    todoBoardArchiveWindowStart(timezone, now)
  );
}

/**
 * Groups finished tasks by the day they were finished on, the latest day first
 * and the latest finish first within a day.
 */
export function groupTodoBoardDoneByDay(
  inboxTasks: Array<InboxTask>,
  timezone: string,
  now: DateTime,
  optimisticStatuses: { [refId: string]: InboxTaskStatus | undefined } = {},
): Array<TodoBoardDoneGroup> {
  const withTime = inboxTasks.map((inboxTask) => ({
    inboxTask,
    finished: todoBoardFinishedTime(
      inboxTask,
      timezone,
      now,
      optimisticStatuses[inboxTask.ref_id],
    ),
  }));

  withTime.sort(
    (a, b) =>
      b.finished.toMillis() - a.finished.toMillis() ||
      a.inboxTask.ref_id.localeCompare(b.inboxTask.ref_id),
  );

  const groups: Array<TodoBoardDoneGroup> = [];
  for (const { inboxTask, finished } of withTime) {
    const day = finished.toISODate() as string;
    const last = groups[groups.length - 1];
    if (last !== undefined && last.day === day) {
      last.inboxTasks.push(inboxTask);
    } else {
      groups.push({ day, inboxTasks: [inboxTask] });
    }
  }
  return groups;
}

/** "Today", "Yesterday", or a short weekday and date like "Mon, Nov 9". */
export function todoBoardDayLabel(
  day: string,
  timezone: string,
  now: DateTime,
): string {
  const today = now.setZone(timezone).startOf("day");
  const date = DateTime.fromISO(day, { zone: timezone });
  const daysAgo = Math.round(today.diff(date, "days").days);
  if (daysAgo === 0) {
    return "Today";
  }
  if (daysAgo === 1) {
    return "Yesterday";
  }
  return date.toFormat("ccc, LLL d");
}
