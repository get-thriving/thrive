import {
  JournalSourceTag,
  JournalStack,
  findJournalsThatAreActive,
  sortJournalsNaturally
} from "/build/_shared/chunk-KE26UVOZ.js";
import {
  PeriodTag
} from "/build/_shared/chunk-HLPWZ3ZO.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  FilterManyOptions,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  isUserFeatureAvailable
} from "/build/_shared/chunk-LJCXIXWH.js";
import "/build/_shared/chunk-3BC3B3FK.js";
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
import "/build/_shared/chunk-2EW4TTPM.js";
import {
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Tune_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import {
  Button_default,
  Stack_default
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
  useTrunkNeedsToShowBranch,
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
  Outlet
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

// app/routes/app/workspace/journals.tsx
var import_webapi_client2 = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());

// ../core/jupiter/core/journals/component/card.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function JournalCard(props) {
  const journal = props.journal;
  return /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `journal-${journal.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/journals/${journal.ref_id}`, children: [
    /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: props.label ?? journal.name }, void 0, false, {
      fileName: "../core/jupiter/core/journals/component/card.tsx",
      lineNumber: 37,
      columnNumber: 9
    }, this),
    props.showOptions.showSource && /* @__PURE__ */ jsxDEV(JournalSourceTag, { source: journal.source }, void 0, false, {
      fileName: "../core/jupiter/core/journals/component/card.tsx",
      lineNumber: 39,
      columnNumber: 11
    }, this),
    props.showOptions.showPeriod && /* @__PURE__ */ jsxDEV(PeriodTag, { period: journal.period }, void 0, false, {
      fileName: "../core/jupiter/core/journals/component/card.tsx",
      lineNumber: 41,
      columnNumber: 42
    }, this),
    props.tags?.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
      fileName: "../core/jupiter/core/journals/component/card.tsx",
      lineNumber: 43,
      columnNumber: 11
    }, this)),
    isUserFeatureAvailable(
      props.topLevelInfo.user,
      import_webapi_client.UserFeature.GAMIFICATION
    ) && props.journalStats && /* @__PURE__ */ jsxDEV(
      GamificationTag,
      {
        period: journal.period,
        journalStats: props.journalStats
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/journals/component/card.tsx",
        lineNumber: 50,
        columnNumber: 13
      },
      this
    ),
    props.journalStats && props.journalStats.report.global_inbox_tasks_summary.done.total_cnt,
    " ",
    "tasks done",
    isWorkspaceFeatureAvailable(
      props.topLevelInfo.workspace,
      import_webapi_client.WorkspaceFeature.BIG_PLANS
    ) && props.journalStats && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      " ",
      "and ",
      props.journalStats.report.global_big_plans_summary.done_cnt,
      " ",
      "big plans done"
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/journals/component/card.tsx",
      lineNumber: 64,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/journals/component/card.tsx",
    lineNumber: 36,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "../core/jupiter/core/journals/component/card.tsx",
    lineNumber: 35,
    columnNumber: 5
  }, this);
}
function GamificationTag({ period, journalStats }) {
  if (!journalStats.report.user_score_overview) {
    return null;
  }
  const scoreOverview = journalStats.report.user_score_overview;
  switch (period) {
    case import_webapi_client.RecurringTaskPeriod.DAILY:
      return /* @__PURE__ */ jsxDEV(Fragment, { children: [
        scoreOverview.daily_score.total_score,
        " points from "
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/journals/component/card.tsx",
        lineNumber: 91,
        columnNumber: 14
      }, this);
    case import_webapi_client.RecurringTaskPeriod.WEEKLY:
      return /* @__PURE__ */ jsxDEV(Fragment, { children: [
        scoreOverview.weekly_score.total_score,
        " points from "
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/journals/component/card.tsx",
        lineNumber: 93,
        columnNumber: 14
      }, this);
    case import_webapi_client.RecurringTaskPeriod.MONTHLY:
      return /* @__PURE__ */ jsxDEV(Fragment, { children: [
        scoreOverview.monthly_score.total_score,
        " points from "
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/journals/component/card.tsx",
        lineNumber: 95,
        columnNumber: 14
      }, this);
    case import_webapi_client.RecurringTaskPeriod.QUARTERLY:
      return /* @__PURE__ */ jsxDEV(Fragment, { children: [
        scoreOverview.quarterly_score.total_score,
        " points from "
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/journals/component/card.tsx",
        lineNumber: 97,
        columnNumber: 14
      }, this);
    case import_webapi_client.RecurringTaskPeriod.YEARLY:
      return /* @__PURE__ */ jsxDEV(Fragment, { children: [
        scoreOverview.yearly_score.total_score,
        " points from "
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/journals/component/card.tsx",
        lineNumber: 99,
        columnNumber: 14
      }, this);
  }
}

// app/routes/app/workspace/journals.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/journals.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/journals.tsx"
  );
  import.meta.hot.lastModified = "1777213342589.9958";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function Journals() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const entries = loaderData.entries;
  const entriesByRefId = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    entriesByRefId.set(entry.journal.ref_id, entry);
  }
  const activeJournals = findJournalsThatAreActive(entries.map((e) => e.journal), topLevelInfo.today);
  const yearJournal = activeJournals.find((j) => j.period === import_webapi_client2.RecurringTaskPeriod.YEARLY);
  const quarterJournal = activeJournals.find((j) => j.period === import_webapi_client2.RecurringTaskPeriod.QUARTERLY);
  const monthJournal = activeJournals.find((j) => j.period === import_webapi_client2.RecurringTaskPeriod.MONTHLY);
  const weekJournal = activeJournals.find((j) => j.period === import_webapi_client2.RecurringTaskPeriod.WEEKLY);
  const dayJournal = activeJournals.find((j) => j.period === import_webapi_client2.RecurringTaskPeriod.DAILY);
  const sortedJournals = sortJournalsNaturally(entries.map((e) => e.journal)).filter((journal) => {
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    const entry = entriesByRefId.get(journal.ref_id);
    return entry?.tags?.some((tag) => selectedTagsRefId.includes(tag.ref_id));
  });
  const journalStatsByJournalRefId = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    journalStatsByJournalRefId.set(entry.journal.ref_id, entry.journal_stats);
  }
  const journalTagsByJournalRefId = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    journalTagsByJournalRefId.set(entry.journal.ref_id, entry.tags ?? []);
  }
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/journals/new", returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "journals", topLevelInfo, inputsEnabled: true, actions: [FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId), NavSingle({
    text: "Settings",
    link: `/app/workspace/journals/settings`,
    icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/journals.tsx",
      lineNumber: 108,
      columnNumber: 11
    }, this)
  })] }, void 0, false, {
    fileName: "app/routes/app/workspace/journals.tsx",
    lineNumber: 102,
    columnNumber: 125
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { branchForceHide: shouldShowABranch, shouldHide: shouldShowABranch || shouldShowALeaf, children: [
      sortedJournals.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no journals to show. You can create a new journal.", newEntityLocations: "/app/workspace/journals/new", helpSubject: import_webapi_client2.DocsHelpSubject.JOURNALS }, void 0, false, {
        fileName: "app/routes/app/workspace/journals.tsx",
        lineNumber: 111,
        columnNumber: 41
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, children: [
        loaderData.journalSettings.periods.includes(import_webapi_client2.RecurringTaskPeriod.YEARLY) && /* @__PURE__ */ jsxDEV(CurrentJournal, { today: topLevelInfo.today, period: import_webapi_client2.RecurringTaskPeriod.YEARLY, topLevelInfo, journal: yearJournal, journalStats: yearJournal ? journalStatsByJournalRefId.get(yearJournal.ref_id) : void 0, label: "Yearly Journal", tags: yearJournal ? journalTagsByJournalRefId.get(yearJournal.ref_id) ?? [] : [] }, void 0, false, {
          fileName: "app/routes/app/workspace/journals.tsx",
          lineNumber: 114,
          columnNumber: 87
        }, this),
        loaderData.journalSettings.periods.includes(import_webapi_client2.RecurringTaskPeriod.QUARTERLY) && /* @__PURE__ */ jsxDEV(CurrentJournal, { today: topLevelInfo.today, period: import_webapi_client2.RecurringTaskPeriod.QUARTERLY, topLevelInfo, journal: quarterJournal, journalStats: quarterJournal ? journalStatsByJournalRefId.get(quarterJournal.ref_id) : void 0, label: "Quarterly Journal", tags: quarterJournal ? journalTagsByJournalRefId.get(quarterJournal.ref_id) ?? [] : [] }, void 0, false, {
          fileName: "app/routes/app/workspace/journals.tsx",
          lineNumber: 116,
          columnNumber: 90
        }, this),
        loaderData.journalSettings.periods.includes(import_webapi_client2.RecurringTaskPeriod.MONTHLY) && /* @__PURE__ */ jsxDEV(CurrentJournal, { today: topLevelInfo.today, period: import_webapi_client2.RecurringTaskPeriod.MONTHLY, topLevelInfo, journal: monthJournal, journalStats: monthJournal ? journalStatsByJournalRefId.get(monthJournal.ref_id) : void 0, label: "Monthly Journal", tags: monthJournal ? journalTagsByJournalRefId.get(monthJournal.ref_id) ?? [] : [] }, void 0, false, {
          fileName: "app/routes/app/workspace/journals.tsx",
          lineNumber: 118,
          columnNumber: 88
        }, this),
        loaderData.journalSettings.periods.includes(import_webapi_client2.RecurringTaskPeriod.WEEKLY) && /* @__PURE__ */ jsxDEV(CurrentJournal, { today: topLevelInfo.today, period: import_webapi_client2.RecurringTaskPeriod.WEEKLY, topLevelInfo, journal: weekJournal, journalStats: weekJournal ? journalStatsByJournalRefId.get(weekJournal.ref_id) : void 0, label: "Weekly Journal", tags: weekJournal ? journalTagsByJournalRefId.get(weekJournal.ref_id) ?? [] : [] }, void 0, false, {
          fileName: "app/routes/app/workspace/journals.tsx",
          lineNumber: 120,
          columnNumber: 87
        }, this),
        loaderData.journalSettings.periods.includes(import_webapi_client2.RecurringTaskPeriod.DAILY) && /* @__PURE__ */ jsxDEV(CurrentJournal, { today: topLevelInfo.today, period: import_webapi_client2.RecurringTaskPeriod.DAILY, topLevelInfo, journal: dayJournal, journalStats: dayJournal ? journalStatsByJournalRefId.get(dayJournal.ref_id) : void 0, label: "Daily Journal", tags: dayJournal ? journalTagsByJournalRefId.get(dayJournal.ref_id) ?? [] : [] }, void 0, false, {
          fileName: "app/routes/app/workspace/journals.tsx",
          lineNumber: 122,
          columnNumber: 86
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/journals.tsx",
        lineNumber: 113,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(JournalStack, { topLevelInfo, journals: sortedJournals, journalStatsByJournalRefId, journalTagsByJournalRefId }, void 0, false, {
        fileName: "app/routes/app/workspace/journals.tsx",
        lineNumber: 125,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/journals.tsx",
      lineNumber: 110,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/journals.tsx",
      lineNumber: 129,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/journals.tsx",
      lineNumber: 128,
      columnNumber: 7
    }, this)
  ] }, "journals", true, {
    fileName: "app/routes/app/workspace/journals.tsx",
    lineNumber: 102,
    columnNumber: 10
  }, this);
}
_s(Journals, "IDhluRBhzdWqbYm3prcDlX7xEX0=", false, function() {
  return [useLoaderDataSafeForAnimation, useBigScreen, useTrunkNeedsToShowBranch, useTrunkNeedsToShowLeaf];
});
_c = Journals;
function CurrentJournal(props) {
  if (!props.journal) {
    return /* @__PURE__ */ jsxDEV(Button_default, { variant: "outlined", component: Link, to: `/app/workspace/journals/new?initialPeriod=${props.period}&initialRightNow=${props.today}`, children: [
      "Create a ",
      props.label
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/journals.tsx",
      lineNumber: 139,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(JournalCard, { topLevelInfo: props.topLevelInfo, journal: props.journal, journalStats: props.journalStats, tags: props.tags, label: props.label, showOptions: {
    showSource: false,
    showPeriod: false
  } }, `journal-${props.journal.ref_id}`, false, {
    fileName: "app/routes/app/workspace/journals.tsx",
    lineNumber: 143,
    columnNumber: 10
  }, this);
}
_c2 = CurrentJournal;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the journals! Please try again!`
});
var _c;
var _c2;
$RefreshReg$(_c, "Journals");
$RefreshReg$(_c2, "CurrentJournal");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Journals as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/journals-N6ID7XWD.js.map
