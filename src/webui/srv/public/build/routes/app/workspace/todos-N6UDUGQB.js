import {
  ChapterTag,
  GoalTag
} from "/build/_shared/chunk-R6BBIENF.js";
import {
  AspectTag
} from "/build/_shared/chunk-TD4OCNC5.js";
import {
  ContactTag
} from "/build/_shared/chunk-SLZ5UQVD.js";
import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
import {
  DragDropContext,
  InboxTaskKanbanBoard,
  SmallScreenKanban,
  SmallScreenKanbanByEisen
} from "/build/_shared/chunk-J7VR4UIC.js";
import "/build/_shared/chunk-Y2XMZIJC.js";
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
import {
  DifficultyTag,
  EisenTag
} from "/build/_shared/chunk-U5MVWZEK.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  filterInboxTasksForDisplay,
  isInboxTaskCoreFieldEditable,
  sortInboxTasksNaturally
} from "/build/_shared/chunk-RTB3GZDR.js";
import "/build/_shared/chunk-DNXYZ7BB.js";
import {
  InboxTaskStatusTag
} from "/build/_shared/chunk-5CBAK2HS.js";
import "/build/_shared/chunk-NVWDLS2H.js";
import "/build/_shared/chunk-4TWETDNJ.js";
import {
  ADateTag
} from "/build/_shared/chunk-NBD44M5V.js";
import {
  eisenIcon,
  eisenName
} from "/build/_shared/chunk-NLPUBZ3T.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  FilterFewOptionsCompact,
  FilterManyOptions,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
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
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import {
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
import "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  Grid_default,
  Tab_default,
  Tabs_default,
  Typography_default
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
  useTrunkNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
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

// app/routes/app/workspace/todos.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/todos.tsx"' + id);
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
    "app/routes/app/workspace/todos.tsx"
  );
  import.meta.hot.lastModified = "1777213342613.767";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
var View = /* @__PURE__ */ function(View2) {
  View2["SWIFTVIEW"] = "swiftview";
  View2["LIST"] = "list";
  View2["KANBAN_BY_EISEN"] = "kanban-by-eisen";
  View2["KANBAN"] = "kanban";
  return View2;
}(View || {});
var EISENS = [import_webapi_client.Eisen.IMPORTANT_AND_URGENT, import_webapi_client.Eisen.URGENT, import_webapi_client.Eisen.IMPORTANT, import_webapi_client.Eisen.REGULAR];
function Todos() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const kanbanBoardMoveFetcher = useFetcher();
  const [selectedContactsRefId, setSelectedContactsRefId] = (0, import_react2.useState)([]);
  const [selectedView, setSelectedView] = (0, import_react2.useState)(View.SWIFTVIEW);
  const [selectedActionableTime, setSelectedActionableTime] = (0, import_react2.useState)("now" /* NOW */);
  const [optimisticUpdates, setOptimisticUpdates] = (0, import_react2.useState)({});
  const [draggedInboxTaskId, setDraggedInboxTaskId] = (0, import_react2.useState)(void 0);
  const entries = loaderData.entries;
  const filteredEntries = entries.filter((entry) => {
    const contactsOk = selectedContactsRefId.length === 0 || entry.contacts?.some((contact) => selectedContactsRefId.includes(contact.ref_id));
    return contactsOk;
  });
  const sortedTodoTasks = [...filteredEntries].sort((a, b) => a.todo_task.name.localeCompare(b.todo_task.name)).map((e) => e.todo_task);
  const todoInboxEntries = filteredEntries.filter((entry) => entry.inbox_task !== void 0 && entry.inbox_task !== null);
  const sortedTodoInboxTasks = sortInboxTasksNaturally(todoInboxEntries.map((entry) => entry.inbox_task));
  const inboxTasksByRefId = {};
  const moreInfoByRefId = {};
  for (const entry of todoInboxEntries) {
    const inboxTask = entry.inbox_task;
    inboxTasksByRefId[inboxTask.ref_id] = inboxTask;
    moreInfoByRefId[inboxTask.ref_id] = {
      todoTask: entry.todo_task
    };
  }
  function onDragStart(start) {
    setDraggedInboxTaskId(start.draggableId);
  }
  function onDragEnd(result) {
    setDraggedInboxTaskId(void 0);
    if (!result.destination) {
      return;
    }
    const destination = result.destination.droppableId.split(":");
    const droppableEisen = destination[1];
    const status = destination[2];
    const eisen = droppableEisen === "undefined" ? void 0 : droppableEisen;
    const inboxTask = inboxTasksByRefId[result.draggableId];
    if (!inboxTask) {
      return;
    }
    if (!isInboxTaskCoreFieldEditable(parentLinkNamespaceFromEntityLinkWire(inboxTask.owner))) {
      if (eisen && inboxTask.eisen !== eisen) {
        return;
      }
    }
    setOptimisticUpdates((oldOptimisticUpdates) => ({
      ...oldOptimisticUpdates,
      [result.draggableId]: {
        status,
        eisen
      }
    }));
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
    setOptimisticUpdates((oldOptimisticUpdates) => ({
      ...oldOptimisticUpdates,
      [it.ref_id]: {
        status: import_webapi_client.InboxTaskStatus.DONE,
        eisen: oldOptimisticUpdates[it.ref_id]?.eisen ?? it.eisen
      }
    }));
    setTimeout(() => {
      kanbanBoardMoveFetcher.submit({
        id: it.ref_id,
        status: import_webapi_client.InboxTaskStatus.DONE
      }, {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
      });
    }, 0);
  }
  function handleCardMarkNotDone(it) {
    setOptimisticUpdates((oldOptimisticUpdates) => ({
      ...oldOptimisticUpdates,
      [it.ref_id]: {
        status: import_webapi_client.InboxTaskStatus.NOT_DONE,
        eisen: oldOptimisticUpdates[it.ref_id]?.eisen ?? it.eisen
      }
    }));
    setTimeout(() => {
      kanbanBoardMoveFetcher.submit({
        id: it.ref_id,
        status: import_webapi_client.InboxTaskStatus.NOT_DONE
      }, {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
      });
    }, 0);
  }
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/todos/new", returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "todos-actions", topLevelInfo, inputsEnabled: true, actions: [FilterFewOptionsCompact("View", selectedView, [{
    value: View.SWIFTVIEW,
    text: "SwiftView",
    icon: /* @__PURE__ */ jsxDEV(Flare_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 213,
      columnNumber: 11
    }, this)
  }, {
    value: View.LIST,
    text: "List",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 217,
      columnNumber: 11
    }, this)
  }, {
    value: View.KANBAN_BY_EISEN,
    text: "Kanban by Eisen",
    icon: /* @__PURE__ */ jsxDEV(ViewKanban_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 221,
      columnNumber: 11
    }, this)
  }, {
    value: View.KANBAN,
    text: "Kanban",
    icon: /* @__PURE__ */ jsxDEV(ViewKanban_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 225,
      columnNumber: 11
    }, this)
  }], setSelectedView), FilterFewOptionsCompact("Actionable", selectedActionableTime, [{
    value: "now" /* NOW */,
    text: "From Now",
    icon: /* @__PURE__ */ jsxDEV(Flare_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 229,
      columnNumber: 11
    }, this)
  }, {
    value: "one-week" /* ONE_WEEK */,
    text: "From One Week",
    icon: /* @__PURE__ */ jsxDEV(Flare_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 233,
      columnNumber: 11
    }, this)
  }, {
    value: "one-month" /* ONE_MONTH */,
    text: "From One Month",
    icon: /* @__PURE__ */ jsxDEV(Flare_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 237,
      columnNumber: 11
    }, this)
  }], setSelectedActionableTime), FilterManyOptions("Contacts", loaderData.allContacts.map((contact) => ({
    value: contact.ref_id,
    text: contact.name
  })), setSelectedContactsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/todos.tsx",
    lineNumber: 210,
    columnNumber: 119
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: [
      /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: kanbanBoardMoveFetcher.data }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 243,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FieldError, { actionResult: kanbanBoardMoveFetcher.data, fieldName: "/status" }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 244,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FieldError, { actionResult: kanbanBoardMoveFetcher.data, fieldName: "/eisen" }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 245,
        columnNumber: 9
      }, this),
      sortedTodoTasks.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { helpSubject: import_webapi_client.DocsHelpSubject.TODOS, title: "You Have To Start Somewhere", message: "There are no todo tasks to show. You can create a new task.", newEntityLocations: "/app/workspace/todos/new" }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 248,
        columnNumber: 42
      }, this),
      selectedView === View.LIST && sortedTodoTasks.length > 0 && /* @__PURE__ */ jsxDEV(EntityStack, { children: sortedTodoTasks.map((todoTask) => {
        const entry = filteredEntries.find((e) => e.todo_task.ref_id === todoTask.ref_id);
        const inboxTask = entry?.inbox_task ?? void 0;
        return /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `todo-task-${todoTask.ref_id}`, allowMarkDone: inboxTask !== void 0, allowMarkNotDone: inboxTask !== void 0, onMarkDone: () => {
          if (inboxTask) {
            handleCardMarkDone(inboxTask);
          }
        }, onMarkNotDone: () => {
          if (inboxTask) {
            handleCardMarkNotDone(inboxTask);
          }
        }, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/todos/${todoTask.ref_id}`, children: [
          /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: todoTask.name }, void 0, false, {
            fileName: "app/routes/app/workspace/todos.tsx",
            lineNumber: 265,
            columnNumber: 21
          }, this),
          entry?.aspect && /* @__PURE__ */ jsxDEV(AspectTag, { aspect: entry.aspect }, void 0, false, {
            fileName: "app/routes/app/workspace/todos.tsx",
            lineNumber: 266,
            columnNumber: 39
          }, this),
          entry?.chapter && /* @__PURE__ */ jsxDEV(ChapterTag, { chapter: entry.chapter }, void 0, false, {
            fileName: "app/routes/app/workspace/todos.tsx",
            lineNumber: 267,
            columnNumber: 40
          }, this),
          entry?.goal && /* @__PURE__ */ jsxDEV(GoalTag, { goal: entry.goal }, void 0, false, {
            fileName: "app/routes/app/workspace/todos.tsx",
            lineNumber: 268,
            columnNumber: 37
          }, this),
          entry?.contacts?.map((contact) => /* @__PURE__ */ jsxDEV(ContactTag, { contact }, contact.ref_id, false, {
            fileName: "app/routes/app/workspace/todos.tsx",
            lineNumber: 269,
            columnNumber: 54
          }, this)),
          inboxTask && /* @__PURE__ */ jsxDEV(InboxTaskStatusTag, { status: optimisticUpdates[inboxTask.ref_id]?.status ?? inboxTask.status }, void 0, false, {
            fileName: "app/routes/app/workspace/todos.tsx",
            lineNumber: 270,
            columnNumber: 35
          }, this),
          inboxTask && /* @__PURE__ */ jsxDEV(EisenTag, { eisen: optimisticUpdates[inboxTask.ref_id]?.eisen ?? inboxTask.eisen }, void 0, false, {
            fileName: "app/routes/app/workspace/todos.tsx",
            lineNumber: 271,
            columnNumber: 35
          }, this),
          inboxTask && /* @__PURE__ */ jsxDEV(DifficultyTag, { difficulty: inboxTask.difficulty }, void 0, false, {
            fileName: "app/routes/app/workspace/todos.tsx",
            lineNumber: 272,
            columnNumber: 35
          }, this),
          inboxTask?.actionable_date && /* @__PURE__ */ jsxDEV(ADateTag, { label: "Actionable from", date: inboxTask.actionable_date }, void 0, false, {
            fileName: "app/routes/app/workspace/todos.tsx",
            lineNumber: 273,
            columnNumber: 52
          }, this),
          inboxTask?.due_date && /* @__PURE__ */ jsxDEV(ADateTag, { label: "Due at", date: inboxTask.due_date }, void 0, false, {
            fileName: "app/routes/app/workspace/todos.tsx",
            lineNumber: 274,
            columnNumber: 45
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/todos.tsx",
          lineNumber: 264,
          columnNumber: 19
        }, this) }, `todo-task-${todoTask.ref_id}`, false, {
          fileName: "app/routes/app/workspace/todos.tsx",
          lineNumber: 255,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 251,
        columnNumber: 70
      }, this),
      selectedView === View.SWIFTVIEW && sortedTodoInboxTasks.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(TodoSwiftView, { topLevelInfo, isBigScreen, inboxTasks: sortedTodoInboxTasks, optimisticUpdates, moreInfoByRefId, actionableTime: selectedActionableTime, onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 282,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 281,
        columnNumber: 80
      }, this),
      selectedView === View.KANBAN && sortedTodoInboxTasks.length > 0 && isBigScreen && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(DragDropContext, { onDragStart, onDragEnd, children: /* @__PURE__ */ jsxDEV(InboxTaskKanbanBoard, { topLevelInfo, inboxTasks: sortedTodoInboxTasks, optimisticUpdates, inboxTasksByRefId, moreInfoByRefId, actionableTime: selectedActionableTime, draggedInboxTaskId, showOptions: {
        showSource: false,
        showEisen: true,
        showDifficulty: true,
        showDueDate: true
      }, cardLinkResolver: (inboxTask, parent) => parent?.todoTask ? `/app/workspace/todos/${parent.todoTask.ref_id}` : `/app/workspace/core/inbox-tasks/${inboxTask.ref_id}` }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 287,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 286,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 285,
        columnNumber: 92
      }, this),
      selectedView === View.KANBAN_BY_EISEN && sortedTodoInboxTasks.length > 0 && isBigScreen && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(DragDropContext, { onDragStart, onDragEnd, children: EISENS.map((e) => /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: `${eisenIcon(e)} ${eisenName(e)}`, size: "large" }, void 0, false, {
          fileName: "app/routes/app/workspace/todos.tsx",
          lineNumber: 299,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(InboxTaskKanbanBoard, { topLevelInfo, inboxTasks: sortedTodoInboxTasks, optimisticUpdates, inboxTasksByRefId, moreInfoByRefId, actionableTime: selectedActionableTime, allowEisen: e, draggedInboxTaskId, showOptions: {
          showSource: false,
          showEisen: false,
          showDifficulty: true,
          showDueDate: true
        }, cardLinkResolver: (inboxTask, parent) => parent?.todoTask ? `/app/workspace/todos/${parent.todoTask.ref_id}` : `/app/workspace/core/inbox-tasks/${inboxTask.ref_id}` }, void 0, false, {
          fileName: "app/routes/app/workspace/todos.tsx",
          lineNumber: 300,
          columnNumber: 21
        }, this)
      ] }, e, true, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 298,
        columnNumber: 34
      }, this)) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 297,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 296,
        columnNumber: 101
      }, this),
      selectedView === View.KANBAN && sortedTodoInboxTasks.length > 0 && !isBigScreen && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(SmallScreenKanban, { topLevelInfo, inboxTasks: sortedTodoInboxTasks, optimisticUpdates, moreInfoByRefId, actionableTime: selectedActionableTime, onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone, emptyParent: "todo task", emptyParentLabel: "New Todo Task", emptyParentNewLocations: "/app/workspace/todos/new", cardLinkResolver: (inboxTask, parent) => parent?.todoTask ? `/app/workspace/todos/${parent.todoTask.ref_id}` : `/app/workspace/core/inbox-tasks/${inboxTask.ref_id}` }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 311,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 310,
        columnNumber: 93
      }, this),
      selectedView === View.KANBAN_BY_EISEN && sortedTodoInboxTasks.length > 0 && !isBigScreen && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(SmallScreenKanbanByEisen, { topLevelInfo, inboxTasks: sortedTodoInboxTasks, optimisticUpdates, moreInfoByRefId, actionableTime: selectedActionableTime, onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone, emptyParent: "todo task", emptyParentLabel: "New Todo Task", emptyParentNewLocations: "/app/workspace/todos/new", cardLinkResolver: (inboxTask, parent) => parent?.todoTask ? `/app/workspace/todos/${parent.todoTask.ref_id}` : `/app/workspace/core/inbox-tasks/${inboxTask.ref_id}` }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 315,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 314,
        columnNumber: 102
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 242,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 320,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 319,
      columnNumber: 7
    }, this)
  ] }, "todos", true, {
    fileName: "app/routes/app/workspace/todos.tsx",
    lineNumber: 210,
    columnNumber: 10
  }, this);
}
_s(Todos, "kRQPGrACkxq6nBbaQX8YYpfyk6g=", false, function() {
  return [useLoaderDataSafeForAnimation, useBigScreen, useFetcher, useTrunkNeedsToShowLeaf];
});
_c = Todos;
function TodoSwiftView(props) {
  _s2();
  const endOfToday = aDateToDate(props.topLevelInfo.today).endOf("day");
  const endOfWeek = aDateToDate(props.topLevelInfo.today).endOf("week").endOf("day");
  const endOfMonth = aDateToDate(props.topLevelInfo.today).endOf("month").endOf("day");
  const startOfTomorrow = endOfToday.plus({
    days: 1
  }).startOf("day");
  const startAfterWeek = endOfWeek.plus({
    days: 1
  }).startOf("day");
  const startAfterMonth = endOfMonth.plus({
    days: 1
  }).startOf("day");
  const actionableDate = actionableTimeToDateTime(props.actionableTime, props.topLevelInfo.user.timezone);
  const dueToday = filterInboxTasksForDisplay(props.inboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowArchived: false,
    allowStatuses: [import_webapi_client.InboxTaskStatus.NOT_STARTED, import_webapi_client.InboxTaskStatus.IN_PROGRESS, import_webapi_client.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableDate,
    dueDateEnd: endOfToday
  });
  const dueThisWeek = filterInboxTasksForDisplay(props.inboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowArchived: false,
    allowStatuses: [import_webapi_client.InboxTaskStatus.NOT_STARTED, import_webapi_client.InboxTaskStatus.IN_PROGRESS, import_webapi_client.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableDate,
    dueDateStart: startOfTomorrow,
    dueDateEnd: endOfWeek
  });
  const dueThisMonth = filterInboxTasksForDisplay(props.inboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowArchived: false,
    allowStatuses: [import_webapi_client.InboxTaskStatus.NOT_STARTED, import_webapi_client.InboxTaskStatus.IN_PROGRESS, import_webapi_client.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableDate,
    dueDateStart: startAfterWeek,
    dueDateEnd: endOfMonth
  });
  const dueLater = filterInboxTasksForDisplay(props.inboxTasks, props.moreInfoByRefId, props.optimisticUpdates, {
    allowArchived: false,
    allowStatuses: [import_webapi_client.InboxTaskStatus.NOT_STARTED, import_webapi_client.InboxTaskStatus.IN_PROGRESS, import_webapi_client.InboxTaskStatus.BLOCKED],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableDate,
    includeIfNoDueDate: true,
    dueDateStart: startAfterMonth
  });
  let initialSelectedTab = 0;
  if (dueToday.length > 0) {
    initialSelectedTab = 0;
  } else if (dueThisWeek.length > 0) {
    initialSelectedTab = 1;
  } else if (dueThisMonth.length > 0) {
    initialSelectedTab = 2;
  } else if (dueLater.length > 0) {
    initialSelectedTab = 3;
  }
  const [selectedTab, setSelectedTab] = (0, import_react2.useState)(initialSelectedTab);
  const sharedProps = {
    topLevelInfo: props.topLevelInfo,
    showOptions: {
      showStatus: true,
      showSource: false,
      showEisen: true,
      showDifficulty: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    },
    optimisticUpdates: props.optimisticUpdates,
    moreInfoByRefId: props.moreInfoByRefId,
    onCardMarkDone: props.onCardMarkDone,
    onCardMarkNotDone: props.onCardMarkNotDone,
    cardLinkResolver: (inboxTask, parent) => parent?.todoTask ? `/app/workspace/todos/${parent.todoTask.ref_id}` : `/app/workspace/core/inbox-tasks/${inboxTask.ref_id}`
  };
  function renderBucket(label, tasks, options) {
    const showHeading = options?.showHeading ?? true;
    const newEntityLocation = options?.initialDueDate ? `/app/workspace/todos/new?initialDueDate=${options.initialDueDate}` : "/app/workspace/todos/new";
    return /* @__PURE__ */ jsxDEV(Fragment, { children: [
      showHeading && /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", sx: {
        mb: 1
      }, children: label }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 407,
        columnNumber: 25
      }, this),
      tasks.length > 0 ? /* @__PURE__ */ jsxDEV(InboxTaskStack, { ...sharedProps, inboxTasks: tasks }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 412,
        columnNumber: 29
      }, this) : /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { helpSubject: import_webapi_client.DocsHelpSubject.TODOS, title: "Nothing In This Bucket", message: "No todo tasks match this due-date bucket and actionable filter.", newEntityLocations: newEntityLocation }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 412,
        columnNumber: 86
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 406,
      columnNumber: 12
    }, this);
  }
  if (props.isBigScreen) {
    return /* @__PURE__ */ jsxDEV(Grid_default, { container: true, spacing: 2, children: [
      /* @__PURE__ */ jsxDEV(Grid_default, { item: true, xs: 12, md: 3, children: renderBucket("Due today", dueToday, {
        initialDueDate: "day"
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 417,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Grid_default, { item: true, xs: 12, md: 3, children: renderBucket("Due this week", dueThisWeek, {
        initialDueDate: "week"
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 422,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Grid_default, { item: true, xs: 12, md: 3, children: renderBucket("Due this month", dueThisMonth, {
        initialDueDate: "month"
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 427,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Grid_default, { item: true, xs: 12, md: 3, children: renderBucket("Due later", dueLater, {
        initialDueDate: "year"
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 432,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 416,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(Tabs_default, { value: selectedTab, variant: "fullWidth", onChange: (_, newValue) => setSelectedTab(newValue), children: [
      /* @__PURE__ */ jsxDEV(Tab_default, { label: "Due today" }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 441,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Tab_default, { label: "Due this week" }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 442,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Tab_default, { label: "Due this month" }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 443,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Tab_default, { label: "Due later" }, void 0, false, {
        fileName: "app/routes/app/workspace/todos.tsx",
        lineNumber: 444,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 440,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(TabPanel, { value: selectedTab, index: 0, children: renderBucket("Due today", dueToday, {
      showHeading: false,
      initialDueDate: "day"
    }) }, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 446,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(TabPanel, { value: selectedTab, index: 1, children: renderBucket("Due this week", dueThisWeek, {
      showHeading: false,
      initialDueDate: "week"
    }) }, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 452,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(TabPanel, { value: selectedTab, index: 2, children: renderBucket("Due this month", dueThisMonth, {
      showHeading: false,
      initialDueDate: "month"
    }) }, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 458,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(TabPanel, { value: selectedTab, index: 3, children: renderBucket("Due later", dueLater, {
      showHeading: false,
      initialDueDate: "year"
    }) }, void 0, false, {
      fileName: "app/routes/app/workspace/todos.tsx",
      lineNumber: 464,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/todos.tsx",
    lineNumber: 439,
    columnNumber: 10
  }, this);
}
_s2(TodoSwiftView, "kJvasYAZStW6OotbMkBoHE6+qAg=");
_c2 = TodoSwiftView;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the todo tasks! Please try again!`
});
var _c;
var _c2;
$RefreshReg$(_c, "Todos");
$RefreshReg$(_c2, "TodoSwiftView");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Todos as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/todos-N6UDUGQB.js.map
