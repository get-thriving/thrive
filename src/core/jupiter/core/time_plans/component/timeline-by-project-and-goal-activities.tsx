import { Fragment, useContext } from "react";
import type {
  BigPlan,
  EntityId,
  GoalSummary,
  InboxTask,
  ProjectSummary,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import { TimePlanActivityTarget } from "@jupiter/webapi-client";

import { computeProjectHierarchicalNameFromRoot } from "#/core/life_plan/sub/aspects/root";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TimePlanTimelineActivityBars } from "#/core/time_plans/sub/activity/component/timeline";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

interface TimePlanTimelineByProjectAndGoalActivitiesProps {
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
  projects: ProjectSummary[];
  projectsByRefId: Map<string, ProjectSummary>;
  goals: GoalSummary[];
  goalsByRefId: Map<EntityId, GoalSummary>;
}

export function TimePlanTimelineByProjectAndGoalActivities(
  props: TimePlanTimelineByProjectAndGoalActivitiesProps,
) {
  const topLevelInfo = useContext(TopLevelInfoContext);

  function goalRefIdForActivity(activity: TimePlanActivity): EntityId | null {
    switch (activity.target) {
      case TimePlanActivityTarget.INBOX_TASK:
        return (
          (props.targetInboxTasksByRefId.get(activity.target_ref_id)
            ?.goal_ref_id as EntityId | null | undefined) ?? null
        );
      case TimePlanActivityTarget.BIG_PLAN:
        return (
          (props.targetBigPlansByRefId.get(activity.target_ref_id)
            ?.goal_ref_id as EntityId | null | undefined) ?? null
        );
    }
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

      {props.projects.map((project) => {
        const projectActivities = props.otherActivities.filter((activity) => {
          switch (activity.target) {
            case TimePlanActivityTarget.INBOX_TASK:
              return (
                props.targetInboxTasksByRefId.get(activity.target_ref_id)
                  ?.project_ref_id === project.ref_id
              );
            case TimePlanActivityTarget.BIG_PLAN:
              return (
                props.targetBigPlansByRefId.get(activity.target_ref_id)
                  ?.project_ref_id === project.ref_id
              );
          }
        });

        if (projectActivities.length === 0) {
          return null;
        }

        const fullProjectName = computeProjectHierarchicalNameFromRoot(
          project,
          props.projectsByRefId,
        );

        const activitiesByGoalRefId = new Map<EntityId, TimePlanActivity[]>();
        const noGoalActivities: TimePlanActivity[] = [];
        for (const activity of projectActivities) {
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
          <Fragment key={`project-${project.ref_id}`}>
            <StandardDivider title={fullProjectName} size="large" />

            {props.goals.map((goal) => {
              const goalActivities = activitiesByGoalRefId.get(
                goal.ref_id as EntityId,
              );
              if (!goalActivities || goalActivities.length === 0) {
                return null;
              }

              return (
                <Fragment key={`project-${project.ref_id}-goal-${goal.ref_id}`}>
                  <StandardDivider title={fullGoalName(goal)} size="medium" />
                  <TimePlanTimelineActivityBars
                    timePlan={props.timePlan}
                    activities={goalActivities}
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

            {noGoalActivities.length > 0 && (
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
