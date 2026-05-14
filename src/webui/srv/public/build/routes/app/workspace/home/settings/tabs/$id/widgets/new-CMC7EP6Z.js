import {
  RowAndColSelector,
  WidgetDimensionSelector,
  WidgetTypeSelector
} from "/build/_shared/chunk-NIBH6Y7Q.js";
import "/build/_shared/chunk-4ZSHFYIG.js";
import "/build/_shared/chunk-IYE5HYO4.js";
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
  InputLabel_default
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

// app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113119.402";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var QuerySchema = external_exports.object({
  row: external_exports.coerce.number().optional(),
  col: external_exports.coerce.number().optional()
});
var CreateFormSchema = external_exports.object({
  type: external_exports.nativeEnum(import_webapi_client.WidgetType),
  dimension: external_exports.nativeEnum(import_webapi_client.WidgetDimension),
  widgetRow: external_exports.coerce.number(),
  widgetCol: external_exports.coerce.number()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewWidget() {
  _s();
  const {
    id
  } = useParams();
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const [searchParams] = useSearchParams();
  const [query, setQuery] = (0, import_react2.useState)((0, import_zodix.parseQuery)(searchParams, QuerySchema));
  const [theType, setTheType] = (0, import_react2.useState)(import_webapi_client.WidgetType.MOTD);
  (0, import_react2.useEffect)(() => {
    setQuery((0, import_zodix.parseQuery)(searchParams, QuerySchema));
  }, [searchParams]);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `home/settings/tabs/${id}/widgets/new`, returnLocation: `/app/workspace/home/settings/tabs/${id}`, inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
      lineNumber: 121,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Widget", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "widget-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "widget-create",
      text: "Create",
      value: "create",
      disabled: !inputsEnabled,
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
      lineNumber: 122,
      columnNumber: 88
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "type", children: "Type" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
          lineNumber: 130,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(WidgetTypeSelector, { user: topLevelInfo.user, workspace: topLevelInfo.workspace, name: "type", inputsEnabled, value: theType, onChange: (type) => setTheType(type), target: loaderData.tab.target, widgetConstraints: loaderData.widgetConstraints }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
          lineNumber: 131,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/type" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
          lineNumber: 132,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
        lineNumber: 129,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, disabled: true, children: /* @__PURE__ */ jsxDEV(RowAndColSelector, { namePrefix: "widget", target: loaderData.tab.target, homeTab: loaderData.tab, widgets: loaderData.widgets, row: query.row ?? 0, col: query.col ?? 0, inputsEnabled }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
        lineNumber: 136,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
        lineNumber: 135,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dimension", children: "Dimension" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
          lineNumber: 140,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(WidgetDimensionSelector, { name: "dimension", inputsEnabled, defaultValue: loaderData.widgetConstraints[theType].allowed_dimensions[loaderData.tab.target][0], target: loaderData.tab.target, widgetType: theType, widgetConstraints: loaderData.widgetConstraints }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
          lineNumber: 141,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
        lineNumber: 139,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
      lineNumber: 122,
      columnNumber: 7
    }, this)
  ] }, "home-tab-widgets/new", true, {
    fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/new.tsx",
    lineNumber: 120,
    columnNumber: 10
  }, this);
}
_s(NewWidget, "Fc5gDMsdiS9+v8gBh5mIpmP+S6U=", false, function() {
  return [useParams, useLoaderData, useActionData, useNavigation, useSearchParams];
});
_c = NewWidget;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/home/settings", ParamsSchema, {
  notFound: () => `Could not find the tab!`,
  error: () => `There was an error creating the widget! Please try again!`
});
var _c;
$RefreshReg$(_c, "NewWidget");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewWidget as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/home/settings/tabs/$id/widgets/new-CMC7EP6Z.js.map
