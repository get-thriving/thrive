import {
  ApiKeyView
} from "/build/_shared/chunk-QM4LFN2K.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  ToolPanel,
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import {
  DocsHelp
} from "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  OpenInNew_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import {
  Button_default,
  Stack_default,
  Typography_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import {
  ServicePropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet
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

// app/routes/app/workspace/manage-api.tsx
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_webapi_client = __toESM(require_dist());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/manage-api.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/manage-api.tsx"
  );
  import.meta.hot.lastModified = "1775685113160.2964";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function ManageApi() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const serviceProperties = (0, import_react2.useContext)(ServicePropertiesContext);
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const apiDocsUrl = `${serviceProperties.apiUrl}/redoc`;
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf || shouldShowALeaflet, children: /* @__PURE__ */ jsxDEV(ToolPanel, { children: [
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "REST API", children: [
        /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: [
          "Use the REST API to integrate Thrive with your own applications and scripts. Create an API key below, and follow the instructions in the docs",
          " ",
          /* @__PURE__ */ jsxDEV(DocsHelp, { size: "small", subject: import_webapi_client.DocsHelpSubject.API }, void 0, false, {
            fileName: "app/routes/app/workspace/manage-api.tsx",
            lineNumber: 76,
            columnNumber: 15
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/manage-api.tsx",
          lineNumber: 72,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 2, sx: {
          mt: 1
        }, children: [
          /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body2", sx: {
            alignSelf: "center"
          }, children: [
            "API available at",
            " ",
            /* @__PURE__ */ jsxDEV(Typography_default, { component: "span", variant: "body2", sx: {
              fontFamily: "monospace"
            }, children: serviceProperties.apiUrl }, void 0, false, {
              fileName: "app/routes/app/workspace/manage-api.tsx",
              lineNumber: 85,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/manage-api.tsx",
            lineNumber: 81,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { variant: "outlined", size: "small", href: apiDocsUrl, target: "_blank", endIcon: /* @__PURE__ */ jsxDEV(OpenInNew_default, {}, void 0, false, {
            fileName: "app/routes/app/workspace/manage-api.tsx",
            lineNumber: 91,
            columnNumber: 98
          }, this), children: "API Documentation" }, void 0, false, {
            fileName: "app/routes/app/workspace/manage-api.tsx",
            lineNumber: 91,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/manage-api.tsx",
          lineNumber: 78,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/manage-api.tsx",
        lineNumber: 71,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "API Keys", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "api-keys-actions", topLevelInfo, inputsEnabled: true, actions: [NavSingle({
        text: "Add",
        link: "/app/workspace/manage-api/new",
        highlight: true
      })] }, void 0, false, {
        fileName: "app/routes/app/workspace/manage-api.tsx",
        lineNumber: 97,
        columnNumber: 50
      }, this), children: /* @__PURE__ */ jsxDEV(EntityStack, { children: loaderData.apiKeys.map((apiKey) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `api-key-${apiKey.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/manage-api/${apiKey.ref_id}`, children: /* @__PURE__ */ jsxDEV(ApiKeyView, { apiKey }, void 0, false, {
        fileName: "app/routes/app/workspace/manage-api.tsx",
        lineNumber: 105,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/manage-api.tsx",
        lineNumber: 104,
        columnNumber: 19
      }, this) }, `api-key-${apiKey.ref_id}`, false, {
        fileName: "app/routes/app/workspace/manage-api.tsx",
        lineNumber: 103,
        columnNumber: 49
      }, this)) }, void 0, false, {
        fileName: "app/routes/app/workspace/manage-api.tsx",
        lineNumber: 102,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/manage-api.tsx",
        lineNumber: 97,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/manage-api.tsx",
      lineNumber: 70,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/manage-api.tsx",
      lineNumber: 69,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/manage-api.tsx",
      lineNumber: 114,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/manage-api.tsx",
      lineNumber: 113,
      columnNumber: 7
    }, this)
  ] }, "manage-api", true, {
    fileName: "app/routes/app/workspace/manage-api.tsx",
    lineNumber: 68,
    columnNumber: 10
  }, this);
}
_s(ManageApi, "hZu8g1hhVC3Fph+EbkwSIRbDm7M=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowLeaf, useLeafNeedsToShowLeaflet];
});
_c = ManageApi;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the API keys! Please try again!`
});
var _c;
$RefreshReg$(_c, "ManageApi");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  ManageApi as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/manage-api-YGZRQYJA.js.map
