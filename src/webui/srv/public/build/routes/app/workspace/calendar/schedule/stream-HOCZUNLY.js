import {
  ScheduleStreamColorTag
} from "/build/_shared/chunk-3U5H3AD4.js";
import "/build/_shared/chunk-7YZ2X2X4.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
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
  FilterManyOptions,
  NavSingle,
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
  BranchPanel,
  makeBranchErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
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
  useNavigation,
  useSearchParams
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

// app/routes/app/workspace/calendar/schedule/stream.tsx
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/calendar/schedule/stream.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/calendar/schedule/stream.tsx"
  );
  import.meta.hot.lastModified = "1777213342576.9597";
}
var ParamsSchema = external_exports.object({});
var handle = {
  displayType: 2 /* BRANCH */
};
var shouldRevalidate = basicShouldRevalidate;
function ScheduleStreamViewAll() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const [query] = useSearchParams();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const shouldShowALeaf = useBranchNeedsToShowLeaf();
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const filteredEntries = loaderData.entries.filter((entry) => {
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    return entry.tags.some((tag) => selectedTagsRefId.includes(tag.ref_id));
  });
  return /* @__PURE__ */ jsxDEV(BranchPanel, { createLocation: `/app/workspace/calendar/schedule/stream/new?${query}`, returnLocation: `/app/workspace/calendar?${query}`, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "calendar-schedule-stream", topLevelInfo, inputsEnabled, actions: [NavSingle({
    text: "New External",
    link: `/app/workspace/calendar/schedule/stream/new-external?${query}`
  }), FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/calendar/schedule/stream.tsx",
    lineNumber: 78,
    columnNumber: 187
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: /* @__PURE__ */ jsxDEV(EntityStack, { children: filteredEntries.map((entry) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `schedule-stream-${entry.schedule_stream.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/calendar/schedule/stream/${entry.schedule_stream.ref_id}?${query}`, children: [
      /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: entry.schedule_stream.name }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar/schedule/stream.tsx",
        lineNumber: 89,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV(ScheduleStreamColorTag, { color: entry.schedule_stream.color }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar/schedule/stream.tsx",
        lineNumber: 90,
        columnNumber: 17
      }, this),
      entry.tags.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
        fileName: "app/routes/app/workspace/calendar/schedule/stream.tsx",
        lineNumber: 91,
        columnNumber: 40
      }, this))
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream.tsx",
      lineNumber: 88,
      columnNumber: 15
    }, this) }, `schedule-stream-${entry.schedule_stream.ref_id}`, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream.tsx",
      lineNumber: 87,
      columnNumber: 41
    }, this)) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream.tsx",
      lineNumber: 86,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream.tsx",
      lineNumber: 85,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream.tsx",
      lineNumber: 98,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar/schedule/stream.tsx",
      lineNumber: 97,
      columnNumber: 7
    }, this)
  ] }, "calendar-schedule-stream", true, {
    fileName: "app/routes/app/workspace/calendar/schedule/stream.tsx",
    lineNumber: 78,
    columnNumber: 10
  }, this);
}
_s(ScheduleStreamViewAll, "LrtGERKkO6AoyM19BmGVvpnVfv4=", false, function() {
  return [useLoaderDataSafeForAnimation, useSearchParams, useNavigation, useBranchNeedsToShowLeaf];
});
_c = ScheduleStreamViewAll;
var ErrorBoundary = makeBranchErrorBoundary(_c2 = (_params, searchParams) => `/app/workspace/calendar?${searchParams}`, ParamsSchema, {
  error: () => "There was an error loading time plan calendar streams!"
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "ScheduleStreamViewAll");
$RefreshReg$(_c2, "ErrorBoundary$makeBranchErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  ScheduleStreamViewAll as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/calendar/schedule/stream-HOCZUNLY.js.map
