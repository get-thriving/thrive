import type {
  AspectSummary,
  ChapterSummary,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  HabitStack,
} from "@jupiter/webapi-client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { redirect, useActionData, useNavigation } from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";

import { HabitCreateForm } from "#/core/apps/habits/component/create-form";
import {
  HabitCreateFormSchema,
  habitCreateArgs,
} from "#/core/apps/habits/create-form";
import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { handleActionApiError } from "#/core/infra/errors.server";
import {
  createAnotherLocation,
  isCreateAndAnother,
} from "#/core/infra/create-and-another";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const [summaries, stacks] = await Promise.all([
    apiClient.application.getSummaries({
      include_life_plan: true,
      include_aspects: true,
      include_chapters: true,
      include_goals: true,
      include_milestones: true,
    }),
    apiClient.habits.habitStackFind({
      allow_archived: false,
      include_tags: false,
      include_notes: false,
      include_life_plan: false,
      include_habits: false,
    }),
  ]);

  return {
    rootAspect: summaries.root_aspect as AspectSummary | null,
    lifePlan: summaries.life_plan as LifePlan | null,
    allAspects: summaries.aspects as Array<AspectSummary> | null,
    allChapters: summaries.chapters as Array<ChapterSummary> | null,
    allGoals: summaries.goals as Array<GoalSummary> | null,
    allMilestones: summaries.milestones as Array<MilestoneSummary> | null,
    allStacks: stacks.entries.map(
      (entry) => entry.habit_stack,
    ) as Array<HabitStack>,
    timePlan: null,
  };
}

export async function action({ request, url }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, HabitCreateFormSchema);

  try {
    const result = await apiClient.habits.habitCreate(habitCreateArgs(form));

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(url));
    }

    return redirect(
      `/app/workspace/apps/habits/habits/${result.new_habit.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewHabit() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="habits/new"
      fakeKey={"habits/new"}
      returnLocation="/app/workspace/apps/habits/habits"
      inputsEnabled={inputsEnabled}
    >
      <HabitCreateForm
        {...loaderData}
        topLevelInfo={topLevelInfo}
        inputsEnabled={inputsEnabled}
        actionResult={actionData}
      />
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/habits/habits",
  ParamsSchema,
  {
    notFound: () => `Could not find the habit!`,
    error: () => `There was an error creating the habit! Please try again!`,
  },
);
