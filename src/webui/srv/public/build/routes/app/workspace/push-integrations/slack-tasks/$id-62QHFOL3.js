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
import {
  inboxTaskStatusName
} from "/build/_shared/chunk-4TWETDNJ.js";
import "/build/_shared/chunk-NBD44M5V.js";
import {
  difficultyName
} from "/build/_shared/chunk-NLPUBZ3T.js";
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
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
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
  FormControl_default,
  FormLabel_default,
  InputLabel_default,
  MenuItem_default,
  OutlinedInput_default,
  Select_default
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
  useFetcher,
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

// app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx"
  );
  import.meta.hot.lastModified = "1775685113128.0505";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var handle = {
  displayType: 3 /* LEAF */
};
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  user: external_exports.string(),
  channel: external_exports.string(),
  message: external_exports.string(),
  generationName: external_exports.string().optional(),
  generationStatus: external_exports.nativeEnum(import_webapi_client.InboxTaskStatus).optional(),
  generationEisen: external_exports.nativeEnum(import_webapi_client.Eisen),
  generationDifficulty: external_exports.nativeEnum(import_webapi_client.Difficulty),
  generationActionableDate: external_exports.string().optional(),
  generationDueDate: external_exports.string().optional()
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var shouldRevalidate = standardShouldRevalidate;
function SlackTask() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle" && !loaderData.slackTask.archived;
  const cardActionFetcher = useFetcher();
  function handleCardMarkDone(it) {
    cardActionFetcher.submit({
      id: it.ref_id,
      status: import_webapi_client.InboxTaskStatus.DONE
    }, {
      method: "post",
      action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
    });
  }
  function handleCardMarkNotDone(it) {
    cardActionFetcher.submit({
      id: it.ref_id,
      status: import_webapi_client.InboxTaskStatus.NOT_DONE
    }, {
      method: "post",
      action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
    });
  }
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.SLACK_TASK, entityRefId: loaderData.slackTask.ref_id, fakeKey: `slack-tasks/${loaderData.slackTask.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.slackTask.archived, returnLocation: "/app/workspace/push-integrations/slack-tasks", children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
      lineNumber: 204,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "slack-task-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
      lineNumber: 205,
      columnNumber: 48
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "user", children: "User" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 211,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "User", name: "user", readOnly: !inputsEnabled, defaultValue: loaderData.slackTask.user }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 212,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/user" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 213,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
        lineNumber: 210,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "channel", children: "Channel" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 217,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Channel", name: "channel", readOnly: !inputsEnabled, defaultValue: loaderData.slackTask.channel }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 218,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/channel" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 219,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
        lineNumber: 216,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "message", children: "Message" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 223,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Message", name: "message", readOnly: !inputsEnabled, defaultValue: loaderData.slackTask.message }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 224,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/message" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 225,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
        lineNumber: 222,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "generationName", children: "Generation Name" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 229,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Generation Name", name: "generationName", readOnly: !inputsEnabled, defaultValue: loaderData.slackTask.generation_extra_info?.name }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 230,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/generation_name" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 231,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
        lineNumber: 228,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "generationStatus", children: "Generation Status" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 235,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Select_default, { labelId: "generationStatus", name: "generationStatus", readOnly: !inputsEnabled, defaultValue: loaderData.slackTask.generation_extra_info?.status || import_webapi_client.InboxTaskStatus.NOT_STARTED, label: "Status", children: Object.values(import_webapi_client.InboxTaskStatus).map((s) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: s, children: inboxTaskStatusName(s) }, s, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 237,
          columnNumber: 54
        }, this)) }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 236,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/generation_status" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 241,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
        lineNumber: 234,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "generationEisen", children: "Generation Eisenhower" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 245,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(EisenhowerSelect, { name: "generationEisen", inputsEnabled, defaultValue: loaderData.slackTask.generation_extra_info?.eisen || import_webapi_client.Eisen.REGULAR }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 246,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/generation_eisen" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 247,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
        lineNumber: 244,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "generationDifficulty", children: "Generation Difficulty" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 251,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(DifficultySelect, { name: "generationDifficulty", inputsEnabled, defaultValue: loaderData.slackTask.generation_extra_info?.difficulty || import_webapi_client.Difficulty.EASY }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 252,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/generation_difficulty" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 253,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
        lineNumber: 250,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "generationDifficulty", children: "Generation Difficulty" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 257,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Select_default, { labelId: "generationDifficulty", name: "generationDifficulty", readOnly: !inputsEnabled, defaultValue: loaderData.slackTask.generation_extra_info?.difficulty || "default", label: "Generation Difficulty", children: [
          /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "default", children: "Default" }, void 0, false, {
            fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
            lineNumber: 261,
            columnNumber: 13
          }, this),
          Object.values(import_webapi_client.Difficulty).map((e) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: e, children: difficultyName(e) }, e, false, {
            fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
            lineNumber: 262,
            columnNumber: 49
          }, this))
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 260,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/generation_difficulty" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 266,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
        lineNumber: 256,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "generationActionableDate", shrink: true, children: "Generation Actionable From" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 270,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "generationActionableDate", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultValue: loaderData.slackTask.generation_extra_info?.actionable_date ? aDateToDate(loaderData.slackTask.generation_extra_info?.actionable_date).toFormat("yyyy-MM-dd") : void 0, name: "generationActionableDate" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 273,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/generation_actionable_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 275,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
        lineNumber: 269,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "generationDueDate", shrink: true, children: "Generation Due At" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 279,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "generationDueDate", readOnly: !inputsEnabled, disabled: !inputsEnabled, defaultValue: loaderData.slackTask.generation_extra_info?.due_date ? aDateToDate(loaderData.slackTask.generation_extra_info?.due_date).toFormat("yyyy-MM-dd") : void 0, name: "generationDueDate" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 282,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/generation_due_date" }, void 0, false, {
          fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
          lineNumber: 283,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
        lineNumber: 278,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
      lineNumber: 205,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Inbox Task", children: loaderData.inboxTask && /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo, showOptions: {
      showStatus: true,
      showDueDate: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Inbox Task", inboxTasks: [loaderData.inboxTask], onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone }, void 0, false, {
      fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
      lineNumber: 288,
      columnNumber: 34
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
      lineNumber: 287,
      columnNumber: 7
    }, this)
  ] }, `slack-task-${loaderData.slackTask.ref_id}`, true, {
    fileName: "app/routes/app/workspace/push-integrations/slack-tasks/$id.tsx",
    lineNumber: 203,
    columnNumber: 10
  }, this);
}
_s(SlackTask, "ubV8BmW/OVnAABb4RJEhk8WLu8o=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useFetcher];
});
_c = SlackTask;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/push-integrations/slack-tasks", ParamsSchema, {
  notFound: (params) => `Could not find slack task #${params.id}!`,
  error: (params) => `There was an error loading slack task #${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "SlackTask");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  SlackTask as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/push-integrations/slack-tasks/$id-62QHFOL3.js.map
