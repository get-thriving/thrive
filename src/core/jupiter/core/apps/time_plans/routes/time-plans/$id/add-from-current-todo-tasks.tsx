import type { TodoTaskFindResultEntry } from "@jupiter/webapi-client";
import {
  InboxTaskStatus,
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

import { isTimePlanActivityTodoTaskTarget } from "#/core/apps/time_plans/sub/activity/target-wire";
import { entityLinkRefIdFromWire } from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import {
  computeAspectHierarchicalNameFromRoot,
  sortAspectsByTreeOrder,
} from "#/core/apps/life_plan/sub/aspects/root";
import { AspectTag } from "#/core/apps/life_plan/sub/aspects/component/tag";
import { InboxTaskStatusTag } from "#/core/common/sub/inbox_tasks/component/status-tag";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { withTimePlanView } from "#/core/apps/time_plans/view-mode";
import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  ActionMultipleSpread,
  ActionSingle,
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
import {
  handleActionApiError,
  handleLoaderApiError,
} from "#/core/infra/errors.server";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const CommonParamsSchema = {
  targetTodoTaskRefIds: z
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
    const [summaryResponse, timePlanResult, todoTasksResult] =
      await Promise.all([
        apiClient.application.getSummaries({
          include_aspects: true,
        }),
        apiClient.timePlans.timePlanLoad({
          ref_id: id,
          allow_archived: false,
          include_targets: false,
          include_completed_nontarget: false,
          include_other_time_plans: false,
        }),
        apiClient.todo.todoTaskFind({
          allow_archived: false,
          include_tags: false,
          include_notes: false,
          include_life_plan: true,
          include_inbox_tasks: true,
        }),
      ]);

    return {
      allAspects: summaryResponse.aspects || undefined,
      timePlan: timePlanResult.time_plan,
      activities: timePlanResult.activities,
      todoTasks: todoTasksResult.entries,
    };
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
        await apiClient.timePlans.timePlanAssociateWithTodoTasks({
          ref_id: id,
          todo_task_ref_ids: form.targetTodoTaskRefIds,
          override_existing_dates: false,
          kind: form.kind,
          feasability: form.feasability,
        });

        return redirect(
          withTimePlanView(
            `/app/workspace/apps/time-plans/${id}`,
            timePlanView,
          ),
        );
      }

      case "add-and-override": {
        await apiClient.timePlans.timePlanAssociateWithTodoTasks({
          ref_id: id,
          todo_task_ref_ids: form.targetTodoTaskRefIds,
          override_existing_dates: true,
          kind: form.kind,
          feasability: form.feasability,
        });

        return redirect(
          withTimePlanView(
            `/app/workspace/apps/time-plans/${id}`,
            timePlanView,
          ),
        );
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

function isWorkableTodoEntry(entry: TodoTaskFindResultEntry): boolean {
  const inboxTask = entry.inbox_task;
  if (!inboxTask || inboxTask.archived) {
    return false;
  }
  return inboxTask.status !== InboxTaskStatus.DONE;
}

export default function TimePlanAddFromCurrentTodoTasks() {
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

  const alreadyIncludedTodoTaskRefIds = new Set(
    loaderData.activities
      .filter((tpa) => isTimePlanActivityTodoTaskTarget(tpa.target))
      .map((tpa) => entityLinkRefIdFromWire(tpa.target)),
  );

  const [targetTodoTaskRefIds, setTargetTodoTaskRefIds] = useState(
    new Set<string>(),
  );

  const workableTodos = loaderData.todoTasks
    .filter(isWorkableTodoEntry)
    .filter(
      (entry) => !alreadyIncludedTodoTaskRefIds.has(entry.todo_task.ref_id),
    );

  const sortedAspects = sortAspectsByTreeOrder(loaderData.allAspects || []);
  const allAspectsByRefId = new Map(
    loaderData.allAspects?.map((p) => [p.ref_id, p]),
  );

  const todosByAspectRefId = new Map<string, TodoTaskFindResultEntry[]>();
  for (const entry of workableTodos) {
    const aspectRefId = entry.todo_task.aspect_ref_id;
    const existing = todosByAspectRefId.get(aspectRefId) ?? [];
    existing.push(entry);
    todosByAspectRefId.set(aspectRefId, existing);
  }

  function renderTodoCard(entry: TodoTaskFindResultEntry) {
    const todoTask = entry.todo_task;
    const inboxTask = entry.inbox_task;

    return (
      <EntityCard
        key={`todo-task-${todoTask.ref_id}`}
        entityId={`todo-task-${todoTask.ref_id}`}
        allowSelect
        selected={targetTodoTaskRefIds.has(todoTask.ref_id)}
        onClick={() => {
          setTargetTodoTaskRefIds((prev) => {
            const next = new Set(prev);
            if (next.has(todoTask.ref_id)) {
              next.delete(todoTask.ref_id);
            } else {
              next.add(todoTask.ref_id);
            }
            return next;
          });
        }}
      >
        <EntityLink to={`/app/workspace/apps/todos/${todoTask.ref_id}`} block>
          <Typography>{todoTask.name}</Typography>
          {inboxTask && <InboxTaskStatusTag status={inboxTask.status} />}
          {entry.aspect && <AspectTag aspect={entry.aspect} />}
        </EntityLink>
      </EntityCard>
    );
  }

  return (
    <LeafPanel
      key={`time-plan-${id}/add-from-current-todo-tasks`}
      fakeKey={`time-plan-${id}/add-from-current-todo-tasks`}
      returnLocation={withTimePlanView(
        `/app/workspace/apps/time-plans/${id}`,
        timePlanViewParam,
      )}
      returnLocationDiscriminator="add-from-current-todo-tasks"
      inputsEnabled={inputsEnabled}
      initialExpansionState={LeafPanelExpansionState.LARGE}
      allowedExpansionStates={[
        LeafPanelExpansionState.LARGE,
        LeafPanelExpansionState.FULL,
      ]}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        id="time-plan-current-todo-tasks"
        title="Current Todos"
        actions={
          <SectionActions
            id="add-from-current-todo-tasks"
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
          name="targetTodoTaskRefIds"
          value={[...targetTodoTaskRefIds].join(",")}
        />

        {sortedAspects.length > 0 ? (
          sortedAspects.map((aspect) => {
            const aspectTodos = todosByAspectRefId.get(aspect.ref_id) ?? [];
            if (aspectTodos.length === 0) {
              return null;
            }

            const fullAspectName = computeAspectHierarchicalNameFromRoot(
              aspect,
              allAspectsByRefId,
            );

            return (
              <div key={`aspect-${aspect.ref_id}`}>
                <StandardDivider title={fullAspectName} size="large" />
                <EntityStack>
                  {aspectTodos.map((entry) => renderTodoCard(entry))}
                </EntityStack>
              </div>
            );
          })
        ) : (
          <>
            <StandardDivider title="All Todos" size="large" />
            <EntityStack>
              {workableTodos.map((entry) => renderTodoCard(entry))}
            </EntityStack>
          </>
        )}
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
