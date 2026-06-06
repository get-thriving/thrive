import type { TimePlan } from "@jupiter/webapi-client";
import {
  ApiError,
  Difficulty,
  Eisen,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
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
import { useActionData, useNavigation, useParams } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams, parseQuery } from "zodix";
import {
  getSuggestedDatesForInboxTaskActionableDate,
  getSuggestedDatesForInboxTaskDueDate,
} from "@jupiter/core/common/suggested-date";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { DifficultySelect } from "@jupiter/core/common/component/difficulty-select";
import { EisenhowerSelect } from "@jupiter/core/common/component/eisenhower-select";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import {
  BetterFieldError,
  FieldError,
  GlobalError,
} from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { TimePlanActivityFeasabilitySelect } from "@jupiter/core/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "@jupiter/core/time_plans/sub/activity/component/kind-select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { IsKeySelect } from "@jupiter/core/common/component/is-key-select";
import { DateInputWithSuggestions } from "@jupiter/core/infra/component/date-input-with-suggestions";
import {
  SectionCard,
  ActionsPosition,
} from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";

import { getLoggedInApiClient } from "~/api-clients.server";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({
  id: z.string(),
});

const QuerySchema = z.object({
  timePlanReason: z.literal("for-time-plan").optional(),
  timePlanRefId: z.string().optional(),
  parentTimePlanActivityRefId: z.string().optional(),
});

const CreateFormSchema = z.object({
  name: z.string(),
  isKey: CheckboxAsString,
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
  actionableDate: z.string().optional(),
  dueDate: z.string().optional(),
  timePlanActivityKind: z.nativeEnum(TimePlanActivityKind).optional(),
  timePlanActivityFeasability: z
    .nativeEnum(TimePlanActivityFeasability)
    .optional(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id: bigPlanId } = parseParams(params, ParamsSchema);
  const query = parseQuery(request, QuerySchema);

  const bigPlanResult = await apiClient.bigPlans.bigPlanLoad({
    allow_archived: false,
    ref_id: bigPlanId,
  });

  const timePlanReason = query.timePlanReason || "standard";

  let associatedTimePlan = null;
  if (timePlanReason === "for-time-plan") {
    if (!query.timePlanRefId) {
      throw new Response("Missing Time Plan Id", { status: 500 });
    }

    const timePlanResult = await apiClient.timePlans.timePlanLoad({
      allow_archived: false,
      ref_id: query.timePlanRefId,
      include_targets: false,
      include_completed_nontarget: false,
      include_other_time_plans: false,
    });

    associatedTimePlan = timePlanResult.time_plan;
  }

  return json({
    bigPlan: bigPlanResult.project,
    timePlanReason: timePlanReason,
    associatedTimePlan: associatedTimePlan,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id: bigPlanId } = parseParams(params, ParamsSchema);
  const query = parseQuery(request, QuerySchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const timePlanReason = query.timePlanReason || "standard";

    const result = await apiClient.bigPlans.bigPlanCreateInboxTask({
      project_ref_id: bigPlanId,
      name: form.name,
      time_plan_ref_id:
        timePlanReason === "standard"
          ? undefined
          : (query.timePlanRefId as string),
      time_plan_activity_kind: form.timePlanActivityKind,
      time_plan_activity_feasability: form.timePlanActivityFeasability,
      is_key: form.isKey,
      eisen: form.eisen,
      difficulty: form.difficulty,
      actionable_date:
        form.actionableDate !== undefined && form.actionableDate !== ""
          ? form.actionableDate
          : undefined,
      due_date:
        form.dueDate !== undefined && form.dueDate !== ""
          ? form.dueDate
          : undefined,
    });

    switch (timePlanReason) {
      case "for-time-plan":
        return redirect(
          `/app/workspace/time-plans/${query.timePlanRefId}/${query.parentTimePlanActivityRefId}`,
        );

      case "standard":
        return redirect(
          `/app/workspace/projects/${bigPlanId}/inbox-tasks/${result.new_inbox_task.ref_id}`,
        );
    }
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function ProjectNewInboxTask() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id: bigPlanId } = useParams();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="project-inbox-tasks/new"
      isLeaflet
      fakeKey="project-inbox-tasks/new"
      returnLocation={`/app/workspace/projects/${bigPlanId}`}
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title={`New Inbox Task for ${loaderData.bigPlan.name}`}
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="project-inbox-task-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "project-inbox-task-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              {...BetterFieldError({
                actionResult: actionData,
                fieldName: "/name",
              })}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <IsKeySelect
              name="isKey"
              defaultValue={false}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/is_key" />
          </FormControl>
        </Stack>

        <FormControl fullWidth>
          <FormLabel id="eisen">Eisenhower</FormLabel>
          <EisenhowerSelect
            name="eisen"
            defaultValue={Eisen.REGULAR}
            inputsEnabled={inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/eisen" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="difficulty">Difficulty</FormLabel>
          <DifficultySelect
            name="difficulty"
            defaultValue={Difficulty.EASY}
            inputsEnabled={inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/difficulty" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="actionableDate" shrink>
            Actionable From [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name="actionableDate"
            label="actionableDate"
            inputsEnabled={inputsEnabled}
            defaultValue={
              loaderData.timePlanReason === "for-time-plan"
                ? (loaderData.associatedTimePlan as TimePlan).start_date
                : (loaderData.bigPlan.actionable_date ?? undefined)
            }
            suggestedDates={getSuggestedDatesForInboxTaskActionableDate(
              topLevelInfo.today,
              loaderData.bigPlan,
              loaderData.associatedTimePlan,
            )}
          />

          <FieldError actionResult={actionData} fieldName="/actionable_date" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="dueDate" shrink>
            Due At [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name="dueDate"
            label="dueDate"
            inputsEnabled={inputsEnabled}
            defaultValue={
              loaderData.timePlanReason === "for-time-plan"
                ? (loaderData.associatedTimePlan as TimePlan).end_date
                : (loaderData.bigPlan.due_date ?? undefined)
            }
            suggestedDates={getSuggestedDatesForInboxTaskDueDate(
              topLevelInfo.today,
              loaderData.bigPlan,
              loaderData.associatedTimePlan,
            )}
          />

          <FieldError actionResult={actionData} fieldName="/due_date" />
        </FormControl>

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.TIME_PLANS,
        ) &&
          loaderData.timePlanReason === "for-time-plan" && (
            <>
              <FormControl fullWidth>
                <FormLabel id="timePlanActivityKind">Kind</FormLabel>
                <TimePlanActivitKindSelect
                  name="timePlanActivityKind"
                  defaultValue={TimePlanActivityKind.FINISH}
                  inputsEnabled={inputsEnabled}
                />
                <FieldError
                  actionResult={actionData}
                  fieldName="/time_plan_activity_kind"
                />
              </FormControl>

              <FormControl fullWidth>
                <FormLabel id="timePlanActivityFeasability">
                  Feasability
                </FormLabel>
                <TimePlanActivityFeasabilitySelect
                  name="timePlanActivityFeasability"
                  defaultValue={TimePlanActivityFeasability.NICE_TO_HAVE}
                  inputsEnabled={inputsEnabled}
                />
                <FieldError
                  actionResult={actionData}
                  fieldName="/time_plan_activity_feasability"
                />
              </FormControl>
            </>
          )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("../..", ParamsSchema, {
  error: () => `There was an error creating the inbox task! Please try again!`,
});
