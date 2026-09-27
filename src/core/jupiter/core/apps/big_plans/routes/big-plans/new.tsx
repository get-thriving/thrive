import type {
  AspectSummary,
  ChapterSummary,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  BigPlanSummary,
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

import { BigPlanCreateForm } from "#/core/apps/big_plans/component/create-form";
import {
  BigPlanCreateFormSchema,
  bigPlanCreateArgs,
} from "#/core/apps/big_plans/create-form";
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
  const summaries = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_aspects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
    include_big_plans: true,
  });

  return {
    rootAspect: summaries.root_aspect as AspectSummary | null,
    lifePlan: summaries.life_plan as LifePlan | null,
    allAspects: summaries.aspects as Array<AspectSummary> | null,
    allChapters: summaries.chapters as Array<ChapterSummary> | null,
    allGoals: summaries.goals as Array<GoalSummary> | null,
    allMilestones: summaries.milestones as Array<MilestoneSummary> | null,
    allBigPlans: summaries.big_plans as Array<BigPlanSummary> | null,
    timePlan: null,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, BigPlanCreateFormSchema);

  try {
    const result = await apiClient.bigPlans.bigPlanCreate(
      bigPlanCreateArgs(form),
    );

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(
      `/app/workspace/apps/big-plans/${result.new_big_plan.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
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

  return (
    <LeafPanel
      key="big-plans/new"
      fakeKey={`big-plans/new`}
      returnLocation="/app/workspace/apps/big-plans"
      inputsEnabled={inputsEnabled}
    >
      <BigPlanCreateForm
        {...loaderData}
        topLevelInfo={topLevelInfo}
        inputsEnabled={inputsEnabled}
        actionResult={actionData}
      />
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/big-plans",
  ParamsSchema,
  {
    error: () => `There was an error creating the big plan! Please try again!`,
  },
);
