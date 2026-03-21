import { NoteNamespace } from "@jupiter/webapi-client";

export function noteNamespaceName(namespace: NoteNamespace): string {
  switch (namespace) {
    case NoteNamespace.TODO_TASK:
      return "Todo Task";
    case NoteNamespace.WORKING_MEM:
      return "Working Mem";
    case NoteNamespace.TIME_PLAN:
      return "Time Plan";
    case NoteNamespace.SCHEDULE_STREAM:
      return "Schedule Stream";
    case NoteNamespace.SCHEDULE_EXPORT:
      return "Schedule Export";
    case NoteNamespace.SCHEDULE_EVENT_IN_DAY:
      return "Schedule Event In Day";
    case NoteNamespace.SCHEDULE_EVENT_FULL_DAYS:
      return "Schedule Event Full Days";
    case NoteNamespace.HABIT:
      return "Habit";
    case NoteNamespace.CHORE:
      return "Chore";
    case NoteNamespace.BIG_PLAN:
      return "Big Plan";
    case NoteNamespace.DOC:
      return "Doc";
    case NoteNamespace.JOURNAL:
      return "Journal";
    case NoteNamespace.VACATION:
      return "Vacation";
    case NoteNamespace.ASPECT:
      return "Aspect";
    case NoteNamespace.CHAPTER:
      return "Chapter";
    case NoteNamespace.GOAL:
      return "Goal";
    case NoteNamespace.MILESTONE:
      return "Milestone";
    case NoteNamespace.VISION:
      return "Vision";
    case NoteNamespace.SMART_LIST:
      return "Smart List";
    case NoteNamespace.SMART_LIST_ITEM:
      return "Smart List Item";
    case NoteNamespace.METRIC:
      return "Metric";
    case NoteNamespace.METRIC_ENTRY:
      return "Metric Entry";
    case NoteNamespace.PERSON:
      return "Person";
    case NoteNamespace.OCCASION:
      return "Occasion";
  }
}
