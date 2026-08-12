import {
  BigPlan,
  Chore,
  Habit,
  InboxTask,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  BigPlanStatus,
  InboxTaskStatus,
  TodoTask,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { Typography } from "@mui/material";

import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { BigPlanStatusTag } from "#/core/big_plans/component/status-tag";
import { InboxTaskStatusTag } from "#/core/common/sub/inbox_tasks/component/status-tag";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { CardCornerChipStack } from "#/core/infra/component/chips";
import { TimePlanActivityFeasabilityTag } from "#/core/time_plans/sub/activity/component/feasability-tag";
import { TimePlanActivityKindTag } from "#/core/time_plans/sub/activity/component/kind-tag";
import { TimePlanActivityTargetTypeChip } from "#/core/time_plans/sub/activity/component/target-type-chip";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { ADateTag } from "#/core/common/component/adate-tag";
import { TimePlanTag } from "#/core/time_plans/component/tag";
import { IsKeyTag } from "#/core/common/component/is-key-tag";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityChoreTarget,
  isTimePlanActivityHabitTarget,
  isTimePlanActivityInboxTaskTarget,
  isTimePlanActivityTodoTaskTarget,
} from "#/core/time_plans/sub/activity/target-wire";
import {
  TODO_TASK,
  HABIT,
  CHORE,
  entityLinkRefIdFromWire,
  parentLinkNamespaceFromEntityLinkWire,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";

interface TimePlanActivityCardProps {
  topLevelInfo: TopLevelInfo;
  activity: TimePlanActivity;
  timePlansByRefId: Map<string, TimePlan>;
  inboxTasksByRefId: Map<string, InboxTask>;
  bigPlansByRefId: Map<string, BigPlan>;
  todoTasksByRefId: Map<string, TodoTask>;
  habitsByRefId: Map<string, Habit>;
  choresByRefId: Map<string, Chore>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  timeEventsByRefId: Map<string, Array<TimeEventInDayBlock>>;
  fullInfo: boolean;
  showTimePlanName?: boolean;
  allowSelect?: boolean;
  selected?: boolean;
  indent?: number;
  onClick?: (activity: TimePlanActivity) => void;
}

export function TimePlanActivityCard(props: TimePlanActivityCardProps) {
  const timePlan = props.timePlansByRefId.get(
    props.activity.time_plan_ref_id.toString(),
  );

  if (isTimePlanActivityInboxTaskTarget(props.activity.target)) {
    const inboxTask = props.inboxTasksByRefId.get(
      entityLinkRefIdFromWire(props.activity.target),
    );
    const targetTimeEvents = inboxTask
      ? (props.timeEventsByRefId.get(`it:${inboxTask.ref_id}`) ?? [])
      : [];
    const activityTimeEvents =
      props.timeEventsByRefId.get(`tpa:${props.activity.ref_id}`) ?? [];
    const timeEvents = [...activityTimeEvents, ...targetTimeEvents];

    return (
      <EntityCard
        entityId={`time-plan-activity-${props.activity.ref_id}`}
        showAsArchived={props.activity.archived}
        allowSelect={props.allowSelect}
        selected={props.selected}
        indent={props.indent}
        onClick={
          props.onClick
            ? () => props.onClick && props.onClick(props.activity)
            : undefined
        }
        backgroundHint={
          props.activityDoneness[props.activity.ref_id] ===
          TimePlanActivityDoneness.DONE
            ? inboxTask?.status === InboxTaskStatus.NOT_DONE
              ? "failure"
              : "success"
            : props.activityDoneness[props.activity.ref_id] ===
                TimePlanActivityDoneness.WORKING
              ? "warning"
              : "neutral"
        }
      >
        {(props.indent ?? 0) === 0 && (
          <CardCornerChipStack>
            <TimePlanActivityTargetTypeChip target={props.activity.target} />
          </CardCornerChipStack>
        )}
        <EntityLink
          to={`/app/workspace/time-plans/${props.activity.time_plan_ref_id}/${props.activity.ref_id}`}
          block={props.onClick !== undefined}
        >
          {inboxTask && <IsKeyTag isKey={inboxTask.is_key} />}
          <Typography
            sx={{
              fontWeight: inboxTask
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter",
            }}
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : inboxTask
                ? inboxTask.name
                : "Archived Task"}
          </Typography>
          {props.fullInfo && (
            <>
              {inboxTask && <InboxTaskStatusTag status={inboxTask.status} />}
              {inboxTask?.due_date && (
                <ADateTag label="Due At" date={inboxTask.due_date} />
              )}

              {timeEvents.length > 0 && (
                <>
                  📅 {timeEvents.length} scheduled event
                  {timeEvents.length > 1 ? "s" : ""}
                </>
              )}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          <TimePlanActivityFeasabilityTag
            feasability={props.activity.feasability}
          />

          {timePlan && <TimePlanTag timePlan={timePlan} />}
        </EntityLink>
      </EntityCard>
    );
  } else if (
    isTimePlanActivityTodoTaskTarget(props.activity.target) &&
    isWorkspaceFeatureAvailable(
      props.topLevelInfo.workspace,
      WorkspaceFeature.TODO_TASK,
    )
  ) {
    const todoTask = props.todoTasksByRefId.get(
      entityLinkRefIdFromWire(props.activity.target),
    );
    const ownedInboxTask = [...props.inboxTasksByRefId.values()].find(
      (inboxTask) =>
        parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) === TODO_TASK &&
        entityLinkRefIdFromWire(inboxTask.owner) ===
          entityLinkRefIdFromWire(props.activity.target),
    );
    const targetTimeEvents = ownedInboxTask
      ? (props.timeEventsByRefId.get(`it:${ownedInboxTask.ref_id}`) ?? [])
      : [];
    const activityTimeEvents =
      props.timeEventsByRefId.get(`tpa:${props.activity.ref_id}`) ?? [];
    const timeEvents = [...activityTimeEvents, ...targetTimeEvents];
    return (
      <EntityCard
        entityId={`time-plan-activity-${props.activity.ref_id}`}
        allowSelect={props.allowSelect}
        selected={props.selected}
        onClick={
          props.onClick
            ? () => props.onClick && props.onClick(props.activity)
            : undefined
        }
        backgroundHint={
          props.activityDoneness[props.activity.ref_id] ===
          TimePlanActivityDoneness.DONE
            ? ownedInboxTask?.status === InboxTaskStatus.NOT_DONE
              ? "failure"
              : "success"
            : props.activityDoneness[props.activity.ref_id] ===
                TimePlanActivityDoneness.WORKING
              ? "warning"
              : "neutral"
        }
      >
        <CardCornerChipStack>
          <TimePlanActivityTargetTypeChip target={props.activity.target} />
        </CardCornerChipStack>
        <EntityLink
          to={`/app/workspace/time-plans/${props.activity.time_plan_ref_id}/${props.activity.ref_id}`}
          block={props.onClick !== undefined}
        >
          {ownedInboxTask && <IsKeyTag isKey={ownedInboxTask.is_key} />}
          <Typography
            sx={{
              fontWeight: todoTask
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter",
            }}
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : todoTask
                ? todoTask.name
                : "Archived Todo"}
          </Typography>

          {props.fullInfo && (
            <>
              {ownedInboxTask && (
                <InboxTaskStatusTag status={ownedInboxTask.status} />
              )}
              {ownedInboxTask?.due_date && (
                <ADateTag label="Due At" date={ownedInboxTask.due_date} />
              )}

              {timeEvents.length > 0 && (
                <>
                  📅 {timeEvents.length} scheduled event
                  {timeEvents.length > 1 ? "s" : ""}
                </>
              )}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          <TimePlanActivityFeasabilityTag
            feasability={props.activity.feasability}
          />

          {timePlan && <TimePlanTag timePlan={timePlan} />}
        </EntityLink>
      </EntityCard>
    );
  } else if (
    isTimePlanActivityHabitTarget(props.activity.target) &&
    isWorkspaceFeatureAvailable(
      props.topLevelInfo.workspace,
      WorkspaceFeature.HABITS,
    )
  ) {
    const habit = props.habitsByRefId.get(
      entityLinkRefIdFromWire(props.activity.target),
    );
    const ownedInboxTask = [...props.inboxTasksByRefId.values()].find(
      (inboxTask) =>
        parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) === HABIT &&
        entityLinkRefIdFromWire(inboxTask.owner) ===
          entityLinkRefIdFromWire(props.activity.target),
    );
    const targetTimeEvents = ownedInboxTask
      ? (props.timeEventsByRefId.get(`it:${ownedInboxTask.ref_id}`) ?? [])
      : [];
    const activityTimeEvents =
      props.timeEventsByRefId.get(`tpa:${props.activity.ref_id}`) ?? [];
    const timeEvents = [...activityTimeEvents, ...targetTimeEvents];
    return (
      <EntityCard
        entityId={`time-plan-activity-${props.activity.ref_id}`}
        allowSelect={props.allowSelect}
        selected={props.selected}
        onClick={
          props.onClick
            ? () => props.onClick && props.onClick(props.activity)
            : undefined
        }
        backgroundHint={
          props.activityDoneness[props.activity.ref_id] ===
          TimePlanActivityDoneness.DONE
            ? "success"
            : props.activityDoneness[props.activity.ref_id] ===
                TimePlanActivityDoneness.WORKING
              ? "warning"
              : "neutral"
        }
      >
        <CardCornerChipStack>
          <TimePlanActivityTargetTypeChip target={props.activity.target} />
        </CardCornerChipStack>
        <EntityLink
          to={`/app/workspace/time-plans/${props.activity.time_plan_ref_id}/${props.activity.ref_id}`}
          block={props.onClick !== undefined}
        >
          {habit && <IsKeyTag isKey={habit.is_key} />}
          <Typography
            sx={{
              fontWeight: habit
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter",
            }}
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : habit
                ? habit.name
                : "Archived Habit"}
          </Typography>

          {props.fullInfo && timeEvents.length > 0 && (
            <>
              📅 {timeEvents.length} scheduled event
              {timeEvents.length > 1 ? "s" : ""}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          <TimePlanActivityFeasabilityTag
            feasability={props.activity.feasability}
          />

          {timePlan && <TimePlanTag timePlan={timePlan} />}
        </EntityLink>
      </EntityCard>
    );
  } else if (
    isTimePlanActivityChoreTarget(props.activity.target) &&
    isWorkspaceFeatureAvailable(
      props.topLevelInfo.workspace,
      WorkspaceFeature.CHORES,
    )
  ) {
    const chore = props.choresByRefId.get(
      entityLinkRefIdFromWire(props.activity.target),
    );
    const ownedInboxTask = [...props.inboxTasksByRefId.values()].find(
      (inboxTask) =>
        parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) === CHORE &&
        entityLinkRefIdFromWire(inboxTask.owner) ===
          entityLinkRefIdFromWire(props.activity.target),
    );
    const targetTimeEvents = ownedInboxTask
      ? (props.timeEventsByRefId.get(`it:${ownedInboxTask.ref_id}`) ?? [])
      : [];
    const activityTimeEvents =
      props.timeEventsByRefId.get(`tpa:${props.activity.ref_id}`) ?? [];
    const timeEvents = [...activityTimeEvents, ...targetTimeEvents];
    return (
      <EntityCard
        entityId={`time-plan-activity-${props.activity.ref_id}`}
        allowSelect={props.allowSelect}
        selected={props.selected}
        onClick={
          props.onClick
            ? () => props.onClick && props.onClick(props.activity)
            : undefined
        }
        backgroundHint={
          props.activityDoneness[props.activity.ref_id] ===
          TimePlanActivityDoneness.DONE
            ? ownedInboxTask?.status === InboxTaskStatus.NOT_DONE
              ? "failure"
              : "success"
            : props.activityDoneness[props.activity.ref_id] ===
                TimePlanActivityDoneness.WORKING
              ? "warning"
              : "neutral"
        }
      >
        <CardCornerChipStack>
          <TimePlanActivityTargetTypeChip target={props.activity.target} />
        </CardCornerChipStack>
        <EntityLink
          to={`/app/workspace/time-plans/${props.activity.time_plan_ref_id}/${props.activity.ref_id}`}
          block={props.onClick !== undefined}
        >
          {ownedInboxTask && <IsKeyTag isKey={ownedInboxTask.is_key} />}
          <Typography
            sx={{
              fontWeight: chore
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter",
            }}
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : chore
                ? chore.name
                : "Archived Chore"}
          </Typography>

          {props.fullInfo && (
            <>
              {ownedInboxTask && (
                <InboxTaskStatusTag status={ownedInboxTask.status} />
              )}
              {ownedInboxTask?.due_date && (
                <ADateTag label="Due At" date={ownedInboxTask.due_date} />
              )}

              {timeEvents.length > 0 && (
                <>
                  📅 {timeEvents.length} scheduled event
                  {timeEvents.length > 1 ? "s" : ""}
                </>
              )}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          <TimePlanActivityFeasabilityTag
            feasability={props.activity.feasability}
          />

          {timePlan && <TimePlanTag timePlan={timePlan} />}
        </EntityLink>
      </EntityCard>
    );
  } else if (
    isTimePlanActivityBigPlanTarget(props.activity.target) &&
    isWorkspaceFeatureAvailable(
      props.topLevelInfo.workspace,
      WorkspaceFeature.BIG_PLANS,
    )
  ) {
    const bigPlan = props.bigPlansByRefId.get(
      entityLinkRefIdFromWire(props.activity.target),
    );
    const targetTimeEvents = bigPlan
      ? (props.timeEventsByRefId.get(`bp:${bigPlan.ref_id}`) ?? [])
      : [];
    const activityTimeEvents =
      props.timeEventsByRefId.get(`tpa:${props.activity.ref_id}`) ?? [];
    const timeEvents = [...activityTimeEvents, ...targetTimeEvents];
    return (
      <EntityCard
        entityId={`time-plan-activity-${props.activity.ref_id}`}
        allowSelect={props.allowSelect}
        selected={props.selected}
        onClick={
          props.onClick
            ? () => props.onClick && props.onClick(props.activity)
            : undefined
        }
        backgroundHint={
          props.activityDoneness[props.activity.ref_id] ===
          TimePlanActivityDoneness.DONE
            ? bigPlan?.status === BigPlanStatus.NOT_DONE
              ? "failure"
              : "success"
            : props.activityDoneness[props.activity.ref_id] ===
                TimePlanActivityDoneness.WORKING
              ? "warning"
              : "neutral"
        }
      >
        <CardCornerChipStack>
          <TimePlanActivityTargetTypeChip target={props.activity.target} />
        </CardCornerChipStack>
        <EntityLink
          to={`/app/workspace/time-plans/${props.activity.time_plan_ref_id}/${props.activity.ref_id}`}
          block={props.onClick !== undefined}
        >
          {bigPlan && <IsKeyTag isKey={bigPlan.is_key} />}
          <Typography
            sx={{
              fontWeight: bigPlan
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter",
            }}
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : bigPlan
                ? bigPlan.name
                : "Archived Big Plan"}
          </Typography>

          {props.fullInfo && (
            <>
              {bigPlan && <BigPlanStatusTag status={bigPlan.status} />}
              {bigPlan?.due_date && (
                <ADateTag label="Due At" date={bigPlan.due_date} />
              )}

              {timeEvents.length > 0 && (
                <>
                  📅 {timeEvents.length} scheduled event
                  {timeEvents.length > 1 ? "s" : ""}
                </>
              )}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          <TimePlanActivityFeasabilityTag
            feasability={props.activity.feasability}
          />

          {timePlan && <TimePlanTag timePlan={timePlan} />}
        </EntityLink>
      </EntityCard>
    );
  } else {
    return <></>;
  }
}
