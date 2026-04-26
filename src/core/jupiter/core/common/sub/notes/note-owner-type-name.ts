import { NamedEntityTag } from "@jupiter/webapi-client";

/** Human-readable label for a note owner entity tag. */
export function noteOwnerEntityTagName(tag: NamedEntityTag): string {
  switch (tag) {
    case NamedEntityTag.TODO_TASK:
      return "Todo Task";
    case NamedEntityTag.WORKING_MEM:
      return "Working Mem";
    case NamedEntityTag.TIME_PLAN:
      return "Time Plan";
    case NamedEntityTag.SCHEDULE_STREAM:
      return "Schedule Stream";
    case NamedEntityTag.SCHEDULE_EXPORT:
      return "Schedule Export";
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return "Schedule Event In Day";
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return "Schedule Event Full Days";
    case NamedEntityTag.HABIT:
      return "Habit";
    case NamedEntityTag.CHORE:
      return "Chore";
    case NamedEntityTag.BIG_PLAN:
      return "Big Plan";
    case NamedEntityTag.DOC:
      return "Doc";
    case NamedEntityTag.JOURNAL:
      return "Journal";
    case NamedEntityTag.VACATION:
      return "Vacation";
    case NamedEntityTag.ASPECT:
      return "Aspect";
    case NamedEntityTag.CHAPTER:
      return "Chapter";
    case NamedEntityTag.GOAL:
      return "Goal";
    case NamedEntityTag.MILESTONE:
      return "Milestone";
    case NamedEntityTag.VISION:
      return "Vision";
    case NamedEntityTag.SMART_LIST:
      return "Smart List";
    case NamedEntityTag.SMART_LIST_ITEM:
      return "Smart List Item";
    case NamedEntityTag.METRIC:
      return "Metric";
    case NamedEntityTag.METRIC_ENTRY:
      return "Metric Entry";
    case NamedEntityTag.PERSON:
      return "Person";
    case NamedEntityTag.OCCASION:
      return "Occasion";
    case NamedEntityTag.TIME_PLAN_ACTIVITY:
      return "Time Plan Activity";
    default:
      return tag;
  }
}
