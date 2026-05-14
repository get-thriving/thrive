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
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  DateTime,
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
  InputLabel_default,
  OutlinedInput_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_dist
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

// app/routes/app/workspace/metrics/$id/entries/new.tsx
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/metrics/$id/entries/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/metrics/$id/entries/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113116.0754";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var CreateFormSchema = external_exports.object({
  collectionTime: external_exports.string(),
  value: external_exports.string().transform(parseFloat)
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewMetricEntry() {
  _s();
  const {
    id
  } = useParams();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `metric-${id}/entries/new`, returnLocation: `/app/workspace/metrics/${loaderData.metric.ref_id}`, inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
      lineNumber: 104,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Metric Entry", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "metric-entry-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "metric-entry-create",
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
      lineNumber: 105,
      columnNumber: 94
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "collectionTime", shrink: true, children: "Collection Time" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
          lineNumber: 112,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "collectionTime", defaultValue: DateTime.local({
          zone: topLevelInfo.user.timezone
        }).toFormat("yyyy-MM-dd"), name: "collectionTime", readOnly: !inputsEnabled, disabled: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
          lineNumber: 115,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/collection_time" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
          lineNumber: 119,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
        lineNumber: 111,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "value", children: "Value" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
          lineNumber: 123,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "number", inputProps: {
          step: "any"
        }, label: "Value", name: "value", readOnly: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
          lineNumber: 124,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/value" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
          lineNumber: 127,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
        lineNumber: 122,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
      lineNumber: 105,
      columnNumber: 7
    }, this)
  ] }, `metric-${id}/entries/new`, true, {
    fileName: "app/routes/app/workspace/metrics/$id/entries/new.tsx",
    lineNumber: 103,
    columnNumber: 10
  }, this);
}
_s(NewMetricEntry, "+GP3CyRZKD6qlfz7THZY9lLfT78=", false, function() {
  return [useParams, useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = NewMetricEntry;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/metrics/${params.id}`, ParamsSchema, {
  error: () => `There was an error creating the metric entry! Please try again!`
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "NewMetricEntry");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewMetricEntry as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/metrics/$id/entries/new-K5EWODDQ.js.map
