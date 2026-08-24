import type {
  ADate,
  CalendarEventsEntries,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
} from "@jupiter/webapi-client";
import { RecurringTaskPeriod } from "@jupiter/webapi-client";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
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
import { allDaysBetween } from "#/core/common/adate";
import { TabPanel } from "#/core/infra/component/tab-panel";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { activityRefIdByCalendarEvent } from "#/core/apps/time_plans/calendar-event";
import {
  timePlanFocusedCalendarDate,
  timePlanThreeDayCalendarDates,
  TimePlanViewMode,
} from "#/core/apps/time_plans/view-mode";

// How often the "right now" line on the calendar catches up with the clock.
const REFRESH_RIGHT_NOW_MS = 1000 * 60 * 5; // 5 minutes

// How much of the row the activities take up, with the calendar getting the
// rest of it.
const ACTIVITIES_COLUMN_WIDTH = "40%";

const SMALL_SCREEN_ACTIVITIES_TAB = 0;
const SMALL_SCREEN_DAY_TAB = 1;

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
  viewMode: TimePlanViewMode.CALENDAR | TimePlanViewMode.CALENDAR_3_DAYS;
}

// The activities of a time plan with the calendar of the period they're
// planned for - the events made out of those activities included. On a
// big screen the two sit side by side; on a small one they take tabs of
// their own, and the calendar is a single day rather than the whole week.
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
  const threeDayWindow =
    props.viewMode === TimePlanViewMode.CALENDAR_3_DAYS &&
    props.timePlan.period === RecurringTaskPeriod.WEEKLY;
  const periodDates = useMemo(
    () => allDaysBetween(props.periodStartDate, props.periodEndDate),
    [props.periodStartDate, props.periodEndDate],
  );
  const threeDayDates = useMemo(
    () =>
      threeDayWindow
        ? timePlanThreeDayCalendarDates(
            today,
            props.periodStartDate,
            props.periodEndDate,
          )
        : undefined,
    [threeDayWindow, today, props.periodStartDate, props.periodEndDate],
  );
  const visibleDates = threeDayDates ?? periodDates;
  const focusedDate = timePlanFocusedCalendarDate(
    today,
    visibleDates[0] ?? props.periodStartDate,
    visibleDates[visibleDates.length - 1] ?? props.periodEndDate,
  );

  const [selectedDay, setSelectedDay] = useState<ADate>(focusedDate);
  const [smallScreenTab, setSmallScreenTab] = useState(
    props.isAdding ? SMALL_SCREEN_DAY_TAB : SMALL_SCREEN_ACTIVITIES_TAB,
  );

  useEffect(() => {
    if (!visibleDates.includes(selectedDay)) {
      setSelectedDay(focusedDate);
    }
  }, [visibleDates, selectedDay, focusedDate]);

  useEffect(() => {
    if (props.isAdding) {
      setSmallScreenTab(SMALL_SCREEN_DAY_TAB);
    }
  }, [props.isAdding]);

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

  const noEventsMessage = (
    <Typography variant="body1">
      There are no calendar events to show for this time plan.
    </Typography>
  );

  const dayCalendar = (
    <>
      {visibleDates.length > 1 && (
        <TimePlanCalendarDayPicker
          dates={visibleDates}
          today={today}
          selectedDate={selectedDay}
          onSelect={setSelectedDay}
        />
      )}
      {props.entries === undefined && noEventsMessage}
      {props.entries !== undefined && (
        <ViewAsCalendarDaily
          {...calendarProps}
          period={RecurringTaskPeriod.DAILY}
          periodStartDate={selectedDay}
          periodEndDate={selectedDay}
        />
      )}
    </>
  );

  return (
    <CalendarNavigationProvider value={navigation}>
      <CalendarEventDragProvider timezone={timezone}>
        {isBigScreen ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: "0.5rem",
              width: "100%",
            }}
          >
            <Box
              sx={{
                flex: `0 0 ${ACTIVITIES_COLUMN_WIDTH}`,
                minWidth: 0,
                // The calendar is a whole day tall, so the activities follow
                // along rather than scrolling out of sight at the top of it.
                position: "sticky",
                top: "0.5rem",
                maxHeight: "calc(100vh - 8rem)",
                overflowY: "auto",
              }}
            >
              {props.activities}
            </Box>

            <Box
              sx={{
                flex: "1 1 0",
                minWidth: 0,
                overflowX: "auto",
              }}
            >
              {props.entries === undefined && noEventsMessage}

              {props.entries !== undefined &&
                props.timePlan.period === RecurringTaskPeriod.DAILY && (
                  <ViewAsCalendarDaily {...calendarProps} />
                )}

              {props.entries !== undefined &&
                props.timePlan.period === RecurringTaskPeriod.WEEKLY && (
                  <ViewAsCalendarWeekly
                    {...calendarProps}
                    visibleDates={threeDayDates}
                    overlapStyle={threeDayWindow ? "side-by-side" : "cascade"}
                  />
                )}
            </Box>
          </Box>
        ) : (
          <>
            <Tabs
              value={smallScreenTab}
              variant="fullWidth"
              onChange={(_, newValue) => setSmallScreenTab(newValue)}
            >
              <Tab label="Activities" />
              <Tab label="Day" />
            </Tabs>
            <TabPanel
              value={smallScreenTab}
              index={SMALL_SCREEN_ACTIVITIES_TAB}
            >
              {props.activities}
            </TabPanel>
            <TabPanel value={smallScreenTab} index={SMALL_SCREEN_DAY_TAB}>
              {dayCalendar}
            </TabPanel>
          </>
        )}
      </CalendarEventDragProvider>
    </CalendarNavigationProvider>
  );
}

interface TimePlanCalendarDayPickerProps {
  dates: ADate[];
  today: ADate;
  selectedDate: ADate;
  onSelect: (date: ADate) => void;
}

function TimePlanCalendarDayPicker(props: TimePlanCalendarDayPickerProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "0.25rem",
        width: "100%",
        marginBottom: "0.5rem",
      }}
    >
      {props.dates.map((date) => {
        const theDate = DateTime.fromISO(date);
        const isSelected = date === props.selectedDate;
        return (
          <Button
            key={date}
            variant={isSelected ? "contained" : "text"}
            color={date === props.today ? "info" : "primary"}
            aria-pressed={isSelected}
            aria-label={theDate.toFormat("ccc d MMM")}
            onClick={() => props.onSelect(date)}
            sx={{
              minWidth: 0,
              flex: "1 1 0",
              flexDirection: "column",
              padding: "0.25rem 0",
              lineHeight: 1.2,
            }}
          >
            <Typography variant="caption" component="span">
              {theDate.toFormat("ccc")}
            </Typography>
            <Typography variant="body2" component="span">
              {theDate.toFormat("dd")}
            </Typography>
          </Button>
        );
      })}
    </Box>
  );
}
