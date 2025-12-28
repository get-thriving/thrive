import {
  ADate,
  ChapterSummary,
  EntityId,
  GoalSummary,
  LifePlan,
  ProjectSummary,
  RecurringTaskPeriod,
  TimePlan,
  type TimePlanFindResultEntry,
} from "@jupiter/webapi-client";
import { Button, Stack } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Link, Outlet, useNavigation } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import {
  findTimePlansThatAreActive,
  sortTimePlansNaturally,
} from "@jupiter/core/time_plans/root";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { TimePlanCard } from "@jupiter/core/time_plans/component/card";
import { TimePlanStack } from "@jupiter/core/time_plans/component/stack";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import {
  DisplayType,
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import {
  TopLevelInfo,
  TopLevelInfoContext,
} from "@jupiter/core/infra/top-level-context";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_projects: true,
    include_chapters: true,
    include_goals: true,
  });

  const response = await apiClient.timePlans.timePlanFind({
    allow_archived: false,
    include_notes: false,
    include_planning_tasks: true,
    include_life_plan_ref_ids: true,
  });
  const timePlanSettingsResponse =
    await apiClient.timePlans.timePlanLoadSettings({});

  return json({
    entries: response.entries,
    timePlanSettings: timePlanSettingsResponse,
    lifePlan: summaryResponse.life_plan as LifePlan,
    allProjects: summaryResponse.projects as Array<ProjectSummary>,
    allChapters: summaryResponse.chapters as Array<ChapterSummary>,
    allGoals: summaryResponse.goals as Array<GoalSummary>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function TimePlans() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();

  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();

  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const activeTimePlans = findTimePlansThatAreActive(
    loaderData.entries.map((e) => e.time_plan),
    topLevelInfo.today,
  );

  const yearTimePlan = activeTimePlans.find(
    (tp) => tp.period === RecurringTaskPeriod.YEARLY,
  );
  const quarterTimePlan = activeTimePlans.find(
    (tp) => tp.period === RecurringTaskPeriod.QUARTERLY,
  );
  const monthTimePlan = activeTimePlans.find(
    (tp) => tp.period === RecurringTaskPeriod.MONTHLY,
  );
  const weekTimePlan = activeTimePlans.find(
    (tp) => tp.period === RecurringTaskPeriod.WEEKLY,
  );
  const dayTimePlan = activeTimePlans.find(
    (tp) => tp.period === RecurringTaskPeriod.DAILY,
  );
  const sortedTimePlans = sortTimePlansNaturally(
    loaderData.entries.map((e) => e.time_plan),
  );
  const entriesByRefId = new Map<string, TimePlanFindResultEntry>();
  for (const entry of loaderData.entries) {
    entriesByRefId.set(entry.time_plan.ref_id, entry);
  }

  const allProjectsByRefId = new Map(
    loaderData.allProjects.map((p) => [p.ref_id, p]),
  );
  const allChaptersByRefId = new Map(
    loaderData.allChapters.map((c) => [c.ref_id, c]),
  );
  const allGoalsByRefId = new Map(
    loaderData.allGoals.map((g) => [g.ref_id, g]),
  );

  const timePlanProjectRefIds = new Map<string, Array<EntityId>>();
  const timePlanGoalRefIds = new Map<string, Array<EntityId>>();
  const timePlanChapterRefIds = new Map<string, Array<EntityId>>();

  for (const entry of loaderData.entries) {
    timePlanProjectRefIds.set(
      entry.time_plan.ref_id,
      entry.project_ref_ids ?? [],
    );
    timePlanGoalRefIds.set(entry.time_plan.ref_id, entry.goal_ref_ids ?? []);
    timePlanChapterRefIds.set(
      entry.time_plan.ref_id,
      entry.chapter_ref_ids ?? [],
    );
  }

  return (
    <TrunkPanel
      key={"time-plans"}
      createLocation="/app/workspace/time-plans/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="time-plans"
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          actions={[
            NavSingle({
              text: "Settings",
              link: `/app/workspace/time-plans/settings`,
              icon: <TuneIcon />,
            }),
          ]}
        />
      }
    >
      <NestingAwareBlock
        branchForceHide={shouldShowABranch}
        shouldHide={shouldShowABranch || shouldShowALeafToo}
      >
        {sortedTimePlans.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no time plans to show. You can create a new time plan."
            newEntityLocations="/app/workspace/time-plans/new"
            helpSubject={DocsHelpSubject.TIME_PLANS}
          />
        )}

        <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
          {loaderData.timePlanSettings.periods.includes(
            RecurringTaskPeriod.YEARLY,
          ) && (
            <CurrentTimePlan
              today={topLevelInfo.today}
              period={RecurringTaskPeriod.YEARLY}
              topLevelInfo={topLevelInfo}
              timePlan={yearTimePlan}
              label="Yearly Time Plan"
            />
          )}

          {loaderData.timePlanSettings.periods.includes(
            RecurringTaskPeriod.QUARTERLY,
          ) && (
            <CurrentTimePlan
              today={topLevelInfo.today}
              period={RecurringTaskPeriod.QUARTERLY}
              topLevelInfo={topLevelInfo}
              timePlan={quarterTimePlan}
              label="Quarterly Time Plan"
            />
          )}

          {loaderData.timePlanSettings.periods.includes(
            RecurringTaskPeriod.MONTHLY,
          ) && (
            <CurrentTimePlan
              today={topLevelInfo.today}
              period={RecurringTaskPeriod.MONTHLY}
              topLevelInfo={topLevelInfo}
              timePlan={monthTimePlan}
              label="Monthly Time Plan"
            />
          )}

          {loaderData.timePlanSettings.periods.includes(
            RecurringTaskPeriod.WEEKLY,
          ) && (
            <CurrentTimePlan
              today={topLevelInfo.today}
              period={RecurringTaskPeriod.WEEKLY}
              topLevelInfo={topLevelInfo}
              timePlan={weekTimePlan}
              label="Weekly Time Plan"
            />
          )}

          {loaderData.timePlanSettings.periods.includes(
            RecurringTaskPeriod.DAILY,
          ) && (
            <CurrentTimePlan
              today={topLevelInfo.today}
              period={RecurringTaskPeriod.DAILY}
              topLevelInfo={topLevelInfo}
              timePlan={dayTimePlan}
              label="Daily Time Plan"
            />
          )}
        </Stack>

        <TimePlanStack
          id="time-plans-all"
          label="All Time Plans"
          topLevelInfo={topLevelInfo}
          timePlans={sortedTimePlans}
          timePlanProjectRefIds={timePlanProjectRefIds}
          timePlanGoalRefIds={timePlanGoalRefIds}
          timePlanChapterRefIds={timePlanChapterRefIds}
          allProjectsByRefId={allProjectsByRefId}
          allGoalsByRefId={allGoalsByRefId}
          allChaptersByRefId={allChaptersByRefId}
        />
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

interface CurrentTimePlanProps {
  label: string;
  today: ADate;
  period: RecurringTaskPeriod;
  timePlan?: TimePlan;
  topLevelInfo: TopLevelInfo;
}

function CurrentTimePlan(props: CurrentTimePlanProps) {
  if (!props.timePlan) {
    return (
      <Button
        variant="outlined"
        component={Link}
        to={`/app/workspace/time-plans/new?initialPeriod=${props.period}&initialRightNow=${props.today}`}
      >
        Create a {props.label}
      </Button>
    );
  }

  return (
    <TimePlanCard
      key={`time-plan-${props.timePlan.ref_id}`}
      topLevelInfo={props.topLevelInfo}
      timePlan={props.timePlan}
      projects={[]}
      goals={[]}
      chapters={[]}
      label={props.label}
      showOptions={{
        showSource: false,
        showPeriod: false,
      }}
    />
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the time plans! Please try again!`,
});
