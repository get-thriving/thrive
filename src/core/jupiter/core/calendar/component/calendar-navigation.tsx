import { ADate, EntityId, RecurringTaskPeriod } from "@jupiter/webapi-client";
import { Box } from "@mui/material";
import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import { useSearchParams } from "@remix-run/react";

import { EntityLink } from "#/core/infra/component/entity-card";

export type CalendarEventLinkKind =
  | "schedule-event-in-day"
  | "schedule-event-full-days"
  | "time-event-in-day-block"
  | "time-event-full-days-block";

export interface CalendarNavigationValue {
  eventPath: (kind: CalendarEventLinkKind, refId: string) => string | undefined;
  // Where a double click on an empty patch of a day goes to make a new event
  // out of it. Nowhere, on a calendar that's only there to be looked at.
  newInDayEventPath: (query: URLSearchParams) => string | undefined;
  statsPath: (
    calendarLocation: string,
    periodStartDate: string,
    period: RecurringTaskPeriod,
    view: string,
  ) => string;
}

function workspaceCalendarNavigation(): CalendarNavigationValue {
  const calendarBasePath = "/app/workspace/calendar";
  return {
    eventPath: (kind, refId) => {
      switch (kind) {
        case "schedule-event-in-day":
          return `${calendarBasePath}/schedule/event-in-day/${refId}`;
        case "schedule-event-full-days":
          return `${calendarBasePath}/schedule/event-full-days/${refId}`;
        case "time-event-in-day-block":
          return `${calendarBasePath}/time-event/in-day-block/${refId}`;
        case "time-event-full-days-block":
          return `${calendarBasePath}/time-event/full-days-block/${refId}`;
      }
    },
    newInDayEventPath: (query) =>
      `${calendarBasePath}/schedule/event-in-day/new?${query}`,
    statsPath: (calendarLocation, periodStartDate, period, view) =>
      `${calendarBasePath}${calendarLocation}?date=${periodStartDate}&period=${period}&view=${view}`,
  };
}

// The calendar view inside a time plan. The events themselves live in the
// calendar, so their panels are the calendar's own - they just know to come
// back to the time plan they were opened from, rather than to the calendar.
export function timePlanCalendarNavigation(
  timePlanRefId: EntityId,
  date: ADate,
  period: RecurringTaskPeriod,
): CalendarNavigationValue {
  const calendarBasePath = "/app/workspace/calendar";
  const params = new URLSearchParams({
    date: date,
    period: period,
    view: "calendar",
    timePlanRefId: timePlanRefId,
  });

  return {
    eventPath: (kind, refId) => {
      switch (kind) {
        case "schedule-event-in-day":
          return `${calendarBasePath}/schedule/event-in-day/${refId}?${params}`;
        case "schedule-event-full-days":
          return `${calendarBasePath}/schedule/event-full-days/${refId}?${params}`;
        case "time-event-in-day-block":
          return `${calendarBasePath}/time-event/in-day-block/${refId}?${params}`;
        case "time-event-full-days-block":
          return `${calendarBasePath}/time-event/full-days-block/${refId}?${params}`;
      }
    },
    newInDayEventPath: (query) => {
      const withTimePlan = new URLSearchParams(query);
      for (const [key, value] of params) {
        withTimePlan.set(key, value);
      }
      return `${calendarBasePath}/schedule/event-in-day/new?${withTimePlan}`;
    },
    statsPath: (calendarLocation, periodStartDate, statsPeriod, view) =>
      `${calendarBasePath}${calendarLocation}?date=${periodStartDate}&period=${statsPeriod}&view=${view}`,
  };
}

// Where the panel of an event goes back to when it's closed. An event opened
// from a time plan's calendar view returns to that time plan, anything else
// to the calendar it came from.
export function calendarLeafReturnLocation(
  searchParams: URLSearchParams,
): string {
  const timePlanRefId = searchParams.get("timePlanRefId");
  if (timePlanRefId !== null && timePlanRefId !== "") {
    return `/app/workspace/time-plans/${encodeURIComponent(timePlanRefId)}`;
  }

  return `/app/workspace/calendar?${searchParams}`;
}

export function publishedScheduleStreamCalendarNavigation(
  externalId: string,
): CalendarNavigationValue {
  const calendarBasePath = `/publish/schedule-stream/${externalId}`;
  return {
    eventPath: (kind, refId) => {
      switch (kind) {
        case "schedule-event-in-day":
          return `${calendarBasePath}/in-day-event/${refId}`;
        case "schedule-event-full-days":
          return `${calendarBasePath}/full-days-event/${refId}`;
        default:
          return undefined;
      }
    },
    // A published calendar belongs to whoever published it - a visitor has
    // nothing to add to it.
    newInDayEventPath: () => undefined,
    statsPath: (calendarLocation, periodStartDate, period, view) =>
      `${calendarBasePath}${calendarLocation}?date=${periodStartDate}&period=${period}&view=${view}`,
  };
}

const CalendarNavigationContext = createContext<CalendarNavigationValue>(
  workspaceCalendarNavigation(),
);

export function CalendarNavigationProvider(
  props: PropsWithChildren<{ value: CalendarNavigationValue }>,
) {
  return (
    <CalendarNavigationContext.Provider value={props.value}>
      {props.children}
    </CalendarNavigationContext.Provider>
  );
}

export function useCalendarNavigation(): CalendarNavigationValue {
  return useContext(CalendarNavigationContext);
}

interface CalendarEventLinkProps {
  kind: CalendarEventLinkKind;
  refId: string;
  children: ReactNode;
  inline?: boolean;
  block?: boolean;
  light?: boolean;
}

export function CalendarEventLink(props: CalendarEventLinkProps) {
  const navigation = useCalendarNavigation();
  const [query] = useSearchParams();
  const basePath = navigation.eventPath(props.kind, props.refId);

  if (!basePath) {
    return (
      <Box
        component="span"
        sx={{
          display: props.inline ? "inline" : "block",
          width: props.block ? "100%" : undefined,
          height: props.block ? "100%" : undefined,
        }}
      >
        {props.children}
      </Box>
    );
  }

  // The calendar keeps the date it's looking at in the query, and the event
  // panels need it to come back to. A page without one of its own - the time
  // plan calendar view - leaves the path the navigation built alone.
  const queryString = query.toString();
  const path =
    queryString === ""
      ? basePath
      : basePath.includes("?")
        ? `${basePath}&${queryString}`
        : `${basePath}?${queryString}`;

  return (
    <EntityLink
      to={path}
      inline={props.inline}
      block={props.block}
      light={props.light}
    >
      {props.children}
    </EntityLink>
  );
}

export function useCalendarStatsPath(
  calendarLocation: string,
  periodStartDate: string,
  period: RecurringTaskPeriod,
  view: string,
): string {
  const navigation = useCalendarNavigation();
  return navigation.statsPath(calendarLocation, periodStartDate, period, view);
}
