// ../core/jupiter/core/time_plans/sub/activity/target-wire.ts
var INBOX_TASK_STD_PREFIX = "InboxTask:std:";
var BIG_PLAN_STD_PREFIX = "BigPlan:std:";
function isTimePlanActivityInboxTaskTarget(target) {
  return target.startsWith(INBOX_TASK_STD_PREFIX);
}
function isTimePlanActivityBigPlanTarget(target) {
  return target.startsWith(BIG_PLAN_STD_PREFIX);
}
function timePlanActivityTargetSortOrder(target) {
  if (isTimePlanActivityBigPlanTarget(target)) {
    return 0;
  }
  if (isTimePlanActivityInboxTaskTarget(target)) {
    return 1;
  }
  return 2;
}

export {
  isTimePlanActivityInboxTaskTarget,
  isTimePlanActivityBigPlanTarget,
  timePlanActivityTargetSortOrder
};
//# sourceMappingURL=/build/_shared/chunk-ATIM3BG5.js.map
