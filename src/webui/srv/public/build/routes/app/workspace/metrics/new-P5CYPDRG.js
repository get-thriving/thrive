import {
  MetricDirectionSelect
} from "/build/_shared/chunk-KCYYLC34.js";
import {
  periodName
} from "/build/_shared/chunk-HVU6TG3B.js";
import {
  IconSelector
} from "/build/_shared/chunk-IU4ODRE6.js";
import {
  IsKeySelect
} from "/build/_shared/chunk-SWYHSSUT.js";
import {
  DifficultySelect,
  EisenhowerSelect
} from "/build/_shared/chunk-T6GSSEVE.js";
import "/build/_shared/chunk-NLPUBZ3T.js";
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
import "/build/_shared/chunk-Z3RPM676.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
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
  MenuItem_default,
  OutlinedInput_default,
  Select_default,
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

// app/routes/app/workspace/metrics/new.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/metrics/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/metrics/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113115.1187";
}
var ParamsSchema = external_exports.object({});
var CreateFormSchema = external_exports.object({
  name: external_exports.string(),
  isKey: import_zodix.CheckboxAsString,
  icon: external_exports.string().optional(),
  metricDirection: external_exports.nativeEnum(import_webapi_client.MetricDirection),
  collectionPeriod: external_exports.union([external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod), external_exports.literal("none")]),
  collectionEisen: external_exports.nativeEnum(import_webapi_client.Eisen).optional(),
  collectionDifficulty: external_exports.nativeEnum(import_webapi_client.Difficulty).optional(),
  collectionActionableFromDay: external_exports.string().optional(),
  collectionActionableFromMonth: external_exports.string().optional(),
  collectionDueAtDay: external_exports.string().optional(),
  collectionDueAtMonth: external_exports.string().optional()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewMetric() {
  _s();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const [showCollectionParams, setShowCollectionParams] = (0, import_react2.useState)(false);
  function handleChangeCollectionPeriod(event) {
    if (event.target.value === "none") {
      setShowCollectionParams(false);
    } else {
      setShowCollectionParams(true);
    }
  }
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "metrics/new", returnLocation: "/app/workspace/metrics", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/new.tsx",
      lineNumber: 107,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Metric", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "metric-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "metric-create",
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/new.tsx",
      lineNumber: 108,
      columnNumber: 88
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 2, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 3
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 118,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 119,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 120,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 115,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 1
        }, children: [
          /* @__PURE__ */ jsxDEV(IsKeySelect, { name: "isKey", defaultValue: false, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 126,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/is_key" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 127,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 123,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/new.tsx",
        lineNumber: 114,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "icon", children: "Icon" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 132,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(IconSelector, { readOnly: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 133,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/icon" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 134,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/new.tsx",
        lineNumber: 131,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "metricDirection", children: "Direction" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 138,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(MetricDirectionSelect, { name: "metricDirection", defaultValue: import_webapi_client.MetricDirection.NONE, inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 139,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/metric_direction" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 140,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/new.tsx",
        lineNumber: 137,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Collection", size: "large" }, void 0, false, {
        fileName: "app/routes/app/workspace/metrics/new.tsx",
        lineNumber: 143,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "collectionPeriod", children: "Collection Period" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 146,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Select_default, { labelId: "collectionPeriod", name: "collectionPeriod", readOnly: !inputsEnabled, onChange: handleChangeCollectionPeriod, defaultValue: "none", label: "Collection Period", children: [
          /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "none", children: "None" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 148,
            columnNumber: 13
          }, this),
          Object.values(import_webapi_client.RecurringTaskPeriod).map((period) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: period, children: periodName(period) }, period, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 149,
            columnNumber: 63
          }, this))
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 147,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/collection_period" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 153,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/new.tsx",
        lineNumber: 145,
        columnNumber: 9
      }, this),
      showCollectionParams && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "collectionEisen", children: "Eisenhower" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 158,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(EisenhowerSelect, { name: "collectionEisen", defaultValue: import_webapi_client.Eisen.REGULAR, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 159,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/collection_eisen" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 160,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 157,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "collectionDifficulty", children: "Difficulty" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 164,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(DifficultySelect, { name: "collectionDifficulty", defaultValue: import_webapi_client.Difficulty.EASY, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 165,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/collection_difficulty" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 166,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 163,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "collectionActionableFromDay", children: "Actionable From Day [Optional]" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 170,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "number", label: "Actionable From Day", name: "collectionActionableFromDay", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 173,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/collection_actionable_from_day" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 174,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 169,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "collectionActionableFromMonth", children: "Actionable From Month [Optional]" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 178,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "number", label: "Actionable From Month", name: "collectionActionableFromMonth", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 181,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/collection_actionable_from_month" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 182,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 177,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "collectionDueAtDay", children: "Due At Day [Optional]" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 186,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "number", label: "Due At Day", name: "collectionDueAtDay", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 189,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/collection_due_at_day" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 190,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 185,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "collectionDueAtMonth", children: "Due At Month [Optional]" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 194,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "number", label: "Due At Month", name: "collectionDueAtMonth", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 197,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/collection_due_at_month" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/new.tsx",
            lineNumber: 198,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/new.tsx",
          lineNumber: 193,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/new.tsx",
        lineNumber: 156,
        columnNumber: 34
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/metrics/new.tsx",
      lineNumber: 108,
      columnNumber: 7
    }, this)
  ] }, "metrics/new", true, {
    fileName: "app/routes/app/workspace/metrics/new.tsx",
    lineNumber: 106,
    columnNumber: 10
  }, this);
}
_s(NewMetric, "23IGmJLCEVa5f3aof/YNjuK8fIE=", false, function() {
  return [useActionData, useNavigation];
});
_c = NewMetric;
var ErrorBoundary = makeLeafErrorBoundary(`/app/workspace/metrics`, ParamsSchema, {
  error: () => `There was an error creating the metric! Please try again!`
});
var _c;
$RefreshReg$(_c, "NewMetric");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewMetric as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/metrics/new-P5CYPDRG.js.map
