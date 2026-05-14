import {
  compareIsKey
} from "/build/_shared/chunk-DNXYZ7BB.js";
import {
  compareDifficulty,
  compareEisen
} from "/build/_shared/chunk-NLPUBZ3T.js";
import {
  aDateToDate,
  compareADate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  BIG_PLAN,
  EMAIL_TASK,
  SLACK_TASK,
  TODO_TASK,
  parentLinkNamespaceFromEntityLinkWire
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/inbox_tasks/root.ts
var import_webapi_client = __toESM(require_dist(), 1);
function inboxTaskFindEntryToParent(entry) {
  return {
    bigPlan: entry.big_plan ?? void 0,
    todoTask: entry.todo_task ?? void 0,
    habit: entry.habit ?? void 0,
    chore: entry.chore ?? void 0,
    metric: entry.metric ?? void 0,
    person: entry.person ?? void 0,
    contact: entry.contact ?? void 0,
    slackTask: entry.slack_task ?? void 0,
    emailTask: entry.email_task ?? void 0
  };
}
function filterInboxTasksForDisplay(inboxTasks, entriesByRefId, optimisticUpdates, options) {
  return inboxTasks.filter((inboxTask) => {
    if (!options.allowArchived && inboxTask.archived) {
      return false;
    }
    if (options.allowSources !== void 0) {
      const pln = parentLinkNamespaceFromEntityLinkWire(inboxTask.owner);
      if (!options.allowSources.includes(pln)) {
        return false;
      }
    }
    if (options.allowStatuses !== void 0) {
      if (inboxTask.ref_id in optimisticUpdates) {
        if (!options.allowStatuses.includes(
          optimisticUpdates[inboxTask.ref_id].status
        )) {
          return false;
        }
      } else if (!options.allowStatuses.includes(inboxTask.status)) {
        return false;
      }
    }
    if (options.allowEisens !== void 0) {
      if (inboxTask.ref_id in optimisticUpdates && optimisticUpdates[inboxTask.ref_id].eisen !== void 0) {
        if (!options.allowEisens.includes(
          optimisticUpdates[inboxTask.ref_id].eisen
        )) {
          return false;
        }
      } else if (!options.allowEisens.includes(inboxTask.eisen)) {
        return false;
      }
    }
    if (options.allowDifficulties !== void 0) {
      if (inboxTask.difficulty !== void 0 && inboxTask.difficulty !== null) {
        if (!options.allowDifficulties.includes(inboxTask.difficulty)) {
          return false;
        }
      }
    }
    if (!options.includeIfNoActionableDate && !inboxTask.actionable_date) {
      return false;
    }
    if (options.actionableDateStart !== void 0) {
      if (inboxTask.actionable_date && aDateToDate(inboxTask.actionable_date) < options.actionableDateStart) {
        return false;
      }
    }
    if (options.actionableDateEnd !== void 0) {
      if (inboxTask.actionable_date && aDateToDate(inboxTask.actionable_date) > options.actionableDateEnd) {
        return false;
      }
    }
    if (!options.includeIfNoDueDate && !inboxTask.due_date) {
      return false;
    }
    if (options.dueDateStart !== void 0) {
      if (inboxTask.due_date && aDateToDate(inboxTask.due_date) < options.dueDateStart) {
        return false;
      }
    }
    if (options.dueDateEnd !== void 0) {
      if (inboxTask.due_date && aDateToDate(inboxTask.due_date) > options.dueDateEnd) {
        return false;
      }
    }
    if (options.allowPeriodsIfHabit) {
      const entry = entriesByRefId[inboxTask.ref_id];
      const habit = entry.habit;
      if (!options.allowPeriodsIfHabit.includes(habit.gen_params.period)) {
        return false;
      }
    }
    if (options.allowPeriodsIfChore) {
      const entry = entriesByRefId[inboxTask.ref_id];
      const chore = entry.chore;
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
function sortInboxTasksNaturally(inboxTasks, options) {
  let cleanOptions = {
    dueDateAscending: true
  };
  if (options !== void 0) {
    cleanOptions = options;
  }
  return [...inboxTasks].sort((i1, i2) => {
    if (i2.archived && !i1.archived) {
      return -1;
    }
    if (i1.archived && !i2.archived) {
      return 1;
    }
    return (cleanOptions.dueDateAscending ? 1 : -1) * compareADate(i1.due_date, i2.due_date) || compareIsKey(i1.is_key, i2.is_key) || -1 * compareEisen(i1.eisen, i2.eisen) || -1 * compareDifficulty(i1.difficulty, i2.difficulty);
  });
}
function sortInboxTasksByEisenAndDifficulty(inboxTasks, options) {
  let cleanOptions = {
    dueDateAscending: true
  };
  if (options !== void 0) {
    cleanOptions = options;
  }
  return [...inboxTasks].sort((i1, i2) => {
    return compareIsKey(i1.is_key, i2.is_key) || -1 * compareEisen(i1.eisen, i2.eisen) || -1 * compareDifficulty(i1.difficulty, i2.difficulty) || (cleanOptions.dueDateAscending ? 1 : -1) * compareADate(i1.due_date, i2.due_date);
  });
}
function isInboxTaskCoreFieldEditable(source) {
  return source === TODO_TASK || source === BIG_PLAN || source === SLACK_TASK || source === EMAIL_TASK;
}
function canInboxTaskBeInStatus(_inboxTasks, _status) {
  return true;
}
function inferPeriodForRecurringTask(inboxTask) {
  const timeline = inboxTask.recurring_timeline;
  const parts = timeline.split(",");
  if (parts.length === 5) {
    return import_webapi_client.RecurringTaskPeriod.DAILY;
  } else if (parts.length === 4) {
    return import_webapi_client.RecurringTaskPeriod.WEEKLY;
  } else if (parts.length === 3) {
    return import_webapi_client.RecurringTaskPeriod.MONTHLY;
  } else if (parts.length === 2) {
    return import_webapi_client.RecurringTaskPeriod.QUARTERLY;
  } else if (parts.length === 1) {
    return import_webapi_client.RecurringTaskPeriod.YEARLY;
  } else {
    throw new Error(`Invalid timeline: ${timeline}`);
  }
}
function inferDurationMinsFromInboxTask(inboxTask) {
  switch (inboxTask.difficulty) {
    case import_webapi_client.Difficulty.EASY:
      return 15;
    case import_webapi_client.Difficulty.MEDIUM:
      return 30;
    case import_webapi_client.Difficulty.HARD:
      return 60;
  }
}

export {
  inboxTaskFindEntryToParent,
  filterInboxTasksForDisplay,
  sortInboxTasksNaturally,
  sortInboxTasksByEisenAndDifficulty,
  isInboxTaskCoreFieldEditable,
  canInboxTaskBeInStatus,
  inferDurationMinsFromInboxTask
};
//# sourceMappingURL=/build/_shared/chunk-RTB3GZDR.js.map
