import {
  ChapterTag,
  GoalTag
} from "/build/_shared/chunk-R6BBIENF.js";
import {
  AspectTag
} from "/build/_shared/chunk-TD4OCNC5.js";
import {
  PeriodTag
} from "/build/_shared/chunk-HLPWZ3ZO.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import {
  EntityStack2
} from "/build/_shared/chunk-3BC3B3FK.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/time_plans/source.ts
var import_webapi_client = __toESM(require_dist(), 1);
function timePlanSourceName(source) {
  switch (source) {
    case import_webapi_client.TimePlanSource.USER:
      return "User";
    case import_webapi_client.TimePlanSource.GENERATED:
      return "Recurring";
  }
}
function allowUserChanges(source) {
  return source === import_webapi_client.TimePlanSource.USER;
}

// ../core/jupiter/core/time_plans/component/source-tag.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
function TimePlanSourceTag({ source }) {
  const tagName = timePlanSourceName(source);
  const tagClass = sourceToClass(source);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: tagName, color: tagClass }, void 0, false, {
    fileName: "../core/jupiter/core/time_plans/component/source-tag.tsx",
    lineNumber: 13,
    columnNumber: 10
  }, this);
}
function sourceToClass(source) {
  switch (source) {
    case import_webapi_client2.TimePlanSource.USER:
      return "info";
    case import_webapi_client2.TimePlanSource.GENERATED:
      return "warning";
  }
}

// ../core/jupiter/core/time_plans/component/card.tsx
function TimePlanCard(props) {
  const timePlan = props.timePlan;
  const link = props.relativeToTimePlan !== void 0 ? `/app/workspace/time-plans/${props.relativeToTimePlan.ref_id}/add-from-current-time-plans/${timePlan.ref_id}` : `/app/workspace/time-plans/${timePlan.ref_id}`;
  return /* @__PURE__ */ jsxDEV(
    EntityCard,
    {
      entityId: `time-plan-${timePlan.ref_id}`,
      allowSwipe: props.allowSwipe,
      allowSelect: props.allowSelect,
      allowMarkNotDone: props.allowMarkNotDone,
      selected: props.selected,
      onClick: props.onClick ? () => props.onClick && props.onClick(timePlan) : void 0,
      onMarkNotDone: props.onMarkNotDone ? () => props.onMarkNotDone && props.onMarkNotDone(timePlan) : void 0,
      children: /* @__PURE__ */ jsxDEV(EntityLink, { to: link, block: props.onClick !== void 0, children: [
        /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: props.label ?? timePlan.name }, void 0, false, {
          fileName: "../core/jupiter/core/time_plans/component/card.tsx",
          lineNumber: 67,
          columnNumber: 9
        }, this),
        props.showOptions.showSource && /* @__PURE__ */ jsxDEV(TimePlanSourceTag, { source: timePlan.source }, void 0, false, {
          fileName: "../core/jupiter/core/time_plans/component/card.tsx",
          lineNumber: 69,
          columnNumber: 11
        }, this),
        props.showOptions.showPeriod && /* @__PURE__ */ jsxDEV(PeriodTag, { period: timePlan.period }, void 0, false, {
          fileName: "../core/jupiter/core/time_plans/component/card.tsx",
          lineNumber: 71,
          columnNumber: 42
        }, this),
        props.tags?.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
          fileName: "../core/jupiter/core/time_plans/component/card.tsx",
          lineNumber: 73,
          columnNumber: 11
        }, this)),
        props.aspects.map((aspect) => /* @__PURE__ */ jsxDEV(AspectTag, { aspect }, aspect.ref_id, false, {
          fileName: "../core/jupiter/core/time_plans/component/card.tsx",
          lineNumber: 76,
          columnNumber: 11
        }, this)),
        props.goals.map((goal) => /* @__PURE__ */ jsxDEV(GoalTag, { goal }, goal.ref_id, false, {
          fileName: "../core/jupiter/core/time_plans/component/card.tsx",
          lineNumber: 79,
          columnNumber: 11
        }, this)),
        props.chapters.map((chapter) => /* @__PURE__ */ jsxDEV(ChapterTag, { chapter }, chapter.ref_id, false, {
          fileName: "../core/jupiter/core/time_plans/component/card.tsx",
          lineNumber: 82,
          columnNumber: 11
        }, this))
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/time_plans/component/card.tsx",
        lineNumber: 66,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/time_plans/component/card.tsx",
      lineNumber: 49,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/time_plans/component/stack.tsx
function TimePlanStack(props) {
  return /* @__PURE__ */ jsxDEV(EntityStack2, { id: props.id, children: [
    props.label && /* @__PURE__ */ jsxDEV(StandardDivider, { title: props.label, size: "large" }, void 0, false, {
      fileName: "../core/jupiter/core/time_plans/component/stack.tsx",
      lineNumber: 39,
      columnNumber: 23
    }, this),
    props.timePlans.map((timePlan) => /* @__PURE__ */ jsxDEV(
      TimePlanCard,
      {
        topLevelInfo: props.topLevelInfo,
        timePlan,
        tags: props.timePlanTagsByTimePlanRefId?.get(timePlan.ref_id) ?? [],
        aspects: props.timePlanAspectRefIds?.get(timePlan.ref_id)?.map((refId) => props.allAspectsByRefId?.get(refId)).filter((aspect) => aspect !== void 0) ?? [],
        goals: props.timePlanGoalRefIds?.get(timePlan.ref_id)?.map((refId) => props.allGoalsByRefId?.get(refId)).filter((goal) => goal !== void 0) ?? [],
        chapters: props.timePlanChapterRefIds?.get(timePlan.ref_id)?.map((refId) => props.allChaptersByRefId?.get(refId)).filter((chapter) => chapter !== void 0) ?? [],
        showOptions: {
          showSource: true,
          showPeriod: true
        },
        allowSwipe: props.allowSwipe,
        allowSelect: props.allowSelect,
        allowMarkNotDone: props.allowMarkNotDone,
        selected: props.selectedPredicate?.(timePlan),
        onClick: props.onClick ? () => props.onClick && props.onClick(timePlan) : void 0,
        onMarkNotDone: props.onMarkNotDone ? () => props.onMarkNotDone && props.onMarkNotDone(timePlan) : void 0,
        relativeToTimePlan: props.relativeToTimePlan
      },
      `time-plan-${timePlan.ref_id}`,
      false,
      {
        fileName: "../core/jupiter/core/time_plans/component/stack.tsx",
        lineNumber: 42,
        columnNumber: 9
      },
      this
    ))
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/time_plans/component/stack.tsx",
    lineNumber: 38,
    columnNumber: 5
  }, this);
}

export {
  allowUserChanges,
  TimePlanCard,
  TimePlanStack
};
//# sourceMappingURL=/build/_shared/chunk-BEBGHA6L.js.map
