import {
  MAX_VISIBLE_TIME_EVENT_FULL_DAYS,
  View,
  ViewAsCalendarDaily,
  ViewAsCalendarDateHeader,
  ViewAsCalendarDaysAndFullDaysContiner,
  ViewAsCalendarEmptyCell,
  ViewAsCalendarGoToCell,
  ViewAsCalendarInDayContainer,
  ViewAsCalendarLeftColumn,
  ViewAsCalendarMoreButton,
  ViewAsCalendarRightColumn,
  ViewAsCalendarStatsCell,
  ViewAsCalendarTimeEventFullDaysColumn,
  ViewAsCalendarTimeEventInDayColumn,
  ViewAsScheduleContentCell,
  ViewAsScheduleDailyAndWeekly,
  ViewAsStatsPerSubperiod
} from "/build/_shared/chunk-NWDPLOTZ.js";
import "/build/_shared/chunk-7YZ2X2X4.js";
import {
  combinedTimeEventFullDayEntryPartionByDay,
  combinedTimeEventInDayEntryPartionByDay,
  timeEventInDayBlockToTimezone
} from "/build/_shared/chunk-24RA7B23.js";
import "/build/_shared/chunk-HDJTYRJL.js";
import {
  periodName
} from "/build/_shared/chunk-HVU6TG3B.js";
import {
  newURLParams
} from "/build/_shared/chunk-R75UYOOE.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import "/build/_shared/chunk-HGSZOXV4.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  NavMultipleCompact,
  NavMultipleSpread,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  allDaysBetween
} from "/build/_shared/chunk-72ELS2LF.js";
import "/build/_shared/chunk-MY6WUQK6.js";
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
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  ArrowBack_default,
  ArrowForward_default,
  Tune_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  Box_default,
  TableBody_default,
  TableCell_default,
  TableContainer_default,
  TableRow_default,
  Table_default,
  Typography_default
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
  require_frontdoor
} from "/build/_shared/chunk-7YAKCRRX.js";
import {
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
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
  Outlet,
  useLocation,
  useNavigation,
  useSearchParams
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

// app/routes/app/workspace/calendar.tsx
var import_webapi_client4 = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react3 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());
var import_frontdoor = __toESM(require_frontdoor());

// ../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx
var import_react = __toESM(require_react(), 1);
function ViewAsCalendarWeekly(props) {
  const isBigScreen = useBigScreen();
  const [showAllTimeEventFullDays, setShowAllTimeEventFullDays] = (0, import_react.useState)(false);
  if (props.entries === void 0) {
    throw new Error("Entries are required");
  }
  const periodStartDate = DateTime.fromISO(props.periodStartDate);
  const combinedTimeEventFullDays = [];
  for (const entry of props.entries.schedule_event_full_days_entries) {
    combinedTimeEventFullDays.push({
      time_event: entry.time_event,
      entry
    });
  }
  for (const entry of props.entries.person_occasion_entries) {
    combinedTimeEventFullDays.push({
      time_event: entry.occasion_time_event,
      entry
    });
  }
  for (const entry of props.entries.vacation_entries) {
    combinedTimeEventFullDays.push({
      time_event: entry.time_event,
      entry
    });
  }
  const combinedTimeEventInDay = [];
  for (const entry of props.entries.schedule_event_in_day_entries) {
    combinedTimeEventInDay.push({
      time_event_in_tz: timeEventInDayBlockToTimezone(
        entry.time_event,
        props.timezone
      ),
      entry
    });
  }
  for (const entry of props.entries.big_plan_entries) {
    for (const timeEvent of entry.time_events) {
      combinedTimeEventInDay.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(
          timeEvent,
          props.timezone
        ),
        entry
      });
    }
  }
  for (const entry of props.entries.todo_task_entries) {
    for (const timeEvent of entry.time_events) {
      combinedTimeEventInDay.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(
          timeEvent,
          props.timezone
        ),
        entry
      });
    }
  }
  for (const entry of props.entries.habit_entries) {
    for (const timeEvent of entry.time_events) {
      combinedTimeEventInDay.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(
          timeEvent,
          props.timezone
        ),
        entry
      });
    }
  }
  for (const entry of props.entries.chore_entries) {
    for (const timeEvent of entry.time_events) {
      combinedTimeEventInDay.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(
          timeEvent,
          props.timezone
        ),
        entry
      });
    }
  }
  for (const entry of props.entries.time_plan_activity_entries) {
    for (const timeEvent of entry.time_events) {
      combinedTimeEventInDay.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(
          timeEvent,
          props.timezone
        ),
        entry
      });
    }
  }
  const partitionedCombinedTimeEventFullDays = combinedTimeEventFullDayEntryPartionByDay(combinedTimeEventFullDays);
  const partitionedCombinedTimeEventInDay = combinedTimeEventInDayEntryPartionByDay(combinedTimeEventInDay);
  const maxFullDaysEntriesCnt = Math.max(
    ...Object.values(partitionedCombinedTimeEventFullDays).map(
      (entries) => entries.length
    )
  );
  const allDays = allDaysBetween(props.periodStartDate, props.periodEndDate);
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        position: "relative",
        width: "100%",
        margin: isBigScreen ? "auto" : "initial",
        paddingTop: isBigScreen || maxFullDaysEntriesCnt > 0 ? "0" : "1rem"
      },
      children: [
        /* @__PURE__ */ jsxDEV(ViewAsCalendarDaysAndFullDaysContiner, { children: [
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", flexDirection: "row", gap: "0.1rem" }, children: [
            /* @__PURE__ */ jsxDEV(ViewAsCalendarEmptyCell, { children: [
              /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: periodStartDate.toFormat("MMM") }, void 0, false, {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
                lineNumber: 150,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: periodStartDate.toFormat("yyyy") }, void 0, false, {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
                lineNumber: 153,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
              lineNumber: 149,
              columnNumber: 11
            }, this),
            allDays.map((date, idx) => /* @__PURE__ */ jsxDEV(
              ViewAsCalendarDateHeader,
              {
                today: props.today,
                date
              },
              idx,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
                lineNumber: 158,
                columnNumber: 13
              },
              this
            )),
            /* @__PURE__ */ jsxDEV(ViewAsCalendarEmptyCell, {}, void 0, false, {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
              lineNumber: 164,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
            lineNumber: 148,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", flexDirection: "row", gap: "0.1rem" }, children: [
            maxFullDaysEntriesCnt > MAX_VISIBLE_TIME_EVENT_FULL_DAYS && /* @__PURE__ */ jsxDEV(
              ViewAsCalendarMoreButton,
              {
                showAllTimeEventFullDays,
                setShowAllTimeEventFullDays
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
                lineNumber: 169,
                columnNumber: 13
              },
              this
            ),
            maxFullDaysEntriesCnt <= MAX_VISIBLE_TIME_EVENT_FULL_DAYS && /* @__PURE__ */ jsxDEV(ViewAsCalendarEmptyCell, {}, void 0, false, {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
              lineNumber: 175,
              columnNumber: 13
            }, this),
            allDays.map((date, idx) => /* @__PURE__ */ jsxDEV(
              ViewAsCalendarTimeEventFullDaysColumn,
              {
                today: props.today,
                date,
                showAll: showAllTimeEventFullDays,
                maxFullDaysEntriesCnt,
                timeEventFullDays: partitionedCombinedTimeEventFullDays[date] || [],
                isAdding: props.isAdding
              },
              idx,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
                lineNumber: 179,
                columnNumber: 13
              },
              this
            )),
            /* @__PURE__ */ jsxDEV(ViewAsCalendarEmptyCell, {}, void 0, false, {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
              lineNumber: 192,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
            lineNumber: 167,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
          lineNumber: 147,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(ViewAsCalendarInDayContainer, { children: [
          /* @__PURE__ */ jsxDEV(
            ViewAsCalendarLeftColumn,
            {
              rightNow: props.rightNow,
              showOnlyFromRightNowIfDaily: props.showOnlyFromRightNowIfDaily
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
              lineNumber: 197,
              columnNumber: 9
            },
            this
          ),
          allDays.map((date, idx) => /* @__PURE__ */ jsxDEV(
            ViewAsCalendarTimeEventInDayColumn,
            {
              daysToTheLeft: allDays.length - idx - 1,
              rightNow: props.rightNow,
              today: props.today,
              timezone: props.timezone,
              date,
              timeEventsInDay: partitionedCombinedTimeEventInDay[date] || [],
              isAdding: props.isAdding,
              showOnlyFromRightNowIfDaily: props.showOnlyFromRightNowIfDaily
            },
            idx,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
              lineNumber: 203,
              columnNumber: 11
            },
            this
          )),
          /* @__PURE__ */ jsxDEV(
            ViewAsCalendarRightColumn,
            {
              rightNow: props.rightNow,
              showOnlyFromRightNowIfDaily: props.showOnlyFromRightNowIfDaily
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
              lineNumber: 216,
              columnNumber: 9
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
          lineNumber: 196,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/calendar/component/view-as-calendar-weekly.tsx",
      lineNumber: 139,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx
function ViewAsCalendarMonthly(props) {
  const isBigScreen = useBigScreen();
  if (props.stats === void 0) {
    throw new Error("Stats are required");
  }
  const periodStartDate = DateTime.fromISO(props.periodStartDate);
  const daysInMonth = periodStartDate.daysInMonth;
  if (daysInMonth === void 0) {
    throw new Error("Could not determine days in month");
  }
  const days = Array.from(
    { length: daysInMonth },
    (_, i) => periodStartDate.startOf("month").plus({ days: i })
  );
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h5", children: [
      "Viewing ",
      periodStartDate.toFormat("MMM yyyy")
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
      lineNumber: 27,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      Box_default,
      {
        sx: {
          display: "grid",
          gridTemplateColumns: "3rem 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
          gridTemplateRows: "auto",
          gridGap: "0.25rem"
        },
        children: [
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 1 }, children: "Day" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
            lineNumber: 38,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 2 }, children: "Mon" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
            lineNumber: 39,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 3 }, children: "Tue" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
            lineNumber: 40,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 4 }, children: "Wed" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
            lineNumber: 41,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 5 }, children: "Thu" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
            lineNumber: 42,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 6 }, children: "Fri" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
            lineNumber: 43,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 7 }, children: "Sat" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
            lineNumber: 44,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 8 }, children: "Sun" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
            lineNumber: 45,
            columnNumber: 9
          }, this),
          days.map((day, idx) => {
            const weekDay = day.weekday;
            const weekNumber = day.weekNumber;
            const monthStartWeekNumber = periodStartDate.startOf("month").weekNumber;
            const weekOffset = weekNumber - monthStartWeekNumber;
            return /* @__PURE__ */ jsxDEV(
              Box_default,
              {
                sx: {
                  gridRowStart: weekOffset + 2,
                  gridColumnStart: weekDay === 7 ? 8 : weekDay + 1
                },
                children: /* @__PURE__ */ jsxDEV(
                  ViewAsCalendarStatsCell,
                  {
                    label: day.toFormat("d"),
                    forceColumn: isBigScreen,
                    showCompact: !isBigScreen,
                    stats: props.stats.per_subperiod.find(
                      (s) => s.period_start_date === day.toISODate()
                    ),
                    calendarLocation: props.calendarLocation
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
                    lineNumber: 62,
                    columnNumber: 15
                  },
                  this
                )
              },
              idx,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
                lineNumber: 55,
                columnNumber: 13
              },
              this
            );
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
        lineNumber: 30,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/calendar/component/view-as-calendar-monthly.tsx",
    lineNumber: 26,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function monthToQuarter(month) {
  if (month <= 3)
    return "Q1";
  if (month <= 6)
    return "Q2";
  if (month <= 9)
    return "Q3";
  return "Q4";
}
function ViewAsCalendarQuarterly(props) {
  if (props.stats === void 0) {
    throw new Error("Stats are required");
  }
  const periodStartDate = DateTime.fromISO(props.periodStartDate);
  const months = Array.from(
    { length: 3 },
    (_, i) => periodStartDate.startOf("quarter").plus({ months: i })
  );
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h5", children: [
      "Viewing ",
      monthToQuarter(periodStartDate.month),
      " ",
      periodStartDate.year
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
      lineNumber: 30,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      Box_default,
      {
        sx: {
          display: "grid",
          gridTemplateColumns: "3rem [w1] 1fr [w2] 1fr [w3] 1fr [w4] 1fr [w5] 1fr [w6] 1fr",
          gridTemplateRows: "auto",
          gridGap: "0.25rem"
        },
        children: [
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 1 }, children: "Month" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
            lineNumber: 42,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: "w1" }, children: "W1" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
            lineNumber: 43,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: "w2" }, children: "W2" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
            lineNumber: 44,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: "w3" }, children: "W3" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
            lineNumber: 45,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: "w4" }, children: "W4" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
            lineNumber: 46,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: "w5" }, children: "W5" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
            lineNumber: 47,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: "w6" }, children: "W6" }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
            lineNumber: 48,
            columnNumber: 9
          }, this),
          months.map((month, idx) => {
            const monthShort = month.toFormat("MMM");
            const monthDate = month.toISODate();
            if (monthDate === null) {
              throw new Error("Could not format month date");
            }
            return /* @__PURE__ */ jsxDEV(
              Box_default,
              {
                sx: {
                  gridRowStart: month.month - periodStartDate.month + 2,
                  gridColumnStart: 1
                },
                children: /* @__PURE__ */ jsxDEV(
                  ViewAsCalendarGoToCell,
                  {
                    label: monthShort,
                    period: import_webapi_client.RecurringTaskPeriod.MONTHLY,
                    periodStart: monthDate,
                    calendarLocation: props.calendarLocation
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
                    lineNumber: 65,
                    columnNumber: 15
                  },
                  this
                )
              },
              idx,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
                lineNumber: 58,
                columnNumber: 13
              },
              this
            );
          }),
          props.stats.per_subperiod.map((stats, idx) => {
            const startDate = DateTime.fromISO(stats.period_start_date);
            const monthStartDate = startDate.startOf("month");
            if (periodStartDate.month === 10 && startDate.weekNumber < periodStartDate.weekNumber) {
              return null;
            }
            let gridColumnStart = startDate.weekNumber - monthStartDate.weekNumber + 1;
            if (monthStartDate.month === 1) {
              gridColumnStart = idx + 1;
            }
            return /* @__PURE__ */ jsxDEV(
              Box_default,
              {
                sx: {
                  gridRowStart: monthStartDate.month - periodStartDate.month + 2,
                  gridColumnStart: `w${gridColumnStart}`
                },
                children: /* @__PURE__ */ jsxDEV(
                  ViewAsCalendarStatsCell,
                  {
                    label: `Week ${startDate.weekNumber}`,
                    forceColumn: false,
                    showCompact: true,
                    stats,
                    calendarLocation: props.calendarLocation
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
                    lineNumber: 104,
                    columnNumber: 15
                  },
                  this
                )
              },
              idx,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
                lineNumber: 97,
                columnNumber: 13
              },
              this
            );
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
        lineNumber: 33,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/calendar/component/view-as-calendar-quarterly.tsx",
    lineNumber: 29,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
function ViewAsCalendarYearly(props) {
  const isBigScreen = useBigScreen();
  if (props.stats === void 0) {
    throw new Error("Stats are required");
  }
  const periodStartDate = DateTime.fromISO(props.periodStartDate);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h5", children: [
      "Viewing ",
      periodStartDate.year
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
      lineNumber: 23,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      Box_default,
      {
        sx: {
          display: "grid",
          gridTemplateColumns: "3rem 1fr 1fr 1fr",
          gridTemplateRows: "min-content min-content min-content min-content",
          gridGap: "0.25rem"
        },
        children: [
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 1 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarGoToCell,
            {
              label: "Q1",
              period: import_webapi_client2.RecurringTaskPeriod.QUARTERLY,
              periodStart: `${periodStartDate.year}-01-01`,
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 33,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 32,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 2 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "Jan",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-01-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 42,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 41,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 3 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "Feb",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-02-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 56,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 55,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 1, gridColumnStart: 4 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "Mar",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-03-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 70,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 69,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 2, gridColumnStart: 1 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarGoToCell,
            {
              label: "Q2",
              period: import_webapi_client2.RecurringTaskPeriod.QUARTERLY,
              periodStart: `${periodStartDate.year}-04-01`,
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 84,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 83,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 2, gridColumnStart: 2 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "Apr",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-04-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 93,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 92,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 2, gridColumnStart: 3 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "May",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-05-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 107,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 106,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 2, gridColumnStart: 4 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "Jun",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-06-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 121,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 120,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 3, gridColumnStart: 1 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarGoToCell,
            {
              label: "Q3",
              period: import_webapi_client2.RecurringTaskPeriod.QUARTERLY,
              periodStart: `${periodStartDate.year}-07-01`,
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 135,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 134,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 3, gridColumnStart: 2 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "Jul",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-07-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 144,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 143,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 3, gridColumnStart: 3 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "Aug",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-08-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 158,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 157,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 3, gridColumnStart: 4 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "Sep",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-09-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 172,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 171,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 4, gridColumnStart: 1 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarGoToCell,
            {
              label: "Q4",
              period: import_webapi_client2.RecurringTaskPeriod.QUARTERLY,
              periodStart: `${periodStartDate.year}-10-01`,
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 186,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 185,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 4, gridColumnStart: 2 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "Oct",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-10-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 195,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 194,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 4, gridColumnStart: 3 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "Nov",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-11-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 209,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 208,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { gridRowStart: 4, gridColumnStart: 4 }, children: /* @__PURE__ */ jsxDEV(
            ViewAsCalendarStatsCell,
            {
              label: "Dec",
              forceColumn: isBigScreen,
              showCompact: !isBigScreen,
              stats: props.stats.per_subperiod.find(
                (s) => s.period_start_date === `${periodStartDate.year}-12-01`
              ),
              calendarLocation: props.calendarLocation
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
              lineNumber: 223,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
            lineNumber: 222,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
        lineNumber: 24,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/calendar/component/view-as-calendar-yearly.tsx",
    lineNumber: 22,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx
var import_webapi_client3 = __toESM(require_dist(), 1);
function monthToQuarter2(month) {
  if (month <= 3)
    return "Q1";
  if (month <= 6)
    return "Q2";
  if (month <= 9)
    return "Q3";
  return "Q4";
}
function ViewAsScheduleMonthlyQuarterlyAndYearly(props) {
  const isBigScreen = useBigScreen();
  if (props.stats === void 0) {
    throw new Error("Stats are required");
  }
  const periodStartDate = DateTime.fromISO(props.periodStartDate);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    props.period === import_webapi_client3.RecurringTaskPeriod.MONTHLY && /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h5", children: [
      "Viewing ",
      periodStartDate.monthLong,
      " ",
      periodStartDate.year
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx",
      lineNumber: 39,
      columnNumber: 9
    }, this),
    props.period === import_webapi_client3.RecurringTaskPeriod.QUARTERLY && /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h5", children: [
      "Viewing ",
      monthToQuarter2(periodStartDate.month),
      " ",
      periodStartDate.year
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx",
      lineNumber: 44,
      columnNumber: 9
    }, this),
    props.period === import_webapi_client3.RecurringTaskPeriod.YEARLY && /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h5", children: [
      "Viewing ",
      periodStartDate.year
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx",
      lineNumber: 49,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(TableContainer_default, { children: /* @__PURE__ */ jsxDEV(Table_default, { children: /* @__PURE__ */ jsxDEV(TableBody_default, { children: props.stats.per_subperiod.map((stats, index) => {
      return /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
        /* @__PURE__ */ jsxDEV(
          TableCell_default,
          {
            sx: {
              padding: "0.25rem",
              width: isBigScreen ? "15%" : "25%"
            },
            children: DateTime.fromISO(stats.period_start_date).toFormat(
              props.period === import_webapi_client3.RecurringTaskPeriod.YEARLY ? "MMM" : "MMM-dd"
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx",
            lineNumber: 57,
            columnNumber: 19
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(ViewAsScheduleContentCell, { children: /* @__PURE__ */ jsxDEV(
          ViewAsStatsPerSubperiod,
          {
            forceColumn: false,
            showCompact: !isBigScreen,
            view: "schedule" /* SCHEDULE */,
            stats,
            calendarLocation: props.calendarLocation
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx",
            lineNumber: 71,
            columnNumber: 21
          },
          this
        ) }, void 0, false, {
          fileName: "../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx",
          lineNumber: 70,
          columnNumber: 19
        }, this)
      ] }, index, true, {
        fileName: "../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx",
        lineNumber: 56,
        columnNumber: 17
      }, this);
    }) }, void 0, false, {
      fileName: "../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx",
      lineNumber: 53,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx",
      lineNumber: 52,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx",
      lineNumber: 51,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly.tsx",
    lineNumber: 37,
    columnNumber: 5
  }, this);
}

// app/routes/app/workspace/calendar.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/calendar.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/calendar.tsx"
  );
  import.meta.hot.lastModified = "1777639374784.3396";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var QuerySchema = external_exports.object({
  date: external_exports.string().regex(/[0-9][0-9][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/).optional(),
  period: external_exports.nativeEnum(import_webapi_client4.RecurringTaskPeriod).optional(),
  view: external_exports.nativeEnum(View).optional()
});
var shouldRevalidate = standardShouldRevalidate;
var REFRESH_RIGHT_NOW_MS = 1e3 * 60 * 5;
function CalendarView() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const navigation = useNavigation();
  const location = useLocation();
  const [query] = useSearchParams();
  const calendarLocation = location.pathname.replace(/\/app\/workspace\/calendar/, "");
  const isAdding = location.pathname.endsWith("/new");
  const topLevelInfo = (0, import_react3.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const [rightNow, setRightNow] = (0, import_react3.useState)(DateTime.local({
    zone: topLevelInfo.user.timezone
  }));
  const theRealToday = rightNow.toISODate();
  (0, import_react3.useEffect)(() => {
    const timeout = setInterval(() => {
      setRightNow(DateTime.local({
        zone: topLevelInfo.user.timezone
      }));
    }, REFRESH_RIGHT_NOW_MS);
    return () => {
      clearInterval(timeout);
    };
  }, [topLevelInfo.user.timezone]);
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: `/app/workspace/calendar/schedule/event-in-day/new?${query}`, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "calendar", topLevelInfo, inputsEnabled, actions: [NavMultipleCompact({
    navs: [NavSingle({
      text: "New Event In Day",
      link: `/app/workspace/calendar/schedule/event-in-day/new?${query}`
    }), NavSingle({
      text: "New Event Full Days",
      link: `/app/workspace/calendar/schedule/event-full-days/new?${query}`
    }), NavSingle({
      text: "New Calendar Stream",
      link: `/app/workspace/calendar/schedule/stream/new?${query}`
    }), NavSingle({
      text: "New External Calendar Stream",
      link: `/app/workspace/calendar/schedule/stream/new-external?${query}`
    }), NavSingle({
      text: "View Calendar Streams",
      link: `/app/workspace/calendar/schedule/stream?${query}`
    }), NavSingle({
      text: "New Calendar Export",
      link: `/app/workspace/calendar/schedule/export/new?${query}`
    }), NavSingle({
      text: "View Calendar Exports",
      link: `/app/workspace/calendar/schedule/export?${query}`
    })]
  }), NavMultipleSpread({
    navs: [NavSingle({
      text: "Today",
      link: `/app/workspace/calendar${calendarLocation}?${newURLParams(query, "date", theRealToday)}`
    }), NavSingle({
      text: "Prev",
      icon: /* @__PURE__ */ jsxDEV(ArrowBack_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/calendar.tsx",
        lineNumber: 153,
        columnNumber: 13
      }, this),
      link: `/app/workspace/calendar${calendarLocation}?${newURLParams(query, "date", loaderData.prevPeriodStartDate)}`
    }), NavSingle({
      text: "Next",
      icon: /* @__PURE__ */ jsxDEV(ArrowForward_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/calendar.tsx",
        lineNumber: 157,
        columnNumber: 13
      }, this),
      link: `/app/workspace/calendar${calendarLocation}?${newURLParams(query, "date", loaderData.nextPeriodStartDate)}`
    })]
  }), NavMultipleCompact({
    navs: [NavSingle({
      text: periodName(import_webapi_client4.RecurringTaskPeriod.DAILY),
      highlight: loaderData.period === import_webapi_client4.RecurringTaskPeriod.DAILY,
      link: `/app/workspace/calendar${calendarLocation}?${newURLParams(query, "period", import_webapi_client4.RecurringTaskPeriod.DAILY)}`
    }), NavSingle({
      text: periodName(import_webapi_client4.RecurringTaskPeriod.WEEKLY),
      highlight: loaderData.period === import_webapi_client4.RecurringTaskPeriod.WEEKLY,
      link: `/app/workspace/calendar${calendarLocation}?${newURLParams(query, "period", import_webapi_client4.RecurringTaskPeriod.WEEKLY)}`
    }), NavSingle({
      text: periodName(import_webapi_client4.RecurringTaskPeriod.MONTHLY),
      highlight: loaderData.period === import_webapi_client4.RecurringTaskPeriod.MONTHLY,
      link: `/app/workspace/calendar${calendarLocation}?${newURLParams(query, "period", import_webapi_client4.RecurringTaskPeriod.MONTHLY)}`
    }), NavSingle({
      text: periodName(import_webapi_client4.RecurringTaskPeriod.QUARTERLY),
      highlight: loaderData.period === import_webapi_client4.RecurringTaskPeriod.QUARTERLY,
      link: `/app/workspace/calendar${calendarLocation}?${newURLParams(query, "period", import_webapi_client4.RecurringTaskPeriod.QUARTERLY)}`
    }), NavSingle({
      text: periodName(import_webapi_client4.RecurringTaskPeriod.YEARLY),
      highlight: loaderData.period === import_webapi_client4.RecurringTaskPeriod.YEARLY,
      link: `/app/workspace/calendar${calendarLocation}?${newURLParams(query, "period", import_webapi_client4.RecurringTaskPeriod.YEARLY)}`
    })]
  }), NavMultipleCompact({
    navs: [NavSingle({
      text: "Calendar",
      link: `/app/workspace/calendar${calendarLocation}?${newURLParams(query, "view", "calendar" /* CALENDAR */)}`,
      highlight: loaderData.view === "calendar" /* CALENDAR */
    }), NavSingle({
      text: "Schedule",
      link: `/app/workspace/calendar${calendarLocation}?${newURLParams(query, "view", "schedule" /* SCHEDULE */)}`,
      highlight: loaderData.view === "schedule" /* SCHEDULE */
    })]
  }), NavSingle({
    text: "Settings",
    link: `/app/workspace/calendar/settings`,
    icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/calendar.tsx",
      lineNumber: 195,
      columnNumber: 11
    }, this)
  })] }, void 0, false, {
    fileName: "app/routes/app/workspace/calendar.tsx",
    lineNumber: 124,
    columnNumber: 124
  }, this), returnLocation: "/app/workspace", children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { branchForceHide: shouldShowABranch, shouldHide: shouldShowABranch || shouldShowALeafToo, children: [
      loaderData.view === "calendar" /* CALENDAR */ && loaderData.period === import_webapi_client4.RecurringTaskPeriod.DAILY && /* @__PURE__ */ jsxDEV(ViewAsCalendarDaily, { rightNow, timezone: topLevelInfo.user.timezone, today: theRealToday, period: loaderData.period, periodStartDate: loaderData.periodStartDate, periodEndDate: loaderData.periodEndDate, entries: loaderData.entries, stats: loaderData.stats, calendarLocation, isAdding }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar.tsx",
        lineNumber: 198,
        columnNumber: 98
      }, this),
      loaderData.view === "calendar" /* CALENDAR */ && loaderData.period === import_webapi_client4.RecurringTaskPeriod.WEEKLY && /* @__PURE__ */ jsxDEV(ViewAsCalendarWeekly, { timezone: topLevelInfo.user.timezone, rightNow, today: theRealToday, period: loaderData.period, periodStartDate: loaderData.periodStartDate, periodEndDate: loaderData.periodEndDate, entries: loaderData.entries, stats: loaderData.stats, calendarLocation, isAdding }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar.tsx",
        lineNumber: 200,
        columnNumber: 99
      }, this),
      loaderData.view === "calendar" /* CALENDAR */ && loaderData.period === import_webapi_client4.RecurringTaskPeriod.MONTHLY && /* @__PURE__ */ jsxDEV(ViewAsCalendarMonthly, { timezone: topLevelInfo.user.timezone, rightNow, today: theRealToday, period: loaderData.period, periodStartDate: loaderData.periodStartDate, periodEndDate: loaderData.periodEndDate, entries: loaderData.entries, stats: loaderData.stats, calendarLocation, isAdding }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar.tsx",
        lineNumber: 202,
        columnNumber: 100
      }, this),
      loaderData.view === "calendar" /* CALENDAR */ && loaderData.period === import_webapi_client4.RecurringTaskPeriod.QUARTERLY && /* @__PURE__ */ jsxDEV(ViewAsCalendarQuarterly, { timezone: topLevelInfo.user.timezone, rightNow, today: theRealToday, period: loaderData.period, periodStartDate: loaderData.periodStartDate, periodEndDate: loaderData.periodEndDate, entries: loaderData.entries, stats: loaderData.stats, calendarLocation, isAdding }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar.tsx",
        lineNumber: 204,
        columnNumber: 102
      }, this),
      loaderData.view === "calendar" /* CALENDAR */ && loaderData.period === import_webapi_client4.RecurringTaskPeriod.YEARLY && /* @__PURE__ */ jsxDEV(ViewAsCalendarYearly, { timezone: topLevelInfo.user.timezone, rightNow, today: theRealToday, period: loaderData.period, periodStartDate: loaderData.periodStartDate, periodEndDate: loaderData.periodEndDate, entries: loaderData.entries, stats: loaderData.stats, calendarLocation, isAdding }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar.tsx",
        lineNumber: 206,
        columnNumber: 99
      }, this),
      loaderData.view === "schedule" /* SCHEDULE */ && (loaderData.period === import_webapi_client4.RecurringTaskPeriod.DAILY || loaderData.period === import_webapi_client4.RecurringTaskPeriod.WEEKLY) && /* @__PURE__ */ jsxDEV(ViewAsScheduleDailyAndWeekly, { timezone: topLevelInfo.user.timezone, rightNow, today: theRealToday, period: loaderData.period, periodStartDate: loaderData.periodStartDate, periodEndDate: loaderData.periodEndDate, entries: loaderData.entries, stats: loaderData.stats, calendarLocation, isAdding }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar.tsx",
        lineNumber: 208,
        columnNumber: 152
      }, this),
      loaderData.view === "schedule" /* SCHEDULE */ && (loaderData.period === import_webapi_client4.RecurringTaskPeriod.MONTHLY || loaderData.period === import_webapi_client4.RecurringTaskPeriod.QUARTERLY || loaderData.period === import_webapi_client4.RecurringTaskPeriod.YEARLY) && /* @__PURE__ */ jsxDEV(ViewAsScheduleMonthlyQuarterlyAndYearly, { timezone: topLevelInfo.user.timezone, rightNow, today: theRealToday, period: loaderData.period, periodStartDate: loaderData.periodStartDate, periodEndDate: loaderData.periodEndDate, entries: loaderData.entries, stats: loaderData.stats, calendarLocation, isAdding }, void 0, false, {
        fileName: "app/routes/app/workspace/calendar.tsx",
        lineNumber: 210,
        columnNumber: 209
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/calendar.tsx",
      lineNumber: 197,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/calendar.tsx",
      lineNumber: 214,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/calendar.tsx",
      lineNumber: 213,
      columnNumber: 7
    }, this)
  ] }, "calendar", true, {
    fileName: "app/routes/app/workspace/calendar.tsx",
    lineNumber: 124,
    columnNumber: 10
  }, this);
}
_s(CalendarView, "tRR5BVqSSSvsy/WM+2GJVGPmmsI=", false, function() {
  return [useLoaderDataSafeForAnimation, useNavigation, useLocation, useSearchParams, useTrunkNeedsToShowBranch, useTrunkNeedsToShowLeaf];
});
_c = CalendarView;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the calendar events! Please try again!`
});
var _c;
$RefreshReg$(_c, "CalendarView");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  CalendarView as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/calendar-ARLPZ44I.js.map
