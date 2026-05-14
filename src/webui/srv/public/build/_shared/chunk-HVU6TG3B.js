import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/recurring-task-period.ts
var import_webapi_client = __toESM(require_dist(), 1);
function periodName(status, isBigScreen = true) {
  switch (status) {
    case import_webapi_client.RecurringTaskPeriod.DAILY:
      return isBigScreen ? "Daily" : "Day";
    case import_webapi_client.RecurringTaskPeriod.WEEKLY:
      return isBigScreen ? "Weekly" : "Wk";
    case import_webapi_client.RecurringTaskPeriod.MONTHLY:
      return isBigScreen ? "Monthly" : "Mnth";
    case import_webapi_client.RecurringTaskPeriod.QUARTERLY:
      return isBigScreen ? "Quarterly" : "Qrt";
    case import_webapi_client.RecurringTaskPeriod.YEARLY:
      return isBigScreen ? "Year" : "Yr";
  }
}
var PERIOD_MAP = {
  [import_webapi_client.RecurringTaskPeriod.DAILY]: 0,
  [import_webapi_client.RecurringTaskPeriod.WEEKLY]: 1,
  [import_webapi_client.RecurringTaskPeriod.MONTHLY]: 2,
  [import_webapi_client.RecurringTaskPeriod.QUARTERLY]: 3,
  [import_webapi_client.RecurringTaskPeriod.YEARLY]: 4
};
function oneLessThanPeriod(period) {
  switch (period) {
    case import_webapi_client.RecurringTaskPeriod.DAILY:
      throw new Error(`Invalid period ${period} for computing one less`);
    case import_webapi_client.RecurringTaskPeriod.WEEKLY:
      return import_webapi_client.RecurringTaskPeriod.DAILY;
    case import_webapi_client.RecurringTaskPeriod.MONTHLY:
      return import_webapi_client.RecurringTaskPeriod.WEEKLY;
    case import_webapi_client.RecurringTaskPeriod.QUARTERLY:
      return import_webapi_client.RecurringTaskPeriod.MONTHLY;
    case import_webapi_client.RecurringTaskPeriod.YEARLY:
      return import_webapi_client.RecurringTaskPeriod.QUARTERLY;
  }
}
function allHigherPeriods(period) {
  return Object.values(import_webapi_client.RecurringTaskPeriod).filter(
    (p) => comparePeriods(p, period) >= 0
  );
}
function comparePeriods(period1, period2) {
  return PERIOD_MAP[period1] - PERIOD_MAP[period2];
}

export {
  periodName,
  oneLessThanPeriod,
  allHigherPeriods,
  comparePeriods
};
//# sourceMappingURL=/build/_shared/chunk-HVU6TG3B.js.map
