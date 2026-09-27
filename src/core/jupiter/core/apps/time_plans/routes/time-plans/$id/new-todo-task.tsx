import type {
  AspectSummary,
  ChapterSummary,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
} from "@jupiter/webapi-client";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { useNavigation, useParams, useSearchParams } from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseParams } from "zodix";

import { TodoTaskCreateForm } from "#/core/apps/todo/components/create-form";
import { useTimePlanCreateIntents } from "#/core/apps/time_plans/store/create-intents";
import { CREATE_TODO_TASK } from "#/core/apps/time_plans/store/mutations/create-entities";
import { withTimePlanView } from "#/core/apps/time_plans/view-mode";
import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const [timePlanResult, summaries] = await Promise.all([
    apiClient.timePlans.timePlanLoad({
      allow_archived: false,
      ref_id: id,
      include_targets: false,
      include_completed_nontarget: false,
      include_other_time_plans: false,
    }),
    apiClient.application.getSummaries({
      include_life_plan: true,
      include_aspects: true,
      include_chapters: true,
      include_goals: true,
      include_milestones: true,
    }),
  ]);

  return {
    rootAspect: summaries.root_aspect as AspectSummary | null,
    lifePlan: summaries.life_plan as LifePlan | null,
    allAspects: summaries.aspects as Array<AspectSummary> | null,
    allChapters: summaries.chapters as Array<ChapterSummary> | null,
    allGoals: summaries.goals as Array<GoalSummary> | null,
    allMilestones: summaries.milestones as Array<MilestoneSummary> | null,
    timePlan: timePlanResult.time_plan,
  };
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

// A new todo task made from the time plan view, as a leaf of the plan rather than
// a trip to its app: making it doesn't reload the plan.
export default function TimePlanNewTodoTask() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const { id } = useParams();
  const [query] = useSearchParams();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const { intentHandlers, inFlight, error, formKey } = useTimePlanCreateIntents(
    CREATE_TODO_TASK,
    { timePlanRefId: id as string, timePlanView: query },
  );

  const inputsEnabled = navigation.state === "idle" && !inFlight;

  return (
    <LeafPanel
      key={`time-plan-${id}/new-todo-task`}
      fakeKey={`time-plan-${id}/new-todo-task`}
      returnLocation={withTimePlanView(
        `/app/workspace/apps/time-plans/${id}`,
        query,
      )}
      inputsEnabled={inputsEnabled}
      intentHandlers={intentHandlers}
    >
      <TodoTaskCreateForm
        key={formKey}
        {...loaderData}
        topLevelInfo={topLevelInfo}
        inputsEnabled={inputsEnabled}
        actionResult={error ?? undefined}
      />
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
    error: () => `There was an error creating the todo task! Please try again!`,
  },
);
