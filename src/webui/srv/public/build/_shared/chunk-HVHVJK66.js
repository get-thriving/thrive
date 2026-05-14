import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default,
  TableBody_default,
  TableCell_default,
  TableContainer_default,
  TableHead_default,
  TableRow_default,
  Table_default,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/gamification/component/score-overview.tsx
function ScoreOverview(props) {
  const isBigScreen = useBigScreen();
  return /* @__PURE__ */ jsxDEV(TableContainer_default, { component: Box_default, children: /* @__PURE__ */ jsxDEV(
    Table_default,
    {
      sx: { tableLayout: "fixed" },
      size: isBigScreen ? "small" : "medium",
      children: [
        /* @__PURE__ */ jsxDEV(TableHead_default, { children: /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
          /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "20%", children: "Period" }, void 0, false, {
            fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
            lineNumber: 30,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "20%", children: "Current" }, void 0, false, {
            fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
            lineNumber: 31,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "20%", children: "Best This Quarter" }, void 0, false, {
            fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
            lineNumber: 32,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "20%", children: "Best This Year" }, void 0, false, {
            fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
            lineNumber: 33,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(SmallTableCell, { width: "20%", children: "Best Ever" }, void 0, false, {
            fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
            lineNumber: 34,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
          lineNumber: 29,
          columnNumber: 11
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
          lineNumber: 28,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV(TableBody_default, { children: [
          /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "Daily" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 39,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(Score, { userScore: props.scoreOverview.daily_score }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 41,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 40,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(
              Score,
              {
                userScore: props.scoreOverview.best_quarterly_daily_score
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
                lineNumber: 44,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 43,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(Score, { userScore: props.scoreOverview.best_yearly_daily_score }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 49,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 48,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(
              Score,
              {
                userScore: props.scoreOverview.best_lifetime_daily_score
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
                lineNumber: 52,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 51,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
            lineNumber: 38,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "Weekly" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 59,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(Score, { userScore: props.scoreOverview.weekly_score }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 61,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 60,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(
              Score,
              {
                userScore: props.scoreOverview.best_quarterly_weekly_score
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
                lineNumber: 64,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 63,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(Score, { userScore: props.scoreOverview.best_yearly_weekly_score }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 69,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 68,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(
              Score,
              {
                userScore: props.scoreOverview.best_lifetime_weekly_score
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
                lineNumber: 72,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 71,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
            lineNumber: 58,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "Monthly" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 79,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(Score, { userScore: props.scoreOverview.monthly_score }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 81,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 80,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(
              Score,
              {
                userScore: props.scoreOverview.best_quarterly_monthly_score
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
                lineNumber: 84,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 83,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(
              Score,
              {
                userScore: props.scoreOverview.best_yearly_monthly_score
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
                lineNumber: 89,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 88,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(
              Score,
              {
                userScore: props.scoreOverview.best_lifetime_monthly_score
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
                lineNumber: 94,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 93,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
            lineNumber: 78,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "Quarterly" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 101,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(Score, { userScore: props.scoreOverview.quarterly_score }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 103,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 102,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "N/A" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 105,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(
              Score,
              {
                userScore: props.scoreOverview.best_yearly_quarterly_score
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
                lineNumber: 107,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 106,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(
              Score,
              {
                userScore: props.scoreOverview.best_lifetime_quarterly_score
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
                lineNumber: 112,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 111,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
            lineNumber: 100,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "Yearly" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 119,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(Score, { userScore: props.scoreOverview.yearly_score }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 121,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 120,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "N/A" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 123,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "N/A" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 124,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(
              Score,
              {
                userScore: props.scoreOverview.best_lifetime_yearly_score
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
                lineNumber: 126,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 125,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
            lineNumber: 118,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "Lifetime" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 133,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(Score, { userScore: props.scoreOverview.lifetime_score }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 135,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 134,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "N/A" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 137,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "N/A" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 138,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(TableCell_default, { children: "N/A" }, void 0, false, {
              fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
              lineNumber: 139,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
            lineNumber: 132,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
          lineNumber: 37,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
      lineNumber: 24,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, this);
}
var SmallTableCell = styled_default(TableCell_default)`
  font-size: 0.75rem;
  font-weight: bold;
`;
function Score({ userScore }) {
  const isBigScreen = useBigScreen();
  if (!isBigScreen) {
    return /* @__PURE__ */ jsxDEV(Fragment, { children: userScore.total_score }, void 0, false, {
      fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
      lineNumber: 160,
      columnNumber: 12
    }, this);
  }
  if (userScore.inbox_task_cnt > 0 && userScore.big_plan_cnt > 0) {
    return /* @__PURE__ */ jsxDEV(Fragment, { children: [
      userScore.total_score,
      " \u{1F4E5} ",
      userScore.inbox_task_cnt,
      " \u{1F30D}",
      " ",
      userScore.big_plan_cnt
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
      lineNumber: 165,
      columnNumber: 7
    }, this);
  } else if (userScore.inbox_task_cnt > 0 && userScore.big_plan_cnt === 0) {
    return /* @__PURE__ */ jsxDEV(Fragment, { children: [
      userScore.total_score,
      " \u{1F4E5} ",
      userScore.inbox_task_cnt
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
      lineNumber: 172,
      columnNumber: 7
    }, this);
  } else if (userScore.inbox_task_cnt === 0 && userScore.big_plan_cnt > 0) {
    return /* @__PURE__ */ jsxDEV(Fragment, { children: [
      userScore.total_score,
      " \u{1F30D} ",
      userScore.big_plan_cnt
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
      lineNumber: 178,
      columnNumber: 7
    }, this);
  } else {
    return /* @__PURE__ */ jsxDEV(Fragment, { children: userScore.total_score }, void 0, false, {
      fileName: "../core/jupiter/core/gamification/component/score-overview.tsx",
      lineNumber: 183,
      columnNumber: 12
    }, this);
  }
}

export {
  ScoreOverview
};
//# sourceMappingURL=/build/_shared/chunk-HVHVJK66.js.map
