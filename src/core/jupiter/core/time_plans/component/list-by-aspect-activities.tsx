import { Fragment, useContext } from "react";
import type {
  TimePlanActivity,
  TimePlanActivityKind,
  TimePlanActivityFeasability,
  TimePlanActivityDoneness,
  InboxTask,
  BigPlan,
  BigPlanStats,
  Habit,
  Chore,
  TodoTask,
  TimeEventInDayBlock,
  AspectSummary,
} from "@jupiter/webapi-client";

import { computeAspectHierarchicalNameFromRoot } from "#/core/life_plan/sub/aspects/root";
import { filterActivitiesForAspect } from "#/core/time_plans/sub/activity/group-by-parent";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TimePlanActivityList } from "#/core/time_plans/sub/activity/component/list";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

interface TimePlanListByAspectActivitiesProps {
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
  showEmptyGroups?: boolean;
}

export function TimePlanListByAspectActivities(
  props: TimePlanListByAspectActivitiesProps,
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

        return (
          <Fragment key={`aspect-${aspect.ref_id}`}>
            <StandardDivider title={fullAspectName} size="large" />

            <TimePlanActivityList
              topLevelInfo={topLevelInfo}
              activities={aspectActivities}
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
    </>
  );
}
