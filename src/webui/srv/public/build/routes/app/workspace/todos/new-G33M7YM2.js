import {
  LifePlanAssociations
} from "/build/_shared/chunk-OE7VPYTO.js";
import "/build/_shared/chunk-6SJK4Y2K.js";
import "/build/_shared/chunk-OIJ3E3DH.js";
import "/build/_shared/chunk-OLMKSGLM.js";
import {
  findActiveChaptersForSuggestions
} from "/build/_shared/chunk-ZFN6H2GY.js";
import {
  lifePlanBirthdayDate
} from "/build/_shared/chunk-HQECWRQJ.js";
import "/build/_shared/chunk-WCBSHJX3.js";
import "/build/_shared/chunk-37FGSNWH.js";
import {
  TimePlanActivitKindSelect,
  TimePlanActivityFeasabilitySelect
} from "/build/_shared/chunk-OIVO27JA.js";
import "/build/_shared/chunk-IRHCW4HP.js";
import {
  IsKeySelect
} from "/build/_shared/chunk-SWYHSSUT.js";
import {
  DateInputWithSuggestions,
  getSuggestedDatesForTodoTaskActionableDate,
  getSuggestedDatesForTodoTaskDueDate
} from "/build/_shared/chunk-EHMNDFHW.js";
import "/build/_shared/chunk-73QIECWH.js";
import {
  DifficultySelect,
  EisenhowerSelect
} from "/build/_shared/chunk-T6GSSEVE.js";
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
  aDateToDate,
  dateToAdate
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
  FormLabel_default,
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

// app/routes/app/workspace/todos/new.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/todos/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/todos/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113174.48";
}
var ParamsSchema = external_exports.object({});
var QuerySchema = external_exports.object({
  timePlanReason: external_exports.literal("for-time-plan").optional(),
  timePlanRefId: external_exports.string().optional(),
  initialDueDate: external_exports.enum(["day", "week", "month", "year"]).optional()
});
var CreateFormSchema = external_exports.object({
  name: external_exports.string(),
  aspect: external_exports.string().optional(),
  chapter: external_exports.string().optional(),
  goal: external_exports.string().optional(),
  isKey: import_zodix.CheckboxAsString,
  eisen: external_exports.nativeEnum(import_webapi_client.Eisen),
  difficulty: external_exports.nativeEnum(import_webapi_client.Difficulty),
  actionableDate: external_exports.string().optional(),
  dueDate: external_exports.string().optional(),
  timePlanActivityKind: external_exports.nativeEnum(import_webapi_client.TimePlanActivityKind).optional(),
  timePlanActivityFeasability: external_exports.nativeEnum(import_webapi_client.TimePlanActivityFeasability).optional()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewTodo() {
  _s();
  const actionData = useActionData();
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const birthdayDate = loaderData.lifePlan ? lifePlanBirthdayDate(loaderData.lifePlan) : null;
  const todayDate = aDateToDate(topLevelInfo.today);
  const [selectedAspectRefId, setSelectedAspectRefId] = (0, import_react2.useState)(loaderData.rootAspect?.ref_id ?? "");
  const chaptersForSuggestions = (0, import_react2.useMemo)(() => birthdayDate ? findActiveChaptersForSuggestions((loaderData.allChapters ?? []).filter((chapter) => chapter.aspect_ref_id === selectedAspectRefId), birthdayDate, todayDate, loaderData.allMilestones ?? []) : [], [loaderData.allChapters, loaderData.allMilestones, selectedAspectRefId, birthdayDate, todayDate]);
  const inferredInitialDueDate = loaderData.timePlanReason === "for-time-plan" ? loaderData.associatedTimePlan.end_date : loaderData.initialDueDate === "day" ? dateToAdate(aDateToDate(topLevelInfo.today).endOf("day")) : loaderData.initialDueDate === "week" ? dateToAdate(aDateToDate(topLevelInfo.today).endOf("week").endOf("day")) : loaderData.initialDueDate === "month" ? dateToAdate(aDateToDate(topLevelInfo.today).endOf("month").endOf("day")) : loaderData.initialDueDate === "year" ? dateToAdate(aDateToDate(topLevelInfo.today).endOf("year").endOf("day")) : void 0;
  const inferredInitialActionableDate = loaderData.timePlanReason === "for-time-plan" ? loaderData.associatedTimePlan.start_date : void 0;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "todos/new", returnLocation: "/app/workspace/todos", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/todos/new.tsx",
      lineNumber: 166,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Todo Task", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "todo-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "todo-create",
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/todos/new.tsx",
      lineNumber: 167,
      columnNumber: 91
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, spacing: 1, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 3
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/todos/new.tsx",
            lineNumber: 177,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/todos/new.tsx",
            lineNumber: 178,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/todos/new.tsx",
            lineNumber: 179,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 174,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 1
        }, children: [
          /* @__PURE__ */ jsxDEV(IsKeySelect, { name: "isKey", defaultValue: false, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/todos/new.tsx",
            lineNumber: 185,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/is_key" }, void 0, false, {
            fileName: "app/routes/app/workspace/todos/new.tsx",
            lineNumber: 186,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 182,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/todos/new.tsx",
        lineNumber: 173,
        columnNumber: 9
      }, this),
      isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(LifePlanAssociations, { inputsEnabled, allAspects: loaderData.allAspects ?? [], aspectValue: selectedAspectRefId, onAspectChange: setSelectedAspectRefId, aspectDefaultValue: loaderData.rootAspect?.ref_id ?? "", allChapters: loaderData.allChapters ?? [], allGoals: loaderData.allGoals ?? [], birthday: birthdayDate, today: aDateToDate(topLevelInfo.today), allMilestones: loaderData.allMilestones ?? [] }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 191,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/aspect_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 192,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/chapter_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 193,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/goal_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 194,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/todos/new.tsx",
        lineNumber: 190,
        columnNumber: 93
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "eisen", children: "Eisenhower" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 198,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(EisenhowerSelect, { name: "eisen", defaultValue: import_webapi_client.Eisen.REGULAR, inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 199,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/eisen" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 200,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/todos/new.tsx",
        lineNumber: 197,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "difficulty", children: "Difficulty" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 204,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(DifficultySelect, { name: "difficulty", defaultValue: import_webapi_client.Difficulty.EASY, inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 205,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/difficulty" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 206,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/todos/new.tsx",
        lineNumber: 203,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableDate", shrink: true, margin: "dense", children: "Actionable From [Optional]" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 210,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(DateInputWithSuggestions, { name: "actionableDate", label: "actionableDate", inputsEnabled, defaultValue: inferredInitialActionableDate, suggestedDates: getSuggestedDatesForTodoTaskActionableDate(topLevelInfo.today, loaderData.associatedTimePlan, chaptersForSuggestions) }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 213,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/actionable_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 214,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/todos/new.tsx",
        lineNumber: 209,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueDate", shrink: true, margin: "dense", children: "Due Date [Optional]" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 218,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(DateInputWithSuggestions, { name: "dueDate", label: "dueDate", inputsEnabled, defaultValue: inferredInitialDueDate, suggestedDates: getSuggestedDatesForTodoTaskDueDate(topLevelInfo.today, loaderData.associatedTimePlan, chaptersForSuggestions) }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 221,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/due_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 222,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/todos/new.tsx",
        lineNumber: 217,
        columnNumber: 9
      }, this),
      loaderData.timePlanReason === "for-time-plan" && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "timePlanActivityKind", children: "Time Plan Activity Kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/todos/new.tsx",
            lineNumber: 227,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivitKindSelect, { name: "timePlanActivityKind", defaultValue: import_webapi_client.TimePlanActivityKind.FINISH, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/todos/new.tsx",
            lineNumber: 230,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/time_plan_activity_kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/todos/new.tsx",
            lineNumber: 231,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 226,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "timePlanActivityFeasability", children: "Time Plan Activity Feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/todos/new.tsx",
            lineNumber: 235,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivityFeasabilitySelect, { name: "timePlanActivityFeasability", defaultValue: import_webapi_client.TimePlanActivityFeasability.NICE_TO_HAVE, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/todos/new.tsx",
            lineNumber: 238,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/time_plan_activity_feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/todos/new.tsx",
            lineNumber: 239,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/todos/new.tsx",
          lineNumber: 234,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/todos/new.tsx",
        lineNumber: 225,
        columnNumber: 59
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/todos/new.tsx",
      lineNumber: 167,
      columnNumber: 7
    }, this)
  ] }, "todos/new", true, {
    fileName: "app/routes/app/workspace/todos/new.tsx",
    lineNumber: 165,
    columnNumber: 10
  }, this);
}
_s(NewTodo, "/5ozBLAL4iG3GpW/oisYn75cMzg=", false, function() {
  return [useActionData, useNavigation, useLoaderDataSafeForAnimation];
});
_c = NewTodo;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/todos", ParamsSchema, {
  error: () => `There was an error creating the todo task! Please try again!`
});
var _c;
$RefreshReg$(_c, "NewTodo");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewTodo as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/todos/new-G33M7YM2.js.map
