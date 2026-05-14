import {
  sortGoalsNaturally
} from "/build/_shared/chunk-OLMKSGLM.js";
import {
  computeAspectHierarchicalNameFromRoot,
  sortAspectsByTreeOrder
} from "/build/_shared/chunk-37FGSNWH.js";
import {
  periodName
} from "/build/_shared/chunk-HVU6TG3B.js";
import {
  ScoreOverview
} from "/build/_shared/chunk-HVHVJK66.js";
import {
  TabPanel
} from "/build/_shared/chunk-VEYCIPLX.js";
import {
  inboxTaskNamespaceName
} from "/build/_shared/chunk-ZNIVMWFF.js";
import {
  EntityNameOneLineComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  isUserFeatureAvailable
} from "/build/_shared/chunk-LJCXIXWH.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
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
  TODO_TASK,
  inferSourcesForEnabledFeatures,
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default,
  ListItemText_default,
  ListItem_default,
  List_default,
  Stack_default,
  Tab_default,
  TableBody_default,
  TableCell_default,
  TableContainer_default,
  TableHead_default,
  TableRow_default,
  Table_default,
  Tabs_default,
  Typography_default,
  styled_default
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

// ../core/jupiter/core/report/component/show-report.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);
var _SOURCES_TO_REPORT = [
  TODO_TASK,
  HABIT,
  CHORE,
  BIG_PLAN,
  JOURNAL,
  METRIC,
  PERSON_CATCH_UP,
  PERSON_OCCASION,
  SLACK_TASK,
  EMAIL_TASK,
  LIFE_PLAN_EVAL
];
function ShowReport({
  topLevelInfo,
  allAspects,
  allGoals,
  report
}) {
  const isBigScreen = useBigScreen();
  const [showTab, changeShowTab] = (0, import_react.useState)(0);
  const tabIndicesMap = {
    global: 0,
    "by-periods": 1,
    "by-aspects": 2,
    "by-goals": 3,
    "by-habits": 4,
    "by-chores": 5,
    "by-big-plans": 6
  };
  if (!isWorkspaceFeatureAvailable(
    topLevelInfo.workspace,
    import_webapi_client.WorkspaceFeature.LIFE_PLAN
  )) {
    tabIndicesMap["by-goals"] -= 1;
    tabIndicesMap["by-habits"] -= 1;
    tabIndicesMap["by-chores"] -= 1;
    tabIndicesMap["by-big-plans"] -= 1;
  }
  if (!isWorkspaceFeatureAvailable(
    topLevelInfo.workspace,
    import_webapi_client.WorkspaceFeature.HABITS
  )) {
    tabIndicesMap["by-chores"] -= 1;
    tabIndicesMap["by-big-plans"] -= 1;
  }
  if (!isWorkspaceFeatureAvailable(
    topLevelInfo.workspace,
    import_webapi_client.WorkspaceFeature.CHORES
  )) {
    tabIndicesMap["by-big-plans"] -= 1;
  }
  const allAspectsSorted = sortAspectsByTreeOrder(allAspects);
  const allAspectsByRefId = new Map(
    allAspects.map((p) => [p.ref_id, p])
  );
  const allGoalsSorted = sortGoalsNaturally(allGoals);
  const allGoalsByRefId = new Map(
    allGoals.map((g) => [g.ref_id, g])
  );
  return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, sx: { paddingTop: "1rem" }, children: [
    /* @__PURE__ */ jsxDEV(Box_default, { sx: { width: "100%", display: "flex", fontSize: "0.2rem" }, children: /* @__PURE__ */ jsxDEV(
      Typography_default,
      {
        variant: "h5",
        sx: {
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap"
        },
        children: [
          "\u{1F680} ",
          periodName(report.period),
          " as of",
          " ",
          aDateToDate(report.today).toFormat("yyyy-MM-dd")
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 147,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 146,
      columnNumber: 7
    }, this),
    isUserFeatureAvailable(topLevelInfo.user, import_webapi_client.UserFeature.GAMIFICATION) && report.user_score_overview && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "\u{1F4AA} Score", size: "large" }, void 0, false, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 163,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(ScoreOverview, { scoreOverview: report.user_score_overview }, void 0, false, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 164,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 162,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ jsxDEV(
      Tabs_default,
      {
        value: showTab,
        onChange: (_, newValue) => changeShowTab(newValue),
        variant: isBigScreen ? "standard" : "scrollable",
        scrollButtons: "auto",
        centered: isBigScreen,
        children: [
          /* @__PURE__ */ jsxDEV(Tab_default, { label: "\u{1F30D} Global" }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 175,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Tab_default, { label: "\u231B By Periods" }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 176,
            columnNumber: 9
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client.WorkspaceFeature.LIFE_PLAN
          ) && /* @__PURE__ */ jsxDEV(Tab_default, { label: "\u{1F4A1} By Aspects" }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 180,
            columnNumber: 14
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client.WorkspaceFeature.LIFE_PLAN
          ) && /* @__PURE__ */ jsxDEV(Tab_default, { label: "\u{1F3AF} By Goals" }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 184,
            columnNumber: 14
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client.WorkspaceFeature.HABITS
          ) && /* @__PURE__ */ jsxDEV(Tab_default, { label: "\u{1F4AA} By Habits" }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 188,
            columnNumber: 14
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client.WorkspaceFeature.CHORES
          ) && /* @__PURE__ */ jsxDEV(Tab_default, { label: "\u267B\uFE0F By Chore" }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 192,
            columnNumber: 14
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client.WorkspaceFeature.BIG_PLANS
          ) && /* @__PURE__ */ jsxDEV(Tab_default, { label: "\u{1F30D} By Big Plan" }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 196,
            columnNumber: 14
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 168,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(TabPanel, { value: showTab, index: tabIndicesMap["global"], children: /* @__PURE__ */ jsxDEV(
      OverviewReport,
      {
        topLevelInfo,
        inboxTasksSummary: report.global_inbox_tasks_summary,
        bigPlansSummary: report.global_big_plans_summary
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 200,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 199,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(TabPanel, { value: showTab, index: tabIndicesMap["by-periods"], children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: report.per_period_breakdown.map((pp) => /* @__PURE__ */ jsxDEV(import_react.Fragment, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: pp.name, size: "large" }, void 0, false, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 211,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(
        OverviewReport,
        {
          topLevelInfo,
          inboxTasksSummary: pp.inbox_tasks_summary,
          bigPlansSummary: pp.big_plans_summary
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 212,
          columnNumber: 15
        },
        this
      )
    ] }, pp.name, true, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 210,
      columnNumber: 13
    }, this)) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 208,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 207,
      columnNumber: 7
    }, this),
    isWorkspaceFeatureAvailable(
      topLevelInfo.workspace,
      import_webapi_client.WorkspaceFeature.LIFE_PLAN
    ) && /* @__PURE__ */ jsxDEV(TabPanel, { value: showTab, index: tabIndicesMap["by-aspects"], children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: allAspectsSorted.map((aspect) => {
      const pb = report.per_aspect_breakdown.find(
        (pb2) => pb2.ref_id === aspect.ref_id
      );
      if (pb === void 0) {
        return null;
      }
      const fullAspectName = computeAspectHierarchicalNameFromRoot(
        aspect,
        allAspectsByRefId
      );
      return /* @__PURE__ */ jsxDEV(import_react.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: fullAspectName, size: "large" }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 244,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(
          OverviewReport,
          {
            topLevelInfo,
            bigPlansSummary: pb.big_plans_summary
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 245,
            columnNumber: 19
          },
          this
        )
      ] }, pb.ref_id, true, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 243,
        columnNumber: 17
      }, this);
    }) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 227,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 226,
      columnNumber: 9
    }, this),
    isWorkspaceFeatureAvailable(
      topLevelInfo.workspace,
      import_webapi_client.WorkspaceFeature.LIFE_PLAN
    ) && /* @__PURE__ */ jsxDEV(TabPanel, { value: showTab, index: tabIndicesMap["by-goals"], children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: allGoalsSorted.map((goal) => {
      const gb = report.per_goal_breakdown.find(
        (gb2) => gb2.ref_id === goal.ref_id
      );
      if (gb === void 0) {
        return null;
      }
      const parentGoal = goal.parent_goal_ref_id ? allGoalsByRefId.get(goal.parent_goal_ref_id) : void 0;
      const goalLabel = parentGoal ? `${parentGoal.name} / ${goal.name}` : String(goal.name);
      return /* @__PURE__ */ jsxDEV(import_react.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: goalLabel, size: "large" }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 280,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(
          OverviewReport,
          {
            topLevelInfo,
            bigPlansSummary: gb.big_plans_summary
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 281,
            columnNumber: 19
          },
          this
        )
      ] }, gb.ref_id, true, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 279,
        columnNumber: 17
      }, this);
    }) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 261,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 260,
      columnNumber: 9
    }, this),
    isWorkspaceFeatureAvailable(
      topLevelInfo.workspace,
      import_webapi_client.WorkspaceFeature.HABITS
    ) && /* @__PURE__ */ jsxDEV(TabPanel, { value: showTab, index: tabIndicesMap["by-habits"], children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: Object.values(import_webapi_client.RecurringTaskPeriod).map((period) => {
      const periodHabits = report.per_habit_breakdown.filter(
        (phb) => phb.period === period
      );
      if (periodHabits.length === 0) {
        return null;
      }
      return /* @__PURE__ */ jsxDEV(import_react.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: periodName(period), size: "large" }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 309,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(TableContainer_default, { component: Box_default, children: /* @__PURE__ */ jsxDEV(Table_default, { sx: { tableLayout: "fixed" }, children: [
          /* @__PURE__ */ jsxDEV(TableHead_default, { children: /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: isBigScreen ? "20%" : "50%", children: "Name" }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 314,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
              "\u{1F4E5} ",
              isBigScreen && "Created"
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 317,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
              "\u{1F527} ",
              isBigScreen && "Not Started"
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 320,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
              "\u{1F6A7} ",
              isBigScreen && "Working"
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 323,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
              "\u26D4 ",
              isBigScreen && "Not Done"
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 326,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
              "\u2705 ",
              isBigScreen && "Done"
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 329,
              columnNumber: 27
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 313,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 312,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV(TableBody_default, { children: periodHabits.map((phb) => /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                to: `/app/workspace/habits/${phb.ref_id}`,
                children: /* @__PURE__ */ jsxDEV(EntityNameOneLineComponent, { name: phb.name }, void 0, false, {
                  fileName: "../core/jupiter/core/report/component/show-report.tsx",
                  lineNumber: 342,
                  columnNumber: 33
                }, this)
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/report/component/show-report.tsx",
                lineNumber: 339,
                columnNumber: 31
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 338,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: phb.summary.created_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 345,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: phb.summary.not_started_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 348,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: phb.summary.working_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 351,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: phb.summary.not_done_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 354,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: phb.summary.done_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 357,
              columnNumber: 29
            }, this)
          ] }, `${period}-${phb.ref_id}`, true, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 337,
            columnNumber: 27
          }, this)) }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 335,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 311,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 310,
          columnNumber: 19
        }, this)
      ] }, period, true, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 308,
        columnNumber: 17
      }, this);
    }) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 297,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 296,
      columnNumber: 9
    }, this),
    isWorkspaceFeatureAvailable(
      topLevelInfo.workspace,
      import_webapi_client.WorkspaceFeature.CHORES
    ) && /* @__PURE__ */ jsxDEV(TabPanel, { value: showTab, index: tabIndicesMap["by-chores"], children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: Object.values(import_webapi_client.RecurringTaskPeriod).map((period) => {
      const periodChores = report.per_chore_breakdown.filter(
        (pcb) => pcb.period === period
      );
      if (periodChores.length === 0) {
        return null;
      }
      return /* @__PURE__ */ jsxDEV(import_react.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: periodName(period), size: "large" }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 389,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(TableContainer_default, { component: Box_default, children: /* @__PURE__ */ jsxDEV(Table_default, { sx: { tableLayout: "fixed" }, children: [
          /* @__PURE__ */ jsxDEV(TableHead_default, { children: /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "50%", children: "Name" }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 394,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
              "\u{1F4E5} ",
              isBigScreen && "Created"
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 395,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
              "\u{1F527} ",
              isBigScreen && "Not Started"
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 398,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
              "\u{1F6A7} ",
              isBigScreen && "Working"
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 401,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
              "\u26D4 ",
              isBigScreen && "Not Done"
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 404,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
              "\u2705 ",
              isBigScreen && "Done"
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 407,
              columnNumber: 27
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 393,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 392,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV(TableBody_default, { children: periodChores.map((pcb) => /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(SmallTableCell, { className: "name-value", children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                to: `/app/workspace/chores/${pcb.ref_id}`,
                children: /* @__PURE__ */ jsxDEV(EntityNameOneLineComponent, { name: pcb.name }, void 0, false, {
                  fileName: "../core/jupiter/core/report/component/show-report.tsx",
                  lineNumber: 420,
                  columnNumber: 33
                }, this)
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/report/component/show-report.tsx",
                lineNumber: 417,
                columnNumber: 31
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 416,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: pcb.summary.created_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 423,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: pcb.summary.not_started_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 426,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: pcb.summary.working_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 429,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: pcb.summary.not_done_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 432,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: pcb.summary.done_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 435,
              columnNumber: 29
            }, this)
          ] }, `${period}-${pcb.ref_id}`, true, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 415,
            columnNumber: 27
          }, this)) }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 413,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 391,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 390,
          columnNumber: 19
        }, this)
      ] }, period, true, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 388,
        columnNumber: 17
      }, this);
    }) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 377,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 376,
      columnNumber: 9
    }, this),
    isWorkspaceFeatureAvailable(
      topLevelInfo.workspace,
      import_webapi_client.WorkspaceFeature.BIG_PLANS
    ) && /* @__PURE__ */ jsxDEV(TabPanel, { value: showTab, index: tabIndicesMap["by-big-plans"], children: /* @__PURE__ */ jsxDEV(TableContainer_default, { component: Box_default, children: /* @__PURE__ */ jsxDEV(Table_default, { sx: { tableLayout: "fixed" }, children: [
      /* @__PURE__ */ jsxDEV(TableHead_default, { children: /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
        /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "50%", children: "Name" }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 459,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
          "\u{1F4E5} ",
          isBigScreen && "Created"
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 460,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
          "\u{1F527} ",
          isBigScreen && "Not Started"
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 463,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
          "\u{1F6A7} ",
          isBigScreen && "Working"
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 466,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
          "\u26D4 ",
          isBigScreen && "Not Done"
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 469,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
          "\u2705 ",
          isBigScreen && "Done"
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 472,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 458,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 457,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(TableBody_default, { children: report.per_big_plan_breakdown.map((pbb) => /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
        /* @__PURE__ */ jsxDEV(SmallTableCell, { className: "name-value", children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/big-plans/${pbb.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityNameOneLineComponent, { name: pbb.name }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 483,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 482,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 481,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(SmallTableCell, { children: pbb.summary.created_cnt }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 486,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(SmallTableCell, { children: pbb.summary.not_started_cnt }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 487,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(SmallTableCell, { children: pbb.summary.working_cnt }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 490,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(SmallTableCell, { children: pbb.summary.not_done_cnt }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 491,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(SmallTableCell, { children: pbb.summary.done_cnt }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 492,
          columnNumber: 21
        }, this)
      ] }, pbb.ref_id, true, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 480,
        columnNumber: 19
      }, this)) }, void 0, false, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 478,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 456,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 455,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 454,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/report/component/show-report.tsx",
    lineNumber: 145,
    columnNumber: 5
  }, this);
}
function OverviewReport(props) {
  const isBigScreen = useBigScreen();
  const filteredSource = inferSourcesForEnabledFeatures(
    props.topLevelInfo.workspace,
    _SOURCES_TO_REPORT
  );
  return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
    props.inboxTasksSummary && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "\u{1F4E5} Inbox Tasks", size: "large" }, void 0, false, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 521,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TableContainer_default, { children: /* @__PURE__ */ jsxDEV(Table_default, { sx: { tableLayout: "fixed", width: "97%" }, children: [
        /* @__PURE__ */ jsxDEV(TableHead_default, { children: /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
          /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "50%", children: "Name" }, void 0, false, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 526,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
            "\u{1F4E5} ",
            isBigScreen && "Created"
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 527,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
            "\u{1F527} ",
            isBigScreen && "Not Started"
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 530,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
            "\u{1F6A7} ",
            isBigScreen && "Working"
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 533,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
            "\u26D4 ",
            isBigScreen && "Not Done"
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 536,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "10%", children: [
            "\u2705 ",
            isBigScreen && "Done"
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 539,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 525,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 524,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(TableBody_default, { children: [
          /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: "Total" }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 547,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: props.inboxTasksSummary.created.total_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 548,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: props.inboxTasksSummary.not_started.total_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 551,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: props.inboxTasksSummary.working.total_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 554,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: props.inboxTasksSummary.not_done.total_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 557,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: props.inboxTasksSummary.done.total_cnt }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 560,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 546,
            columnNumber: 17
          }, this),
          filteredSource.map((source) => /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: inboxTaskNamespaceName(source) }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 566,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: props.inboxTasksSummary.created.per_source_cnt.find(
              (s) => s.source === source
            )?.count || 0 }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 569,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: props.inboxTasksSummary.not_started.per_source_cnt.find(
              (s) => s.source === source
            )?.count || 0 }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 574,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: props.inboxTasksSummary.working.per_source_cnt.find(
              (s) => s.source === source
            )?.count || 0 }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 579,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: props.inboxTasksSummary.not_done.per_source_cnt.find(
              (s) => s.source === source
            )?.count || 0 }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 584,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(SmallTableCell, { children: props.inboxTasksSummary.done.per_source_cnt.find(
              (s) => s.source === source
            )?.count || 0 }, void 0, false, {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 589,
              columnNumber: 21
            }, this)
          ] }, source, true, {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 565,
            columnNumber: 19
          }, this))
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 545,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 523,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 522,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 520,
      columnNumber: 9
    }, this),
    isWorkspaceFeatureAvailable(
      props.topLevelInfo.workspace,
      import_webapi_client.WorkspaceFeature.BIG_PLANS
    ) && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "\u{1F30D} Big Plans", size: "large" }, void 0, false, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 607,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: "Summary" }, void 0, false, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 609,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(List_default, { children: [
        /* @__PURE__ */ jsxDEV(ListItem_default, { children: [
          /* @__PURE__ */ jsxDEV(
            ListItemText_default,
            {
              primary: `\u{1F4E5} Created: ${props.bigPlansSummary.created_cnt}`
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/report/component/show-report.tsx",
              lineNumber: 613,
              columnNumber: 15
            },
            this
          ),
          " "
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 612,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(ListItem_default, { children: /* @__PURE__ */ jsxDEV(
          ListItemText_default,
          {
            primary: `\u{1F527} Not Started: ${props.bigPlansSummary.not_started_cnt}`
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 618,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 617,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(ListItem_default, { children: /* @__PURE__ */ jsxDEV(
          ListItemText_default,
          {
            primary: `\u{1F6A7} Working: ${props.bigPlansSummary.working_cnt}`
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 623,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 622,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(ListItem_default, { children: /* @__PURE__ */ jsxDEV(
          ListItemText_default,
          {
            primary: `\u26D4 Not Done: ${props.bigPlansSummary.not_done_cnt}`
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 628,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 627,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(ListItem_default, { children: /* @__PURE__ */ jsxDEV(
          ListItemText_default,
          {
            primary: `\u2705 Done: ${props.bigPlansSummary.done_cnt}`
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/report/component/show-report.tsx",
            lineNumber: 633,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 632,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 611,
        columnNumber: 11
      }, this),
      props.bigPlansSummary.not_done_big_plans.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: "\u26D4 Not Done Details" }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 641,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(List_default, { children: props.bigPlansSummary.not_done_big_plans.map((bp) => /* @__PURE__ */ jsxDEV(ListItem_default, { children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/big-plans/${bp.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityNameOneLineComponent, { name: bp.name }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 647,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 646,
          columnNumber: 21
        }, this) }, bp.ref_id, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 645,
          columnNumber: 19
        }, this)) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 643,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 640,
        columnNumber: 13
      }, this),
      props.bigPlansSummary.done_big_plans.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: "\u2705 Done Details" }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 657,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(List_default, { children: props.bigPlansSummary.done_big_plans.map((bp) => /* @__PURE__ */ jsxDEV(ListItem_default, { children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/big-plans/${bp.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityNameOneLineComponent, { name: bp.name }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 663,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 662,
          columnNumber: 21
        }, this) }, bp.ref_id, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 661,
          columnNumber: 19
        }, this)) }, void 0, false, {
          fileName: "../core/jupiter/core/report/component/show-report.tsx",
          lineNumber: 659,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/report/component/show-report.tsx",
        lineNumber: 656,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/report/component/show-report.tsx",
      lineNumber: 606,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/report/component/show-report.tsx",
    lineNumber: 518,
    columnNumber: 5
  }, this);
}
var SmallTableCell = styled_default(TableCell_default)`
  font-size: 0.75rem;
`;

export {
  ShowReport
};
//# sourceMappingURL=/build/_shared/chunk-7YWL6DI3.js.map
