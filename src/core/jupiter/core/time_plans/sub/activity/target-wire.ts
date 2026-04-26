import type { EntityLink } from "@jupiter/webapi-client";

/** ``EntityLink`` wire form for a time-plan activity aimed at an inbox task. */
const INBOX_TASK_STD_PREFIX = "InboxTask:std:";

/** ``EntityLink`` wire form for a time-plan activity aimed at a big plan. */
const BIG_PLAN_STD_PREFIX = "BigPlan:std:";

export function isTimePlanActivityInboxTaskTarget(target: EntityLink): boolean {
  return target.startsWith(INBOX_TASK_STD_PREFIX);
}

export function isTimePlanActivityBigPlanTarget(target: EntityLink): boolean {
  return target.startsWith(BIG_PLAN_STD_PREFIX);
}

/** Sort key: big-plan activities before inbox-task (matches previous enum order). */
export function timePlanActivityTargetSortOrder(target: EntityLink): number {
  if (isTimePlanActivityBigPlanTarget(target)) {
    return 0;
  }
  if (isTimePlanActivityInboxTaskTarget(target)) {
    return 1;
  }
  return 2;
}
