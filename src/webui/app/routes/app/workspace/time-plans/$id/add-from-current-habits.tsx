import type { HabitFindResultEntry } from "@jupiter/webapi-client";
import {
  RecurringTaskPeriod,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import { entityLinkRefIdFromWire } from "@jupiter/core/common/sub/inbox_tasks/parent-link-namespace";
import { periodName } from "@jupiter/core/common/recurring-task-period";
import { isTimePlanActivityHabitTarget } from "@jupiter/core/time_plans/sub/activity/target-wire";
import { FormControl, FormLabel, Stack, Typography } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useNavigation,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { AspectTag } from "@jupiter/core/life_plan/sub/aspects/component/tag";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import {
  TIME_PLAN_VIEW_PARAM,
  withTimePlanView,
} from "@jupiter/core/time_plans/view-mode";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { TimePlanActivityFeasabilitySelect } from "@jupiter/core/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "@jupiter/core/time_plans/sub/activity/component/kind-select";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { timePlanAllowsInboxTasks } from "@jupiter/core/time_plans/root";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.object({
  intent: z.literal("add"),
  targetHabitRefIds: z
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

    const habitsResult = await apiClient.habits.habitFind({
      allow_archived: false,
      include_tags: false,
      include_notes: false,
      include_life_plan: true,
      include_inbox_tasks: false,
    });

    return json({
      timePlan: timePlanResult.time_plan,
      activities: timePlanResult.activities,
      habits: habitsResult.entries,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);
  // The panel was opened from a time plan being looked at one way or another
  // - whatever it does, it hands that back on the way out.
  const timePlanView = new URL(request.url).searchParams.get(
    TIME_PLAN_VIEW_PARAM,
  );

  try {
    await apiClient.timePlans.timePlanAssociateWithHabits({
      ref_id: id,
      habit_ref_ids: form.targetHabitRefIds,
      kind: form.kind,
      feasability: form.feasability,
    });

    return redirect(
      withTimePlanView(`/app/workspace/time-plans/${id}`, timePlanView),
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

function isSelectableHabitEntry(entry: HabitFindResultEntry): boolean {
  return !entry.habit.archived && !entry.habit.suspended;
}

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
  const timePlanViewParam = query.get(TIME_PLAN_VIEW_PARAM);

  const alreadyIncludedHabitRefIds = new Set(
    loaderData.activities
      .filter((tpa) => isTimePlanActivityHabitTarget(tpa.target))
      .map((tpa) => entityLinkRefIdFromWire(tpa.target)),
  );

  const [targetHabitRefIds, setTargetHabitRefIds] = useState(new Set<string>());

  const selectableHabits = loaderData.habits
    .filter(isSelectableHabitEntry)
    .filter((entry) => !alreadyIncludedHabitRefIds.has(entry.habit.ref_id));

  const habitsByPeriod = new Map<RecurringTaskPeriod, HabitFindResultEntry[]>();
  for (const entry of selectableHabits) {
    const period = entry.habit.gen_params.period;
    const existing = habitsByPeriod.get(period) ?? [];
    existing.push(entry);
    habitsByPeriod.set(period, existing);
  }

  function renderHabitCard(entry: HabitFindResultEntry) {
    const habit = entry.habit;

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
        <EntityLink to={`/app/workspace/habits/${habit.ref_id}`} block>
          <Typography>{habit.name}</Typography>
          {entry.aspect && <AspectTag aspect={entry.aspect} />}
        </EntityLink>
      </EntityCard>
    );
  }

  return (
    <LeafPanel
      key={`time-plan-${id}/add-from-current-habits`}
      fakeKey={`time-plan-${id}/add-from-current-habits`}
      returnLocation={withTimePlanView(
        `/app/workspace/time-plans/${id}`,
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

        {PERIOD_SECTIONS.map((period) => {
          const periodHabits = habitsByPeriod.get(period) ?? [];
          if (periodHabits.length === 0) {
            return null;
          }

          return (
            <div key={`period-${period}`}>
              <StandardDivider
                title={periodName(period, isBigScreen)}
                size="large"
              />
              <EntityStack>
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
  "/app/workspace/time-plans",
  ParamsSchema,
  {
    notFound: (params) => `Could not find time plan #${params.id}!`,
    error: (params) =>
      `There was an error loading time plan #${params.id}! Please try again!`,
  },
);
