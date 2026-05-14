import {
  CircleMultiSelect
} from "/build/_shared/chunk-R2CL3IG3.js";
import {
  RecurringTaskGenParamsBlock
} from "/build/_shared/chunk-WKUBLS6Z.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import {
  selectZod
} from "/build/_shared/chunk-HVVVLUYY.js";
import "/build/_shared/chunk-T6GSSEVE.js";
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
  useLoaderData,
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

// app/routes/app/workspace/prm/persons/new.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist2());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/prm/persons/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/prm/persons/new.tsx"
  );
  import.meta.hot.lastModified = "1777213342596.8408";
}
var ParamsSchema = external_exports.object({});
var CreateFormSchema = external_exports.object({
  name: external_exports.string(),
  circleRefIds: selectZod(external_exports.string()),
  catchUpPeriod: external_exports.string(),
  catchUpEisen: external_exports.nativeEnum(import_webapi_client.Eisen).optional(),
  catchUpDifficulty: external_exports.nativeEnum(import_webapi_client.Difficulty).optional(),
  catchUpActionableFromDay: external_exports.string().optional(),
  catchUpActionableFromMonth: external_exports.string().optional(),
  catchUpDueAtDay: external_exports.string().optional(),
  catchUpDueAtMonth: external_exports.string().optional()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewPerson() {
  _s();
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "persons/new", returnLocation: "/app/workspace/prm/persons", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/prm/persons/new.tsx",
      lineNumber: 119,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Person", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "person-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "person-create",
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/prm/persons/new.tsx",
      lineNumber: 120,
      columnNumber: 88
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/new.tsx",
          lineNumber: 127,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/new.tsx",
          lineNumber: 128,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/new.tsx",
          lineNumber: 129,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/prm/persons/new.tsx",
        lineNumber: 126,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(CircleMultiSelect, { name: "circleRefIds", label: "Circles", inputsEnabled, disabled: false, allCircles: loaderData.allCircles, defaultValue: [], maxSelections: loaderData.maxCirclesPerPerson }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/new.tsx",
          lineNumber: 133,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/circle_ref_ids" }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/new.tsx",
          lineNumber: 134,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/prm/persons/new.tsx",
        lineNumber: 132,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Catch Up", size: "small" }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/new.tsx",
        lineNumber: 137,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(RecurringTaskGenParamsBlock, { namePrefix: "catchUp", fieldsPrefix: "catch_up", allowNonePeriod: true, period: "none", eisen: null, difficulty: null, actionableFromDay: null, actionableFromMonth: null, dueAtDay: null, dueAtMonth: null, inputsEnabled, actionData }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/new.tsx",
        lineNumber: 139,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/prm/persons/new.tsx",
      lineNumber: 120,
      columnNumber: 7
    }, this)
  ] }, "persons/new", true, {
    fileName: "app/routes/app/workspace/prm/persons/new.tsx",
    lineNumber: 118,
    columnNumber: 10
  }, this);
}
_s(NewPerson, "vvmc/XfhzLJq0BqQ29BIiCdeQQM=", false, function() {
  return [useLoaderData, useActionData, useNavigation];
});
_c = NewPerson;
var ErrorBoundary = makeLeafErrorBoundary(`/app/workspace/prm/persons`, ParamsSchema, {
  error: () => `There was an error creating the person! Please try again!`
});
var _c;
$RefreshReg$(_c, "NewPerson");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewPerson as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/prm/persons/new-DZCKGSOB.js.map
