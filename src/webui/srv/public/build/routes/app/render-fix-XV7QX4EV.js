import {
  LifecyclePanel,
  Logo,
  StandaloneContainer
} from "/build/_shared/chunk-ABCRCQCW.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  CommunityLink,
  SmartAppBar,
  Title
} from "/build/_shared/chunk-UVXGDSKE.js";
import {
  DocsHelp
} from "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  EMPTY_CONTEXT
} from "/build/_shared/chunk-DQUBQ63X.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  Typography_default
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
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useLoaderData
} from "/build/_shared/chunk-VVGD4GL7.js";
import "/build/_shared/chunk-V5CWULKU.js";
import "/build/_shared/chunk-V6BBPW4V.js";
import "/build/_shared/chunk-JFC3UFZQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import "/build/_shared/chunk-ZIPKILLR.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/app/render-fix.tsx
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist2());
var import_webapi_client = __toESM(require_dist());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/render-fix.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/render-fix.tsx"
  );
  import.meta.hot.lastModified = "1775685113181.5005";
}
var QuerySchema = external_exports.object({
  returnTo: external_exports.string()
});
var handle = {
  displayType: 0 /* ROOT */
};
function RenderFix() {
  _s();
  const loaderData = useLoaderData();
  return /* @__PURE__ */ jsxDEV(StandaloneContainer, { children: [
    /* @__PURE__ */ jsxDEV(SmartAppBar, { children: [
      /* @__PURE__ */ jsxDEV(Logo, {}, void 0, false, {
        fileName: "app/routes/app/render-fix.tsx",
        lineNumber: 59,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Title, {}, void 0, false, {
        fileName: "app/routes/app/render-fix.tsx",
        lineNumber: 61,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(CommunityLink, {}, void 0, false, {
        fileName: "app/routes/app/render-fix.tsx",
        lineNumber: 63,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DocsHelp, { size: "medium", subject: import_webapi_client.DocsHelpSubject.ROOT }, void 0, false, {
        fileName: "app/routes/app/render-fix.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/render-fix.tsx",
      lineNumber: 58,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(LifecyclePanel, { children: /* @__PURE__ */ jsxDEV(SectionCard, { title: "Oops", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "render-fix", topLevelInfo: EMPTY_CONTEXT, inputsEnabled: true, actions: [NavSingle({
      text: "Return",
      link: loaderData.returnTo
    })] }, void 0, false, {
      fileName: "app/routes/app/render-fix.tsx",
      lineNumber: 69,
      columnNumber: 84
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Typography_default, { children: "There seems to have been some application error." }, void 0, false, {
        fileName: "app/routes/app/render-fix.tsx",
        lineNumber: 73,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Typography_default, { children: "We've recovered. Press the button below to return!" }, void 0, false, {
        fileName: "app/routes/app/render-fix.tsx",
        lineNumber: 77,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/render-fix.tsx",
      lineNumber: 69,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/render-fix.tsx",
      lineNumber: 68,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/render-fix.tsx",
    lineNumber: 57,
    columnNumber: 10
  }, this);
}
_s(RenderFix, "ceKF1Gd7W4lGV+M78eBsU+KQIkw=", false, function() {
  return [useLoaderData];
});
_c = RenderFix;
var _c;
$RefreshReg$(_c, "RenderFix");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  RenderFix as default,
  handle
};
//# sourceMappingURL=/build/routes/app/render-fix-XV7QX4EV.js.map
