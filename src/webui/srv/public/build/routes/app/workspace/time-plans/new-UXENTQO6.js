import {
  ChapterMultiSelect,
  GoalMultiSelect
} from "/build/_shared/chunk-SF7PQNWV.js";
import {
  AspectMultiSelect
} from "/build/_shared/chunk-T2AVEGZU.js";
import "/build/_shared/chunk-OLMKSGLM.js";
import "/build/_shared/chunk-ZFN6H2GY.js";
import {
  lifePlanBirthdayDate
} from "/build/_shared/chunk-HQECWRQJ.js";
import "/build/_shared/chunk-WCBSHJX3.js";
import "/build/_shared/chunk-37FGSNWH.js";
import {
  PeriodSelect
} from "/build/_shared/chunk-FBXWU6M6.js";
import "/build/_shared/chunk-IRHCW4HP.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import {
  selectZod
} from "/build/_shared/chunk-HVVVLUYY.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
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
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  FormControl_default,
  FormLabel_default,
  InputLabel_default,
  OutlinedInput_default
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

// app/routes/app/workspace/time-plans/new.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/time-plans/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/time-plans/new.tsx"
  );
  import.meta.hot.lastModified = "1777213342612.1052";
}
var ParamsSchema = external_exports.object({});
var QuerySchema = external_exports.object({
  initialToday: external_exports.string().optional(),
  initialPeriod: external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod).optional()
});
var CreateFormSchema = external_exports.object({
  rightNow: external_exports.string(),
  period: external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod),
  aspectRefIds: selectZod(external_exports.string()),
  chapterRefIds: selectZod(external_exports.string()),
  goalRefIds: selectZod(external_exports.string())
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewTimePlan() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const actionData = useActionData();
  const [queryRaw] = useSearchParams();
  const inputsEnabled = navigation.state === "idle";
  const query = (0, import_zodix.parseQuery)(queryRaw, QuerySchema);
  const initialToday = query.initialToday || topLevelInfo.today;
  const initialPeriod = query.initialPeriod || import_webapi_client.RecurringTaskPeriod.WEEKLY;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `time-plans-${initialToday}-${initialPeriod}/new`, returnLocation: "/app/workspace/time-plans", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/new.tsx",
      lineNumber: 120,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Properties", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "time-plan-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "time-plan-create",
      text: "Create",
      value: "create",
      disabled: !inputsEnabled,
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/new.tsx",
      lineNumber: 121,
      columnNumber: 88
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "rightNow", shrink: true, margin: "dense", children: "The Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 129,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "rightNow", name: "rightNow", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultValue: initialToday }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 132,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/rightNow" }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 134,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/new.tsx",
        lineNumber: 128,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "period", children: "Period" }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 138,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(PeriodSelect, { labelId: "period", label: "Period", name: "period", inputsEnabled, defaultValue: initialPeriod }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 139,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/period" }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 140,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/new.tsx",
        lineNumber: 137,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(AspectMultiSelect, { name: "aspectRefIds", label: "Aspect", inputsEnabled, disabled: false, allAspects: loaderData.allAspects ?? [], maxSelections: loaderData.lifePlan.time_plan_max_life_plan_links, defaultValue: void 0 }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 144,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/aspectRefIds" }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 145,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/new.tsx",
        lineNumber: 143,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(ChapterMultiSelect, { name: "chapterRefIds", label: "Chapter", inputsEnabled, disabled: false, allChapters: loaderData.allChapters ?? [], maxSelections: loaderData.lifePlan.time_plan_max_life_plan_links, defaultValue: void 0, birthday: lifePlanBirthdayDate(loaderData.lifePlan), today: aDateToDate(topLevelInfo.today), allMilestones: loaderData.allMilestones ?? [], allAspects: loaderData.allAspects ?? [] }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 149,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/chapterRefIds" }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 150,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/new.tsx",
        lineNumber: 148,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(GoalMultiSelect, { name: "goalRefIds", label: "Goal", inputsEnabled, disabled: false, allGoals: loaderData.allGoals ?? [], maxSelections: loaderData.lifePlan.time_plan_max_life_plan_links, defaultValue: void 0 }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 154,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/goalRefIds" }, void 0, false, {
          fileName: "app/routes/app/workspace/time-plans/new.tsx",
          lineNumber: 155,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/new.tsx",
        lineNumber: 153,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/time-plans/new.tsx",
      lineNumber: 121,
      columnNumber: 7
    }, this)
  ] }, "time-plans/new", true, {
    fileName: "app/routes/app/workspace/time-plans/new.tsx",
    lineNumber: 119,
    columnNumber: 10
  }, this);
}
_s(NewTimePlan, "0X56/UZ+YRXRvNr/MDxBaeaaHpU=", false, function() {
  return [useLoaderDataSafeForAnimation, useNavigation, useActionData, useSearchParams];
});
_c = NewTimePlan;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/time-plans", ParamsSchema, {
  error: () => `There was an error creating the time plan! Please try again!`
});
var _c;
$RefreshReg$(_c, "NewTimePlan");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewTimePlan as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/time-plans/new-UXENTQO6.js.map
