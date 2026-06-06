import type { EntityLink } from "@jupiter/webapi-client";

/** ``EntityLink`` wire form for a time-plan activity aimed at an inbox task. */
const INBOX_TASK_STD_PREFIX = "InboxTask:std:";

/** ``EntityLink`` wire form for a time-plan activity aimed at a project. */
const PROJECT_STD_PREFIX = "Project:std:";

export function isTimePlanActivityInboxTaskTarget(target: EntityLink): boolean {
  return target.startsWith(INBOX_TASK_STD_PREFIX);
}

export function isTimePlanActivityProjectTarget(target: EntityLink): boolean {
  return target.startsWith(PROJECT_STD_PREFIX);
}

/** Sort key: project activities before inbox-task (matches previous enum order). */
export function timePlanActivityTargetSortOrder(target: EntityLink): number {
  if (isTimePlanActivityProjectTarget(target)) {
    return 0;
  }
  if (isTimePlanActivityInboxTaskTarget(target)) {
    return 1;
  }
  return 2;
}
