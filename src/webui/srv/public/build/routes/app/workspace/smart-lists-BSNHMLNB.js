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

// app/routes/app/workspace/smart-lists.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/smart-lists.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/smart-lists.tsx"
  );
  import.meta.hot.lastModified = "1777213342602.2153";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function SmartLists() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const smartListTagsBySmartListRefId = /* @__PURE__ */ new Map();
  for (const entry of loaderData.entries) {
    smartListTagsBySmartListRefId.set(entry.smart_list.ref_id, entry.tags ?? []);
  }
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const filteredEntries = loaderData.entries.filter((entry) => {
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    const tags = smartListTagsBySmartListRefId.get(entry.smart_list.ref_id) ?? [];
    return tags.some((tag) => selectedTagsRefId.includes(tag.ref_id));
  });
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/smart-lists/new", returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "smart-lists", topLevelInfo, inputsEnabled: true, actions: [FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/smart-lists.tsx",
    lineNumber: 83,
    columnNumber: 131
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { branchForceHide: shouldShowABranch, shouldHide: shouldShowABranch || shouldShowALeafToo, children: /* @__PURE__ */ jsxDEV(EntityStack, { children: [
      filteredEntries.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no smart lists to show. You can create a new smart list.", newEntityLocations: "/app/workspace/smart-lists/new", helpSubject: import_webapi_client.DocsHelpSubject.SMART_LISTS }, void 0, false, {
        fileName: "app/routes/app/workspace/smart-lists.tsx",
        lineNumber: 89,
        columnNumber: 44
      }, this),
      filteredEntries.map((entry) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `smart-list-${entry.smart_list.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/smart-lists/${entry.smart_list.ref_id}`, children: [
        entry.smart_list.icon && /* @__PURE__ */ jsxDEV(EntityIconComponent, { icon: entry.smart_list.icon }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists.tsx",
          lineNumber: 92,
          columnNumber: 43
        }, this),
        /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: entry.smart_list.name }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists.tsx",
          lineNumber: 93,
          columnNumber: 17
        }, this),
        entry.tags.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
          fileName: "app/routes/app/workspace/smart-lists.tsx",
          lineNumber: 94,
          columnNumber: 40
        }, this))
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/smart-lists.tsx",
        lineNumber: 91,
        columnNumber: 15
      }, this) }, `smart-list-${entry.smart_list.ref_id}`, false, {
        fileName: "app/routes/app/workspace/smart-lists.tsx",
        lineNumber: 90,
        columnNumber: 41
      }, this))
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/smart-lists.tsx",
      lineNumber: 88,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists.tsx",
      lineNumber: 87,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists.tsx",
      lineNumber: 101,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists.tsx",
      lineNumber: 100,
      columnNumber: 7
    }, this)
  ] }, "smart-lists", true, {
    fileName: "app/routes/app/workspace/smart-lists.tsx",
    lineNumber: 83,
    columnNumber: 10
  }, this);
}
_s(SmartLists, "0Sy1wbr2M6F51oORGZkPk3mWjiU=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowBranch, useTrunkNeedsToShowLeaf];
});
_c = SmartLists;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the smart lists! Please try again!`
});
var _c;
$RefreshReg$(_c, "SmartLists");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  SmartLists as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/smart-lists-BSNHMLNB.js.map
