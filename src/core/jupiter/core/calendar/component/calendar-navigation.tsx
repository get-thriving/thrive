import { ADate, EntityId, RecurringTaskPeriod } from "@jupiter/webapi-client";
import { Box } from "@mui/material";
import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import { useSearchParams } from "@remix-run/react";

import { EntityLink } from "#/core/infra/component/entity-card";
import {
  TimePlanViewMode,
  withTimePlanView,
} from "#/core/time_plans/view-mode";

export const CALENDAR_EVENT_LINK_KINDS = [
  "schedule-event-in-day",
  "schedule-event-full-days",
  "time-event-in-day-block",
  "time-event-full-days-block",
] as const;

export type CalendarEventLinkKind = (typeof CALENDAR_EVENT_LINK_KINDS)[number];

export function calendarEventLinkKey(
  kind: CalendarEventLinkKind,
  refId: string,
): string {
  return `${kind}:${refId}`;
}

export function calendarEventWorkspacePath(
  kind: CalendarEventLinkKind,
  refId: string,
): string {
  const calendarBasePath = "/app/workspace/calendar";
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
}

// The calendar event as it lives in the workspace, with enough on the query
// that closing the panel comes back to the time plan's calendar view.
export function calendarEventWorkspacePathFromTimePlan(
  kind: CalendarEventLinkKind,
  refId: string,
  timePlanRefId: string,
): string {
  const params = new URLSearchParams({
    timePlanRefId: timePlanRefId,
  });
  return `${calendarEventWorkspacePath(kind, refId)}?${params.toString()}`;
}

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
    eventPath: calendarEventWorkspacePath,
    newInDayEventPath: (query) =>
      `${calendarBasePath}/schedule/event-in-day/new?${query}`,
    statsPath: (calendarLocation, periodStartDate, period, view) =>
      `${calendarBasePath}${calendarLocation}?date=${periodStartDate}&period=${period}&view=${view}`,
  };
}

// The calendar view inside a time plan. Events that belong to an activity
// open that activity as a leaf on this same plan. Other events open a small
// details leaf here, with a way through to the original in the calendar.
export function timePlanCalendarNavigation(
  timePlanRefId: EntityId,
  date: ADate,
  period: RecurringTaskPeriod,
  activityRefIdByEvent: Map<string, string>,
): CalendarNavigationValue {
  const calendarBasePath = "/app/workspace/calendar";
  const timePlanBasePath = `/app/workspace/time-plans/${encodeURIComponent(timePlanRefId)}`;
  const params = new URLSearchParams({
    date: date,
    period: period,
    view: "calendar",
    timePlanRefId: timePlanRefId,
  });

  return {
    eventPath: (kind, refId) => {
      const activityRefId = activityRefIdByEvent.get(
        calendarEventLinkKey(kind, refId),
      );
      if (activityRefId !== undefined) {
        return `${timePlanBasePath}/${encodeURIComponent(activityRefId)}`;
      }

      return `${timePlanBasePath}/calendar-event/${kind}/${encodeURIComponent(refId)}`;
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
  const cleaned = new URLSearchParams(searchParams);
  cleaned.delete("sourceStartDate");
  cleaned.delete("sourceStartTimeInDay");
  cleaned.delete("sourceDurationMins");

  const timePlanRefId = cleaned.get("timePlanRefId");
  if (timePlanRefId !== null && timePlanRefId !== "") {
    // Only the calendar view of a time plan opens these panels, so that's the
    // view to come back to - said out loud rather than read off the query,
    // where "view" belongs to the calendar.
    return withTimePlanView(
      `/app/workspace/time-plans/${encodeURIComponent(timePlanRefId)}`,
      TimePlanViewMode.CALENDAR,
    );
  }

  return `/app/workspace/calendar?${cleaned}`;
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
  // panels need it to come back to. The time plan calendar view already put
  // the leaf path together, and this just carries the view along.
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
