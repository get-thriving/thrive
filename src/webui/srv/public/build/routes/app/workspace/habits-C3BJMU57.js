import {
  HabitInboxTasksWidget,
  HabitKeyHabitStreakWidget
} from "/build/_shared/chunk-GQBIXOO6.js";
import "/build/_shared/chunk-NGY7EFUG.js";
import {
  sortGoalsNaturally
} from "/build/_shared/chunk-OLMKSGLM.js";
import {
  computeAspectHierarchicalNameFromRoot,
  sortAspectsByTreeOrder
} from "/build/_shared/chunk-37FGSNWH.js";
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
  PeriodTag
} from "/build/_shared/chunk-HLPWZ3ZO.js";
import {
  comparePeriods,
  periodName
} from "/build/_shared/chunk-HVU6TG3B.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
import "/build/_shared/chunk-4ZSHFYIG.js";
import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
import "/build/_shared/chunk-Y2XMZIJC.js";
import "/build/_shared/chunk-GKFPZ6TR.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import "/build/_shared/chunk-IFDICYHD.js";
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
  inboxTaskFindEntryToParent,
  sortInboxTasksNaturally
} from "/build/_shared/chunk-RTB3GZDR.js";
import {
  compareIsKey
} from "/build/_shared/chunk-DNXYZ7BB.js";
import "/build/_shared/chunk-5CBAK2HS.js";
import {
  IsKeyTag
} from "/build/_shared/chunk-NVWDLS2H.js";
import "/build/_shared/chunk-4TWETDNJ.js";
import "/build/_shared/chunk-NBD44M5V.js";
import {
  compareDifficulty,
  compareEisen
} from "/build/_shared/chunk-NLPUBZ3T.js";
import {
  basicShouldRevalidate
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
import "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  DateTime,
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import {
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Flag_default,
  Flare_default,
  ViewList_default,
  ViewTimeline_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import {
  Box_default,
  Tab_default,
  Tabs_default
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
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
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

// app/routes/app/workspace/habits.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());

// ../core/jupiter/core/habits/root.ts
function sortHabitsNaturally(habits) {
  return [...habits].sort((c1, c2) => {
    if (!c1.suspended && c2.suspended) {
      return -1;
    } else if (c1.suspended && !c2.suspended) {
      return 1;
    }
    return compareIsKey(c1.is_key, c2.is_key) || comparePeriods(c1.gen_params.period, c2.gen_params.period) || compareEisen(c1.gen_params.eisen, c2.gen_params.eisen) || compareDifficulty(c1.gen_params.difficulty, c2.gen_params.difficulty);
  });
}

// app/routes/app/workspace/habits.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/habits.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/habits.tsx"
  );
  import.meta.hot.lastModified = "1777213342587.6978";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var Grouping = /* @__PURE__ */ function(Grouping2) {
  Grouping2["FLAT"] = "flat";
  Grouping2["BY_ASPECT"] = "by-aspect";
  Grouping2["BY_ASPECT_AND_GOAL"] = "by-aspect-and-goal";
  return Grouping2;
}(Grouping || {});
var PeriodBreakdown = /* @__PURE__ */ function(PeriodBreakdown2) {
  PeriodBreakdown2["LIST"] = "list";
  PeriodBreakdown2["BY_PERIOD"] = "by-period";
  return PeriodBreakdown2;
}(PeriodBreakdown || {});
var GroupVisibility = /* @__PURE__ */ function(GroupVisibility2) {
  GroupVisibility2["NON_EMPTY_ONLY"] = "non-empty-only";
  GroupVisibility2["SHOW_ALL"] = "show-all";
  return GroupVisibility2;
}(GroupVisibility || {});
var QuerySchema = external_exports.object({
  includeStreakMarksEarliestDate: external_exports.string().optional(),
  includeStreakMarksLatestDate: external_exports.string().optional()
});
var shouldRevalidate = basicShouldRevalidate;
function Habits() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const [mobileTab, setMobileTab] = (0, import_react2.useState)("streaks");
  const [optimisticUpdates, setOptimisticUpdates] = (0, import_react2.useState)({});
  const kanbanBoardMoveFetcher = useFetcher();
  const sortedHabitInboxTasks = sortInboxTasksNaturally(loaderData.habitInboxTasks.map((e) => e.inbox_task));
  const habitEntriesByRefId = {};
  for (const entry of loaderData.habitInboxTasks) {
    habitEntriesByRefId[entry.inbox_task.ref_id] = inboxTaskFindEntryToParent(entry);
  }
  function handleCardMarkDone(it) {
    setOptimisticUpdates((old) => ({
      ...old,
      [it.ref_id]: {
        status: import_webapi_client.InboxTaskStatus.DONE,
        eisen: old[it.ref_id]?.eisen ?? it.eisen
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
    setOptimisticUpdates((old) => ({
      ...old,
      [it.ref_id]: {
        status: import_webapi_client.InboxTaskStatus.NOT_DONE,
        eisen: old[it.ref_id]?.eisen ?? it.eisen
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
  const lifePlanAvailable = isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN);
  const [selectedGrouping, setSelectedGrouping] = (0, import_react2.useState)(lifePlanAvailable ? Grouping.BY_ASPECT_AND_GOAL : Grouping.FLAT);
  const [selectedPeriodBreakdown, setSelectedPeriodBreakdown] = (0, import_react2.useState)(isBigScreen ? PeriodBreakdown.BY_PERIOD : PeriodBreakdown.LIST);
  const [selectedGroupVisibility, setSelectedGroupVisibility] = (0, import_react2.useState)(GroupVisibility.NON_EMPTY_ONLY);
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = (0, import_react2.useState)([]);
  const tagsByRefId = {};
  for (const tag of loaderData.allTags) {
    tagsByRefId[tag.ref_id] = tag;
  }
  const entriesByRefId = /* @__PURE__ */ new Map();
  for (const entry of loaderData.habits) {
    entriesByRefId.set(entry.habit.ref_id, entry);
  }
  const sortedHabits = sortHabitsNaturally(loaderData.habits.map((e) => e.habit)).filter((habit) => {
    const tagsOk = selectedTagsRefId.length === 0 || entriesByRefId.get(habit.ref_id)?.tags?.some((tag) => selectedTagsRefId.includes(tag.ref_id));
    const contactsOk = selectedContactsRefId.length === 0 || entriesByRefId.get(habit.ref_id)?.contacts?.some((contact) => selectedContactsRefId.includes(contact.ref_id));
    return tagsOk && contactsOk;
  });
  const sortedAspects = sortAspectsByTreeOrder(loaderData.allAspects || []);
  const allAspectsByRefId = new Map(loaderData.allAspects?.map((p) => [p.ref_id, p]));
  const sortedGoals = sortGoalsNaturally(loaderData.allGoals || []);
  const allGoalsByRefId = new Map(loaderData.allGoals?.map((g) => [g.ref_id, g]));
  const rightNow = DateTime.local({
    zone: topLevelInfo.user.timezone
  });
  const streakWidgetProps = {
    rightNow,
    timezone: topLevelInfo.user.timezone,
    topLevelInfo,
    habitStreak: {
      earliestDate: loaderData.keyHabitStreaks[0]?.streakMarkEarliestDate ?? topLevelInfo.today,
      latestDate: loaderData.keyHabitStreaks[0]?.streakMarkLatestDate ?? topLevelInfo.today,
      currentToday: topLevelInfo.today,
      entries: loaderData.keyHabitStreaks.map((h) => ({
        habit: entriesByRefId.get(h.habitRefId).habit,
        streakMarks: h.streakMarks
      })),
      label: "Latest Streak",
      showNav: true,
      getNavUrl: (earliestDate, latestDate) => {
        return `/app/workspace/habits?includeStreakMarksEarliestDate=${earliestDate}&includeStreakMarksLatestDate=${latestDate}`;
      }
    },
    geometry: {
      row: 0,
      col: 0,
      dimension: import_webapi_client.WidgetDimension.DIM_3X1
    }
  };
  const tasksWidgetProps = {
    rightNow,
    timezone: topLevelInfo.user.timezone,
    topLevelInfo,
    habitTasks: {
      habits: loaderData.habits.map((e) => e.habit),
      habitInboxTasks: sortedHabitInboxTasks,
      habitEntriesByRefId,
      optimisticUpdates,
      onCardMarkDone: handleCardMarkDone,
      onCardMarkNotDone: handleCardMarkNotDone
    },
    geometry: {
      row: 0,
      col: 0,
      dimension: import_webapi_client.WidgetDimension.DIM_1X3
    }
  };
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/habits/new", returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "habits-actions", topLevelInfo, inputsEnabled: true, actions: [FilterFewOptionsCompact("Grouping", selectedGrouping, [{
    value: Grouping.BY_ASPECT_AND_GOAL,
    text: "By Aspect & Goal",
    icon: /* @__PURE__ */ jsxDEV(Flag_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 272,
      columnNumber: 11
    }, this),
    gatedOn: import_webapi_client.WorkspaceFeature.LIFE_PLAN
  }, {
    value: Grouping.BY_ASPECT,
    text: "By Aspect",
    icon: /* @__PURE__ */ jsxDEV(Flare_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 277,
      columnNumber: 11
    }, this),
    gatedOn: import_webapi_client.WorkspaceFeature.LIFE_PLAN
  }, {
    value: Grouping.FLAT,
    text: "Flat",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 282,
      columnNumber: 11
    }, this)
  }], (selected) => setSelectedGrouping(selected)), ...isBigScreen ? [FilterFewOptionsCompact("Periods", selectedPeriodBreakdown, [{
    value: PeriodBreakdown.BY_PERIOD,
    text: "By Period",
    icon: /* @__PURE__ */ jsxDEV(ViewTimeline_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 286,
      columnNumber: 11
    }, this)
  }, {
    value: PeriodBreakdown.LIST,
    text: "List",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 290,
      columnNumber: 11
    }, this)
  }], (selected) => setSelectedPeriodBreakdown(selected))] : [], ...lifePlanAvailable && selectedGrouping !== Grouping.FLAT ? [FilterFewOptionsCompact("Groups", selectedGroupVisibility, [{
    value: GroupVisibility.NON_EMPTY_ONLY,
    text: "Only non-empty",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 294,
      columnNumber: 11
    }, this)
  }, {
    value: GroupVisibility.SHOW_ALL,
    text: "Show all",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 298,
      columnNumber: 11
    }, this),
    gatedOn: import_webapi_client.WorkspaceFeature.LIFE_PLAN
  }], (selected) => setSelectedGroupVisibility(selected))] : [], FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId), FilterManyOptions("Contacts", loaderData.allContacts.map((contact) => ({
    value: contact.ref_id,
    text: contact.name
  })), setSelectedContactsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/habits.tsx",
    lineNumber: 269,
    columnNumber: 121
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: isBigScreen ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
      loaderData.habits.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no habits to show. You can create a new habit.", newEntityLocations: "/app/workspace/habits/new", helpSubject: import_webapi_client.DocsHelpSubject.HABITS }, void 0, false, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 309,
        columnNumber: 48
      }, this),
      loaderData.keyHabitStreaks.length > 0 && /* @__PURE__ */ jsxDEV(HabitKeyHabitStreakWidget, { ...streakWidgetProps }, void 0, false, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 311,
        columnNumber: 55
      }, this),
      /* @__PURE__ */ jsxDEV(Box_default, { sx: {
        display: "flex",
        gap: 2,
        alignItems: "flex-start"
      }, children: [
        /* @__PURE__ */ jsxDEV(Box_default, { sx: {
          flex: 1,
          minWidth: 0
        }, children: [
          selectedGrouping === Grouping.FLAT && selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD && /* @__PURE__ */ jsxDEV(HabitsByPeriodsStack, { habits: sortedHabits, renderStack: (subset) => /* @__PURE__ */ jsxDEV(HabitsFlatStack, { habits: subset, entriesByRefId, topLevelInfo, showPeriodTag: false }, void 0, false, {
            fileName: "app/routes/app/workspace/habits.tsx",
            lineNumber: 322,
            columnNumber: 180
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/habits.tsx",
            lineNumber: 322,
            columnNumber: 113
          }, this),
          selectedGrouping === Grouping.FLAT && selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD && /* @__PURE__ */ jsxDEV(HabitsFlatStack, { habits: sortedHabits, entriesByRefId, topLevelInfo, showPeriodTag: true }, void 0, false, {
            fileName: "app/routes/app/workspace/habits.tsx",
            lineNumber: 324,
            columnNumber: 113
          }, this),
          selectedGrouping === Grouping.BY_ASPECT && /* @__PURE__ */ jsxDEV(HabitsByAspectStack, { habits: sortedHabits, isBigScreen, selectedPeriodBreakdown, showEmptyGroups: selectedGroupVisibility === GroupVisibility.SHOW_ALL, sortedAspects, allAspectsByRefId, entriesByRefId, topLevelInfo }, void 0, false, {
            fileName: "app/routes/app/workspace/habits.tsx",
            lineNumber: 326,
            columnNumber: 61
          }, this),
          selectedGrouping === Grouping.BY_ASPECT_AND_GOAL && /* @__PURE__ */ jsxDEV(HabitsByAspectAndGoalStack, { habits: sortedHabits, isBigScreen, selectedPeriodBreakdown, showEmptyGroups: selectedGroupVisibility === GroupVisibility.SHOW_ALL, sortedAspects, allAspectsByRefId, sortedGoals, allGoalsByRefId, entriesByRefId, topLevelInfo }, void 0, false, {
            fileName: "app/routes/app/workspace/habits.tsx",
            lineNumber: 328,
            columnNumber: 70
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 318,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(Box_default, { sx: {
          width: "320px",
          flexShrink: 0,
          position: "sticky",
          top: "1rem",
          maxHeight: "calc(100vh - 8rem)",
          overflowY: "auto",
          border: (theme) => `2px dotted ${theme.palette.primary.main}`,
          borderRadius: "4px",
          padding: "0.4rem"
        }, children: /* @__PURE__ */ jsxDEV(HabitInboxTasksWidget, { ...tasksWidgetProps }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 342,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 331,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 313,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 308,
      columnNumber: 24
    }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(Tabs_default, { value: mobileTab, variant: "scrollable", scrollButtons: "auto", onChange: (_, v) => setMobileTab(v), children: [
        /* @__PURE__ */ jsxDEV(Tab_default, { label: "Streaks", value: "streaks" }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 347,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(Tab_default, { label: "Habits", value: "habits" }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 348,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(Tab_default, { label: "Tasks", value: "tasks" }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 349,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 346,
        columnNumber: 13
      }, this),
      mobileTab === "streaks" && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        loaderData.habits.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no habits to show. You can create a new habit.", newEntityLocations: "/app/workspace/habits/new", helpSubject: import_webapi_client.DocsHelpSubject.HABITS }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 353,
          columnNumber: 52
        }, this),
        loaderData.keyHabitStreaks.length > 0 && /* @__PURE__ */ jsxDEV(HabitKeyHabitStreakWidget, { ...streakWidgetProps }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 354,
          columnNumber: 59
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 352,
        columnNumber: 41
      }, this),
      mobileTab === "habits" && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        sortedHabits.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no habits to show. You can create a new habit.", newEntityLocations: "/app/workspace/habits/new", helpSubject: import_webapi_client.DocsHelpSubject.HABITS }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 358,
          columnNumber: 47
        }, this),
        selectedGrouping === Grouping.FLAT && /* @__PURE__ */ jsxDEV(HabitsFlatStack, { habits: sortedHabits, entriesByRefId, topLevelInfo, showPeriodTag: true }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 360,
          columnNumber: 56
        }, this),
        selectedGrouping === Grouping.BY_ASPECT && /* @__PURE__ */ jsxDEV(HabitsByAspectStack, { habits: sortedHabits, isBigScreen, selectedPeriodBreakdown, showEmptyGroups: selectedGroupVisibility === GroupVisibility.SHOW_ALL, sortedAspects, allAspectsByRefId, entriesByRefId, topLevelInfo }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 362,
          columnNumber: 61
        }, this),
        selectedGrouping === Grouping.BY_ASPECT_AND_GOAL && /* @__PURE__ */ jsxDEV(HabitsByAspectAndGoalStack, { habits: sortedHabits, isBigScreen, selectedPeriodBreakdown, showEmptyGroups: selectedGroupVisibility === GroupVisibility.SHOW_ALL, sortedAspects, allAspectsByRefId, sortedGoals, allGoalsByRefId, entriesByRefId, topLevelInfo }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 364,
          columnNumber: 70
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 357,
        columnNumber: 40
      }, this),
      mobileTab === "tasks" && /* @__PURE__ */ jsxDEV(HabitInboxTasksWidget, { ...tasksWidgetProps }, void 0, false, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 367,
        columnNumber: 39
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 345,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 307,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 372,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 371,
      columnNumber: 7
    }, this)
  ] }, "habits", true, {
    fileName: "app/routes/app/workspace/habits.tsx",
    lineNumber: 269,
    columnNumber: 10
  }, this);
}
_s(Habits, "aXgYr7ta98Lt6AZdJVaeEA2cU5g=", false, function() {
  return [useLoaderDataSafeForAnimation, useBigScreen, useTrunkNeedsToShowLeaf, useFetcher];
});
_c = Habits;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the habits! Please try again!`
});
function HabitRow(props) {
  const entry = props.entriesByRefId.get(props.habitRefId);
  if (!entry) {
    return null;
  }
  const habit = entry.habit;
  return /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `habit-${habit.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/habits/${habit.ref_id}`, children: [
    /* @__PURE__ */ jsxDEV(IsKeyTag, { isKey: habit.is_key }, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 391,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: habit.name }, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 392,
      columnNumber: 9
    }, this),
    props.showAspectTag && isWorkspaceFeatureAvailable(props.topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && /* @__PURE__ */ jsxDEV(AspectTag, { aspect: entry.aspect }, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 393,
      columnNumber: 122
    }, this),
    isWorkspaceFeatureAvailable(props.topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && entry.chapter && /* @__PURE__ */ jsxDEV(ChapterTag, { chapter: entry.chapter }, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 394,
      columnNumber: 116
    }, this),
    props.showGoalTag && isWorkspaceFeatureAvailable(props.topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && entry.goal && /* @__PURE__ */ jsxDEV(GoalTag, { goal: entry.goal }, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 395,
      columnNumber: 134
    }, this),
    habit.suspended && /* @__PURE__ */ jsxDEV("span", { className: "tag", children: "Suspended" }, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 396,
      columnNumber: 29
    }, this),
    props.showPeriodTag && /* @__PURE__ */ jsxDEV(PeriodTag, { period: habit.gen_params.period }, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 397,
      columnNumber: 33
    }, this),
    habit.gen_params.eisen && /* @__PURE__ */ jsxDEV(EisenTag, { eisen: habit.gen_params.eisen }, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 398,
      columnNumber: 36
    }, this),
    habit.gen_params.difficulty && /* @__PURE__ */ jsxDEV(DifficultyTag, { difficulty: habit.gen_params.difficulty }, void 0, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 399,
      columnNumber: 41
    }, this),
    entry.tags?.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 400,
      columnNumber: 33
    }, this)),
    entry.contacts?.map((contact) => /* @__PURE__ */ jsxDEV(ContactTag, { contact }, contact.ref_id, false, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 401,
      columnNumber: 41
    }, this))
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/habits.tsx",
    lineNumber: 390,
    columnNumber: 7
  }, this) }, `habit-${habit.ref_id}`, false, {
    fileName: "app/routes/app/workspace/habits.tsx",
    lineNumber: 389,
    columnNumber: 10
  }, this);
}
_c2 = HabitRow;
function fullGoalName(goal, goalsByRefId) {
  const visited = /* @__PURE__ */ new Set();
  const parts = [String(goal.name)];
  let current = goal;
  while (current?.parent_goal_ref_id) {
    const parentRefId = String(current.parent_goal_ref_id);
    if (visited.has(parentRefId)) {
      break;
    }
    visited.add(parentRefId);
    const parent = goalsByRefId.get(parentRefId);
    if (!parent) {
      break;
    }
    parts.unshift(String(parent.name));
    current = parent;
  }
  return parts.join(" / ");
}
function HabitsFlatStack(props) {
  const showAspectTag = props.showAspectTag ?? true;
  const showGoalTag = props.showGoalTag ?? true;
  const showPeriodTag = props.showPeriodTag ?? true;
  return /* @__PURE__ */ jsxDEV(EntityStack, { children: props.habits.map((habit) => /* @__PURE__ */ jsxDEV(HabitRow, { habitRefId: habit.ref_id, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag, showGoalTag, showPeriodTag }, `habit-${habit.ref_id}`, false, {
    fileName: "app/routes/app/workspace/habits.tsx",
    lineNumber: 430,
    columnNumber: 34
  }, this)) }, void 0, false, {
    fileName: "app/routes/app/workspace/habits.tsx",
    lineNumber: 429,
    columnNumber: 10
  }, this);
}
_c3 = HabitsFlatStack;
function HabitsByAspectStack(props) {
  const showPeriodTag = props.selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: props.sortedAspects.map((aspect) => {
    const aspectHabits = props.habits.filter((h) => h.aspect_ref_id === aspect.ref_id);
    if (aspectHabits.length === 0 && !props.showEmptyGroups) {
      return null;
    }
    const fullAspectName = computeAspectHierarchicalNameFromRoot(aspect, props.allAspectsByRefId);
    return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 444,
        columnNumber: 13
      }, this),
      aspectHabits.length === 0 && /* @__PURE__ */ jsxDEV(EmptyHabitsHint, {}, void 0, false, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 445,
        columnNumber: 43
      }, this),
      aspectHabits.length > 0 && props.isBigScreen && props.selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD && /* @__PURE__ */ jsxDEV(HabitsByPeriodsStack, { habits: aspectHabits, renderStack: (subset) => /* @__PURE__ */ jsxDEV(HabitsFlatStack, { habits: subset, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: true, showPeriodTag: false }, void 0, false, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 447,
        columnNumber: 192
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 447,
        columnNumber: 125
      }, this),
      aspectHabits.length > 0 && (!props.isBigScreen || props.selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD) && /* @__PURE__ */ jsxDEV(HabitsFlatStack, { habits: aspectHabits, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: true, showPeriodTag }, void 0, false, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 449,
        columnNumber: 128
      }, this)
    ] }, `aspect-${aspect.ref_id}`, true, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 443,
      columnNumber: 14
    }, this);
  }) }, void 0, false, {
    fileName: "app/routes/app/workspace/habits.tsx",
    lineNumber: 436,
    columnNumber: 10
  }, this);
}
_c4 = HabitsByAspectStack;
function HabitsByAspectAndGoalStack(props) {
  const showPeriodTag = props.selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: props.sortedAspects.map((aspect) => {
    const aspectHabits = props.habits.filter((h) => h.aspect_ref_id === aspect.ref_id);
    if (aspectHabits.length === 0 && !props.showEmptyGroups) {
      return null;
    }
    const fullAspectName = computeAspectHierarchicalNameFromRoot(aspect, props.allAspectsByRefId);
    if (aspectHabits.length === 0) {
      return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 466,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(EmptyHabitsHint, {}, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 467,
          columnNumber: 15
        }, this)
      ] }, `aspect-${aspect.ref_id}`, true, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 465,
        columnNumber: 16
      }, this);
    }
    const habitsByGoalRefId = /* @__PURE__ */ new Map();
    const noGoalHabits = [];
    for (const habit of aspectHabits) {
      const goalRefId = habit.goal_ref_id ?? null;
      if (!goalRefId) {
        noGoalHabits.push(habit);
        continue;
      }
      const existing = habitsByGoalRefId.get(goalRefId) ?? [];
      existing.push(habit);
      habitsByGoalRefId.set(goalRefId, existing);
    }
    const aspectGoals = props.sortedGoals.filter((g) => g.aspect_ref_id === aspect.ref_id).filter((g) => props.showEmptyGroups || habitsByGoalRefId.has(g.ref_id));
    const shouldShowByPeriods = props.isBigScreen && props.selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD;
    return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 485,
        columnNumber: 13
      }, this),
      aspectGoals.map((goal) => {
        const goalHabits = habitsByGoalRefId.get(goal.ref_id) ?? [];
        if (goalHabits.length === 0 && !props.showEmptyGroups) {
          return null;
        }
        return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: `\u{1F3AF} ${fullGoalName(goal, props.allGoalsByRefId)}`, size: "medium" }, void 0, false, {
            fileName: "app/routes/app/workspace/habits.tsx",
            lineNumber: 493,
            columnNumber: 19
          }, this),
          goalHabits.length === 0 && /* @__PURE__ */ jsxDEV(EmptyHabitsHint, {}, void 0, false, {
            fileName: "app/routes/app/workspace/habits.tsx",
            lineNumber: 494,
            columnNumber: 47
          }, this),
          goalHabits.length > 0 && shouldShowByPeriods && /* @__PURE__ */ jsxDEV(HabitsByPeriodsStack, { habits: goalHabits, renderStack: (subset) => /* @__PURE__ */ jsxDEV(HabitsFlatStack, { habits: subset, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: false, showPeriodTag: false }, void 0, false, {
            fileName: "app/routes/app/workspace/habits.tsx",
            lineNumber: 495,
            columnNumber: 133
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/habits.tsx",
            lineNumber: 495,
            columnNumber: 68
          }, this),
          goalHabits.length > 0 && !shouldShowByPeriods && /* @__PURE__ */ jsxDEV(HabitsFlatStack, { habits: goalHabits, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: false, showPeriodTag }, void 0, false, {
            fileName: "app/routes/app/workspace/habits.tsx",
            lineNumber: 496,
            columnNumber: 69
          }, this)
        ] }, `aspect-${aspect.ref_id}-goal-${goal.ref_id}`, true, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 492,
          columnNumber: 18
        }, this);
      }),
      noGoalHabits.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: "\u{1F6AB} No Goal", size: "medium" }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 501,
          columnNumber: 17
        }, this),
        shouldShowByPeriods && /* @__PURE__ */ jsxDEV(HabitsByPeriodsStack, { habits: noGoalHabits, renderStack: (subset) => /* @__PURE__ */ jsxDEV(HabitsFlatStack, { habits: subset, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: false, showPeriodTag: false }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 502,
          columnNumber: 108
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 502,
          columnNumber: 41
        }, this),
        !shouldShowByPeriods && /* @__PURE__ */ jsxDEV(HabitsFlatStack, { habits: noGoalHabits, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: false, showPeriodTag }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 504,
          columnNumber: 42
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 500,
        columnNumber: 41
      }, this)
    ] }, `aspect-${aspect.ref_id}`, true, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 484,
      columnNumber: 14
    }, this);
  }) }, void 0, false, {
    fileName: "app/routes/app/workspace/habits.tsx",
    lineNumber: 457,
    columnNumber: 10
  }, this);
}
_c5 = HabitsByAspectAndGoalStack;
function EmptyHabitsHint() {
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    paddingBottom: 1,
    opacity: 0.7,
    fontSize: "0.9rem"
  }, children: "No habits." }, void 0, false, {
    fileName: "app/routes/app/workspace/habits.tsx",
    lineNumber: 512,
    columnNumber: 10
  }, this);
}
_c6 = EmptyHabitsHint;
function HabitsByPeriodsStack(props) {
  const periods = [import_webapi_client.RecurringTaskPeriod.DAILY, import_webapi_client.RecurringTaskPeriod.WEEKLY, import_webapi_client.RecurringTaskPeriod.MONTHLY, import_webapi_client.RecurringTaskPeriod.QUARTERLY, import_webapi_client.RecurringTaskPeriod.YEARLY];
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    display: "flex",
    gap: 2,
    alignItems: "flex-start",
    flexWrap: "nowrap"
  }, children: [
    periods.map((period) => {
      const subset = props.habits.filter((h) => h.gen_params.period === period && !h.suspended);
      return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
        flexBasis: "16.6%",
        flexGrow: 1,
        minWidth: 0
      }, children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: periodName(period), size: "large" }, void 0, false, {
          fileName: "app/routes/app/workspace/habits.tsx",
          lineNumber: 536,
          columnNumber: 13
        }, this),
        props.renderStack(subset)
      ] }, `period-${period}`, true, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 531,
        columnNumber: 14
      }, this);
    }),
    /* @__PURE__ */ jsxDEV(Box_default, { sx: {
      flexBasis: "16.6%",
      flexGrow: 1,
      minWidth: 0
    }, children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Suspended", size: "large" }, void 0, false, {
        fileName: "app/routes/app/workspace/habits.tsx",
        lineNumber: 547,
        columnNumber: 9
      }, this),
      props.renderStack(props.habits.filter((h) => h.suspended))
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/habits.tsx",
      lineNumber: 542,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/habits.tsx",
    lineNumber: 523,
    columnNumber: 10
  }, this);
}
_c7 = HabitsByPeriodsStack;
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
var _c6;
var _c7;
$RefreshReg$(_c, "Habits");
$RefreshReg$(_c2, "HabitRow");
$RefreshReg$(_c3, "HabitsFlatStack");
$RefreshReg$(_c4, "HabitsByAspectStack");
$RefreshReg$(_c5, "HabitsByAspectAndGoalStack");
$RefreshReg$(_c6, "EmptyHabitsHint");
$RefreshReg$(_c7, "HabitsByPeriodsStack");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Habits as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/habits-C3BJMU57.js.map
