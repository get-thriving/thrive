import {
  SyncTargetSelect,
  SyncTargetTag
} from "/build/_shared/chunk-W4HWRPGM.js";
import {
  AppComponentTag
} from "/build/_shared/chunk-7SVPUDIO.js";
import {
  EntitySummaryLink
} from "/build/_shared/chunk-ZK23STK3.js";
import {
  selectZod
} from "/build/_shared/chunk-HVVVLUYY.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-LJCXIXWH.js";
import {
  TimeDiffTag
} from "/build/_shared/chunk-YNGTC4PW.js";
import "/build/_shared/chunk-X6MG2JXZ.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  ToolPanel,
  makeToolErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  ExpandMore_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  AccordionDetails_default,
  AccordionSummary_default,
  Accordion_default,
  Box_default,
  FormControl_default,
  InputLabel_default,
  styled_default
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
import "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useActionData,
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

// app/routes/app/workspace/tools/gc.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/tools/gc.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/tools/gc.tsx"
  );
  import.meta.hot.lastModified = "1777213342616.0652";
}
var GCFormSchema = external_exports.object({
  gcTargets: selectZod(external_exports.nativeEnum(import_webapi_client.SyncTarget))
});
var handle = {
  displayType: 5 /* TOOL */
};
var shouldRevalidate = standardShouldRevalidate;
function GC() {
  _s();
  const entries = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(ToolPanel, { children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/gc.tsx",
      lineNumber: 89,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Garbage Collection", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "gc-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Garbage Collect",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/gc.tsx",
      lineNumber: 91,
      columnNumber: 56
    }, this), children: /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
      /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "gcTargets", children: "Garbage Collect Targets" }, void 0, false, {
        fileName: "app/routes/app/workspace/tools/gc.tsx",
        lineNumber: 97,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(SyncTargetSelect, { topLevelInfo, labelId: "gcTargets", label: "Garbage Collect Targets", name: "gcTargets", readOnly: !inputsEnabled }, void 0, false, {
        fileName: "app/routes/app/workspace/tools/gc.tsx",
        lineNumber: 98,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/gc_targets" }, void 0, false, {
        fileName: "app/routes/app/workspace/tools/gc.tsx",
        lineNumber: 99,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/tools/gc.tsx",
      lineNumber: 96,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/gc.tsx",
      lineNumber: 91,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Garbage Collection", size: "large" }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/gc.tsx",
      lineNumber: 103,
      columnNumber: 7
    }, this),
    entries.map((entry) => {
      return /* @__PURE__ */ jsxDEV(Accordion_default, { children: [
        /* @__PURE__ */ jsxDEV(AccordionSummary_default, { expandIcon: /* @__PURE__ */ jsxDEV(ExpandMore_default, {}, void 0, false, {
          fileName: "app/routes/app/workspace/tools/gc.tsx",
          lineNumber: 107,
          columnNumber: 43
        }, this), children: /* @__PURE__ */ jsxDEV(AccordionHeader, { children: [
          "Run from ",
          /* @__PURE__ */ jsxDEV(AppComponentTag, { source: entry.source }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/gc.tsx",
            lineNumber: 109,
            columnNumber: 26
          }, this),
          "with ",
          entry.entity_records.length,
          " entities archived",
          /* @__PURE__ */ jsxDEV(TimeDiffTag, { today: topLevelInfo.today, labelPrefix: "from", collectionTime: entry.created_time }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/gc.tsx",
            lineNumber: 111,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/tools/gc.tsx",
          lineNumber: 108,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/gc.tsx",
          lineNumber: 107,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(AccordionDetails_default, { children: [
          /* @__PURE__ */ jsxDEV(GCTargetsSection, { children: [
            "GC Targets:",
            entry.gc_targets.map((target) => /* @__PURE__ */ jsxDEV(SyncTargetTag, { target }, target, false, {
              fileName: "app/routes/app/workspace/tools/gc.tsx",
              lineNumber: 118,
              columnNumber: 49
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gc.tsx",
            lineNumber: 116,
            columnNumber: 15
          }, this),
          entry.entity_records.map((record) => /* @__PURE__ */ jsxDEV(EntityCard, { children: /* @__PURE__ */ jsxDEV(EntitySummaryLink, { today: topLevelInfo.today, summary: record }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/gc.tsx",
            lineNumber: 122,
            columnNumber: 19
          }, this) }, record.ref_id, false, {
            fileName: "app/routes/app/workspace/tools/gc.tsx",
            lineNumber: 121,
            columnNumber: 51
          }, this))
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/tools/gc.tsx",
          lineNumber: 115,
          columnNumber: 13
        }, this)
      ] }, entry.ref_id, true, {
        fileName: "app/routes/app/workspace/tools/gc.tsx",
        lineNumber: 106,
        columnNumber: 14
      }, this);
    })
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/tools/gc.tsx",
    lineNumber: 88,
    columnNumber: 10
  }, this);
}
_s(GC, "pC+dn+jC5JMyHNh7eJKAkM/Lcj8=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = GC;
var ErrorBoundary = makeToolErrorBoundary(_c2 = () => `There was an error garbage collecting! Please try again!`);
_c3 = ErrorBoundary;
var AccordionHeader = styled_default(Box_default)(({
  theme
}) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap"
}));
_c4 = AccordionHeader;
var GCTargetsSection = styled_default(Box_default)(({
  theme
}) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  paddingBottom: theme.spacing(1)
}));
_c5 = GCTargetsSection;
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
$RefreshReg$(_c, "GC");
$RefreshReg$(_c2, "ErrorBoundary$makeToolErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
$RefreshReg$(_c4, "AccordionHeader");
$RefreshReg$(_c5, "GCTargetsSection");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  GC as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/tools/gc-FLFRKM2C.js.map
