import type {
  ChoreFindSuitableForTimePlanResultEntry,
  ChoreStackFindSuitableForTimePlanResultEntry,
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
  CHORE,
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
  isTimePlanActivityChoreStackTarget,
  isTimePlanActivityChoreTarget,
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
  targetChoreRefIds: z
    .string()
    .transform((s) => (s === "" ? [] : s.split(","))),
  targetChoreStackRefIds: z
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
        "Chores can only be added to daily or weekly time plans",
        { status: 400 },
      );
    }

    const [choresResult, stacksResult] = await Promise.all([
      apiClient.chores.choreFindSuitableForTimePlan({
        time_plan_ref_id: id,
      }),
      apiClient.chores.choreStackFindSuitableForTimePlan({
        time_plan_ref_id: id,
      }),
    ]);

    const choreRefIdsForInboxTasks = [
      ...choresResult.entries
        .filter(
          (entry) =>
            entry.has_uncompleted_historical_inbox_tasks ||
            comparePeriods(
              entry.chore.gen_params.period,
              timePlanResult.time_plan.period,
            ) > 0,
        )
        .map((entry) => entry.chore.ref_id),
      ...stacksResult.entries.flatMap((entry) =>
        entry.has_uncompleted_historical_inbox_tasks ||
        comparePeriods(
          entry.chore_stack.period,
          timePlanResult.time_plan.period,
        ) > 0
          ? entry.chores.map((chore) => chore.ref_id)
          : [],
      ),
    ];
    const uniqueChoreRefIdsForInboxTasks = [
      ...new Set(choreRefIdsForInboxTasks),
    ];

    const inboxTasksResult =
      uniqueChoreRefIdsForInboxTasks.length > 0
        ? await apiClient.inboxTasks.inboxTaskFind({
            allow_archived: false,
            filter_namespace: [CHORE],
            filter_source_entity_ref_ids: uniqueChoreRefIdsForInboxTasks,
          })
        : { entries: [] };

    return {
      timePlan: timePlanResult.time_plan,
      activities: timePlanResult.activities,
      chores: choresResult.entries,
      choreStacks: stacksResult.entries,
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
    if (form.targetChoreStackRefIds.length > 0) {
      await apiClient.timePlans.timePlanAssociateWithChoreStacks({
        ref_id: id,
        chore_stack_ref_ids: form.targetChoreStackRefIds,
        kind: form.kind,
        feasability: form.feasability,
      });
    }

    if (form.targetChoreRefIds.length > 0) {
      await apiClient.timePlans.timePlanAssociateWithChores({
        ref_id: id,
        chore_ref_ids: form.targetChoreRefIds,
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

function isSelectableChoreEntry(
  entry: ChoreFindSuitableForTimePlanResultEntry,
): boolean {
  return !entry.chore.archived && !entry.chore.suspended;
}

function isAddableInTimePlan(
  entry: ChoreFindSuitableForTimePlanResultEntry,
): boolean {
  return (
    entry.has_uncompleted_historical_inbox_tasks ||
    entry.would_generate_in_time_plan
  );
}

function isSelectableStackEntry(
  entry: ChoreStackFindSuitableForTimePlanResultEntry,
): boolean {
  return !entry.chore_stack.archived;
}

function isAddableStackInTimePlan(
  entry: ChoreStackFindSuitableForTimePlanResultEntry,
): boolean {
  return (
    entry.has_uncompleted_historical_inbox_tasks ||
    entry.would_generate_in_time_plan
  );
}

const PANEL_ID = "time-plan-add-from-current-chores";

const FILTERS = z.object({
  show: z.nativeEnum(ShowFilter).default(ShowFilter.IN_PERIOD),
});

export default function TimePlanAddFromCurrentChores() {
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

  const alreadyIncludedChoreRefIds = new Set(
    loaderData.activities
      .filter((tpa) => isTimePlanActivityChoreTarget(tpa.target))
      .map((tpa) => entityLinkRefIdFromWire(tpa.target)),
  );
  const alreadyIncludedStackRefIds = new Set(
    loaderData.activities
      .filter((tpa) => isTimePlanActivityChoreStackTarget(tpa.target))
      .map((tpa) => entityLinkRefIdFromWire(tpa.target)),
  );

  const [targetChoreRefIds, setTargetChoreRefIds] = useState(new Set<string>());
  const [targetChoreStackRefIds, setTargetChoreStackRefIds] = useState(
    new Set<string>(),
  );
  const [{ show: showFilter }, setFilters] = useSectionFilters(
    PANEL_ID,
    FILTERS,
  );

  const inboxTasksByChoreRefId = groupInboxTasksByOwnerRefId(
    loaderData.inboxTasks,
    CHORE,
  );

  const selectableStacks = loaderData.choreStacks
    .filter(isSelectableStackEntry)
    .filter(
      (entry) => !alreadyIncludedStackRefIds.has(entry.chore_stack.ref_id),
    );
  const visibleStacks = selectableStacks.filter(
    (entry) =>
      showFilter === ShowFilter.ALL ||
      isAddableStackInTimePlan(entry) ||
      targetChoreStackRefIds.has(entry.chore_stack.ref_id),
  );

  const selectableChores = loaderData.chores
    .filter(isSelectableChoreEntry)
    .filter((entry) => !alreadyIncludedChoreRefIds.has(entry.chore.ref_id))
    .filter(
      (entry) =>
        entry.chore.stack_ref_id === null ||
        entry.chore.stack_ref_id === undefined,
    );
  const visibleChores = selectableChores.filter(
    (entry) =>
      showFilter === ShowFilter.ALL ||
      isAddableInTimePlan(entry) ||
      targetChoreRefIds.has(entry.chore.ref_id),
  );

  const stacksByPeriod = new Map<
    RecurringTaskPeriod,
    ChoreStackFindSuitableForTimePlanResultEntry[]
  >();
  for (const entry of visibleStacks) {
    const period = entry.chore_stack.period;
    const existing = stacksByPeriod.get(period) ?? [];
    existing.push(entry);
    stacksByPeriod.set(period, existing);
  }

  const choresByPeriod = new Map<
    RecurringTaskPeriod,
    ChoreFindSuitableForTimePlanResultEntry[]
  >();
  for (const entry of visibleChores) {
    const period = entry.chore.gen_params.period;
    const existing = choresByPeriod.get(period) ?? [];
    existing.push(entry);
    choresByPeriod.set(period, existing);
  }

  function renderStackCard(
    entry: ChoreStackFindSuitableForTimePlanResultEntry,
  ) {
    const choreStack = entry.chore_stack;
    const showPeriodProgress =
      entry.has_uncompleted_historical_inbox_tasks ||
      comparePeriods(choreStack.period, loaderData.timePlan.period) > 0;
    const memberProgress = entry.chores.map((chore) =>
      recurringTargetPeriodProgress(
        inboxTasksByChoreRefId.get(chore.ref_id) ?? [],
        chore.gen_params,
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
        key={`chore-stack-${choreStack.ref_id}`}
        entityId={`chore-stack-${choreStack.ref_id}`}
        allowSelect
        selected={targetChoreStackRefIds.has(choreStack.ref_id)}
        onClick={() => {
          setTargetChoreStackRefIds((prev) => {
            const next = new Set(prev);
            if (next.has(choreStack.ref_id)) {
              next.delete(choreStack.ref_id);
            } else {
              next.add(choreStack.ref_id);
            }
            return next;
          });
        }}
      >
        <EntityLink
          to={`/app/workspace/apps/chores/stacks/${choreStack.ref_id}`}
          block
        >
          <Typography>{choreStack.name}</Typography>
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

  function renderChoreCard(entry: ChoreFindSuitableForTimePlanResultEntry) {
    const chore = entry.chore;
    const showPeriodProgress =
      entry.has_uncompleted_historical_inbox_tasks ||
      comparePeriods(chore.gen_params.period, loaderData.timePlan.period) > 0;
    const periodProgress = showPeriodProgress
      ? recurringTargetPeriodProgress(
          inboxTasksByChoreRefId.get(chore.ref_id) ?? [],
          chore.gen_params,
          topLevelInfo.today,
        )
      : null;

    return (
      <EntityCard
        key={`chore-${chore.ref_id}`}
        entityId={`chore-${chore.ref_id}`}
        allowSelect
        selected={targetChoreRefIds.has(chore.ref_id)}
        onClick={() => {
          setTargetChoreRefIds((prev) => {
            const next = new Set(prev);
            if (next.has(chore.ref_id)) {
              next.delete(chore.ref_id);
            } else {
              next.add(chore.ref_id);
            }
            return next;
          });
        }}
      >
        <EntityLink
          to={`/app/workspace/apps/chores/chores/${chore.ref_id}`}
          block
        >
          <Typography>{chore.name}</Typography>
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

  return (
    <LeafPanel
      key={`time-plan-${id}/add-from-current-chores`}
      fakeKey={`time-plan-${id}/add-from-current-chores`}
      returnLocation={withTimePlanView(
        `/app/workspace/apps/time-plans/${id}`,
        timePlanViewParam,
      )}
      returnLocationDiscriminator="add-from-current-chores"
      inputsEnabled={inputsEnabled}
      initialExpansionState={LeafPanelExpansionState.LARGE}
      allowedExpansionStates={[
        LeafPanelExpansionState.LARGE,
        LeafPanelExpansionState.FULL,
      ]}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        id="time-plan-current-chores"
        title="Current Chores"
        actions={
          <SectionActions
            id="add-from-current-chores"
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
          name="targetChoreRefIds"
          value={[...targetChoreRefIds].join(",")}
        />
        <input
          type="hidden"
          name="targetChoreStackRefIds"
          value={[...targetChoreStackRefIds].join(",")}
        />

        {selectableStacks.length + selectableChores.length > 0 &&
          visibleStacks.length + visibleChores.length === 0 && (
            <Typography>
              No chores or stacks would generate tasks in this period. Switch to
              All to see them.
            </Typography>
          )}

        {PERIOD_SECTIONS.map((period) => {
          const periodStacks = stacksByPeriod.get(period) ?? [];
          const periodChores = choresByPeriod.get(period) ?? [];
          if (periodStacks.length === 0 && periodChores.length === 0) {
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
                {periodChores.map((entry) => renderChoreCard(entry))}
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
