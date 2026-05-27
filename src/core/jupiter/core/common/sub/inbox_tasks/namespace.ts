import {
  BIG_PLAN,
  EMAIL_TASK,
  JOURNAL,
  SLACK_TASK,
  TODO_TASK,
  WORKING_MEM_CLEANUP,
  TIME_PLAN,
  HABIT,
  CHORE,
  METRIC,
  PERSON_CATCH_UP,
  PERSON_OCCASION,
  LIFE_PLAN_EVAL,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";

export function allowUserChanges(namespace: string): boolean {
  return (
    namespace === TODO_TASK ||
    namespace === BIG_PLAN ||
    namespace === SLACK_TASK ||
    namespace === EMAIL_TASK
  );
}

export function inboxTaskNamespaceName(namespace: string): string {
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
