import type {
  HabitFindSuitableForTimePlanResultEntry,
  HabitStackFindSuitableForTimePlanResultEntry,
} from "@jupiter/webapi-client";
import {
  RecurringTaskPeriod,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import { FormControl, FormLabel, Stack, Typography } from "@mui/material";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import {
  redirect,
  useActionData,
  useNavigation,
  useParams,
  useSearchParams,
} from "react-router";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";

import {
  HABIT,
  entityLinkRefIdFromWire,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import {
  comparePeriods,
  periodName,
} from "#/core/common/recurring-task-period";
import { RecurringTaskPeriodProgress } from "#/core/common/component/recurring-task-period-progress";
import {
  groupInboxTasksByOwnerRefId,
  recurringTargetPeriodProgress,
} from "#/core/apps/time_plans/recurring-target-progress";
import { compareADate } from "#/core/common/adate";
import {
  isTimePlanActivityHabitStackTarget,
  isTimePlanActivityHabitTarget,
} from "#/core/apps/time_plans/sub/activity/target-wire";
import { AspectTag } from "#/core/apps/life_plan/sub/aspects/component/tag";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { withTimePlanView } from "#/core/apps/time_plans/view-mode";
import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  FilterFewOptionsCompact,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TimePlanActivityFeasabilitySelect } from "#/core/apps/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "#/core/apps/time_plans/sub/activity/component/kind-select";
import { LeafPanelExpansionState } from "#/core/infra/leaf-panel-expansion";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { timePlanAllowsInboxTasks } from "#/core/apps/time_plans/root";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "#/core/infra/errors.server";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";
import { useSectionFilters } from "#/core/infra/component/use-section-filter";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.object({
  intent: z.literal("add"),
  targetHabitRefIds: z
    .string()
    .transform((s) => (s === "" ? [] : s.split(","))),
  targetHabitStackRefIds: z
    .string()
    .transform((s) => (s === "" ? [] : s.split(","))),
  kind: z.nativeEnum(TimePlanActivityKind),
  feasability: z.nativeEnum(TimePlanActivityFeasability),
});

const PERIOD_SECTIONS = [
  RecurringTaskPeriod.YEARLY,
  RecurringTaskPeriod.QUARTERLY,
  RecurringTaskPeriod.MONTHLY,
  RecurringTaskPeriod.WEEKLY,
  RecurringTaskPeriod.DAILY,
] as const;

enum ShowFilter {
  IN_PERIOD = "in-period",
  ALL = "all",
}

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const timePlanResult = await apiClient.timePlans.timePlanLoad({
      ref_id: id,
      allow_archived: false,
      include_targets: false,
      include_completed_nontarget: false,
      include_other_time_plans: false,
    });

    if (!timePlanAllowsInboxTasks(timePlanResult.time_plan)) {
      throw new Response(
        "Habits can only be added to daily or weekly time plans",
        { status: 400 },
      );
    }

    const [habitsResult, stacksResult] = await Promise.all([
      apiClient.habits.habitFindSuitableForTimePlan({
        time_plan_ref_id: id,
      }),
      apiClient.habits.habitStackFindSuitableForTimePlan({
        time_plan_ref_id: id,
      }),
    ]);

    const habitRefIdsForInboxTasks = [
      ...habitsResult.entries
        .filter(
          (entry) =>
            entry.has_uncompleted_historical_inbox_tasks ||
            comparePeriods(
              entry.habit.gen_params.period,
              timePlanResult.time_plan.period,
            ) > 0,
        )
        .map((entry) => entry.habit.ref_id),
      ...stacksResult.entries.flatMap((entry) =>
        entry.has_uncompleted_historical_inbox_tasks ||
        comparePeriods(
          entry.habit_stack.period,
          timePlanResult.time_plan.period,
        ) > 0
          ? entry.habits.map((habit) => habit.ref_id)
          : [],
      ),
    ];
    const uniqueHabitRefIdsForInboxTasks = [
      ...new Set(habitRefIdsForInboxTasks),
    ];

    const inboxTasksResult =
      uniqueHabitRefIdsForInboxTasks.length > 0
        ? await apiClient.inboxTasks.inboxTaskFind({
            allow_archived: false,
            filter_namespace: [HABIT],
            filter_source_entity_ref_ids: uniqueHabitRefIdsForInboxTasks,
          })
        : { entries: [] };

    return {
      timePlan: timePlanResult.time_plan,
      activities: timePlanResult.activities,
      habits: habitsResult.entries,
      habitStacks: stacksResult.entries,
      inboxTasks: inboxTasksResult.entries.map((entry) => entry.inbox_task),
    };
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export async function action({ request, url, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);
  // The panel was opened from a time plan being looked at one way or another
  // - whatever it does, it hands that back on the way out.
  const timePlanView = url.searchParams;

  try {
    if (form.targetHabitStackRefIds.length > 0) {
      await apiClient.timePlans.timePlanAssociateWithHabitStacks({
        ref_id: id,
        habit_stack_ref_ids: form.targetHabitStackRefIds,
        kind: form.kind,
        feasability: form.feasability,
      });
    }

    if (form.targetHabitRefIds.length > 0) {
      await apiClient.timePlans.timePlanAssociateWithHabits({
        ref_id: id,
        habit_ref_ids: form.targetHabitRefIds,
        kind: form.kind,
        feasability: form.feasability,
      });
    }

    return redirect(
      withTimePlanView(`/app/workspace/apps/time-plans/${id}`, timePlanView),
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

function isSelectableHabitEntry(
  entry: HabitFindSuitableForTimePlanResultEntry,
): boolean {
  return !entry.habit.archived && !entry.habit.suspended;
}

function isAddableInTimePlan(
  entry: HabitFindSuitableForTimePlanResultEntry,
): boolean {
  return (
    entry.has_uncompleted_historical_inbox_tasks ||
    entry.would_generate_in_time_plan
  );
}

function isSelectableStackEntry(
  entry: HabitStackFindSuitableForTimePlanResultEntry,
): boolean {
  return !entry.habit_stack.archived;
}

function isAddableStackInTimePlan(
  entry: HabitStackFindSuitableForTimePlanResultEntry,
): boolean {
  return (
    entry.has_uncompleted_historical_inbox_tasks ||
    entry.would_generate_in_time_plan
  );
}

const PANEL_ID = "time-plan-add-from-current-habits";

const FILTERS = z.object({
  show: z.nativeEnum(ShowFilter).default(ShowFilter.IN_PERIOD),
});

export default function TimePlanAddFromCurrentHabits() {
  const { id } = useParams();
  const [query] = useSearchParams();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const inputsEnabled =
    navigation.state === "idle" && !loaderData.timePlan.archived;
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const timePlanViewParam = query;

  const alreadyIncludedHabitRefIds = new Set(
    loaderData.activities
      .filter((tpa) => isTimePlanActivityHabitTarget(tpa.target))
      .map((tpa) => entityLinkRefIdFromWire(tpa.target)),
  );
  const alreadyIncludedStackRefIds = new Set(
    loaderData.activities
      .filter((tpa) => isTimePlanActivityHabitStackTarget(tpa.target))
      .map((tpa) => entityLinkRefIdFromWire(tpa.target)),
  );

  const [targetHabitRefIds, setTargetHabitRefIds] = useState(new Set<string>());
  const [targetHabitStackRefIds, setTargetHabitStackRefIds] = useState(
    new Set<string>(),
  );
  const [{ show: showFilter }, setFilters] = useSectionFilters(
    PANEL_ID,
    FILTERS,
  );

  const inboxTasksByHabitRefId = groupInboxTasksByOwnerRefId(
    loaderData.inboxTasks,
    HABIT,
  );

  const selectableStacks = loaderData.habitStacks
    .filter(isSelectableStackEntry)
    .filter(
      (entry) => !alreadyIncludedStackRefIds.has(entry.habit_stack.ref_id),
    );
  const visibleStacks = selectableStacks.filter(
    (entry) =>
      showFilter === ShowFilter.ALL ||
      isAddableStackInTimePlan(entry) ||
      targetHabitStackRefIds.has(entry.habit_stack.ref_id),
  );

  const selectableHabits = loaderData.habits
    .filter(isSelectableHabitEntry)
    .filter((entry) => !alreadyIncludedHabitRefIds.has(entry.habit.ref_id))
    .filter(
      (entry) =>
        entry.habit.stack_ref_id === null ||
        entry.habit.stack_ref_id === undefined,
    );
  const visibleHabits = selectableHabits.filter(
    (entry) =>
      showFilter === ShowFilter.ALL ||
      isAddableInTimePlan(entry) ||
      targetHabitRefIds.has(entry.habit.ref_id),
  );

  const stacksByPeriod = new Map<
    RecurringTaskPeriod,
    HabitStackFindSuitableForTimePlanResultEntry[]
  >();
  for (const entry of visibleStacks) {
    const period = entry.habit_stack.period;
    const existing = stacksByPeriod.get(period) ?? [];
    existing.push(entry);
    stacksByPeriod.set(period, existing);
  }

  const habitsByPeriod = new Map<
    RecurringTaskPeriod,
    HabitFindSuitableForTimePlanResultEntry[]
  >();
  for (const entry of visibleHabits) {
    const period = entry.habit.gen_params.period;
    const existing = habitsByPeriod.get(period) ?? [];
    existing.push(entry);
    habitsByPeriod.set(period, existing);
  }

  function renderStackCard(
    entry: HabitStackFindSuitableForTimePlanResultEntry,
  ) {
    const habitStack = entry.habit_stack;
    const showPeriodProgress =
      entry.has_uncompleted_historical_inbox_tasks ||
      comparePeriods(habitStack.period, loaderData.timePlan.period) > 0;
    const memberProgress = entry.habits.map((habit) =>
      recurringTargetPeriodProgress(
        inboxTasksByHabitRefId.get(habit.ref_id) ?? [],
        habit.gen_params,
        topLevelInfo.today,
      ),
    );
    const periodProgress =
      showPeriodProgress && memberProgress.length > 0
        ? {
            generatedCount: memberProgress.reduce(
              (sum, progress) => sum + progress.generatedCount,
              0,
            ),
            doneCount: memberProgress.reduce(
              (sum, progress) => sum + progress.doneCount,
              0,
            ),
            nextDueDate: [...memberProgress]
              .map((progress) => progress.nextDueDate)
              .sort(compareADate)[0],
          }
        : null;

    return (
      <EntityCard
        key={`habit-stack-${habitStack.ref_id}`}
        entityId={`habit-stack-${habitStack.ref_id}`}
        allowSelect
        selected={targetHabitStackRefIds.has(habitStack.ref_id)}
        onClick={() => {
          setTargetHabitStackRefIds((prev) => {
            const next = new Set(prev);
            if (next.has(habitStack.ref_id)) {
              next.delete(habitStack.ref_id);
            } else {
              next.add(habitStack.ref_id);
            }
            return next;
          });
        }}
      >
        <EntityLink
          to={`/app/workspace/apps/habits/stacks/${habitStack.ref_id}`}
          block
        >
          <Typography>{habitStack.name}</Typography>
          {entry.aspect && <AspectTag aspect={entry.aspect} />}
          {periodProgress && (
            <RecurringTaskPeriodProgress
              generatedCount={periodProgress.generatedCount}
              doneCount={periodProgress.doneCount}
              nextDueDate={periodProgress.nextDueDate}
            />
          )}
        </EntityLink>
      </EntityCard>
    );
  }

  function renderHabitCard(entry: HabitFindSuitableForTimePlanResultEntry) {
    const habit = entry.habit;
    const showPeriodProgress =
      entry.has_uncompleted_historical_inbox_tasks ||
      comparePeriods(habit.gen_params.period, loaderData.timePlan.period) > 0;
    const periodProgress = showPeriodProgress
      ? recurringTargetPeriodProgress(
          inboxTasksByHabitRefId.get(habit.ref_id) ?? [],
          habit.gen_params,
          topLevelInfo.today,
        )
      : null;

    return (
      <EntityCard
        key={`habit-${habit.ref_id}`}
        entityId={`habit-${habit.ref_id}`}
        allowSelect
        selected={targetHabitRefIds.has(habit.ref_id)}
        onClick={() => {
          setTargetHabitRefIds((prev) => {
            const next = new Set(prev);
            if (next.has(habit.ref_id)) {
              next.delete(habit.ref_id);
            } else {
              next.add(habit.ref_id);
            }
            return next;
          });
        }}
      >
        <EntityLink
          to={`/app/workspace/apps/habits/habits/${habit.ref_id}`}
          block
        >
          <Typography>{habit.name}</Typography>
          {entry.aspect && <AspectTag aspect={entry.aspect} />}
          {periodProgress && (
            <RecurringTaskPeriodProgress
              generatedCount={periodProgress.generatedCount}
              doneCount={periodProgress.doneCount}
              nextDueDate={periodProgress.nextDueDate}
            />
          )}
        </EntityLink>
      </EntityCard>
    );
  }

  const hasVisibleItems = visibleStacks.length > 0 || visibleHabits.length > 0;
  const hasSelectableItems =
    selectableStacks.length > 0 || selectableHabits.length > 0;

  return (
    <LeafPanel
      key={`time-plan-${id}/add-from-current-habits`}
      fakeKey={`time-plan-${id}/add-from-current-habits`}
      returnLocation={withTimePlanView(
        `/app/workspace/apps/time-plans/${id}`,
        timePlanViewParam,
      )}
      returnLocationDiscriminator="add-from-current-habits"
      inputsEnabled={inputsEnabled}
      initialExpansionState={LeafPanelExpansionState.LARGE}
      allowedExpansionStates={[
        LeafPanelExpansionState.LARGE,
        LeafPanelExpansionState.FULL,
      ]}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        id="time-plan-current-habits"
        title="Current Habits"
        actions={
          <SectionActions
            id="add-from-current-habits"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Add",
                value: "add",
                highlight: true,
              }),
              FilterFewOptionsCompact(
                "Show",
                showFilter,
                [
                  {
                    value: ShowFilter.IN_PERIOD,
                    text: "In Period",
                  },
                  {
                    value: ShowFilter.ALL,
                    text: "All",
                  },
                ],
                (selected) => setFilters({ show: selected }),
              ),
            ]}
          />
        }
      >
        <Stack
          spacing={2}
          useFlexGap
          direction={isBigScreen ? "row" : "column"}
        >
          <FormControl fullWidth>
            <FormLabel id="kind">Kind</FormLabel>
            <TimePlanActivitKindSelect
              name="kind"
              defaultValue={TimePlanActivityKind.FINISH}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/kind" />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel id="feasability">Feasability</FormLabel>
            <TimePlanActivityFeasabilitySelect
              name="feasability"
              defaultValue={TimePlanActivityFeasability.NICE_TO_HAVE}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/feasability" />
          </FormControl>
        </Stack>

        <input
          type="hidden"
          name="targetHabitRefIds"
          value={[...targetHabitRefIds].join(",")}
        />
        <input
          type="hidden"
          name="targetHabitStackRefIds"
          value={[...targetHabitStackRefIds].join(",")}
        />

        {hasSelectableItems && !hasVisibleItems && (
          <Typography>
            No habits or stacks would generate tasks in this period. Switch to
            All to see them.
          </Typography>
        )}

        {PERIOD_SECTIONS.map((period) => {
          const periodStacks = stacksByPeriod.get(period) ?? [];
          const periodHabits = habitsByPeriod.get(period) ?? [];
          if (periodStacks.length === 0 && periodHabits.length === 0) {
            return null;
          }

          return (
            <div key={`period-${period}`}>
              <StandardDivider
                title={periodName(period, isBigScreen)}
                size="large"
              />
              <EntityStack>
                {periodStacks.map((entry) => renderStackCard(entry))}
                {periodHabits.map((entry) => renderHabitCard(entry))}
              </EntityStack>
            </div>
          );
        })}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/time-plans",
  ParamsSchema,
  {
    notFound: (params) => `Could not find time plan #${params.id}!`,
    error: (params) =>
      `There was an error loading time plan #${params.id}! Please try again!`,
  },
);
