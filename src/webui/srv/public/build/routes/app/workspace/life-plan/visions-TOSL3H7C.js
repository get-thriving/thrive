import {
  sortVisionsNaturally
} from "/build/_shared/chunk-4HGT4W3H.js";
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
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-X6MG2JXZ.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  LeafPanel,
  makeBranchErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Add_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
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

// app/routes/app/workspace/life-plan/visions.tsx
var import_webapi_client3 = __toESM(require_dist());
var import_node = __toESM(require_node());

// ../core/jupiter/core/life_plan/sub/visions/components/status-tag.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);

// ../core/jupiter/core/life_plan/sub/visions/status.ts
var import_webapi_client = __toESM(require_dist(), 1);
function visionStatusLabel(status) {
  switch (status) {
    case import_webapi_client.VisionStatus.ACTIVE:
      return "Active";
    case import_webapi_client.VisionStatus.DRAFT:
      return "Draft";
    case import_webapi_client.VisionStatus.OLD:
      return "Old";
  }
}

// ../core/jupiter/core/life_plan/sub/visions/components/status-tag.tsx
function VisionStatusTag({ visionStatus }) {
  const tagName = visionStatusLabel(visionStatus);
  const tagClass = visionStatusColor(visionStatus);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: tagName, color: tagClass }, void 0, false, {
    fileName: "../core/jupiter/core/life_plan/sub/visions/components/status-tag.tsx",
    lineNumber: 13,
    columnNumber: 10
  }, this);
}
function visionStatusColor(status) {
  switch (status) {
    case import_webapi_client2.VisionStatus.ACTIVE:
      return "success";
    case import_webapi_client2.VisionStatus.DRAFT:
      return "warning";
    case import_webapi_client2.VisionStatus.OLD:
      return "default";
  }
}

// app/routes/app/workspace/life-plan/visions.tsx
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/life-plan/visions.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/life-plan/visions.tsx"
  );
  import.meta.hot.lastModified = "1775685113120.266";
}
var handle = {
  displayType: 3 /* LEAF */
};
var ParamsSchema = external_exports.object({});
var shouldRevalidate = () => {
  return true;
};
function Visions() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const sortedEntries = sortVisionsNaturally(loaderData.entries.map((entry) => entry.vision));
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "visions", returnLocation: "/app/workspace/life-plan", shouldShowALeaflet, inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf || shouldShowALeaflet, children: /* @__PURE__ */ jsxDEV(SectionCard, { title: "Visions", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "visions", topLevelInfo, inputsEnabled, actions: [NavSingle({
      id: "new-vision",
      text: "New Vision",
      link: `/app/workspace/life-plan/visions/new-draft`,
      icon: /* @__PURE__ */ jsxDEV(Add_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/visions.tsx",
        lineNumber: 77,
        columnNumber: 15
      }, this)
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/visions.tsx",
      lineNumber: 73,
      columnNumber: 47
    }, this), children: [
      sortedEntries.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no visions to show. You can create a new vision draft.", newEntityLocations: "/app/workspace/life-plan/visions/new-draft", helpSubject: import_webapi_client3.DocsHelpSubject.LIFE_PLAN_VISIONS }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/visions.tsx",
        lineNumber: 79,
        columnNumber: 42
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: sortedEntries.map((entry) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `vision-${entry.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/life-plan/visions/${entry.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(VisionStatusTag, { visionStatus: entry.status }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/visions.tsx",
          lineNumber: 84,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: entry.name }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/visions.tsx",
          lineNumber: 85,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/visions.tsx",
        lineNumber: 83,
        columnNumber: 17
      }, this) }, `vision-${entry.ref_id}`, false, {
        fileName: "app/routes/app/workspace/life-plan/visions.tsx",
        lineNumber: 82,
        columnNumber: 41
      }, this)) }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/visions.tsx",
        lineNumber: 81,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/life-plan/visions.tsx",
      lineNumber: 73,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/visions.tsx",
      lineNumber: 72,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/visions.tsx",
      lineNumber: 93,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/visions.tsx",
      lineNumber: 92,
      columnNumber: 7
    }, this)
  ] }, "visions", true, {
    fileName: "app/routes/app/workspace/life-plan/visions.tsx",
    lineNumber: 71,
    columnNumber: 10
  }, this);
}
_s(Visions, "8MYI1XJm51qGIuYj1VPVybeER40=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowLeaf, useLeafNeedsToShowLeaflet, useNavigation];
});
_c = Visions;
var ErrorBoundary = makeBranchErrorBoundary("/app/workspace/life-plan", ParamsSchema, {
  error: () => `There was an error loading the visions! Please try again!`
});
var _c;
$RefreshReg$(_c, "Visions");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Visions as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/life-plan/visions-TOSL3H7C.js.map
