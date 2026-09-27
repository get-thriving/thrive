import type { ADate } from "@jupiter/webapi-client";
import { AppPlatform, RecurringTaskPeriod } from "@jupiter/webapi-client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TuneIcon from "@mui/icons-material/Tune";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import {
  redirect,
  useLocation,
  useNavigation,
  useSearchParams,
} from "react-router";
import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { parseQuery } from "zodix";
import { periodName } from "@jupiter/core/common/recurring-task-period";
import { statsSubperiodForPeriod } from "@jupiter/core/common/sub/time_events/time-event";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { NestedOutlet } from "@jupiter/core/infra/component/layout/nested-outlet";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  NavMultipleCompact,
  NavMultipleSpread,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { inferPlatformAndDistribution } from "@jupiter/core/frontdoor.server";
import {
  DisplayType,
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { View } from "@jupiter/core/calendar/component/shared";
import { CalendarEventDragProvider } from "@jupiter/core/calendar/component/event-drag";
import { ViewAsCalendarDaily } from "@jupiter/core/calendar/component/view-as-calendar-daily";
import { ViewAsCalendarWeekly } from "@jupiter/core/calendar/component/view-as-calendar-weekly";
import { ViewAsCalendarMonthly } from "@jupiter/core/calendar/component/view-as-calendar-monthly";
import { ViewAsCalendarQuarterly } from "@jupiter/core/calendar/component/view-as-calendar-quarterly";
import { ViewAsCalendarYearly } from "@jupiter/core/calendar/component/view-as-calendar-yearly";
import { ViewAsScheduleMonthlyQuarterlyAndYearly } from "@jupiter/core/calendar/component/view-as-schedule-monthly-quarterly-and-yearly";
import { ViewAsScheduleDailyAndWeekly } from "@jupiter/core/calendar/component/view-as-schedule-daily-and-weekly";
import { useLoaderDataSafeForAnimation } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "@jupiter/core/infra/should-revalidate";
import { newURLParams } from "@jupiter/core/infra/navigation";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

const QuerySchema = z.object({
  date: z
    .string()
    .regex(/[0-9][0-9][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/)
    .optional(),
  period: z.nativeEnum(RecurringTaskPeriod).optional(),
  view: z.nativeEnum(View).optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);
  const url = new URL(request.url);

  const { platform } = inferPlatformAndDistribution(
    request.headers.get("User-Agent"),
  );

  if (
    query.date === undefined ||
    query.period === undefined ||
    query.view === undefined
  ) {
    // We do it like this so we keep the query params that are already there.
    url.searchParams.set("date", query.date || DateTime.now().toISODate());
    url.searchParams.set(
      "period",
      query.period ||
        (platform === AppPlatform.MOBILE_IOS ||
        platform === AppPlatform.MOBILE_ANDROID
          ? RecurringTaskPeriod.DAILY
          : RecurringTaskPeriod.WEEKLY),
    );
    url.searchParams.set("view", query.view || View.CALENDAR);

    return redirect(url.pathname + url.search);
  }

  const response = await apiClient.calendar.calendarLoadForDateAndPeriod({
    right_now: query.date,
    period: query.period,
    stats_subperiod: statsSubperiodForPeriod(query.period),
  });

  return {
    date: query.date as string,
    period: query.period as RecurringTaskPeriod,
    view: query.view as View,
    periodStartDate: response.period_start_date,
    periodEndDate: response.period_end_date,
    prevPeriodStartDate: response.prev_period_start_date,
    nextPeriodStartDate: response.next_period_start_date,
    entries: response.entries || undefined,
    stats: response.stats || undefined,
    additionalTimezones: response.additional_timezones,
  };
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

const REFRESH_RIGHT_NOW_MS = 1000 * 60 * 5; // 5 minutes

export default function CalendarView() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const navigation = useNavigation();
  const location = useLocation();
  const [query] = useSearchParams();

  const calendarLocation = location.pathname.replace(
    /\/app\/workspace\/calendar/,
    "",
  );
  const isAdding = location.pathname.endsWith("/new");

  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const [rightNow, setRightNow] = useState(
    DateTime.local({ zone: topLevelInfo.user.timezone }),
  );
  const theRealToday = rightNow.toISODate() as ADate;

  useEffect(() => {
    const timeout = setInterval(() => {
      setRightNow(DateTime.local({ zone: topLevelInfo.user.timezone }));
    }, REFRESH_RIGHT_NOW_MS);

    return () => {
      clearInterval(timeout);
    };
  }, [topLevelInfo.user.timezone]);

  return (
    <TrunkPanel
      key="calendar"
      createLocation={`/app/workspace/calendar/schedule/event-in-day/new?${query}`}
      actions={
        <SectionActions
          id="calendar"
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          actions={[
            NavMultipleCompact({
              navs: [
                NavSingle({
                  text: "New Event In Day",
                  link: `/app/workspace/calendar/schedule/event-in-day/new?${query}`,
                }),
                NavSingle({
                  text: "New Event Full Days",
                  link: `/app/workspace/calendar/schedule/event-full-days/new?${query}`,
                }),
                NavSingle({
                  text: "New Calendar Stream",
                  link: `/app/workspace/calendar/schedule/stream/new?${query}`,
                }),
                NavSingle({
                  text: "New External Calendar Stream",
                  link: `/app/workspace/calendar/schedule/stream/new-external?${query}`,
                }),
                NavSingle({
                  text: "View Calendar Streams",
                  link: `/app/workspace/calendar/schedule/stream?${query}`,
                }),
                NavSingle({
                  text: "New Calendar Export",
                  link: `/app/workspace/calendar/schedule/export/new?${query}`,
                }),
                NavSingle({
                  text: "View Calendar Exports",
                  link: `/app/workspace/calendar/schedule/export?${query}`,
                }),
              ],
            }),
            NavMultipleSpread({
              navs: [
                NavSingle({
                  text: "Today",
                  link: `/app/workspace/calendar${calendarLocation}?${newURLParams(
                    query,
                    "date",
                    theRealToday,
                  )}`,
                }),
                NavSingle({
                  text: "Prev",
                  icon: <ArrowBackIcon />,
                  link: `/app/workspace/calendar${calendarLocation}?${newURLParams(
                    query,
                    "date",
                    loaderData.prevPeriodStartDate,
                  )}`,
                }),
                NavSingle({
                  text: "Next",
                  icon: <ArrowForwardIcon />,
                  link: `/app/workspace/calendar${calendarLocation}?${newURLParams(
                    query,
                    "date",
                    loaderData.nextPeriodStartDate,
                  )}`,
                }),
              ],
            }),
            NavMultipleCompact({
              navs: [
                NavSingle({
                  text: periodName(RecurringTaskPeriod.DAILY),
                  highlight: loaderData.period === RecurringTaskPeriod.DAILY,
                  link: `/app/workspace/calendar${calendarLocation}?${newURLParams(
                    query,
                    "period",
                    RecurringTaskPeriod.DAILY,
                  )}`,
                }),
                NavSingle({
                  text: periodName(RecurringTaskPeriod.WEEKLY),
                  highlight: loaderData.period === RecurringTaskPeriod.WEEKLY,
                  link: `/app/workspace/calendar${calendarLocation}?${newURLParams(
                    query,
                    "period",
                    RecurringTaskPeriod.WEEKLY,
                  )}`,
                }),
                NavSingle({
                  text: periodName(RecurringTaskPeriod.MONTHLY),
                  highlight: loaderData.period === RecurringTaskPeriod.MONTHLY,
                  link: `/app/workspace/calendar${calendarLocation}?${newURLParams(
                    query,
                    "period",
                    RecurringTaskPeriod.MONTHLY,
                  )}`,
                }),
                NavSingle({
                  text: periodName(RecurringTaskPeriod.QUARTERLY),
                  highlight:
                    loaderData.period === RecurringTaskPeriod.QUARTERLY,
                  link: `/app/workspace/calendar${calendarLocation}?${newURLParams(
                    query,
                    "period",
                    RecurringTaskPeriod.QUARTERLY,
                  )}`,
                }),
                NavSingle({
                  text: periodName(RecurringTaskPeriod.YEARLY),
                  highlight: loaderData.period === RecurringTaskPeriod.YEARLY,
                  link: `/app/workspace/calendar${calendarLocation}?${newURLParams(
                    query,
                    "period",
                    RecurringTaskPeriod.YEARLY,
                  )}`,
                }),
              ],
            }),
            NavMultipleCompact({
              navs: [
                NavSingle({
                  text: "Calendar",
                  link: `/app/workspace/calendar${calendarLocation}?${newURLParams(
                    query,
                    "view",
                    View.CALENDAR,
                  )}`,
                  highlight: loaderData.view === View.CALENDAR,
                }),
                NavSingle({
                  text: "Schedule",
                  link: `/app/workspace/calendar${calendarLocation}?${newURLParams(
                    query,
                    "view",
                    View.SCHEDULE,
                  )}`,
                  highlight: loaderData.view === View.SCHEDULE,
                }),
              ],
            }),
            NavSingle({
              text: "Settings",
              link: `/app/workspace/calendar/settings`,
              icon: <TuneIcon />,
            }),
          ]}
        />
      }
      returnLocation="/app/workspace"
    >
      <CalendarEventDragProvider timezone={topLevelInfo.user.timezone}>
        <NestingAwareBlock
          branchForceHide={shouldShowABranch}
          shouldHide={shouldShowABranch || shouldShowALeafToo}
        >
          {loaderData.view === View.CALENDAR &&
            loaderData.period === RecurringTaskPeriod.DAILY && (
              <ViewAsCalendarDaily
                rightNow={rightNow}
                timezone={topLevelInfo.user.timezone}
                additionalTimezones={loaderData.additionalTimezones}
                today={theRealToday}
                period={loaderData.period}
                periodStartDate={loaderData.periodStartDate}
                periodEndDate={loaderData.periodEndDate}
                entries={loaderData.entries}
                stats={loaderData.stats}
                calendarLocation={calendarLocation}
                isAdding={isAdding}
              />
            )}

          {loaderData.view === View.CALENDAR &&
            loaderData.period === RecurringTaskPeriod.WEEKLY && (
              <ViewAsCalendarWeekly
                timezone={topLevelInfo.user.timezone}
                rightNow={rightNow}
                additionalTimezones={loaderData.additionalTimezones}
                today={theRealToday}
                period={loaderData.period}
                periodStartDate={loaderData.periodStartDate}
                periodEndDate={loaderData.periodEndDate}
                entries={loaderData.entries}
                stats={loaderData.stats}
                calendarLocation={calendarLocation}
                isAdding={isAdding}
              />
            )}

          {loaderData.view === View.CALENDAR &&
            loaderData.period === RecurringTaskPeriod.MONTHLY && (
              <ViewAsCalendarMonthly
                timezone={topLevelInfo.user.timezone}
                rightNow={rightNow}
                today={theRealToday}
                period={loaderData.period}
                periodStartDate={loaderData.periodStartDate}
                periodEndDate={loaderData.periodEndDate}
                entries={loaderData.entries}
                stats={loaderData.stats}
                calendarLocation={calendarLocation}
                isAdding={isAdding}
              />
            )}

          {loaderData.view === View.CALENDAR &&
            loaderData.period === RecurringTaskPeriod.QUARTERLY && (
              <ViewAsCalendarQuarterly
                timezone={topLevelInfo.user.timezone}
                rightNow={rightNow}
                today={theRealToday}
                period={loaderData.period}
                periodStartDate={loaderData.periodStartDate}
                periodEndDate={loaderData.periodEndDate}
                entries={loaderData.entries}
                stats={loaderData.stats}
                calendarLocation={calendarLocation}
                isAdding={isAdding}
              />
            )}

          {loaderData.view === View.CALENDAR &&
            loaderData.period === RecurringTaskPeriod.YEARLY && (
              <ViewAsCalendarYearly
                timezone={topLevelInfo.user.timezone}
                rightNow={rightNow}
                today={theRealToday}
                period={loaderData.period}
                periodStartDate={loaderData.periodStartDate}
                periodEndDate={loaderData.periodEndDate}
                entries={loaderData.entries}
                stats={loaderData.stats}
                calendarLocation={calendarLocation}
                isAdding={isAdding}
              />
            )}

          {loaderData.view === View.SCHEDULE &&
            (loaderData.period === RecurringTaskPeriod.DAILY ||
              loaderData.period === RecurringTaskPeriod.WEEKLY) && (
              <ViewAsScheduleDailyAndWeekly
                timezone={topLevelInfo.user.timezone}
                rightNow={rightNow}
                today={theRealToday}
                period={loaderData.period}
                periodStartDate={loaderData.periodStartDate}
                periodEndDate={loaderData.periodEndDate}
                entries={loaderData.entries}
                stats={loaderData.stats}
                calendarLocation={calendarLocation}
                isAdding={isAdding}
              />
            )}

          {loaderData.view === View.SCHEDULE &&
            (loaderData.period === RecurringTaskPeriod.MONTHLY ||
              loaderData.period === RecurringTaskPeriod.QUARTERLY ||
              loaderData.period === RecurringTaskPeriod.YEARLY) && (
              <ViewAsScheduleMonthlyQuarterlyAndYearly
                timezone={topLevelInfo.user.timezone}
                rightNow={rightNow}
                today={theRealToday}
                period={loaderData.period}
                periodStartDate={loaderData.periodStartDate}
                periodEndDate={loaderData.periodEndDate}
                entries={loaderData.entries}
                stats={loaderData.stats}
                calendarLocation={calendarLocation}
                isAdding={isAdding}
              />
            )}
        </NestingAwareBlock>
      </CalendarEventDragProvider>

      <NestedOutlet />
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () =>
    `There was an error loading the calendar events! Please try again!`,
});
