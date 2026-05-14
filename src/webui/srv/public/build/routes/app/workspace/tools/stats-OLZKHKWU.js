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
  SectionActions,
  autocompleteSingleLineSx
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
import {
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
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
  Autocomplete_default,
  Box_default,
  FormControl_default,
  InputLabel_default,
  Stack_default,
  TextField_default,
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

// app/routes/app/workspace/tools/stats.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/tools/stats.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/tools/stats.tsx"
  );
  import.meta.hot.lastModified = "1777213342619.1514";
}
var StatsFormSchema = external_exports.object({
  today: external_exports.optional(external_exports.string()),
  statsTargets: selectZod(external_exports.nativeEnum(import_webapi_client.SyncTarget)),
  filterHabitRefIds: selectZod(external_exports.string()),
  filterBigPlanRefIds: selectZod(external_exports.string()),
  filterJournalRefIds: selectZod(external_exports.string())
});
var handle = {
  displayType: 5 /* TOOL */
};
var shouldRevalidate = standardShouldRevalidate;
function Stats() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const [selectedHabits, setSelectedHabits] = (0, import_react2.useState)([]);
  const habitOptions = loaderData.summaries.habits?.map((p) => ({
    refId: p.ref_id,
    label: p.name
  })) ?? [];
  const [selectedBigPlans, setSelectedBigPlans] = (0, import_react2.useState)([]);
  const bigPlanOptions = loaderData.summaries.big_plans?.map((p) => ({
    refId: p.ref_id,
    label: p.name
  })) ?? [];
  const [selectedJournals, setSelectedJournals] = (0, import_react2.useState)([]);
  const journalOptions = loaderData.summaries.journals_last_year?.map((p) => ({
    refId: p.ref_id,
    label: p.name
  })) ?? [];
  return /* @__PURE__ */ jsxDEV(ToolPanel, { children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/stats.tsx",
      lineNumber: 122,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Stats", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "stats-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Compute Stats",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/stats.tsx",
      lineNumber: 123,
      columnNumber: 43
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "statsTargets", children: "Stats Targets" }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 129,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(SyncTargetSelect, { topLevelInfo, labelId: "statsTargets", label: "Stats Targets", name: "statsTargets", readOnly: !inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 130,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/stats_targets" }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 131,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/tools/stats.tsx",
        lineNumber: 128,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Accordion_default, { children: [
        /* @__PURE__ */ jsxDEV(AccordionSummary_default, { expandIcon: /* @__PURE__ */ jsxDEV(ExpandMore_default, {}, void 0, false, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 135,
          columnNumber: 41
        }, this), children: /* @__PURE__ */ jsxDEV(AccordionHeader, { children: "Advanced Options & Filtering" }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 136,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 135,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(AccordionDetails_default, { children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
          isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.HABITS) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(Autocomplete_default, { disablePortal: true, id: "filterHabitRefIds", options: habitOptions, sx: autocompleteSingleLineSx, readOnly: !inputsEnabled, disabled: !inputsEnabled, multiple: true, onChange: (e, vol) => setSelectedHabits(vol), isOptionEqualToValue: (o, v) => o.refId === v.refId, renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, name: "filterHabitRefIds", label: "Generate Only For Habits" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 142,
              columnNumber: 306
            }, this) }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 142,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "filterHabitRefIds", value: selectedHabits.map((p) => p.refId).join(",") }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 143,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/filter_habit_ref_ids" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 144,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/stats.tsx",
            lineNumber: 141,
            columnNumber: 96
          }, this),
          isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.BIG_PLANS) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(Autocomplete_default, { disablePortal: true, id: "filterBigPlanRefIds", options: bigPlanOptions, sx: autocompleteSingleLineSx, readOnly: !inputsEnabled, disabled: !inputsEnabled, multiple: true, onChange: (e, vol) => setSelectedBigPlans(vol), isOptionEqualToValue: (o, v) => o.refId === v.refId, renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, name: "filterBigPlanRefIds", label: "Generate Only For Big Plans" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 148,
              columnNumber: 312
            }, this) }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 148,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "filterBigPlanRefIds", value: selectedBigPlans.map((p) => p.refId).join(",") }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 149,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/filter_big_plan_ref_ids" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 150,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/stats.tsx",
            lineNumber: 147,
            columnNumber: 99
          }, this),
          isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.JOURNALS) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(Autocomplete_default, { disablePortal: true, id: "filterJournalRefIds", options: journalOptions, sx: autocompleteSingleLineSx, readOnly: !inputsEnabled, disabled: !inputsEnabled, multiple: true, onChange: (e, vol) => setSelectedJournals(vol), isOptionEqualToValue: (o, v) => o.refId === v.refId, renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, name: "filterJournalRefIds", label: "Generate Only For Journals" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 154,
              columnNumber: 312
            }, this) }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 154,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "filterJournalRefIds", value: selectedJournals.map((p) => p.refId).join(",") }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 155,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/filter_journal_ref_ids" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 156,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/stats.tsx",
            lineNumber: 153,
            columnNumber: 98
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 140,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 139,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/tools/stats.tsx",
        lineNumber: 134,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/tools/stats.tsx",
      lineNumber: 123,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Stats Computation", size: "large" }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/stats.tsx",
      lineNumber: 163,
      columnNumber: 7
    }, this),
    loaderData.loadRuns.map((entry) => {
      return /* @__PURE__ */ jsxDEV(Accordion_default, { children: [
        /* @__PURE__ */ jsxDEV(AccordionSummary_default, { expandIcon: /* @__PURE__ */ jsxDEV(ExpandMore_default, {}, void 0, false, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 167,
          columnNumber: 43
        }, this), children: /* @__PURE__ */ jsxDEV(AccordionHeader, { children: [
          "Run from ",
          /* @__PURE__ */ jsxDEV(AppComponentTag, { source: entry.source }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/stats.tsx",
            lineNumber: 169,
            columnNumber: 26
          }, this),
          "with ",
          entry.entity_records.length,
          " entities updated",
          /* @__PURE__ */ jsxDEV(TimeDiffTag, { today: topLevelInfo.today, labelPrefix: "from", collectionTime: entry.created_time }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/stats.tsx",
            lineNumber: 171,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 168,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 167,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(AccordionDetails_default, { children: [
          /* @__PURE__ */ jsxDEV(StatsTargetsSection, { children: [
            "Stats Targets:",
            entry.stats_targets.map((target) => /* @__PURE__ */ jsxDEV(SyncTargetTag, { target }, target, false, {
              fileName: "app/routes/app/workspace/tools/stats.tsx",
              lineNumber: 178,
              columnNumber: 52
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/stats.tsx",
            lineNumber: 176,
            columnNumber: 15
          }, this),
          entry.entity_records.map((record) => /* @__PURE__ */ jsxDEV(EntityCard, { children: /* @__PURE__ */ jsxDEV(EntitySummaryLink, { today: topLevelInfo.today, summary: record }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/stats.tsx",
            lineNumber: 182,
            columnNumber: 19
          }, this) }, record.ref_id, false, {
            fileName: "app/routes/app/workspace/tools/stats.tsx",
            lineNumber: 181,
            columnNumber: 51
          }, this))
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/tools/stats.tsx",
          lineNumber: 175,
          columnNumber: 13
        }, this)
      ] }, entry.ref_id, true, {
        fileName: "app/routes/app/workspace/tools/stats.tsx",
        lineNumber: 166,
        columnNumber: 14
      }, this);
    })
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/tools/stats.tsx",
    lineNumber: 121,
    columnNumber: 10
  }, this);
}
_s(Stats, "FPzJvXbvwSx8jYan4f9zp/cM8gg=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = Stats;
var ErrorBoundary = makeToolErrorBoundary(_c2 = () => `There was an error computing stats! Please try again!`);
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
var StatsTargetsSection = styled_default(Box_default)(({
  theme
}) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  paddingBottom: theme.spacing(1)
}));
_c5 = StatsTargetsSection;
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
$RefreshReg$(_c, "Stats");
$RefreshReg$(_c2, "ErrorBoundary$makeToolErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
$RefreshReg$(_c4, "AccordionHeader");
$RefreshReg$(_c5, "StatsTargetsSection");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Stats as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/tools/stats-OLZKHKWU.js.map
