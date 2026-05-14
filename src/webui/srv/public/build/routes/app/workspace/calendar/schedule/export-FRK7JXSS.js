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
  BranchPanel,
  makeBranchErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  useBranchNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet,
  useSearchParams
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

// app/routes/app/workspace/calendar/schedule/export.tsx
var import_node = __toESM(require_node());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/calendar/schedule/export.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/calendar/schedule/export.tsx"
  );
  import.meta.hot.lastModified = "1775685113136.4497";
}
var ParamsSchema = external_exports.object({});
var handle = {
  displayType: 2 /* BRANCH */
};
var shouldRevalidate = basicShouldRevalidate;
function ScheduleExportViewAll() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const [query] = useSearchParams();
  const shouldShowALeaf = useBranchNeedsToShowLeaf();
  return /* @__PURE__ */ jsxDEV(BranchPanel, { createLocation: `/app/workspace/calendar/schedule/export/new?${query}`, returnLocation: `/app/workspace/calendar?${query}`, children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: /* @__PURE__ */ jsxDEV(EntityStack, { children: loaderData.entries.map((entry) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `schedule-export-${entry.schedule_export.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/calendar/schedule/export/${entry.schedule_export.ref_id}?${query}`, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: entry.schedule_export.name }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export.tsx",
      lineNumber: 64,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export.tsx",
      lineNumber: 63,
      columnNumber: 15
    }, this) }, `schedule-export-${entry.schedule_export.ref_id}`, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export.tsx",
      lineNumber: 62,
      columnNumber: 44
    }, this)) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export.tsx",
      lineNumber: 61,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export.tsx",
      lineNumber: 60,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export.tsx",
      lineNumber: 71,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/export.tsx",
      lineNumber: 70,
      columnNumber: 7
    }, this)
  ] }, "calendar-schedule-export", true, {
    fileName: "app/routes/app/workspace/calendar/schedule/export.tsx",
    lineNumber: 59,
    columnNumber: 10
  }, this);
}
_s(ScheduleExportViewAll, "z6QPzy5dY34hvRu3HnB2yJ6QSRI=", false, function() {
  return [useLoaderDataSafeForAnimation, useSearchParams, useBranchNeedsToShowLeaf];
});
_c = ScheduleExportViewAll;
var ErrorBoundary = makeBranchErrorBoundary(_c2 = (_params, searchParams) => `/app/workspace/calendar?${searchParams}`, ParamsSchema, {
  error: () => "There was an error loading calendar exports!"
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "ScheduleExportViewAll");
$RefreshReg$(_c2, "ErrorBoundary$makeBranchErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  ScheduleExportViewAll as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/calendar/schedule/export-FRK7JXSS.js.map
