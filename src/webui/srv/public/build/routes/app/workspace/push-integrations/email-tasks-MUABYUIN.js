import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  emailTaskNiceName
} from "/build/_shared/chunk-BOZSZ6DZ.js";
import {
  DifficultyTag,
  EisenTag
} from "/build/_shared/chunk-U5MVWZEK.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  ADateTag
} from "/build/_shared/chunk-NBD44M5V.js";
import "/build/_shared/chunk-NLPUBZ3T.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  useTrunkNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet
} from "/build/_shared/chunk-VVGD4GL7.js";
import "/build/_shared/chunk-V5CWULKU.js";
import "/build/_shared/chunk-V6BBPW4V.js";
import "/build/_shared/chunk-JFC3UFZQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import "/build/_shared/chunk-ZIPKILLR.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/app/workspace/push-integrations/email-tasks.tsx
var import_node = __toESM(require_node());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/push-integrations/email-tasks.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/push-integrations/email-tasks.tsx"
  );
  import.meta.hot.lastModified = "1775685113128.9336";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function EmailTasks() {
  _s();
  const entries = useLoaderDataSafeForAnimation();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const sortedEntries = [...entries];
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: /* @__PURE__ */ jsxDEV(EntityStack, { children: sortedEntries.map((entry) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `email-task-${entry.email_task.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/push-integrations/email-tasks/${entry.email_task.ref_id}`, children: [
      /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: emailTaskNiceName(entry.email_task) }, void 0, false, {
        fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
        lineNumber: 63,
        columnNumber: 17
      }, this),
      entry.email_task.generation_extra_info.actionable_date && /* @__PURE__ */ jsxDEV(ADateTag, { label: "Actionabel From", date: entry.email_task.generation_extra_info.actionable_date }, void 0, false, {
        fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
        lineNumber: 64,
        columnNumber: 76
      }, this),
      entry.email_task.generation_extra_info.due_date && /* @__PURE__ */ jsxDEV(ADateTag, { label: "Due At", date: entry.email_task.generation_extra_info.due_date }, void 0, false, {
        fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
        lineNumber: 65,
        columnNumber: 69
      }, this),
      entry.email_task.generation_extra_info.eisen && /* @__PURE__ */ jsxDEV(EisenTag, { eisen: entry.email_task.generation_extra_info.eisen }, void 0, false, {
        fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
        lineNumber: 66,
        columnNumber: 66
      }, this),
      entry.email_task.generation_extra_info.difficulty && /* @__PURE__ */ jsxDEV(DifficultyTag, { difficulty: entry.email_task.generation_extra_info.difficulty }, void 0, false, {
        fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
        lineNumber: 67,
        columnNumber: 71
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
      lineNumber: 62,
      columnNumber: 15
    }, this) }, `email-task-${entry.email_task.ref_id}`, false, {
      fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
      lineNumber: 61,
      columnNumber: 39
    }, this)) }, void 0, false, {
      fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
      lineNumber: 60,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
      lineNumber: 59,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
      lineNumber: 74,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
      lineNumber: 73,
      columnNumber: 7
    }, this)
  ] }, "email-tasks", true, {
    fileName: "app/routes/app/workspace/push-integrations/email-tasks.tsx",
    lineNumber: 58,
    columnNumber: 10
  }, this);
}
_s(EmailTasks, "NpNW9pIRVwhfENw56C3jgjj/Yb0=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowLeaf];
});
_c = EmailTasks;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the email tasks! Please try again!`
});
var _c;
$RefreshReg$(_c, "EmailTasks");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  EmailTasks as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/push-integrations/email-tasks-MUABYUIN.js.map
