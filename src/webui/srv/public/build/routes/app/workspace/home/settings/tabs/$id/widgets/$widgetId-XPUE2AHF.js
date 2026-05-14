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

// app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx"
  );
  import.meta.hot.lastModified = "1775685113118.8909";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string(),
  widgetId: external_exports.string()
});
var QuerySchema = external_exports.object({
  row: external_exports.coerce.number().optional(),
  col: external_exports.coerce.number().optional()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  widgetRow: external_exports.coerce.number(),
  widgetCol: external_exports.coerce.number(),
  widgetDimension: external_exports.nativeEnum(import_webapi_client.WidgetDimension)
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function Widget() {
  _s();
  const {
    id
  } = useParams();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const [searchParams] = useSearchParams();
  const [query, setQuery] = (0, import_react2.useState)((0, import_zodix.parseQuery)(searchParams, QuerySchema));
  (0, import_react2.useEffect)(() => {
    setQuery((0, import_zodix.parseQuery)(searchParams, QuerySchema));
  }, [searchParams]);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.HOME_WIDGET, entityRefId: loaderData.widget.ref_id, fakeKey: `home/settings/tabs/${id}/widgets/${loaderData.widget.ref_id}`, returnLocation: `/app/workspace/home/settings/tabs/${id}`, inputsEnabled, showArchiveAndRemoveButton: true, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
      lineNumber: 151,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Widget Settings", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "widget-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "widget-update",
      text: "Update",
      value: "update",
      disabled: !inputsEnabled,
      highlight: false
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
      lineNumber: 152,
      columnNumber: 53
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, disabled: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "type", children: "Type" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
          lineNumber: 160,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(WidgetTypeSelector, { user: topLevelInfo.user, workspace: topLevelInfo.workspace, name: "type", inputsEnabled: false, defaultValue: loaderData.widget.the_type, target: loaderData.tab.target, widgetConstraints: loaderData.widgetConstraints }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
          lineNumber: 161,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
        lineNumber: 159,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, disabled: true, children: [
        /* @__PURE__ */ jsxDEV(RowAndColSelector, { namePrefix: "widget", target: loaderData.tab.target, homeTab: loaderData.tab, widgets: loaderData.widgets, row: query.row ?? loaderData.widget.geometry.row, col: query.col ?? loaderData.widget.geometry.col, inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
          lineNumber: 165,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/row" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
          lineNumber: 166,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/col" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
          lineNumber: 167,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
        lineNumber: 164,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, disabled: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dimension", children: "Dimension" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
          lineNumber: 171,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(WidgetDimensionSelector, { name: "widgetDimension", inputsEnabled, defaultValue: loaderData.widget.geometry.dimension, target: loaderData.tab.target, widgetType: loaderData.widget.the_type, widgetConstraints: loaderData.widgetConstraints }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
          lineNumber: 172,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/dimension" }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
          lineNumber: 173,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
        lineNumber: 170,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
      lineNumber: 152,
      columnNumber: 7
    }, this)
  ] }, `home-tab-widgets-${loaderData.widget.ref_id}`, true, {
    fileName: "app/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId.tsx",
    lineNumber: 150,
    columnNumber: 10
  }, this);
}
_s(Widget, "h1Cq+DWW9tKXGDzcU0N7mcT8C+M=", false, function() {
  return [useParams, useLoaderDataSafeForAnimation, useActionData, useNavigation, useSearchParams];
});
_c = Widget;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/home/settings", ParamsSchema, {
  notFound: () => `Could not find the widget!`,
  error: () => `There was an error managing the widget! Please try again!`
});
var _c;
$RefreshReg$(_c, "Widget");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Widget as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/home/settings/tabs/$id/widgets/$widgetId-XPUE2AHF.js.map
