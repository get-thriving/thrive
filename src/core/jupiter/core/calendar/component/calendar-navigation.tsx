import { RecurringTaskPeriod } from "@jupiter/webapi-client";
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
    statsPath: (calendarLocation, periodStartDate, period, view) =>
      `${calendarBasePath}${calendarLocation}?date=${periodStartDate}&period=${period}&view=${view}`,
  };
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

  const path = basePath.includes("?")
    ? `${basePath}&${query}`
    : `${basePath}?${query}`;

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
