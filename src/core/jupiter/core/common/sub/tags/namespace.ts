import { TagNamespace } from "@jupiter/webapi-client";

export function tagNamespaceName(namespace: TagNamespace): string {
  switch (namespace) {
    case TagNamespace.INBOX_TASK:
      return "Inbox Task";
    case TagNamespace.TIME_PLAN:
      return "Time Plan";
    case TagNamespace.SCHEDULE_STREAM:
      return "Schedule Stream";
    case TagNamespace.SCHEDULE_EXPORT:
      return "Schedule Export";
    case TagNamespace.SCHEDULE_EVENT_IN_DAY:
      return "Schedule Event In Day";
    case TagNamespace.SCHEDULE_EVENT_FULL_DAYS_BLOCK:
      return "Schedule Event Full Days";
    case TagNamespace.HABIT:
      return "Habit";
    case TagNamespace.CHORE:
      return "Chore";
    case TagNamespace.BIG_PLAN:
      return "Big Plan";
    case TagNamespace.DOC:
      return "Doc";
    case TagNamespace.JOURNAL:
      return "Journal";
    case TagNamespace.VACATION:
      return "Vacation";
    case TagNamespace.ASPECT:
      return "Aspect";
    case TagNamespace.CHAPTER:
      return "Chapter";
    case TagNamespace.GOAL:
      return "Goal";
    case TagNamespace.MILESTONE:
      return "Milestone";
    case TagNamespace.SMART_LIST:
      return "Smart List";
    case TagNamespace.SMART_LIST_ITEM:
      return "Smart List Item";
    case TagNamespace.METRIC:
      return "Metric";
    case TagNamespace.METRIC_ENTRY:
      return "Metric Entry";
    case TagNamespace.PERSON:
      return "Person";
    case TagNamespace.OCCASION:
      return "Occasion";
  }
}
