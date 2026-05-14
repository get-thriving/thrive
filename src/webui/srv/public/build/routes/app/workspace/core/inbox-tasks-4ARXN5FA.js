import {
  DragDropContext,
  InboxTaskKanbanBoard,
  SmallScreenKanban,
  SmallScreenKanbanByEisen
} from "/build/_shared/chunk-J7VR4UIC.js";
import {
  InboxTasksNoTasksCard
} from "/build/_shared/chunk-Y2XMZIJC.js";
import {
  TabPanel
} from "/build/_shared/chunk-VEYCIPLX.js";
import {
  actionableTimeToDateTime
} from "/build/_shared/chunk-GKFPZ6TR.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
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
  filterInboxTasksForDisplay,
  inboxTaskFindEntryToParent,
  isInboxTaskCoreFieldEditable,
  sortInboxTasksByEisenAndDifficulty,
  sortInboxTasksNaturally
} from "/build/_shared/chunk-RTB3GZDR.js";
import "/build/_shared/chunk-DNXYZ7BB.js";
import "/build/_shared/chunk-5CBAK2HS.js";
import "/build/_shared/chunk-NVWDLS2H.js";
import "/build/_shared/chunk-4TWETDNJ.js";
import "/build/_shared/chunk-NBD44M5V.js";
import {
  eisenIcon,
  eisenName
} from "/build/_shared/chunk-NLPUBZ3T.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  FilterFewOptionsCompact,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import "/build/_shared/chunk-MY6WUQK6.js";
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
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import {
  BIG_PLAN,
  CHORE,
  EMAIL_TASK,
  HABIT,
  JOURNAL,
  LIFE_PLAN_EVAL,
  METRIC,
  PERSON_CATCH_UP,
  PERSON_OCCASION,
  SLACK_TASK,
  TIME_PLAN,
  TODO_TASK,
  WORKING_MEM_CLEANUP,
  isWorkspaceFeatureAvailable,
  parentLinkNamespaceFromEntityLinkWire
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Flare_default,
  ViewKanban_default,
  ViewList_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  Box_default,
  Button_default,
  CardActions_default,
  CardContent_default,
  CardHeader_default,
  Card_default,
  Grid2_default,
  Stack_default,
  Tab_default,
  Tabs_default,
  Typography_default,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import {
  ServicePropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
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
  Link,
  Outlet,
  useFetcher
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

// app/routes/app/workspace/core/inbox-tasks.tsx
var import_webapi_client2 = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react3 = __toESM(require_react());

// ../core/jupiter/core/common/sub/inbox_tasks/component/no-nothing-card.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function InboxTasksNoNothingCard(props) {
  let initialText = "There are no inbox tasks to show. ";
  const { workspace } = props.topLevelInfo;
  const habitsAvailable = isWorkspaceFeatureAvailable(
    workspace,
    import_webapi_client.WorkspaceFeature.HABITS
  );
  const choresAvailable = isWorkspaceFeatureAvailable(
    workspace,
    import_webapi_client.WorkspaceFeature.CHORES
  );
  if (habitsAvailable && choresAvailable) {
    initialText += "You can create a new habit, chore, or inbox task.";
  } else if (habitsAvailable) {
    initialText += "You can create a new habit or inbox task.";
  } else if (choresAvailable) {
    initialText += "You can create a new chore or inbox task.";
  } else {
    initialText += "You can create a new inbox task.";
  }
  return /* @__PURE__ */ jsxDEV(Card_default, { children: [
    /* @__PURE__ */ jsxDEV(CardHeader_default, { title: "You have to start somewhere" }, void 0, false, {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-nothing-card.tsx",
      lineNumber: 44,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(CardContent_default, { children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: initialText }, void 0, false, {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-nothing-card.tsx",
      lineNumber: 46,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-nothing-card.tsx",
      lineNumber: 45,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(CardActions_default, { children: [
      isWorkspaceFeatureAvailable(
        props.topLevelInfo.workspace,
        import_webapi_client.WorkspaceFeature.HABITS
      ) && /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          variant: "contained",
          size: "small",
          component: Link,
          to: "/app/workspace/habits/new",
          children: "New Habit"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-nothing-card.tsx",
          lineNumber: 53,
          columnNumber: 11
        },
        this
      ),
      isWorkspaceFeatureAvailable(
        props.topLevelInfo.workspace,
        import_webapi_client.WorkspaceFeature.CHORES
      ) && /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          variant: "contained",
          size: "small",
          component: Link,
          to: "/app/workspace/chores/new",
          children: "New Chore"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-nothing-card.tsx",
          lineNumber: 66,
          columnNumber: 11
        },
        this
      ),
      isWorkspaceFeatureAvailable(
        props.topLevelInfo.workspace,
        import_webapi_client.WorkspaceFeature.TODO_TASK
      ) && /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          variant: "contained",
          size: "small",
          component: Link,
          to: "/app/workspace/todos/new",
          children: "New Todo"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-nothing-card.tsx",
          lineNumber: 79,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-nothing-card.tsx",
      lineNumber: 48,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-nothing-card.tsx",
    lineNumber: 43,
    columnNumber: 5
  }, this);
}

// app/routes/app/workspace/core/inbox-tasks.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/core/inbox-tasks.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/core/inbox-tasks.tsx"
  );
  import.meta.hot.lastModified = "1778356395327.6682";
}
var View = /* @__PURE__ */ function(View2) {
  View2["SWIFTVIEW"] = "siwiftview";
  View2["KANBAN_BY_EISEN"] = "kanban-by-eisen";
  View2["KANBAN"] = "kanban";
  View2["LIST"] = "list";
  return View2;
}(View || {});
var EISENS = [import_webapi_client2.Eisen.IMPORTANT_AND_URGENT, import_webapi_client2.Eisen.URGENT, import_webapi_client2.Eisen.IMPORTANT, import_webapi_client2.Eisen.REGULAR];
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function InboxTasks() {
  _s();
  const topLevelInfo = (0, import_react3.useContext)(TopLevelInfoContext);
  const {
    entries
  } = useLoaderDataSafeForAnimation();
  const serviceProperties = (0, import_react3.useContext)(ServicePropertiesContext);
  const isBigScreen = useBigScreen();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const sortedInboxTasks = sortInboxTasksNaturally(entries.map((e) => e.inbox_task));
  const inboxTasksByRefId = {};
  for (const entry of entries) {
    inboxTasksByRefId[entry.inbox_task.ref_id] = entry.inbox_task;
  }
  const entriesByRefId = {};
  for (const entry of entries) {
    entriesByRefId[entry.inbox_task.ref_id] = inboxTaskFindEntryToParent(entry);
  }
  const filteredSortedInboxTasks = sortedInboxTasks;
  const [selectedView, setSelectedView] = (0, import_react3.useState)(View.SWIFTVIEW);
  const kanbanBoardMoveFetcher = useFetcher();
  const [optimisticUpdates, setOptimisticUpdates] = (0, import_react3.useState)({});
  const [draggedInboxTaskId, setDraggedInboxTaskId] = (0, import_react3.useState)(void 0);
  function onDragStart(start) {
    setDraggedInboxTaskId(start.draggableId);
  }
  function onDragEnd(result) {
    setDraggedInboxTaskId(void 0);
    if (!result.destination) {
      return null;
    }
    const destination = result.destination.droppableId.split(":");
    const eisenSchema = external_exports.nativeEnum(import_webapi_client2.Eisen).or(external_exports.literal("undefined").transform((_) => void 0));
    const statusSchema = external_exports.nativeEnum(import_webapi_client2.InboxTaskStatus);
    const eisen = eisenSchema.parse(destination[1]);
    const status = statusSchema.parse(destination[2]);
    const inboxTask = inboxTasksByRefId[result.draggableId];
    if (!isInboxTaskCoreFieldEditable(parentLinkNamespaceFromEntityLinkWire(inboxTask.owner))) {
      if (eisen && inboxTask.eisen !== eisen) {
        return null;
      }
    }
    setOptimisticUpdates((oldOptimisticUpdates) => {
      return {
        ...oldOptimisticUpdates,
        [result.draggableId]: {
          status,
          eisen
        }
      };
    });
    if (isInboxTaskCoreFieldEditable(parentLinkNamespaceFromEntityLinkWire(inboxTask.owner))) {
      kanbanBoardMoveFetcher.submit({
        id: result.draggableId,
        eisen: eisen?.toString() || "no-go",
        status
      }, {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
      });
    } else {
      kanbanBoardMoveFetcher.submit({
        id: result.draggableId,
        eisen: "no-go",
        status
      }, {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
      });
    }
  }
  function handleCardMarkDone(it) {
    setOptimisticUpdates((oldOptimisticUpdates) => {
      return {
        ...oldOptimisticUpdates,
        [it.ref_id]: {
          status: import_webapi_client2.InboxTaskStatus.DONE,
          eisen: oldOptimisticUpdates[it.ref_id]?.eisen ?? it.eisen
        }
      };
    });
    setTimeout(() => {
      kanbanBoardMoveFetcher.submit({
        id: it.ref_id,
        status: import_webapi_client2.InboxTaskStatus.DONE
      }, {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
      });
    }, 0);
  }
  function handleCardMarkNotDone(it) {
    setOptimisticUpdates((oldOptimisticUpdates) => {
      return {
        ...oldOptimisticUpdates,
        [it.ref_id]: {
          status: import_webapi_client2.InboxTaskStatus.NOT_DONE,
          eisen: oldOptimisticUpdates[it.ref_id]?.eisen ?? it.eisen
        }
      };
    });
    setTimeout(() => {
      kanbanBoardMoveFetcher.submit({
        id: it.ref_id,
        status: import_webapi_client2.InboxTaskStatus.NOT_DONE
      }, {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
      });
    }, 0);
  }
  const [selectedActionableTime, setSelectedActionableTime] = (0, import_react3.useState)("now" /* NOW */);
  const shouldDoAGc = figureOutIfGcIsRecommended(entries, optimisticUpdates, serviceProperties.inboxTasksToAskForGC);
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "inbox-tasks-actions", topLevelInfo, inputsEnabled: true, actions: [FilterFewOptionsCompact("View", selectedView, [{
    value: View.SWIFTVIEW,
    text: "SwiftView",
    icon: /* @__PURE__ */ jsxDEV(Flare_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 199,
      columnNumber: 11
    }, this)
  }, {
    value: View.KANBAN_BY_EISEN,
    text: "Kanban by Eisen",
    icon: /* @__PURE__ */ jsxDEV(ViewKanban_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 203,
      columnNumber: 11
    }, this)
  }, {
    value: View.KANBAN,
    text: "Kanban",
    icon: /* @__PURE__ */ jsxDEV(ViewKanban_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 207,
      columnNumber: 11
    }, this)
  }, {
    value: View.LIST,
    text: "List",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 211,
      columnNumber: 11
    }, this)
  }], (selected) => setSelectedView(selected)), FilterFewOptionsCompact("Actionable", selectedActionableTime, [{
    value: "now" /* NOW */,
    text: "From Now",
    icon: /* @__PURE__ */ jsxDEV(Flare_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 215,
      columnNumber: 11
    }, this)
  }, {
    value: "one-week" /* ONE_WEEK */,
    text: "From One Week",
    icon: /* @__PURE__ */ jsxDEV(Flare_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 219,
      columnNumber: 11
    }, this)
  }, {
    value: "one-month" /* ONE_MONTH */,
    text: "From One Month",
    icon: /* @__PURE__ */ jsxDEV(Flare_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 223,
      columnNumber: 11
    }, this)
  }], (selected) => setSelectedActionableTime(selected))] }, void 0, false, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 196,
    columnNumber: 83
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: [
      shouldDoAGc && /* @__PURE__ */ jsxDEV(GCSection, { children: [
        "There are quite a lot of finished inbox tasks. Consider doing a",
        " ",
        /* @__PURE__ */ jsxDEV(Link, { to: "/app/workspace/tools/gc", children: "GC" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 228,
          columnNumber: 13
        }, this),
        " to decultter and speed things up."
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 226,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: kanbanBoardMoveFetcher.data }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 233,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: kanbanBoardMoveFetcher.data, fieldName: "/status" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 234,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: kanbanBoardMoveFetcher.data, fieldName: "/eisen" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 235,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 232,
        columnNumber: 9
      }, this),
      selectedView === View.SWIFTVIEW && /* @__PURE__ */ jsxDEV(SwiftView, { topLevelInfo, isBigScreen, inboxTasks: filteredSortedInboxTasks, optimisticUpdates, moreInfoByRefId: entriesByRefId, actionableTime: selectedActionableTime, onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone }, void 0, false, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 238,
        columnNumber: 45
      }, this),
      selectedView === View.KANBAN_BY_EISEN && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        isBigScreen && /* @__PURE__ */ jsxDEV(DragDropContext, { onDragStart, onDragEnd, children: /* @__PURE__ */ jsxDEV(BigScreenKanbanByEisen, { topLevelInfo, inboxTasks: filteredSortedInboxTasks, optimisticUpdates, inboxTasksByRefId, moreInfoByRefId: entriesByRefId, actionableTime: selectedActionableTime, draggedInboxTaskId }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 242,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 241,
          columnNumber: 29
        }, this),
        !isBigScreen && /* @__PURE__ */ jsxDEV(SmallScreenKanbanByEisen, { topLevelInfo, inboxTasks: filteredSortedInboxTasks, optimisticUpdates, moreInfoByRefId: entriesByRefId, actionableTime: selectedActionableTime, onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone, emptyParent: "inbox task" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 245,
          columnNumber: 30
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 240,
        columnNumber: 51
      }, this),
      selectedView === View.KANBAN && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        isBigScreen && /* @__PURE__ */ jsxDEV(DragDropContext, { onDragStart, onDragEnd, children: /* @__PURE__ */ jsxDEV(BigScreenKanban, { topLevelInfo, inboxTasks: filteredSortedInboxTasks, optimisticUpdates, inboxTasksByRefId, moreInfoByRefId: entriesByRefId, actionableTime: selectedActionableTime, draggedInboxTaskId }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 250,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 249,
          columnNumber: 29
        }, this),
        !isBigScreen && /* @__PURE__ */ jsxDEV(SmallScreenKanban, { topLevelInfo, inboxTasks: filteredSortedInboxTasks, optimisticUpdates, moreInfoByRefId: entriesByRefId, actionableTime: selectedActionableTime, onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone, emptyParent: "inbox task" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 253,
          columnNumber: 30
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 248,
        columnNumber: 42
      }, this),
      selectedView === View.LIST && /* @__PURE__ */ jsxDEV(List, { topLevelInfo, inboxTasks: filteredSortedInboxTasks, optimisticUpdates, moreInfoByRefId: entriesByRefId, onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone }, void 0, false, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 256,
        columnNumber: 40
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 225,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 260,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 259,
      columnNumber: 7
    }, this)
  ] }, "inbox-tasks", true, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 196,
    columnNumber: 10
  }, this);
}
_s(InboxTasks, "Yvo+odasObkQO6ps90dLczQpLfQ=", false, function() {
  return [useLoaderDataSafeForAnimation, useBigScreen, useTrunkNeedsToShowLeaf, useFetcher];
});
_c = InboxTasks;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the inbox tasks! Please try again!`
});
var GCSection = styled_default(Box_default)(({
  theme
}) => ({
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
  color: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[900],
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  "& a": {
    color: theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.primary.dark,
    fontWeight: 600
  }
}));
_c2 = GCSection;
function SwiftView(props) {
  _s2();
  const swiftViewRestSources = [BIG_PLAN, TODO_TASK, WORKING_MEM_CLEANUP, TIME_PLAN, JOURNAL, METRIC, LIFE_PLAN_EVAL, PERSON_OCCASION, PERSON_CATCH_UP, SLACK_TASK, EMAIL_TASK];
  const endOfTheWeek = aDateToDate(props.topLevelInfo.today).endOf("week").endOf("day");
  const endOfTheMonth = aDateToDate(props.topLevelInfo.today).endOf("month").endOf("day");
  const endOfTheQuarter = aDateToDate(props.topLevelInfo.today).endOf("quarter").endOf("day");
  const endOfTheYear = aDateToDate(props.topLevelInfo.today).endOf("year").endOf("day");
  const actionableTime = actionableTimeToDateTime(props.actionableTime, props.topLevelInfo.user.timezone);
  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(props.inboxTasks);
  const inboxTasksForHabitsDueToday = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: [HABIT],
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateEnd: aDateToDate(props.topLevelInfo.today),
    allowPeriodsIfHabit: [import_webapi_client2.RecurringTaskPeriod.DAILY]
  });
  const inboxTasksForHabitsDueThisWeek = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: [HABIT],
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateEnd: endOfTheWeek,
    allowPeriodsIfHabit: [import_webapi_client2.RecurringTaskPeriod.WEEKLY]
  });
  const inboxTasksForHabitsDueThisMonth = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: [HABIT],
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateEnd: endOfTheMonth,
    allowPeriodsIfHabit: [import_webapi_client2.RecurringTaskPeriod.MONTHLY]
  });
  const inboxTasksForHabitsDueThisQuarter = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: [HABIT],
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateEnd: endOfTheQuarter,
    allowPeriodsIfHabit: [import_webapi_client2.RecurringTaskPeriod.QUARTERLY]
  });
  const inboxTasksForHabitsDueThisYear = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: [HABIT],
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    includeIfNoDueDate: true,
    dueDateEnd: endOfTheYear,
    allowPeriodsIfHabit: [import_webapi_client2.RecurringTaskPeriod.YEARLY]
  });
  const inboxTasksForChoresDueToday = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: [CHORE],
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateEnd: aDateToDate(props.topLevelInfo.today),
    allowPeriodsIfChore: [import_webapi_client2.RecurringTaskPeriod.DAILY]
  });
  const inboxTasksForChoresDueThisWeek = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: [CHORE],
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateEnd: endOfTheWeek,
    allowPeriodsIfChore: [import_webapi_client2.RecurringTaskPeriod.WEEKLY]
  });
  const inboxTasksForChoresDueThisMonth = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: [CHORE],
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateEnd: endOfTheMonth,
    allowPeriodsIfChore: [import_webapi_client2.RecurringTaskPeriod.MONTHLY]
  });
  const inboxTasksForChoresDueThisQuarter = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: [CHORE],
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateEnd: endOfTheQuarter,
    allowPeriodsIfChore: [import_webapi_client2.RecurringTaskPeriod.QUARTERLY]
  });
  const inboxTasksForChoresDueThisYear = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: [CHORE],
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    includeIfNoDueDate: true,
    dueDateEnd: endOfTheYear,
    allowPeriodsIfChore: [import_webapi_client2.RecurringTaskPeriod.YEARLY]
  });
  const inboxTasksForRestsDueToday = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: swiftViewRestSources,
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateEnd: aDateToDate(props.topLevelInfo.today)
  });
  const inboxTasksForRestsDueThisWeek = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: swiftViewRestSources,
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateStart: aDateToDate(props.topLevelInfo.today),
    dueDateEnd: endOfTheWeek
  });
  const inboxTasksForRestsDueThisMonth = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: swiftViewRestSources,
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateStart: endOfTheWeek,
    dueDateEnd: endOfTheMonth
  });
  const inboxTasksForRestsDueThisQuarter = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: swiftViewRestSources,
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    dueDateStart: endOfTheMonth,
    dueDateEnd: endOfTheQuarter
  });
  const inboxTasksForRestsDueThisYear = filterInboxTasksForDisplay(sortedInboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowSources: swiftViewRestSources,
    allowStatuses: [import_webapi_client2.InboxTaskStatus.NOT_STARTED, import_webapi_client2.InboxTaskStatus.IN_PROGRESS, import_webapi_client2.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
    includeIfNoDueDate: true,
    dueDateStart: endOfTheQuarter,
    dueDateEnd: endOfTheYear
  });
  const habitsStack = /* @__PURE__ */ jsxDEV(Stack_default, { children: /* @__PURE__ */ jsxDEV(AnimatePresence, { children: [
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showEisen: true,
      showDifficulty: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due Today", inboxTasks: inboxTasksForHabitsDueToday, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "habit-due-today", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 418,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showEisen: true,
      showDifficulty: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Week", inboxTasks: inboxTasksForHabitsDueThisWeek, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "habit-due-this-week", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 427,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showEisen: true,
      showDifficulty: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Month", inboxTasks: inboxTasksForHabitsDueThisMonth, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "habit-due-this-month", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 436,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showEisen: true,
      showDifficulty: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Quarter", inboxTasks: inboxTasksForHabitsDueThisQuarter, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "habit-due-this-quarter", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 446,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showEisen: true,
      showDifficulty: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Year", inboxTasks: inboxTasksForHabitsDueThisYear, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "habit-due-this-year", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 456,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 417,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 416,
    columnNumber: 23
  }, this);
  const choresStack = /* @__PURE__ */ jsxDEV(Stack_default, { children: /* @__PURE__ */ jsxDEV(AnimatePresence, { children: [
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showEisen: true,
      showDifficulty: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due Today", inboxTasks: inboxTasksForChoresDueToday, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "chore-due-today", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 469,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showEisen: true,
      showDifficulty: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Week", inboxTasks: inboxTasksForChoresDueThisWeek, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "chore-due-this-week", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 478,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showEisen: true,
      showDifficulty: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Month", inboxTasks: inboxTasksForChoresDueThisMonth, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "chore-due-this-month", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 487,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showEisen: true,
      showDifficulty: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Quarter", inboxTasks: inboxTasksForChoresDueThisQuarter, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "chore-due-this-quarter", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 497,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showEisen: true,
      showDifficulty: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Year", inboxTasks: inboxTasksForChoresDueThisYear, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "chore-due-this-year", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 507,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 468,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 467,
    columnNumber: 23
  }, this);
  const restStack = /* @__PURE__ */ jsxDEV(Stack_default, { children: /* @__PURE__ */ jsxDEV(AnimatePresence, { children: [
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showSource: true,
      showEisen: true,
      showDifficulty: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due Today", inboxTasks: inboxTasksForRestsDueToday, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "rest-due-today", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 520,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showSource: true,
      showEisen: true,
      showDifficulty: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Week", inboxTasks: inboxTasksForRestsDueThisWeek, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "rest-due-this-week", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 530,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showSource: true,
      showEisen: true,
      showDifficulty: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Month", inboxTasks: inboxTasksForRestsDueThisMonth, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "rest-due-this-month", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 540,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showSource: true,
      showEisen: true,
      showDifficulty: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Quarter", inboxTasks: inboxTasksForRestsDueThisQuarter, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "rest-due-this-quarter", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 551,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo: props.topLevelInfo, showOptions: {
      showStatus: true,
      showSource: true,
      showEisen: true,
      showDifficulty: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, label: "Due This Year", inboxTasks: inboxTasksForRestsDueThisYear, optimisticUpdates: props.optimisticUpdates, moreInfoByRefId: props.moreInfoByRefId, onCardMarkDone: props.onCardMarkDone, onCardMarkNotDone: props.onCardMarkNotDone }, "rest-due-this-year", false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 562,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 519,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 518,
    columnNumber: 21
  }, this);
  const noHabits = inboxTasksForHabitsDueToday.length === 0 && inboxTasksForHabitsDueThisWeek.length === 0 && inboxTasksForHabitsDueThisMonth.length === 0 && inboxTasksForHabitsDueThisQuarter.length === 0 && inboxTasksForHabitsDueThisYear.length === 0;
  const noChores = inboxTasksForChoresDueToday.length === 0 && inboxTasksForChoresDueThisWeek.length === 0 && inboxTasksForChoresDueThisMonth.length === 0 && inboxTasksForChoresDueThisQuarter.length === 0 && inboxTasksForChoresDueThisYear.length === 0;
  const noRests = inboxTasksForRestsDueToday.length === 0 && inboxTasksForRestsDueThisWeek.length === 0 && inboxTasksForRestsDueThisMonth.length === 0 && inboxTasksForRestsDueThisQuarter.length === 0 && inboxTasksForRestsDueThisYear.length === 0;
  const noNothing = noHabits && noChores && noRests;
  const noHabitsCard = /* @__PURE__ */ jsxDEV(InboxTasksNoTasksCard, { parent: "habit", parentLabel: "New Habit", parentNewLocations: "/app/workspace/habits/new" }, void 0, false, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 578,
    columnNumber: 24
  }, this);
  const noChoresCard = /* @__PURE__ */ jsxDEV(InboxTasksNoTasksCard, { parent: "chore", parentLabel: "New Chore", parentNewLocations: "/app/workspace/chores/new" }, void 0, false, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 579,
    columnNumber: 24
  }, this);
  const noRestsCard = /* @__PURE__ */ jsxDEV(InboxTasksNoTasksCard, { parent: "inbox task" }, void 0, false, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 580,
    columnNumber: 23
  }, this);
  const noNothingCard = /* @__PURE__ */ jsxDEV(InboxTasksNoNothingCard, { topLevelInfo: props.topLevelInfo }, void 0, false, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 581,
    columnNumber: 25
  }, this);
  let initialSmallScreenSelectedTab = 0;
  if (!noHabits) {
    initialSmallScreenSelectedTab = 0;
  } else if (!noChores) {
    initialSmallScreenSelectedTab = 1;
  } else if (!noRests) {
    initialSmallScreenSelectedTab = 2;
  }
  const [smallScreenSelectedTab, setSmallScreenSelectedTab] = (0, import_react3.useState)(initialSmallScreenSelectedTab);
  if (noNothing) {
    return /* @__PURE__ */ jsxDEV(Fragment, { children: noNothingCard }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 592,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(Grid2_default, { container: true, spacing: 2, children: [
    props.isBigScreen && !noNothing && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      isWorkspaceFeatureAvailable(props.topLevelInfo.workspace, import_webapi_client2.WorkspaceFeature.HABITS) && /* @__PURE__ */ jsxDEV(Grid2_default, { size: {
        md: 4
      }, children: [
        /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h5", children: "\u{1F4AA} Habits" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 599,
          columnNumber: 15
        }, this),
        !noHabits && habitsStack,
        noHabits && noHabitsCard
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 596,
        columnNumber: 98
      }, this),
      isWorkspaceFeatureAvailable(props.topLevelInfo.workspace, import_webapi_client2.WorkspaceFeature.CHORES) && /* @__PURE__ */ jsxDEV(Grid2_default, { size: {
        md: 4
      }, children: [
        /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h5", children: "\u267B\uFE0F Chores" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 607,
          columnNumber: 15
        }, this),
        !noChores && choresStack,
        noChores && noChoresCard
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 604,
        columnNumber: 98
      }, this),
      /* @__PURE__ */ jsxDEV(Grid2_default, { size: {
        md: 4
      }, children: [
        /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h5", children: "\u{1F30D} Other Tasks" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 615,
          columnNumber: 13
        }, this),
        !noRests && restStack,
        noRests && noRestsCard
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 612,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 595,
      columnNumber: 43
    }, this),
    !props.isBigScreen && !noNothing && /* @__PURE__ */ jsxDEV(Grid2_default, { size: {
      xs: 12
    }, children: [
      /* @__PURE__ */ jsxDEV(Tabs_default, { value: smallScreenSelectedTab, variant: "fullWidth", onChange: (_, newValue) => setSmallScreenSelectedTab(newValue), children: [
        /* @__PURE__ */ jsxDEV(Tab_default, { icon: /* @__PURE__ */ jsxDEV("p", { children: "\u{1F4AA}" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 625,
          columnNumber: 24
        }, this), iconPosition: "top", label: "Habits" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 625,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Tab_default, { icon: /* @__PURE__ */ jsxDEV("p", { children: "\u267B\uFE0F" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 626,
          columnNumber: 24
        }, this), iconPosition: "top", label: "Chores" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 626,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Tab_default, { icon: /* @__PURE__ */ jsxDEV("p", { children: "\u{1F30D}" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 627,
          columnNumber: 24
        }, this), iconPosition: "top", label: "Rest" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 627,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 624,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TabPanel, { value: smallScreenSelectedTab, index: 0, children: [
        !noHabits && habitsStack,
        noHabits && noHabitsCard
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 630,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TabPanel, { value: smallScreenSelectedTab, index: 1, children: [
        !noChores && choresStack,
        noChores && noChoresCard
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 635,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TabPanel, { value: smallScreenSelectedTab, index: 2, children: [
        !noRests && restStack,
        noRests && noRestsCard
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 640,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 621,
      columnNumber: 44
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 594,
    columnNumber: 10
  }, this);
}
_s2(SwiftView, "/EQ5FWdIRolgdEdbCmKCWaNjyBE=");
_c3 = SwiftView;
function BigScreenKanbanByEisen({
  topLevelInfo,
  inboxTasks,
  optimisticUpdates,
  inboxTasksByRefId,
  moreInfoByRefId,
  actionableTime,
  draggedInboxTaskId
}) {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    inboxTasks.length === 0 && /* @__PURE__ */ jsxDEV(InboxTasksNoTasksCard, { parent: "inbox task" }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 659,
      columnNumber: 35
    }, this),
    inboxTasks.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: EISENS.map((e) => {
      return /* @__PURE__ */ jsxDEV(import_react3.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: `${eisenIcon(e)} ${eisenName(e)}`, size: "large" }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 663,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(InboxTaskKanbanBoard, { topLevelInfo, inboxTasks, optimisticUpdates, inboxTasksByRefId, moreInfoByRefId, actionableTime, allowEisen: e, draggedInboxTaskId }, void 0, false, {
          fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
          lineNumber: 664,
          columnNumber: 17
        }, this)
      ] }, e, true, {
        fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
        lineNumber: 662,
        columnNumber: 16
      }, this);
    }) }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 660,
      columnNumber: 33
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 658,
    columnNumber: 10
  }, this);
}
_c4 = BigScreenKanbanByEisen;
function BigScreenKanban({
  topLevelInfo,
  inboxTasks,
  optimisticUpdates,
  inboxTasksByRefId,
  moreInfoByRefId,
  actionableTime,
  allowEisen,
  draggedInboxTaskId
}) {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    inboxTasks.length === 0 && /* @__PURE__ */ jsxDEV(InboxTasksNoTasksCard, { parent: "inbox task" }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 682,
      columnNumber: 35
    }, this),
    inboxTasks.length > 0 && /* @__PURE__ */ jsxDEV(InboxTaskKanbanBoard, { topLevelInfo, inboxTasks, optimisticUpdates, inboxTasksByRefId, moreInfoByRefId, actionableTime, allowEisen, draggedInboxTaskId }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 683,
      columnNumber: 33
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 681,
    columnNumber: 10
  }, this);
}
_c5 = BigScreenKanban;
function List({
  topLevelInfo,
  inboxTasks,
  moreInfoByRefId,
  optimisticUpdates,
  onCardMarkDone,
  onCardMarkNotDone
}) {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    inboxTasks.length === 0 && /* @__PURE__ */ jsxDEV(InboxTasksNoTasksCard, { parent: "inbox task" }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 696,
      columnNumber: 35
    }, this),
    /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo, showOptions: {
      showStatus: true,
      showSource: true,
      showEisen: true,
      showDifficulty: true,
      showActionableDate: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, inboxTasks, moreInfoByRefId, optimisticUpdates, onCardMarkDone, onCardMarkNotDone }, void 0, false, {
      fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
      lineNumber: 697,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/core/inbox-tasks.tsx",
    lineNumber: 695,
    columnNumber: 10
  }, this);
}
_c6 = List;
function figureOutIfGcIsRecommended(entries, optimisticUpdates, inboxTasksToAskForGC) {
  let finishedTasksCnt = 0;
  for (const entry of entries) {
    if (entry.inbox_task.ref_id in optimisticUpdates) {
      if (optimisticUpdates[entry.inbox_task.ref_id].status === import_webapi_client2.InboxTaskStatus.DONE) {
        finishedTasksCnt++;
      } else if (optimisticUpdates[entry.inbox_task.ref_id].status === import_webapi_client2.InboxTaskStatus.NOT_DONE) {
        finishedTasksCnt++;
      }
    } else if (entry.inbox_task.status === import_webapi_client2.InboxTaskStatus.DONE) {
      finishedTasksCnt++;
    } else if (entry.inbox_task.status === import_webapi_client2.InboxTaskStatus.NOT_DONE) {
      finishedTasksCnt++;
    }
  }
  return finishedTasksCnt > inboxTasksToAskForGC;
}
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
var _c6;
$RefreshReg$(_c, "InboxTasks");
$RefreshReg$(_c2, "GCSection");
$RefreshReg$(_c3, "SwiftView");
$RefreshReg$(_c4, "BigScreenKanbanByEisen");
$RefreshReg$(_c5, "BigScreenKanban");
$RefreshReg$(_c6, "List");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  InboxTasks as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/core/inbox-tasks-4ARXN5FA.js.map
