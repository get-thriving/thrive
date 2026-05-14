import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  NavMultipleSpread,
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
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  GroupWork_default,
  Tune_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-QJ3XFSPL.js";
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

// app/routes/app/workspace/prm/circles.tsx
var import_node = __toESM(require_node());
var import_webapi_client = __toESM(require_dist());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/prm/circles.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/prm/circles.tsx"
  );
  import.meta.hot.lastModified = "1775685113169.3274";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function Circles() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/prm/circles/new", returnLocation: "/app/workspace/prm/persons", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "circles-actions", topLevelInfo, inputsEnabled: true, actions: [NavMultipleSpread({
    navs: [NavSingle({
      text: "Persons",
      link: `/app/workspace/prm/persons`,
      icon: /* @__PURE__ */ jsxDEV(GroupWork_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/prm/circles.tsx",
        lineNumber: 68,
        columnNumber: 13
      }, this)
    })]
  }), NavSingle({
    text: "Settings",
    link: `/app/workspace/prm/settings`,
    icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/prm/circles.tsx",
      lineNumber: 73,
      columnNumber: 11
    }, this)
  })] }, void 0, false, {
    fileName: "app/routes/app/workspace/prm/circles.tsx",
    lineNumber: 64,
    columnNumber: 143
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf || shouldShowALeaflet, children: /* @__PURE__ */ jsxDEV(EntityStack, { children: [
      loaderData.circles.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no circles to show. You can create a new circle.", newEntityLocations: "/app/workspace/prm/circles/new", helpSubject: import_webapi_client.DocsHelpSubject.PRM }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/circles.tsx",
        lineNumber: 77,
        columnNumber: 47
      }, this),
      loaderData.circles.map((circle) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `circle-${circle.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/prm/circles/${circle.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: circle.name }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/circles.tsx",
        lineNumber: 80,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/circles.tsx",
        lineNumber: 79,
        columnNumber: 15
      }, this) }, `circle-${circle.ref_id}`, false, {
        fileName: "app/routes/app/workspace/prm/circles.tsx",
        lineNumber: 78,
        columnNumber: 45
      }, this))
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/prm/circles.tsx",
      lineNumber: 76,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/prm/circles.tsx",
      lineNumber: 75,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/prm/circles.tsx",
      lineNumber: 87,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/prm/circles.tsx",
      lineNumber: 86,
      columnNumber: 7
    }, this)
  ] }, "prm/circles", true, {
    fileName: "app/routes/app/workspace/prm/circles.tsx",
    lineNumber: 64,
    columnNumber: 10
  }, this);
}
_s(Circles, "gIGJ76G9M5ArOnOqDOkHMetgLes=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowLeaf, useLeafNeedsToShowLeaflet];
});
_c = Circles;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace/prm/persons", {
  error: () => `There was an error loading the circles! Please try again!`
});
var _c;
$RefreshReg$(_c, "Circles");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Circles as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/prm/circles-NPU2YQXN.js.map
