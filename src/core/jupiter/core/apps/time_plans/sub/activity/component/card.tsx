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
  BigPlanStatus,
  InboxTaskStatus,
  TodoTask,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useSearchParams } from "@remix-run/react";

import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { bigPlanDonePct } from "#/core/apps/big_plans/root";
import { BigPlanDonePctTag } from "#/core/apps/big_plans/component/done-pct-tag";
import { BigPlanStatusTag } from "#/core/apps/big_plans/component/status-tag";
import { InboxTaskStatusTag } from "#/core/common/sub/inbox_tasks/component/status-tag";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { useCalendarPlaceActivity } from "#/core/calendar/component/event-drag";
import { CardCornerChipStack } from "#/core/infra/component/chips";
import { TimePlanActivityFeasabilityTag } from "#/core/apps/time_plans/sub/activity/component/feasability-tag";
import { TimePlanActivityKindTag } from "#/core/apps/time_plans/sub/activity/component/kind-tag";
import { TimePlanActivityTargetTypeChip } from "#/core/apps/time_plans/sub/activity/component/target-type-chip";
import { inferDurationMinsForTimePlanActivity } from "#/core/apps/time_plans/sub/activity/root";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityChoreTarget,
  isTimePlanActivityHabitTarget,
  isTimePlanActivityInboxTaskTarget,
  isTimePlanActivityTodoTaskTarget,
} from "#/core/apps/time_plans/sub/activity/target-wire";
import {
  TODO_TASK,
  HABIT,
  CHORE,
  entityLinkRefIdFromWire,
  parentLinkNamespaceFromEntityLinkWire,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { ADateTag } from "#/core/common/component/adate-tag";
import { TimePlanTag } from "#/core/apps/time_plans/component/tag";
import { withTimePlanView } from "#/core/apps/time_plans/view-mode";
import { IsKeyTag } from "#/core/common/component/is-key-tag";

interface TimePlanActivityCardProps {
  topLevelInfo: TopLevelInfo;
  activity: TimePlanActivity;
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
  // Off where the cards are already grouped by how feasible they are, since
  // the chip would only say again what the group they sit in says.
  showFeasability?: boolean;
  // For the narrow column the calendar view puts these in: scheduled events
  // are marked with an emoji rather than a count.
  compact?: boolean;
  allowSelect?: boolean;
  selected?: boolean;
  indent?: number;
  onClick?: (activity: TimePlanActivity) => void;
}

export function TimePlanActivityCard(props: TimePlanActivityCardProps) {
  const place = useCalendarPlaceActivity({
    activityRefId: props.activity.ref_id,
    timePlanRefId: props.activity.time_plan_ref_id,
    archived: props.activity.archived,
    durationMins: inferDurationMinsForTimePlanActivity(
      props.activity,
      props.inboxTasksByRefId,
      props.bigPlansByRefId,
      props.habitsByRefId,
      props.choresByRefId,
    ),
  });

  // Top-level todos, big plans, habits, chores, and inbox tasks show a
  // corner chip that names the type. Nested inbox tasks do not.
  const showTargetTypeChip = (props.indent ?? 0) === 0;

  return (
    <Box
      onPointerDownCapture={place.handleProps.onPointerDown}
      onClickCapture={place.handleProps.onClickCapture}
      style={place.handleProps.style}
      sx={{
        width: "100%",
        minWidth: 0,
        "& a": { WebkitUserDrag: "none" },
        ...(props.compact
          ? {
              // The calendar column is narrow, so names and padding stay
              // smaller than the list view or they crowd out the plan.
              "& .MuiCardContent-root > a, & .MuiCardContent-root > span": {
                paddingTop: "0.35rem",
                paddingRight: "0.5rem",
                paddingBottom: "0.35rem",
                // The type chip sits in the top-left corner, so the name
                // starts after it rather than running underneath.
                paddingLeft: showTargetTypeChip ? "5rem" : "0.5rem",
                gap: "0.25rem",
              },
            }
          : {}),
      }}
    >
      <TimePlanActivityCardBody {...props} />
    </Box>
  );
}

function TimePlanActivityCardBody(props: TimePlanActivityCardProps) {
  const [query] = useSearchParams();
  const timePlanView = query;
  const activityLocation = withTimePlanView(
    `/app/workspace/apps/time-plans/${props.activity.time_plan_ref_id}/${props.activity.ref_id}`,
    timePlanView,
  );

  const showFeasability = props.showFeasability ?? true;

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
        <EntityLink to={activityLocation} block={props.onClick !== undefined}>
          <ActivityCardName
            isKey={inboxTask?.is_key ?? false}
            compact={props.compact}
            fontWeight={
              inboxTask
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter"
            }
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : inboxTask
                ? inboxTask.name
                : "Archived Task"}
          </ActivityCardName>
          {props.fullInfo && (
            <>
              {inboxTask && <InboxTaskStatusTag status={inboxTask.status} />}
              {inboxTask?.due_date && (
                <ADateTag label="Due At" date={inboxTask.due_date} />
              )}

              {timeEvents.length > 0 &&
                (props.compact ? (
                  <>📅</>
                ) : (
                  <>
                    📅 {timeEvents.length} scheduled event
                    {timeEvents.length > 1 ? "s" : ""}
                  </>
                ))}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          {showFeasability && (
            <TimePlanActivityFeasabilityTag
              feasability={props.activity.feasability}
            />
          )}

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
        <EntityLink to={activityLocation} block={props.onClick !== undefined}>
          <ActivityCardName
            isKey={ownedInboxTask?.is_key ?? false}
            compact={props.compact}
            fontWeight={
              todoTask
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter"
            }
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : todoTask
                ? todoTask.name
                : "Archived Todo"}
          </ActivityCardName>

          {props.fullInfo && (
            <>
              {ownedInboxTask && (
                <InboxTaskStatusTag status={ownedInboxTask.status} />
              )}
              {ownedInboxTask?.due_date && (
                <ADateTag label="Due At" date={ownedInboxTask.due_date} />
              )}

              {timeEvents.length > 0 &&
                (props.compact ? (
                  <>📅</>
                ) : (
                  <>
                    📅 {timeEvents.length} scheduled event
                    {timeEvents.length > 1 ? "s" : ""}
                  </>
                ))}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          {showFeasability && (
            <TimePlanActivityFeasabilityTag
              feasability={props.activity.feasability}
            />
          )}

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
        <EntityLink to={activityLocation} block={props.onClick !== undefined}>
          <ActivityCardName
            isKey={habit?.is_key ?? false}
            compact={props.compact}
            fontWeight={
              habit
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter"
            }
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : habit
                ? habit.name
                : "Archived Habit"}
          </ActivityCardName>

          {props.fullInfo &&
            timeEvents.length > 0 &&
            (props.compact ? (
              <>📅</>
            ) : (
              <>
                📅 {timeEvents.length} scheduled event
                {timeEvents.length > 1 ? "s" : ""}
              </>
            ))}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          {showFeasability && (
            <TimePlanActivityFeasabilityTag
              feasability={props.activity.feasability}
            />
          )}

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
        <EntityLink to={activityLocation} block={props.onClick !== undefined}>
          <ActivityCardName
            isKey={ownedInboxTask?.is_key ?? false}
            compact={props.compact}
            fontWeight={
              chore
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter"
            }
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : chore
                ? chore.name
                : "Archived Chore"}
          </ActivityCardName>

          {props.fullInfo && (
            <>
              {ownedInboxTask && (
                <InboxTaskStatusTag status={ownedInboxTask.status} />
              )}
              {ownedInboxTask?.due_date && (
                <ADateTag label="Due At" date={ownedInboxTask.due_date} />
              )}

              {timeEvents.length > 0 &&
                (props.compact ? (
                  <>📅</>
                ) : (
                  <>
                    📅 {timeEvents.length} scheduled event
                    {timeEvents.length > 1 ? "s" : ""}
                  </>
                ))}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          {showFeasability && (
            <TimePlanActivityFeasabilityTag
              feasability={props.activity.feasability}
            />
          )}

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
    const bigPlanStats = bigPlan
      ? props.bigPlanStatsByRefId?.get(bigPlan.ref_id)
      : undefined;
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
        <EntityLink to={activityLocation} block={props.onClick !== undefined}>
          <ActivityCardName
            isKey={bigPlan?.is_key ?? false}
            compact={props.compact}
            fontWeight={
              bigPlan
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter"
            }
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : bigPlan
                ? bigPlan.name
                : "Archived Big Plan"}
          </ActivityCardName>

          {props.fullInfo && (
            <>
              {bigPlan && <BigPlanStatusTag status={bigPlan.status} />}
              {bigPlan && bigPlanStats && (
                <BigPlanDonePctTag
                  donePct={bigPlanDonePct(bigPlan, bigPlanStats)}
                />
              )}
              {bigPlan?.due_date && (
                <ADateTag label="Due At" date={bigPlan.due_date} />
              )}

              {timeEvents.length > 0 &&
                (props.compact ? (
                  <>📅</>
                ) : (
                  <>
                    📅 {timeEvents.length} scheduled event
                    {timeEvents.length > 1 ? "s" : ""}
                  </>
                ))}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          {showFeasability && (
            <TimePlanActivityFeasabilityTag
              feasability={props.activity.feasability}
            />
          )}

          {timePlan && <TimePlanTag timePlan={timePlan} />}
        </EntityLink>
      </EntityCard>
    );
  } else {
    return <></>;
  }
}

// Key chip and name stay on one line so the 🔑 never sits alone after a wrap.
function ActivityCardName(props: {
  isKey: boolean;
  compact?: boolean;
  fontWeight: "bold" | "normal" | "lighter";
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
        gap: props.compact ? "0.25rem" : "0.5rem",
        minWidth: 0,
      }}
    >
      <IsKeyTag isKey={props.isKey} />
      <Typography
        sx={{
          fontWeight: props.fontWeight,
          minWidth: 0,
          ...(props.compact ? { fontSize: "0.75rem", lineHeight: 1.25 } : {}),
        }}
      >
        {props.children}
      </Typography>
    </Box>
  );
}
