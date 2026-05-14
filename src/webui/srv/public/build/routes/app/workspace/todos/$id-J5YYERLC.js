import {
  TodoTaskPropertiesEditor
} from "/build/_shared/chunk-7HFY3OAA.js";
import {
  TimeEventInDayBlockStack
} from "/build/_shared/chunk-H3GNRCKI.js";
import "/build/_shared/chunk-OE7VPYTO.js";
import "/build/_shared/chunk-6SJK4Y2K.js";
import "/build/_shared/chunk-OIJ3E3DH.js";
import "/build/_shared/chunk-OLMKSGLM.js";
import "/build/_shared/chunk-ZFN6H2GY.js";
import "/build/_shared/chunk-HQECWRQJ.js";
import "/build/_shared/chunk-WCBSHJX3.js";
import "/build/_shared/chunk-37FGSNWH.js";
import "/build/_shared/chunk-VGTT4RYC.js";
import {
  sortInboxTaskTimeEventsNaturally,
  timeEventInDayBlockToTimezone
} from "/build/_shared/chunk-24RA7B23.js";
import {
  EntityNoteEditor
} from "/build/_shared/chunk-PDFSPG4I.js";
import "/build/_shared/chunk-FTLY2H2V.js";
import "/build/_shared/chunk-HDJTYRJL.js";
import "/build/_shared/chunk-IRHCW4HP.js";
import "/build/_shared/chunk-HGSZOXV4.js";
import "/build/_shared/chunk-KWDUQM3W.js";
import "/build/_shared/chunk-SWYHSSUT.js";
import "/build/_shared/chunk-EHMNDFHW.js";
import "/build/_shared/chunk-IYE5HYO4.js";
import "/build/_shared/chunk-T6GSSEVE.js";
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
import "/build/_shared/chunk-Z3RPM676.js";
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
import "/build/_shared/chunk-FUGZILJZ.js";
import "/build/_shared/chunk-43PAR6MS.js";
import "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import "/build/_shared/chunk-QJ3XFSPL.js";
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

// app/routes/app/workspace/todos/$id.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/todos/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/todos/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342615.6133";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var CommonParamsSchema = {
  name: external_exports.string(),
  status: external_exports.nativeEnum(import_webapi_client.InboxTaskStatus),
  aspect: external_exports.string().optional(),
  chapter: external_exports.string().optional(),
  goal: external_exports.string().optional(),
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
}), external_exports.object({
  intent: external_exports.literal("create-note")
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function TodoTask() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle" && !loaderData.todoTask.archived;
  const timeEventEntries = loaderData.timeEventBlocks.map((block) => ({
    time_event_in_tz: timeEventInDayBlockToTimezone(block, topLevelInfo.user.timezone),
    entry: {
      todo_task: loaderData.todoTask,
      inbox_task: loaderData.inboxTask,
      time_events: [block]
    }
  }));
  const sortedTimeEventEntries = sortInboxTaskTimeEventsNaturally(timeEventEntries);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.TODO_TASK, entityRefId: loaderData.todoTask.ref_id, fakeKey: `todo-task-${loaderData.todoTask.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.todoTask.archived, returnLocation: "/app/workspace/todos", children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/todos/$id.tsx",
      lineNumber: 323,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(TodoTaskPropertiesEditor, { title: "Properties", topLevelInfo, lifePlan: loaderData.lifePlan, allAspects: loaderData.allAspects ?? [], allChapters: loaderData.allChapters ?? [], allGoals: loaderData.allGoals ?? [], allMilestones: loaderData.allMilestones ?? [], allTags: loaderData.allTags, tags: loaderData.tags, allContacts: loaderData.allContacts, contacts: loaderData.contacts, inputsEnabled, todoTask: loaderData.todoTask, inboxTask: loaderData.inboxTask, actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/todos/$id.tsx",
      lineNumber: 324,
      columnNumber: 7
    }, this),
    isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.SCHEDULE) && /* @__PURE__ */ jsxDEV(TimeEventInDayBlockStack, { topLevelInfo, inputsEnabled, title: "Time Events", createLocation: `/app/workspace/calendar/time-event/in-day-block/new-for-todo-task?todoTaskRefId=${loaderData.todoTask.ref_id}`, entries: sortedTimeEventEntries }, void 0, false, {
      fileName: "app/routes/app/workspace/todos/$id.tsx",
      lineNumber: 326,
      columnNumber: 90
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "todo-create-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "todo-create-note",
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: loaderData.note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/todos/$id.tsx",
      lineNumber: 328,
      columnNumber: 42
    }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/todos/$id.tsx",
      lineNumber: 335,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/todos/$id.tsx",
      lineNumber: 328,
      columnNumber: 7
    }, this)
  ] }, `todo-task-${loaderData.todoTask.ref_id}`, true, {
    fileName: "app/routes/app/workspace/todos/$id.tsx",
    lineNumber: 322,
    columnNumber: 10
  }, this);
}
_s(TodoTask, "IMUWl/EuSL028qdBEjVNaTICzMo=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = TodoTask;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/todos", ParamsSchema, {
  notFound: (params) => `Could not find todo task #${params.id}!`,
  error: (params) => `There was an error loading todo task #${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "TodoTask");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  TodoTask as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/todos/$id-J5YYERLC.js.map
