import {
  CELL_FULL_SIZE,
  HabitStreakCalendar
} from "/build/_shared/chunk-NGY7EFUG.js";
import {
  isWidgetDimensionKSized,
  widgetDimensionCols,
  widgetDimensionRows
} from "/build/_shared/chunk-4ZSHFYIG.js";
import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
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
  HABIT
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  Box_default,
  Stack_default,
  Tab_default,
  Tabs_default,
  Typography_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/habits/component/key-habit-streak-widget.tsx
var import_react = __toESM(require_react(), 1);
var import_webapi_client = __toESM(require_dist(), 1);

// ../core/jupiter/core/habits/streak.ts
function limitKeyHabitResultsBasedOnScreenSize(keyHabitStreaks, daysToRestrict) {
  return keyHabitStreaks.map((h) => {
    const latestDate = h.streakMarkLatestDate;
    const realEarliestDate = aDateToDate(latestDate).minus({ days: daysToRestrict }).toISODate();
    return {
      ...h,
      streakMarkEarliestDate: realEarliestDate,
      streakMarks: h.streakMarks.filter((s) => s.date >= realEarliestDate)
    };
  });
}

// ../core/jupiter/core/habits/component/key-habit-streak-widget.tsx
var ANIMATION_DURATION_MS = 1e4;
function HabitKeyHabitStreakWidget(props) {
  const habitStreak = props.habitStreak;
  const theme = useTheme();
  const widgetContainer = (0, import_react.useRef)(null);
  const dimensionCols = widgetDimensionCols(props.geometry.dimension);
  const dimensionRows = widgetDimensionRows(props.geometry.dimension);
  const [keyHabitStreaks, setKeyHabitStreaks] = (0, import_react.useState)([]);
  (0, import_react.useEffect)(() => {
    if (!widgetContainer.current) {
      return;
    }
    const containerWidth = widgetContainer.current.clientWidth;
    const daysToInclude = (Math.floor(containerWidth / CELL_FULL_SIZE(theme)) - 1) * 7;
    setKeyHabitStreaks(
      limitKeyHabitResultsBasedOnScreenSize(
        habitStreak.entries.map((e) => ({
          habitRefId: e.habit.ref_id,
          streakMarkEarliestDate: habitStreak.earliestDate,
          streakMarkLatestDate: habitStreak.latestDate,
          streakMarks: e.streakMarks
        })),
        daysToInclude
      )
    );
  }, [
    theme,
    habitStreak.earliestDate,
    habitStreak.entries,
    habitStreak.latestDate,
    theme.typography.htmlFontSize
  ]);
  if (habitStreak.entries.length === 0) {
    return /* @__PURE__ */ jsxDEV(
      EntityNoNothingCard,
      {
        title: "No Key Habit Streaks",
        message: "No key habit streaks found. You can create a new habit to start a streak.",
        newEntityLocations: "/app/workspace/habits/new",
        helpSubject: import_webapi_client.DocsHelpSubject.HABITS
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
        lineNumber: 65,
        columnNumber: 7
      },
      this
    );
  }
  return /* @__PURE__ */ jsxDEV(Box_default, { id: "habit-key-habit-streak-widget-container", ref: widgetContainer, children: !isWidgetDimensionKSized(props.geometry.dimension) && dimensionRows === 1 && dimensionCols >= 1 ? /* @__PURE__ */ jsxDEV(
    HorizontalStreak,
    {
      widgetProps: props,
      keyHabitStreak: keyHabitStreaks
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
      lineNumber: 79,
      columnNumber: 9
    },
    this
  ) : /* @__PURE__ */ jsxDEV(VerticalStreak, { widgetProps: props, keyHabitStreak: keyHabitStreaks }, void 0, false, {
    fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
    lineNumber: 84,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
    lineNumber: 75,
    columnNumber: 5
  }, this);
}
function HorizontalStreak({
  widgetProps,
  keyHabitStreak
}) {
  const [selectedEntry, setSelectedEntry] = (0, import_react.useState)(0);
  const habitStreak = widgetProps.habitStreak;
  const habitsByRefId = new Map(
    habitStreak.entries.map((e) => [e.habit.ref_id, e.habit])
  );
  (0, import_react.useEffect)(() => {
    const interval = setInterval(() => {
      setSelectedEntry((entry) => (entry + 1) % habitStreak.entries.length);
    }, ANIMATION_DURATION_MS);
    return () => clearInterval(interval);
  }, [habitStreak.entries]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(Stack_default, { children: [
    /* @__PURE__ */ jsxDEV(
      Tabs_default,
      {
        value: selectedEntry,
        onChange: (_, value) => setSelectedEntry(value),
        variant: "scrollable",
        scrollButtons: "auto",
        sx: { marginBottom: "0.5rem" },
        children: keyHabitStreak.map((entry, index) => /* @__PURE__ */ jsxDEV(
          Tab_default,
          {
            label: habitsByRefId.get(entry.habitRefId)?.name ?? "Unknown Habit"
          },
          index,
          false,
          {
            fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
            lineNumber: 123,
            columnNumber: 13
          },
          this
        ))
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
        lineNumber: 115,
        columnNumber: 9
      },
      this
    ),
    keyHabitStreak.map((entry, index) => /* @__PURE__ */ jsxDEV(import_react.Fragment, { children: index === selectedEntry && /* @__PURE__ */ jsxDEV(
      HabitStreakCalendar,
      {
        earliestDate: entry.streakMarkEarliestDate,
        latestDate: entry.streakMarkLatestDate,
        currentToday: habitStreak.currentToday,
        habit: habitsByRefId.get(entry.habitRefId),
        streakMarks: entry.streakMarks,
        noLabel: habitStreak.noLabel,
        label: habitStreak.label,
        showNav: habitStreak.showNav,
        getNavUrl: habitStreak.getNavUrl
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
        lineNumber: 134,
        columnNumber: 15
      },
      this
    ) }, index, false, {
      fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
      lineNumber: 132,
      columnNumber: 11
    }, this))
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
    lineNumber: 114,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
    lineNumber: 113,
    columnNumber: 5
  }, this);
}
function VerticalStreak({ widgetProps, keyHabitStreak }) {
  const habitStreak = widgetProps.habitStreak;
  const habitsByRefId = new Map(
    habitStreak.entries.map((e) => [e.habit.ref_id, e.habit])
  );
  return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, children: keyHabitStreak.map((entry, index) => /* @__PURE__ */ jsxDEV(import_react.Fragment, { children: [
    /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", noWrap: true, children: habitsByRefId.get(entry.habitRefId)?.name ?? "Unknown Habit" }, void 0, false, {
      fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
      lineNumber: 168,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ jsxDEV(
      HabitStreakCalendar,
      {
        earliestDate: entry.streakMarkEarliestDate,
        latestDate: entry.streakMarkLatestDate,
        currentToday: habitStreak.currentToday,
        habit: habitsByRefId.get(entry.habitRefId),
        streakMarks: entry.streakMarks,
        noLabel: habitStreak.noLabel,
        label: habitStreak.label,
        showNav: habitStreak.showNav,
        getNavUrl: habitStreak.getNavUrl
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
        lineNumber: 171,
        columnNumber: 11
      },
      this
    )
  ] }, index, true, {
    fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
    lineNumber: 167,
    columnNumber: 9
  }, this)) }, void 0, false, {
    fileName: "../core/jupiter/core/habits/component/key-habit-streak-widget.tsx",
    lineNumber: 165,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/habits/component/inbox-tasks-widget.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
function HabitInboxTasksWidget(props) {
  const habitTasks = props.habitTasks;
  const today = aDateToDate(props.topLevelInfo.today).endOf("day");
  const endOfTheWeek = today.endOf("week").endOf("day");
  const actionableTime = actionableTimeToDateTime(
    "one-week" /* ONE_WEEK */,
    props.topLevelInfo.user.timezone
  );
  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(
    habitTasks.habitInboxTasks
  );
  const inboxTasksForHabitsDueToday = filterInboxTasksForDisplay(
    sortedInboxTasks,
    habitTasks.habitEntriesByRefId,
    habitTasks.optimisticUpdates,
    {
      allowSources: [HABIT],
      allowStatuses: [
        import_webapi_client2.InboxTaskStatus.NOT_STARTED,
        import_webapi_client2.InboxTaskStatus.IN_PROGRESS,
        import_webapi_client2.InboxTaskStatus.BLOCKED
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: today,
      allowPeriodsIfHabit: [import_webapi_client2.RecurringTaskPeriod.DAILY]
    }
  );
  const inboxTasksForHabitsDueThisWeek = filterInboxTasksForDisplay(
    sortedInboxTasks,
    habitTasks.habitEntriesByRefId,
    habitTasks.optimisticUpdates,
    {
      allowSources: [HABIT],
      allowStatuses: [
        import_webapi_client2.InboxTaskStatus.NOT_STARTED,
        import_webapi_client2.InboxTaskStatus.IN_PROGRESS,
        import_webapi_client2.InboxTaskStatus.BLOCKED
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: endOfTheWeek,
      allowPeriodsIfHabit: [import_webapi_client2.RecurringTaskPeriod.WEEKLY]
    }
  );
  const habitsStack = /* @__PURE__ */ jsxDEV(Fragment, { children: [
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
        inboxTasks: inboxTasksForHabitsDueToday,
        optimisticUpdates: habitTasks.optimisticUpdates,
        moreInfoByRefId: habitTasks.habitEntriesByRefId,
        onCardMarkDone: habitTasks.onCardMarkDone,
        onCardMarkNotDone: habitTasks.onCardMarkNotDone
      },
      "habit-due-today",
      false,
      {
        fileName: "../core/jupiter/core/habits/component/inbox-tasks-widget.tsx",
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
        inboxTasks: inboxTasksForHabitsDueThisWeek,
        optimisticUpdates: habitTasks.optimisticUpdates,
        moreInfoByRefId: habitTasks.habitEntriesByRefId,
        onCardMarkDone: habitTasks.onCardMarkDone,
        onCardMarkNotDone: habitTasks.onCardMarkNotDone
      },
      "habit-due-this-week",
      false,
      {
        fileName: "../core/jupiter/core/habits/component/inbox-tasks-widget.tsx",
        lineNumber: 87,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/habits/component/inbox-tasks-widget.tsx",
    lineNumber: 67,
    columnNumber: 5
  }, this);
  if (inboxTasksForHabitsDueToday.length === 0 && inboxTasksForHabitsDueThisWeek.length === 0) {
    return /* @__PURE__ */ jsxDEV(
      InboxTasksNoTasksCard,
      {
        parent: "habit",
        parentLabel: "New Habit",
        parentNewLocations: "/app/workspace/habits/new"
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/habits/component/inbox-tasks-widget.tsx",
        lineNumber: 113,
        columnNumber: 7
      },
      this
    );
  }
  return habitsStack;
}

export {
  HabitKeyHabitStreakWidget,
  HabitInboxTasksWidget
};
//# sourceMappingURL=/build/_shared/chunk-GQBIXOO6.js.map
