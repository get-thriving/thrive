import { useContext } from "react";
import type {
  BigPlan,
  InboxTask,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";

import { TimePlanTimelineActivityBars } from "#/core/time_plans/sub/activity/component/timeline";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

interface TimePlanTimelineMergedActivitiesProps {
  timePlan: TimePlan;
  mustDoActivities: TimePlanActivity[];
  niceToHaveActivities: TimePlanActivity[];
  stretchActivities: TimePlanActivity[];
  targetInboxTasksByRefId: Map<string, InboxTask>;
  targetBigPlansByRefId: Map<string, BigPlan>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  timeEventsByRefId: Map<string, TimeEventInDayBlock[]>;
  selectedKinds: TimePlanActivityKind[];
  selectedFeasabilities: TimePlanActivityFeasability[];
  selectedDoneness: boolean[];
}

export function TimePlanTimelineMergedActivities(
  props: TimePlanTimelineMergedActivitiesProps,
) {
  const topLevelInfo = useContext(TopLevelInfoContext);

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

      {props.niceToHaveActivities.length > 0 && (
        <>
          <StandardDivider title="Nice To Have" size="large" />
          <TimePlanTimelineActivityBars
            timePlan={props.timePlan}
            activities={props.niceToHaveActivities}
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

      {props.stretchActivities.length > 0 && (
        <>
          <StandardDivider title="Stretch" size="large" />
          <TimePlanTimelineActivityBars
            timePlan={props.timePlan}
            activities={props.stretchActivities}
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
    </>
  );
}
