import { Fragment, useContext } from "react";
import type {
  BigPlan,
  BigPlanStats,
  EntityId,
  GoalSummary,
  Habit,
  Chore,
  InboxTask,
  AspectSummary,
  TimeEventInDayBlock,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  TodoTask,
} from "@jupiter/webapi-client";

import { computeAspectHierarchicalNameFromRoot } from "#/core/life_plan/sub/aspects/root";
import {
  filterActivitiesForAspect,
  goalRefIdForActivity as resolveGoalRefIdForActivity,
} from "#/core/time_plans/sub/activity/group-by-parent";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { TimePlanActivityList } from "#/core/time_plans/sub/activity/component/list";

interface TimePlanListByAspectAndGoalsActivitiesProps {
  mustDoActivities: TimePlanActivity[];
  otherActivities: TimePlanActivity[];
  targetInboxTasksByRefId: Map<string, InboxTask>;
  targetBigPlansByRefId: Map<string, BigPlan>;
  bigPlanStatsByRefId?: Map<string, BigPlanStats>;
  targetTodoTasksByRefId: Map<string, TodoTask>;
  targetHabitsByRefId: Map<string, Habit>;
  targetChoresByRefId: Map<string, Chore>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  timeEventsByRefId: Map<string, TimeEventInDayBlock[]>;
  selectedKinds: TimePlanActivityKind[];
  selectedFeasabilities: TimePlanActivityFeasability[];
  selectedDoneness: boolean[];
  compact?: boolean;
  aspects: AspectSummary[];
  aspectsByRefId: Map<string, AspectSummary>;
  goals: GoalSummary[];
  goalsByRefId: Map<EntityId, GoalSummary>;
  showEmptyGroups?: boolean;
}

export function TimePlanListByAspectAndGoalsActivities(
  props: TimePlanListByAspectAndGoalsActivitiesProps,
) {
  const topLevelInfo = useContext(TopLevelInfoContext);
  const groupingMaps = {
    targetInboxTasksByRefId: props.targetInboxTasksByRefId,
    targetBigPlansByRefId: props.targetBigPlansByRefId,
    targetTodoTasksByRefId: props.targetTodoTasksByRefId,
    targetHabitsByRefId: props.targetHabitsByRefId,
    targetChoresByRefId: props.targetChoresByRefId,
  };

  function goalRefIdForActivity(activity: TimePlanActivity): EntityId | null {
    return resolveGoalRefIdForActivity(
      activity,
      props.targetInboxTasksByRefId,
      props.targetBigPlansByRefId,
      props.targetTodoTasksByRefId,
      props.targetHabitsByRefId,
      props.targetChoresByRefId,
    );
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

          <TimePlanActivityList
            topLevelInfo={topLevelInfo}
            activities={props.mustDoActivities}
            inboxTasksByRefId={props.targetInboxTasksByRefId}
            timePlansByRefId={new Map()}
            bigPlansByRefId={props.targetBigPlansByRefId}
            bigPlanStatsByRefId={props.bigPlanStatsByRefId}
            todoTasksByRefId={props.targetTodoTasksByRefId}
            habitsByRefId={props.targetHabitsByRefId}
            choresByRefId={props.targetChoresByRefId}
            activityDoneness={props.activityDoneness}
            fullInfo
            filterKind={props.selectedKinds}
            filterFeasability={props.selectedFeasabilities}
            filterDoneness={props.selectedDoneness}
            timeEventsByRefId={props.timeEventsByRefId}
            showFeasability={false}
            compact={props.compact}
          />
        </>
      )}

      {props.aspects.map((aspect) => {
        const aspectActivities = filterActivitiesForAspect(
          props.otherActivities,
          aspect,
          groupingMaps,
        );

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

                  <TimePlanActivityList
                    topLevelInfo={topLevelInfo}
                    activities={goalActivities ?? []}
                    inboxTasksByRefId={props.targetInboxTasksByRefId}
                    timePlansByRefId={new Map()}
                    bigPlansByRefId={props.targetBigPlansByRefId}
                    bigPlanStatsByRefId={props.bigPlanStatsByRefId}
                    todoTasksByRefId={props.targetTodoTasksByRefId}
                    habitsByRefId={props.targetHabitsByRefId}
                    choresByRefId={props.targetChoresByRefId}
                    activityDoneness={props.activityDoneness}
                    fullInfo
                    filterKind={props.selectedKinds}
                    filterFeasability={props.selectedFeasabilities}
                    filterDoneness={props.selectedDoneness}
                    timeEventsByRefId={props.timeEventsByRefId}
                    showFeasability={false}
                    compact={props.compact}
                  />
                </Fragment>
              );
            })}

            {(noGoalActivities.length > 0 || props.showEmptyGroups) && (
              <>
                <StandardDivider title="No Goal" size="medium" />

                <TimePlanActivityList
                  topLevelInfo={topLevelInfo}
                  activities={noGoalActivities}
                  inboxTasksByRefId={props.targetInboxTasksByRefId}
                  timePlansByRefId={new Map()}
                  bigPlansByRefId={props.targetBigPlansByRefId}
                  bigPlanStatsByRefId={props.bigPlanStatsByRefId}
                  todoTasksByRefId={props.targetTodoTasksByRefId}
                  habitsByRefId={props.targetHabitsByRefId}
                  choresByRefId={props.targetChoresByRefId}
                  activityDoneness={props.activityDoneness}
                  fullInfo
                  filterKind={props.selectedKinds}
                  filterFeasability={props.selectedFeasabilities}
                  filterDoneness={props.selectedDoneness}
                  timeEventsByRefId={props.timeEventsByRefId}
                  showFeasability={false}
                  compact={props.compact}
                />
              </>
            )}
          </Fragment>
        );
      })}
    </>
  );
}
