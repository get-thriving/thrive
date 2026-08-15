import type { EntityLink } from "@jupiter/webapi-client";

import { CornerChip } from "#/core/infra/component/chips";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityChoreTarget,
  isTimePlanActivityHabitTarget,
  isTimePlanActivityInboxTaskTarget,
  isTimePlanActivityTodoTaskTarget,
} from "#/core/apps/time_plans/sub/activity/target-wire";

interface TimePlanActivityTargetTypeChipProps {
  target: EntityLink;
}

export function TimePlanActivityTargetTypeChip(
  props: TimePlanActivityTargetTypeChipProps,
) {
  return (
    <CornerChip
      label={targetTypeName(props.target)}
      color={targetTypeToColor(props.target)}
    />
  );
}

function targetTypeName(target: EntityLink): string {
  if (isTimePlanActivityTodoTaskTarget(target)) {
    return "Todo";
  }
  if (isTimePlanActivityHabitTarget(target)) {
    return "Habit";
  }
  if (isTimePlanActivityChoreTarget(target)) {
    return "Chore";
  }
  if (isTimePlanActivityBigPlanTarget(target)) {
    return "Big Plan";
  }
  if (isTimePlanActivityInboxTaskTarget(target)) {
    return "Task";
  }
  return "Activity";
}

function targetTypeToColor(
  target: EntityLink,
): "info" | "warning" | "success" | "default" {
  if (isTimePlanActivityTodoTaskTarget(target)) {
    return "info";
  }
  if (isTimePlanActivityHabitTarget(target)) {
    return "warning";
  }
  if (isTimePlanActivityChoreTarget(target)) {
    return "warning";
  }
  if (isTimePlanActivityBigPlanTarget(target)) {
    return "success";
  }
  if (isTimePlanActivityInboxTaskTarget(target)) {
    return "info";
  }
  return "default";
}
