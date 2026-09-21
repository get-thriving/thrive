import type { ADate } from "@jupiter/webapi-client";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";

import { allDaysBetween } from "#/core/common/adate";
import {
  combinedTimeEventFullDayEntryPartionByDay,
  CombinedTimeEventFullDaysEntry,
  CombinedTimeEventInDayEntry,
  combineTimeEventFullDaysEntries,
  combineTimeEventInDayEntries,
  combinedTimeEventInDayEntryPartionByDay,
  InDayEventOverlapStyle,
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
  ViewAsCalendarTimezoneHeaderCell,
  ViewAsProps,
} from "#/core/calendar/component/shared";
import { useCalendarPendingReschedule } from "#/core/calendar/component/event-drag";

// A day with nothing on it is handed the same empty list every time, so it
// doesn't look like a day whose events have just changed.
const NO_IN_DAY_ENTRIES: Array<CombinedTimeEventInDayEntry> = [];
const NO_FULL_DAYS_ENTRIES: Array<CombinedTimeEventFullDaysEntry> = [];

export function ViewAsCalendarWeekly(
  props: ViewAsProps & {
    // A slice of the week, such as the three-day time plan window. The full
    // period is drawn when this is left off.
    visibleDates?: ADate[];
    overlapStyle?: InDayEventOverlapStyle;
  },
) {
  const isBigScreen = useBigScreen();
  const applyPendingReschedule = useCalendarPendingReschedule();

  const [showAllTimeEventFullDays, setShowAllTimeEventFullDays] =
    useState(false);

  const entries = props.entries;
  const timezone = props.timezone;

  // Gathering the week's events, moving them into the timezone on show and
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

  const allDays =
    props.visibleDates ??
    allDaysBetween(props.periodStartDate, props.periodEndDate);
  const overlapStyle = props.overlapStyle ?? "cascade";

  const maxFullDaysEntriesCnt = Math.max(
    0,
    ...allDays.map(
      (date) => partitionedCombinedTimeEventFullDays[date]?.length ?? 0,
    ),
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        margin: isBigScreen ? "auto" : "initial",
        paddingTop: isBigScreen || maxFullDaysEntriesCnt > 0 ? "0" : "1rem",
      }}
    >
      <ViewAsCalendarDaysAndFullDaysContiner>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "0.1rem" }}>
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
          {allDays.map((date, idx) => (
            <ViewAsCalendarDateHeader
              key={idx}
              today={props.today}
              date={date}
            />
          ))}
          <ViewAsCalendarEmptyCell />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "0.1rem" }}>
          <ViewAsCalendarTimezoneHeaderCell
            timezone={props.timezone}
            additionalTimezones={props.additionalTimezones}
          >
            {maxFullDaysEntriesCnt > MAX_VISIBLE_TIME_EVENT_FULL_DAYS && (
              <ViewAsCalendarMoreButton
                showAllTimeEventFullDays={showAllTimeEventFullDays}
                setShowAllTimeEventFullDays={setShowAllTimeEventFullDays}
              />
            )}
          </ViewAsCalendarTimezoneHeaderCell>

          {allDays.map((date, idx) => (
            <ViewAsCalendarTimeEventFullDaysColumn
              key={idx}
              today={props.today}
              date={date}
              showAll={showAllTimeEventFullDays}
              maxFullDaysEntriesCnt={maxFullDaysEntriesCnt}
              timeEventFullDays={
                partitionedCombinedTimeEventFullDays[date] ??
                NO_FULL_DAYS_ENTRIES
              }
              isAdding={props.isAdding}
            />
          ))}

          <ViewAsCalendarEmptyCell />
        </Box>
      </ViewAsCalendarDaysAndFullDaysContiner>

      <ViewAsCalendarInDayContainer>
        <ViewAsCalendarLeftColumn
          rightNow={props.rightNow}
          timezone={props.timezone}
          additionalTimezones={props.additionalTimezones}
          date={allDays[0] ?? props.periodStartDate}
          showOnlyFromRightNowIfDaily={props.showOnlyFromRightNowIfDaily}
        />

        {allDays.map((date, idx) => (
          <ViewAsCalendarTimeEventInDayColumn
            daysToTheLeft={allDays.length - idx - 1}
            key={idx}
            rightNow={props.rightNow}
            today={props.today}
            timezone={props.timezone}
            date={date}
            timeEventsInDay={
              partitionedCombinedTimeEventInDay[date] ?? NO_IN_DAY_ENTRIES
            }
            isAdding={props.isAdding}
            showOnlyFromRightNowIfDaily={props.showOnlyFromRightNowIfDaily}
            overlapStyle={overlapStyle}
          />
        ))}

        <ViewAsCalendarRightColumn
          rightNow={props.rightNow}
          showOnlyFromRightNowIfDaily={props.showOnlyFromRightNowIfDaily}
        />
      </ViewAsCalendarInDayContainer>
    </Box>
  );
}
