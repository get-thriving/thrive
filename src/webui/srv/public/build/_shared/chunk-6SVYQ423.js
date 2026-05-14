import {
  Pe
} from "/build/_shared/chunk-BPEDSDJA.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  Typography_default,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/gamification/component/score-history.tsx
function ScoreHistory(props) {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      ScoresGraph,
      {
        title: "Daily Scores",
        scores: props.scoreHistory.daily_scores
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/gamification/component/score-history.tsx",
        lineNumber: 14,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      ScoresGraph,
      {
        title: "Weekly Scores",
        scores: props.scoreHistory.weekly_scores
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/gamification/component/score-history.tsx",
        lineNumber: 18,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      ScoresGraph,
      {
        title: "Monthly Scores",
        scores: props.scoreHistory.monthly_scores
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/gamification/component/score-history.tsx",
        lineNumber: 22,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      ScoresGraph,
      {
        title: "Quarterly Scores",
        scores: props.scoreHistory.quarterly_scores
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/gamification/component/score-history.tsx",
        lineNumber: 26,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/gamification/component/score-history.tsx",
    lineNumber: 13,
    columnNumber: 5
  }, this);
}
function ScoresGraph({ title, scores }) {
  if (scores.length <= 2) {
    return null;
  }
  const totalScoresForGraph = scores.map((score) => {
    return {
      x: aDateToDate(score.date).toFormat("yyyy-MM-dd"),
      y: score.total_score
    };
  });
  const totalScoreMaxValue = Math.max(...totalScoresForGraph.map((entry) => entry.y)) * 1.35;
  const inboxTaskCntForGraph = scores.map((score) => {
    return {
      x: aDateToDate(score.date).toFormat("yyyy-MM-dd"),
      y: score.inbox_task_cnt
    };
  });
  const bigPlanCntForGraph = scores.map((score) => {
    return {
      x: aDateToDate(score.date).toFormat("yyyy-MM-dd"),
      y: score.big_plan_cnt
    };
  });
  return /* @__PURE__ */ jsxDEV(MetricGraphDiv, { children: [
    /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: title }, void 0, false, {
      fileName: "../core/jupiter/core/gamification/component/score-history.tsx",
      lineNumber: 68,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      Pe,
      {
        curve: "monotoneX",
        xScale: {
          type: "time",
          format: "%Y-%m-%d",
          useUTC: false,
          precision: "day"
        },
        xFormat: "time:%Y-%m-%d",
        yScale: {
          type: "linear",
          nice: true,
          min: 0,
          max: totalScoreMaxValue
        },
        axisBottom: {
          format: "%y-%b",
          tickValues: 7
        },
        pointSize: 4,
        pointBorderWidth: 1,
        pointBorderColor: {
          from: "color",
          modifiers: [["darker", 0.3]]
        },
        margin: { top: 20, right: 50, bottom: 110, left: 50 },
        useMesh: true,
        enableSlices: false,
        legends: [
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 50,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 100,
            itemHeight: 30,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)"
          }
        ],
        data: [
          {
            id: "Total Score",
            data: totalScoresForGraph
          },
          {
            id: "Inbox Tasks",
            data: inboxTaskCntForGraph
          },
          {
            id: "Big Plans",
            data: bigPlanCntForGraph
          }
        ]
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/gamification/component/score-history.tsx",
        lineNumber: 69,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/gamification/component/score-history.tsx",
    lineNumber: 67,
    columnNumber: 5
  }, this);
}
var MetricGraphDiv = styled_default("div")`
  height: 300px;
  margin-bottom: 2rem;
`;

export {
  ScoreHistory
};
//# sourceMappingURL=/build/_shared/chunk-6SVYQ423.js.map
