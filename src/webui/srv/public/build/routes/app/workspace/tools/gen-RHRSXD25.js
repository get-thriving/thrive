import {
  SyncTargetSelect,
  SyncTargetTag
} from "/build/_shared/chunk-W4HWRPGM.js";
import {
  AppComponentTag
} from "/build/_shared/chunk-7SVPUDIO.js";
import {
  AspectMultiSelect
} from "/build/_shared/chunk-T2AVEGZU.js";
import "/build/_shared/chunk-37FGSNWH.js";
import {
  EntitySummaryLink
} from "/build/_shared/chunk-ZK23STK3.js";
import {
  PeriodSelect
} from "/build/_shared/chunk-FBXWU6M6.js";
import {
  PeriodTag
} from "/build/_shared/chunk-HLPWZ3ZO.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import {
  selectZod
} from "/build/_shared/chunk-HVVVLUYY.js";
import {
  ADateTag
} from "/build/_shared/chunk-NBD44M5V.js";
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
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
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
  FormControlLabel_default,
  FormControl_default,
  FormLabel_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default,
  Switch_default,
  TextField_default,
  styled_default
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

// app/routes/app/workspace/tools/gen.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/tools/gen.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/tools/gen.tsx"
  );
  import.meta.hot.lastModified = "1777213342616.5044";
}
var GenFormSchema = external_exports.object({
  gen_even_if_not_modified: import_zodix.CheckboxAsString,
  today: external_exports.optional(external_exports.string()),
  gen_targets: selectZod(external_exports.nativeEnum(import_webapi_client.SyncTarget)),
  period: selectZod(external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod)),
  filter_aspect_ref_ids: selectZod(external_exports.string()),
  filter_habit_ref_ids: selectZod(external_exports.string()),
  filter_chore_ref_ids: selectZod(external_exports.string()),
  filter_metric_ref_ids: selectZod(external_exports.string()),
  filter_person_ref_ids: selectZod(external_exports.string())
});
var handle = {
  displayType: 5 /* TOOL */
};
var shouldRevalidate = standardShouldRevalidate;
function Gen() {
  _s();
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const [selectedHabits, setSelectedHabits] = (0, import_react2.useState)([]);
  const habitOptions = loaderData.summaries.habits?.map((p) => ({
    refId: p.ref_id,
    label: p.name
  })) ?? [];
  const [selectedChores, setSelectedChores] = (0, import_react2.useState)([]);
  const choreOptions = loaderData.summaries.chores?.map((p) => ({
    refId: p.ref_id,
    label: p.name
  })) ?? [];
  const [selectedMetrics, setSelectedMetrics] = (0, import_react2.useState)([]);
  const metricOptions = loaderData.summaries.metrics?.map((p) => ({
    refId: p.ref_id,
    label: p.icon ? `${p.icon} ${p.name}` : p.name
  })) ?? [];
  const [selectedPersons, setSelectedPersons] = (0, import_react2.useState)([]);
  const personOptions = loaderData.summaries.persons?.map((p) => ({
    refId: p.ref_id,
    label: p.name
  })) ?? [];
  return /* @__PURE__ */ jsxDEV(ToolPanel, { children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/gen.tsx",
      lineNumber: 145,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Generation", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "gen-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Generate",
      id: "generate",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/gen.tsx",
      lineNumber: 147,
      columnNumber: 48
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "today", shrink: true, children: "Generation Date" }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 154,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "Generation Date", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultValue: topLevelInfo.today, name: "today" }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 157,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/today" }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 159,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/tools/gen.tsx",
        lineNumber: 153,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Accordion_default, { children: [
        /* @__PURE__ */ jsxDEV(AccordionSummary_default, { expandIcon: /* @__PURE__ */ jsxDEV(ExpandMore_default, {}, void 0, false, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 163,
          columnNumber: 41
        }, this), children: /* @__PURE__ */ jsxDEV(AccordionHeader, { children: "Advanced Options & Filtering" }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 164,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 163,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(AccordionDetails_default, { children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormControlLabel_default, { control: /* @__PURE__ */ jsxDEV(Switch_default, { name: "gen_even_if_not_modified", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultChecked: false }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 170,
              columnNumber: 44
            }, this), label: "Generate Even If Not Modified" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 170,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/gen_even_if_not_modified" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 171,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 169,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "gen_targets", children: "Generation Targets" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 175,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(SyncTargetSelect, { topLevelInfo, labelId: "gen_targets", label: "Generation Targets", name: "gen_targets", readOnly: !inputsEnabled }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 176,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/gen_targets" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 177,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 174,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "period", children: "Generation Period" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 181,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(PeriodSelect, { labelId: "period", label: "Generation Period", name: "period", inputsEnabled, multiSelect: true, defaultValue: Object.values(import_webapi_client.RecurringTaskPeriod) }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 182,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/period" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 183,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 180,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(AspectMultiSelect, { name: "filter_aspect_ref_ids", label: "Generate Only For Aspects", inputsEnabled, disabled: !inputsEnabled, allAspects: loaderData.summaries.aspects ?? [] }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 187,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/filter_aspect_ref_ids" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 188,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 186,
            columnNumber: 99
          }, this),
          isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.HABITS) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(Autocomplete_default, { disablePortal: true, id: "filter_habit_ref_ids", options: habitOptions, sx: autocompleteSingleLineSx, readOnly: !inputsEnabled, disabled: !inputsEnabled, multiple: true, onChange: (e, vol) => setSelectedHabits(vol), isOptionEqualToValue: (o, v) => o.refId === v.refId, renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, name: "filter_habit_ref_ids", label: "Generate Only For Habits" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 192,
              columnNumber: 309
            }, this) }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 192,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "filter_habit_ref_ids", value: selectedHabits.map((p) => p.refId).join(",") }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 193,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/filter_habit_ref_ids" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 194,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 191,
            columnNumber: 96
          }, this),
          isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.CHORES) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(Autocomplete_default, { disablePortal: true, id: "filter_chore_ref_ids", options: choreOptions, sx: autocompleteSingleLineSx, readOnly: !inputsEnabled, disabled: !inputsEnabled, multiple: true, onChange: (e, vol) => setSelectedChores(vol), isOptionEqualToValue: (o, v) => o.refId === v.refId, renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, name: "filter_chore_ref_ids", label: "Generate Only For Chores" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 198,
              columnNumber: 309
            }, this) }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 198,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "filter_chore_ref_ids", value: selectedChores.map((p) => p.refId).join(",") }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 199,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/filter_chore_ref_ids" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 200,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 197,
            columnNumber: 96
          }, this),
          isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.METRICS) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(Autocomplete_default, { disablePortal: true, id: "filter_metric_ref_ids", options: metricOptions, sx: autocompleteSingleLineSx, readOnly: !inputsEnabled, disabled: !inputsEnabled, multiple: true, onChange: (e, vol) => setSelectedMetrics(vol), isOptionEqualToValue: (o, v) => o.refId === v.refId, renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, name: "filter_metric_ref_ids", label: "Generate Only For Metrics" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 204,
              columnNumber: 312
            }, this) }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 204,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "filter_metric_ref_ids", value: selectedMetrics.map((p) => p.refId).join(",") }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 205,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/filter_metric_ref_ids" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 206,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 203,
            columnNumber: 97
          }, this),
          isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.PRM) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(Autocomplete_default, { disablePortal: true, id: "filter_person_ref_ids", options: personOptions, sx: autocompleteSingleLineSx, disabled: !inputsEnabled, readOnly: !inputsEnabled, multiple: true, onChange: (e, vol) => setSelectedPersons(vol), isOptionEqualToValue: (o, v) => o.refId === v.refId, renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, name: "filter_person_ref_ids", label: "Generate Only For Persons" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 210,
              columnNumber: 312
            }, this) }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 210,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "filter_person_ref_ids", value: selectedPersons.map((p) => p.refId).join(",") }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 211,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/filter_person_ref_ids" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 212,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 209,
            columnNumber: 93
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 168,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 167,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/tools/gen.tsx",
        lineNumber: 162,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/tools/gen.tsx",
      lineNumber: 147,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Previous Runs", size: "large" }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/gen.tsx",
      lineNumber: 219,
      columnNumber: 7
    }, this),
    loaderData.loadRuns.entries.map((entry) => {
      return /* @__PURE__ */ jsxDEV(Accordion_default, { children: [
        /* @__PURE__ */ jsxDEV(AccordionSummary_default, { expandIcon: /* @__PURE__ */ jsxDEV(ExpandMore_default, {}, void 0, false, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 223,
          columnNumber: 43
        }, this), children: /* @__PURE__ */ jsxDEV(AccordionHeader, { children: [
          "Run from ",
          /* @__PURE__ */ jsxDEV(AppComponentTag, { source: entry.source }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 225,
            columnNumber: 26
          }, this),
          "with ",
          entry.entity_created_records.length,
          " entities created,",
          " ",
          entry.entity_updated_records.length,
          " entities updated, and",
          " ",
          entry.entity_removed_records.length,
          " entities removed",
          /* @__PURE__ */ jsxDEV(TimeDiffTag, { today: topLevelInfo.today, labelPrefix: "from", collectionTime: entry.created_time }, void 0, false, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 229,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 224,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 223,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(AccordionDetails_default, { children: [
          /* @__PURE__ */ jsxDEV(GenTargetsSection, { children: [
            "Generate even if not modified:",
            " ",
            entry.gen_even_if_not_modified ? "\u2705" : "\u26D4"
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 234,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(GenTargetsSection, { children: [
            "Generate for: ",
            /* @__PURE__ */ jsxDEV(ADateTag, { date: entry.today, label: "" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 239,
              columnNumber: 31
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 238,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(GenTargetsSection, { children: [
            "Gen targets:",
            entry.gen_targets.map((target) => /* @__PURE__ */ jsxDEV(SyncTargetTag, { target }, target, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 243,
              columnNumber: 50
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 241,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(GenTargetsSection, { children: [
            "Period:",
            " ",
            entry.period && entry.period.map((p) => /* @__PURE__ */ jsxDEV(PeriodTag, { period: p }, p, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 247,
              columnNumber: 56
            }, this)),
            !entry.period && /* @__PURE__ */ jsxDEV(SlimChip, { label: "All" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 248,
              columnNumber: 35
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 245,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(GenTargetsSection, { children: [
            "Filter aspects ref ids:",
            " ",
            entry.filter_aspect_ref_ids && entry.filter_aspect_ref_ids.map((refId) => /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: refId }, refId, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 252,
              columnNumber: 90
            }, this)),
            !entry.filter_aspect_ref_ids && /* @__PURE__ */ jsxDEV(SlimChip, { label: "All" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 253,
              columnNumber: 50
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 250,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(GenTargetsSection, { children: [
            "Filter habits ref ids:",
            " ",
            entry.filter_habit_ref_ids && entry.filter_habit_ref_ids.map((refId) => /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: refId }, refId, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 257,
              columnNumber: 88
            }, this)),
            !entry.filter_habit_ref_ids && /* @__PURE__ */ jsxDEV(SlimChip, { label: "All" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 258,
              columnNumber: 49
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 255,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(GenTargetsSection, { children: [
            "Filter chores ref ids:",
            " ",
            entry.filter_chore_ref_ids && entry.filter_chore_ref_ids.map((refId) => /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: refId }, refId, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 262,
              columnNumber: 88
            }, this)),
            !entry.filter_chore_ref_ids && /* @__PURE__ */ jsxDEV(SlimChip, { label: "All" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 263,
              columnNumber: 49
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 260,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(GenTargetsSection, { children: [
            "Filter metrics ref ids:",
            " ",
            entry.filter_metric_ref_ids && entry.filter_metric_ref_ids.map((refId) => /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: refId }, refId, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 267,
              columnNumber: 90
            }, this)),
            !entry.filter_metric_ref_ids && /* @__PURE__ */ jsxDEV(SlimChip, { label: "All" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 268,
              columnNumber: 50
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 265,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(GenTargetsSection, { children: [
            "Filter persons ref ids:",
            " ",
            entry.filter_person_ref_ids && entry.filter_person_ref_ids.map((refId) => /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: refId }, refId, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 272,
              columnNumber: 90
            }, this)),
            !entry.filter_person_ref_ids && /* @__PURE__ */ jsxDEV(SlimChip, { label: "All" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 273,
              columnNumber: 50
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 270,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(GenTargetsSection, { children: [
            "Filter Slack task ref ids:",
            " ",
            entry.filter_slack_task_ref_ids && entry.filter_slack_task_ref_ids.map((refId) => /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: refId }, refId, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 277,
              columnNumber: 98
            }, this)),
            !entry.filter_slack_task_ref_ids && /* @__PURE__ */ jsxDEV(SlimChip, { label: "All" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 278,
              columnNumber: 54
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 275,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(GenTargetsSection, { children: [
            "Filter email task ref ids:",
            " ",
            entry.filter_email_task_ref_ids && entry.filter_email_task_ref_ids.map((refId) => /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: refId }, refId, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 282,
              columnNumber: 98
            }, this)),
            !entry.filter_email_task_ref_ids && /* @__PURE__ */ jsxDEV(SlimChip, { label: "All" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 283,
              columnNumber: 54
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 280,
            columnNumber: 15
          }, this),
          entry.entity_created_records.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Created entities", size: "medium" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 287,
              columnNumber: 19
            }, this),
            entry.entity_created_records.map((record) => /* @__PURE__ */ jsxDEV(EntityCard, { children: /* @__PURE__ */ jsxDEV(EntitySummaryLink, { today: topLevelInfo.today, summary: record }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 290,
              columnNumber: 23
            }, this) }, record.ref_id, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 289,
              columnNumber: 63
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 286,
            columnNumber: 59
          }, this),
          entry.entity_updated_records.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Updated entities", size: "medium" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 295,
              columnNumber: 19
            }, this),
            entry.entity_updated_records.map((record) => /* @__PURE__ */ jsxDEV(EntityCard, { children: /* @__PURE__ */ jsxDEV(EntitySummaryLink, { today: topLevelInfo.today, summary: record }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 298,
              columnNumber: 23
            }, this) }, record.ref_id, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 297,
              columnNumber: 63
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 294,
            columnNumber: 59
          }, this),
          entry.entity_removed_records.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Removed entities", size: "medium" }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 303,
              columnNumber: 19
            }, this),
            entry.entity_removed_records.map((record) => /* @__PURE__ */ jsxDEV(EntityCard, { children: /* @__PURE__ */ jsxDEV(EntitySummaryLink, { today: topLevelInfo.today, summary: record, removed: true }, void 0, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 306,
              columnNumber: 23
            }, this) }, record.ref_id, false, {
              fileName: "app/routes/app/workspace/tools/gen.tsx",
              lineNumber: 305,
              columnNumber: 63
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/tools/gen.tsx",
            lineNumber: 302,
            columnNumber: 59
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/tools/gen.tsx",
          lineNumber: 233,
          columnNumber: 13
        }, this)
      ] }, entry.ref_id, true, {
        fileName: "app/routes/app/workspace/tools/gen.tsx",
        lineNumber: 222,
        columnNumber: 14
      }, this);
    })
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/tools/gen.tsx",
    lineNumber: 144,
    columnNumber: 10
  }, this);
}
_s(Gen, "pyrHJJDwxBZrlrFOVzHHOKJcMmI=", false, function() {
  return [useNavigation, useLoaderDataSafeForAnimation, useActionData];
});
_c = Gen;
var ErrorBoundary = makeToolErrorBoundary(_c2 = () => `There was an error generating tasks! Please try again!`);
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
var GenTargetsSection = styled_default(Box_default)(({
  theme
}) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  paddingBottom: theme.spacing(1)
}));
_c5 = GenTargetsSection;
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
$RefreshReg$(_c, "Gen");
$RefreshReg$(_c2, "ErrorBoundary$makeToolErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
$RefreshReg$(_c4, "AccordionHeader");
$RefreshReg$(_c5, "GenTargetsSection");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Gen as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/tools/gen-RHRSXD25.js.map
