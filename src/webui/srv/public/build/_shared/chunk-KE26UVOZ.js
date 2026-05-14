import {
  PeriodTag
} from "/build/_shared/chunk-HLPWZ3ZO.js";
import {
  comparePeriods
} from "/build/_shared/chunk-HVU6TG3B.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  isUserFeatureAvailable
} from "/build/_shared/chunk-LJCXIXWH.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate,
  compareADate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  isWorkspaceFeatureAvailable
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

// ../core/jupiter/core/journals/root.ts
var import_webapi_client = __toESM(require_dist(), 1);
function findJournalsThatAreActive(journals, today) {
  const todayDate = aDateToDate(today);
  return journals.filter((journal) => {
    const rightNowDate = aDateToDate(journal.right_now);
    switch (journal.period) {
      case import_webapi_client.RecurringTaskPeriod.DAILY:
        return rightNowDate.hasSame(todayDate, "day");
      case import_webapi_client.RecurringTaskPeriod.WEEKLY:
        return rightNowDate.hasSame(todayDate, "week");
      case import_webapi_client.RecurringTaskPeriod.MONTHLY:
        return rightNowDate.hasSame(todayDate, "month");
      case import_webapi_client.RecurringTaskPeriod.QUARTERLY:
        return rightNowDate.hasSame(todayDate, "quarter");
      case import_webapi_client.RecurringTaskPeriod.YEARLY:
        return rightNowDate.hasSame(todayDate, "year");
    }
  });
}
function sortJournalsNaturally(journals) {
  return [...journals].sort((j1, j2) => {
    if (j2.archived && !j1.archived) {
      return -1;
    }
    if (j1.archived && !j2.archived) {
      return 1;
    }
    return -1 * compareADate(j1.right_now, j2.right_now) || comparePeriods(j1.period, j2.period);
  });
}

// ../core/jupiter/core/journals/source.ts
var import_webapi_client2 = __toESM(require_dist(), 1);
function journalSourceName(source) {
  switch (source) {
    case import_webapi_client2.JournalSource.USER:
      return "User";
    case import_webapi_client2.JournalSource.GENERATED:
      return "Generated";
  }
}
function allowUserChanges(source) {
  return source === import_webapi_client2.JournalSource.USER;
}

// ../core/jupiter/core/journals/component/stack.tsx
var import_webapi_client4 = __toESM(require_dist(), 1);

// ../core/jupiter/core/journals/component/tag.tsx
var import_webapi_client3 = __toESM(require_dist(), 1);
function JournalSourceTag({ source }) {
  const tagName = journalSourceName(source);
  const tagClass = sourceToClass(source);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: tagName, color: tagClass }, void 0, false, {
    fileName: "../core/jupiter/core/journals/component/tag.tsx",
    lineNumber: 13,
    columnNumber: 10
  }, this);
}
function sourceToClass(source) {
  switch (source) {
    case import_webapi_client3.JournalSource.USER:
      return "info";
    case import_webapi_client3.JournalSource.GENERATED:
      return "warning";
  }
}

// ../core/jupiter/core/journals/component/stack.tsx
function JournalStack(props) {
  return /* @__PURE__ */ jsxDEV(EntityStack, { children: props.journals.map((journal) => {
    const journalStats = props.journalStatsByJournalRefId?.get(
      journal.ref_id
    );
    return /* @__PURE__ */ jsxDEV(
      EntityCard,
      {
        entityId: `journal-${journal.ref_id}`,
        allowSwipe: props.allowSwipe,
        allowMarkNotDone: props.allowMarkNotDone,
        onMarkNotDone: () => props.onMarkNotDone && props.onMarkNotDone(journal),
        children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/journals/${journal.ref_id}`, children: [
          /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: journal.name }, void 0, false, {
            fileName: "../core/jupiter/core/journals/component/stack.tsx",
            lineNumber: 53,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(JournalSourceTag, { source: journal.source }, void 0, false, {
            fileName: "../core/jupiter/core/journals/component/stack.tsx",
            lineNumber: 54,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(PeriodTag, { period: journal.period }, void 0, false, {
            fileName: "../core/jupiter/core/journals/component/stack.tsx",
            lineNumber: 55,
            columnNumber: 15
          }, this),
          props.journalTagsByJournalRefId?.get(journal.ref_id)?.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
            fileName: "../core/jupiter/core/journals/component/stack.tsx",
            lineNumber: 59,
            columnNumber: 19
          }, this)),
          isUserFeatureAvailable(
            props.topLevelInfo.user,
            import_webapi_client4.UserFeature.GAMIFICATION
          ) && journalStats && /* @__PURE__ */ jsxDEV(
            GamificationTag,
            {
              period: journal.period,
              report: journalStats.report
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/journals/component/stack.tsx",
              lineNumber: 66,
              columnNumber: 19
            },
            this
          ),
          journalStats && journalStats.report.global_inbox_tasks_summary.done.total_cnt,
          " ",
          "tasks done",
          isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            import_webapi_client4.WorkspaceFeature.BIG_PLANS
          ) && journalStats && /* @__PURE__ */ jsxDEV(Fragment, { children: [
            " ",
            "and ",
            journalStats.report.global_big_plans_summary.done_cnt,
            " ",
            "big plans done"
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/journals/component/stack.tsx",
            lineNumber: 80,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/journals/component/stack.tsx",
          lineNumber: 52,
          columnNumber: 13
        }, this)
      },
      `journal-${journal.ref_id}`,
      false,
      {
        fileName: "../core/jupiter/core/journals/component/stack.tsx",
        lineNumber: 43,
        columnNumber: 11
      },
      this
    );
  }) }, void 0, false, {
    fileName: "../core/jupiter/core/journals/component/stack.tsx",
    lineNumber: 36,
    columnNumber: 5
  }, this);
}
function GamificationTag({ period, report }) {
  if (!report.user_score_overview) {
    return null;
  }
  switch (period) {
    case import_webapi_client4.RecurringTaskPeriod.DAILY:
      return /* @__PURE__ */ jsxDEV(Fragment, { children: [
        report.user_score_overview.daily_score.total_score,
        " points from "
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/journals/component/stack.tsx",
        lineNumber: 109,
        columnNumber: 9
      }, this);
    case import_webapi_client4.RecurringTaskPeriod.WEEKLY:
      return /* @__PURE__ */ jsxDEV(Fragment, { children: [
        report.user_score_overview.weekly_score.total_score,
        " points from "
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/journals/component/stack.tsx",
        lineNumber: 113,
        columnNumber: 9
      }, this);
    case import_webapi_client4.RecurringTaskPeriod.MONTHLY:
      return /* @__PURE__ */ jsxDEV(Fragment, { children: [
        report.user_score_overview.monthly_score.total_score,
        " points from "
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/journals/component/stack.tsx",
        lineNumber: 117,
        columnNumber: 9
      }, this);
    case import_webapi_client4.RecurringTaskPeriod.QUARTERLY:
      return /* @__PURE__ */ jsxDEV(Fragment, { children: [
        report.user_score_overview.quarterly_score.total_score,
        " points from",
        " "
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/journals/component/stack.tsx",
        lineNumber: 121,
        columnNumber: 9
      }, this);
    case import_webapi_client4.RecurringTaskPeriod.YEARLY:
      return /* @__PURE__ */ jsxDEV(Fragment, { children: [
        report.user_score_overview.yearly_score.total_score,
        " points from "
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/journals/component/stack.tsx",
        lineNumber: 128,
        columnNumber: 9
      }, this);
  }
}

export {
  findJournalsThatAreActive,
  sortJournalsNaturally,
  allowUserChanges,
  JournalSourceTag,
  JournalStack
};
//# sourceMappingURL=/build/_shared/chunk-KE26UVOZ.js.map
