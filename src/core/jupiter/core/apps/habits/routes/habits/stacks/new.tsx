import type {
  AspectSummary,
  ChapterSummary,
  GoalSummary,
  Habit,
  LifePlan,
  MilestoneSummary,
} from "@jupiter/webapi-client";
import { RecurringTaskPeriod, WorkspaceFeature } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { redirect, useActionData, useNavigation } from "react-router";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm } from "zodix";

import { aDateToDate } from "#/core/common/adate";
import { PeriodSelect } from "#/core/common/component/period-select";
import { HabitSelectMultiple } from "#/core/apps/habits/component/select-multiple";
import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  ActionsPosition,
  SectionCard,
} from "#/core/infra/component/section-card";
import {
  SectionActions,
  ActionSingle,
} from "#/core/infra/component/section-actions";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { handleActionApiError } from "#/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherLocation,
  isCreateAndAnother,
} from "#/core/infra/create-and-another";
import { LifePlanAssociations } from "#/core/apps/life_plan/components/life-plan-associations";
import { lifePlanBirthdayDate } from "#/core/apps/life_plan/root";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  period: z.nativeEnum(RecurringTaskPeriod),
  habitRefIds: z.string().optional(),
  aspect: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_aspects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });

  const habitsResponse = await apiClient.habits.habitFind({
    allow_archived: false,
    include_tags: false,
    include_notes: false,
    include_life_plan: false,
    include_inbox_tasks: false,
  });

  return {
    rootAspect: summaryResponse.root_aspect as AspectSummary | null,
    lifePlan: summaryResponse.life_plan as LifePlan | null,
    allAspects: summaryResponse.aspects as Array<AspectSummary> | null,
    allChapters: summaryResponse.chapters as Array<ChapterSummary> | null,
    allGoals: summaryResponse.goals as Array<GoalSummary> | null,
    allMilestones: summaryResponse.milestones as Array<MilestoneSummary> | null,
    allHabits: habitsResponse.entries.map(
      (entry) => entry.habit,
    ) as Array<Habit>,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const habitRefIds = (form.habitRefIds ?? "")
      .split(",")
      .map((refId) => refId.trim())
      .filter((refId) => refId.length > 0);

    const result = await apiClient.habits.habitStackCreate({
      name: form.name,
      period: form.period,
      habit_ref_ids: habitRefIds,
      aspect_ref_id: form.aspect !== undefined ? form.aspect : undefined,
      chapter_ref_id:
        form.chapter !== undefined && form.chapter !== ""
          ? form.chapter
          : undefined,
      goal_ref_id:
        form.goal !== undefined && form.goal !== "" ? form.goal : undefined,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(
      `/app/workspace/apps/habits/stacks/${result.new_habit_stack.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewHabitStack() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  const birthdayDate = loaderData.lifePlan
    ? lifePlanBirthdayDate(loaderData.lifePlan)
    : null;
  const [selectedAspect, setSelectedAspect] = useState<string>(
    loaderData.rootAspect?.ref_id ?? "",
  );
  const [selectedPeriod, setSelectedPeriod] = useState<RecurringTaskPeriod>(
    RecurringTaskPeriod.DAILY,
  );

  return (
    <LeafPanel
      key="habits/stacks/new"
      fakeKey={"habits/stacks/new"}
      returnLocation="/app/workspace/apps/habits/stacks"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Habit Stack"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="habit-stack-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "habit-stack-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "habit-stack-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
              }),
            ]}
          />
        }
      >
        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl fullWidth>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              defaultValue={""}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>
        </Stack>

        <FormControl fullWidth>
          <PeriodSelect
            labelId="period"
            label="Period"
            name="period"
            inputsEnabled={inputsEnabled}
            value={selectedPeriod}
            onChange={(newPeriod) => {
              if (newPeriod === "none" || Array.isArray(newPeriod)) {
                return;
              }
              setSelectedPeriod(newPeriod);
            }}
          />
          <FieldError actionResult={actionData} fieldName="/period" />
        </FormControl>

        <FormControl fullWidth>
          <HabitSelectMultiple
            name="habitRefIds"
            label="Habits"
            allHabits={loaderData.allHabits}
            filterPeriod={selectedPeriod}
            inputsEnabled={inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/habit_ref_ids" />
        </FormControl>

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && (
          <FormControl fullWidth>
            <LifePlanAssociations
              inputsEnabled={inputsEnabled}
              allAspects={loaderData.allAspects ?? []}
              aspectValue={selectedAspect}
              onAspectChange={setSelectedAspect}
              allChapters={loaderData.allChapters ?? []}
              allGoals={loaderData.allGoals ?? []}
              birthday={birthdayDate!}
              today={aDateToDate(topLevelInfo.today)}
              allMilestones={loaderData.allMilestones ?? []}
            />
            <FieldError actionResult={actionData} fieldName="/aspect_ref_id" />
            <FieldError actionResult={actionData} fieldName="/chapter_ref_id" />
            <FieldError actionResult={actionData} fieldName="/goal_ref_id" />
          </FormControl>
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/habits/stacks",
  ParamsSchema,
  {
    notFound: () => `Could not find the habit stack!`,
    error: () =>
      `There was an error creating the habit stack! Please try again!`,
  },
);
