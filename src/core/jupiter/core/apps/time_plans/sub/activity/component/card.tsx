import {
  ADate,
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
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Children } from "react";
import { useSearchParams } from "@remix-run/react";

import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { bigPlanDonePct } from "#/core/apps/big_plans/root";
import { BigPlanDonePctTag } from "#/core/apps/big_plans/component/done-pct-tag";
import { BigPlanStatusTag } from "#/core/apps/big_plans/component/status-tag";
import { InboxTaskStatusTag } from "#/core/common/sub/inbox_tasks/component/status-tag";
import {
  EntityCard,
  EntityFakeLink,
  EntityLink,
} from "#/core/infra/component/entity-card";
import { useCalendarPlaceActivity } from "#/core/calendar/component/event-drag";
import { CardCornerChipStack } from "#/core/infra/component/chips";
import { TimePlanActivityFeasabilityTag } from "#/core/apps/time_plans/sub/activity/component/feasability-tag";
import { TimePlanActivityKindTag } from "#/core/apps/time_plans/sub/activity/component/kind-tag";
import { TimePlanActivityTargetTypeChip } from "#/core/apps/time_plans/sub/activity/component/target-type-chip";
import {
  habitChoreInboxTaskStats,
  selectHabitOrChorePlaceActivity,
} from "#/core/apps/time_plans/sub/activity/habit-chore-group";
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
import { compareADate } from "#/core/common/adate";
import { TimePlanTag } from "#/core/apps/time_plans/component/tag";
import { withTimePlanView } from "#/core/apps/time_plans/view-mode";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

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
  // For the narrow column the calendar view puts these in: smaller text and
  // tighter padding, so the cards don't crowd out the calendar itself.
  compact?: boolean;
  allowSelect?: boolean;
  selected?: boolean;
  indent?: number;
  onClick?: (activity: TimePlanActivity) => void;
  // Inbox-task activities that belong to this habit or chore on the same
  // plan. When present, the card stands for the whole group until expanded.
  associatedInboxTaskActivities?: TimePlanActivity[];
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export function TimePlanActivityCard(props: TimePlanActivityCardProps) {
  const isBigScreen = useBigScreen();
  const associatedInboxTaskActivities =
    props.associatedInboxTaskActivities ?? [];
  const placeActivity =
    associatedInboxTaskActivities.length > 0
      ? (selectHabitOrChorePlaceActivity(
          associatedInboxTaskActivities,
          props.inboxTasksByRefId,
          props.timeEventsByRefId,
        ) ?? props.activity)
      : props.activity;
  const place = useCalendarPlaceActivity({
    activityRefId: placeActivity.ref_id,
    timePlanRefId: placeActivity.time_plan_ref_id,
    archived: props.activity.archived,
    durationMins: inferDurationMinsForTimePlanActivity(
      placeActivity,
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
        "& .MuiCardContent-root > a, & .MuiCardContent-root > span": {
          flexWrap: "nowrap",
          minWidth: 0,
          overflow: "hidden",
          "& > *:not(:first-child)": {
            flexShrink: 0,
          },
          ...(props.compact
            ? {
                // The calendar column is narrow, so names and padding stay
                // smaller than the list view or they crowd out the plan.
                paddingTop: "0.35rem",
                paddingRight: "0.5rem",
                paddingBottom: "0.35rem",
                // The type chip sits in the top-left corner, so the name
                // starts after it rather than running underneath.
                paddingLeft: showTargetTypeChip ? "1.75rem" : "0.5rem",
                gap: "0.25rem",
              }
            : !isBigScreen
              ? {
                  // A tenth of the 16px the link normally uses on each side,
                  // so the name gets the width back on a phone. The vertical
                  // padding stays put and keeps the name clear of the corner
                  // chip.
                  paddingLeft: "1.6px",
                  paddingRight: "1.6px",
                }
              : {}),
        },
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
  const associatedInboxTaskActivities =
    props.associatedInboxTaskActivities ?? [];
  const expandable = associatedInboxTaskActivities.length > 0;
  const cardOnClick = props.onClick
    ? () => props.onClick && props.onClick(props.activity)
    : props.onToggleExpand;

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
          to={activityLocation}
          block={props.onClick !== undefined}
          singleLine
        >
          <ActivityCardName
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
              {inboxTask && (
                <InboxTaskStatusTag status={inboxTask.status} format="icon" />
              )}
              <TimePlanActivityDueDateTag
                dueDate={inboxTask?.due_date}
                periodEndDate={timePlan?.end_date}
              />

              {timeEvents.length > 0 && <>📅</>}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} format="icon" />
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
        <EntityLink
          to={activityLocation}
          block={props.onClick !== undefined}
          singleLine
        >
          <ActivityCardName
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
                <InboxTaskStatusTag
                  status={ownedInboxTask.status}
                  format="icon"
                />
              )}
              <TimePlanActivityDueDateTag
                dueDate={ownedInboxTask?.due_date}
                periodEndDate={timePlan?.end_date}
              />

              {timeEvents.length > 0 && <>📅</>}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} format="icon" />
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
        onClick={cardOnClick}
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
        <ActivityCardContents
          activityLocation={activityLocation}
          blockLink={props.onClick !== undefined}
          expandable={expandable}
          expanded={props.expanded}
        >
          <ActivityCardName
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

          {props.fullInfo && expandable && (
            <HabitChoreTaskStatsView
              activities={associatedInboxTaskActivities}
              inboxTasksByRefId={props.inboxTasksByRefId}
              compact={props.compact}
            />
          )}

          {props.fullInfo && !expandable && timeEvents.length > 0 && <>📅</>}

          <TimePlanActivityKindTag kind={props.activity.kind} format="icon" />
          {showFeasability && (
            <TimePlanActivityFeasabilityTag
              feasability={props.activity.feasability}
            />
          )}

          {timePlan && <TimePlanTag timePlan={timePlan} />}
        </ActivityCardContents>
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
    const associatedStats = expandable
      ? habitChoreInboxTaskStats(
          associatedInboxTaskActivities,
          props.inboxTasksByRefId,
        )
      : undefined;
    return (
      <EntityCard
        entityId={`time-plan-activity-${props.activity.ref_id}`}
        allowSelect={props.allowSelect}
        selected={props.selected}
        onClick={cardOnClick}
        backgroundHint={
          props.activityDoneness[props.activity.ref_id] ===
          TimePlanActivityDoneness.DONE
            ? associatedStats !== undefined
              ? associatedStats.notDoneCount > 0 &&
                associatedStats.doneCount === 0
                ? "failure"
                : "success"
              : ownedInboxTask?.status === InboxTaskStatus.NOT_DONE
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
        <ActivityCardContents
          activityLocation={activityLocation}
          blockLink={props.onClick !== undefined}
          expandable={expandable}
          expanded={props.expanded}
        >
          <ActivityCardName
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

          {props.fullInfo && expandable && (
            <HabitChoreTaskStatsView
              activities={associatedInboxTaskActivities}
              inboxTasksByRefId={props.inboxTasksByRefId}
              compact={props.compact}
            />
          )}

          {props.fullInfo && !expandable && (
            <>
              {ownedInboxTask && (
                <InboxTaskStatusTag
                  status={ownedInboxTask.status}
                  format="icon"
                />
              )}
              <TimePlanActivityDueDateTag
                dueDate={ownedInboxTask?.due_date}
                periodEndDate={timePlan?.end_date}
              />

              {timeEvents.length > 0 && <>📅</>}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} format="icon" />
          {showFeasability && (
            <TimePlanActivityFeasabilityTag
              feasability={props.activity.feasability}
            />
          )}

          {timePlan && <TimePlanTag timePlan={timePlan} />}
        </ActivityCardContents>
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
        <EntityLink
          to={activityLocation}
          block={props.onClick !== undefined}
          singleLine
        >
          <ActivityCardName
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
              {bigPlan && (
                <BigPlanStatusTag status={bigPlan.status} format="icon" />
              )}
              {bigPlan && bigPlanStats && (
                <BigPlanDonePctTag
                  donePct={bigPlanDonePct(bigPlan, bigPlanStats)}
                />
              )}
              <TimePlanActivityDueDateTag
                dueDate={bigPlan?.due_date}
                periodEndDate={timePlan?.end_date}
              />

              {timeEvents.length > 0 && <>📅</>}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} format="icon" />
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

function ActivityCardContents(props: {
  activityLocation: string;
  blockLink: boolean;
  expandable: boolean;
  expanded?: boolean;
  children: ReactNode;
}) {
  if (!props.expandable) {
    return (
      <EntityLink
        to={props.activityLocation}
        block={props.blockLink}
        singleLine
      >
        {props.children}
      </EntityLink>
    );
  }

  const childArray = Children.toArray(props.children);
  const name = childArray[0];
  const rest = childArray.slice(1);

  return (
    <EntityFakeLink singleLine>
      <Box
        onClick={(event) => event.stopPropagation()}
        sx={{
          minWidth: 0,
          flex: "0 1 auto",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <EntityLink to={props.activityLocation} inline singleLine>
          {name}
        </EntityLink>
      </Box>
      {rest}
      <ExpandMoreIcon
        fontSize="small"
        titleAccess={props.expanded ? "Hide tasks" : "Show tasks"}
        sx={{
          flexShrink: 0,
          transform: props.expanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}
      />
    </EntityFakeLink>
  );
}

function HabitChoreTaskStatsView(props: {
  activities: TimePlanActivity[];
  inboxTasksByRefId: Map<string, InboxTask>;
  compact?: boolean;
}) {
  const isBigScreen = useBigScreen();
  const stats = habitChoreInboxTaskStats(
    props.activities,
    props.inboxTasksByRefId,
  );
  const label = `${stats.notStartedCount} not started, ${stats.doneCount} done, ${stats.notDoneCount} not done`;
  // Only the wide list view has room to spell the counts out. The calendar
  // column and the phone show icons, so the name keeps the space instead.
  const asIcons = props.compact || !isBigScreen;

  return (
    <Typography
      component="span"
      variant="caption"
      title={label}
      aria-label={label}
      sx={{
        flexShrink: 0,
        whiteSpace: "nowrap",
        ...(asIcons ? { fontSize: "0.65rem" } : {}),
      }}
    >
      {asIcons
        ? `📥${stats.notStartedCount} ✅${stats.doneCount} ⛔${stats.notDoneCount}`
        : `${stats.notStartedCount} not started · ${stats.doneCount} done · ${stats.notDoneCount} not done`}
    </Typography>
  );
}

// A due date only matters here if it lands in this plan's period - later
// ones belong to a future plan.
function TimePlanActivityDueDateTag(props: {
  dueDate?: ADate | null;
  periodEndDate?: ADate;
}) {
  if (!props.dueDate || !props.periodEndDate) {
    return null;
  }
  if (compareADate(props.dueDate, props.periodEndDate) > 0) {
    return null;
  }
  return <ADateTag label="Due At" date={props.dueDate} />;
}

// The name ellipsizes so status icons and chips can keep their place beside it.
function ActivityCardName(props: {
  compact?: boolean;
  fontWeight: "bold" | "normal" | "lighter";
  children: ReactNode;
}) {
  const isBigScreen = useBigScreen();

  return (
    <Typography
      component="span"
      noWrap
      sx={{
        fontWeight: props.fontWeight,
        minWidth: 0,
        flex: "0 1 auto",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ...(props.compact
          ? { fontSize: "0.75rem", lineHeight: 1.25 }
          : !isBigScreen
            ? { fontSize: "0.85rem", lineHeight: 1.3 }
            : {}),
      }}
    >
      {props.children}
    </Typography>
  );
}
