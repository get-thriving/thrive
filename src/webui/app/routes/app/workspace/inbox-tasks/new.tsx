import type {
  BigPlanSummary,
  ChapterSummary,
  EntityId,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  Project,
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
  Autocomplete,
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext, useState } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseQuery } from "zodix";
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
import { ProjectSelect } from "@jupiter/core/life_plan/sub/aspects/component/select";
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
import { ChapterSelect } from "#/core/life_plan/sub/chapters/components/select";
import { GoalSelect } from "#/core/life_plan/sub/goals/components/select";
import { aDateToDate } from "#/core/common/adate";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";

import { getLoggedInApiClient } from "~/api-clients.server";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({});

const QuerySchema = z.object({
  timePlanReason: z.literal("for-time-plan").optional(),
  timePlanRefId: z.string().optional(),
  bigPlanReason: z.literal("for-big-plan").optional(),
  bigPlanRefId: z.string().optional(),
  parentTimePlanActivityRefId: z.string().optional(),
});

const CreateFormSchema = z.object({
  name: z.string(),
  project: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
  bigPlan: z.string().optional(),
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

type BigPlanACOption = {
  label: string;
  big_plan_id: string;
};

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

  const bigPlanReason = query.bigPlanReason || "standard";

  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_projects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
    include_big_plans: bigPlanReason === "standard",
  });

  let ownerBigPlan = null;
  let ownerProject = null;
  let ownerChapter = null;
  let ownerGoal = null;
  if (bigPlanReason === "for-big-plan") {
    if (!query.bigPlanRefId) {
      throw new Response("Missing Big Plan Id", { status: 500 });
    }

    const bigPlanResult = await apiClient.bigPlans.bigPlanLoad({
      allow_archived: false,
      ref_id: query.bigPlanRefId,
    });

    ownerBigPlan = bigPlanResult.big_plan;
    ownerProject = bigPlanResult.project;
    ownerChapter = bigPlanResult.chapter;
    ownerGoal = bigPlanResult.goal;
  }

  const defaultProject =
    bigPlanReason === "for-big-plan"
      ? (ownerProject as ProjectSummary)
      : (summaryResponse.root_project as ProjectSummary);
  const defaultChapter =
    bigPlanReason === "for-big-plan" ? (ownerChapter as ChapterSummary) : null;
  const defaultGoal =
    bigPlanReason === "for-big-plan" ? (ownerGoal as GoalSummary) : null;

  const defaultBigPlan: BigPlanACOption =
    bigPlanReason === "for-big-plan"
      ? {
          label: ownerBigPlan?.name as string,
          big_plan_id: query.bigPlanRefId as string,
        }
      : {
          label: "None",
          big_plan_id: "none",
        };

  return json({
    timePlanReason: timePlanReason,
    bigPlanReason: bigPlanReason,
    associatedTimePlan: associatedTimePlan,
    defaultProject: defaultProject,
    defaultChapter: defaultChapter,
    defaultGoal: defaultGoal,
    defaultBigPlan: defaultBigPlan,
    ownerBigPlan: ownerBigPlan,
    lifePlan: summaryResponse.life_plan as LifePlan,
    allProjects: summaryResponse.projects as Array<ProjectSummary>,
    allChapters: summaryResponse.chapters as Array<ChapterSummary>,
    allGoals: summaryResponse.goals as Array<GoalSummary>,
    allMilestones: summaryResponse.milestones as Array<MilestoneSummary>,
    allBigPlans:
      bigPlanReason === "standard"
        ? (summaryResponse.big_plans as Array<BigPlanSummary>)
        : [ownerBigPlan as BigPlanSummary],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const timePlanReason = query.timePlanReason || "standard";
    const bigPlanReason = query.bigPlanReason || "standard";

    const result = await apiClient.inboxTasks.inboxTaskCreate({
      name: form.name,
      time_plan_ref_id:
        timePlanReason === "standard"
          ? undefined
          : (query.timePlanRefId as string),
      time_plan_activity_kind: form.timePlanActivityKind,
      time_plan_activity_feasability: form.timePlanActivityFeasability,
      project_ref_id: form.project,
      chapter_ref_id:
        form.chapter !== undefined && form.chapter !== ""
          ? form.chapter
          : undefined,
      goal_ref_id:
        form.goal !== undefined && form.goal !== "" ? form.goal : undefined,
      big_plan_ref_id:
        bigPlanReason === "standard"
          ? form.bigPlan !== undefined && form.bigPlan !== "none"
            ? form.bigPlan
            : undefined
          : (query.bigPlanRefId as string),
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
        switch (bigPlanReason) {
          case "for-big-plan":
            return redirect(
              `/app/workspace/time-plans/${query.timePlanRefId}/${query.parentTimePlanActivityRefId}`,
            );
          case "standard":
            return redirect(
              `/app/workspace/time-plans/${result.new_time_plan_activity?.time_plan_ref_id}/${result.new_time_plan_activity?.ref_id}`,
            );
        }
        break;

      case "standard":
        switch (bigPlanReason) {
          case "for-big-plan":
            return redirect(
              `/app/workspace/big-plans/${query.bigPlanRefId as string}`,
            );

          case "standard":
            return redirect(
              `/app/workspace/inbox-tasks/${result.new_inbox_task.ref_id}`,
            );
        }
        break;
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

export default function NewInboxTask() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const [selectedBigPlan, setSelectedBigPlan] = useState(
    loaderData.defaultBigPlan,
  );
  const [selectedProject, setSelectedProject] = useState(
    loaderData.defaultProject.ref_id,
  );
  const [selectedChapter, setSelectedChapter] = useState<EntityId | null>(
    loaderData.defaultChapter?.ref_id ?? null,
  );
  const [selectedGoal, setSelectedGoal] = useState<EntityId | null>(
    loaderData.defaultGoal?.ref_id ?? null,
  );
  const [blockedToSelectProject, setBlockedToSelectProject] = useState(
    loaderData.bigPlanReason === "for-big-plan",
  );

  const inputsEnabled = navigation.state === "idle";

  const allProjectsById: { [k: string]: ProjectSummary } = {};
  const allChaptersById: { [k: string]: ChapterSummary } = {};
  const allGoalsById: { [k: string]: GoalSummary } = {};
  if (
    isWorkspaceFeatureAvailable(
      topLevelInfo.workspace,
      WorkspaceFeature.LIFE_PLAN,
    )
  ) {
    for (const project of loaderData.allProjects) {
      allProjectsById[project.ref_id] = project;
    }
    for (const chapter of loaderData.allChapters) {
      allChaptersById[chapter.ref_id] = chapter;
    }
    for (const goal of loaderData.allGoals) {
      allGoalsById[goal.ref_id] = goal;
    }
  }

  const allBigPlansById: { [k: string]: BigPlanSummary } = {};
  let allBigPlansAsOptions: Array<{ label: string; big_plan_id: string }> = [];

  if (
    isWorkspaceFeatureAvailable(
      topLevelInfo.workspace,
      WorkspaceFeature.BIG_PLANS,
    )
  ) {
    for (const bigPlan of loaderData.allBigPlans) {
      allBigPlansById[bigPlan.ref_id] = bigPlan;
    }

    allBigPlansAsOptions = [
      {
        label: "None",
        big_plan_id: "none",
      },
    ].concat(
      loaderData.allBigPlans.map((bp: BigPlanSummary) => ({
        label: bp.name,
        big_plan_id: bp.ref_id,
      })),
    );
  }

  function handleChangeBigPlan(
    e: React.SyntheticEvent,
    { label, big_plan_id }: BigPlanACOption,
  ) {
    setSelectedBigPlan({ label, big_plan_id });

    if (
      isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.LIFE_PLAN,
      )
    ) {
      if (big_plan_id === "none") {
        setSelectedProject(loaderData.defaultProject.ref_id);
        setSelectedChapter(null);
        setSelectedGoal(null);
        setBlockedToSelectProject(false);
      } else {
        setSelectedProject(allBigPlansById[big_plan_id].project_ref_id);
        setSelectedChapter(allBigPlansById[big_plan_id].chapter_ref_id ?? null);
        setSelectedGoal(allBigPlansById[big_plan_id].goal_ref_id ?? null);
        setBlockedToSelectProject(true);
      }
    }
  }

  return (
    <LeafPanel
      key="inbox-tasks/new"
      fakeKey={"inbox-tasks/new"}
      returnLocation="/app/workspace/inbox-tasks"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Inbox Task"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="inbox-task-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "inbox-task-create",
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

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.BIG_PLANS,
        ) && (
          <FormControl fullWidth>
            <Autocomplete
              disablePortal
              id="bigPlan"
              options={allBigPlansAsOptions}
              readOnly={
                !inputsEnabled || loaderData.bigPlanReason !== "standard"
              }
              value={selectedBigPlan}
              disableClearable={true}
              onChange={handleChangeBigPlan}
              isOptionEqualToValue={(o, v) => o.big_plan_id === v.big_plan_id}
              renderInput={(params) => (
                <TextField {...params} label="Big Plan" />
              )}
            />

            <FieldError
              actionResult={actionData}
              fieldName="/big_plan_ref_id"
            />

            <input
              type="hidden"
              name="bigPlan"
              value={selectedBigPlan.big_plan_id}
            />
          </FormControl>
        )}

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && (
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <ProjectSelect
                name="project"
                label="Project"
                inputsEnabled={inputsEnabled && !blockedToSelectProject}
                disabled={false}
                allProjects={loaderData.allProjects}
                value={selectedProject}
                onChange={setSelectedProject}
              />
              <FieldError
                actionResult={actionData}
                fieldName="/project_ref_id"
              />
            </FormControl>

            <FormControl fullWidth>
              <ChapterSelect
                name="chapter"
                label="Chapter"
                inputsEnabled={inputsEnabled && !blockedToSelectProject}
                disabled={false}
                onlyForProject={selectedProject}
                allChapters={loaderData.allChapters}
                value={selectedChapter}
                onChange={setSelectedChapter}
                birthday={lifePlanBirthdayDate(loaderData.lifePlan)}
                today={aDateToDate(topLevelInfo.today)}
                milestones={loaderData.allMilestones}
              />
              <FieldError actionResult={actionData} fieldName="/chapter" />
            </FormControl>

            <FormControl fullWidth>
              <GoalSelect
                name="goal"
                label="Goal"
                inputsEnabled={inputsEnabled && !blockedToSelectProject}
                disabled={false}
                onlyForProject={selectedProject}
                allGoals={loaderData.allGoals}
                value={selectedGoal}
                onChange={setSelectedGoal}
              />
              <FieldError actionResult={actionData} fieldName="/goal" />
            </FormControl>
          </Stack>
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
                : loaderData.bigPlanReason === "for-big-plan" &&
                    loaderData.ownerBigPlan?.actionable_date
                  ? loaderData.ownerBigPlan.actionable_date
                  : undefined
            }
            suggestedDates={getSuggestedDatesForInboxTaskActionableDate(
              topLevelInfo.today,
              loaderData.ownerBigPlan,
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
                : loaderData.bigPlanReason === "for-big-plan" &&
                    loaderData.ownerBigPlan?.due_date
                  ? loaderData.ownerBigPlan.due_date
                  : undefined
            }
            suggestedDates={getSuggestedDatesForInboxTaskDueDate(
              topLevelInfo.today,
              loaderData.ownerBigPlan,
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

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/inbox-tasks",
  ParamsSchema,
  {
    error: () =>
      `There was an error creating the inbox task! Please try again!`,
  },
);
