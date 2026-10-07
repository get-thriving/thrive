import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { useNavigation, useParams, useSearchParams } from "react-router";
import { useContext, useMemo } from "react";
import { z } from "zod";
import { parseParams, parseQuery } from "zodix";

import { BigPlanInboxTaskCreateForm } from "#/core/apps/big_plans/component/inbox-task-create-form";
import { useTimePlanCreateIntents } from "#/core/apps/time_plans/store/create-intents";
import { CREATE_BIG_PLAN_INBOX_TASK } from "#/core/apps/time_plans/store/mutations/create-entities";
import { withTimePlanView } from "#/core/apps/time_plans/view-mode";
import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";
import { handleLoaderApiError } from "#/core/infra/errors.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const QuerySchema = z.object({
  bigPlanRefId: z.string(),
  // The big plan's activity, which the panel goes back to.
  parentActivityRefId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const query = parseQuery(request, QuerySchema);
  try {
    const [timePlanResult, bigPlanResult] = await Promise.all([
      apiClient.timePlans.timePlanLoad({
        allow_archived: false,
        ref_id: id,
        include_targets: false,
        include_completed_nontarget: false,
        include_other_time_plans: false,
      }),
      apiClient.bigPlans.bigPlanLoad({
        allow_archived: false,
        ref_id: query.bigPlanRefId,
      }),
    ]);

    return {
      bigPlan: bigPlanResult.big_plan,
      timePlan: timePlanResult.time_plan,
    };
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

// A new inbox task for a big plan, made from the big plan's activity in the
// time plan view, as a leaf of the plan: making it doesn't reload the plan, and
// it goes back to the big plan's activity.
export default function TimePlanNewBigPlanInboxTask() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const { id } = useParams();
  const [query] = useSearchParams();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const bigPlanRefId = loaderData.bigPlan.ref_id;
  const parentActivityRefId = query.get("parentActivityRefId") ?? undefined;
  const extraFields = useMemo(() => ({ bigPlanRefId }), [bigPlanRefId]);
  const { intentHandlers, inFlight, error, formKey } = useTimePlanCreateIntents(
    CREATE_BIG_PLAN_INBOX_TASK,
    {
      timePlanRefId: id as string,
      timePlanView: query,
      extraFields,
      activityRefIdAfterCreate: parentActivityRefId,
    },
  );

  const inputsEnabled = navigation.state === "idle" && !inFlight;

  return (
    <LeafPanel
      key={`time-plan-${id}/new-big-plan-inbox-task`}
      fakeKey={`time-plan-${id}/new-big-plan-inbox-task`}
      returnLocation={withTimePlanView(
        parentActivityRefId === undefined
          ? `/app/workspace/apps/time-plans/${id}`
          : `/app/workspace/apps/time-plans/${id}/${parentActivityRefId}`,
        query,
      )}
      inputsEnabled={inputsEnabled}
      intentHandlers={intentHandlers}
    >
      <BigPlanInboxTaskCreateForm
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
    error: () =>
      `There was an error creating the inbox task! Please try again!`,
  },
);
