import type {
  ChapterSummary,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  AspectSummary,
} from "@jupiter/webapi-client";
import {
  ApiError,
  Difficulty,
  Eisen,
  HabitRepeatsStrategy,
  RecurringTaskPeriod,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext, useState } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm } from "zodix";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { HabitRepeatStrategySelect } from "@jupiter/core/habits/component/repeat-strategy-select";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { LifePlanAssociations } from "@jupiter/core/life_plan/components/life-plan-associations";
import { RecurringTaskGenParamsBlock } from "@jupiter/core/common/component/recurring-task-gen-params-block";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { IsKeySelect } from "@jupiter/core/common/component/is-key-select";
import {
  SectionCard,
  ActionsPosition,
} from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { aDateToDate } from "#/core/common/adate";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  name: z.string(),
  aspect: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
  period: z.nativeEnum(RecurringTaskPeriod),
  isKey: CheckboxAsString,
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
  actionableFromDay: z.string().optional(),
  actionableFromMonth: z.string().optional(),
  dueAtDay: z.string().optional(),
  dueAtMonth: z.string().optional(),
  mustDo: CheckboxAsString,
  skipRule: z.string().optional(),
  repeatsStrategy: z
    .nativeEnum(HabitRepeatsStrategy)
    .or(z.literal("none"))
    .optional(),
  repeatsInPeriodCount: z.string().optional(),
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

  return json({
    rootAspect: summaryResponse.root_aspect as AspectSummary,
    lifePlan: summaryResponse.life_plan as LifePlan,
    allAspects: summaryResponse.aspects as Array<AspectSummary>,
    allChapters: summaryResponse.chapters as Array<ChapterSummary>,
    allGoals: summaryResponse.goals as Array<GoalSummary>,
    allMilestones: summaryResponse.milestones as Array<MilestoneSummary>,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.habits.habitCreate({
      name: form.name,
      aspect_ref_id: form.aspect !== undefined ? form.aspect : undefined,
      chapter_ref_id:
        form.chapter !== undefined && form.chapter !== ""
          ? form.chapter
          : undefined,
      goal_ref_id:
        form.goal !== undefined && form.goal !== "" ? form.goal : undefined,
      period: form.period,
      is_key: form.isKey,
      eisen: form.eisen,
      difficulty: form.difficulty,
      actionable_from_day: form.actionableFromDay
        ? parseInt(form.actionableFromDay)
        : undefined,
      actionable_from_month: form.actionableFromMonth
        ? parseInt(form.actionableFromMonth)
        : undefined,
      due_at_day: form.dueAtDay ? parseInt(form.dueAtDay) : undefined,
      due_at_month: form.dueAtMonth ? parseInt(form.dueAtMonth) : undefined,
      skip_rule:
        form.skipRule !== undefined && form.skipRule !== ""
          ? form.skipRule
          : undefined,
      repeats_strategy:
        form.repeatsStrategy !== undefined && form.repeatsStrategy !== "none"
          ? form.repeatsStrategy
          : undefined,
      repeats_in_period_count: form.repeatsInPeriodCount
        ? parseInt(form.repeatsInPeriodCount)
        : undefined,
    });

    return redirect(`/app/workspace/habits/${result.new_habit.ref_id}`);
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

export default function NewHabit() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const birthdayDate = lifePlanBirthdayDate(loaderData.lifePlan);
  const [selectedAspect, setSelectedAspect] = useState<string>(
    loaderData.rootAspect.ref_id,
  );

  const [selectedPeriod, setSelectedPeriod] = useState<RecurringTaskPeriod>(
    RecurringTaskPeriod.DAILY,
  );
  const [selectedRepeatsStrategy, setSelectedRepeatsStrategy] = useState<
    HabitRepeatsStrategy | "none"
  >("none");

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="habits/new"
      fakeKey={"habits/new"}
      returnLocation="/app/workspace/habits"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Habit"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="habit-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "habit-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              defaultValue={""}
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
          WorkspaceFeature.LIFE_PLAN,
        ) && (
          <FormControl fullWidth>
            <LifePlanAssociations
              inputsEnabled={inputsEnabled}
              allAspects={loaderData.allAspects}
              aspectValue={selectedAspect}
              onAspectChange={setSelectedAspect}
              allChapters={loaderData.allChapters}
              allGoals={loaderData.allGoals}
              birthday={birthdayDate}
              today={aDateToDate(topLevelInfo.today)}
              allMilestones={loaderData.allMilestones}
            />
            <FieldError actionResult={actionData} fieldName="/aspect_ref_id" />
            <FieldError actionResult={actionData} fieldName="/chapter_ref_id" />
            <FieldError actionResult={actionData} fieldName="/goal_ref_id" />
          </FormControl>
        )}

        <RecurringTaskGenParamsBlock
          inputsEnabled={inputsEnabled}
          allowSkipRule
          period={selectedPeriod}
          onChangePeriod={(newPeriod) => {
            if (newPeriod === "none") {
              setSelectedPeriod(RecurringTaskPeriod.DAILY);
            } else {
              setSelectedPeriod(newPeriod);
            }
          }}
          eisen={Eisen.REGULAR}
          difficulty={Difficulty.EASY}
          actionableFromDay={null}
          actionableFromMonth={null}
          dueAtDay={null}
          dueAtMonth={null}
          skipRule={null}
          actionData={actionData}
        />

        {selectedPeriod !== RecurringTaskPeriod.DAILY && (
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ flexGrow: 3 }}>
              <HabitRepeatStrategySelect
                name="repeatsStrategy"
                inputsEnabled={inputsEnabled}
                allowNone
                value={selectedRepeatsStrategy}
                onChange={(newStrategy) =>
                  setSelectedRepeatsStrategy(newStrategy)
                }
              />
            </FormControl>
            {selectedRepeatsStrategy !== "none" && (
              <FormControl sx={{ flexGrow: 1 }}>
                <InputLabel id="repeatsInPeriodCount">
                  Repeats In Period [Optional]
                </InputLabel>
                <OutlinedInput
                  label="Repeats In Period"
                  name="repeatsInPeriodCount"
                  readOnly={!inputsEnabled}
                  sx={{ height: "100%" }}
                />
                <FieldError
                  actionResult={actionData}
                  fieldName="/repeats_in_period_count"
                />
              </FormControl>
            )}
          </Stack>
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/habits",
  ParamsSchema,
  {
    notFound: () => `Could not find the habit!`,
    error: () => `There was an error creating the habit! Please try again!`,
  },
);
