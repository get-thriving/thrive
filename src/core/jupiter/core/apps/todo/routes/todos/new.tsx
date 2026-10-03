import type {
  AspectSummary,
  ChapterSummary,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
} from "@jupiter/webapi-client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { redirect, useActionData, useNavigation } from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";

import { TodoTaskCreateForm } from "#/core/apps/todo/components/create-form";
import {
  TodoTaskCreateFormSchema,
  todoTaskCreateArgs,
} from "#/core/apps/todo/create-form";
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

const QuerySchema = z.object({
  initialDueDate: z.enum(["day", "week", "month", "year"]).optional(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const query = parseQuery(request, QuerySchema);
  const apiClient = await getLoggedInApiClient(request);
  const summaries = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_aspects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });

  return {
    rootAspect: summaries.root_aspect as AspectSummary | null,
    lifePlan: summaries.life_plan as LifePlan | null,
    allAspects: summaries.aspects as Array<AspectSummary> | null,
    allChapters: summaries.chapters as Array<ChapterSummary> | null,
    allGoals: summaries.goals as Array<GoalSummary> | null,
    allMilestones: summaries.milestones as Array<MilestoneSummary> | null,
    timePlan: null,
    initialDueDate: query.initialDueDate ?? null,
  };
}

export async function action({ request, url }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, TodoTaskCreateFormSchema);

  try {
    const result = await apiClient.todo.todoTaskCreate(
      todoTaskCreateArgs(form),
    );

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(url));
    }

    return redirect(`/app/workspace/apps/todos/${result.new_todo_task.ref_id}`);
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewTodo() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="todos/new"
      fakeKey="todos/new"
      returnLocation="/app/workspace/apps/todos"
      inputsEnabled={inputsEnabled}
    >
      <TodoTaskCreateForm
        {...loaderData}
        topLevelInfo={topLevelInfo}
        inputsEnabled={inputsEnabled}
        actionResult={actionData}
      />
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/todos",
  ParamsSchema,
  {
    error: () => `There was an error creating the todo task! Please try again!`,
  },
);
