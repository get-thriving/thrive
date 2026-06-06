import { ADate, Project, TimePlan } from "@jupiter/webapi-client";

import { aDateToDate, dateToAdate } from "#/core/common/adate";

export interface SuggestedDate {
  date: ADate;
  label: string;
}

export interface ChapterForSuggestions {
  name: string;
  start_date: ADate;
  end_date: ADate;
}

export function getSuggestedDatesForInboxTaskActionableDate(
  today: ADate,
  bigPlan?: Project | null,
  timePlan?: TimePlan | null,
): SuggestedDate[] {
  const todayDate = aDateToDate(today);
  const suggestedDates: SuggestedDate[] = [
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
      label: "Parent project actionable date",
    });
  }

  if (timePlan) {
    suggestedDates.push({
      date: timePlan.start_date,
      label: "Associated time plan start date",
    });
  }

  return suggestedDates;
}

export function getSuggestedDatesForInboxTaskDueDate(
  today: ADate,
  bigPlan?: Project | null,
  timePlan?: TimePlan | null,
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
      label: "Parent project due date",
    });
  }

  if (timePlan) {
    suggestedDates.push({
      date: timePlan.end_date,
      label: "Associated time plan end date",
    });
  }

  return suggestedDates;
}

export function getSuggestedDatesForTodoTaskActionableDate(
  today: ADate,
  timePlan?: TimePlan | null,
  chapters?: ChapterForSuggestions[] | null,
): SuggestedDate[] {
  const todayDate = aDateToDate(today);

  const suggestedDates: SuggestedDate[] = [
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

  if (chapters) {
    for (const chapter of chapters) {
      suggestedDates.push({
        date: chapter.start_date,
        label: `Start of chapter "${chapter.name}"`,
      });
    }
  }

  if (timePlan) {
    suggestedDates.push({
      date: timePlan.start_date,
      label: "Associated time plan start date",
    });
  }

  return suggestedDates;
}

export function getSuggestedDatesForTodoTaskDueDate(
  today: ADate,
  timePlan?: TimePlan | null,
  chapters?: ChapterForSuggestions[] | null,
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

  if (chapters) {
    for (const chapter of chapters) {
      suggestedDates.push({
        date: chapter.end_date,
        label: `End of chapter "${chapter.name}"`,
      });
    }
  }

  if (timePlan) {
    suggestedDates.push({
      date: timePlan.end_date,
      label: "Associated time plan end date",
    });
  }

  return suggestedDates;
}

export function getSuggestedDatesForProjectActionableDate(
  today: ADate,
  timePlan?: TimePlan | null,
  chapters?: ChapterForSuggestions[] | null,
): SuggestedDate[] {
  const todayDate = aDateToDate(today);
  const suggestedDates: SuggestedDate[] = [
    {
      date: dateToAdate(todayDate.startOf("year")),
      label: "Start of the year",
    },
    {
      date: dateToAdate(todayDate.startOf("quarter")),
      label: "Start of the quarter",
    },
    {
      date: dateToAdate(todayDate.startOf("month")),
      label: "Start of the month",
    },
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

  if (chapters) {
    for (const chapter of chapters) {
      suggestedDates.push({
        date: chapter.start_date,
        label: `Start of chapter "${chapter.name}"`,
      });
    }
  }

  if (timePlan) {
    suggestedDates.push({
      date: timePlan.start_date,
      label: "Associated time plan start date",
    });
  }

  return suggestedDates;
}

export function getSuggestedDatesForProjectDueDate(
  today: ADate,
  timePlan?: TimePlan | null,
  chapters?: ChapterForSuggestions[] | null,
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

  if (chapters) {
    for (const chapter of chapters) {
      suggestedDates.push({
        date: chapter.end_date,
        label: `End of chapter "${chapter.name}"`,
      });
    }
  }

  if (timePlan) {
    suggestedDates.push({
      date: timePlan.end_date,
      label: "Associated time plan end date",
    });
  }

  return suggestedDates;
}

export function getSuggestedDatesForProjectMilestoneDate(
  today: ADate,
): SuggestedDate[] {
  return getSuggestedDatesForProjectDueDate(today, null);
}
