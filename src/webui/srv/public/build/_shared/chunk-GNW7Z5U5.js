import {
  BigPlanStatusTag
} from "/build/_shared/chunk-W6KI7GPI.js";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityInboxTaskTarget,
  timePlanActivityTargetSortOrder
} from "/build/_shared/chunk-ATIM3BG5.js";
import {
  compareTimePlanActivityFeasability,
  compareTimePlanActivityKind,
  timePlanActivityFeasabilityName,
  timePlanActivityKindName
} from "/build/_shared/chunk-73QIECWH.js";
import {
  InboxTaskStatusTag
} from "/build/_shared/chunk-5CBAK2HS.js";
import {
  IsKeyTag
} from "/build/_shared/chunk-NVWDLS2H.js";
import {
  ADateTag
} from "/build/_shared/chunk-NBD44M5V.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  BIG_PLAN,
  entityLinkRefIdFromWire,
  isWorkspaceFeatureAvailable,
  parentLinkNamespaceFromEntityLinkWire
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  Typography_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/time_plans/sub/activity/root.ts
var import_webapi_client = __toESM(require_dist(), 1);
function filterActivityByFeasabilityWithParents(timePlanActivities, activitiesByBigPlanRefId, targetInboxTasks, targetBigPlans, feasability) {
  return timePlanActivities.filter((a) => {
    if (isTimePlanActivityBigPlanTarget(a.target)) {
      return a.feasability === feasability;
    }
    const inboxTask = targetInboxTasks.get(entityLinkRefIdFromWire(a.target));
    if (parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) !== BIG_PLAN) {
      return a.feasability === feasability;
    }
    const bigPlan = targetBigPlans.get(
      entityLinkRefIdFromWire(inboxTask.owner)
    );
    const bigPlanActivity = activitiesByBigPlanRefId.get(bigPlan.ref_id);
    return bigPlanActivity.feasability === feasability;
  });
}
function filterActivitiesByTargetStatus(timePlanActivities, targetInboxTasks, targetBigPlans, activityDoneness) {
  return timePlanActivities.filter((activity) => {
    if (activityDoneness[activity.ref_id] === import_webapi_client.TimePlanActivityDoneness.DONE) {
      return false;
    }
    if (isTimePlanActivityInboxTaskTarget(activity.target)) {
      const inboxTask = targetInboxTasks.get(
        entityLinkRefIdFromWire(activity.target)
      );
      return !inboxTask.archived;
    }
    if (isTimePlanActivityBigPlanTarget(activity.target)) {
      const bigPlan = targetBigPlans.get(
        entityLinkRefIdFromWire(activity.target)
      );
      return !bigPlan.archived;
    }
    throw new Error("This should not happen");
  });
}
function sortTimePlanActivitiesNaturally(timePlanActivities, targetInboxTasks) {
  return [...timePlanActivities].sort((j1, j2) => {
    const j1Parent = isTimePlanActivityBigPlanTarget(j1.target) ? entityLinkRefIdFromWire(j1.target) : parentLinkNamespaceFromEntityLinkWire(
      targetInboxTasks.get(entityLinkRefIdFromWire(j1.target)).owner
    ) === BIG_PLAN ? entityLinkRefIdFromWire(
      targetInboxTasks.get(entityLinkRefIdFromWire(j1.target)).owner
    ) : void 0;
    const j2Parent = isTimePlanActivityBigPlanTarget(j2.target) ? entityLinkRefIdFromWire(j2.target) : parentLinkNamespaceFromEntityLinkWire(
      targetInboxTasks.get(entityLinkRefIdFromWire(j2.target)).owner
    ) === BIG_PLAN ? entityLinkRefIdFromWire(
      targetInboxTasks.get(entityLinkRefIdFromWire(j2.target)).owner
    ) : void 0;
    if (j1Parent !== j2Parent) {
      if (j1Parent === void 0 || j1Parent === null) {
        return 1;
      }
      if (j2Parent === void 0 || j2Parent === null) {
        return -1;
      }
      return j1Parent.localeCompare(j2Parent);
    }
    if (j1.target !== j2.target) {
      return timePlanActivityTargetSortOrder(j1.target) - timePlanActivityTargetSortOrder(j2.target);
    }
    if (j2.archived && !j1.archived) {
      return -1;
    }
    if (j1.archived && !j2.archived) {
      return 1;
    }
    return compareTimePlanActivityFeasability(j1.feasability, j2.feasability) || compareTimePlanActivityKind(j1.kind, j2.kind);
  });
}

// ../core/jupiter/core/time_plans/sub/activity/component/card.tsx
var import_webapi_client4 = __toESM(require_dist(), 1);

// ../core/jupiter/core/time_plans/sub/activity/component/feasability-tag.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
function TimePlanActivityFeasabilityTag(props) {
  return /* @__PURE__ */ jsxDEV(
    SlimChip,
    {
      label: timePlanActivityFeasabilityName(props.feasability),
      color: feasabilityToColor(props.feasability)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/time_plans/sub/activity/component/feasability-tag.tsx",
      lineNumber: 14,
      columnNumber: 5
    },
    this
  );
}
function feasabilityToColor(props) {
  switch (props) {
    case import_webapi_client2.TimePlanActivityFeasability.MUST_DO:
      return "success";
    case import_webapi_client2.TimePlanActivityFeasability.NICE_TO_HAVE:
      return "warning";
    case import_webapi_client2.TimePlanActivityFeasability.STRETCH:
      return "info";
  }
}

// ../core/jupiter/core/time_plans/sub/activity/component/kind-tag.tsx
var import_webapi_client3 = __toESM(require_dist(), 1);
function TimePlanActivityKindTag(props) {
  return /* @__PURE__ */ jsxDEV(
    SlimChip,
    {
      label: timePlanActivityKindName(props.kind),
      color: kindToColor(props.kind)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/time_plans/sub/activity/component/kind-tag.tsx",
      lineNumber: 12,
      columnNumber: 5
    },
    this
  );
}
function kindToColor(props) {
  switch (props) {
    case import_webapi_client3.TimePlanActivityKind.FINISH:
      return "success";
    case import_webapi_client3.TimePlanActivityKind.MAKE_PROGRESS:
      return "info";
  }
}

// ../core/jupiter/core/time_plans/component/tag.tsx
function TimePlanTag(props) {
  return /* @__PURE__ */ jsxDEV(
    SlimChip,
    {
      sx: { maxWidth: "unset" },
      label: props.timePlan.name,
      color: "info"
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/time_plans/component/tag.tsx",
      lineNumber: 11,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/time_plans/sub/activity/component/card.tsx
function TimePlanActivityCard(props) {
  const timePlan = props.timePlansByRefId.get(
    props.activity.time_plan_ref_id.toString()
  );
  if (isTimePlanActivityInboxTaskTarget(props.activity.target)) {
    const inboxTask = props.inboxTasksByRefId.get(
      entityLinkRefIdFromWire(props.activity.target)
    );
    const timeEvents = props.timeEventsByRefId.get(`it:${inboxTask.ref_id}`) ?? [];
    return /* @__PURE__ */ jsxDEV(
      EntityCard,
      {
        entityId: `time-plan-activity-${props.activity.ref_id}`,
        showAsArchived: props.activity.archived,
        allowSelect: props.allowSelect,
        selected: props.selected,
        indent: props.indent,
        onClick: props.onClick ? () => props.onClick && props.onClick(props.activity) : void 0,
        backgroundHint: props.activityDoneness[props.activity.ref_id] === import_webapi_client4.TimePlanActivityDoneness.DONE ? inboxTask?.status === import_webapi_client4.InboxTaskStatus.NOT_DONE ? "failure" : "success" : props.activityDoneness[props.activity.ref_id] === import_webapi_client4.TimePlanActivityDoneness.WORKING ? "warning" : "neutral",
        children: /* @__PURE__ */ jsxDEV(
          EntityLink,
          {
            to: `/app/workspace/time-plans/${props.activity.time_plan_ref_id}/${props.activity.ref_id}`,
            block: props.onClick !== void 0,
            children: [
              /* @__PURE__ */ jsxDEV(IsKeyTag, { isKey: inboxTask.is_key }, void 0, false, {
                fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                lineNumber: 86,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDEV(
                Typography_default,
                {
                  sx: {
                    fontWeight: inboxTask ? props.activityDoneness[props.activity.ref_id] === import_webapi_client4.TimePlanActivityDoneness.DONE ? "bold" : "normal" : "lighter"
                  },
                  children: props.showTimePlanName && timePlan ? timePlan.name : inboxTask ? inboxTask.name : "Archived Task"
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                  lineNumber: 87,
                  columnNumber: 11
                },
                this
              ),
              props.fullInfo && /* @__PURE__ */ jsxDEV(Fragment, { children: [
                inboxTask && /* @__PURE__ */ jsxDEV(InboxTaskStatusTag, { status: inboxTask.status }, void 0, false, {
                  fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                  lineNumber: 105,
                  columnNumber: 29
                }, this),
                inboxTask?.due_date && /* @__PURE__ */ jsxDEV(ADateTag, { label: "Due At", date: inboxTask.due_date }, void 0, false, {
                  fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                  lineNumber: 107,
                  columnNumber: 17
                }, this),
                timeEvents.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
                  "\u{1F4C5} ",
                  timeEvents.length,
                  " scheduled event",
                  timeEvents.length > 1 ? "s" : ""
                ] }, void 0, true, {
                  fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                  lineNumber: 111,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                lineNumber: 104,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(TimePlanActivityKindTag, { kind: props.activity.kind }, void 0, false, {
                fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                lineNumber: 119,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDEV(
                TimePlanActivityFeasabilityTag,
                {
                  feasability: props.activity.feasability
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                  lineNumber: 120,
                  columnNumber: 11
                },
                this
              ),
              timePlan && /* @__PURE__ */ jsxDEV(TimePlanTag, { timePlan }, void 0, false, {
                fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                lineNumber: 124,
                columnNumber: 24
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
            lineNumber: 82,
            columnNumber: 9
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
        lineNumber: 59,
        columnNumber: 7
      },
      this
    );
  } else if (isTimePlanActivityBigPlanTarget(props.activity.target) && isWorkspaceFeatureAvailable(
    props.topLevelInfo.workspace,
    import_webapi_client4.WorkspaceFeature.BIG_PLANS
  )) {
    const bigPlan = props.bigPlansByRefId.get(
      entityLinkRefIdFromWire(props.activity.target)
    );
    const timeEvents = props.timeEventsByRefId.get(`bp:${bigPlan.ref_id}`) ?? [];
    return /* @__PURE__ */ jsxDEV(
      EntityCard,
      {
        entityId: `time-plan-activity-${props.activity.ref_id}`,
        allowSelect: props.allowSelect,
        selected: props.selected,
        onClick: props.onClick ? () => props.onClick && props.onClick(props.activity) : void 0,
        backgroundHint: props.activityDoneness[props.activity.ref_id] === import_webapi_client4.TimePlanActivityDoneness.DONE ? bigPlan?.status === import_webapi_client4.BigPlanStatus.NOT_DONE ? "failure" : "success" : props.activityDoneness[props.activity.ref_id] === import_webapi_client4.TimePlanActivityDoneness.WORKING ? "warning" : "neutral",
        children: /* @__PURE__ */ jsxDEV(
          EntityLink,
          {
            to: `/app/workspace/time-plans/${props.activity.time_plan_ref_id}/${props.activity.ref_id}`,
            block: props.onClick !== void 0,
            children: [
              /* @__PURE__ */ jsxDEV(IsKeyTag, { isKey: bigPlan.is_key }, void 0, false, {
                fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                lineNumber: 166,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDEV(
                Typography_default,
                {
                  sx: {
                    fontWeight: bigPlan ? props.activityDoneness[props.activity.ref_id] === import_webapi_client4.TimePlanActivityDoneness.DONE ? "bold" : "normal" : "lighter"
                  },
                  children: props.showTimePlanName && timePlan ? timePlan.name : bigPlan ? bigPlan.name : "Archived Big Plan"
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                  lineNumber: 167,
                  columnNumber: 11
                },
                this
              ),
              props.fullInfo && /* @__PURE__ */ jsxDEV(Fragment, { children: [
                bigPlan && /* @__PURE__ */ jsxDEV(BigPlanStatusTag, { status: bigPlan.status }, void 0, false, {
                  fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                  lineNumber: 186,
                  columnNumber: 27
                }, this),
                bigPlan?.due_date && /* @__PURE__ */ jsxDEV(ADateTag, { label: "Due At", date: bigPlan.due_date }, void 0, false, {
                  fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                  lineNumber: 188,
                  columnNumber: 17
                }, this),
                timeEvents.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
                  "\u{1F4C5} ",
                  timeEvents.length,
                  " scheduled event",
                  timeEvents.length > 1 ? "s" : ""
                ] }, void 0, true, {
                  fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                  lineNumber: 192,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                lineNumber: 185,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(TimePlanActivityKindTag, { kind: props.activity.kind }, void 0, false, {
                fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                lineNumber: 200,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDEV(
                TimePlanActivityFeasabilityTag,
                {
                  feasability: props.activity.feasability
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                  lineNumber: 201,
                  columnNumber: 11
                },
                this
              ),
              timePlan && /* @__PURE__ */ jsxDEV(TimePlanTag, { timePlan }, void 0, false, {
                fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
                lineNumber: 205,
                columnNumber: 24
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
            lineNumber: 162,
            columnNumber: 9
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
        lineNumber: 141,
        columnNumber: 7
      },
      this
    );
  } else {
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/time_plans/sub/activity/component/card.tsx",
      lineNumber: 210,
      columnNumber: 12
    }, this);
  }
}

export {
  filterActivityByFeasabilityWithParents,
  filterActivitiesByTargetStatus,
  sortTimePlanActivitiesNaturally,
  TimePlanActivityCard
};
//# sourceMappingURL=/build/_shared/chunk-GNW7Z5U5.js.map
