import {
  PeriodSelect
} from "/build/_shared/chunk-FBXWU6M6.js";
import "/build/_shared/chunk-HVU6TG3B.js";
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

// app/routes/app/workspace/journals/new.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/journals/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/journals/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113166.2397";
}
var ParamsSchema = external_exports.object({});
var QuerySchema = external_exports.object({
  initialToday: external_exports.string().optional(),
  initialPeriod: external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod).optional()
});
var CreateFormSchema = external_exports.object({
  rightNow: external_exports.string(),
  period: external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod)
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewJournal() {
  _s();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const [queryRaw] = useSearchParams();
  const inputsEnabled = navigation.state === "idle";
  const query = (0, import_zodix.parseQuery)(queryRaw, QuerySchema);
  const initialToday = query.initialToday || topLevelInfo.today;
  const initialPeriod = query.initialPeriod || import_webapi_client.RecurringTaskPeriod.WEEKLY;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `journals-${initialToday}-${initialPeriod}/new`, returnLocation: "/app/workspace/journals", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/journals/new.tsx",
      lineNumber: 86,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Journal", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "journal-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "journal-create",
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/journals/new.tsx",
      lineNumber: 87,
      columnNumber: 89
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "rightNow", shrink: true, margin: "dense", children: "The Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/journals/new.tsx",
          lineNumber: 94,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "rightNow", name: "rightNow", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultValue: initialToday }, void 0, false, {
          fileName: "app/routes/app/workspace/journals/new.tsx",
          lineNumber: 97,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/right_now" }, void 0, false, {
          fileName: "app/routes/app/workspace/journals/new.tsx",
          lineNumber: 99,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/journals/new.tsx",
        lineNumber: 93,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "period", children: "Period" }, void 0, false, {
          fileName: "app/routes/app/workspace/journals/new.tsx",
          lineNumber: 103,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(PeriodSelect, { labelId: "period", label: "Period", name: "period", inputsEnabled, defaultValue: initialPeriod }, void 0, false, {
          fileName: "app/routes/app/workspace/journals/new.tsx",
          lineNumber: 104,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/period" }, void 0, false, {
          fileName: "app/routes/app/workspace/journals/new.tsx",
          lineNumber: 105,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/journals/new.tsx",
        lineNumber: 102,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/journals/new.tsx",
      lineNumber: 87,
      columnNumber: 7
    }, this)
  ] }, "journals/new", true, {
    fileName: "app/routes/app/workspace/journals/new.tsx",
    lineNumber: 85,
    columnNumber: 10
  }, this);
}
_s(NewJournal, "HT0W2VjpOTtNkSec5yf+bUpSyvc=", false, function() {
  return [useActionData, useNavigation, useSearchParams];
});
_c = NewJournal;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/journals", ParamsSchema, {
  error: () => `There was an error creating the journal! Please try again!`
});
var _c;
$RefreshReg$(_c, "NewJournal");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewJournal as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/journals/new-SU4NXHYP.js.map
