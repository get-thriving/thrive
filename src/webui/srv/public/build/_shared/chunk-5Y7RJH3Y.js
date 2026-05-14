import {
  TimePlanActivityList
} from "/build/_shared/chunk-5FT37GVY.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/time_plans/component/list-merged-activities.tsx
var import_react = __toESM(require_react(), 1);
function TimePlanListMergedActivities(props) {
  const topLevelInfo = (0, import_react.useContext)(TopLevelInfoContext);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    props.mustDoActivities.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Must Do", size: "large" }, void 0, false, {
        fileName: "../core/jupiter/core/time_plans/component/list-merged-activities.tsx",
        lineNumber: 38,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(
        TimePlanActivityList,
        {
          topLevelInfo,
          activities: props.mustDoActivities,
          inboxTasksByRefId: props.targetInboxTasksByRefId,
          timePlansByRefId: /* @__PURE__ */ new Map(),
          bigPlansByRefId: props.targetBigPlansByRefId,
          activityDoneness: props.activityDoneness,
          fullInfo: true,
          filterKind: props.selectedKinds,
          filterFeasability: props.selectedFeasabilities,
          filterDoneness: props.selectedDoneness,
          timeEventsByRefId: props.timeEventsByRefId
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/time_plans/component/list-merged-activities.tsx",
          lineNumber: 40,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/time_plans/component/list-merged-activities.tsx",
      lineNumber: 37,
      columnNumber: 9
    }, this),
    props.niceToHaveActivities.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Nice To Have", size: "large" }, void 0, false, {
        fileName: "../core/jupiter/core/time_plans/component/list-merged-activities.tsx",
        lineNumber: 58,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(
        TimePlanActivityList,
        {
          topLevelInfo,
          activities: props.niceToHaveActivities,
          inboxTasksByRefId: props.targetInboxTasksByRefId,
          timePlansByRefId: /* @__PURE__ */ new Map(),
          bigPlansByRefId: props.targetBigPlansByRefId,
          activityDoneness: props.activityDoneness,
          fullInfo: true,
          filterKind: props.selectedKinds,
          filterFeasability: props.selectedFeasabilities,
          filterDoneness: props.selectedDoneness,
          timeEventsByRefId: props.timeEventsByRefId
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/time_plans/component/list-merged-activities.tsx",
          lineNumber: 60,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/time_plans/component/list-merged-activities.tsx",
      lineNumber: 57,
      columnNumber: 9
    }, this),
    props.stretchActivities.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Stretch", size: "large" }, void 0, false, {
        fileName: "../core/jupiter/core/time_plans/component/list-merged-activities.tsx",
        lineNumber: 78,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(
        TimePlanActivityList,
        {
          topLevelInfo,
          activities: props.stretchActivities,
          inboxTasksByRefId: props.targetInboxTasksByRefId,
          timePlansByRefId: /* @__PURE__ */ new Map(),
          bigPlansByRefId: props.targetBigPlansByRefId,
          activityDoneness: props.activityDoneness,
          fullInfo: true,
          filterKind: props.selectedKinds,
          filterFeasability: props.selectedFeasabilities,
          filterDoneness: props.selectedDoneness,
          timeEventsByRefId: props.timeEventsByRefId
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/time_plans/component/list-merged-activities.tsx",
          lineNumber: 80,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/time_plans/component/list-merged-activities.tsx",
      lineNumber: 77,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/time_plans/component/list-merged-activities.tsx",
    lineNumber: 35,
    columnNumber: 5
  }, this);
}

export {
  TimePlanListMergedActivities
};
//# sourceMappingURL=/build/_shared/chunk-5Y7RJH3Y.js.map
