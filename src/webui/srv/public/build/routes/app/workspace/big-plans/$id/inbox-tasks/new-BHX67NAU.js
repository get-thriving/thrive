import {
  TimePlanActivitKindSelect,
  TimePlanActivityFeasabilitySelect
} from "/build/_shared/chunk-OIVO27JA.js";
import {
  IsKeySelect
} from "/build/_shared/chunk-SWYHSSUT.js";
import {
  DateInputWithSuggestions,
  getSuggestedDatesForInboxTaskActionableDate,
  getSuggestedDatesForInboxTaskDueDate
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
import "/build/_shared/chunk-72ELS2LF.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  LeafPanel,
  makeLeafErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import {
  BetterFieldError,
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
  useNavigation,
  useParams
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

// app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113163.0176";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var QuerySchema = external_exports.object({
  timePlanReason: external_exports.literal("for-time-plan").optional(),
  timePlanRefId: external_exports.string().optional(),
  parentTimePlanActivityRefId: external_exports.string().optional()
});
var CreateFormSchema = external_exports.object({
  name: external_exports.string(),
  isKey: import_zodix.CheckboxAsString,
  eisen: external_exports.nativeEnum(import_webapi_client.Eisen),
  difficulty: external_exports.nativeEnum(import_webapi_client.Difficulty),
  actionableDate: external_exports.string().optional(),
  dueDate: external_exports.string().optional(),
  timePlanActivityKind: external_exports.nativeEnum(import_webapi_client.TimePlanActivityKind).optional(),
  timePlanActivityFeasability: external_exports.nativeEnum(import_webapi_client.TimePlanActivityFeasability).optional()
});
var handle = {
  displayType: 4 /* LEAFLET */
};
var shouldRevalidate = standardShouldRevalidate;
function BigPlanNewInboxTask() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const {
    id: bigPlanId
  } = useParams();
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(LeafPanel, { isLeaflet: true, fakeKey: "big-plan-inbox-tasks/new", returnLocation: `/app/workspace/big-plans/${bigPlanId}`, inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
      lineNumber: 155,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: `New Inbox Task for ${loaderData.bigPlan.name}`, actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "big-plan-inbox-task-create", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "big-plan-inbox-task-create",
      text: "Create",
      value: "create",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
      lineNumber: 156,
      columnNumber: 125
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 2, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
            lineNumber: 164,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, ...BetterFieldError({
            actionResult: actionData,
            fieldName: "/name"
          }) }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
            lineNumber: 165,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
            lineNumber: 169,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 163,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 1
        }, children: [
          /* @__PURE__ */ jsxDEV(IsKeySelect, { name: "isKey", defaultValue: false, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
            lineNumber: 175,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/is_key" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
            lineNumber: 176,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 172,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
        lineNumber: 162,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "eisen", children: "Eisenhower" }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 181,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(EisenhowerSelect, { name: "eisen", defaultValue: import_webapi_client.Eisen.REGULAR, inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 182,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/eisen" }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 183,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
        lineNumber: 180,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "difficulty", children: "Difficulty" }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 187,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(DifficultySelect, { name: "difficulty", defaultValue: import_webapi_client.Difficulty.EASY, inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 188,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/difficulty" }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 189,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
        lineNumber: 186,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableDate", shrink: true, children: "Actionable From [Optional]" }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 193,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(DateInputWithSuggestions, { name: "actionableDate", label: "actionableDate", inputsEnabled, defaultValue: loaderData.timePlanReason === "for-time-plan" ? loaderData.associatedTimePlan.start_date : loaderData.bigPlan.actionable_date ?? void 0, suggestedDates: getSuggestedDatesForInboxTaskActionableDate(topLevelInfo.today, loaderData.bigPlan, loaderData.associatedTimePlan) }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 196,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/actionable_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 198,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
        lineNumber: 192,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueDate", shrink: true, children: "Due At [Optional]" }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 202,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(DateInputWithSuggestions, { name: "dueDate", label: "dueDate", inputsEnabled, defaultValue: loaderData.timePlanReason === "for-time-plan" ? loaderData.associatedTimePlan.end_date : loaderData.bigPlan.due_date ?? void 0, suggestedDates: getSuggestedDatesForInboxTaskDueDate(topLevelInfo.today, loaderData.bigPlan, loaderData.associatedTimePlan) }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 205,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/due_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 207,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
        lineNumber: 201,
        columnNumber: 9
      }, this),
      isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.TIME_PLANS) && loaderData.timePlanReason === "for-time-plan" && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "timePlanActivityKind", children: "Kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
            lineNumber: 212,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivitKindSelect, { name: "timePlanActivityKind", defaultValue: import_webapi_client.TimePlanActivityKind.FINISH, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
            lineNumber: 213,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/time_plan_activity_kind" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
            lineNumber: 214,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 211,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "timePlanActivityFeasability", children: "Feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
            lineNumber: 218,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(TimePlanActivityFeasabilitySelect, { name: "timePlanActivityFeasability", defaultValue: import_webapi_client.TimePlanActivityFeasability.NICE_TO_HAVE, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
            lineNumber: 221,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/time_plan_activity_feasability" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
            lineNumber: 222,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
          lineNumber: 217,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
        lineNumber: 210,
        columnNumber: 143
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
      lineNumber: 156,
      columnNumber: 7
    }, this)
  ] }, "big-plan-inbox-tasks/new", true, {
    fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/new.tsx",
    lineNumber: 154,
    columnNumber: 10
  }, this);
}
_s(BigPlanNewInboxTask, "Nyqy7sKfK+xEvfBqBmUgfDgSwzA=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useParams];
});
_c = BigPlanNewInboxTask;
var ErrorBoundary = makeLeafErrorBoundary("../..", ParamsSchema, {
  error: () => `There was an error creating the inbox task! Please try again!`
});
var _c;
$RefreshReg$(_c, "BigPlanNewInboxTask");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  BigPlanNewInboxTask as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/big-plans/$id/inbox-tasks/new-BHX67NAU.js.map
