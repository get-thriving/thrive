import {
  BigPlan,
  InboxTask,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  InboxTaskNamespace,
  TimePlanActivityTarget,
} from "@jupiter/webapi-client";

import { sortTimePlanActivitiesNaturally } from "#/core/time_plans/sub/activity/root";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { TimePlanActivityCard } from "#/core/time_plans/sub/activity/component/card";

interface TimePlanActivityListProps {
  topLevelInfo: TopLevelInfo;
  activities: Array<TimePlanActivity>;
  timePlansByRefId: Map<string, TimePlan>;
  inboxTasksByRefId: Map<string, InboxTask>;
  bigPlansByRefId: Map<string, BigPlan>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  timeEventsByRefId: Map<string, Array<TimeEventInDayBlock>>;
  fullInfo: boolean;
  showTimePlanName?: boolean;
  filterKind?: TimePlanActivityKind[];
  filterFeasability?: TimePlanActivityFeasability[];
  filterDoneness?: boolean[];
}

export function TimePlanActivityList(props: TimePlanActivityListProps) {
  const sortedActivities = sortTimePlanActivitiesNaturally(
    props.activities,
    props.inboxTasksByRefId,
  );

  return (
    <EntityStack>
      {sortedActivities.map((entry) => {
        if (
          props.filterKind &&
          props.filterKind.length > 0 &&
          !props.filterKind.includes(entry.kind)
        ) {
          return null;
        }

        if (
          props.filterFeasability &&
          props.filterFeasability.length > 0 &&
          !props.filterFeasability.includes(entry.feasability)
        ) {
          return null;
        }

        if (
          props.filterDoneness &&
          props.filterDoneness.length > 0 &&
          !props.filterDoneness.includes(
            props.activityDoneness[entry.ref_id] ===
              TimePlanActivityDoneness.DONE,
          )
        ) {
          return null;
        }

        return (
          <TimePlanActivityCard
            key={`time-plan-activity-${entry.ref_id}`}
            topLevelInfo={props.topLevelInfo}
            activity={entry}
            indent={
              props.fullInfo
                ? entry.target === TimePlanActivityTarget.INBOX_TASK &&
                  props.inboxTasksByRefId.get(entry.target_ref_id)
                    ?.namespace === InboxTaskNamespace.BIG_PLAN
                  ? 2
                  : 0
                : 0
            }
            fullInfo={props.fullInfo}
            showTimePlanName={props.showTimePlanName}
            timePlansByRefId={props.timePlansByRefId}
            inboxTasksByRefId={props.inboxTasksByRefId}
            bigPlansByRefId={props.bigPlansByRefId}
            activityDoneness={props.activityDoneness}
            timeEventsByRefId={props.timeEventsByRefId}
          />
        );
      })}
    </EntityStack>
  );
}
