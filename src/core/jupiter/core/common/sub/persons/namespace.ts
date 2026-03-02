import { PersonNamespace } from "@jupiter/webapi-client";

export function personNamespaceName(namespace: PersonNamespace): string {
  switch (namespace) {
    case PersonNamespace.PRM:
      return "PRM";
    case PersonNamespace.INBOX_TASK:
      return "Inbox Task";
    case PersonNamespace.BIG_PLAN:
      return "Big Plan";
    case PersonNamespace.SCHEDULE:
      return "Schedule";
    case PersonNamespace.HABIT:
      return "Habit";
    case PersonNamespace.CHORE:
      return "Chore";
    case PersonNamespace.SMART_LIST_ITEM:
      return "Smart List Item";
    case PersonNamespace.METRIC_ENTRY:
      return "Metric Entry";
  }
}
