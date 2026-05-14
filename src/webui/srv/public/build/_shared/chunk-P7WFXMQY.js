import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/big_plans/status.ts
var import_webapi_client = __toESM(require_dist(), 1);
function bigPlanStatusName(status) {
  switch (status) {
    case import_webapi_client.BigPlanStatus.NOT_STARTED:
      return "Not Started";
    case import_webapi_client.BigPlanStatus.IN_PROGRESS:
      return "In Progress";
    case import_webapi_client.BigPlanStatus.BLOCKED:
      return "Blocked";
    case import_webapi_client.BigPlanStatus.NOT_DONE:
      return "Not Done";
    case import_webapi_client.BigPlanStatus.DONE:
      return "Done";
  }
}
function bigPlanStatusIcon(status) {
  switch (status) {
    case import_webapi_client.BigPlanStatus.NOT_STARTED:
      return "\u{1F527}";
    case import_webapi_client.BigPlanStatus.IN_PROGRESS:
      return "\u{1F6A7}";
    case import_webapi_client.BigPlanStatus.BLOCKED:
      return "\u{1F6A7}";
    case import_webapi_client.BigPlanStatus.NOT_DONE:
      return "\u26D4";
    case import_webapi_client.BigPlanStatus.DONE:
      return "\u2705";
  }
}
var BIG_PLAN_STATUS_MAP = {
  [import_webapi_client.BigPlanStatus.NOT_STARTED]: 0,
  [import_webapi_client.BigPlanStatus.IN_PROGRESS]: 1,
  [import_webapi_client.BigPlanStatus.BLOCKED]: 2,
  [import_webapi_client.BigPlanStatus.NOT_DONE]: 3,
  [import_webapi_client.BigPlanStatus.DONE]: 4
};
function compareBigPlanStatus(status1, status2) {
  return BIG_PLAN_STATUS_MAP[status1] - BIG_PLAN_STATUS_MAP[status2];
}
function isCompleted(status) {
  return status === import_webapi_client.BigPlanStatus.DONE || status === import_webapi_client.BigPlanStatus.NOT_DONE;
}

export {
  bigPlanStatusName,
  bigPlanStatusIcon,
  compareBigPlanStatus,
  isCompleted
};
//# sourceMappingURL=/build/_shared/chunk-P7WFXMQY.js.map
