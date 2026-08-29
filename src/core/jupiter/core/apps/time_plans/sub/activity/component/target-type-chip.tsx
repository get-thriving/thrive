import type { EntityLink } from "@jupiter/webapi-client";

import { CornerChip } from "#/core/infra/component/chips";
import {
  isTimePlanActivityProjectTarget,
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
      label={targetTypeIcon(props.target)}
      title={targetTypeName(props.target)}
      color={targetTypeToColor(props.target)}
      sx={{
        minWidth: "unset",
        width: "1.5rem",
        paddingLeft: 0,
        paddingRight: 0,
        "& .MuiChip-label": {
          paddingLeft: "0.15rem",
          paddingRight: "0.15rem",
        },
      }}
    />
  );
}

function targetTypeIcon(target: EntityLink): string {
  if (isTimePlanActivityTodoTaskTarget(target)) {
    return "📝";
  }
  if (isTimePlanActivityHabitTarget(target)) {
    return "🔄";
  }
  if (isTimePlanActivityChoreTarget(target)) {
    return "🧹";
  }
  if (isTimePlanActivityProjectTarget(target)) {
    return "🎯";
  }
  if (isTimePlanActivityInboxTaskTarget(target)) {
    return "📥";
  }
  return "📋";
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
  if (isTimePlanActivityProjectTarget(target)) {
    return "Project";
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
  if (isTimePlanActivityProjectTarget(target)) {
    return "success";
  }
  if (isTimePlanActivityInboxTaskTarget(target)) {
    return "info";
  }
  return "default";
}
