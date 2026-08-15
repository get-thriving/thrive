import type {
  BigPlan,
  BigPlanStats,
  Chore,
  Habit,
  InboxTask,
  TimePlanActivityDoneness,
  TodoTask,
} from "@jupiter/webapi-client";
import {
  TimePlanActivityFeasability,
  NamedEntityTag,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useContext, useMemo } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { parentActivitiesByTargetRefId } from "@jupiter/core/apps/time_plans/sub/activity/group-by-parent";
import { filterActivityByFeasabilityWithParents } from "@jupiter/core/apps/time_plans/sub/activity/root";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { TimePlanEditor } from "@jupiter/core/apps/time_plans/component/editor";
import { BigPlanProgressView } from "@jupiter/core/apps/time_plans/component/big-plan-progress-view";
import { allowUserChanges } from "@jupiter/core/apps/time_plans/source";
import { TimePlanListMergedActivities } from "@jupiter/core/apps/time_plans/component/list-merged-activities";
import { computeBigPlanProgressSummary } from "@jupiter/core/apps/time_plans/big-plan-progress-summary";
import { timePlanShowsBigPlanProgress } from "@jupiter/core/apps/time_plans/root";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";

import { getGuestApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";

const ParamsSchema = z.object({
  externalId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const result = await apiClient.timePlans.timePlanLoadPublic({
      external_id: externalId,
    });

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.TIME_PLAN,
        name: result.time_plan.name,
        note: result.note,
        dateModified: result.time_plan.last_modified_time,
      }),
      timePlan: result.time_plan,
      tags: result.tags ?? [],
      note: result.note,
      activities: result.activities,
      aspects: result.aspects,
      chapters: result.chapters,
      goals: result.goals,
      targetInboxTasks: (result.target_inbox_tasks ?? []) as Array<InboxTask>,
      targetBigPlans: (result.target_big_plans ?? []) as Array<BigPlan>,
      bigPlanStats: (result.big_plan_stats ?? []) as Array<BigPlanStats>,
      targetTodoTasks: (result.target_todo_tasks ?? []) as Array<TodoTask>,
      targetHabits: (result.target_habits ?? []) as Array<Habit>,
      targetChores: (result.target_chores ?? []) as Array<Chore>,
      activityDoneness: (result.activity_doneness ?? {}) as Record<
        string,
        TimePlanActivityDoneness
      >,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

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
    targetTodoTasks,
    targetHabits,
    targetChores,
    activityDoneness,
    bigPlanStats,
  } = loaderData;

  const targetInboxTasksByRefId = useMemo(
    () =>
      new Map<string, InboxTask>(targetInboxTasks.map((it) => [it.ref_id, it])),
    [targetInboxTasks],
  );
  const targetBigPlansByRefId = useMemo(
    () => new Map<string, BigPlan>(targetBigPlans.map((bp) => [bp.ref_id, bp])),
    [targetBigPlans],
  );
  const bigPlanStatsByRefId = useMemo(
    () =>
      new Map<string, BigPlanStats>(
        bigPlanStats.map((stats) => [stats.big_plan_ref_id, stats]),
      ),
    [bigPlanStats],
  );
  const targetTodoTasksByRefId = useMemo(
    () =>
      new Map<string, TodoTask>(targetTodoTasks.map((tt) => [tt.ref_id, tt])),
    [targetTodoTasks],
  );
  const targetHabitsByRefId = useMemo(
    () => new Map<string, Habit>(targetHabits.map((h) => [h.ref_id, h])),
    [targetHabits],
  );
  const targetChoresByRefId = useMemo(
    () => new Map<string, Chore>(targetChores.map((c) => [c.ref_id, c])),
    [targetChores],
  );
  const parentActivitiesByRefId = useMemo(
    () => parentActivitiesByTargetRefId(activities),
    [activities],
  );

  const mustDoActivities = filterActivityByFeasabilityWithParents(
    activities,
    parentActivitiesByRefId,
    targetInboxTasksByRefId,
    TimePlanActivityFeasability.MUST_DO,
  );
  const niceToHaveActivities = filterActivityByFeasabilityWithParents(
    activities,
    parentActivitiesByRefId,
    targetInboxTasksByRefId,
    TimePlanActivityFeasability.NICE_TO_HAVE,
  );
  const stretchActivities = filterActivityByFeasabilityWithParents(
    activities,
    parentActivitiesByRefId,
    targetInboxTasksByRefId,
    TimePlanActivityFeasability.STRETCH,
  );
  const bigPlanProgressSummary = computeBigPlanProgressSummary({
    timePlanActivities: activities,
    targetBigPlansByRefId,
    bigPlanStatsByRefId,
    activityDoneness,
    completedNontargetBigPlans: [],
  });

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

      {timePlanShowsBigPlanProgress(timePlan) &&
        isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.BIG_PLANS,
        ) && (
          <SectionCard id="time-plan-progress" title="Progress">
            <BigPlanProgressView summary={bigPlanProgressSummary} />
          </SectionCard>
        )}

      {activities.length > 0 && (
        <SectionCard title="Activities">
          <TimePlanListMergedActivities
            mustDoActivities={mustDoActivities}
            niceToHaveActivities={niceToHaveActivities}
            stretchActivities={stretchActivities}
            targetInboxTasksByRefId={targetInboxTasksByRefId}
            targetBigPlansByRefId={targetBigPlansByRefId}
            bigPlanStatsByRefId={bigPlanStatsByRefId}
            targetTodoTasksByRefId={targetTodoTasksByRefId}
            targetHabitsByRefId={targetHabitsByRefId}
            targetChoresByRefId={targetChoresByRefId}
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

export const ErrorBoundary = makeLeafErrorBoundary("/publish", ParamsSchema, {
  notFound: (params) =>
    `Could not find published time plan ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published time plan ${params.externalId}! Please try again!`,
});
