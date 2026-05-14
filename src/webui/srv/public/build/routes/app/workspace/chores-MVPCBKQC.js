import {
  ChoreInboxTasksWidget
} from "/build/_shared/chunk-NOZT4BYV.js";
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
  CheckComponent
} from "/build/_shared/chunk-IQQHOPPW.js";
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
import "/build/_shared/chunk-PFTZ3POA.js";
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

// app/routes/app/workspace/chores.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());

// ../core/jupiter/core/chores/root.ts
function sortChoresNaturally(chores) {
  return [...chores].sort((c1, c2) => {
    if (!c1.suspended && c2.suspended) {
      return -1;
    } else if (c1.suspended && !c2.suspended) {
      return 1;
    }
    return compareIsKey(c1.is_key, c2.is_key) || comparePeriods(c1.gen_params.period, c2.gen_params.period) || compareEisen(c1.gen_params.eisen, c2.gen_params.eisen) || compareDifficulty(c1.gen_params.difficulty, c2.gen_params.difficulty);
  });
}

// app/routes/app/workspace/chores.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/chores.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/chores.tsx"
  );
  import.meta.hot.lastModified = "1777213342579.7888";
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
var shouldRevalidate = basicShouldRevalidate;
function Chores() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const entriesByRefId = /* @__PURE__ */ new Map();
  for (const entry of loaderData.chores) {
    entriesByRefId.set(entry.chore.ref_id, entry);
  }
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = (0, import_react2.useState)([]);
  const [mobileTab, setMobileTab] = (0, import_react2.useState)("chores");
  const [optimisticUpdates, setOptimisticUpdates] = (0, import_react2.useState)({});
  const kanbanBoardMoveFetcher = useFetcher();
  const sortedChoreInboxTasks = sortInboxTasksNaturally(loaderData.choreInboxTasks.map((e) => e.inbox_task));
  const choreEntriesByRefId = {};
  for (const entry of loaderData.choreInboxTasks) {
    choreEntriesByRefId[entry.inbox_task.ref_id] = inboxTaskFindEntryToParent(entry);
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
  const rightNow = DateTime.local({
    zone: topLevelInfo.user.timezone
  });
  const widgetProps = {
    rightNow,
    timezone: topLevelInfo.user.timezone,
    topLevelInfo,
    choreTasks: {
      choreInboxTasks: sortedChoreInboxTasks,
      choreEntriesByRefId,
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
  const sortedChores = sortChoresNaturally(loaderData.chores.map((e) => e.chore)).filter((chore) => {
    const entry = entriesByRefId.get(chore.ref_id);
    const tagsOk = selectedTagsRefId.length === 0 || entry?.tags?.some((tag) => selectedTagsRefId.includes(tag.ref_id));
    const contactsOk = selectedContactsRefId.length === 0 || entry?.contacts?.some((contact) => selectedContactsRefId.includes(contact.ref_id));
    return tagsOk && contactsOk;
  });
  const lifePlanAvailable = isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN);
  const [selectedGrouping, setSelectedGrouping] = (0, import_react2.useState)(lifePlanAvailable ? Grouping.BY_ASPECT_AND_GOAL : Grouping.FLAT);
  const [selectedPeriodBreakdown, setSelectedPeriodBreakdown] = (0, import_react2.useState)(isBigScreen ? PeriodBreakdown.BY_PERIOD : PeriodBreakdown.LIST);
  const [selectedGroupVisibility, setSelectedGroupVisibility] = (0, import_react2.useState)(GroupVisibility.NON_EMPTY_ONLY);
  const sortedAspects = sortAspectsByTreeOrder(loaderData.allAspects || []);
  const allAspectsByRefId = new Map(loaderData.allAspects?.map((p) => [p.ref_id, p]));
  const sortedGoals = sortGoalsNaturally(loaderData.allGoals || []);
  const allGoalsByRefId = new Map(loaderData.allGoals?.map((g) => [g.ref_id, g]));
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/chores/new", returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "chores-actions", topLevelInfo, inputsEnabled: true, actions: [FilterFewOptionsCompact("Grouping", selectedGrouping, [{
    value: Grouping.BY_ASPECT_AND_GOAL,
    text: "By Aspect & Goal",
    icon: /* @__PURE__ */ jsxDEV(Flag_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 213,
      columnNumber: 11
    }, this),
    gatedOn: import_webapi_client.WorkspaceFeature.LIFE_PLAN
  }, {
    value: Grouping.BY_ASPECT,
    text: "By Aspect",
    icon: /* @__PURE__ */ jsxDEV(Flare_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 218,
      columnNumber: 11
    }, this),
    gatedOn: import_webapi_client.WorkspaceFeature.LIFE_PLAN
  }, {
    value: Grouping.FLAT,
    text: "Flat",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 223,
      columnNumber: 11
    }, this)
  }], (selected) => setSelectedGrouping(selected)), ...isBigScreen ? [FilterFewOptionsCompact("Periods", selectedPeriodBreakdown, [{
    value: PeriodBreakdown.BY_PERIOD,
    text: "By Period",
    icon: /* @__PURE__ */ jsxDEV(ViewTimeline_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 227,
      columnNumber: 11
    }, this)
  }, {
    value: PeriodBreakdown.LIST,
    text: "List",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 231,
      columnNumber: 11
    }, this)
  }], (selected) => setSelectedPeriodBreakdown(selected))] : [], ...lifePlanAvailable && selectedGrouping !== Grouping.FLAT ? [FilterFewOptionsCompact("Groups", selectedGroupVisibility, [{
    value: GroupVisibility.NON_EMPTY_ONLY,
    text: "Only non-empty",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 235,
      columnNumber: 11
    }, this)
  }, {
    value: GroupVisibility.SHOW_ALL,
    text: "Show all",
    icon: /* @__PURE__ */ jsxDEV(ViewList_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 239,
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
    fileName: "app/routes/app/workspace/chores.tsx",
    lineNumber: 210,
    columnNumber: 121
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: isBigScreen ? /* @__PURE__ */ jsxDEV(Box_default, { sx: {
      display: "flex",
      gap: 2,
      alignItems: "flex-start"
    }, children: [
      /* @__PURE__ */ jsxDEV(Box_default, { sx: {
        flex: 1,
        minWidth: 0
      }, children: [
        sortedChores.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no chores to show. You can create a new chore.", newEntityLocations: "/app/workspace/chores/new", helpSubject: import_webapi_client.DocsHelpSubject.CHORES }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 258,
          columnNumber: 45
        }, this),
        selectedGrouping === Grouping.FLAT && selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD && /* @__PURE__ */ jsxDEV(ChoresByPeriodsStack, { chores: sortedChores, renderStack: (subset) => /* @__PURE__ */ jsxDEV(ChoresFlatStack, { chores: subset, entriesByRefId, topLevelInfo, showPeriodTag: false }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 260,
          columnNumber: 178
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 260,
          columnNumber: 111
        }, this),
        selectedGrouping === Grouping.FLAT && selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD && /* @__PURE__ */ jsxDEV(ChoresFlatStack, { chores: sortedChores, entriesByRefId, topLevelInfo, showPeriodTag: true }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 262,
          columnNumber: 111
        }, this),
        selectedGrouping === Grouping.BY_ASPECT && /* @__PURE__ */ jsxDEV(ChoresByAspectStack, { chores: sortedChores, isBigScreen, selectedPeriodBreakdown, showEmptyGroups: selectedGroupVisibility === GroupVisibility.SHOW_ALL, sortedAspects, allAspectsByRefId, entriesByRefId, topLevelInfo }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 264,
          columnNumber: 59
        }, this),
        selectedGrouping === Grouping.BY_ASPECT_AND_GOAL && /* @__PURE__ */ jsxDEV(ChoresByAspectAndGoalStack, { chores: sortedChores, isBigScreen, selectedPeriodBreakdown, showEmptyGroups: selectedGroupVisibility === GroupVisibility.SHOW_ALL, sortedAspects, allAspectsByRefId, sortedGoals, allGoalsByRefId, entriesByRefId, topLevelInfo }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 266,
          columnNumber: 68
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 254,
        columnNumber: 13
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
      }, children: /* @__PURE__ */ jsxDEV(ChoreInboxTasksWidget, { ...widgetProps }, void 0, false, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 280,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 269,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 249,
      columnNumber: 24
    }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(Tabs_default, { value: mobileTab, variant: "scrollable", scrollButtons: "auto", onChange: (_, v) => setMobileTab(v), children: [
        /* @__PURE__ */ jsxDEV(Tab_default, { label: "Chores", value: "chores" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 284,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(Tab_default, { label: "Tasks", value: "inbox-tasks" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 285,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 283,
        columnNumber: 13
      }, this),
      mobileTab === "chores" && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        sortedChores.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no chores to show. You can create a new chore.", newEntityLocations: "/app/workspace/chores/new", helpSubject: import_webapi_client.DocsHelpSubject.CHORES }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 289,
          columnNumber: 47
        }, this),
        selectedGrouping === Grouping.FLAT && /* @__PURE__ */ jsxDEV(ChoresFlatStack, { chores: sortedChores, entriesByRefId, topLevelInfo, showPeriodTag: true }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 291,
          columnNumber: 56
        }, this),
        selectedGrouping === Grouping.BY_ASPECT && /* @__PURE__ */ jsxDEV(ChoresByAspectStack, { chores: sortedChores, isBigScreen, selectedPeriodBreakdown, showEmptyGroups: selectedGroupVisibility === GroupVisibility.SHOW_ALL, sortedAspects, allAspectsByRefId, entriesByRefId, topLevelInfo }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 293,
          columnNumber: 61
        }, this),
        selectedGrouping === Grouping.BY_ASPECT_AND_GOAL && /* @__PURE__ */ jsxDEV(ChoresByAspectAndGoalStack, { chores: sortedChores, isBigScreen, selectedPeriodBreakdown, showEmptyGroups: selectedGroupVisibility === GroupVisibility.SHOW_ALL, sortedAspects, allAspectsByRefId, sortedGoals, allGoalsByRefId, entriesByRefId, topLevelInfo }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 295,
          columnNumber: 70
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 288,
        columnNumber: 40
      }, this),
      mobileTab === "inbox-tasks" && /* @__PURE__ */ jsxDEV(ChoreInboxTasksWidget, { ...widgetProps }, void 0, false, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 298,
        columnNumber: 45
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 282,
      columnNumber: 20
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 248,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 303,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 302,
      columnNumber: 7
    }, this)
  ] }, "chores", true, {
    fileName: "app/routes/app/workspace/chores.tsx",
    lineNumber: 210,
    columnNumber: 10
  }, this);
}
_s(Chores, "y1XM/k5ZcXRDwCI7bIhvctM0BHw=", false, function() {
  return [useLoaderDataSafeForAnimation, useBigScreen, useTrunkNeedsToShowLeaf, useFetcher];
});
_c = Chores;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the chores! Please try again!`
});
function ChoreRow(props) {
  const entry = props.entriesByRefId.get(props.choreRefId);
  if (!entry) {
    return null;
  }
  const chore = entry.chore;
  return /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `chore-${chore.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/chores/${chore.ref_id}`, children: [
    /* @__PURE__ */ jsxDEV(IsKeyTag, { isKey: chore.is_key }, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 322,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: chore.name }, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 323,
      columnNumber: 9
    }, this),
    props.showAspectTag && isWorkspaceFeatureAvailable(props.topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && /* @__PURE__ */ jsxDEV(AspectTag, { aspect: entry.aspect }, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 324,
      columnNumber: 122
    }, this),
    isWorkspaceFeatureAvailable(props.topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && entry.chapter && /* @__PURE__ */ jsxDEV(ChapterTag, { chapter: entry.chapter }, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 325,
      columnNumber: 116
    }, this),
    props.showGoalTag && isWorkspaceFeatureAvailable(props.topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && entry.goal && /* @__PURE__ */ jsxDEV(GoalTag, { goal: entry.goal }, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 326,
      columnNumber: 134
    }, this),
    /* @__PURE__ */ jsxDEV(CheckComponent, { isDone: !chore.suspended, label: "Active" }, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 327,
      columnNumber: 9
    }, this),
    props.showPeriodTag && /* @__PURE__ */ jsxDEV(PeriodTag, { period: chore.gen_params.period }, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 328,
      columnNumber: 33
    }, this),
    chore.gen_params.eisen && /* @__PURE__ */ jsxDEV(EisenTag, { eisen: chore.gen_params.eisen }, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 329,
      columnNumber: 36
    }, this),
    chore.gen_params.difficulty && /* @__PURE__ */ jsxDEV(DifficultyTag, { difficulty: chore.gen_params.difficulty }, void 0, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 330,
      columnNumber: 41
    }, this),
    entry.tags?.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 331,
      columnNumber: 33
    }, this)),
    entry.contacts?.map((contact) => /* @__PURE__ */ jsxDEV(ContactTag, { contact }, contact.ref_id, false, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 332,
      columnNumber: 41
    }, this))
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/chores.tsx",
    lineNumber: 321,
    columnNumber: 7
  }, this) }, `chore-${chore.ref_id}`, false, {
    fileName: "app/routes/app/workspace/chores.tsx",
    lineNumber: 320,
    columnNumber: 10
  }, this);
}
_c2 = ChoreRow;
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
function ChoresFlatStack(props) {
  const showAspectTag = props.showAspectTag ?? true;
  const showGoalTag = props.showGoalTag ?? true;
  const showPeriodTag = props.showPeriodTag ?? true;
  return /* @__PURE__ */ jsxDEV(EntityStack, { children: props.chores.map((chore) => /* @__PURE__ */ jsxDEV(ChoreRow, { choreRefId: chore.ref_id, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag, showGoalTag, showPeriodTag }, `chore-${chore.ref_id}`, false, {
    fileName: "app/routes/app/workspace/chores.tsx",
    lineNumber: 361,
    columnNumber: 34
  }, this)) }, void 0, false, {
    fileName: "app/routes/app/workspace/chores.tsx",
    lineNumber: 360,
    columnNumber: 10
  }, this);
}
_c3 = ChoresFlatStack;
function ChoresByAspectStack(props) {
  const showPeriodTag = props.selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD;
  const shouldShowByPeriods = props.isBigScreen && props.selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: props.sortedAspects.map((aspect) => {
    const aspectChores = props.chores.filter((c) => c.aspect_ref_id === aspect.ref_id);
    if (aspectChores.length === 0 && !props.showEmptyGroups) {
      return null;
    }
    const fullAspectName = computeAspectHierarchicalNameFromRoot(aspect, props.allAspectsByRefId);
    return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 376,
        columnNumber: 13
      }, this),
      aspectChores.length === 0 && /* @__PURE__ */ jsxDEV(EmptyChoresHint, {}, void 0, false, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 378,
        columnNumber: 43
      }, this),
      aspectChores.length > 0 && shouldShowByPeriods && /* @__PURE__ */ jsxDEV(ChoresByPeriodsStack, { chores: aspectChores, renderStack: (subset) => /* @__PURE__ */ jsxDEV(ChoresFlatStack, { chores: subset, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: true, showPeriodTag: false }, void 0, false, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 380,
        columnNumber: 131
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 380,
        columnNumber: 64
      }, this),
      aspectChores.length > 0 && !shouldShowByPeriods && /* @__PURE__ */ jsxDEV(ChoresFlatStack, { chores: aspectChores, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: true, showPeriodTag }, void 0, false, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 382,
        columnNumber: 65
      }, this)
    ] }, `aspect-${aspect.ref_id}`, true, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 375,
      columnNumber: 14
    }, this);
  }) }, void 0, false, {
    fileName: "app/routes/app/workspace/chores.tsx",
    lineNumber: 368,
    columnNumber: 10
  }, this);
}
_c4 = ChoresByAspectStack;
function ChoresByAspectAndGoalStack(props) {
  const showPeriodTag = props.selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD;
  const shouldShowByPeriods = props.isBigScreen && props.selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: props.sortedAspects.map((aspect) => {
    const aspectChores = props.chores.filter((c) => c.aspect_ref_id === aspect.ref_id);
    if (aspectChores.length === 0 && !props.showEmptyGroups) {
      return null;
    }
    const fullAspectName = computeAspectHierarchicalNameFromRoot(aspect, props.allAspectsByRefId);
    if (aspectChores.length === 0) {
      return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 400,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(EmptyChoresHint, {}, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 401,
          columnNumber: 15
        }, this)
      ] }, `aspect-${aspect.ref_id}`, true, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 399,
        columnNumber: 16
      }, this);
    }
    const choresByGoalRefId = /* @__PURE__ */ new Map();
    const noGoalChores = [];
    for (const chore of aspectChores) {
      const goalRefId = chore.goal_ref_id ?? null;
      if (!goalRefId) {
        noGoalChores.push(chore);
        continue;
      }
      const existing = choresByGoalRefId.get(goalRefId) ?? [];
      existing.push(chore);
      choresByGoalRefId.set(goalRefId, existing);
    }
    const aspectGoals = props.sortedGoals.filter((g) => g.aspect_ref_id === aspect.ref_id).filter((g) => props.showEmptyGroups || choresByGoalRefId.has(g.ref_id));
    return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 418,
        columnNumber: 13
      }, this),
      aspectGoals.map((goal) => {
        const goalChores = choresByGoalRefId.get(goal.ref_id) ?? [];
        if (goalChores.length === 0 && !props.showEmptyGroups) {
          return null;
        }
        return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: `\u{1F3AF} ${fullGoalName(goal, props.allGoalsByRefId)}`, size: "medium" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores.tsx",
            lineNumber: 426,
            columnNumber: 19
          }, this),
          goalChores.length === 0 && /* @__PURE__ */ jsxDEV(EmptyChoresHint, {}, void 0, false, {
            fileName: "app/routes/app/workspace/chores.tsx",
            lineNumber: 427,
            columnNumber: 47
          }, this),
          goalChores.length > 0 && shouldShowByPeriods && /* @__PURE__ */ jsxDEV(ChoresByPeriodsStack, { chores: goalChores, renderStack: (subset) => /* @__PURE__ */ jsxDEV(ChoresFlatStack, { chores: subset, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: false, showPeriodTag: false }, void 0, false, {
            fileName: "app/routes/app/workspace/chores.tsx",
            lineNumber: 428,
            columnNumber: 133
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/chores.tsx",
            lineNumber: 428,
            columnNumber: 68
          }, this),
          goalChores.length > 0 && !shouldShowByPeriods && /* @__PURE__ */ jsxDEV(ChoresFlatStack, { chores: goalChores, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: false, showPeriodTag }, void 0, false, {
            fileName: "app/routes/app/workspace/chores.tsx",
            lineNumber: 429,
            columnNumber: 69
          }, this)
        ] }, `aspect-${aspect.ref_id}-goal-${goal.ref_id}`, true, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 425,
          columnNumber: 18
        }, this);
      }),
      noGoalChores.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: "\u{1F6AB} No Goal", size: "medium" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 434,
          columnNumber: 17
        }, this),
        shouldShowByPeriods && /* @__PURE__ */ jsxDEV(ChoresByPeriodsStack, { chores: noGoalChores, renderStack: (subset) => /* @__PURE__ */ jsxDEV(ChoresFlatStack, { chores: subset, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: false, showPeriodTag: false }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 435,
          columnNumber: 108
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 435,
          columnNumber: 41
        }, this),
        !shouldShowByPeriods && /* @__PURE__ */ jsxDEV(ChoresFlatStack, { chores: noGoalChores, entriesByRefId: props.entriesByRefId, topLevelInfo: props.topLevelInfo, showAspectTag: false, showGoalTag: false, showPeriodTag }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 437,
          columnNumber: 42
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 433,
        columnNumber: 41
      }, this)
    ] }, `aspect-${aspect.ref_id}`, true, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 417,
      columnNumber: 14
    }, this);
  }) }, void 0, false, {
    fileName: "app/routes/app/workspace/chores.tsx",
    lineNumber: 391,
    columnNumber: 10
  }, this);
}
_c5 = ChoresByAspectAndGoalStack;
function EmptyChoresHint() {
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    paddingBottom: 1,
    opacity: 0.7,
    fontSize: "0.9rem"
  }, children: "No chores." }, void 0, false, {
    fileName: "app/routes/app/workspace/chores.tsx",
    lineNumber: 445,
    columnNumber: 10
  }, this);
}
_c6 = EmptyChoresHint;
function ChoresByPeriodsStack(props) {
  const periods = [import_webapi_client.RecurringTaskPeriod.DAILY, import_webapi_client.RecurringTaskPeriod.WEEKLY, import_webapi_client.RecurringTaskPeriod.MONTHLY, import_webapi_client.RecurringTaskPeriod.QUARTERLY, import_webapi_client.RecurringTaskPeriod.YEARLY];
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
    display: "flex",
    gap: 2,
    alignItems: "flex-start",
    flexWrap: "nowrap"
  }, children: [
    periods.map((period) => {
      const subset = props.chores.filter((c) => c.gen_params.period === period && !c.suspended);
      return /* @__PURE__ */ jsxDEV(Box_default, { sx: {
        flexBasis: "16.6%",
        flexGrow: 1,
        minWidth: 0
      }, children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: periodName(period), size: "large" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores.tsx",
          lineNumber: 469,
          columnNumber: 13
        }, this),
        props.renderStack(subset)
      ] }, `period-${period}`, true, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 464,
        columnNumber: 14
      }, this);
    }),
    /* @__PURE__ */ jsxDEV(Box_default, { sx: {
      flexBasis: "16.6%",
      flexGrow: 1,
      minWidth: 0
    }, children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Suspended", size: "large" }, void 0, false, {
        fileName: "app/routes/app/workspace/chores.tsx",
        lineNumber: 480,
        columnNumber: 9
      }, this),
      props.renderStack(props.chores.filter((c) => c.suspended))
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/chores.tsx",
      lineNumber: 475,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/chores.tsx",
    lineNumber: 456,
    columnNumber: 10
  }, this);
}
_c7 = ChoresByPeriodsStack;
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
var _c6;
var _c7;
$RefreshReg$(_c, "Chores");
$RefreshReg$(_c2, "ChoreRow");
$RefreshReg$(_c3, "ChoresFlatStack");
$RefreshReg$(_c4, "ChoresByAspectStack");
$RefreshReg$(_c5, "ChoresByAspectAndGoalStack");
$RefreshReg$(_c6, "EmptyChoresHint");
$RefreshReg$(_c7, "ChoresByPeriodsStack");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Chores as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/chores-MVPCBKQC.js.map
