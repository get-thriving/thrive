import type {
  ChapterSummary,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  ProjectSummary,
  TimePlan,
} from "@jupiter/webapi-client";
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
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseQuery } from "zodix";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  getSuggestedDatesForBigPlanActionableDate,
  getSuggestedDatesForBigPlanDueDate,
} from "@jupiter/core/common/suggested-date";
import { DifficultySelect } from "@jupiter/core/common/component/difficulty-select";
import { EisenhowerSelect } from "@jupiter/core/common/component/eisenhower-select";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { LifePlanAssociations } from "@jupiter/core/life_plan/components/life-plan-associations";
import { TimePlanActivityFeasabilitySelect } from "@jupiter/core/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "@jupiter/core/time_plans/sub/activity/component/kind-select";
import { IsKeySelect } from "@jupiter/core/common/component/is-key-select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { DateInputWithSuggestions } from "@jupiter/core/infra/component/date-input-with-suggestions";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { aDateToDate } from "#/core/common/adate";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const QuerySchema = z.object({
  timePlanReason: z.literal("for-time-plan").optional(),
  timePlanRefId: z.string().optional(),
});

const CreateFormSchema = z.object({
  name: z.string(),
  project: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
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
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);

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

  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_projects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });

  return json({
    timePlanReason: timePlanReason,
    associatedTimePlan: associatedTimePlan,
    rootProject: summaryResponse.root_project as ProjectSummary,
    lifePlan: summaryResponse.life_plan as LifePlan,
    allProjects: summaryResponse.projects as Array<ProjectSummary>,
    allChapters: summaryResponse.chapters as Array<ChapterSummary>,
    allGoals: summaryResponse.goals as Array<GoalSummary>,
    allMilestones: summaryResponse.milestones as Array<MilestoneSummary>,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const timePlanReason = query.timePlanReason || "standard";

    const result = await apiClient.bigPlans.bigPlanCreate({
      name: form.name,
      time_plan_ref_id:
        timePlanReason === "standard"
          ? undefined
          : (query.timePlanRefId as string),
      time_plan_activity_kind: form.timePlanActivityKind,
      time_plan_activity_feasability: form.timePlanActivityFeasability,
      project_ref_id: form.project !== undefined ? form.project : undefined,
      chapter_ref_id:
        form.chapter !== undefined && form.chapter !== ""
          ? form.chapter
          : undefined,
      goal_ref_id:
        form.goal !== undefined && form.goal !== "" ? form.goal : undefined,
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
      case "standard":
        return redirect(
          `/app/workspace/big-plans/${result.new_big_plan.ref_id}`,
        );

      case "for-time-plan":
        return redirect(
          `/app/workspace/time-plans/${result.new_time_plan_activity?.time_plan_ref_id}/${result.new_time_plan_activity?.ref_id}`,
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

export default function NewBigPlan() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  const birthdayDate = lifePlanBirthdayDate(loaderData.lifePlan);

  return (
    <LeafPanel
      key="big-plans/new"
      fakeKey={`big-plans/new`}
      returnLocation="/app/workspace/big-plans"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Big Plan"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="big-plan-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "big-plan-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput label="Name" name="name" readOnly={!inputsEnabled} />
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

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && (
          <FormControl fullWidth>
            <LifePlanAssociations
              inputsEnabled={inputsEnabled}
              allProjects={loaderData.allProjects}
              projectDefaultValue={loaderData.rootProject.ref_id}
              allChapters={loaderData.allChapters}
              allGoals={loaderData.allGoals}
              birthday={birthdayDate}
              today={aDateToDate(topLevelInfo.today)}
              allMilestones={loaderData.allMilestones}
            />
            <FieldError actionResult={actionData} fieldName="/project_ref_id" />
            <FieldError actionResult={actionData} fieldName="/chapter_ref_id" />
            <FieldError actionResult={actionData} fieldName="/goal_ref_id" />
          </FormControl>
        )}

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
          <InputLabel id="actionableDate" shrink margin="dense">
            Actionable From [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name="actionableDate"
            label="actionableDate"
            inputsEnabled={inputsEnabled}
            defaultValue={
              loaderData.timePlanReason === "for-time-plan"
                ? (loaderData.associatedTimePlan as TimePlan).start_date
                : undefined
            }
            suggestedDates={getSuggestedDatesForBigPlanActionableDate(
              topLevelInfo.today,
              loaderData.associatedTimePlan,
            )}
          />
          <FieldError actionResult={actionData} fieldName="/actionable_date" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="dueDate" shrink margin="dense">
            Due Date [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name="dueDate"
            label="dueDate"
            inputsEnabled={inputsEnabled}
            defaultValue={
              loaderData.timePlanReason === "for-time-plan"
                ? (loaderData.associatedTimePlan as TimePlan).end_date
                : undefined
            }
            suggestedDates={getSuggestedDatesForBigPlanDueDate(
              topLevelInfo.today,
              loaderData.associatedTimePlan,
            )}
          />
          <FieldError actionResult={actionData} fieldName="/due_date" />
        </FormControl>

        {loaderData.timePlanReason === "for-time-plan" && (
          <>
            <FormControl fullWidth>
              <FormLabel id="timePlanActivityKind">
                Time Plan Activity Kind
              </FormLabel>
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
                Time Plan Activity Feasability
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

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/big-plans",
  ParamsSchema,
  {
    error: () => `There was an error creating the big plan! Please try again!`,
  },
);
