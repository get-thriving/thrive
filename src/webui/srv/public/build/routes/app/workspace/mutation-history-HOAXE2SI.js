import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  DateTime,
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import {
  ExpandMore_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import {
  Box_default,
  Chip_default,
  Collapse_default,
  IconButton_default,
  Stack_default,
  ToggleButtonGroup_default,
  ToggleButton_default,
  Typography_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
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
  Link,
  Outlet,
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

// app/routes/app/workspace/mutation-history.tsx
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/mutation-history.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/mutation-history.tsx"
  );
  import.meta.hot.lastModified = "1775685113154.603";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function stripUseCaseSuffix(name) {
  return name.replace(/UseCase$/, "");
}
function resultColor(result) {
  switch (result) {
    case "success":
      return "success";
    case "failure":
      return "error";
    default:
      return "default";
  }
}
function MutationHistory() {
  _s();
  const {
    entries,
    users,
    totalCnt,
    pageSize
  } = useLoaderDataSafeForAnimation();
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const usersById = Object.fromEntries(users.map((u) => [u.ref_id, u]));
  const currentPage = Math.floor(parseInt(searchParams.get("offset") ?? "0", 10) / pageSize);
  const handlePageChange = (0, import_react2.useCallback)((page) => {
    const newParams = new URLSearchParams(searchParams);
    if (page === 0) {
      newParams.delete("offset");
    } else {
      newParams.set("offset", (page * pageSize).toString());
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams, pageSize]);
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeafToo, children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, children: [
      /* @__PURE__ */ jsxDEV(PaginationControls, { currentPage, totalCnt, pageSize, onPageChange: handlePageChange }, void 0, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 96,
        columnNumber: 11
      }, this),
      entries.length === 0 && /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body2", color: "text.secondary", children: "No mutation invocations found." }, void 0, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 98,
        columnNumber: 36
      }, this),
      entries.map((entry, idx) => /* @__PURE__ */ jsxDEV(InvocationRow, { entry, user: usersById[entry.user_ref_id] }, idx, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 102,
        columnNumber: 40
      }, this)),
      entries.length > 0 && /* @__PURE__ */ jsxDEV(PaginationControls, { currentPage, totalCnt, pageSize, onPageChange: handlePageChange }, void 0, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 104,
        columnNumber: 34
      }, this),
      /* @__PURE__ */ jsxDEV(Box_default, { sx: {
        height: "4rem"
      } }, void 0, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 106,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/mutation-history.tsx",
      lineNumber: 95,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/mutation-history.tsx",
      lineNumber: 94,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/mutation-history.tsx",
      lineNumber: 113,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/mutation-history.tsx",
      lineNumber: 112,
      columnNumber: 7
    }, this)
  ] }, "mutation-history", true, {
    fileName: "app/routes/app/workspace/mutation-history.tsx",
    lineNumber: 93,
    columnNumber: 10
  }, this);
}
_s(MutationHistory, "qQ1LaJ8s2Vp2kF5D6QW1avIiWTE=", false, function() {
  return [useLoaderDataSafeForAnimation, useSearchParams, useTrunkNeedsToShowLeaf];
});
_c = MutationHistory;
function InvocationRow({
  entry,
  user
}) {
  _s2();
  const [showArgs, setShowArgs] = (0, import_react2.useState)(false);
  const [showError, setShowError] = (0, import_react2.useState)(false);
  const formattedTimestamp = DateTime.fromISO(entry.timestamp).toLocaleString(DateTime.DATETIME_MED);
  const mutationName = stripUseCaseSuffix(entry.mutation_name);
  const userName = user?.name ?? "Unknown";
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    p: 1.5,
    borderRadius: 1,
    border: "1px solid",
    borderColor: "divider"
  }, children: [
    /* @__PURE__ */ jsxDEV(Box_default, { sx: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 1
    }, children: [
      /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body2", children: [
        /* @__PURE__ */ jsxDEV("strong", { children: userName }, void 0, false, {
          fileName: "app/routes/app/workspace/mutation-history.tsx",
          lineNumber: 145,
          columnNumber: 11
        }, this),
        " ran",
        " ",
        /* @__PURE__ */ jsxDEV(Link, { to: `/app/workspace/mutation-history/${entry.mutation_id}`, style: {
          textDecoration: "none",
          color: "inherit"
        }, children: /* @__PURE__ */ jsxDEV("strong", { style: {
          textDecoration: "underline"
        }, children: mutationName }, void 0, false, {
          fileName: "app/routes/app/workspace/mutation-history.tsx",
          lineNumber: 150,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/mutation-history.tsx",
          lineNumber: 146,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 144,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Chip_default, { label: entry.result, color: resultColor(entry.result), size: "small", variant: "outlined" }, void 0, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 157,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/mutation-history.tsx",
      lineNumber: 137,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Box_default, { sx: {
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      mt: 0.5
    }, children: [
      /* @__PURE__ */ jsxDEV(Typography_default, { variant: "caption", color: "text.secondary", children: [
        formattedTimestamp,
        " \xB7 ",
        entry.source
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 166,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(IconButton_default, { size: "small", onClick: () => setShowArgs((s) => !s), children: /* @__PURE__ */ jsxDEV(ExpandMore_default, { fontSize: "small", sx: {
        transform: showArgs ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s"
      } }, void 0, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 170,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 169,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/mutation-history.tsx",
      lineNumber: 160,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Collapse_default, { in: showArgs, children: /* @__PURE__ */ jsxDEV(Box_default, { component: "pre", sx: {
      mt: 1,
      p: 1,
      borderRadius: 1,
      bgcolor: "action.hover",
      fontSize: "0.75rem",
      overflow: "auto",
      maxHeight: "300px",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word"
    }, children: entry.args_str }, void 0, false, {
      fileName: "app/routes/app/workspace/mutation-history.tsx",
      lineNumber: 178,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/mutation-history.tsx",
      lineNumber: 177,
      columnNumber: 7
    }, this),
    entry.error_str && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(Box_default, { sx: {
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        mt: 0.5
      }, children: [
        /* @__PURE__ */ jsxDEV(Typography_default, { variant: "caption", color: "error", children: "Error" }, void 0, false, {
          fileName: "app/routes/app/workspace/mutation-history.tsx",
          lineNumber: 200,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(IconButton_default, { size: "small", onClick: () => setShowError((s) => !s), children: /* @__PURE__ */ jsxDEV(ExpandMore_default, { fontSize: "small", sx: {
          transform: showError ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s"
        } }, void 0, false, {
          fileName: "app/routes/app/workspace/mutation-history.tsx",
          lineNumber: 204,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/mutation-history.tsx",
          lineNumber: 203,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 194,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Collapse_default, { in: showError, children: /* @__PURE__ */ jsxDEV(Box_default, { component: "pre", sx: {
        mt: 1,
        p: 1,
        borderRadius: 1,
        bgcolor: "error.main",
        color: "error.contrastText",
        fontSize: "0.75rem",
        overflow: "auto",
        maxHeight: "300px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
      }, children: entry.error_str }, void 0, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 211,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 210,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/mutation-history.tsx",
      lineNumber: 193,
      columnNumber: 27
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/mutation-history.tsx",
    lineNumber: 131,
    columnNumber: 10
  }, this);
}
_s2(InvocationRow, "bsJcwkOLWxW6o4tQUzFjYFr4o+0=");
_c2 = InvocationRow;
function PaginationControls(props) {
  const pageCount = Math.ceil(props.totalCnt / props.pageSize);
  if (pageCount <= 1) {
    return null;
  }
  const shouldShowPage = Array(pageCount).fill(false);
  shouldShowPage[0] = true;
  shouldShowPage[pageCount - 1] = true;
  for (let delta = -3; delta <= 3; delta++) {
    const idx = props.currentPage + delta;
    if (idx >= 0 && idx < pageCount) {
      shouldShowPage[idx] = true;
    }
  }
  const buttons = [];
  for (let i = 0; i < pageCount; i++) {
    if (shouldShowPage[i]) {
      buttons.push(/* @__PURE__ */ jsxDEV(ToggleButton_default, { value: i, onClick: () => props.onPageChange(i), children: i + 1 }, i + 1, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 248,
        columnNumber: 20
      }, this));
    } else if (i > 0 && shouldShowPage[i - 1]) {
      buttons.push(/* @__PURE__ */ jsxDEV(ToggleButton_default, { value: "ellipsis", disabled: true, children: "..." }, `ellipsis-${i}`, false, {
        fileName: "app/routes/app/workspace/mutation-history.tsx",
        lineNumber: 252,
        columnNumber: 20
      }, this));
    }
  }
  return /* @__PURE__ */ jsxDEV(ToggleButtonGroup_default, { size: "small", value: props.currentPage, exclusive: true, sx: {
    alignSelf: "center"
  }, children: buttons }, void 0, false, {
    fileName: "app/routes/app/workspace/mutation-history.tsx",
    lineNumber: 257,
    columnNumber: 10
  }, this);
}
_c3 = PaginationControls;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the mutation history! Please try again!`
});
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "MutationHistory");
$RefreshReg$(_c2, "InvocationRow");
$RefreshReg$(_c3, "PaginationControls");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  MutationHistory as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/mutation-history-HOAXE2SI.js.map
