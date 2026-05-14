import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
import {
  EntityIconComponent
} from "/build/_shared/chunk-H4AFXAMV.js";
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
  IsKeyTag
} from "/build/_shared/chunk-NVWDLS2H.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  FilterManyOptions,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
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

// app/routes/app/workspace/metrics.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/metrics.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/metrics.tsx"
  );
  import.meta.hot.lastModified = "1777213342594.5647";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function Metrics() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const entriesFilteredByTag = loaderData.entries.filter((entry) => {
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    return entry.tags?.some((tag) => selectedTagsRefId.includes(tag.ref_id));
  });
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/metrics/new", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "metrics", topLevelInfo, inputsEnabled: true, actions: [FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/metrics.tsx",
    lineNumber: 80,
    columnNumber: 91
  }, this), returnLocation: "/app/workspace", children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { branchForceHide: shouldShowABranch, shouldHide: shouldShowABranch || shouldShowALeafToo, children: [
      loaderData.entries.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no metrics to show. You can create a new metric.", newEntityLocations: "/app/workspace/metrics/new", helpSubject: import_webapi_client.DocsHelpSubject.METRICS }, void 0, false, {
        fileName: "app/routes/app/workspace/metrics.tsx",
        lineNumber: 85,
        columnNumber: 45
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: entriesFilteredByTag.map((entry) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `metric-${entry.metric.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/metrics/${entry.metric.ref_id}`, children: [
        entry.metric.icon && /* @__PURE__ */ jsxDEV(EntityIconComponent, { icon: entry.metric.icon }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics.tsx",
          lineNumber: 89,
          columnNumber: 39
        }, this),
        /* @__PURE__ */ jsxDEV(IsKeyTag, { isKey: entry.metric.is_key }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics.tsx",
          lineNumber: 90,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: entry.metric.name }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics.tsx",
          lineNumber: 91,
          columnNumber: 17
        }, this),
        entry?.tags?.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
          fileName: "app/routes/app/workspace/metrics.tsx",
          lineNumber: 92,
          columnNumber: 42
        }, this))
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics.tsx",
        lineNumber: 88,
        columnNumber: 15
      }, this) }, entry.metric.ref_id, false, {
        fileName: "app/routes/app/workspace/metrics.tsx",
        lineNumber: 87,
        columnNumber: 46
      }, this)) }, void 0, false, {
        fileName: "app/routes/app/workspace/metrics.tsx",
        lineNumber: 86,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/metrics.tsx",
      lineNumber: 84,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/metrics.tsx",
      lineNumber: 99,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics.tsx",
      lineNumber: 98,
      columnNumber: 7
    }, this)
  ] }, "metrics", true, {
    fileName: "app/routes/app/workspace/metrics.tsx",
    lineNumber: 80,
    columnNumber: 10
  }, this);
}
_s(Metrics, "6395XivM/Le4ZdHy4cqh64zB5jQ=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowBranch, useTrunkNeedsToShowLeaf];
});
_c = Metrics;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the metrics! Please try again!`
});
var _c;
$RefreshReg$(_c, "Metrics");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Metrics as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/metrics-Z4JUR7TN.js.map
