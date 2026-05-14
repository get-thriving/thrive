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
  FormControlLabel_default,
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default,
  Switch_default
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

// app/routes/app/workspace/smart-lists/$id/new.tsx
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/smart-lists/$id/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/smart-lists/$id/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113179.24";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var CreateFormSchema = external_exports.object({
  name: external_exports.string(),
  isDone: import_zodix.CheckboxAsString,
  url: external_exports.string().transform((s) => s === "" ? void 0 : s).optional()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewSmartListItem() {
  _s();
  const {
    id
  } = useParams();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `smart-list-${id}/new`, returnLocation: `/app/workspace/smart-lists/${id}`, inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
      lineNumber: 105,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Smart List Item", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "smart-list-item-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "smart-list-item-create",
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
      lineNumber: 106,
      columnNumber: 97
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
          lineNumber: 113,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
          lineNumber: 114,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
          lineNumber: 116,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
        lineNumber: 112,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormControlLabel_default, { control: /* @__PURE__ */ jsxDEV(Switch_default, { name: "isDone", readOnly: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
          lineNumber: 120,
          columnNumber: 38
        }, this), label: "Is Done" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
          lineNumber: 120,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/is_done" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
          lineNumber: 121,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
        lineNumber: 119,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "url", children: "Url [Optional]" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
          lineNumber: 125,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Url", name: "url", readOnly: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
          lineNumber: 126,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/url" }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
          lineNumber: 127,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
        lineNumber: 124,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
      lineNumber: 106,
      columnNumber: 7
    }, this)
  ] }, `smart-list-${id}/new`, true, {
    fileName: "app/routes/app/workspace/smart-lists/$id/new.tsx",
    lineNumber: 104,
    columnNumber: 10
  }, this);
}
_s(NewSmartListItem, "jOI6j4gMYKrAA8gGQZpmudix2bM=", false, function() {
  return [useParams, useActionData, useNavigation];
});
_c = NewSmartListItem;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/smart-lists/${params.id}`, ParamsSchema, {
  notFound: () => `Could not find the smart list item!`,
  error: () => `There was an error creating the smart list item! Please try again!`
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "NewSmartListItem");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewSmartListItem as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/smart-lists/$id/new-MHIA34TF.js.map
