import { Fragment, useContext } from "react";
import type {
  BigPlan,
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

interface TimePlanTimelineByAspectActivitiesProps {
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
  showEmptyGroups?: boolean;
}

export function TimePlanTimelineByAspectActivities(
  props: TimePlanTimelineByAspectActivitiesProps,
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

        return (
          <Fragment key={`aspect-${aspect.ref_id}`}>
            <StandardDivider title={fullAspectName} size="large" />
            <TimePlanTimelineActivityBars
              timePlan={props.timePlan}
              activities={aspectActivities}
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
    </>
  );
}
