import type { InboxTask } from "@jupiter/webapi-client";
import {
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import {
  BIG_PLAN,
  entityLinkRefIdFromWire,
} from "@jupiter/core/common/sub/inbox_tasks/parent-link-namespace";
import { isTimePlanActivityInboxTaskTarget } from "@jupiter/core/apps/time_plans/sub/activity/target-wire";
import { FormControl, FormLabel, Stack } from "@mui/material";
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
import { parseForm, parseParams, parseQuery } from "zodix";
import {
  filterInboxTasksForDisplay,
  inboxTaskFindEntryToParent,
  sortInboxTasksByEisenAndDifficulty,
} from "#/core/common/sub/inbox_tasks/root";
import type { InboxTaskParent } from "#/core/common/sub/inbox_tasks/root";
import { InboxTaskCard } from "@jupiter/core/common/sub/inbox_tasks/component/card";
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
import type { TopLevelInfo } from "@jupiter/core/infra/top-level-context";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
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

const QuerySchema = z.object({
  bigPlanRefId: z.string(),
  timePlanActivityRefId: z.string(),
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
  const query = parseQuery(request, QuerySchema);

  try {
    const [timePlanResult, bigPlanResult, inboxTasksResult] = await Promise.all(
      [
        apiClient.timePlans.timePlanLoad({
          ref_id: id,
          allow_archived: false,
          include_targets: false,
          include_completed_nontarget: false,
          include_other_time_plans: false,
        }),
        apiClient.bigPlans.bigPlanLoad({
          ref_id: query.bigPlanRefId,
          allow_archived: false,
        }),
        apiClient.inboxTasks.inboxTaskFind({
          allow_archived: false,
          filter_just_workable: true,
          filter_just_user: true,
          filter_namespace: [BIG_PLAN],
          filter_source_entity_ref_ids: [query.bigPlanRefId],
        }),
      ],
    );

    return json({
      timePlan: timePlanResult.time_plan,
      activities: timePlanResult.activities,
      bigPlan: bigPlanResult.big_plan,
      inboxTasks: inboxTasksResult.entries,
      bigPlanRefId: query.bigPlanRefId,
      timePlanActivityRefId: query.timePlanActivityRefId,
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
  const query = parseQuery(request, QuerySchema);
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
      withTimePlanView(
        `/app/workspace/apps/time-plans/${id}/${query.timePlanActivityRefId}`,
        timePlanView,
      ),
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function TimePlanAddFromBigPlanInboxTasks() {
  const { id } = useParams();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const [searchParams] = useSearchParams();
  const query = parseQuery(searchParams, QuerySchema);
  const timePlanViewParam = searchParams;

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

  const returnLocation = withTimePlanView(
    `/app/workspace/apps/time-plans/${id}/${query.timePlanActivityRefId}`,
    timePlanViewParam,
  );

  return (
    <LeafPanel
      key={`time-plan-${id}/add-from-big-plan-inbox-tasks`}
      fakeKey={`time-plan-${id}/add-from-big-plan-inbox-tasks`}
      returnLocation={returnLocation}
      returnLocationDiscriminator="add-from-big-plan-inbox-tasks"
      inputsEnabled={inputsEnabled}
      initialExpansionState={LeafPanelExpansionState.LARGE}
      allowedExpansionStates={[
        LeafPanelExpansionState.LARGE,
        LeafPanelExpansionState.FULL,
      ]}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="time-plan-big-plan-inbox-tasks"
        title={`Inbox Tasks for ${loaderData.bigPlan.name}`}
        actions={
          <SectionActions
            id="time-plan-add-from-big-plan-inbox-tasks"
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
              defaultValue={
                loaderData.activities.find(
                  (a) => a.ref_id === loaderData.timePlanActivityRefId,
                )?.kind ?? TimePlanActivityKind.FINISH
              }
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/kind" />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel id="feasability">Feasability</FormLabel>
            <TimePlanActivityFeasabilitySelect
              name="feasability"
              defaultValue={
                loaderData.activities.find(
                  (a) => a.ref_id === loaderData.timePlanActivityRefId,
                )?.feasability ?? TimePlanActivityFeasability.NICE_TO_HAVE
              }
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/feasability" />
          </FormControl>
        </Stack>

        <InboxTaskList
          topLevelInfo={topLevelInfo}
          inboxTasks={filteredInboxTasks}
          targetInboxTaskRefIds={targetInboxTaskRefIds}
          inboxTasksByRefId={entriesByRefId}
          onSelected={(it) =>
            setTargetInboxTaskRefIds((itri) =>
              toggleInboxTaskRefIds(itri, it.ref_id),
            )
          }
        />

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

interface InboxTaskListProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  targetInboxTaskRefIds: Set<string>;
  inboxTasksByRefId: { [key: string]: InboxTaskParent };
  onSelected: (it: InboxTask) => void;
}

function InboxTaskList(props: InboxTaskListProps) {
  return (
    <Stack spacing={2} useFlexGap>
      {props.inboxTasks.map((inboxTask) => (
        <InboxTaskCard
          key={`inbox-task-${inboxTask.ref_id}`}
          topLevelInfo={props.topLevelInfo}
          inboxTask={inboxTask}
          allowSelect
          selected={props.targetInboxTaskRefIds.has(inboxTask.ref_id)}
          showOptions={{
            showEisen: true,
            showDifficulty: true,
            showDueDate: true,
            showParent: true,
          }}
          parent={props.inboxTasksByRefId[inboxTask.ref_id]}
          onClick={(it) => {
            props.onSelected(it);
          }}
        />
      ))}
    </Stack>
  );
}

function toggleInboxTaskRefIds(
  inboxTaskRefIds: Set<string>,
  newRefId: string,
): Set<string> {
  if (inboxTaskRefIds.has(newRefId)) {
    const newInboxTaskRefIds = new Set<string>();
    for (const ri of inboxTaskRefIds.values()) {
      if (ri === newRefId) {
        continue;
      }
      newInboxTaskRefIds.add(ri);
    }
    return newInboxTaskRefIds;
  } else {
    const newInboxTaskRefIds = new Set<string>();
    for (const ri of inboxTaskRefIds.values()) {
      newInboxTaskRefIds.add(ri);
    }
    newInboxTaskRefIds.add(newRefId);
    return newInboxTaskRefIds;
  }
}
