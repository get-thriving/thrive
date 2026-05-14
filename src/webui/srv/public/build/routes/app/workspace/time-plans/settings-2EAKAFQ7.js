import {
  PeriodSelect
} from "/build/_shared/chunk-FBXWU6M6.js";
import {
  periodName
} from "/build/_shared/chunk-HVU6TG3B.js";
import {
  selectZod
} from "/build/_shared/chunk-HVVVLUYY.js";
import {
  InboxTaskStack
} from "/build/_shared/chunk-IFDICYHD.js";
import "/build/_shared/chunk-YVDLHOTH.js";
import "/build/_shared/chunk-ZNIVMWFF.js";
import "/build/_shared/chunk-BOZSZ6DZ.js";
import "/build/_shared/chunk-Q4OQDEZG.js";
import "/build/_shared/chunk-U5MVWZEK.js";
import "/build/_shared/chunk-HGSZOXV4.js";
import {
  DifficultySelect,
  EisenhowerSelect
} from "/build/_shared/chunk-T6GSSEVE.js";
import "/build/_shared/chunk-5CBAK2HS.js";
import "/build/_shared/chunk-NVWDLS2H.js";
import "/build/_shared/chunk-4TWETDNJ.js";
import "/build/_shared/chunk-NBD44M5V.js";
import "/build/_shared/chunk-NLPUBZ3T.js";
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
import "/build/_shared/chunk-Z3RPM676.js";
import "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  BranchPanel,
  makeBranchErrorBoundary
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
import "/build/_shared/chunk-43PAR6MS.js";
import {
  Divider_default,
  FormControl_default,
  FormLabel_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default,
  ToggleButtonGroup_default,
  ToggleButton_default,
  Typography_default
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

// app/routes/app/workspace/time-plans/settings.tsx
var import_webapi_client3 = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist2());
var import_react3 = __toESM(require_react());

// ../core/jupiter/core/time_plans/component/generation-approach-select.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);

// ../core/jupiter/core/time_plans/generation-approach.ts
var import_webapi_client = __toESM(require_dist(), 1);
function approachName(approach, short) {
  switch (approach) {
    case import_webapi_client.TimePlanGenerationApproach.BOTH_PLAN_AND_TASK:
      return short ? "Both" : "Both Plan and Task";
    case import_webapi_client.TimePlanGenerationApproach.ONLY_PLAN:
      return short ? "Plan" : "Only Plan";
    case import_webapi_client.TimePlanGenerationApproach.NONE:
      return short ? "None" : "None";
  }
}

// ../core/jupiter/core/time_plans/component/generation-approach-select.tsx
function TimePlanGenerationApproachSelect(props) {
  const [approach, setApproach] = (0, import_react.useState)(
    props.defaultValue || props.value || import_webapi_client2.TimePlanGenerationApproach.BOTH_PLAN_AND_TASK
  );
  const isBigScreen = useBigScreen();
  (0, import_react.useEffect)(() => {
    if (props.value !== void 0) {
      setApproach(props.value);
    }
  }, [props.value]);
  function handleChangeApproach(_, newApproach) {
    if (newApproach === null) {
      return;
    }
    setApproach(newApproach);
    if (props.onChange) {
      props.onChange(newApproach);
    }
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      ToggleButtonGroup_default,
      {
        value: approach,
        exclusive: true,
        fullWidth: true,
        onChange: handleChangeApproach,
        children: [
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "approach-both",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.TimePlanGenerationApproach.BOTH_PLAN_AND_TASK,
              children: approachName(
                import_webapi_client2.TimePlanGenerationApproach.BOTH_PLAN_AND_TASK,
                !isBigScreen
              )
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/time_plans/component/generation-approach-select.tsx",
              lineNumber: 53,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "approach-plan",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.TimePlanGenerationApproach.ONLY_PLAN,
              children: approachName(import_webapi_client2.TimePlanGenerationApproach.ONLY_PLAN, !isBigScreen)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/time_plans/component/generation-approach-select.tsx",
              lineNumber: 64,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "approach-none",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.TimePlanGenerationApproach.NONE,
              children: approachName(import_webapi_client2.TimePlanGenerationApproach.NONE, !isBigScreen)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/time_plans/component/generation-approach-select.tsx",
              lineNumber: 72,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/time_plans/component/generation-approach-select.tsx",
        lineNumber: 47,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { name: props.name, type: "hidden", value: approach }, void 0, false, {
      fileName: "../core/jupiter/core/time_plans/component/generation-approach-select.tsx",
      lineNumber: 81,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/time_plans/component/generation-approach-select.tsx",
    lineNumber: 46,
    columnNumber: 5
  }, this);
}

// app/routes/app/workspace/time-plans/settings.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/time-plans/settings.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/time-plans/settings.tsx"
  );
  import.meta.hot.lastModified = "1777213342612.753";
}
var ParamsSchema = external_exports.object({});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  periods: selectZod(external_exports.nativeEnum(import_webapi_client3.RecurringTaskPeriod)),
  generationApproach: external_exports.nativeEnum(import_webapi_client3.TimePlanGenerationApproach),
  generationInAdvanceDaysForDaily: external_exports.coerce.number().optional(),
  generationInAdvanceDaysForWeekly: external_exports.coerce.number().optional(),
  generationInAdvanceDaysForMonthly: external_exports.coerce.number().optional(),
  generationInAdvanceDaysForQuarterly: external_exports.coerce.number().optional(),
  generationInAdvanceDaysForYearly: external_exports.coerce.number().optional(),
  planningTaskEisen: external_exports.nativeEnum(import_webapi_client3.Eisen).optional(),
  planningTaskDifficulty: external_exports.nativeEnum(import_webapi_client3.Difficulty).optional()
}), external_exports.object({
  intent: external_exports.literal("regen")
})]);
var handle = {
  displayType: 2 /* BRANCH */
};
var shouldRevalidate = standardShouldRevalidate;
function TimePlansSettings() {
  _s();
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const isBigScreen = useBigScreen();
  const topLevelInfo = (0, import_react3.useContext)(TopLevelInfoContext);
  const [periods, setPeriods] = (0, import_react3.useState)(loaderData.periods);
  const [approach, setApproach] = (0, import_react3.useState)(loaderData.generationApproach);
  const inputsEnabled = navigation.state === "idle";
  (0, import_react3.useEffect)(() => {
    setPeriods(loaderData.periods);
    setApproach(loaderData.generationApproach);
  }, [loaderData]);
  return /* @__PURE__ */ jsxDEV(BranchPanel, { returnLocation: "/app/workspace/time-plans", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/time-plans/settings.tsx",
      lineNumber: 163,
      columnNumber: 7
    }, this),
    isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client3.WorkspaceFeature.TIME_PLANS) && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(SectionCard, { id: "time-plans-settings", title: "Settings", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "time-plans-settings-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
        id: "time-plans-settings-save",
        text: "Save",
        value: "update",
        highlight: true
      }), ActionSingle({
        id: "time-plans-settings-regen",
        text: "Regen",
        value: "regen"
      })] }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/settings.tsx",
        lineNumber: 165,
        columnNumber: 75
      }, this), children: [
        /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, children: [
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "periods", children: "Periods You Want To Plan" }, void 0, false, {
              fileName: "app/routes/app/workspace/time-plans/settings.tsx",
              lineNumber: 177,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(PeriodSelect, { labelId: "periods", label: "Periods", name: "periods", multiSelect: true, inputsEnabled, value: periods, onChange: (newPeriods) => {
              setPeriods(newPeriods);
            } }, void 0, false, {
              fileName: "app/routes/app/workspace/time-plans/settings.tsx",
              lineNumber: 178,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/periods" }, void 0, false, {
              fileName: "app/routes/app/workspace/time-plans/settings.tsx",
              lineNumber: 181,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/time-plans/settings.tsx",
            lineNumber: 176,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "generationApproach", children: "Generation Approach" }, void 0, false, {
              fileName: "app/routes/app/workspace/time-plans/settings.tsx",
              lineNumber: 185,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(TimePlanGenerationApproachSelect, { name: "generationApproach", inputsEnabled, value: approach, onChange: setApproach }, void 0, false, {
              fileName: "app/routes/app/workspace/time-plans/settings.tsx",
              lineNumber: 188,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/generation_approach" }, void 0, false, {
              fileName: "app/routes/app/workspace/time-plans/settings.tsx",
              lineNumber: 189,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/time-plans/settings.tsx",
            lineNumber: 184,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/settings.tsx",
          lineNumber: 175,
          columnNumber: 13
        }, this),
        approach === import_webapi_client3.TimePlanGenerationApproach.BOTH_PLAN_AND_TASK && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(Divider_default, { children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: "Planning Inbox Task Properties" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/settings.tsx",
            lineNumber: 195,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/settings.tsx",
            lineNumber: 194,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, children: [
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
              alignSelf: "flex-end"
            }, children: [
              /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "planningTaskEisen", children: "Planning Task Eisen" }, void 0, false, {
                fileName: "app/routes/app/workspace/time-plans/settings.tsx",
                lineNumber: 204,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(EisenhowerSelect, { name: "planningTaskEisen", inputsEnabled, defaultValue: loaderData.planningTaskGenParams?.eisen ?? import_webapi_client3.Eisen.IMPORTANT }, void 0, false, {
                fileName: "app/routes/app/workspace/time-plans/settings.tsx",
                lineNumber: 207,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/planning_task_eisen" }, void 0, false, {
                fileName: "app/routes/app/workspace/time-plans/settings.tsx",
                lineNumber: 208,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/time-plans/settings.tsx",
              lineNumber: 201,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
              alignSelf: "flex-end"
            }, children: [
              /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "planningTaskDifficulty", children: "Planning Task Difficulty" }, void 0, false, {
                fileName: "app/routes/app/workspace/time-plans/settings.tsx",
                lineNumber: 214,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(DifficultySelect, { name: "planningTaskDifficulty", inputsEnabled, defaultValue: loaderData.planningTaskGenParams?.difficulty ?? import_webapi_client3.Difficulty.EASY }, void 0, false, {
                fileName: "app/routes/app/workspace/time-plans/settings.tsx",
                lineNumber: 217,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/planning_task_difficulty" }, void 0, false, {
                fileName: "app/routes/app/workspace/time-plans/settings.tsx",
                lineNumber: 218,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/time-plans/settings.tsx",
              lineNumber: 211,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/time-plans/settings.tsx",
            lineNumber: 200,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/settings.tsx",
          lineNumber: 193,
          columnNumber: 76
        }, this),
        (approach === import_webapi_client3.TimePlanGenerationApproach.BOTH_PLAN_AND_TASK || approach === import_webapi_client3.TimePlanGenerationApproach.ONLY_PLAN) && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(Divider_default, { children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: "Days To Generate In Advance" }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/settings.tsx",
            lineNumber: 225,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/settings.tsx",
            lineNumber: 224,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, children: Object.values(import_webapi_client3.RecurringTaskPeriod).map((period) => {
            if (!periods.includes(period)) {
              return null;
            }
            return /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: `generationInAdvanceDaysFor${period.charAt(0).toUpperCase() + period.slice(1)}`, children: [
                "For ",
                periodName(period)
              ] }, void 0, true, {
                fileName: "app/routes/app/workspace/time-plans/settings.tsx",
                lineNumber: 236,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV(OutlinedInput_default, { name: `generationInAdvanceDaysFor${period.charAt(0).toUpperCase() + period.slice(1)}`, label: `For ${periodName(period)}`, disabled: !inputsEnabled, defaultValue: loaderData.generationInAdvanceDays[period] ?? 1 }, void 0, false, {
                fileName: "app/routes/app/workspace/time-plans/settings.tsx",
                lineNumber: 239,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: `/generation_in_advance_days` }, void 0, false, {
                fileName: "app/routes/app/workspace/time-plans/settings.tsx",
                lineNumber: 240,
                columnNumber: 25
              }, this)
            ] }, period, true, {
              fileName: "app/routes/app/workspace/time-plans/settings.tsx",
              lineNumber: 235,
              columnNumber: 22
            }, this);
          }) }, void 0, false, {
            fileName: "app/routes/app/workspace/time-plans/settings.tsx",
            lineNumber: 230,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/time-plans/settings.tsx",
          lineNumber: 223,
          columnNumber: 131
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/time-plans/settings.tsx",
        lineNumber: 165,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { id: "time-plans-generated-time-plans-and-planning-tasks", title: "Generated Planning Tasks", children: /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo, showOptions: {
        showStatus: true,
        showEisen: true,
        showDifficulty: true,
        showDueDate: true
      }, inboxTasks: loaderData.planningTasks }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/settings.tsx",
        lineNumber: 248,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/time-plans/settings.tsx",
        lineNumber: 247,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/time-plans/settings.tsx",
      lineNumber: 164,
      columnNumber: 92
    }, this)
  ] }, "time-plans/settings", true, {
    fileName: "app/routes/app/workspace/time-plans/settings.tsx",
    lineNumber: 162,
    columnNumber: 10
  }, this);
}
_s(TimePlansSettings, "j26XxXDDtu4X7eSz0GydyooAFT8=", false, function() {
  return [useNavigation, useLoaderDataSafeForAnimation, useActionData, useBigScreen];
});
_c = TimePlansSettings;
var ErrorBoundary = makeBranchErrorBoundary("/app/workspace/time-plans", ParamsSchema, {
  notFound: () => `Could not find the time plans settings!`,
  error: () => `There was an error loading the time plans settings! Please try again!`
});
var _c;
$RefreshReg$(_c, "TimePlansSettings");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  TimePlansSettings as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/time-plans/settings-2EAKAFQ7.js.map
