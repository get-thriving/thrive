import { json, LoaderFunctionArgs } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useContext } from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { LifePlan } from "@jupiter/webapi-client";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { lifePlanBirthdayDate } from "@jupiter/core/life_plan/root";
import { aDateToDate } from "@jupiter/core/common/adate";

import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
  });

  return json({
    lifePlan: summaryResponse.life_plan as LifePlan,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

const TOTAL_YEARS = 100;
const WEEKS_PER_YEAR = 52;

export default function LifeWeeks() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const birthday = lifePlanBirthdayDate(loaderData.lifePlan);
  const today = aDateToDate(topLevelInfo.today);

  return (
    <LeafPanel
      key="life-weeks"
      fakeKey="life-weeks"
      returnLocation="/app/workspace/life-plan"
      shouldShowALeaflet={shouldShowALeaflet}
      inputsEnabled={true}
      initialExpansionState={LeafPanelExpansionState.LARGE}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        <SectionCard title="Life Weeks">
          <LifeWeeksGrid birthday={birthday} today={today} />
        </SectionCard>
      </NestingAwareBlock>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  () => `There was an error loading the life weeks view! Please try again!`,
);

interface LifeWeeksGridProps {
  birthday: DateTime;
  today: DateTime;
}

function LifeWeeksGrid({ birthday, today }: LifeWeeksGridProps) {
  const todayMillis = today.toMillis();

  return (
    <Box sx={{ overflowX: "auto" }}>
      {Array.from({ length: TOTAL_YEARS }, (_, year) => {
        const yearLabel = year.toString().padStart(2, "0");
        return (
          <Stack key={year} direction="row" sx={{ alignItems: "center" }}>
            <Typography
              variant="caption"
              sx={{
                width: "2rem",
                minWidth: "2rem",
                fontSize: "0.55rem",
                color: "text.disabled",
                userSelect: "none",
              }}
            >
              {yearLabel}
            </Typography>
            {Array.from({ length: WEEKS_PER_YEAR }, (_, week) => {
              const weekIndex = year * WEEKS_PER_YEAR + week;
              const weekStart = birthday.plus({ weeks: weekIndex });
              const weekEnd = weekStart.plus({ weeks: 1 });
              const weekStartMillis = weekStart.toMillis();
              const weekEndMillis = weekEnd.toMillis();

              const isCurrent =
                weekStartMillis <= todayMillis &&
                todayMillis < weekEndMillis;
              const isPast = weekEndMillis <= todayMillis;

              const backgroundColor = isCurrent
                ? "#ffd700"
                : isPast
                  ? "#cccccc"
                  : "#f0f0f0";

              const tooltipTitle = `Age ${year}, Week ${week + 1} · ${weekStart.toFormat("LLL d, yyyy")}`;

              return (
                <Tooltip key={week} title={tooltipTitle} placement="top">
                  <Box
                    sx={{
                      width: "9px",
                      height: "9px",
                      margin: "1px",
                      flexShrink: 0,
                      backgroundColor,
                    }}
                  />
                </Tooltip>
              );
            })}
          </Stack>
        );
      })}
    </Box>
  );
}
