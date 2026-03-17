import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { DateTime } from "luxon";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useFetcher } from "@remix-run/react";

import {
  combinedTimeEventFullDayEntryPartionByDay,
  CombinedTimeEventInDayEntry,
  timeEventInDayBlockToTimezone,
  CombinedTimeEventFullDaysEntry,
  combinedTimeEventInDayEntryPartionByDay,
} from "#/core/common/sub/time_events/time-event";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import {
  MAX_VISIBLE_TIME_EVENT_FULL_DAYS,
  ViewAsCalendarDateHeader,
  ViewAsCalendarDaysAndFullDaysContiner,
  ViewAsCalendarEmptyCell,
  ViewAsCalendarInDayContainer,
  ViewAsCalendarLeftColumn,
  ViewAsCalendarMoreButton,
  ViewAsCalendarRightColumn,
  ViewAsCalendarTimeEventFullDaysColumn,
  ViewAsCalendarTimeEventInDayColumn,
  ViewAsProps,
} from "#/core/calendar/component/shared";

export function ViewAsCalendarDaily(props: ViewAsProps) {
  const isBigScreen = useBigScreen();

  const [showAllTimeEventFullDays, setShowAllTimeEventFullDays] =
    useState(false);

  const calendarMoveFetcher = useFetcher();

  if (props.entries === undefined) {
    throw new Error("Entries are required");
  }

  const periodStartDate = DateTime.fromISO(props.periodStartDate);

  const combinedTimeEventFullDays: Array<CombinedTimeEventFullDaysEntry> = [];
  for (const entry of props.entries.schedule_event_full_days_entries) {
    combinedTimeEventFullDays.push({
      time_event: entry.time_event,
      entry: entry,
    });
  }
  for (const entry of props.entries.person_occasion_entries) {
    combinedTimeEventFullDays.push({
      time_event: entry.occasion_time_event,
      entry: entry,
    });
  }
  for (const entry of props.entries.vacation_entries) {
    combinedTimeEventFullDays.push({
      time_event: entry.time_event,
      entry: entry,
    });
  }

  const combinedTimeEventInDay: Array<CombinedTimeEventInDayEntry> = [];
  for (const entry of props.entries.schedule_event_in_day_entries) {
    combinedTimeEventInDay.push({
      time_event_in_tz: timeEventInDayBlockToTimezone(
        entry.time_event,
        props.timezone,
      ),
      entry: entry,
    });
  }
  for (const entry of props.entries.inbox_task_entries) {
    for (const timeEvent of entry.time_events) {
      combinedTimeEventInDay.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(
          timeEvent,
          props.timezone,
        ),
        entry: entry,
      });
    }
  }
  for (const entry of props.entries.big_plan_entries) {
    for (const timeEvent of entry.time_events) {
      combinedTimeEventInDay.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(
          timeEvent,
          props.timezone,
        ),
        entry: entry,
      });
    }
  }

  const partitionedCombinedTimeEventFullDays =
    combinedTimeEventFullDayEntryPartionByDay(combinedTimeEventFullDays);
  const thePartititionFullDays =
    partitionedCombinedTimeEventFullDays[props.periodStartDate] || [];
  const partitionedCombinedTimeEventInDay =
    combinedTimeEventInDayEntryPartionByDay(combinedTimeEventInDay);
  const thePartitionInDay =
    partitionedCombinedTimeEventInDay[props.periodStartDate] || [];

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    if (result.source.droppableId === result.destination.droppableId) return;

    const parts = result.draggableId.split("|");
    const eventRefId = parts[0];
    const startTimeInDay = parts[1];
    const durationMins = parts[2];
    const newDate = result.destination.droppableId;

    calendarMoveFetcher.submit(
      {
        id: eventRefId,
        startDate: newDate,
        startTimeInDay: startTimeInDay,
        durationMins: durationMins,
        userTimezone: props.timezone,
      },
      {
        method: "post",
        action:
          "/app/workspace/calendar/time-event/in-day-block/update-time",
      },
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        margin: isBigScreen ? "auto" : "initial",
        width: isBigScreen ? "300px" : "100%",
      }}
    >
      <ViewAsCalendarDaysAndFullDaysContiner>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
          <ViewAsCalendarEmptyCell>
            <Typography variant="h6">
              {periodStartDate.toFormat("MMM")}
            </Typography>
            <Typography variant="h6">
              {periodStartDate.toFormat("yyyy")}
            </Typography>
          </ViewAsCalendarEmptyCell>
          <ViewAsCalendarDateHeader
            today={props.today}
            date={props.periodStartDate}
          />
          <ViewAsCalendarEmptyCell />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row" }}>
          {thePartititionFullDays.length > MAX_VISIBLE_TIME_EVENT_FULL_DAYS && (
            <ViewAsCalendarMoreButton
              showAllTimeEventFullDays={showAllTimeEventFullDays}
              setShowAllTimeEventFullDays={setShowAllTimeEventFullDays}
            />
          )}
          {thePartititionFullDays.length <=
            MAX_VISIBLE_TIME_EVENT_FULL_DAYS && <ViewAsCalendarEmptyCell />}

          <ViewAsCalendarTimeEventFullDaysColumn
            today={props.today}
            date={props.periodStartDate}
            showAll={showAllTimeEventFullDays}
            maxFullDaysEntriesCnt={thePartititionFullDays.length}
            timeEventFullDays={thePartititionFullDays}
            isAdding={props.isAdding}
          />

          <ViewAsCalendarEmptyCell />
        </Box>
      </ViewAsCalendarDaysAndFullDaysContiner>

      <DragDropContext onDragEnd={onDragEnd}>
        <ViewAsCalendarInDayContainer>
          <ViewAsCalendarLeftColumn
            rightNow={props.rightNow}
            showOnlyFromRightNowIfDaily={props.showOnlyFromRightNowIfDaily}
          />
          <ViewAsCalendarTimeEventInDayColumn
            daysToTheLeft={0}
            rightNow={props.rightNow}
            today={props.today}
            timezone={props.timezone}
            date={props.periodStartDate}
            timeEventsInDay={thePartitionInDay}
            isAdding={props.isAdding}
            showOnlyFromRightNowIfDaily={props.showOnlyFromRightNowIfDaily}
          />
          <ViewAsCalendarRightColumn
            rightNow={props.rightNow}
            showOnlyFromRightNowIfDaily={props.showOnlyFromRightNowIfDaily}
          />
        </ViewAsCalendarInDayContainer>
      </DragDropContext>
    </Box>
  );
}
