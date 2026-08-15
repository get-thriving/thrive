import { Fragment, useContext } from "react";
import type {
  BigPlan,
  BigPlanStats,
  Habit,
  Chore,
  InboxTask,
  AspectSummary,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  TodoTask,
} from "@jupiter/webapi-client";

import { computeAspectHierarchicalNameFromRoot } from "#/core/apps/life_plan/sub/aspects/root";
import { filterActivitiesForAspect } from "#/core/apps/time_plans/sub/activity/group-by-parent";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TimePlanTimelineActivityBars } from "#/core/apps/time_plans/sub/activity/component/timeline";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

interface TimePlanTimelineByAspectActivitiesProps {
  timePlan: TimePlan;
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
  aspects: AspectSummary[];
  aspectsByRefId: Map<string, AspectSummary>;
  showEmptyGroups?: boolean;
}

export function TimePlanTimelineByAspectActivities(
  props: TimePlanTimelineByAspectActivitiesProps,
) {
  const topLevelInfo = useContext(TopLevelInfoContext);
  const groupingMaps = {
    targetInboxTasksByRefId: props.targetInboxTasksByRefId,
    targetBigPlansByRefId: props.targetBigPlansByRefId,
    targetTodoTasksByRefId: props.targetTodoTasksByRefId,
    targetHabitsByRefId: props.targetHabitsByRefId,
    targetChoresByRefId: props.targetChoresByRefId,
  };

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
            bigPlanStatsByRefId={props.bigPlanStatsByRefId}
            todoTasksByRefId={props.targetTodoTasksByRefId}
            habitsByRefId={props.targetHabitsByRefId}
            choresByRefId={props.targetChoresByRefId}
            activityDoneness={props.activityDoneness}
            timeEventsByRefId={props.timeEventsByRefId}
            filterKind={props.selectedKinds}
            filterFeasability={props.selectedFeasabilities}
            filterDoneness={props.selectedDoneness}
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

        return (
          <Fragment key={`aspect-${aspect.ref_id}`}>
            <StandardDivider title={fullAspectName} size="large" />
            <TimePlanTimelineActivityBars
              timePlan={props.timePlan}
              activities={aspectActivities}
              topLevelToday={topLevelInfo.today}
              inboxTasksByRefId={props.targetInboxTasksByRefId}
              bigPlansByRefId={props.targetBigPlansByRefId}
              bigPlanStatsByRefId={props.bigPlanStatsByRefId}
              todoTasksByRefId={props.targetTodoTasksByRefId}
              habitsByRefId={props.targetHabitsByRefId}
              choresByRefId={props.targetChoresByRefId}
              activityDoneness={props.activityDoneness}
              timeEventsByRefId={props.timeEventsByRefId}
              filterKind={props.selectedKinds}
              filterFeasability={props.selectedFeasabilities}
              filterDoneness={props.selectedDoneness}
            />
          </Fragment>
        );
      })}
    </>
  );
}
