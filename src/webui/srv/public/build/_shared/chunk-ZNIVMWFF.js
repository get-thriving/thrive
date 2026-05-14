import {
  BIG_PLAN,
  CHORE,
  EMAIL_TASK,
  HABIT,
  JOURNAL,
  LIFE_PLAN_EVAL,
  METRIC,
  PERSON_CATCH_UP,
  PERSON_OCCASION,
  SLACK_TASK,
  TIME_PLAN,
  TODO_TASK,
  WORKING_MEM_CLEANUP
} from "/build/_shared/chunk-ZFIM7NDI.js";

// ../core/jupiter/core/common/sub/inbox_tasks/namespace.ts
function inboxTaskNamespaceName(namespace) {
  switch (namespace) {
    case TODO_TASK:
      return "To-do";
    case WORKING_MEM_CLEANUP:
      return "Working Mem Cleanup";
    case TIME_PLAN:
      return "Time Plan";
    case HABIT:
      return "Habit";
    case CHORE:
      return "Chore";
    case BIG_PLAN:
      return "Big Plan";
    case JOURNAL:
      return "Journal";
    case METRIC:
      return "Metric";
    case PERSON_CATCH_UP:
      return "Person Catch Up";
    case PERSON_OCCASION:
      return "Person Occasion";
    case SLACK_TASK:
      return "Slack Task";
    case EMAIL_TASK:
      return "Email Task";
    case LIFE_PLAN_EVAL:
      return "Life Plan Eval";
    default:
      return String(namespace);
  }
}

export {
  inboxTaskNamespaceName
};
//# sourceMappingURL=/build/_shared/chunk-ZNIVMWFF.js.map
