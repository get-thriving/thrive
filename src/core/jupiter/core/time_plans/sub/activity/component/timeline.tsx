import type {
  BigPlan,
  InboxTask,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import {
  RecurringTaskPeriod,
  TimePlanActivityDoneness as Doneness,
  TimePlanActivityTarget,
} from "@jupiter/webapi-client";
import { Box, styled, Typography } from "@mui/material";
import { Link } from "@remix-run/react";
import { DateTime } from "luxon";

import { aDateToDate } from "#/core/common/adate";

interface TimePlanTimelineActivityBarsProps {
  timePlan: TimePlan;
  activities: TimePlanActivity[];
  inboxTasksByRefId: Map<string, InboxTask>;
  bigPlansByRefId: Map<string, BigPlan>;
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

  const rows = filteredActivities
    .map((activity) => {
      const { label, start, end } = inferActivityInterval({
        activity,
        inboxTasksByRefId: props.inboxTasksByRefId,
        bigPlansByRefId: props.bigPlansByRefId,
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
      return {
        activity,
        label,
        left,
        width,
        clampedStart,
        clampedEnd,
        doneness: props.activityDoneness[activity.ref_id],
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
          to={`/app/workspace/time-plans/${props.timePlan.ref_id}/${row.activity.ref_id}`}
          key={`timeline-activity-${row.activity.ref_id}`}
          left={row.left}
          width={row.width}
          topRem={0.75 + headerHeightRem + idx * rowHeightRem}
          doneness={row.doneness}
        >
          <Typography variant="caption" sx={{ minWidth: 0 }}>
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
}

const TimelineActivityLink = styled(Link, {
  shouldForwardProp: (prop) =>
    prop !== "left" &&
    prop !== "width" &&
    prop !== "topRem" &&
    prop !== "doneness",
})<TimelineActivityLinkProps>(({ theme, left, width, topRem, doneness }) => {
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
  planStart: DateTime;
  planEnd: DateTime;
}): { label: string; start: DateTime; end: DateTime } {
  const fallback = { start: input.planStart, end: input.planStart };

  switch (input.activity.target) {
    case TimePlanActivityTarget.INBOX_TASK: {
      const it = input.inboxTasksByRefId.get(input.activity.target_ref_id);
      const label = it ? String(it.name) : String(input.activity.name);
      const start = it?.actionable_date
        ? DateTime.fromISO(String(it.actionable_date))
        : it?.due_date
          ? DateTime.fromISO(String(it.due_date))
          : fallback.start;
      const end = it?.due_date ? DateTime.fromISO(String(it.due_date)) : start;
      return { label, start, end };
    }

    case TimePlanActivityTarget.BIG_PLAN: {
      const bp = input.bigPlansByRefId.get(input.activity.target_ref_id);
      const label = bp ? String(bp.name) : String(input.activity.name);
      const start = bp?.actionable_date
        ? DateTime.fromISO(String(bp.actionable_date))
        : bp?.due_date
          ? DateTime.fromISO(String(bp.due_date))
          : fallback.start;
      const end = bp?.due_date ? DateTime.fromISO(String(bp.due_date)) : start;
      return { label, start, end };
    }
  }
}
