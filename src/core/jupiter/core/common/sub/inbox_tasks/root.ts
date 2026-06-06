import {
  Project,
  Chore,
  Contact,
  Difficulty,
  Eisen,
  EmailTask,
  Habit,
  InboxTask,
  InboxTaskFindResultEntry,
  InboxTaskStatus,
  Metric,
  Person,
  RecurringTaskPeriod,
  SlackTask,
  TodoTask,
} from "@jupiter/webapi-client";
import type { DateTime } from "luxon";

import { aDateToDate, compareADate } from "#/core/common/adate";
import { compareDifficulty } from "#/core/common/difficulty";
import { compareEisen } from "#/core/common/eisen";
import { compareIsKey } from "#/core/common/is-key";
import {
  PROJECT,
  EMAIL_TASK,
  SLACK_TASK,
  TODO_TASK,
  parentLinkNamespaceFromEntityLinkWire,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";

export interface InboxTaskOptimisticState {
  status: InboxTaskStatus;
  eisen?: Eisen;
}

export interface InboxTaskParent {
  bigPlan?: Project;
  todoTask?: TodoTask;
  habit?: Habit;
  chore?: Chore;
  metric?: Metric;
  person?: Person;
  contact?: Contact;
  slackTask?: SlackTask;
  emailTask?: EmailTask;
}

export function inboxTaskFindEntryToParent(
  entry: InboxTaskFindResultEntry,
): InboxTaskParent {
  return {
    bigPlan: entry.project ?? undefined,
    todoTask: entry.todo_task ?? undefined,
    habit: entry.habit ?? undefined,
    chore: entry.chore ?? undefined,
    metric: entry.metric ?? undefined,
    person: entry.person ?? undefined,
    contact: entry.contact ?? undefined,
    slackTask: entry.slack_task ?? undefined,
    emailTask: entry.email_task ?? undefined,
  };
}

interface InboxTaskFilterOptions {
  allowArchived?: boolean;
  allowSources?: string[];
  allowStatuses?: InboxTaskStatus[];
  allowEisens?: Eisen[];
  allowDifficulties?: Difficulty[];
  includeIfNoActionableDate?: boolean;
  actionableDateStart?: DateTime;
  actionableDateEnd?: DateTime;
  includeIfNoDueDate?: boolean;
  dueDateStart?: DateTime;
  dueDateEnd?: DateTime;
  allowPeriodsIfHabit?: RecurringTaskPeriod[];
  allowPeriodsIfChore?: RecurringTaskPeriod[];
  allowPeriodsForRecurringTasks?: RecurringTaskPeriod[];
}

export function filterInboxTasksForDisplay(
  inboxTasks: Array<InboxTask>,
  entriesByRefId: { [key: string]: InboxTaskParent },
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState },
  options: InboxTaskFilterOptions,
): Array<InboxTask> {
  return inboxTasks.filter((inboxTask) => {
    if (!options.allowArchived && inboxTask.archived) {
      return false;
    }

    if (options.allowSources !== undefined) {
      const pln = parentLinkNamespaceFromEntityLinkWire(inboxTask.owner);
      if (!options.allowSources.includes(pln)) {
        return false;
      }
    }

    if (options.allowStatuses !== undefined) {
      if (inboxTask.ref_id in optimisticUpdates) {
        if (
          !options.allowStatuses.includes(
            optimisticUpdates[inboxTask.ref_id].status,
          )
        ) {
          return false;
        }
      } else if (!options.allowStatuses.includes(inboxTask.status)) {
        return false;
      }
    }

    if (options.allowEisens !== undefined) {
      if (
        inboxTask.ref_id in optimisticUpdates &&
        optimisticUpdates[inboxTask.ref_id].eisen !== undefined
      ) {
        if (
          !options.allowEisens.includes(
            optimisticUpdates[inboxTask.ref_id].eisen as Eisen,
          )
        ) {
          return false;
        }
      } else if (!options.allowEisens.includes(inboxTask.eisen)) {
        return false;
      }
    }

    if (options.allowDifficulties !== undefined) {
      if (inboxTask.difficulty !== undefined && inboxTask.difficulty !== null) {
        if (!options.allowDifficulties.includes(inboxTask.difficulty)) {
          return false;
        }
      }
    }

    if (!options.includeIfNoActionableDate && !inboxTask.actionable_date) {
      return false;
    }

    if (options.actionableDateStart !== undefined) {
      if (
        inboxTask.actionable_date &&
        aDateToDate(inboxTask.actionable_date) < options.actionableDateStart
      ) {
        return false;
      }
    }

    if (options.actionableDateEnd !== undefined) {
      if (
        inboxTask.actionable_date &&
        aDateToDate(inboxTask.actionable_date) > options.actionableDateEnd
      ) {
        return false;
      }
    }

    if (!options.includeIfNoDueDate && !inboxTask.due_date) {
      return false;
    }

    if (options.dueDateStart !== undefined) {
      if (
        inboxTask.due_date &&
        aDateToDate(inboxTask.due_date) < options.dueDateStart
      ) {
        return false;
      }
    }

    if (options.dueDateEnd !== undefined) {
      if (
        inboxTask.due_date &&
        aDateToDate(inboxTask.due_date) > options.dueDateEnd
      ) {
        return false;
      }
    }

    if (options.allowPeriodsIfHabit) {
      const entry = entriesByRefId[inboxTask.ref_id];
      const habit = entry.habit as Habit;
      if (!options.allowPeriodsIfHabit.includes(habit.gen_params.period)) {
        return false;
      }
    }

    if (options.allowPeriodsIfChore) {
      const entry = entriesByRefId[inboxTask.ref_id];
      const chore = entry.chore as Chore;
      if (!options.allowPeriodsIfChore.includes(chore.gen_params.period)) {
        return false;
      }
    }

    if (options.allowPeriodsForRecurringTasks) {
      const inferredPeriod = inferPeriodForRecurringTask(inboxTask);
      if (!options.allowPeriodsForRecurringTasks.includes(inferredPeriod)) {
        return false;
      }
    }

    return true;
  });
}

interface InboxTaskSortOptions {
  dueDateAscending?: boolean;
}

export function sortInboxTasksNaturally(
  inboxTasks: Array<InboxTask>,
  options?: InboxTaskSortOptions,
): Array<InboxTask> {
  let cleanOptions: InboxTaskSortOptions = {
    dueDateAscending: true,
  };
  if (options !== undefined) {
    cleanOptions = options;
  }

  return [...inboxTasks].sort((i1, i2) => {
    if (i2.archived && !i1.archived) {
      return -1;
    }

    if (i1.archived && !i2.archived) {
      return 1;
    }

    return (
      (cleanOptions.dueDateAscending ? 1 : -1) *
        compareADate(i1.due_date, i2.due_date) ||
      compareIsKey(i1.is_key, i2.is_key) ||
      -1 * compareEisen(i1.eisen, i2.eisen) ||
      -1 * compareDifficulty(i1.difficulty, i2.difficulty)
    );
  });
}

export function sortInboxTasksByEisenAndDifficulty(
  inboxTasks: Array<InboxTask>,
  options?: InboxTaskSortOptions,
): Array<InboxTask> {
  let cleanOptions: InboxTaskSortOptions = {
    dueDateAscending: true,
  };
  if (options !== undefined) {
    cleanOptions = options;
  }

  return [...inboxTasks].sort((i1, i2) => {
    return (
      compareIsKey(i1.is_key, i2.is_key) ||
      -1 * compareEisen(i1.eisen, i2.eisen) ||
      -1 * compareDifficulty(i1.difficulty, i2.difficulty) ||
      (cleanOptions.dueDateAscending ? 1 : -1) *
        compareADate(i1.due_date, i2.due_date)
    );
  });
}

export function isInboxTaskCoreFieldEditable(source: string): boolean {
  return (
    source === TODO_TASK ||
    source === PROJECT ||
    source === SLACK_TASK ||
    source === EMAIL_TASK
  );
}

export function canInboxTaskBeInStatus(
  _inboxTasks: InboxTask,
  _status: InboxTaskStatus,
): boolean {
  return true;
}

export function doesInboxTaskAllowChangingProject(source: string): boolean {
  return source === TODO_TASK || source === PROJECT;
}

function inferPeriodForRecurringTask(
  inboxTask: InboxTask,
): RecurringTaskPeriod {
  const timeline = inboxTask.recurring_timeline!;
  const parts = timeline.split(",");
  if (parts.length === 5) {
    return RecurringTaskPeriod.DAILY;
  } else if (parts.length === 4) {
    return RecurringTaskPeriod.WEEKLY;
  } else if (parts.length === 3) {
    return RecurringTaskPeriod.MONTHLY;
  } else if (parts.length === 2) {
    return RecurringTaskPeriod.QUARTERLY;
  } else if (parts.length === 1) {
    return RecurringTaskPeriod.YEARLY;
  } else {
    throw new Error(`Invalid timeline: ${timeline}`);
  }
}

export function inferDurationMinsFromInboxTask(inboxTask: InboxTask): number {
  switch (inboxTask.difficulty) {
    case Difficulty.EASY:
      return 15;
    case Difficulty.MEDIUM:
      return 30;
    case Difficulty.HARD:
      return 60;
  }
}
