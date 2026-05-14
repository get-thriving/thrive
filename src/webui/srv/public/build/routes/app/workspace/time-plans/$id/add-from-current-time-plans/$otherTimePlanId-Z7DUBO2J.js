import {
  TimePlanCard,
  TimePlanStack
} from "/build/_shared/chunk-BEBGHA6L.js";
import {
  timePlanAllowsInboxTasks
} from "/build/_shared/chunk-ZTWT66OL.js";
import "/build/_shared/chunk-R6BBIENF.js";
import "/build/_shared/chunk-TD4OCNC5.js";
import {
  TimePlanActivitKindSelect,
  TimePlanActivityFeasabilitySelect
} from "/build/_shared/chunk-OIVO27JA.js";
import "/build/_shared/chunk-HLPWZ3ZO.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import "/build/_shared/chunk-KB3ZBF4C.js";
import "/build/_shared/chunk-HGSZOXV4.js";
import {
  TimePlanActivityCard,
  filterActivitiesByTargetStatus,
  sortTimePlanActivitiesNaturally
} from "/build/_shared/chunk-GNW7Z5U5.js";
import "/build/_shared/chunk-W6KI7GPI.js";
import "/build/_shared/chunk-P7WFXMQY.js";
import {
  isTimePlanActivityInboxTaskTarget
} from "/build/_shared/chunk-ATIM3BG5.js";
import "/build/_shared/chunk-73QIECWH.js";
import "/build/_shared/chunk-5CBAK2HS.js";
import "/build/_shared/chunk-NVWDLS2H.js";
import "/build/_shared/chunk-4TWETDNJ.js";
import "/build/_shared/chunk-NBD44M5V.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionMultipleSpread,
  ActionSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  LeafPanel,
  makeLeafErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import {
  BIG_PLAN,
  entityLinkRefIdFromWire,
  parentLinkNamespaceFromEntityLinkWire
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  FormControl_default,
  FormLabel_default,
  Stack_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
import "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useActionData,
  useNavigation,
  useParams
} from "/build/_shared/chunk-VVGD4GL7.js";
import "/build/_shared/chunk-V5CWULKU.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import "/build/_shared/chunk-JFC3UFZQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import "/build/_shared/chunk-ZIPKILLR.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx"
  );
  import.meta.hot.lastModified = "1777213342607.0095";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string(),
  otherTimePlanId: external_exports.string()
});
var CommonParamsSchema = {
  targetActivitiesRefIds: external_exports.string().transform((s) => s === "" ? [] : s.split(",")),
  kind: external_exports.nativeEnum(import_webapi_client.TimePlanActivityKind),
  feasability: external_exports.nativeEnum(import_webapi_client.TimePlanActivityFeasability)
};
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("add"),
  ...CommonParamsSchema
}), external_exports.object({
  intent: external_exports.literal("add-and-override"),
  ...CommonParamsSchema
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function TimePlanAddFromCurrentTimePlans() {
  _s();
  const {
    id,
    otherTimePlanId
  } = useParams();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const inputsEnabled = navigation.state === "idle" && !loaderData.mainTimePlan.archived;
  const alreadyIncludedActivities = new Set(loaderData.otherActivities.filter((s) => loaderData.mainActivities.findIndex((r) => r.target === s.target) !== -1).map((tpa) => tpa.ref_id));
  const [targetActivitiesRefIds, setTargetActivitiesRefIds] = (0, import_react2.useState)(/* @__PURE__ */ new Set());
  const otherTargetInboxTasksByRefId = new Map(loaderData.otherTargetInboxTasks.map((it) => [it.ref_id, it]));
  const otherTargetBigPlansByRefId = new Map(loaderData.otherTargetBigPlans ? loaderData.otherTargetBigPlans.map((bp) => [bp.ref_id, bp]) : []);
  const otherTimeEventsByRefId = /* @__PURE__ */ new Map();
  for (const e of loaderData.otherTimeEventForInboxTasks) {
    otherTimeEventsByRefId.set(`it:${e.inbox_task.ref_id}`, e.time_events);
  }
  const filteredOtherActivities = filterActivitiesByTargetStatus(loaderData.otherActivities, otherTargetInboxTasksByRefId, otherTargetBigPlansByRefId, loaderData.otherActivityDoneness).filter((activity) => !isTimePlanActivityInboxTaskTarget(activity.target) || timePlanAllowsInboxTasks(loaderData.mainTimePlan));
  const sortedOtherActivities = sortTimePlanActivitiesNaturally(filteredOtherActivities, otherTargetInboxTasksByRefId);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `time-plan-${id}/add-from-current-time-plans-${otherTimePlanId}`, returnLocation: `/app/workspace/time-plans/${id}`, returnLocationDiscriminator: "add-from-current-time-plans", inputsEnabled, initialExpansionState: "large" /* LARGE */, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
      lineNumber: 217,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "time-plan-current-activities", title: "Current Activities", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "add-from-current-time-plans", topLevelInfo, inputsEnabled, actions: [ActionMultipleSpread({
      actions: [ActionSingle({
        text: "Add",
        value: "add",
        highlight: true
      }), ActionSingle({
        text: "Add And Override Dates",
        value: "add-and-override"
      })]
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
      lineNumber: 218,
      columnNumber: 90
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: isBigScreen ? "row" : "column", children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "kind", children: "Kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
            lineNumber: 230,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivitKindSelect, { name: "kind", defaultValue: import_webapi_client.TimePlanActivityKind.FINISH, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
            lineNumber: 231,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
            lineNumber: 232,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
          lineNumber: 229,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "feasability", children: "Feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
            lineNumber: 236,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivityFeasabilitySelect, { name: "feasability", defaultValue: import_webapi_client.TimePlanActivityFeasability.NICE_TO_HAVE, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
            lineNumber: 237,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
            lineNumber: 238,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
          lineNumber: 235,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
        lineNumber: 228,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Activities", size: "large" }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
        lineNumber: 242,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: sortedOtherActivities.map((activity) => /* @__PURE__ */ jsxDEV(TimePlanActivityCard, { topLevelInfo, activity, allowSelect: true, selected: alreadyIncludedActivities.has(activity.ref_id) || targetActivitiesRefIds.has(activity.ref_id), indent: isTimePlanActivityInboxTaskTarget(activity.target) && parentLinkNamespaceFromEntityLinkWire(otherTargetInboxTasksByRefId.get(entityLinkRefIdFromWire(activity.target)).owner) === BIG_PLAN ? 2 : 0, onClick: () => {
        if (alreadyIncludedActivities.has(activity.ref_id)) {
          return;
        }
        setTargetActivitiesRefIds((at) => toggleActivitiesRefIds(at, activity.ref_id));
      }, fullInfo: true, timePlansByRefId: /* @__PURE__ */ new Map(), inboxTasksByRefId: otherTargetInboxTasksByRefId, bigPlansByRefId: otherTargetBigPlansByRefId, activityDoneness: loaderData.otherActivityDoneness, timeEventsByRefId: otherTimeEventsByRefId }, `time-plan-activity-${activity.ref_id}`, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
        lineNumber: 245,
        columnNumber: 50
      }, this)) }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
        lineNumber: 244,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("input", { name: "targetActivitiesRefIds", type: "hidden", value: Array.from(targetActivitiesRefIds).join(",") }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
        lineNumber: 252,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
      lineNumber: 218,
      columnNumber: 7
    }, this),
    loaderData.otherHigherTimePlan && /* @__PURE__ */ jsxDEV(SectionCard, { id: "time-plan-higher-time-plan", title: "Higher Time Plan", children: /* @__PURE__ */ jsxDEV(TimePlanCard, { topLevelInfo, timePlan: loaderData.otherHigherTimePlan, relativeToTimePlan: loaderData.mainTimePlan, aspects: [], goals: [], chapters: [], showOptions: {
      showSource: true,
      showPeriod: true
    } }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
      lineNumber: 256,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
      lineNumber: 255,
      columnNumber: 42
    }, this),
    loaderData.otherPreviousTimePlan && /* @__PURE__ */ jsxDEV(SectionCard, { id: "time-plan-previous-time-plan", title: "Previous Time Plan", children: /* @__PURE__ */ jsxDEV(TimePlanCard, { topLevelInfo, timePlan: loaderData.otherPreviousTimePlan, relativeToTimePlan: loaderData.mainTimePlan, aspects: [], goals: [], chapters: [], showOptions: {
      showSource: true,
      showPeriod: true
    } }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
      lineNumber: 263,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
      lineNumber: 262,
      columnNumber: 44
    }, this),
    loaderData.otherHigherTimePlanSubTimePlans && /* @__PURE__ */ jsxDEV(SectionCard, { id: "time-plan-other-higher-time-plan", title: "Sub Time Plans", children: /* @__PURE__ */ jsxDEV(TimePlanStack, { topLevelInfo, timePlans: loaderData.otherHigherTimePlanSubTimePlans, relativeToTimePlan: loaderData.mainTimePlan }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
      lineNumber: 270,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
      lineNumber: 269,
      columnNumber: 54
    }, this)
  ] }, `time-plan-${id}/add-from-current-time-plans-${otherTimePlanId}`, true, {
    fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
    lineNumber: 216,
    columnNumber: 10
  }, this);
}
_s(TimePlanAddFromCurrentTimePlans, "9XpxDgVyzrJC9dSQPMwoZeMhW1E=", false, function() {
  return [useParams, useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen];
});
_c = TimePlanAddFromCurrentTimePlans;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/time-plans", ParamsSchema, {
  notFound: (params) => `Could not find time plan ${params.otherTimePlanId} to add to time plan ${params.id}!`,
  error: (params) => `There was an error loading time plan ${params.otherTimePlanId} to add to time plan ${params.id}! Please try again!`
});
function toggleActivitiesRefIds(ActivitiesRefIds, newRefId) {
  if (ActivitiesRefIds.has(newRefId)) {
    const newActivitiesRefIds = /* @__PURE__ */ new Set();
    for (const ri of ActivitiesRefIds.values()) {
      if (ri === newRefId) {
        continue;
      }
      newActivitiesRefIds.add(ri);
    }
    return newActivitiesRefIds;
  } else {
    const newActivitiesRefIds = /* @__PURE__ */ new Set();
    for (const ri of ActivitiesRefIds.values()) {
      newActivitiesRefIds.add(ri);
    }
    newActivitiesRefIds.add(newRefId);
    return newActivitiesRefIds;
  }
}
var _c;
$RefreshReg$(_c, "TimePlanAddFromCurrentTimePlans");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  TimePlanAddFromCurrentTimePlans as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/time-plans/$id/add-from-current-time-plans/$otherTimePlanId-Z7DUBO2J.js.map
