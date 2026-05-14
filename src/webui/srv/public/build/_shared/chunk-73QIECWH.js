import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/time_plans/sub/activity/feasability.ts
var import_webapi_client = __toESM(require_dist(), 1);
function timePlanActivityFeasabilityName(feasability) {
  switch (feasability) {
    case import_webapi_client.TimePlanActivityFeasability.MUST_DO:
      return "Must Do";
    case import_webapi_client.TimePlanActivityFeasability.NICE_TO_HAVE:
      return "Nice To Have";
    case import_webapi_client.TimePlanActivityFeasability.STRETCH:
      return "Stretch";
  }
}
var TIME_PLAN_ACTIVITY_FEASABILITY_MAP = {
  [import_webapi_client.TimePlanActivityFeasability.MUST_DO]: 0,
  [import_webapi_client.TimePlanActivityFeasability.NICE_TO_HAVE]: 1,
  [import_webapi_client.TimePlanActivityFeasability.STRETCH]: 2
};
function compareTimePlanActivityFeasability(feasability1, feasability2) {
  return TIME_PLAN_ACTIVITY_FEASABILITY_MAP[feasability1] - TIME_PLAN_ACTIVITY_FEASABILITY_MAP[feasability2];
}

// ../core/jupiter/core/time_plans/sub/activity/kind.ts
var import_webapi_client2 = __toESM(require_dist(), 1);
function timePlanActivityKindName(kind) {
  switch (kind) {
    case import_webapi_client2.TimePlanActivityKind.FINISH:
      return "Finish";
    case import_webapi_client2.TimePlanActivityKind.MAKE_PROGRESS:
      return "Make Progress";
  }
}
var TIME_PLAN_ACTIVITY_KIND_MAP = {
  [import_webapi_client2.TimePlanActivityKind.FINISH]: 0,
  [import_webapi_client2.TimePlanActivityKind.MAKE_PROGRESS]: 1
};
function compareTimePlanActivityKind(kind1, kind2) {
  return TIME_PLAN_ACTIVITY_KIND_MAP[kind1] - TIME_PLAN_ACTIVITY_KIND_MAP[kind2];
}

export {
  timePlanActivityFeasabilityName,
  compareTimePlanActivityFeasability,
  timePlanActivityKindName,
  compareTimePlanActivityKind
};
//# sourceMappingURL=/build/_shared/chunk-73QIECWH.js.map
