import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";

import {
  combinedTimeEventFullDayEntryPartionByDay,
  CombinedTimeEventInDayEntry,
  combineTimeEventFullDaysEntries,
  combineTimeEventInDayEntries,
  CombinedTimeEventFullDaysEntry,
  combinedTimeEventInDayEntryPartionByDay,
} from "#/core/common/sub/time_events/time-event";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import {
  calendarTimeColumnsWidthRem,
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
  ViewAsCalendarTimezoneHeaderCell,
  ViewAsProps,
} from "#/core/calendar/component/shared";
import { useCalendarPendingReschedule } from "#/core/calendar/component/event-drag";

// A day with nothing on it is handed the same empty list every time, so it
// doesn't look like a day whose events have just changed.
const NO_IN_DAY_ENTRIES: Array<CombinedTimeEventInDayEntry> = [];
const NO_FULL_DAYS_ENTRIES: Array<CombinedTimeEventFullDaysEntry> = [];

export function ViewAsCalendarDaily(props: ViewAsProps) {
  const isBigScreen = useBigScreen();
  const applyPendingReschedule = useCalendarPendingReschedule();

  const [showAllTimeEventFullDays, setShowAllTimeEventFullDays] =
    useState(false);

  const entries = props.entries;
  const timezone = props.timezone;

  // Gathering the day's events, moving them into the timezone on show and
  // working out which day each one belongs to is the same answer for as long
  // as the events are, so it's kept rather than redone every time something
  // on the calendar moves.
  const partitionedCombinedTimeEventFullDays = useMemo(
    () =>
      combinedTimeEventFullDayEntryPartionByDay(
        combineTimeEventFullDaysEntries(entries),
      ),
    [entries],
  );

  const combinedTimeEventInDay = useMemo(
    () => combineTimeEventInDayEntries(entries, timezone),
    [entries, timezone],
  );

  const partitionedCombinedTimeEventInDay = useMemo(
    () =>
      combinedTimeEventInDayEntryPartionByDay(
        applyPendingReschedule(combinedTimeEventInDay),
      ),
    [combinedTimeEventInDay, applyPendingReschedule],
  );

  if (entries === undefined) {
    throw new Error("Entries are required");
  }

  const periodStartDate = DateTime.fromISO(props.periodStartDate);
  const thePartititionFullDays =
    partitionedCombinedTimeEventFullDays[props.periodStartDate] ??
    NO_FULL_DAYS_ENTRIES;
  const thePartitionInDay =
    partitionedCombinedTimeEventInDay[props.periodStartDate] ??
    NO_IN_DAY_ENTRIES;

  return (
    <Box
      sx={{
        position: "relative",
        margin: isBigScreen ? "auto" : "initial",
        width:
          isBigScreen && !props.fillWidth
            ? `calc(300px + ${
                calendarTimeColumnsWidthRem(props.additionalTimezones) - 3.5
              }rem)`
            : "100%",
      }}
    >
      <ViewAsCalendarDaysAndFullDaysContiner>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
          <ViewAsCalendarEmptyCell
            additionalTimezones={props.additionalTimezones}
          >
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
          <ViewAsCalendarTimezoneHeaderCell
            timezone={props.timezone}
            additionalTimezones={props.additionalTimezones}
          >
            {thePartititionFullDays.length >
              MAX_VISIBLE_TIME_EVENT_FULL_DAYS && (
              <ViewAsCalendarMoreButton
                showAllTimeEventFullDays={showAllTimeEventFullDays}
                setShowAllTimeEventFullDays={setShowAllTimeEventFullDays}
              />
            )}
          </ViewAsCalendarTimezoneHeaderCell>

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

      <ViewAsCalendarInDayContainer>
        <ViewAsCalendarLeftColumn
          rightNow={props.rightNow}
          timezone={props.timezone}
          additionalTimezones={props.additionalTimezones}
          date={props.periodStartDate}
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
          overlapStyle="side-by-side"
        />
        <ViewAsCalendarRightColumn
          rightNow={props.rightNow}
          showOnlyFromRightNowIfDaily={props.showOnlyFromRightNowIfDaily}
        />
      </ViewAsCalendarInDayContainer>
    </Box>
  );
}
