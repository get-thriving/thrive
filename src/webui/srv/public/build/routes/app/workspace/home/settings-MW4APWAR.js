import {
  shiftTabDownInListOfTabs,
  shiftTabUpInListOfTabs,
  sortTabsByOrder
} from "/build/_shared/chunk-SCOTPYLO.js";
import {
  makeIntent
} from "/build/_shared/chunk-7SK2WYB3.js";
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
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  makeBranchErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import {
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import {
  ArrowDownward_default,
  ArrowUpward_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  IconButton_default,
  Stack_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
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
  Form,
  Outlet,
  useActionData
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

// app/routes/app/workspace/home/settings.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist2());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/home/settings.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/home/settings.tsx"
  );
  import.meta.hot.lastModified = "1775685113117.1318";
}
var ParamsSchema = external_exports.object({});
var UpdateFormSchema = external_exports.object({
  intent: external_exports.string()
});
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function HomeSettings() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const bigScreenTabs = sortTabsByOrder(loaderData.tabs.filter((tab) => tab.target === import_webapi_client.HomeTabTarget.BIG_SCREEN), loaderData.homeConfig.order_of_tabs[import_webapi_client.HomeTabTarget.BIG_SCREEN]);
  const smallScreenTabs = sortTabsByOrder(loaderData.tabs.filter((tab) => tab.target === import_webapi_client.HomeTabTarget.SMALL_SCREEN), loaderData.homeConfig.order_of_tabs[import_webapi_client.HomeTabTarget.SMALL_SCREEN]);
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", createLocation: "/app/workspace/home/settings/tabs/new", children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { branchForceHide: shouldShowABranch, shouldHide: shouldShowABranch || shouldShowALeafToo, children: [
      /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings.tsx",
        lineNumber: 121,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Form, { method: "post", children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
        loaderData.tabs.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no tabs to show. You can create a new tab.", newEntityLocations: "/app/workspace/home/settings/tabs/new", helpSubject: import_webapi_client.DocsHelpSubject.HOME }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings.tsx",
          lineNumber: 124,
          columnNumber: 46
        }, this),
        /* @__PURE__ */ jsxDEV(TabList, { title: "Big Screen Tabs", tabs: bigScreenTabs, target: import_webapi_client.HomeTabTarget.BIG_SCREEN, reorderIntent: "reorder-big-screen-tab", homeConfigRefId: loaderData.homeConfig.ref_id, orderOfTabs: loaderData.homeConfig.order_of_tabs[import_webapi_client.HomeTabTarget.BIG_SCREEN] }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings.tsx",
          lineNumber: 126,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(TabList, { title: "Small Screen Tabs", tabs: smallScreenTabs, target: import_webapi_client.HomeTabTarget.SMALL_SCREEN, reorderIntent: "reorder-small-screen-tab", homeConfigRefId: loaderData.homeConfig.ref_id, orderOfTabs: loaderData.homeConfig.order_of_tabs[import_webapi_client.HomeTabTarget.SMALL_SCREEN] }, void 0, false, {
          fileName: "app/routes/app/workspace/home/settings.tsx",
          lineNumber: 128,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/home/settings.tsx",
        lineNumber: 123,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings.tsx",
        lineNumber: 122,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/home/settings.tsx",
      lineNumber: 120,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings.tsx",
      lineNumber: 134,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings.tsx",
      lineNumber: 133,
      columnNumber: 7
    }, this)
  ] }, "home/settings", true, {
    fileName: "app/routes/app/workspace/home/settings.tsx",
    lineNumber: 119,
    columnNumber: 10
  }, this);
}
_s(HomeSettings, "ONJch8USbcH9ZkikHvBSoBm0trw=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useTrunkNeedsToShowBranch, useTrunkNeedsToShowLeaf];
});
_c = HomeSettings;
var ErrorBoundary = makeBranchErrorBoundary("/app/workspace/home", ParamsSchema, {
  notFound: () => `Could not find the home settings!`,
  error: () => `There was an error loading the home settings! Please try again!`
});
function TabList(props) {
  if (props.tabs.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 1, useFlexGap: true, children: [
    /* @__PURE__ */ jsxDEV(StandardDivider, { title: props.title, size: "small" }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings.tsx",
      lineNumber: 151,
      columnNumber: 7
    }, this),
    props.tabs.map((tab) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `home-tab-${tab.ref_id}`, indent: 0, extraControls: /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(IconButton_default, { size: "medium", type: "submit", name: "intent", value: makeIntent(props.reorderIntent, {
        refId: props.homeConfigRefId,
        newOrderOfTabs: shiftTabUpInListOfTabs(tab, props.orderOfTabs)
      }), children: /* @__PURE__ */ jsxDEV(ArrowUpward_default, { fontSize: "medium" }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings.tsx",
        lineNumber: 157,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings.tsx",
        lineNumber: 153,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(IconButton_default, { size: "medium", type: "submit", name: "intent", value: makeIntent(props.reorderIntent, {
        refId: props.homeConfigRefId,
        newOrderOfTabs: shiftTabDownInListOfTabs(tab, props.orderOfTabs)
      }), children: /* @__PURE__ */ jsxDEV(ArrowDownward_default, { fontSize: "medium" }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings.tsx",
        lineNumber: 164,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings.tsx",
        lineNumber: 160,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/home/settings.tsx",
      lineNumber: 152,
      columnNumber: 135
    }, this), children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/home/settings/tabs/${tab.ref_id}`, children: [
      tab.icon && /* @__PURE__ */ jsxDEV(EntityIconComponent, { icon: tab.icon }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings.tsx",
        lineNumber: 168,
        columnNumber: 26
      }, this),
      /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: tab.name }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings.tsx",
        lineNumber: 169,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/home/settings.tsx",
      lineNumber: 167,
      columnNumber: 11
    }, this) }, `home-tab-${tab.ref_id}`, false, {
      fileName: "app/routes/app/workspace/home/settings.tsx",
      lineNumber: 152,
      columnNumber: 30
    }, this))
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/home/settings.tsx",
    lineNumber: 150,
    columnNumber: 10
  }, this);
}
_c2 = TabList;
var _c;
var _c2;
$RefreshReg$(_c, "HomeSettings");
$RefreshReg$(_c2, "TabList");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  HomeSettings as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/home/settings-MW4APWAR.js.map
