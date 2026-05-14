import {
  newURLParams
} from "/build/_shared/chunk-R75UYOOE.js";
import {
  isWidgetDimensionKSized,
  widgetDimensionCols,
  widgetDimensionRows,
  widgetTypeName
} from "/build/_shared/chunk-4ZSHFYIG.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
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
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Tune_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import {
  Box_default,
  Button_default,
  Stack_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
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
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
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
  Link,
  Outlet,
  useLocation,
  useNavigation,
  useParams,
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

// app/routes/app/workspace/home/settings/tabs/$id.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist2());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/home/settings/tabs/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
var _s3 = $RefreshSig$();
var _s4 = $RefreshSig$();
var _s5 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/home/settings/tabs/$id.tsx"
  );
  import.meta.hot.lastModified = "1775685113117.649";
}
var Action = /* @__PURE__ */ function(Action2) {
  Action2["ADD_WIDGET"] = "add";
  Action2["MOVE_WIDGET"] = "move";
  return Action2;
}(Action || {});
var ParamsSchema = external_exports.object({
  id: external_exports.string(),
  widgetId: external_exports.string().optional()
});
var QuerySchema = external_exports.object({
  action: external_exports.nativeEnum(Action),
  row: external_exports.coerce.number().optional(),
  col: external_exports.coerce.number().optional()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 2 /* BRANCH */
};
var shouldRevalidate = standardShouldRevalidate;
function HomeTab() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const shouldShowALeaf = useBranchNeedsToShowLeaf();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const [queryRaw] = useSearchParams();
  const query = (0, import_zodix.parseQuery)(queryRaw, QuerySchema);
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  return /* @__PURE__ */ jsxDEV(BranchPanel, { entityType: import_webapi_client.NamedEntityTag.HOME_TAB, entityRefId: loaderData.tab.ref_id, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.tab.archived, createLocation: `/app/workspace/home/settings/tabs/${loaderData.tab.ref_id}/widgets/new`, returnLocation: "/app/workspace/home/settings", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "home-tab-details", topLevelInfo, inputsEnabled, actions: [NavSingle({
    text: "Details",
    link: `/app/workspace/home/settings/tabs/${loaderData.tab.ref_id}/details`,
    icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
      lineNumber: 147,
      columnNumber: 11
    }, this)
  })] }, void 0, false, {
    fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
    lineNumber: 144,
    columnNumber: 381
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: /* @__PURE__ */ jsxDEV(Stack_default, { sx: {
      alignItems: "center"
    }, children: [
      loaderData.tab.target === import_webapi_client.HomeTabTarget.BIG_SCREEN && /* @__PURE__ */ jsxDEV(BigScreenWidgetPlacement, { action: query.action, homeTab: loaderData.tab, widgets: loaderData.widgets }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
        lineNumber: 153,
        columnNumber: 66
      }, this),
      loaderData.tab.target === import_webapi_client.HomeTabTarget.SMALL_SCREEN && /* @__PURE__ */ jsxDEV(SmallScreenWidgetPlacement, { action: query.action, homeTab: loaderData.tab, widgets: loaderData.widgets }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
        lineNumber: 155,
        columnNumber: 68
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
      lineNumber: 150,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
      lineNumber: 149,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
      lineNumber: 160,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
      lineNumber: 159,
      columnNumber: 7
    }, this)
  ] }, `home-tab-${loaderData.tab.ref_id}`, true, {
    fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
    lineNumber: 144,
    columnNumber: 10
  }, this);
}
_s(HomeTab, "gPyy49u6vlpaZ7xwyvwWx4TQ+w8=", false, function() {
  return [useLoaderDataSafeForAnimation, useBranchNeedsToShowLeaf, useNavigation, useSearchParams];
});
_c = HomeTab;
var ErrorBoundary = makeBranchErrorBoundary("/app/workspace/home/settings", ParamsSchema, {
  notFound: (params) => `Could not find tab #${params.id}!`,
  error: (params) => `There was an error loading tab #${params.id}! Please try again!`
});
function BigScreenWidgetPlacement(props) {
  _s2();
  const widgetPlacement = props.homeTab.widget_placement;
  const widgetByRefId = new Map(props.widgets.map((widget) => [widget.ref_id, widget]));
  const isBigScreen = useBigScreen();
  const maxCols = widgetPlacement.matrix.length;
  const maxRows = widgetPlacement.matrix[0].length;
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    display: "grid",
    gridTemplateColumns: `repeat(${maxCols}, ${isBigScreen ? "8rem" : "1fr"})`,
    gridTemplateRows: `repeat(${maxRows}, 3rem)`,
    gridGap: "0.25rem",
    alignItems: "center",
    marginLeft: isBigScreen ? "auto" : void 0,
    marginRight: isBigScreen ? "auto" : void 0
  }, children: Array.from({
    length: maxRows
  }, (_, rowIndex) => {
    return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: Array.from({
      length: maxCols
    }, (_2, colIndex) => {
      const cell = widgetPlacement.matrix[colIndex][rowIndex];
      if (cell === null) {
        for (let i = 0; i < rowIndex; i++) {
          const prevWidgetId = widgetPlacement.matrix[colIndex][i];
          if (prevWidgetId !== null) {
            const prevWidget = widgetByRefId.get(prevWidgetId);
            if (prevWidget && isWidgetDimensionKSized(prevWidget.geometry.dimension)) {
              return null;
            }
          }
        }
        switch (props.action) {
          case Action.ADD_WIDGET:
            return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
              display: "flex",
              gridRowStart: rowIndex + 1,
              gridColumnStart: colIndex + 1
            }, children: /* @__PURE__ */ jsxDEV(NewWidgetButton, { homeTab: props.homeTab, row: rowIndex, col: colIndex }, `${rowIndex}-${colIndex}`, false, {
              fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
              lineNumber: 214,
              columnNumber: 25
            }, this) }, `${rowIndex}-${colIndex}`, false, {
              fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
              lineNumber: 209,
              columnNumber: 24
            }, this);
          case Action.MOVE_WIDGET:
            return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
              display: "flex",
              gridRowStart: rowIndex + 1,
              gridColumnStart: colIndex + 1
            }, children: /* @__PURE__ */ jsxDEV(MoveWidgetButton, { row: rowIndex, col: colIndex }, `${rowIndex}-${colIndex}`, false, {
              fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
              lineNumber: 222,
              columnNumber: 25
            }, this) }, `${rowIndex}-${colIndex}`, false, {
              fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
              lineNumber: 217,
              columnNumber: 24
            }, this);
        }
      }
      if (rowIndex > 0 && widgetPlacement.matrix[colIndex][rowIndex] === widgetPlacement.matrix[colIndex][rowIndex - 1]) {
        return null;
      }
      if (colIndex > 0 && widgetPlacement.matrix[colIndex][rowIndex] === widgetPlacement.matrix[colIndex - 1][rowIndex]) {
        return null;
      }
      const widget = widgetByRefId.get(cell);
      return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
        display: "flex",
        gridRowStart: rowIndex + 1,
        gridRowEnd: rowIndex + 1 + widgetDimensionRows(widget.geometry.dimension),
        gridColumnStart: colIndex + 1,
        gridColumnEnd: colIndex + 1 + widgetDimensionCols(widget.geometry.dimension)
      }, children: /* @__PURE__ */ jsxDEV(PlacedWidget, { widget, row: rowIndex, col: colIndex }, void 0, false, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
        lineNumber: 244,
        columnNumber: 19
      }, this) }, `${rowIndex}-${colIndex}`, false, {
        fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
        lineNumber: 237,
        columnNumber: 18
      }, this);
    }) }, rowIndex, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
      lineNumber: 191,
      columnNumber: 14
    }, this);
  }) }, void 0, false, {
    fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
    lineNumber: 179,
    columnNumber: 10
  }, this);
}
_s2(BigScreenWidgetPlacement, "tSMcTumzNoEiop6dkXrv9elMvRg=", false, function() {
  return [useBigScreen];
});
_c2 = BigScreenWidgetPlacement;
function SmallScreenWidgetPlacement(props) {
  const widgetPlacement = props.homeTab.widget_placement;
  const widgetByRefId = new Map(props.widgets.map((widget) => [widget.ref_id, widget]));
  return /* @__PURE__ */ jsxDEV(Stack_default, { useFlexGap: true, sx: {
    alignItems: "center",
    gap: "0.25rem"
  }, children: widgetPlacement.matrix.map((row, rowIndex) => {
    if (row === null) {
      for (let i = 0; i < rowIndex; i++) {
        const prevWidgetId = widgetPlacement.matrix[i];
        if (prevWidgetId !== null) {
          const prevWidget = widgetByRefId.get(prevWidgetId);
          if (prevWidget && isWidgetDimensionKSized(prevWidget.geometry.dimension)) {
            return null;
          }
        }
      }
      switch (props.action) {
        case Action.ADD_WIDGET:
          return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
            width: "8rem"
          }, children: /* @__PURE__ */ jsxDEV(NewWidgetButton, { homeTab: props.homeTab, row: rowIndex, col: 0 }, void 0, false, {
            fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
            lineNumber: 279,
            columnNumber: 19
          }, this) }, rowIndex, false, {
            fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
            lineNumber: 276,
            columnNumber: 20
          }, this);
        case Action.MOVE_WIDGET:
          return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
            width: "8rem"
          }, children: /* @__PURE__ */ jsxDEV(MoveWidgetButton, { row: rowIndex, col: 0 }, rowIndex, false, {
            fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
            lineNumber: 285,
            columnNumber: 19
          }, this) }, rowIndex, false, {
            fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
            lineNumber: 282,
            columnNumber: 20
          }, this);
      }
    }
    if (rowIndex > 0 && widgetPlacement.matrix[rowIndex] === widgetPlacement.matrix[rowIndex - 1]) {
      return null;
    }
    const widget = widgetByRefId.get(row);
    return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
      width: "8rem"
    }, children: /* @__PURE__ */ jsxDEV(PlacedWidget, { widget, row: rowIndex, col: 0 }, void 0, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
      lineNumber: 299,
      columnNumber: 13
    }, this) }, rowIndex, false, {
      fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
      lineNumber: 296,
      columnNumber: 14
    }, this);
  }) }, void 0, false, {
    fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
    lineNumber: 258,
    columnNumber: 10
  }, this);
}
_c3 = SmallScreenWidgetPlacement;
function NewWidgetButton(props) {
  _s3();
  const [queryRaw] = useSearchParams();
  const query = (0, import_zodix.parseQuery)(queryRaw, QuerySchema);
  return /* @__PURE__ */ jsxDEV(Button_default, { component: Link, to: `/app/workspace/home/settings/tabs/${props.homeTab.ref_id}/widgets/new?${newURLParams(queryRaw, "row", props.row.toString(), "col", props.col.toString())}`, variant: "outlined", sx: {
    color: (theme) => query.row === props.row && query.col === props.col ? theme.palette.primary.contrastText : theme.palette.primary.main,
    backgroundColor: (theme) => query.row === props.row && query.col === props.col ? theme.palette.primary.light : "transparent",
    width: "100%",
    height: "3rem"
  }, children: "Add" }, void 0, false, {
    fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
    lineNumber: 309,
    columnNumber: 10
  }, this);
}
_s3(NewWidgetButton, "nTmXGEZefXDiuQLWhDywEIoRHlg=", false, function() {
  return [useSearchParams];
});
_c4 = NewWidgetButton;
function MoveWidgetButton(props) {
  _s4();
  const location = useLocation();
  const [queryRaw] = useSearchParams();
  const query = (0, import_zodix.parseQuery)(queryRaw, QuerySchema);
  const shouldHighlight = query.row === props.row && query.col === props.col;
  return /* @__PURE__ */ jsxDEV(Button_default, { component: Link, to: `${location.pathname}?${newURLParams(queryRaw, "row", props.row.toString(), "col", props.col.toString())}`, variant: "outlined", sx: {
    color: (theme) => shouldHighlight ? theme.palette.primary.contrastText : theme.palette.primary.main,
    backgroundColor: (theme) => shouldHighlight ? theme.palette.primary.light : "transparent",
    width: "100%",
    height: "3rem"
  }, children: "Move" }, void 0, false, {
    fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
    lineNumber: 328,
    columnNumber: 10
  }, this);
}
_s4(MoveWidgetButton, "X3dV/vbcbmRhcnKnSI71HY/ABdc=", false, function() {
  return [useLocation, useSearchParams];
});
_c5 = MoveWidgetButton;
function PlacedWidget(props) {
  _s5();
  const heightInRem = widgetDimensionRows(props.widget.geometry.dimension) * 3;
  const widthInRem = widgetDimensionCols(props.widget.geometry.dimension) * 8;
  const {
    widgetId
  } = useParams();
  const isBigScreen = useBigScreen();
  const shouldHighlight = widgetId === props.widget.ref_id;
  const theme = useTheme();
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    fontSize: "0.64rem",
    height: `${heightInRem}rem`,
    width: "100%",
    minWidth: isBigScreen ? `${widthInRem}rem` : void 0,
    border: (theme2) => `2px dotted ${theme2.palette.primary.main}`,
    borderRadius: "4px",
    borderBottomLeftRadius: isWidgetDimensionKSized(props.widget.geometry.dimension) ? 0 : "4px",
    borderBottomRightRadius: isWidgetDimensionKSized(props.widget.geometry.dimension) ? 0 : "4px",
    borderBottom: isWidgetDimensionKSized(props.widget.geometry.dimension) ? `4px dotted ${theme.palette.primary.main}` : `2px dotted ${theme.palette.primary.main}`,
    backgroundColor: shouldHighlight ? theme.palette.primary.light : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }, children: /* @__PURE__ */ jsxDEV(EntityLink, { inline: true, light: shouldHighlight, to: `/app/workspace/home/settings/tabs/${props.widget.home_tab_ref_id}/widgets/${props.widget.ref_id}?action=${Action.MOVE_WIDGET}`, children: widgetTypeName(props.widget.the_type) }, void 0, false, {
    fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
    lineNumber: 366,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/app/workspace/home/settings/tabs/$id.tsx",
    lineNumber: 351,
    columnNumber: 10
  }, this);
}
_s5(PlacedWidget, "yzJm1ofNiiA3PkUOcPogn0C+quI=", false, function() {
  return [useParams, useBigScreen, useTheme];
});
_c6 = PlacedWidget;
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
var _c6;
$RefreshReg$(_c, "HomeTab");
$RefreshReg$(_c2, "BigScreenWidgetPlacement");
$RefreshReg$(_c3, "SmallScreenWidgetPlacement");
$RefreshReg$(_c4, "NewWidgetButton");
$RefreshReg$(_c5, "MoveWidgetButton");
$RefreshReg$(_c6, "PlacedWidget");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  HomeTab as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/home/settings/tabs/$id-EB6ZDD75.js.map
