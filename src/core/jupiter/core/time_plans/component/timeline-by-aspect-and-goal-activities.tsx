import { Fragment, useContext } from "react";
import type {
  BigPlan,
  EntityId,
  GoalSummary,
  InboxTask,
  AspectSummary,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";

import { entityLinkRefIdFromWire } from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { computeAspectHierarchicalNameFromRoot } from "#/core/life_plan/sub/aspects/root";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityInboxTaskTarget,
} from "#/core/time_plans/sub/activity/target-wire";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TimePlanTimelineActivityBars } from "#/core/time_plans/sub/activity/component/timeline";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

interface TimePlanTimelineByAspectAndGoalActivitiesProps {
  timePlan: TimePlan;
  mustDoActivities: TimePlanActivity[];
  otherActivities: TimePlanActivity[];
  targetInboxTasksByRefId: Map<string, InboxTask>;
  targetBigPlansByRefId: Map<string, BigPlan>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  timeEventsByRefId: Map<string, TimeEventInDayBlock[]>;
  selectedKinds: TimePlanActivityKind[];
  selectedFeasabilities: TimePlanActivityFeasability[];
  selectedDoneness: boolean[];
  aspects: AspectSummary[];
  aspectsByRefId: Map<string, AspectSummary>;
  goals: GoalSummary[];
  goalsByRefId: Map<EntityId, GoalSummary>;
  showEmptyGroups?: boolean;
}

export function TimePlanTimelineByAspectAndGoalActivities(
  props: TimePlanTimelineByAspectAndGoalActivitiesProps,
) {
  const topLevelInfo = useContext(TopLevelInfoContext);

  function goalRefIdForActivity(activity: TimePlanActivity): EntityId | null {
    if (isTimePlanActivityInboxTaskTarget(activity.target)) {
      return null;
    }
    if (isTimePlanActivityBigPlanTarget(activity.target)) {
      return (
        (props.targetBigPlansByRefId.get(
          entityLinkRefIdFromWire(activity.target),
        )?.goal_ref_id as EntityId | null | undefined) ?? null
      );
    }
    return null;
  }

  function fullGoalName(goal: GoalSummary): string {
    const visited = new Set<EntityId>();
    const parts: string[] = [String(goal.name)];

    let current: GoalSummary | undefined = goal;
    while (current?.parent_goal_ref_id) {
      const parentGoalRefId = current.parent_goal_ref_id as EntityId;
      if (visited.has(parentGoalRefId)) {
        break;
      }
      visited.add(parentGoalRefId);
      const parent = props.goalsByRefId.get(parentGoalRefId);
      if (!parent) {
        break;
      }
      parts.unshift(String(parent.name));
      current = parent;
    }

    return parts.join(" / ");
  }

  return (
    <>
      {props.mustDoActivities.length > 0 && (
        <>
          <StandardDivider title="Must Do" size="large" />
          <TimePlanTimelineActivityBars
            timePlan={props.timePlan}
            activities={props.mustDoActivities}
            topLevelToday={topLevelInfo.today}
            inboxTasksByRefId={props.targetInboxTasksByRefId}
            bigPlansByRefId={props.targetBigPlansByRefId}
            activityDoneness={props.activityDoneness}
            timeEventsByRefId={props.timeEventsByRefId}
            filterKind={props.selectedKinds}
            filterFeasability={props.selectedFeasabilities}
            filterDoneness={props.selectedDoneness}
          />
        </>
      )}

      {props.aspects.map((aspect) => {
        const aspectActivities = props.otherActivities.filter((activity) => {
          if (isTimePlanActivityInboxTaskTarget(activity.target)) {
            return false;
          }
          if (isTimePlanActivityBigPlanTarget(activity.target)) {
            return (
              props.targetBigPlansByRefId.get(
                entityLinkRefIdFromWire(activity.target),
              )?.aspect_ref_id === aspect.ref_id
            );
          }
          return false;
        });

        if (aspectActivities.length === 0 && !props.showEmptyGroups) {
          return null;
        }

        const fullAspectName = computeAspectHierarchicalNameFromRoot(
          aspect,
          props.aspectsByRefId,
        );

        const aspectGoals = props.goals.filter(
          (g) => g.aspect_ref_id === aspect.ref_id,
        );

        const activitiesByGoalRefId = new Map<EntityId, TimePlanActivity[]>();
        const noGoalActivities: TimePlanActivity[] = [];
        for (const activity of aspectActivities) {
          const goalRefId = goalRefIdForActivity(activity);
          if (!goalRefId) {
            noGoalActivities.push(activity);
            continue;
          }
          const existing = activitiesByGoalRefId.get(goalRefId) ?? [];
          existing.push(activity);
          activitiesByGoalRefId.set(goalRefId, existing);
        }

        return (
          <Fragment key={`aspect-${aspect.ref_id}`}>
            <StandardDivider title={fullAspectName} size="large" />

            {aspectGoals.map((goal) => {
              const goalActivities = activitiesByGoalRefId.get(
                goal.ref_id as EntityId,
              );
              if (
                (!goalActivities || goalActivities.length === 0) &&
                !props.showEmptyGroups
              ) {
                return null;
              }

              return (
                <Fragment key={`aspect-${aspect.ref_id}-goal-${goal.ref_id}`}>
                  <StandardDivider title={fullGoalName(goal)} size="medium" />
                  <TimePlanTimelineActivityBars
                    timePlan={props.timePlan}
                    activities={goalActivities ?? []}
                    topLevelToday={topLevelInfo.today}
                    inboxTasksByRefId={props.targetInboxTasksByRefId}
                    bigPlansByRefId={props.targetBigPlansByRefId}
                    activityDoneness={props.activityDoneness}
                    timeEventsByRefId={props.timeEventsByRefId}
                    filterKind={props.selectedKinds}
                    filterFeasability={props.selectedFeasabilities}
                    filterDoneness={props.selectedDoneness}
                  />
                </Fragment>
              );
            })}

            {(noGoalActivities.length > 0 || props.showEmptyGroups) && (
              <>
                <StandardDivider title="No Goal" size="medium" />
                <TimePlanTimelineActivityBars
                  timePlan={props.timePlan}
                  activities={noGoalActivities}
                  topLevelToday={topLevelInfo.today}
                  inboxTasksByRefId={props.targetInboxTasksByRefId}
                  bigPlansByRefId={props.targetBigPlansByRefId}
                  activityDoneness={props.activityDoneness}
                  timeEventsByRefId={props.timeEventsByRefId}
                  filterKind={props.selectedKinds}
                  filterFeasability={props.selectedFeasabilities}
                  filterDoneness={props.selectedDoneness}
                />
              </>
            )}
          </Fragment>
        );
      })}
    </>
  );
}
