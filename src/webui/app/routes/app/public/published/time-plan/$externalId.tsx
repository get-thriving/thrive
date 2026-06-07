import type {
  BigPlan,
  InboxTask,
  TimePlanActivity,
  TimePlanActivityDoneness,
} from "@jupiter/webapi-client";
import { ApiError, TimePlanActivityFeasability } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useMemo } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityInboxTaskTarget,
} from "@jupiter/core/time_plans/sub/activity/target-wire";
import { filterActivityByFeasabilityWithParents } from "@jupiter/core/time_plans/sub/activity/root";
import { entityLinkRefIdFromWire } from "@jupiter/core/common/sub/inbox_tasks/parent-link-namespace";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { TimePlanEditor } from "@jupiter/core/time_plans/component/editor";
import { allowUserChanges } from "@jupiter/core/time_plans/source";
import { TimePlanListMergedActivities } from "@jupiter/core/time_plans/component/list-merged-activities";

import { getGuestApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({
  externalId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { externalId } = parseParams(params, ParamsSchema);
  const apiClient = await getGuestApiClient(request);

  try {
    const result = await apiClient.timePlans.timePlanLoadPublic({
      external_id: externalId,
    });

    return json({
      timePlan: result.time_plan,
      tags: result.tags ?? [],
      note: result.note,
      activities: result.activities,
      aspects: result.aspects,
      chapters: result.chapters,
      goals: result.goals,
      targetInboxTasks: (result.target_inbox_tasks ?? []) as Array<InboxTask>,
      targetBigPlans: (result.target_big_plans ?? []) as Array<BigPlan>,
      activityDoneness: (result.activity_doneness ?? {}) as Record<
        string,
        TimePlanActivityDoneness
      >,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.NOT_FOUND) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    throw error;
  }
}

export default function PublishedTimePlan() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const {
    timePlan,
    tags,
    note,
    activities,
    aspects,
    chapters,
    goals,
    targetInboxTasks,
    targetBigPlans,
    activityDoneness,
  } = loaderData;

  const targetInboxTasksByRefId = useMemo(
    () => new Map<string, InboxTask>(targetInboxTasks.map((it) => [it.ref_id, it])),
    [targetInboxTasks],
  );
  const targetBigPlansByRefId = useMemo(
    () => new Map<string, BigPlan>(targetBigPlans.map((bp) => [bp.ref_id, bp])),
    [targetBigPlans],
  );
  const actitiviesByBigPlanRefId = useMemo(
    () =>
      new Map<string, TimePlanActivity>(
        activities
          .filter((a) => isTimePlanActivityBigPlanTarget(a.target))
          .map((a) => [entityLinkRefIdFromWire(a.target), a]),
      ),
    [activities],
  );

  const mustDoActivities = filterActivityByFeasabilityWithParents(
    activities,
    actitiviesByBigPlanRefId,
    targetInboxTasksByRefId,
    targetBigPlansByRefId,
    TimePlanActivityFeasability.MUST_DO,
  );
  const niceToHaveActivities = filterActivityByFeasabilityWithParents(
    activities,
    actitiviesByBigPlanRefId,
    targetInboxTasksByRefId,
    targetBigPlansByRefId,
    TimePlanActivityFeasability.NICE_TO_HAVE,
  );
  const stretchActivities = filterActivityByFeasabilityWithParents(
    activities,
    actitiviesByBigPlanRefId,
    targetInboxTasksByRefId,
    targetBigPlansByRefId,
    TimePlanActivityFeasability.STRETCH,
  );

  return (
    <LeafPanel
      key={`published-time-plan-${timePlan.ref_id}`}
      fakeKey={`published-time-plan-${timePlan.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <TimePlanEditor
        timePlan={timePlan}
        tags={tags}
        allTags={tags}
        aspects={aspects}
        chapters={chapters}
        goals={goals}
        inputsEnabled={false}
        corePropertyEditable={allowUserChanges(timePlan.source)}
        topLevelInfo={topLevelInfo}
      />

      <SectionCard title="Notes">
        <EntityNoteEditor initialNote={note} inputsEnabled={false} />
      </SectionCard>

      {activities.length > 0 && (
        <SectionCard title="Activities">
          <TimePlanListMergedActivities
            mustDoActivities={mustDoActivities}
            niceToHaveActivities={niceToHaveActivities}
            stretchActivities={stretchActivities}
            targetInboxTasksByRefId={targetInboxTasksByRefId}
            targetBigPlansByRefId={targetBigPlansByRefId}
            activityDoneness={activityDoneness}
            timeEventsByRefId={new Map()}
            selectedKinds={[]}
            selectedFeasabilities={[]}
            selectedDoneness={[]}
          />
        </SectionCard>
      )}
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("/app", ParamsSchema, {
  notFound: (params) =>
    `Could not find published time plan ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published time plan ${params.externalId}! Please try again!`,
});
