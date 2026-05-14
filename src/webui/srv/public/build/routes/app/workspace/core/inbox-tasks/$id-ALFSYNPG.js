import {
  InboxTaskPropertiesEditor
} from "/build/_shared/chunk-7BNFJ3AA.js";
import "/build/_shared/chunk-KWDUQM3W.js";
import {
  require_scores
} from "/build/_shared/chunk-4427KUT2.js";
import "/build/_shared/chunk-SWYHSSUT.js";
import "/build/_shared/chunk-EHMNDFHW.js";
import {
  TimePlanActivityList
} from "/build/_shared/chunk-5FT37GVY.js";
import "/build/_shared/chunk-GNW7Z5U5.js";
import "/build/_shared/chunk-W6KI7GPI.js";
import "/build/_shared/chunk-P7WFXMQY.js";
import "/build/_shared/chunk-ATIM3BG5.js";
import "/build/_shared/chunk-73QIECWH.js";
import "/build/_shared/chunk-IYE5HYO4.js";
import "/build/_shared/chunk-T6GSSEVE.js";
import {
  isInboxTaskCoreFieldEditable
} from "/build/_shared/chunk-RTB3GZDR.js";
import "/build/_shared/chunk-DNXYZ7BB.js";
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
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
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
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import {
  isWorkspaceFeatureAvailable,
  parentLinkNamespaceFromEntityLinkWire
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
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

// app/routes/app/workspace/core/inbox-tasks/$id.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/core/inbox-tasks/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/core/inbox-tasks/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342584.8096";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var CommonParamsSchema = {
  namespace: external_exports.string(),
  name: external_exports.string(),
  status: external_exports.nativeEnum(import_webapi_client.InboxTaskStatus),
  isKey: import_zodix.CheckboxAsString,
  bigPlan: external_exports.string().optional(),
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
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function InboxTask() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const info = loaderData.info;
  const inboxTask = loaderData.info.inbox_task;
  const inputsEnabled = navigation.state === "idle" && !inboxTask.archived;
  const corePropertyEditable = isInboxTaskCoreFieldEditable(parentLinkNamespaceFromEntityLinkWire(inboxTask.owner));
  const inboxTasksByRefId = /* @__PURE__ */ new Map();
  inboxTasksByRefId.set(loaderData.info.inbox_task.ref_id, loaderData.info.inbox_task);
  const timePlanActivities = loaderData.timePlanEntries?.map((entry) => entry.time_plan_activity);
  const timePlansByRefId = /* @__PURE__ */ new Map();
  if (loaderData.timePlanEntries) {
    for (const entry of loaderData.timePlanEntries) {
      timePlansByRefId.set(entry.time_plan.ref_id, entry.time_plan);
    }
  }
  const emptyBigPlansByRefId = /* @__PURE__ */ new Map();
  const emptyTimeEventsByRefId = /* @__PURE__ */ new Map();
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `inbox-task-${inboxTask.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: inboxTask.archived, entityNotEditable: !corePropertyEditable, returnLocation: "/app/workspace/core/inbox-tasks", children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks/$id.tsx",
      lineNumber: 330,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskPropertiesEditor, { title: "Properties", topLevelInfo, inputsEnabled, inboxTask, inboxTaskInfo: info, actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks/$id.tsx",
      lineNumber: 331,
      columnNumber: 7
    }, this),
    isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.TIME_PLANS) && timePlanActivities && /* @__PURE__ */ jsxDEV(SectionCard, { id: "inbox-task-time-plans", title: "Time Plans", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "inbox-task-time-plans-actions", topLevelInfo, inputsEnabled, actions: [NavSingle({
      text: "Add",
      highlight: false,
      link: `/app/workspace/time-plans/add-inbox-task-to-plans?inboxTaskRefId=${loaderData.info.inbox_task.ref_id}`
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks/$id.tsx",
      lineNumber: 333,
      columnNumber: 182
    }, this), children: /* @__PURE__ */ jsxDEV(TimePlanActivityList, { topLevelInfo, activities: timePlanActivities, timePlansByRefId, inboxTasksByRefId, bigPlansByRefId: emptyBigPlansByRefId, activityDoneness: {}, timeEventsByRefId: emptyTimeEventsByRefId, fullInfo: false, showTimePlanName: true }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks/$id.tsx",
      lineNumber: 338,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks/$id.tsx",
      lineNumber: 333,
      columnNumber: 114
    }, this)
  ] }, `inbox-task-${inboxTask.ref_id}`, true, {
    fileName: "app/routes/app/workspace/core/inbox-tasks/$id.tsx",
    lineNumber: 329,
    columnNumber: 10
  }, this);
}
_s(InboxTask, "IMUWl/EuSL028qdBEjVNaTICzMo=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = InboxTask;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/core/inbox-tasks", ParamsSchema, {
  notFound: (params) => `Could not find inbox task #${params.id}!`,
  error: (params) => `There was an error loading inbox task #${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "InboxTask");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  InboxTask as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/core/inbox-tasks/$id-ALFSYNPG.js.map
