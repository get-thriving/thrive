import {
  BirthYearSelect
} from "/build/_shared/chunk-6KSNNK5R.js";
import {
  PeriodSelect
} from "/build/_shared/chunk-FBXWU6M6.js";
import {
  BirthdaySelect
} from "/build/_shared/chunk-LR4KQCWM.js";
import "/build/_shared/chunk-IRHCW4HP.js";
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

// app/routes/app/workspace/life-plan/settings.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/life-plan/settings.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/life-plan/settings.tsx"
  );
  import.meta.hot.lastModified = "1777213342594.2585";
}
var ParamsSchema = external_exports.object({});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  birthday: external_exports.string(),
  birthYear: external_exports.string().transform((value) => parseInt(value, 10))
}), external_exports.object({
  intent: external_exports.literal("update-eval-settings"),
  evalPeriods: selectZod(external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod)),
  evalApproach: external_exports.nativeEnum(import_webapi_client.LifePlanEvalApproach),
  evalTaskGenerationInAdvanceDaysForDaily: external_exports.coerce.number().optional(),
  evalTaskGenerationInAdvanceDaysForWeekly: external_exports.coerce.number().optional(),
  evalTaskGenerationInAdvanceDaysForMonthly: external_exports.coerce.number().optional(),
  evalTaskGenerationInAdvanceDaysForQuarterly: external_exports.coerce.number().optional(),
  evalTaskGenerationInAdvanceDaysForYearly: external_exports.coerce.number().optional(),
  evalTaskEisen: external_exports.nativeEnum(import_webapi_client.Eisen).optional(),
  evalTaskDifficulty: external_exports.nativeEnum(import_webapi_client.Difficulty).optional()
}), external_exports.object({
  intent: external_exports.literal("regen")
})]);
var ALLOWED_EVAL_PERIODS = [import_webapi_client.RecurringTaskPeriod.MONTHLY, import_webapi_client.RecurringTaskPeriod.QUARTERLY, import_webapi_client.RecurringTaskPeriod.YEARLY];
var handle = {
  displayType: 2 /* BRANCH */
};
var shouldRevalidate = standardShouldRevalidate;
function LifePlanSettings() {
  _s();
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const isBigScreen = useBigScreen();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const [evalPeriods, setEvalPeriods] = (0, import_react2.useState)(loaderData.evalPeriods.filter((period) => ALLOWED_EVAL_PERIODS.includes(period)));
  const [evalApproach, setEvalApproach] = (0, import_react2.useState)(loaderData.evalApproach);
  (0, import_react2.useEffect)(() => {
    setEvalPeriods(loaderData.evalPeriods.filter((period) => ALLOWED_EVAL_PERIODS.includes(period)));
    setEvalApproach(loaderData.evalApproach);
  }, [loaderData]);
  return /* @__PURE__ */ jsxDEV(BranchPanel, { returnLocation: "/app/workspace/life-plan", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/settings.tsx",
      lineNumber: 187,
      columnNumber: 7
    }, this),
    isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(SectionCard, { id: "life-plan-settings", title: "Settings", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "life-plan-settings-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
        id: "life-plan-settings-save",
        text: "Save",
        value: "update",
        highlight: true
      })] }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/settings.tsx",
        lineNumber: 189,
        columnNumber: 74
      }, this), children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: "row", children: [
        /* @__PURE__ */ jsxDEV(BirthdaySelect, { name: "birthday", allowNoneBirthday: false, inputsEnabled, initialValue: loaderData.lifePlan.birthday }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/settings.tsx",
          lineNumber: 196,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(BirthYearSelect, { label: "Your Birth Year", name: "birthYear", inputsEnabled, defaultValue: loaderData.lifePlan.birth_year, allowNoneBirthYear: false }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/settings.tsx",
          lineNumber: 198,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/settings.tsx",
          lineNumber: 197,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/birthday" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/settings.tsx",
          lineNumber: 200,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/birth_year" }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/settings.tsx",
          lineNumber: 201,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/settings.tsx",
        lineNumber: 195,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/settings.tsx",
        lineNumber: 189,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { id: "life-plan-eval-settings", title: "Eval Settings", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "life-plan-eval-settings-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
        id: "life-plan-eval-settings-save",
        text: "Save",
        value: "update-eval-settings",
        highlight: true
      }), ActionSingle({
        id: "life-plan-eval-settings-regen",
        text: "Regen",
        value: "regen"
      })] }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/settings.tsx",
        lineNumber: 205,
        columnNumber: 84
      }, this), children: [
        /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, children: [
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "evalApproach", children: "Generation Approach" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 217,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(ToggleButtonGroup_default, { value: evalApproach, exclusive: true, fullWidth: true, onChange: (_, newApproach) => newApproach !== null && setEvalApproach(newApproach), children: [
              /* @__PURE__ */ jsxDEV(ToggleButton_default, { size: "small", id: "approach-task", disabled: !inputsEnabled, value: import_webapi_client.LifePlanEvalApproach.TASK, children: "Generate Eval Task" }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                lineNumber: 219,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(ToggleButton_default, { size: "small", id: "approach-none", disabled: !inputsEnabled, value: import_webapi_client.LifePlanEvalApproach.NONE, children: "None" }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                lineNumber: 222,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 218,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("input", { name: "evalApproach", type: "hidden", value: evalApproach }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 226,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/eval_approach" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 227,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/life-plan/settings.tsx",
            lineNumber: 216,
            columnNumber: 15
          }, this),
          evalApproach !== import_webapi_client.LifePlanEvalApproach.NONE && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "evalPeriods", children: "Periods You Want To Evaluate" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 231,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(PeriodSelect, { labelId: "evalPeriods", label: "Periods", name: "evalPeriods", multiSelect: true, inputsEnabled, allowedValues: ALLOWED_EVAL_PERIODS, value: evalPeriods, onChange: (newPeriods) => {
              setEvalPeriods(newPeriods);
            } }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 234,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/eval_periods" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 237,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/life-plan/settings.tsx",
            lineNumber: 230,
            columnNumber: 62
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/life-plan/settings.tsx",
          lineNumber: 215,
          columnNumber: 13
        }, this),
        evalApproach === import_webapi_client.LifePlanEvalApproach.TASK && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, children: [
          /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, sx: {
            flex: 1
          }, children: [
            /* @__PURE__ */ jsxDEV(Divider_default, { children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: "Eval Task Properties" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 247,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 246,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "evalTaskEisen", children: "Eval Task Eisen" }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                lineNumber: 251,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(EisenhowerSelect, { name: "evalTaskEisen", inputsEnabled, defaultValue: loaderData.evalTaskGenParams?.eisen ?? import_webapi_client.Eisen.IMPORTANT }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                lineNumber: 252,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/eval_task_eisen" }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                lineNumber: 253,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 250,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "evalTaskDifficulty", children: "Eval Task Difficulty" }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                lineNumber: 257,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(DifficultySelect, { name: "evalTaskDifficulty", inputsEnabled, defaultValue: loaderData.evalTaskGenParams?.difficulty ?? import_webapi_client.Difficulty.EASY }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                lineNumber: 260,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/eval_task_difficulty" }, void 0, false, {
                fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                lineNumber: 261,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 256,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/life-plan/settings.tsx",
            lineNumber: 243,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, sx: {
            flex: 1
          }, children: [
            /* @__PURE__ */ jsxDEV(Divider_default, { children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: "Days To Generate In Advance" }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 269,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/app/workspace/life-plan/settings.tsx",
              lineNumber: 268,
              columnNumber: 21
            }, this),
            ALLOWED_EVAL_PERIODS.map((period) => {
              if (!evalPeriods.includes(period)) {
                return null;
              }
              return /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
                /* @__PURE__ */ jsxDEV(InputLabel_default, { id: `evalTaskGenerationInAdvanceDaysFor${period.charAt(0).toUpperCase() + period.slice(1)}`, children: [
                  "For ",
                  periodName(period)
                ] }, void 0, true, {
                  fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                  lineNumber: 279,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV(OutlinedInput_default, { name: `evalTaskGenerationInAdvanceDaysFor${period.charAt(0).toUpperCase() + period.slice(1)}`, label: `For ${periodName(period)}`, disabled: !inputsEnabled, defaultValue: loaderData.evalTaskGenerationInAdvanceDays[period] ?? 1 }, void 0, false, {
                  fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                  lineNumber: 282,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: `/eval_task_generation_in_advance_days` }, void 0, false, {
                  fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                  lineNumber: 283,
                  columnNumber: 27
                }, this)
              ] }, period, true, {
                fileName: "app/routes/app/workspace/life-plan/settings.tsx",
                lineNumber: 278,
                columnNumber: 24
              }, this);
            })
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/life-plan/settings.tsx",
            lineNumber: 265,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/life-plan/settings.tsx",
          lineNumber: 242,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/life-plan/settings.tsx",
          lineNumber: 241,
          columnNumber: 60
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/life-plan/settings.tsx",
        lineNumber: 205,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { id: "life-plan-eval-tasks", title: "Generated Eval Tasks", children: /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo, showOptions: {
        showStatus: true,
        showEisen: true,
        showDifficulty: true,
        showDueDate: true
      }, inboxTasks: loaderData.evalTasks }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/settings.tsx",
        lineNumber: 292,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/life-plan/settings.tsx",
        lineNumber: 291,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/life-plan/settings.tsx",
      lineNumber: 188,
      columnNumber: 91
    }, this)
  ] }, "life-plan/settings", true, {
    fileName: "app/routes/app/workspace/life-plan/settings.tsx",
    lineNumber: 186,
    columnNumber: 10
  }, this);
}
_s(LifePlanSettings, "MWLVUkqzAXwc+4OS3YnKEeIpGN8=", false, function() {
  return [useNavigation, useLoaderDataSafeForAnimation, useActionData, useBigScreen];
});
_c = LifePlanSettings;
var ErrorBoundary = makeBranchErrorBoundary("/app/workspace/life-plan", ParamsSchema, {
  notFound: () => `Could not find the life plan settings!`,
  error: () => `There was an error loading the life plan settings! Please try again!`
});
var _c;
$RefreshReg$(_c, "LifePlanSettings");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  LifePlanSettings as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/life-plan/settings-VEPYSMMO.js.map
