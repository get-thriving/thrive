import {
  InboxTasksNoTasksCard
} from "/build/_shared/chunk-Y2XMZIJC.js";
import {
  actionableTimeToDateTime
} from "/build/_shared/chunk-GKFPZ6TR.js";
import {
  InboxTaskStack
} from "/build/_shared/chunk-IFDICYHD.js";
import {
  filterInboxTasksForDisplay,
  sortInboxTasksByEisenAndDifficulty
} from "/build/_shared/chunk-RTB3GZDR.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  CHORE
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/chores/component/inbox-tasks-widget.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function ChoreInboxTasksWidget(props) {
  const choreTasks = props.choreTasks;
  const today = aDateToDate(props.topLevelInfo.today).endOf("day");
  const endOfTheWeek = today.endOf("week").endOf("day");
  const actionableTime = actionableTimeToDateTime(
    "one-week" /* ONE_WEEK */,
    props.topLevelInfo.user.timezone
  );
  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(
    choreTasks.choreInboxTasks
  );
  const inboxTasksForChoresDueToday = filterInboxTasksForDisplay(
    sortedInboxTasks,
    choreTasks.choreEntriesByRefId,
    choreTasks.optimisticUpdates,
    {
      allowSources: [CHORE],
      allowStatuses: [
        import_webapi_client.InboxTaskStatus.NOT_STARTED,
        import_webapi_client.InboxTaskStatus.IN_PROGRESS,
        import_webapi_client.InboxTaskStatus.BLOCKED
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: today,
      allowPeriodsIfChore: [import_webapi_client.RecurringTaskPeriod.DAILY]
    }
  );
  const inboxTasksForChoresDueThisWeek = filterInboxTasksForDisplay(
    sortedInboxTasks,
    choreTasks.choreEntriesByRefId,
    choreTasks.optimisticUpdates,
    {
      allowSources: [CHORE],
      allowStatuses: [
        import_webapi_client.InboxTaskStatus.NOT_STARTED,
        import_webapi_client.InboxTaskStatus.IN_PROGRESS,
        import_webapi_client.InboxTaskStatus.BLOCKED
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: endOfTheWeek,
      allowPeriodsIfChore: [import_webapi_client.RecurringTaskPeriod.WEEKLY]
    }
  );
  const choresStack = /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      InboxTaskStack,
      {
        topLevelInfo: props.topLevelInfo,
        showOptions: {
          showStatus: true,
          showEisen: true,
          showDifficulty: true,
          showParent: true,
          showHandleMarkDone: true,
          showHandleMarkNotDone: true
        },
        label: "Due Today",
        inboxTasks: inboxTasksForChoresDueToday,
        optimisticUpdates: choreTasks.optimisticUpdates,
        moreInfoByRefId: choreTasks.choreEntriesByRefId,
        onCardMarkDone: choreTasks.onCardMarkDone,
        onCardMarkNotDone: choreTasks.onCardMarkNotDone
      },
      "chore-due-today",
      false,
      {
        fileName: "../core/jupiter/core/chores/component/inbox-tasks-widget.tsx",
        lineNumber: 68,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      InboxTaskStack,
      {
        topLevelInfo: props.topLevelInfo,
        showOptions: {
          showStatus: true,
          showEisen: true,
          showDifficulty: true,
          showParent: true,
          showHandleMarkDone: true,
          showHandleMarkNotDone: true
        },
        label: "Due This Week",
        inboxTasks: inboxTasksForChoresDueThisWeek,
        optimisticUpdates: choreTasks.optimisticUpdates,
        moreInfoByRefId: choreTasks.choreEntriesByRefId,
        onCardMarkDone: choreTasks.onCardMarkDone,
        onCardMarkNotDone: choreTasks.onCardMarkNotDone
      },
      "chore-due-this-week",
      false,
      {
        fileName: "../core/jupiter/core/chores/component/inbox-tasks-widget.tsx",
        lineNumber: 87,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/chores/component/inbox-tasks-widget.tsx",
    lineNumber: 67,
    columnNumber: 5
  }, this);
  if (inboxTasksForChoresDueToday.length === 0 && inboxTasksForChoresDueThisWeek.length === 0) {
    return /* @__PURE__ */ jsxDEV(
      InboxTasksNoTasksCard,
      {
        parent: "chore",
        parentLabel: "New Chore",
        parentNewLocations: "/app/workspace/chores/new"
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/chores/component/inbox-tasks-widget.tsx",
        lineNumber: 113,
        columnNumber: 7
      },
      this
    );
  }
  return choresStack;
}

export {
  ChoreInboxTasksWidget
};
//# sourceMappingURL=/build/_shared/chunk-NOZT4BYV.js.map
