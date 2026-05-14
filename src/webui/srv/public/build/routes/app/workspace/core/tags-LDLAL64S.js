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
import "/build/_shared/chunk-RTCBJPLQ.js";
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

// app/routes/app/workspace/core/tags.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/core/tags.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/core/tags.tsx"
  );
  import.meta.hot.lastModified = "1777213342585.5078";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function Tags() {
  _s();
  const {
    tags
  } = useLoaderDataSafeForAnimation();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const sortedTags = (0, import_react2.useMemo)(() => [...tags].sort((a, b) => a.name.localeCompare(b.name)), [tags]);
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/core/tags/new", returnLocation: "/app/workspace", actions: void 0, children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeafToo, children: [
      sortedTags.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "No Tags", message: "There are no tags to show. You can create a new tag.", newEntityLocations: "/app/workspace/core/tags/new", helpSubject: import_webapi_client.DocsHelpSubject.ROOT }, void 0, false, {
        fileName: "app/routes/app/workspace/core/tags.tsx",
        lineNumber: 62,
        columnNumber: 37
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: sortedTags.map((tag) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `tag-${tag.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/core/tags/${tag.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: `#${tag.name}` }, void 0, false, {
        fileName: "app/routes/app/workspace/core/tags.tsx",
        lineNumber: 67,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/core/tags.tsx",
        lineNumber: 66,
        columnNumber: 15
      }, this) }, `tag-${tag.ref_id}`, false, {
        fileName: "app/routes/app/workspace/core/tags.tsx",
        lineNumber: 65,
        columnNumber: 34
      }, this)) }, void 0, false, {
        fileName: "app/routes/app/workspace/core/tags.tsx",
        lineNumber: 64,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/core/tags.tsx",
      lineNumber: 61,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/core/tags.tsx",
      lineNumber: 74,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/core/tags.tsx",
      lineNumber: 73,
      columnNumber: 7
    }, this)
  ] }, "core/tags", true, {
    fileName: "app/routes/app/workspace/core/tags.tsx",
    lineNumber: 60,
    columnNumber: 10
  }, this);
}
_s(Tags, "/DAwBspI/vxkqd+FMVyIRrNI/Rc=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowLeaf];
});
_c = Tags;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the tags! Please try again!`
});
var _c;
$RefreshReg$(_c, "Tags");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Tags as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/core/tags-LDLAL64S.js.map
