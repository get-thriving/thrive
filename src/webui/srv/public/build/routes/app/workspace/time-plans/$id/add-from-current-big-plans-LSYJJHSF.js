import {
  BigPlanTimelineBigScreen,
  BigPlanTimelineSmallScreen
} from "/build/_shared/chunk-LWTJ5F7Z.js";
import {
  BigPlanStack
} from "/build/_shared/chunk-32S7BKKT.js";
import {
  bigPlanFindEntryToParent,
  sortBigPlansNaturally
} from "/build/_shared/chunk-K2HUSH5I.js";
import {
  computeAspectHierarchicalNameFromRoot,
  sortAspectsByTreeOrder
} from "/build/_shared/chunk-37FGSNWH.js";
import "/build/_shared/chunk-R6BBIENF.js";
import "/build/_shared/chunk-TD4OCNC5.js";
import {
  TimePlanActivitKindSelect,
  TimePlanActivityFeasabilitySelect
} from "/build/_shared/chunk-OIVO27JA.js";
import "/build/_shared/chunk-SLZ5UQVD.js";
import "/build/_shared/chunk-KB3ZBF4C.js";
import "/build/_shared/chunk-U5MVWZEK.js";
import "/build/_shared/chunk-HGSZOXV4.js";
import "/build/_shared/chunk-W6KI7GPI.js";
import "/build/_shared/chunk-P7WFXMQY.js";
import {
  isTimePlanActivityBigPlanTarget
} from "/build/_shared/chunk-ATIM3BG5.js";
import "/build/_shared/chunk-73QIECWH.js";
import "/build/_shared/chunk-DNXYZ7BB.js";
import "/build/_shared/chunk-NVWDLS2H.js";
import "/build/_shared/chunk-NBD44M5V.js";
import "/build/_shared/chunk-NLPUBZ3T.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionMultipleSpread,
  ActionSingle,
  FilterFewOptionsCompact,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
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
  entityLinkRefIdFromWire,
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Flare_default,
  ViewList_default,
  ViewTimeline_default,
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
  Fragment,
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

// app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx"
  );
  import.meta.hot.lastModified = "1777213342606.2173";
}
var View = /* @__PURE__ */ function(View2) {
  View2["LIST_MERGED"] = "list-merged";
  View2["LIST_BY_ASPECT"] = "list-by-aspect";
  View2["TIMELINE_MERGED"] = "timeline-merged";
  View2["TIMELINE_BY_ASPECT"] = "timeline-by-aspect";
  return View2;
}(View || {});
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var CommonParamsSchema = {
  targetBigPlanRefIds: external_exports.string().transform((s) => s === "" ? [] : s.split(",")),
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
function TimePlanAddFromCurrentBigPlans() {
  _s();
  const {
    id
  } = useParams();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle" && !loaderData.timePlan.archived;
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const alreadyIncludedBigPlanRefIds = new Set(loaderData.activities.filter((tpa) => isTimePlanActivityBigPlanTarget(tpa.target)).map((tpa) => entityLinkRefIdFromWire(tpa.target)));
  const [targetBigPlanRefIds, setTargetBigPlanRefIds] = (0, import_react2.useState)(/* @__PURE__ */ new Set());
  const sortedBigPlans = sortBigPlansNaturally(loaderData.bigPlans.map((e) => e.big_plan));
  const entriesByRefId = {};
  for (const entry of loaderData.bigPlans) {
    entriesByRefId[entry.big_plan.ref_id] = bigPlanFindEntryToParent(entry);
  }
  const sortedAspects = sortAspectsByTreeOrder(loaderData.allAspects || []);
  const allAspectsByRefId = new Map(loaderData.allAspects?.map((p) => [p.ref_id, p]));
  const bigPlanMilestonesByRefId = new Map(loaderData.bigPlans.map((bp) => [bp.big_plan.ref_id, bp.milestones || []]));
  const bigPlanStatsByRefId = new Map(loaderData.bigPlans.map((b) => [b.big_plan.ref_id, b.stats]));
  const thisYear = aDateToDate(loaderData.timePlan.right_now).startOf("year");
  const [selectedView, setSelectedView] = (0, import_react2.useState)(inferDefaultSelectedView(topLevelInfo.workspace));
  (0, import_react2.useEffect)(() => {
    setSelectedView(inferDefaultSelectedView(topLevelInfo.workspace));
  }, [topLevelInfo]);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `time-plan-${id}/add-from-current-big-plans`, returnLocation: `/app/workspace/time-plans/${id}`, returnLocationDiscriminator: "add-from-current-big-plans", inputsEnabled, initialExpansionState: "large" /* LARGE */, allowedExpansionStates: ["large" /* LARGE */, "full" /* FULL */], children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
      lineNumber: 203,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "time-plan-current-big-plans", title: "Current Big Plans", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "add-from-current-big-plans", topLevelInfo, inputsEnabled, actions: [ActionMultipleSpread({
      actions: [ActionSingle({
        text: "Add",
        value: "add",
        highlight: true
      }), ActionSingle({
        text: "Add And Override Dates",
        value: "add-and-override"
      })]
    }), FilterFewOptionsCompact("View", selectedView, [{
      value: View.LIST_MERGED,
      text: "List Merged",
      icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
        lineNumber: 217,
        columnNumber: 13
      }, this)
    }, {
      value: View.LIST_BY_ASPECT,
      text: "List By Aspect",
      icon: /* @__PURE__ */ jsxDEV(Flare_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
        lineNumber: 221,
        columnNumber: 13
      }, this),
      gatedOn: import_webapi_client.WorkspaceFeature.LIFE_PLAN
    }, {
      value: View.TIMELINE_MERGED,
      text: "Timeline Merged",
      icon: /* @__PURE__ */ jsxDEV(ViewTimeline_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
        lineNumber: 226,
        columnNumber: 13
      }, this)
    }, {
      value: View.TIMELINE_BY_ASPECT,
      text: "Timeline By Aspect",
      icon: /* @__PURE__ */ jsxDEV(ViewTimeline_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
        lineNumber: 230,
        columnNumber: 13
      }, this),
      gatedOn: import_webapi_client.WorkspaceFeature.LIFE_PLAN
    }], (selected) => setSelectedView(selected))] }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
      lineNumber: 205,
      columnNumber: 88
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: isBigScreen ? "row" : "column", children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "kind", children: "Kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
            lineNumber: 235,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivitKindSelect, { name: "kind", defaultValue: import_webapi_client.TimePlanActivityKind.FINISH, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
            lineNumber: 236,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
            lineNumber: 237,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
          lineNumber: 234,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "feasability", children: "Feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
            lineNumber: 241,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivityFeasabilitySelect, { name: "feasability", defaultValue: import_webapi_client.TimePlanActivityFeasability.NICE_TO_HAVE, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
            lineNumber: 242,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
            lineNumber: 243,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
          lineNumber: 240,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
        lineNumber: 233,
        columnNumber: 9
      }, this),
      selectedView === View.LIST_MERGED && /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: "All Big Plans", size: "large" }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
          lineNumber: 248,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(BigPlanList, { topLevelInfo, bigPlans: sortedBigPlans, alreadyIncludedBigPlanRefIds, targetBigPlanRefIds, bigPlansByRefId: entriesByRefId, onSelected: (it) => setTargetBigPlanRefIds((itri) => {
          if (alreadyIncludedBigPlanRefIds.has(it.ref_id)) {
            return itri;
          }
          return toggleBigPlanRefIds(itri, it.ref_id);
        }) }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
          lineNumber: 249,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
        lineNumber: 247,
        columnNumber: 47
      }, this),
      selectedView === View.LIST_BY_ASPECT && /* @__PURE__ */ jsxDEV(Fragment, { children: sortedAspects.map((p) => {
        const theBigPlans = sortedBigPlans.filter((se) => entriesByRefId[se.ref_id]?.aspect?.ref_id === p.ref_id);
        if (theBigPlans.length === 0) {
          return null;
        }
        const fullAspectName = computeAspectHierarchicalNameFromRoot(p, allAspectsByRefId);
        return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
            lineNumber: 265,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(BigPlanList, { topLevelInfo, bigPlans: theBigPlans, alreadyIncludedBigPlanRefIds, targetBigPlanRefIds, bigPlansByRefId: entriesByRefId, onSelected: (it) => setTargetBigPlanRefIds((itri) => {
            if (alreadyIncludedBigPlanRefIds.has(it.ref_id)) {
              return itri;
            }
            return toggleBigPlanRefIds(itri, it.ref_id);
          }) }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
            lineNumber: 267,
            columnNumber: 19
          }, this)
        ] }, `aspect-${p.ref_id}`, true, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
          lineNumber: 264,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
        lineNumber: 257,
        columnNumber: 50
      }, this),
      selectedView === View.TIMELINE_MERGED && /* @__PURE__ */ jsxDEV(BigPlanTimeline, { thisYear, timePlan: loaderData.timePlan, bigPlanStatsByRefId, bigPlanMilestonesByRefId, topLevelInfo, bigPlans: sortedBigPlans, alreadyIncludedBigPlanRefIds, targetBigPlanRefIds, onSelected: (it) => setTargetBigPlanRefIds((itri) => {
        if (alreadyIncludedBigPlanRefIds.has(it.ref_id)) {
          return itri;
        }
        return toggleBigPlanRefIds(itri, it.ref_id);
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
        lineNumber: 277,
        columnNumber: 51
      }, this),
      selectedView === View.TIMELINE_BY_ASPECT && /* @__PURE__ */ jsxDEV(Fragment, { children: sortedAspects.map((p) => {
        const theBigPlans = sortedBigPlans.filter((se) => entriesByRefId[se.ref_id]?.aspect?.ref_id === p.ref_id);
        if (theBigPlans.length === 0) {
          return null;
        }
        const fullAspectName = computeAspectHierarchicalNameFromRoot(p, allAspectsByRefId);
        return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
            lineNumber: 292,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(BigPlanTimeline, { thisYear, timePlan: loaderData.timePlan, topLevelInfo, bigPlans: theBigPlans, bigPlanMilestonesByRefId, bigPlanStatsByRefId, alreadyIncludedBigPlanRefIds, targetBigPlanRefIds, onSelected: (it) => setTargetBigPlanRefIds((itri) => {
            if (alreadyIncludedBigPlanRefIds.has(it.ref_id)) {
              return itri;
            }
            return toggleBigPlanRefIds(itri, it.ref_id);
          }) }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
            lineNumber: 294,
            columnNumber: 19
          }, this)
        ] }, `aspect-${p.ref_id}`, true, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
          lineNumber: 291,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
        lineNumber: 284,
        columnNumber: 54
      }, this),
      /* @__PURE__ */ jsxDEV("input", { name: "targetBigPlanRefIds", type: "hidden", value: Array.from(targetBigPlanRefIds).join(",") }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
        lineNumber: 304,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
      lineNumber: 205,
      columnNumber: 7
    }, this)
  ] }, `time-plan-${id}/add-from-current-big-plans`, true, {
    fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
    lineNumber: 202,
    columnNumber: 10
  }, this);
}
_s(TimePlanAddFromCurrentBigPlans, "Shq2OxtJ9aLxCFhx4kN5dHhdzTE=", false, function() {
  return [useParams, useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen];
});
_c = TimePlanAddFromCurrentBigPlans;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/time-plans/${params.id}`, ParamsSchema, {
  notFound: (params) => `Could not find time plan #${params.id}!`,
  error: (params) => `There was an error loading time plan #${params.id}! Please try again!`
});
_c3 = ErrorBoundary;
function BigPlanList(props) {
  return /* @__PURE__ */ jsxDEV(BigPlanStack, { topLevelInfo: props.topLevelInfo, bigPlans: props.bigPlans, selectedPredicate: (it) => props.alreadyIncludedBigPlanRefIds.has(it.ref_id) || props.targetBigPlanRefIds.has(it.ref_id), compact: true, allowSelect: true, showOptions: {
    showDonePct: true,
    showDueDate: true,
    showLifePlan: true
  }, onClick: (it) => {
    props.onSelected(it);
  } }, void 0, false, {
    fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
    lineNumber: 318,
    columnNumber: 10
  }, this);
}
_c4 = BigPlanList;
function BigPlanTimeline(props) {
  _s2();
  const isBigScreen = useBigScreen();
  if (isBigScreen) {
    return /* @__PURE__ */ jsxDEV(BigPlanTimelineBigScreen, { today: props.topLevelInfo.today, thisYear: props.thisYear, bigPlans: props.bigPlans, bigPlanMilestonesByRefId: props.bigPlanMilestonesByRefId, bigPlanStatsByRefId: props.bigPlanStatsByRefId, dateMarkers: [{
      date: props.timePlan.start_date,
      color: "red",
      label: "Start Date"
    }, {
      date: props.timePlan.end_date,
      color: "blue",
      label: "End Date"
    }], selectedPredicate: (it) => props.alreadyIncludedBigPlanRefIds.has(it.ref_id) || props.targetBigPlanRefIds.has(it.ref_id), allowSelect: true, onClick: (it) => {
      props.onSelected(it);
    } }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
      lineNumber: 331,
      columnNumber: 12
    }, this);
  } else {
    return /* @__PURE__ */ jsxDEV(BigPlanTimelineSmallScreen, { today: props.topLevelInfo.today, thisYear: props.thisYear, bigPlans: props.bigPlans, bigPlanMilestonesByRefId: props.bigPlanMilestonesByRefId, bigPlanStatsByRefId: props.bigPlanStatsByRefId, dateMarkers: [{
      date: props.timePlan.start_date,
      color: "red",
      label: "Start Date"
    }, {
      date: props.timePlan.end_date,
      color: "blue",
      label: "End Date"
    }], selectedPredicate: (it) => props.alreadyIncludedBigPlanRefIds.has(it.ref_id) || props.targetBigPlanRefIds.has(it.ref_id), allowSelect: true, onClick: (it) => {
      props.onSelected(it);
    } }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-current-big-plans.tsx",
      lineNumber: 343,
      columnNumber: 12
    }, this);
  }
}
_s2(BigPlanTimeline, "tSMcTumzNoEiop6dkXrv9elMvRg=", false, function() {
  return [useBigScreen];
});
_c5 = BigPlanTimeline;
function toggleBigPlanRefIds(bigPlanRefIds, newRefId) {
  if (bigPlanRefIds.has(newRefId)) {
    const newBigPlanRefIds = /* @__PURE__ */ new Set();
    for (const ri of bigPlanRefIds.values()) {
      if (ri === newRefId) {
        continue;
      }
      newBigPlanRefIds.add(ri);
    }
    return newBigPlanRefIds;
  } else {
    const newBigPlanRefIds = /* @__PURE__ */ new Set();
    for (const ri of bigPlanRefIds.values()) {
      newBigPlanRefIds.add(ri);
    }
    newBigPlanRefIds.add(newRefId);
    return newBigPlanRefIds;
  }
}
function inferDefaultSelectedView(workspace) {
  if (!isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN)) {
    return View.TIMELINE_MERGED;
  }
  return View.TIMELINE_BY_ASPECT;
}
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
$RefreshReg$(_c, "TimePlanAddFromCurrentBigPlans");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
$RefreshReg$(_c4, "BigPlanList");
$RefreshReg$(_c5, "BigPlanTimeline");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  TimePlanAddFromCurrentBigPlans as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/time-plans/$id/add-from-current-big-plans-LSYJJHSF.js.map
