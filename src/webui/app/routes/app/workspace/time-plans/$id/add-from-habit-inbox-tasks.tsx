import type { InboxTask } from "@jupiter/webapi-client";
import {
  RecurringTaskPeriod,
  SyncTarget,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import {
  HABIT,
  entityLinkRefIdFromWire,
} from "@jupiter/core/common/sub/inbox_tasks/parent-link-namespace";
import { isTimePlanActivityInboxTaskTarget } from "@jupiter/core/time_plans/sub/activity/target-wire";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
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
import {
  TIME_PLAN_VIEW_PARAM,
  withTimePlanView,
} from "@jupiter/core/time_plans/view-mode";
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
import { PeriodSelect } from "@jupiter/core/common/component/period-select";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { TimePlanActivityFeasabilitySelect } from "@jupiter/core/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "@jupiter/core/time_plans/sub/activity/component/kind-select";
import {
  ActionableTime,
  actionableTimeToDateTime,
} from "@jupiter/core/infra/actionable-time";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import {
  TopLevelInfo,
  TopLevelInfoContext,
} from "@jupiter/core/infra/top-level-context";
import {
  fixSelectOutputToEnum,
  selectZod,
} from "@jupiter/core/common/select-form";
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
  habitRefId: z.string(),
  timePlanActivityRefId: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("gen"),
    rightNow: z.string(),
    period: selectZod(z.nativeEnum(RecurringTaskPeriod)),
  }),
  z.object({
    intent: z.literal("add"),
    targetInboxTaskRefIds: z
      .string()
      .transform((s) => (s === "" ? [] : s.split(","))),
    kind: z.nativeEnum(TimePlanActivityKind),
    feasability: z.nativeEnum(TimePlanActivityFeasability),
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
    const [timePlanResult, habitResult, inboxTasksResult] = await Promise.all([
      apiClient.timePlans.timePlanLoad({
        ref_id: id,
        allow_archived: false,
        include_targets: false,
        include_completed_nontarget: false,
        include_other_time_plans: false,
      }),
      apiClient.habits.habitLoad({
        ref_id: query.habitRefId,
        allow_archived: false,
      }),
      apiClient.inboxTasks.inboxTaskFind({
        allow_archived: false,
        filter_just_workable: true,
        filter_namespace: [HABIT],
        filter_source_entity_ref_ids: [query.habitRefId],
      }),
    ]);

    return json({
      timePlan: timePlanResult.time_plan,
      activities: timePlanResult.activities,
      habit: habitResult.habit,
      inboxTasks: inboxTasksResult.entries,
      habitRefId: query.habitRefId,
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
  const timePlanView = new URL(request.url).searchParams.get(
    TIME_PLAN_VIEW_PARAM,
  );

  try {
    switch (form.intent) {
      case "gen": {
        await apiClient.gen.genDo({
          gen_even_if_not_modified: false,
          today: form.rightNow,
          gen_targets: [SyncTarget.HABITS],
          period: fixSelectOutputToEnum<RecurringTaskPeriod>(form.period),
          filter_habit_ref_ids: [query.habitRefId],
        });

        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${id}/add-from-habit-inbox-tasks?${new URLSearchParams(
              {
                habitRefId: query.habitRefId,
                timePlanActivityRefId: query.timePlanActivityRefId,
              },
            ).toString()}`,
            timePlanView,
          ),
        );
      }

      case "add": {
        await apiClient.timePlans.timePlanAssociateWithInboxTasks({
          ref_id: id,
          inbox_task_ref_ids: form.targetInboxTaskRefIds,
          override_existing_dates: true,
          kind: form.kind,
          feasability: form.feasability,
        });

        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${id}/${query.timePlanActivityRefId}`,
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

export default function TimePlanAddFromHabitInboxTasks() {
  const { id } = useParams();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const [searchParams] = useSearchParams();
  const query = parseQuery(searchParams, QuerySchema);
  const timePlanViewParam = searchParams.get(TIME_PLAN_VIEW_PARAM);

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
    `/app/workspace/time-plans/${id}/${query.timePlanActivityRefId}`,
    timePlanViewParam,
  );

  return (
    <LeafPanel
      key={`time-plan-${id}/add-from-habit-inbox-tasks`}
      fakeKey={`time-plan-${id}/add-from-habit-inbox-tasks`}
      returnLocation={returnLocation}
      returnLocationDiscriminator="add-from-habit-inbox-tasks"
      inputsEnabled={inputsEnabled}
      initialExpansionState={LeafPanelExpansionState.LARGE}
      allowedExpansionStates={[
        LeafPanelExpansionState.LARGE,
        LeafPanelExpansionState.FULL,
      ]}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="time-plan-habit-inbox-tasks"
        title={`Inbox Tasks for ${loaderData.habit.name}`}
        actions={
          <SectionActions
            id="time-plan-add-from-habit-inbox-tasks"
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
                    text: "Gen",
                    value: "gen",
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
            <InputLabel id="rightNow" shrink>
              Generation Date
            </InputLabel>
            <OutlinedInput
              type="date"
              notched
              label="Generation Date"
              readOnly={!inputsEnabled}
              disabled={!inputsEnabled}
              defaultValue={loaderData.timePlan.start_date}
              name="rightNow"
            />

            <FieldError actionResult={actionData} fieldName="/rightNow" />
          </FormControl>

          <FormControl fullWidth>
            <PeriodSelect
              labelId="period"
              label="Generation Period"
              name="period"
              inputsEnabled={inputsEnabled}
              defaultValue={[loaderData.habit.gen_params.period]}
            />
            <FieldError actionResult={actionData} fieldName="/period" />
          </FormControl>
        </Stack>

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
                )?.feasability ?? TimePlanActivityFeasability.MUST_DO
              }
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/feasability" />
          </FormControl>
        </Stack>

        <StandardDivider title="Habit Inbox Tasks" size="large" />
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
      `/app/workspace/time-plans/${params.id}`,
      searchParams.get(TIME_PLAN_VIEW_PARAM),
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
