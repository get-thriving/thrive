import {
  comparePeriods
} from "/build/_shared/chunk-HVU6TG3B.js";
import {
  aDateToDate,
  compareADate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/time_plans/root.ts
var import_webapi_client = __toESM(require_dist(), 1);
function timePlanAllowsInboxTasks(timePlan) {
  return timePlan.period === import_webapi_client.RecurringTaskPeriod.DAILY || timePlan.period === import_webapi_client.RecurringTaskPeriod.WEEKLY;
}
function timePlanAllowsKanbanViews(timePlan) {
  return timePlanAllowsInboxTasks(timePlan);
}
function findTimePlansThatAreActive(timePlans, rightNow) {
  const rightNowDate = aDateToDate(rightNow);
  return timePlans.filter((timePlan) => {
    const startDate = aDateToDate(timePlan.start_date);
    const endDate = aDateToDate(timePlan.end_date);
    return startDate <= rightNowDate && rightNowDate <= endDate;
  });
}
function sortTimePlansNaturally(timePlans) {
  return [...timePlans].sort((j1, j2) => {
    if (j2.archived && !j1.archived) {
      return -1;
    }
    if (j1.archived && !j2.archived) {
      return 1;
    }
    return -1 * compareADate(j1.right_now, j2.right_now) || comparePeriods(j1.period, j2.period);
  });
}

export {
  timePlanAllowsInboxTasks,
  timePlanAllowsKanbanViews,
  findTimePlansThatAreActive,
  sortTimePlansNaturally
};
//# sourceMappingURL=/build/_shared/chunk-ZTWT66OL.js.map
