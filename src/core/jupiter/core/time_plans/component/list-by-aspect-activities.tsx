import { Fragment, useContext } from "react";
import type {
  TimePlanActivity,
  TimePlanActivityKind,
  TimePlanActivityFeasability,
  TimePlanActivityDoneness,
  InboxTask,
  BigPlan,
  TimeEventInDayBlock,
  AspectSummary,
} from "@jupiter/webapi-client";

import { entityLinkRefIdFromWire } from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { computeAspectHierarchicalNameFromRoot } from "#/core/life_plan/sub/aspects/root";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityInboxTaskTarget,
} from "#/core/time_plans/sub/activity/target-wire";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TimePlanActivityList } from "#/core/time_plans/sub/activity/component/list";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

interface TimePlanListByAspectActivitiesProps {
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

export function TimePlanListByAspectActivities(
  props: TimePlanListByAspectActivitiesProps,
) {
  const topLevelInfo = useContext(TopLevelInfoContext);

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
          throw new Error("Should not get here");
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

            <TimePlanActivityList
              topLevelInfo={topLevelInfo}
              activities={aspectActivities}
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
    </>
  );
}
