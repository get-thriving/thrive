import type {
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
  RecurringTaskPeriod,
  TimePlanActivityDoneness as Doneness,
} from "@jupiter/webapi-client";
import { Box, styled, Typography } from "@mui/material";
import { Link, useSearchParams } from "@remix-run/react";
import { DateTime } from "luxon";

import { aDateToDate } from "#/core/common/adate";
import { bigPlanDonePct } from "#/core/apps/big_plans/root";
import { withTimePlanView } from "#/core/apps/time_plans/view-mode";
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
import { parentActivitiesByTargetRefId } from "#/core/apps/time_plans/sub/activity/group-by-parent";
import {
  habitAndChoreChildActivitiesByParentTarget,
  habitOrChoreParentTargetForInboxTaskActivity,
} from "#/core/apps/time_plans/sub/activity/habit-chore-group";
import { timePlanActivityTargetNameForEvent } from "#/core/apps/time_plans/sub/activity/root";

interface TimePlanTimelineActivityBarsProps {
  timePlan: TimePlan;
  activities: TimePlanActivity[];
  inboxTasksByRefId: Map<string, InboxTask>;
  bigPlansByRefId: Map<string, BigPlan>;
  bigPlanStatsByRefId?: Map<string, BigPlanStats>;
  todoTasksByRefId: Map<string, TodoTask>;
  habitsByRefId: Map<string, Habit>;
  choresByRefId: Map<string, Chore>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  timeEventsByRefId: Map<string, TimeEventInDayBlock[]>;
  topLevelToday: string;
  filterKind?: TimePlanActivityKind[];
  filterFeasability?: TimePlanActivityFeasability[];
  filterDoneness?: boolean[];
}

export function TimePlanTimelineActivityBars(
  props: TimePlanTimelineActivityBarsProps,
) {
  const [query] = useSearchParams();
  const timePlanView = query;

  const planStart = aDateToDate(props.timePlan.start_date);
  const planEnd = aDateToDate(props.timePlan.end_date);
  const durationDays = Math.max(1, planEnd.diff(planStart, "days").days);

  const today = aDateToDate(props.topLevelToday);
  const todayLeft =
    today >= planStart && today <= planEnd
      ? Math.max(
          0,
          Math.min(1, today.diff(planStart, "days").days / durationDays),
        )
      : null;

  const filteredActivities = props.activities.filter((a) => {
    if (
      props.filterKind &&
      props.filterKind.length > 0 &&
      !props.filterKind.includes(a.kind)
    ) {
      return false;
    }
    if (
      props.filterFeasability &&
      props.filterFeasability.length > 0 &&
      !props.filterFeasability.includes(a.feasability)
    ) {
      return false;
    }
    if (props.filterDoneness && props.filterDoneness.length > 0) {
      const isDone = props.activityDoneness[a.ref_id] === Doneness.DONE;
      if (!props.filterDoneness.includes(isDone)) {
        return false;
      }
    }
    return true;
  });

  const parentActivitiesByTarget =
    parentActivitiesByTargetRefId(filteredActivities);
  const habitChoreChildrenByParent = habitAndChoreChildActivitiesByParentTarget(
    props.activities,
    props.inboxTasksByRefId,
    parentActivitiesByTarget,
  );
  const visibleHabitChoreParentTargets = new Set(
    filteredActivities
      .filter(
        (activity) =>
          isTimePlanActivityHabitTarget(activity.target) ||
          isTimePlanActivityChoreTarget(activity.target),
      )
      .map((activity) => activity.target),
  );

  const rows = filteredActivities
    .filter((activity) => {
      const parentTarget = habitOrChoreParentTargetForInboxTaskActivity(
        activity,
        props.inboxTasksByRefId,
      );
      if (parentTarget === undefined) {
        return true;
      }
      return !visibleHabitChoreParentTargets.has(parentTarget);
    })
    .map((activity) => {
      const { label, start, end } = inferActivityInterval({
        activity,
        inboxTasksByRefId: props.inboxTasksByRefId,
        bigPlansByRefId: props.bigPlansByRefId,
        todoTasksByRefId: props.todoTasksByRefId,
        habitsByRefId: props.habitsByRefId,
        choresByRefId: props.choresByRefId,
        planStart,
        planEnd,
      });

      const clampedStart = DateTime.max(
        planStart,
        DateTime.min(planEnd, start),
      );
      const clampedEnd = DateTime.max(clampedStart, DateTime.min(planEnd, end));

      const left = Math.max(
        0,
        Math.min(1, clampedStart.diff(planStart, "days").days / durationDays),
      );
      const right = Math.max(
        0,
        Math.min(1, clampedEnd.diff(planStart, "days").days / durationDays),
      );

      const width = Math.max(0.02, right - left);
      const donePct = inferActivityDonePct({
        activity,
        bigPlansByRefId: props.bigPlansByRefId,
        bigPlanStatsByRefId: props.bigPlanStatsByRefId,
        associatedInboxTaskActivities: habitChoreChildrenByParent.get(
          activity.target,
        ),
        activityDoneness: props.activityDoneness,
      });
      return {
        activity,
        label,
        left,
        width,
        clampedStart,
        clampedEnd,
        doneness: props.activityDoneness[activity.ref_id],
        donePct,
      };
    })
    .sort((a, b) => {
      const startDiff = a.clampedStart.toMillis() - b.clampedStart.toMillis();
      if (startDiff !== 0) {
        return startDiff;
      }
      return a.clampedEnd.toMillis() - b.clampedEnd.toMillis();
    });

  if (rows.length === 0) {
    return null;
  }

  const rowHeightRem = 1.75;
  const headerHeightRem = 1.25;
  const footerHeightRem = 0.5;
  const heightRem =
    headerHeightRem + rows.length * rowHeightRem + footerHeightRem;

  const showMonthMarkers =
    props.timePlan.period === RecurringTaskPeriod.QUARTERLY ||
    props.timePlan.period === RecurringTaskPeriod.YEARLY;

  const monthMarkers: Array<{ label: string; left: number }> = [];
  if (showMonthMarkers) {
    let cursor = planStart.endOf("month").plus({ days: 1 });
    const endLimit = planEnd.startOf("month").minus({ days: 1 });
    while (cursor <= endLimit) {
      const left = Math.max(
        0,
        Math.min(1, cursor.diff(planStart, "days").days / durationDays),
      );
      monthMarkers.push({ label: cursor.toFormat("MMM"), left });
      cursor = cursor.plus({ months: 1 });
    }
  }

  return (
    <Box
      sx={{
        marginBottom: "1rem",
        position: "relative",
        height: `${heightRem}rem`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "0.5rem",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {props.timePlan.start_date}
        </Typography>
        {showMonthMarkers &&
          monthMarkers.map((m, idx) => (
            <Box
              key={`month-marker-${idx}-${m.label}`}
              sx={{
                position: "absolute",
                left: `${m.left * 100}% `,
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.1rem",
                pointerEvents: "none",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {m.label}
              </Typography>
            </Box>
          ))}
        <Typography variant="caption" color="text.secondary">
          {props.timePlan.end_date}
        </Typography>
      </Box>

      {todayLeft !== null && (
        <Box
          sx={(theme) => ({
            position: "absolute",
            left: `${todayLeft * 100}%`,
            top: "0.75rem",
            bottom: "0.75rem",
            width: "2px",
            backgroundColor: theme.palette.error.main,
            opacity: 0.6,
          })}
        />
      )}

      {rows.map((row, idx) => (
        <TimelineActivityLink
          to={withTimePlanView(
            `/app/workspace/apps/time-plans/${props.timePlan.ref_id}/${row.activity.ref_id}`,
            timePlanView,
          )}
          key={`timeline-activity-${row.activity.ref_id}`}
          left={row.left}
          width={row.width}
          topRem={0.75 + headerHeightRem + idx * rowHeightRem}
          doneness={row.doneness}
          donePct={row.donePct}
        >
          <Typography
            variant="caption"
            sx={{ minWidth: 0, position: "relative" }}
          >
            {row.label}
          </Typography>
        </TimelineActivityLink>
      ))}
    </Box>
  );
}

interface TimelineActivityLinkProps {
  left: number;
  width: number;
  topRem: number;
  doneness: Doneness;
  donePct?: number;
}

const TimelineActivityLink = styled(Link, {
  shouldForwardProp: (prop) =>
    prop !== "left" &&
    prop !== "width" &&
    prop !== "topRem" &&
    prop !== "doneness" &&
    prop !== "donePct",
})<TimelineActivityLinkProps>(({
  theme,
  left,
  width,
  topRem,
  doneness,
  donePct,
}) => {
  const backgroundColor =
    doneness === Doneness.DONE
      ? `${theme.palette.success.light}22`
      : doneness === Doneness.WORKING
        ? `${theme.palette.warning.light}22`
        : "transparent";
  const borderColor =
    doneness === Doneness.DONE
      ? theme.palette.success.main
      : doneness === Doneness.WORKING
        ? theme.palette.warning.main
        : theme.palette.divider;
  const progressColor =
    doneness === Doneness.DONE
      ? `${theme.palette.success.main}55`
      : doneness === Doneness.WORKING
        ? `${theme.palette.warning.main}55`
        : `${theme.palette.info.main}44`;

  return {
    position: "absolute",
    left: `${left * 100}%`,
    width: `${width * 100}%`,
    top: `${topRem}rem`,
    height: "1.1rem",
    borderRadius: "0.35rem",
    backgroundColor,
    border: `1px solid ${borderColor}`,
    paddingLeft: "0.25rem",
    paddingRight: "0.25rem",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    textDecoration: "none",
    color: theme.palette.info.dark,
    ...(donePct !== undefined
      ? {
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${donePct}%`,
            backgroundColor: progressColor,
            pointerEvents: "none",
          },
        }
      : {}),
    ":visited": {
      color: theme.palette.info.dark,
    },
    ":hover": {
      borderColor: theme.palette.info.main,
      backgroundColor: theme.palette.action.selected,
    },
  };
});

function inferActivityInterval(input: {
  activity: TimePlanActivity;
  inboxTasksByRefId: Map<string, InboxTask>;
  bigPlansByRefId: Map<string, BigPlan>;
  todoTasksByRefId: Map<string, TodoTask>;
  habitsByRefId: Map<string, Habit>;
  choresByRefId: Map<string, Chore>;
  planStart: DateTime;
  planEnd: DateTime;
}): { label: string; start: DateTime; end: DateTime } {
  const fallback = { start: input.planStart, end: input.planStart };

  const target = input.activity.target;
  if (isTimePlanActivityInboxTaskTarget(target)) {
    const it = input.inboxTasksByRefId.get(entityLinkRefIdFromWire(target));
    const label = timePlanActivityTargetNameForEvent(
      it,
      undefined,
      input.activity.ref_id,
    );
    const start = it?.actionable_date
      ? DateTime.fromISO(String(it.actionable_date))
      : it?.due_date
        ? DateTime.fromISO(String(it.due_date))
        : fallback.start;
    const end = it?.due_date ? DateTime.fromISO(String(it.due_date)) : start;
    return { label, start, end };
  }
  if (isTimePlanActivityTodoTaskTarget(target)) {
    const todoTask = input.todoTasksByRefId.get(
      entityLinkRefIdFromWire(target),
    );
    const ownedInboxTask = [...input.inboxTasksByRefId.values()].find(
      (inboxTask) =>
        parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) === TODO_TASK &&
        entityLinkRefIdFromWire(inboxTask.owner) ===
          entityLinkRefIdFromWire(target),
    );
    const label = timePlanActivityTargetNameForEvent(
      ownedInboxTask,
      undefined,
      input.activity.ref_id,
      todoTask,
    );
    const start = ownedInboxTask?.actionable_date
      ? DateTime.fromISO(String(ownedInboxTask.actionable_date))
      : ownedInboxTask?.due_date
        ? DateTime.fromISO(String(ownedInboxTask.due_date))
        : fallback.start;
    const end = ownedInboxTask?.due_date
      ? DateTime.fromISO(String(ownedInboxTask.due_date))
      : start;
    return { label, start, end };
  }
  if (isTimePlanActivityHabitTarget(target)) {
    const habit = input.habitsByRefId.get(entityLinkRefIdFromWire(target));
    const ownedInboxTask = [...input.inboxTasksByRefId.values()].find(
      (inboxTask) =>
        parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) === HABIT &&
        entityLinkRefIdFromWire(inboxTask.owner) ===
          entityLinkRefIdFromWire(target),
    );
    const label = timePlanActivityTargetNameForEvent(
      ownedInboxTask,
      undefined,
      input.activity.ref_id,
      undefined,
      habit,
    );
    const start = ownedInboxTask?.actionable_date
      ? DateTime.fromISO(String(ownedInboxTask.actionable_date))
      : ownedInboxTask?.due_date
        ? DateTime.fromISO(String(ownedInboxTask.due_date))
        : fallback.start;
    const end = ownedInboxTask?.due_date
      ? DateTime.fromISO(String(ownedInboxTask.due_date))
      : start;
    return { label, start, end };
  }
  if (isTimePlanActivityChoreTarget(target)) {
    const chore = input.choresByRefId.get(entityLinkRefIdFromWire(target));
    const ownedInboxTask = [...input.inboxTasksByRefId.values()].find(
      (inboxTask) =>
        parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) === CHORE &&
        entityLinkRefIdFromWire(inboxTask.owner) ===
          entityLinkRefIdFromWire(target),
    );
    const label = timePlanActivityTargetNameForEvent(
      ownedInboxTask,
      undefined,
      input.activity.ref_id,
      undefined,
      undefined,
      chore,
    );
    const start = ownedInboxTask?.actionable_date
      ? DateTime.fromISO(String(ownedInboxTask.actionable_date))
      : ownedInboxTask?.due_date
        ? DateTime.fromISO(String(ownedInboxTask.due_date))
        : fallback.start;
    const end = ownedInboxTask?.due_date
      ? DateTime.fromISO(String(ownedInboxTask.due_date))
      : start;
    return { label, start, end };
  }
  if (isTimePlanActivityBigPlanTarget(target)) {
    const bp = input.bigPlansByRefId.get(entityLinkRefIdFromWire(target));
    const label = timePlanActivityTargetNameForEvent(
      undefined,
      bp,
      input.activity.ref_id,
    );
    const start = bp?.actionable_date
      ? DateTime.fromISO(String(bp.actionable_date))
      : bp?.due_date
        ? DateTime.fromISO(String(bp.due_date))
        : fallback.start;
    const end = bp?.due_date ? DateTime.fromISO(String(bp.due_date)) : start;
    return { label, start, end };
  }
  return {
    label: timePlanActivityTargetNameForEvent(
      undefined,
      undefined,
      input.activity.ref_id,
    ),
    start: fallback.start,
    end: fallback.end,
  };
}

function inferActivityDonePct(input: {
  activity: TimePlanActivity;
  bigPlansByRefId: Map<string, BigPlan>;
  bigPlanStatsByRefId?: Map<string, BigPlanStats>;
  associatedInboxTaskActivities?: TimePlanActivity[];
  activityDoneness: Record<string, TimePlanActivityDoneness>;
}): number | undefined {
  const associated = input.associatedInboxTaskActivities ?? [];
  if (
    (isTimePlanActivityHabitTarget(input.activity.target) ||
      isTimePlanActivityChoreTarget(input.activity.target)) &&
    associated.length > 0
  ) {
    const doneCount = associated.filter(
      (child) => input.activityDoneness[child.ref_id] === Doneness.DONE,
    ).length;
    return (doneCount / associated.length) * 100;
  }

  if (!isTimePlanActivityBigPlanTarget(input.activity.target)) {
    return undefined;
  }
  if (input.bigPlanStatsByRefId === undefined) {
    return undefined;
  }

  const bigPlanRefId = entityLinkRefIdFromWire(input.activity.target);
  const bigPlan = input.bigPlansByRefId.get(bigPlanRefId);
  const stats = input.bigPlanStatsByRefId.get(bigPlanRefId);
  if (bigPlan === undefined || stats === undefined) {
    return undefined;
  }
  if (stats.all_inbox_tasks_cnt <= 0 && stats.completed_inbox_tasks_cnt <= 0) {
    return undefined;
  }

  return bigPlanDonePct(bigPlan, stats);
}
