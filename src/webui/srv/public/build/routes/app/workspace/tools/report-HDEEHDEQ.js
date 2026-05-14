import {
  ShowReport
} from "/build/_shared/chunk-7YWL6DI3.js";
import "/build/_shared/chunk-OLMKSGLM.js";
import "/build/_shared/chunk-37FGSNWH.js";
import {
  PeriodSelect
} from "/build/_shared/chunk-FBXWU6M6.js";
import {
  oneLessThanPeriod
} from "/build/_shared/chunk-HVU6TG3B.js";
import "/build/_shared/chunk-HVHVJK66.js";
import "/build/_shared/chunk-VEYCIPLX.js";
import "/build/_shared/chunk-ZNIVMWFF.js";
import "/build/_shared/chunk-HGSZOXV4.js";
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
import "/build/_shared/chunk-LJCXIXWH.js";
import "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-72ELS2LF.js";
import "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  DateTime,
  ToolPanel,
  makeToolErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import {
  isNoErrorSomeData
} from "/build/_shared/chunk-MF4Q6G6N.js";
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

// app/routes/app/workspace/tools/report.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/tools/report.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/tools/report.tsx"
  );
  import.meta.hot.lastModified = "1775685113132.5486";
}
var QuerySchema = external_exports.object({
  today: external_exports.string().regex(/[0-9][0-9][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/).optional(),
  period: external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod).optional(),
  breakdownPeriod: external_exports.union([external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod), external_exports.literal("none")]).optional()
});
var handle = {
  displayType: 5 /* TOOL */
};
var shouldRevalidate = standardShouldRevalidate;
function Report() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const [period, setPeriod] = (0, import_react2.useState)(import_webapi_client.RecurringTaskPeriod.MONTHLY);
  const [breakdownPeriod, setBreakdownPeriod] = (0, import_react2.useState)(import_webapi_client.RecurringTaskPeriod.WEEKLY);
  const inputsEnabled = navigation.state === "idle";
  function handleChangePeriod(newPeriod) {
    if (newPeriod === "none") {
      return;
    }
    if (Array.isArray(newPeriod)) {
      newPeriod = newPeriod[0];
    }
    setPeriod(newPeriod);
    if (newPeriod === import_webapi_client.RecurringTaskPeriod.DAILY) {
      setBreakdownPeriod("none");
    } else {
      setBreakdownPeriod(oneLessThanPeriod(newPeriod));
    }
  }
  function handleChangeBreakdownPeriod(newPeriod) {
    if (Array.isArray(newPeriod)) {
      newPeriod = newPeriod[0];
    }
    setBreakdownPeriod(newPeriod);
  }
  return /* @__PURE__ */ jsxDEV(ToolPanel, { children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: loaderData }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/report.tsx",
      lineNumber: 121,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Report", method: "get", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "report-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Run Report",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/report.tsx",
      lineNumber: 123,
      columnNumber: 57
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "today", shrink: true, children: "Today" }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/report.tsx",
          lineNumber: 129,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "Today", name: "today", defaultValue: isNoErrorSomeData(loaderData) ? loaderData.data.report?.period_result.today ?? DateTime.local({
          zone: topLevelInfo.user.timezone
        }).toISODate() : DateTime.local({
          zone: topLevelInfo.user.timezone
        }).toISODate(), readOnly: !inputsEnabled, disabled: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/report.tsx",
          lineNumber: 132,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: loaderData, fieldName: "/today" }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/report.tsx",
          lineNumber: 138,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/tools/report.tsx",
        lineNumber: 128,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: isBigScreen ? "row" : "column", children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "period", children: "Period" }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/report.tsx",
            lineNumber: 143,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(PeriodSelect, { labelId: "period", label: "Period", name: "period", inputsEnabled, value: period, onChange: handleChangePeriod }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/report.tsx",
            lineNumber: 144,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: loaderData, fieldName: "/status" }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/report.tsx",
            lineNumber: 145,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/tools/report.tsx",
          lineNumber: 142,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "breakdownPeriod", children: "Breakdown Period" }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/report.tsx",
            lineNumber: 149,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(PeriodSelect, { labelId: "breakdownPeriod", label: "Breakdown Period", name: "breakdownPeriod", inputsEnabled, allowNonePeriod: true, value: breakdownPeriod, onChange: handleChangeBreakdownPeriod }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/report.tsx",
            lineNumber: 150,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: loaderData, fieldName: "/breakdown_period" }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/report.tsx",
            lineNumber: 151,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/tools/report.tsx",
          lineNumber: 148,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/tools/report.tsx",
        lineNumber: 141,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/tools/report.tsx",
      lineNumber: 123,
      columnNumber: 7
    }, this),
    isNoErrorSomeData(loaderData) && loaderData.data.allAspects !== void 0 && loaderData.data.report !== void 0 && /* @__PURE__ */ jsxDEV(ShowReport, { topLevelInfo, allAspects: loaderData.data.allAspects ?? [], allGoals: loaderData.data.allGoals ?? [], report: loaderData.data.report.period_result }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/report.tsx",
      lineNumber: 156,
      columnNumber: 125
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/tools/report.tsx",
    lineNumber: 120,
    columnNumber: 10
  }, this);
}
_s(Report, "7OcDhyLUKbCd3oqpBmzOFghIBV0=", false, function() {
  return [useLoaderDataSafeForAnimation, useNavigation, useBigScreen];
});
_c = Report;
var ErrorBoundary = makeToolErrorBoundary(_c2 = () => `There was an error running the report! Please try again!`);
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "Report");
$RefreshReg$(_c2, "ErrorBoundary$makeToolErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Report as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/tools/report-HDEEHDEQ.js.map
