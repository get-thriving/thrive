import { InboxTaskNamespace } from "@jupiter/webapi-client";

export function allowUserChanges(namespace: InboxTaskNamespace): boolean {
  // Keep synced with python:namespace.py
  return (
    namespace === InboxTaskNamespace.TODO_TASK ||
    namespace === InboxTaskNamespace.BIG_PLAN ||
    namespace === InboxTaskNamespace.SLACK_TASK ||
    namespace === InboxTaskNamespace.EMAIL_TASK
  );
}

export function inboxTaskNamespaceName(namespace: InboxTaskNamespace): string {
  switch (namespace) {
    case InboxTaskNamespace.TODO_TASK:
      return "User";
    case InboxTaskNamespace.WORKING_MEM_CLEANUP:
      return "Working Mem Cleanup";
    case InboxTaskNamespace.TIME_PLAN:
      return "Time Plan";
    case InboxTaskNamespace.HABIT:
      return "Habit";
    case InboxTaskNamespace.CHORE:
      return "Chore";
    case InboxTaskNamespace.BIG_PLAN:
      return "Big Plan";
    case InboxTaskNamespace.JOURNAL:
      return "Journal";
    case InboxTaskNamespace.METRIC:
      return "Metric";
    case InboxTaskNamespace.PERSON_CATCH_UP:
      return "Catch Up";
    case InboxTaskNamespace.PERSON_OCCASION:
      return "Occasion";
    case InboxTaskNamespace.SLACK_TASK:
      return "Slack";
    case InboxTaskNamespace.EMAIL_TASK:
      return "Email";
    case InboxTaskNamespace.LIFE_PLAN_EVAL:
      return "Life Plan Eval";
    default: {
      const _x: never = namespace;
      return _x;
    }
  }
}
