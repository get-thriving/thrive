import {
  ScoreHistory
} from "/build/_shared/chunk-6SVYQ423.js";
import "/build/_shared/chunk-BPEDSDJA.js";
import {
  ScoreOverview
} from "/build/_shared/chunk-HVHVJK66.js";
import "/build/_shared/chunk-QROJZRQX.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import "/build/_shared/chunk-72ELS2LF.js";
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
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import "/build/_shared/chunk-VVGD4GL7.js";
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

// app/routes/app/workspace/gamification.tsx
var import_node = __toESM(require_node());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/gamification.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/gamification.tsx"
  );
  import.meta.hot.lastModified = "1775685113168.3901";
}
var handle = {
  displayType: 5 /* TOOL */
};
var shouldRevalidate = standardShouldRevalidate;
function Gamification() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", children: /* @__PURE__ */ jsxDEV(ToolPanel, { children: [
    loaderData.userScoreOverview && /* @__PURE__ */ jsxDEV(SectionCard, { title: "\u{1F4AA} Scores Overview", children: /* @__PURE__ */ jsxDEV(ScoreOverview, { scoreOverview: loaderData.userScoreOverview }, void 0, false, {
      fileName: "app/routes/app/workspace/gamification.tsx",
      lineNumber: 53,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/gamification.tsx",
      lineNumber: 52,
      columnNumber: 42
    }, this),
    loaderData.userScoreHistory && /* @__PURE__ */ jsxDEV(SectionCard, { title: "\u{1F4AA} Scores History", children: /* @__PURE__ */ jsxDEV(ScoreHistory, { scoreHistory: loaderData.userScoreHistory }, void 0, false, {
      fileName: "app/routes/app/workspace/gamification.tsx",
      lineNumber: 56,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/gamification.tsx",
      lineNumber: 55,
      columnNumber: 41
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/gamification.tsx",
    lineNumber: 51,
    columnNumber: 7
  }, this) }, "gamification", false, {
    fileName: "app/routes/app/workspace/gamification.tsx",
    lineNumber: 50,
    columnNumber: 10
  }, this);
}
_s(Gamification, "MvMC4LUymxJZy7exTW7uo3nZsgE=", false, function() {
  return [useLoaderDataSafeForAnimation];
});
_c = Gamification;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error displaying gamification information! Please try again!`
});
var _c;
$RefreshReg$(_c, "Gamification");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Gamification as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/gamification-FT3NICRV.js.map
