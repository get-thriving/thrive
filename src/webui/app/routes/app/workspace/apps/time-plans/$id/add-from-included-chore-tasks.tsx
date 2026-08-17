import type { InboxTask } from "@jupiter/webapi-client";
import {
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import {
  CHORE,
  entityLinkRefIdFromWire,
  parentLinkNamespaceFromEntityLinkWire,
} from "@jupiter/core/common/sub/inbox_tasks/parent-link-namespace";
import { isTimePlanActivityInboxTaskTarget } from "@jupiter/core/apps/time_plans/sub/activity/target-wire";
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
import { Fragment, useContext, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { sortChoresNaturally } from "@jupiter/core/apps/chores/root";
import { PeriodTag } from "@jupiter/core/common/component/period-tag";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { IsKeyTag } from "@jupiter/core/common/component/is-key-tag";
import {
  filterInboxTasksForDisplay,
  inboxTaskFindEntryToParent,
  sortInboxTasksByEisenAndDifficulty,
} from "#/core/common/sub/inbox_tasks/root";
import type { InboxTaskParent } from "#/core/common/sub/inbox_tasks/root";
import { InboxTaskCard } from "@jupiter/core/common/sub/inbox_tasks/component/card";
import {
  EntityCard,
  EntityFakeLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { withTimePlanView } from "@jupiter/core/apps/time_plans/view-mode";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionMultipleSpread,
  ActionSingle,
  FilterFewOptionsCompact,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TimePlanActivityFeasabilitySelect } from "@jupiter/core/apps/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "@jupiter/core/apps/time_plans/sub/activity/component/kind-select";
import {
  ActionableTime,
  actionableTimeToDateTime,
} from "@jupiter/core/infra/actionable-time";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { timePlanAllowsInboxTasks } from "@jupiter/core/apps/time_plans/root";
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

const CommonParamsSchema = {
  targetInboxTaskRefIds: z
    .string()
    .transform((s) => (s === "" ? [] : s.split(","))),
  kind: z.nativeEnum(TimePlanActivityKind),
  feasability: z.nativeEnum(TimePlanActivityFeasability),
};

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("add"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("add-and-override"),
    ...CommonParamsSchema,
  }),
]);

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
      include_targets: true,
      include_completed_nontarget: false,
      include_other_time_plans: false,
    });

    if (!timePlanAllowsInboxTasks(timePlanResult.time_plan)) {
      throw new Response(
        "Chore tasks can only be added to daily or weekly time plans",
        { status: 400 },
      );
    }

    const chores = sortChoresNaturally(timePlanResult.target_chores ?? []);
    const choreRefIds = chores.map((chore) => chore.ref_id);

    const inboxTasksResult =
      choreRefIds.length > 0
        ? await apiClient.inboxTasks.inboxTaskFind({
            allow_archived: false,
            filter_just_workable: true,
            filter_namespace: [CHORE],
            filter_source_entity_ref_ids: choreRefIds,
          })
        : { entries: [] };

    return json({
      timePlan: timePlanResult.time_plan,
      activities: timePlanResult.activities,
      chores,
      inboxTasks: inboxTasksResult.entries,
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
  const timePlanView = new URL(request.url).searchParams;

  try {
    switch (form.intent) {
      case "add": {
        await apiClient.timePlans.timePlanAssociateWithInboxTasks({
          ref_id: id,
          inbox_task_ref_ids: form.targetInboxTaskRefIds,
          override_existing_dates: false,
          kind: form.kind,
          feasability: form.feasability,
        });
        break;
      }

      case "add-and-override": {
        await apiClient.timePlans.timePlanAssociateWithInboxTasks({
          ref_id: id,
          inbox_task_ref_ids: form.targetInboxTaskRefIds,
          override_existing_dates: true,
          kind: form.kind,
          feasability: form.feasability,
        });
        break;
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }

    return redirect(
      withTimePlanView(`/app/workspace/apps/time-plans/${id}`, timePlanView),
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function TimePlanAddFromIncludedChoreTasks() {
  const { id } = useParams();
  const [query] = useSearchParams();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const timePlanViewParam = query;

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.timePlan.archived;

  const alreadyIncludedInboxTaskRefIds = new Set(
    loaderData.activities
      .filter((tpa) => isTimePlanActivityInboxTaskTarget(tpa.target))
      .map((tpa) => entityLinkRefIdFromWire(tpa.target)),
  );

  const [targetInboxTaskRefIds, setTargetInboxTaskRefIds] = useState(
    new Set<string>(),
  );

  const entriesByRefId: { [key: string]: InboxTaskParent } = {};
  for (const entry of loaderData.inboxTasks) {
    entriesByRefId[entry.inbox_task.ref_id] = inboxTaskFindEntryToParent(entry);
  }

  const [selectedActionableTime, setSelectedActionableTime] = useState(
    ActionableTime.ONE_WEEK,
  );

  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(
    loaderData.inboxTasks.map((e) => e.inbox_task),
  );

  const filteredInboxTasks = filterInboxTasksForDisplay(
    sortedInboxTasks,
    entriesByRefId,
    {},
    {
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTimeToDateTime(
        selectedActionableTime,
        topLevelInfo.user.timezone,
      ),
      includeIfNoDueDate: true,
    },
  ).filter((it) => !alreadyIncludedInboxTaskRefIds.has(it.ref_id));

  const tasksByChoreRefId = new Map<string, InboxTask[]>();
  for (const inboxTask of filteredInboxTasks) {
    if (parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) !== CHORE) {
      continue;
    }
    const choreRefId = entityLinkRefIdFromWire(inboxTask.owner);
    const existing = tasksByChoreRefId.get(choreRefId) ?? [];
    existing.push(inboxTask);
    tasksByChoreRefId.set(choreRefId, existing);
  }

  const choresWithTasks = loaderData.chores.filter(
    (chore) => (tasksByChoreRefId.get(chore.ref_id) ?? []).length > 0,
  );

  function toggleInboxTask(refId: string) {
    setTargetInboxTaskRefIds((current) => toggleRefIds(current, refId));
  }

  return (
    <LeafPanel
      key={`time-plan-${id}/add-from-included-chore-tasks`}
      fakeKey={`time-plan-${id}/add-from-included-chore-tasks`}
      returnLocation={withTimePlanView(
        `/app/workspace/apps/time-plans/${id}`,
        timePlanViewParam,
      )}
      returnLocationDiscriminator="add-from-included-chore-tasks"
      inputsEnabled={inputsEnabled}
      initialExpansionState={LeafPanelExpansionState.LARGE}
      allowedExpansionStates={[
        LeafPanelExpansionState.LARGE,
        LeafPanelExpansionState.FULL,
      ]}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="time-plan-included-chore-tasks"
        title="Included Chore Tasks"
        actions={
          <SectionActions
            id="time-plan-add-from-included-chore-tasks"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionMultipleSpread({
                actions: [
                  ActionSingle({
                    text: "Add",
                    value: "add",
                    highlight: true,
                  }),
                  ActionSingle({
                    text: "Add And Override Dates",
                    value: "add-and-override",
                  }),
                ],
              }),
              FilterFewOptionsCompact(
                "Actionable",
                selectedActionableTime,
                [
                  {
                    value: ActionableTime.NOW,
                    text: "From Now",
                  },
                  {
                    value: ActionableTime.ONE_WEEK,
                    text: "One Week",
                  },
                  {
                    value: ActionableTime.ONE_MONTH,
                    text: "One Month",
                  },
                ],
                (selected) => setSelectedActionableTime(selected),
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

        {choresWithTasks.length === 0 ? (
          <Typography sx={{ mt: 2 }}>
            {loaderData.chores.length === 0
              ? "No chores are on this time plan yet."
              : "No chore tasks available to add."}
          </Typography>
        ) : (
          <EntityStack>
            {choresWithTasks.map((chore) => {
              const tasks = tasksByChoreRefId.get(chore.ref_id) ?? [];
              return (
                <Fragment key={`chore-group-${chore.ref_id}`}>
                  <EntityCard entityId={`chore-${chore.ref_id}`}>
                    <EntityFakeLink>
                      <IsKeyTag isKey={chore.is_key} />
                      <EntityNameComponent name={chore.name} />
                      <PeriodTag period={chore.gen_params.period} />
                    </EntityFakeLink>
                  </EntityCard>
                  {tasks.map((inboxTask) => (
                    <InboxTaskCard
                      key={`inbox-task-${inboxTask.ref_id}`}
                      topLevelInfo={topLevelInfo}
                      inboxTask={inboxTask}
                      indent={2}
                      allowSelect
                      selected={targetInboxTaskRefIds.has(inboxTask.ref_id)}
                      showOptions={{
                        showStatus: true,
                        showEisen: true,
                        showDifficulty: true,
                        showDueDate: true,
                      }}
                      parent={entriesByRefId[inboxTask.ref_id]}
                      onClick={(it) => toggleInboxTask(it.ref_id)}
                    />
                  ))}
                </Fragment>
              );
            })}
          </EntityStack>
        )}

        <input
          name="targetInboxTaskRefIds"
          type="hidden"
          value={Array.from(targetInboxTaskRefIds).join(",")}
        />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params, searchParams) =>
    withTimePlanView(
      `/app/workspace/apps/time-plans/${params.id}`,
      searchParams,
    ),
  ParamsSchema,
  {
    notFound: (params) => `Could not find time plan #${params.id}!`,
    error: (params) =>
      `There was an error loading time plan #${params.id}! Please try again!`,
  },
);

function toggleRefIds(refIds: Set<string>, newRefId: string): Set<string> {
  if (refIds.has(newRefId)) {
    const next = new Set<string>();
    for (const ri of refIds.values()) {
      if (ri === newRefId) {
        continue;
      }
      next.add(ri);
    }
    return next;
  }

  const next = new Set<string>();
  for (const ri of refIds.values()) {
    next.add(ri);
  }
  next.add(newRefId);
  return next;
}
