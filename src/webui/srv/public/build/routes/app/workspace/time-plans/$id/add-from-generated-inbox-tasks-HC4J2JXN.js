import {
  TimePlanActivitKindSelect,
  TimePlanActivityFeasabilitySelect
} from "/build/_shared/chunk-OIVO27JA.js";
import {
  PeriodSelect
} from "/build/_shared/chunk-FBXWU6M6.js";
import {
  allHigherPeriods
} from "/build/_shared/chunk-HVU6TG3B.js";
import {
  selectZod
} from "/build/_shared/chunk-HVVVLUYY.js";
import {
  actionableTimeToDateTime
} from "/build/_shared/chunk-GKFPZ6TR.js";
import {
  InboxTaskCard
} from "/build/_shared/chunk-YVDLHOTH.js";
import "/build/_shared/chunk-ZNIVMWFF.js";
import "/build/_shared/chunk-BOZSZ6DZ.js";
import "/build/_shared/chunk-Q4OQDEZG.js";
import "/build/_shared/chunk-U5MVWZEK.js";
import "/build/_shared/chunk-HGSZOXV4.js";
import {
  isTimePlanActivityInboxTaskTarget
} from "/build/_shared/chunk-ATIM3BG5.js";
import "/build/_shared/chunk-73QIECWH.js";
import {
  filterInboxTasksForDisplay,
  inboxTaskFindEntryToParent,
  sortInboxTasksByEisenAndDifficulty
} from "/build/_shared/chunk-RTB3GZDR.js";
import "/build/_shared/chunk-DNXYZ7BB.js";
import "/build/_shared/chunk-5CBAK2HS.js";
import "/build/_shared/chunk-NVWDLS2H.js";
import "/build/_shared/chunk-4TWETDNJ.js";
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
  entityLinkRefIdFromWire
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
  InputLabel_default,
  OutlinedInput_default,
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
  useParams,
  useSearchParams
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

// app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx"
  );
  import.meta.hot.lastModified = "1777213342607.2285";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var QuerySchema = external_exports.object({
  showFromPeriod: external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod).optional()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("gen"),
  rightNow: external_exports.string(),
  period: selectZod(external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod))
}), external_exports.object({
  intent: external_exports.literal("add"),
  targetInboxTaskRefIds: external_exports.string().transform((s) => s === "" ? [] : s.split(",")),
  kind: external_exports.nativeEnum(import_webapi_client.TimePlanActivityKind),
  feasability: external_exports.nativeEnum(import_webapi_client.TimePlanActivityFeasability)
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function TimePlanAddFromCurrentInboxTasks() {
  _s();
  const {
    id
  } = useParams();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const [searchParams] = useSearchParams();
  const query = (0, import_zodix.parseQuery)(searchParams, QuerySchema);
  const inputsEnabled = navigation.state === "idle" && !loaderData.timePlan.archived;
  const alreadyIncludedInboxTaskRefIds = new Set(loaderData.activities.filter((tpa) => isTimePlanActivityInboxTaskTarget(tpa.target)).map((tpa) => entityLinkRefIdFromWire(tpa.target)));
  const [targetInboxTaskRefIds, setTargetInboxTaskRefIds] = (0, import_react2.useState)(/* @__PURE__ */ new Set());
  const [selectedPeriod, setSelectedPeriod] = (0, import_react2.useState)(query.showFromPeriod ? query.showFromPeriod : import_webapi_client.RecurringTaskPeriod.DAILY);
  const entriesByRefId = {};
  for (const entry of loaderData.inboxTasks) {
    entriesByRefId[entry.inbox_task.ref_id] = inboxTaskFindEntryToParent(entry);
  }
  const [selectedActionableTime, setSelectedActionableTime] = (0, import_react2.useState)("one-week" /* ONE_WEEK */);
  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(loaderData.inboxTasks.map((e) => e.inbox_task));
  const filteredInboxTasks = filterInboxTasksForDisplay(sortedInboxTasks, entriesByRefId, {}, {
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTimeToDateTime(selectedActionableTime, topLevelInfo.user.timezone),
    includeIfNoDueDate: true,
    allowPeriodsForRecurringTasks: allHigherPeriods(selectedPeriod)
  });
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `time-plan-${id}/add-from-generated-inbox-tasks`, returnLocation: `/app/workspace/time-plans/${id}`, returnLocationDiscriminator: "add-from-generated-inbox-tasks", inputsEnabled, initialExpansionState: "large" /* LARGE */, allowedExpansionStates: ["large" /* LARGE */, "full" /* FULL */], children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
      lineNumber: 182,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "time-plan-current-inbox-tasks", title: "Current Inbox Tasks", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "time-plan-add-from-current-big-plans", topLevelInfo, inputsEnabled, actions: [ActionMultipleSpread({
      actions: [ActionSingle({
        text: "Add",
        value: "add",
        highlight: true
      }), ActionSingle({
        text: "Gen",
        value: "gen"
      })]
    }), FilterFewOptionsCompact("Actionable", selectedActionableTime, [{
      value: "now" /* NOW */,
      text: "From Now"
    }, {
      value: "one-week" /* ONE_WEEK */,
      text: "One Week"
    }, {
      value: "one-month" /* ONE_MONTH */,
      text: "One Month"
    }], (selected) => setSelectedActionableTime(selected)), FilterFewOptionsCompact("From Period", selectedPeriod, [{
      value: import_webapi_client.RecurringTaskPeriod.DAILY,
      text: "From Daily"
    }, {
      value: import_webapi_client.RecurringTaskPeriod.WEEKLY,
      text: "From Weekly"
    }, {
      value: import_webapi_client.RecurringTaskPeriod.MONTHLY,
      text: "From Monthly"
    }, {
      value: import_webapi_client.RecurringTaskPeriod.QUARTERLY,
      text: "From Quarterly"
    }, {
      value: import_webapi_client.RecurringTaskPeriod.YEARLY,
      text: "From Yearly"
    }], (selected) => setSelectedPeriod(selected))] }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
      lineNumber: 183,
      columnNumber: 92
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: isBigScreen ? "row" : "column", children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "rightNow", shrink: true, children: "Generation Date" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
            lineNumber: 219,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "Generation Date", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultValue: loaderData.timePlan.start_date, name: "rightNow" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
            lineNumber: 222,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/rightNow" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
            lineNumber: 224,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
          lineNumber: 218,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(PeriodSelect, { labelId: "period", label: "Generation Period", name: "period", inputsEnabled, defaultValue: [loaderData.timePlan.period] }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
            lineNumber: 228,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/period" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
            lineNumber: 229,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
          lineNumber: 227,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
        lineNumber: 217,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: isBigScreen ? "row" : "column", children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "kind", children: "Kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
            lineNumber: 235,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivitKindSelect, { name: "kind", defaultValue: import_webapi_client.TimePlanActivityKind.FINISH, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
            lineNumber: 236,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
            lineNumber: 237,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
          lineNumber: 234,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "feasability", children: "Feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
            lineNumber: 241,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivityFeasabilitySelect, { name: "feasability", defaultValue: import_webapi_client.TimePlanActivityFeasability.MUST_DO, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
            lineNumber: 242,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
            lineNumber: 243,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
          lineNumber: 240,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
        lineNumber: 233,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "All Inbox Tasks", size: "large" }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
        lineNumber: 247,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(InboxTaskList, { topLevelInfo, inboxTasks: filteredInboxTasks, alreadyIncludedInboxTaskRefIds, targetInboxTaskRefIds, inboxTasksByRefId: entriesByRefId, onSelected: (it) => setTargetInboxTaskRefIds((itri) => toggleInboxTaskRefIds(itri, it.ref_id)) }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
        lineNumber: 248,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("input", { name: "targetInboxTaskRefIds", type: "hidden", value: Array.from(targetInboxTaskRefIds).join(",") }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
        lineNumber: 250,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
      lineNumber: 183,
      columnNumber: 7
    }, this)
  ] }, `time-plan-${id}/add-from-generated-inbox-tasks`, true, {
    fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
    lineNumber: 181,
    columnNumber: 10
  }, this);
}
_s(TimePlanAddFromCurrentInboxTasks, "Buv/GsvN3Pqo+Ub/CN51QL6RYY0=", false, function() {
  return [useParams, useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen, useSearchParams];
});
_c = TimePlanAddFromCurrentInboxTasks;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/time-plans/${params.id}`, ParamsSchema, {
  notFound: (params) => `Could not find time plan #${params.id}!`,
  error: (params) => `There was an error loading time plan #${params.id}! Please try again!`
});
_c3 = ErrorBoundary;
function InboxTaskList(props) {
  return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: props.inboxTasks.map((inboxTask) => /* @__PURE__ */ jsxDEV(InboxTaskCard, { topLevelInfo: props.topLevelInfo, inboxTask, allowSelect: true, selected: props.alreadyIncludedInboxTaskRefIds.has(inboxTask.ref_id) || props.targetInboxTaskRefIds.has(inboxTask.ref_id), showOptions: {
    showEisen: true,
    showDifficulty: true,
    showDueDate: true,
    showParent: true
  }, parent: props.inboxTasksByRefId[inboxTask.ref_id], onClick: (it) => {
    if (props.alreadyIncludedInboxTaskRefIds.has(inboxTask.ref_id)) {
      return;
    }
    props.onSelected(it);
  } }, `inbox-task-${inboxTask.ref_id}`, false, {
    fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
    lineNumber: 265,
    columnNumber: 42
  }, this)) }, void 0, false, {
    fileName: "app/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks.tsx",
    lineNumber: 264,
    columnNumber: 10
  }, this);
}
_c4 = InboxTaskList;
function toggleInboxTaskRefIds(inboxTaskRefIds, newRefId) {
  if (inboxTaskRefIds.has(newRefId)) {
    const newInboxTaskRefIds = /* @__PURE__ */ new Set();
    for (const ri of inboxTaskRefIds.values()) {
      if (ri === newRefId) {
        continue;
      }
      newInboxTaskRefIds.add(ri);
    }
    return newInboxTaskRefIds;
  } else {
    const newInboxTaskRefIds = /* @__PURE__ */ new Set();
    for (const ri of inboxTaskRefIds.values()) {
      newInboxTaskRefIds.add(ri);
    }
    newInboxTaskRefIds.add(newRefId);
    return newInboxTaskRefIds;
  }
}
var _c;
var _c2;
var _c3;
var _c4;
$RefreshReg$(_c, "TimePlanAddFromCurrentInboxTasks");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
$RefreshReg$(_c4, "InboxTaskList");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  TimePlanAddFromCurrentInboxTasks as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/time-plans/$id/add-from-generated-inbox-tasks-HC4J2JXN.js.map
