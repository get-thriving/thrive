import type {
  ADate,
  CalendarEventsEntries,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
} from "@jupiter/webapi-client";
import { RecurringTaskPeriod } from "@jupiter/webapi-client";
import { Box, Typography } from "@mui/material";
import { DateTime } from "luxon";
import type { ReactNode } from "react";
import { useContext, useEffect, useMemo, useState } from "react";

import {
  CalendarNavigationProvider,
  timePlanCalendarNavigation,
} from "#/core/calendar/component/calendar-navigation";
import { CalendarEventDragProvider } from "#/core/calendar/component/event-drag";
import { ViewAsCalendarDaily } from "#/core/calendar/component/view-as-calendar-daily";
import { ViewAsCalendarWeekly } from "#/core/calendar/component/view-as-calendar-weekly";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { activityRefIdByCalendarEvent } from "#/core/time_plans/calendar-event";

// How often the "right now" line on the calendar catches up with the clock.
const REFRESH_RIGHT_NOW_MS = 1000 * 60 * 5; // 5 minutes

// How much of the row the activities take up, with the calendar getting the
// rest of it.
const ACTIVITIES_COLUMN_WIDTH = "40%";

interface TimePlanCalendarActivitiesProps {
  timePlan: TimePlan;
  periodStartDate: ADate;
  periodEndDate: ADate;
  entries?: CalendarEventsEntries;
  timePlanActivities: TimePlanActivity[];
  activityTimeEventBlocks: TimeEventInDayBlock[];
  // The very same activities the list view shows, in a column of their own
  // next to the calendar.
  activities: ReactNode;
  // A leaf for making a new event is open on this plan, so the calendar
  // shows where it would land.
  isAdding?: boolean;
}

// The activities of a time plan side by side with the calendar of the period
// they're planned for - the events made out of those activities included.
export function TimePlanCalendarActivities(
  props: TimePlanCalendarActivitiesProps,
) {
  const isBigScreen = useBigScreen();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const timezone = topLevelInfo.user.timezone;

  const [rightNow, setRightNow] = useState(DateTime.local({ zone: timezone }));

  useEffect(() => {
    const interval = setInterval(() => {
      setRightNow(DateTime.local({ zone: timezone }));
    }, REFRESH_RIGHT_NOW_MS);

    return () => {
      clearInterval(interval);
    };
  }, [timezone]);

  const navigation = useMemo(() => {
    const activityByEvent = activityRefIdByCalendarEvent(
      props.timePlanActivities,
      props.entries,
      props.activityTimeEventBlocks,
    );
    return timePlanCalendarNavigation(props.timePlan.ref_id, activityByEvent);
  }, [
    props.timePlan.ref_id,
    props.timePlanActivities,
    props.entries,
    props.activityTimeEventBlocks,
  ]);

  const today = rightNow.toISODate() as ADate;

  const calendarProps = {
    rightNow: rightNow,
    today: today,
    timezone: timezone,
    period: props.timePlan.period,
    periodStartDate: props.periodStartDate,
    periodEndDate: props.periodEndDate,
    entries: props.entries,
    // There's no date to navigate around here - the time plan is the period.
    calendarLocation: "",
    // A leaf for making a new event is open on this plan, so the calendar
    // shows where it would land.
    isAdding: props.isAdding ?? false,
    // The calendar is the point of this view, so a single day gets the whole
    // column rather than the sliver it takes up in the calendar itself.
    fillWidth: true,
  };

  return (
    <CalendarNavigationProvider value={navigation}>
      <CalendarEventDragProvider timezone={timezone}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isBigScreen ? "row" : "column",
            alignItems: "flex-start",
            gap: "0.5rem",
            width: "100%",
          }}
        >
          <Box
            sx={{
              flex: isBigScreen ? `0 0 ${ACTIVITIES_COLUMN_WIDTH}` : "0 0 auto",
              width: isBigScreen ? undefined : "100%",
              minWidth: 0,
              // The calendar is a whole day tall, so the activities follow
              // along rather than scrolling out of sight at the top of it.
              ...(isBigScreen
                ? {
                    position: "sticky",
                    top: "0.5rem",
                    maxHeight: "calc(100vh - 8rem)",
                    overflowY: "auto",
                  }
                : {}),
            }}
          >
            {props.activities}
          </Box>

          <Box
            sx={{
              flex: "1 1 0",
              width: isBigScreen ? undefined : "100%",
              minWidth: 0,
              overflowX: "auto",
            }}
          >
            {props.entries === undefined && (
              <Typography variant="body1">
                There are no calendar events to show for this time plan.
              </Typography>
            )}

            {props.entries !== undefined &&
              props.timePlan.period === RecurringTaskPeriod.DAILY && (
                <ViewAsCalendarDaily {...calendarProps} />
              )}

            {props.entries !== undefined &&
              props.timePlan.period === RecurringTaskPeriod.WEEKLY && (
                <ViewAsCalendarWeekly {...calendarProps} />
              )}
          </Box>
        </Box>
      </CalendarEventDragProvider>
    </CalendarNavigationProvider>
  );
}
