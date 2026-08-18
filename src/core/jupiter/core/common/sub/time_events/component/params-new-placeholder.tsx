import type { ADate } from "@jupiter/webapi-client";
import { Box, useTheme } from "@mui/material";
import { useSearchParams } from "@remix-run/react";

import { useCreatingCalendarInDayEvent } from "#/core/calendar/component/calendar-navigation";
import {
  calculateStartTimeFromBlockParams,
  calendarTimeEventInDayDurationToRems,
  calendarTimeEventInDayStartMinutesToRems,
} from "#/core/common/sub/time_events/time-event";

interface TimeEventParamsNewPlaceholderParams {
  daysToTheLeft: number;
  date: ADate;
  deltaHour: number;
}

export function TimeEventParamsNewPlaceholder(
  props: TimeEventParamsNewPlaceholderParams,
) {
  const theme = useTheme();
  const [query] = useSearchParams();
  const creatingNew = useCreatingCalendarInDayEvent();

  const sourceStartDate = query.get("sourceStartDate");
  const sourceStartTimeInDay = query.get("sourceStartTimeInDay");
  const sourceDurationMins = query.get("sourceDurationMins");

  if (!creatingNew) {
    return null;
  }

  if (!sourceStartDate || !sourceStartTimeInDay || !sourceDurationMins) {
    return null;
  }

  const sourceDurationMinsInt = parseInt(sourceDurationMins, 10);

  if (props.date !== sourceStartDate) {
    return null;
  }

  const startTime = calculateStartTimeFromBlockParams({
    startDate: sourceStartDate,
    startTimeInDay: sourceStartTimeInDay,
  });
  const minutesSinceStartOfDay = startTime
    .diff(startTime.startOf("day"))
    .as("minutes");

  const endTime = startTime.plus({ minutes: sourceDurationMinsInt });
  const endOfDay = startTime.endOf("day");
  const overflowMinutes = endTime.diff(endOfDay, "minutes").minutes;

  // Marks the slot the open panel is talking about without covering it -
  // a hold still needs to reach the event underneath so it can be dragged.
  const overlaySx = {
    position: "absolute" as const,
    backgroundColor: "transparent",
    borderRadius: "0.5rem",
    border: `3px solid ${theme.palette.info.main}`,
    minWidth: "calc(7rem - 0.5rem)",
    width: "calc(100% - 0.5rem)",
    zIndex: 10,
    pointerEvents: "none" as const,
    boxSizing: "border-box" as const,
  };

  return (
    <>
      <Box
        sx={{
          ...overlaySx,
          top: calendarTimeEventInDayStartMinutesToRems(
            minutesSinceStartOfDay,
            props.deltaHour,
          ),
          height: calendarTimeEventInDayDurationToRems(
            minutesSinceStartOfDay,
            overflowMinutes > 0
              ? sourceDurationMinsInt - overflowMinutes
              : sourceDurationMinsInt,
          ),
        }}
      ></Box>
      {overflowMinutes > 0 && props.daysToTheLeft > 0 && (
        <Box
          sx={{
            ...overlaySx,
            top: 0,
            left: "100%",
            height: calendarTimeEventInDayDurationToRems(0, overflowMinutes),
          }}
        ></Box>
      )}
      {overflowMinutes > 24 * 60 && props.daysToTheLeft > 1 && (
        <Box
          sx={{
            ...overlaySx,
            top: 0,
            left: "200%",
            height: calendarTimeEventInDayDurationToRems(
              0,
              overflowMinutes - 24 * 60,
            ),
          }}
        ></Box>
      )}
    </>
  );
}
