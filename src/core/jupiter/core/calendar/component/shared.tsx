import {
  ADate,
  BigPlan,
  BigPlanEntry,
  BigPlanStatus,
  CalendarEventsEntries,
  CalendarEventsStats,
  Chore,
  ChoreEntry,
  Habit,
  HabitEntry,
  InboxTaskEntry,
  CalendarEventsStatsPerSubperiod,
  InboxTask,
  InboxTaskStatus,
  PersonOccasionEntry,
  ScheduleFullDaysEventEntry,
  ScheduleInDayEventEntry,
  Tag,
  TimePlanActivity,
  TimePlanActivityEntry,
  TimeEventNamespace,
  Timezone,
  TodoTask,
  TodoTaskEntry,
  VacationEntry,
  RecurringTaskPeriod,
} from "@jupiter/webapi-client";
import {
  Box,
  Button,
  styled,
  TableCell,
  Typography,
  useTheme,
} from "@mui/material";
import {
  PropsWithChildren,
  useRef,
  useState,
  useEffect,
  Fragment,
} from "react";
import { DateTime } from "luxon";
import { useNavigate, useLocation, useSearchParams } from "@remix-run/react";

import {
  CombinedTimeEventFullDaysEntry,
  scheduleTimeEventInDayDurationToRems,
  INBOX_TASK_TIME_EVENT_COLOR,
  BIG_PLAN_TIME_EVENT_COLOR,
  TODO_TASK_TIME_EVENT_COLOR,
  HABIT_TIME_EVENT_COLOR,
  CHORE_TIME_EVENT_COLOR,
  TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR,
  BIRTHDAY_TIME_EVENT_COLOR,
  occasionTimeEventName,
  VACATION_TIME_EVENT_COLOR,
  CombinedTimeEventInDayEntry,
  calendarPxHeightToMinutes,
  calculateEndTimeForTimeEvent,
  calculateStartTimeForTimeEvent,
  calendarTimeEventInDayDurationToRems,
  calendarTimeEventInDayStartMinutesToRems,
  clipTimeEventFullDaysNameToWhatFits,
  buildTimeBlockOffsetsMap,
  clipTimeEventInDayNameToWhatFits,
} from "#/core/common/sub/time_events/time-event";
import {
  scheduleStreamColorContrastingHex,
  scheduleStreamColorHex,
} from "#/core/schedule/sub/stream/color";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityLink } from "#/core/infra/component/entity-card";
import { TimeEventParamsNewPlaceholder } from "#/core/common/sub/time_events/component/params-new-placeholder";

export const MAX_VISIBLE_TIME_EVENT_FULL_DAYS = 3;

export enum View {
  CALENDAR = "calendar",
  SCHEDULE = "schedule",
}

function titleWithTags(title: string, tags: Array<Tag>): string {
  if (!tags || tags.length === 0) {
    return title;
  }

  const tagsPart = tags.map((t) => `#${t.name}`).join(" ");
  return `${title} ${tagsPart}`;
}

export interface ViewAsProps {
  rightNow: DateTime;
  today: ADate;
  timezone: Timezone;
  period: RecurringTaskPeriod;
  periodStartDate: ADate;
  periodEndDate: ADate;
  entries?: CalendarEventsEntries;
  stats?: CalendarEventsStats;
  calendarLocation: string;
  isAdding: boolean;
  showOnlyFromRightNowIfDaily?: boolean;
}

export function ViewAsCalendarDaysAndFullDaysContiner(
  props: PropsWithChildren,
) {
  const theme = useTheme();
  const isBigScreen = useBigScreen();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        minWidth: isBigScreen ? undefined : "fit-content",
        top: isBigScreen ? "-0.5rem" : "0px",
        backgroundColor: theme.palette.background.paper,
        zIndex: theme.zIndex.appBar + 1,
        borderBottom: "1px solid darkgray",
      }}
    >
      {props.children}
    </Box>
  );
}

export function ViewAsCalendarEmptyCell(props: PropsWithChildren) {
  return (
    <Box sx={{ minWidth: "3.5rem", dispaly: "flex", flexDirection: "column" }}>
      {props.children}
    </Box>
  );
}

interface ViewAsCalendarDateHeaderProps {
  today: ADate;
  date: ADate;
}

export function ViewAsCalendarDateHeader(props: ViewAsCalendarDateHeaderProps) {
  const theme = useTheme();
  const theDate = DateTime.fromISO(`${props.date}T00:00:00`);
  return (
    <Box
      sx={{
        minWidth: "7rem",
        flexGrow: "1",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          borderRadius: "50%",
          width: "50%",
          margin: "auto",
          backgroundColor:
            props.date === props.today
              ? theme.palette.info.light
              : "transparent",
        }}
      >
        <Typography sx={{ fontSize: "1.1em" }}>
          {theDate.toFormat("ccc")}
        </Typography>
        <Typography variant="h6">{theDate.toFormat("dd")}</Typography>
      </Box>
    </Box>
  );
}

interface ViewAsCalendarLeftColumnProps {
  rightNow: DateTime;
  showOnlyFromRightNowIfDaily?: boolean;
}

export function ViewAsCalendarLeftColumn(props: ViewAsCalendarLeftColumnProps) {
  const theme = useTheme();
  const deltaHour = props.showOnlyFromRightNowIfDaily ? props.rightNow.hour : 0;
  const heightInRem = 96 - deltaHour * 4;
  const hours = Array.from({ length: 24 }, (_, i) =>
    DateTime.utc(1987, 9, 18, i, 0, 0),
  );

  return (
    <Box
      sx={{
        width: "3.5rem",
        height: `${heightInRem}rem`,
        position: "sticky",
        left: "0px",
        top: "0px",
        backgroundColor: theme.palette.background.paper,
        zIndex: theme.zIndex.appBar + 1,
        borderRight: "1px solid darkgray",
      }}
    >
      {hours.map((hour, idx) => {
        if (
          props.showOnlyFromRightNowIfDaily &&
          hour.hour < props.rightNow.hour
        ) {
          return null;
        }

        return (
          <Box
            key={idx}
            sx={{
              height: "4rem",
              width: "3.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "top",
            }}
          >
            {hour.toFormat("HH:mm")}
          </Box>
        );
      })}
    </Box>
  );
}

interface ViewAsCalendarRightColumnProps {
  rightNow: DateTime;
  showOnlyFromRightNowIfDaily?: boolean;
}

export function ViewAsCalendarRightColumn(
  props: ViewAsCalendarRightColumnProps,
) {
  const deltaHour = props.showOnlyFromRightNowIfDaily ? props.rightNow.hour : 0;
  const heightInRem = 96 - deltaHour * 4;
  return (
    <Box
      sx={{
        width: "3.5rem",
        height: `${heightInRem}rem`,
      }}
    ></Box>
  );
}

interface ViewAsCalendarMoreButtonProps {
  showAllTimeEventFullDays: boolean;
  setShowAllTimeEventFullDays: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ViewAsCalendarMoreButton(props: ViewAsCalendarMoreButtonProps) {
  return (
    <Button
      variant="outlined"
      sx={{
        width: "3.5rem",
        minWidth: "3.5rem",
        height: "3.5rem",
        alignSelf: "end",
      }}
      onClick={() => props.setShowAllTimeEventFullDays((c) => !c)}
    >
      {props.showAllTimeEventFullDays ? "Show Less" : "Show More"}
    </Button>
  );
}

interface ViewAsCalendarTimeEventFullDaysColumnProps {
  today: ADate;
  date: ADate;
  showAll: boolean;
  maxFullDaysEntriesCnt: number;
  timeEventFullDays: Array<CombinedTimeEventFullDaysEntry>;
  isAdding: boolean;
}

export function ViewAsCalendarTimeEventFullDaysColumn(
  props: ViewAsCalendarTimeEventFullDaysColumnProps,
) {
  return (
    <Box sx={{ flex: 1 }}>
      {props.timeEventFullDays.map((entry, index) => {
        if (index >= MAX_VISIBLE_TIME_EVENT_FULL_DAYS && !props.showAll) {
          return null;
        }

        return (
          <ViewAsCalendarTimeEventFullDaysCell
            key={index}
            entry={entry}
            isAdding={props.isAdding}
          />
        );
      })}
    </Box>
  );
}

interface ViewAsCalendarTimeEventFullDaysCellProps {
  entry: CombinedTimeEventFullDaysEntry;
  isAdding: boolean;
}

export function ViewAsCalendarTimeEventFullDaysCell(
  props: ViewAsCalendarTimeEventFullDaysCellProps,
) {
  const [query] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(120);
  useEffect(() => {
    setContainerWidth(containerRef.current?.clientWidth || 120);
  }, [containerRef]);

  switch (props.entry.time_event.namespace) {
    case TimeEventNamespace.SCHEDULE_FULL_DAYS_BLOCK: {
      const fullDaysEntry = props.entry.entry as ScheduleFullDaysEventEntry;

      const clippedName = clipTimeEventFullDaysNameToWhatFits(
        titleWithTags(fullDaysEntry.event.name, fullDaysEntry.tags),
        12,
        containerWidth - 32, // A hack of sorts
      );

      return (
        <Box
          ref={containerRef}
          id={`schedule-event-full-days-${fullDaysEntry.event.ref_id}`}
          sx={{
            minWidth: "7rem",
            fontSize: "10px",
            backgroundColor: scheduleStreamColorHex(fullDaysEntry.stream.color),
            borderRadius: "0.25rem",
            padding: "0.25rem",
            paddingLeft: "0.5rem",
            width: "100%",
            height: "2rem",
            marginBottom: "0.25rem",
            overflow: "hidden",
          }}
        >
          <EntityLink
            key={`schedule-event-full-days-${fullDaysEntry.event.ref_id}`}
            to={`/app/workspace/calendar/schedule/event-full-days/${fullDaysEntry.event.ref_id}?${query}`}
            inline
            block={props.isAdding}
          >
            <EntityNameComponent
              name={clippedName}
              color={scheduleStreamColorContrastingHex(
                fullDaysEntry.stream.color,
              )}
            />
          </EntityLink>
        </Box>
      );
    }

    case TimeEventNamespace.PERSON_OCCASION: {
      const fullDaysEntry = props.entry.entry as PersonOccasionEntry;

      const clippedName = clipTimeEventFullDaysNameToWhatFits(
        `👨 ${occasionTimeEventName(
          props.entry.time_event,
          fullDaysEntry.contact,
          fullDaysEntry.occasion,
        )}`,
        12,
        containerWidth - 32, // A hack of sorts
      );

      return (
        <Box
          ref={containerRef}
          id={`birthday-event-${fullDaysEntry.contact.ref_id}`}
          sx={{
            minWidth: "7rem",
            fontSize: "10px",
            backgroundColor: scheduleStreamColorHex(BIRTHDAY_TIME_EVENT_COLOR),
            borderRadius: "0.25rem",
            padding: "0.25rem",
            paddingLeft: "0.5rem",
            width: "100%",
            height: "2rem",
            marginBottom: "0.25rem",
            overflow: "hidden",
          }}
        >
          <EntityLink
            key={`birthday-event-${fullDaysEntry.contact.ref_id}`}
            to={`/app/workspace/calendar/time-event/full-days-block/${fullDaysEntry.occasion_time_event.ref_id}?${query}`}
            inline
            block={props.isAdding}
          >
            <EntityNameComponent
              name={clippedName}
              color={scheduleStreamColorContrastingHex(
                BIRTHDAY_TIME_EVENT_COLOR,
              )}
            />
          </EntityLink>
        </Box>
      );
    }

    case TimeEventNamespace.VACATION: {
      const fullDaysEntry = props.entry.entry as VacationEntry;

      const clippedName = clipTimeEventFullDaysNameToWhatFits(
        `🌴 ${fullDaysEntry.vacation.name}`,
        12,
        containerWidth - 32, // A hack of sorts
      );

      return (
        <Box
          ref={containerRef}
          id={`vacation-event-${fullDaysEntry.time_event.ref_id}`}
          sx={{
            minWidth: "7rem",
            fontSize: "10px",
            backgroundColor: scheduleStreamColorHex(VACATION_TIME_EVENT_COLOR),
            borderRadius: "0.25rem",
            padding: "0.25rem",
            paddingLeft: "0.5rem",
            width: "100%",
            height: "2rem",
            marginBottom: "0.25rem",
            overflow: "hidden",
          }}
        >
          <EntityLink
            key={`vacation-event-${fullDaysEntry.time_event.ref_id}`}
            to={`/app/workspace/calendar/time-event/full-days-block/${fullDaysEntry.time_event.ref_id}?${query}`}
            inline
            block={props.isAdding}
          >
            <EntityNameComponent
              name={clippedName}
              color={scheduleStreamColorContrastingHex(
                VACATION_TIME_EVENT_COLOR,
              )}
            />
          </EntityLink>
        </Box>
      );
    }

    default:
      throw new Error("Unknown namespace");
  }
}

interface ViewAsCalendarTimeEventInDayColumnProps {
  daysToTheLeft: number;
  rightNow: DateTime;
  today: ADate;
  timezone: Timezone;
  date: ADate;
  timeEventsInDay: Array<CombinedTimeEventInDayEntry>;
  isAdding: boolean;
  showOnlyFromRightNowIfDaily?: boolean;
}

export function ViewAsCalendarTimeEventInDayColumn(
  props: ViewAsCalendarTimeEventInDayColumnProps,
) {
  const theme = useTheme();
  const location = useLocation();
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const wholeColumnRef = useRef<HTMLDivElement>(null);
  const deltaHour = props.showOnlyFromRightNowIfDaily ? props.rightNow.hour : 0;
  const heightInRem = 96 - deltaHour * 4;

  const startOfDay = DateTime.fromISO(`${props.date}T00:00:00`, {
    zone: "UTC",
  });

  const hours = Array.from({ length: 24 }, (_, i) =>
    startOfDay.plus({ hours: i }),
  );

  const timeBlockOffsetsMap = buildTimeBlockOffsetsMap(
    props.timeEventsInDay,
    startOfDay,
  );

  const theMinutes = props.rightNow
    .diff(DateTime.fromISO(`${props.today}T00:00`, { zone: props.timezone }))
    .as("minutes");

  function createNewFromDoubleClick(event: React.MouseEvent) {
    if (wholeColumnRef.current === null) {
      return;
    }

    const columnRect = wholeColumnRef.current.getBoundingClientRect();
    const offsetY = event.clientY - columnRect.top;
    const minutes = calendarPxHeightToMinutes(
      offsetY,
      theme.typography.htmlFontSize,
    );
    const time = startOfDay.plus({ minutes });
    const newQuery = new URLSearchParams(query);
    newQuery.set("sourceStartDate", time.toFormat("yyyy-MM-dd"));
    newQuery.set("sourceStartTimeInDay", time.toFormat("HH:mm"));
    if (
      location.pathname === `/app/workspace/calendar/schedule/event-in-day/new`
    ) {
      navigate(
        `/app/workspace/calendar/schedule/event-in-day/new?${newQuery}`,
        {
          replace: true,
        },
      );
    } else if (
      location.pathname.startsWith(
        `/app/workspace/calendar/schedule/event-in-day/`,
      )
    ) {
      navigate(`${location.pathname}?${newQuery}`, {
        replace: true,
      });
    } else if (
      location.pathname ===
      `/app/workspace/calendar/time-event/in-day-block/new-for-inbox-task`
    ) {
      navigate(
        `/app/workspace/calendar/time-event/in-day-block/new-for-inbox-task?${newQuery}`,
        {
          replace: true,
        },
      );
    } else if (
      location.pathname.startsWith(
        `/app/workspace/calendar/time-event/in-day-block/`,
      )
    ) {
      navigate(`${location.pathname}?${newQuery}`, {
        replace: true,
      });
    } else {
      navigate(
        `/app/workspace/calendar/schedule/event-in-day/new?${newQuery}`,
        {
          replace: true,
        },
      );
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        flexGrow: 1,
        height: `${heightInRem}rem`,
        minWidth: "7rem",
      }}
      ref={wholeColumnRef}
      onDoubleClick={createNewFromDoubleClick}
    >
      {props.today === props.date && (
        <Box
          sx={{
            position: "absolute",
            top: calendarTimeEventInDayStartMinutesToRems(
              theMinutes,
              deltaHour,
            ),
            height: "0.15rem",
            width: "100%",
            backgroundColor: theme.palette.info.dark,
            zIndex: theme.zIndex.appBar,
          }}
        ></Box>
      )}

      {hours.map((hour, idx) => {
        if (
          props.showOnlyFromRightNowIfDaily &&
          hour.hour < props.rightNow.hour
        ) {
          return null;
        }

        const locationInRem = idx * 4 - deltaHour * 4;

        return (
          <Box
            key={idx}
            sx={{
              position: "absolute",
              height: "0.05rem",
              left: "-0.05rem", // Offset for gap: 0.1 in container
              backgroundColor: theme.palette.text.disabled,
              top: `${locationInRem}rem`,
              width: "calc(100% + 0.1rem)", // Offset for gap 0.1 in container
            }}
          ></Box>
        );
      })}

      <TimeEventParamsNewPlaceholder
        daysToTheLeft={props.daysToTheLeft}
        date={props.date}
        deltaHour={deltaHour}
      />

      {props.timeEventsInDay.map((entry, index) => {
        return (
          <ViewAsCalendarTimeEventInDayCell
            key={index}
            offset={timeBlockOffsetsMap.get(entry.time_event_in_tz.ref_id) || 0}
            startOfDay={startOfDay}
            entry={entry}
            isAdding={props.isAdding}
            deltaHour={deltaHour}
          />
        );
      })}
    </Box>
  );
}

interface ViewAsCalendarTimeEventInDayCellProps {
  offset: number;
  startOfDay: DateTime;
  entry: CombinedTimeEventInDayEntry;
  isAdding: boolean;
  deltaHour: number;
}

export function ViewAsCalendarTimeEventInDayCell(
  props: ViewAsCalendarTimeEventInDayCellProps,
) {
  const [query] = useSearchParams();
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(120);
  useEffect(() => {
    setContainerWidth(containerRef.current?.clientWidth || 120);
  }, [containerRef]);

  switch (props.entry.time_event_in_tz.namespace) {
    case TimeEventNamespace.SCHEDULE_EVENT_IN_DAY: {
      const scheduleEntry = props.entry.entry as ScheduleInDayEventEntry;

      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );
      const minutesSinceStartOfDay = startTime
        .diff(props.startOfDay)
        .as("minutes");

      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        titleWithTags(scheduleEntry.event.name, scheduleEntry.tags),
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        scheduleEntry.time_event.duration_mins,
      );

      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour,
      );

      if (topRems === undefined) {
        return null;
      }

      return (
        <Box
          ref={containerRef}
          id={`schedule-event-in-day-block-${(props.entry.entry as ScheduleInDayEventEntry).event.ref_id}`}
          sx={{
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              scheduleEntry.time_event.duration_mins,
            ),
            backgroundColor: scheduleStreamColorHex(scheduleEntry.stream.color),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset,
          }}
        >
          <EntityLink
            key={`schedule-event-in-day-${scheduleEntry.event.ref_id}`}
            to={`/app/workspace/calendar/schedule/event-in-day/${scheduleEntry.event.ref_id}?${query}`}
            inline
            block={props.isAdding}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "0rem",
                left: "0.1rem",
                overflow: "hidden",
              }}
            >
              <EntityNameComponent
                name={clippedName}
                color={scheduleStreamColorContrastingHex(
                  scheduleEntry.stream.color,
                )}
              />
            </Box>
          </EntityLink>
        </Box>
      );
    }

    case TimeEventNamespace.INBOX_TASK: {
      const inboxTaskEntry = props.entry.entry as InboxTaskEntry;

      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );

      const minutesSinceStartOfDay = startTime
        .diff(props.startOfDay)
        .as("minutes");

      const nameWithStatus = inboxTaskNameForEvent(inboxTaskEntry.inbox_task);

      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        props.entry.time_event_in_tz.duration_mins,
      );

      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour,
      );

      if (topRems === undefined) {
        return null;
      }

      return (
        <Box
          ref={containerRef}
          id={`inbox-task-event-in-day-block-${(props.entry.entry as InboxTaskEntry).inbox_task.ref_id}`}
          sx={{
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins,
            ),
            backgroundColor: scheduleStreamColorHex(
              INBOX_TASK_TIME_EVENT_COLOR,
              inboxTaskEntry.inbox_task.status === InboxTaskStatus.DONE
                ? "lighter"
                : inboxTaskEntry.inbox_task.status === InboxTaskStatus.NOT_DONE
                  ? "darker"
                  : "normal",
            ),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem  - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset,
          }}
        >
          <EntityLink
            key={`inbox-task-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
            to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
            inline
            block={props.isAdding}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "0rem",
                left: "0.1rem",
                overflow: "hidden",
              }}
            >
              <EntityNameComponent
                name={clippedName}
                color={scheduleStreamColorContrastingHex(
                  INBOX_TASK_TIME_EVENT_COLOR,
                )}
              />
            </Box>
          </EntityLink>
        </Box>
      );
    }

    case TimeEventNamespace.BIG_PLAN: {
      const bigPlanEntry = props.entry.entry as BigPlanEntry;

      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );

      const minutesSinceStartOfDay = startTime
        .diff(props.startOfDay)
        .as("minutes");

      const nameWithStatus = bigPlanNameForEvent(bigPlanEntry.big_plan);

      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        props.entry.time_event_in_tz.duration_mins,
      );

      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour,
      );

      if (topRems === undefined) {
        return null;
      }

      return (
        <Box
          ref={containerRef}
          id={`big-plan-event-in-day-block-${bigPlanEntry.big_plan.ref_id}`}
          sx={{
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins,
            ),
            backgroundColor: scheduleStreamColorHex(
              BIG_PLAN_TIME_EVENT_COLOR,
              bigPlanEntry.big_plan.status === BigPlanStatus.DONE
                ? "lighter"
                : bigPlanEntry.big_plan.status === BigPlanStatus.NOT_DONE
                  ? "darker"
                  : "normal",
            ),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem  - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset,
          }}
        >
          <EntityLink
            key={`big-plan-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
            to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
            inline
            block={props.isAdding}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "0rem",
                left: "0.1rem",
                overflow: "hidden",
              }}
            >
              <EntityNameComponent
                name={clippedName}
                color={scheduleStreamColorContrastingHex(
                  BIG_PLAN_TIME_EVENT_COLOR,
                )}
              />
            </Box>
            </EntityLink>
        </Box>
      );
    }

    case TimeEventNamespace.TODO_TASK: {
      const todoTaskEntry = props.entry.entry as TodoTaskEntry;

      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );

      const minutesSinceStartOfDay = startTime
        .diff(props.startOfDay)
        .as("minutes");

      const nameWithStatus = todoTaskNameForEvent(
        todoTaskEntry.todo_task,
        todoTaskEntry.inbox_task,
      );

      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        props.entry.time_event_in_tz.duration_mins,
      );

      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour,
      );

      if (topRems === undefined) {
        return null;
      }

      return (
        <Box
          ref={containerRef}
          id={`todo-task-event-in-day-block-${todoTaskEntry.todo_task.ref_id}`}
          sx={{
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins,
            ),
            backgroundColor: scheduleStreamColorHex(
              TODO_TASK_TIME_EVENT_COLOR,
              todoTaskEntry.inbox_task.status === InboxTaskStatus.DONE
                ? "lighter"
                : todoTaskEntry.inbox_task.status === InboxTaskStatus.NOT_DONE
                  ? "darker"
                  : "normal",
            ),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem  - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset,
          }}
        >
          <EntityLink
            key={`todo-task-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
            to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
            inline
            block={props.isAdding}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "0rem",
                left: "0.1rem",
                overflow: "hidden",
              }}
            >
              <EntityNameComponent
                name={clippedName}
                color={scheduleStreamColorContrastingHex(
                  TODO_TASK_TIME_EVENT_COLOR,
                )}
              />
            </Box>
          </EntityLink>
        </Box>
      );
    }

    case TimeEventNamespace.HABIT: {
      const habitEntry = props.entry.entry as HabitEntry;

      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );

      const minutesSinceStartOfDay = startTime
        .diff(props.startOfDay)
        .as("minutes");

      const nameWithStatus = habitNameForEvent(habitEntry.habit);

      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        props.entry.time_event_in_tz.duration_mins,
      );

      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour,
      );

      if (topRems === undefined) {
        return null;
      }

      return (
        <Box
          ref={containerRef}
          id={`habit-event-in-day-block-${habitEntry.habit.ref_id}`}
          sx={{
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins,
            ),
            backgroundColor: scheduleStreamColorHex(HABIT_TIME_EVENT_COLOR),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem  - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset,
          }}
        >
          <EntityLink
            key={`habit-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
            to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
            inline
            block={props.isAdding}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "0rem",
                left: "0.1rem",
                overflow: "hidden",
              }}
            >
              <EntityNameComponent
                name={clippedName}
                color={scheduleStreamColorContrastingHex(
                  HABIT_TIME_EVENT_COLOR,
                )}
              />
            </Box>
          </EntityLink>
        </Box>
      );
    }

    case TimeEventNamespace.CHORE: {
      const choreEntry = props.entry.entry as ChoreEntry;

      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );

      const minutesSinceStartOfDay = startTime
        .diff(props.startOfDay)
        .as("minutes");

      const nameWithStatus = choreNameForEvent(choreEntry.chore);

      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        props.entry.time_event_in_tz.duration_mins,
      );

      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour,
      );

      if (topRems === undefined) {
        return null;
      }

      return (
        <Box
          ref={containerRef}
          id={`chore-event-in-day-block-${choreEntry.chore.ref_id}`}
          sx={{
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins,
            ),
            backgroundColor: scheduleStreamColorHex(CHORE_TIME_EVENT_COLOR),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem  - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset,
          }}
        >
          <EntityLink
            key={`chore-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
            to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
            inline
            block={props.isAdding}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "0rem",
                left: "0.1rem",
                overflow: "hidden",
              }}
            >
              <EntityNameComponent
                name={clippedName}
                color={scheduleStreamColorContrastingHex(
                  CHORE_TIME_EVENT_COLOR,
                )}
              />
            </Box>
          </EntityLink>
        </Box>
      );
    }

    case TimeEventNamespace.TIME_PLAN_ACTIVITY: {
      const activityEntry = props.entry.entry as TimePlanActivityEntry;

      const startTime = calculateStartTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );
      const endTime = calculateEndTimeForTimeEvent(
        props.entry.time_event_in_tz,
      );

      const minutesSinceStartOfDay = startTime
        .diff(props.startOfDay)
        .as("minutes");

      const nameWithStatus = timePlanActivityNameForEvent(
        activityEntry,
      );

      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        theme.typography.htmlFontSize,
        containerWidth,
        minutesSinceStartOfDay,
        props.entry.time_event_in_tz.duration_mins,
      );

      const topRems = calendarTimeEventInDayStartMinutesToRems(
        minutesSinceStartOfDay,
        props.deltaHour,
      );

      if (topRems === undefined) {
        return null;
      }

      return (
        <Box
          ref={containerRef}
          id={`time-plan-activity-event-in-day-block-${activityEntry.time_plan_activity.ref_id}`}
          sx={{
            fontSize: "10px",
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins,
            ),
            backgroundColor: scheduleStreamColorHex(
              TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR,
            ),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            minWidth: `calc(7rem - ${props.offset * 0.8}rem  - 0.5rem)`,
            width: `calc(100% - ${props.offset * 0.8}rem - 0.5rem)`,
            marginLeft: `${props.offset * 0.8}rem`,
            zIndex: props.offset,
          }}
        >
          <EntityLink
            key={`time-plan-activity-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
            to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
            inline
            block={props.isAdding}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "0rem",
                left: "0.1rem",
                overflow: "hidden",
              }}
            >
              <EntityNameComponent
                name={clippedName}
                color={scheduleStreamColorContrastingHex(
                  TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR,
                )}
              />
            </Box>
          </EntityLink>
        </Box>
      );
    }

    default:
      throw new Error("Unkown namespace");
  }
}

export function ViewAsCalendarInDayContainer(props: PropsWithChildren) {
  const isBigScreen = useBigScreen();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "0.1rem",
        position: "relative",
        minWidth: isBigScreen ? undefined : "fit-content",
      }}
    >
      {props.children}
    </Box>
  );
}

interface ViewAsCalendarGoToCellProps {
  label: string;
  period: RecurringTaskPeriod;
  periodStart: string;
  calendarLocation: string;
}

export function ViewAsCalendarGoToCell(props: ViewAsCalendarGoToCellProps) {
  return (
    <Box
      sx={{
        minWidth: "3rem",
        height: "100%",
        border: "1px solid darkgray",
        borderRadius: "0.25rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <EntityLink
        to={`/app/workspace/calendar${props.calendarLocation}?date=${props.periodStart}&period=${props.period}&view=calendar`}
      >
        <Typography variant="h6">{props.label}</Typography>
      </EntityLink>
    </Box>
  );
}

interface ViewAsCalendarStatsCellProps {
  label: string;
  forceColumn: boolean;
  showCompact: boolean;
  stats: CalendarEventsStatsPerSubperiod;
  calendarLocation: string;
}

export function ViewAsCalendarStatsCell(props: ViewAsCalendarStatsCellProps) {
  return (
    <Box
      sx={{
        border: "1px solid darkgray",
        borderRadius: "0.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        padding: "0.25rem",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6">{props.label}</Typography>
      <ViewAsStatsPerSubperiod
        forceColumn={props.forceColumn}
        showCompact={props.showCompact}
        view={View.CALENDAR}
        stats={props.stats}
        calendarLocation={props.calendarLocation}
      />
    </Box>
  );
}

interface ViewAsScheduleTimeEventFullDaysRowsProps {
  entry: CombinedTimeEventFullDaysEntry;
  isAdding: boolean;
  period: RecurringTaskPeriod;
}

export function ViewAsScheduleTimeEventFullDaysRows(
  props: ViewAsScheduleTimeEventFullDaysRowsProps,
) {
  const [query] = useSearchParams();
  const isBigScreen = useBigScreen();

  switch (props.entry.time_event.namespace) {
    case TimeEventNamespace.SCHEDULE_FULL_DAYS_BLOCK: {
      const fullDaysEntry = props.entry.entry as ScheduleFullDaysEventEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeCell
            period={props.period}
            isbigscreen={isBigScreen.toString()}
          >
            [All Day]
          </ViewAsScheduleTimeCell>

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(fullDaysEntry.stream.color)}
            height="0.25rem"
          >
            <EntityLink
              light
              key={`schedule-event-full-days-${fullDaysEntry.event.ref_id}`}
              to={`/app/workspace/calendar/schedule/event-full-days/${fullDaysEntry.event.ref_id}?${query}`}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={titleWithTags(
                  fullDaysEntry.event.name,
                  fullDaysEntry.tags,
                )}
                color={scheduleStreamColorContrastingHex(
                  fullDaysEntry.stream.color,
                )}
              />
            </EntityLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case TimeEventNamespace.PERSON_OCCASION: {
      const fullDaysEntry = props.entry.entry as PersonOccasionEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeCell
            period={props.period}
            isbigscreen={isBigScreen.toString()}
          >
            [All Day]
          </ViewAsScheduleTimeCell>

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(BIRTHDAY_TIME_EVENT_COLOR)}
            height="0.25rem"
          >
            <EntityLink
              light
              key={`schedule-event-full-days-${fullDaysEntry.occasion_time_event.ref_id}`}
              to={`/app/workspace/calendar/time-event/full-days-block/${fullDaysEntry.occasion_time_event.ref_id}?${query}`}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={`👨 ${occasionTimeEventName(
                  fullDaysEntry.occasion_time_event,
                  fullDaysEntry.contact,
                  fullDaysEntry.occasion,
                )}`}
                color={scheduleStreamColorContrastingHex(
                  BIRTHDAY_TIME_EVENT_COLOR,
                )}
              />
            </EntityLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case TimeEventNamespace.VACATION: {
      const fullDaysEntry = props.entry.entry as VacationEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeCell
            period={props.period}
            isbigscreen={isBigScreen.toString()}
          >
            [All Day]
          </ViewAsScheduleTimeCell>

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(VACATION_TIME_EVENT_COLOR)}
            height="0.25rem"
          >
            <EntityLink
              light
              key={`schedule-event-full-days-${fullDaysEntry.time_event.ref_id}`}
              to={`/app/workspace/calendar/time-event/full-days-block/${fullDaysEntry.time_event.ref_id}?${query}`}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={`🌴 ${fullDaysEntry.vacation.name}`}
                color={scheduleStreamColorContrastingHex(
                  VACATION_TIME_EVENT_COLOR,
                )}
              />
            </EntityLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    default:
      throw new Error("Unkown namespace");
  }
}

interface ViewAsScheduleTimeEventInDaysRowsProps {
  period: RecurringTaskPeriod;
  entry: CombinedTimeEventInDayEntry;
  isAdding: boolean;
}

export function ViewAsScheduleTimeEventInDaysRows(
  props: ViewAsScheduleTimeEventInDaysRowsProps,
) {
  const [query] = useSearchParams();
  const isBigScreen = useBigScreen();

  const startTime = calculateStartTimeForTimeEvent(
    props.entry.time_event_in_tz,
  );
  const endTime = calculateEndTimeForTimeEvent(props.entry.time_event_in_tz);

  switch (props.entry.time_event_in_tz.namespace) {
    case TimeEventNamespace.SCHEDULE_EVENT_IN_DAY: {
      const scheduleEntry = props.entry.entry as ScheduleInDayEventEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeCell
            period={props.period}
            isbigscreen={isBigScreen.toString()}
          >
            [{startTime.toFormat("HH:mm")} - {endTime.toFormat("HH:mm")}]
          </ViewAsScheduleTimeCell>

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(scheduleEntry.stream.color)}
            height={scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins,
            )}
          >
            <EntityLink
              light
              key={`schedule-event-in-day-${scheduleEntry.event.ref_id}`}
              to={`/app/workspace/calendar/schedule/event-in-day/${scheduleEntry.event.ref_id}?${query}`}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={titleWithTags(
                  scheduleEntry.event.name,
                  scheduleEntry.tags,
                )}
                color={scheduleStreamColorContrastingHex(
                  scheduleEntry.stream.color,
                )}
              />
            </EntityLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case TimeEventNamespace.INBOX_TASK: {
      const inboxTaskEntry = props.entry.entry as InboxTaskEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeCell
            period={props.period}
            isbigscreen={isBigScreen.toString()}
          >
            [{startTime.toFormat("HH:mm")} - {endTime.toFormat("HH:mm")}]
          </ViewAsScheduleTimeCell>

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(
              INBOX_TASK_TIME_EVENT_COLOR,
              inboxTaskEntry.inbox_task.status === InboxTaskStatus.DONE
                ? "lighter"
                : inboxTaskEntry.inbox_task.status === InboxTaskStatus.NOT_DONE
                  ? "darker"
                  : "normal",
            )}
            height={scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins,
            )}
          >
            <EntityLink
              light
              key={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
              to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={inboxTaskNameForEvent(inboxTaskEntry.inbox_task)}
                color={scheduleStreamColorContrastingHex(
                  INBOX_TASK_TIME_EVENT_COLOR,
                )}
              />
            </EntityLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case TimeEventNamespace.BIG_PLAN: {
      const bigPlanEntry = props.entry.entry as BigPlanEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeCell
            period={props.period}
            isbigscreen={isBigScreen.toString()}
          >
            [{startTime.toFormat("HH:mm")} - {endTime.toFormat("HH:mm")}]
          </ViewAsScheduleTimeCell>

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(
              BIG_PLAN_TIME_EVENT_COLOR,
              bigPlanEntry.big_plan.status === BigPlanStatus.DONE
                ? "lighter"
                : bigPlanEntry.big_plan.status === BigPlanStatus.NOT_DONE
                  ? "darker"
                  : "normal",
            )}
            height={scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins,
            )}
          >
            <EntityLink
              light
              key={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
              to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={bigPlanNameForEvent(bigPlanEntry.big_plan)}
                color={scheduleStreamColorContrastingHex(
                  BIG_PLAN_TIME_EVENT_COLOR,
                )}
              />
            </EntityLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case TimeEventNamespace.TODO_TASK: {
      const todoTaskEntry = props.entry.entry as TodoTaskEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeCell
            period={props.period}
            isbigscreen={isBigScreen.toString()}
          >
            [{startTime.toFormat("HH:mm")} - {endTime.toFormat("HH:mm")}]
          </ViewAsScheduleTimeCell>

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(
              TODO_TASK_TIME_EVENT_COLOR,
              todoTaskEntry.inbox_task.status === InboxTaskStatus.DONE
                ? "lighter"
                : todoTaskEntry.inbox_task.status === InboxTaskStatus.NOT_DONE
                  ? "darker"
                  : "normal",
            )}
            height={scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins,
            )}
          >
            <EntityLink
              light
              key={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
              to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={todoTaskNameForEvent(
                  todoTaskEntry.todo_task,
                  todoTaskEntry.inbox_task,
                )}
                color={scheduleStreamColorContrastingHex(
                  TODO_TASK_TIME_EVENT_COLOR,
                )}
              />
            </EntityLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case TimeEventNamespace.HABIT: {
      const habitEntry = props.entry.entry as HabitEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeCell
            period={props.period}
            isbigscreen={isBigScreen.toString()}
          >
            [{startTime.toFormat("HH:mm")} - {endTime.toFormat("HH:mm")}]
          </ViewAsScheduleTimeCell>

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(HABIT_TIME_EVENT_COLOR)}
            height={scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins,
            )}
          >
            <EntityLink
              light
              key={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
              to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={habitNameForEvent(habitEntry.habit)}
                color={scheduleStreamColorContrastingHex(
                  HABIT_TIME_EVENT_COLOR,
                )}
              />
            </EntityLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case TimeEventNamespace.CHORE: {
      const choreEntry = props.entry.entry as ChoreEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeCell
            period={props.period}
            isbigscreen={isBigScreen.toString()}
          >
            [{startTime.toFormat("HH:mm")} - {endTime.toFormat("HH:mm")}]
          </ViewAsScheduleTimeCell>

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(CHORE_TIME_EVENT_COLOR)}
            height={scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins,
            )}
          >
            <EntityLink
              light
              key={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
              to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={choreNameForEvent(choreEntry.chore)}
                color={scheduleStreamColorContrastingHex(
                  CHORE_TIME_EVENT_COLOR,
                )}
              />
            </EntityLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case TimeEventNamespace.TIME_PLAN_ACTIVITY: {
      const activityEntry = props.entry.entry as TimePlanActivityEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeCell
            period={props.period}
            isbigscreen={isBigScreen.toString()}
          >
            [{startTime.toFormat("HH:mm")} - {endTime.toFormat("HH:mm")}]
          </ViewAsScheduleTimeCell>

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(
              TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR,
            )}
            height={scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins,
            )}
          >
            <EntityLink
              light
              key={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
              to={`/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?${query}`}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={timePlanActivityNameForEvent(
                  activityEntry,
                )}
                color={scheduleStreamColorContrastingHex(
                  TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR,
                )}
              />
            </EntityLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    default:
      throw new Error("Unkown namespace");
  }
}

type ViewAsScheduleDateCellComponent = React.ComponentType;

export const ViewAsScheduleDateCell: ViewAsScheduleDateCellComponent = styled(
  TableCell,
)(() => ({
  verticalAlign: "top",
  padding: "0.25rem",
}));

type ViewAsScheduleContentCellComponent = React.ComponentType<{
  children: React.ReactNode;
}>;

export const ViewAsScheduleContentCell: ViewAsScheduleContentCellComponent =
  styled(TableCell)({
    padding: "0.25rem",
  });

interface ViewAsScheduleTimeCellProps {
  isbigscreen: string;
  period: RecurringTaskPeriod;
}

type ViewAsScheduleTimeCellComponent = React.ComponentType<
  ViewAsScheduleTimeCellProps & { children: React.ReactNode }
>;

export const ViewAsScheduleTimeCell: ViewAsScheduleTimeCellComponent = styled(
  TableCell,
)<ViewAsScheduleTimeCellProps>(({ isbigscreen, period }) => ({
  verticalAlign: "top",
  padding: "0.25rem",
  width:
    isbigscreen === "false" || period === RecurringTaskPeriod.DAILY
      ? "30%"
      : "15%",
}));

interface ViewAsScheduleEventCellProps {
  color: string;
  height: string;
}

type ViewAsScheduleEventCellComponent = React.ComponentType<
  ViewAsScheduleEventCellProps & { children: React.ReactNode }
>;

export const ViewAsScheduleEventCell: ViewAsScheduleEventCellComponent = styled(
  TableCell,
)<ViewAsScheduleEventCellProps>(({ color, height }) => ({
  verticalAlign: "top",
  backgroundColor: color,
  padding: "0.25rem",
  paddingLeft: "0.5rem",
  paddingBottom: height,
  borderRadius: "0.25rem",
}));

interface ViewAsStatsPerSubperiodProps {
  forceColumn: boolean;
  showCompact: boolean;
  view: View;
  stats: CalendarEventsStatsPerSubperiod;
  calendarLocation: string;
}

export function ViewAsStatsPerSubperiod(props: ViewAsStatsPerSubperiodProps) {
  return (
    <EntityLink
      to={`/app/workspace/calendar${props.calendarLocation}?date=${props.stats.period_start_date}&period=${props.stats.period}&view=${props.view}`}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: props.forceColumn ? "column" : "row",
          gap: "0.25rem",
          flexWrap: "wrap",
        }}
      >
        <span>
          📅 {props.stats.schedule_event_full_days_cnt}{" "}
          {!props.showCompact ? "from scheduled full day events" : ""}
        </span>
        <span>
          ⌚ {props.stats.schedule_event_in_day_cnt}{" "}
          {!props.showCompact ? "from scheduled in day events" : ""}
        </span>
        <span>
          📥 {props.stats.inbox_task_cnt}{" "}
          {!props.showCompact ? "from inbox task" : ""}
        </span>
        <span>
          🎯 {props.stats.big_plan_cnt}{" "}
          {!props.showCompact ? "from big plan" : ""}
        </span>
        <span>
          📝 {props.stats.todo_task_cnt}{" "}
          {!props.showCompact ? "from todo task" : ""}
        </span>
        <span>
          🔄 {props.stats.habit_cnt}{" "}
          {!props.showCompact ? "from habit" : ""}
        </span>
        <span>
          🧹 {props.stats.chore_cnt}{" "}
          {!props.showCompact ? "from chore" : ""}
        </span>
        <span>
          📋 {props.stats.time_plan_activity_cnt}{" "}
          {!props.showCompact ? "from activities" : ""}
        </span>
        <span>
          👨 {props.stats.person_birthday_cnt}{" "}
          {!props.showCompact ? "from birthdays" : ""}
        </span>
        <span>
          🌴 {props.stats.vacation_cnt}{" "}
          {!props.showCompact ? "from Vacations" : ""}
        </span>
      </Box>
    </EntityLink>
  );
}

export function inboxTaskNameForEvent(inboxTask: InboxTask): string {
  if (inboxTask.status === InboxTaskStatus.DONE) {
    return `✅ ${inboxTask.name}`;
  } else if (inboxTask.status === InboxTaskStatus.NOT_DONE) {
    return `❌ ${inboxTask.name}`;
  } else {
    return `${inboxTask.name}`;
  }
}

export function bigPlanNameForEvent(bigPlan: BigPlan): string {
  if (bigPlan.status === BigPlanStatus.DONE) {
    return `✅ ${bigPlan.name}`;
  } else if (bigPlan.status === BigPlanStatus.NOT_DONE) {
    return `❌ ${bigPlan.name}`;
  } else {
    return `${bigPlan.name}`;
  }
}

export function todoTaskNameForEvent(
  todoTask: TodoTask,
  inboxTask: InboxTask,
): string {
  if (inboxTask.status === InboxTaskStatus.DONE) {
    return `✅ ${todoTask.name}`;
  } else if (inboxTask.status === InboxTaskStatus.NOT_DONE) {
    return `❌ ${todoTask.name}`;
  } else {
    return `${todoTask.name}`;
  }
}

export function habitNameForEvent(habit: Habit): string {
  return `🔄 ${habit.name}`;
}

export function choreNameForEvent(chore: Chore): string {
  return `🧹 ${chore.name}`;
}

export function timePlanActivityNameForEvent(
  entry: TimePlanActivityEntry,
): string {
  if (entry.target_inbox_task) {
    if (entry.target_inbox_task.status === InboxTaskStatus.DONE) {
      return `✅ ${entry.time_plan_activity.name}`;
    } else if (entry.target_inbox_task.status === InboxTaskStatus.NOT_DONE) {
      return `❌ ${entry.time_plan_activity.name}`;
    }
  }
  if (entry.target_big_plan) {
    if (entry.target_big_plan.status === BigPlanStatus.DONE) {
      return `✅ ${entry.time_plan_activity.name}`;
    } else if (entry.target_big_plan.status === BigPlanStatus.NOT_DONE) {
      return `❌ ${entry.time_plan_activity.name}`;
    }
  }
  return `📋 ${entry.time_plan_activity.name}`;
}
