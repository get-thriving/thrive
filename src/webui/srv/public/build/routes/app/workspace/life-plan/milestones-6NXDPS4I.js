import {
  sortMilestonesNaturally
} from "/build/_shared/chunk-YDXQ3444.js";
import {
  AspectTag
} from "/build/_shared/chunk-TD4OCNC5.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
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
  basicShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  FilterManyOptions,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
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
  makeLeafErrorBoundary
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

// app/routes/app/workspace/life-plan/milestones.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/life-plan/milestones.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/life-plan/milestones.tsx"
  );
  import.meta.hot.lastModified = "1777213342593.1877";
}
var handle = {
  displayType: 3 /* LEAF */
};
var ParamsSchema = external_exports.object({});
var shouldRevalidate = basicShouldRevalidate;
function Milestones() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const allAspectsByRefId = new Map(loaderData.allAspects.map((aspect) => [aspect.ref_id, aspect]));
  const entriesByRefId = new Map(loaderData.entries.map((entry) => [entry.milestone.ref_id, entry]));
  const sortedMilestones = sortMilestonesNaturally(loaderData.entries.map((e) => e.milestone)).filter((milestone) => {
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    const entry = entriesByRefId.get(milestone.ref_id);
    return entry?.tags?.some((tag) => selectedTagsRefId.includes(tag.ref_id));
  });
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "life-plan-milestones", returnLocation: "/app/workspace/life-plan", shouldShowALeaflet, inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf || shouldShowALeaflet, children: /* @__PURE__ */ jsxDEV(SectionCard, { title: "Milestones", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "life-plan-milestones", topLevelInfo, inputsEnabled, actions: [NavSingle({
      text: "New Milestone",
      link: `/app/workspace/life-plan/milestones/new`,
      icon: /* @__PURE__ */ jsxDEV(Add_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
        lineNumber: 95,
        columnNumber: 15
      }, this),
      id: "new-milestone"
    }), FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
      value: tag.ref_id,
      text: tag.name
    })), setSelectedTagsRefId)] }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
      lineNumber: 92,
      columnNumber: 50
    }, this), children: [
      sortedMilestones.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no milestones to show. You can create a new milestone.", newEntityLocations: "/app/workspace/life-plan/milestones/new", helpSubject: import_webapi_client.DocsHelpSubject.LIFE_PLAN_MILESTONES }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
        lineNumber: 101,
        columnNumber: 45
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: sortedMilestones.map((milestone) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `milestone-${milestone.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/life-plan/milestones/${milestone.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(AspectTag, { aspect: allAspectsByRefId.get(milestone.aspect_ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
          lineNumber: 106,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: milestone.name }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
          lineNumber: 107,
          columnNumber: 19
        }, this),
        entriesByRefId.get(milestone.ref_id)?.tags?.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
          fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
          lineNumber: 108,
          columnNumber: 75
        }, this))
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
        lineNumber: 105,
        columnNumber: 17
      }, this) }, `milestone-${milestone.ref_id}`, false, {
        fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
        lineNumber: 104,
        columnNumber: 48
      }, this)) }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
        lineNumber: 103,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
      lineNumber: 92,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
      lineNumber: 91,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
      lineNumber: 116,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
      lineNumber: 115,
      columnNumber: 7
    }, this)
  ] }, "life-plan-milestones", true, {
    fileName: "app/routes/app/workspace/life-plan/milestones.tsx",
    lineNumber: 90,
    columnNumber: 10
  }, this);
}
_s(Milestones, "PbEwYE674hfQZ1Op5Vd6+a8F46s=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowLeaf, useLeafNeedsToShowLeaflet, useNavigation];
});
_c = Milestones;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/life-plan/milestones", ParamsSchema, {
  error: () => `There was an error loading the milestones! Please try again!`
});
var _c;
$RefreshReg$(_c, "Milestones");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Milestones as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/life-plan/milestones-6NXDPS4I.js.map
