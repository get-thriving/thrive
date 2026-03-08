import { ADate, BigPlan, SuggestedDate as ServerSuggestedDate, TimePlan } from "@jupiter/webapi-client";

import { aDateToDate, dateToAdate } from "#/core/common/adate";

export interface SuggestedDate {
  date: ADate;
  label: string;
}

function serverToLocal(serverDates: ServerSuggestedDate[]): SuggestedDate[] {
  return serverDates.map((d) => ({ date: d.date, label: d.description }));
}

export function getSuggestedDatesForInboxTaskActionableDate(
  today: ADate,
  bigPlan?: BigPlan | null,
  timePlan?: TimePlan | null,
  serverSuggestedDates?: ServerSuggestedDate[],
): SuggestedDate[] {
  const todayDate = aDateToDate(today);

  const pastSuggestions: SuggestedDate[] = [];
  const startOfWeek = dateToAdate(todayDate.startOf("week"));
  if (startOfWeek < today) {
    pastSuggestions.push({ date: startOfWeek, label: "Start of the week" });
  }
  const startOfMonth = dateToAdate(todayDate.startOf("month"));
  if (startOfMonth < today) {
    pastSuggestions.push({ date: startOfMonth, label: "Start of the month" });
  }

  const suggestedDates: SuggestedDate[] = [
    ...pastSuggestions.reverse(),
    {
      date: today,
      label: "Today",
    },
    {
      date: dateToAdate(todayDate.plus({ days: 7 }).startOf("week")),
      label: "Start of the next week",
    },
    {
      date: dateToAdate(todayDate.plus({ months: 1 }).startOf("month")),
      label: "Start of the next month",
    },
  ];

  if (bigPlan && bigPlan.actionable_date) {
    suggestedDates.push({
      date: bigPlan.actionable_date,
      label: "Parent big plan actionable date",
    });
  }

  if (timePlan) {
    suggestedDates.push({
      date: timePlan.start_date,
      label: "Associated time plan start date",
    });
  }

  if (serverSuggestedDates) {
    suggestedDates.push(...serverToLocal(serverSuggestedDates));
  }

  return suggestedDates;
}

export function getSuggestedDatesForInboxTaskDueDate(
  today: ADate,
  bigPlan?: BigPlan | null,
  timePlan?: TimePlan | null,
  serverSuggestedDates?: ServerSuggestedDate[],
): SuggestedDate[] {
  const todayDate = aDateToDate(today);
  const suggestedDates: SuggestedDate[] = [
    {
      date: today,
      label: "Today",
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("week")),
      label: "End of the week",
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("month")),
      label: "End of the month",
    },
  ];

  if (bigPlan && bigPlan.due_date) {
    suggestedDates.push({
      date: bigPlan.due_date,
      label: "Parent big plan due date",
    });
  }

  if (timePlan) {
    suggestedDates.push({
      date: timePlan.end_date,
      label: "Associated time plan end date",
    });
  }

  if (serverSuggestedDates) {
    suggestedDates.push(...serverToLocal(serverSuggestedDates));
  }

  return suggestedDates;
}

export function getSuggestedDatesForBigPlanActionableDate(
  today: ADate,
  timePlan?: TimePlan | null,
  serverSuggestedDates?: ServerSuggestedDate[],
): SuggestedDate[] {
  const todayDate = aDateToDate(today);

  const pastSuggestions: SuggestedDate[] = [];
  const startOfWeek = dateToAdate(todayDate.startOf("week"));
  if (startOfWeek < today) {
    pastSuggestions.push({ date: startOfWeek, label: "Start of the week" });
  }
  const startOfMonth = dateToAdate(todayDate.startOf("month"));
  if (startOfMonth < today) {
    pastSuggestions.push({ date: startOfMonth, label: "Start of the month" });
  }
  const startOfQuarter = dateToAdate(todayDate.startOf("quarter"));
  if (startOfQuarter < today) {
    pastSuggestions.push({
      date: startOfQuarter,
      label: "Start of the quarter",
    });
  }
  const startOfYear = dateToAdate(todayDate.startOf("year"));
  if (startOfYear < today) {
    pastSuggestions.push({ date: startOfYear, label: "Start of the year" });
  }

  const suggestedDates: SuggestedDate[] = [
    ...pastSuggestions.reverse(),
    {
      date: today,
      label: "Today",
    },
    {
      date: dateToAdate(todayDate.plus({ months: 1 }).startOf("month")),
      label: "Start of the next month",
    },
    {
      date: dateToAdate(todayDate.plus({ months: 3 }).startOf("quarter")),
      label: "Start of the next quarter",
    },
  ];

  if (timePlan) {
    suggestedDates.push({
      date: timePlan.start_date,
      label: "Associated time plan start date",
    });
  }

  if (serverSuggestedDates) {
    suggestedDates.push(...serverToLocal(serverSuggestedDates));
  }

  return suggestedDates;
}

export function getSuggestedDatesForBigPlanDueDate(
  today: ADate,
  timePlan?: TimePlan | null,
  serverSuggestedDates?: ServerSuggestedDate[],
): SuggestedDate[] {
  const todayDate = aDateToDate(today);
  const suggestedDates: SuggestedDate[] = [
    {
      date: today,
      label: "Today",
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("month")),
      label: "End of the month",
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("quarter")),
      label: "End of the quarter",
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("year")),
      label: "End of the year",
    },
  ];

  if (timePlan) {
    suggestedDates.push({
      date: timePlan.end_date,
      label: "Associated time plan end date",
    });
  }

  if (serverSuggestedDates) {
    suggestedDates.push(...serverToLocal(serverSuggestedDates));
  }

  return suggestedDates;
}

export function getSuggestedDatesForBigPlanMilestoneDate(
  today: ADate,
): SuggestedDate[] {
  return getSuggestedDatesForBigPlanDueDate(today, null);
}
