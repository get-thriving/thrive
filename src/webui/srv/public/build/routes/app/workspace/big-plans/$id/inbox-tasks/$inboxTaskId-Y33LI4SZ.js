import {
  InboxTaskStatusBigTag
} from "/build/_shared/chunk-KWDUQM3W.js";
import {
  require_scores
} from "/build/_shared/chunk-4427KUT2.js";
import {
  IsKeySelect
} from "/build/_shared/chunk-SWYHSSUT.js";
import {
  DateInputWithSuggestions,
  getSuggestedDatesForInboxTaskActionableDate,
  getSuggestedDatesForInboxTaskDueDate
} from "/build/_shared/chunk-EHMNDFHW.js";
import {
  DifficultySelect,
  EisenhowerSelect
} from "/build/_shared/chunk-T6GSSEVE.js";
import "/build/_shared/chunk-4TWETDNJ.js";
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
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  Box_default,
  ButtonGroup_default,
  Button_default,
  CardActions_default,
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

// app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());
var import_scores = __toESM(require_scores());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx"
  );
  import.meta.hot.lastModified = "1775685113163.883";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string(),
  inboxTaskId: external_exports.string()
});
var CommonParamsSchema = {
  name: external_exports.string(),
  status: external_exports.nativeEnum(import_webapi_client.InboxTaskStatus),
  isKey: import_zodix.CheckboxAsString,
  eisen: external_exports.nativeEnum(import_webapi_client.Eisen),
  difficulty: external_exports.nativeEnum(import_webapi_client.Difficulty),
  actionableDate: external_exports.string().optional(),
  dueDate: external_exports.string().optional()
};
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("mark-done"),
  ...CommonParamsSchema
}), external_exports.object({
  intent: external_exports.literal("mark-not-done"),
  ...CommonParamsSchema
}), external_exports.object({
  intent: external_exports.literal("start"),
  ...CommonParamsSchema
}), external_exports.object({
  intent: external_exports.literal("restart"),
  ...CommonParamsSchema
}), external_exports.object({
  intent: external_exports.literal("block"),
  ...CommonParamsSchema
}), external_exports.object({
  intent: external_exports.literal("stop"),
  ...CommonParamsSchema
}), external_exports.object({
  intent: external_exports.literal("reactivate"),
  ...CommonParamsSchema
}), external_exports.object({
  intent: external_exports.literal("update"),
  ...CommonParamsSchema
}), external_exports.object({
  intent: external_exports.literal("delay-1-day"),
  ...CommonParamsSchema
}), external_exports.object({
  intent: external_exports.literal("delay-1-week"),
  ...CommonParamsSchema
}), external_exports.object({
  intent: external_exports.literal("delay-1-month"),
  ...CommonParamsSchema
})]);
var handle = {
  displayType: 4 /* LEAFLET */
};
var shouldRevalidate = standardShouldRevalidate;
function BigPlanInboxTaskEdit() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const {
    id: bigPlanId
  } = useParams();
  const inboxTask = loaderData.info.inbox_task;
  const inputsEnabled = navigation.state === "idle" && !inboxTask.archived;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { isLeaflet: true, fakeKey: `big-plan-inbox-task-${inboxTask.ref_id}`, returnLocation: `/app/workspace/big-plans/${bigPlanId}`, inputsEnabled, entityArchived: inboxTask.archived, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
      lineNumber: 283,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Inbox Task Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "big-plan-inbox-task-editor", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "big-plan-inbox-task-editor-save",
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
      lineNumber: 284,
      columnNumber: 59
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
        /* @__PURE__ */ jsxDEV(Box_default, { sx: {
          display: "flex",
          flexDirection: "row",
          gap: "0.25rem"
        }, children: [
          /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
            flexGrow: 3
          }, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
              lineNumber: 299,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, defaultValue: inboxTask.name }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
              lineNumber: 300,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
              lineNumber: 301,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 296,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
            flexGrow: 1
          }, children: /* @__PURE__ */ jsxDEV(IsKeySelect, { name: "isKey", defaultValue: inboxTask.is_key, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 307,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 304,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 291,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, spacing: 1, children: [
          /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
            flexGrow: 1,
            minWidth: "unset"
          }, children: [
            /* @__PURE__ */ jsxDEV(InboxTaskStatusBigTag, { status: inboxTask.status }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
              lineNumber: 316,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "status", value: inboxTask.status }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
              lineNumber: 317,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/status" }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
              lineNumber: 318,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 312,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "bigPlan", shrink: true, children: "Big Plan" }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
              lineNumber: 322,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Big Plan", readOnly: true, value: loaderData.info.big_plan?.name ?? "Unknown" }, void 0, false, {
              fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
              lineNumber: 325,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 321,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 311,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "eisen", children: "Eisenhower" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 330,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(EisenhowerSelect, { name: "eisen", inputsEnabled, defaultValue: inboxTask.eisen }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 331,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/eisen" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 332,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 329,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "difficulty", children: "Difficulty" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 336,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(DifficultySelect, { name: "difficulty", inputsEnabled, defaultValue: inboxTask.difficulty }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 337,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/difficulty" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 338,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 335,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableDate", shrink: true, children: "Actionable From [Optional]" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 342,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(DateInputWithSuggestions, { name: "actionableDate", label: "actionableDate", inputsEnabled, defaultValue: inboxTask.actionable_date, suggestedDates: getSuggestedDatesForInboxTaskActionableDate(topLevelInfo.today, loaderData.info.big_plan, loaderData.info.time_plan) }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 345,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/actionable_date" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 347,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 341,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueDate", shrink: true, margin: "dense", children: "Due At [Optional]" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 351,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(DateInputWithSuggestions, { name: "dueDate", label: "dueDate", inputsEnabled, defaultValue: inboxTask.due_date, suggestedDates: getSuggestedDatesForInboxTaskDueDate(topLevelInfo.today, loaderData.info.big_plan, loaderData.info.time_plan) }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 354,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/due_date" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 356,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 350,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
        lineNumber: 290,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(CardActions_default, { sx: {
        paddingLeft: "0px",
        paddingRight: "0px"
      }, children: /* @__PURE__ */ jsxDEV(Stack_default, { direction: "column", spacing: 1, sx: {
        width: "100%"
      }, children: [
        inboxTask.status === import_webapi_client.InboxTaskStatus.NOT_STARTED && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "contained", disabled: !inputsEnabled, type: "submit", name: "intent", value: "mark-done", children: "Mark Done" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 368,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "mark-not-done", children: "Mark Not Done" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 371,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "start", children: "Start" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 374,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "block", children: "Block" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 377,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 367,
          columnNumber: 66
        }, this),
        inboxTask.status === import_webapi_client.InboxTaskStatus.IN_PROGRESS && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "contained", disabled: !inputsEnabled, type: "submit", name: "intent", value: "mark-done", children: "Mark Done" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 383,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "mark-not-done", children: "Mark Not Done" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 386,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "block", children: "Block" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 389,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "stop", children: "Stop" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 392,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 382,
          columnNumber: 66
        }, this),
        inboxTask.status === import_webapi_client.InboxTaskStatus.BLOCKED && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "contained", disabled: !inputsEnabled, type: "submit", name: "intent", value: "mark-done", children: "Mark Done" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 398,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "mark-not-done", children: "Mark Not Done" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 401,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "restart", children: "Restart" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 404,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "stop", children: "Stop" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 407,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 397,
          columnNumber: 62
        }, this),
        (inboxTask.status === import_webapi_client.InboxTaskStatus.DONE || inboxTask.status === import_webapi_client.InboxTaskStatus.NOT_DONE) && /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "reactivate", children: "Reactivate" }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 413,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 412,
          columnNumber: 110
        }, this),
        /* @__PURE__ */ jsxDEV(ButtonGroup_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "delay-1-day", children: "Delay by 1 Day" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 419,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "delay-1-week", children: "Delay by 1 Week" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 422,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(Button_default, { size: "small", variant: "outlined", disabled: !inputsEnabled, type: "submit", name: "intent", value: "delay-1-month", children: "Delay by 1 Month" }, void 0, false, {
            fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
            lineNumber: 425,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
          lineNumber: 418,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
        lineNumber: 364,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
        lineNumber: 360,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
      lineNumber: 284,
      columnNumber: 7
    }, this)
  ] }, `big-plan-inbox-task-${inboxTask.ref_id}`, true, {
    fileName: "app/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
    lineNumber: 282,
    columnNumber: 10
  }, this);
}
_s(BigPlanInboxTaskEdit, "Nyqy7sKfK+xEvfBqBmUgfDgSwzA=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useParams];
});
_c = BigPlanInboxTaskEdit;
var ErrorBoundary = makeLeafErrorBoundary("../..", ParamsSchema, {
  notFound: (params) => `Could not find inbox task #${params.inboxTaskId}!`,
  error: (params) => `There was an error loading inbox task #${params.inboxTaskId}! Please try again!`
});
var _c;
$RefreshReg$(_c, "BigPlanInboxTaskEdit");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  BigPlanInboxTaskEdit as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/big-plans/$id/inbox-tasks/$inboxTaskId-Y33LI4SZ.js.map
