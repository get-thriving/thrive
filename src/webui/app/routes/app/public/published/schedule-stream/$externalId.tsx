import { AppPlatform, RecurringTaskPeriod } from "@jupiter/webapi-client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useSearchParams } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { parseParams, parseQuery } from "zodix";
import { periodName } from "@jupiter/core/common/recurring-task-period";
import {
  CalendarNavigationProvider,
  publishedScheduleStreamCalendarNavigation,
} from "@jupiter/core/calendar/component/calendar-navigation";
import { View } from "@jupiter/core/calendar/component/shared";
import { ViewAsCalendarDaily } from "@jupiter/core/calendar/component/view-as-calendar-daily";
import { ViewAsCalendarWeekly } from "@jupiter/core/calendar/component/view-as-calendar-weekly";
import { ViewAsScheduleDailyAndWeekly } from "@jupiter/core/calendar/component/view-as-schedule-daily-and-weekly";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  NavMultipleCompact,
  NavMultipleSpread,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
} from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { inferPlatformAndDistribution } from "@jupiter/core/frontdoor.server";

import { getGuestApiClient } from "~/api-clients.server";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { newURLParams } from "~/logic/navigation";

const ParamsSchema = z.object({
  externalId: z.string(),
});

const QuerySchema = z.object({
  date: z
    .string()
    .regex(/[0-9][0-9][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/)
    .optional(),
  period: z.nativeEnum(RecurringTaskPeriod).optional(),
  view: z.nativeEnum(View).optional(),
});

const ALLOWED_PERIODS = [
  RecurringTaskPeriod.DAILY,
  RecurringTaskPeriod.WEEKLY,
] as const;

function defaultPeriodForPlatform(platform: AppPlatform): RecurringTaskPeriod {
  return platform === AppPlatform.MOBILE_IOS ||
    platform === AppPlatform.MOBILE_ANDROID
    ? RecurringTaskPeriod.DAILY
    : RecurringTaskPeriod.WEEKLY;
}

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId } = parseParams(params, ParamsSchema);
    const query = parseQuery(request, QuerySchema);
    const url = new URL(request.url);

    const { platform } = inferPlatformAndDistribution(
      request.headers.get("User-Agent"),
    );

    const defaultPeriod = defaultPeriodForPlatform(platform);

    if (
      query.date === undefined ||
      query.period === undefined ||
      query.view === undefined ||
      (query.period !== undefined &&
        !ALLOWED_PERIODS.includes(
          query.period as (typeof ALLOWED_PERIODS)[number],
        ))
    ) {
      url.searchParams.set("date", query.date || DateTime.now().toISODate());
      url.searchParams.set(
        "period",
        query.period &&
          ALLOWED_PERIODS.includes(
            query.period as (typeof ALLOWED_PERIODS)[number],
          )
          ? query.period
          : defaultPeriod,
      );
      url.searchParams.set("view", query.view || View.CALENDAR);

      return redirect(url.pathname + url.search);
    }

    const apiClient = await getGuestApiClient(request);

    const [streamResponse, calendarResponse] = await Promise.all([
      apiClient.schedule.scheduleStreamLoadPublic({
        external_id: externalId,
      }),
      apiClient.calendar.calendarLoadPublicForScheduleStream({
        external_id: externalId,
        right_now: query.date,
        period: query.period,
        stats_subperiod: null,
      }),
    ]);

    return json({
      externalId,
      scheduleStream: streamResponse.schedule_stream,
      date: query.date as string,
      period: query.period as RecurringTaskPeriod,
      view: query.view as View,
      periodStartDate: calendarResponse.period_start_date,
      periodEndDate: calendarResponse.period_end_date,
      prevPeriodStartDate: calendarResponse.prev_period_start_date,
      nextPeriodStartDate: calendarResponse.next_period_start_date,
      entries: calendarResponse.entries || undefined,
      stats: calendarResponse.stats || undefined,
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

const REFRESH_RIGHT_NOW_MS = 1000 * 60 * 5;

export default function PublishedScheduleStream() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const [query] = useSearchParams();

  const calendarLocation = "";
  const isAdding = false;
  const basePath = `/app/public/published/schedule-stream/${loaderData.externalId}`;

  const calendarNavigation = useMemo(
    () => publishedScheduleStreamCalendarNavigation(loaderData.externalId),
    [loaderData.externalId],
  );

  const [rightNow, setRightNow] = useState(
    DateTime.local({ zone: topLevelInfo.user.timezone }),
  );
  const theRealToday = rightNow.toISODate()!;

  useEffect(() => {
    const timeout = setInterval(() => {
      setRightNow(DateTime.local({ zone: topLevelInfo.user.timezone }));
    }, REFRESH_RIGHT_NOW_MS);

    return () => {
      clearInterval(timeout);
    };
  }, [topLevelInfo.user.timezone]);

  const viewProps = {
    rightNow,
    timezone: topLevelInfo.user.timezone,
    today: theRealToday,
    period: loaderData.period,
    periodStartDate: loaderData.periodStartDate,
    periodEndDate: loaderData.periodEndDate,
    entries: loaderData.entries,
    stats: loaderData.stats,
    calendarLocation,
    isAdding,
  };

  const calendarActions = (
    <SectionActions
      id="published-schedule-stream"
      topLevelInfo={topLevelInfo}
      inputsEnabled={true}
      actions={[
        NavMultipleSpread({
          navs: [
            NavSingle({
              text: "Today",
              link: `${basePath}?${newURLParams(query, "date", theRealToday)}`,
            }),
            NavSingle({
              text: "Prev",
              icon: <ArrowBackIcon />,
              link: `${basePath}?${newURLParams(
                query,
                "date",
                loaderData.prevPeriodStartDate,
              )}`,
            }),
            NavSingle({
              text: "Next",
              icon: <ArrowForwardIcon />,
              link: `${basePath}?${newURLParams(
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
              link: `${basePath}?${newURLParams(
                query,
                "period",
                RecurringTaskPeriod.DAILY,
              )}`,
            }),
            NavSingle({
              text: periodName(RecurringTaskPeriod.WEEKLY),
              highlight: loaderData.period === RecurringTaskPeriod.WEEKLY,
              link: `${basePath}?${newURLParams(
                query,
                "period",
                RecurringTaskPeriod.WEEKLY,
              )}`,
            }),
          ],
        }),
        NavMultipleCompact({
          navs: [
            NavSingle({
              text: "Calendar",
              link: `${basePath}?${newURLParams(query, "view", View.CALENDAR)}`,
              highlight: loaderData.view === View.CALENDAR,
            }),
            NavSingle({
              text: "Schedule",
              link: `${basePath}?${newURLParams(query, "view", View.SCHEDULE)}`,
              highlight: loaderData.view === View.SCHEDULE,
            }),
          ],
        }),
      ]}
    />
  );

  return (
    <CalendarNavigationProvider value={calendarNavigation}>
      <LeafPanel
        key={`published-schedule-stream-${loaderData.externalId}`}
        fakeKey={`published-schedule-stream-${loaderData.externalId}`}
        inputsEnabled={false}
        entityNotEditable={true}
        disabled={true}
        returnLocation="/app"
        initialExpansionState={LeafPanelExpansionState.FULL}
        allowedExpansionStates={[LeafPanelExpansionState.FULL]}
        shouldShowALeaflet={shouldShowALeaflet}
      >
        <NestingAwareBlock shouldHide={shouldShowALeaflet}>
          <SectionCard
            title={loaderData.scheduleStream.name}
            actions={calendarActions}
          >
            {loaderData.view === View.CALENDAR &&
              loaderData.period === RecurringTaskPeriod.DAILY && (
                <ViewAsCalendarDaily {...viewProps} />
              )}

            {loaderData.view === View.CALENDAR &&
              loaderData.period === RecurringTaskPeriod.WEEKLY && (
                <ViewAsCalendarWeekly {...viewProps} />
              )}

            {loaderData.view === View.SCHEDULE && (
              <ViewAsScheduleDailyAndWeekly {...viewProps} />
            )}
          </SectionCard>
        </NestingAwareBlock>

        <AnimatePresence mode="wait" initial={false}>
          <Outlet />
        </AnimatePresence>
      </LeafPanel>
    </CalendarNavigationProvider>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("/app", ParamsSchema, {
  notFound: (params) =>
    `Could not find published schedule stream ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published schedule stream ${params.externalId}! Please try again!`,
});
