import {
  TimePlanActivityCard,
  sortTimePlanActivitiesNaturally
} from "/build/_shared/chunk-GNW7Z5U5.js";
import {
  isTimePlanActivityInboxTaskTarget
} from "/build/_shared/chunk-ATIM3BG5.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import {
  BIG_PLAN,
  entityLinkRefIdFromWire,
  parentLinkNamespaceFromEntityLinkWire
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/time_plans/sub/activity/component/list.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function TimePlanActivityList(props) {
  const sortedActivities = sortTimePlanActivitiesNaturally(
    props.activities,
    props.inboxTasksByRefId
  );
  return /* @__PURE__ */ jsxDEV(EntityStack, { children: sortedActivities.map((entry) => {
    if (props.filterKind && props.filterKind.length > 0 && !props.filterKind.includes(entry.kind)) {
      return null;
    }
    if (props.filterFeasability && props.filterFeasability.length > 0 && !props.filterFeasability.includes(entry.feasability)) {
      return null;
    }
    if (props.filterDoneness && props.filterDoneness.length > 0 && !props.filterDoneness.includes(
      props.activityDoneness[entry.ref_id] === import_webapi_client.TimePlanActivityDoneness.DONE
    )) {
      return null;
    }
    return /* @__PURE__ */ jsxDEV(
      TimePlanActivityCard,
      {
        topLevelInfo: props.topLevelInfo,
        activity: entry,
        indent: props.fullInfo ? isTimePlanActivityInboxTaskTarget(entry.target) && parentLinkNamespaceFromEntityLinkWire(
          props.inboxTasksByRefId.get(
            entityLinkRefIdFromWire(entry.target)
          ).owner
        ) === BIG_PLAN ? 2 : 0 : 0,
        fullInfo: props.fullInfo,
        showTimePlanName: props.showTimePlanName,
        timePlansByRefId: props.timePlansByRefId,
        inboxTasksByRefId: props.inboxTasksByRefId,
        bigPlansByRefId: props.bigPlansByRefId,
        activityDoneness: props.activityDoneness,
        timeEventsByRefId: props.timeEventsByRefId
      },
      `time-plan-activity-${entry.ref_id}`,
      false,
      {
        fileName: "../core/jupiter/core/time_plans/sub/activity/component/list.tsx",
        lineNumber: 75,
        columnNumber: 11
      },
      this
    );
  }) }, void 0, false, {
    fileName: "../core/jupiter/core/time_plans/sub/activity/component/list.tsx",
    lineNumber: 45,
    columnNumber: 5
  }, this);
}

export {
  TimePlanActivityList
};
//# sourceMappingURL=/build/_shared/chunk-5FT37GVY.js.map
