import {
  HabitRepeatStrategySelect
} from "/build/_shared/chunk-FVCYD4VD.js";
import {
  LifePlanAssociations
} from "/build/_shared/chunk-OE7VPYTO.js";
import "/build/_shared/chunk-6SJK4Y2K.js";
import "/build/_shared/chunk-OIJ3E3DH.js";
import "/build/_shared/chunk-OLMKSGLM.js";
import "/build/_shared/chunk-ZFN6H2GY.js";
import {
  lifePlanBirthdayDate
} from "/build/_shared/chunk-HQECWRQJ.js";
import "/build/_shared/chunk-WCBSHJX3.js";
import "/build/_shared/chunk-37FGSNWH.js";
import "/build/_shared/chunk-IRHCW4HP.js";
import {
  RecurringTaskGenParamsBlock
} from "/build/_shared/chunk-WKUBLS6Z.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import {
  IsKeySelect
} from "/build/_shared/chunk-SWYHSSUT.js";
import "/build/_shared/chunk-T6GSSEVE.js";
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
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
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
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
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

// app/routes/app/workspace/habits/new.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/habits/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/habits/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113156.1323";
}
var ParamsSchema = external_exports.object({});
var CreateFormSchema = external_exports.object({
  name: external_exports.string(),
  aspect: external_exports.string().optional(),
  chapter: external_exports.string().optional(),
  goal: external_exports.string().optional(),
  period: external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod),
  isKey: import_zodix.CheckboxAsString,
  eisen: external_exports.nativeEnum(import_webapi_client.Eisen),
  difficulty: external_exports.nativeEnum(import_webapi_client.Difficulty),
  actionableFromDay: external_exports.string().optional(),
  actionableFromMonth: external_exports.string().optional(),
  dueAtDay: external_exports.string().optional(),
  dueAtMonth: external_exports.string().optional(),
  mustDo: import_zodix.CheckboxAsString,
  skipRule: external_exports.string().optional(),
  repeatsStrategy: external_exports.nativeEnum(import_webapi_client.HabitRepeatsStrategy).or(external_exports.literal("none")).optional(),
  repeatsInPeriodCount: external_exports.string().optional()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewHabit() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const birthdayDate = loaderData.lifePlan ? lifePlanBirthdayDate(loaderData.lifePlan) : null;
  const [selectedAspect, setSelectedAspect] = (0, import_react2.useState)(loaderData.rootAspect?.ref_id ?? "");
  const [selectedPeriod, setSelectedPeriod] = (0, import_react2.useState)(import_webapi_client.RecurringTaskPeriod.DAILY);
  const [selectedRepeatsStrategy, setSelectedRepeatsStrategy] = (0, import_react2.useState)("none");
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "habits/new", returnLocation: "/app/workspace/habits", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/habits/new.tsx",
      lineNumber: 134,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Habit", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "habit-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "habit-create",
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/habits/new.tsx",
      lineNumber: 135,
      columnNumber: 87
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, spacing: 1, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 3
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/habits/new.tsx",
            lineNumber: 145,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
            fileName: "app/routes/app/workspace/habits/new.tsx",
            lineNumber: 146,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/habits/new.tsx",
            lineNumber: 147,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/habits/new.tsx",
          lineNumber: 142,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 1
        }, children: [
          /* @__PURE__ */ jsxDEV(IsKeySelect, { name: "isKey", defaultValue: false, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/habits/new.tsx",
            lineNumber: 153,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/is_key" }, void 0, false, {
            fileName: "app/routes/app/workspace/habits/new.tsx",
            lineNumber: 154,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/habits/new.tsx",
          lineNumber: 150,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/habits/new.tsx",
        lineNumber: 141,
        columnNumber: 9
      }, this),
      isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(LifePlanAssociations, { inputsEnabled, allAspects: loaderData.allAspects ?? [], aspectValue: selectedAspect, onAspectChange: setSelectedAspect, allChapters: loaderData.allChapters ?? [], allGoals: loaderData.allGoals ?? [], birthday: birthdayDate, today: aDateToDate(topLevelInfo.today), allMilestones: loaderData.allMilestones ?? [] }, void 0, false, {
          fileName: "app/routes/app/workspace/habits/new.tsx",
          lineNumber: 159,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/aspect_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/habits/new.tsx",
          lineNumber: 160,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/chapter_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/habits/new.tsx",
          lineNumber: 161,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/goal_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/habits/new.tsx",
          lineNumber: 162,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/habits/new.tsx",
        lineNumber: 158,
        columnNumber: 93
      }, this),
      /* @__PURE__ */ jsxDEV(RecurringTaskGenParamsBlock, { inputsEnabled, allowSkipRule: true, period: selectedPeriod, onChangePeriod: (newPeriod) => {
        if (newPeriod === "none") {
          setSelectedPeriod(import_webapi_client.RecurringTaskPeriod.DAILY);
        } else {
          setSelectedPeriod(newPeriod);
        }
      }, eisen: import_webapi_client.Eisen.REGULAR, difficulty: import_webapi_client.Difficulty.EASY, actionableFromDay: null, actionableFromMonth: null, dueAtDay: null, dueAtMonth: null, skipRule: null, actionData }, void 0, false, {
        fileName: "app/routes/app/workspace/habits/new.tsx",
        lineNumber: 165,
        columnNumber: 9
      }, this),
      selectedPeriod !== import_webapi_client.RecurringTaskPeriod.DAILY && /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 2, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 3
        }, children: /* @__PURE__ */ jsxDEV(HabitRepeatStrategySelect, { name: "repeatsStrategy", inputsEnabled, allowNone: true, value: selectedRepeatsStrategy, onChange: (newStrategy) => setSelectedRepeatsStrategy(newStrategy) }, void 0, false, {
          fileName: "app/routes/app/workspace/habits/new.tsx",
          lineNumber: 177,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/habits/new.tsx",
          lineNumber: 174,
          columnNumber: 13
        }, this),
        selectedRepeatsStrategy !== "none" && /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 1
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "repeatsInPeriodCount", children: "Repeats In Period [Optional]" }, void 0, false, {
            fileName: "app/routes/app/workspace/habits/new.tsx",
            lineNumber: 182,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Repeats In Period", name: "repeatsInPeriodCount", readOnly: !inputsEnabled, sx: {
            height: "100%"
          } }, void 0, false, {
            fileName: "app/routes/app/workspace/habits/new.tsx",
            lineNumber: 185,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/repeats_in_period_count" }, void 0, false, {
            fileName: "app/routes/app/workspace/habits/new.tsx",
            lineNumber: 188,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/habits/new.tsx",
          lineNumber: 179,
          columnNumber: 52
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/habits/new.tsx",
        lineNumber: 173,
        columnNumber: 58
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/habits/new.tsx",
      lineNumber: 135,
      columnNumber: 7
    }, this)
  ] }, "habits/new", true, {
    fileName: "app/routes/app/workspace/habits/new.tsx",
    lineNumber: 133,
    columnNumber: 10
  }, this);
}
_s(NewHabit, "z5ggE8DxtYs7CM0DjF2COQMwKOg=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = NewHabit;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/habits", ParamsSchema, {
  notFound: () => `Could not find the habit!`,
  error: () => `There was an error creating the habit! Please try again!`
});
var _c;
$RefreshReg$(_c, "NewHabit");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewHabit as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/habits/new-TCJ6RVFS.js.map
