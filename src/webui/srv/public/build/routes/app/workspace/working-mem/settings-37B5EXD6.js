import {
  PeriodSelect
} from "/build/_shared/chunk-FBXWU6M6.js";
import "/build/_shared/chunk-HVU6TG3B.js";
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
  sortInboxTasksNaturally
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
  FormLabel_default
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

// app/routes/app/workspace/working-mem/settings.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/working-mem/settings.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/working-mem/settings.tsx"
  );
  import.meta.hot.lastModified = "1775685113155.3152";
}
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  generationPeriod: external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod)
})]);
var ParamsSchema = external_exports.object({});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function WorkingMemSettings() {
  _s();
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const sortedCleanupTasks = sortInboxTasksNaturally(loaderData.cleanUpInboxTasks, {
    dueDateAscending: false
  });
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
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "working-mem/settings", returnLocation: "/app/workspace/working-mem", inputsEnabled, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/working-mem/settings.tsx",
      lineNumber: 122,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Settings", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "working-mem-settings", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/working-mem/settings.tsx",
      lineNumber: 124,
      columnNumber: 46
    }, this), children: [
      /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
        fileName: "app/routes/app/workspace/working-mem/settings.tsx",
        lineNumber: 129,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "generationPeriod", children: "Generation Period" }, void 0, false, {
          fileName: "app/routes/app/workspace/working-mem/settings.tsx",
          lineNumber: 132,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(PeriodSelect, { labelId: "generationPeriod", label: "Generation Period", name: "generationPeriod", inputsEnabled, defaultValue: loaderData.generationPeriod, allowedValues: [import_webapi_client.RecurringTaskPeriod.DAILY, import_webapi_client.RecurringTaskPeriod.WEEKLY] }, void 0, false, {
          fileName: "app/routes/app/workspace/working-mem/settings.tsx",
          lineNumber: 133,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/generation_period" }, void 0, false, {
          fileName: "app/routes/app/workspace/working-mem/settings.tsx",
          lineNumber: 134,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/working-mem/settings.tsx",
        lineNumber: 131,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/working-mem/settings.tsx",
      lineNumber: 124,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Cleanup Tasks", children: sortedCleanupTasks && /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo, showOptions: {
      showStatus: true,
      showDueDate: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, inboxTasks: sortedCleanupTasks, onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone }, void 0, false, {
      fileName: "app/routes/app/workspace/working-mem/settings.tsx",
      lineNumber: 139,
      columnNumber: 32
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/working-mem/settings.tsx",
      lineNumber: 138,
      columnNumber: 7
    }, this)
  ] }, "working-mem/settings", true, {
    fileName: "app/routes/app/workspace/working-mem/settings.tsx",
    lineNumber: 121,
    columnNumber: 10
  }, this);
}
_s(WorkingMemSettings, "S4AC64MahKiBKjFRi1f2TiW4koc=", false, function() {
  return [useNavigation, useLoaderDataSafeForAnimation, useActionData, useFetcher];
});
_c = WorkingMemSettings;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/working-mem", ParamsSchema, {
  notFound: () => `Could not find the working memory settings!`,
  error: () => `There was an error loading the working memory settings! Please try again!`
});
var _c;
$RefreshReg$(_c, "WorkingMemSettings");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  WorkingMemSettings as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/working-mem/settings-37B5EXD6.js.map
