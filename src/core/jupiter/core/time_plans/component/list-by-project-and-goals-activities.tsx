import { Fragment, useContext } from "react";
import type {
  BigPlan,
  EntityId,
  GoalSummary,
  InboxTask,
  ProjectSummary,
  TimeEventInDayBlock,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import { TimePlanActivityTarget } from "@jupiter/webapi-client";

import { computeProjectHierarchicalNameFromRoot } from "#/core/life_plan/sub/aspects/root";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { TimePlanActivityList } from "#/core/time_plans/sub/activity/component/list";

interface TimePlanListByProjectAndGoalsActivitiesProps {
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

export function TimePlanListByProjectAndGoalsActivities(
  props: TimePlanListByProjectAndGoalsActivitiesProps,
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
    throw new Error("Should not get here");
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
            activityDoneness={props.activityDoneness}
            fullInfo
            filterKind={props.selectedKinds}
            filterFeasability={props.selectedFeasabilities}
            filterDoneness={props.selectedDoneness}
            timeEventsByRefId={props.timeEventsByRefId}
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
          throw new Error("Should not get here");
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

                  <TimePlanActivityList
                    topLevelInfo={topLevelInfo}
                    activities={goalActivities}
                    inboxTasksByRefId={props.targetInboxTasksByRefId}
                    timePlansByRefId={new Map()}
                    bigPlansByRefId={props.targetBigPlansByRefId}
                    activityDoneness={props.activityDoneness}
                    fullInfo
                    filterKind={props.selectedKinds}
                    filterFeasability={props.selectedFeasabilities}
                    filterDoneness={props.selectedDoneness}
                    timeEventsByRefId={props.timeEventsByRefId}
                  />
                </Fragment>
              );
            })}

            {noGoalActivities.length > 0 && (
              <>
                <StandardDivider title="No Goal" size="medium" />

                <TimePlanActivityList
                  topLevelInfo={topLevelInfo}
                  activities={noGoalActivities}
                  inboxTasksByRefId={props.targetInboxTasksByRefId}
                  timePlansByRefId={new Map()}
                  bigPlansByRefId={props.targetBigPlansByRefId}
                  activityDoneness={props.activityDoneness}
                  fullInfo
                  filterKind={props.selectedKinds}
                  filterFeasability={props.selectedFeasabilities}
                  filterDoneness={props.selectedDoneness}
                  timeEventsByRefId={props.timeEventsByRefId}
                />
              </>
            )}
          </Fragment>
        );
      })}
    </>
  );
}
