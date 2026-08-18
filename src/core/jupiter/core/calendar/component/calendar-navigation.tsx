import { EntityId, RecurringTaskPeriod } from "@jupiter/webapi-client";
import { Box } from "@mui/material";
import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import { useLocation, useMatches, useSearchParams } from "@remix-run/react";

import { EntityLink } from "#/core/infra/component/entity-card";
import { TIME_PLAN_GROUPING_PARAM } from "#/core/apps/time_plans/grouping";
import {
  TimePlanViewMode,
  withTimePlanView,
} from "#/core/apps/time_plans/view-mode";
import { DisplayType } from "#/core/infra/component/use-nested-entities";

export const CALENDAR_EVENT_LINK_KINDS = [
  "schedule-event-in-day",
  "schedule-event-full-days",
  "time-event-in-day-block",
  "time-event-full-days-block",
] as const;

// Which time event on the calendar opened this activity, so the activity
// leaf can take that event off without taking the activity with it.
export const TIME_PLAN_ACTIVITY_TIME_EVENT_PARAM = "timeEventRefId";

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
  activityRefIdByEvent: Map<string, string>,
): CalendarNavigationValue {
  const calendarBasePath = "/app/workspace/calendar";
  const timePlanBasePath = `/app/workspace/apps/time-plans/${encodeURIComponent(timePlanRefId)}`;

  return {
    eventPath: (kind, refId) => {
      const activityRefId = activityRefIdByEvent.get(
        calendarEventLinkKey(kind, refId),
      );
      if (activityRefId !== undefined) {
        const activityPath = `${timePlanBasePath}/${encodeURIComponent(activityRefId)}`;
        if (kind === "time-event-in-day-block") {
          return `${activityPath}?${TIME_PLAN_ACTIVITY_TIME_EVENT_PARAM}=${encodeURIComponent(refId)}`;
        }
        return activityPath;
      }

      return `${timePlanBasePath}/calendar-event/${kind}/${encodeURIComponent(refId)}`;
    },
    newInDayEventPath: (query) =>
      `${timePlanBasePath}/new-schedule-event-in-day?${query}`,
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
      `/app/workspace/apps/time-plans/${encodeURIComponent(timePlanRefId)}`,
      TimePlanViewMode.CALENDAR,
      cleaned.get(TIME_PLAN_GROUPING_PARAM),
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

export type OpenCalendarInDayEvent = {
  kind:
    | "schedule-event-in-day"
    | "time-event-in-day-block"
    | "time-plan-activity";
  refId: string;
};

// Which in-day event the open leaf is talking about, from the URL rather
// than from the query the leaf writes after it mounts - so a reload still
// knows which box to mark.
export function parseOpenCalendarInDayEvent(
  pathname: string,
  query: URLSearchParams,
): OpenCalendarInDayEvent | null {
  const scheduleInDay = pathname.match(
    /\/calendar\/schedule\/event-in-day\/([^/]+)$/,
  );
  if (scheduleInDay !== null && scheduleInDay[1] !== "new") {
    return {
      kind: "schedule-event-in-day",
      refId: decodeURIComponent(scheduleInDay[1]),
    };
  }

  const inDayBlock = pathname.match(
    /\/calendar\/time-event\/in-day-block\/([^/]+)$/,
  );
  if (inDayBlock !== null && !inDayBlock[1].startsWith("new")) {
    return {
      kind: "time-event-in-day-block",
      refId: decodeURIComponent(inDayBlock[1]),
    };
  }

  const timePlanEvent = pathname.match(
    /\/time-plans\/[^/]+\/calendar-event\/([^/]+)\/([^/]+)$/,
  );
  if (timePlanEvent !== null) {
    const kind = timePlanEvent[1];
    if (kind === "schedule-event-in-day" || kind === "time-event-in-day-block") {
      return {
        kind: kind,
        refId: decodeURIComponent(timePlanEvent[2]),
      };
    }
  }

  const published = pathname.match(
    /\/publish\/schedule-stream\/[^/]+\/in-day-event\/([^/]+)$/,
  );
  if (published !== null) {
    return {
      kind: "schedule-event-in-day",
      refId: decodeURIComponent(published[1]),
    };
  }

  const timePlanLeaf = pathname.match(/\/time-plans\/[^/]+\/([^/]+)$/);
  if (timePlanLeaf !== null) {
    const leaf = timePlanLeaf[1];
    if (
      leaf === "new" ||
      leaf.startsWith("add-from-") ||
      leaf.startsWith("new-")
    ) {
      return null;
    }

    const timeEventRefId = query.get(TIME_PLAN_ACTIVITY_TIME_EVENT_PARAM);
    if (timeEventRefId !== null && timeEventRefId !== "") {
      return {
        kind: "time-event-in-day-block",
        refId: timeEventRefId,
      };
    }

    return {
      kind: "time-plan-activity",
      refId: decodeURIComponent(leaf),
    };
  }

  return null;
}

export function useOpenCalendarInDayEvent(): OpenCalendarInDayEvent | null {
  const location = useLocation();
  const [query] = useSearchParams();
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  // The calendar trunk stays mounted under a leaf, so only a real leaf
  // means an event is selected - not leftover query on the calendar itself.
  if (
    typeof lastMatch?.handle !== "object" ||
    lastMatch.handle === null ||
    !("displayType" in lastMatch.handle) ||
    lastMatch.handle.displayType !== DisplayType.LEAF
  ) {
    return null;
  }

  return parseOpenCalendarInDayEvent(location.pathname, query);
}

// A new-event leaf, as opposed to an existing one. The slot preview only
// belongs here - leftover source query after closing a leaf must not keep
// drawing a box on the calendar.
export function isCreatingCalendarInDayEvent(pathname: string): boolean {
  const scheduleInDay = pathname.match(
    /\/calendar\/schedule\/event-in-day\/([^/]+)$/,
  );
  if (scheduleInDay !== null && scheduleInDay[1] === "new") {
    return true;
  }

  const inDayBlock = pathname.match(
    /\/calendar\/time-event\/in-day-block\/([^/]+)$/,
  );
  if (inDayBlock !== null && inDayBlock[1].startsWith("new")) {
    return true;
  }

  const timePlanLeaf = pathname.match(/\/time-plans\/[^/]+\/([^/]+)$/);
  if (timePlanLeaf !== null) {
    const leaf = timePlanLeaf[1];
    return leaf === "new" || leaf.startsWith("new-");
  }

  return false;
}

export function useCreatingCalendarInDayEvent(): boolean {
  const location = useLocation();
  return isCreatingCalendarInDayEvent(location.pathname);
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
