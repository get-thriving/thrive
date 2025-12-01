import { RecurringTaskPeriod, TimePlan } from "@jupiter/webapi-client";
import { Stack, Typography } from "@mui/material";

import { TimeAndEffortSummary } from "#/core/time_plans/time-and-effort-summary";

interface FeasaibilityViewProps {
  timePlan: TimePlan;
  timeAndEffortSummary: TimeAndEffortSummary;
}

export function FeasabilityView(props: FeasaibilityViewProps) {
  const totalHours = props.timeAndEffortSummary.planned.totalHours;
  const availableHours = hoursActive(props.timePlan.period);
  const confidence = getConfidence(totalHours, availableHours);

  return (
    <Stack>
      <Typography component="p">
        There are {hoursAvailable(props.timePlan.period)} hours in the{" "}
        {props.timePlan.period === RecurringTaskPeriod.DAILY ? "day" : "week"}.
        Of these, {hoursSleep(props.timePlan.period)} hours should be for sleep,
        leaving {availableHours.toFixed(0)} hours for activity. You have planned{" "}
        {totalHours.toFixed(0)} hours for this time plan.
      </Typography>

      <Typography component="p" sx={{ mt: 1 }}>
        {confidence.message}
      </Typography>
    </Stack>
  );
}

function hoursAvailable(period: RecurringTaskPeriod): number {
  if (period === RecurringTaskPeriod.DAILY) return 24;
  if (period === RecurringTaskPeriod.WEEKLY) return 168;
  return 0;
}

function hoursSleep(period: RecurringTaskPeriod): number {
  if (period === RecurringTaskPeriod.DAILY) return 8;
  if (period === RecurringTaskPeriod.WEEKLY) return 56;
  return 0;
}

function hoursActive(period: RecurringTaskPeriod): number {
  if (period === RecurringTaskPeriod.DAILY) return 16;
  if (period === RecurringTaskPeriod.WEEKLY) return 112;
  return 0;
}

function getConfidence(
  totalHours: number,
  availableHours: number,
): { message: string } {
  if (totalHours < availableHours / 2) {
    return {
      message: `You should have high confidence in completing this plan. Your planned ${totalHours.toFixed(0)} hours is less than half of the ${availableHours} available hours.`,
    };
  } else if (totalHours < availableHours) {
    return {
      message: `You should have low confidence in completing this plan. Your planned ${totalHours.toFixed(0)} hours is more than half of the ${availableHours} available hours.`,
    };
  } else {
    return {
      message: `This plan is critically unlikely to be completed. Your planned ${totalHours.toFixed(0)} hours exceeds the ${availableHours} available hours, making it unlikely to complete.`,
    };
  }
}
