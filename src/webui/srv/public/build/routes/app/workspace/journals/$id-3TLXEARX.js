import {
  ShowReport
} from "/build/_shared/chunk-7YWL6DI3.js";
import {
  JournalStack,
  allowUserChanges,
  sortJournalsNaturally
} from "/build/_shared/chunk-KE26UVOZ.js";
import "/build/_shared/chunk-OLMKSGLM.js";
import "/build/_shared/chunk-37FGSNWH.js";
import {
  TimePlanStack
} from "/build/_shared/chunk-BEBGHA6L.js";
import {
  sortTimePlansNaturally
} from "/build/_shared/chunk-ZTWT66OL.js";
import "/build/_shared/chunk-R6BBIENF.js";
import "/build/_shared/chunk-TD4OCNC5.js";
import {
  PeriodSelect
} from "/build/_shared/chunk-FBXWU6M6.js";
import "/build/_shared/chunk-HLPWZ3ZO.js";
import {
  EntityNoteEditor
} from "/build/_shared/chunk-PDFSPG4I.js";
import {
  TagsEditor
} from "/build/_shared/chunk-FTLY2H2V.js";
import {
  entityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import "/build/_shared/chunk-KB3ZBF4C.js";
import "/build/_shared/chunk-HVHVJK66.js";
import "/build/_shared/chunk-VEYCIPLX.js";
import "/build/_shared/chunk-ZNIVMWFF.js";
import "/build/_shared/chunk-HGSZOXV4.js";
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
import "/build/_shared/chunk-Z3RPM676.js";
import "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  LeafPanel,
  makeLeafErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import {
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-FUGZILJZ.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default
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

// app/routes/app/workspace/journals/$id.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/journals/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/journals/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342590.2969";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("change-time-config"),
  rightNow: external_exports.string(),
  period: external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod)
}), external_exports.object({
  intent: external_exports.literal("refresh-stats")
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function Journal() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isBigScreen = useBigScreen();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const corePropertyEditable = allowUserChanges(loaderData.journal.source);
  const inputsEnabled = navigation.state === "idle" && !loaderData.journal.archived;
  const sortedSubJournals = sortJournalsNaturally(loaderData.subPeriodJournals);
  const sortedTimePlans = sortTimePlansNaturally(loaderData.subTimePlans);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.JOURNAL, entityRefId: loaderData.journal.ref_id, fakeKey: `journal-${loaderData.journal.ref_id}`, showArchiveAndRemoveButton: corePropertyEditable, inputsEnabled, entityArchived: loaderData.journal.archived, returnLocation: "/app/workspace/journals", initialExpansionState: "full" /* FULL */, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/journals/$id.tsx",
      lineNumber: 199,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "journal-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "journal-change-time-config",
      text: "Change Time Config",
      value: "change-time-config",
      disabled: !inputsEnabled || !corePropertyEditable,
      highlight: true
    }), ActionSingle({
      id: "journal-refresh-stats",
      text: "Refresh Stats",
      value: "refresh-stats",
      disabled: !inputsEnabled
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/journals/$id.tsx",
      lineNumber: 200,
      columnNumber: 48
    }, this), children: /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, useFlexGap: true, children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "rightNow", shrink: true, margin: "dense", children: "The Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/journals/$id.tsx",
          lineNumber: 214,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "rightNow", name: "rightNow", readOnly: !inputsEnabled || !corePropertyEditable, defaultValue: loaderData.journal.right_now, disabled: !inputsEnabled || !corePropertyEditable }, void 0, false, {
          fileName: "app/routes/app/workspace/journals/$id.tsx",
          lineNumber: 217,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/right_now" }, void 0, false, {
          fileName: "app/routes/app/workspace/journals/$id.tsx",
          lineNumber: 219,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/journals/$id.tsx",
        lineNumber: 213,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(PeriodSelect, { labelId: "period", label: "Period", name: "period", inputsEnabled: inputsEnabled && corePropertyEditable, defaultValue: loaderData.journal.period }, void 0, false, {
          fileName: "app/routes/app/workspace/journals/$id.tsx",
          lineNumber: 223,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/status" }, void 0, false, {
          fileName: "app/routes/app/workspace/journals/$id.tsx",
          lineNumber: 224,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/journals/$id.tsx",
        lineNumber: 222,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags", allTags: loaderData.allTags, defaultValue: loaderData.tags.map((tag) => tag.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.JOURNAL, loaderData.journal.ref_id) }, void 0, false, {
        fileName: "app/routes/app/workspace/journals/$id.tsx",
        lineNumber: 228,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/journals/$id.tsx",
        lineNumber: 227,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/journals/$id.tsx",
      lineNumber: 212,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/journals/$id.tsx",
      lineNumber: 200,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "journal-note", title: "Note", children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/journals/$id.tsx",
      lineNumber: 234,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/journals/$id.tsx",
      lineNumber: 233,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "journal-report", title: "Report", children: /* @__PURE__ */ jsxDEV(ShowReport, { topLevelInfo, allAspects: loaderData.allAspects || [], allGoals: loaderData.allGoals || [], report: loaderData.journalStats.report }, void 0, false, {
      fileName: "app/routes/app/workspace/journals/$id.tsx",
      lineNumber: 238,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/journals/$id.tsx",
      lineNumber: 237,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "sub-journals", title: "Other Journals in this Period", children: /* @__PURE__ */ jsxDEV(JournalStack, { topLevelInfo, journals: sortedSubJournals }, void 0, false, {
      fileName: "app/routes/app/workspace/journals/$id.tsx",
      lineNumber: 242,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/journals/$id.tsx",
      lineNumber: 241,
      columnNumber: 7
    }, this),
    isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.TIME_PLANS) && loaderData.timePlan && sortedTimePlans.length > 0 && /* @__PURE__ */ jsxDEV(SectionCard, { id: "sub-time-plans", title: "Time Plans in this Period", children: [
      loaderData.timePlan && /* @__PURE__ */ jsxDEV(TimePlanStack, { topLevelInfo, timePlans: [loaderData.timePlan] }, void 0, false, {
        fileName: "app/routes/app/workspace/journals/$id.tsx",
        lineNumber: 246,
        columnNumber: 37
      }, this),
      sortedTimePlans.length > 0 && /* @__PURE__ */ jsxDEV(TimePlanStack, { topLevelInfo, timePlans: sortedTimePlans }, void 0, false, {
        fileName: "app/routes/app/workspace/journals/$id.tsx",
        lineNumber: 247,
        columnNumber: 44
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/journals/$id.tsx",
      lineNumber: 245,
      columnNumber: 145
    }, this)
  ] }, `journal-${loaderData.journal.ref_id}`, true, {
    fileName: "app/routes/app/workspace/journals/$id.tsx",
    lineNumber: 198,
    columnNumber: 10
  }, this);
}
_s(Journal, "WpISOcRVnErFf7qMJ2A2ArFEbRY=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen];
});
_c = Journal;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/journals", ParamsSchema, {
  notFound: (params) => `Could not find journal #${params.id}!`,
  error: (params) => `There was an error loading journal #${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "Journal");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Journal as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/journals/$id-3TLXEARX.js.map
