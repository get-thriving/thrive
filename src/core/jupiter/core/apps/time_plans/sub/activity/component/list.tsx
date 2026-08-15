import {
  BigPlan,
  BigPlanStats,
  Chore,
  Habit,
  InboxTask,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  TodoTask,
} from "@jupiter/webapi-client";

import {
  entityLinkRefIdFromWire,
  parentLinkNamespaceFromEntityLinkWire,
  BIG_PLAN,
  CHORE,
  HABIT,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { parentActivitiesByTargetRefId } from "#/core/apps/time_plans/sub/activity/group-by-parent";
import { sortTimePlanActivitiesNaturally } from "#/core/apps/time_plans/sub/activity/root";
import { isTimePlanActivityInboxTaskTarget } from "#/core/apps/time_plans/sub/activity/target-wire";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { TimePlanActivityCard } from "#/core/apps/time_plans/sub/activity/component/card";

interface TimePlanActivityListProps {
  topLevelInfo: TopLevelInfo;
  activities: Array<TimePlanActivity>;
  timePlansByRefId: Map<string, TimePlan>;
  inboxTasksByRefId: Map<string, InboxTask>;
  bigPlansByRefId: Map<string, BigPlan>;
  bigPlanStatsByRefId?: Map<string, BigPlanStats>;
  todoTasksByRefId: Map<string, TodoTask>;
  habitsByRefId: Map<string, Habit>;
  choresByRefId: Map<string, Chore>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  timeEventsByRefId: Map<string, Array<TimeEventInDayBlock>>;
  fullInfo: boolean;
  showTimePlanName?: boolean;
  showFeasability?: boolean;
  compact?: boolean;
  filterKind?: TimePlanActivityKind[];
  filterFeasability?: TimePlanActivityFeasability[];
  filterDoneness?: boolean[];
}

export function TimePlanActivityList(props: TimePlanActivityListProps) {
  const sortedActivities = sortTimePlanActivitiesNaturally(
    props.activities,
    props.inboxTasksByRefId,
  );
  const parentActivitiesByRefId = parentActivitiesByTargetRefId(
    props.activities,
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
                ? (() => {
                    if (!isTimePlanActivityInboxTaskTarget(entry.target)) {
                      return 0;
                    }
                    const inboxTask = props.inboxTasksByRefId.get(
                      entityLinkRefIdFromWire(entry.target),
                    );
                    if (!inboxTask) {
                      return 0;
                    }
                    const ownerNamespace =
                      parentLinkNamespaceFromEntityLinkWire(inboxTask.owner);
                    if (
                      ownerNamespace !== BIG_PLAN &&
                      ownerNamespace !== HABIT &&
                      ownerNamespace !== CHORE
                    ) {
                      return 0;
                    }
                    return parentActivitiesByRefId.has(
                      entityLinkRefIdFromWire(inboxTask.owner),
                    )
                      ? 2
                      : 0;
                  })()
                : 0
            }
            fullInfo={props.fullInfo}
            showTimePlanName={props.showTimePlanName}
            showFeasability={props.showFeasability}
            compact={props.compact}
            timePlansByRefId={props.timePlansByRefId}
            inboxTasksByRefId={props.inboxTasksByRefId}
            bigPlansByRefId={props.bigPlansByRefId}
            bigPlanStatsByRefId={props.bigPlanStatsByRefId}
            todoTasksByRefId={props.todoTasksByRefId}
            habitsByRefId={props.habitsByRefId}
            choresByRefId={props.choresByRefId}
            activityDoneness={props.activityDoneness}
            timeEventsByRefId={props.timeEventsByRefId}
          />
        );
      })}
    </EntityStack>
  );
}
