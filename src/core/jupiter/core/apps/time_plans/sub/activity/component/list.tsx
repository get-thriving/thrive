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
import { Fragment, useCallback, useState } from "react";

import {
  entityLinkRefIdFromWire,
  parentLinkNamespaceFromEntityLinkWire,
  BIG_PLAN,
  CHORE,
  HABIT,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { parentActivitiesByTargetRefId } from "#/core/apps/time_plans/sub/activity/group-by-parent";
import {
  habitAndChoreChildActivitiesByParentTarget,
  habitOrChoreParentTargetForInboxTaskActivity,
} from "#/core/apps/time_plans/sub/activity/habit-chore-group";
import { sortTimePlanActivitiesNaturally } from "#/core/apps/time_plans/sub/activity/root";
import {
  isTimePlanActivityChoreTarget,
  isTimePlanActivityHabitTarget,
  isTimePlanActivityInboxTaskTarget,
} from "#/core/apps/time_plans/sub/activity/target-wire";
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
  const habitChoreChildrenByParent = habitAndChoreChildActivitiesByParentTarget(
    props.activities,
    props.inboxTasksByRefId,
    parentActivitiesByRefId,
  );
  const [expandedParentRefIds, setExpandedParentRefIds] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleExpanded = useCallback((activityRefId: string) => {
    setExpandedParentRefIds((current) => {
      const next = new Set(current);
      if (next.has(activityRefId)) {
        next.delete(activityRefId);
      } else {
        next.add(activityRefId);
      }
      return next;
    });
  }, []);

  const visibleHabitChoreParentTargets = new Set(
    sortedActivities
      .filter(
        (activity) =>
          activityPassesFilters(activity, props) &&
          (isTimePlanActivityHabitTarget(activity.target) ||
            isTimePlanActivityChoreTarget(activity.target)),
      )
      .map((activity) => activity.target),
  );

  return (
    <EntityStack>
      {sortedActivities.map((entry) => {
        if (!activityPassesFilters(entry, props)) {
          return null;
        }

        const parentTarget = habitOrChoreParentTargetForInboxTaskActivity(
          entry,
          props.inboxTasksByRefId,
        );
        if (
          parentTarget !== undefined &&
          visibleHabitChoreParentTargets.has(parentTarget)
        ) {
          return null;
        }

        const associatedInboxTaskActivities =
          isTimePlanActivityHabitTarget(entry.target) ||
          isTimePlanActivityChoreTarget(entry.target)
            ? (habitChoreChildrenByParent.get(entry.target) ?? [])
            : [];
        const expanded = expandedParentRefIds.has(entry.ref_id);

        return (
          <Fragment key={`time-plan-activity-${entry.ref_id}`}>
            <TimePlanActivityCard
              topLevelInfo={props.topLevelInfo}
              activity={entry}
              indent={indentForActivity(
                entry,
                props.inboxTasksByRefId,
                parentActivitiesByRefId,
                props.fullInfo,
              )}
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
              associatedInboxTaskActivities={associatedInboxTaskActivities}
              expanded={expanded}
              onToggleExpand={
                associatedInboxTaskActivities.length > 0
                  ? () => toggleExpanded(entry.ref_id)
                  : undefined
              }
            />
            {expanded &&
              associatedInboxTaskActivities.map((child) => (
                <TimePlanActivityCard
                  key={`time-plan-activity-${child.ref_id}`}
                  topLevelInfo={props.topLevelInfo}
                  activity={child}
                  indent={2}
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
              ))}
          </Fragment>
        );
      })}
    </EntityStack>
  );
}

function activityPassesFilters(
  entry: TimePlanActivity,
  props: TimePlanActivityListProps,
): boolean {
  if (
    props.filterKind &&
    props.filterKind.length > 0 &&
    !props.filterKind.includes(entry.kind)
  ) {
    return false;
  }

  if (
    props.filterFeasability &&
    props.filterFeasability.length > 0 &&
    !props.filterFeasability.includes(entry.feasability)
  ) {
    return false;
  }

  if (
    props.filterDoneness &&
    props.filterDoneness.length > 0 &&
    !props.filterDoneness.includes(
      props.activityDoneness[entry.ref_id] === TimePlanActivityDoneness.DONE,
    )
  ) {
    return false;
  }

  return true;
}

function indentForActivity(
  entry: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
  parentActivitiesByRefId: Map<string, TimePlanActivity>,
  fullInfo: boolean,
): number {
  if (!fullInfo) {
    return 0;
  }
  if (!isTimePlanActivityInboxTaskTarget(entry.target)) {
    return 0;
  }
  const inboxTask = inboxTasksByRefId.get(
    entityLinkRefIdFromWire(entry.target),
  );
  if (!inboxTask) {
    return 0;
  }
  const ownerNamespace = parentLinkNamespaceFromEntityLinkWire(inboxTask.owner);
  if (
    ownerNamespace !== BIG_PLAN &&
    ownerNamespace !== HABIT &&
    ownerNamespace !== CHORE
  ) {
    return 0;
  }
  return parentActivitiesByRefId.has(inboxTask.owner) ? 2 : 0;
}
