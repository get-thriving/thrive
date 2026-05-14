import {
  TimePlanStack
} from "/build/_shared/chunk-BEBGHA6L.js";
import {
  findTimePlansThatAreActive,
  sortTimePlansNaturally
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
import "/build/_shared/chunk-73QIECWH.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
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
import "/build/_shared/chunk-ZFIM7NDI.js";
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

// app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx"
  );
  import.meta.hot.lastModified = "1777213342609.8923";
}
var ParamsSchema = external_exports.object({});
var QuerySchema = external_exports.object({
  inboxTaskRefId: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("add"),
  targetTimePlanRefIds: external_exports.string().transform((s) => s === "" ? [] : s.split(",")),
  kind: external_exports.nativeEnum(import_webapi_client.TimePlanActivityKind),
  feasability: external_exports.nativeEnum(import_webapi_client.TimePlanActivityFeasability)
})]);
var handle = {
  displayType: 3 /* LEAF */
};
function AddInboxTaskToPlans() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const [searchParams] = useSearchParams();
  const inputsEnabled = navigation.state === "idle";
  const alreadyIncludedTimePlanRefIds = new Set(loaderData.timePlanActivities.map((tpa) => tpa.time_plan.ref_id));
  const [targetTimePlanRefIds, setTargetTimePlanRefIds] = (0, import_react2.useState)(/* @__PURE__ */ new Set());
  const activeTimePlans = sortTimePlansNaturally(findTimePlansThatAreActive(loaderData.timePlans.map((t) => t.time_plan), topLevelInfo.today));
  const allTimePlans = sortTimePlansNaturally(loaderData.timePlans.map((t) => t.time_plan));
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `add-inbox-task-to-plans/${searchParams.get("inboxTaskRefId")}`, returnLocation: `/app/workspace/core/inbox-tasks/${searchParams.get("inboxTaskRefId")}`, returnLocationDiscriminator: "add-inbox-task-to-plans", inputsEnabled, initialExpansionState: "medium" /* MEDIUM */, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
      lineNumber: 127,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "add-inbox-task-to-plans", title: "Add to Time Plans", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "add-inbox-task-to-plans", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Add",
      value: "add",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
      lineNumber: 129,
      columnNumber: 84
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: isBigScreen ? "row" : "column", children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "kind", children: "Kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
            lineNumber: 136,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivitKindSelect, { name: "kind", defaultValue: import_webapi_client.TimePlanActivityKind.FINISH, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
            lineNumber: 137,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
            lineNumber: 138,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
          lineNumber: 135,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "feasability", children: "Feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
            lineNumber: 142,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivityFeasabilitySelect, { name: "feasability", defaultValue: import_webapi_client.TimePlanActivityFeasability.MUST_DO, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
            lineNumber: 143,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
            lineNumber: 144,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
          lineNumber: 141,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
        lineNumber: 134,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(TimePlanStack, { id: "active-task-time-plans", label: "Active Time Plans", topLevelInfo, timePlans: activeTimePlans, allowSelect: true, selectedPredicate: (timePlan) => targetTimePlanRefIds.has(timePlan.ref_id) || alreadyIncludedTimePlanRefIds.has(timePlan.ref_id), onClick: (timePlan) => {
        if (alreadyIncludedTimePlanRefIds.has(timePlan.ref_id)) {
          return;
        }
        return setTargetTimePlanRefIds((tpri) => toggleTimePlanRefIds(tpri, timePlan.ref_id));
      } }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
        lineNumber: 148,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(TimePlanStack, { id: "all-time-plans", label: "All Time Plans", topLevelInfo, timePlans: allTimePlans, allowSelect: true, selectedPredicate: (timePlan) => targetTimePlanRefIds.has(timePlan.ref_id) || alreadyIncludedTimePlanRefIds.has(timePlan.ref_id), onClick: (timePlan) => {
        if (alreadyIncludedTimePlanRefIds.has(timePlan.ref_id)) {
          return;
        }
        return setTargetTimePlanRefIds((tpri) => toggleTimePlanRefIds(tpri, timePlan.ref_id));
      } }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
        lineNumber: 155,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("input", { name: "targetTimePlanRefIds", type: "hidden", value: Array.from(targetTimePlanRefIds).join(",") }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
        lineNumber: 162,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
      lineNumber: 129,
      columnNumber: 7
    }, this)
  ] }, "add-inbox-task-to-plans", true, {
    fileName: "app/routes/app/workspace/time-plans/add-inbox-task-to-plans.tsx",
    lineNumber: 126,
    columnNumber: 10
  }, this);
}
_s(AddInboxTaskToPlans, "xelVXcs1tJa4V7/14xSb6dwNdok=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen, useSearchParams];
});
_c = AddInboxTaskToPlans;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params, searchParams) => `/app/workspace/core/inbox-tasks/${searchParams.get("inboxTaskRefId")}`, ParamsSchema, {
  error: () => `There was an error adding the inbox task to time plans! Please try again!`
});
_c3 = ErrorBoundary;
function toggleTimePlanRefIds(timePlanRefIds, refId) {
  const newTimePlanRefIds = new Set(timePlanRefIds);
  if (newTimePlanRefIds.has(refId)) {
    newTimePlanRefIds.delete(refId);
  } else {
    newTimePlanRefIds.add(refId);
  }
  return newTimePlanRefIds;
}
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "AddInboxTaskToPlans");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  AddInboxTaskToPlans as default,
  handle
};
//# sourceMappingURL=/build/routes/app/workspace/time-plans/add-inbox-task-to-plans-S5RAR3VU.js.map
