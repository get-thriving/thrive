import {
  scheduleStreamColorContrastingHex,
  scheduleStreamColorHex
} from "/build/_shared/chunk-7YZ2X2X4.js";
import {
  BIG_PLAN_TIME_EVENT_COLOR,
  BIRTHDAY_TIME_EVENT_COLOR,
  CHORE_TIME_EVENT_COLOR,
  HABIT_TIME_EVENT_COLOR,
  TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR,
  TODO_TASK_TIME_EVENT_COLOR,
  VACATION_TIME_EVENT_COLOR,
  buildTimeBlockOffsetsMap,
  calculateEndTimeForTimeEvent,
  calculateStartTimeForTimeEvent,
  calculateStartTimeFromBlockParams,
  calendarPxHeightToMinutes,
  calendarTimeEventInDayDurationToRems,
  calendarTimeEventInDayStartMinutesToRems,
  clipTimeEventFullDaysNameToWhatFits,
  clipTimeEventInDayNameToWhatFits,
  combinedTimeEventFullDayEntryPartionByDay,
  combinedTimeEventInDayEntryPartionByDay,
  occasionTimeEventName,
  scheduleTimeEventInDayDurationToRems,
  timeEventInDayBlockOwnerTheType,
  timeEventInDayBlockToTimezone
} from "/build/_shared/chunk-24RA7B23.js";
import {
  parseEntityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  allDaysBetween
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  DateTime
} from "/build/_shared/chunk-LT7567PB.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default,
  Button_default,
  Paper_default,
  TableBody_default,
  TableCell_default,
  TableContainer_default,
  TableRow_default,
  Table_default,
  Typography_default,
  styled_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  useLocation,
  useNavigate,
  useSearchParams
} from "/build/_shared/chunk-VVGD4GL7.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/calendar/component/shared.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react2 = __toESM(require_react(), 1);

// ../core/jupiter/core/common/sub/time_events/component/params-new-placeholder.tsx
function TimeEventParamsNewPlaceholder(props) {
  const [query] = useSearchParams();
  const sourceStartDate = query.get("sourceStartDate");
  const sourceStartTimeInDay = query.get("sourceStartTimeInDay");
  const sourceDurationMins = query.get("sourceDurationMins");
  if (!sourceStartDate || !sourceStartTimeInDay || !sourceDurationMins) {
    return null;
  }
  const sourceDurationMinsInt = parseInt(sourceDurationMins, 10);
  if (props.date !== sourceStartDate) {
    return null;
  }
  const startTime = calculateStartTimeFromBlockParams({
    startDate: sourceStartDate,
    startTimeInDay: sourceStartTimeInDay
  });
  const minutesSinceStartOfDay = startTime.diff(startTime.startOf("day")).as("minutes");
  const endTime = startTime.plus({ minutes: sourceDurationMinsInt });
  const endOfDay = startTime.endOf("day");
  const overflowMinutes = endTime.diff(endOfDay, "minutes").minutes;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Box_default,
      {
        sx: {
          position: "absolute",
          top: calendarTimeEventInDayStartMinutesToRems(
            minutesSinceStartOfDay,
            props.deltaHour
          ),
          height: calendarTimeEventInDayDurationToRems(
            minutesSinceStartOfDay,
            overflowMinutes > 0 ? sourceDurationMinsInt - overflowMinutes : sourceDurationMinsInt
          ),
          backgroundColor: "gray",
          opacity: 0.5,
          borderRadius: "0.25rem",
          border: "1px solid black",
          minWidth: "calc(7rem - 0.5rem)",
          width: "calc(100% - 0.5rem)",
          zIndex: 10
        }
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/sub/time_events/component/params-new-placeholder.tsx",
        lineNumber: 50,
        columnNumber: 7
      },
      this
    ),
    overflowMinutes > 0 && props.daysToTheLeft > 0 && /* @__PURE__ */ jsxDEV(
      Box_default,
      {
        sx: {
          position: "absolute",
          top: 0,
          left: "100%",
          height: calendarTimeEventInDayDurationToRems(0, overflowMinutes),
          backgroundColor: "gray",
          opacity: 0.5,
          borderRadius: "0.25rem",
          border: "1px solid black",
          minWidth: "calc(7rem - 0.5rem)",
          width: "calc(100% - 0.5rem)",
          zIndex: 10
        }
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/sub/time_events/component/params-new-placeholder.tsx",
        lineNumber: 73,
        columnNumber: 9
      },
      this
    ),
    overflowMinutes > 24 * 60 && props.daysToTheLeft > 1 && /* @__PURE__ */ jsxDEV(
      Box_default,
      {
        sx: {
          position: "absolute",
          top: 0,
          left: "200%",
          height: calendarTimeEventInDayDurationToRems(
            0,
            overflowMinutes - 24 * 60
          ),
          backgroundColor: "gray",
          opacity: 0.5,
          borderRadius: "0.25rem",
          border: "1px solid black",
          minWidth: "calc(7rem - 0.5rem)",
          width: "calc(100% - 0.5rem)",
          zIndex: 10
        }
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/sub/time_events/component/params-new-placeholder.tsx",
        lineNumber: 90,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/sub/time_events/component/params-new-placeholder.tsx",
    lineNumber: 49,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/calendar/component/shared.tsx
var MAX_VISIBLE_TIME_EVENT_FULL_DAYS = 3;
var View = /* @__PURE__ */ ((View2) => {
  View2["CALENDAR"] = "calendar";
  View2["SCHEDULE"] = "schedule";
  return View2;
})(View || {});
function titleWithTags(title, tags) {
  if (!tags || tags.length === 0) {
    return title;
  }
  const tagsPart = tags.map((t) => `#${t.name}`).join(" ");
  return `${title} ${tagsPart}`;
}
function ViewAsCalendarDaysAndFullDaysContiner(props) {
  const theme = useTheme();
  const isBigScreen = useBigScreen();
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        minWidth: isBigScreen ? void 0 : "fit-content",
        top: isBigScreen ? "-0.5rem" : "0px",
        backgroundColor: theme.palette.background.paper,
        zIndex: theme.zIndex.appBar + 1,
        borderBottom: "1px solid darkgray"
      },
      children: props.children
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
      lineNumber: 114,
      columnNumber: 5
    },
    this
  );
}
function ViewAsCalendarEmptyCell(props) {
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: { minWidth: "3.5rem", dispaly: "flex", flexDirection: "column" }, children: props.children }, void 0, false, {
    fileName: "../core/jupiter/core/calendar/component/shared.tsx",
    lineNumber: 133,
    columnNumber: 5
  }, this);
}
function ViewAsCalendarDateHeader(props) {
  const theme = useTheme();
  const theDate = DateTime.fromISO(`${props.date}T00:00:00`);
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        minWidth: "7rem",
        flexGrow: "1",
        textAlign: "center"
      },
      children: /* @__PURE__ */ jsxDEV(
        Box_default,
        {
          sx: {
            borderRadius: "50%",
            width: "50%",
            margin: "auto",
            backgroundColor: props.date === props.today ? theme.palette.info.light : "transparent"
          },
          children: [
            /* @__PURE__ */ jsxDEV(Typography_default, { sx: { fontSize: "1.1em" }, children: theDate.toFormat("ccc") }, void 0, false, {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 166,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: theDate.toFormat("dd") }, void 0, false, {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 169,
              columnNumber: 9
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 155,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
      lineNumber: 148,
      columnNumber: 5
    },
    this
  );
}
function ViewAsCalendarLeftColumn(props) {
  const theme = useTheme();
  const deltaHour = props.showOnlyFromRightNowIfDaily ? props.rightNow.hour : 0;
  const heightInRem = 96 - deltaHour * 4;
  const hours = Array.from(
    { length: 24 },
    (_, i) => DateTime.utc(1987, 9, 18, i, 0, 0)
  );
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        width: "3.5rem",
        height: `${heightInRem}rem`,
        position: "sticky",
        left: "0px",
        top: "0px",
        backgroundColor: theme.palette.background.paper,
        zIndex: theme.zIndex.appBar + 1,
        borderRight: "1px solid darkgray"
      },
      children: hours.map((hour, idx) => {
        if (props.showOnlyFromRightNowIfDaily && hour.hour < props.rightNow.hour) {
          return null;
        }
        return /* @__PURE__ */ jsxDEV(
          Box_default,
          {
            sx: {
              height: "4rem",
              width: "3.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "top"
            },
            children: hour.toFormat("HH:mm")
          },
          idx,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 210,
            columnNumber: 11
          },
          this
        );
      })
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
      lineNumber: 189,
      columnNumber: 5
    },
    this
  );
}
function ViewAsCalendarRightColumn(props) {
  const deltaHour = props.showOnlyFromRightNowIfDaily ? props.rightNow.hour : 0;
  const heightInRem = 96 - deltaHour * 4;
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        width: "3.5rem",
        height: `${heightInRem}rem`
      }
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
      lineNumber: 239,
      columnNumber: 5
    },
    this
  );
}
function ViewAsCalendarMoreButton(props) {
  return /* @__PURE__ */ jsxDEV(
    Button_default,
    {
      variant: "outlined",
      sx: {
        width: "3.5rem",
        minWidth: "3.5rem",
        height: "3.5rem",
        alignSelf: "end"
      },
      onClick: () => props.setShowAllTimeEventFullDays((c) => !c),
      children: props.showAllTimeEventFullDays ? "Show Less" : "Show More"
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
      lineNumber: 255,
      columnNumber: 5
    },
    this
  );
}
function ViewAsCalendarTimeEventFullDaysColumn(props) {
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: { flex: 1 }, children: props.timeEventFullDays.map((entry, index) => {
    if (index >= MAX_VISIBLE_TIME_EVENT_FULL_DAYS && !props.showAll) {
      return null;
    }
    return /* @__PURE__ */ jsxDEV(
      ViewAsCalendarTimeEventFullDaysCell,
      {
        entry,
        isAdding: props.isAdding
      },
      index,
      false,
      {
        fileName: "../core/jupiter/core/calendar/component/shared.tsx",
        lineNumber: 290,
        columnNumber: 11
      },
      this
    );
  }) }, void 0, false, {
    fileName: "../core/jupiter/core/calendar/component/shared.tsx",
    lineNumber: 283,
    columnNumber: 5
  }, this);
}
function ViewAsCalendarTimeEventFullDaysCell(props) {
  const [query] = useSearchParams();
  const containerRef = (0, import_react2.useRef)(null);
  const [containerWidth, setContainerWidth] = (0, import_react2.useState)(120);
  (0, import_react2.useEffect)(() => {
    setContainerWidth(containerRef.current?.clientWidth || 120);
  }, [containerRef]);
  const { theType } = parseEntityLinkStd(props.entry.time_event.owner);
  switch (theType) {
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS: {
      const fullDaysEntry = props.entry.entry;
      const clippedName = clipTimeEventFullDaysNameToWhatFits(
        titleWithTags(fullDaysEntry.event.name, fullDaysEntry.tags),
        12,
        containerWidth - 32
        // A hack of sorts
      );
      return /* @__PURE__ */ jsxDEV(
        Box_default,
        {
          ref: containerRef,
          id: `schedule-event-full-days-${fullDaysEntry.event.ref_id}`,
          sx: {
            minWidth: "7rem",
            fontSize: "10px",
            backgroundColor: scheduleStreamColorHex(fullDaysEntry.stream.color),
            borderRadius: "0.25rem",
            padding: "0.25rem",
            paddingLeft: "0.5rem",
            width: "100%",
            height: "2rem",
            marginBottom: "0.25rem",
            overflow: "hidden"
          },
          children: /* @__PURE__ */ jsxDEV(
            EntityLink,
            {
              to: `/app/workspace/calendar/schedule/event-full-days/${fullDaysEntry.event.ref_id}?${query}`,
              inline: true,
              block: props.isAdding,
              children: /* @__PURE__ */ jsxDEV(
                EntityNameComponent,
                {
                  name: clippedName,
                  color: scheduleStreamColorContrastingHex(
                    fullDaysEntry.stream.color
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                  lineNumber: 351,
                  columnNumber: 13
                },
                this
              )
            },
            `schedule-event-full-days-${fullDaysEntry.event.ref_id}`,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 345,
              columnNumber: 11
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 329,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.OCCASION: {
      const fullDaysEntry = props.entry.entry;
      const clippedName = clipTimeEventFullDaysNameToWhatFits(
        `\u{1F468} ${occasionTimeEventName(
          props.entry.time_event,
          fullDaysEntry.contact,
          fullDaysEntry.occasion
        )}`,
        12,
        containerWidth - 32
        // A hack of sorts
      );
      return /* @__PURE__ */ jsxDEV(
        Box_default,
        {
          ref: containerRef,
          id: `birthday-event-${fullDaysEntry.contact.ref_id}`,
          sx: {
            minWidth: "7rem",
            fontSize: "10px",
            backgroundColor: scheduleStreamColorHex(BIRTHDAY_TIME_EVENT_COLOR),
            borderRadius: "0.25rem",
            padding: "0.25rem",
            paddingLeft: "0.5rem",
            width: "100%",
            height: "2rem",
            marginBottom: "0.25rem",
            overflow: "hidden"
          },
          children: /* @__PURE__ */ jsxDEV(
            EntityLink,
            {
              to: `/app/workspace/calendar/time-event/full-days-block/${fullDaysEntry.occasion_time_event.ref_id}?${query}`,
              inline: true,
              block: props.isAdding,
              children: /* @__PURE__ */ jsxDEV(
                EntityNameComponent,
                {
                  name: clippedName,
                  color: scheduleStreamColorContrastingHex(
                    BIRTHDAY_TIME_EVENT_COLOR
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                  lineNumber: 398,
                  columnNumber: 13
                },
                this
              )
            },
            `birthday-event-${fullDaysEntry.contact.ref_id}`,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 392,
              columnNumber: 11
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 376,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.VACATION: {
      const fullDaysEntry = props.entry.entry;
      const clippedName = clipTimeEventFullDaysNameToWhatFits(
        `\u{1F334} ${fullDaysEntry.vacation.name}`,
        12,
        containerWidth - 32
        // A hack of sorts
      );
      return /* @__PURE__ */ jsxDEV(
        Box_default,
        {
          ref: containerRef,
          id: `vacation-event-${fullDaysEntry.time_event.ref_id}`,
          sx: {
            minWidth: "7rem",
            fontSize: "10px",
            backgroundColor: scheduleStreamColorHex(VACATION_TIME_EVENT_COLOR),
            borderRadius: "0.25rem",
            padding: "0.25rem",
            paddingLeft: "0.5rem",
            width: "100%",
            height: "2rem",
            marginBottom: "0.25rem",
            overflow: "hidden"
          },
          children: /* @__PURE__ */ jsxDEV(
            EntityLink,
            {
              to: `/app/workspace/calendar/time-event/full-days-block/${fullDaysEntry.time_event.ref_id}?${query}`,
              inline: true,
              block: props.isAdding,
              children: /* @__PURE__ */ jsxDEV(
                EntityNameComponent,
                {
                  name: clippedName,
                  color: scheduleStreamColorContrastingHex(
                    VACATION_TIME_EVENT_COLOR
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                  lineNumber: 441,
                  columnNumber: 13
                },
                this
              )
            },
            `vacation-event-${fullDaysEntry.time_event.ref_id}`,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 435,
              columnNumber: 11
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 419,
          columnNumber: 9
        },
        this
      );
    }
    default:
      throw new Error(`Unknown full-days time event owner type: ${theType}`);
  }
}
function ViewAsCalendarTimeEventInDayColumn(props) {
  const theme = useTheme();
  const location = useLocation();
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const wholeColumnRef = (0, import_react2.useRef)(null);
  const deltaHour = props.showOnlyFromRightNowIfDaily ? props.rightNow.hour : 0;
  const heightInRem = 96 - deltaHour * 4;
  const startOfDay = DateTime.fromISO(`${props.date}T00:00:00`, {
    zone: "UTC"
  });
  const hours = Array.from(
    { length: 24 },
    (_, i) => startOfDay.plus({ hours: i })
  );
  const timeBlockOffsetsMap = buildTimeBlockOffsetsMap(
    props.timeEventsInDay,
    startOfDay
  );
  const theMinutes = props.rightNow.diff(DateTime.fromISO(`${props.today}T00:00`, { zone: props.timezone })).as("minutes");
  function createNewFromDoubleClick(event) {
    if (wholeColumnRef.current === null) {
      return;
    }
    const columnRect = wholeColumnRef.current.getBoundingClientRect();
    const offsetY = event.clientY - columnRect.top;
    const minutes = calendarPxHeightToMinutes(
      offsetY,
      theme.typography.htmlFontSize
    );
    const time = startOfDay.plus({ minutes });
    const newQuery = new URLSearchParams(query);
    newQuery.set("sourceStartDate", time.toFormat("yyyy-MM-dd"));
    newQuery.set("sourceStartTimeInDay", time.toFormat("HH:mm"));
    if (location.pathname === `/app/workspace/calendar/schedule/event-in-day/new`) {
      navigate(
        `/app/workspace/calendar/schedule/event-in-day/new?${newQuery}`,
        {
          replace: true
        }
      );
    } else if (location.pathname.startsWith(
      `/app/workspace/calendar/schedule/event-in-day/`
    )) {
      navigate(`${location.pathname}?${newQuery}`, {
        replace: true
      });
    } else if (location.pathname.startsWith(
      `/app/workspace/calendar/time-event/in-day-block/`
    )) {
      navigate(`${location.pathname}?${newQuery}`, {
        replace: true
      });
    } else {
      navigate(
        `/app/workspace/calendar/schedule/event-in-day/new?${newQuery}`,
        {
          replace: true
        }
      );
    }
  }
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        position: "relative",
        flexGrow: 1,
        height: `${heightInRem}rem`,
        minWidth: "7rem"
      },
      ref: wholeColumnRef,
      onDoubleClick: createNewFromDoubleClick,
      children: [
        props.today === props.date && /* @__PURE__ */ jsxDEV(
          Box_default,
          {
            sx: {
              position: "absolute",
              top: calendarTimeEventInDayStartMinutesToRems(
                theMinutes,
                deltaHour
              ),
              height: "0.15rem",
              width: "100%",
              backgroundColor: theme.palette.info.dark,
              zIndex: theme.zIndex.appBar
            }
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 558,
            columnNumber: 9
          },
          this
        ),
        hours.map((hour, idx) => {
          if (props.showOnlyFromRightNowIfDaily && hour.hour < props.rightNow.hour) {
            return null;
          }
          const locationInRem = idx * 4 - deltaHour * 4;
          return /* @__PURE__ */ jsxDEV(
            Box_default,
            {
              sx: {
                position: "absolute",
                height: "0.05rem",
                left: "-0.05rem",
                // Offset for gap: 0.1 in container
                backgroundColor: theme.palette.text.disabled,
                top: `${locationInRem}rem`,
                width: "calc(100% + 0.1rem)"
                // Offset for gap 0.1 in container
              }
            },
            idx,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 584,
              columnNumber: 11
            },
            this
          );
        }),
        /* @__PURE__ */ jsxDEV(
          TimeEventParamsNewPlaceholder,
          {
            daysToTheLeft: props.daysToTheLeft,
            date: props.date,
            deltaHour
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 598,
            columnNumber: 7
          },
          this
        ),
        props.timeEventsInDay.map((entry, index) => {
          return /* @__PURE__ */ jsxDEV(
            ViewAsCalendarTimeEventInDayCell,
            {
              offset: timeBlockOffsetsMap.get(entry.time_event_in_tz.ref_id) || 0,
              startOfDay,
              entry,
              isAdding: props.isAdding,
              deltaHour
            },
            index,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 606,
              columnNumber: 11
            },
            this
          );
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
      lineNumber: 547,
      columnNumber: 5
    },
    this
  );
}
function ViewAsCalendarTimeEventInDayCell(props) {
  const [query] = useSearchParams();
  const theme = useTheme();
  const containerRef = (0, import_react2.useRef)(null);
  const [containerWidth, setContainerWidth] = (0, import_react2.useState)(120);
  (0, import_react2.useEffect)(() => {
    setContainerWidth(containerRef.current?.clientWidth || 120);
  }, [containerRef]);
  switch (timeEventInDayBlockOwnerTheType(props.entry.time_event_in_tz)) {
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_IN_DAY: {
      const scheduleEntry = props.entry.entry;
      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const minutesSinceStartOfDay = startTime.diff(props.startOfDay).as("minutes");
      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        titleWithTags(scheduleEntry.event.name, scheduleEntry.tags),
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        scheduleEntry.time_event.duration_mins
      );
      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour
      );
      if (topRems === void 0) {
        return null;
      }
      return /* @__PURE__ */ jsxDEV(
        Box_default,
        {
          ref: containerRef,
          id: `schedule-event-in-day-block-${props.entry.entry.event.ref_id}`,
          sx: {
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              scheduleEntry.time_event.duration_mins
            ),
            backgroundColor: scheduleStreamColorHex(scheduleEntry.stream.color),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset
          },
          children: /* @__PURE__ */ jsxDEV(
            EntityLink,
            {
              to: `/app/workspace/calendar/schedule/event-in-day/${scheduleEntry.event.ref_id}?${query}`,
              inline: true,
              block: props.isAdding,
              children: /* @__PURE__ */ jsxDEV(
                Box_default,
                {
                  sx: {
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: "0rem",
                    left: "0.1rem",
                    overflow: "hidden"
                  },
                  children: /* @__PURE__ */ jsxDEV(
                    EntityNameComponent,
                    {
                      name: clippedName,
                      color: scheduleStreamColorContrastingHex(
                        scheduleEntry.stream.color
                      )
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                      lineNumber: 710,
                      columnNumber: 15
                    },
                    this
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                  lineNumber: 700,
                  columnNumber: 13
                },
                this
              )
            },
            `schedule-event-in-day-${scheduleEntry.event.ref_id}`,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 694,
              columnNumber: 11
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 674,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.BIG_PLAN: {
      const bigPlanEntry = props.entry.entry;
      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const minutesSinceStartOfDay = startTime.diff(props.startOfDay).as("minutes");
      const nameWithStatus = bigPlanNameForEvent(bigPlanEntry.big_plan);
      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        props.entry.time_event_in_tz.duration_mins
      );
      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour
      );
      if (topRems === void 0) {
        return null;
      }
      return /* @__PURE__ */ jsxDEV(
        Box_default,
        {
          ref: containerRef,
          id: `big-plan-event-in-day-block-${bigPlanEntry.big_plan.ref_id}`,
          sx: {
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins
            ),
            backgroundColor: scheduleStreamColorHex(
              BIG_PLAN_TIME_EVENT_COLOR,
              bigPlanEntry.big_plan.status === import_webapi_client.BigPlanStatus.DONE ? "lighter" : bigPlanEntry.big_plan.status === import_webapi_client.BigPlanStatus.NOT_DONE ? "darker" : "normal"
            ),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem  - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset
          },
          children: /* @__PURE__ */ jsxDEV(
            EntityLink,
            {
              to: `/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`,
              inline: true,
              block: props.isAdding,
              children: /* @__PURE__ */ jsxDEV(
                Box_default,
                {
                  sx: {
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: "0rem",
                    left: "0.1rem",
                    overflow: "hidden"
                  },
                  children: /* @__PURE__ */ jsxDEV(
                    EntityNameComponent,
                    {
                      name: clippedName,
                      color: scheduleStreamColorContrastingHex(
                        BIG_PLAN_TIME_EVENT_COLOR
                      )
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                      lineNumber: 801,
                      columnNumber: 15
                    },
                    this
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                  lineNumber: 791,
                  columnNumber: 13
                },
                this
              )
            },
            `big-plan-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 785,
              columnNumber: 11
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 758,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.TODO_TASK: {
      const todoTaskEntry = props.entry.entry;
      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const minutesSinceStartOfDay = startTime.diff(props.startOfDay).as("minutes");
      const nameWithStatus = todoTaskNameForEvent(
        todoTaskEntry.todo_task,
        todoTaskEntry.inbox_task
      );
      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        props.entry.time_event_in_tz.duration_mins
      );
      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour
      );
      if (topRems === void 0) {
        return null;
      }
      return /* @__PURE__ */ jsxDEV(
        Box_default,
        {
          ref: containerRef,
          id: `todo-task-event-in-day-block-${todoTaskEntry.todo_task.ref_id}`,
          sx: {
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins
            ),
            backgroundColor: scheduleStreamColorHex(
              TODO_TASK_TIME_EVENT_COLOR,
              todoTaskEntry.inbox_task.status === import_webapi_client.InboxTaskStatus.DONE ? "lighter" : todoTaskEntry.inbox_task.status === import_webapi_client.InboxTaskStatus.NOT_DONE ? "darker" : "normal"
            ),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem  - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset
          },
          children: /* @__PURE__ */ jsxDEV(
            EntityLink,
            {
              to: `/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`,
              inline: true,
              block: props.isAdding,
              children: /* @__PURE__ */ jsxDEV(
                Box_default,
                {
                  sx: {
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: "0rem",
                    left: "0.1rem",
                    overflow: "hidden"
                  },
                  children: /* @__PURE__ */ jsxDEV(
                    EntityNameComponent,
                    {
                      name: clippedName,
                      color: scheduleStreamColorContrastingHex(
                        TODO_TASK_TIME_EVENT_COLOR
                      )
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                      lineNumber: 895,
                      columnNumber: 15
                    },
                    this
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                  lineNumber: 885,
                  columnNumber: 13
                },
                this
              )
            },
            `todo-task-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 879,
              columnNumber: 11
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 852,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.HABIT: {
      const habitEntry = props.entry.entry;
      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const minutesSinceStartOfDay = startTime.diff(props.startOfDay).as("minutes");
      const nameWithStatus = habitNameForEvent(habitEntry.habit);
      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        props.entry.time_event_in_tz.duration_mins
      );
      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour
      );
      if (topRems === void 0) {
        return null;
      }
      return /* @__PURE__ */ jsxDEV(
        Box_default,
        {
          ref: containerRef,
          id: `habit-event-in-day-block-${habitEntry.habit.ref_id}`,
          sx: {
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins
            ),
            backgroundColor: scheduleStreamColorHex(HABIT_TIME_EVENT_COLOR),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem  - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset
          },
          children: /* @__PURE__ */ jsxDEV(
            EntityLink,
            {
              to: `/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`,
              inline: true,
              block: props.isAdding,
              children: /* @__PURE__ */ jsxDEV(
                Box_default,
                {
                  sx: {
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: "0rem",
                    left: "0.1rem",
                    overflow: "hidden"
                  },
                  children: /* @__PURE__ */ jsxDEV(
                    EntityNameComponent,
                    {
                      name: clippedName,
                      color: scheduleStreamColorContrastingHex(
                        HABIT_TIME_EVENT_COLOR
                      )
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                      lineNumber: 979,
                      columnNumber: 15
                    },
                    this
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                  lineNumber: 969,
                  columnNumber: 13
                },
                this
              )
            },
            `habit-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 963,
              columnNumber: 11
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 943,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.CHORE: {
      const choreEntry = props.entry.entry;
      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const minutesSinceStartOfDay = startTime.diff(props.startOfDay).as("minutes");
      const nameWithStatus = choreNameForEvent(choreEntry.chore);
      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        props.entry.time_event_in_tz.duration_mins
      );
      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour
      );
      if (topRems === void 0) {
        return null;
      }
      return /* @__PURE__ */ jsxDEV(
        Box_default,
        {
          ref: containerRef,
          id: `chore-event-in-day-block-${choreEntry.chore.ref_id}`,
          sx: {
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins
            ),
            backgroundColor: scheduleStreamColorHex(CHORE_TIME_EVENT_COLOR),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem  - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset
          },
          children: /* @__PURE__ */ jsxDEV(
            EntityLink,
            {
              to: `/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`,
              inline: true,
              block: props.isAdding,
              children: /* @__PURE__ */ jsxDEV(
                Box_default,
                {
                  sx: {
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: "0rem",
                    left: "0.1rem",
                    overflow: "hidden"
                  },
                  children: /* @__PURE__ */ jsxDEV(
                    EntityNameComponent,
                    {
                      name: clippedName,
                      color: scheduleStreamColorContrastingHex(
                        CHORE_TIME_EVENT_COLOR
                      )
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                      lineNumber: 1063,
                      columnNumber: 15
                    },
                    this
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                  lineNumber: 1053,
                  columnNumber: 13
                },
                this
              )
            },
            `chore-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 1047,
              columnNumber: 11
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 1027,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.TIME_PLAN_ACTIVITY: {
      const activityEntry = props.entry.entry;
      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz
      );
      const minutesSinceStartOfDay = startTime.diff(props.startOfDay).as("minutes");
      const nameWithStatus = timePlanActivityNameForEvent(activityEntry);
      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        props.entry.time_event_in_tz.duration_mins
      );
      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour
      );
      if (topRems === void 0) {
        return null;
      }
      return /* @__PURE__ */ jsxDEV(
        Box_default,
        {
          ref: containerRef,
          id: `time-plan-activity-event-in-day-block-${activityEntry.time_plan_activity.ref_id}`,
          sx: {
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins
            ),
            backgroundColor: scheduleStreamColorHex(
              TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR
            ),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem  - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset
          },
          children: /* @__PURE__ */ jsxDEV(
            EntityLink,
            {
              to: `/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`,
              inline: true,
              block: props.isAdding,
              children: /* @__PURE__ */ jsxDEV(
                Box_default,
                {
                  sx: {
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: "0rem",
                    left: "0.1rem",
                    overflow: "hidden"
                  },
                  children: /* @__PURE__ */ jsxDEV(
                    EntityNameComponent,
                    {
                      name: clippedName,
                      color: scheduleStreamColorContrastingHex(
                        TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR
                      )
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                      lineNumber: 1149,
                      columnNumber: 15
                    },
                    this
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                  lineNumber: 1139,
                  columnNumber: 13
                },
                this
              )
            },
            `time-plan-activity-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 1133,
              columnNumber: 11
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 1111,
          columnNumber: 9
        },
        this
      );
    }
    default:
      throw new Error("Unkown namespace");
  }
}
function ViewAsCalendarInDayContainer(props) {
  const isBigScreen = useBigScreen();
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        display: "flex",
        flexDirection: "row",
        gap: "0.1rem",
        position: "relative",
        minWidth: isBigScreen ? void 0 : "fit-content"
      },
      children: props.children
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
      lineNumber: 1170,
      columnNumber: 5
    },
    this
  );
}
function ViewAsCalendarGoToCell(props) {
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        minWidth: "3rem",
        height: "100%",
        border: "1px solid darkgray",
        borderRadius: "0.25rem",
        display: "flex",
        justifyContent: "center"
      },
      children: /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/calendar${props.calendarLocation}?date=${props.periodStart}&period=${props.period}&view=calendar`,
          children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: props.label }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1206,
            columnNumber: 9
          }, this)
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 1203,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
      lineNumber: 1193,
      columnNumber: 5
    },
    this
  );
}
function ViewAsCalendarStatsCell(props) {
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        border: "1px solid darkgray",
        borderRadius: "0.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        padding: "0.25rem",
        justifyContent: "center"
      },
      children: [
        /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: props.label }, void 0, false, {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 1233,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(
          ViewAsStatsPerSubperiod,
          {
            forceColumn: props.forceColumn,
            showCompact: props.showCompact,
            view: "calendar" /* CALENDAR */,
            stats: props.stats,
            calendarLocation: props.calendarLocation
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1234,
            columnNumber: 7
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
      lineNumber: 1222,
      columnNumber: 5
    },
    this
  );
}
function ViewAsScheduleTimeEventFullDaysRows(props) {
  const [query] = useSearchParams();
  const isBigScreen = useBigScreen();
  const { theType } = parseEntityLinkStd(props.entry.time_event.owner);
  switch (theType) {
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS: {
      const fullDaysEntry = props.entry.entry;
      return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleTimeCell,
          {
            period: props.period,
            isbigscreen: isBigScreen.toString(),
            children: "[All Day]"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1263,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleEventCell,
          {
            color: scheduleStreamColorHex(fullDaysEntry.stream.color),
            height: "0.25rem",
            children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                light: true,
                to: `/app/workspace/calendar/schedule/event-full-days/${fullDaysEntry.event.ref_id}?${query}`,
                inline: true,
                block: props.isAdding,
                children: /* @__PURE__ */ jsxDEV(
                  EntityNameComponent,
                  {
                    name: titleWithTags(
                      fullDaysEntry.event.name,
                      fullDaysEntry.tags
                    ),
                    color: scheduleStreamColorContrastingHex(
                      fullDaysEntry.stream.color
                    )
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                    lineNumber: 1281,
                    columnNumber: 15
                  },
                  this
                )
              },
              `schedule-event-full-days-${fullDaysEntry.event.ref_id}`,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                lineNumber: 1274,
                columnNumber: 13
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1270,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/calendar/component/shared.tsx",
        lineNumber: 1262,
        columnNumber: 9
      }, this);
    }
    case import_webapi_client.NamedEntityTag.OCCASION: {
      const fullDaysEntry = props.entry.entry;
      return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleTimeCell,
          {
            period: props.period,
            isbigscreen: isBigScreen.toString(),
            children: "[All Day]"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1300,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleEventCell,
          {
            color: scheduleStreamColorHex(BIRTHDAY_TIME_EVENT_COLOR),
            height: "0.25rem",
            children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                light: true,
                to: `/app/workspace/calendar/time-event/full-days-block/${fullDaysEntry.occasion_time_event.ref_id}?${query}`,
                inline: true,
                block: props.isAdding,
                children: /* @__PURE__ */ jsxDEV(
                  EntityNameComponent,
                  {
                    name: `\u{1F468} ${occasionTimeEventName(
                      fullDaysEntry.occasion_time_event,
                      fullDaysEntry.contact,
                      fullDaysEntry.occasion
                    )}`,
                    color: scheduleStreamColorContrastingHex(
                      BIRTHDAY_TIME_EVENT_COLOR
                    )
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                    lineNumber: 1318,
                    columnNumber: 15
                  },
                  this
                )
              },
              `schedule-event-full-days-${fullDaysEntry.occasion_time_event.ref_id}`,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                lineNumber: 1311,
                columnNumber: 13
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1307,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/calendar/component/shared.tsx",
        lineNumber: 1299,
        columnNumber: 9
      }, this);
    }
    case import_webapi_client.NamedEntityTag.VACATION: {
      const fullDaysEntry = props.entry.entry;
      return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleTimeCell,
          {
            period: props.period,
            isbigscreen: isBigScreen.toString(),
            children: "[All Day]"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1338,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleEventCell,
          {
            color: scheduleStreamColorHex(VACATION_TIME_EVENT_COLOR),
            height: "0.25rem",
            children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                light: true,
                to: `/app/workspace/calendar/time-event/full-days-block/${fullDaysEntry.time_event.ref_id}?${query}`,
                inline: true,
                block: props.isAdding,
                children: /* @__PURE__ */ jsxDEV(
                  EntityNameComponent,
                  {
                    name: `\u{1F334} ${fullDaysEntry.vacation.name}`,
                    color: scheduleStreamColorContrastingHex(
                      VACATION_TIME_EVENT_COLOR
                    )
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                    lineNumber: 1356,
                    columnNumber: 15
                  },
                  this
                )
              },
              `schedule-event-full-days-${fullDaysEntry.time_event.ref_id}`,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                lineNumber: 1349,
                columnNumber: 13
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1345,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/calendar/component/shared.tsx",
        lineNumber: 1337,
        columnNumber: 9
      }, this);
    }
    default:
      throw new Error(`Unknown full-days time event owner type: ${theType}`);
  }
}
function ViewAsScheduleTimeEventInDaysRows(props) {
  const [query] = useSearchParams();
  const isBigScreen = useBigScreen();
  const startTime = calculateStartTimeForTimeEvent(
    props.entry.time_event_in_tz
  );
  const endTime = calculateEndTimeForTimeEvent(props.entry.time_event_in_tz);
  switch (timeEventInDayBlockOwnerTheType(props.entry.time_event_in_tz)) {
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_IN_DAY: {
      const scheduleEntry = props.entry.entry;
      return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleTimeCell,
          {
            period: props.period,
            isbigscreen: isBigScreen.toString(),
            children: [
              "[",
              startTime.toFormat("HH:mm"),
              " - ",
              endTime.toFormat("HH:mm"),
              "]"
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1395,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleEventCell,
          {
            color: scheduleStreamColorHex(scheduleEntry.stream.color),
            height: scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins
            ),
            children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                light: true,
                to: `/app/workspace/calendar/schedule/event-in-day/${scheduleEntry.event.ref_id}?${query}`,
                inline: true,
                block: props.isAdding,
                children: /* @__PURE__ */ jsxDEV(
                  EntityNameComponent,
                  {
                    name: titleWithTags(
                      scheduleEntry.event.name,
                      scheduleEntry.tags
                    ),
                    color: scheduleStreamColorContrastingHex(
                      scheduleEntry.stream.color
                    )
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                    lineNumber: 1415,
                    columnNumber: 15
                  },
                  this
                )
              },
              `schedule-event-in-day-${scheduleEntry.event.ref_id}`,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                lineNumber: 1408,
                columnNumber: 13
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1402,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/calendar/component/shared.tsx",
        lineNumber: 1394,
        columnNumber: 9
      }, this);
    }
    case import_webapi_client.NamedEntityTag.BIG_PLAN: {
      const bigPlanEntry = props.entry.entry;
      return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleTimeCell,
          {
            period: props.period,
            isbigscreen: isBigScreen.toString(),
            children: [
              "[",
              startTime.toFormat("HH:mm"),
              " - ",
              endTime.toFormat("HH:mm"),
              "]"
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1434,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleEventCell,
          {
            color: scheduleStreamColorHex(
              BIG_PLAN_TIME_EVENT_COLOR,
              bigPlanEntry.big_plan.status === import_webapi_client.BigPlanStatus.DONE ? "lighter" : bigPlanEntry.big_plan.status === import_webapi_client.BigPlanStatus.NOT_DONE ? "darker" : "normal"
            ),
            height: scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins
            ),
            children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                light: true,
                to: `/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`,
                inline: true,
                block: props.isAdding,
                children: /* @__PURE__ */ jsxDEV(
                  EntityNameComponent,
                  {
                    name: bigPlanNameForEvent(bigPlanEntry.big_plan),
                    color: scheduleStreamColorContrastingHex(
                      BIG_PLAN_TIME_EVENT_COLOR
                    )
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                    lineNumber: 1461,
                    columnNumber: 15
                  },
                  this
                )
              },
              `time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                lineNumber: 1454,
                columnNumber: 13
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1441,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/calendar/component/shared.tsx",
        lineNumber: 1433,
        columnNumber: 9
      }, this);
    }
    case import_webapi_client.NamedEntityTag.TODO_TASK: {
      const todoTaskEntry = props.entry.entry;
      return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleTimeCell,
          {
            period: props.period,
            isbigscreen: isBigScreen.toString(),
            children: [
              "[",
              startTime.toFormat("HH:mm"),
              " - ",
              endTime.toFormat("HH:mm"),
              "]"
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1477,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleEventCell,
          {
            color: scheduleStreamColorHex(
              TODO_TASK_TIME_EVENT_COLOR,
              todoTaskEntry.inbox_task.status === import_webapi_client.InboxTaskStatus.DONE ? "lighter" : todoTaskEntry.inbox_task.status === import_webapi_client.InboxTaskStatus.NOT_DONE ? "darker" : "normal"
            ),
            height: scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins
            ),
            children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                light: true,
                to: `/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`,
                inline: true,
                block: props.isAdding,
                children: /* @__PURE__ */ jsxDEV(
                  EntityNameComponent,
                  {
                    name: todoTaskNameForEvent(
                      todoTaskEntry.todo_task,
                      todoTaskEntry.inbox_task
                    ),
                    color: scheduleStreamColorContrastingHex(
                      TODO_TASK_TIME_EVENT_COLOR
                    )
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                    lineNumber: 1504,
                    columnNumber: 15
                  },
                  this
                )
              },
              `time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                lineNumber: 1497,
                columnNumber: 13
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1484,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/calendar/component/shared.tsx",
        lineNumber: 1476,
        columnNumber: 9
      }, this);
    }
    case import_webapi_client.NamedEntityTag.HABIT: {
      const habitEntry = props.entry.entry;
      return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleTimeCell,
          {
            period: props.period,
            isbigscreen: isBigScreen.toString(),
            children: [
              "[",
              startTime.toFormat("HH:mm"),
              " - ",
              endTime.toFormat("HH:mm"),
              "]"
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1523,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleEventCell,
          {
            color: scheduleStreamColorHex(HABIT_TIME_EVENT_COLOR),
            height: scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins
            ),
            children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                light: true,
                to: `/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`,
                inline: true,
                block: props.isAdding,
                children: /* @__PURE__ */ jsxDEV(
                  EntityNameComponent,
                  {
                    name: habitNameForEvent(habitEntry.habit),
                    color: scheduleStreamColorContrastingHex(
                      HABIT_TIME_EVENT_COLOR
                    )
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                    lineNumber: 1543,
                    columnNumber: 15
                  },
                  this
                )
              },
              `time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                lineNumber: 1536,
                columnNumber: 13
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1530,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/calendar/component/shared.tsx",
        lineNumber: 1522,
        columnNumber: 9
      }, this);
    }
    case import_webapi_client.NamedEntityTag.CHORE: {
      const choreEntry = props.entry.entry;
      return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleTimeCell,
          {
            period: props.period,
            isbigscreen: isBigScreen.toString(),
            children: [
              "[",
              startTime.toFormat("HH:mm"),
              " - ",
              endTime.toFormat("HH:mm"),
              "]"
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1559,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleEventCell,
          {
            color: scheduleStreamColorHex(CHORE_TIME_EVENT_COLOR),
            height: scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins
            ),
            children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                light: true,
                to: `/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`,
                inline: true,
                block: props.isAdding,
                children: /* @__PURE__ */ jsxDEV(
                  EntityNameComponent,
                  {
                    name: choreNameForEvent(choreEntry.chore),
                    color: scheduleStreamColorContrastingHex(
                      CHORE_TIME_EVENT_COLOR
                    )
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                    lineNumber: 1579,
                    columnNumber: 15
                  },
                  this
                )
              },
              `time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                lineNumber: 1572,
                columnNumber: 13
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1566,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/calendar/component/shared.tsx",
        lineNumber: 1558,
        columnNumber: 9
      }, this);
    }
    case import_webapi_client.NamedEntityTag.TIME_PLAN_ACTIVITY: {
      const activityEntry = props.entry.entry;
      return /* @__PURE__ */ jsxDEV(import_react2.Fragment, { children: [
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleTimeCell,
          {
            period: props.period,
            isbigscreen: isBigScreen.toString(),
            children: [
              "[",
              startTime.toFormat("HH:mm"),
              " - ",
              endTime.toFormat("HH:mm"),
              "]"
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1595,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ViewAsScheduleEventCell,
          {
            color: scheduleStreamColorHex(TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR),
            height: scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins
            ),
            children: /* @__PURE__ */ jsxDEV(
              EntityLink,
              {
                light: true,
                to: `/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`,
                inline: true,
                block: props.isAdding,
                children: /* @__PURE__ */ jsxDEV(
                  EntityNameComponent,
                  {
                    name: timePlanActivityNameForEvent(activityEntry),
                    color: scheduleStreamColorContrastingHex(
                      TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR
                    )
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                    lineNumber: 1615,
                    columnNumber: 15
                  },
                  this
                )
              },
              `time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/shared.tsx",
                lineNumber: 1608,
                columnNumber: 13
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/calendar/component/shared.tsx",
            lineNumber: 1602,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/calendar/component/shared.tsx",
        lineNumber: 1594,
        columnNumber: 9
      }, this);
    }
    default:
      throw new Error("Unkown namespace");
  }
}
var ViewAsScheduleDateCell = styled_default(
  TableCell_default
)(() => ({
  verticalAlign: "top",
  padding: "0.25rem"
}));
var ViewAsScheduleContentCell = styled_default(TableCell_default)({
  padding: "0.25rem"
});
var ViewAsScheduleTimeCell = styled_default(
  TableCell_default
)(({ isbigscreen, period }) => ({
  verticalAlign: "top",
  padding: "0.25rem",
  width: isbigscreen === "false" || period === import_webapi_client.RecurringTaskPeriod.DAILY ? "30%" : "15%"
}));
var ViewAsScheduleEventCell = styled_default(
  TableCell_default
)(({ color, height }) => ({
  verticalAlign: "top",
  backgroundColor: color,
  padding: "0.25rem",
  paddingLeft: "0.5rem",
  paddingBottom: height,
  borderRadius: "0.25rem"
}));
function ViewAsStatsPerSubperiod(props) {
  return /* @__PURE__ */ jsxDEV(
    EntityLink,
    {
      to: `/app/workspace/calendar${props.calendarLocation}?date=${props.stats.period_start_date}&period=${props.stats.period}&view=${props.view}`,
      children: /* @__PURE__ */ jsxDEV(
        Box_default,
        {
          sx: {
            display: "flex",
            flexDirection: props.forceColumn ? "column" : "row",
            gap: "0.25rem",
            flexWrap: "wrap"
          },
          children: [
            /* @__PURE__ */ jsxDEV("span", { children: [
              "\u{1F4C5} ",
              props.stats.schedule_event_full_days_cnt,
              " ",
              !props.showCompact ? "from scheduled full day events" : ""
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 1711,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "\u231A ",
              props.stats.schedule_event_in_day_cnt,
              " ",
              !props.showCompact ? "from scheduled in day events" : ""
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 1715,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "\u{1F3AF} ",
              props.stats.big_plan_cnt,
              " ",
              !props.showCompact ? "from big plan" : ""
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 1719,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "\u{1F4DD} ",
              props.stats.todo_task_cnt,
              " ",
              !props.showCompact ? "from todo task" : ""
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 1723,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "\u{1F504} ",
              props.stats.habit_cnt,
              " ",
              !props.showCompact ? "from habit" : ""
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 1727,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "\u{1F9F9} ",
              props.stats.chore_cnt,
              " ",
              !props.showCompact ? "from chore" : ""
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 1730,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "\u{1F4CB} ",
              props.stats.time_plan_activity_cnt,
              " ",
              !props.showCompact ? "from activities" : ""
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 1733,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "\u{1F468} ",
              props.stats.person_birthday_cnt,
              " ",
              !props.showCompact ? "from birthdays" : ""
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 1737,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "\u{1F334} ",
              props.stats.vacation_cnt,
              " ",
              !props.showCompact ? "from Vacations" : ""
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/calendar/component/shared.tsx",
              lineNumber: 1741,
              columnNumber: 9
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/calendar/component/shared.tsx",
          lineNumber: 1703,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/calendar/component/shared.tsx",
      lineNumber: 1700,
      columnNumber: 5
    },
    this
  );
}
function bigPlanNameForEvent(bigPlan) {
  if (bigPlan.status === import_webapi_client.BigPlanStatus.DONE) {
    return `\u2705 ${bigPlan.name}`;
  } else if (bigPlan.status === import_webapi_client.BigPlanStatus.NOT_DONE) {
    return `\u274C ${bigPlan.name}`;
  } else {
    return `${bigPlan.name}`;
  }
}
function todoTaskNameForEvent(todoTask, inboxTask) {
  if (inboxTask.status === import_webapi_client.InboxTaskStatus.DONE) {
    return `\u2705 ${todoTask.name}`;
  } else if (inboxTask.status === import_webapi_client.InboxTaskStatus.NOT_DONE) {
    return `\u274C ${todoTask.name}`;
  } else {
    return `${todoTask.name}`;
  }
}
function habitNameForEvent(habit) {
  return `\u{1F504} ${habit.name}`;
}
function choreNameForEvent(chore) {
  return `\u{1F9F9} ${chore.name}`;
}
function timePlanActivityNameForEvent(entry) {
  if (entry.target_inbox_task) {
    const name = entry.target_inbox_task.name;
    if (entry.target_inbox_task.status === import_webapi_client.InboxTaskStatus.DONE) {
      return `\u2705 ${name}`;
    } else if (entry.target_inbox_task.status === import_webapi_client.InboxTaskStatus.NOT_DONE) {
      return `\u274C ${name}`;
    }
    return `${name}`;
  }
  if (entry.target_big_plan) {
    const name = entry.target_big_plan.name;
    if (entry.target_big_plan.status === import_webapi_client.BigPlanStatus.DONE) {
      return `\u2705 ${name}`;
    } else if (entry.target_big_plan.status === import_webapi_client.BigPlanStatus.NOT_DONE) {
      return `\u274C ${name}`;
    }
    return `${name}`;
  }
  return `\u{1F4CB} Work on activity ${entry.time_plan_activity.ref_id}`;
}

// ../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx
var import_react4 = __toESM(require_react(), 1);
function ViewAsCalendarDaily(props) {
  const isBigScreen = useBigScreen();
  const [showAllTimeEventFullDays, setShowAllTimeEventFullDays] = (0, import_react4.useState)(false);
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
  const thePartititionFullDays = partitionedCombinedTimeEventFullDays[props.periodStartDate] || [];
  const partitionedCombinedTimeEventInDay = combinedTimeEventInDayEntryPartionByDay(combinedTimeEventInDay);
  const thePartitionInDay = partitionedCombinedTimeEventInDay[props.periodStartDate] || [];
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        position: "relative",
        margin: isBigScreen ? "auto" : "initial",
        width: isBigScreen ? "300px" : "100%"
      },
      children: [
        /* @__PURE__ */ jsxDEV(ViewAsCalendarDaysAndFullDaysContiner, { children: [
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", flexDirection: "row", gap: "0.5rem" }, children: [
            /* @__PURE__ */ jsxDEV(ViewAsCalendarEmptyCell, { children: [
              /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: periodStartDate.toFormat("MMM") }, void 0, false, {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
                lineNumber: 145,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h6", children: periodStartDate.toFormat("yyyy") }, void 0, false, {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
                lineNumber: 148,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
              lineNumber: 144,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              ViewAsCalendarDateHeader,
              {
                today: props.today,
                date: props.periodStartDate
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
                lineNumber: 152,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(ViewAsCalendarEmptyCell, {}, void 0, false, {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
              lineNumber: 156,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
            lineNumber: 143,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", flexDirection: "row" }, children: [
            thePartititionFullDays.length > MAX_VISIBLE_TIME_EVENT_FULL_DAYS && /* @__PURE__ */ jsxDEV(
              ViewAsCalendarMoreButton,
              {
                showAllTimeEventFullDays,
                setShowAllTimeEventFullDays
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
                lineNumber: 161,
                columnNumber: 13
              },
              this
            ),
            thePartititionFullDays.length <= MAX_VISIBLE_TIME_EVENT_FULL_DAYS && /* @__PURE__ */ jsxDEV(ViewAsCalendarEmptyCell, {}, void 0, false, {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
              lineNumber: 167,
              columnNumber: 49
            }, this),
            /* @__PURE__ */ jsxDEV(
              ViewAsCalendarTimeEventFullDaysColumn,
              {
                today: props.today,
                date: props.periodStartDate,
                showAll: showAllTimeEventFullDays,
                maxFullDaysEntriesCnt: thePartititionFullDays.length,
                timeEventFullDays: thePartititionFullDays,
                isAdding: props.isAdding
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
                lineNumber: 169,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(ViewAsCalendarEmptyCell, {}, void 0, false, {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
              lineNumber: 178,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
            lineNumber: 159,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
          lineNumber: 142,
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
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
              lineNumber: 183,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ViewAsCalendarTimeEventInDayColumn,
            {
              daysToTheLeft: 0,
              rightNow: props.rightNow,
              today: props.today,
              timezone: props.timezone,
              date: props.periodStartDate,
              timeEventsInDay: thePartitionInDay,
              isAdding: props.isAdding,
              showOnlyFromRightNowIfDaily: props.showOnlyFromRightNowIfDaily
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
              lineNumber: 187,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ViewAsCalendarRightColumn,
            {
              rightNow: props.rightNow,
              showOnlyFromRightNowIfDaily: props.showOnlyFromRightNowIfDaily
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
              lineNumber: 197,
              columnNumber: 9
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
          lineNumber: 182,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/calendar/component/view-as-calendar-daily.tsx",
      lineNumber: 135,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
var import_react5 = __toESM(require_react(), 1);
function ViewAsScheduleDailyAndWeekly(props) {
  const isBigScreen = useBigScreen();
  if (props.entries === void 0) {
    throw new Error("Entries are required");
  }
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
    if (props.showOnlyFromRightNowIfDaily && calculateStartTimeForTimeEvent(entry.time_event) < props.rightNow) {
      continue;
    }
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
      if (props.showOnlyFromRightNowIfDaily && calculateStartTimeForTimeEvent(timeEvent) < props.rightNow) {
        continue;
      }
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
      if (props.showOnlyFromRightNowIfDaily && calculateStartTimeForTimeEvent(timeEvent) < props.rightNow) {
        continue;
      }
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
      if (props.showOnlyFromRightNowIfDaily && calculateStartTimeForTimeEvent(timeEvent) < props.rightNow) {
        continue;
      }
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
      if (props.showOnlyFromRightNowIfDaily && calculateStartTimeForTimeEvent(timeEvent) < props.rightNow) {
        continue;
      }
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
      if (props.showOnlyFromRightNowIfDaily && calculateStartTimeForTimeEvent(timeEvent) < props.rightNow) {
        continue;
      }
      combinedTimeEventInDay.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(
          timeEvent,
          props.timezone
        ),
        entry
      });
    }
  }
  const periodStartDate = DateTime.fromISO(props.periodStartDate);
  const periodEndDate = DateTime.fromISO(props.periodEndDate);
  const daysToProcess = allDaysBetween(
    props.periodStartDate,
    props.periodEndDate
  );
  const partitionedCombinedTimeEventFullDays = combinedTimeEventFullDayEntryPartionByDay(combinedTimeEventFullDays);
  const partitionedCombinedTimeEventInDay = combinedTimeEventInDayEntryPartionByDay(combinedTimeEventInDay);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    props.period === import_webapi_client2.RecurringTaskPeriod.DAILY && /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h5", children: [
      "Viewing ",
      periodStartDate.toFormat("dd MMM yyyy")
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
      lineNumber: 179,
      columnNumber: 9
    }, this),
    props.period === import_webapi_client2.RecurringTaskPeriod.WEEKLY && /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h5", children: [
      "Viewing W",
      periodStartDate.weekNumber,
      " ",
      periodStartDate.year,
      " from",
      " ",
      periodStartDate.toFormat("dd MMM"),
      " to",
      " ",
      periodEndDate.toFormat("dd MMM")
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
      lineNumber: 184,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(TableContainer_default, { component: Paper_default, children: /* @__PURE__ */ jsxDEV(Table_default, { sx: { borderCollapse: "separate", borderSpacing: "0.2rem" }, children: /* @__PURE__ */ jsxDEV(TableBody_default, { children: daysToProcess.map((date) => {
      const partitionFullDays = partitionedCombinedTimeEventFullDays[date] || [];
      const partitionInDay = partitionedCombinedTimeEventInDay[date] || [];
      if (partitionFullDays.length === 0 && partitionInDay.length === 0) {
        return /* @__PURE__ */ jsxDEV(import_react5.Fragment, {}, date, false, {
          fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
          lineNumber: 204,
          columnNumber: 24
        }, this);
      }
      const firstRowFullDays = partitionFullDays[0];
      const otherRowsFullDays = partitionFullDays.slice(1);
      const firstRowInDay = partitionInDay[0];
      const otherRowsInDay = partitionInDay.slice(1);
      return /* @__PURE__ */ jsxDEV(import_react5.Fragment, { children: [
        firstRowFullDays && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            props.period === import_webapi_client2.RecurringTaskPeriod.WEEKLY && /* @__PURE__ */ jsxDEV(
              TableCell_default,
              {
                rowSpan: partitionFullDays.length + partitionInDay.length,
                sx: {
                  padding: "0.25rem",
                  width: isBigScreen ? "15%" : "25%"
                },
                children: isBigScreen ? DateTime.fromISO(date).toFormat("MMM-dd") : DateTime.fromISO(date).toFormat("dd MMM")
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
                lineNumber: 218,
                columnNumber: 27
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              ViewAsScheduleTimeEventFullDaysRows,
              {
                period: props.period,
                entry: firstRowFullDays,
                isAdding: props.isAdding
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
                lineNumber: 233,
                columnNumber: 25
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
            lineNumber: 216,
            columnNumber: 23
          }, this),
          otherRowsFullDays.map((entry, index) => /* @__PURE__ */ jsxDEV(TableRow_default, { children: /* @__PURE__ */ jsxDEV(
            ViewAsScheduleTimeEventFullDaysRows,
            {
              period: props.period,
              entry,
              isAdding: props.isAdding
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
              lineNumber: 242,
              columnNumber: 27
            },
            this
          ) }, index, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
            lineNumber: 241,
            columnNumber: 25
          }, this)),
          firstRowInDay && /* @__PURE__ */ jsxDEV(TableRow_default, { children: /* @__PURE__ */ jsxDEV(
            ViewAsScheduleTimeEventInDaysRows,
            {
              period: props.period,
              entry: firstRowInDay,
              isAdding: props.isAdding
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
              lineNumber: 252,
              columnNumber: 27
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
            lineNumber: 251,
            columnNumber: 25
          }, this),
          otherRowsInDay.map((entry, index) => /* @__PURE__ */ jsxDEV(TableRow_default, { children: /* @__PURE__ */ jsxDEV(
            ViewAsScheduleTimeEventInDaysRows,
            {
              period: props.period,
              entry,
              isAdding: props.isAdding
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
              lineNumber: 262,
              columnNumber: 27
            },
            this
          ) }, index, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
            lineNumber: 261,
            columnNumber: 25
          }, this))
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
          lineNumber: 215,
          columnNumber: 21
        }, this),
        firstRowFullDays === void 0 && firstRowInDay && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(TableRow_default, { children: [
            props.period === import_webapi_client2.RecurringTaskPeriod.WEEKLY && /* @__PURE__ */ jsxDEV(
              TableCell_default,
              {
                rowSpan: partitionInDay.length,
                sx: {
                  verticalAlign: "top",
                  padding: "0.25rem",
                  width: isBigScreen ? "15%" : "25%"
                },
                children: isBigScreen ? DateTime.fromISO(date).toFormat("MMM-dd") : DateTime.fromISO(date).toFormat("dd MMM")
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
                lineNumber: 276,
                columnNumber: 27
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              ViewAsScheduleTimeEventInDaysRows,
              {
                period: props.period,
                entry: firstRowInDay,
                isAdding: props.isAdding
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
                lineNumber: 290,
                columnNumber: 25
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
            lineNumber: 274,
            columnNumber: 23
          }, this),
          otherRowsInDay.map((entry, index) => /* @__PURE__ */ jsxDEV(TableRow_default, { children: /* @__PURE__ */ jsxDEV(
            ViewAsScheduleTimeEventInDaysRows,
            {
              period: props.period,
              entry,
              isAdding: props.isAdding
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
              lineNumber: 299,
              columnNumber: 27
            },
            this
          ) }, index, false, {
            fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
            lineNumber: 298,
            columnNumber: 25
          }, this))
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
          lineNumber: 273,
          columnNumber: 21
        }, this)
      ] }, date, true, {
        fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
        lineNumber: 213,
        columnNumber: 17
      }, this);
    }) }, void 0, false, {
      fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
      lineNumber: 193,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
      lineNumber: 192,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
      lineNumber: 191,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/calendar/component/view-as-schedule-daily-and-weekly.tsx",
    lineNumber: 177,
    columnNumber: 5
  }, this);
}

export {
  MAX_VISIBLE_TIME_EVENT_FULL_DAYS,
  View,
  ViewAsCalendarDaysAndFullDaysContiner,
  ViewAsCalendarEmptyCell,
  ViewAsCalendarDateHeader,
  ViewAsCalendarLeftColumn,
  ViewAsCalendarRightColumn,
  ViewAsCalendarMoreButton,
  ViewAsCalendarTimeEventFullDaysColumn,
  ViewAsCalendarTimeEventInDayColumn,
  ViewAsCalendarInDayContainer,
  ViewAsCalendarGoToCell,
  ViewAsCalendarStatsCell,
  ViewAsScheduleContentCell,
  ViewAsStatsPerSubperiod,
  ViewAsCalendarDaily,
  ViewAsScheduleDailyAndWeekly
};
//# sourceMappingURL=/build/_shared/chunk-NWDPLOTZ.js.map
