import {
  WorkspaceFeatureFlagsEditor
} from "/build/_shared/chunk-WIJDIBWU.js";
import "/build/_shared/chunk-W2LTCAXB.js";
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
  ToolPanel,
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
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
  getHosting
} from "/build/_shared/chunk-NLP5SXQ3.js";
import {
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import {
  GlobalPropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
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

// app/routes/app/workspace/settings.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/settings.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/settings.tsx"
  );
  import.meta.hot.lastModified = "1775685113113.0725";
}
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string()
}), external_exports.object({
  intent: external_exports.literal("change-feature-flags"),
  featureFlags: external_exports.array(external_exports.nativeEnum(import_webapi_client.WorkspaceFeature))
})]);
var handle = {
  displayType: 5 /* TOOL */
};
var shouldRevalidate = standardShouldRevalidate;
function Settings() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const globalProperties = (0, import_react2.useContext)(GlobalPropertiesContext);
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", children: /* @__PURE__ */ jsxDEV(ToolPanel, { children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { intent: "update", actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/settings.tsx",
      lineNumber: 118,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "general", title: "General", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "general-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/settings.tsx",
      lineNumber: 119,
      columnNumber: 60
    }, this), children: /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
      /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
        fileName: "app/routes/app/workspace/settings.tsx",
        lineNumber: 125,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, defaultValue: loaderData.workspace.name }, void 0, false, {
        fileName: "app/routes/app/workspace/settings.tsx",
        lineNumber: 126,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
        fileName: "app/routes/app/workspace/settings.tsx",
        lineNumber: 127,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/settings.tsx",
      lineNumber: 124,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/settings.tsx",
      lineNumber: 119,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(GlobalError, { intent: "change-feature-flags", actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/settings.tsx",
      lineNumber: 131,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "feature-flags", title: "Feature Flags", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "feature-flags-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Change Feature Flags",
      value: "change-feature-flags",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/settings.tsx",
      lineNumber: 132,
      columnNumber: 72
    }, this), children: /* @__PURE__ */ jsxDEV(WorkspaceFeatureFlagsEditor, { name: "featureFlags", inputsEnabled, featureFlagsControls: topLevelInfo.workspaceFeatureFlagControls, defaultFeatureFlags: loaderData.workspace.feature_flags, hosting: getHosting(globalProperties.universe) }, void 0, false, {
      fileName: "app/routes/app/workspace/settings.tsx",
      lineNumber: 137,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/settings.tsx",
      lineNumber: 132,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/settings.tsx",
    lineNumber: 117,
    columnNumber: 7
  }, this) }, "settings", false, {
    fileName: "app/routes/app/workspace/settings.tsx",
    lineNumber: 116,
    columnNumber: 10
  }, this);
}
_s(Settings, "kzrVGwakbyNW80g6pM8wYY5ax2g=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = Settings;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error updating the workspace! Please try again!`
});
var _c;
$RefreshReg$(_c, "Settings");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Settings as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/settings-2SMY54KL.js.map
