import {
  aDateToDate,
  dateToAdate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  ArrowBackIosNew_default,
  ArrowForwardIos_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default,
  IconButton_default,
  Stack_default,
  Tooltip_default,
  Typography_default,
  styled_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  Link
} from "/build/_shared/chunk-VVGD4GL7.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/habits/component/streak-calendar.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var CELL_SIZE = (theme) => theme.typography.htmlFontSize - 2;
var CELL_FULL_SIZE = (theme) => CELL_SIZE(theme) + 2;
function HabitStreakCalendar(props) {
  const earliestDate = aDateToDate(props.earliestDate);
  const latestDate = aDateToDate(props.latestDate);
  const earliestDateAtWeekStart = aDateToDate(props.earliestDate).startOf(
    "week"
  );
  const latestDateAtWeekStart = aDateToDate(props.latestDate);
  const weeksBetween = [];
  let currentDate = earliestDateAtWeekStart;
  while (currentDate < latestDateAtWeekStart) {
    weeksBetween.push(currentDate);
    currentDate = currentDate.plus({ weeks: 1 });
  }
  const dataPerDay = /* @__PURE__ */ new Map();
  for (const streakMark of props.streakMarks) {
    dataPerDay.set(
      streakMark.date,
      computeDonenessForStreakMark(streakMark.statuses)
    );
  }
  const dataPerWeek = /* @__PURE__ */ new Map();
  const mergedStatuses = {};
  for (const streakMark of props.streakMarks) {
    const weekStart = aDateToDate(streakMark.date).startOf("week").toISODate();
    if (!mergedStatuses[weekStart]) {
      mergedStatuses[weekStart] = {};
    }
    for (const [key, value] of Object.entries(streakMark.statuses)) {
      mergedStatuses[weekStart][key] = value;
    }
  }
  for (const [weekStart, statuses] of Object.entries(mergedStatuses)) {
    dataPerWeek.set(weekStart, computeDonenessForStreakMark(statuses));
  }
  return /* @__PURE__ */ jsxDEV(StyledDiv, { children: [
    /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", sx: { alignSelf: "center" }, children: [
      props.showNav && props.getNavUrl && /* @__PURE__ */ jsxDEV(
        NavBefore,
        {
          to: props.getNavUrl(
            dateToAdate(earliestDate.minus({ days: 28 })),
            dateToAdate(latestDate.minus({ days: 28 }))
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
          lineNumber: 85,
          columnNumber: 11
        },
        this
      ),
      props.label && !props.noLabel && /* @__PURE__ */ jsxDEV(
        Typography_default,
        {
          variant: "body2",
          sx: { display: "flex", alignItems: "center", textAlign: "center" },
          children: props.label
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
          lineNumber: 94,
          columnNumber: 11
        },
        this
      ),
      !props.label && !props.noLabel && /* @__PURE__ */ jsxDEV(
        Typography_default,
        {
          variant: "body2",
          sx: { display: "flex", alignItems: "center", textAlign: "center" },
          children: [
            "From ",
            props.earliestDate,
            " ",
            /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
              fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
              lineNumber: 106,
              columnNumber: 39
            }, this),
            "To ",
            props.latestDate
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
          lineNumber: 102,
          columnNumber: 11
        },
        this
      ),
      props.showNav && props.getNavUrl && /* @__PURE__ */ jsxDEV(
        NavAfter,
        {
          to: props.getNavUrl(
            dateToAdate(earliestDate.plus({ days: 28 })),
            dateToAdate(latestDate.plus({ days: 28 }))
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
          lineNumber: 112,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
      lineNumber: 83,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      OneYear,
      {
        weeksBetween,
        currentToday: props.currentToday,
        dataPerDay,
        dataPerWeek
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
        lineNumber: 121,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
    lineNumber: 82,
    columnNumber: 5
  }, this);
}
function NavBefore(props) {
  return /* @__PURE__ */ jsxDEV(
    IconButton_default,
    {
      "aria-label": "previous-interval",
      size: "large",
      component: Link,
      to: props.to,
      children: /* @__PURE__ */ jsxDEV(ArrowBackIosNew_default, { fontSize: "inherit" }, void 0, false, {
        fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
        lineNumber: 143,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
      lineNumber: 137,
      columnNumber: 5
    },
    this
  );
}
function NavAfter(props) {
  return /* @__PURE__ */ jsxDEV(
    IconButton_default,
    {
      "aria-label": "next-interval",
      size: "large",
      component: Link,
      to: props.to,
      children: /* @__PURE__ */ jsxDEV(ArrowForwardIos_default, { fontSize: "inherit" }, void 0, false, {
        fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
        lineNumber: 160,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
      lineNumber: 154,
      columnNumber: 5
    },
    this
  );
}
function OneYear(props) {
  const theme = useTheme();
  return /* @__PURE__ */ jsxDEV(
    Stack_default,
    {
      direction: "row",
      sx: { marginLeft: "auto", marginRight: "auto", width: "fit-content" },
      children: props.weeksBetween.map((weekStart, index) => {
        const weekTooltip = `Week of ${weekStart.toISODate()}`;
        return /* @__PURE__ */ jsxDEV(
          OneCol,
          {
            weekStart,
            currentToday: props.currentToday,
            children: [
              /* @__PURE__ */ jsxDEV(Tooltip_default, { title: weekTooltip, children: /* @__PURE__ */ jsxDEV("span", { children: /* @__PURE__ */ jsxDEV(
                OneCell,
                {
                  isToday: false,
                  isFuture: false,
                  doneness: props.dataPerWeek.get(weekStart.toISODate())
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
                  lineNumber: 189,
                  columnNumber: 17
                },
                this
              ) }, void 0, false, {
                fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
                lineNumber: 188,
                columnNumber: 15
              }, this) }, void 0, false, {
                fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
                lineNumber: 187,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                "span",
                {
                  style: {
                    paddingBottom: "0.5rem",
                    background: theme.palette.background.paper
                  }
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
                  lineNumber: 197,
                  columnNumber: 13
                },
                this
              ),
              Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = weekStart.plus({ days: dayIndex });
                const value = props.dataPerDay.get(day.toISODate());
                const theValue = value !== void 0 ? `- ${value}%` : "";
                const isToday = props.currentToday == day.toISODate();
                const tooltip = isToday ? "Today" : `${day.toISODate()} ${theValue}`;
                return /* @__PURE__ */ jsxDEV(Tooltip_default, { title: tooltip, children: /* @__PURE__ */ jsxDEV("span", { children: /* @__PURE__ */ jsxDEV(
                  OneCell,
                  {
                    isToday,
                    isFuture: day.toISODate() > props.currentToday,
                    doneness: value
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
                    lineNumber: 215,
                    columnNumber: 21
                  },
                  this
                ) }, void 0, false, {
                  fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
                  lineNumber: 214,
                  columnNumber: 19
                }, this) }, dayIndex, false, {
                  fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
                  lineNumber: 213,
                  columnNumber: 17
                }, this);
              })
            ]
          },
          index,
          true,
          {
            fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
            lineNumber: 182,
            columnNumber: 11
          },
          this
        );
      })
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
      lineNumber: 175,
      columnNumber: 5
    },
    this
  );
}
function OneCol(props) {
  const currentTodayWeek = aDateToDate(props.currentToday).startOf("week");
  const isCurrentWeek = props.weekStart.equals(currentTodayWeek);
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: isCurrentWeek ? (theme) => theme.palette.info.light : "transparent"
      },
      children: props.children
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
      lineNumber: 241,
      columnNumber: 5
    },
    this
  );
}
function OneCell(props) {
  const theme = useTheme();
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        width: CELL_SIZE(theme),
        height: CELL_SIZE(theme),
        margin: "1px",
        backgroundColor: props.isToday ? "#ffd700" : props.isFuture ? theme.palette.info.light : bucketedColorScale(props.doneness)
      }
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/habits/component/streak-calendar.tsx",
      lineNumber: 264,
      columnNumber: 5
    },
    this
  );
}
function computeDonenessForStreakMark(statuses) {
  let doneStatuses = 0;
  let allStatuses = 0;
  for (const status of Object.values(statuses)) {
    if (status === import_webapi_client.InboxTaskStatus.DONE) {
      doneStatuses++;
    }
    allStatuses++;
  }
  if (allStatuses === 0) {
    return 0;
  }
  return Math.floor(doneStatuses / allStatuses * 100);
}
function bucketedColorScale(value) {
  if (value === void 0 || value === null)
    return "#eeeeee";
  if (value <= 15)
    return "#e57373";
  if (value <= 30)
    return "#ef9a9a";
  if (value <= 45)
    return "#ffb74d";
  if (value <= 60)
    return "#fff176";
  if (value <= 75)
    return "#aed581";
  return "#81c784";
}
var StyledDiv = styled_default("div")`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export {
  CELL_FULL_SIZE,
  HabitStreakCalendar
};
//# sourceMappingURL=/build/_shared/chunk-NGY7EFUG.js.map
