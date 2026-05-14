import {
  BigPlanDonePctTag
} from "/build/_shared/chunk-32S7BKKT.js";
import {
  bigPlanDonePct
} from "/build/_shared/chunk-K2HUSH5I.js";
import {
  DifficultyTag,
  EisenTag
} from "/build/_shared/chunk-U5MVWZEK.js";
import {
  EntityNameOneLineComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  BigPlanStatusTag
} from "/build/_shared/chunk-W6KI7GPI.js";
import {
  isCompleted
} from "/build/_shared/chunk-P7WFXMQY.js";
import {
  IsKeyTag
} from "/build/_shared/chunk-NVWDLS2H.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  Box_default,
  Stack_default,
  TableBody_default,
  TableCell_default,
  TableContainer_default,
  TableHead_default,
  TableRow_default,
  Table_default,
  Tooltip_default,
  styled_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  Link
} from "/build/_shared/chunk-VVGD4GL7.js";

// ../core/jupiter/core/big_plans/component/timeline-big-screen.tsx
function BigPlanTimelineBigScreen({
  today,
  thisYear,
  bigPlans,
  bigPlanMilestonesByRefId,
  bigPlanStatsByRefId,
  dateMarkers,
  selectedPredicate,
  allowSelect,
  onClick
}) {
  const theme = useTheme();
  return /* @__PURE__ */ jsxDEV(TableContainer_default, { component: Box_default, sx: { overflow: "visible" }, children: /* @__PURE__ */ jsxDEV(Table_default, { sx: { tableLayout: "fixed" }, children: [
    /* @__PURE__ */ jsxDEV(TableHead_default, { children: [
      /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
        /* @__PURE__ */ jsxDEV(TableCell_default, { width: "20%", children: "Name" }, void 0, false, {
          fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
          lineNumber: 68,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(TableCell_default, { width: "25%", children: "Properties" }, void 0, false, {
          fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
          lineNumber: 69,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(TableCell_default, { width: "55%", children: "Range" }, void 0, false, {
          fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
          lineNumber: 70,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
        lineNumber: 67,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
        /* @__PURE__ */ jsxDEV(TableCell_default, {}, void 0, false, {
          fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
          lineNumber: 73,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(TableCell_default, {}, void 0, false, {
          fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
          lineNumber: 74,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(BigScreenTimelineHeaderCell, { children: [
          /* @__PURE__ */ jsxDEV("span", { children: "Jan" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 76,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Feb" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 77,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Mar" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 78,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Apr" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 79,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "May" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 80,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Jun" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 81,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Jul" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 82,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Aug" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 83,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Sep" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 84,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Oct" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 85,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Nov" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 86,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Dec" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 87,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
          lineNumber: 75,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
        lineNumber: 72,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
      lineNumber: 66,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(TableBody_default, { children: bigPlans.map((entry) => {
      const { leftMargin, width } = computeBigPlanGnattPosition(
        thisYear,
        entry
      );
      const milestones = bigPlanMilestonesByRefId.get(entry.ref_id) ?? [];
      return /* @__PURE__ */ jsxDEV(TableRow_default, { id: `big-plan-${entry.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(
          TableCell_default,
          {
            sx: {
              padding: "0px",
              backgroundColor: allowSelect && selectedPredicate?.(entry) ? theme.palette.action.hover : "transparent"
            },
            onClick: () => allowSelect && onClick?.(entry),
            children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                block: allowSelect,
                to: `/app/workspace/big-plans/${entry.ref_id}`,
                singleLine: true,
                children: [
                  /* @__PURE__ */ jsxDEV(IsKeyTag, { isKey: entry.is_key }, void 0, false, {
                    fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
                    lineNumber: 117,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV(OverdueSign, { today, entry }, void 0, false, {
                    fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
                    lineNumber: 118,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV(EntityNameOneLineComponent, { name: entry.name }, void 0, false, {
                    fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
                    lineNumber: 119,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
                lineNumber: 112,
                columnNumber: 19
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 102,
            columnNumber: 17
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(TableCell_default, { children: /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 0.5, children: [
          /* @__PURE__ */ jsxDEV(
            BigPlanDonePctTag,
            {
              donePct: bigPlanDonePct(
                entry,
                bigPlanStatsByRefId.get(entry.ref_id)
              )
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
              lineNumber: 124,
              columnNumber: 21
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(BigPlanStatusTag, { status: entry.status }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 130,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(EisenTag, { eisen: entry.eisen }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 131,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(DifficultyTag, { difficulty: entry.difficulty }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 132,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
          lineNumber: 123,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
          lineNumber: 122,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(TableCell_default, { sx: { position: "relative" }, children: [
          /* @__PURE__ */ jsxDEV(TimelineGnattBlob, { leftmargin: leftMargin, width, children: "\xA0" }, void 0, false, {
            fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
            lineNumber: 136,
            columnNumber: 19
          }, this),
          dateMarkers?.map((marker, idx) => {
            const markerPosition = computeMarkerPosition(
              thisYear,
              marker.date
            );
            return /* @__PURE__ */ jsxDEV(Tooltip_default, { title: marker.label, placement: "top", children: /* @__PURE__ */ jsxDEV(
              DateMarker,
              {
                leftmargin: markerPosition,
                color: marker.color
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
                lineNumber: 146,
                columnNumber: 25
              },
              this
            ) }, idx, false, {
              fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
              lineNumber: 145,
              columnNumber: 23
            }, this);
          }),
          milestones.map((milestone, idx) => {
            const markerPosition = computeMarkerPosition(
              thisYear,
              milestone.date
            );
            return /* @__PURE__ */ jsxDEV(Tooltip_default, { title: milestone.name, placement: "top", children: /* @__PURE__ */ jsxDEV(
              MilestoneMarker,
              {
                leftmargin: markerPosition,
                color: "blue"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
                lineNumber: 160,
                columnNumber: 25
              },
              this
            ) }, idx, false, {
              fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
              lineNumber: 159,
              columnNumber: 23
            }, this);
          })
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
          lineNumber: 135,
          columnNumber: 17
        }, this)
      ] }, entry.ref_id, true, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
        lineNumber: 101,
        columnNumber: 15
      }, this);
    }) }, void 0, false, {
      fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
      lineNumber: 91,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
    lineNumber: 65,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
    lineNumber: 64,
    columnNumber: 5
  }, this);
}
var BigScreenTimelineHeaderCell = styled_default(TableCell_default)(() => ({
  display: "flex",
  flexWrap: "nowrap",
  justifyContent: "space-between",
  flexDirection: "row"
}));
var TimelineGnattBlob = styled_default("div")(
  ({ theme, isunderlay, leftmargin, width }) => ({
    position: isunderlay ? "absolute" : "static",
    display: "block",
    marginLeft: `${leftmargin * 100}%`,
    width: `${width * 100}%`,
    backgroundColor: theme.palette.action.disabledBackground,
    borderRadius: "0.25rem",
    height: "1.5rem"
  })
);
var DateMarker = styled_default("div")(
  ({ leftmargin, color }) => ({
    position: "absolute",
    top: 0,
    bottom: "-1px",
    width: "2px",
    backgroundColor: color,
    left: `calc(${leftmargin * 100}% - 0.5rem)`,
    zIndex: 1,
    cursor: "pointer"
  })
);
var MilestoneMarker = styled_default("div")(
  ({ leftmargin, color }) => ({
    position: "absolute",
    top: "1rem",
    bottom: "1rem",
    width: "2px",
    backgroundColor: color,
    left: `calc(${leftmargin * 100}% - 0.5rem)`,
    zIndex: 1,
    cursor: "pointer"
  })
);
function computeMarkerPosition(thisYear, date) {
  const startOfYear = thisYear.startOf("year");
  const endOfYear = startOfYear.endOf("year");
  const markerDate = aDateToDate(date);
  if (markerDate < startOfYear) {
    return 0;
  } else if (markerDate > endOfYear) {
    return 1;
  } else {
    return markerDate.ordinal / startOfYear.daysInYear;
  }
}
function computeBigPlanGnattPosition(thisYear, entry) {
  const startOfYear = thisYear.startOf("year");
  const endOfYear = startOfYear.endOf("year");
  let leftMargin = void 0;
  if (!entry.actionable_date) {
    leftMargin = 0.45;
  } else {
    const actionableDate = aDateToDate(entry.actionable_date);
    if (actionableDate < startOfYear) {
      leftMargin = 0;
    } else if (actionableDate > endOfYear) {
      leftMargin = 1;
    } else {
      leftMargin = actionableDate.ordinal / startOfYear.daysInYear;
    }
  }
  let width = void 0;
  if (!entry.due_date) {
    width = 0.1;
  } else {
    const dueDate = aDateToDate(entry.due_date);
    if (dueDate > endOfYear) {
      width = 1 - leftMargin;
    } else if (dueDate < startOfYear) {
      width = 0;
    } else {
      const rightMargin = dueDate.ordinal / startOfYear.daysInYear;
      width = rightMargin - leftMargin;
    }
  }
  const betterWidth = width < 0.4 ? 0.4 : width;
  const betterLeftMargin = leftMargin > 0.6 ? 0.6 : leftMargin;
  return { leftMargin, width, betterWidth, betterLeftMargin };
}
function OverdueSign({ today, entry }) {
  if (isCompleted(entry.status)) {
    return null;
  }
  if (!entry.due_date) {
    return null;
  }
  const theToday = aDateToDate(today);
  const theDueDate = aDateToDate(entry.due_date);
  if (theDueDate >= theToday) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV(Tooltip_default, { title: "Overdue", placement: "top", children: /* @__PURE__ */ jsxDEV("span", { children: "\u26A0\uFE0F" }, void 0, false, {
    fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
    lineNumber: 318,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "../core/jupiter/core/big_plans/component/timeline-big-screen.tsx",
    lineNumber: 317,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/big_plans/component/timeline-small-screen.tsx
function BigPlanTimelineSmallScreen({
  today,
  thisYear,
  bigPlans,
  bigPlanMilestonesByRefId,
  bigPlanStatsByRefId,
  dateMarkers,
  selectedPredicate,
  allowSelect,
  onClick
}) {
  return /* @__PURE__ */ jsxDEV(EntityStack, { children: /* @__PURE__ */ jsxDEV(SmallScreenTimelineList, { children: [
    /* @__PURE__ */ jsxDEV(SmallScreenTimelineHeader, { children: [
      /* @__PURE__ */ jsxDEV("span", { children: "Jan" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 52,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Feb" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 53,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Mar" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 54,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Apr" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 55,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "May" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 56,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Jun" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 57,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Jul" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 58,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Aug" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 59,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Sep" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 60,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Oct" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 61,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Nov" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 62,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Dec" }, void 0, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 63,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
      lineNumber: 51,
      columnNumber: 9
    }, this),
    dateMarkers && dateMarkers.length > 0 && /* @__PURE__ */ jsxDEV(SmallScreenTimelineLine, { children: dateMarkers.map((marker, idx) => {
      if (idx % 2 === 1) {
        return null;
      }
      const markerPosition = computeMarkerPosition2(
        thisYear,
        marker.date
      );
      return /* @__PURE__ */ jsxDEV(MarkerLabel, { leftmargin: markerPosition, children: marker.label }, idx, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 77,
        columnNumber: 17
      }, this);
    }) }, void 0, false, {
      fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
      lineNumber: 67,
      columnNumber: 11
    }, this),
    bigPlans.map((bigPlan) => {
      const { leftMargin, width, betterWidth, betterLeftMargin } = computeBigPlanGnattPosition2(thisYear, bigPlan);
      const milestones = bigPlanMilestonesByRefId.get(bigPlan.ref_id) || [];
      return /* @__PURE__ */ jsxDEV(
        SmallScreenTimelineLine,
        {
          selected: allowSelect && selectedPredicate?.(bigPlan),
          onClick: () => allowSelect && onClick?.(bigPlan),
          children: [
            /* @__PURE__ */ jsxDEV(
              TimelineGnattBlob2,
              {
                isunderlay: "true",
                leftmargin: leftMargin,
                width,
                children: "\xA0"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
                lineNumber: 97,
                columnNumber: 15
              },
              this
            ),
            dateMarkers?.map((marker, idx) => {
              const markerPosition = computeMarkerPosition2(
                thisYear,
                marker.date
              );
              return /* @__PURE__ */ jsxDEV(Tooltip_default, { title: marker.label, placement: "top", children: /* @__PURE__ */ jsxDEV(
                DateMarker2,
                {
                  leftmargin: markerPosition,
                  color: marker.color
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
                  lineNumber: 111,
                  columnNumber: 21
                },
                this
              ) }, idx, false, {
                fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
                lineNumber: 110,
                columnNumber: 19
              }, this);
            }),
            milestones.map((milestone, idx) => {
              const markerPosition = computeMarkerPosition2(
                thisYear,
                milestone.date
              );
              return /* @__PURE__ */ jsxDEV(Tooltip_default, { title: milestone.name, placement: "top", children: /* @__PURE__ */ jsxDEV(
                MilestoneMarker2,
                {
                  leftmargin: markerPosition,
                  color: "blue"
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
                  lineNumber: 125,
                  columnNumber: 21
                },
                this
              ) }, idx, false, {
                fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
                lineNumber: 124,
                columnNumber: 19
              }, this);
            }),
            /* @__PURE__ */ jsxDEV(
              TimelineLink,
              {
                id: `big-plan-${bigPlan.ref_id}`,
                leftmargin: betterLeftMargin,
                width: betterWidth,
                to: `/app/workspace/big-plans/${bigPlan.ref_id}`,
                children: [
                  /* @__PURE__ */ jsxDEV(BigPlanStatusTag, { status: bigPlan.status, format: "icon" }, void 0, false, {
                    fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
                    lineNumber: 138,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV(IsKeyTag, { isKey: bigPlan.is_key }, void 0, false, {
                    fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
                    lineNumber: 139,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV(OverdueSign2, { today, bigPlan }, void 0, false, {
                    fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
                    lineNumber: 140,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    EntityNameOneLineComponent,
                    {
                      name: `[${bigPlanDonePct(
                        bigPlan,
                        bigPlanStatsByRefId.get(bigPlan.ref_id)
                      )}%] ${bigPlan.name}`
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
                      lineNumber: 141,
                      columnNumber: 17
                    },
                    this
                  )
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
                lineNumber: 132,
                columnNumber: 15
              },
              this
            )
          ]
        },
        bigPlan.ref_id,
        true,
        {
          fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
          lineNumber: 92,
          columnNumber: 13
        },
        this
      );
    }),
    dateMarkers && dateMarkers.length > 0 && /* @__PURE__ */ jsxDEV(SmallScreenTimelineLine, { children: dateMarkers.map((marker, idx) => {
      if (idx % 2 === 0) {
        return null;
      }
      const markerPosition = computeMarkerPosition2(
        thisYear,
        marker.date
      );
      return /* @__PURE__ */ jsxDEV(MarkerLabel, { leftmargin: markerPosition, children: marker.label }, idx, false, {
        fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
        lineNumber: 163,
        columnNumber: 17
      }, this);
    }) }, void 0, false, {
      fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
      lineNumber: 153,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
    lineNumber: 50,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
    lineNumber: 49,
    columnNumber: 5
  }, this);
}
var SmallScreenTimelineList = styled_default("div")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  fontSize: "0.8rem"
}));
var SmallScreenTimelineHeader = styled_default("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "nowrap"
}));
var SmallScreenTimelineLine = styled_default("div")(
  ({ theme, selected }) => ({
    position: "relative",
    height: "1.5rem",
    backgroundColor: selected ? theme.palette.action.hover : "transparent"
  })
);
var TimelineGnattBlob2 = styled_default("div")(
  ({ theme, isunderlay, leftmargin, width }) => ({
    position: isunderlay ? "absolute" : "static",
    display: "block",
    marginLeft: `${leftmargin * 100}%`,
    width: `${width * 100}%`,
    backgroundColor: theme.palette.action.disabledBackground,
    borderRadius: "0.25rem",
    height: "1.5rem"
  })
);
var TimelineLink = styled_default(Link)(
  ({ leftmargin, width, theme }) => ({
    textDecoration: "none",
    position: "absolute",
    display: "flex",
    color: theme.palette.info.dark,
    ":visited": {
      color: theme.palette.info.dark
    },
    marginLeft: `${leftmargin * 100}%`,
    width: `${width * 100}%`,
    paddingLeft: "0.5rem",
    borderRadius: "0.25rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    height: "1.5rem",
    lineHeight: "1.5rem",
    zIndex: 2
  })
);
var DateMarker2 = styled_default("div")(
  ({ leftmargin, color }) => ({
    position: "absolute",
    bottom: 0,
    top: "-0.5rem",
    height: "calc(100% + 1rem)",
    width: "2px",
    backgroundColor: color,
    left: `${leftmargin * 100}%`,
    zIndex: 1,
    cursor: "pointer"
  })
);
var MilestoneMarker2 = styled_default("div")(
  ({ leftmargin, color }) => ({
    position: "absolute",
    top: "0px",
    bottom: "0px",
    width: "2px",
    backgroundColor: color,
    left: `${leftmargin * 100}%`,
    zIndex: 1,
    cursor: "pointer"
  })
);
var MarkerLabel = styled_default("div")(({ leftmargin }) => ({
  position: "absolute",
  transform: "translateX(-50%)",
  left: `${leftmargin * 100}%`,
  whiteSpace: "nowrap",
  fontWeight: "bold"
}));
function computeBigPlanGnattPosition2(thisYear, entry) {
  const startOfYear = thisYear.startOf("year");
  const endOfYear = startOfYear.endOf("year");
  let leftMargin = void 0;
  if (!entry.actionable_date) {
    leftMargin = 0.45;
  } else {
    const actionableDate = aDateToDate(entry.actionable_date);
    if (actionableDate < startOfYear) {
      leftMargin = 0;
    } else if (actionableDate > endOfYear) {
      leftMargin = 1;
    } else {
      leftMargin = actionableDate.ordinal / startOfYear.daysInYear;
    }
  }
  let width = void 0;
  if (!entry.due_date) {
    width = 0.1;
  } else {
    const dueDate = aDateToDate(entry.due_date);
    if (dueDate > endOfYear) {
      width = 1 - leftMargin;
    } else if (dueDate < startOfYear) {
      width = 0;
    } else {
      const rightMargin = dueDate.ordinal / startOfYear.daysInYear;
      width = rightMargin - leftMargin;
    }
  }
  const betterWidth = width < 0.4 ? 0.4 : width;
  const betterLeftMargin = leftMargin > 0.6 ? 0.6 : leftMargin;
  return { leftMargin, width, betterWidth, betterLeftMargin };
}
function computeMarkerPosition2(thisYear, date) {
  const startOfYear = thisYear.startOf("year");
  const endOfYear = startOfYear.endOf("year");
  const markerDate = aDateToDate(date);
  if (markerDate < startOfYear) {
    return 0;
  } else if (markerDate > endOfYear) {
    return 1;
  } else {
    return markerDate.ordinal / startOfYear.daysInYear;
  }
}
function OverdueSign2({ today, bigPlan }) {
  if (isCompleted(bigPlan.status)) {
    return null;
  }
  if (!bigPlan.due_date) {
    return null;
  }
  const theToday = aDateToDate(today);
  const theDueDate = aDateToDate(bigPlan.due_date);
  if (theDueDate >= theToday) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV(Tooltip_default, { title: "Overdue", placement: "top", children: /* @__PURE__ */ jsxDEV("span", { children: "\u26A0\uFE0F" }, void 0, false, {
    fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
    lineNumber: 374,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "../core/jupiter/core/big_plans/component/timeline-small-screen.tsx",
    lineNumber: 373,
    columnNumber: 5
  }, this);
}

export {
  BigPlanTimelineBigScreen,
  BigPlanTimelineSmallScreen
};
//# sourceMappingURL=/build/_shared/chunk-LWTJ5F7Z.js.map
