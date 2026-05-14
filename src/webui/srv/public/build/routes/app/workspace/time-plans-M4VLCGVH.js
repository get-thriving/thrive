import {
  TimePlanCard,
  TimePlanStack
} from "/build/_shared/chunk-BEBGHA6L.js";
import {
  findTimePlansThatAreActive,
  sortTimePlansNaturally
} from "/build/_shared/chunk-ZTWT66OL.js";
import "/build/_shared/chunk-R6BBIENF.js";
import "/build/_shared/chunk-TD4OCNC5.js";
import "/build/_shared/chunk-HLPWZ3ZO.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import "/build/_shared/chunk-KB3ZBF4C.js";
import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import "/build/_shared/chunk-HGSZOXV4.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  FilterManyOptions,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Tune_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import {
  Button_default,
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
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Link,
  Outlet,
  useNavigation
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

// app/routes/app/workspace/time-plans.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_webapi_client2 = __toESM(require_dist());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/time-plans.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/time-plans.tsx"
  );
  import.meta.hot.lastModified = "1777213342604.672";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function TimePlans() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const activeTimePlans = findTimePlansThatAreActive(loaderData.entries.map((e) => e.time_plan), topLevelInfo.today);
  const yearTimePlan = activeTimePlans.find((tp) => tp.period === import_webapi_client.RecurringTaskPeriod.YEARLY);
  const quarterTimePlan = activeTimePlans.find((tp) => tp.period === import_webapi_client.RecurringTaskPeriod.QUARTERLY);
  const monthTimePlan = activeTimePlans.find((tp) => tp.period === import_webapi_client.RecurringTaskPeriod.MONTHLY);
  const weekTimePlan = activeTimePlans.find((tp) => tp.period === import_webapi_client.RecurringTaskPeriod.WEEKLY);
  const dayTimePlan = activeTimePlans.find((tp) => tp.period === import_webapi_client.RecurringTaskPeriod.DAILY);
  const sortedTimePlans = sortTimePlansNaturally(loaderData.entries.map((e) => e.time_plan));
  const entriesByRefId = /* @__PURE__ */ new Map();
  for (const entry of loaderData.entries) {
    entriesByRefId.set(entry.time_plan.ref_id, entry);
  }
  const timePlanTagsByTimePlanRefId = /* @__PURE__ */ new Map();
  for (const entry of loaderData.entries) {
    timePlanTagsByTimePlanRefId.set(entry.time_plan.ref_id, entry.tags ?? []);
  }
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const filteredSortedTimePlans = sortedTimePlans.filter((tp) => {
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    const entry = entriesByRefId.get(tp.ref_id);
    return entry?.tags?.some((tag) => selectedTagsRefId.includes(tag.ref_id)) ?? false;
  });
  const allAspectsByRefId = new Map(loaderData.allAspects?.map((p) => [p.ref_id, p]) ?? []);
  const allChaptersByRefId = new Map(loaderData.allChapters?.map((c) => [c.ref_id, c]) ?? []);
  const allGoalsByRefId = new Map(loaderData.allGoals?.map((g) => [g.ref_id, g]) ?? []);
  const timePlanAspectRefIds = /* @__PURE__ */ new Map();
  const timePlanGoalRefIds = /* @__PURE__ */ new Map();
  const timePlanChapterRefIds = /* @__PURE__ */ new Map();
  for (const entry of loaderData.entries) {
    timePlanAspectRefIds.set(entry.time_plan.ref_id, entry.aspect_ref_ids ?? []);
    timePlanGoalRefIds.set(entry.time_plan.ref_id, entry.goal_ref_ids ?? []);
    timePlanChapterRefIds.set(entry.time_plan.ref_id, entry.chapter_ref_ids ?? []);
  }
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/time-plans/new", returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "time-plans", topLevelInfo, inputsEnabled, actions: [NavSingle({
    text: "Settings",
    link: `/app/workspace/time-plans/settings`,
    icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans.tsx",
      lineNumber: 125,
      columnNumber: 11
    }, this)
  }), FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/time-plans.tsx",
    lineNumber: 122,
    columnNumber: 129
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { branchForceHide: shouldShowABranch, shouldHide: shouldShowABranch || shouldShowALeafToo, children: [
      filteredSortedTimePlans.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no time plans to show. You can create a new time plan.", newEntityLocations: "/app/workspace/time-plans/new", helpSubject: import_webapi_client2.DocsHelpSubject.TIME_PLANS }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans.tsx",
        lineNumber: 131,
        columnNumber: 50
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, children: [
        loaderData.timePlanSettings.periods.includes(import_webapi_client.RecurringTaskPeriod.YEARLY) && /* @__PURE__ */ jsxDEV(CurrentTimePlan, { today: topLevelInfo.today, period: import_webapi_client.RecurringTaskPeriod.YEARLY, topLevelInfo, timePlan: yearTimePlan, label: "Yearly Time Plan", tags: yearTimePlan ? timePlanTagsByTimePlanRefId.get(yearTimePlan.ref_id) ?? [] : [] }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans.tsx",
          lineNumber: 134,
          columnNumber: 88
        }, this),
        loaderData.timePlanSettings.periods.includes(import_webapi_client.RecurringTaskPeriod.QUARTERLY) && /* @__PURE__ */ jsxDEV(CurrentTimePlan, { today: topLevelInfo.today, period: import_webapi_client.RecurringTaskPeriod.QUARTERLY, topLevelInfo, timePlan: quarterTimePlan, label: "Quarterly Time Plan", tags: quarterTimePlan ? timePlanTagsByTimePlanRefId.get(quarterTimePlan.ref_id) ?? [] : [] }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans.tsx",
          lineNumber: 136,
          columnNumber: 91
        }, this),
        loaderData.timePlanSettings.periods.includes(import_webapi_client.RecurringTaskPeriod.MONTHLY) && /* @__PURE__ */ jsxDEV(CurrentTimePlan, { today: topLevelInfo.today, period: import_webapi_client.RecurringTaskPeriod.MONTHLY, topLevelInfo, timePlan: monthTimePlan, label: "Monthly Time Plan", tags: monthTimePlan ? timePlanTagsByTimePlanRefId.get(monthTimePlan.ref_id) ?? [] : [] }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans.tsx",
          lineNumber: 138,
          columnNumber: 89
        }, this),
        loaderData.timePlanSettings.periods.includes(import_webapi_client.RecurringTaskPeriod.WEEKLY) && /* @__PURE__ */ jsxDEV(CurrentTimePlan, { today: topLevelInfo.today, period: import_webapi_client.RecurringTaskPeriod.WEEKLY, topLevelInfo, timePlan: weekTimePlan, label: "Weekly Time Plan", tags: weekTimePlan ? timePlanTagsByTimePlanRefId.get(weekTimePlan.ref_id) ?? [] : [] }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans.tsx",
          lineNumber: 140,
          columnNumber: 88
        }, this),
        loaderData.timePlanSettings.periods.includes(import_webapi_client.RecurringTaskPeriod.DAILY) && /* @__PURE__ */ jsxDEV(CurrentTimePlan, { today: topLevelInfo.today, period: import_webapi_client.RecurringTaskPeriod.DAILY, topLevelInfo, timePlan: dayTimePlan, label: "Daily Time Plan", tags: dayTimePlan ? timePlanTagsByTimePlanRefId.get(dayTimePlan.ref_id) ?? [] : [] }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans.tsx",
          lineNumber: 142,
          columnNumber: 87
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans.tsx",
        lineNumber: 133,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(TimePlanStack, { id: "time-plans-all", label: "All Time Plans", topLevelInfo, timePlans: filteredSortedTimePlans, timePlanTagsByTimePlanRefId, timePlanAspectRefIds, timePlanGoalRefIds, timePlanChapterRefIds, allAspectsByRefId, allGoalsByRefId, allChaptersByRefId }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans.tsx",
        lineNumber: 145,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/time-plans.tsx",
      lineNumber: 130,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans.tsx",
      lineNumber: 149,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans.tsx",
      lineNumber: 148,
      columnNumber: 7
    }, this)
  ] }, "time-plans", true, {
    fileName: "app/routes/app/workspace/time-plans.tsx",
    lineNumber: 122,
    columnNumber: 10
  }, this);
}
_s(TimePlans, "66qwKakmVq0vBPXHw6xWuP2cy4g=", false, function() {
  return [useLoaderDataSafeForAnimation, useBigScreen, useNavigation, useTrunkNeedsToShowBranch, useTrunkNeedsToShowLeaf];
});
_c = TimePlans;
function CurrentTimePlan(props) {
  if (!props.timePlan) {
    return /* @__PURE__ */ jsxDEV(Button_default, { variant: "outlined", component: Link, to: `/app/workspace/time-plans/new?initialPeriod=${props.period}&initialRightNow=${props.today}`, children: [
      "Create a ",
      props.label
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/time-plans.tsx",
      lineNumber: 159,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(TimePlanCard, { topLevelInfo: props.topLevelInfo, timePlan: props.timePlan, tags: props.tags, aspects: [], goals: [], chapters: [], label: props.label, showOptions: {
    showSource: false,
    showPeriod: false
  } }, `time-plan-${props.timePlan.ref_id}`, false, {
    fileName: "app/routes/app/workspace/time-plans.tsx",
    lineNumber: 163,
    columnNumber: 10
  }, this);
}
_c2 = CurrentTimePlan;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the time plans! Please try again!`
});
var _c;
var _c2;
$RefreshReg$(_c, "TimePlans");
$RefreshReg$(_c2, "CurrentTimePlan");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  TimePlans as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/time-plans-M4VLCGVH.js.map
