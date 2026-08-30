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
  CalendarEventsStatsPerSubperiod,
  InboxTask,
  InboxTaskStatus,
  NamedEntityTag,
  PersonOccasionEntry,
  ScheduleFullDaysEventEntry,
  ScheduleInDayEventEntry,
  Tag,
  TimePlanActivityEntry,
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
  Table,
  TableBody,
  TableCell,
  TableRow,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import {
  PropsWithChildren,
  useRef,
  useState,
  useEffect,
  useMemo,
  Fragment,
  useContext,
} from "react";
import { DateTime } from "luxon";
import { useNavigate, useLocation, useSearchParams } from "@remix-run/react";

import { parseEntityLinkStd } from "#/core/common/entity-link";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { UserLightChip } from "#/core/users/components/user-light-chip";
import {
  CombinedTimeEventFullDaysEntry,
  scheduleTimeEventInDayDurationToRems,
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
  DEFAULT_TIME_BLOCK_LAYOUT,
  inDayEventLayoutSx,
  InDayEventOverlapStyle,
  TimeBlockLayout,
  clipTimeEventInDayNameToWhatFits,
  timeEventInDayBlockOwnerTheType,
  findNearbyTimeEventInDayEntries,
  NEARBY_TIME_EVENT_WINDOW_MINS,
  calendarTimeEventInDayBufferToRems,
  timeEventInDayBuffersLabel,
} from "#/core/common/sub/time_events/time-event";
import {
  scheduleStreamColorContrastingHex,
  scheduleStreamColorHex,
} from "#/core/apps/schedule/sub/stream/color";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityLink } from "#/core/infra/component/entity-card";
import {
  CalendarEventLink,
  OpenCalendarInDayEvent,
  useCalendarNavigation,
  useCalendarStatsPath,
  useOpenCalendarInDayEvent,
} from "#/core/calendar/component/calendar-navigation";
import {
  OverlappingEventsPeekPanel,
  OverlappingEventsPeekTriggerProps,
  useOverlappingEventsPeek,
} from "#/core/calendar/component/overlapping-events-peek";
import {
  CalendarEventDragBinding,
  CalendarEventResizeHandle,
  CalendarPlaceGhost,
  calendarEventSelectionKey,
  useCalendarDayColumn,
  useCalendarEventDrag,
  useCalendarEventDragActive,
  useCalendarEventSelection,
} from "#/core/calendar/component/event-drag";
import { TimeEventParamsNewPlaceholder } from "#/core/common/sub/time_events/component/params-new-placeholder";
import { timePlanActivityNameForEvent } from "#/core/apps/time_plans/sub/activity/root";
import { timePlanPathIsAddingTimeEvent } from "#/core/apps/time_plans/view-mode";

export const MAX_VISIBLE_TIME_EVENT_FULL_DAYS = 3;

// How large an event's name is drawn on the calendar. The clip helpers
// measure against this same size so a long name is cut where it actually
// runs out of room.
const CALENDAR_EVENT_NAME_FONT_PX = 10;

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

function inDayEventIsOpen(
  entry: CombinedTimeEventInDayEntry,
  open: OpenCalendarInDayEvent | null,
): boolean {
  if (open === null) {
    return false;
  }

  switch (open.kind) {
    case "schedule-event-in-day": {
      if (
        timeEventInDayBlockOwnerTheType(entry.time_event_in_tz) !==
        NamedEntityTag.SCHEDULE_EVENT_IN_DAY
      ) {
        return false;
      }
      const scheduleEntry = entry.entry as ScheduleInDayEventEntry;
      return scheduleEntry.event.ref_id === open.refId;
    }
    case "time-event-in-day-block": {
      const pieceRefId = entry.time_event_in_tz.ref_id;
      const wholeRefId =
        entry.split_from?.whole_time_event_in_tz.ref_id ?? pieceRefId;
      return pieceRefId === open.refId || wholeRefId === open.refId;
    }
    case "time-plan-activity": {
      if (
        timeEventInDayBlockOwnerTheType(entry.time_event_in_tz) !==
        NamedEntityTag.TIME_PLAN_ACTIVITY
      ) {
        return false;
      }
      const activityEntry = entry.entry as TimePlanActivityEntry;
      return activityEntry.time_plan_activity.ref_id === open.refId;
    }
  }
}

// A ring on the event's own box - same width as the event, including when
// overlapping events have put it in a narrower lane or pushed it aside.
function selectedCalendarEventSx(
  theme: Theme,
  selected: boolean,
  offset: number,
) {
  if (!selected) {
    return {};
  }

  return {
    boxShadow: `inset 0 0 0 3px ${theme.palette.info.main}`,
    zIndex: offset + 8,
  };
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
  // Whether a single day spreads over whatever room it's been given, rather
  // than keeping to the narrow column the calendar shows it in.
  fillWidth?: boolean;
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
  const topLevelInfo = useContext(TopLevelInfoContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(120);
  useEffect(() => {
    setContainerWidth(containerRef.current?.clientWidth || 120);
  }, [containerRef]);

  const { theType } = parseEntityLinkStd(props.entry.time_event.owner);
  switch (theType) {
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS: {
      const fullDaysEntry = props.entry.entry as ScheduleFullDaysEventEntry;

      const clippedName = clipTimeEventFullDaysNameToWhatFits(
        titleWithTags(fullDaysEntry.event.name, fullDaysEntry.tags),
        CALENDAR_EVENT_NAME_FONT_PX,
        containerWidth - 32, // A hack of sorts
      );

      return (
        <Box
          ref={containerRef}
          id={`schedule-event-full-days-${fullDaysEntry.event.ref_id}`}
          sx={{
            position: "relative",
            minWidth: "7rem",
            fontSize: `${CALENDAR_EVENT_NAME_FONT_PX}px`,
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
          <UserLightChip
            user={fullDaysEntry.owner}
            currentUserRefId={topLevelInfo.user.ref_id}
          />
          <CalendarEventLink
            key={`schedule-event-full-days-${fullDaysEntry.event.ref_id}`}
            kind="schedule-event-full-days"
            refId={fullDaysEntry.event.ref_id}
            inline
            block={props.isAdding}
          >
            <EntityNameComponent
              name={clippedName}
              color={scheduleStreamColorContrastingHex(
                fullDaysEntry.stream.color,
              )}
            />
          </CalendarEventLink>
        </Box>
      );
    }

    case NamedEntityTag.OCCASION: {
      const fullDaysEntry = props.entry.entry as PersonOccasionEntry;

      const clippedName = clipTimeEventFullDaysNameToWhatFits(
        `👨 ${occasionTimeEventName(
          props.entry.time_event,
          fullDaysEntry.contact,
          fullDaysEntry.occasion,
        )}`,
        CALENDAR_EVENT_NAME_FONT_PX,
        containerWidth - 32, // A hack of sorts
      );

      return (
        <Box
          ref={containerRef}
          id={`birthday-event-${fullDaysEntry.contact.ref_id}`}
          sx={{
            minWidth: "7rem",
            fontSize: `${CALENDAR_EVENT_NAME_FONT_PX}px`,
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
          <CalendarEventLink
            key={`birthday-event-${fullDaysEntry.contact.ref_id}`}
            kind="time-event-full-days-block"
            refId={fullDaysEntry.occasion_time_event.ref_id}
            inline
            block={props.isAdding}
          >
            <EntityNameComponent
              name={clippedName}
              color={scheduleStreamColorContrastingHex(
                BIRTHDAY_TIME_EVENT_COLOR,
              )}
            />
          </CalendarEventLink>
        </Box>
      );
    }

    case NamedEntityTag.VACATION: {
      const fullDaysEntry = props.entry.entry as VacationEntry;

      const clippedName = clipTimeEventFullDaysNameToWhatFits(
        `🌴 ${fullDaysEntry.vacation.name}`,
        CALENDAR_EVENT_NAME_FONT_PX,
        containerWidth - 32, // A hack of sorts
      );

      return (
        <Box
          ref={containerRef}
          id={`vacation-event-${fullDaysEntry.time_event.ref_id}`}
          sx={{
            minWidth: "7rem",
            fontSize: `${CALENDAR_EVENT_NAME_FONT_PX}px`,
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
          <CalendarEventLink
            key={`vacation-event-${fullDaysEntry.time_event.ref_id}`}
            kind="time-event-full-days-block"
            refId={fullDaysEntry.time_event.ref_id}
            inline
            block={props.isAdding}
          >
            <EntityNameComponent
              name={clippedName}
              color={scheduleStreamColorContrastingHex(
                VACATION_TIME_EVENT_COLOR,
              )}
            />
          </CalendarEventLink>
        </Box>
      );
    }

    default:
      throw new Error(`Unknown full-days time event owner type: ${theType}`);
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
  overlapStyle: InDayEventOverlapStyle;
}

export function ViewAsCalendarTimeEventInDayColumn(
  props: ViewAsCalendarTimeEventInDayColumnProps,
) {
  const theme = useTheme();
  const location = useLocation();
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const calendarNavigation = useCalendarNavigation();
  const wholeColumnRef = useRef<HTMLDivElement>(null);
  const deltaHour = props.showOnlyFromRightNowIfDaily ? props.rightNow.hour : 0;
  const heightInRem = 96 - deltaHour * 4;

  const startOfDay = DateTime.fromISO(`${props.date}T00:00:00`, {
    zone: "UTC",
  });

  useCalendarDayColumn(props.date, wholeColumnRef);

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
    if (timePlanPathIsAddingTimeEvent(location.pathname)) {
      navigate(`${location.pathname}?${newQuery}`, {
        replace: true,
      });
    } else if (
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
      location.pathname.startsWith(
        `/app/workspace/calendar/time-event/in-day-block/`,
      )
    ) {
      navigate(`${location.pathname}?${newQuery}`, {
        replace: true,
      });
    } else {
      const newEventPath = calendarNavigation.newInDayEventPath(newQuery);
      if (newEventPath === undefined) {
        return;
      }

      navigate(newEventPath, {
        replace: true,
      });
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
      <CalendarPlaceGhost date={props.date} deltaHour={deltaHour} />

      {props.timeEventsInDay.map((entry, index) => {
        return (
          <ViewAsCalendarTimeEventInDayCell
            key={index}
            layout={
              timeBlockOffsetsMap.get(entry.time_event_in_tz.ref_id) ??
              DEFAULT_TIME_BLOCK_LAYOUT
            }
            overlapStyle={props.overlapStyle}
            startOfDay={startOfDay}
            entry={entry}
            allEntriesInDay={props.timeEventsInDay}
            isAdding={props.isAdding}
            deltaHour={deltaHour}
          />
        );
      })}
    </Box>
  );
}

interface ViewAsCalendarTimeEventInDayCellProps {
  layout: TimeBlockLayout;
  overlapStyle: InDayEventOverlapStyle;
  startOfDay: DateTime;
  entry: CombinedTimeEventInDayEntry;
  allEntriesInDay: Array<CombinedTimeEventInDayEntry>;
  isAdding: boolean;
  deltaHour: number;
}

export function ViewAsCalendarTimeEventInDayCell(
  props: ViewAsCalendarTimeEventInDayCellProps,
) {
  const isBigScreen = useBigScreen();

  const nearbyEntries = useMemo(
    () => findNearbyTimeEventInDayEntries(props.allEntriesInDay, props.entry),
    [props.allEntriesInDay, props.entry],
  );

  // There's nothing worth peeking at when the event stands on its own.
  const otherNearbyEntriesCnt = nearbyEntries.length - 1;
  const drag = useCalendarEventDrag(props.entry);
  const dragIsActive = useCalendarEventDragActive();
  const openInDayEvent = useOpenCalendarInDayEvent();
  const selected = inDayEventIsOpen(props.entry, openInDayEvent);
  const selection = useCalendarEventSelection();
  const selectionKey = calendarEventSelectionKey(props.entry);
  const peek = useOverlappingEventsPeek({
    enabled: isBigScreen && otherNearbyEntriesCnt > 0 && !dragIsActive,
  });

  useEffect(() => {
    if (selection.selectedBlockRefId !== null) {
      return;
    }
    if (selected) {
      selection.selectBlock(selectionKey);
    }
  }, [selected, selection, selectionKey]);

  const startTime = calculateStartTimeForTimeEvent(
    props.entry.time_event_in_tz,
  );
  const endTime = calculateEndTimeForTimeEvent(props.entry.time_event_in_tz);

  const eventTriggerProps: ViewAsCalendarTimeEventInDayTriggerProps = {
    ...peek.triggerProps,
    ...drag.handleProps,
    onClick: () => {
      selection.selectBlock(selectionKey);
    },
    onContextMenu: (event) => {
      // A long press on a phone raises the context menu on top of the drag it
      // was meant to start.
      if (drag.isPressing()) {
        event.preventDefault();
        return;
      }

      peek.triggerProps.onContextMenu(event);
    },
  };

  return (
    <Fragment>
      <ViewAsCalendarTimeEventInDayBuffers
        layout={props.layout}
        overlapStyle={props.overlapStyle}
        startOfDay={props.startOfDay}
        entry={props.entry}
        deltaHour={props.deltaHour}
      />

      <ViewAsCalendarTimeEventInDayCellContent
        {...props}
        eventTriggerProps={eventTriggerProps}
      />

      <CalendarEventResizeHandle
        entry={props.entry}
        layout={props.layout}
        overlapStyle={props.overlapStyle}
        startOfDay={props.startOfDay}
        deltaHour={props.deltaHour}
      />

      <OverlappingEventsPeekPanel
        peek={peek}
        title={`Around [${startTime.toFormat("HH:mm")} - ${endTime.toFormat(
          "HH:mm",
        )}]`}
        subtitle={`${otherNearbyEntriesCnt} other event${
          otherNearbyEntriesCnt === 1 ? "" : "s"
        } overlapping it, or within ${NEARBY_TIME_EVENT_WINDOW_MINS} minutes before or after`}
      >
        <Table
          size="small"
          sx={{ borderCollapse: "separate", borderSpacing: "0.2rem" }}
        >
          <TableBody>
            {nearbyEntries.map((nearbyEntry) => (
              <OverlappingEventsPeekRow
                key={nearbyEntry.time_event_in_tz.ref_id}
                entry={nearbyEntry}
                isFocused={
                  nearbyEntry.time_event_in_tz.ref_id ===
                  props.entry.time_event_in_tz.ref_id
                }
                isAdding={props.isAdding}
              />
            ))}
          </TableBody>
        </Table>
      </OverlappingEventsPeekPanel>
    </Fragment>
  );
}

interface OverlappingEventsPeekRowProps {
  entry: CombinedTimeEventInDayEntry;
  isFocused: boolean;
  isAdding: boolean;
}

// One event in the peek panel, held the same way as on the calendar so it
// can come loose and be dropped somewhere else. The event slides on the
// grid from the slot under the pointer, rather than from where it already sat.
function OverlappingEventsPeekRow(props: OverlappingEventsPeekRowProps) {
  const theme = useTheme();
  const drag = useCalendarEventDrag(props.entry, { followPointer: true });
  const canDrag = drag.handleProps.onPointerDown !== undefined;

  return (
    <TableRow
      onPointerDownCapture={drag.handleProps.onPointerDown}
      onClickCapture={drag.handleProps.onClickCapture}
      onContextMenu={(event) => {
        if (drag.isPressing()) {
          event.preventDefault();
        }
      }}
      onDragStart={(event) => event.preventDefault()}
      sx={{
        cursor: canDrag ? "grab" : undefined,
        "& a": { WebkitUserDrag: "none" },
        "& td": {
          border: props.isFocused
            ? `2px solid ${theme.palette.info.main}`
            : "2px solid transparent",
        },
      }}
    >
      <ViewAsScheduleTimeEventInDaysRows
        period={RecurringTaskPeriod.DAILY}
        entry={props.entry}
        isAdding={props.isAdding}
      />
    </TableRow>
  );
}

// The colour an in-day event is drawn in. The event's own box and the buffer
// bands hugging it both read it from here, so the two never drift apart.
function timeEventInDayEntryColorHex(
  entry: CombinedTimeEventInDayEntry,
): string {
  switch (timeEventInDayBlockOwnerTheType(entry.time_event_in_tz)) {
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return scheduleStreamColorHex(
        (entry.entry as ScheduleInDayEventEntry).stream.color,
      );

    case NamedEntityTag.BIG_PLAN: {
      const bigPlan = (entry.entry as BigPlanEntry).big_plan;
      return scheduleStreamColorHex(
        BIG_PLAN_TIME_EVENT_COLOR,
        bigPlan.status === BigPlanStatus.DONE
          ? "lighter"
          : bigPlan.status === BigPlanStatus.NOT_DONE
            ? "darker"
            : "normal",
      );
    }

    case NamedEntityTag.TODO_TASK: {
      const inboxTask = (entry.entry as TodoTaskEntry).inbox_task;
      return scheduleStreamColorHex(
        TODO_TASK_TIME_EVENT_COLOR,
        inboxTask.status === InboxTaskStatus.DONE
          ? "lighter"
          : inboxTask.status === InboxTaskStatus.NOT_DONE
            ? "darker"
            : "normal",
      );
    }

    case NamedEntityTag.HABIT:
      return scheduleStreamColorHex(HABIT_TIME_EVENT_COLOR);

    case NamedEntityTag.CHORE:
      return scheduleStreamColorHex(CHORE_TIME_EVENT_COLOR);

    case NamedEntityTag.TIME_PLAN_ACTIVITY:
      return scheduleStreamColorHex(TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR);

    default:
      throw new Error("Unknown time event in day owner type");
  }
}

interface ViewAsCalendarTimeEventInDayBuffersProps {
  layout: TimeBlockLayout;
  overlapStyle: InDayEventOverlapStyle;
  startOfDay: DateTime;
  entry: CombinedTimeEventInDayEntry;
  deltaHour: number;
}

// The logistics around an event - getting there beforehand, winding down
// after - drawn as hatched bands hugging it, so the time they take is visible
// without reading as part of the event itself.
function ViewAsCalendarTimeEventInDayBuffers(
  props: ViewAsCalendarTimeEventInDayBuffersProps,
) {
  const block = props.entry.time_event_in_tz;

  if (
    (block.buffer_before_mins ?? null) === null &&
    (block.buffer_after_mins ?? null) === null
  ) {
    return null;
  }

  const startMins = calculateStartTimeForTimeEvent(block)
    .diff(props.startOfDay)
    .as("minutes");
  const endMins = calculateEndTimeForTimeEvent(block)
    .diff(props.startOfDay)
    .as("minutes");

  // A buffer running off either end of the day is drawn only as far as the
  // day goes.
  const bufferBeforeMins = Math.min(
    block.buffer_before_mins ?? 0,
    Math.max(0, startMins),
  );
  const bufferAfterMins = Math.min(
    block.buffer_after_mins ?? 0,
    Math.max(0, 24 * 60 - endMins),
  );

  const beforeTopRems = calendarTimeEventInDayStartMinutesToRems(
    startMins - bufferBeforeMins,
    props.deltaHour,
  );
  const afterTopRems = calendarTimeEventInDayStartMinutesToRems(
    endMins,
    props.deltaHour,
  );

  const colorHex = timeEventInDayEntryColorHex(props.entry);
  const bandSx = {
    position: "absolute" as const,
    backgroundImage: `repeating-linear-gradient(45deg, ${colorHex}59, ${colorHex}59 4px, transparent 4px, transparent 8px)`,
    border: `1px dashed ${colorHex}`,
    borderRadius: "0.25rem",
    boxSizing: "border-box" as const,
    pointerEvents: "none" as const,
    ...inDayEventLayoutSx(props.layout, props.overlapStyle),
  };

  return (
    <Fragment>
      {bufferBeforeMins > 0 && beforeTopRems !== undefined && (
        <Box
          sx={{
            ...bandSx,
            top: beforeTopRems,
            height: calendarTimeEventInDayBufferToRems(bufferBeforeMins),
          }}
        ></Box>
      )}

      {bufferAfterMins > 0 && afterTopRems !== undefined && (
        <Box
          sx={{
            ...bandSx,
            top: afterTopRems,
            height: calendarTimeEventInDayBufferToRems(bufferAfterMins),
          }}
        ></Box>
      )}
    </Fragment>
  );
}

// Everything the box of an event needs to react to the pointer: peeking at
// what's around it, and coming loose so it can be dragged elsewhere.
type ViewAsCalendarTimeEventInDayTriggerProps =
  OverlappingEventsPeekTriggerProps &
    CalendarEventDragBinding["handleProps"] & {
      onClick?: () => void;
    };

interface ViewAsCalendarTimeEventInDayCellContentProps
  extends ViewAsCalendarTimeEventInDayCellProps {
  eventTriggerProps: ViewAsCalendarTimeEventInDayTriggerProps;
}

function ViewAsCalendarTimeEventInDayCellContent(
  props: ViewAsCalendarTimeEventInDayCellContentProps,
) {
  const theme = useTheme();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const openInDayEvent = useOpenCalendarInDayEvent();
  const selected = inDayEventIsOpen(props.entry, openInDayEvent);

  const [containerWidth, setContainerWidth] = useState(120);
  useEffect(() => {
    setContainerWidth(containerRef.current?.clientWidth || 120);
  }, [containerRef]);

  switch (timeEventInDayBlockOwnerTheType(props.entry.time_event_in_tz)) {
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY: {
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
        CALENDAR_EVENT_NAME_FONT_PX,
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
          {...props.eventTriggerProps}
          sx={{
            fontSize: `${CALENDAR_EVENT_NAME_FONT_PX}px`,
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              scheduleEntry.time_event.duration_mins,
            ),
            backgroundColor: timeEventInDayEntryColorHex(props.entry),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            ...inDayEventLayoutSx(props.layout, props.overlapStyle),
            ...selectedCalendarEventSx(theme, selected, props.layout.offset),
          }}
        >
          <UserLightChip
            user={scheduleEntry.owner}
            currentUserRefId={topLevelInfo.user.ref_id}
          />
          <CalendarEventLink
            key={`schedule-event-in-day-${scheduleEntry.event.ref_id}`}
            kind="schedule-event-in-day"
            refId={scheduleEntry.event.ref_id}
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
          </CalendarEventLink>
        </Box>
      );
    }

    case NamedEntityTag.BIG_PLAN: {
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
        CALENDAR_EVENT_NAME_FONT_PX,
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
          {...props.eventTriggerProps}
          sx={{
            fontSize: `${CALENDAR_EVENT_NAME_FONT_PX}px`,
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins,
            ),
            backgroundColor: timeEventInDayEntryColorHex(props.entry),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            ...inDayEventLayoutSx(props.layout, props.overlapStyle),
            ...selectedCalendarEventSx(theme, selected, props.layout.offset),
          }}
        >
          <CalendarEventLink
            key={`big-plan-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
            kind="time-event-in-day-block"
            refId={props.entry.time_event_in_tz.ref_id}
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
          </CalendarEventLink>
        </Box>
      );
    }

    case NamedEntityTag.TODO_TASK: {
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
        CALENDAR_EVENT_NAME_FONT_PX,
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
          {...props.eventTriggerProps}
          sx={{
            fontSize: `${CALENDAR_EVENT_NAME_FONT_PX}px`,
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins,
            ),
            backgroundColor: timeEventInDayEntryColorHex(props.entry),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            ...inDayEventLayoutSx(props.layout, props.overlapStyle),
            ...selectedCalendarEventSx(theme, selected, props.layout.offset),
          }}
        >
          <CalendarEventLink
            key={`todo-task-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
            kind="time-event-in-day-block"
            refId={props.entry.time_event_in_tz.ref_id}
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
          </CalendarEventLink>
        </Box>
      );
    }

    case NamedEntityTag.HABIT: {
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
        CALENDAR_EVENT_NAME_FONT_PX,
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
          {...props.eventTriggerProps}
          sx={{
            fontSize: `${CALENDAR_EVENT_NAME_FONT_PX}px`,
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins,
            ),
            backgroundColor: timeEventInDayEntryColorHex(props.entry),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            ...inDayEventLayoutSx(props.layout, props.overlapStyle),
            ...selectedCalendarEventSx(theme, selected, props.layout.offset),
          }}
        >
          <CalendarEventLink
            key={`habit-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
            kind="time-event-in-day-block"
            refId={props.entry.time_event_in_tz.ref_id}
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
          </CalendarEventLink>
        </Box>
      );
    }

    case NamedEntityTag.CHORE: {
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
        CALENDAR_EVENT_NAME_FONT_PX,
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
          {...props.eventTriggerProps}
          sx={{
            fontSize: `${CALENDAR_EVENT_NAME_FONT_PX}px`,
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins,
            ),
            backgroundColor: timeEventInDayEntryColorHex(props.entry),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            ...inDayEventLayoutSx(props.layout, props.overlapStyle),
            ...selectedCalendarEventSx(theme, selected, props.layout.offset),
          }}
        >
          <CalendarEventLink
            key={`chore-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
            kind="time-event-in-day-block"
            refId={props.entry.time_event_in_tz.ref_id}
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
          </CalendarEventLink>
        </Box>
      );
    }

    case NamedEntityTag.TIME_PLAN_ACTIVITY: {
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

      const nameWithStatus = timePlanActivityNameForEvent(activityEntry);

      const clippedName = clipTimeEventInDayNameToWhatFits(
        startTime,
        endTime,
        nameWithStatus,
        CALENDAR_EVENT_NAME_FONT_PX,
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
          {...props.eventTriggerProps}
          sx={{
            fontSize: `${CALENDAR_EVENT_NAME_FONT_PX}px`,
            position: "absolute",
            top: topRems,
            height: calendarTimeEventInDayDurationToRems(
              minutesSinceStartOfDay,
              props.entry.time_event_in_tz.duration_mins,
            ),
            backgroundColor: timeEventInDayEntryColorHex(props.entry),
            borderRadius: "0.25rem",
            border: `1px solid ${theme.palette.background.paper}`,
            ...inDayEventLayoutSx(props.layout, props.overlapStyle),
            ...selectedCalendarEventSx(theme, selected, props.layout.offset),
          }}
        >
          <CalendarEventLink
            key={`time-plan-activity-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
            kind="time-event-in-day-block"
            refId={props.entry.time_event_in_tz.ref_id}
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
          </CalendarEventLink>
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
  const statsPath = useCalendarStatsPath(
    props.calendarLocation,
    props.periodStart,
    props.period,
    View.CALENDAR,
  );

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
      <EntityLink to={statsPath}>
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
  const isBigScreen = useBigScreen();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const { theType } = parseEntityLinkStd(props.entry.time_event.owner);
  switch (theType) {
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS: {
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
            <UserLightChip
              user={fullDaysEntry.owner}
              currentUserRefId={topLevelInfo.user.ref_id}
            />
            <CalendarEventLink
              light
              key={`schedule-event-full-days-${fullDaysEntry.event.ref_id}`}
              kind="schedule-event-full-days"
              refId={fullDaysEntry.event.ref_id}
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
            </CalendarEventLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case NamedEntityTag.OCCASION: {
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
            <CalendarEventLink
              light
              key={`schedule-event-full-days-${fullDaysEntry.occasion_time_event.ref_id}`}
              kind="time-event-full-days-block"
              refId={fullDaysEntry.occasion_time_event.ref_id}
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
            </CalendarEventLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case NamedEntityTag.VACATION: {
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
            <CalendarEventLink
              light
              key={`schedule-event-full-days-${fullDaysEntry.time_event.ref_id}`}
              kind="time-event-full-days-block"
              refId={fullDaysEntry.time_event.ref_id}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={`🌴 ${fullDaysEntry.vacation.name}`}
                color={scheduleStreamColorContrastingHex(
                  VACATION_TIME_EVENT_COLOR,
                )}
              />
            </CalendarEventLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    default:
      throw new Error(`Unknown full-days time event owner type: ${theType}`);
  }
}

interface ViewAsScheduleTimeEventInDayTimeCellProps {
  period: RecurringTaskPeriod;
  entry: CombinedTimeEventInDayEntry;
  startTime: DateTime;
  endTime: DateTime;
}

// When an event has buffers around it, the range it takes up on the day is
// wider than the range it runs for, so the schedule says so under the times.
function ViewAsScheduleTimeEventInDayTimeCell(
  props: ViewAsScheduleTimeEventInDayTimeCellProps,
) {
  const isBigScreen = useBigScreen();
  const buffersLabel = timeEventInDayBuffersLabel(props.entry.time_event_in_tz);

  return (
    <ViewAsScheduleTimeCell
      period={props.period}
      isbigscreen={isBigScreen.toString()}
    >
      [{props.startTime.toFormat("HH:mm")} - {props.endTime.toFormat("HH:mm")}]
      {buffersLabel !== undefined && (
        <Typography variant="caption" component="div" color="text.secondary">
          {buffersLabel}
        </Typography>
      )}
    </ViewAsScheduleTimeCell>
  );
}

interface ViewAsScheduleTimeEventInDaysRowsProps {
  period: RecurringTaskPeriod;
  entry: CombinedTimeEventInDayEntry;
  isAdding: boolean;
}

export function ViewAsScheduleTimeEventInDaysRows(
  props: ViewAsScheduleTimeEventInDaysRowsProps,
) {
  const topLevelInfo = useContext(TopLevelInfoContext);

  const startTime = calculateStartTimeForTimeEvent(
    props.entry.time_event_in_tz,
  );
  const endTime = calculateEndTimeForTimeEvent(props.entry.time_event_in_tz);

  switch (timeEventInDayBlockOwnerTheType(props.entry.time_event_in_tz)) {
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY: {
      const scheduleEntry = props.entry.entry as ScheduleInDayEventEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeEventInDayTimeCell
            period={props.period}
            entry={props.entry}
            startTime={startTime}
            endTime={endTime}
          />

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(scheduleEntry.stream.color)}
            height={scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins,
            )}
          >
            <UserLightChip
              user={scheduleEntry.owner}
              currentUserRefId={topLevelInfo.user.ref_id}
            />
            <CalendarEventLink
              light
              key={`schedule-event-in-day-${scheduleEntry.event.ref_id}`}
              kind="schedule-event-in-day"
              refId={scheduleEntry.event.ref_id}
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
            </CalendarEventLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case NamedEntityTag.BIG_PLAN: {
      const bigPlanEntry = props.entry.entry as BigPlanEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeEventInDayTimeCell
            period={props.period}
            entry={props.entry}
            startTime={startTime}
            endTime={endTime}
          />

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
            <CalendarEventLink
              light
              key={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
              kind="time-event-in-day-block"
              refId={props.entry.time_event_in_tz.ref_id}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={bigPlanNameForEvent(bigPlanEntry.big_plan)}
                color={scheduleStreamColorContrastingHex(
                  BIG_PLAN_TIME_EVENT_COLOR,
                )}
              />
            </CalendarEventLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case NamedEntityTag.TODO_TASK: {
      const todoTaskEntry = props.entry.entry as TodoTaskEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeEventInDayTimeCell
            period={props.period}
            entry={props.entry}
            startTime={startTime}
            endTime={endTime}
          />

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
            <CalendarEventLink
              light
              key={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
              kind="time-event-in-day-block"
              refId={props.entry.time_event_in_tz.ref_id}
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
            </CalendarEventLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case NamedEntityTag.HABIT: {
      const habitEntry = props.entry.entry as HabitEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeEventInDayTimeCell
            period={props.period}
            entry={props.entry}
            startTime={startTime}
            endTime={endTime}
          />

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(HABIT_TIME_EVENT_COLOR)}
            height={scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins,
            )}
          >
            <CalendarEventLink
              light
              key={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
              kind="time-event-in-day-block"
              refId={props.entry.time_event_in_tz.ref_id}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={habitNameForEvent(habitEntry.habit)}
                color={scheduleStreamColorContrastingHex(
                  HABIT_TIME_EVENT_COLOR,
                )}
              />
            </CalendarEventLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case NamedEntityTag.CHORE: {
      const choreEntry = props.entry.entry as ChoreEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeEventInDayTimeCell
            period={props.period}
            entry={props.entry}
            startTime={startTime}
            endTime={endTime}
          />

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(CHORE_TIME_EVENT_COLOR)}
            height={scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins,
            )}
          >
            <CalendarEventLink
              light
              key={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
              kind="time-event-in-day-block"
              refId={props.entry.time_event_in_tz.ref_id}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={choreNameForEvent(choreEntry.chore)}
                color={scheduleStreamColorContrastingHex(
                  CHORE_TIME_EVENT_COLOR,
                )}
              />
            </CalendarEventLink>
          </ViewAsScheduleEventCell>
        </Fragment>
      );
    }

    case NamedEntityTag.TIME_PLAN_ACTIVITY: {
      const activityEntry = props.entry.entry as TimePlanActivityEntry;
      return (
        <Fragment>
          <ViewAsScheduleTimeEventInDayTimeCell
            period={props.period}
            entry={props.entry}
            startTime={startTime}
            endTime={endTime}
          />

          <ViewAsScheduleEventCell
            color={scheduleStreamColorHex(TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR)}
            height={scheduleTimeEventInDayDurationToRems(
              props.entry.time_event_in_tz.duration_mins,
            )}
          >
            <CalendarEventLink
              light
              key={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
              kind="time-event-in-day-block"
              refId={props.entry.time_event_in_tz.ref_id}
              inline
              block={props.isAdding}
            >
              <EntityNameComponent
                name={timePlanActivityNameForEvent(activityEntry)}
                color={scheduleStreamColorContrastingHex(
                  TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR,
                )}
              />
            </CalendarEventLink>
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
  position: "relative",
  verticalAlign: "top",
  backgroundColor: color,
  padding: "0.25rem",
  paddingLeft: "0.5rem",
  paddingBottom: height,
  borderRadius: "0.25rem",
  overflow: "hidden",
}));

interface ViewAsStatsPerSubperiodProps {
  forceColumn: boolean;
  showCompact: boolean;
  view: View;
  stats: CalendarEventsStatsPerSubperiod;
  calendarLocation: string;
}

export function ViewAsStatsPerSubperiod(props: ViewAsStatsPerSubperiodProps) {
  const statsPath = useCalendarStatsPath(
    props.calendarLocation,
    props.stats.period_start_date,
    props.stats.period,
    props.view,
  );

  return (
    <EntityLink to={statsPath}>
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
          🎯 {props.stats.big_plan_cnt}{" "}
          {!props.showCompact ? "from big plan" : ""}
        </span>
        <span>
          📝 {props.stats.todo_task_cnt}{" "}
          {!props.showCompact ? "from todo task" : ""}
        </span>
        <span>
          🔄 {props.stats.habit_cnt} {!props.showCompact ? "from habit" : ""}
        </span>
        <span>
          🧹 {props.stats.chore_cnt} {!props.showCompact ? "from chore" : ""}
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
