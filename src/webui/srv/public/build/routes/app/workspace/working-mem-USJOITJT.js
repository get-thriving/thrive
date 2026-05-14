import {
  EntityNoteEditor
} from "/build/_shared/chunk-PDFSPG4I.js";
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
import "/build/_shared/chunk-Z3RPM676.js";
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
import "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Tune_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-FUGZILJZ.js";
import "/build/_shared/chunk-43PAR6MS.js";
import "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet,
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

// app/routes/app/workspace/working-mem.tsx
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/working-mem.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/working-mem.tsx"
  );
  import.meta.hot.lastModified = "1775685113173.25";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function WorkingMem() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const navigation = useNavigation();
  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "working-mem-actions", topLevelInfo, inputsEnabled, actions: [NavSingle({
    text: "Settings",
    link: "/app/workspace/working-mem/settings",
    icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/working-mem.tsx",
      lineNumber: 63,
      columnNumber: 11
    }, this)
  })] }, void 0, false, {
    fileName: "app/routes/app/workspace/working-mem.tsx",
    lineNumber: 60,
    columnNumber: 83
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { branchForceHide: shouldShowABranch, shouldHide: shouldShowABranch || shouldShowALeafToo, children: /* @__PURE__ */ jsxDEV(ToolPanel, { children: /* @__PURE__ */ jsxDEV(SectionCard, { title: "Working Mem", children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.entry.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/working-mem.tsx",
      lineNumber: 68,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/working-mem.tsx",
      lineNumber: 67,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/working-mem.tsx",
      lineNumber: 66,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/working-mem.tsx",
      lineNumber: 65,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/working-mem.tsx",
      lineNumber: 74,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/working-mem.tsx",
      lineNumber: 73,
      columnNumber: 7
    }, this)
  ] }, "working-mem", true, {
    fileName: "app/routes/app/workspace/working-mem.tsx",
    lineNumber: 60,
    columnNumber: 10
  }, this);
}
_s(WorkingMem, "zvGaPNVEErTJjcjtDZ1xAgFI/yY=", false, function() {
  return [useLoaderDataSafeForAnimation, useNavigation, useTrunkNeedsToShowBranch, useTrunkNeedsToShowLeaf];
});
_c = WorkingMem;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the working mem! Please try again!`
});
var _c;
$RefreshReg$(_c, "WorkingMem");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  WorkingMem as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/working-mem-USJOITJT.js.map
